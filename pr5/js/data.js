/* Исходные данные */
(function () {
  const TYPES = [
    { value: 'milling',  label: 'Фрезерные' },
    { value: 'lathe',    label: 'Токарные' },
    { value: 'slotting', label: 'Долбежные' },
    { value: 'drilling', label: 'Вертикально-сверлильный' }
  ];

  const CONDITIONS = [
    { value: 'used',        label: 'Б/У' },
    { value: 'refurbished', label: 'Капитальный ремонт' },
    { value: 'new',         label: 'Новый' }
  ];

  const USERS = [
    { login: 'admin',   password: 'admin123',   role: 'admin',   name: 'Надежда', page: 'admin.html' },
    { login: 'manager', password: 'manager123', role: 'manager', name: 'Елена',   page: 'manager.html' }
  ];

  const MACHINES = [
    {
      id: 1, title: 'Токарный станок 16К20', type: 'lathe', condition: 'used',
      region: 'Волгоградская область', price: 1500000, image: '16К20.jpeg',
      author: 'Елена', createdAt: '2026-07-12',
      email: 'info@temp.ru', phone: '+7 (800) 555-35-35',
      description: 'Данный станок находится в Волгоградской области, в рабочем состоянии, отключен.',
      specs: [
        { name: 'Масса, кг', value: '2500' },
        { name: 'Диаметр обработки над станиной, мм', value: '400' },
        { name: 'Диаметр обработки над суппортом, мм', value: '220' }
      ]
    },
    {
      id: 2, title: '1А64 РМЦ2800', type: 'lathe', condition: 'refurbished',
      region: 'Ленинградская обл.', price: 5690000, image: '1А64.jpeg',
      author: 'Елена', createdAt: '2026-08-03',
      email: 'info@temp.ru', phone: '+7 (928) 964-12-60',
      description: 'Тяжёлый токарно-винторезный станок после капитального ремонта. Документация в наличии.',
      specs: [
        { name: 'Диаметр обработки над станиной, мм', value: '640' },
        { name: 'Расстояние между центрами, мм', value: '2800' }
      ]
    },
    {
      id: 3, title: '2С32', type: 'drilling', condition: 'used',
      region: 'Москва', price: 774125, image: '2С32.jpeg',
      author: 'Виктория', createdAt: '2026-08-21',
      email: 'info@temp.ru', phone: '+7 (928) 964-12-60',
      description: 'Вертикально-сверлильный станок. Самовывоз со склада в Москве.',
      specs: [
        { name: 'Наибольший диаметр сверления, мм', value: '32' }
      ]
    },
    {
      id: 4, title: 'Резьбонакатной автомат 5А993', type: 'milling', condition: 'used',
      region: 'Воронежская область', price: 2350000, image: '',
      author: 'Елена', createdAt: '2026-11-15',
      email: 'info@temp.ru', phone: '+7 (928) 964-12-60',
      description: 'Автомат для накатки резьбы, состояние хорошее, возможен осмотр.',
      specs: []
    },
    {
      id: 5, title: 'Горизонтально-фрезерный 6Р82Г', type: 'milling', condition: 'refurbished',
      region: 'Свердловская область', price: 1890000, image: '',
      author: 'Виктория', createdAt: '2026-06-02',
      email: 'info@temp.ru', phone: '+7 (928) 964-12-60',
      description: 'Горизонтально-фрезерный станок после капитального ремонта, проверка на геометрическую точность.',
      specs: [{ name: 'Размер стола, мм', value: '320 × 1250' }]
    },
    {
      id: 6, title: 'Вертикально-фрезерный 6Р13', type: 'milling', condition: 'new',
      region: 'Москва', price: 4250000, image: '',
      author: 'Елена', createdAt: '2026-09-09',
      email: 'info@temp.ru', phone: '+7 (928) 964-12-60',
      description: 'Новый вертикально-фрезерный станок с гарантией производителя.',
      specs: [{ name: 'Размер стола, мм', value: '400 × 1600' }]
    },
    {
      id: 7, title: 'Долбёжный 7А420', type: 'slotting', condition: 'used',
      region: 'Нижегородская область', price: 960000, image: '',
      author: 'Виктория', createdAt: '2026-05-18',
      email: 'info@temp.ru', phone: '+7 (928) 964-12-60',
      description: 'Долбёжный станок для обработки пазов и шпоночных канавок.',
      specs: [{ name: 'Наибольший ход долбяка, мм', value: '200' }]
    },
    {
      id: 8, title: 'Токарный станок 1К62', type: 'lathe', condition: 'used',
      region: 'Краснодарский край', price: 780000, image: '',
      author: 'Елена', createdAt: '2026-04-27',
      email: 'info@temp.ru', phone: '+7 (928) 964-12-60',
      description: 'Токарно-винторезный станок, в рабочем состоянии.',
      specs: [
        { name: 'Диаметр обработки над станиной, мм', value: '400' },
        { name: 'Диаметр обработки над суппортом, мм', value: '210' }
      ]
    },
    {
      id: 9, title: 'Сверлильный 2Н125', type: 'drilling', condition: 'new',
      region: 'Санкт-Петербург', price: 410000, image: '',
      author: 'Виктория', createdAt: '2026-09-30',
      email: 'info@temp.ru', phone: '+7 (928) 964-12-60',
      description: 'Новый вертикально-сверлильный станок для мастерской.',
      specs: [{ name: 'Наибольший диаметр сверления, мм', value: '25' }]
    },
    {
      id: 10, title: 'Токарный с ЧПУ CK6140', type: 'lathe', condition: 'new',
      region: 'Татарстан', price: 3100000, image: '',
      author: 'Елена', createdAt: '2026-10-05',
      email: 'info@temp.ru', phone: '+7 (928) 964-12-60',
      description: 'Токарный станок с ЧПУ, поставка со склада.',
      specs: []
    },
    {
      id: 11, title: 'Фрезерный 6М12П', type: 'milling', condition: 'used',
      region: 'Ростовская область', price: null, image: '',
      author: 'Виктория', createdAt: '2026-07-30',
      email: 'info@temp.ru', phone: '+7 (928) 964-12-60',
      description: 'Вертикальный консольно-фрезерный станок. Цена договорная.',
      specs: []
    }
  ];

  window.TEMP = window.TEMP || {};
  window.TEMP.TYPES = TYPES;
  window.TEMP.CONDITIONS = CONDITIONS;
  window.TEMP.USERS = USERS;
  window.TEMP.SEED = MACHINES;
})();
