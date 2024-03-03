-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);
