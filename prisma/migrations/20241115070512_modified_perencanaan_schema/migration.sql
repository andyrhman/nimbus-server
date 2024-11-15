/*
  Warnings:

  - Added the required column `categoryWisata_id` to the `perencanaan_manual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinsi_id` to the `perencanaan_manual` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "perencanaan_manual" ADD COLUMN     "categoryWisata_id" INTEGER NOT NULL,
ADD COLUMN     "provinsi_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "perencanaan_manual" ADD CONSTRAINT "perencanaan_manual_provinsi_id_fkey" FOREIGN KEY ("provinsi_id") REFERENCES "provinsi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perencanaan_manual" ADD CONSTRAINT "perencanaan_manual_categoryWisata_id_fkey" FOREIGN KEY ("categoryWisata_id") REFERENCES "category_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
