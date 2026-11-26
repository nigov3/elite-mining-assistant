(() => {
  'use strict';

  const asset = new URL('./', document.currentScript.src);
  const bindings = globalThis.starCitizenFlightBindings;
  const conditions = {
    M1: 'Зажми L1', IM: 'Взаимодействие', SC: 'Сканирование',
    MG: 'Добыча', ML: 'Ракетный режим', EA: 'Арена'
  };
  const node = (tag, text, className) => {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
  };

  function mount(container) {
    container.innerHTML = `
      <section class="sc-flight" aria-labelledby="sc-title">
        <p class="sc-kicker">STAR CITIZEN / УПРАВЛЕНИЕ</p>
        <h2 id="sc-title">Полёт на DualSense Edge</h2>
        <p class="muted sc-intro">Выбери кнопку на схеме или в списке, чтобы посмотреть её действия и сочетания по-русски.</p>
        <div class="sc-layout">
          <div class="sc-visual">
            <div class="sc-map" role="group" aria-label="Интерактивная схема геймпада">
              <img width="822" height="480" alt="DualSense Edge, вид спереди">
            </div>
            <div class="sc-buttons" role="group" aria-label="Список кнопок геймпада"></div>
          </div>
          <section class="sc-selected" aria-labelledby="sc-binding-title" aria-live="polite">
            <p class="sc-kicker" id="sc-binding-key"></p>
            <h3 id="sc-binding-title"></h3>
            <ul id="sc-actions"></ul>
          </section>
        </div>
        <p class="muted sc-note">Это схема полёта с игрового скриншота, а не профиль для импорта. У тачпада, Fn и задних кнопок отдельные назначения на скриншоте не указаны.</p>
        <div class="sc-reference">
          <details>
            <summary>Шпаргалка целиком на русском</summary>
            <a data-sc-image="star-citizen-dualsense-edge-ru.webp" target="_blank" rel="noopener">
              <img width="2000" height="1660" loading="lazy" alt="Полная русская схема полёта для DualSense Edge">
            </a>
          </details>
          <details>
            <summary>Геймпад Xbox: оригинальный скриншот</summary>
            <a data-sc-image="star-citizen-original-crop.png" target="_blank" rel="noopener">
              <img width="1310" height="708" loading="lazy" alt="Обрезанный скриншот меню полётных привязок Xbox в Star Citizen">
            </a>
          </details>
          <details>
            <summary>Клавиатура и мышь: полёт</summary>
            <p class="muted sc-image-hint">Нажми на скриншот, чтобы открыть его в полном размере.</p>
            <a data-sc-image="star-citizen-keyboard-mouse.png" target="_blank" rel="noopener">
              <img width="1270" height="334" loading="lazy" alt="Обрезанный игровой скриншот полётных привязок клавиатуры и мыши в Star Citizen">
            </a>
          </details>
        </div>
      </section>`;
    const el = selector => container.querySelector(selector);
    el('.sc-map img').src = new URL('dualsense-edge.svg', asset);
    container.querySelectorAll('[data-sc-image]').forEach(link => {
      link.href = new URL(link.dataset.scImage, asset);
      // Fetch full-size images only when opened.
      link.parentElement.addEventListener('toggle', () => {
        if (link.parentElement.open && !link.firstElementChild.hasAttribute('src')) {
          link.firstElementChild.src = link.href;
        }
      });
    });

    const buttons = [];
    function pick(binding) {
      el('#sc-binding-key').textContent = binding.label;
      el('#sc-binding-title').textContent = binding.name;
      el('#sc-actions').replaceChildren(...binding.actions.map(([tags, action]) => {
        const li = node('li');
        const hold = action.endsWith('*');
        li.append(node('span', hold ? action.slice(0,-1) : action, 'sc-action'));
        const badges = tags ? tags.split(' ').map(key => conditions[key]) : [];
        if (hold) badges.push('Удерживай кнопку');
        if (badges.length) {
          const row = node('div', '', 'sc-badges');
          badges.forEach(badge => row.append(node('span', badge)));
          li.append(row);
        }
        return li;
      }));
      buttons.forEach(button => button.setAttribute('aria-pressed',
        String(button.dataset.scKey === binding.id)));
    }

    function buttonFor(binding, hotspot = false) {
      const button = node('button', hotspot ? '' : binding.label, hotspot ? 'sc-hotspot' : 'sc-button');
      button.type = 'button';
      button.dataset.scKey = binding.id;
      button.setAttribute('aria-label', binding.label + ': ' + binding.name);
      button.setAttribute('aria-controls', 'sc-actions');
      if (hotspot) {
        button.title = binding.label + ': ' + binding.name;
        button.style.setProperty('--sc-x', ((binding.point[0] + 10) * 100 / 822) + '%');
        button.style.setProperty('--sc-y', (binding.point[1] * 100 / 480) + '%');
        button.classList.toggle('sc-stick', binding.label === 'L3' || binding.label === 'R3');
      }
      button.addEventListener('click', () => pick(binding));
      buttons.push(button);
      return button;
    }

    const map = el('.sc-map');
    const choices = el('.sc-buttons');
    bindings.forEach(binding => {
      if (binding.point) map.append(buttonFor(binding, true));
      choices.append(buttonFor(binding));
    });
    pick(bindings.find(binding => binding.id === 'l3'));
  }
  globalThis.StarCitizenControls = {mount};
})();
