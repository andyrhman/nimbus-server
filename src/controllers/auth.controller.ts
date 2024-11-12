import { Request, Response } from 'express';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from '../validation/dto/register.dto';
import { formatValidationErrors } from '../utility/validation.utility';
import { UpdateInfoDTO } from '../validation/dto/update-info.dto';
import { myPrisma } from '../config/db.config';
import { UpdatePasswordDTO } from '../validation/dto/update-password.dto';

export const Register = async (req: Request, res: Response) => {
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

export const Login = async (req: Request, res: Response) => {
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

    const { sign } = jwt;
    const token = sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie('user_session', token, {
        httpOnly: true,
        maxAge: maxAge,
    });

    return res.send({
        message: "Successfully Logged In!"
    });
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
    if (!req["user"]) {
        return res.status(401).send({ message: "Unauthenticated" });
    }
    const { password, ...user } = req["user"];

    res.send(user);
};

export const Logout = async (req: Request, res: Response) => {
    res.cookie('user_session', '', {
        maxAge: 0,
    });
    res.send({
        message: "Success"
    });
};

export const UpdateInfo = async (req: Request, res: Response) => {
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

    const updated = await myPrisma.user.update({
        where: { id: user.id },
        data: { ...existingUser }
    });

    const { password, ...data } = updated;
    res.send(data);
};

export const UpdatePassword = async (req: Request, res: Response) => {
    const user = req["user"];
    const body = req.body;
    const input = plainToClass(UpdatePasswordDTO, body);
    const validationErrors = await validate(input);

    if (validationErrors.length > 0) {
        return res.status(400).json(formatValidationErrors(validationErrors));
    }

    const updated = await myPrisma.user.update({
        where: { id: user.id },
        data: { password: await argon2.hash(req.body.password) }
    });

    const { password, ...data } = updated;

    res.send(data);
};
