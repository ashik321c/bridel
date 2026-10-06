# Project: Blushon by Rahilaa — Photo & Service Content Management System (CMS)

## Architecture
- **Framework**: Next.js 14 (App Router) + React 18 + Tailwind CSS + Framer Motion.
- **Data Layer**: Server-side JSON persistence at `data/cms-data.json` managed through Next.js Route Handlers (`/api/cms/...`) with atomic writes and automatic fallback to `BRAND_CONFIG` in `src/data/brand.ts`.
- **Media Asset Layer**: Local upload directory `public/uploads` with `POST /api/cms/upload` accepting image files, alongside support for external high-res image URLs with resilient rendering (`unoptimized` fallback to prevent unlisted domain errors in Next.js).
- **Admin CMS Dashboard**: Dedicated luxury portal at `/admin` and alias route `/admin/cms`, styled strictly with Ivory (`#FDFBF7`, `#FAF6F0`), Champagne Gold (`#C5A059`), and Deep Espresso (`#1C1512`) tokens, featuring tabbed management for Portfolio Gallery and Service Catalog.
- **Client Synchronization**: Shared hook/context `useCMSData()` initialized statically with `BRAND_CONFIG` to guarantee zero layout shift (CLS) and error-free static generation (`npm run build`), hydrating dynamically on mount and refreshing upon mutations.

## Feature Inventory
Every feature from the survey phase is cataloged and assigned to a specific milestone:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Admin Route (`/admin`) | Dedicated administrative dashboard for CMS management | M2 | User Request R1 |
| 2 | Admin Alias (`/admin/cms`) | Secondary route alias redirecting or rendering CMS | M2 | User Request R1 |
| 3 | Cross-Site Nav Links | Quick navigation between public site and admin portal | M2 | Survey Explorer 1 |
| 4 | Brand Theme Integration | Luxury Ivory, Champagne, and Espresso styling tokens | M2 | Survey Explorer 1 |
| 5 | Gallery List / Card Grid | Visual representation of portfolio photos with metadata | M2 | User Request R1 |
| 6 | Add Portfolio Item Form | Form allowing adding new photos with title, category, tag, URL/upload, aspect ratio, caption | M2 | User Request R1 |
| 7 | Edit Portfolio Item Form | Form allowing editing photo metadata and source | M2 | User Request R1 |
| 8 | Reorder Gallery Items | Move Up / Move Down buttons or sequence indices | M1, M2 | User Request R1 |
| 9 | Delete Portfolio Item | Delete item with confirmation dialogue | M2 | User Request R1 |
| 10 | Category Filter Tabs | Filter tabs: All, Bridal Makeup, Hairstyling, Engagement, Reception, Bridesmaids | M2 | User Request R1 |
| 11 | High-Res Image URL Input | Text input with instant preview thumbnail | M2 | User Request R1 |
| 12 | Local File Upload | Drag-and-drop / file picker upload saving to `/public/uploads/` | M1, M2 | User Request R1 |
| 13 | Safe Image Component | Resilient image rendering with unoptimized fallback for arbitrary domains | M3 | Survey Explorer 2 |
| 14 | Service Catalog Grid | Cards showing all bridal service packages | M2 | User Request R2 |
| 15 | 5 Core Service Packages | Pre-configured packages: Signature Bridal, Nikah Glam, Reception Couture, Fine Hairstyling, Party Glam | M1, M2 | User Request R2 |
| 16 | Edit Service Metadata | Edit service name, subtitle, category, duration, description | M2 | User Request R2 |
| 17 | Hero Thumbnail Editor | Update service hero thumbnail via URL or file upload | M2 | User Request R2 |
| 18 | Highlights Checklist Editor | Interactive dynamic checklist to add, inline edit, and delete highlight bullet points | M2 | User Request R2 |
| 19 | Add / Delete Service | Extensibility to create or remove bespoke wedding packages | M2 | User Request R2 |
| 20 | JSON File Data Store | Server-side persistence file `data/cms-data.json` with atomic writes | M1 | User Request R3 |
| 21 | RESTful API Endpoints | Route Handlers for portfolio, services, upload, and reset | M1 | User Request R3 |
| 22 | Reset to Default Seed Data | Button & API endpoint to restore initial `BRAND_CONFIG` dataset | M1, M2 | Survey Spec Miner 1 |
| 23 | Live Homepage Reflection | Changes made in CMS immediately reflect on `/` without rebuild | M3 | User Request R3 |
| 24 | Lightbox Modal Sync | Lightbox displays updated titles, categories, tags, captions | M3 | Spec Miner 1 |
| 25 | Service Details Modal Sync | Service modal displays updated descriptions and highlights checklist | M3 | Spec Miner 1 |
| 26 | Booking Modal Service Sync | Booking modal reflects active service packages | M3 | Spec Miner 1 |
| 27 | Production Build Cleanliness | `npm run build` exits with code 0 and no TypeScript/lint errors | M4 | Technical AC |
| 28 | Dev Server Cleanliness | Development server operates cleanly on port 3000 | M4 | Technical AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Data Store, Schemas & REST APIs | `data/cms-data.json`, `src/lib/cms-store.ts`, `/api/cms/...`, `/api/cms/portfolio`, `/api/cms/services`, `/api/cms/upload`, `/api/cms/reset` | none | IN_PROGRESS (Worker: fc52a220-c36e-4aae-abc0-135bcc1fa463) |
| M2 | Admin CMS Portal UI | `/admin`, `/admin/cms`, luxury ivory/champagne components, portfolio CRUD + reordering, service catalog editor + highlights checklist, file uploader & URL preview | M1 | PLANNED |
| M3 | Dynamic Site Rendering & Integration | `useCMSData` hook/context, integrate `PortfolioGallery`, `ServicesSection`, `LightboxModal`, `BookingModal`, safe image rendering, cross-site links | M1, M2 | PLANNED |
| M4 | Final E2E Test Suite & Coverage Hardening | Pass 100% of E2E tests (Tiers 1-4) published by test track, adversarial hardening (Tier 5), verification that `npm run build` exits 0 | M1, M2, M3 | PLANNED |

