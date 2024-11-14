-- CreateTable
CREATE TABLE "PerencanaanManual" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "budget" BIGINT NOT NULL,
    "tanggal_perencaan" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tempatWisata_id" INTEGER NOT NULL,

    CONSTRAINT "PerencanaanManual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerencanaanOtomatis" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "budget" BIGINT NOT NULL,
    "tanggal_perencaan" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provinsi_id" INTEGER NOT NULL,
    "categoryWisata_id" INTEGER NOT NULL,
    "tempatWisata_id" INTEGER NOT NULL,

    CONSTRAINT "PerencanaanOtomatis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PerencanaanManual" ADD CONSTRAINT "PerencanaanManual_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerencanaanManual" ADD CONSTRAINT "PerencanaanManual_tempatWisata_id_fkey" FOREIGN KEY ("tempatWisata_id") REFERENCES "tempat_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerencanaanOtomatis" ADD CONSTRAINT "PerencanaanOtomatis_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerencanaanOtomatis" ADD CONSTRAINT "PerencanaanOtomatis_provinsi_id_fkey" FOREIGN KEY ("provinsi_id") REFERENCES "provinsi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerencanaanOtomatis" ADD CONSTRAINT "PerencanaanOtomatis_categoryWisata_id_fkey" FOREIGN KEY ("categoryWisata_id") REFERENCES "category_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerencanaanOtomatis" ADD CONSTRAINT "PerencanaanOtomatis_tempatWisata_id_fkey" FOREIGN KEY ("tempatWisata_id") REFERENCES "tempat_wisata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
