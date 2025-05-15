/*
  Warnings:

  - Added the required column `user_id` to the `page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "page" ADD COLUMN     "user_id" UUID NOT NULL;
