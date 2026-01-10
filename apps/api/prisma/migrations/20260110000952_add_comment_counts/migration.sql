-- AlterTable
ALTER TABLE "public"."comments" ADD COLUMN     "media" TEXT[],
ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "likes_postId_idx" ON "public"."likes"("postId");

-- CreateIndex
CREATE INDEX "likes_commentId_idx" ON "public"."likes"("commentId");

-- CreateIndex
CREATE INDEX "views_postId_idx" ON "public"."views"("postId");

-- CreateIndex
CREATE INDEX "views_commentId_idx" ON "public"."views"("commentId");
