# Dielly Flowers & Bags — Assignment 4–5 Technical README

**Course:** Web Technologies 1 (Front End)  
**Team:** Sayat Maksatuly and Rasul Tazhgulov  
**Group:** SE-2533  
**Documentation date:** October 24, 2026

This document describes the current source files. Exact requirement-level source references are in [JavaScript_Checklist.md](JavaScript_Checklist.md), and observed browser results and screenshots are in [Evidence_Report.md](Evidence_Report.md).

## 1. Project Overview

Dielly Flowers & Bags is a seven-page website for a flower and bag boutique in Astana. Visitors can read boutique information, compare bouquets and bags, keep a selection in a cart and check a delivery form. Existing Login and Registration pages demonstrate input validation. The interface text is primarily Russian, and prices are formatted in Kazakhstani tenge.

Assignment 4–5 continues the existing Midterm website. It adds data processing and browser interactions to the prepared pages, forms and result containers. The project remains a static frontend: no data is submitted to an order service, no account is created, no authentication takes place and no payment is processed. Visitors can complete the order demonstration without registering.

The catalogue uses the ten products and prices already present in the Midterm project: six flowers and four bags. These are project data, not a connection to current shop stock or live prices.

The student reports verbal instructor permission for AI-assisted implementation and documentation. This is not written or independently verified authorization. AI assistance was used; the students must record their actual interactions in their own AI Log and confirm that the reported exception is accepted. No AI Log was created or modified for this documentation.

## 2. Technologies

| Technology | Actual use |
|---|---|
| HTML5 | Seven existing pages with navigation, headings, forms, product containers and prepared result areas. |
| CSS3 | Existing `base.css`, `sayat.css` and `rasul.css` for the Midterm design. |
| Bootstrap 5.3.8 | Existing CDN stylesheet and bundle, grid, utility classes, form states and responsive navbar. |
| Vanilla JavaScript | Five scripts containing the product logic and page interactions; no additional framework or library. |
| Browser DOM APIs | Element creation, insertion/removal, attributes, `classList`, `textContent`, focus and events. |
| Browser `localStorage` | The shared cart's version, product IDs and quantities, with a memory fallback if storage is unavailable. |
| `Intl.NumberFormat` | KZT price formatting. |

Python's HTTP server is used only to serve the static files during local testing. It is not an application backend. The project does not use a database, account service, order API or payment provider.

## 3. Project Structure

```text
dielly-flowers/
├── README.md
├── index.html
├── about.html
├── flowers.html
├── bags.html
├── order.html
├── login.html
├── register.html
├── css/
│   ├── base.css
│   ├── sayat.css
│   └── rasul.css
├── images/
├── js/
│   ├── data.js
│   ├── main.js
│   ├── catalog.js
│   ├── order.js
│   └── auth.js
├── Tasks/                         # preserved Midterm materials
└── tasks_assignment_4-5/
    ├── README_Assignment_4-5.md
    ├── JavaScript_Checklist.md
    ├── Evidence_Report.md
    └── evidence/
```

| JavaScript file | Responsibility and connection |
|---|---|
| [data.js](../js/data.js) | Defines `Dielly`, the product array and reusable functions for lookup, filtering/sorting, cart normalization, quantity changes, totals and temporary references. These functions do not require the DOM. |
| [main.js](../js/main.js) | Adds shared DOM/field-feedback helpers and cart methods to `Dielly`. Loads/saves the cart, adds the cart navigation link and dispatches `dielly:cartchange` after changes. |
| [catalog.js](../js/catalog.js) | Detects the prepared flower or bag list. Creates connected controls, renders cards from the appropriate products and calls the shared cart API. |
| [order.js](../js/order.js) | Uses the prepared order form and summary container. Renders cart rows, connects quantity/removal/clear actions, validates delivery and addition fields, and displays a demo result. |
| [auth.js](../js/auth.js) | Detects Login or Registration. Adds password feedback and visibility controls; Registration also gets an exact confirmation field. Valid submissions show a frontend-only result. |

