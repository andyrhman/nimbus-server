-- DropForeignKey
ALTER TABLE "perencanaan_manual" DROP CONSTRAINT "perencanaan_manual_categoryWisata_id_fkey";

-- DropForeignKey
ALTER TABLE "perencanaan_manual" DROP CONSTRAINT "perencanaan_manual_provinsi_id_fkey";

-- DropForeignKey
ALTER TABLE "perencanaan_manual" DROP CONSTRAINT "perencanaan_manual_user_id_fkey";

-- DropForeignKey
ALTER TABLE "perencanaan_otomatis" DROP CONSTRAINT "perencanaan_otomatis_categoryWisata_id_fkey";

-- DropForeignKey
ALTER TABLE "perencanaan_otomatis" DROP CONSTRAINT "perencanaan_otomatis_provinsi_id_fkey";

-- DropForeignKey
ALTER TABLE "perencanaan_otomatis" DROP CONSTRAINT "perencanaan_otomatis_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tempatWisata_perencanaan_manual" DROP CONSTRAINT "tempatWisata_perencanaan_manual_tempatWisata_id_fkey";

-- DropForeignKey
ALTER TABLE "tempatWisata_perencanaan_otomatis" DROP CONSTRAINT "tempatWisata_perencanaan_otomatis_tempatWisata_id_fkey";

-- DropForeignKey
ALTER TABLE "tempat_wisata" DROP CONSTRAINT "tempat_wisata_categoryWisata_id_fkey";

-- DropForeignKey
ALTER TABLE "tempat_wisata" DROP CONSTRAINT "tempat_wisata_provinsi_id_fkey";

-- AddForeignKey
ALTER TABLE "tempat_wisata" ADD CONSTRAINT "tempat_wisata_provinsi_id_fkey" FOREIGN KEY ("provinsi_id") REFERENCES "provinsi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tempat_wisata" ADD CONSTRAINT "tempat_wisata_categoryWisata_id_fkey" FOREIGN KEY ("categoryWisata_id") REFERENCES "category_wisata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perencanaan_manual" ADD CONSTRAINT "perencanaan_manual_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perencanaan_manual" ADD CONSTRAINT "perencanaan_manual_provinsi_id_fkey" FOREIGN KEY ("provinsi_id") REFERENCES "provinsi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perencanaan_manual" ADD CONSTRAINT "perencanaan_manual_categoryWisata_id_fkey" FOREIGN KEY ("categoryWisata_id") REFERENCES "category_wisata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tempatWisata_perencanaan_manual" ADD CONSTRAINT "tempatWisata_perencanaan_manual_tempatWisata_id_fkey" FOREIGN KEY ("tempatWisata_id") REFERENCES "tempat_wisata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perencanaan_otomatis" ADD CONSTRAINT "perencanaan_otomatis_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perencanaan_otomatis" ADD CONSTRAINT "perencanaan_otomatis_provinsi_id_fkey" FOREIGN KEY ("provinsi_id") REFERENCES "provinsi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perencanaan_otomatis" ADD CONSTRAINT "perencanaan_otomatis_categoryWisata_id_fkey" FOREIGN KEY ("categoryWisata_id") REFERENCES "category_wisata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tempatWisata_perencanaan_otomatis" ADD CONSTRAINT "tempatWisata_perencanaan_otomatis_tempatWisata_id_fkey" FOREIGN KEY ("tempatWisata_id") REFERENCES "tempat_wisata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
