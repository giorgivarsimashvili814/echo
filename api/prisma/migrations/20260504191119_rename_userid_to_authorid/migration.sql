/*
  Warnings:

  - You are about to drop the column `userId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `post_votes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authorId,postId]` on the table `post_votes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `post_votes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "post_votes" DROP CONSTRAINT "post_votes_userId_fkey";

-- DropIndex
DROP INDEX "post_votes_userId_postId_key";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "post_votes" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "post_votes_authorId_postId_key" ON "post_votes"("authorId", "postId");

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
