import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utility/validation.utility';
import { myPrisma } from '../config/db.config';
import { asyncError } from '../middleware/global-error.middleware';
import { CreateTempatWisataDTO } from '../validation/dto/create-tw.dto';
import { bucket, upload } from '../config/storage.config';
import { v4 as uuidv4 } from 'uuid';
import { UpdateTempatWisataDTO } from '../validation/dto/update-tw.dto';

export const GetAllTempatWisata = asyncError(async (req: Request, res: Response) => {
    const tempatWisata = await myPrisma.tempatWisata.findMany();
    res.send(tempatWisata);
});

export const GetAllTempatWisataProvinsi = asyncError(async (req: Request, res: Response) => {
    const tempatWisata = await myPrisma.provinsi.findMany({
        where: { nama: req.params.provinsi },
        include: {
            tempatWisata: true
        }
    });
    res.send(tempatWisata);
});

export const GetAllTempatWisataCategory = asyncError(async (req: Request, res: Response) => {
    const tempatWisata = await myPrisma.categoryWisata.findMany({
        where: { nama: req.params.category_wisata },
        include: {
            tempatWisata: true
        }
    });
    res.send(tempatWisata);
});

export const CreateTempatWisata = [
    upload.single('thumbnail'),
    asyncError(async (req: Request, res: Response) => {
        const body = req.body;
        const input = plainToClass(CreateTempatWisataDTO, body);
        const validationErrors = await validate(input);

        if (validationErrors.length > 0) {
            return res.status(400).json(formatValidationErrors(validationErrors));
        }

        let thumbnailUrl = '';
        if (req.file) {
            const fileName = `tempat_wisata_thumbnails/${uuidv4()}_${req.file.originalname}`;
            const blob = bucket.file(fileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: req.file.mimetype,
            });

            await new Promise((resolve, reject) => {
                blobStream.on('error', (err) => {
                    reject(err);
                });

                blobStream.on('finish', () => {
                    thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    resolve(null);
                });

                blobStream.end(req.file.buffer);
            });
        }

        // Create Tempat Wisata record in the database
        const tempatWisata = await myPrisma.tempatWisata.create({
            data: {
                nama: body.nama,
                deskripsi: body.deskripsi,
                thumbnail: thumbnailUrl,
                rating: Number(body.rating),
                provinsi_id: Number(body.provinsi_id),
                categoryWisata_id: Number(body.categoryWisata_id),
            },
        });

        res.send(tempatWisata);
    }),
];

export const GetTempatWisata = asyncError(async (req: Request, res: Response) => {
    res.send(await myPrisma.tempatWisata.findUnique({
        where: {
            id: Number(req.params.id)
        },
        include: {
            provinsi: true,
            categoryWisata: true
        }
    }));
});

export const UpdateTempatWisata = [
    upload.single('thumbnail'),
    asyncError(async (req: Request, res: Response) => {
        const { id } = req.params;
        const body = req.body;
        const input = plainToClass(UpdateTempatWisataDTO, body);
        const validationErrors = await validate(input);

        if (validationErrors.length > 0) {
            return res.status(400).json(formatValidationErrors(validationErrors));
        }

        const existingTempatWisata = await myPrisma.tempatWisata.findUnique({ where: { id: Number(id) } });

        if (!existingTempatWisata) {
            return res.status(404).json({ message: 'Tempat Wisata not found' });
        }

        let thumbnailUrl = existingTempatWisata.thumbnail;

        if (req.file) {
            const fileName = `tempat_wisata_thumbnails/${id}_thumbnail.jpg`;

            if (thumbnailUrl && !thumbnailUrl.includes('default_image.jpg')) {
                const oldFile = bucket.file(thumbnailUrl.split(`https://storage.googleapis.com/${bucket.name}/`)[1]);
                await oldFile.delete().catch(() => {
                    console.log('Old thumbnail deletion failed, but continuing with the upload.');
                });
            }

            const blob = bucket.file(fileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: req.file.mimetype,
            });

            await new Promise((resolve, reject) => {
                blobStream.on('error', (err) => {
                    reject(err);
                });

                blobStream.on('finish', () => {
                    thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    resolve(null);
                });

                blobStream.end(req.file.buffer);
            });
        }

        const updatedTempatWisata = await myPrisma.tempatWisata.update({
            where: { id: Number(id) },
            data: {
                nama: body.nama || existingTempatWisata.nama,
                deskripsi: body.deskripsi || existingTempatWisata.deskripsi,
                thumbnail: thumbnailUrl,
                rating: body.rating || existingTempatWisata.rating,
                provinsi_id: body.provinsi_id || existingTempatWisata.provinsi_id,
                categoryWisata_id: body.categoryWisata_id || existingTempatWisata.categoryWisata_id,
            },
        });

        res.send(updatedTempatWisata);
    }),
];

export const DeleteTempatWisata = asyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existingTempatWisata = await myPrisma.tempatWisata.findUnique({ where: { id: Number(id) } });

    if (!existingTempatWisata) {
        return res.status(404).json({ message: 'Tempat Wisata not found' });
    }

    const thumbnailUrl = existingTempatWisata.thumbnail;

    if (thumbnailUrl && !thumbnailUrl.includes('default_image.jpg')) {
        const filePath = thumbnailUrl.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
        const file = bucket.file(filePath);

        await file.delete().catch((err) => {
            console.log('Failed to delete image from Cloud Storage:', err);
        });
    }

    await myPrisma.tempatWisata.delete({ where: { id: Number(id) } });

    res.status(204).json(null);
});