CREATE TABLE public."User" (
  "id" varchar(191) NOT NULL,
  "name" varchar(191) NOT NULL,
  "email" varchar(191) NOT NULL,
  "passwordHash" varchar(191) NOT NULL,
  "role" varchar(191) NOT NULL DEFAULT 'USER',
  "status" varchar(191) NOT NULL DEFAULT 'ACTIVE',
  "blockedAt" timestamp(3),
  "freeAppointmentUsedAt" timestamp(3),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "User_email_key" UNIQUE ("email")
);

CREATE TABLE public."Session" (
  "id" varchar(191) NOT NULL,
  "tokenHash" varchar(191) NOT NULL,
  "userId" varchar(191) NOT NULL,
  "expiresAt" timestamp(3) NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Session_tokenHash_key" UNIQUE ("tokenHash"),
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Session_userId_idx" ON public."Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON public."Session"("expiresAt");

CREATE TABLE public."PasswordResetToken" (
  "id" varchar(191) NOT NULL,
  "tokenHash" varchar(191) NOT NULL,
  "userId" varchar(191) NOT NULL,
  "expiresAt" timestamp(3) NOT NULL,
  "usedAt" timestamp(3),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PasswordResetToken_tokenHash_key" UNIQUE ("tokenHash"),
  CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "PasswordResetToken_userId_idx" ON public."PasswordResetToken"("userId");
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON public."PasswordResetToken"("expiresAt");

CREATE TABLE public."ContactInquiry" (
  "id" varchar(191) NOT NULL,
  "firstName" varchar(191) NOT NULL,
  "lastName" varchar(191) NOT NULL,
  "email" varchar(191) NOT NULL,
  "matter" varchar(191) NOT NULL,
  "value" varchar(191),
  "urgency" varchar(191),
  "message" varchar(191) NOT NULL,
  "status" varchar(191) NOT NULL DEFAULT 'NEW',
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ContactInquiry_createdAt_idx" ON public."ContactInquiry"("createdAt");
CREATE INDEX "ContactInquiry_status_createdAt_idx" ON public."ContactInquiry"("status", "createdAt");

CREATE TABLE public."Service" (
  "id" varchar(191) NOT NULL,
  "name" varchar(191) NOT NULL,
  "description" varchar(191) NOT NULL,
  "priceMinorUnits" integer NOT NULL,
  "currency" varchar(191) NOT NULL DEFAULT 'INR',
  "durationMinutes" integer NOT NULL,
  "active" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "Service_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Service_priceMinorUnits_check" CHECK ("priceMinorUnits" >= 0),
  CONSTRAINT "Service_durationMinutes_check" CHECK ("durationMinutes" > 0)
);
CREATE INDEX "Service_active_name_idx" ON public."Service"("active", "name");
CREATE INDEX "Service_createdAt_idx" ON public."Service"("createdAt");

CREATE TABLE public."Booking" (
  "id" varchar(191) NOT NULL,
  "userId" varchar(191) NOT NULL,
  "serviceId" varchar(191) NOT NULL,
  "startsAt" timestamp(3) NOT NULL,
  "endsAt" timestamp(3) NOT NULL,
  "timeZone" varchar(191) NOT NULL,
  "status" varchar(191) NOT NULL DEFAULT 'PENDING_PAYMENT',
  "paymentStatus" varchar(191) NOT NULL DEFAULT 'UNPAID',
  "amountMinorUnits" integer NOT NULL DEFAULT 0,
  "isFreeAppointment" boolean NOT NULL DEFAULT false,
  "paymentExpiresAt" timestamp(3),
  "idempotencyKey" varchar(191),
  "googleCalendarEventId" varchar(191),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Booking_idempotencyKey_key" UNIQUE ("idempotencyKey"),
  CONSTRAINT "Booking_googleCalendarEventId_key" UNIQUE ("googleCalendarEventId"),
  CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Booking_time_range_check" CHECK ("endsAt" > "startsAt"),
  CONSTRAINT "Booking_amountMinorUnits_check" CHECK ("amountMinorUnits" >= 0)
);
CREATE INDEX "Booking_startsAt_endsAt_status_idx" ON public."Booking"("startsAt", "endsAt", "status");
CREATE INDEX "Booking_userId_createdAt_idx" ON public."Booking"("userId", "createdAt");
CREATE INDEX "Booking_paymentExpiresAt_status_idx" ON public."Booking"("paymentExpiresAt", "status");

CREATE TABLE public."Payment" (
  "id" varchar(191) NOT NULL,
  "bookingId" varchar(191) NOT NULL,
  "provider" varchar(191) NOT NULL,
  "providerOrderId" varchar(191),
  "providerPaymentId" varchar(191),
  "amountMinorUnits" integer NOT NULL,
  "currency" varchar(191) NOT NULL DEFAULT 'INR',
  "status" varchar(191) NOT NULL DEFAULT 'PENDING',
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Payment_bookingId_key" UNIQUE ("bookingId"),
  CONSTRAINT "Payment_providerOrderId_key" UNIQUE ("providerOrderId"),
  CONSTRAINT "Payment_providerPaymentId_key" UNIQUE ("providerPaymentId"),
  CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES public."Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Payment_amountMinorUnits_check" CHECK ("amountMinorUnits" >= 0)
);
CREATE INDEX "Payment_status_createdAt_idx" ON public."Payment"("status", "createdAt");

CREATE TABLE public."DailyAvailability" (
  "id" varchar(191) NOT NULL,
  "date" timestamp(3) NOT NULL,
  "maxMeetings" integer NOT NULL,
  "isAvailable" boolean NOT NULL DEFAULT true,
  "opensAt" varchar(191),
  "closesAt" varchar(191),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "DailyAvailability_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DailyAvailability_date_key" UNIQUE ("date"),
  CONSTRAINT "DailyAvailability_maxMeetings_check" CHECK ("maxMeetings" >= 0)
);

CREATE TABLE public."Holiday" (
  "id" varchar(191) NOT NULL,
  "date" timestamp(3) NOT NULL,
  "description" varchar(191) NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Holiday_date_key" UNIQUE ("date")
);

CREATE TABLE public."BusinessSetting" (
  "id" varchar(191) NOT NULL DEFAULT 'default',
  "timeZone" varchar(191) NOT NULL DEFAULT 'Asia/Kolkata',
  "defaultMaxMeetings" integer NOT NULL DEFAULT 4,
  "defaultOpenTime" varchar(191) NOT NULL DEFAULT '09:00',
  "defaultCloseTime" varchar(191) NOT NULL DEFAULT '17:00',
  "cancellationHours" integer NOT NULL DEFAULT 24,
  "allowReschedule" boolean NOT NULL DEFAULT true,
  "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "BusinessSetting_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BusinessSetting_defaultMaxMeetings_check" CHECK ("defaultMaxMeetings" >= 0),
  CONSTRAINT "BusinessSetting_cancellationHours_check" CHECK ("cancellationHours" >= 0)
);

CREATE TABLE public."BookingChange" (
  "id" varchar(191) NOT NULL,
  "bookingId" varchar(191) NOT NULL,
  "actorId" varchar(191),
  "action" varchar(191) NOT NULL,
  "previousStartsAt" timestamp(3),
  "previousEndsAt" timestamp(3),
  "newStartsAt" timestamp(3),
  "newEndsAt" timestamp(3),
  "reason" varchar(191),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "BookingChange_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BookingChange_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES public."Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "BookingChange_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES public."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "BookingChange_bookingId_createdAt_idx" ON public."BookingChange"("bookingId", "createdAt");

CREATE TABLE public."PaymentWebhookEvent" (
  "id" varchar(191) NOT NULL,
  "eventId" varchar(191) NOT NULL,
  "eventType" varchar(191) NOT NULL,
  "paymentId" varchar(191),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "PaymentWebhookEvent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PaymentWebhookEvent_eventId_key" UNIQUE ("eventId")
);
CREATE INDEX "PaymentWebhookEvent_paymentId_createdAt_idx" ON public."PaymentWebhookEvent"("paymentId", "createdAt");

CREATE TABLE public."AuditLog" (
  "id" varchar(191) NOT NULL,
  "actorId" varchar(191),
  "action" varchar(191) NOT NULL,
  "targetType" varchar(191) NOT NULL,
  "targetId" varchar(191),
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES public."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON public."AuditLog"("actorId", "createdAt");
CREATE INDEX "AuditLog_targetType_targetId_createdAt_idx" ON public."AuditLog"("targetType", "targetId", "createdAt");

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'User',
    'Session',
    'PasswordResetToken',
    'ContactInquiry',
    'Service',
    'Booking',
    'Payment',
    'DailyAvailability',
    'Holiday',
    'BusinessSetting',
    'BookingChange',
    'PaymentWebhookEvent',
    'AuditLog'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC, anon, authenticated', table_name);
    EXECUTE format(
      'CREATE POLICY "deny_api_role_access" ON public.%I FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)',
      table_name
    );
  END LOOP;
END;
$$;
