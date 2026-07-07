/*
  Warnings:

  - You are about to drop the `CommentImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentImage" DROP CONSTRAINT "CommentImage_commentId_fkey";

-- DropForeignKey
ALTER TABLE "PostImage" DROP CONSTRAINT "PostImage_postId_fkey";

-- DropTable
DROP TABLE "CommentImage";

-- DropTable
DROP TABLE "PostImage";

-- CreateTable
CREATE TABLE "post_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_images_postId_idx" ON "post_images"("postId");

-- CreateIndex
CREATE INDEX "comment_images_commentId_idx" ON "comment_images"("commentId");

-- AddForeignKey
ALTER TABLE "post_images" ADD CONSTRAINT "post_images_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_images" ADD CONSTRAINT "comment_images_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
