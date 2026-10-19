/* Страница станка: данные подставляются по параметру ?id=*/
(function () {
  const T = window.TEMP;
  const id = new URLSearchParams(location.search).get('id');
  const machine = T.getMachine(id);
  const main = document.querySelector('main');
  const view = document.getElementById('machine-view');
  const missing = document.getElementById('machine-missing');

  if (!machine) {
    view.hidden = true;
    missing.hidden = false;
    document.title = 'Станок не найден — ТЕМП';
    return;
  }
  missing.hidden = true;
  view.hidden = false;
  document.title = machine.title + ' — ТЕМП';

  T.safeImage(document.getElementById('m-image'), machine.image).alt = machine.title;
  document.getElementById('m-title').textContent = machine.title;
  document.getElementById('m-condition').textContent = T.conditionLabel(machine.condition);
  document.getElementById('m-region').textContent = machine.region;
  document.getElementById('m-price').textContent = T.formatPrice(machine.price);
  document.getElementById('m-description').textContent = machine.description || 'Описание не указано.';
  document.getElementById('m-call').setAttribute('href', 'tel:' + machine.phone.replace(/[^\d+]/g, ''));
  document.getElementById('m-mail').setAttribute('href', 'mailto:' + machine.email + '?subject=' + encodeURIComponent(machine.title));

  const table = document.getElementById('m-specs');
  table.replaceChildren();
  const specs = [{ name: 'Тип станка', value: T.typeLabel(machine.type) }].concat(machine.specs || []);
  specs.forEach(function (s) {
    table.append(T.el('tr', {}, [T.el('th', { text: s.name }), T.el('td', { text: s.value })]));
  });

  /* вкладки */
  const tabs = Array.from(document.querySelectorAll('.tabs a'));
  const panels = Array.from(document.querySelectorAll('.tab-content'));
  function show(name) {
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('href') === '#' + name));
    panels.forEach(p => { p.hidden = p.id !== name; });
  }
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      show(tab.getAttribute('href').slice(1));
    });
  });
})();
