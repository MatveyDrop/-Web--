/* Хранилище станков, сессия и вспомогательные функции. */
(function () {
  const T = window.TEMP;
  const KEY = 'temp.machines';
  const SESSION = 'temp.session';

  function read(storage, key) {
    try { return JSON.parse(storage.getItem(key)); } catch (e) { return null; }
  }
  function write(storage, key, value) {
    try { storage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }

  /* ---------- станки ---------- */
  let memory = null;                       

  T.getMachines = function () {
    let list = read(localStorage, KEY);
    if (!Array.isArray(list)) {
      list = memory || JSON.parse(JSON.stringify(T.SEED));
      if (!write(localStorage, KEY, list)) memory = list;
    }
    return list;
  };
  function save(list) {
    memory = list;
    write(localStorage, KEY, list);
  }
  T.getMachine = function (id) {
    return T.getMachines().find(m => m.id === Number(id)) || null;
  };
  T.addMachine = function (data) {
    const list = T.getMachines();
    const id = list.reduce((max, m) => Math.max(max, m.id), 0) + 1;
    const machine = Object.assign({ id: id, specs: [] }, data);
    list.push(machine);
    save(list);
    return machine;
  };
  T.updateMachine = function (id, data) {
    const list = T.getMachines();
    const i = list.findIndex(m => m.id === Number(id));
    if (i === -1) return null;
    list[i] = Object.assign({}, list[i], data);
    save(list);
    return list[i];
  };
  T.deleteMachine = function (id) {
    save(T.getMachines().filter(m => m.id !== Number(id)));
  };
  T.resetMachines = function () {
    save(JSON.parse(JSON.stringify(T.SEED)));
  };

  /* ---------- вход ---------- */
  T.login = function (login, password) {
    const user = T.USERS.find(u => u.login === login && u.password === password);
    if (!user) return null;
    write(sessionStorage, SESSION, { login: user.login, role: user.role, name: user.name, page: user.page });
    return user;
  };
  T.logout = function () {
    try { sessionStorage.removeItem(SESSION); } catch (e) { /* ignore */ }
  };
  T.getSession = function () { return read(sessionStorage, SESSION); };

  /* ---------- форматирование ---------- */
  T.formatPrice = function (price) {
    if (price === null || price === undefined || price === '') return 'Цена договорная';
    return new Intl.NumberFormat('ru-RU').format(price).replace(/ /g, ' ') + ' ₽';
  };
  T.formatDate = function (iso) {
    const [y, m, d] = String(iso).split('-');
    return d + '.' + m + '.' + y;
  };
  T.typeLabel = function (value) {
    const t = T.TYPES.find(x => x.value === value);
    return t ? t.label : value;
  };
  T.conditionLabel = function (value) {
    const c = T.CONDITIONS.find(x => x.value === value);
    return c ? c.label : value;
  };
  T.todayISO = function () {
    const d = new Date();
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  };

  /* создание элемента без innerHTML: данные пользователя попадают только в textContent */
  T.el = function (tag, props, children) {
    const node = document.createElement(tag);
    Object.keys(props || {}).forEach(k => {
      if (k === 'text') node.textContent = props[k];
      else if (k === 'class') node.className = props[k];
      else node.setAttribute(k, props[k]);
    });
    (children || []).forEach(c => node.append(c));
    return node;
  };
})();
