import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utility/validation.utility';
import { myPrisma } from '../config/db.config';
import { asyncError } from '../middleware/global-error.middleware';

export const CreateProvinsi: any = asyncError(async (req: Request, res: Response) => {
    const provinsi = await myPrisma.provinsi.create({
        data: {
            nama: req.body.nama,
            thumbnail: req.body.thumbnail
        }
    });

    res.send(provinsi);
});

export const GetProvinsi: any = asyncError(async (req: Request, res: Response) => {
    const category = await myPrisma.categoryWisata.findUnique({
        where: { id: Number(req.params.id) }
    });
    res.status(200).send(category);
});

export const UpdateProvinsi: any = asyncError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama, thumbnail } = req.body;

    const updatedCategory = await myPrisma.categoryWisata.update({
        where: { id: Number(id) },
        data: {
            nama,
            thumbnail
        }
    });

    res.send({ pesan: "Berhasil diupdate", data: updatedCategory });
});

export const DeleteProvinsi: any = asyncError(async (req: Request, res: Response) => {
    const { id } = req.params;

    await myPrisma.categoryWisata.delete({
        where: { id: Number(id) }
    });

    res.send({ pesan: "Berhasil dihapus" });
});