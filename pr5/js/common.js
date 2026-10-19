/* Общее поведение всех страниц: вход/выход в шапке, запасная картинка. */
(function () {
  const T = window.TEMP;

  const PLACEHOLDER = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
    '<rect width="400" height="300" fill="#EEF2F7"/>' +
    '<g fill="none" stroke="#949494" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="200" cy="140" r="34"/><circle cx="200" cy="140" r="12"/></g>' +
    '<text x="200" y="230" font-family="Inter, Arial, sans-serif" font-size="22" fill="#949494" text-anchor="middle">Фото отсутствует</text></svg>'
  );
  T.PLACEHOLDER = PLACEHOLDER;

  /* если файла картинки нет, подставляется заглушка */
  T.safeImage = function (img, src) {
    img.addEventListener('error', function () {
      if (img.src !== PLACEHOLDER) img.src = PLACEHOLDER;
    }, { once: true });
    img.src = src || PLACEHOLDER;
    return img;
  };

  document.addEventListener('DOMContentLoaded', function () {
    const session = T.getSession();

    /* «Войти» превращается в ссылку на кабинет, если пользователь уже вошёл */
    document.querySelectorAll('a[href="login.html"]').forEach(function (a) {
      if (session && a.closest('nav')) {
        a.textContent = 'Кабинет';
        a.setAttribute('href', session.page);
      }
    });

    /* «Выйти» завершает сессию */
    document.querySelectorAll('[data-logout]').forEach(function (a) {
      a.addEventListener('click', function () { T.logout(); });
    });

    /* картинки, которых нет в папке, заменяются заглушкой */
    document.querySelectorAll('img[data-fallback]').forEach(function (img) {
      T.safeImage(img, img.getAttribute('src'));
    });
  });
})();
