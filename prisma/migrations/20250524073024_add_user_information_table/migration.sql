-- CreateTable
CREATE TABLE "user_information" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "user_information_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_information_user_id_idx" ON "user_information"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_information_user_id_key" ON "user_information"("user_id");
