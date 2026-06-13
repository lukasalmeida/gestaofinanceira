-- AlterTable
ALTER TABLE "families" ADD COLUMN "inviteTokenUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "families" ADD COLUMN "createdById" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "avatarUrl" TEXT;

-- CreateTable
CREATE TABLE "notification_reads" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notificationKey" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_reads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_reads_userId_notificationKey_key" ON "notification_reads"("userId", "notificationKey");

-- AddForeignKey
ALTER TABLE "families" ADD CONSTRAINT "families_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_reads" ADD CONSTRAINT "notification_reads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Rename Bill table if needed (existing installs)
ALTER TABLE IF EXISTS "Bill" RENAME TO "bills";
