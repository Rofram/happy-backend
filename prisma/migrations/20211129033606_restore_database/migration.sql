-- CreateTable
CREATE TABLE "Orphanages" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "about" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "open_hours" TEXT NOT NULL,
    "open_on_weekends" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orphanages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "orphanageId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_orphanageId_fkey" FOREIGN KEY ("orphanageId") REFERENCES "Orphanages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
