'use strict';

(() => {
    const byId = (id) => document.getElementById(id);
    const form = byId('order-form');
    if (!form || form.dataset.orderReady) return;
    form.dataset.orderReady = 'true';
    form.noValidate = true;

    const { el, formatMoney, maxQuantity } = Dielly;
    const name = byId('order-name');
    const phone = byId('order-phone');
    const product = byId('order-product');
    const address = byId('order-address');
    const comments = byId('order-comments');
    const summary = byId('order-summary');
    const total = byId('order-total');
    const errors = byId('order-errors');
    const submit = byId('order-submit');
    const result = byId('order-result');
    const message = byId('order-message');
    const receiptKey = 'dielly-last-summary-v1';
    const checked = new Set();
    let submitted = false;
    let downloadUrl = '';

    function labelledInput(after, labelText, attributes) {
        const label = el('label', labelText, 'form-label fw-semibold mt-3');
        const field = Object.assign(el('input', '', 'form-control'), attributes);
        label.htmlFor = field.id;
        after.after(label, field);
        return field;
    }

    function button(id, label, classes) {
        return Object.assign(el('button', label, classes), { id, type: 'button' });
    }

    const email = labelledInput(name, 'Email:', {
        id: 'order-email', name: 'email', type: 'email', autocomplete: 'email', required: true, maxLength: 254
    });
    const confirmPhone = labelledInput(phone, 'Повторите телефон:', {
        id: 'order-phone-confirm', name: 'phone-confirm', type: 'tel', autocomplete: 'off', required: true
    });
    const quantity = labelledInput(product, 'Количество для добавления:', {
        id: 'order-add-quantity', type: 'number', inputMode: 'numeric', min: '1',
        max: String(maxQuantity), step: '1', defaultValue: '1'
    });
    Object.assign(name, { autocomplete: 'name', maxLength: 100 });
    Object.assign(address, { autocomplete: 'address-line1', maxLength: 250 });
    phone.autocomplete = 'tel';
    product.required = false; // Товар уже может быть в корзине после перехода из каталога.
    submit.type = 'submit';
    submit.textContent = 'Подготовить сводку';

    const preview = el('p', '', 'small mt-2 mb-2');
    preview.id = 'order-product-preview';
    preview.setAttribute('aria-live', 'polite');
    quantity.setAttribute('aria-describedby', preview.id);
    const add = button('order-add-product', 'Добавить в корзину', 'btn btn-outline-primary');
    const reset = button('order-reset-selection', 'Сбросить выбор для добавления', 'btn btn-outline-secondary');
    const addActions = el('div', '', 'd-flex flex-wrap gap-2');
    addActions.append(add, reset);
    quantity.after(preview, addActions);

    const list = el('ul', '', 'list-unstyled mb-3');
    list.id = 'order-cart-items';
    const empty = el('p', 'Корзина пуста. Выберите товар выше или в каталоге.', 'mb-3');
    empty.id = 'order-cart-empty';
    const count = el('output');
    count.id = 'order-cart-quantity';
    const countLine = el('p', 'Всего товаров: ', 'mb-1');
    countLine.append(count);
    const totalLine = el('p', 'Итого за товары: ', 'fw-semibold mb-3');
    totalLine.append(total);
    const clear = button('order-clear-cart', 'Очистить корзину', 'btn btn-outline-secondary btn-sm');
    const feedback = el('p', '', 'small text-secondary mt-2 mb-0');
    feedback.id = 'order-cart-feedback';
    feedback.setAttribute('role', 'status');
    summary.replaceChildren(el('h2', 'Корзина', 'h5'), empty, list, countLine, totalLine, clear, feedback);

    byId('order-result-title').textContent = 'Сводка заказа';
    result.querySelector('p').textContent = 'Сводка подготовлена на этом устройстве. Заказ в бутик не отправлен, оплата не проводилась.';
    result.classList.add('d-none');
    message.classList.add('text-break');
    message.tabIndex = -1;

    function phoneDigits(value) {
        return value.trim().replace(/\D/g, '').replace(/^8/, '7');
    }

    function validPhone(value) {
        return /^(?:\+7|8)[\p{Zs}-]?(?:\(\d{3}\)|\d{3})(?:[\p{Zs}-]?\d){7}$/u.test(value);
    }

    function checkoutFields() {
        return Array.from(form.querySelectorAll('input, select, textarea'))
            .filter((field) => field !== quantity && field !== product && field.willValidate);
    }

    function fieldError(field) {
        const value = field.value.trim();
        if (field === product && !Dielly.getProduct(value)) {
            return 'Выберите товар для добавления в корзину.';
        }
        if (field === quantity) {
            const amount = field.valueAsNumber;
            if (!Number.isInteger(amount) || amount < 1 || amount > maxQuantity) {
                return `Укажите целое количество от 1 до ${maxQuantity}.`;
            }
            const existing = Dielly.getCart().find((item) => item.id === product.value);
            if (existing && existing.quantity + amount > maxQuantity) {
                return existing.quantity === maxQuantity ? 'В корзине уже максимальное количество.'
                    : `Можно добавить ещё до ${maxQuantity - existing.quantity} шт.`;
            }
        }
        if (field === name && !/\p{L}/u.test(value)) return 'Укажите имя, содержащее буквы.';
        if (field === address && !/\p{L}/u.test(value)) return 'Укажите адрес доставки с названием улицы.';
        if ((field === phone || field === confirmPhone) && !validPhone(value)) {
            return 'Введите 11 цифр, начиная с +7 или 8, например +7 (701) 380-58-56.';
        }
        if (field === confirmPhone && phoneDigits(value) !== phoneDigits(phone.value)) {
            return 'Номера телефонов не совпадают. Проверьте оба поля.';
        }
        return Dielly.fieldError(field);
    }

    function validate(field) {
        checked.add(field);
        return Dielly.setFieldError(field, fieldError(field));
    }

    function hasSelection() {
        return product.value !== '' || quantity.value !== '1' || quantity.validity.badInput;
    }

    function updatePreview() {
        const selected = Dielly.getProduct(product.value);
        if (!selected) {
            preview.textContent = `Выберите товар. Можно добавить до ${maxQuantity} шт. каждого товара.`;
        } else if (fieldError(quantity)) {
            preview.textContent = `Цена за штуку: ${formatMoney(selected.price)}.`;
        } else {
            const amount = quantity.valueAsNumber;
            preview.textContent = `${selected.name}: ${formatMoney(selected.price)} × ${amount} = ${formatMoney(selected.price * amount)}.`;
        }
        reset.disabled = !hasSelection() && !checked.has(product) && !checked.has(quantity);
    }

    function updateErrors() {
        let text = '';
        if (form.querySelector('.is-invalid')) {
            text = 'Исправьте отмеченные поля.';
        } else if (submitted && hasSelection()) {
            text = 'Добавьте выбранный товар в корзину или сбросьте выбор.';
        } else if (submitted && !Dielly.getCart().length) {
            text = 'Добавьте хотя бы один товар в корзину.';
        }
        errors.textContent = text;
        errors.classList.toggle('d-none', !text);
    }

    function clearSelection() {
        product.value = '';
        quantity.value = '1';
        for (const field of [product, quantity]) {
            Dielly.clearFieldState(field);
            checked.delete(field);
        }
        updatePreview();
        updateErrors();
    }

    function cartRow(line) {
        const { product: item, quantity: amount, subtotal } = line;
        const row = el('li', '', 'border-bottom pb-3 mb-3');
        row.dataset.productId = item.id;
        const controls = el('div', '', 'd-flex flex-wrap align-items-center gap-2');
        function actionButton(action, label, description, classes) {
            const control = button(`cart-${item.id}-${action}`, label, `btn btn-sm ${classes}`);
            control.dataset.cartAction = action;
            control.setAttribute('aria-label', `${description}: ${item.name}`);
            return control;
        }
        const minus = actionButton('minus', '−1', 'Уменьшить количество', 'btn-outline-secondary');
        const plus = actionButton('plus', '+1', 'Увеличить количество', 'btn-outline-secondary');
        plus.disabled = amount >= maxQuantity;
        controls.append(minus, el('span', `${amount} шт.`, 'fw-semibold'), plus,
            actionButton('remove', 'Удалить', 'Удалить из корзины', 'btn-outline-danger'));
        row.append(el('h3', item.name, 'h6 text-break'),
            el('p', `Цена за шт.: ${formatMoney(item.price)}`, 'small mb-2'), controls,
            el('p', `Сумма: ${formatMoney(subtotal)}`, 'fw-semibold mt-2 mb-0'));
        return row;
    }

    function renderCart() {
        const focused = summary.contains(document.activeElement) ? document.activeElement.id : '';
        const state = Dielly.cartSummary();
        list.replaceChildren(...state.items.map(cartRow));
        count.textContent = state.quantity;
        total.textContent = formatMoney(state.total);
        empty.classList.toggle('d-none', state.items.length > 0);
        clear.disabled = !state.items.length;
        if (focused) {
            const replacement = byId(focused);
            const next = replacement && !replacement.disabled ? replacement : list.querySelector('button') || product;
            next.focus();
        }
    }

    list.addEventListener('click', (event) => {
        const control = event.target.closest('button[data-cart-action]');
        if (!control || !list.contains(control)) return;
        const id = control.closest('li').dataset.productId;
        const item = Dielly.getCart().find((line) => line.id === id);
        if (!item) return;
        const action = control.dataset.cartAction;
        const amount = action === 'remove' ? 0 : item.quantity + (action === 'plus' ? 1 : -1);
        if (Dielly.setQuantity(id, amount)) {
            feedback.textContent = `${Dielly.getProduct(id).name}: ${amount ? `в корзине ${amount} шт.` : 'товар удалён.'}`;
        }
    });

    function addSelection() {
        if (downloadUrl) forgetReceipt();
        const productValid = validate(product);
        const quantityValid = validate(quantity);
        if (!productValid || !quantityValid) {
            updatePreview();
            updateErrors();
            (productValid ? quantity : product).focus();
            return;
        }
        const item = Dielly.getProduct(product.value);
        const amount = quantity.valueAsNumber;
        if (Dielly.addToCart(item.id, amount)) {
            feedback.textContent = `${item.name}: добавлено ${amount} шт.`;
            clearSelection();
        } else {
            validate(quantity);
            updateErrors();
        }
    }

    add.addEventListener('click', addSelection);
    reset.addEventListener('click', () => {
        clearSelection();
        feedback.textContent = 'Выбор для добавления сброшен.';
        product.focus();
    });
    clear.addEventListener('click', () => {
        Dielly.clearCart();
        feedback.textContent = 'Корзина очищена.';
    });
    form.addEventListener('keydown', (event) => {
        if (event.target !== quantity && (event.target !== product || !product.value)) return;
        if (event.key === 'Enter' && !event.isComposing) {
            event.preventDefault();
            if (!event.repeat) addSelection();
        }
    });

    function forgetReceipt() {
        if (downloadUrl) {
            URL.revokeObjectURL(downloadUrl);
            downloadUrl = '';
        }
        result.classList.add('d-none');
        message.replaceChildren();
        submit.disabled = false;
        try { sessionStorage.removeItem(receiptKey); } catch { /* Сводка доступна и без хранилища. */ }
    }

    function displayReceipt(reference, state, contactLines = []) {
        const productLines = state.items.map(({ product: item, quantity: amount, subtotal }) =>
            `${item.name} — ${amount} × ${formatMoney(item.price)} = ${formatMoney(subtotal)}`);
        const totals = `Всего: ${state.quantity} шт. Итого за товары: ${formatMoney(state.total)}.`;
        const items = el('ul', '', 'ps-3');
        for (const line of productLines) items.append(el('li', line));
        const title = `Dielly · Сводка ${reference}`;
        const text = [title, ...productLines, totals, result.querySelector('p').textContent].join('\r\n');
        downloadUrl = URL.createObjectURL(new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' }));
        const download = el('a', 'Скачать список товаров (.txt)', 'btn btn-outline-primary btn-sm');
        download.href = downloadUrl;
        download.download = `dielly-${reference}.txt`;
        message.replaceChildren(el('p', title, 'fw-semibold'), items, el('p', totals, 'fw-semibold'));
        for (const line of contactLines) message.append(el('p', line, 'mb-2 text-break'));
        message.append(download);
        message.classList.remove('d-none');
        result.classList.remove('d-none');
        submit.disabled = true;
    }

    function restoreReceipt() {
        try {
            const saved = JSON.parse(sessionStorage.getItem(receiptKey));
            if (!saved) return;
            const state = Dielly.getCartSummary(saved.items);
            if (!Dielly.getCart().length && typeof saved.reference === 'string' && /^DEMO-\d{8}$/.test(saved.reference)
                && state.items.length && state.total === saved.total) {
                displayReceipt(saved.reference, state);
            } else {
                forgetReceipt();
            }
        } catch {
            forgetReceipt();
        }
    }

    function takeContacts() {
        try {
            const raw = sessionStorage.getItem('dielly-order-contact');
            if (!raw) return;
            sessionStorage.removeItem('dielly-order-contact');
            const contact = JSON.parse(raw);
            for (const field of [name, email]) {
                if (!field.value && typeof contact?.[field.name] === 'string') {
                    field.value = contact[field.name].trim();
                    if (fieldError(field)) field.value = '';
                }
            }
            if (name.value || email.value) forgetReceipt();
        } catch { /* Ввод вручную доступен при отключённом хранилище. */ }
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (submit.disabled) return;
        submitted = true;
        const fields = checkoutFields();
        for (const field of fields) {
            if (['text', 'email', 'tel', 'url', 'search', 'textarea'].includes(field.type)) {
                field.value = field.value.trim();
            }
            validate(field);
        }
        const state = Dielly.cartSummary();
        if (hasSelection()) {
            validate(product);
            validate(quantity);
        } else if (!state.items.length) {
            validate(product);
        } else {
            clearSelection();
        }
        updateErrors();
        const invalid = form.querySelector('.is-invalid');
        if (invalid || hasSelection() || !state.items.length) {
            (invalid || add).focus();
            return;
        }

        const contactLines = [`Имя: ${name.value}`, `Email: ${email.value}`, `Телефон: ${phone.value}`,
            `Адрес доставки: ${address.value}`];
        if (comments.value) contactLines.push(`Текст открытки: ${comments.value}`);
        const reference = Dielly.createDemoReference();
        // После обновления вкладки восстанавливается только состав заказа, без контактов и открытки.
        const saved = { reference, items: Dielly.getCart(), total: state.total };
        Dielly.clearCart();
        form.reset();
        feedback.textContent = '';
        try { sessionStorage.setItem(receiptKey, JSON.stringify(saved)); } catch { /* Скачивание всё равно работает. */ }
        displayReceipt(reference, state, contactLines);
        message.focus();
    });

    function onEdit(event) {
        const field = event.target;
        if (!field.matches('input, select, textarea')) return;
        if (downloadUrl) forgetReceipt();
        if (field === product || field === quantity) {
            if (!hasSelection() && Dielly.getCart().length) {
                clearSelection();
            } else {
                validate(field);
                if (field === product && checked.has(quantity)) validate(quantity);
                updatePreview();
            }
        } else {
            if (submitted || checked.has(field)) validate(field);
            if (field === phone && checked.has(confirmPhone)) validate(confirmPhone);
            if (field.type === 'radio') {
                for (const other of checked) {
                    if (other.type === 'radio' && other.name === field.name) validate(other);
                }
            }
        }
        updateErrors();
    }
    form.addEventListener('input', onEdit);
    form.addEventListener('change', onEdit);
    form.addEventListener('reset', () => {
        forgetReceipt();
        submitted = false;
        for (const field of checked) Dielly.clearFieldState(field);
        checked.clear();
        clearSelection();
    });
    document.addEventListener('dielly:cartchange', () => {
        if (downloadUrl && Dielly.getCart().length) forgetReceipt();
        feedback.textContent = '';
        renderCart();
        if (checked.has(quantity)) validate(quantity);
        if (!hasSelection() && Dielly.getCart().length) clearSelection();
        updatePreview();
        updateErrors();
    });
    renderCart();
    updatePreview();
    restoreReceipt();
    takeContacts();
})();
