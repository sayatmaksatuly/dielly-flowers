# JavaScript Checklist — Assignment 4–5

**Project:** Dielly Flowers & Bags · **Course:** Web Technologies 1 (Front End) · **Review date:** 24 October 2026

This checklist follows the supplied official `Assignment_4-5_JavaScript (1).docx` and the current repository. It records implementation evidence and remaining submission work; it is not an instructor grade.

**Coverage:** 113 requirement rows: 94 PASS, 5 PARTIAL, 4 FAIL, 7 NOT TESTED and 3 NOT APPLICABLE. The core JavaScript sections (Assignment 4, Assignment 5, cart/order, validation and authentication) contain 74 rows: 73 PASS and 1 PARTIAL. Remaining rows cover conditional modules, quality, Git and submission. These are checklist entries, not automated test counts or grading points.

## How to read the evidence

- **PASS:** the stated source requirement is present, or the stated behavior has been observed in testing.
- **PARTIAL:** part of a requirement is demonstrated, but a limitation or missing verification remains.
- **FAIL:** a required item is demonstrably absent from the inspected repository.
- **NOT APPLICABLE:** the conditional module does not logically belong to this project.
- **NOT TESTED:** no sufficient verification is available; source alone does not establish a runtime or human-performance claim.

Line numbers below are one-based and refer to the actual files reviewed: `data.js` 105 lines, `main.js` 161, `catalog.js` 201, `order.js` 376 and `auth.js` 223. Ranges identify the relevant implementation, not a suggested change. A dash means that the requirement concerns Git, a whole-file scan, a document, or a human action rather than a particular statement.

The preceding implementation-integrity audit in this Codex conversation reported **67 passing browser checks and 31 passing data/storage checks** on these implementations. Those figures are attributed to that earlier audit, not presented as newly executed tests for this document. Its browser results covered both catalogues, cart arithmetic and persistence, invalid/valid order flows, authentication validation, seven pages at 375/768/1280 px, navigation, images and recorded console errors. The data/storage checks included a Node VM with mocked DOM/storage/events; they were not real cross-tab or screen-reader tests.

For this documentation run, [Evidence_Report.md](Evidence_Report.md) records fresh tests **E01–E20**, including 17 authentic screenshot captures, a console-log inspection, 21 page/viewport combinations and 16 supplementary assertions. Source and runtime evidence are kept separate: static rows cite the actual code; runtime PASS rows are supported by the fresh tests mapped below and, where explicitly stated, the preceding audit. No screenshot is a substitute for the action/result test behind it.

| Fresh test IDs | Verified coverage |
|---|---|
| E01–E06 | Initial flower cards, matching search, combined budget/sort, no results, reset and add to cart |
| E07–E09 | Flower and bag together, quantity arithmetic, removal, clear and empty checkout state |
| E10–E11 | Four checkout-field errors, first-invalid focus, corrected phone comparison and valid demo order |
| E12–E15 | Password checklist, mismatch, Show/Hide control, corrected registration/login and erased passwords |
| E16–E19 | Mobile/tablet captures, console observation and seven pages at 375/768/1280 px |
| E20 | Bag search/sort, reload persistence, invalid quantities, Enter-to-add, phone mismatch, pending-selection prevention, safe text insertion and five isolated password-rule checks |

The student reports a personal verbal instructor exception allowing AI-assisted implementation and documentation. This is **not written authorization and has not been independently verified**. The official document prohibits AI-generated code and project documentation without such an exception. AI assistance is disclosed here; the students must prepare their own truthful AI Log. Existing AI Log files have not been edited for this checklist.

## Assignment 4 — Data and reusable logic

