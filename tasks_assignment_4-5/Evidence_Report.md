# Assignment 4–5 — Evidence Report

## Introduction

This report records authentic observations of the existing Dielly Flowers & Bags frontend on **24 October 2026**. It accompanies the [Assignment README](README_Assignment_4-5.md) and [JavaScript Checklist](JavaScript_Checklist.md). The evidence was collected by interacting with the local site, reading rendered DOM state and browser logs, and saving genuine browser screenshots. No screenshots were generated or mocked.

The documentation run did not implement new website features. All names, contact details and passwords used for validation were synthetic test values. The checkout and authentication pages are demonstrations: no real account, order or payment was created.

The student reports verbal instructor permission for AI-assisted implementation and documentation. This is not written or independently verified authorization. The official assignment otherwise prohibits AI-generated code and project documentation. The students must disclose actual assistance and maintain their AI Log themselves; this report is not an AI Log.

## Testing Environment

| Item | Verified environment |
|---|---|
| Date / local timezone | 2026-10-24; Asia/Qyzylorda |
| Operating environment | Windows, PowerShell, existing local repository |
| Browser | Codex in-app browser, controlled through its browser testing interface; browser version was not recorded |
| Site address | `http://127.0.0.1:53145/` |
| Serving method | Existing Python 3 static HTTP server bound to `127.0.0.1`, serving the repository directory |
| Main screenshot viewport | Requested 1280 × 900 |
| Mobile screenshot viewport | Requested 375 × 812 |
| Tablet screenshot viewport | Requested 768 × 1024 |
| Page matrix | Requested widths 375, 768 and 1280, each with height 900 |
| Screenshot format | Genuine JPEG browser captures, stored in `evidence/`; most are full-page captures, E16 is a viewport capture |
| Test data | Demo Student; student-test@example.com; synthetic +7/8 telephone inputs; Test Street, 1; disposable example passwords |
| Starting Git HEAD | `07e19786de07e388bf96e61f94e917e167afab26` |
| External dependency | Existing Bootstrap 5.3.8 CDN resources loaded during this run; offline/CDN-failure behavior was not tested |

Scrollbar width reduces the document client area: at the requested mobile and tablet sizes the measured content widths were 360 and 753 CSS pixels respectively. Screenshots do not include browser chrome or the developer-tools console.

The root README's Python HTTP-server instructions use the same serving method at port 8000. This run used the already-running equivalent server at port 53145. Port 8000 and a system-wide `python` command were not separately launched or certified. Python 3 must be installed for that command to work.

## Functional Evidence

All **20 documented scenarios** below passed within their stated scope. This count is separate from the **17 screenshot files**, **21 page/viewport combinations** within E19 and **16 targeted assertions** within E20; these are not added together as one test total.

