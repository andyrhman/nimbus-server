import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { fakerID_ID as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
    // Read and parse the JSON dataset
    const dataset = JSON.parse(fs.readFileSync('./dataset.json', 'utf-8'));

    for (const item of dataset) {
        await prisma.tempatWisata.create({
            data: {
                nama: item.nama_destinasi,
                alamat: item.alamat,
                website: item.website,
                google_link: item.google_link,
                longitude: String(item.longitude),
                latitude: String(item.latitude),
                deskripsi: undefined,
                thumbnail: faker.image.urlPicsumPhotos({ width: 640, height: 480, grayscale: false, blur: 0 }),
                review_total: String(item.review_total),
                average_rating: String(item.average_rating),
                provinsi_id: item.provinsi_id,
                categoryWisata_id: item.categoryWisata_id
            }
        });
    }

    console.info("Seeding has been completed");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
