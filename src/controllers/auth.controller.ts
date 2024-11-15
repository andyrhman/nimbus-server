import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from '../validation/dto/register.dto';
import { formatValidationErrors } from '../utility/validation.utility';
import { UpdateInfoDTO } from '../validation/dto/update-info.dto';
import { myPrisma } from '../config/db.config';
import { UpdatePasswordDTO } from '../validation/dto/update-password.dto';
import { asyncError } from '../middleware/global-error.middleware';
import { bucket, upload } from '../config/storage.config';
import { generateRandom6DigitNumber } from '../utility/sixdigitnumber.utility';
import { TokenService } from '../service/token.service';
import jwt from 'jsonwebtoken';
import transporter from '../config/transporter.config';
import * as fs from "fs";
import * as handlebars from "handlebars";
import * as argon2 from 'argon2';

export const Register: any = async (req: Request, res: Response) => {
    const body = req.body;
    const input = plainToClass(RegisterDto, body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    const checkEmail = await myPrisma.user.findUnique({
        where: { email: body.email.toLowerCase() }
    });

    if (checkEmail) {
        return res.status(409).send({
            message: 'Email already exists.'
        });
    }

    const checkUsername = await myPrisma.user.findUnique({
        where: { username: body.username.toLowerCase() }
    });

    if (checkUsername) {
        return res.status(409).send({
            message: 'Username already exists.'
        });
    }

    const { password, ...user } = await myPrisma.user.create({
        data: {
            nama: body.nama,
            username: body.username.toLowerCase(),
            email: body.email.toLowerCase(),
            password: await argon2.hash(body.password)
        }
    });

    res.send(user);
};

export const Login: any = async (req: Request, res: Response) => {
    const body = req.body;

    const user = await myPrisma.user.findUnique({ where: { email: body.email.toLowerCase() } });

    if (!user) {
        return res.status(404).send({
            message: "Invalid Email."
        });
    }

    if (!body.password) {
        return res.status(400).send({
            message: "Invalid credentials!"
        });
    } else if (!await argon2.verify(user.password, body.password)) {
        return res.status(400).send({
            message: "Invalid credentials!"
        });
    }

    const rememberMe = body.rememberMe;
    const maxAge = rememberMe ? 365 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1 year or 1 day

    const adminLogin = req.path === "/api/admin/login";

    if (user.is_user && adminLogin) {
        return res.status(403).send({ message: "Unauthorized" });
    }

    const { sign } = jwt;
    const token = sign(
        {
            id: user.id,
            scope: adminLogin ? "admin" : "user",
        },
        process.env.JWT_SECRET_ACCESS
    );

    res.cookie('user_session', token, {
        httpOnly: true,
        maxAge: maxAge,
    });

    return res.send({
        message: "Successfully Logged In!"
    });
};

export const AuthenticatedUser: any = async (req: Request, res: Response) => {
    if (!req["user"]) {
        return res.status(401).send({ message: "Unauthenticated" });
    }
    const { password, ...user } = req["user"];

    res.send(user);
};

export const Logout: any = async (req: Request, res: Response) => {
    res.cookie('user_session', '', {
        maxAge: 0,
    });
    res.send({
        message: "Success"
    });
};

export const UpdateInfo: any = [
    upload.single('profile_pic'),
    async (req: Request, res: Response) => {
        const user = req["user"];
        const body = req.body;

        const input = plainToClass(UpdateInfoDTO, body);
        const validationErrors = await validate(input);

        if (validationErrors.length > 0) {
            return res.status(400).json(formatValidationErrors(validationErrors));
        }

        const existingUser = await myPrisma.user.findUnique({ where: { id: user.id } });

        if (req.body.nama) {
            existingUser.nama = req.body.nama;
        }

        if (req.body.email && req.body.email !== existingUser.email) {
            const existingUserByEmail = await myPrisma.user.findUnique({ where: { email: req.body.email } });
            if (existingUserByEmail) {
                return res.status(409).send({ message: "Email already exists" });
            }
            existingUser.email = req.body.email;
        }

        if (req.body.username && req.body.username !== existingUser.username) {
            const existingUserByUsername = await myPrisma.user.findUnique({ where: { username: req.body.username } });
            if (existingUserByUsername) {
                return res.status(409).send({ message: "Username already exists" });
            }
            existingUser.username = req.body.username;
        }

        // Handle profile picture upload if it exists in the request
        if (req.file) {
            const fileName = `profile_pics/${user.id}_profile_pic_${Date.now()}.jpg`; // Unique filename based on user ID

            // Delete existing profile picture if it's not the default image
            if (existingUser.profile_pic && !existingUser.profile_pic.includes("user.png")) {
                const oldFile = bucket.file(existingUser.profile_pic.split(`https://storage.googleapis.com/${bucket.name}/`)[1]);
                await oldFile.delete().catch(() => {
                    console.log("Old profile picture deletion failed, but continuing with the upload.");
                });
            }

            const blob = bucket.file(fileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: req.file.mimetype,
            });

            blobStream.on('error', (err) => {
                console.error(err);
                return res.status(500).json({ error: 'Failed to upload image' });
            });

            blobStream.on('finish', async () => {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                existingUser.profile_pic = publicUrl;

                // Update user info in the database
                const updated = await myPrisma.user.update({
                    where: { id: user.id },
                    data: { ...existingUser },
                });

                const { password, ...data } = updated;
                res.send(data);
            });

            blobStream.end(req.file.buffer);
        } else {
            // If no image, just update the user without profile_pic change
            const updated = await myPrisma.user.update({
                where: { id: user.id },
                data: { ...existingUser },
            });

            const { password, ...data } = updated;
            res.send(data);
        }
    }
];