| Test ID | Feature | Page | User action | Expected result | Actual observed result | Status | Screenshot |
|---|---|---|---|---|---|---|---|
| E01 | Initial catalogue / desktop | flowers.html | Open at 1280 × 900. | Six products, count and controls. | Six cards; 6 of 6; empty shared cart. | PASS | [01_flower_catalogue_desktop.jpg](evidence/01_flower_catalogue_desktop.jpg) |
| E02 | Flower search | flowers.html | Enter `гортенз`. | Only matching products remain. | Three matching cards; 3 of 6. | PASS | [02_flower_search.jpg](evidence/02_flower_search.jpg) |
| E03 | Connected controls | flowers.html | Keep search; set budget 60000; choose cheapest first. | Search and budget combine; sort selection applies. | Two matching products remain, each 60000 KZT. Distinct-price sorting is separately verified in E20. | PASS | [03_catalogue_filter_sort.jpg](evidence/03_catalogue_filter_sort.jpg) |
| E04 | No results | flowers.html | Search for `no-such-flower`. | Zero products with explanatory feedback and reset. | No product cards; no-results text and reset remain. | PASS | [04_no_results.jpg](evidence/04_no_results.jpg) |
| E05 | Reset | flowers.html | Click Reset filters. | Restore default catalogue and controls. | Six cards return; search and budget clear; original order returns. | PASS | [05_catalogue_reset.jpg](evidence/05_catalogue_reset.jpg) |
| E06 | Add product | flowers.html | Add 101 roses. | Selection, quantity and a next action are visible. | Card shows 1 in cart; feedback provides an Order link; cart total is 50000 KZT. | PASS | [06_added_to_cart.jpg](evidence/06_added_to_cart.jpg) |
| E07 | Multiple-item cart | order.html | Also add Gucci from Bags, then open Order. | Both selections carry across pages; totals agree. | Rose subtotal 50000 plus Gucci subtotal 35000; quantity 2; total 85000 KZT. | PASS | [07_cart_multiple_items.jpg](evidence/07_cart_multiple_items.jpg) |
| E08 | Quantity calculations | order.html | Increase Gucci, decrease it, then increase again. | Every change recalculates subtotals and totals. | Totals followed 85000 → 120000 → 85000 → 120000 KZT. Screenshot shows final quantity 3 and total 120000. | PASS | [08_cart_quantity_totals.jpg](evidence/08_cart_quantity_totals.jpg) |
| E09 | Removal / clear / empty | order.html | Remove roses, then clear the remaining cart. | Removal recalculates; empty cart disables checkout. | Removal gave 70000 KZT; clear gave quantity 0 and total 0 with disabled checkout. | PASS | [09_cart_cleared.jpg](evidence/09_cart_cleared.jpg) |
| E10 | Invalid order | order.html | Add Gucci, leave delivery fields empty, submit. | Specific errors appear; first invalid field receives focus. | Four errors: name, telephone, repeated telephone and address. Active element was `order-name`. | PASS | [10_order_field_errors.jpg](evidence/10_order_field_errors.jpg) |
| E11 | Valid demo order | order.html | Correct fields with synthetic details and matching +7/8 telephone formats; submit. | Useful summary, demo reference, no real order, cleared cart. | Gucci × 1 and 35000 KZT shown with DEMO reference and explicit no-server/no-payment message; cart cleared. | PASS | [11_demo_order_confirmation.jpg](evidence/11_demo_order_confirmation.jpg) |
| E12 | Live password checklist | register.html | Enter a weak password and submit. | Checklist identifies unmet rules and a specific error. | Unmet password rules and invalid password state are visible. | PASS | [12_registration_password_checklist.jpg](evidence/12_registration_password_checklist.jpg) |
| E13 | Password mismatch | register.html | Enter different passwords satisfying complexity rules; submit. | Confirmation must exactly match. | Complexity rules pass, but confirmation is invalid; no success is shown. | PASS | [13_registration_password_mismatch.jpg](evidence/13_registration_password_mismatch.jpg) |
| E14 | Registration demo | register.html | Correct confirmation, toggle visibility, press Enter. | Show demo success; clear and conceal passwords. | Visibility toggle worked. Success explicitly says no account was created; both password fields cleared and returned to password type. | PASS | [14_registration_demo_success.jpg](evidence/14_registration_demo_success.jpg) |
| E15 | Login correction | login.html | Submit malformed email and weak password; correct them and press Enter. | Invalid values are blocked; corrected values give demo feedback. | Both invalid fields were rejected. Correction produced demo-only success and an empty password field. | PASS | [15_login_demo_success.jpg](evidence/15_login_demo_success.jpg) |
| E16 | Mobile layout | flowers.html | Request viewport 375 × 812. | Controls and cards fit without horizontal overflow. | Document client width and scroll width both 360 CSS pixels; the scrollbar accounts for the difference from the requested viewport. | PASS | [16_mobile_catalogue.jpg](evidence/16_mobile_catalogue.jpg) |
| E17 | Tablet layout | order.html | Request viewport 768 × 1024. | Form and cart fit without horizontal overflow. | Document client width and scroll width both 753 CSS pixels; form and cart remain available. | PASS | [17_tablet_order.jpg](evidence/17_tablet_order.jpg) |
| E18 | Browser console | All seven pages | Read captured error/warning logs during page checks and after interactions. | No captured errors or warnings. | Zero captured error/warning entries. This is a tool-observed result, not a screenshot of DevTools. | PASS | None; tool-observed check |
| E19 | Page / viewport matrix | All seven pages | Load each page at requested widths 375, 768 and 1280. | No overflow, broken images or duplicate IDs; correct deferred scripts and shared cart. | 21 of 21 combinations passed. Details and scope are below. | PASS | None; tool-observed check |
| E20 | Interaction edge cases | Bags / Order / Registration | Run the 16 targeted assertions listed below. | Valid actions work; invalid inputs cannot bypass the flow. | 16 of 16 assertions passed. | PASS | None; tool-observed check |

