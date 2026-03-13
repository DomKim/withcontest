document.addEventListener('DOMContentLoaded', () => {

  // ── 카운트업 ──
  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const dur = 2000, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  // ── 접속자 실시간 ──
  const onlineEl = document.querySelector('#online-count') || document.querySelectorAll('.count-up')[0];
  if (onlineEl) {
    setInterval(() => {
      const v = 127 + Math.floor(Math.random() * 20) - 10;
      onlineEl.textContent = Math.max(80, v);
    }, 5000);
  }

  // ── A등급 슬라이더 ──
  const track = document.querySelector('.ad-a-track');
  const dots = document.querySelectorAll('.dot');
  if (track && dots.length) {
    let idx = 0;
    const go = (i) => { idx = i; track.style.transform = `translateX(-${i*100}%)`; dots.forEach((d,j) => d.classList.toggle('active', j===i)); };
    dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.i)));
    setInterval(() => go((idx + 1) % dots.length), 4000);
  }

  // ── 카테고리 바 ──
  document.querySelector('.cat-bar')?.addEventListener('click', e => {
    const btn = e.target.closest('.cat');
    if (!btn) return;
    document.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
  });

  // ── 필터 칩 ──
  document.querySelectorAll('.filter-row').forEach(row => {
    row.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      const chips = row.querySelectorAll('.chip');
      if (chip.textContent.trim() === '전체') {
        chips.forEach(c => c.classList.remove('on'));
        chip.classList.add('on');
      } else {
        chips[0].classList.remove('on');
        chip.classList.toggle('on');
        if (![...chips].slice(1).some(c => c.classList.contains('on'))) chips[0].classList.add('on');
      }
    });
  });

  // ── 월 탭 ──
  document.querySelector('.month-bar')?.addEventListener('click', e => {
    const btn = e.target.closest('.mo');
    if (!btn) return;
    document.querySelectorAll('.mo').forEach(m => m.classList.remove('active'));
    btn.classList.add('active');
  });

  // ── 캘린더 뷰 토글 ──
  const calList = document.getElementById('calList');
  const calGrid = document.getElementById('calGrid');
  document.querySelectorAll('.cal-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cal-view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.view === 'calendar') {
        calList?.classList.remove('show'); calList?.classList.add('hide');
        calGrid?.classList.add('show');
        buildCalendar(2026, 2); // 3월 (0-indexed)
      } else {
        calList?.classList.add('show'); calList?.classList.remove('hide');
        calGrid?.classList.remove('show');
      }
    });
  });

  // ── 달력 생성 ──
  const events = {
    '2026-3-15': { title: '춘천피아노콩쿨', cat: 'c-piano' },
    '2026-3-20': { title: '서울국제성악콩쿨', cat: 'c-vocal' },
    '2026-3-24': { title: '관현악 콩쿨', cat: 'c-orch' },
    '2026-3-28': { title: '미술대전 마감', cat: 'c-art' },
  };

  function buildCalendar(year, month) {
    const body = document.getElementById('calBody');
    if (!body) return;
    body.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const today = new Date();

    // 이전 달
    for (let i = firstDay - 1; i >= 0; i--) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell other';
      cell.innerHTML = `<span class="day-num">${prevDays - i}</span>`;
      body.appendChild(cell);
    }

    // 현재 달
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      const isToday = (today.getFullYear() === year && today.getMonth() === month && today.getDate() === d);
      if (isToday) cell.classList.add('today');

      let html = `<span class="day-num">${d}</span>`;
      const key = `${year}-${month+1}-${d}`;
      if (events[key]) {
        html += `<span class="cal-event ${events[key].cat}">${events[key].title}</span>`;
      }
      cell.innerHTML = html;
      body.appendChild(cell);
    }

    // 다음 달
    const totalCells = body.children.length;
    const remaining = (7 - totalCells % 7) % 7;
    for (let i = 1; i <= remaining; i++) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell other';
      cell.innerHTML = `<span class="day-num">${i}</span>`;
      body.appendChild(cell);
    }
  }

  // ── 통계 카운트업 ──
  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;
  const animateStats = () => {
    if (statsAnimated) return;
    const sec = document.querySelector('.stats');
    if (!sec) return;
    if (sec.getBoundingClientRect().top < window.innerHeight * 0.85) {
      statsAnimated = true;
      statNums.forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const dur = 1800, start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.floor((1 - Math.pow(1-p, 3)) * target).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }
  };
  window.addEventListener('scroll', animateStats, { passive: true });
  animateStats();

  // ── 모바일 검색 팝업 ──
  const searchBtn = document.querySelector('.mobile-search-btn');
  const searchOverlay = document.getElementById('mobileSearch');
  const searchClose = document.querySelector('.mobile-search-close');
  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('open');
      searchOverlay.querySelector('input')?.focus();
    });
    searchClose?.addEventListener('click', () => searchOverlay.classList.remove('open'));
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) searchOverlay.classList.remove('open');
    });
  }

  // ── 모바일 메뉴 ──
  const toggle = document.querySelector('.mobile-toggle');
  const gnb = document.querySelector('.gnb');
  if (toggle && gnb) {
    toggle.addEventListener('click', () => {
      const open = gnb.style.display === 'flex';
      Object.assign(gnb.style, {
        display: open ? '' : 'flex',
        flexDirection: 'column', position: 'absolute',
        top: '60px', left: '0', right: '0',
        background: '#fff', padding: open ? '' : '16px 24px',
        gap: '10px', borderBottom: open ? '' : '1px solid #e5e5e5',
        boxShadow: open ? '' : '0 4px 12px rgba(0,0,0,.08)',
        zIndex: '99'
      });
    });
  }

});
