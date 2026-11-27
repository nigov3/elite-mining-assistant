(() => {
  'use strict';
  const dataset = new URL('pledge-vehicles-ru.json?v=1', document.currentScript.src);
  const collator = new Intl.Collator(['ru', 'en'], { numeric: true });
  const formatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 12 });
  const numeric = new Set([5, 9, 10, 11, 12, ...Array.from({ length: 15 }, (_, i) => 14 + i)]);
  const shown = [[0, 'Название'], [4, 'Назначение'], [7, 'Готовность'], [23, 'Трюм, SCU'],
    [25, 'Макс., м/с'], [14, 'Покупка, aUEC'], [9, 'Магазин, $']];
  const size = 24;
  const norm = str => (str || '').toLowerCase().replace(/ё/g, 'е');
  const format = value => value === null ? '—' : typeof value === 'number' ? formatter.format(value) : value;
  function selectRows(rows, { query = '', type = '', career = '', ready = '', column = 0, descending = false } = {}) {
    const terms = norm(query).trim().split(/\s+/).filter(Boolean);
    return rows.filter(row => (!type || row[2] === type) && (!career || row[3] === career) &&
      (!ready || row[7] === ready) && terms.every(term => norm(row.slice(0, 5).join(' ')).includes(term)))
      .sort((a, b) => {
        const x = a[column], y = b[column];
        if (x === null || y === null) return (x === null) - (y === null) || collator.compare(a[0], b[0]);
        const order = numeric.has(column) ? x - y : collator.compare(x, y);
        return (descending ? -order : order) || collator.compare(a[0], b[0]);
      });
  }

  let pending;
  function load() {
    pending ??= fetch(dataset).then(response => {
      if (!response.ok) throw new Error('Не удалось загрузить данные');
      return response.json();
    }).then(data => {
      if (data.columns?.length !== 31 || !data.rows?.length || data.rows.some(row => row.length !== 31)) {
        throw new Error('Неверный формат данных');
      }
      return data;
    }).catch(error => { pending = null; throw error; });
    return pending;
  }
  function el(tag, text) {
    const element = document.createElement(tag);
    if (text != null) element.textContent = text;
    return element;
  }
  async function mount(container) {
    const section = el('section');
    section.className = 'sc-catalog';
    section.setAttribute('aria-labelledby', 'sc-ships-title');
    section.innerHTML = `
      <nav class="sc-section-nav" aria-label="Разделы Star Citizen">
        <a href="#star-citizen">Управление</a><a href="#star-citizen-ships" aria-current="page">Корабли и техника</a>
      </nav>
      <h2 id="sc-ships-title">Корабли и техника Star Citizen</h2>
      <p class="muted">Каталог техники из магазина, в том числе снятые с продажи модели и концепты. Это не весь транспорт игры. Цены и наличие справочные, прочерк означает, что в исходной таблице нет значения.</p>
      <p class="muted">Источник: <a href="https://starcitizen.tools/Pledge_vehicle_list">участники Star Citizen Wiki</a>.
        Русский перевод таблицы, <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="license">CC BY-SA 4.0</a>.
        <a data-sc-dataset download>Скачать данные (JSON)</a>.</p>
      <p role="status" data-sc-status>Загружаю каталог…</p>
      <div data-sc-content hidden>
        <div class="sc-catalog-filters">
          <label>Поиск<input type="search" data-sc-search placeholder="Название или назначение"></label>
          <label>Тип техники<select data-sc-filter="2"><option value="">Все типы</option></select></label>
          <label>Категория<select data-sc-filter="3"><option value="">Все категории</option></select></label>
          <label>Готовность<select data-sc-filter="7"><option value="">Все статусы</option></select></label>
        </div>
        <div class="sc-catalog-table" tabindex="0" role="region" aria-label="Таблица кораблей, прокручивается по горизонтали">
          <table><thead><tr></tr></thead><tbody></tbody></table>
        </div>
        <div class="sc-catalog-pages"><button type="button" data-sc-prev>← Назад</button>
          <span data-sc-page></span><button type="button" data-sc-next>Вперёд →</button></div>
        <dialog class="sc-ship-detail" aria-labelledby="sc-ship-name">
          <form method="dialog"><button>Закрыть</button></form>
          <h3 id="sc-ship-name"></h3><dl></dl>
        </dialog>
      </div>`;
    container.replaceChildren(section);
    const get = query => section.querySelector(query);
    const status = get('[data-sc-status]');
    get('[data-sc-dataset]').href = dataset.href;
    let data;
    try { data = await load(); } catch {
      if (!section.isConnected) return;
      status.textContent = 'Не удалось загрузить каталог. ';
      const retry = el('button', 'Повторить');
      retry.type = 'button';
      retry.onclick = () => mount(container);
      status.append(retry);
      return;
    }
    if (!section.isConnected) return;
    const opts = {};
    const heads = [];
    let page = 0;
    get('[data-sc-content]').hidden = false;
    const detail = get('dialog'), description = get('dl'), prev = get('[data-sc-prev]'), next = get('[data-sc-next]');
    const search = get('[data-sc-search]'), tbody = get('tbody');
    function showDetails(row) {
      get('#sc-ship-name').textContent = row[0];
      description.replaceChildren();
      data.columns.slice(1).forEach((name, i) => {
        const dd = el('dd', format(row[i + 1]));
        if (i + 1 === 8 && row[8] === 'Выводится из продажи') {
          const link = el('a', 'Объявление RSI');
          link.href = 'https://robertsspaceindustries.com/en/comm-link/transmission/21336-RSI-Constellation-Mk-IV-Celebration';
          dd.append(' · ', link);
        }
        description.append(el('dt', name), dd);
      });
      detail.showModal();
    }
    for (const [idx, label] of shown) {
      const heading = el('th'), button = el('button', label);
      heading.scope = 'col'; button.type = 'button';
      button.onclick = () => {
        const column = opts.column ?? 0;
        opts.descending = column === idx ? !opts.descending : numeric.has(idx);
        opts.column = idx;
        refresh();
      };
      heading.append(button);
      get('thead tr').append(heading);
      heads.push([idx, label, heading, button]);
    }

    function render() {
      const selected = selectRows(data.rows, opts);
      const pages = Math.max(1, Math.ceil(selected.length / size));
      page = Math.max(0, Math.min(page, pages - 1));
      status.textContent = 'Найдено: ' + selected.length + ' из ' + data.rows.length;
      get('[data-sc-page]').textContent = 'Страница ' + (page + 1) + ' из ' + pages;
      prev.disabled = page === 0; next.disabled = page + 1 >= pages;
      for (const [idx, label, heading, button] of heads) {
        const current = idx === (opts.column ?? 0);
        button.textContent = label + (current ? (opts.descending ? ' ↓' : ' ↑') : '');
        if (current) heading.setAttribute('aria-sort', opts.descending ? 'descending' : 'ascending');
        else heading.removeAttribute('aria-sort');
      }
      const fragment = document.createDocumentFragment();
      for (const row of selected.slice(page * size, (page + 1) * size)) {
        const tr = el('tr'), name = el('th'), button = el('button', row[0]);
        name.scope = 'row'; button.type = 'button';
        button.onclick = () => showDetails(row);
        name.append(button, el('small', row[1]));
        tr.append(name);
        for (const [i] of shown.slice(1)) tr.append(el('td', format(row[i])));
        fragment.append(tr);
      }
      if (!selected.length) {
        const tr = el('tr'), cell = el('td', 'Ничего не найдено. Измени запрос или сбрось фильтры.');
        cell.colSpan = shown.length; tr.append(cell); fragment.append(tr);
      }
      tbody.replaceChildren(fragment);
    }
    function refresh() { page = 0; render(); }
    for (const filter of section.querySelectorAll('[data-sc-filter]')) {
      const idx = Number(filter.dataset.scFilter);
      for (const value of [...new Set(data.rows.map(row => row[idx]))].filter(Boolean).sort(collator.compare)) {
        const option = el('option', value); option.value = value; filter.append(option);
      }
      const key = { 2: 'type', 3: 'career', 7: 'ready' }[idx];
      filter.onchange = () => { opts[key] = filter.value; refresh(); };
    }
    search.oninput = () => { opts.query = search.value; refresh(); };
    prev.onclick = () => { page--; render(); };
    next.onclick = () => { page++; render(); };
    render();
  }
  globalThis.StarCitizenShips = { mount, selectRows, format };
})();
