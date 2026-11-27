(() => {
  'use strict';

  const asset = new URL('./', document.currentScript.src);
  const bindings = globalThis.starCitizenFlightBindings;
  const conditions = globalThis.starCitizenActionBadges;
  const node = (tag, text, className) => {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
  };

  function mount(container) {
    container.innerHTML = `
      <section class="sc-flight" aria-labelledby="sc-title">
        <nav class="sc-section-nav" aria-label="Разделы Star Citizen">
          <a href="#star-citizen" aria-current="page">Управление</a><a href="#star-citizen-ships">Корабли и техника</a>
        </nav>
        <p class="sc-kicker">STAR CITIZEN / УПРАВЛЕНИЕ</p>
        <h2 id="sc-title">Полёт на DualSense Edge</h2>
        <p class="muted sc-intro">Профиль <strong>CDFv2</strong>. Выбери кнопку или стик, чтобы увидеть действия и сочетания по-русски.</p>
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
            <p class="muted sc-input-key">Без метки нажатия: нажать один раз. 2×: дважды. «Долго»: длительное удержание. «Клик»: нажатие стика.</p>
          </section>
        </div>
        <p class="muted sc-note">Явные назначения взяты из экспорта CDFv2. Пометка «†» означает, что действие не записано в экспорте и показано по стандартным настройкам игры 4.10. Тачпад, Fn и задние кнопки в экспорте не назначены.</p>
        <div class="sc-reference">
          <details>
            <summary>Шпаргалка CDFv2 целиком на русском</summary>
            <p class="muted sc-image-hint">Нажми на схему, чтобы открыть в полном размере.</p>
            <a class="sc-cdfv2-reference" data-sc-image="dualsense-edge-cdfv2-ru.svg?v=portrait" target="_blank" rel="noopener">
              <img width="1470" height="1476" loading="lazy" alt="Полная русская схема полёта для DualSense Edge">
            </a>
          </details>
          <details>
            <summary>Геймпад Xbox: игровая схема на русском</summary>
            <a data-sc-image="xbox-original-ru.svg" target="_blank" rel="noopener">
              <img width="2135" height="1240" loading="lazy" alt="Игровая схема полётных привязок Xbox на русском">
            </a>
          </details>
          <details>
            <summary>Клавиатура и мышь: игровая схема на русском</summary>
            <p class="muted sc-image-hint">Нажми на схему, чтобы открыть её в полном размере.</p>
            <a data-sc-image="keyboard-original-ru.svg" target="_blank" rel="noopener">
              <img width="3970" height="1110" loading="lazy" alt="Игровая схема полётных привязок клавиатуры и мыши на русском">
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
      el('#sc-actions').replaceChildren(...globalThis.starCitizenCompactActions(binding).map(action => {
        const li = node('li');
        const label = node('span', action.label, 'sc-action');
        label.title = action.full;
        label.setAttribute('aria-label', action.full);
        if (action.keys.length) {
          const row = node('div', '', 'sc-badges');
          action.keys.forEach(key => {
            const [name, description] = conditions[key];
            const badge = node('span', globalThis.starCitizenCompactLabels[key] || name);
            badge.title = description ? name + ': ' + description : name;
            badge.setAttribute('aria-label', badge.title);
            badge.dataset.scBadge = key;
            row.append(badge);
          });
          li.append(row);
        }
        li.append(label);
        return li;
      }));
      buttons.forEach(button => button.setAttribute('aria-pressed',
        String(button.dataset.scKey === binding.id)));
    }

    function buttonFor(binding, hotspot = false) {
      const button = node('button', hotspot ? '' : (binding.id === 'options' ? 'Пауза' : binding.label), hotspot ? 'sc-hotspot' : 'sc-button');
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
