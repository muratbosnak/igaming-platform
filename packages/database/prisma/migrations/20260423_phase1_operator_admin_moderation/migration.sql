ALTER TABLE "BackofficeUser"
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "deactivatedAt" TIMESTAMP(3),
ADD COLUMN "deactivatedById" TEXT;

ALTER TABLE "UserOperatorAccess"
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "BackofficeUser"
ADD CONSTRAINT "BackofficeUser_deactivatedById_fkey"
FOREIGN KEY ("deactivatedById") REFERENCES "BackofficeUser"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
