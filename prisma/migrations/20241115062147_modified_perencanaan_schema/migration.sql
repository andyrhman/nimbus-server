/*
  Warnings:

  - You are about to drop the column `tanggal_perencaan` on the `perencanaan_otomatis` table. All the data in the column will be lost.
  - You are about to drop the column `tempatWisata_id` on the `perencanaan_otomatis` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "perencanaan_otomatis" DROP CONSTRAINT "perencanaan_otomatis_tempatWisata_id_fkey";

-- AlterTable
ALTER TABLE "perencanaan_otomatis" DROP COLUMN "tanggal_perencaan",
DROP COLUMN "tempatWisata_id";

-- CreateTable
CREATE TABLE "tempatWisata_perencanaan_otomatis" (
    "id" SERIAL NOT NULL,
    "tanggal_perencanaan" TIMESTAMP(3) NOT NULL,
    "perencanaanOtomatis_id" INTEGER NOT NULL,
    "tempatWisata_id" INTEGER NOT NULL,

    CONSTRAINT "tempatWisata_perencanaan_otomatis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tempatWisata_perencanaan_otomatis" ADD CONSTRAINT "tempatWisata_perencanaan_otomatis_perencanaanOtomatis_id_fkey" FOREIGN KEY ("perencanaanOtomatis_id") REFERENCES "perencanaan_otomatis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tempatWisata_perencanaan_otomatis" ADD CONSTRAINT "tempatWisata_perencanaan_otomatis_tempatWisata_id_fkey" FOREIGN KEY ("tempatWisata_id") REFERENCES "tempat_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
