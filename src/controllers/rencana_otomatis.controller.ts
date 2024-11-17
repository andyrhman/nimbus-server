import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utility/validation.utility';
import { myPrisma } from '../config/db.config';

export const GetRencanaUserOtomatis: any = async (req: Request, res: Response) => {
    const user = req["user"];
    const rencanaku = await myPrisma.perencanaanOtomatis.findMany({
        where: { user_id: user.id },
        include: {
            tw_perencanaan_otomatis: {
                include: {
                    tempatWisata: true
                }
            },
            provinsi: true,
            categoryWisata: true
        }
    });
    if (!rencanaku) return res.status(403).send({ message: "Not Allowed!" });
    res.json(rencanaku);
};

export const CreateRencanaOtomatis: any = async (req: Request, res: Response) => {
    const user = req["user"];
    const body = req.body;

    const rencana = await myPrisma.perencanaanOtomatis.create({
        data: {
            nama: body.nama,
            budget: body.budget,
            user_id: user.id,
            provinsi_id: body.provinsi_id,
            categoryWisata_id: body.categoryWisata_id
        }
    });

    // ! Kode ML
    // ? const predict = myModel(rencana);
    /* 
    ?    const tempatWisata = await myPrisma.tempatWisataPerencanaanOtomatis.create({
    ?        data: {
    ?            tanggal_perencanaan: new Date(`${predict.tanggal_perencanaan}T00:00:00.000Z`),
    ?            perencanaanOtomatis_id: predict.perencanaanOtomatis_id,
    ?            tempatWisata_id: predict.tempatWisata_id
    ?        }
    ?    });
    */

    res.send(rencana);
};

// TODO This controller is still questionable wether we delete or not...
export const CreateRencanaTempatWisataOtomatis: any = async (req: Request, res: Response) => {
    const user = req["user"];
    const body = req.body;

    // ! Kode ML
    // ? const fetchRencanaOtomatis = await myPrisma.perencaan

    const checkRencanaOtomatisUser = await myPrisma.perencanaanOtomatis.findFirst({
        where: {
            id: body.perencanaanOtomatis_id,
            user_id: user.id
        }
    });

    if (!checkRencanaOtomatisUser) return res.status(403).send({ message: "Not Allowed!" });

    const tempatWisata = await myPrisma.tempatWisataPerencanaanOtomatis.create({
        data: {
            tanggal_perencanaan: new Date(`${body.tanggal_perencanaan}T00:00:00.000Z`),
            perencanaanOtomatis_id: body.perencanaanOtomatis_id,
            tempatWisata_id: body.tempatWisata_id
        }
    });

    res.send(tempatWisata);
};

export const DeleteRencanaOtomatis: any = async (req: Request, res: Response) => {
    const user = req["user"];

    const perencanaanOtomatis = await myPrisma.perencanaanOtomatis.findFirst({ where: { id: Number(req.params.id), user_id: user.id } });

    if (!perencanaanOtomatis) return res.status(403).send({ message: "Not Allowed!" });

    await myPrisma.perencanaanOtomatis.delete({ where: { id: Number(req.params.id), user_id: user.id } });

    res.status(204).send(null);
};

export const DeleteRencanaTempatWisataOtomatis: any = async (req: Request, res: Response) => {
    const user = req["user"];

    const perencanaanOtomatis = await myPrisma.perencanaanOtomatis.findFirst({ where: { id: Number(req.params.id_rencana_otomatis), user_id: user.id } });

    if (!perencanaanOtomatis) return res.status(403).send({ message: "Not Allowed!" });

    await myPrisma.tempatWisataPerencanaanOtomatis.delete({ where: { id: Number(req.params.id_tempat_wisata) } });

    res.status(204).send(null);
};