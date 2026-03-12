/*
  Warnings:

  - Added the required column `updatedAt` to the `Whiteboard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Whiteboard" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Whiteboard_projectId_idx" ON "Whiteboard"("projectId");
