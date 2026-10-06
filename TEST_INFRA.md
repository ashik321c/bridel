# Test Infrastructure & Architecture: Blushon by Rahilaa CMS

## 1. Overview & Test Architecture

The Blushon by Rahilaa Photo & Service CMS test suite provides comprehensive, opaque-box end-to-end verification of all data contracts, REST route handlers, upload pipelines, mutations, boundary conditions, cross-feature interactions, and real-world bridal studio workflows.

The test infrastructure is designed with **zero external test runner dependencies** (native Node.js 18/20/22+ ES module architecture), featuring dual-mode execution capability:
1. **Live HTTP Mode (`TEST_MODE=http`)**: Dispatches standard HTTP `fetch` requests against any running Next.js instance (default: `http://localhost:3000`).
2. **In-Process Direct Route Mode (`TEST_MODE=direct` or `auto`)**: Dispatches standard Web `Request`/`Response` objects directly into Next.js App Router Route Handlers via dynamic module loading (`jiti`), executing tests deterministically with atomic file persistence without requiring external socket bindings or ports.

```
makeup/
├── tests/
│   ├── run-all.mjs                       # Master CLI orchestrator & test runner
│   ├── helpers/
│   │   ├── test-framework.mjs            # Zero-dependency async test framework & assertions
│   │   ├── api-client.mjs                # Dual-mode (HTTP + Route Handler) API client adapter
│   │   └── fixtures.mjs                  # Authoritative fixtures derived from BRAND_CONFIG
│   ├── tier1-feature-coverage.mjs        # Tier 1: 14 feature suites, >=5 tests per feature (70 tests)
│   ├── tier2-boundary-cases.mjs          # Tier 2: 8 boundary suites, >=5 tests per boundary (40 tests)
│   ├── tier3-cross-feature.mjs           # Tier 3: 8 pairwise cross-feature interaction suites (8 tests)
│   └── tier4-application-scenarios.mjs   # Tier 4: 6 end-to-end real-world user scenarios (6 tests)
```

---

## 2. 4-Tier Test Taxonomy

### Tier 1: Feature Coverage (70 Test Cases, 14 Suites)
Verifies every individual feature in strict isolation across R1 (Portfolio), R2 (Services), and R3 (Persistence & Reset):
- **Feature R1.1 — Portfolio Listing & Retrieval (5 tests)**:
  `test_get_portfolio_returns_200_and_items_array`, `test_portfolio_items_contain_all_required_contract_fields`, `test_get_portfolio_returns_categories_array`, `test_master_cms_endpoint_returns_gallery_and_services`, `test_master_cms_endpoint_includes_valid_last_updated_timestamp`.
- **Feature R1.2 — Portfolio Creation (POST /api/cms/portfolio) (5 tests)**:
  `test_create_portfolio_item_with_full_valid_fields`, `test_created_portfolio_item_appears_in_gallery_listing`, `test_create_portfolio_item_with_different_aspect_ratios` (portrait, landscape, square), `test_create_portfolio_item_assigns_valid_order_index`, `test_create_portfolio_item_updates_cms_last_updated`.
- **Feature R1.3 — Portfolio Updating (PUT /api/cms/portfolio) (5 tests)**:
  `test_update_portfolio_item_title`, `test_update_portfolio_item_category`, `test_update_portfolio_item_image_url`, `test_update_portfolio_item_caption_and_tag`, `test_update_portfolio_item_returns_success_payload`.
- **Feature R1.4 — Portfolio Item Deletion (DELETE /api/cms/portfolio) (5 tests)**:
  `test_delete_portfolio_item_by_query_id`, `test_deleted_portfolio_item_no_longer_in_listing`, `test_gallery_length_decrements_by_one_after_deletion`, `test_delete_portfolio_item_updates_last_updated`, `test_delete_portfolio_item_leaves_remaining_items_intact`.
- **Feature R1.5 — Portfolio Gallery Reordering (PATCH /api/cms/portfolio/reorder) (5 tests)**:
  `test_reorder_portfolio_items_with_reversed_array`, `test_reordered_items_match_specified_id_order`, `test_reorder_updates_order_index_properties`, `test_move_last_item_to_first_position`, `test_reorder_updates_cms_last_updated`.
- **Feature R1.6 — Categories & Filtering (5 tests)**:
  `test_baseline_categories_include_all_5_core_bridal_types`, `test_filter_gallery_by_bridal_makeup_category`, `test_filter_gallery_by_hairstyling_category`, `test_portfolio_item_preserves_custom_category_tag`, `test_all_category_includes_complete_set_of_items`.
