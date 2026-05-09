(function () {
  const INDIGO = '#253166';
  const SKY = '#00A1DE';
  const CARMINE = '#CD171A';
  const YELLOW = '#FFCC00';
  const WHITE = '#ffffff';

  const QA = [
    {
      q: 'When is the next class?',
      a: 'We are currently building the next group. Join the waitlist and you\'ll be the first to know when enrollment opens.',
    },
    {
      q: '¿Cuándo es la próxima clase?',
      a: 'Estamos formando el próximo grupo. Únete a la lista de espera y serás de las primeras en saber cuando abra la inscripción.',
    },
    {
      q: 'How much does it cost?',
      a: 'Individual classes start at USD $200/month. Group classes start at USD $100/month. Pricing depends on your current English level and work experience. Join the waitlist for priority enrollment.',
    },
    {
      q: 'Is it online or in-person?',
      a: 'Both. CCA offers in-person classes in Santo Domingo and an online option for students outside the DR. We\'re currently taking small groups following our waitlist order.',
    },
  ];

  const WAITLIST_URL = 'https://callcentersacademy.com/waitlist.html';

  const style = document.createElement('style');
  style.textContent = `
    #cca-chat-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 56px;
      height: 56px;
      background: ${INDIGO};
      border-radius: 50%;
      box-shadow: 0 4px 18px rgba(37,49,102,0.38);
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }
    #cca-chat-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(37,49,102,0.48);
    }
    #cca-chat-btn svg { display: block; }

    #cca-chat-panel {
      position: fixed;
      bottom: 96px;
      right: 28px;
      width: 320px;
      background: ${WHITE};
      border-radius: 14px;
      box-shadow: 0 8px 40px rgba(37,49,102,0.22);
      z-index: 9998;
      overflow: hidden;
      font-family: 'Josefin Sans', sans-serif;
      display: none;
      flex-direction: column;
      max-height: 480px;
    }
    #cca-chat-panel.open { display: flex; }

    #cca-chat-header {
      background: ${INDIGO};
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #cca-chat-header span {
      color: ${WHITE};
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      flex: 1;
    }
    #cca-chat-close {
      background: none;
      border: none;
      color: ${WHITE};
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      opacity: 0.8;
      transition: opacity 0.15s;
    }
    #cca-chat-close:hover { opacity: 1; }

    #cca-chat-body {
      padding: 16px;
      overflow-y: auto;
      flex: 1;
    }

    .cca-intro {
      font-size: 13px;
      color: #555;
      margin-bottom: 14px;
      line-height: 1.5;
    }

    .cca-q-btn {
      display: block;
      width: 100%;
      text-align: left;
      background: #f4f6fb;
      border: 1.5px solid #e0e4ef;
      border-radius: 8px;
      padding: 10px 13px;
      font-family: 'Josefin Sans', sans-serif;
      font-size: 13px;
      color: ${INDIGO};
      cursor: pointer;
      margin-bottom: 8px;
      transition: background 0.15s, border-color 0.15s;
      font-weight: 600;
    }
    .cca-q-btn:hover {
      background: #e8ecf7;
      border-color: ${SKY};
    }
    .cca-q-btn:last-child { margin-bottom: 0; }

    .cca-answer-wrap {
      display: none;
      flex-direction: column;
      gap: 12px;
    }
    .cca-answer-wrap.visible { display: flex; }

    .cca-answer-text {
      font-size: 13.5px;
      color: #333;
      line-height: 1.65;
      background: #f9f9fb;
      border-left: 3px solid ${CARMINE};
      padding: 11px 13px;
      border-radius: 0 8px 8px 0;
    }

    .cca-waitlist-btn {
      display: block;
      text-align: center;
      background: ${CARMINE};
      color: ${WHITE};
      text-decoration: none;
      font-family: 'Josefin Sans', sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      padding: 10px 16px;
      border-radius: 8px;
      transition: background 0.15s;
    }
    .cca-waitlist-btn:hover { background: #a81216; }

    .cca-back-btn {
      background: none;
      border: none;
      color: ${SKY};
      font-family: 'Josefin Sans', sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      cursor: pointer;
      padding: 0;
      text-transform: uppercase;
      text-align: left;
    }
    .cca-back-btn:hover { text-decoration: underline; }

    @media (max-width: 400px) {
      #cca-chat-panel { width: calc(100vw - 32px); right: 16px; }
      #cca-chat-btn { right: 16px; bottom: 20px; }
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'cca-chat-btn';
  btn.setAttribute('aria-label', 'Ask a question');
  btn.innerHTML = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13" cy="11" r="8" stroke="${WHITE}" stroke-width="2"/>
    <path d="M9 15 L13 22 L17 15" stroke="${WHITE}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="10" cy="11" r="1.2" fill="${YELLOW}"/>
    <circle cx="13" cy="11" r="1.2" fill="${YELLOW}"/>
    <circle cx="16" cy="11" r="1.2" fill="${YELLOW}"/>
  </svg>`;
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.id = 'cca-chat-panel';
  panel.innerHTML = `
    <div id="cca-chat-header">
      <span>Ask CCA</span>
      <button id="cca-chat-close" aria-label="Close">&#x2715;</button>
    </div>
    <div id="cca-chat-body">
      <div class="cca-questions-wrap">
        <p class="cca-intro">Select a question and get an instant answer.</p>
        ${QA.map((item, i) => `<button class="cca-q-btn" data-idx="${i}">${item.q}</button>`).join('')}
      </div>
      <div class="cca-answer-wrap" id="cca-answer-wrap">
        <button class="cca-back-btn" id="cca-back-btn">&#8592; Back</button>
        <div class="cca-answer-text" id="cca-answer-text"></div>
        <a class="cca-waitlist-btn" href="${WAITLIST_URL}" target="_blank">Add me to the waitlist</a>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  const questionsWrap = panel.querySelector('.cca-questions-wrap');
  const answerWrap = panel.querySelector('#cca-answer-wrap');
  const answerText = panel.querySelector('#cca-answer-text');
  const backBtn = panel.querySelector('#cca-back-btn');
  const closeBtn = panel.querySelector('#cca-chat-close');

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
    showQuestions();
  });

  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  panel.querySelectorAll('.cca-q-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const idx = parseInt(b.dataset.idx, 10);
      answerText.textContent = QA[idx].a;
      questionsWrap.style.display = 'none';
      answerWrap.classList.add('visible');
    });
  });

  backBtn.addEventListener('click', showQuestions);

  function showQuestions() {
    questionsWrap.style.display = '';
    answerWrap.classList.remove('visible');
    answerText.textContent = '';
  }
})();