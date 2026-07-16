/*
  Warnings:

  - Added the required column `height` to the `post_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `post_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post_images" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;