## Interface Contracts

### M1 ↔ M2, M3 (Data Engine & REST API)
- **Data Models**:
  ```typescript
  export interface GalleryItem {
    id: string;
    title: string;
    category: "Bridal Makeup" | "Hairstyling" | "Engagement" | "Reception" | "Bridesmaids" | string;
    tag: string;
    image: string;
    aspectRatio: "portrait" | "landscape" | "square";
    caption: string;
    orderIndex?: number;
  }

  export interface ServiceItem {
    id: string;
    name: string;
    category: string;
    subtitle: string;
    description: string;
    highlights: string[];
    image: string;
    duration: string;
  }

  export interface CMSData {
    gallery: GalleryItem[];
    galleryCategories: string[];
    services: ServiceItem[];
    lastUpdated: string;
  }
  ```

- **API Endpoints**:
  - `GET /api/cms`: Returns full `{ gallery: GalleryItem[], galleryCategories: string[], services: ServiceItem[], lastUpdated: string }`.
  - `GET /api/cms/portfolio`: Returns `{ items: GalleryItem[], categories: string[] }`.
  - `POST /api/cms/portfolio`: Adds new item, returns `{ success: true, item: GalleryItem }` (201).
  - `PUT /api/cms/portfolio`: Updates item by `item.id`, returns `{ success: true, item: GalleryItem }` (200).
  - `DELETE /api/cms/portfolio?id=[id]`: Deletes item, returns `{ success: true }` (200).
  - `PATCH /api/cms/portfolio/reorder`: Body `{ orderedIds: string[] }`, updates `orderIndex` and array order, returns `{ success: true }` (200).
  - `GET /api/cms/services`: Returns `{ services: ServiceItem[] }` (200).
  - `PUT /api/cms/services`: Updates service by `service.id`, returns `{ success: true, service: ServiceItem }` (200).
  - `POST /api/cms/services`: Creates custom service, returns `{ success: true, service: ServiceItem }` (201).
  - `DELETE /api/cms/services?id=[id]`: Deletes service, returns `{ success: true }` (200).
  - `POST /api/cms/upload`: Multipart FormData with field `file`, saves to `public/uploads/<timestamp>-<name>`, returns `{ success: true, url: string }` (200).
  - `POST /api/cms/reset`: Restores data store to default `BRAND_CONFIG` in `src/data/brand.ts`, returns `{ success: true, data: CMSData }` (200).

### M2 ↔ M3 (Client State & Components)
- `useCMSData()` hook providing:
  - `cmsData: CMSData`
  - `isLoading: boolean`
  - `error: string | null`
  - `refresh: () => Promise<void>`
  - `updatePortfolio: (item: GalleryItem) => Promise<boolean>`
  - `addPortfolio: (item: Omit<GalleryItem, "id">) => Promise<boolean>`
  - `deletePortfolio: (id: string) => Promise<boolean>`
  - `reorderPortfolio: (orderedIds: string[]) => Promise<boolean>`
  - `updateService: (service: ServiceItem) => Promise<boolean>`
  - `resetToDefaults: () => Promise<boolean>`

## Code Layout
- `data/cms-data.json`: Runtime persistent storage file (outside `src` to avoid dev HMR churn).
- `public/uploads/`: Directory for uploaded image assets.
- `src/lib/cms-store.ts`: Server-side file reading, writing, atomic save, and default initialization from `BRAND_CONFIG`.
- `src/app/api/cms/route.ts`: Master CMS GET endpoint.
- `src/app/api/cms/portfolio/route.ts`: Portfolio CRUD operations.
- `src/app/api/cms/portfolio/reorder/route.ts`: Portfolio reordering endpoint.
- `src/app/api/cms/services/route.ts`: Services CRUD operations.
- `src/app/api/cms/upload/route.ts`: Image upload endpoint with MIME and size validation.
- `src/app/api/cms/reset/route.ts`: Reset to default seed data endpoint.
- `src/context/CMSContext.tsx` & `src/hooks/useCMSData.ts`: Client-side reactive CMS state synchronization.
- `src/components/ui/LuxuryImage.tsx`: Resilient image component supporting local `/uploads/`, Unsplash, and external URLs with fallback.
- `src/app/admin/page.tsx`: Luxury Ivory & Champagne Admin CMS portal.
- `src/app/admin/cms/page.tsx`: Route alias for `/admin`.
- `src/components/admin/*`: Admin dashboard components (PortfolioManager, ServiceEditor, ImageUploader, HighlightsEditor).
- `src/components/gallery/PortfolioGallery.tsx`: Live CMS connected gallery.
- `src/components/services/ServicesSection.tsx`: Live CMS connected service catalog.
- `src/components/ui/LightboxModal.tsx`: Live CMS connected lightbox.
- `src/components/booking/BookingModal.tsx`: Live CMS connected booking service selector.
- `src/components/layout/Footer.tsx`: Subtle link to `/admin`.
- `tests/*`: E2E opaque-box test runner, test cases, and verification scripts.