### E20 — targeted assertions

The following 16 checks were executed during this documentation run:

1. Bag search accepts uppercase `GUCCI` and returns the matching product.
2. Descending bag-price sorting places Hermès first.
3. Adding Gucci and reloading preserves its cart quantity.
4. Order quantity 0 is rejected.
5. Order quantity 1.5 is rejected.
6. Order quantity 100 is rejected against the visible demonstration limit of 99.
7. Enter in the add-quantity control adds Fendi to Gucci, giving 90000 KZT, without submitting checkout.
8. Different repeated telephone numbers are rejected.
9. An edited but unadded product selection blocks checkout with an explanation.
10. Resetting the pending selection preserves the existing 90000 KZT cart.
11. The literal test string `<img src=x onerror=alert(1)>` remains text in the order summary; no image node is inserted.
12. A password shorter than eight characters is rejected.
13. A password without uppercase letters is rejected.
14. A password without lowercase letters is rejected.
15. A password without a digit is rejected.
16. A password without a special character is rejected.

The password length behavior passes at runtime. The checklist separately identifies the official wording risk: the implementation uses a length comparison for the eight-character condition and regular expressions for the character categories.

## Screenshots

These images show actual observed states. A single screenshot does not prove an entire sequence: intermediate quantity totals, focus ownership, cleared password values and console results were also checked through the browser interface.

### E01 — Initial catalogue / desktop

Six cards; 6 of 6; empty shared cart.

![E01: Initial catalogue / desktop](evidence/01_flower_catalogue_desktop.jpg)

### E02 — Flower search

Three matching cards; 3 of 6.

![E02: Flower search](evidence/02_flower_search.jpg)

### E03 — Connected controls

Two matching products remain, each 60000 KZT. Distinct-price sorting is separately verified in E20.

![E03: Connected controls](evidence/03_catalogue_filter_sort.jpg)

### E04 — No results

No product cards; no-results text and reset remain.

![E04: No results](evidence/04_no_results.jpg)

### E05 — Reset

Six cards return; search and budget clear; original order returns.

![E05: Reset](evidence/05_catalogue_reset.jpg)

### E06 — Add product

Card shows 1 in cart; feedback provides an Order link; cart total is 50000 KZT.

![E06: Add product](evidence/06_added_to_cart.jpg)

### E07 — Multiple-item cart

Rose subtotal 50000 plus Gucci subtotal 35000; quantity 2; total 85000 KZT.

![E07: Multiple-item cart](evidence/07_cart_multiple_items.jpg)

### E08 — Quantity calculations

Totals followed 85000 → 120000 → 85000 → 120000 KZT. Screenshot shows final quantity 3 and total 120000.

![E08: Quantity calculations](evidence/08_cart_quantity_totals.jpg)

### E09 — Removal / clear / empty

Removal gave 70000 KZT; clear gave quantity 0 and total 0 with disabled checkout.

![E09: Removal / clear / empty](evidence/09_cart_cleared.jpg)

### E10 — Invalid order

Four errors: name, telephone, repeated telephone and address. Active element was `order-name`.

![E10: Invalid order](evidence/10_order_field_errors.jpg)

### E11 — Valid demo order

Gucci × 1 and 35000 KZT shown with DEMO reference and explicit no-server/no-payment message; cart cleared.

