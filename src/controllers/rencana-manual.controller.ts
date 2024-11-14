import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utility/validation.utility';
import { myPrisma } from '../config/db.config';
import { asyncError } from '../middleware/global-error.middleware';

export const GetRencanaUser = async (req: Request, res: Response) => {
    const user = req["user"];
    const rencanaku = await myPrisma.perencanaanManual.findMany({
        where: { user_id: user.id }
    });

    res.json(rencanaku);
};

export const CreateRencanaManual = async (req: Request, res: Response) => {
    const user = req["user"];
    const body = req.body;

    const rencana = await myPrisma.perencanaanManual.create({
        data: {
            nama: body.nama,
            budget: body.budget,
            user_id: user.id
        }
    });

    res.send(rencana);
};

export const CreateRencanaTempatWisata = async (req: Request, res: Response) => {
    const body = req.body;

    const tempatWisata = await myPrisma.tempatWisataPerencanaanManual.create({
        data: {
            tanggal_perencanaan: new Date(`${body.tanggal_perencanaan}T00:00:00.000Z`),
            perencanaanManual_id: body.perencanaanManual_id,
            tempatWisata_id: body.tempatWisata_id
        }
    });

    res.send(tempatWisata);
}; 