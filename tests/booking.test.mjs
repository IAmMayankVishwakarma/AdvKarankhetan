import test from "node:test";
import assert from "node:assert/strict";
import {
  businessDayRange,
  dateKeyInZone,
  dateTimeInZoneToUtc,
  parseDateKey,
  parseTime,
} from "../src/lib/booking.js";

test("parses only real business date keys", () => {
  assert.equal(parseDateKey("2026-10-26").toISOString(), "2026-10-26T00:00:00.000Z");
  assert.equal(parseDateKey("2026-02-30"), null);
  assert.equal(parseDateKey("26-10-2026"), null);
});

test("converts local appointment time to UTC for configured timezone", () => {
  const appointment = dateTimeInZoneToUtc("2026-10-26", "09:30", "Asia/Kolkata");
  assert.equal(appointment.toISOString(), "2026-10-26T04:00:00.000Z");
  assert.equal(dateKeyInZone(appointment, "Asia/Kolkata"), "2026-10-26");
});

test("uses timezone-aware business-day boundaries", () => {
  const range = businessDayRange("2026-10-26", "Asia/Kolkata");
  assert.equal(range.start.toISOString(), "2026-10-25T18:30:00.000Z");
  assert.equal(range.end.toISOString(), "2026-10-26T18:30:00.000Z");
});

test("validates 24-hour booking times", () => {
  assert.equal(parseTime("09:30"), 570);
  assert.equal(parseTime("24:00"), null);
  assert.equal(parseTime("9:30"), null);
});
