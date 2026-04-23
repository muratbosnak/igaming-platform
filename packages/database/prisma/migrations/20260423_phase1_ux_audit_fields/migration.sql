ALTER TABLE "BackofficeUser"
ADD COLUMN "updatedById" TEXT;

ALTER TABLE "BackofficeUser"
ADD CONSTRAINT "BackofficeUser_updatedById_fkey"
FOREIGN KEY ("updatedById") REFERENCES "BackofficeUser"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
