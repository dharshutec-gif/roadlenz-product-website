# RoadLenz admin upgrade implementation plan

Goal: implement the attached enterprise admin requirements inside the existing project, preserve public/customer data and add visible live updates plus protected Supabase synchronization.

Spec: user attachment `C:/Users/acer/.codex/attachments/ba3c2f83-c109-4399-8890-ca55705d222f/pasted-text.txt` and supplied admin reference.

Architecture: existing `readDb/mutateDb`, scrypt/session-cookie auth and IDs remain canonical by default. Optional `Db.admin` holds quotations, inventory history, media, audit and notification-read state. Product `images` supplements the existing `image/gallery` fields. Server-only synchronization mirrors durable changes into access-restricted Supabase tables; failures are surfaced and retryable. No customer data or session/password material is exposed through admin snapshots to unauthenticated clients.

Execution: subagent-driven implementation with shared typed contracts in `src/lib/admin-types.ts`; root reviews and integrates each owned module. No Git repository exists. Backup: `artifacts/admin-upgrade-backup-1789417536725`.

- [x] Phase 1–2: read requirements, audit existing contracts, back up source/data, baseline TypeScript (zero errors).
- [ ] Phase 3: test/fix disabled accounts, server username resolution, role checks, primary-admin protection, hashed password changes and session revocation. Owners: security agent; root owns shared type declarations.
- [ ] Phase 4: route-backed compact navy shell, live dashboard and notification refresh, existing CMS preserved. Owner: interface agent.
- [ ] Phase 5–7: products/category CRUD, gallery upload+URLs, inventory adjustment history, protected deletion and public legacy gallery synchronization. Owner: catalogue agent.
- [ ] Phase 8–11: customers, demo/enquiry/support management, exact quotation arithmetic, PDF, order conversion and shared customer records. Root backend; interface agent frontend.
- [ ] Phase 12: secure media library, MIME/size checks and reference-aware deletion. Catalogue agent.
- [ ] Phase 13–16: security/admin users, audit, settings, real-data reports/CSV and per-admin notification reads. Security agent owns account UI/APIs; root owns operations APIs; interface agent owns remaining views.
- [ ] Supabase: discover existing schema read-only, apply additive schema when credentials available, transactional versioned mirror with safe keys, durable retry and visible status. Root.
- [ ] Phase 17: tests for all security cases, products/gallery/inventory, quotations/totals and authorization; TypeScript after modules; clean isolated build; route response checks; final review and preservation report.

Shared interfaces: `adminStore(db): AdminStore`, `recordAdminActivity(db, {userId,name}, action,module,recordId,description)`. `/api/admin/console` GET returns `AdminSnapshot` directly. `/api/admin/operations` POST accepts `{action,...fields}` for customer/create/update, request/update, quotation/save/status/duplicate/convert, notifications/read, settings/save. Catalogue uses `/api/admin/catalogue/[...path]`; security uses `/api/admin/users` and `/api/admin/security`. Client refresh event: `roadlenz:admin-refresh`; snapshot polling every 5 seconds while visible, immediate focus/mutation refresh, never remount open editors.

External dependency: server-only Supabase credential (and database URL or user-applied SQL) is required before claiming remote synchronization is operational. Public anon key alone must not be given write access to private business data.
