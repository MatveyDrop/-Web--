/* Форма добавления и редактирования станка (страницы на Bootstrap): проверка кодом, сохранение в массив. */
(function () {
  const T = window.TEMP;
  const form = document.getElementById('machine-form');
  const mode = form.dataset.mode;                       
  const session = T.getSession();

  if (!session) { location.replace('login.html'); return; }

  document.querySelectorAll('#back-link, [data-back]').forEach(a => a.setAttribute('href', session.page));

  const els = {
    title: document.getElementById('f-title'),
    type: document.getElementById('f-type'),
    region: document.getElementById('f-region'),
    price: document.getElementById('f-price'),
    negotiable: document.getElementById('negotiable'),
    email: document.getElementById('f-email'),
    phone: document.getElementById('f-phone'),
    photo: document.getElementById('photo'),
    preview: document.getElementById('photo-preview'),
    icon: document.getElementById('photo-icon'),
    caption: document.getElementById('photo-caption'),
    zone: document.getElementById('photo-zone')
  };

  /* ---------- режим редактирования: найти станок и заполнить поля ---------- */
  let editing = null;
  if (mode === 'edit') {
    editing = T.getMachine(new URLSearchParams(location.search).get('id'));
    const denied = editing && session.role !== 'admin' && editing.author !== session.name;
    if (!editing || denied) {
      form.hidden = true;
      document.getElementById('form-missing').hidden = false;
      return;
    }
    els.title.value = editing.title;
    els.type.value = T.typeLabel(editing.type);
    els.region.value = editing.region;
    els.email.value = editing.email;
    els.phone.value = editing.phone;
    document.getElementById(editing.condition).checked = true;
    if (editing.price === null) {
      els.negotiable.checked = true;
    } else {
      els.price.value = editing.price;
    }
    if (editing.image) showPreview(editing.image);
  }

  /* ---------- «цена договорная» ---------- */
  function syncPrice() {
    els.price.disabled = els.negotiable.checked;
    if (els.negotiable.checked) {
      els.price.value = '';
      T.setError(els.price, '');
    }
  }
  els.negotiable.addEventListener('change', syncPrice);
  syncPrice();

  /* ---------- фото ---------- */
  let photoData = editing ? editing.image : '';

  function showPreview(src) {
    els.preview.src = src;
    els.preview.hidden = false;
    els.icon.hidden = true;
    els.caption.textContent = 'Изменить фото станка';
    els.caption.className = 'position-relative bg-white bg-opacity-75 rounded-3 px-2 py-1 fs-6 text-secondary';
  }

  /* уменьшение снимка */
  function shrink(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function () {
        const img = new Image();
        img.onerror = reject;
        img.onload = function () {
          const k = Math.min(1, 900 / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * k);
          canvas.height = Math.round(img.height * k);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  els.photo.addEventListener('change', function () {
    const file = els.photo.files[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      T.setError(els.photo, 'Выберите файл изображения (JPG, PNG, WEBP)');
      els.photo.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      T.setError(els.photo, 'Размер файла не должен превышать 5 МБ');
      els.photo.value = '';
      return;
    }
    shrink(file).then(function (data) {
      photoData = data;
      T.setError(els.photo, '');
      showPreview(data);
    }).catch(function () {
      T.setError(els.photo, 'Не удалось прочитать изображение');
    });
  });

  /* ---------- правила ---------- */
  function typeKnown(v) {
    const t = T.TYPES.find(x => x.label.toLowerCase() === v.trim().toLowerCase());
    return t ? '' : 'Выберите тип из списка';
  }
  const fields = [
    { input: els.title,  rules: [T.rules.required, T.rules.minLength(3)] },
    { input: els.type,   rules: [T.rules.required, typeKnown] },
    { input: els.region, rules: [T.rules.required, T.rules.minLength(2)] },
    { input: els.price,  rules: [T.rules.positiveNumber], skip: () => els.negotiable.checked },
    { input: els.email,  rules: [T.rules.required, T.rules.email] },
    { input: els.phone,  rules: [T.rules.required, T.rules.phone] }
  ];
  T.liveClear(fields);

  /* ---------- отправка ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!T.validateFields(fields)) return;

    const data = {
      title: els.title.value.trim(),
      type: T.TYPES.find(x => x.label.toLowerCase() === els.type.value.trim().toLowerCase()).value,
      condition: form.querySelector('input[name="condition"]:checked').id,
      region: els.region.value.trim(),
      price: els.negotiable.checked ? null : Number(els.price.value),
      image: photoData,
      email: els.email.value.trim(),
      phone: els.phone.value.trim()
    };

    if (mode === 'edit') {
      T.updateMachine(editing.id, data);
    } else {
      T.addMachine(Object.assign(data, {
        author: session.name,
        createdAt: T.todayISO(),
        description: ''
      }));
    }
    location.href = session.page;
  });
})();
