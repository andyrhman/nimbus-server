/*
  Warnings:

  - Added the required column `deskripsi` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "deskripsi" TEXT NOT NULL;
