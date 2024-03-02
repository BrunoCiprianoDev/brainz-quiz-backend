-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "useId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);
