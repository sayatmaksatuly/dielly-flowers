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
