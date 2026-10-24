# Dielly Flowers & Bags — Assignment 4–5

**Course:** Web Technologies 1 (Front End) — continuation of the Midterm Project

**Team:** Sayat Maksatuly, Rasul Tazhgulov

**Group:** SE-2533

Dielly Flowers & Bags is a seven-page website for a flower and bag boutique in Astana:

- `index.html`
- `about.html`
- `flowers.html`
- `bags.html`
- `order.html`
- `login.html`
- `register.html`

Bootstrap 5.3.8 provides the responsive layout, utilities, components and navbar behavior. The existing custom CSS provides the Dielly brand styling. Assignment 4–5 adds vanilla JavaScript for product data, catalogue controls, a shared cart, order calculations and form validation.

This is a frontend demonstration. It has no backend or database, creates no real order or account, processes no payment and does not authenticate visitors. Registration is not required to use the cart or order demonstration. Product prices are the project catalogue values inherited from the Midterm, not a live inventory or pricing service.

## Run locally

With Python 3 installed, open a terminal in the repository root and run:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open [the local homepage](http://127.0.0.1:8000/index.html). Keep the terminal running; use `Ctrl+C` to stop the server. If `python` is not available under that name on Windows, use the installed Python 3 launcher (`py -3`) with the same arguments. An internet connection is needed for the existing Bootstrap CDN resources.

Use one hostname and port while testing. The cart uses origin-specific `localStorage`; changing the port or switching between `localhost` and `127.0.0.1` creates a different storage origin. Opening HTML directly may display the pages, but HTTP is recommended for predictable cross-page storage. The Python server only serves static files; it does not add order or account processing.

## JavaScript structure

| File | Responsibility |
|---|---|
| [js/data.js](js/data.js) | Ten product objects, search/filter/sort logic, cart normalization, calculations and temporary demo references. |
| [js/main.js](js/main.js) | Shared DOM and validation helpers, cart storage, cart navigation and change notifications. |
| [js/catalog.js](js/catalog.js) | Reusable flower/bag card rendering, catalogue controls and add-to-cart feedback. |
| [js/order.js](js/order.js) | Cart rows and quantity actions, delivery validation and a demonstration summary. |
| [js/auth.js](js/auth.js) | Login/registration validation, password checklist, confirmation and visibility controls. |

Every page loads `data.js` followed by `main.js` with `defer`. Flowers and Bags then load `catalog.js`, Order loads `order.js`, and Login/Registration load `auth.js`. Home and About use only the shared pair.

The cart stores only a version number and product IDs/quantities under `dielly-cart-v1`. Prices are recalculated from the product array. Contact details and passwords are not stored by the application. If storage is unavailable, a visible warning explains that the in-memory cart may be lost on navigation.

## Functionality Plan

The table records the implemented Assignment 4–5 functions. The repository identifies the team and its historical Midterm contributions, but the JavaScript files are currently untracked and do not establish individual Assignment 4–5 ownership. Responsibility therefore remains **Student confirmation required**; these entries must be replaced only with truthful student-confirmed responsibilities.

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

The official requirement is at least two substantial features per teammate and at least one shared site-wide feature. The shared feature is implemented, but this document does **not** certify the individual quota for Sayat Maksatuly or Rasul Tazhgulov. Both students must confirm their genuine contribution and be able to explain and modify the relevant code.

## User journeys

### Journey 1 — Find boutique information

**Start:** Homepage

**Steps:** Open About and read the address, opening hours and telephone.

**End:** The visitor has the information needed to plan a visit.

### Journey 2 — Choose a flower and prepare an order

**Start:** Homepage

**Steps:** Open Flowers → search/filter/sort → add a flower to the cart → open Order → adjust quantities → enter delivery details and repeat the telephone → submit the demonstration form.

**End:** Errors are explained beside fields or a summary with a temporary `DEMO-` reference appears. The page explicitly states that no real order or payment was created.

### Journey 3 — Choose a bag and prepare an order

**Start:** Homepage

**Steps:** Open Bags → compare/filter products → add a bag → open Order → review the combined cart → edit/remove products if needed → validate the delivery form.

**End:** The visitor completes the same demonstration order journey without requiring registration.

## Quality and evidence

The current [Evidence Report](tasks_assignment_4-5/Evidence_Report.md) records 20 passed evidence scenarios and 17 authentic screenshots. It separately records 21 page/viewport checks (seven pages at 375 px, 768 px and 1280 px), 16 targeted edge-case assertions and a console observation with zero entries. The page checks found no horizontal overflow, broken images or duplicate IDs and confirmed deferred script loading and the shared cart link. These are different evidence units, not numbers to combine into one test total.

These checks are not a full cross-browser or assistive-technology certification. The earlier 320 px review target remains an additional manual check, not a claimed result of this evidence set.

- [Assignment 4–5 technical README](tasks_assignment_4-5/README_Assignment_4-5.md)
- [JavaScript requirement checklist with source lines](tasks_assignment_4-5/JavaScript_Checklist.md)
- [Evidence report and screenshots](tasks_assignment_4-5/Evidence_Report.md)
- [Previous Midterm task materials](Tasks/)

## Midterm freeze and submission status

The student identifies `dielly-flowers.zip` (provided locally as `dielly-flowers (1).zip`) as the official submission of October 5, 2026, graded 85/100. Submission identity and grade are student-reported. Comparison with that supplied archive confirmed that all three CSS files are byte-identical and the seven HTML files differ only by 19 permitted deferred script links. New interface content is created through JavaScript DOM methods. No essential HTML/CSS correction is claimed.

The current Git baseline is commit `07e19786de07e388bf96e61f94e917e167afab26`. Local tag inspection and a successful `git ls-remote --tags origin` returned no tags. A genuine Midterm tag has therefore not been established; do not label a newly created tag as historical proof. The required Assignment 4 and Assignment 5 tags are also absent. The JavaScript files and new documentation must be deliberately included in the student's final repository state. No commits, tags or pushes were made during documentation completion. See the checklist for outstanding contribution and submission requirements.

## AI assistance disclosure

The student reports that the instructor personally granted verbal permission for AI-assisted JavaScript implementation and associated documentation. This is a student-reported verbal exception, not written authorization and not independently verified. The official assignment otherwise prohibits AI-written code and project documentation. This project has received AI assistance; this README does not attribute that work to unaided student authorship.

The students are responsible for preparing an accurate AI Log and confirming the exception with the instructor. Existing files in `Tasks/` named `AI_Logs` are preserved; their presence alone does not prove that the Assignment 4–5 log is complete. No AI Log was created, replaced or edited as part of documentation completion.
