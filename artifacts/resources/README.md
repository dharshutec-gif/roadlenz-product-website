# RoadLenz Resources knowledge hub

The `/resources` page now follows the supplied knowledge-hub structure: compact editorial hero, sticky section navigator, featured shelf, video learning lane, document rack, searchable documentation, CMS FAQs, approved case studies and the existing contact/quote actions. The existing header, logo and footer are reused. Resources is a direct navigation link on desktop and mobile.

## Routes

- `/resources` — knowledge hub.
- `/resources/[slug]` — published resource detail, video and download page. Records without a slug use their stable ID. Product documents receive derived detail identifiers without creating duplicate records.
- `/api/resources/upload` — admin-only upload endpoint for Resource editor uploads.
- `/api/resources/files/[name]` — publication-aware delivery for those uploaded files, with byte-range support for video.

Existing `/resources?type=...` links scroll to the relevant hub section. Help uses `/contact`; quote buttons use `/request-quote`. No dedicated support route was fabricated.

## CMS and database changes

The existing `resources` collection and generic admin CRUD/reorder endpoints are reused. The Resource editor now supports guide, insight, video, webinar, download, checklist, documentation, case-study, FAQ and warranty types.

Additive optional fields are `slug`, `category`, `featured`, `approved`, `duration`, `pageCount`, `body`, `answer` and `relatedLinks`. Existing title, description, image, file, media, metadata, publication, display order and timestamps remain canonical. Related links shown publicly must target existing published products/solutions, supported Technology pages, or existing contact/quote routes.

- No database migration or seeded-content rewrite was needed; the fields are optional and existing records remain valid.
- No Product, Solution or Case Study records were duplicated or edited.
- Published product documents are merged into the public document catalogue and deduplicated by file URL.
- The old Resource file editor could store a single file as an array. The new single-document editor and read mapping handle those legacy values.
- FAQs use the resource title as the question and `answer` as the answer.
- Case-study resources require both publication and approval. Existing Case Studies also require their established `approved` flag.
- Authentication and the existing `admin` role are unchanged. This project has no separate SUPER_ADMIN role. Customer and anonymous writes remain denied.

## Uploads and publication

Resource uploads are stored outside `public`, in `data/resource-files/`, using random filenames. That directory is excluded from Git. Images, PDF, XLSX, MP4 and WebM are supported, up to 80 MB. File signatures are checked; images also receive metadata validation. Active SVG uploads are rejected by this resource-specific endpoint.

An uploaded file can be viewed by an administrator before publication. Public delivery requires a currently published resource to reference it; case studies also require approval. Draft, orphaned, unapproved and unpublished files return 404 to public users. Unpublishing revokes access. Delivery uses `private, no-store`, `nosniff`, bounded range parsing and controlled MIME/disposition headers. Protected thumbnails bypass image-optimizer caching so it cannot preserve a public copy after unpublishing.

The existing general upload endpoint is unchanged for other admin sections. Existing static assets under `public/media` or `public/uploads` remain public assets; use the new Resource upload controls for documents that need draft/publication protection. Arbitrary external or private URLs are not emitted by the new public resource mapping.

The shared header no longer receives the entire database as a client prop; its now-removed resource dropdown was its final use of that prop. Public pages therefore do not serialize unpublished resource data through the header.

## Files changed

- `.gitignore`
- `src/app/layout.tsx`
- `src/app/resources/page.tsx`
- `src/app/resources/[slug]/page.tsx`
- `src/app/api/resources/upload/route.ts`
- `src/app/api/resources/files/[name]/route.ts`
- `src/components/Header.tsx`
- `src/components/admin/EntityManager.tsx`
- `src/components/resources/ResourcesHub.tsx`
- `src/components/resources/ResourcesHub.module.css`
- `src/components/resources/ResourceMedia.tsx`
- `src/components/resources/ResourceDetail.tsx`
- `src/lib/types.ts`
- `src/lib/api.ts`
- `src/lib/resource-content.ts`
- `src/lib/resource-server.ts`
- `src/lib/resource-files.ts`
- `scripts/verify-resources.cjs`
- `scripts/verify-resource-delivery.cjs`
- `scripts/check-resources-browser.cjs`

Additional artifacts: this report and three viewport screenshots. Existing Products, Solutions, Industries, Technology, Cart and footer implementations were not edited. Admin changes are limited to Resource fields, resource upload routing, and loading product categories for the Resource editor.

## Verification

- `npx.cmd tsc --noEmit` — passed.
- `npm.cmd run build` — passed.
- `node scripts/verify-resources.cjs` — publication/approval filtering, private URL exclusion, documentation search, empty input, file signatures, ranges and source preservation passed.
- `node scripts/verify-resource-delivery.cjs` — real role-gate logic, admin upload, customer/anonymous denial, content validation, draft/orphan protection, publication, revocation, approval, range responses and traversal rejection passed against isolated fixtures. No real CMS records or sessions were altered by the test.
- Headless Chrome at 1536×1000, 768×1024 and 390×844 — layout, hero height, section tracking, search, download responses, video controls, menu links, detail navigation, encoding and runtime checks passed.
- Standard-motion rendering, legacy category links, unknown-resource 404, anonymous CMS denial and upload denial passed.

Browser checks use `playwright` with installed Chrome. Set `PLAYWRIGHT_MODULE` to a runtime module path when it is not installed in the project. Set `ROADLENZ_URL` to the server being reviewed; the default is `http://localhost:3000`.

## Review and content limitations

- [Desktop](desktop.png), [tablet](tablet.png), [mobile](mobile.png).
- The reference's branded covers, tutorial footage and client imagery have not been supplied. Missing thumbnails use locally rendered editorial covers; no external stock images were added.
- There is one existing local demo video and four available unique download files in the current published data. The full episode list and document rack expand as CMS content is added. The player reads its actual video duration rather than repeating the inaccurate legacy duration label.
- No FAQ answers or approved case studies are currently available. Those sections show intentional empty states instead of invented answers, testimonials or results.
- Several seeded insights/warranty items have descriptions but no article body or file. Their detail pages state that the full resource is being prepared and link to the existing contact route.
- Page-specific headline/navigation copy is static editorial copy. Resource content, metadata, files, FAQs and featured selection use the existing CMS.
- Uploaded files require persistent storage for `data/resource-files/` in a production deployment, consistent with the project's existing filesystem-backed CMS.
