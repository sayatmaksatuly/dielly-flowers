'use strict';

(() => {
    if (Dielly.sharedReady) {
        return;
    }
    Dielly.sharedReady = true;
    const storageKey = 'dielly-cart-v1';
    let storageAvailable = true;
    let cart = [];
    let nextFieldId = 0;

    function el(tag, text = '', classes = '') {
        const element = document.createElement(tag);
        element.textContent = text;
        if (classes) {
            element.classList.add(...classes.split(' ').filter(Boolean));
        }
        return element;
    }

    function fieldError(field) {
        const value = field.value.trim();
        const validity = field.validity;
        if (validity.badInput) {
            return 'Введите число.';
        }
        if (validity.valueMissing || (field.required && !value)) {
            if (field.matches('select, [type="radio"], [type="checkbox"]')) {
                return 'Выберите значение.';
            }
            return 'Заполните это поле.';
        }
        if (field.type === 'email' && value &&
            (validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
            return 'Введите email в формате name@example.com.';
        }
        if (field.maxLength >= 0 && field.value.length > field.maxLength) {
            return `Используйте не более ${field.maxLength} символов.`;
        }
        if (value && field.minLength > 0 && field.value.length < field.minLength) {
            return `Введите не менее ${field.minLength} символов.`;
        }
        return validity.valid ? '' : field.validationMessage;
    }

    function setFieldError(field, message) {
        if (!field.id) {
            do {
                nextFieldId += 1;
            } while (document.getElementById(`dielly-field-${nextFieldId}`));
            field.id = `dielly-field-${nextFieldId}`;
        }
        const errorId = `${field.id}-error`;
        let feedback = document.getElementById(errorId);
        if (!feedback) {
            feedback = el('p', '', 'invalid-feedback mb-0');
            feedback.id = errorId;
            const anchor = field.closest('.input-group') || field;
            anchor.insertAdjacentElement('afterend', feedback);
            const descriptions = new Set((field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
            descriptions.add(errorId);
            field.setAttribute('aria-describedby', Array.from(descriptions).join(' '));
        }
        const valid = message === '';
        feedback.textContent = message;
        feedback.classList.toggle('d-block', !valid);
        field.classList.toggle('is-invalid', !valid);
        field.classList.toggle('is-valid', valid);
        field.setAttribute('aria-invalid', String(!valid));
        return valid;
    }

    function clearFieldState(field) {
        const feedback = document.getElementById(`${field.id}-error`);
        if (feedback) {
            feedback.textContent = '';
            feedback.classList.remove('d-block');
        }
        field.classList.remove('is-invalid', 'is-valid');
        field.removeAttribute('aria-invalid');
    }

    function refreshCart() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
            cart = saved && saved.version === 1 ? Dielly.normalizeCart(saved.items) : [];
        } catch (error) {
            if (error instanceof SyntaxError) {
                cart = [];
            } else {
                storageAvailable = false;
            }
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
        announceCart();
    }

    function setQuantity(id, quantity) {
        if (!Dielly.getProduct(id) || !Number.isInteger(quantity) || quantity < 0 || quantity > Dielly.maxQuantity) {
            return false;
        }
        if (storageAvailable) refreshCart();
        cart = Dielly.setCartQuantity(cart, id, quantity);
        saveCart();
        return true;
    }

    function addToCart(id, quantity = 1) {
        if (!Dielly.getProduct(id) || !Number.isInteger(quantity) || quantity < 1) {
            return false;
        }
        if (storageAvailable) refreshCart();
        const existing = cart.find((item) => item.id === id);
        const next = (existing ? existing.quantity : 0) + quantity;
        if (next > Dielly.maxQuantity) return false;
        cart = Dielly.setCartQuantity(cart, id, next);
        saveCart();
        return true;
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
        const link = document.getElementById('shared-cart-link');
        if (link) {
            link.textContent = `Корзина (${summary.quantity})`;
            link.setAttribute('aria-label', `Корзина: ${summary.quantity} шт., ${Dielly.formatMoney(summary.total)}`);
        }
        const warning = document.getElementById('cart-storage-warning');
        if (warning) {
            warning.classList.toggle('d-none', storageAvailable);
        }
    }

    function announceCart() {
        updateSharedCart();
        document.dispatchEvent(new Event('dielly:cartchange'));
    }

    Object.assign(Dielly, { el, fieldError, setFieldError, clearFieldState, getCart, cartSummary,
        setQuantity, addToCart, removeFromCart, clearCart });
    refreshCart();

    const navigation = document.querySelector('#site-nav .navbar-nav');
    if (navigation && !document.getElementById('shared-cart-link')) {
        const item = el('li', '', 'nav-item');
        const link = el('a', '', 'nav-link fw-semibold');
        link.id = 'shared-cart-link';
        link.href = 'order.html#order-summary';
        item.append(link);
        navigation.append(item);
    }
    const main = document.querySelector('main');
    if (main && !document.getElementById('cart-storage-warning')) {
        const warning = el('p', 'Сохранение корзины недоступно в браузере. При переходе на другую страницу выбор может потеряться. Добавьте товары прямо на странице заказа.', 'alert alert-warning m-3 d-none');
        warning.id = 'cart-storage-warning';
        warning.setAttribute('role', 'status');
        main.prepend(warning);
    }
    updateSharedCart();

    window.addEventListener('storage', (event) => {
        if (storageAvailable && (event.key === storageKey || event.key === null)) {
            refreshCart();
            announceCart();
        }
    });
    // Back/forward navigation can restore a page without rerunning its scripts.
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && storageAvailable) {
            refreshCart();
            announceCart();
        }
    });
})();
