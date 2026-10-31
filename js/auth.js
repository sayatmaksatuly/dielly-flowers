'use strict';

// jQuery 3.7.1 full: ready starts after the form and shared helpers are available.
$(function () {
    const form = $('#register-form, #login-form').first();
    if (!form.length || form.data('authReady')) {
        return;
    }
    form.data('authReady', true);

    const registration = form.attr('id') === 'register-form';
    const prefix = registration ? 'register' : 'login';
    const name = $(`#${prefix}-name`);
    const email = $(`#${prefix}-email`);
    const password = $(`#${prefix}-password`);
    const errors = $(`#${prefix}-errors`);
    const result = $(`#${prefix}-result`);
    const message = $(`#${prefix}-message`);
    const submit = $(`#${prefix}-submit`);
    const touched = new Set();
    let submitted = false;
    let extraFieldNumber = 0;

    // Native constraints run first; invalid below also shows all inline jQuery errors.
    form.prop('noValidate', false);
    submit.prop('type', 'submit').text('Проверить данные');
    email.attr('autocomplete', 'email');
    password.attr('autocomplete', registration ? 'new-password' : 'current-password');
    name.attr('autocomplete', 'name');

    // Remove only these obsolete notes; labels, links, hints and errors stay in place.
    const obsoleteNotes = [
        'Данные не отправляются. Проверка учётной записи не выполняется.',
        'Данные не отправляются. Учётная запись не сохраняется.',
        'Вход не выполнен.', 'Учётная запись не создана.',
        'Для подготовки заказа вход не требуется.',
        'Выберите цветы или сумку и подготовьте заказ без регистрации.'
    ];
    form.find('fieldset > p').add(result.children('p')).add($('.auth-promo > p.lead'))
        .filter(function () { return obsoleteNotes.includes($(this).text().trim()); }).remove();
    $(`#${prefix}-result-title`).addClass('visually-hidden');
    hideResult();

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
        const button = Dielly.el('button', 'Показать', 'btn btn-outline-primary')
            .attr({ type: 'button', id: `${field.attr('id')}-toggle`, 'aria-controls': field.attr('id'),
                'aria-pressed': 'false', 'aria-label': 'Показать пароль' });
        field.before(group);
        group.append(field, button);
        button.on('click', function () {
            const show = field.prop('type') === 'password';
            field.prop('type', show ? 'text' : 'password');
            $(this).text(show ? 'Скрыть' : 'Показать').attr({
                'aria-pressed': String(show), 'aria-label': show ? 'Скрыть пароль' : 'Показать пароль'
            });
        });
        return group;
    }

    const passwordGroup = addVisibilityControl(password);
    const help = Dielly.el('div', '', 'mt-2').attr('id', `${prefix}-password-help`);
    const heading = Dielly.el('p', 'Требования к паролю:', 'small fw-semibold mb-1');
    const checklist = Dielly.el('ul', '', 'small ps-3 mb-2').attr('aria-live', 'polite');
    const ruleItems = passwordRules.map(() => Dielly.el('li'));
    ruleItems.forEach((item) => checklist.append(item));
    help.append(heading, checklist);
    passwordGroup.after(help);
    password.attr('aria-describedby', help.attr('id'));

    let confirmation = null;
    if (registration) {
        const label = Dielly.el('label', 'Повторите пароль:', 'form-label fw-semibold mt-3')
            .attr('for', 'register-password-confirm');
        confirmation = Dielly.el('input', '', 'form-control')
            .attr({ id: 'register-password-confirm', type: 'password', autocomplete: 'new-password' })
            .prop('required', true);
        help.after(label, confirmation);
        addVisibilityControl(confirmation);
    }

    function updateChecklist() {
        passwordRules.forEach((rule, index) => {
            const passed = rule.test(password.val());
            ruleItems[index].text(`${passed ? 'Выполнено' : 'Не выполнено'}: ${rule.label}`)
                .toggleClass('text-success', passed).toggleClass('text-secondary', !passed);
        });
    }

    function fieldMessage(field) {
        const value = String(field.val() || '');
        const validity = field.prop('validity');
        const nativeError = validity && !validity.valid
            ? 'Проверьте значение этого поля и его обязательные ограничения.' : '';
        if (field.is(name)) {
            return value.trim() === '' ? 'Введите ваше имя, а не только пробелы.' : nativeError;
        }
        if (field.is(email)) {
            if (value.trim() === '') {
                return 'Введите адрес электронной почты.';
            }
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                && !validity.typeMismatch ? nativeError : 'Введите email в формате name@example.com.';
        }
        if (field.is(password)) {
            if (value === '') {
                return 'Введите пароль для проверки формы. Не используйте свой настоящий пароль.';
            }
            return passwordRules.every((rule) => rule.test(value))
                ? nativeError : 'Пароль должен соответствовать всем требованиям в списке ниже.';
        }
        if (confirmation && field.is(confirmation)) {
            if (value === '') {
                return 'Повторите пароль.';
            }
            return value === password.val() ? nativeError : 'Пароли должны точно совпадать.';
        }
        if (field.prop('required') && !field.is(':checkbox, :radio') && value.trim() === '') {
            return 'Заполните это поле: пробелы не считаются значением.';
        }
        return nativeError;
    }

    function validationFields() {
        return form.find('input, select, textarea').not(':disabled, :button, :submit, :reset, [type="hidden"]');
    }

    function hideResult() {
        result.addClass('d-none');
        message.addClass('d-none').empty();
    }

    function updateErrorSummary() {
        const invalidCount = validationFields().filter(function () { return fieldMessage($(this)) !== ''; }).length;
        errors.toggleClass('d-none', !submitted || invalidCount === 0)
            .text(submitted && invalidCount > 0
                ? `Исправьте поля с ошибками (${invalidCount}). Подсказки находятся рядом с полями.` : '');
    }

    function validateField(field) {
        if (!field.attr('id')) {
            extraFieldNumber += 1;
            field.attr('id', `${prefix}-extra-field-${extraFieldNumber}`);
        }
        touched.add(field.attr('id'));
        return Dielly.setFieldError(field, fieldMessage(field));
    }

    function validateForm() {
        hideResult();
        submitted = true;
        let firstInvalid = null;
        validationFields().each(function () {
            const field = $(this);
            if (!validateField(field) && firstInvalid === null) {
                firstInvalid = field;
            }
        });
        updateErrorSummary();
        if (firstInvalid) {
            firstInvalid.trigger('focus');
        }
        return firstInvalid === null;
    }

    function bindNativeValidation() {
        validationFields().each(function () {
            const field = $(this);
            if (field.data('authInvalidBound')) {
                return;
            }
            field.data('authInvalidBound', true).on('invalid', function (event) {
                // invalid does not bubble: bind directly, cancel only the browser tooltip.
                // Native validation still blocks submission; no recursive checkValidity call.
                event.preventDefault();
                validateForm();
            });
        });
    }

    function hidePassword(field) {
        field.val('').prop('type', 'password');
        $(`#${field.attr('id')}-toggle`).text('Показать')
            .attr({ 'aria-pressed': 'false', 'aria-label': 'Показать пароль' });
    }

    form.on('input change', 'input, select, textarea', function () {
        const field = $(this);
        if (!field.is(validationFields())) {
            return;
        }
        bindNativeValidation();
        hideResult();
        if (field.is(password)) {
            updateChecklist();
            if (confirmation && (touched.has(confirmation.attr('id')) || submitted)) {
                validateField(confirmation);
            }
        }
        if (touched.has(field.attr('id')) || submitted) {
            validateField(field);
        }
        if (field.is(':radio')) {
            validationFields().filter(':radio').each(function () {
                const radio = $(this);
                if (radio.attr('name') === field.attr('name') && touched.has(radio.attr('id'))) {
                    validateField(radio);
                }
            });
        }
        updateErrorSummary();
    });

    form.on('focusout', 'input, select, textarea', function () {
        const field = $(this);
        if (!field.is(validationFields())) {
            return;
        }
        if (field.is(email) || field.is(name)) {
            field.val(field.val().trim());
        }
        touched.add(field.attr('id'));
        validateField(field);
        updateErrorSummary();
    });

    // Refresh direct invalid handlers before default button/Enter submission for added fields.
    form.on('click', ':submit', bindNativeValidation);
    form.on('keydown', 'input, select, textarea', function (event) {
        if (event.key === 'Enter') {
            bindNativeValidation();
        }
    });

    form.on('reset', function () {
        hideResult();
        validationFields().each(function () { Dielly.clearFieldState($(this)); });
        errors.empty().addClass('d-none');
        touched.clear();
        submitted = false;
        hidePassword(password);
        if (confirmation) {
            hidePassword(confirmation);
        }
        // The browser restores field values after the reset event has completed.
        setTimeout(updateChecklist, 0);
    });

    form.on('submit', function (event) {
        // Cancel normal navigation/submission; browser checks cannot replace server validation.
        event.preventDefault();
        email.val(email.val().trim());
        if (name.length) {
            name.val(name.val().trim());
        }
        if (!validateForm()) {
            return;
        }

        message.text(registration ? 'Форма заполнена корректно.' : 'Данные формы проверены.').removeClass('d-none')
            .attr({ 'aria-atomic': 'true', tabindex: '-1' });
        result.removeClass('d-none');
        // Move focus before erasing passwords, so Enter cannot cause late blur errors.
        message.trigger('focus');

        // Passwords stay only in input fields while checking; never persist or echo them.
        hidePassword(password);
        if (confirmation) {
            hidePassword(confirmation);
        }
        validationFields().each(function () { Dielly.clearFieldState($(this)); });
        touched.clear();
        submitted = false;
        updateChecklist();
    });

    bindNativeValidation();
    updateChecklist();
});