- **Feature R1.7 — Media Asset Upload (POST /api/cms/upload) (5 tests)**:
  `test_upload_valid_image_returns_200_and_url`, `test_uploaded_image_url_starts_with_uploads_path`, `test_upload_valid_png_file`, `test_upload_valid_jpeg_file`, `test_upload_generates_unique_filename`.
- **Feature R2.1 — Service Catalog Retrieval (GET /api/cms/services) (5 tests)**:
  `test_get_services_returns_200_and_services_array`, `test_baseline_services_include_5_core_packages`, `test_service_items_contain_all_required_fields`, `test_service_highlights_is_array_of_strings`, `test_service_core_ids_match_brand_spec`.
- **Feature R2.2 — Service Catalog Modification (PUT /api/cms/services) (5 tests)**:
  `test_update_service_name_persists`, `test_update_service_duration_persists`, `test_update_service_subtitle_and_description_persists`, `test_update_service_hero_thumbnail_image_persists`, `test_update_service_updates_cms_last_updated`.
- **Feature R2.3 — Service Highlights Checklist Editing (5 tests)**:
  `test_service_highlights_checklist_add_new_bullet`, `test_service_highlights_checklist_remove_bullet`, `test_service_highlights_checklist_edit_bullet_text`, `test_service_highlights_bullet_ordering_preserved`, `test_service_highlights_empty_list_supported`.
- **Feature R2.4 — Custom Service Creation & Deletion (5 tests)**:
  `test_create_custom_service_returns_201_and_service`, `test_created_custom_service_appears_in_services_listing`, `test_created_custom_service_preserves_all_metadata`, `test_delete_custom_service_returns_200`, `test_deleted_custom_service_no_longer_in_listing`.
- **Feature R3.1 — Data Persistence & Master State Sync (5 tests)**:
  `test_mutations_persist_across_independent_reads`, `test_last_updated_timestamp_advances_monotonically`, `test_master_endpoint_and_sub_endpoints_return_consistent_state`, `test_service_updates_reflected_in_master_cms_endpoint`, `test_cms_store_maintains_json_integrity`.
- **Feature R3.2 — Brand Defaults Reset (POST /api/cms/reset) (5 tests)**:
  `test_reset_endpoint_returns_200_and_restored_data`, `test_reset_restores_5_core_services`, `test_reset_restores_baseline_gallery_items`, `test_reset_restores_default_gallery_categories`, `test_reset_updates_last_updated_timestamp`.
- **Feature Admin UI Route Availability & Page Rendering (5 tests)**:
  `test_admin_route_returns_200`, `test_admin_cms_alias_route_returns_200_or_redirect`, `test_admin_page_contains_brand_tokens`, `test_homepage_route_returns_200`, `test_homepage_or_footer_contains_navigation_to_admin`. (M2 routes dynamically activate once M2 UI files exist).

### Tier 2: Boundary & Corner Cases (40 Test Cases, 8 Suites)
Stress tests validation, resilience, and error discipline:
- **Boundary 2.1 — Empty & Whitespace Validation (5 tests)**: Empty titles, whitespace titles, empty images, empty service names, empty service descriptions.
- **Boundary 2.2 — Max Field Lengths & Extreme Content (5 tests)**: 500-char titles, 2000-char captions, 3000-char descriptions, 100-char tags, 500-char subtitles.
- **Boundary 2.3 — Special Characters, Unicode & XSS Escaping (5 tests)**: XSS script tags stored harmlessly as literal strings, Indic/Malayalam Unicode text (`കേരള ബ്രൈഡൽ മേക്കപ്പ്`), bridal emojis (`👰‍♀️ ✨ 💄 💍 👑`), JSON escaping/quotes in descriptions, multiline newlines.
- **Boundary 2.4 — Malformed & Invalid Image URLs (5 tests)**: Protocol-less strings, `javascript:` URI rejection, FTP schemes, empty string URLs, whitespace URLs.
- **Boundary 2.5 — Upload Boundary & MIME Validation (5 tests)**: Missing `file` field, `text/plain` rejection, `application/x-sh` rejection, 0-byte files, path traversal filename sanitization (`../../evil-path.png`).
- **Boundary 2.6 — Reorder Array Boundary Cases (5 tests)**: Empty arrays, single-item arrays, duplicate IDs, non-existent IDs, non-array body rejection.
- **Boundary 2.7 — Service Highlights Checklist Boundaries (5 tests)**: 0-item highlights, 1-item highlights, 35-item highlights, special character bullets, deleting all highlights down to 0 without schema corruption.
- **Boundary 2.8 — Non-Existent IDs & Error Discipline (5 tests)**: Updating non-existent portfolio item (404), deleting non-existent portfolio item (404), updating non-existent service (404), deleting non-existent service (404), deleting without `id` query parameter (400).