All scripts use `'use strict'`. Deferred script order is `data.js` → `main.js` → the page script. Home and About load only the first two; Flowers and Bags share `catalog.js`; Order loads `order.js`; Login and Registration share `auth.js`. The scripts use the same `Dielly` object rather than ES module imports or a build system. Initialization guards prevent duplicate setup.

Cart changes travel through `Dielly.addToCart`, `setQuantity`, `removeFromCart` or `clearCart`. Shared code saves the state, updates navigation and dispatches the change event. Catalogue selection labels and order rows then refresh. The application also listens for browser `storage` events and persisted `pageshow` events to refresh an existing page when appropriate.

## 4. Assignment 4 — JavaScript Fundamentals

The data logic is concentrated in [data.js](../js/data.js) and reused by the page scripts.

| Concept | Implementation |
|---|---|
| Variables and operators | `const` is used for product data, IDs, limits and function results. `let` is used for changing totals and state. Comparisons and arithmetic are tied to filtering and cart operations. |
| Arrays and objects | `products` contains ten objects. Each includes `id`, `category`, `name`, numeric `price`, `description`, `image`, `alt`, `badge` and `imageClass`. Cart lines contain an ID and numeric quantity. |
| Loops and traversal | `for...of` normalizes cart entries and accumulates totals; `map` builds line summaries; `filter`, `find`, `forEach` and `every` support selection and validation. |
| Reusable functions | `getProduct(id)`, `formatMoney(amount)`, `selectProducts(category, query, maxPrice, sort)`, `normalizeCart(items)`, `setCartQuantity(items, id, quantity)` and `getCartSummary(items)` take parameters and return useful results. |
| Function composition | `getCartSummary` calls `normalizeCart` and `getProduct`. `setCartQuantity` also calls these helpers. Shared `cartSummary` delegates to the reusable calculation function. |
| Arithmetic | A line subtotal is product price × quantity. The summary adds all subtotals and quantities. Quantity controls add or subtract one. Price sorting subtracts numeric prices. |
| Conditions | `if`/`else if` selects sorting behavior; validation rejects unknown product IDs, non-integer quantities and values outside the allowed range. |
| Strict equality | `===` finds matching IDs/categories and checks valid states. `!==` removes a selected ID and distinguishes invalid data types or errors. |
| Logical operators | `&&` connects category, search and budget rules; `\|\|` expresses alternatives and rejects invalid cart entries; `!` is used for negative conditions. |
| `Math.random()` | `createDemoReference` produces a temporary `DEMO-` label after a valid order demonstration. The code explicitly does not claim guaranteed uniqueness or a real transaction. |

The catalogue's stored numeric prices remain the source of truth for totals. Extra properties or prices in saved cart data are ignored. Unknown products and invalid quantities are rejected by normalization; duplicate valid entries are merged up to the demonstration limit of 99 per product.

For example, two units of “101 роза” at ₸50,000 and one Gucci bag at ₸35,000 total three units and ₸135,000. This illustrates the implemented calculation; it is not a promise of stock, delivery charges or a real transaction.

## 5. Assignment 5 — DOM and Interactions

`Dielly.el` creates elements with `document.createElement`, assigns text through `textContent` and applies existing CSS classes. Page code inserts controls and content with DOM methods such as `append`, `before` and `after`. `replaceChildren` removes obsolete cards, rows and result content before rendering their replacements.

Both catalogues use the same `createProductCard` and `renderProducts` functions. Text search checks product names and descriptions without case sensitivity. A maximum-price field and a sort selector work with that search. Every result update includes a matching count; an empty result has an explanation and a reset action. Reset returns to the original product order and focuses the search field.

Adding a product updates its selected quantity and the shared navigation count, then displays feedback and a link to Order. The order page renders current cart lines, unit prices, subtotals and totals in its prepared container. Its buttons support increase, decrease, removal and complete clearing. At zero quantity a product is removed; an empty cart has a message and disabled checkout.

The implementation uses `addEventListener` for `click`, `submit`, `input`, `change`, `keydown` and other appropriate browser events. Form submissions call `preventDefault` and complete locally. Enter in the order addition controls adds the selected item rather than accidentally confirming checkout. The order form also blocks a pending selection that has not been added or explicitly reset.