export const SendPasswordToken: any = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body.email) {
        return res.status(400).send({ message: "Provide your email address" });
    }

    const user = await myPrisma.user.findFirst({ where: { email: body.email } });

    if (!user) {
        return res.status(400).send({ message: "Email not found" });
    }

    const token = generateRandom6DigitNumber();

    const tokenExpiresAt = Date.now() + 30 * 60 * 1000;

    await myPrisma.token.create({
        data: {
            token,
            email: user.email,
            user_id: user.id,
            expiresAt: tokenExpiresAt
        }
    });

    const name = user.nama;

    const source = fs
        .readFileSync("src/templates/password-reset.hbs", "utf-8")
        .toString();

    const template = handlebars.compile(source);

    const replacements = {
        token,
        name
    };
    const htmlToSend = template(replacements);

    const options = {
        from: "from@mail.com",
        to: user.email,
        subject: "Verify your email",
        html: htmlToSend,
    };

    await transporter.sendMail(options);

    res.status(200).send({ message: "Email has successfully sent" });

};

export const UpdatePassword: any = async (req: Request, res: Response) => {
    const body = req.body;
    const input = plainToClass(UpdatePasswordDTO, body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    const tokenRepository = new TokenService(myPrisma);

    const userToken = await tokenRepository.findByTokenExpiresAt(body.token);

    if (!userToken) {
        return res.status(400).send({ message: "Invalid Token" });
    }

    if (userToken.used) {
        return res
            .status(400)
            .send({ message: "Token has already been used" });
    }

    const user = await myPrisma.user.findFirst({
        where: { email: userToken.email, id: userToken.user_id },
    });

    if (!user) {
        return res.status(400).send({ message: "User not found" });
    }

    if (user.email !== userToken.email && user.id !== userToken.user_id) {
        return res.status(400).send({ message: "Invalid Verify ID or email" });
    }

    await myPrisma.token.update({ where: { id: userToken.id }, data: { used: true } });
    await myPrisma.user.update({
        where: { id: user.id },
        data: { password: await argon2.hash(body.password) }
    });

    res.send({ message: "Password Successfully Updated" });
};
