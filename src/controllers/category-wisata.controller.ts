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
    const category = await myPrisma.categoryWisata.findUnique({
        where: { id: Number(req.params.id) }
    });
    res.status(200).send(category);
};

export const UpdateCategoryWisata: any = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama, thumbnail } = req.body;

    const updatedCategory = await myPrisma.categoryWisata.update({
        where: { id: Number(id) },
        data: {
            nama,
            thumbnail
        }
    });

    res.send(updatedCategory);
};

export const DeleteCategoryWisata: any = async (req: Request, res: Response) => {
    const { id } = req.params;

    await myPrisma.categoryWisata.delete({
        where: { id: Number(id) }
    });

    res.status(204).send(null);
};