Visual states use `classList` with existing classes, including hidden, selected, valid and invalid states. User-entered text is inserted as text rather than HTML. No inline event attributes, generated style rules or new CSS files are needed for these interactions.

## 6. Functionality by Page

| Page | What the visitor can do |
|---|---|
| [Home](../index.html) | Read the introduction, open boutique information or either catalogue, and access the shared cart. |
| [About](../about.html) | Read boutique and contact information, navigate to the products and open the shared cart. |
| [Flowers](../flowers.html) | Browse six bouquets; combine search, budget and sort controls; reset; add products and see selected quantities. |
| [Bags](../bags.html) | Browse four bags with the same connected controls and add them to the same cart as flowers. |
| [Order](../order.html) | Add a selected product/quantity, edit cart quantities, remove/clear items, review totals, validate delivery details and view an explicit demonstration summary. |
| [Login](../login.html) | Check email/password format, inspect live password rules, show/hide the password and receive a demonstration result. No credential lookup is performed. |
| [Registration](../register.html) | Check name/email/password, match confirmation exactly, use password visibility controls and receive a demonstration result without account creation. |

The optional order comment is a gift-card message included in the local order summary. It is not a public review/comment feed. A booking module is not part of this product-selection website.

## 7. Functionality Plan

This table records the functions implemented for the assignment. The root [README.md](../README.md) also contains the mandatory plan. Git records historical work by both named teammates, but currently untracked JavaScript does not establish who implemented each Assignment 4–5 feature. No individual ownership is inferred from file names or historical CSS authorship.

| Page | Visitor Goal | Planned Function | Expected Result | Responsible Student |
|---|---|---|---|---|
| Home / About | Move between boutique information, products and the current selection | Add the shared cart link to the existing navigation | The visitor can open Order and see the current cart quantity on every page | Student confirmation required — shared site-wide feature |
| Flowers | Find a suitable bouquet | Combine text search, maximum price and sorting; render matching cards with count, empty state and reset | Matching flowers are shown and the original list can be restored | Student confirmation required |
| Flowers | Keep a bouquet for an order | Add the chosen product to the shared cart and show selected quantity and next action | The selection is available on Order with the correct price | Student confirmation required |
| Bags | Compare suitable accessories | Apply the same reusable catalogue controls to bag data | Search, budget and sorting work together and show a useful result state | Student confirmation required |
| Bags | Add an accessory to an existing selection | Add a bag to the same cart used by Flowers | Flower and bag selections appear together in one order summary | Student confirmation required |
| Order | Edit the planned purchase | Add selected products, increase/decrease quantities, remove items and clear the cart | Line subtotals, item quantity and total price update after each change | Student confirmation required |
| Order | Check delivery details and review the selection | Validate name, telephone, repeated telephone, address, product selection and quantity; show a demo summary | Invalid fields receive specific feedback; valid data produces an explicit demonstration and clears the cart | Student confirmation required |
| Login | Check login-form input | Validate email and password rules; provide live password feedback and visibility control | Invalid input is explained; valid input produces a frontend-only message | Student confirmation required |
| Registration | Check registration-form input | Validate name/email/password, require exact password confirmation and provide visibility controls | A mismatch is blocked; valid input produces a demonstration without creating an account | Student confirmation required |
| All pages | Keep a consistent selection | Reuse cart normalization, storage, navigation and change notifications | Product IDs/quantities remain consistent across pages when browser storage is available | Student confirmation required — shared site-wide feature |

The official minimum is two substantial features per teammate and one shared site-wide feature. The implementation supplies a shared cart, but **the individual contribution requirement is not yet verified** for either Sayat Maksatuly or Rasul Tazhgulov. Each student must confirm their actual responsibilities, meaningful commits and understanding; the table must not be used to invent authorship after the fact.

## 8. Validation and Error Handling

The important form flow is the order journey, including product addition and checkout. The implementation checks more than four inputs across that flow:

