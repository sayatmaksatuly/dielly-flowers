'use strict';

(() => {
    const form = document.querySelector('#register-form, #login-form');
    if (!form || form.dataset.authReady === 'true') return;
    form.dataset.authReady = 'true';

    const registration = form.id === 'register-form';
    const prefix = registration ? 'register' : 'login';
    const name = form.elements.namedItem('name');
    const email = form.elements.namedItem('email');
    const password = form.elements.namedItem('password');
    const errors = document.getElementById(`${prefix}-errors`);
    const result = document.getElementById(`${prefix}-result`);
    const message = document.getElementById(`${prefix}-message`);
    const submit = document.getElementById(`${prefix}-submit`);
    const touched = new Set();
    let submitted = false;
    let checkedContact = null;

    const passwordRules = [
        { label: 'Не менее 8 символов', pattern: /^.{8,}$/u },
        { label: 'Заглавная буква', pattern: /\p{Lu}/u },
        { label: 'Строчная буква', pattern: /\p{Ll}/u },
        { label: 'Цифра', pattern: /[0-9]/ },
        { label: 'Специальный символ, например ! или #', pattern: /[^\p{L}\p{N}\s]/u }
    ];

    submit.type = 'submit';
    submit.textContent = 'Проверить данные';
    form.querySelector('legend').textContent = registration
        ? 'Проверка формы регистрации' : 'Проверка формы входа';
    form.querySelector('fieldset > p').textContent =
        'Введите вымышленный пароль. Данные проверяются в браузере. Для заказа вход не требуется.';
    const otherFormLink = form.querySelector('p.text-center a');
    otherFormLink.textContent = registration ? 'К форме входа' : 'К форме регистрации';
    otherFormLink.parentElement.replaceChildren(otherFormLink);
    email.autocomplete = 'email';
    password.autocomplete = 'new-password';
    if (name) name.autocomplete = 'name';

    result.classList.add('d-none');
    result.querySelector('p').remove();
    message.tabIndex = -1;

    function updateToggle(field, button, visible) {
        field.type = visible ? 'text' : 'password';
        button.textContent = visible ? 'Скрыть' : 'Показать';
        button.setAttribute('aria-pressed', String(visible));
        const target = field === password ? 'пароль' : 'повторный пароль';
        button.setAttribute('aria-label', `${button.textContent} ${target}`);
    }

    function addPasswordToggle(field) {
        const group = Dielly.el('div', '', 'input-group');
        const button = Dielly.el('button', '', 'btn btn-outline-primary');
        button.type = 'button';
        button.id = `${field.id}-toggle`;
        button.setAttribute('aria-controls', field.id);
        updateToggle(field, button, false);
        field.before(group);
        group.append(field, button);
        button.addEventListener('click', () => updateToggle(field, button, field.type === 'password'));
        return group;
    }

    const passwordGroup = addPasswordToggle(password);
    const help = Dielly.el('div', '', 'mt-2');
    help.id = `${prefix}-password-help`;
    const checklist = Dielly.el('ul', '', 'small ps-3 mb-2');
    checklist.setAttribute('aria-live', 'polite');
    const ruleItems = passwordRules.map(() => Dielly.el('li'));
    checklist.append(...ruleItems);
    help.append(Dielly.el('p', 'Требования к паролю', 'small fw-semibold mb-1'), checklist);
    passwordGroup.after(help);
    password.setAttribute('aria-describedby', help.id);

    let confirmation = null;
    if (registration) {
        const label = Dielly.el('label', 'Повторите пароль', 'form-label fw-semibold mt-3');
        confirmation = Dielly.el('input', '', 'form-control');
        confirmation.id = 'register-password-confirm';
        confirmation.type = 'password';
        confirmation.autocomplete = 'new-password';
        confirmation.required = true;
        label.htmlFor = confirmation.id;
        help.after(label, confirmation);
        addPasswordToggle(confirmation);
    }

    function updateChecklist() {
        passwordRules.forEach((rule, index) => {
            const passed = rule.pattern.test(password.value);
            const item = ruleItems[index];
            item.textContent = `${rule.label} — ${passed ? 'выполнено' : 'не выполнено'}`;
            item.classList.toggle('text-success', passed);
            item.classList.toggle('text-secondary', !passed);
        });
    }

    function fieldMessage(field) {
        const basicError = Dielly.fieldError(field);
        if (basicError) return basicError;
        if (field === name && (!/\p{L}/u.test(name.value) || name.value.trim().length > 100)) {
            return 'Введите имя длиной до 100 символов, содержащее буквы.';
        }
        if (field === password && !passwordRules.every((rule) => rule.pattern.test(password.value))) {
            return 'Проверьте требования к паролю в списке ниже.';
        }
        if (field === confirmation && field.value !== password.value) {
            return 'Повторный пароль должен точно совпадать с первым.';
        }
        return '';
    }

    function fields() {
        return Array.from(form.elements).filter((field) =>
            field.matches('input, select, textarea') && field.willValidate);
    }

    function updateErrorSummary() {
        const count = submitted ? fields().filter((field) => fieldMessage(field)).length : 0;
        errors.classList.toggle('d-none', count === 0);
        errors.textContent = count ? `Исправьте отмеченные поля (${count}).` : '';
    }

    function hideResult() {
        result.classList.add('d-none');
        checkedContact = null;
    }

    function validateForm() {
        submitted = true;
        hideResult();
        email.value = email.value.trim();
        if (name) name.value = name.value.trim();

        let firstInvalid = null;
        for (const field of fields()) {
            if (!Dielly.setFieldError(field, fieldMessage(field)) && !firstInvalid) {
                firstInvalid = field;
            }
        }
        updateErrorSummary();
        if (firstInvalid) firstInvalid.focus();
        return !firstInvalid;
    }

    function onEdit(event) {
        const field = event.target;
        if (!fields().includes(field)) return;
        hideResult();
        if (field === password) {
            updateChecklist();
            if (confirmation && (submitted || touched.has(confirmation))) {
                Dielly.setFieldError(confirmation, fieldMessage(confirmation));
            }
        }
        if (field.type === 'radio') {
            fields().filter((radio) => radio.type === 'radio' && radio.name === field.name
                && (submitted || touched.has(radio))).forEach((radio) =>
                Dielly.setFieldError(radio, fieldMessage(radio)));
        } else if (submitted || touched.has(field)) {
            Dielly.setFieldError(field, fieldMessage(field));
        }
        updateErrorSummary();
    }

    form.addEventListener('input', onEdit);
    form.addEventListener('change', onEdit);
    form.addEventListener('focusout', (event) => {
        const field = event.target;
        if (!fields().includes(field)) return;
        if (field === name || field === email) field.value = field.value.trim();
        touched.add(field);
        Dielly.setFieldError(field, fieldMessage(field));
        updateErrorSummary();
    });
    // The browser skips submit when a native constraint fails. Show all errors once.
    form.addEventListener('invalid', (event) => {
        event.preventDefault();
        if (event.target === fields().find((field) => !field.validity.valid)) validateForm();
    }, true);

    function clearPasswordState() {
        for (const field of [password, confirmation].filter(Boolean)) {
            field.value = '';
            updateToggle(field, document.getElementById(`${field.id}-toggle`), false);
        }
        fields().forEach((field) => Dielly.clearFieldState(field));
        touched.clear();
        submitted = false;
        updateChecklist();
        updateErrorSummary();
    }

    form.addEventListener('reset', () => {
        hideResult();
        clearPasswordState();
    });

    const transfer = Dielly.el('button', registration
        ? 'Перенести имя и email в заказ' : 'Перенести email в заказ', 'btn btn-outline-primary mt-3');
    transfer.type = 'button';
    result.append(transfer);
    transfer.addEventListener('click', () => {
        if (!checkedContact) return;
        try {
            sessionStorage.setItem('dielly-order-contact', JSON.stringify(checkedContact));
            window.location.assign('order.html');
        } catch {
            const link = Dielly.el('a', 'Перейти к заказу', 'fw-semibold');
            link.href = 'order.html';
            message.replaceChildren('Браузер блокирует перенос. Введите контакты на странице заказа. ', link);
            transfer.classList.add('d-none');
            link.focus();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        checkedContact = { name: name ? name.value : '', email: email.value };
        message.textContent = registration
            ? 'Поля проверены. Учётная запись не создаётся. Вы можете использовать имя и email при оформлении заказа.'
            : 'Поля проверены. Вход в аккаунт не выполняется. Вы можете использовать email при оформлении заказа.';
        transfer.classList.remove('d-none');
        result.classList.remove('d-none');
        message.classList.remove('d-none');
        message.focus();
        clearPasswordState();
    });

    updateChecklist();
})();
