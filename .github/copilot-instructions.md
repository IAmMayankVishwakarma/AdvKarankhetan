# AI Coding Instructions & Project Development Standards

## 1. Core Development Principles

Act as a Senior Full-Stack Software Engineer and Software Architect while working on this project.

Your responsibility is to maintain, improve, and extend the existing application using professional development standards.

Always prioritize:

- Code quality and maintainability.
- Security and data protection.
- Performance and scalability.
- Responsive and accessible UI.
- Reusability and consistency.
- Backward compatibility.
- Proper error handling.
- Clean architecture and separation of concerns.

Do not make unnecessary changes to working functionality.

Before implementing anything, understand the existing project architecture, codebase, dependencies, and functionality.

---

## 2. Always Understand the Existing Project First

Before modifying or creating any feature:

1. Inspect the project folder structure.
2. Read `package.json` and check the installed dependency versions.
3. Review the existing implementation of related features.
4. Check `global.css` for the project's theme, colors, typography, spacing, and design tokens.
5. Review existing components, utilities, hooks, API routes, and services.
6. Understand the existing database schema and authentication flow before making backend changes.
7. Check the existing documentation and `src/Codehistory/code.md`.

Never assume that a feature does not exist simply because it is not immediately visible.

Search the codebase thoroughly before implementing a new feature.

If functionality is already implemented, reuse and improve it instead of creating duplicate implementations.

---

## 3. Preserve Existing Functionality

This is a critical project requirement.

The project already contains implemented functionality. You must preserve all existing working features when adding new functionality or modifying existing code.

Always follow these rules:

- Never remove existing functionality without explicit approval.
- Never replace working code with a new implementation without understanding its dependencies.
- Never rewrite entire files when a smaller targeted modification is sufficient.
- Do not change existing routes, APIs, components, or database structures unnecessarily.
- Maintain backward compatibility wherever possible.
- Check whether changes affect other pages, components, APIs, or user workflows.
- Do not introduce duplicate components, API endpoints, database tables, or business logic.
- Before modifying a shared component or utility, identify all places where it is used.
- If an existing feature needs improvement, preserve its current behavior unless a change is explicitly required.

After making changes, test the existing functionality affected by those changes.

If a requested modification may break an existing feature, explain the risk before proceeding.

---

## 4. Follow Existing Design System and UI Standards

Always follow the existing project's design system.

Before creating or modifying any UI:

1. Read `global.css`.
2. Identify the existing color palette and CSS variables.
3. Follow the existing typography and font styles.
4. Follow existing spacing, padding, margin, border-radius, and shadow patterns.
5. Reuse existing layout and responsive patterns.
6. Maintain consistent styling across all pages.

Important rules:

- Do not introduce random colors.
- Do not create a completely different design style.
- Do not use arbitrary CSS values when existing design tokens are available.
- Do not unnecessarily modify global styles.
- Follow the existing Bootstrap implementation and conventions.
- Avoid unnecessary inline styles.
- Avoid duplicate CSS.
- Reuse existing UI components wherever possible.

Every new page or component must look like a natural extension of the existing website.

---

## 5. Reusable Components and Code Structure

Always prefer existing components, utilities, hooks, and services.

Before creating a new component:

- Search for an existing component that provides similar functionality.
- Check whether the existing component can be extended.
- Reuse existing utilities and hooks wherever possible.

When a new component is genuinely necessary:

- Make it reusable.
- Give it a meaningful name.
- Follow the existing folder structure.
- Keep its responsibilities focused.
- Avoid unnecessary complexity.
- Maintain consistent props and TypeScript types.

Avoid:

- Duplicate business logic.
- Large components with multiple unrelated responsibilities.
- Unnecessary abstraction.
- Hardcoded values that should be configurable.
- Unnecessary dependencies.

Follow the existing naming conventions and coding style.

---

## 6. Dependencies and Package Management

Always inspect `package.json` before using any library or package.

Rules:

- Check the currently installed package versions.
- Prefer existing dependencies over installing new ones.
- Do not install a package if the required functionality can be implemented safely using existing dependencies.
- Do not blindly upgrade packages.
- Check compatibility before installing or upgrading dependencies.
- Avoid deprecated packages and APIs.
- Do not introduce unnecessary dependencies that increase bundle size.
- Update the lockfile whenever dependencies are intentionally changed.
- Explain why a new dependency is required.

Never assume that the latest version of a package is automatically compatible with this project.

---

## 7. Backend and API Development Standards

Follow the existing backend architecture and separate responsibilities properly.

For every API endpoint:

