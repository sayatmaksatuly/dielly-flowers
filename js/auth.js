'use strict';

(() => {
    const form = document.getElementById('register-form') || document.getElementById('login-form');
    if (!form || form.dataset.authReady === 'true') {
        return;
    }
    form.dataset.authReady = 'true';

    const registration = form.id === 'register-form';
    const prefix = registration ? 'register' : 'login';
    const name = document.getElementById(`${prefix}-name`);
    const email = document.getElementById(`${prefix}-email`);
    const password = document.getElementById(`${prefix}-password`);
    const errors = document.getElementById(`${prefix}-errors`);
    const message = document.getElementById(`${prefix}-message`);
    const submit = document.getElementById(`${prefix}-submit`);
    const fields = name ? [name, email, password] : [email, password];
    const touched = new Set();
    let submitted = false;

    form.noValidate = true;
    submit.type = 'submit';
    submit.textContent = registration ? 'Проверить регистрацию (демо)' : 'Проверить форму входа (демо)';
    email.autocomplete = 'email';
    password.autocomplete = registration ? 'new-password' : 'current-password';
    if (name) {
        name.autocomplete = 'name';
    }

    // Unicode letter classes also support passwords entered in Russian.
    const passwordRules = [
        { label: 'Не менее 8 символов', test: (value) => value.length >= 8 },
        { label: 'Заглавная буква', test: (value) => /\p{Lu}/u.test(value) },
        { label: 'Строчная буква', test: (value) => /\p{Ll}/u.test(value) },
        { label: 'Цифра', test: (value) => /[0-9]/.test(value) },
        { label: 'Специальный символ, например ! или #', test: (value) => /[^\p{L}\p{N}\s]/u.test(value) }
    ];

    function addVisibilityControl(field) {
        const group = Dielly.el('div', '', 'input-group');
        const button = Dielly.el('button', 'Показать', 'btn btn-outline-primary');
        button.type = 'button';
        button.id = `${field.id}-toggle`;
        button.setAttribute('aria-controls', field.id);
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-label', 'Показать пароль');
        field.before(group);
        group.append(field, button);
        button.addEventListener('click', () => {
            const show = field.type === 'password';
            field.type = show ? 'text' : 'password';
            button.textContent = show ? 'Скрыть' : 'Показать';
            button.setAttribute('aria-pressed', String(show));
            button.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
        });
        return group;
    }

    const passwordGroup = addVisibilityControl(password);
    const help = Dielly.el('div', '', 'mt-2');
    help.id = `${prefix}-password-help`;
    const heading = Dielly.el('p', 'Требования к паролю:', 'small fw-semibold mb-1');
    const checklist = Dielly.el('ul', '', 'small ps-3 mb-2');
    checklist.setAttribute('aria-live', 'polite');
    const ruleItems = passwordRules.map(() => Dielly.el('li'));
    checklist.append(...ruleItems);
    help.append(heading, checklist);
    passwordGroup.after(help);
    password.setAttribute('aria-describedby', help.id);

    let confirmation = null;
    if (registration) {
        const label = Dielly.el('label', 'Повторите пароль:', 'form-label fw-semibold mt-3');
        confirmation = Dielly.el('input', '', 'form-control');
        confirmation.id = 'register-password-confirm';
        confirmation.type = 'password';
        confirmation.required = true;
        confirmation.autocomplete = 'new-password';
        label.htmlFor = confirmation.id;
        help.after(label, confirmation);
        addVisibilityControl(confirmation);
        fields.push(confirmation);
    }

    function updateChecklist() {
        passwordRules.forEach((rule, index) => {
            const passed = rule.test(password.value);
            ruleItems[index].textContent = `${passed ? 'Выполнено' : 'Не выполнено'}: ${rule.label}`;
            ruleItems[index].classList.toggle('text-success', passed);
            ruleItems[index].classList.toggle('text-secondary', !passed);
        });
    }

    function fieldMessage(field) {
        if (field === name) {
            return field.value.trim() === '' ? 'Введите ваше имя, а не только пробелы.' : '';
        }
        if (field === email) {
            if (field.value.trim() === '') {
                return 'Введите адрес электронной почты.';
            }
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())
                && !field.validity.typeMismatch ? '' : 'Введите email в формате name@example.com.';
        }
        if (field === password) {
            if (field.value === '') {
                return 'Введите пароль для проверки формы. Не используйте свой настоящий пароль.';
            }
            return passwordRules.every((rule) => rule.test(field.value))
                ? '' : 'Пароль должен соответствовать всем требованиям в списке ниже.';
        }
        if (field === confirmation) {
            if (field.value === '') {
                return 'Повторите пароль.';
            }
            return field.value === password.value ? '' : 'Пароли должны точно совпадать.';
        }
        return '';
    }

    function hideResult() {
        message.classList.add('d-none');
        message.replaceChildren();
    }

    function updateErrorSummary() {
        const invalidCount = fields.filter((field) => fieldMessage(field) !== '').length;
        errors.classList.toggle('d-none', !submitted || invalidCount === 0);
        errors.textContent = submitted && invalidCount > 0
            ? `Исправьте поля с ошибками (${invalidCount}). Подсказки находятся рядом с полями.` : '';
    }

    function validateField(field) {
        return Dielly.setFieldError(field, fieldMessage(field));
    }

    function hidePassword(field) {
        field.value = '';
        field.type = 'password';
        const toggle = document.getElementById(`${field.id}-toggle`);
        toggle.textContent = 'Показать';
        toggle.setAttribute('aria-pressed', 'false');
        toggle.setAttribute('aria-label', 'Показать пароль');
    }

    form.addEventListener('input', (event) => {
        if (!fields.includes(event.target)) {
            return;
        }
        hideResult();
        if (event.target === password) {
            updateChecklist();
            if (confirmation && (touched.has(confirmation) || submitted)) {
                validateField(confirmation);
            }
        }
        if (touched.has(event.target) || submitted) {
            validateField(event.target);
        }
        updateErrorSummary();
    });

    form.addEventListener('focusout', (event) => {
        if (!fields.includes(event.target)) {
            return;
        }
        if (event.target === email || event.target === name) {
            event.target.value = event.target.value.trim();
        }
        touched.add(event.target);
        validateField(event.target);
        updateErrorSummary();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        hideResult();
        submitted = true;
        email.value = email.value.trim();
        if (name) {
            name.value = name.value.trim();
        }
        let firstInvalid = null;
        for (const field of fields) {
            touched.add(field);
            if (!validateField(field) && firstInvalid === null) {
                firstInvalid = field;
            }
        }
        updateErrorSummary();
        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        const title = Dielly.el('p', 'Проверка полей завершена.', 'fw-semibold mb-2');
        const summary = Dielly.el('p', name
            ? `${name.value}, формат данных для ${email.value} проверен.`
            : `Формат данных для ${email.value} проверен.`, 'text-break mb-2');
        const notice = Dielly.el('p', 'Это фронтенд-демонстрация. Данные не отправлены на сервер. '
            + 'Учётная запись не создана, вход не выполнен. Для заказа регистрация не нужна.', 'mb-0');
        message.replaceChildren(title, summary, notice);
        message.classList.remove('d-none');
        message.setAttribute('aria-atomic', 'true');
        message.tabIndex = -1;
        // Move focus before clearing fields so an Enter submission cannot trigger
        // blur validation of the passwords we are about to erase.
        message.focus();

        // Keep passwords only in their input fields while checking; never persist or echo them.
        hidePassword(password);
        if (confirmation) {
            hidePassword(confirmation);
        }
        fields.forEach((field) => Dielly.clearFieldState(field));
        touched.clear();
        submitted = false;
        updateChecklist();
    });

    updateChecklist();
})();
