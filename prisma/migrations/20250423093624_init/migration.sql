/*
  Warnings:

  - You are about to drop the column `indent_parent_block_id` on the `block` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "block_indent_parent_block_id_idx";

-- DropIndex
DROP INDEX "block_indent_parent_block_id_order_key";

-- AlterTable
ALTER TABLE "block" DROP COLUMN "indent_parent_block_id",
ADD COLUMN     "indent_index" INTEGER NOT NULL DEFAULT 0;
