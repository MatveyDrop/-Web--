/* Страница входа: проверка полей кодом и вход по учётным данным из data.js. */
(function () {
  const T = window.TEMP;
  const form = document.querySelector('.login-form');
  const login = document.getElementById('login');
  const password = document.getElementById('password');
  const formError = document.getElementById('login-error');

  if (T.getSession()) { location.replace(T.getSession().page); return; }

  const fields = [
    { input: login,    rules: [T.rules.required, T.rules.minLength(3)] },
    { input: password, rules: [T.rules.required, T.rules.minLength(6)] }
  ];
  T.liveClear(fields);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formError.hidden = true;
    if (!T.validateFields(fields)) return;

    const user = T.login(login.value.trim(), password.value);
    if (!user) {
      formError.textContent = 'Неверный логин или пароль';
      formError.hidden = false;
      password.value = '';
      password.focus();
      return;
    }
    location.href = user.page;
  });
})();
