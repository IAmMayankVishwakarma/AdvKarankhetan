ALTER TABLE `Booking` ADD COLUMN `paymentExpiresAt` DATETIME(3) NULL;

CREATE INDEX `Booking_paymentExpiresAt_status_idx` ON `Booking`(`paymentExpiresAt`, `status`);
