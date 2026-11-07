'use strict';

// jQuery 3.7.1 full: ready ждёт DOM, чтобы подключить события к существующему списку.
$(function () {
    const $list = $('#flowers-list, #bags-list').first();
    if (!$list.length || $list.attr('data-catalog-ready') === 'true') {
        return;
    }
    $list.attr('data-catalog-ready', 'true');
    const category = $list.attr('id') === 'flowers-list' ? 'flowers' : 'bags';
    const totalProducts = Dielly.products.filter((product) => product.category === category).length;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function el(tag, text = '', classes = '') {
        return $(`<${tag}>`).text(text).addClass(classes);
    }

    // FEATURE 1: $(), .append(), .val(), .toggleClass() и .on() заменяют native DOM.
    // Обход карточек стал короче; весь блок не короче из-за новых фильтров и эффектов.
    const $controls = el('form', '', 'border rounded-3 bg-white p-3 mb-4')
        .attr({ id: `${category}-controls`, role: 'search', 'aria-label': 'Поиск и фильтры каталога' })
        .prop('noValidate', true);
    const $toggle = el('button', 'Скрыть фильтры', 'btn btn-outline-secondary mb-3')
        .attr({ id: `${category}-toggle-filters`, type: 'button',
            'aria-controls': `${category}-filter-panel`, 'aria-expanded': 'true' });
    const $panel = el('div').attr('id', `${category}-filter-panel`);
    const $fields = el('div', '', 'row g-3');

    const $searchGroup = el('div', '', 'col-12 col-lg-6');
    const $search = el('input', '', 'form-control')
        .attr({ id: `${category}-search`, type: 'search', 'aria-controls': $list.attr('id') });
    $searchGroup.append(
        el('label', 'Поиск по названию и описанию', 'form-label').attr('for', $search.attr('id')),
        $search
    );

    const $budgetGroup = el('div', '', 'col-12 col-sm-6 col-lg-3');
    const $budget = el('input', '', 'form-control')
        .attr({ id: `${category}-max-price`, type: 'number', min: '0', step: '1', inputmode: 'numeric',
            placeholder: 'Без ограничения', 'aria-controls': $list.attr('id'),
            'aria-describedby': `${category}-budget-error` });
    $budgetGroup.append(
        el('label', 'Цена до, ₸', 'form-label').attr('for', $budget.attr('id')),
        $budget,
        el('p', '', 'invalid-feedback mb-0').attr('id', `${category}-budget-error`)
    );

    const $sortGroup = el('div', '', 'col-12 col-sm-6 col-lg-3');
    const $sort = el('select', '', 'form-select')
        .attr({ id: `${category}-sort`, 'aria-controls': $list.attr('id') });
    const sortOptions = [
        { value: 'default', label: 'Как в каталоге' },
        { value: 'price-asc', label: 'Сначала дешевле' },
        { value: 'price-desc', label: 'Сначала дороже' },
        { value: 'name', label: 'По названию' }
    ];
    for (const item of sortOptions) {
        $sort.append(el('option', item.label).val(item.value));
    }
    $sortGroup.append(
        el('label', 'Сортировка', 'form-label').attr('for', $sort.attr('id')),
        $sort
    );
    $fields.append($searchGroup, $budgetGroup, $sortGroup);

    const $onlyCart = el('input', '', 'form-check-input')
        .attr({ id: `${category}-only-cart`, type: 'checkbox', 'aria-controls': $list.attr('id') });
    const $cartFilter = el('div', '', 'form-check mt-3').append(
        $onlyCart,
        el('label', 'Показывать только товары в корзине', 'form-check-label')
            .attr('for', $onlyCart.attr('id'))
    );
    const $count = el('p', '', 'mb-0')
        .attr({ id: `${category}-count`, role: 'status', 'aria-atomic': 'true' });
    const $reset = el('button', 'Сбросить фильтры', 'btn btn-outline-primary')
        .attr({ id: `${category}-reset`, type: 'button' });
    const $footer = el('div', '', 'd-flex flex-wrap align-items-center justify-content-between gap-3 mt-3')
        .append($count, $reset);
    $panel.append($fields, $cartFilter);
    $controls.append($toggle, $panel, $footer);

    const $feedback = el('div', '', 'alert alert-success d-none mb-4')
        .attr({ id: `${category}-feedback`, role: 'status', 'aria-atomic': 'true' });
    const $feedbackText = el('p', '', 'mb-2');
    const $closeFeedback = el('button', 'Закрыть сообщение', 'btn btn-outline-secondary btn-sm')
        .attr({ id: `${category}-close-feedback`, type: 'button' });
    const $feedbackActions = el('div', '', 'd-flex flex-wrap align-items-center gap-3').append(
        el('a', 'Перейти к заказу', 'fw-semibold').attr('href', 'order.html'),
        $closeFeedback
    );
    $feedback.append($feedbackText, $feedbackActions);
    $list.before($controls, $feedback);
    let lastAddedId = '';
    let feedbackAction = 0;

    // The fragment keeps a filtered selection bookmarkable, including when opened as a local file.
    function restoreFilters() {
        const params = new URLSearchParams(window.location.hash.slice(1));
        $search.val(params.get('q') || '');
        $budget.val(params.get('max') || '');
        $sort.val(params.get('sort') || 'default');
        if (!$sort.val()) {
            $sort.val('default');
        }
        $onlyCart.prop('checked', params.get('cart') === '1');
    }

    function saveFilters() {
        const params = new URLSearchParams();
        if ($search.val().trim()) {
            params.set('q', $search.val().trim());
        }
        if ($budget.val()) {
            params.set('max', $budget.val());
        }
        if ($sort.val() !== 'default') {
            params.set('sort', $sort.val());
        }
        if ($onlyCart.prop('checked')) {
            params.set('cart', '1');
        }
        const url = new URL(window.location.href);
        url.hash = params.toString();
        if (url.href !== window.location.href) {
            window.history.replaceState(window.history.state, '', url);
        }
    }

    function createProductCard(product) {
        const $column = el('div', '', 'col-12 col-md-6 col-lg-4');
        const $card = el('article', '', 'card product-card h-100 border-0 shadow-sm')
            .attr('id', `product-${product.id}`);
        const $image = el('img', '', 'card-img-top img-fluid product-photo')
            .attr({ src: product.image, alt: product.alt }).addClass(product.imageClass);
        const $body = el('div', '', 'card-body d-flex flex-column');
        if (product.badge) {
            $body.append(el('span', product.badge, 'badge product-badge align-self-start mb-2'));
        }
        $body.append(
            el('h2', product.name, 'card-title h5'),
            el('p', product.description, 'card-text text-secondary'),
            el('p', Dielly.formatMoney(product.price), 'product-price fw-bold mt-auto mb-3'),
            el('a', '', 'small align-self-start mb-2 d-none')
                .attr({ id: `cart-count-${product.id}`, href: 'order.html#order-summary' }),
            el('button', 'В корзину', 'btn btn-primary')
                .attr({ type: 'button', id: `order-${product.id}`, 'data-product-id': product.id,
                    'aria-label': `Добавить в корзину: ${product.name}` })
        );
        return $column.append($card.append($image, $body));
    }

    function updateSelectedProducts() {
        const cart = Dielly.getCart();
        $list.find('button[data-product-id]').each(function () {
            const $button = $(this);
            const product = Dielly.getProduct($button.attr('data-product-id'));
            const line = cart.find((item) => item.id === product.id);
            const quantity = line ? line.quantity : 0;
            // siblings находит подпись рядом с кнопкой; text задаёт текст; toggleClass скрывает нулевой счётчик.
            $button.siblings('a[id^="cart-count-"]')
                .text(quantity > 0 ? `В корзине: ${quantity} шт.` : '')
                .attr('aria-label', `${product.name}, в корзине ${quantity} шт. Перейти к корзине`)
                .toggleClass('d-none', quantity === 0);
            $button.closest('article')
                .toggleClass('border-0', quantity === 0)
                .toggleClass('border-primary', quantity > 0);
            $button.text(quantity > 0 ? 'Добавить ещё' : 'В корзину')
                .attr('aria-label', `${$button.text()}: ${product.name}`);
        });
    }

    function renderProducts() {
        const activeId = $list.find(':focus').attr('id');
        const value = $budget.val().trim();
        const maxPrice = value === '' ? null : Number(value);
        const invalidBudget = $budget.prop('validity').badInput || (maxPrice !== null
            && (!Number.isSafeInteger(maxPrice) || maxPrice < 0));
        $budget.toggleClass('is-invalid', invalidBudget).attr('aria-invalid', String(invalidBudget));
        $budget.parent().find('.invalid-feedback')
            .text(invalidBudget ? 'Введите целую сумму от 0 или оставьте поле пустым.' : '');
        $list.empty();
        if (invalidBudget) {
            $count.text('Исправьте максимальную цену.');
            $list.append(el('div', '', 'col-12').append(
                el('p', 'Для поиска исправьте цену или сбросьте фильтры.', 'alert alert-info mb-0')
            ));
        } else {
            let products = Dielly.selectProducts(category, $search.val(), maxPrice, $sort.val());
            // prop('checked') — текущее состояние; attr('checked') задаёт только начальное состояние в разметке.
            if ($onlyCart.prop('checked')) {
                const cartIds = new Set(Dielly.getCart().map((item) => item.id));
                products = products.filter((product) => cartIds.has(product.id));
            }
            $count.text(`Найдено: ${products.length} из ${totalProducts}`);
            if (products.length === 0) {
                const $emptyMessage = el('p', '', 'alert alert-info mb-0')
                    .html('<strong>Ничего не найдено.</strong> Измените запрос, увеличьте бюджет или сбросьте фильтры.');
                if ($onlyCart.prop('checked')) {
                    $emptyMessage.text('Среди товаров в корзине совпадений нет. Снимите отметку «Показывать только товары в корзине» или сбросьте фильтры.');
                }
                $list.append(el('div', '', 'col-12').append($emptyMessage));
            } else {
                for (const product of products) {
                    $list.append(createProductCard(product));
                }
                updateSelectedProducts();
            }
        }
        if (activeId) {
            const $replacement = $list.find(`#${activeId}`).not('.d-none');
            ($replacement.length ? $replacement : $toggle).trigger('focus');
        }
    }

    function hideFeedback(restoreFocus = false) {
        const action = ++feedbackAction;
        $feedback.stop(true, true);
        if ($feedback.hasClass('d-none')) {
            return;
        }
        $feedback.fadeOut(reducedMotion.matches ? 0 : 160, function () {
            if (action !== feedbackAction) {
                return;
            }
            $(this).addClass('d-none').removeAttr('style');
            $feedbackText.empty(); // Очистка выполняется после исчезновения сообщения.
            if (restoreFocus) {
                const $button = $list.find(`button[data-product-id="${lastAddedId}"]`);
                ($button.length ? $button : $toggle).trigger('focus');
            }
        });
    }

    function showFeedback(text, added) {
        ++feedbackAction; // Отменяем устаревший callback закрытия при быстром новом добавлении.
        $feedback.stop(true, true).hide().removeClass('d-none')
            .toggleClass('alert-success', added).toggleClass('alert-warning', !added);
        $feedbackText.text(text);
        $feedback.fadeIn(reducedMotion.matches ? 0 : 160, function () { $(this).removeAttr('style'); });
    }

    function applyFilters() {
        saveFilters();
        hideFeedback();
        renderProducts();
    }

    $toggle.on('click', function () {
        $panel.stop(true, true); // Завершаем прошлый переход перед вычислением следующего состояния.
        const opening = $panel.hasClass('d-none');
        if (opening) {
            $panel.removeClass('d-none').hide();
        }
        $(this).attr('aria-expanded', String(opening)).text(opening ? 'Скрыть фильтры' : 'Показать фильтры');
        $panel.slideToggle(reducedMotion.matches ? 0 : 180, function () {
            $(this).toggleClass('d-none', !opening).removeAttr('style');
            if (opening) {
                $search.trigger('focus'); // После раскрытия клавиатурный ввод сразу доступен в поиске.
            } else if ($(this).find(':focus').length) {
                $toggle.trigger('focus'); // Быстрые нажатия не оставляют фокус в закрытой панели.
            }
        });
    });
    $controls.on('submit', function (event) {
        event.preventDefault(); // Отменяем отправку формы поиска и перезагрузку страницы.
        applyFilters();
        if ($budget.hasClass('is-invalid')) {
            $budget.trigger('focus');
        }
    });
    $search.add($budget).on('input', applyFilters);
    $sort.add($onlyCart).on('change', applyFilters);
    $reset.on('click', function () {
        $search.add($budget).val('');
        $sort.val('default');
        $onlyCart.prop('checked', false);
        applyFilters();
        ($panel.hasClass('d-none') ? $toggle : $search).trigger('focus');
    });
    $closeFeedback.on('click', function () {
        hideFeedback(true);
    });
    // Делегирование от существующего списка охватывает и новые кнопки после рендера; прямой .on() — только старые.
    $list.on('click', 'button[data-product-id]', function () {
        const product = Dielly.getProduct($(this).attr('data-product-id'));
        if (!product) {
            return;
        }
        lastAddedId = product.id;
        const added = Dielly.addToCart(product.id);
        const line = Dielly.getCart().find((item) => item.id === product.id);
        showFeedback(added
            ? `В корзине «${product.name}» — ${line.quantity} шт.`
            : `В демонстрации можно добавить не больше ${Dielly.maxQuantity} шт. одного товара. Измените количество в заказе.`, added);
    });
    $(document).on('dielly:cartchange', function () {
        hideFeedback();
        if ($onlyCart.prop('checked')) {
            renderProducts();
        } else {
            updateSelectedProducts();
        }
    });
    $(window).on('hashchange', function () {
        restoreFilters();
        hideFeedback();
        renderProducts();
    });
    restoreFilters();
    renderProducts();
});