| Requirement | Status | File | Exact Lines | Evidence / Explanation |
|---|---|---|---|---|
| A4-01 — At least six real-project product objects | PASS | [data.js](../js/data.js) | 5–16 | Ten catalogue objects: six flowers and four bags. They use the existing project products and prices, rather than unrelated demonstration data; live stock or current retail availability is not claimed. |
| A4-02 — At least four meaningful properties per object | PASS | [data.js](../js/data.js) | 6–15 | Every product has `id`, `category`, `name`, numeric `price`, `description`, `image`, `alt`, `badge` and `imageClass`. |
| A4-03 — Appropriate variables and data types | PASS | [data.js](../js/data.js); [main.js](../js/main.js) | data: 5–17, 89–95; main: 9–11 | Products are objects in an array; prices/quantities/totals are numbers, labels/IDs are strings, and storage availability is boolean. |
| A4-04 — Array traversal | PASS | [data.js](../js/data.js) | 52–63, 91–94 | `for...of` normalizes cart entries and accumulates totals. Prior data checks verified the resulting quantities and prices. |
| A4-05 — Filtering and finding | PASS | [data.js](../js/data.js) | 19–20, 29–43, 57, 73–75 | `find()` resolves product IDs; `filter()` combines category, text and budget, and removes a zero-quantity line. Prior browser/data tests exercised these behaviors. |
| A4-06 — Transformation and totalling | PASS | [data.js](../js/data.js) | 84–95 | `map()` transforms cart entries into product/quantity/subtotal rows; traversal computes total quantity and price. Prior cart arithmetic checks passed. |
| A4-07 — Four reusable functions with parameters and return values | PASS | [data.js](../js/data.js) | 19–26, 29–43, 47–64, 67–81, 84–95 | Six qualifying functions: `getProduct(id)`, `formatMoney(amount)`, `selectProducts(...)`, `normalizeCart(items)`, `setCartQuantity(...)` and `getCartSummary(items)`. |
| A4-08 — One function calls another | PASS | [data.js](../js/data.js) | 67–69, 84–87 | `setCartQuantity()` calls normalization/product lookup; `getCartSummary()` calls normalization and product lookup. |
| A4-09 — Meaningful arithmetic | PASS | [data.js](../js/data.js); [order.js](../js/order.js) | data: 37–39, 59, 87–93; order: 158, 189, 199 | Price comparisons, quantity addition/subtraction, price × quantity and accumulated totals are connected to the visitor flow. |
| A4-10 — `if/else` or `switch` | PASS | [data.js](../js/data.js) | 36–42, 58–62, 72–80 | Branches select sorting, merge duplicate cart entries, and update/remove items. |
| A4-11 — At least two logical operators | PASS | [data.js](../js/data.js) | 33–34, 53–54, 69 | `&&`, `\|\|` and `!` combine search rules and reject invalid cart data. |
| A4-12 — Strict `===` | PASS | [data.js](../js/data.js) | 20, 33–34, 72 | Strict comparison is used for IDs, categories, optional budget and zero quantity. |
| A4-13 — Strict `!==` | PASS | [data.js](../js/data.js); [main.js](../js/main.js) | data: 53, 73; main: 59 | Strict inequality checks object type, retains other IDs when removing an item and distinguishes JSON syntax errors. |
| A4-14 — Meaningful `Math.random()` | PASS | [data.js](../js/data.js); [order.js](../js/order.js) | data: 98–100; order: 343–345 | A `DEMO-` reference labels a completed frontend demonstration. The code explicitly does not guarantee a unique transaction ID or real order. Prior valid-order test observed a reference. |
| A4-15 — Functional, reusable data logic | PASS | [data.js](../js/data.js) | 19–104 | Data operations are independent of DOM APIs and reused by catalogues/cart/order. Prior 13 data checks verified filtering, immutable source sorting, normalization, limits and totals. |

## Assignment 5 — Files, DOM and events