- Validate incoming request data.
- Authenticate the user where required.
- Authorize access based on roles and permissions.
- Validate ownership of requested resources.
- Handle errors consistently.
- Return appropriate HTTP status codes.
- Avoid exposing sensitive information.
- Use server-side validation for important business rules.
- Prevent unauthorized database operations.
- Avoid trusting values supplied by the frontend.

Never expose:

- Database service-role keys.
- Payment gateway secrets.
- OAuth client secrets.
- Private API keys.
- Internal server credentials.

Keep sensitive operations on the server.

Do not trust frontend-only authentication checks, role checks, payment status, pricing, or account status.

---

## 8. Supabase and Database Standards

The project uses Supabase as its database and authentication platform.

Before modifying database-related functionality:

1. Inspect the existing Supabase integration.
2. Review existing database tables and relationships.
3. Review Row Level Security (RLS) policies.
4. Understand existing authentication and session handling.
5. Check existing database migrations.
6. Identify dependencies before changing a table or column.

Rules:

- Use Supabase as the project's database source of truth.
- Do not introduce another database without explicit approval.
- Never store raw passwords.
- Enable and maintain appropriate RLS policies.
- Never expose the Supabase service-role key in frontend code.
- Perform privileged operations through secure server-side code.
- Validate all database inputs.
- Handle database errors properly.
- Avoid duplicate records and inconsistent data.
- Use database transactions or appropriate atomic operations for critical business workflows.
- Maintain referential integrity.

Never delete or modify existing database records or schema without understanding the impact.

---

## 9. Existing Business Requirements

The following requirements represent the project's established business context. Before changing any related functionality, inspect the existing implementation and preserve working behavior.

### Authentication

The application requires:

- Customer signup.
- Customer login.
- Google OAuth authentication.
- Forgot password.
- Password reset.
- Protected customer dashboard.
- Secure session management.

### User Management

The application requires:

- Admin user management.
- Admin ability to ban and unban customers.
- Server-side role verification.
- Access restrictions for banned users.
- Secure administrative operations.

Customers must never be able to assign themselves admin privileges or modify their account status.

### Appointment Booking

The application uses an existing Google Calendar appointment link:

https://calendar.app.google/qPMYTsG7UpaxcGTi8

The appointment duration is 45 minutes.

Business requirement:

- The first eligible consultation is free.
- Subsequent consultations require payment.
- Booking eligibility must be checked on the server.
- Booking and payment status must be stored reliably.

Important: Opening the existing appointment link does not automatically confirm that an appointment was successfully booked.

Never treat a link click as a confirmed appointment.

Use an appropriate confirmation or administrative verification workflow unless a reliable booking confirmation integration is implemented.

### Payments

The application must support:

- Indian customers.
- International customers.
- Appropriate payment currencies.
- Secure payment order creation.
- Server-side payment verification.
- Webhook signature verification.
- Duplicate webhook protection.
- Payment failure handling.
- Refund and cancellation handling.

Payment amounts and business pricing must always be determined and validated on the server.

Never mark a payment successful only because the frontend reports success.

Use the payment provider approved and configured for the business.

### Hosting and Deployment

The application is intended to run on:

- Hostinger VPS.
- Node.js runtime.
- Next.js application.
- Existing Express.js/Node.js backend functionality, where applicable.
- Supabase database and authentication.

Before changing deployment configuration, inspect the existing setup.

Maintain compatibility with the existing VPS environment, reverse proxy, process manager, domain, and SSL configuration.

Do not introduce static export if the application requires server-side API routes.

---

## 10. Security Standards

Security must be considered during every implementation.

Always check for:

- Authentication vulnerabilities.
- Broken authorization.
- Privilege escalation.
- SQL injection risks.
- Cross-site scripting (XSS).
- Cross-site request forgery (CSRF), where applicable.
- Insecure direct object references (IDOR).
- Improper input validation.
- Sensitive information exposure.
- Weak session handling.
- Insecure file uploads.
- Payment verification vulnerabilities.
- Rate-limiting requirements.
- Insecure environment variable handling.

Use secure defaults.

Never disable an existing security mechanism just to make a feature work.

Do not log passwords, access tokens, private keys, payment secrets, or sensitive personal information.

For security-sensitive modifications, explain the risks and the protection implemented.

---

## 11. Performance and Optimization

Write efficient and production-ready code.

Always consider:

- Avoiding unnecessary API calls.
- Avoiding unnecessary component re-renders.
- Optimizing database queries.
- Using pagination for large datasets.
- Avoiding duplicate requests.
- Lazy-loading appropriate components.
- Optimizing images and static assets.
- Avoiding unnecessary JavaScript dependencies.
- Preventing memory leaks.
- Avoiding expensive operations inside frequently executed code.

