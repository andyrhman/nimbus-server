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

});

export const UpdateProvinsi: any = asyncError(async (req: Request, res: Response) => {

});

export const DeleteProvinsi: any = asyncError(async (req: Request, res: Response) => {

});