| Requirement | Status | File | Exact Lines | Evidence / Explanation |
|---|---|---|---|---|
| A5-01 — `js/` directory and clear file structure | PASS | [data.js](../js/data.js), [main.js](../js/main.js), [catalog.js](../js/catalog.js), [order.js](../js/order.js), [auth.js](../js/auth.js) | Whole files: 1–105; 1–161; 1–201; 1–376; 1–223 respectively | All five non-empty files exist; no missing placeholder file. Git tracking is assessed separately below. |
| A5-02 — Shared behavior in `main.js` | PASS | [main.js](../js/main.js) | 13–50, 53–160 | Shared element/error helpers, cart API, persistence and navigation badge are used across pages. Cross-page cart navigation/persistence passed the preceding browser audit. |
| A5-03 — Page-specific behavior | PASS | [catalog.js](../js/catalog.js); [order.js](../js/order.js); [auth.js](../js/auth.js) | catalog: 4–9; order: 4–8; auth: 4–18 | Catalogue script supports Flowers/Bags, order script initializes the order form, and auth script selects Login or Registration. Guards prevent duplicate initialization. |
| A5-04 — Correct script order and `defer` on all seven pages | PASS | [index.html](../index.html), [about.html](../about.html), [flowers.html](../flowers.html), [bags.html](../bags.html), [order.html](../order.html), [login.html](../login.html), [register.html](../register.html) | index/about: 12–13; other five pages: 12–14 | Every page loads `data.js` then `main.js`; catalogue/order/auth pages then load their respective behavior. All 19 local script tags have `defer`; prior seven-page browser check confirmed initialization. |
| A5-05 — `'use strict'` | PASS | All five JavaScript files linked above | 1 in each file | Every JavaScript file begins with the strict-mode directive. |
| A5-06 — `const` by default; `let` for changing bindings | PASS | [data.js](../js/data.js); [main.js](../js/main.js); [auth.js](../js/auth.js) | data: 5, 17, 89–90; main: 9–11, 24; auth: 19–20, 72, 184 | Stable bindings use `const`; accumulators, mutable cart state and changing validation state use `let`. A fresh scan found no `var` declaration in the five source files. |
| A5-07 — Dynamic element creation | PASS | [main.js](../js/main.js); [catalog.js](../js/catalog.js) | main: 13–19; catalog: 82–111 | The `el()` helper uses `document.createElement()`; one reusable function creates product cards. Prior browser audit observed the generated controls/cards. |
| A5-08 — DOM removal | PASS | [catalog.js](../js/catalog.js); [order.js](../js/order.js); [auth.js](../js/auth.js) | catalog: 131–156; order: 178, 367; auth: 122–124, 203 | `replaceChildren()` removes obsolete cards, cart rows and messages before rendering new content. Search empty states, cart removal and refreshed results were observed. |
| A5-09 — Repeated items rendered from the array | PASS | [catalog.js](../js/catalog.js) | 82–111, 150–157 | `products.map(createProductCard)` renders both catalogues from the shared dataset. Six flower cards and four bag cards were verified. |
| A5-10 — Reusable rendering functions | PASS | [catalog.js](../js/catalog.js); [order.js](../js/order.js) | catalog: 82–111, 137–159; order: 175–230 | `createProductCard()`, `renderProducts()` and `renderCart()` serve repeated actions, rather than separate copied markup per product. |
| A5-11 — `classList` states | PASS | [main.js](../js/main.js); [catalog.js](../js/catalog.js); [auth.js](../js/auth.js) | main: 36–39, 47–49; catalog: 121–124, 142, 192–194; auth: 89–91 | Existing classes express hidden, selected, invalid, valid and success/warning states. Dynamic selection and field-error states passed prior browser checks. |
| A5-12 — `textContent` and safe user text | PASS | [main.js](../js/main.js); [order.js](../js/order.js); [auth.js](../js/auth.js) | main: 13–19, 35; order: 346–355; auth: 197–203 | User names, email summaries, address and optional card text reach DOM text via `el()`. The prior order test rendered `<img src=x onerror=alert(1)>` as text with no inserted image. Fresh source scan found no `innerHTML` assignment. |
| A5-13 — `addEventListener()` | PASS | [catalog.js](../js/catalog.js); [order.js](../js/order.js); [auth.js](../js/auth.js) | catalog: 166–199; order: 232–314; auth: 50–56, 147–176 | Event listeners connect generated controls and forms to the application. |
| A5-14 — `click` events | PASS | [catalog.js](../js/catalog.js); [order.js](../js/order.js) | catalog: 176–198; order: 188–208, 232–279 | Reset, delegated add-to-cart, quantity, removal and clear actions use clicks; the preceding browser audit exercised these controls. |
| A5-15 — `submit` events | PASS | [order.js](../js/order.js); [auth.js](../js/auth.js) | order: 314–370; auth: 176–220 | Form submit handlers prevent navigation, validate fields and show a useful result. Browser tests covered invalid and valid submissions. |
| A5-16 — Third appropriate event type | PASS | [catalog.js](../js/catalog.js); [order.js](../js/order.js); [auth.js](../js/auth.js) | catalog: 173–175; order: 267–274, 283–303; auth: 147–174 | `input`, `change`, `keydown` and `focusout` supplement click/submit. Live filtering, password updates and Enter behavior were observed. |
| A5-17 — Connected search/filter/sort controls | PASS | [catalog.js](../js/catalog.js); [data.js](../js/data.js) | catalog: 17–59, 137–175; data: 29–43 | Search text, maximum price and sort order combine on each catalogue. Prior browser tests covered matching/empty results, price ordering and invalid budgets. |
| A5-18 — Matching result counts | PASS | [catalog.js](../js/catalog.js) | 62–65, 150–154 | Count updates to matching products out of the category total; exposed as a status message. |
| A5-19 — No-results and invalid-filter states | PASS | [catalog.js](../js/catalog.js) | 131–147, 153–154 | Zero matches and invalid budgets replace the product list with explanatory text and recovery guidance. Both states were browser-tested. |
| A5-20 — Reset controls | PASS | [catalog.js](../js/catalog.js); [order.js](../js/order.js) | catalog: 66–68, 176–180; order: 252–264 | Catalogue reset restores default controls/results and focuses search. Order selection reset preserves the existing cart. Prior browser tests confirmed both. |
| A5-21 — Meaningful calculation/selection flow | PASS | [data.js](../js/data.js); [order.js](../js/order.js) | data: 84–95; order: 154–160, 175–218, 341–369 | Selection leads to cart quantities, recalculated totals and a demo summary. Fresh E07–E11 combined a flower and bag at KZT 85,000, verified mutations and completed a demonstration order. |
| A5-22 — Empty state for variable generated lists | PASS | [catalog.js](../js/catalog.js); [order.js](../js/order.js) | catalog: 131–156; order: 80–97, 216–218 | Search lists show no-results guidance; an empty cart shows recovery guidance and disables checkout. Fixed password-rule and sort-option lists are not user-deletable variable lists. |
| A5-23 — Clear feedback after actions | PASS | [catalog.js](../js/catalog.js); [order.js](../js/order.js) | catalog: 72–79, 190–197; order: 188–208, 243, 262, 277–279, 343–369 | Add, quantity, remove, clear, invalid submit and successful demo produce text feedback. PASS applies to the tested visitor flows, not an exhaustive claim over every possible browser state. |

## Cart and order

