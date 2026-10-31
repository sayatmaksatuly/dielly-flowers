'use strict';

// jQuery 3.7.1 full: ready ждёт DOM и общие функции из main.js.
$(function () {
    const form = $('#order-form');
    if (!form.length || form.data('orderReady')) {
        return;
    }
    form.data('orderReady', true);
    // Браузер первым проверяет required/type/min/max; invalid покажет все ошибки через jQuery.
    form.prop('noValidate', false);

    const name = $('#order-name');
    const phone = $('#order-phone');
    const productSelect = $('#order-product');
    const address = $('#order-address');
    const comments = $('#order-comments');
    const summary = $('#order-summary');
    const total = $('#order-total');
    const errors = $('#order-errors');
    const submit = $('#order-submit');
    const message = $('#order-message');
    const resultSection = $('#order-result');
    const touched = new Set();
    const pendingSelectionMessage = 'Есть незавершённое добавление товара. Нажмите «Добавить в корзину» или «Сбросить выбор для добавления» перед подтверждением.';
    let submitted = false;
    let extraFieldNumber = 0;

    name.attr({ autocomplete: 'name', maxlength: 100 });
    phone.attr({ autocomplete: 'tel', inputmode: 'tel' });
    address.attr({ autocomplete: 'street-address', maxlength: 250 });
    // Select нужен только для добавления: уже заполненная корзина оформляется без него.
    productSelect.prop('required', false);
    message.attr('tabindex', -1).addClass('text-break');
    // Удаляем только прежние служебные пояснения, сохраняя подсказки и контейнеры результата.
    submit.next('p').filter(function () {
        return $(this).text().trim() === 'Данные не отправляются. Заказ можно подготовить, но не оформить на этом статическом сайте.';
    }).remove();
    resultSection.children('p').filter(function () {
        return $(this).text().trim() === 'Заказ не отправлен.';
    }).remove();
    resultSection.addClass('d-none');
    $('#order-result-title').addClass('visually-hidden');

    const emailLabel = Dielly.el('label', 'Email:', 'form-label fw-semibold mt-3')
        .attr('for', 'order-email');
    const email = Dielly.el('input', '', 'form-control')
        .attr({ id: 'order-email', name: 'email', type: 'email', autocomplete: 'email', maxlength: 254 })
        .prop('required', true);
    name.after(emailLabel, email);

    const phoneLabel = Dielly.el('label', 'Повторите телефон:', 'form-label fw-semibold mt-3')
        .attr('for', 'order-phone-confirm');
    const phoneConfirm = Dielly.el('input', '', 'form-control')
        .attr({ id: 'order-phone-confirm', name: 'phone-confirm', type: 'tel', inputmode: 'tel', autocomplete: 'off', 'aria-describedby': 'order-phone-confirm-hint' })
        .prop('required', true);
    const phoneHint = Dielly.el('p', 'Повторный ввод помогает проверить контакт для доставки.', 'small text-secondary mb-0')
        .attr('id', 'order-phone-confirm-hint');
    phone.after(phoneLabel, phoneConfirm, phoneHint);

    const addPanel = Dielly.el('div', '', 'mt-3');
    const quantityLabel = Dielly.el('label', 'Количество для добавления:', 'form-label')
        .attr('for', 'order-add-quantity');
    const addQuantity = Dielly.el('input', '', 'form-control')
        .attr({ id: 'order-add-quantity', type: 'number', min: 1, max: Dielly.maxQuantity, step: 1, inputmode: 'numeric', 'aria-describedby': 'order-quantity-hint' })
        .prop('defaultValue', '1').val('1');
    const quantityHint = Dielly.el('p', `До ${Dielly.maxQuantity} шт. каждого товара.`, 'small text-secondary mb-2')
        .attr('id', 'order-quantity-hint');
    const preview = Dielly.el('p', 'Выберите товар, чтобы увидеть стоимость.', 'small mt-2 mb-2')
        .attr({ id: 'order-product-preview', 'aria-live': 'polite' });
    const addButton = Dielly.el('button', 'Добавить в корзину', 'btn btn-outline-primary')
        .attr({ type: 'button', id: 'order-add-product' });
    const resetSelection = Dielly.el('button', 'Сбросить выбор для добавления', 'btn btn-outline-secondary')
        .attr({ type: 'button', id: 'order-reset-selection' });
    const addActions = Dielly.el('div', '', 'd-flex flex-wrap gap-2').append(addButton, resetSelection);
    addPanel.append(quantityLabel, addQuantity, quantityHint, preview, addActions);
    productSelect.after(addPanel);

    const cartList = Dielly.el('ul', '', 'list-unstyled mb-3').attr('id', 'order-cart-items');
    const empty = Dielly.el('p', 'Корзина пуста. Выберите товар выше или в каталоге.', 'mb-3')
        .attr('id', 'order-cart-empty');
    const quantityTotal = Dielly.el('output', '0').attr('id', 'order-cart-quantity');
    const quantityLine = Dielly.el('p', 'Всего товаров: ', 'mb-1').append(quantityTotal);
    const totalLine = Dielly.el('p', 'Итого за товары: ', 'fw-semibold mb-3').append(total);
    const clear = Dielly.el('button', 'Очистить корзину', 'btn btn-outline-secondary btn-sm')
        .attr({ id: 'order-clear-cart', type: 'button' });
    const feedback = Dielly.el('p', '', 'small text-secondary mt-2 mb-0')
        .attr({ id: 'order-cart-feedback', role: 'status' });
    summary.empty().append(Dielly.el('h2', 'Корзина', 'h5'), empty, cartList,
        quantityLine, totalLine, clear, feedback);

    function hideResult() {
        resultSection.addClass('d-none');
        message.addClass('d-none').empty();
    }

    function normalizePhone(value) {
        const digits = value.replace(/\D/g, '');
        return digits.startsWith('8') ? `7${digits.slice(1)}` : digits;
    }

    function validPhone(value) {
        const trimmed = value.trim();
        return /^(\+7|8)[\d\s()-]+$/.test(trimmed) && normalizePhone(trimmed).length === 11;
    }

    // FEATURE 3 — .val(), .find(), .on() и общие jQuery-подсказки заменяют value/querySelector/events.
    // DOM-код короче; сами правила проверки не стали короче, зато отделены от отображения ошибок.
    function errorFor(field) {
        const id = field.attr('id');
        const value = String(field.val() || '').trim();
        if (id === 'order-name') {
            return value.length > 0 && /\p{L}/u.test(value) && value.length <= 100
                ? '' : 'Укажите имя: от 1 до 100 символов, включая буквы.';
        }
        if (id === 'order-email') {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254
                && !field.prop('validity').typeMismatch
                ? '' : 'Введите email в формате name@example.com.';
        }
        if (id === 'order-phone') {
            return validPhone(value) ? '' : 'Введите телефон из 11 цифр, начиная с +7 или 8.';
        }
        if (id === 'order-phone-confirm') {
            if (!validPhone(value)) {
                return 'Повторите телефон полностью: 11 цифр, начиная с +7 или 8.';
            }
            return normalizePhone(value) === normalizePhone(phone.val())
                ? '' : 'Номера телефонов не совпадают. Проверьте оба поля.';
        }
        if (id === 'order-address') {
            return value.length > 0 && /\p{L}/u.test(value) && value.length <= 250
                ? '' : 'Укажите адрес доставки с названием улицы (до 250 символов).';
        }
        if (id === 'order-product') {
            return Dielly.getProduct(value) ? '' : 'Выберите товар для добавления в корзину.';
        }
        if (id === 'order-add-quantity') {
            const quantity = Number(value);
            if (!Number.isInteger(quantity) || quantity < 1 || quantity > Dielly.maxQuantity) {
                return `Укажите целое количество от 1 до ${Dielly.maxQuantity}.`;
            }
            const existing = Dielly.getCart().find((line) => line.id === productSelect.val());
            return existing && existing.quantity + quantity > Dielly.maxQuantity
                ? `С учётом корзины можно добавить ещё ${Dielly.maxQuantity - existing.quantity} шт.` : '';
        }
        if (field.prop('required') && !field.is(':checkbox, :radio') && !value) {
            return 'Заполните это поле: пробелы не считаются значением.';
        }
        // Новые обязательные поля тоже проверяются; сохраняем type/min/max/pattern и т. п.
        const validity = field.prop('validity');
        return validity && !validity.valid ? 'Проверьте значение этого поля и его обязательные ограничения.' : '';
    }

    function checkoutFields() {
        return form.find('input, select, textarea').not('#order-product, #order-add-quantity, :disabled');
    }

    function validateField(field) {
        if (!field.attr('id')) {
            extraFieldNumber += 1;
            field.attr('id', `order-extra-field-${extraFieldNumber}`);
        }
        const id = field.attr('id');
        touched.add(id);
        const validity = field.prop('validity');
        const nativeError = validity && !validity.valid
            ? 'Проверьте значение этого поля и его обязательные ограничения.' : '';
        return Dielly.setFieldError(field, errorFor(field) || nativeError);
    }

    function updatePreview() {
        const product = Dielly.getProduct(productSelect.val());
        const quantity = Number(addQuantity.val());
        if (product && Number.isInteger(quantity) && quantity > 0 && quantity <= Dielly.maxQuantity) {
            preview.text(`${product.name}: ${Dielly.formatMoney(product.price)} × ${quantity} = ${Dielly.formatMoney(product.price * quantity)}. Нажмите «Добавить в корзину».`);
        } else {
            preview.text(product ? 'Укажите корректное количество.' : 'Выберите товар, чтобы увидеть стоимость.');
        }
    }

    function hasPendingSelection() {
        return touched.has('order-product') || touched.has('order-add-quantity');
    }

    function updateErrorSummary() {
        const invalid = form.find('[aria-invalid="true"]');
        const pending = submitted && hasPendingSelection();
        errors.text(invalid.length ? 'Исправьте отмеченные поля. Подробности указаны рядом с ними.'
            : (pending ? pendingSelectionMessage : '')).toggleClass('d-none', !invalid.length && !pending);
    }

    function validateForm() {
        hideResult();
        submitted = true;
        checkoutFields().each(function () {
            validateField($(this));
        });
        for (const field of [productSelect, addQuantity]) {
            if (touched.has(field.attr('id')) || !field.prop('validity').valid) {
                validateField(field);
            }
        }
        const invalid = form.find('[aria-invalid="true"]');
        updateErrorSummary();
        if (invalid.length) {
            invalid.first().trigger('focus');
        }
        return invalid.length === 0;
    }

    function bindNativeValidation() {
        form.find('input, select, textarea').each(function () {
            const field = $(this);
            if (field.data('orderInvalidReady')) {
                return;
            }
            // invalid не всплывает: .on() подключён к самому контролу, в том числе созданному в JS.
            field.data('orderInvalidReady', true).on('invalid', function (event) {
                event.preventDefault(); // Убираем браузерную подсказку; нативная блокировка отправки остаётся.
                validateForm(); // Читаем validity и свои правила, без рекурсивного checkValidity().
            });
        });
    }

    // FEATURE 2 — .empty(), .append(), .text(), .prop() заменяют ручные DOM-операции со строками.
    // DOM-записи стали короче; отдельные обработчики заменены делегированием, работающим после повторного создания строк.
    function renderCart() {
        const activeId = summary.find(':focus').attr('id');
        const state = Dielly.cartSummary();
        cartList.empty();
        for (const line of state.items) {
            const item = Dielly.el('li', '', 'border-bottom pb-3 mb-3').attr('data-product-id', line.product.id);
            const title = Dielly.el('h3', line.product.name, 'h6 text-break');
            const price = Dielly.el('p', `Цена за шт.: ${Dielly.formatMoney(line.product.price)}`, 'small mb-2');
            const controls = Dielly.el('div', '', 'd-flex flex-wrap align-items-center gap-2');
            const minus = Dielly.el('button', '−1', 'btn btn-outline-secondary btn-sm')
                .attr({ type: 'button', id: `cart-${line.product.id}-minus`, 'data-cart-action': 'minus', 'aria-label': `Уменьшить количество: ${line.product.name}` });
            const count = Dielly.el('span', `${line.quantity} шт.`, 'fw-semibold');
            const plus = Dielly.el('button', '+1', 'btn btn-outline-secondary btn-sm')
                .attr({ type: 'button', id: `cart-${line.product.id}-plus`, 'data-cart-action': 'plus', 'aria-label': `Увеличить количество: ${line.product.name}` })
                .prop('disabled', line.quantity >= Dielly.maxQuantity);
            const remove = Dielly.el('button', 'Удалить', 'btn btn-outline-danger btn-sm')
                .attr({ type: 'button', id: `cart-${line.product.id}-remove`, 'data-cart-action': 'remove', 'aria-label': `Удалить из корзины: ${line.product.name}` });
            controls.append(minus, count, plus, remove);
            item.append(title, price, controls, Dielly.el('p', `Сумма: ${Dielly.formatMoney(line.subtotal)}`, 'fw-semibold mt-2 mb-0'));
            cartList.append(item);
        }
        quantityTotal.text(state.quantity);
        total.text(Dielly.formatMoney(state.total));
        empty.toggleClass('d-none', state.items.length !== 0);
        clear.prop('disabled', state.items.length === 0);
        // Отправка доступна и для пустой формы: обработчик покажет все ошибки и проверит корзину.
        submit.prop('disabled', false);
        if (activeId) {
            const replacement = summary.find(`#${$.escapeSelector(activeId)}`);
            if (replacement.length && !replacement.prop('disabled')) {
                replacement.trigger('focus');
            } else {
                let next = replacement.closest('li').find('button:not(:disabled)').first();
                if (!next.length) {
                    next = cartList.find('button:not(:disabled)').first();
                }
                (next.length ? next : productSelect).trigger('focus');
            }
        }
    }

    // Стабильный родитель ловит события новых строк; прямой .on() на старых кнопках их бы не охватил.
    summary.on('click', 'button[data-cart-action]', function () {
        const button = $(this);
        const id = button.closest('li').attr('data-product-id');
        const line = Dielly.getCart().find((item) => item.id === id);
        const product = Dielly.getProduct(id);
        if (!line || !product) {
            return;
        }
        const action = button.attr('data-cart-action');
        const quantity = action === 'remove' ? 0 : line.quantity + (action === 'plus' ? 1 : -1);
        if (Dielly.setQuantity(id, quantity)) {
            feedback.text(quantity === 0 ? `${product.name}: товар удалён.`
                : `${product.name}: количество ${action === 'plus' ? 'увеличено' : 'уменьшено'}.`);
        }
    });

    addButton.on('click', function () {
        hideResult();
        const productValid = validateField(productSelect);
        const quantityValid = validateField(addQuantity);
        updateErrorSummary();
        if (!productValid || !quantityValid) {
            (productValid ? addQuantity : productSelect).trigger('focus');
            return;
        }
        const product = Dielly.getProduct(productSelect.val());
        if (Dielly.addToCart(product.id, Number(addQuantity.val()))) {
            feedback.text(`${product.name}: добавлено ${addQuantity.val()} шт. Корзина обновлена.`);
            for (const field of [productSelect, addQuantity]) {
                Dielly.clearFieldState(field);
                touched.delete(field.attr('id'));
            }
            updateErrorSummary();
        }
    });

    resetSelection.on('click', function () {
        hideResult();
        productSelect.val('');
        addQuantity.val('1');
        for (const field of [productSelect, addQuantity]) {
            Dielly.clearFieldState(field);
            touched.delete(field.attr('id'));
        }
        updatePreview();
        updateErrorSummary();
        feedback.text('Выбор для добавления сброшен. Товары в корзине сохранены.');
        productSelect.trigger('focus');
    });

    productSelect.add(addQuantity).on('keydown', function (event) {
        if (event.key === 'Enter') {
            // Отменяем неявную отправку формы: Enter здесь добавляет товар, а не оформляет корзину.
            event.preventDefault();
            if (!event.originalEvent || (!event.originalEvent.repeat && !event.originalEvent.isComposing)) {
                addButton.trigger('click');
            }
        }
    });

    clear.on('click', function () {
        Dielly.clearCart();
        feedback.text('Корзина очищена.');
    });

    form.on('input change', 'input, select, textarea', function () {
        const field = $(this);
        const id = field.attr('id');
        hideResult();
        if (field.is('#order-product, #order-add-quantity')) {
            touched.add(id);
        }
        if (touched.has(id) || (submitted && !field.is('#order-product, #order-add-quantity'))) {
            validateField(field);
        }
        if (id === 'order-phone' && touched.has('order-phone-confirm')) {
            validateField(phoneConfirm);
        }
        if (id === 'order-product' && touched.has('order-add-quantity')) {
            validateField(addQuantity);
        }
        // Исправление радиогруппы снимает ошибку и у другого обязательного элемента группы.
        if (field.is(':radio')) {
            checkoutFields().filter(':radio').each(function () {
                const radio = $(this);
                if (radio.attr('name') === field.attr('name') && touched.has(radio.attr('id'))) {
                    validateField(radio);
                }
            });
        }
        updatePreview();
        updateErrorSummary();
    });

    $(document).on('dielly:cartchange', function () {
        hideResult();
        renderCart();
        if (touched.has('order-add-quantity')) {
            validateField(addQuantity);
            updateErrorSummary();
        }
    });

    form.on('submit', function (event) {
        // Отменяем переход/отправку браузером: здесь только демонстрация без сервера.
        event.preventDefault();
        // Убираем крайние пробелы при отправке, не мешая печатать пробелы между словами при input.
        name.add(email).add(phone).add(phoneConfirm).add(address).each(function () {
            const field = $(this);
            field.val(String(field.val() || '').trim());
        });
        if (!validateForm()) {
            return;
        }
        const state = Dielly.cartSummary();
        if (hasPendingSelection()) {
            errors.text(pendingSelectionMessage).removeClass('d-none');
            addButton.trigger('focus');
            return;
        }
        if (!state.items.length) {
            errors.text('Корзина пуста. Добавьте хотя бы один товар перед подтверждением.').removeClass('d-none');
            productSelect.trigger('focus');
            return;
        }
        // Браузерную проверку можно обойти; реальный сервер обязан заново проверить поля, товары и цены.
        // Результат хранится только в DOM. Контакты и текст открытки не попадают в localStorage.
        const result = Dielly.el('div');
        result.append(Dielly.el('p', 'Данные заказа проверены.', 'fw-semibold'));
        result.append(Dielly.el('p', `Имя: ${name.val().trim()}`));
        result.append(Dielly.el('p', `Email: ${email.val().trim()}`));
        result.append(Dielly.el('p', `Телефон: ${phone.val().trim()}`));
        result.append(Dielly.el('p', `Адрес доставки: ${address.val().trim()}`));
        const selected = Dielly.el('ul', '', 'ps-3');
        for (const line of state.items) {
            selected.append(Dielly.el('li', `${line.product.name} — ${line.quantity} шт., ${Dielly.formatMoney(line.subtotal)}`));
        }
        result.append(selected, Dielly.el('p', `Всего: ${state.quantity} шт. Итого за товары: ${Dielly.formatMoney(state.total)}`, 'fw-semibold'));
        if (comments.val().trim()) {
            result.append(Dielly.el('p', `Текст открытки: ${comments.val().trim()}`, 'text-break'));
        }
        Dielly.clearCart();
        form.trigger('reset');
        feedback.text('Корзина очищена.');
        updatePreview();
        resultSection.removeClass('d-none');
        message.empty().append(result).removeClass('d-none').trigger('focus');
    });

    form.on('reset', function () {
        hideResult();
        checkoutFields().add(productSelect).add(addQuantity).each(function () {
            Dielly.clearFieldState($(this));
        });
        touched.clear();
        submitted = false;
        errors.empty().addClass('d-none');
        // reset сначала вызывает обработчик, затем восстанавливает значения полей.
        setTimeout(updatePreview, 0);
    });

    // Перед нативной отправкой подключаем invalid и к обязательным полям, добавленным позднее.
    form.on('click', ':submit', bindNativeValidation);
    form.on('keydown', 'input, select, textarea', function (event) {
        if (event.key === 'Enter') {
            bindNativeValidation();
        }
    });
    submit.prop('type', 'submit').text('Проверить заказ');
    bindNativeValidation();
    renderCart();
    updatePreview();
});