Do not sacrifice maintainability for premature optimization.

---

## 12. Responsive Design and Accessibility

Every new or modified page and component must be responsive.

Always test the UI for:

- Mobile devices.
- Tablets.
- Desktop screens.
- Different viewport widths.

Follow the existing Bootstrap responsive grid and breakpoints.

Check:

- Navigation and menus.
- Forms and validation messages.
- Buttons and clickable elements.
- Tables and dashboards.
- Modals and popups.
- Images and content overflow.
- Spacing and typography.

Use semantic HTML and accessible labels.

Ensure interactive elements are keyboard accessible.

Do not consider a UI task complete until responsiveness has been checked.

---

## 13. Error Handling and Testing

Every feature must include appropriate error handling.

Before completing a task:

1. Run the relevant lint checks.
2. Run TypeScript checks if configured.
3. Run the production build.
4. Test the primary user workflow.
5. Test important failure scenarios.
6. Check browser console errors.
7. Check server logs where applicable.
8. Check responsive behavior for UI changes.
9. Check whether existing functionality is still working.

Do not hide errors using empty catch blocks.

Do not claim a feature is tested or working unless the relevant tests or verification were actually performed.

If a test cannot be performed, explicitly document it.

---

## 14. Mandatory Code History Documentation

This requirement is mandatory.

Always maintain the following file:

`src/Codehistory/code.md`

After every implementation task, document all changes made.

Record:

- Date of the change.
- Feature or task name.
- Files created.
- Files modified.
- Files deleted, if any.
- Functionality added.
- Existing functionality modified.
- Dependencies added or updated.
- Database schema or migration changes.
- API changes.
- Security measures implemented.
- Tests and verification performed.
- Known limitations or pending work.

Use this structure:

### [Date] - [Feature/Task Name]

**Summary:**
Brief description of the work.

**Files Created:**
- List of newly created files.

**Files Modified:**
- List of modified files.

**Functionality Added:**
- List of new functionality.

**Existing Functionality Modified:**
- Explain changes to existing behavior.

**Dependencies:**
- Packages added, removed, or updated.

**Database Changes:**
- Tables, columns, policies, migrations, or queries changed.

**Security:**
- Security checks and protections implemented.

**Testing:**
- Commands executed and tests performed.
- Mention any tests that were not performed.

**Pending Tasks / Limitations:**
- Remaining work or known issues.

Important documentation rules:

- Never delete previous code history entries.
- Always append a new entry.
- Do not document functionality as completed if it is only partially implemented.
- Keep documentation accurate and up to date.
- Record actual changes, not planned changes.

---

## 15. Mandatory Workflow for Every Task

Follow this workflow for every coding request.

### Phase 1: Understand

- Read the relevant existing code.
- Inspect dependencies and architecture.
- Identify existing implementations.
- Understand the expected behavior.

### Phase 2: Plan

- Identify files that need changes.
- Identify dependencies and potential side effects.
- Define the implementation approach.
- Identify security and testing requirements.

### Phase 3: Implement

- Reuse existing components and utilities.
- Follow existing coding conventions.
- Keep changes targeted.
- Preserve existing functionality.
- Add appropriate validation and error handling.

### Phase 4: Verify

- Run relevant checks and tests.
- Verify affected workflows.
- Check responsive design.
- Review security implications.
- Fix issues introduced by the changes.

### Phase 5: Document

- Update `src/Codehistory/code.md`.
- List every file created or modified.
- Record actual functionality added or changed.
- Record testing results and pending work.

### Phase 6: Report

At the end of every task, provide a concise implementation report containing:

1. What was implemented.
2. Which files were created or modified.
3. Which existing functionalities were preserved or changed.
4. Tests and checks performed.
5. Any remaining issues or limitations.
6. Whether `src/Codehistory/code.md` was updated.

---

## 16. Strict Rules

- Do not make assumptions about existing code.
- Do not duplicate existing functionality.
- Do not remove working functionality without approval.
- Do not change the design system unnecessarily.
- Do not introduce unnecessary dependencies.
- Do not expose secrets or sensitive data.
- Do not bypass authentication or authorization.
- Do not trust frontend-only business logic.
- Do not mark unverified payments as successful.
- Do not treat appointment link clicks as confirmed bookings.
- Do not skip testing.
- Do not skip code history documentation.
- Do not claim work is complete when it is not.

## Final Principle

Think before changing code.

Understand the existing implementation, make the smallest reliable change, preserve working functionality, verify the result, and document everything.

The goal is not simply to make the requested feature work.

The goal is to maintain a secure, scalable, responsive, maintainable, and production-ready application.