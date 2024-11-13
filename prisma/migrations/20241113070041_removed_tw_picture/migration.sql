/*
  Warnings:

  - You are about to drop the `tempat_wisata_gambar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tempat_wisata_gambar" DROP CONSTRAINT "tempat_wisata_gambar_tempatWisata_id_fkey";

-- DropTable
DROP TABLE "tempat_wisata_gambar";
