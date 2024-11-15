import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utility/validation.utility';
import { myPrisma } from '../config/db.config';

export const GetAllProvinsi: any = async (req: Request, res: Response) => {
    res.send(await myPrisma.provinsi.findMany())
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

};

export const UpdateProvinsi: any = async (req: Request, res: Response) => {

};

export const DeleteProvinsi: any = async (req: Request, res: Response) => {

};
