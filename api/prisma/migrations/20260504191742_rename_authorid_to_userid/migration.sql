/*
  Warnings:

  - You are about to drop the column `authorId` on the `post_votes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,postId]` on the table `post_votes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `post_votes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "post_votes" DROP CONSTRAINT "post_votes_authorId_fkey";

-- DropIndex
DROP INDEX "post_votes_authorId_postId_key";

-- AlterTable
ALTER TABLE "post_votes" DROP COLUMN "authorId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "post_votes_userId_postId_key" ON "post_votes"("userId", "postId");

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
