/* Проверка форм кодом. Правила не зависят от разметки, ошибки показываются под полем. */
(function () {
  const T = window.TEMP;

  const rules = {
    required: function (v) { return v.trim() === '' ? 'Поле обязательно для заполнения' : ''; },
    minLength: function (n) {
      return function (v) { return v.trim().length < n ? 'Минимум ' + n + ' символа(ов)' : ''; };
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Введите корректный email, например name@example.com';
    },
    phone: function (v) {
      const digits = v.replace(/\D/g, '');
      const ok = /^[\d\s()+\-]+$/.test(v) && digits.length === 11 && (digits[0] === '7' || digits[0] === '8');
      return ok ? '' : 'Введите телефон в формате +7 (999) 123-45-67';
    },
    positiveNumber: function (v) {
      const n = Number(v);
      if (v.trim() === '' || Number.isNaN(n)) return 'Введите цену числом';
      if (n <= 0) return 'Цена должна быть больше нуля';
      if (n > 1000000000) return 'Слишком большая цена';
      if (!Number.isInteger(n)) return 'Цена указывается в целых рублях';
      return '';
    }
  };

  /* первое сообщение об ошибке из списка правил или пустая строка */
  function check(value, list) {
    for (let i = 0; i < list.length; i++) {
      const msg = list[i](value);
      if (msg) return msg;
    }
    return '';
  }

  function feedbackFor(input) {
    const anchor = input.closest('[data-field]') || input;
    let box = anchor.nextElementSibling;
    if (!box || !box.classList.contains('invalid-feedback')) {
      box = T.el('div', { class: 'invalid-feedback', role: 'alert' });
      anchor.after(box);
    }
    return box;
  }

  function setError(input, message) {
    const box = feedbackFor(input);
    box.textContent = message;
    input.classList.toggle('is-invalid', Boolean(message));
    box.classList.toggle('is-shown', Boolean(message));
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    const anchor = input.closest('[data-field]');
    if (anchor) anchor.classList.toggle('is-invalid', Boolean(message));
    return !message;
  }

  /* fields: [{ input, rules: [...], skip: function(): boolean }] */
  function validateFields(fields) {
    let firstBad = null;
    fields.forEach(function (f) {
      const skipped = f.skip && f.skip();
      const message = skipped ? '' : check(f.input.value, f.rules);
      if (!setError(f.input, message) && !firstBad) firstBad = f.input;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  /* очистка ошибки сразу, как только пользователь начал исправлять поле */
  function liveClear(fields) {
    fields.forEach(function (f) {
      f.input.addEventListener('input', function () {
        if (f.input.classList.contains('is-invalid')) {
          const msg = check(f.input.value, f.rules);
          if (!msg) setError(f.input, '');
        }
      });
      f.input.addEventListener('blur', function () {
        if (f.input.value !== '' && !(f.skip && f.skip())) setError(f.input, check(f.input.value, f.rules));
      });
    });
  }

  T.rules = rules;
  T.check = check;
  T.setError = setError;
  T.validateFields = validateFields;
  T.liveClear = liveClear;
})();