| Requirement | Status | File | Exact Lines | Evidence / Explanation |
|---|---|---|---|---|
| C-01 — Prepared cart container | PASS | [order.html](../order.html); [order.js](../js/order.js) | HTML: 82–85; JS: 16, 80–97 | The existing `order-summary` container is reused as the cart, satisfying the prepared-container alternative to a Bootstrap modal. |
| C-02 — Add to cart | PASS | [main.js](../js/main.js); [catalog.js](../js/catalog.js); [order.js](../js/order.js) | main: 94–99; catalog: 181–197; order: 232–250 | Add works from either catalogue and from the order selector; the shared quantity/count updates. Prior browser test observed catalogue-to-order transfer. |
| C-03 — Increase quantity | PASS | [order.js](../js/order.js) | 193–200 | The +1 button updates shared state and rerenders totals. Fresh E08 changed total KZT 85,000 to KZT 120,000. |
| C-04 — Decrease quantity | PASS | [order.js](../js/order.js) | 184–191 | The −1 button subtracts one; reaching zero removes the line. Fresh E08 restored KZT 85,000 after decrement before increasing again. |
| C-05 — Remove product | PASS | [order.js](../js/order.js); [data.js](../js/data.js) | order: 202–208; data: 72–73 | Remove calls the shared zero-quantity operation. Fresh E09 removed the flower from the KZT 120,000 selection and retained two Gucci bags totaling KZT 70,000. |
| C-06 — Clear cart | PASS | [main.js](../js/main.js); [order.js](../js/order.js) | main: 106–108; order: 277–279 | Fresh E09 cleared the remaining KZT 70,000 cart to zero with disabled checkout. Successful demonstration also clears the cart at order line 357, observed in E11. |
| C-07 — Line subtotals | PASS | [data.js](../js/data.js); [order.js](../js/order.js) | data: 85–87; order: 211 | Each line uses authoritative product price × quantity; stored price values are ignored. Prior data/cart checks verified arithmetic. |
| C-08 — Total quantity | PASS | [data.js](../js/data.js); [order.js](../js/order.js) | data: 89–95; order: 214 | Quantity is summed from normalized lines and rendered after cart changes. |
| C-09 — Total price after every cart change | PASS | [main.js](../js/main.js); [order.js](../js/order.js) | main: 74–82; order: 215, 305–312 | Mutations dispatch `dielly:cartchange`; the order handler recalculates/renders totals. Add/increase/decrease/remove were verified at runtime. |
| C-10 — Empty cart and disabled checkout | PASS | [order.js](../js/order.js) | 82–83, 216–218, 335–339 | Empty cart has explanatory text, disabled clear/checkout buttons and a submit guard. Browser test verified empty state after success. |
| C-11 — Demonstration summary/reference only | PASS | [order.js](../js/order.js); [data.js](../js/data.js) | order: 341–369; data: 98–100 | Result lists choices, quantities and price, with an explicit no-server/no-real-order/no-payment message and temporary reference. |
| C-12 — Persistent non-sensitive cart and graceful fallback | PASS | [main.js](../js/main.js); [data.js](../js/data.js) | main: 53–82, 128–160; data: 47–64 | Only versioned ID/quantity data is persisted. Prior browser reload check passed; prior 18 mocked-storage checks covered corrupted data, unavailable storage, warning, fallback and refresh handlers. Actual cross-tab event delivery is not claimed. |
| C-13 — Quantity limits and unfinished selections | PASS | [order.js](../js/order.js) | 137–144, 266–274, 318–333 | Integer quantity is 1–99 with a combined cart cap; pending additions cannot silently disappear during checkout. Prior browser checks rejected zero/fractional quantities and unfinished additions; Enter added the item instead of checking out. |

## Form validation