![E11: Valid demo order](evidence/11_demo_order_confirmation.jpg)

### E12 — Live password checklist

Unmet password rules and invalid password state are visible.

![E12: Live password checklist](evidence/12_registration_password_checklist.jpg)

### E13 — Password mismatch

Complexity rules pass, but confirmation is invalid; no success is shown.

![E13: Password mismatch](evidence/13_registration_password_mismatch.jpg)

### E14 — Registration demo

Visibility toggle worked. Success explicitly says no account was created; both password fields cleared and returned to password type.

![E14: Registration demo](evidence/14_registration_demo_success.jpg)

### E15 — Login correction

Both invalid fields were rejected. Correction produced demo-only success and an empty password field.

![E15: Login correction](evidence/15_login_demo_success.jpg)

### E16 — Mobile layout

Document client width and scroll width both 360 CSS pixels; the scrollbar accounts for the difference from the requested viewport.

![E16: Mobile layout](evidence/16_mobile_catalogue.jpg)

### E17 — Tablet layout

Document client width and scroll width both 753 CSS pixels; form and cart remain available.

![E17: Tablet layout](evidence/17_tablet_order.jpg)

## Browser and Responsive Verification

### E19 — seven-page matrix

Each cell represents a loaded page checked for horizontal overflow, loaded local images, unique IDs, the expected deferred local script sequence and the shared cart link.

| Page | 375 px | 768 px | 1280 px |
|---|---|---|---|
| index.html | PASS | PASS | PASS |
| about.html | PASS | PASS | PASS |
| flowers.html | PASS | PASS | PASS |
| bags.html | PASS | PASS | PASS |
| order.html | PASS | PASS | PASS |
| login.html | PASS | PASS | PASS |
| register.html | PASS | PASS | PASS |

All pages load `data.js` followed by `main.js`. Flowers and Bags additionally load `catalog.js`; Order loads `order.js`; Login and Registration load `auth.js`. All of these local script elements have `defer`.

The console interface returned zero error/warning entries during the tested navigation and interactions. No console screenshot is claimed or fabricated. This result applies to captured logs in this browser session, not all possible browsers and environments.

Enter submission was exercised on both authentication forms. Enter in the order quantity field was verified to add a product rather than accidentally submit checkout. Invalid order submission moved focus to the first invalid field. A complete keyboard-only traversal, screen-reader announcements, contrast measurement, zoom testing and a formal HTML/CSS validator run remain **NOT TESTED**.

## Error Handling

Verified invalid and empty states include catalogue no-results feedback, an empty cart with disabled checkout, four delivery-field errors, rejected quantities (zero, fractional and above the demo limit), mismatched telephone numbers, pending product selection, invalid login email/password, individual password-rule failures and password-confirmation mismatch.

Correcting invalid order and authentication fields removed outdated errors and allowed useful demo summaries. Clear/reset actions preserved the intended distinction between resetting a pending selection and clearing the cart. No validation result relied only on an alert dialog or colour.

Corrupted/unavailable browser storage recovery was verified by 18 mocked Node VM checks in the preceding integrity audit, and 13 data checks were also reported there. Those **31 previous checks are not counted as newly executed browser evidence in this report**. A new browser-level blocked-storage or cross-tab event test was not performed here.

## Source, Baseline and Git Verification

- The five JavaScript files were syntax-checked with `node --check` during the preceding integrity audit and checked again during documentation quality control.
- The original provided ZIP is `dielly-flowers (1).zip`. The student identifies it as the official `dielly-flowers.zip` submitted on 5 October 2026 and graded 85/100; the submission and grade are student-reported, not independently authenticated.
- All three CSS files match that ZIP byte-for-byte. Each of the seven HTML files matches after removing only its newly added deferred script lines: 19 added lines in total. The file-level freeze passes with the assignment's script-link exception.
- No direct implementation changes were made during documentation. Source-file and existing AI Log SHA-256 hashes were checked before and after the work.
- `git tag --list` and a successful `git ls-remote --tags origin` both returned no tags. There is no authentic Midterm tag or `assignment-4` / `assignment-5` tag to cite.
- The five JavaScript files are present but untracked; they are not ignored. No files were staged, committed, tagged or pushed during this run.
- Historical Midterm commits identify both students. They do not establish Assignment 4–5 feature ownership or prove the required new contribution history while the JavaScript remains untracked.
- Existing `Tasks/AI_Logs.docx` and `Tasks/AI_Logs.pdf` were left unchanged. Their completeness for Assignment 4–5 was not certified.

