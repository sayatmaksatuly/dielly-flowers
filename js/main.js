'use strict';

// jQuery 3.7.1 full: ready waits for the page DOM before creating shared controls.
$(function () {
    if (Dielly.sharedReady) {
        return;
    }
    Dielly.sharedReady = true;
    const storageKey = 'dielly-cart-v1';
    let storageAvailable = true;
    let cart = [];

    function el(tag, text = '', classes = '') {
        return $(`<${tag}>`).text(text).addClass(classes);
    }

    function setFieldError(field, message) {
        const errorId = `${field.attr('id')}-error`;
        let feedback = $(`#${errorId}`);
        if (!feedback.length) {
            feedback = el('p', '', 'invalid-feedback mb-0');
            feedback.attr('id', errorId);
            // Password feedback belongs outside the input group, next to the whole control.
            const group = field.parent('.input-group');
            (group.length ? group : field).after(feedback);
            const descriptions = new Set((field.attr('aria-describedby') || '').split(' ').filter(Boolean));
            descriptions.add(errorId);
            field.attr('aria-describedby', Array.from(descriptions).join(' '));
        }
        const valid = message === '';
        feedback.text(message).toggleClass('d-block', !valid);
        field.toggleClass('is-invalid', !valid).toggleClass('is-valid', valid)
            .attr('aria-invalid', String(!valid));
        return valid;
    }

    function clearFieldState(field) {
        $(`#${field.attr('id')}-error`).text('').removeClass('d-block');
        field.removeClass('is-invalid is-valid').removeAttr('aria-invalid');
    }

    function readCart() {
        try {
            const saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
            return saved && saved.version === 1 ? Dielly.normalizeCart(saved.items) : [];
        } catch (error) {
            // Malformed JSON and unavailable storage must never break a page.
            if (error.name !== 'SyntaxError') {
                storageAvailable = false;
            }
            return [];
        }
    }

    function getCart() {
        return cart.map((item) => ({ id: item.id, quantity: item.quantity }));
    }

    function cartSummary() {
        return Dielly.getCartSummary(cart);
    }

    function saveCart() {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify({ version: 1, items: cart }));
            storageAvailable = true;
        } catch (error) {
            storageAvailable = false;
        }
        updateSharedCart();
        $(document).trigger('dielly:cartchange');
    }

    function setQuantity(id, quantity) {
        if (!Dielly.getProduct(id) || !Number.isInteger(quantity) || quantity < 0 || quantity > Dielly.maxQuantity) {
            return false;
        }
        cart = Dielly.setCartQuantity(cart, id, quantity);
        saveCart();
        return true;
    }

    function addToCart(id, quantity = 1) {
        if (!Number.isInteger(quantity) || quantity < 1) {
            return false;
        }
        const existing = cart.find((item) => item.id === id);
        return setQuantity(id, (existing ? existing.quantity : 0) + quantity);
    }

    function removeFromCart(id) {
        return setQuantity(id, 0);
    }

    function clearCart() {
        cart = [];
        saveCart();
    }

    function updateSharedCart() {
        const summary = cartSummary();
        $('#shared-cart-link').text(`Корзина (${summary.quantity})`)
            .attr('aria-label', `Корзина: ${summary.quantity} шт., ${Dielly.formatMoney(summary.total)}`);
        $('#cart-storage-warning').toggleClass('d-none', storageAvailable);
    }

    Object.assign(Dielly, { el, setFieldError, clearFieldState, getCart, cartSummary,
        setQuantity, addToCart, removeFromCart, clearCart });
    cart = readCart();

    const navigation = $('#site-nav .navbar-nav');
    if (navigation.length && !$('#shared-cart-link').length) {
        const item = el('li', '', 'nav-item');
        const link = el('a', '', 'nav-link fw-semibold');
        link.attr({ id: 'shared-cart-link', href: 'order.html' });
        item.append(link);
        navigation.append(item);
    }
    const main = $('main');
    if (main.length && !$('#cart-storage-warning').length) {
        const warning = el('p', 'Сохранение корзины недоступно в браузере. При переходе на другую страницу выбор может потеряться. Добавьте товары прямо на странице заказа.', 'alert alert-warning m-3 d-none');
        warning.attr({ id: 'cart-storage-warning', role: 'status' });
        main.prepend(warning);
    }
    updateSharedCart();

    $(window).on('storage', function (event) {
        const key = event.originalEvent.key;
        if (key === storageKey || key === null) {
            cart = readCart();
            updateSharedCart();
            $(document).trigger('dielly:cartchange');
        }
    });
    // Back/forward navigation can restore a page without rerunning its scripts.
    $(window).on('pageshow', function (event) {
        if (event.originalEvent.persisted && storageAvailable) {
            cart = readCart();
            updateSharedCart();
            $(document).trigger('dielly:cartchange');
        }
    });
});
