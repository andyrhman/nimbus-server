import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utility/validation.utility';
import { myPrisma } from '../config/db.config';

export const GetAllCategoryWisata: any = async (req: Request, res: Response) => {
    res.send(await myPrisma.categoryWisata.findMany());
};

export const CreateCategoryWisata: any = async (req: Request, res: Response) => {
    const category_wisata = await myPrisma.categoryWisata.create({
        data: {
            nama: req.body.nama,
            thumbnail: req.body.thumbnail
        }
    });

    res.send(category_wisata);
};

export const GetCategoryWisata: any = async (req: Request, res: Response) => {

};

export const UpdateCategoryWisata: any = async (req: Request, res: Response) => {

};

export const DeleteCategoryWisata: any = async (req: Request, res: Response) => {

};