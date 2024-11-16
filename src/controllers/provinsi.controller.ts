import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utility/validation.utility';
import { myPrisma } from '../config/db.config';

export const GetAllProvinsi: any = async (req: Request, res: Response) => {
    res.send(await myPrisma.provinsi.findMany());
};

export const CreateProvinsi: any = async (req: Request, res: Response) => {
    const provinsi = await myPrisma.provinsi.create({
        data: {
            nama: req.body.nama,
            thumbnail: req.body.thumbnail
        }
    });

    res.send(provinsi);
};

export const GetProvinsi: any = async (req: Request, res: Response) => {
    const provinsi = await myPrisma.provinsi.findUnique({
        where: { id: Number(req.params.id) }
    });
    res.status(200).send(provinsi);
};

export const UpdateProvinsi: any = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama, thumbnail } = req.body;

    const updated = await myPrisma.provinsi.update({
        where: { id: Number(id) },
        data: {
            nama,
            thumbnail
        }
    });

    res.send(updated);
};

export const DeleteProvinsi: any = async (req: Request, res: Response) => {
    const { id } = req.params;

    await myPrisma.provinsi.delete({
        where: { id: Number(id) }
    });

    res.status(204).send(null);
};