| Requirement | Status | File | Exact Lines | Evidence / Explanation |
|---|---|---|---|---|
| V-01 — One complete important form flow | PASS | [order.js](../js/order.js) | 232–250, 282–370 | Order combines product/quantity addition with delivery validation, invalid states and a useful demo summary. It was tested from catalogue selection through confirmation. |
| V-02 — At least four validated fields | PASS | [order.js](../js/order.js) | 114–146, 282–283, 318–320 | Six fields across the order flow: name, telephone, repeated telephone, address, selected product and quantity. Product/quantity validate during addition; contact fields validate on checkout. |
| V-03 — Trimmed required text | PASS | [order.js](../js/order.js); [auth.js](../js/auth.js) | order: 115–118, 130–132; auth: 95–104, 168–182 | Whitespace-only names/addresses are rejected. Auth trims names/email. Order summaries use trimmed values. Prior whitespace-name and required-field tests passed. |
| V-04 — Contact validation | PASS | [order.js](../js/order.js); [auth.js](../js/auth.js) | order: 104–111, 120–128; auth: 99–104 | Telephone accepts an 11-digit +7/8 form with formatting characters; email uses regex and native type-mismatch checking. This validates format, not actual ownership or deliverability. |
| V-05 — Numeric or selection rule | PASS | [order.js](../js/order.js) | 134–144, 232–250 | Product must resolve to a known catalogue ID; quantity must be an integer within limits. No date field is needed for this product-order flow. |
| V-06 — Cross-field condition | PASS | [order.js](../js/order.js); [auth.js](../js/auth.js) | order: 123–128, 142–144; auth: 113–117 | Repeated phone must match after normalization; added amount plus existing quantity cannot exceed 99. Registration also requires exact password confirmation. Prior mismatch tests passed. |
| V-07 — Specific errors beside fields | PASS | [main.js](../js/main.js); [order.js](../js/order.js) | main: 22–40; order: 114–151 | Shared helper creates adjacent feedback, connects `aria-describedby`, and sets `aria-invalid`; messages explain the field's correction. |
| V-08 — First-invalid-field focus | PASS | [order.js](../js/order.js); [auth.js](../js/auth.js) | order: 237–238, 325–326; auth: 184–194 | Prior browser tests verified order name/login email focus after invalid submission. The source also covers selection validation focus. |
| V-09 — Clear outdated errors/results | PASS | [main.js](../js/main.js); [order.js](../js/order.js); [auth.js](../js/auth.js) | main: 34–50; order: 283–310, 357–364; auth: 147–173, 216–219 | Corrected input refreshes errors; editing hides old results; completion removes old field state. Prior valid-submit tests observed no stale invalid fields. |
| V-10 — Invalid and valid states | PASS | [main.js](../js/main.js) | 34–40 | `is-invalid`/`is-valid`, explanatory text and `aria-invalid` work together. Validation does not depend on color alone. |
| V-11 — Useful success summary | PASS | [order.js](../js/order.js); [auth.js](../js/auth.js) | order: 342–355; auth: 197–203 | Order summarizes delivery details/products/totals; auth confirms checked fields without echoing passwords. Browser tests observed both. |
| V-12 — Explicit demo messaging and no `alert()` validation | PASS | [order.js](../js/order.js); [auth.js](../js/auth.js) | order: 343–345; auth: 201–202 | Messages state no data is sent and no real transaction/account/login occurs. Validation is in-page; no alert-based validation appears in the source. |

## Login and registration

| Requirement | Status | File | Exact Lines | Evidence / Explanation |
|---|---|---|---|---|
| L-01 — Password policy expressed through regular expressions | PARTIAL | [auth.js](../js/auth.js) | 32–37, 106–117 | Four character-class rules use regex; minimum length uses `value.length >= 8`. All five behaviors work, but a literal reading of “use regular expressions to require at least eight characters” is not fully demonstrated. This is an interpretation risk, not a demonstrated runtime failure or specified numeric penalty. |
| L-02 — Minimum eight characters | PASS | [auth.js](../js/auth.js) | 33, 110–111 | The length predicate is enforced together with all other rules; the prior isolated short-password test failed validation as expected. |
| L-03 — Uppercase letter | PASS | [auth.js](../js/auth.js) | 34 | Unicode `\p{Lu}` rule; prior isolated missing-uppercase test was rejected. |
| L-04 — Lowercase letter | PASS | [auth.js](../js/auth.js) | 35 | Unicode `\p{Ll}` rule; prior isolated missing-lowercase test was rejected. |
| L-05 — Digit | PASS | [auth.js](../js/auth.js) | 36 | `[0-9]` rule; prior isolated missing-digit test was rejected. |
| L-06 — Special character | PASS | [auth.js](../js/auth.js) | 37 | Non-letter/non-number/non-whitespace rule; prior isolated missing-special-character test was rejected. |
| L-07 — Live password checklist | PASS | [auth.js](../js/auth.js) | 60–70, 86–92, 147–155 | `input` updates each rule's text and class; `aria-live="polite"` exposes changes. Prior browser test observed all rules update; actual screen-reader announcements remain untested. |
| L-08 — Exact confirmation | PASS | [auth.js](../js/auth.js) | 72–83, 113–117, 154–155 | Registration adds a second password field and compares exact values. Passwords are not trimmed. Prior mismatch/correction tests passed. Login correctly has no confirmation field. |
| L-09 — Accessible Show/Hide Password control | PASS | [auth.js](../js/auth.js) | 40–57, 82 | Real buttons toggle input type and update text, `aria-controls`, `aria-pressed` and accessible name. Prior browser checks verified both password and confirmation toggles. This is not a full assistive-technology certification. |
| L-10 — No fake authentication | PASS | [auth.js](../js/auth.js) | 24, 197–209 | Successful validation explicitly says that no account is created and no login occurs. The order is usable without registration. |
| L-11 — No password persistence or output | PASS | [auth.js](../js/auth.js); [main.js](../js/main.js) | auth: 138–144, 197–219; main: 66–76 | Password values remain in the input/validation operation only, are excluded from summaries/storage and cleared on success. `fields` is an array of DOM references, not stored password strings. Shared storage holds cart IDs/quantities only. Prior tests observed erased/concealed passwords after success. |

## Conditional theme modules

