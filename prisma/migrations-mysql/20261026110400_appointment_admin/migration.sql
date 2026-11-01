-- AlterTable
ALTER TABLE `booking` ADD COLUMN `amountMinorUnits` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `idempotencyKey` VARCHAR(191) NULL,
    ADD COLUMN `isFreeAppointment` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE `dailyavailability` ADD COLUMN `closesAt` VARCHAR(191) NULL,
    ADD COLUMN `opensAt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `freeAppointmentUsedAt` DATETIME(3) NULL,
    MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'USER';

UPDATE `user` SET `role` = 'USER' WHERE `role` = 'CLIENT';

-- CreateTable
CREATE TABLE `Holiday` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Holiday_date_key`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusinessSetting` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'default',
    `timeZone` VARCHAR(191) NOT NULL DEFAULT 'Asia/Kolkata',
    `defaultMaxMeetings` INTEGER NOT NULL DEFAULT 4,
    `defaultOpenTime` VARCHAR(191) NOT NULL DEFAULT '09:00',
    `defaultCloseTime` VARCHAR(191) NOT NULL DEFAULT '17:00',
    `cancellationHours` INTEGER NOT NULL DEFAULT 24,
    `allowReschedule` BOOLEAN NOT NULL DEFAULT true,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingChange` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `previousStartsAt` DATETIME(3) NULL,
    `previousEndsAt` DATETIME(3) NULL,
    `newStartsAt` DATETIME(3) NULL,
    `newEndsAt` DATETIME(3) NULL,
    `reason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BookingChange_bookingId_createdAt_idx`(`bookingId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentWebhookEvent` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `eventType` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PaymentWebhookEvent_eventId_key`(`eventId`),
    INDEX `PaymentWebhookEvent_paymentId_createdAt_idx`(`paymentId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_idempotencyKey_key` ON `Booking`(`idempotencyKey`);

-- AddForeignKey
ALTER TABLE `BookingChange` ADD CONSTRAINT `BookingChange_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingChange` ADD CONSTRAINT `BookingChange_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
