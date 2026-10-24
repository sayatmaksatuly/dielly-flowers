'use strict';

// Shared DOM helpers and the same non-sensitive cart on every page.
(() => {
    if (Dielly.sharedReady) {
        return;
    }
    Dielly.sharedReady = true;
    const storageKey = 'dielly-cart-v1';
    let storageAvailable = true;
    let cart = [];

    function el(tag, text = '', classes = '') {
        const element = document.createElement(tag);
        element.textContent = text;
        if (classes) {
            element.classList.add(...classes.split(' ').filter(Boolean));
        }
        return element;
    }

    function setFieldError(field, message) {
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
        document.dispatchEvent(new CustomEvent('dielly:cartchange'));
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

    Object.assign(Dielly, { el, setFieldError, clearFieldState, getCart, cartSummary,
        setQuantity, addToCart, removeFromCart, clearCart });
    cart = readCart();

    const navigation = document.querySelector('#site-nav .navbar-nav');
    if (navigation && !document.getElementById('shared-cart-link')) {
        const item = el('li', '', 'nav-item');
        const link = el('a', '', 'nav-link fw-semibold');
        link.id = 'shared-cart-link';
        link.href = 'order.html';
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
        if (event.key === storageKey || event.key === null) {
            cart = readCart();
            updateSharedCart();
            document.dispatchEvent(new CustomEvent('dielly:cartchange'));
        }
    });
    // Back/forward navigation can restore a page without rerunning its scripts.
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && storageAvailable) {
            cart = readCart();
            updateSharedCart();
            document.dispatchEvent(new CustomEvent('dielly:cartchange'));
        }
    });
})();
