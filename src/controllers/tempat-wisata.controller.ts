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
import { client } from '..';
import pako from 'pako';

export const GetAllTempatWisata: any = async (req: Request, res: Response) => {
    let searchQuery = req.query.search?.toString().toLowerCase();
    if (searchQuery) {
        searchQuery = capitalizeFirstLetter(searchQuery);
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;
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
        });

        const compressedData = Buffer.from(pako.deflate(JSON.stringify(tempatWisata))).toString('base64');
        await client.set(cacheKey, compressedData, {
            EX: 1800, // 30 minutes
        });
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
    const searchQuery = req.query.search?.toString().toLowerCase();
    const page = parseInt(req.query.page as string, 10) || 1;
    const take = parseInt(req.query.take as string, 10) || 10; // Items per page
    const skip = (page - 1) * take;

    const cacheKey = searchQuery
        ? `tempatWisataProvinsi_search_${provinsiName}_${searchQuery}_page_${page}_take_${take}`
        : `tempatWisataProvinsi_${provinsiName}_page_${page}_take_${take}`;

    let provinsi: any;

    // Check Redis Cache
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
        provinsi = JSON.parse(
            pako.inflate(Buffer.from(cachedData, 'base64'), { to: 'string' })
        );
    } else {
        // Fetch from database
        provinsi = await myPrisma.provinsi.findMany({
            where: { nama: provinsiName },
            include: {
                tempatWisata: {
                    skip,
                    take,
                },
            },
        });

        // Compress and store in Redis
        const compressedData = Buffer.from(pako.deflate(JSON.stringify(provinsi))).toString('base64');
        await client.set(cacheKey, compressedData, { EX: 1800 }); // Cache for 30 minutes
    }

    if (searchQuery) {
        const search = searchQuery;

        provinsi = provinsi
            .map((p) => {
                const filteredTempatWisata = p.tempatWisata.filter((tw) =>
                    tw.nama.toLowerCase().includes(search)
                );

                return {
                    ...p,
                    tempatWisata: filteredTempatWisata,
                };
            })
            .filter((p) => p.tempatWisata.length > 0);

        if (provinsi.length === 0) {
            return res.status(404).json({
                message: `No places matching your search criteria for "${search}".`,
            });
        }
    }

    // Pagination meta
    const total = await myPrisma.tempatWisata.count({
        where: { provinsi: { nama: provinsiName } },
    });
    const lastPage = Math.ceil(total / take);

    res.send({
        data: provinsi,
        meta: {
            total,
            page,
            last_page: lastPage,
        },
    });
};

export const GetAllTempatWisataCategory: any = async (req: Request, res: Response) => {
    const categoryName = req.params.category_wisata;
    const searchQuery = req.query.search?.toString().toLowerCase();
    const page = parseInt(req.query.page as string, 10) || 1;
    const take = parseInt(req.query.take as string, 10) || 10; // Items per page
    const skip = (page - 1) * take;

    const cacheKey = searchQuery
        ? `tempatWisataCategory_search_${categoryName}_${searchQuery}_page_${page}_take_${take}`
        : `tempatWisataCategory_${categoryName}_page_${page}_take_${take}`;

    let twCategory: any;

    // Check Redis Cache
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
        twCategory = JSON.parse(
            pako.inflate(Buffer.from(cachedData, 'base64'), { to: 'string' })
        );
    } else {
        // Fetch from database
        twCategory = await myPrisma.categoryWisata.findMany({
            where: { nama: categoryName },
            include: {
                tempatWisata: {
                    skip,
                    take,
                },
            },
        });

        // Compress and store in Redis
        const compressedData = Buffer.from(pako.deflate(JSON.stringify(twCategory))).toString('base64');
        await client.set(cacheKey, compressedData, { EX: 1800 }); // Cache for 30 minutes
    }

    if (searchQuery) {
        const search = searchQuery;

        twCategory = twCategory
            .map((twC) => {
                const filteredTempatWisata = twC.tempatWisata.filter((tw) =>
                    tw.nama.toLowerCase().includes(search)
                );

                return {
                    ...twC,
                    tempatWisata: filteredTempatWisata,
                };
            })
            .filter((twC) => twC.tempatWisata.length > 0);

        if (twCategory.length === 0) {
            return res.status(404).json({
                message: `No places matching your search criteria for "${search}".`,
            });
        }
    }

    // Pagination meta
    const total = await myPrisma.tempatWisata.count({
        where: { categoryWisata: { nama: categoryName } },
    });
    const lastPage = Math.ceil(total / take);

    res.send({
        data: twCategory,
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

        // Create Tempat Wisata record in the database
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
        const filePath = thumbnailUrl.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
        const file = bucket.file(filePath);

        await file.delete().catch((err) => {
            console.log('Failed to delete image from Cloud Storage:', err);
        });
    }

    await myPrisma.tempatWisata.delete({ where: { id: Number(id) } });

    res.status(204).json(null);
};