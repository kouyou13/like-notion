-- CreateEnum
CREATE TYPE "block_type" AS ENUM ('Text', 'H1', 'H2', 'H3', 'List', 'ListNumbers', 'ToDoList', 'ToggleList', 'Page', 'Callout', 'Citing', 'Table', 'SeparatorLine', 'PageLink');

-- CreateTable
CREATE TABLE "page" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "block" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "block_type" "block_type" NOT NULL DEFAULT 'Text',
    "indent_index" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "deleted_at" TIMESTAMP(3),
    "is_checked" BOOLEAN NOT NULL DEFAULT false,
    "page_id" UUID,

    CONSTRAINT "block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "page_id_order_key" ON "page"("id", "order");

-- CreateIndex
CREATE INDEX "block_page_id_idx" ON "block"("page_id");

-- AddForeignKey
ALTER TABLE "block" ADD CONSTRAINT "block_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
