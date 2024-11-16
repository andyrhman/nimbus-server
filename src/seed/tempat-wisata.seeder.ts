import { fakerID_ID as faker } from "@faker-js/faker";
import { PrismaClient } from '@prisma/client';
import { myPrisma } from "../config/db.config";
import { randomInt } from "crypto";

const prisma = new PrismaClient();

async function main() {

    const provinsi = await myPrisma.provinsi.findMany();
    const cw = await myPrisma.categoryWisata.findMany();

    for (let i = 0; i < 7000; i++) {
        await myPrisma.tempatWisata.create({
            data: {
                nama: faker.word.words(3),
                alamat: faker.location.streetAddress({ useFullAddress: true }),
                website: faker.internet.domainName(),
                google_link: faker.internet.domainName(),
                longitude: String(faker.location.longitude()),
                latitude: String(faker.location.latitude()),
                deskripsi: faker.lorem.paragraphs(4),
                thumbnail: `${faker.image.urlLoremFlickr({ category: 'landscape' })}?random=${Math.round(Math.random() * 1000)}`,
                review_total: String(randomInt(5, 50)),
                average_rating: String(randomInt(1, 5)),
                provinsi_id: provinsi[i % provinsi.length].id,
                categoryWisata_id: cw[i % cw.length].id
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
