'use strict';

// Assignment 4: catalogue facts and reusable logic, independent of the DOM.
const Dielly = (() => {
    const products = [
        { id: '101-rose', category: 'flowers', name: '101 роза', price: 50000, description: 'Классика для особых случаев.', image: 'images/2/101-rose.jpeg', alt: 'Букет из 101 розы', badge: 'Хит продаж', imageClass: '' },
        { id: 'gortenzia-royal', category: 'flowers', name: 'Королевская гортензия', price: 100000, description: 'Изысканное сезонное предложение.', image: 'images/2/korolevskaya-gortenzia.jpeg', alt: 'Букет королевской гортензии', badge: '', imageClass: '' },
        { id: 'mix-gortenzia', category: 'flowers', name: 'Микс с гортензией', price: 60000, description: 'Нежный тренд сезона.', image: 'images/2/trend-sezona.jpeg', alt: 'Букет-микс с гортензией', badge: '', imageClass: '' },
        { id: 'gortenzia', category: 'flowers', name: 'Гортензия', price: 60000, description: 'Любовь, выраженная в цветах.', image: 'images/2/gortenzia.jpeg', alt: 'Букет гортензии', badge: '', imageClass: '' },
        { id: 'love-basket', category: 'flowers', name: 'Корзинка любви', price: 45000, description: 'Композиция о нежности и любви.', image: 'images/2/korzinka-lubvi.jpeg', alt: 'Корзинка с цветами', badge: '', imageClass: '' },
        { id: 'eustoma', category: 'flowers', name: 'Воздушная эустома', price: 65000, description: 'Легкая, белоснежная и деликатная.', image: 'images/2/vozdushnaya-eustoma.jpeg', alt: 'Букет белой эустомы', badge: '', imageClass: '' },
        { id: 'gucci', category: 'bags', name: 'Сумка Gucci', price: 35000, description: 'Ваш идеальный образ начинается с Gucci.', image: 'images/2/gucci.jpeg', alt: 'Сумка Gucci', badge: 'Новинка', imageClass: 'product-photo-top' },
        { id: 'hermes', category: 'bags', name: 'Сумка Hermès', price: 85000, description: 'Натуральная кожа и премиальное качество.', image: 'images/2/hermes.jpeg', alt: 'Сумка Hermès из натуральной кожи', badge: '', imageClass: '' },
        { id: 'shopper', category: 'bags', name: 'Фирменный шопер', price: 45000, description: 'Идеален на каждый день — вместит всё необходимое.', image: 'images/2/shopper.jpeg', alt: 'Фирменный шопер', badge: 'Хит продаж', imageClass: '' },
        { id: 'fendi', category: 'bags', name: 'Сумка Fendi', price: 55000, description: 'Стильный и удобный выбор для повседневных образов.', image: 'images/2/fendi.jpeg', alt: 'Сумка Fendi', badge: '', imageClass: 'product-photo-bottom' }
    ];
    const maxQuantity = 99;

    function getProduct(id) {
        return products.find((product) => product.id === id);
    }

    function formatMoney(amount) {
        return new Intl.NumberFormat('ru-KZ', {
            style: 'currency', currency: 'KZT', maximumFractionDigits: 0
        }).format(amount);
    }

    function selectProducts(category, query, maxPrice, sort) {
        const search = query.trim().toLocaleLowerCase('ru');
        const matches = products.filter((product) => {
            const text = `${product.name} ${product.description}`.toLocaleLowerCase('ru');
            return product.category === category && text.includes(search)
                && (maxPrice === null || product.price <= maxPrice);
        });
        if (sort === 'price-asc') {
            matches.sort((first, second) => first.price - second.price);
        } else if (sort === 'price-desc') {
            matches.sort((first, second) => second.price - first.price);
        } else if (sort === 'name') {
            matches.sort((first, second) => first.name.localeCompare(second.name, 'ru'));
        }
        return matches;
    }

    // Stored prices and arbitrary extra properties are never trusted.
    function normalizeCart(items) {
        if (!Array.isArray(items)) {
            return [];
        }
        const result = [];
        for (const item of items) {
            if (!item || typeof item !== 'object' || !getProduct(item.id)
                || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > maxQuantity) {
                continue;
            }
            const existing = result.find((line) => line.id === item.id);
            if (existing) {
                existing.quantity = Math.min(maxQuantity, existing.quantity + item.quantity);
            } else {
                result.push({ id: item.id, quantity: item.quantity });
            }
        }
        return result;
    }

    function setCartQuantity(items, id, quantity) {
        const result = normalizeCart(items);
        if (!getProduct(id) || !Number.isInteger(quantity) || quantity < 0 || quantity > maxQuantity) {
            return result;
        }
        if (quantity === 0) {
            return result.filter((line) => line.id !== id);
        }
        const existing = result.find((line) => line.id === id);
        if (existing) {
            existing.quantity = quantity;
        } else {
            result.push({ id, quantity });
        }
        return result;
    }

    function getCartSummary(items) {
        const lines = normalizeCart(items).map((line) => {
            const product = getProduct(line.id);
            return { product, quantity: line.quantity, subtotal: product.price * line.quantity };
        });
        let quantity = 0;
        let total = 0;
        for (const line of lines) {
            quantity += line.quantity;
            total += line.subtotal;
        }
        return { items: lines, quantity, total };
    }

    function createDemoReference() {
        // A temporary label for a demo, not a guaranteed unique transaction ID.
        return `DEMO-${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
    }

    return { products, maxQuantity, getProduct, formatMoney, selectProducts,
        normalizeCart, setCartQuantity, getCartSummary, createDemoReference };
})();
