import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utility/validation.utility';
import { myPrisma } from '../config/db.config';
import axios from 'axios';

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

    const tempatWisata = await myPrisma.tempatWisata.findMany({
        where: {
            provinsi_id: body.provinsi_id,
            categoryWisata_id: body.categoryWisata_id
        }
    });

    if (!tempatWisata.length) {
        return res.status(404).send({ message: "No matching TempatWisata found!" });
    }

    const randomTempatWisata = tempatWisata[Math.floor(Math.random() * tempatWisata.length)];

    const djangoResponse = await axios.post("recommend-destinations", {
        selected_place: randomTempatWisata.nama,
        num_recommendations: 5,
    });

    if (djangoResponse.status !== 200 || !djangoResponse.data) {
        return res.status(500).json({ error: "Failed to get recommendations from Django API." });
    }

    const recommendations = djangoResponse.data;

    // Match recommendations with database to find IDs
    const recommendationsWithId: any = await Promise.all(
        recommendations.map(async (recommendation: any) => {
            const matchedTempatWisata = await myPrisma.tempatWisata.findFirst({
                where: { nama: recommendation.nama_destinasi },
                select: { id: true },
            });

            return {
                ...recommendation,
                id: matchedTempatWisata?.id
            };
        })
    );

    const validRecommendations = recommendationsWithId.filter(r => r.id);

    if (!validRecommendations.length) {
        return res.status(404).send({ message: "No valid recommendations found in the database." });
    }

    const rencana = await myPrisma.perencanaanOtomatis.create({
        data: {
            nama: body.nama,
            budget: body.budget,
            user_id: user.id,
            provinsi_id: body.provinsi_id,
            categoryWisata_id: body.categoryWisata_id
        }
    });

    const checkRencanaOtomatisUser = await myPrisma.perencanaanOtomatis.findFirst({
        where: {
            id: rencana.id,
            user_id: user.id
        }
    });

    if (!checkRencanaOtomatisUser) return res.status(403).send({ message: "Not Allowed!" });

    let currentDate = new Date(`${body.tanggal_perencanaan}T00:00:00.000Z`);

    const randomPlaces: any[] = [];

    for (let i = 0; i < 4; i++) {
        const recommendation = validRecommendations[i % validRecommendations.length];

        await myPrisma.tempatWisataPerencanaanOtomatis.create({
            data: {
                tanggal_perencanaan: currentDate,
                perencanaanOtomatis_id: rencana.id,
                tempatWisata_id: recommendation.id
            }
        });

        randomPlaces.push({
            tanggal_perencanaan: currentDate,
            tempatWisata: recommendation
        });

        // Increment the date by 2 days for the next iteration
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 2);
    }

    res.send({ rencana, randomPlaces });
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