| Input or condition | Implemented rule |
|---|---|
| Delivery name | Trimmed non-empty text, at least one Unicode letter, maximum 100 characters. |
| Telephone | A permitted telephone format beginning `+7` or `8`, with 11 digits after punctuation is removed. This checks format, not ownership or reachability. |
| Repeated telephone | Must pass format validation and match the normalized first number; an initial `8` is normalized to `7`. |
| Delivery address | Trimmed non-empty text with at least one letter, maximum 250 characters. This does not verify a real address or delivery coverage. |
| Product selection | Must identify a product from the catalogue before adding it. |
| Quantity | Must be an integer from 1 to 99; existing quantity plus the addition cannot exceed 99 for that product. |
| Pending addition | Checkout stops if a changed product/quantity has not been added or reset. |

Field-specific text is placed next to the relevant control. `aria-describedby` connects it to that control; `aria-invalid` and existing Bootstrap classes expose the current state. On invalid submission the first invalid control receives focus. Editing relevant fields rechecks the affected condition and clears obsolete feedback. Changing the first telephone rechecks an already-touched confirmation field.

Login validates email and password. Registration additionally checks a trimmed required name and exact password confirmation. The password checklist uses a minimum length check of eight and regular expressions for uppercase, lowercase, digit and a non-whitespace special character. Unicode letter classes allow case rules to work with Russian letters. The length condition is implemented with JavaScript `value.length >= 8`, not a length quantifier inside the regex; the checklist reports this implementation detail against the official wording.

Password visibility is controlled by real buttons with `aria-controls`, `aria-pressed` and an updated accessible label. The checklist states “completed” or “not completed” in text, so colour is supplementary. Successful validation clears and conceals the passwords and removes stale field states. The application does not persist, print, echo or put passwords in URLs.

Successful order validation displays the choices and a temporary reference, states that no information was sent to a server and no real order/payment was created, and clears the cart. Authentication forms explicitly state that no account was created and no login occurred. Success messages are local DOM results only.

Saved cart parsing uses `try`/`catch`. Invalid or unsupported stored data falls back to an empty or normalized cart. Failed storage access does not stop page interaction: the current page keeps a memory copy and shows a warning that navigation may lose the selection. Only product IDs and quantities are saved under a versioned key; delivery fields, gift text and credentials are not part of that payload.

## 9. Accessibility and Responsiveness

The source uses real buttons for actions, associated labels for generated controls and descriptive names for quantity and visibility buttons. Error text is linked to inputs, dynamic counts/feedback use status or live regions, and first-invalid-field and success-message focus are managed by JavaScript. Re-rendering cart controls attempts to preserve focus on a usable control. These are implemented accessibility measures, not a claim of full standards compliance.

The current evidence collection checked all seven pages at 375 px, 768 px and 1280 px: 21 page/viewport checks passed with no horizontal overflow, broken images or duplicate IDs observed in those states. The same checks confirmed deferred script loading and the shared cart link. Targeted interactions included Enter-based product addition, invalid form feedback, pending-selection handling and corrected input. The preceding integrity audit also checked first-invalid-field focus and mobile navigation. The [Evidence Report](Evidence_Report.md) identifies the current scenarios and authentic screenshots without treating these observations as a full accessibility certification.

Bootstrap grid/utility classes and the existing CSS control the generated layout. No stylesheet was changed for Assignment 4–5. Comprehensive screen-reader use, colour contrast measurement, every possible keyboard traversal, browser zoom and other browser engines have not been certified. The historical root README's 320 px review target remains an additional manual check unless later evidence records it.

## 10. How to Run

1. Keep the repository structure intact, including `images`, `css` and `js`.
2. Install or use an existing Python 3 installation. From the repository root, run:

   ```sh
   python -m http.server 8000 --bind 127.0.0.1
   ```

