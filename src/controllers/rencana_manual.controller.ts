import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utility/validation.utility';
import { myPrisma } from '../config/db.config';

export const GetRencanaUserManual: any = async (req: Request, res: Response) => {
    const user = req["user"];
    const rencanaku = await myPrisma.perencanaanManual.findMany({
        where: { user_id: user.id },
        include: {
            provinsi: true,
            categoryWisata: true
        }
    });
    if (!rencanaku) return res.status(403).send({ message: "Not Allowed!" });
    res.json(rencanaku);
};

export const GetRencanaUserDestinasiManual: any = async (req: Request, res: Response) => {
    const user = req["user"];
    const rencanaku = await myPrisma.perencanaanManual.findMany({
        where: { id: Number(req.params.id), user_id: user.id },
        include: {
            tw_perencanaan_manual: {
                include: {
                    tempatWisata:
                    {
                        include: {
                            provinsi: true,
                            categoryWisata: true
                        }
                    }
                }
            }
        }
    });
    if (!rencanaku) return res.status(403).send({ message: "Not Allowed!" });
    res.json(rencanaku);
};

export const CreateRencanaManual: any = async (req: Request, res: Response) => {
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

export const CreateRencanaTempatWisataManual: any = async (req: Request, res: Response) => {
    const user = req["user"];
    const body = req.body;

    const checkRencanaManualUser = await myPrisma.perencanaanManual.findFirst({
        where: {
            id: body.perencanaanManual_id,
            user_id: user.id
        }
    });

    if (!checkRencanaManualUser) return res.status(403).send({ message: "Not Allowed!" });

    const tempatWisata = await myPrisma.tempatWisataPerencanaanManual.create({
        data: {
            perencanaanManual_id: body.perencanaanManual_id,
            tempatWisata_id: body.tempatWisata_id
        }
    });

    res.send(tempatWisata);
};

export const DeleteRencanaManual: any = async (req: Request, res: Response) => {
    const user = req["user"];

    const perencanaanManual = await myPrisma.perencanaanManual.findFirst({ where: { id: Number(req.params.id), user_id: user.id } });

    if (!perencanaanManual) return res.status(403).send({ message: "Not Allowed!" });

    await myPrisma.perencanaanManual.delete({ where: { id: Number(req.params.id), user_id: user.id } });

    res.status(204).send(null);
};

export const DeleteRencanaTempatWisataManual: any = async (req: Request, res: Response) => {
    const user = req["user"];

    const perencanaanManual = await myPrisma.perencanaanManual.findFirst({ where: { id: Number(req.params.id_rencana_manual), user_id: user.id } });

    if (!perencanaanManual) return res.status(403).send({ message: "Not Allowed!" });

    await myPrisma.tempatWisataPerencanaanManual.delete({ where: { id: Number(req.params.id_tempat_wisata) } });

    res.status(204).send(null);
};
