/* Кабинеты администратора и менеджера: таблица строится из массива, удаление с подтверждением. */
(function () {
  const T = window.TEMP;
  const role = document.body.dataset.role;
  const session = T.getSession();

  if (!session || session.role !== role) {            
    location.replace('login.html');
    return;
  }

  document.getElementById('welcome').textContent = 'Добро пожаловать, ' + session.name;
  const tbody = document.querySelector('.dashboard-table tbody');

  function visibleMachines() {
    const all = T.getMachines();
    return role === 'admin' ? all : all.filter(m => m.author === session.name);
  }

  function row(m) {
    const del = T.el('button', { class: 'btn-icon', title: 'Удалить', type: 'button' }, [
      T.el('img', { src: 'icon-delete.png', alt: 'Удалить' })
    ]);
    del.addEventListener('click', function () {
      if (window.confirm('Удалить объявление «' + m.title + '»?')) {
        T.deleteMachine(m.id);
        render();
      }
    });
    return T.el('tr', {}, [
      T.el('td', { text: m.title }),
      T.el('td', { text: m.author }),
      T.el('td', { text: T.formatDate(m.createdAt) }),
      T.el('td', { text: m.region }),
      T.el('td', {}, [
        T.el('div', { class: 'action-buttons' }, [
          T.el('a', { href: 'edit-machine.html?id=' + m.id, class: 'btn-icon', title: 'Редактировать' }, [
            T.el('img', { src: 'icon-edit.png', alt: 'Редактировать' })
          ]),
          del
        ])
      ])
    ]);
  }

  function render() {
    const list = visibleMachines();
    tbody.replaceChildren();
    if (list.length === 0) {
      tbody.append(T.el('tr', {}, [
        T.el('td', { colspan: '5', class: 'empty-state', text: 'Объявлений пока нет. Нажмите «Добавить станок».' })
      ]));
      return;
    }
    list.forEach(m => tbody.append(row(m)));
  }
  render();
})();
