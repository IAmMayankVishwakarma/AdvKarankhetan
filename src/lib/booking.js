import { randomUUID } from "node:crypto";

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function parseDateKey(value) {
  if (typeof value !== "string") return null;
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

export function parseTime(value) {
  if (typeof value !== "string" || !TIME_PATTERN.test(value)) return null;
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function getZonedParts(date, timeZone) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, Number(value)]),
  );
}

export function dateTimeInZoneToUtc(dateKey, time, timeZone) {
  const date = parseDateKey(dateKey);
  const minuteOfDay = parseTime(time);
  if (!date || minuteOfDay === null) return null;

  let target = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    Math.floor(minuteOfDay / 60),
    minuteOfDay % 60,
  );

  try {
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const parts = getZonedParts(new Date(target), timeZone);
      const localAsUtc = Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second,
      );
      const offset = localAsUtc - target;
      if (offset === 0) break;
      target = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        Math.floor(minuteOfDay / 60),
        minuteOfDay % 60,
      ) - offset;
    }
  } catch {
    return null;
  }

  let finalParts;
  try {
    finalParts = getZonedParts(new Date(target), timeZone);
  } catch {
    return null;
  }
  if (
    finalParts.year !== date.getUTCFullYear() ||
    finalParts.month !== date.getUTCMonth() + 1 ||
    finalParts.day !== date.getUTCDate() ||
    finalParts.hour !== Math.floor(minuteOfDay / 60) ||
    finalParts.minute !== minuteOfDay % 60
  ) {
    return null;
  }
  return new Date(target);
}

export function dateKeyInZone(date, timeZone) {
  const parts = getZonedParts(date, timeZone);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export function dayRange(date) {
  const start = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
}

export function businessDayRange(dateKey, timeZone) {
  const date = parseDateKey(dateKey);
  if (!date) return null;
  const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  const key = (day) =>
    `${day.getUTCFullYear()}-${String(day.getUTCMonth() + 1).padStart(2, "0")}-${String(day.getUTCDate()).padStart(2, "0")}`;
  const start = dateTimeInZoneToUtc(dateKey, "00:00", timeZone);
  const end = dateTimeInZoneToUtc(key(nextDate), "00:00", timeZone);
  return start && end ? { start, end } : null;
}

export async function getBusinessSettings(client) {
  try {
    return await client.businessSetting.upsert({
      where: { id: "default" },
      update: {},
      create: { id: "default" },
    });
  } catch (error) {
    if (error?.code !== "P2002") throw error;
    const settings = await client.businessSetting.findUnique({
      where: { id: "default" },
    });
    if (!settings) throw error;
    return settings;
  }
}

export async function lockAvailabilityDay(tx, date, settings) {
  const id = randomUUID();
  await tx.$executeRaw`
    INSERT INTO "DailyAvailability"
      ("id", "date", "maxMeetings", "isAvailable", "opensAt", "closesAt", "createdAt", "updatedAt")
    VALUES
      (${id}, ${date}, ${settings.defaultMaxMeetings}, true, ${settings.defaultOpenTime}, ${settings.defaultCloseTime}, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
    ON CONFLICT ("date") DO NOTHING
  `;
  await tx.$queryRaw`
    SELECT "id" FROM "DailyAvailability" WHERE "date" = ${date} FOR UPDATE
  `;
  return tx.dailyAvailability.findUnique({ where: { date } });
}