### Tier 3: Cross-Feature Interactions (8 Test Cases)
Verifies multi-step state transitions and pairwise operations:
1. `test_upload_image_then_assign_to_portfolio_item`: Local image upload -> Gallery item assignment -> Verification.
2. `test_upload_image_then_assign_as_service_hero_thumbnail`: Image upload -> Service hero thumbnail assignment -> Verification.
3. `test_add_portfolio_item_reorder_to_top_then_delete`: Create item -> Reorder to index 0 -> Delete -> Order integrity of remaining items verified.
4. `test_edit_service_highlights_then_update_title_and_duration`: Update highlights -> Update title and duration -> Coexistence verified.
5. `test_create_custom_service_then_associate_new_gallery_item`: Create custom package -> Create gallery entry -> Delete custom service -> Gallery entry remains intact.
6. `test_reorder_gallery_then_add_new_item_preserves_sequence`: Reorder existing collection -> Add new item -> Sequence preserved.
7. `test_multiple_rapid_sequential_mutations_maintain_consistency`: 5 rapid sequential mutations across gallery and services -> Consistent monotonic timestamp progression verified.
8. `test_mutate_both_catalogs_then_reset_restores_clean_baseline`: Mutate both portfolio and services -> Invoke reset -> Both restored simultaneously to brand seed data.

### Tier 4: Real-World Application Scenarios (6 Test Scenarios)
Verifies end-to-end user journeys mirroring actual bridal studio management:
1. `scenario_1_bridal_gallery_curation_workflow`: Add 3 high-res bridal looks across different categories -> Reorder with custom sequence -> Edit captions/tags -> Verify complete master state.
2. `scenario_2_service_revamp_workflow`: Target Signature Bridal -> Update title, duration ("4.5 - 5 Hours"), hero image, and 6-bullet VIP checklist -> Verify across endpoints.
3. `scenario_3_mixed_media_ingestion_workflow`: Binary asset upload + external Unsplash URL -> Assign both to gallery items -> Coexistence verified.
4. `scenario_4_portfolio_pruning_and_cleanup_workflow`: Populate 4 staging photos -> Reorder -> Delete top and middle items -> Verify count decrements and no orphaned IDs remain.
5. `scenario_5_studio_demo_reset_workflow`: Destructively mutate services and gallery -> Invoke `POST /api/cms/reset` -> Verify 100% restoration of brand defaults.
6. `scenario_6_admin_ui_and_public_site_coherence_workflow`: Verify `/admin`, `/admin/cms`, `/`, brand token consistency, and navigation linkage.

---

## 3. How to Execute the Tests

### Primary Execution Command
```bash
node tests/run-all.mjs
```
or via npm:
```bash
npm test
```

### Targeted Execution by Tier
```bash
# Run only Tier 1 Feature Coverage tests
node tests/run-all.mjs --tier=1

# Run only Tier 2 Boundary & Corner Case tests
node tests/run-all.mjs --tier=2

# Run only Tier 3 Cross-Feature Interaction tests
node tests/run-all.mjs --tier=3

# Run only Tier 4 Real-World Application Scenarios
node tests/run-all.mjs --tier=4
```

### Execution Against a Live Server
```bash
# Run against a live Next.js development server
TEST_MODE=http TEST_BASE_URL=http://localhost:3000 node tests/run-all.mjs

# Or pass CLI options
node tests/run-all.mjs --mode=http --base-url=http://localhost:3000
```

### Verbose Mode with Error Tracing
```bash
node tests/run-all.mjs --verbose
```

---

## 4. Expected Output Derivation

All expected values and test assertions are authoritatively derived from:
1. `ORIGINAL_REQUEST.md`: Requirements R1, R2, R3, and Acceptance Criteria.
2. `PROJECT.md § Interface Contracts`: Data schemas (`GalleryItem`, `ServiceItem`, `CMSData`), Route Handlers (`GET`, `POST`, `PUT`, `DELETE`, `PATCH /reorder`), HTTP status codes (200, 201, 400, 404, 500).
3. `src/data/brand.ts`: Seed data constants (`BRAND_CONFIG.services`, `BRAND_CONFIG.galleryCategories`, `BRAND_CONFIG.gallery`).