| Requirement | Status | File | Exact Lines | Evidence / Explanation |
|---|---|---|---|---|
| T-01 — Reviews/comments module, shared review renderer, date/time and character counter | NOT APPLICABLE | [order.html](../order.html); [order.js](../js/order.js) | HTML: 78–79; JS: 354–355 | The site has no public review feed, rating service or visitor-comment module. The optional order field is a private greeting-card message shown in the demo order, not a review. No review-module compliance is claimed. |
| T-02 — Catalogue module | PASS | [data.js](../js/data.js); [catalog.js](../js/catalog.js) | data: 5–43; catalog: 17–59, 137–198 | Products are the site's core purpose. Search, budget and sorting are connected, with count, no-results/reset and a meaningful add-to-cart next action. |
| T-03 — Cart/order module | PASS | [order.js](../js/order.js) | 80–97, 175–279, 314–370 | Selling flowers/bags makes cart/order applicable. Prepared container, mutations, totals, empty state and demo result were exercised. |
| T-04 — Booking/appointment module | NOT APPLICABLE | [order.html](../order.html); [order.js](../js/order.js) | HTML: 46–95; JS: 114–146, 341–355 | This is a product order demonstration without appointment slots, participant counts or date booking. No availability or real booking confirmation is offered. |
| T-05 — Login/registration module | PASS | [login.html](../login.html); [register.html](../register.html); [auth.js](../js/auth.js) | login: 50–69; register: 50–71; auth: 4–24, 176–220 | Both pages existed at Midterm, so front-end validation applies. They are implemented as explicit demonstrations; the literal regex caveat is recorded in L-01. |

## Quality and prohibited techniques

| Requirement | Status | File | Exact Lines | Evidence / Explanation |
|---|---|---|---|---|
| Q-01 — Keyboard accessibility of tested actions | PARTIAL | [order.js](../js/order.js); [auth.js](../js/auth.js) | order: 219–227, 266–274, 325–332; auth: 184–209 | Enter-to-add, Enter-to-submit and first-invalid-field focus passed prior browser checks. A complete keyboard-only traversal of every control, all focus transitions and every viewport has not been certified. |
| Q-02 — Real button semantics | PASS | [catalog.js](../js/catalog.js); [order.js](../js/order.js); [auth.js](../js/auth.js) | catalog: 66–68, 103–107; order: 69–74, 90–92, 184–208, 372; auth: 23, 42–47 | Actions use native buttons with explicit type; navigation remains links. Submit types are changed through DOM, preserving the frozen HTML. |
| Q-03 — Focus visibility on all controls | NOT TESTED | [base.css](../css/base.css); [auth.js](../js/auth.js) | CSS: 73–75; auth: 193, 209 | Existing input/select focus styles and Bootstrap are present, but this is not sufficient evidence for every button/link and keyboard focus state. Student should perform a visual keyboard sweep. |
| Q-04 — Clear feedback beyond color | PASS | [main.js](../js/main.js); [catalog.js](../js/catalog.js); [auth.js](../js/auth.js) | main: 26–39; catalog: 131–154, 195–197; auth: 86–92 | Errors, empty states, selected quantities and checklist outcomes are written in text. Prior browser checks observed them. |
| Q-05 — Responsive generated content | PASS | [catalog.js](../js/catalog.js); [order.js](../js/order.js) | catalog: 17, 26, 41, 61, 83; order: 75, 183 | Pre-existing Bootstrap grid/wrapping classes are reused. Fresh E19 checked all seven pages at 375, 768 and 1280 px: 21 combinations with no horizontal overflow; E01/E16/E17 provide representative captures. |
| Q-06 — No recorded console errors | PASS | All seven HTML pages and their loaded scripts | — | Fresh E18 browser log inspection returned no recorded errors/warnings during the tested flows. This is an observation over the captured run, not a guarantee for all browsers/network conditions; no artificial console screenshot was generated. |
| Q-07 — Images resolve | PASS | [data.js](../js/data.js); [catalog.js](../js/catalog.js) | data: 6–15; catalog: 86–88 | Product images use existing paths and descriptive alternatives. Fresh E19 found no broken image across seven pages and three viewport sizes. |
| Q-08 — Internal navigation and Bootstrap compatibility | PASS | [index.html](../index.html); [main.js](../js/main.js) | HTML: 17–36, 92; JS: 128–135 | Prior browser checks expanded the mobile menu, followed About and the shared cart link, and loaded every page. Existing Bootstrap 5.3.8 remains the dependency; no new library was added. Telephone links were not used to place real calls. |
| Q-09 — Formal HTML/CSS validity | NOT TESTED | Seven HTML files and three CSS files | — | Source freeze and successful rendering do not replace an HTML/CSS validator run. No external validator result is claimed. |
| Q-10 — HTML/CSS freeze | PASS | Seven HTML files; [base.css](../css/base.css), [rasul.css](../css/rasul.css), [sayat.css](../css/sayat.css) | HTML script additions: 12–13 or 12–14; CSS: whole files | Fresh byte comparison during documentation quality control found all three CSS files unchanged against the supplied original ZIP. Removing only the 19 authorized script lines makes all seven HTML files identical. New interface content is created through DOM methods. No essential Midterm correction is asserted. |
| Q-11 — No new jQuery/framework/widget dependency | PASS | Seven HTML files; five JavaScript files | HTML: local scripts 12–14; remaining dependency at final Bootstrap script | Existing Bootstrap is retained. Source/import review found no jQuery, new framework, copied-widget package or additional script dependency. This is a dependency/source finding, not independent proof of the historical origin of every line. |
| Q-12 — No loose equality or `var` | PASS | Five JavaScript files | Whole-file scan: data 1–105; main 1–161; catalog 1–201; order 1–376; auth 1–223 | Fresh scan returned no `==`, `!=` or `var` declaration. Strict equality/inequality examples are identified in A4-12/A4-13. |
| Q-13 — No inline event handlers, `eval()` or `document.write()` | PASS | Seven HTML files; five JavaScript files | Whole-file scan | Fresh scan returned no inline `on...=` HTML attributes, `eval()` call or `document.write()` call. |
| Q-14 — No CSS generation or `element.style` workaround | PASS | Five JavaScript files; three CSS files | Whole-file scan; main: 13–17 | Fresh scan found no `.style` use; generated states use existing classes. CSS byte comparison passed. |
| Q-15 — No unsafe insertion, fake backend or unrelated effects | PASS | [main.js](../js/main.js); [order.js](../js/order.js); [auth.js](../js/auth.js) | main: 13–19, 53–82; order: 341–355; auth: 197–219 | Source contains no `innerHTML` assignment; user input is text. Existing scripts implement catalogue/cart/validation, with no payment, account database or server request. Local development HTTP serving does not implement a business backend. |
| Q-16 — Syntax validity | PASS | Five JavaScript files | Whole files, lengths listed above | All five files passed a fresh `node --check` during documentation quality control, confirming the preceding integrity audit. Node parsing alone was not treated as proof of browser behavior. |
| Q-17 — Screen-reader announcements and additional browser engines | NOT TESTED | [main.js](../js/main.js); [catalog.js](../js/catalog.js); [auth.js](../js/auth.js) | main: 30–39; catalog: 64–75; auth: 65, 205–209 | ARIA relationships/live regions are present, but no screen-reader session or Firefox/WebKit test result is available. |

