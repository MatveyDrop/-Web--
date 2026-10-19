/* Каталог: вывод карточек из массива, поиск, фильтры, пагинация. */
(function () {
  const T = window.TEMP;
  const PAGE_SIZE = 6;

  const grid = document.querySelector('.machines-grid');
  const pagination = document.querySelector('.pagination');
  const form = document.querySelector('.filters-form');
  const searchInput = form.querySelector('input[type="text"]');
  const typeSelect = document.getElementById('type');
  const conditionSelect = document.getElementById('condition');
  const counter = document.getElementById('result-count');

  const state = { q: '', type: '', condition: '', page: 1 };

  /* ---- состояние <-> адресная строка ---- */
  function readUrl() {
    const p = new URLSearchParams(location.search);
    state.q = p.get('q') || '';
    state.type = p.get('type') || '';
    state.condition = p.get('condition') || '';
    state.page = Math.max(1, parseInt(p.get('page'), 10) || 1);
    searchInput.value = state.q;
    typeSelect.value = state.type;
    conditionSelect.value = state.condition;
  }
  function writeUrl() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.type) p.set('type', state.type);
    if (state.condition) p.set('condition', state.condition);
    if (state.page > 1) p.set('page', state.page);
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  /* ---- фильтрация массива ---- */
  function filtered() {
    const q = state.q.trim().toLowerCase();
    return T.getMachines().filter(function (m) {
      if (state.type && m.type !== state.type) return false;
      if (state.condition && m.condition !== state.condition) return false;
      if (q) {
        const haystack = (m.title + ' ' + m.region + ' ' + T.typeLabel(m.type)).toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  /* ---- карточка ---- */
  function card(m) {
    const img = T.safeImage(T.el('img', { class: 'card-img', alt: m.title, loading: 'lazy' }), m.image);
    return T.el('article', { class: 'machine-card' }, [
      img,
      T.el('div', { class: 'card-header' }, [
        T.el('h3', { text: m.title }),
        T.el('span', { class: 'card-category' }, [
          T.el('img', { src: 'icon-gear.png', alt: '', class: 'icon-sm' }),
          document.createTextNode(' ' + T.typeLabel(m.type))
        ])
      ]),
      T.el('div', { class: 'card-region' }, [
        T.el('img', { src: 'icon-pin.png', alt: '', class: 'icon-sm' }),
        document.createTextNode(' ' + m.region)
      ]),
      T.el('div', { class: 'card-footer' }, [
        T.el('span', { class: 'price', text: T.formatPrice(m.price) }),
        T.el('a', { href: 'machine.html?id=' + m.id, class: 'btn btn-primary', text: 'Подробнее' })
      ])
    ]);
  }

  /* ---- пагинация ---- */
  function pageLink(n, current) {
    const a = T.el('a', { href: '#', text: String(n), 'aria-label': 'Страница ' + n });
    if (n === current) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
    a.addEventListener('click', function (e) {
      e.preventDefault();
      state.page = n;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return a;
  }
  function renderPagination(total, current) {
    pagination.replaceChildren();
    pagination.hidden = total <= 1;
    if (total <= 1) return;
    for (let n = 1; n <= total; n++) pagination.append(pageLink(n, current));
  }

  /* ---- отрисовка ---- */
  function render() {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page > pages) state.page = pages;
    const slice = list.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);

    grid.replaceChildren();
    if (slice.length === 0) {
      grid.append(T.el('p', { class: 'empty-state', text: 'По вашему запросу станков не найдено. Измените условия поиска.' }));
    } else {
      slice.forEach(m => grid.append(card(m)));
    }
    counter.textContent = 'Найдено станков: ' + list.length;
    renderPagination(pages, state.page);
    writeUrl();
  }

  /* ---- события ---- */
  let timer = null;
  searchInput.addEventListener('input', function () {      
    clearTimeout(timer);
    timer = setTimeout(function () {
      state.q = searchInput.value;
      state.page = 1;
      render();
    }, 250);
  });

  form.addEventListener('submit', function (e) {           
    e.preventDefault();
    state.q = searchInput.value;
    state.type = typeSelect.value;
    state.condition = conditionSelect.value;
    state.page = 1;
    render();
  });

  [typeSelect, conditionSelect].forEach(function (select) {
    select.addEventListener('change', function () { form.requestSubmit(); });
  });

  form.addEventListener('reset', function () {            
    setTimeout(function () {
      state.q = state.type = state.condition = '';
      state.page = 1;
      render();
    }, 0);
  });

  readUrl();
  render();
})();
