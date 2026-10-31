// Original implementations captured before the jQuery migration. Reference only; never loaded by a page.

// FEATURE 1 — original js/catalog.js
// createProductCard/renderProducts: карточки и фильтры; обработчики в конце: действия каталога.

'use strict';

(() => {
    const list = document.getElementById('flowers-list') || document.getElementById('bags-list');
    if (!list || list.dataset.catalogReady === 'true') {
        return;
    }
    list.dataset.catalogReady = 'true';
    const category = list.id === 'flowers-list' ? 'flowers' : 'bags';
    const controls = Dielly.el('form', '', 'border rounded-3 bg-white p-3 mb-4');
    controls.id = `${category}-controls`;
    controls.setAttribute('role', 'search');
    controls.setAttribute('aria-label', 'Поиск и фильтры каталога');
    controls.noValidate = true;

    const fields = Dielly.el('div', '', 'row g-3');
    const searchGroup = Dielly.el('div', '', 'col-12 col-lg-6');
    const searchLabel = Dielly.el('label', 'Поиск по названию и описанию', 'form-label');
    const search = Dielly.el('input', '', 'form-control');
    search.id = `${category}-search`;
    search.type = 'search';
    search.setAttribute('aria-controls', list.id);
    searchLabel.htmlFor = search.id;
    searchGroup.append(searchLabel, search);

    const budgetGroup = Dielly.el('div', '', 'col-12 col-sm-6 col-lg-3');
    const budgetLabel = Dielly.el('label', 'Цена до, ₸', 'form-label');
    const budget = Dielly.el('input', '', 'form-control');
    budget.id = `${category}-max-price`;
    budget.type = 'number';
    budget.min = '0';
    budget.step = '1';
    budget.placeholder = 'Без ограничения';
    budget.setAttribute('aria-controls', list.id);
    budgetLabel.htmlFor = budget.id;
    const budgetError = Dielly.el('p', '', 'invalid-feedback mb-0');
    budgetError.id = `${category}-budget-error`;
    budget.setAttribute('aria-describedby', budgetError.id);
    budgetGroup.append(budgetLabel, budget, budgetError);

    const sortGroup = Dielly.el('div', '', 'col-12 col-sm-6 col-lg-3');
    const sortLabel = Dielly.el('label', 'Сортировка', 'form-label');
    const sort = Dielly.el('select', '', 'form-select');
    sort.id = `${category}-sort`;
    sort.setAttribute('aria-controls', list.id);
    sortLabel.htmlFor = sort.id;
    const sortOptions = [
        { value: 'default', label: 'Как в каталоге' },
        { value: 'price-asc', label: 'Сначала дешевле' },
        { value: 'price-desc', label: 'Сначала дороже' },
        { value: 'name', label: 'По названию' }
    ];
    for (const item of sortOptions) {
        const option = Dielly.el('option', item.label);
        option.value = item.value;
        sort.append(option);
    }
    sortGroup.append(sortLabel, sort);
    fields.append(searchGroup, budgetGroup, sortGroup);

    const footer = Dielly.el('div', '', 'd-flex flex-wrap align-items-center justify-content-between gap-3 mt-3');
    const count = Dielly.el('p', '', 'mb-0');
    count.id = `${category}-count`;
    count.setAttribute('role', 'status');
    count.setAttribute('aria-atomic', 'true');
    const reset = Dielly.el('button', 'Сбросить фильтры', 'btn btn-outline-primary');
    reset.type = 'button';
    reset.id = `${category}-reset`;
    footer.append(count, reset);
    controls.append(fields, footer);

    const feedback = Dielly.el('div', '', 'alert alert-success d-none mb-4');
    feedback.id = `${category}-feedback`;
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-atomic', 'true');
    const feedbackText = Dielly.el('p', '', 'mb-2');
    const orderLink = Dielly.el('a', 'Перейти к заказу', 'fw-semibold');
    orderLink.href = 'order.html';
    feedback.append(feedbackText, orderLink);
    list.before(controls, feedback);

    function createProductCard(product) {
        const column = Dielly.el('div', '', 'col-12 col-md-6 col-lg-4');
        const card = Dielly.el('article', '', 'card product-card h-100 border-0 shadow-sm');
        card.id = `product-${product.id}`;
        const image = Dielly.el('img', '', 'card-img-top img-fluid product-photo');
        image.src = product.image;
        image.alt = product.alt;
        if (product.imageClass) {
            image.classList.add(product.imageClass);
        }
        const body = Dielly.el('div', '', 'card-body d-flex flex-column');
        if (product.badge) {
            body.append(Dielly.el('span', product.badge, 'badge product-badge align-self-start mb-2'));
        }
        body.append(
            Dielly.el('h2', product.name, 'card-title h5'),
            Dielly.el('p', product.description, 'card-text text-secondary'),
            Dielly.el('p', Dielly.formatMoney(product.price), 'product-price fw-bold mt-auto mb-3')
        );
        const selected = Dielly.el('p', '', 'small text-secondary mb-2 d-none');
        selected.id = `cart-count-${product.id}`;
        const add = Dielly.el('button', 'В корзину', 'btn btn-primary');
        add.type = 'button';
        add.id = `order-${product.id}`;
        add.dataset.productId = product.id;
        add.setAttribute('aria-label', `Добавить в корзину: ${product.name}`);
        body.append(selected, add);
        card.append(image, body);
        column.append(card);
        return column;
    }

    function updateSelectedProducts() {
        const cart = Dielly.getCart();
        for (const button of list.querySelectorAll('button[data-product-id]')) {
            const line = cart.find((item) => item.id === button.dataset.productId);
            const quantity = line ? line.quantity : 0;
            const card = button.closest('article');
            const selected = card.querySelector('p[id^="cart-count-"]');
            selected.textContent = quantity > 0 ? `В корзине: ${quantity} шт.` : '';
            selected.classList.toggle('d-none', quantity === 0);
            card.classList.toggle('border-0', quantity === 0);
            card.classList.toggle('border-primary', quantity > 0);
            button.textContent = quantity > 0 ? 'Добавить ещё' : 'В корзину';
            const product = Dielly.getProduct(button.dataset.productId);
            button.setAttribute('aria-label', `${button.textContent}: ${product.name}`);
        }
    }

    function showEmptyMessage(message) {
        const column = Dielly.el('div', '', 'col-12');
        column.append(Dielly.el('p', message, 'alert alert-info mb-0'));
        list.replaceChildren(column);
    }

    function renderProducts() {
        const value = budget.value.trim();
        const maxPrice = value === '' ? null : Number(value);
        const invalidBudget = budget.validity.badInput || (maxPrice !== null
            && (!Number.isSafeInteger(maxPrice) || maxPrice < 0));
        budget.classList.toggle('is-invalid', invalidBudget);
        budget.setAttribute('aria-invalid', String(invalidBudget));
        budgetError.textContent = invalidBudget ? 'Введите целую сумму от 0 или оставьте поле пустым.' : '';
        if (invalidBudget) {
            count.textContent = 'Исправьте максимальную цену.';
            showEmptyMessage('Для поиска исправьте цену или сбросьте фильтры.');
            return;
        }
        const products = Dielly.selectProducts(category, search.value, maxPrice, sort.value);
        const total = Dielly.products.filter((product) => product.category === category).length;
        count.textContent = `Найдено: ${products.length} из ${total}`;
        if (products.length === 0) {
            showEmptyMessage('Ничего не найдено. Измените запрос, увеличьте бюджет или сбросьте фильтры.');
        } else {
            list.replaceChildren(...products.map(createProductCard));
            updateSelectedProducts();
        }
    }

    function applyFilters() {
        feedback.classList.add('d-none');
        renderProducts();
    }

    controls.addEventListener('submit', (event) => {
        event.preventDefault();
        applyFilters();
        if (budget.getAttribute('aria-invalid') === 'true') {
            budget.focus();
        }
    });
    search.addEventListener('input', applyFilters);
    budget.addEventListener('input', applyFilters);
    sort.addEventListener('change', applyFilters);
    reset.addEventListener('click', () => {
        controls.reset();
        applyFilters();
        search.focus();
    });
    list.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-product-id]');
        if (!button || !list.contains(button)) {
            return;
        }
        const product = Dielly.getProduct(button.dataset.productId);
        if (!product) {
            return;
        }
        const added = Dielly.addToCart(product.id);
        const line = Dielly.getCart().find((item) => item.id === product.id);
        feedback.classList.remove('d-none');
        feedback.classList.toggle('alert-success', added);
        feedback.classList.toggle('alert-warning', !added);
        feedbackText.textContent = added
            ? `${product.name} добавлен в корзину. Количество: ${line.quantity} шт.`
            : `В демонстрации можно добавить не больше ${Dielly.maxQuantity} шт. одного товара. Измените количество в заказе.`;
    });
    document.addEventListener('dielly:cartchange', updateSelectedProducts);
    renderProducts();
})();