## Git, individual contribution and submission

| Requirement | Status | File | Exact Lines | Evidence / Explanation |
|---|---|---|---|---|
| G-01 — Continue the same project/repository | PASS | [README.md](../README.md); Git HEAD | — | Same seven-page Dielly Flowers & Bags repository and two-student team. HEAD remains `07e19786de07e388bf96e61f94e917e167afab26` (Finalize midterm project); no new history was made during documentation. |
| G-02 — JavaScript files included in Git tracking | FAIL | `js/data.js`, `js/main.js`, `js/catalog.js`, `js/order.js`, `js/auth.js` | — | At audit, all five files were `??` untracked, so a commit of tracked files alone would omit the implementation. Files exist and are not ignored; students must deliberately include them in their legitimate submission commit/archive. |
| G-03 — No accidental ignore rule hides new JavaScript | PASS | Git ignore configuration; five JavaScript paths | — | Prior `git check-ignore -v --no-index` returned exit 1 with no matches for `js/` and the five files. |
| G-04 — Authentic original Midterm baseline | PARTIAL | Supplied `dielly-flowers (1).zip`; Git HEAD | — | Student identifies the archive as the official ZIP submitted 5 October 2026 and graded 85/100. Its HTML/CSS byte comparison establishes the supplied baseline; submission/grade are student-reported, not independently verified. The archive's Git main matches current HEAD. |
| G-05 — Start from and preserve authentic Midterm tag | FAIL | Local and origin Git refs | — | No local tags were listed. A fresh read-only `git ls-remote --tags origin` returned no tags. The archive/commit provide baseline evidence, but cannot substitute for a pre-existing authentic tag or prove it once existed. No tag was created or rewritten. |
| G-06 — `assignment-4` tag | FAIL | Local and origin Git refs | — | Required milestone tag is absent locally and remotely at the documentation audit. Do not backdate or invent a stage history; obtain instructor guidance if needed. |
| G-07 — `assignment-5` tag | FAIL | Local and origin Git refs | — | Required final milestone tag is absent locally and remotely. Creating tags/commits/pushes is outside this documentation task. |
| G-08 — At least two substantial features per student | PARTIAL | [README.md](../README.md); current Git history | — | Team names are recorded, and catalogue/cart/order/auth flows are substantial, but untracked Assignment 4–5 code has no verified per-student authorship. Responsibility entries require student confirmation; earlier HTML/CSS commits do not prove current JavaScript ownership. |
| G-09 — At least one shared site-wide feature | PASS | [main.js](../js/main.js) | 53–160 | Persistent cart state, shared cart navigation/count and shared field feedback serve the site. Existence/behavior is verified; attribution to each student's contribution is assessed separately. |
| G-10 — Four meaningful commits per team member across three days | NOT TESTED | Git history | — | History shows both Midterm contributors, but current Assignment 4–5 implementation is untracked and has no attributable stage commits. Historical commit counts alone do not establish meaningful Assignment 4–5 work across three days. Students must clarify genuine contributions; no history should be fabricated. |
| G-11 — Six commits for an individual student | NOT APPLICABLE | [README.md](../README.md) | — | This repository identifies a two-student team, so the official team rule applies instead. |
| G-12 — Root README includes Functionality Plan | PARTIAL | [README.md](../README.md) | 49–66 | The root README contains the exact required five-column plan with implemented functions. Responsible-student ownership cannot be verified and is explicitly marked “Student confirmation required”; the plan is therefore not fully ready for submission. |
| G-13 — Checklist with exact files and lines | PASS | This document; linked source files | Source ranges in each implementation row | Source-specific references were read from actual current files. Git/human/whole-file checks are explicitly distinguished from source-line requirements. |
| G-14 — Authentic evidence | PASS | [Evidence_Report.md](Evidence_Report.md); `evidence/` | — | Fresh E01–E17 produced 17 actual browser JPEG captures; E18–E20 record console, page/viewport and supplementary checks. The report identifies actions, outcomes and image paths. Missing/unverified accessibility and other-engine coverage remains disclosed. |
| G-15 — Complete truthful Assignment 4–5 AI Log | NOT TESTED | Existing `Tasks/AI_Logs.docx` and `Tasks/AI_Logs.pdf` | — | Existing files are preserved, not certified as covering current AI-assisted work. The students must independently record actual questions/assistance and prepare the required current log. No AI Log was created, replaced or edited. |
| G-16 — Instructor permission for the AI-policy exception | NOT TESTED | Student-reported verbal permission | — | The user reports permission covering implementation/documentation. No written authorization or independent confirmation is present. The official prohibition remains a grading risk if the instructor does not accept that exception. |
| G-17 — Defense: explain any team page, trace input and make a small live change | NOT TESTED | Student preparation/defense | — | This is a human assessment that code inspection cannot certify. The official instruction states that no defense or inability to explain the code results in zero. |

