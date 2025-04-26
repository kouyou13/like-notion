/*
  Warnings:

  - A unique constraint covering the columns `[parent_block_id]` on the table `page` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "page" ADD COLUMN     "parent_block_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "page_parent_block_id_key" ON "page"("parent_block_id");
