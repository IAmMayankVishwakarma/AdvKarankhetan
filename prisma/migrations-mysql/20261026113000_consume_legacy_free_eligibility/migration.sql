UPDATE `User`
SET `freeAppointmentUsedAt` = (
    SELECT MIN(b.`createdAt`)
    FROM `Booking` AS b
    WHERE b.`userId` = `User`.`id`
)
WHERE `freeAppointmentUsedAt` IS NULL
  AND EXISTS (
    SELECT 1
    FROM `Booking` AS b
    WHERE b.`userId` = `User`.`id`
  );