## Grading criteria and penalty review

These observations identify evidence and risks; they do not award points or predict a guaranteed grade.

| Official criterion | Maximum points | Current evidence and limit |
|---|---:|---|
| Real-project logic and completed visitor journeys | 20 | Catalogue selection connects to cart and validated demo order; login/registration explicitly remain frontend demonstrations. Tested paths passed; exhaustive behavior is not claimed. |
| Variables, conditions, arrays, loops and functions | 16 | A4-01–A4-15 locate the concrete data operations and reusable logic. |
| Dynamic DOM creation/removal and states | 18 | A5-07–A5-12 cover generated cards/rows/controls, replacement and class-based feedback. |
| Theme-specific substantial features | 20 | Catalogue, cart/order and existing auth pages apply. Review/booking modules do not logically apply. Individual feature ownership still needs confirmation. |
| Events and complete form validation | 14 | Click/submit/input/change/keydown are connected; invalid, corrected and valid flows were observed. L-01 records the literal-regex wording caveat. |
| Quality, accessibility and responsiveness | 7 | Tested viewport/layout, navigation and image checks passed. Full keyboard/focus, screen-reader, other-engine and formal validator coverage remains incomplete. |
| README, checklist, evidence, tags and commits | 5 | Documents/evidence are supplied by this task; milestone tags, tracked JavaScript, confirmed contributions and the student-owned AI Log/commit requirements remain submission concerns. |

The official penalties are:

- **−15** for jQuery/framework/copied widget.
- **−10 per directly added HTML block or CSS feature after the freeze.** Only script links differ in HTML, and CSS matches the supplied baseline; no such violation was confirmed.
- **−10 per incomplete core flow.** No incomplete core flow was found in the tested catalogue/cart/demo-order/auth paths.
- **−5 per console error, broken control, loose equality, inline event or unsafe user-input insertion.** The tested runs/source scans did not confirm these defects; untested environments are not covered.
- **−5 for irrelevant JavaScript.** The inspected scripts serve product discovery, cart/order or form validation.

No separate numeric deduction is invented for missing tags, uncertain authorship, the literal-regex interpretation or the student-reported permission. Those issues must be resolved under the instructor's actual assessment rules. No defense or inability to explain the code is explicitly stated to result in **zero**.

## Student actions before submission

1. Confirm the Functionality Plan's true responsibility assignments, with at least two substantial features per teammate and clear participation in the shared feature.
2. Include all five untracked JavaScript files and the completed documentation/evidence in the legitimate submission. Review the staged file list before committing; this task does not create commits, tags or pushes.
3. Resolve the missing authentic Midterm tag and the two required milestone tags with the instructor without inventing dates or contributions.
4. Independently complete the truthful Assignment 4–5 AI Log and confirm acceptance of the reported verbal AI-policy exception.
5. Perform the untested checks identified above, and prepare both students to explain any page, trace input to output and make a small live change at defense.