## Grading Coverage and Risks

This is a coverage review, not an instructor evaluation or grade prediction.

| Official criterion | Points | Evidence and remaining risk |
|---|---:|---|
| Real-project logic and completed visitor journeys | 20 | Catalogue → cart → validated demo order is exercised in E01–E11; auth corrections in E12–E15. No real purchase or authentication is claimed. |
| Variables, conditions, arrays, loops and functions | 16 | Exact source references are in the checklist; prior data checks were explicitly attributed above. Students must explain the implementation themselves. |
| Dynamic DOM creation/removal and states | 18 | Search/reset, card rendering, cart removal, empty state and form feedback are visible in E01–E15. |
| Theme-specific substantial features | 20 | Catalogue, cart/order and existing login/registration apply and are exercised. Reviews and bookings are outside this site's visitor journeys. Individual ownership still needs student confirmation. |
| Events and complete form validation | 14 | Submit/click/input/change/keydown source evidence; E10–E15 and E20 exercise important behavior. Literal regex wording for the password length check is a possible interpretation risk. |
| Quality, accessibility and responsiveness | 7 | E16–E19 pass the stated viewport checks; keyboard and focus checks cover selected actions only. Formal validators and full assistive-technology coverage remain untested. |
| README, checklist, evidence, tags and commits | 5 | Documentation and evidence are present. Untracked files, absent tags, unverified feature ownership/contribution schedule and the student-maintained AI Log remain submission gaps. |

The official penalties are **−15** for jQuery/framework/copied widget; **−10 per** directly added HTML block or CSS feature after the freeze; **−10 per** incomplete core flow; **−5 per** console error, broken control, loose equality, inline event or unsafe user-input insertion; and **−5** for irrelevant JavaScript. These are the published rules, not deductions assigned by this report. Existing Bootstrap was already present in the Midterm baseline.

No tested core-flow failure or console error was found in this run. The static restriction checks and freeze evidence are recorded in the checklist. The AI prohibition creates an unresolved authorization-evidence risk unless the instructor accepts the student-reported verbal exception; this report does not invent a numeric penalty for it. The official defense rule states that no defense or inability to explain the code results in zero.

## Limitations

- This is one local in-app browser environment. Firefox, Safari, other browser versions and actual mobile devices were not tested.
- Screenshots are authentic state evidence, not proof of production security, exhaustive accessibility or every possible input.
- The static server serves files; there is no application backend, database, real payment, account registration or authentication service.
- Browser cart storage is device/origin-specific; it is not a server-backed order record.
- New browser-level storage failure/cross-tab testing, network capture, automated accessibility analysis and formal HTML/CSS validation were not performed.
- The report cannot verify verbal instructor permission, Moodle submission metadata, grades or student contributions.
- The students must confirm at least two substantial features per teammate plus participation in the shared functionality, maintain their own truthful AI Log, resolve genuine Git milestones and meet the defense requirements. History must not be fabricated or backdated.

## Final Verification Summary

The documentation run produced **17 authentic screenshot files** and **20 passing evidence scenarios**, including **21 passing page/viewport checks** and **16 passing targeted edge-case assertions**. Captured browser error/warning logs were empty. The implemented frontend remains unchanged, and the original CSS/HTML freeze comparison passes apart from the permitted script links.

The documents are complete as technical records. The submission is **not yet Git-complete**: JavaScript/documentation/evidence must be intentionally included in the student's eventual submission, genuine milestones and contributions must be resolved, responsibility entries need human confirmation, and the students' own AI Log and defense preparation remain their responsibility.

