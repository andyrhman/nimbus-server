/*
  Warnings:

  - You are about to drop the `PerencanaanManual` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PerencanaanOtomatis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PerencanaanManual" DROP CONSTRAINT "PerencanaanManual_tempatWisata_id_fkey";

-- DropForeignKey
ALTER TABLE "PerencanaanManual" DROP CONSTRAINT "PerencanaanManual_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PerencanaanOtomatis" DROP CONSTRAINT "PerencanaanOtomatis_categoryWisata_id_fkey";

-- DropForeignKey
ALTER TABLE "PerencanaanOtomatis" DROP CONSTRAINT "PerencanaanOtomatis_provinsi_id_fkey";

-- DropForeignKey
ALTER TABLE "PerencanaanOtomatis" DROP CONSTRAINT "PerencanaanOtomatis_tempatWisata_id_fkey";

-- DropForeignKey
ALTER TABLE "PerencanaanOtomatis" DROP CONSTRAINT "PerencanaanOtomatis_user_id_fkey";

-- DropTable
DROP TABLE "PerencanaanManual";

-- DropTable
DROP TABLE "PerencanaanOtomatis";

-- CreateTable
CREATE TABLE "perencanaan_manual" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "budget" BIGINT NOT NULL,
    "tanggal_perencaan" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tempatWisata_id" INTEGER NOT NULL,

    CONSTRAINT "perencanaan_manual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perencanaan_otomatis" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "budget" BIGINT NOT NULL,
    "tanggal_perencaan" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provinsi_id" INTEGER NOT NULL,
    "categoryWisata_id" INTEGER NOT NULL,
    "tempatWisata_id" INTEGER NOT NULL,

    CONSTRAINT "perencanaan_otomatis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "perencanaan_manual" ADD CONSTRAINT "perencanaan_manual_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perencanaan_manual" ADD CONSTRAINT "perencanaan_manual_tempatWisata_id_fkey" FOREIGN KEY ("tempatWisata_id") REFERENCES "tempat_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perencanaan_otomatis" ADD CONSTRAINT "perencanaan_otomatis_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perencanaan_otomatis" ADD CONSTRAINT "perencanaan_otomatis_provinsi_id_fkey" FOREIGN KEY ("provinsi_id") REFERENCES "provinsi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perencanaan_otomatis" ADD CONSTRAINT "perencanaan_otomatis_categoryWisata_id_fkey" FOREIGN KEY ("categoryWisata_id") REFERENCES "category_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perencanaan_otomatis" ADD CONSTRAINT "perencanaan_otomatis_tempatWisata_id_fkey" FOREIGN KEY ("tempatWisata_id") REFERENCES "tempat_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
