/*
  Warnings:

  - You are about to drop the `Level` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Level";

-- CreateTable
CREATE TABLE "levels" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);