3. Open [http://127.0.0.1:8000/index.html](http://127.0.0.1:8000/index.html).
4. Keep the server terminal open while testing. Stop it with `Ctrl+C` afterward.

On Windows, `py -3 -m http.server 8000 --bind 127.0.0.1` is an alternative when the Python launcher is installed. If the port is occupied, choose another available port and use it consistently. The documentation browser session uses the same Python static-server approach with the local address specified in the Evidence Report; it does not depend on a Node build or package installation.

Use HTTP and the same origin for every page. Browser storage is separated by protocol, hostname and port. Opening a page using `file://`, changing ports or alternating hostnames can produce different storage behavior. Direct file opening is therefore not the recommended cart test method. Existing Bootstrap CDN resources require internet access. Use fictional contact details and a test password, not real credentials, for demonstrations.

## 11. Testing and Verification

The documentation uses three distinct evidence types:

- **Source inspection:** the five JavaScript files, seven HTML script links, existing CSS, root README and Git state establish what is implemented and what is included in version control. Exact source lines are documented in the checklist.
- **Preceding integrity audit:** the earlier audit reported successful syntax checks for all five scripts, functional browser checks for the seven pages, and data/storage tests. Those historical results are not counted as new screenshots or newly repeated tests in this documentation.
- **Current evidence collection:** the Evidence Report records each actual action, expected result, observed result, status and screenshot filename where captured. It contains 20 passed evidence scenarios (E01–E20); E01–E17 have 17 authentic JPEG screenshots. E18 records a console observation with zero entries, E19 records 21 page/viewport checks, and E20 records 16 targeted edge-case assertions. These different units are reported separately rather than combined into an inflated test total. A console observation is not presented as a screenshot of developer tools.

The 21 page/viewport checks cover seven pages at each of 375 px, 768 px and 1280 px. They check overflow, image loading, unique IDs, deferred script loading and the shared cart link. The 16 targeted edge-case assertions cover bag search/sort, reload persistence, invalid quantity and Enter behavior, telephone mismatch, pending-selection reset, safe text insertion and each of the five password rules. These checks passed in the recorded browser environment; other environments remain outside that evidence.

Verified flows include catalogue matching/empty/reset states, selection carried from catalogues to the order page, cart arithmetic and editing, rejection of invalid form input, exact cross-field matching and explicit demo summaries. A representative cart test combines a ₸50,000 bouquet and a ₸35,000 bag for ₸85,000; subsequent quantity changes must update the total from the same source prices.

The supplied Midterm ZIP comparison established byte-identical CSS and HTML unchanged except for 19 added deferred script links. The student identifies that ZIP as the October 5, 2026 submission graded 85/100; archive provenance and grade remain student-reported. Git currently points to `07e19786de07e388bf96e61f94e917e167afab26`. Local tag inspection and a successful `git ls-remote --tags origin` returned no tags. No authentic historical Midterm tag has been established, and no replacement history was created.

The full submission is not certified complete by passing browser tests. At documentation time the JavaScript files are untracked, milestone tags are absent in the inspected repository, individual Assignment 4–5 contributions need confirmation, and the students' AI Log needs their own completion/review. See the checklist for PASS, PARTIAL, FAIL, NOT APPLICABLE and NOT TESTED distinctions.

## 12. Project Limitations

- No backend, database, real account registration, credential lookup or authenticated session is implemented.
- No real order, booking, payment, notification or delivery request is created.
- The cart is local to the browser origin. It is not an account cart and does not synchronize across devices. Memory fallback cannot preserve selections across a full page navigation.
- The maximum of 99 units per product is an explicit demonstration restriction, not inventory availability.
- Totals contain catalogue item prices only. No unimplemented discount, tax, shipping or payment calculation is claimed.
- A demo reference is random and temporary, not guaranteed unique and not a business confirmation.
- Telephone, email and address checks validate input format/content rules only. They do not verify an actual person, reachable address or service area.
- There is no public review feed or booking/appointment flow. The optional gift-card text is only part of the order demonstration.
- Browser and accessibility observations are limited to the tests actually recorded. No guaranteed grade or instructor approval of the final submission is claimed.

## 13. Conclusion

The implemented frontend connects the existing product pages to reusable catalogue logic, a shared cart, calculated order summaries and form validation. The source and evidence documents explain those behaviors and their limits. The remaining submission responsibilities are genuine contribution confirmation, accurate AI disclosure/logging, the required Git milestones and the students' ability to explain and modify the code at defense.