// FEATURES 2 and 3 — original js/order.js
// FEATURE 2: renderCart и обработчики корзины — строки, количества, удаление и итоги.
// FEATURE 3: normalizePhone/validPhone/errorFor/validateField и submit — проверка заказа и сброс.

'use strict';

(() => {
    const form = document.getElementById('order-form');
    if (!form || form.dataset.orderReady === 'true') {
        return;
    }
    form.dataset.orderReady = 'true';
    form.noValidate = true;

    const name = document.getElementById('order-name');
    const phone = document.getElementById('order-phone');
    const productSelect = document.getElementById('order-product');
    const address = document.getElementById('order-address');
    const comments = document.getElementById('order-comments');
    const summary = document.getElementById('order-summary');
    const total = document.getElementById('order-total');
    const errors = document.getElementById('order-errors');
    const submit = document.getElementById('order-submit');
    const message = document.getElementById('order-message');
    const resultNote = document.querySelector('#order-result > p');
    const touched = new Set();
    const pendingSelectionMessage = 'Есть незавершённое добавление товара. Нажмите «Добавить в корзину» или «Сбросить выбор для добавления» перед подтверждением.';
    let submitted = false;

    name.autocomplete = 'name';
    name.maxLength = 100;
    phone.autocomplete = 'tel';
    phone.inputMode = 'tel';
    address.autocomplete = 'street-address';
    address.maxLength = 250;
    productSelect.required = false;
    message.tabIndex = -1;
    message.classList.add('text-break');
    resultNote.textContent = 'Демонстрационный результат появится после проверки формы.';

    const phoneLabel = Dielly.el('label', 'Повторите телефон:', 'form-label fw-semibold mt-3');
    phoneLabel.htmlFor = 'order-phone-confirm';
    const phoneConfirm = Dielly.el('input', '', 'form-control');
    phoneConfirm.id = 'order-phone-confirm';
    phoneConfirm.name = 'phone-confirm';
    phoneConfirm.type = 'tel';
    phoneConfirm.inputMode = 'tel';
    phoneConfirm.autocomplete = 'off';
    phoneConfirm.required = true;
    const phoneHint = Dielly.el('p', 'Повторный ввод помогает проверить контакт для доставки.', 'small text-secondary mb-0');
    phoneHint.id = 'order-phone-confirm-hint';
    phoneConfirm.setAttribute('aria-describedby', phoneHint.id);
    phone.after(phoneLabel, phoneConfirm, phoneHint);

    const addPanel = Dielly.el('div', '', 'mt-3');
    const quantityLabel = Dielly.el('label', 'Количество для добавления:', 'form-label');
    quantityLabel.htmlFor = 'order-add-quantity';
    const addQuantity = Dielly.el('input', '', 'form-control');
    addQuantity.id = 'order-add-quantity';
    addQuantity.type = 'number';
    addQuantity.min = '1';
    addQuantity.max = String(Dielly.maxQuantity);
    addQuantity.step = '1';
    addQuantity.value = '1';
    addQuantity.defaultValue = '1';
    addQuantity.inputMode = 'numeric';
    const quantityHint = Dielly.el('p', `Лимит демонстрации: до ${Dielly.maxQuantity} шт. каждого товара.`, 'small text-secondary mb-2');
    quantityHint.id = 'order-quantity-hint';
    addQuantity.setAttribute('aria-describedby', quantityHint.id);
    const preview = Dielly.el('p', 'Выберите товар, чтобы увидеть стоимость.', 'small mt-2 mb-2');
    preview.id = 'order-product-preview';
    preview.setAttribute('aria-live', 'polite');
    const addButton = Dielly.el('button', 'Добавить в корзину', 'btn btn-outline-primary');
    addButton.type = 'button';
    addButton.id = 'order-add-product';
    const resetSelection = Dielly.el('button', 'Сбросить выбор для добавления', 'btn btn-outline-secondary');
    resetSelection.type = 'button';
    resetSelection.id = 'order-reset-selection';
    const addActions = Dielly.el('div', '', 'd-flex flex-wrap gap-2');
    addActions.append(addButton, resetSelection);
    addPanel.append(quantityLabel, addQuantity, quantityHint, preview, addActions);
    productSelect.after(addPanel);

    const cartList = Dielly.el('ul', '', 'list-unstyled mb-3');
    cartList.id = 'order-cart-items';
    const empty = Dielly.el('p', 'Корзина пуста. Выберите товар выше или в каталоге.', 'mb-3');
    empty.id = 'order-cart-empty';
    const quantityTotal = Dielly.el('output', '0');
    quantityTotal.id = 'order-cart-quantity';
    const quantityLine = Dielly.el('p', 'Всего товаров: ', 'mb-1');
    quantityLine.append(quantityTotal);
    const totalLine = Dielly.el('p', 'Итого за товары: ', 'fw-semibold mb-3');
    totalLine.append(total);
    const clear = Dielly.el('button', 'Очистить корзину', 'btn btn-outline-secondary btn-sm');
    clear.id = 'order-clear-cart';
    clear.type = 'button';
    const feedback = Dielly.el('p', '', 'small text-secondary mt-2 mb-0');
    feedback.id = 'order-cart-feedback';
    feedback.setAttribute('role', 'status');
    summary.replaceChildren(Dielly.el('h2', 'Корзина', 'h5'), empty, cartList,
        quantityLine, totalLine, clear, feedback);

    function hideResult() {
        message.classList.add('d-none');
        message.replaceChildren();
    }

    function normalizePhone(value) {
        const digits = value.replace(/\D/g, '');
        return digits.startsWith('8') ? `7${digits.slice(1)}` : digits;
    }

    function validPhone(value) {
        const trimmed = value.trim();
        return /^(\+7|8)[\d\s()-]+$/.test(trimmed) && normalizePhone(trimmed).length === 11;
    }

    function errorFor(field) {
        const value = field.value.trim();
        if (field === name) {
            return value.length > 0 && /\p{L}/u.test(value) && value.length <= 100
                ? '' : 'Укажите имя: от 1 до 100 символов, включая буквы.';
        }
        if (field === phone) {
            return validPhone(value) ? '' : 'Введите телефон из 11 цифр, начиная с +7 или 8.';
        }
        if (field === phoneConfirm) {
            if (!validPhone(value)) {
                return 'Повторите телефон полностью: 11 цифр, начиная с +7 или 8.';
            }
            return normalizePhone(value) === normalizePhone(phone.value)
                ? '' : 'Номера телефонов не совпадают. Проверьте оба поля.';
        }
        if (field === address) {
            return value.length > 0 && /\p{L}/u.test(value) && value.length <= 250
                ? '' : 'Укажите адрес доставки с названием улицы (до 250 символов).';
        }
        if (field === productSelect) {
            return Dielly.getProduct(value) ? '' : 'Выберите товар для добавления в корзину.';
        }
        if (field === addQuantity) {
            const quantity = Number(value);
            if (!Number.isInteger(quantity) || quantity < 1 || quantity > Dielly.maxQuantity) {
                return `Укажите целое количество от 1 до ${Dielly.maxQuantity}.`;
            }
            const existing = Dielly.getCart().find((line) => line.id === productSelect.value);
            return existing && existing.quantity + quantity > Dielly.maxQuantity
                ? `С учётом корзины можно добавить ещё ${Dielly.maxQuantity - existing.quantity} шт.` : '';
        }
        return '';
    }

    function validateField(field) {
        touched.add(field);
        return Dielly.setFieldError(field, errorFor(field));
    }

    function updatePreview() {
        const product = Dielly.getProduct(productSelect.value);
        const quantity = Number(addQuantity.value);
        if (product && Number.isInteger(quantity) && quantity > 0 && quantity <= Dielly.maxQuantity) {
            preview.textContent = `${product.name}: ${Dielly.formatMoney(product.price)} × ${quantity} = ${Dielly.formatMoney(product.price * quantity)}. Нажмите «Добавить в корзину».`;
        } else {
            preview.textContent = product ? 'Укажите корректное количество.' : 'Выберите товар, чтобы увидеть стоимость.';
        }
    }

    function updateErrorSummary() {
        const invalid = form.querySelectorAll('[aria-invalid="true"]');
        const pending = submitted && (touched.has(productSelect) || touched.has(addQuantity));
        if (invalid.length > 0) {
            errors.textContent = 'Исправьте отмеченные поля. Подробности указаны рядом с ними.';
        } else {
            errors.textContent = pending ? pendingSelectionMessage : '';
        }
        errors.classList.toggle('d-none', invalid.length === 0 && !pending);
    }

    function renderCart() {
        const activeId = summary.contains(document.activeElement) ? document.activeElement.id : '';
        const state = Dielly.cartSummary();
        cartList.replaceChildren();
        for (const line of state.items) {
            const item = Dielly.el('li', '', 'border-bottom pb-3 mb-3');
            const title = Dielly.el('h3', line.product.name, 'h6 text-break');
            const price = Dielly.el('p', `Цена за шт.: ${Dielly.formatMoney(line.product.price)}`, 'small mb-2');
            const controls = Dielly.el('div', '', 'd-flex flex-wrap align-items-center gap-2');
            const minus = Dielly.el('button', '−1', 'btn btn-outline-secondary btn-sm');
            minus.type = 'button';
            minus.id = `cart-${line.product.id}-minus`;
            minus.setAttribute('aria-label', `Уменьшить количество: ${line.product.name}`);
            minus.addEventListener('click', () => {
                Dielly.setQuantity(line.product.id, line.quantity - 1);
                feedback.textContent = line.quantity === 1 ? `${line.product.name}: товар удалён.` : `${line.product.name}: количество уменьшено.`;
            });
            const count = Dielly.el('span', `${line.quantity} шт.`, 'fw-semibold');
            const plus = Dielly.el('button', '+1', 'btn btn-outline-secondary btn-sm');
            plus.type = 'button';
            plus.id = `cart-${line.product.id}-plus`;
            plus.disabled = line.quantity >= Dielly.maxQuantity;
            plus.setAttribute('aria-label', `Увеличить количество: ${line.product.name}`);
            plus.addEventListener('click', () => {
                Dielly.setQuantity(line.product.id, line.quantity + 1);
                feedback.textContent = `${line.product.name}: количество увеличено.`;
            });
            const remove = Dielly.el('button', 'Удалить', 'btn btn-outline-danger btn-sm');
            remove.type = 'button';
            remove.id = `cart-${line.product.id}-remove`;
            remove.setAttribute('aria-label', `Удалить из корзины: ${line.product.name}`);
            remove.addEventListener('click', () => {
                Dielly.removeFromCart(line.product.id);
                feedback.textContent = `${line.product.name}: товар удалён.`;
            });
            controls.append(minus, count, plus, remove);
            item.append(title, price, controls, Dielly.el('p', `Сумма: ${Dielly.formatMoney(line.subtotal)}`, 'fw-semibold mt-2 mb-0'));
            cartList.append(item);
        }
        quantityTotal.textContent = String(state.quantity);
        total.textContent = Dielly.formatMoney(state.total);
        empty.classList.toggle('d-none', state.items.length !== 0);
        clear.disabled = state.items.length === 0;
        submit.disabled = state.items.length === 0;
        if (activeId) {
            const replacement = document.getElementById(activeId);
            if (replacement && !replacement.disabled) {
                replacement.focus();
            } else {
                const row = replacement ? replacement.closest('li') : null;
                const next = (row && row.querySelector('button:not(:disabled)'))
                    || cartList.querySelector('button:not(:disabled)');
                (next || productSelect).focus();
            }
        }
    }

    addButton.addEventListener('click', () => {
        hideResult();
        const productValid = validateField(productSelect);
        const quantityValid = validateField(addQuantity);
        updateErrorSummary();
        if (!productValid || !quantityValid) {
            (productValid ? addQuantity : productSelect).focus();
            return;
        }
        const product = Dielly.getProduct(productSelect.value);
        if (Dielly.addToCart(product.id, Number(addQuantity.value))) {
            feedback.textContent = `${product.name}: добавлено ${addQuantity.value} шт. Корзина обновлена.`;
            Dielly.clearFieldState(productSelect);
            Dielly.clearFieldState(addQuantity);
            touched.delete(productSelect);
            touched.delete(addQuantity);
            updateErrorSummary();
        }
    });

    resetSelection.addEventListener('click', () => {
        hideResult();
        productSelect.value = '';
        addQuantity.value = '1';
        for (const field of [productSelect, addQuantity]) {
            Dielly.clearFieldState(field);
            touched.delete(field);
        }
        updatePreview();
        updateErrorSummary();
        feedback.textContent = 'Выбор для добавления сброшен. Товары в корзине сохранены.';
        productSelect.focus();
    });

    for (const field of [productSelect, addQuantity]) {
        field.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (!event.repeat && !event.isComposing) {
                    addButton.click();
                }
            }
        });
    }

    clear.addEventListener('click', () => {
        Dielly.clearCart();
        feedback.textContent = 'Корзина очищена.';
    });

    const checkoutFields = [name, phone, phoneConfirm, address];
    for (const field of [...checkoutFields, productSelect, addQuantity]) {
        const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
        field.addEventListener(eventName, () => {
            hideResult();
            if (field === productSelect || field === addQuantity) {
                touched.add(field);
            }
            if (touched.has(field) || (submitted && checkoutFields.includes(field))) {
                validateField(field);
            }
            if (field === phone && touched.has(phoneConfirm)) {
                validateField(phoneConfirm);
            }
            if (field === productSelect && touched.has(addQuantity)) {
                validateField(addQuantity);
            }
            updatePreview();
            updateErrorSummary();
        });
    }
    comments.addEventListener('input', hideResult);

    document.addEventListener('dielly:cartchange', () => {
        hideResult();
        renderCart();
        if (touched.has(addQuantity)) {
            validateField(addQuantity);
            updateErrorSummary();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        hideResult();
        submitted = true;
        const pendingFields = [productSelect, addQuantity].filter((field) => touched.has(field));
        for (const field of [...checkoutFields, ...pendingFields]) {
            validateField(field);
        }
        const invalid = form.querySelectorAll('[aria-invalid="true"]');
        const state = Dielly.cartSummary();
        updateErrorSummary();
        if (invalid.length > 0) {
            invalid[0].focus();
            return;
        }
        if (pendingFields.length > 0) {
            errors.textContent = pendingSelectionMessage;
            errors.classList.remove('d-none');
            addButton.focus();
            return;
        }
        if (state.items.length === 0) {
            errors.textContent = 'Корзина пуста. Добавьте хотя бы один товар перед подтверждением.';
            errors.classList.remove('d-none');
            productSelect.focus();
            return;
        }
        // Save only a DOM summary. Personal fields never enter cart storage.
        const result = Dielly.el('div');
        result.append(Dielly.el('p', 'Проверка пройдена. Это демонстрация интерфейса.', 'fw-semibold'));
        result.append(Dielly.el('p', 'Информация не отправлена на сервер. Реальный заказ и платёж не созданы.'));
        result.append(Dielly.el('p', `Временная метка демонстрации: ${Dielly.createDemoReference()}`, 'small text-break'));
        result.append(Dielly.el('p', `Имя: ${name.value.trim()}`));
        result.append(Dielly.el('p', `Телефон: ${phone.value.trim()}`));
        result.append(Dielly.el('p', `Адрес доставки: ${address.value.trim()}`));
        const selected = Dielly.el('ul', '', 'ps-3');
        for (const line of state.items) {
            selected.append(Dielly.el('li', `${line.product.name} — ${line.quantity} шт., ${Dielly.formatMoney(line.subtotal)}`));
        }
        result.append(selected, Dielly.el('p', `Всего: ${state.quantity} шт. Итого за товары: ${Dielly.formatMoney(state.total)}`, 'fw-semibold'));
        if (comments.value.trim()) {
            result.append(Dielly.el('p', `Текст открытки: ${comments.value.trim()}`, 'text-break'));
        }
        Dielly.clearCart();
        form.reset();
        for (const field of [...checkoutFields, productSelect, addQuantity]) {
            Dielly.clearFieldState(field);
        }
        touched.clear();
        submitted = false;
        errors.classList.add('d-none');
        feedback.textContent = 'Демонстрация завершена. Корзина очищена; новый выбор создаст новую сводку.';
        updatePreview();
        message.replaceChildren(result);
        message.classList.remove('d-none');
        message.focus();
    });

    submit.type = 'submit';
    submit.textContent = 'Проверить и показать демо-заказ';
    renderCart();
    updatePreview();
})();
