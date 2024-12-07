import { Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { formatValidationErrors } from '../utility/validation.utility';
import { myPrisma } from '../config/db.config';
import { CreateTempatWisataDTO } from '../validation/dto/create-tw.dto';
import { bucket, upload } from '../config/storage.config';
import { v4 as uuidv4 } from 'uuid';
import { UpdateTempatWisataDTO } from '../validation/dto/update-tw.dto';
import { validateFile } from '../middleware/validation.middleware';
import { capitalizeFirstLetter } from '../utility/firstLetterCap.utility';
import { client } from '../config/redisClient.config';
import pako from 'pako';
import axios from "axios";
import { invalidateCache, cachePatterns } from '../utility/cachekey.utility';

export const GetRekomendasiTerdekat: any = async (req: Request, res: Response) => {
    try {
        const { selected_place, num_recommendations } = req.body;

        if (!selected_place) {
            return res.status(400).json({ error: "selected_place is required." });
        }

        const djangoResponse = await axios.post("recommend-destinations", {
            selected_place,
            num_recommendations: num_recommendations || 5,
        });

        if (djangoResponse.status !== 200 || !djangoResponse.data) {
            return res.status(500).json({ error: "Failed to get recommendations from Django API." });
        }

        const recommendations = djangoResponse.data;

        const recommendationsWithThumbnails = await Promise.all(
            recommendations.map(async (recommendation: any) => {
                const tempatWisata = await myPrisma.tempatWisata.findFirst({
                    where: { nama: recommendation.nama_destinasi },
                    select: { id: true, thumbnail: true, review_total: true },
                });

                return {
                    ...recommendation,
                    id: tempatWisata?.id,
                    thumbnail: tempatWisata?.thumbnail || "No thumbnail available",
                    review_total: Number(tempatWisata?.review_total) || "No Review available",
                };
            })
        );

        const updatedRecommendations = recommendationsWithThumbnails.slice(1);

        res.status(200).json(updatedRecommendations);
    } catch (error) {
        console.error("Error in GetRekomendasiTerdekat:", error.message);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
};

export const GetTopFiveDestinasiSerupa: any = async (req: Request, res: Response) => {
    try {
        const { selected_place } = req.body;

        if (!selected_place) {
            return res.status(400).json({ error: "selected_place is required" });
        }

        const djangoResponse = await axios.post("top-five-similar", { selected_place });

        if (djangoResponse.status !== 200 || !djangoResponse.data) {
            return res.status(500).json({ error: "Failed to fetch data from the Django API" });
        }

        const { predicted_popularity, top_five_similar_destinations } = djangoResponse.data;

        const destinationsWithThumbnails = await Promise.all(
            top_five_similar_destinations.map(async (destination: any) => {
                const tempatWisata = await myPrisma.tempatWisata.findFirst({
                    where: { nama: destination.nama_destinasi },
                    select: { id: true, thumbnail: true },
                });

                return {
                    ...destination,
                    id: tempatWisata?.id,
                    thumbnail: tempatWisata?.thumbnail || "No thumbnail available"
                };
            })
        );

        res.status(200).json({
            selected_place,
            predicted_popularity,
            top_five_similar_destinations: destinationsWithThumbnails,
        });
    } catch (error) {
        console.error("Error in GetTopFiveDestinasiSerupa:", error.message);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

export const GetMostPopularDestination: any = async (req: Request, res: Response) => {
    try {
        const { province, category } = req.body;

        if (!province || !category) {
            return res.status(400).json({ error: "Both 'province' and 'category' are required." });
        }

        const djangoResponse = await axios.post("most-popular", { province, category });

        if (djangoResponse.status !== 200 || !djangoResponse.data) {
            return res.status(500).json({ error: "Failed to get data from Django API." });
        }

        const recommendations = djangoResponse.data;

        const recommendationsWithThumbnails = await Promise.all(
            recommendations.map(async (recommendation: any) => {
                const tempatWisata = await myPrisma.tempatWisata.findFirst({
                    where: { nama: recommendation.nama_destinasi },
                    select: { thumbnail: true },
                });

                return {
                    ...recommendation,
                    thumbnail: tempatWisata?.thumbnail || "No thumbnail available",
                };
            })
        );

        res.status(200).json(recommendationsWithThumbnails);
    } catch (error) {
        console.error("Error in GetMostPopularDestination:", error.message);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
};

export const GetAllTempatWisata: any = async (req: Request, res: Response) => {
    let searchQuery = req.query.search?.toString().toLowerCase();
    if (searchQuery) {
        searchQuery = capitalizeFirstLetter(searchQuery);
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const cacheKey = searchQuery
        ? `tempatWisata_search_${searchQuery}_page_${page}_size_${pageSize}`
        : `allTempatWisata_page_${page}_size_${pageSize}`;

    let tempatWisata;

    const cachedData: any = await client.get(cacheKey);
    if (cachedData) {
        tempatWisata = JSON.parse(pako.inflate(Buffer.from(cachedData, 'base64'), { to: 'string' }));
    } else {
        tempatWisata = await myPrisma.tempatWisata.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,
            where: searchQuery
                ? {
                    OR: [
                        {
                            nama: {
                                contains: searchQuery,
                                mode: 'insensitive',
                            },
                        },
                        {
                            provinsi: {
                                nama: {
                                    contains: searchQuery,
                                    mode: 'insensitive',
                                },
                            },
                        },
                        {
                            categoryWisata: {
                                nama: {
                                    contains: searchQuery,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    ],
                }
                : undefined,
            include: {
                provinsi: true,
                categoryWisata: true,
            },
            orderBy: {
                created_at: 'desc', // Orders by the newest first
            },
        });

        const compressedData = Buffer.from(pako.deflate(JSON.stringify(tempatWisata))).toString('base64');
        await client.set(cacheKey, compressedData);
    }

    if (tempatWisata.length === 0) {
        return res
            .status(404)
            .json({ message: `No results found for "${searchQuery}".` });
    }

    res.send(tempatWisata);
};

export const GetAllTempatWisataProvinsi: any = async (req: Request, res: Response) => {
    const provinsiName = req.params.provinsi;
    let searchQuery = req.query.search?.toString().toLowerCase();
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.take as string, 10) || 10;
    const skip = (page - 1) * pageSize;

    if (searchQuery) {
        searchQuery = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);
    }

    const cacheKey = searchQuery
        ? `tempatWisataProvinsi_search_${provinsiName}_${searchQuery}_page_${page}_size_${pageSize}`
        : `tempatWisataProvinsi_${provinsiName}_page_${page}_size_${pageSize}`;

    let tempatWisata;

    const cachedData: any = await client.get(cacheKey);
    if (cachedData) {
        tempatWisata = JSON.parse(
            pako.inflate(Buffer.from(cachedData, 'base64'), { to: 'string' })
        );
    } else {
        tempatWisata = await myPrisma.tempatWisata.findMany({
            take: pageSize,
            skip,
            where: {
                provinsi: {
                    nama: {
                        equals: provinsiName,
                        mode: 'insensitive',
                    },
                },
                ...(searchQuery
                    ? {
                        nama: {
                            contains: searchQuery,
                            mode: 'insensitive',
                        },
                    }
                    : {}),
            },
            include: {
                provinsi: true,
                categoryWisata: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        const compressedData = Buffer.from(
            pako.deflate(JSON.stringify(tempatWisata))
        ).toString('base64');
        await client.set(cacheKey, compressedData);
    }

    if (tempatWisata.length === 0) {
        return res.status(404).json({
            message: `No places matching your criteria for "${searchQuery}" in "${provinsiName}".`,
        });
    }

    const total = await myPrisma.tempatWisata.count({
        where: {
            provinsi: {
                nama: {
                    equals: provinsiName,
                    mode: 'insensitive',
                },
            },
            ...(searchQuery
                ? {
                    nama: {
                        contains: searchQuery,
                        mode: 'insensitive',
                    },
                }
                : {}),
        },
    });

    const lastPage = Math.ceil(total / pageSize);

    res.send({
        data: tempatWisata,
        meta: {
            total,
            page,
            last_page: lastPage,
        },
    });
};

export const GetAllTempatWisataCategory: any = async (req: Request, res: Response) => {
    const categoryName = req.params.category_wisata;
    let searchQuery = req.query.search?.toString().toLowerCase();
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.take as string, 10) || 10;
    const skip = (page - 1) * pageSize;

    if (searchQuery) {
        searchQuery = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);
    }

    const cacheKey = searchQuery
        ? `tempatWisataCategory_search_${categoryName}_${searchQuery}_page_${page}_size_${pageSize}`
        : `tempatWisataCategory_${categoryName}_page_${page}_size_${pageSize}`;

    let tempatWisata;

    const cachedData: any = await client.get(cacheKey);
    if (cachedData) {
        tempatWisata = JSON.parse(
            pako.inflate(Buffer.from(cachedData, 'base64'), { to: 'string' })
        );
    } else {
        tempatWisata = await myPrisma.tempatWisata.findMany({
            take: pageSize,
            skip,
            where: {
                categoryWisata: {
                    nama: {
                        equals: categoryName,
                        mode: 'insensitive',
                    },
                },
                ...(searchQuery
                    ? {
                        nama: {
                            contains: searchQuery,
                            mode: 'insensitive',
                        },
                    }
                    : {}),
            },
            include: {
                provinsi: true,
                categoryWisata: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        const compressedData = Buffer.from(
            pako.deflate(JSON.stringify(tempatWisata))
        ).toString('base64');
        await client.set(cacheKey, compressedData);
    }

    if (tempatWisata.length === 0) {
        return res.status(404).json({
            message: `No places matching your criteria for "${searchQuery}" in category "${categoryName}".`,
        });
    }

    const total = await myPrisma.tempatWisata.count({
        where: {
            categoryWisata: {
                nama: {
                    equals: categoryName,
                    mode: 'insensitive',
                },
            },
            ...(searchQuery
                ? {
                    nama: {
                        contains: searchQuery,
                        mode: 'insensitive',
                    },
                }
                : {}),
        },
    });

    const lastPage = Math.ceil(total / pageSize);

    res.send({
        data: tempatWisata,
        meta: {
            total,
            page,
            last_page: lastPage,
        },
    });
};

export const CreateTempatWisata: any = [
    upload.single('thumbnail'),
    validateFile,
    async (req: Request, res: Response) => {
        const body = req.body;
        const input = plainToClass(CreateTempatWisataDTO, body);
        const validationErrors = await validate(input);

        if (validationErrors.length > 0) {
            return res.status(400).json(formatValidationErrors(validationErrors));
        }

        let thumbnailUrl = '';
        if (req.file) {
            const fileName = `tempat_wisata_thumbnails/${uuidv4()}_${req.file.originalname}`;
            const blob = bucket.file(fileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: req.file.mimetype,
            });

            await new Promise((resolve, reject) => {
                blobStream.on('error', (err) => {
                    reject(err);
                });

                blobStream.on('finish', () => {
                    thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    resolve(null);
                });

                blobStream.end(req.file.buffer);
            });
        }

        const tempatWisata = await myPrisma.tempatWisata.create({
            data: {
                nama: body.nama,
                deskripsi: body.deskripsi,
                thumbnail: thumbnailUrl,
                review_total: body.review_total,
                alamat: body.alamat,
                website: body.website,
                google_link: body.google_link,
                longitude: body.longitude,
                latitude: body.latitude,
                average_rating: body.average_rating,
                provinsi_id: Number(body.provinsi_id),
                categoryWisata_id: Number(body.categoryWisata_id),
            },
        });

        try {
            const cacheTimeout = new Promise<void>((_, reject) => setTimeout(() => reject(new Error('Cache timeout')), 5000));
            await Promise.race([
                Promise.all(cachePatterns.map((pattern) => invalidateCache(pattern))),
                cacheTimeout,
            ]);
        } catch (err) {
            console.error(`Cache invalidation failed: ${err.message}`);
        }

        res.send(tempatWisata);
    }
];

export const GetTempatWisata: any = async (req: Request, res: Response) => {
    res.send(await myPrisma.tempatWisata.findUnique({
        where: {
            id: Number(req.params.id)
        },
        include: {
            provinsi: true,
            categoryWisata: true
        }
    }));
};

export const UpdateTempatWisata: any = [
    upload.single('thumbnail'),
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const body = req.body;
        const input = plainToClass(UpdateTempatWisataDTO, body);
        const validationErrors = await validate(input);

        if (validationErrors.length > 0) {
            return res.status(400).json(formatValidationErrors(validationErrors));
        }

        const existingTempatWisata = await myPrisma.tempatWisata.findUnique({ where: { id: Number(id) } });

        if (!existingTempatWisata) {
            return res.status(404).json({ message: 'Tempat Wisata not found' });
        }

        let thumbnailUrl = existingTempatWisata.thumbnail;

        if (req.file) {
            const fileName = `tempat_wisata_thumbnails/${id}_thumbnail.jpg`;

            if (thumbnailUrl && !thumbnailUrl.includes('default_image.jpg')) {
                const oldFile = bucket.file(thumbnailUrl.split(`https://storage.googleapis.com/${bucket.name}/`)[1]);
                await oldFile.delete().catch(() => {
                    console.log('Old thumbnail deletion failed, but continuing with the upload.');
                });
            }

            const blob = bucket.file(fileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
                contentType: req.file.mimetype,
            });

            await new Promise((resolve, reject) => {
                blobStream.on('error', (err) => {
                    reject(err);
                });

                blobStream.on('finish', () => {
                    thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    resolve(null);
                });

                blobStream.end(req.file.buffer);
            });
        }

        const updatedTempatWisata = await myPrisma.tempatWisata.update({
            where: { id: Number(id) },
            data: {
                nama: body.nama || existingTempatWisata.nama,
                deskripsi: body.deskripsi || existingTempatWisata.deskripsi,
                thumbnail: thumbnailUrl,
                review_total: body.review_total || existingTempatWisata.review_total,
                alamat: body.alamat || existingTempatWisata.alamat,
                website: body.website || existingTempatWisata.website,
                google_link: body.google_link || existingTempatWisata.google_link,
                longitude: body.longitude || existingTempatWisata.longitude,
                latitude: body.latitude || existingTempatWisata.latitude,
                average_rating: body.rating || existingTempatWisata.average_rating,
                provinsi_id: Number(body.provinsi_id) || existingTempatWisata.provinsi_id,
                categoryWisata_id: Number(body.categoryWisata_id) || existingTempatWisata.categoryWisata_id,
            },
        });

        try {
            const cacheTimeout = new Promise<void>((_, reject) => setTimeout(() => reject(new Error('Cache timeout')), 5000));
            await Promise.race([
                Promise.all(cachePatterns.map((pattern) => invalidateCache(pattern))),
                cacheTimeout,
            ]);
        } catch (err) {
            console.error(`Cache invalidation failed: ${err.message}`);
        }

        res.send(updatedTempatWisata);
    }
];

export const DeleteTempatWisata: any = async (req: Request, res: Response) => {
    const { id } = req.params;

    const existingTempatWisata = await myPrisma.tempatWisata.findUnique({ where: { id: Number(id) } });

    if (!existingTempatWisata) {
        return res.status(404).json({ message: 'Tempat Wisata not found' });
    }

    const thumbnailUrl = existingTempatWisata.thumbnail;

    if (thumbnailUrl && !thumbnailUrl.includes('default_image.jpg')) {
        const storageUrlPrefix = `https://storage.googleapis.com/${bucket.name}/`;

        if (thumbnailUrl.startsWith(storageUrlPrefix)) {
            const filePath = thumbnailUrl.slice(storageUrlPrefix.length);

            if (filePath) {
                const file = bucket.file(filePath);

                try {
                    await file.delete();
                    console.log('Image deleted from Cloud Storage:', filePath);
                } catch (err) {
                    console.log('Failed to delete image from Cloud Storage:', err.message);
                }
            }
        }
    }

    await myPrisma.tempatWisata.delete({ where: { id: Number(id) } });

    try {
        const cacheTimeout = new Promise<void>((_, reject) => setTimeout(() => reject(new Error('Cache timeout')), 5000));
        await Promise.race([
            Promise.all(cachePatterns.map((pattern) => invalidateCache(pattern))),
            cacheTimeout,
        ]);
    } catch (err) {
        console.error(`Cache invalidation failed: ${err.message}`);
    }

    res.status(204).json(null);
};
