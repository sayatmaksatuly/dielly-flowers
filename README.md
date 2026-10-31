# Dielly Flowers & Bags — Assignment 6: jQuery

## Project overview

This project continues the existing flower and bag shop website. In Assignment 6, the existing interactive features were rewritten with jQuery. The seven pages, products, prices, images, Russian interface and design were preserved. New controls and examples cover the assignment's jQuery requirements.

**Course:** Web Technologies 1 (Front End) — continuation of the Midterm Project

**Team:** Sayat Maksatuly, Rasul Tazhgulov

**Group:** SE-2533

## Technologies

- HTML5 and CSS3.
- Bootstrap 5.3.8 for layout, components and the mobile menu.
- JavaScript for product data and calculations.
- jQuery 3.7.1 full for DOM operations, events and effects.
- localStorage for the shopping cart.

## What was implemented

1. **Catalogue:** `createProductCard()` and `renderProducts()` build cards, search names and descriptions, filter by maximum price, sort, reset filters and show empty results. Visitors can add products to the shared cart.
2. **Shopping cart:** `renderCart()` builds rows from the cart array. Visitors can change quantities, remove products and clear the cart. Counts and totals update after each change. Quantities stay within 1–99. The selection persists across pages and reloads when storage is available.
3. **Order validation:** `errorFor()` and `validateForm()` check name, email, phone, phone confirmation and address. Errors appear beside each field and clear when corrected. Native constraints remain enabled. Direct `invalid` handlers show all field errors; `submit` checks additional rules. A valid order needs a nonempty cart and no unfinished product addition. Success resets the form and cart while keeping the completed summary visible.

A checkbox provides a “Show only products in the cart” filter. Event handlers use `.on()`. Catalogue lists and the order summary delegate clicks to dynamically created buttons.

Catalogue messages use `fadeIn()` and `fadeOut()` at 160 ms. The filter panel uses `slideToggle()` at 180 ms. Callbacks clear finished messages or restore focus. `.stop(true, true)` handles rapid actions, and the effects keep Bootstrap's `d-none` state consistent.

Login and registration validate email and password rules. Registration also checks the name and repeated password. Both forms support showing or hiding passwords and clear passwords after success.

Obsolete service notices were removed through targeted jQuery cleanup. Result sections stay hidden until validation succeeds and hide again when data changes. Repeated success replaces the previous result. A root `favicon.ico` supplies the browser icon.

## jQuery requirements

| Requirement | Implementation | Main file |
|---|---|---|
| CDN and DOM ready | Full jQuery loads before `data.js`, `main.js` and the page script, using `defer`. DOM initializers use `$(function () { ... })`. | All seven HTML pages; active DOM scripts |
| Three rewritten features | FEATURE 1: `createProductCard()` / `renderProducts()`; FEATURE 2: `renderCart()`; FEATURE 3: `errorFor()` / `validateForm()`. Comparison comments describe the changes. | `js/catalog.js`, `js/order.js` |
| Selectors and filters | ID, class, tag and attribute selectors; examples include `#order-form`, `.invalid-feedback`, `main`, `[data-product-id]` and `:not(:disabled)`. | `js/main.js`, `js/catalog.js`, `js/order.js` |
| Traversal and chaining | `.find()`, `.closest()`, `.parent()`, `.siblings()` and `.each()` locate related controls. `updateSelectedProducts()` includes a documented method chain. | `js/catalog.js`, `js/main.js` |
| Text, HTML, values and properties | `.text()` displays data; `.html()` is limited to a trusted static empty-state message. `.val()` reads fields, `.attr()` sets attributes and `.prop('checked')` reads the checkbox state. | `js/catalog.js`, `js/main.js`, `js/order.js` |
| Existing classes | `.addClass()`, `.removeClass()`, `.toggleClass()` and `.hasClass()` control feedback, validation and visibility using existing styles. | `js/catalog.js`, `js/main.js`, `js/order.js` |
| List from an array | jQuery initialization creates `#order-cart-items`; `renderCart()` appends rows from the cart summary. These rows are absent from source HTML. | `js/order.js` |
| Events and delegation | `.on()` handles click, input, change, submit and other events. Catalogue lists and `#order-summary` handle clicks from new buttons; handlers use `$(this)`. | `js/catalog.js`, `js/order.js`, `js/auth.js` |
| Effects | `showFeedback()`, `hideFeedback()` and the filter-toggle handler use three effects with durations and callbacks. | `js/catalog.js` |
| Form validation | `bindNativeValidation()` binds non-bubbling `invalid` events directly to controls. `validateForm()` combines native validity with custom rules and inline errors. | `js/order.js`, `js/auth.js` |

## Project structure

| File | Purpose |
|---|---|
| [js/data.js](js/data.js) | Product data, filtering, cart normalization and totals, independent of the DOM. |
| [js/main.js](js/main.js) | Shared jQuery helpers, cart state, storage, counters and synchronization events. |
| [js/catalog.js](js/catalog.js) | Flower and bag cards, filters, sorting, checkbox and feedback effects. |
| [js/order.js](js/order.js) | Dynamic cart rows, quantity actions, delivery validation and order summary. |
| [js/auth.js](js/auth.js) | Login and registration validation, password checklist, confirmation and visibility controls. |
| [js/old-js-version.js](js/old-js-version.js) | Previous catalogue and order implementations for comparing the three rewritten features. It is not loaded by any page. |
| [favicon.ico](favicon.ico) | Browser icon served from the project root. |
| [AI_LOGS_Assignment_6.md](AI_LOGS_Assignment_6.md) | Summary of AI assistance for this assignment. |

Pages: `index.html`, `about.html`, `flowers.html`, `bags.html`, `order.html`, `login.html` and `register.html`.

## How to run

Open the project folder in VS Code with the Live Server extension installed. Right-click `index.html` and choose **Open with Live Server**.

Alternatively, on Windows with Python installed, run this command from the project folder:

```powershell
py -3 -m http.server 8000 --bind 127.0.0.1
```

Open [http://127.0.0.1:8000/index.html](http://127.0.0.1:8000/index.html). Keep the terminal running and press `Ctrl+C` to stop the server.

Internet access is needed to load jQuery and Bootstrap from their CDNs. Use the same address and port when testing the cart, because localStorage belongs to that browser origin.

## Application behaviour

The forms check entered data; server authentication, account creation and order acceptance are not implemented. The cart uses the `dielly-cart-v1` localStorage key with a version number and product IDs and quantities. Prices come from the product data. Passwords and order contact details are not saved in localStorage.

## Verification

The final implementation was checked in Microsoft Edge with Playwright before this documentation update. The checks covered:

- All seven pages, script loading order and product images.
- Catalogue search, price filters, sorting, reset and the cart-only checkbox.
- Delegated buttons after repeated creation of cards and cart rows.
- Cart quantities, totals, removal, clearing, navigation and reload persistence.
- Form submission by button and Enter; empty, whitespace-only and invalid values; live error correction.
- Newly added required fields and native constraints, including patterns.
- Success messages, order reset with the summary retained, repeated submissions and hiding outdated results.
- Password visibility, confirmation, clearing and safe text output.
- Effects, callbacks and rapid repeated clicks.
- Forms and navigation at a 375 px viewport, with no horizontal overflow.
- No JavaScript or console errors; `/favicon.ico` returned HTTP 200.
