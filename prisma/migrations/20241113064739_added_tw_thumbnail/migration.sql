/*
  Warnings:

  - Added the required column `thumbnail` to the `tempat_wisata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tempat_wisata" ADD COLUMN     "thumbnail" TEXT NOT NULL;
