// Shared by every static demo: a corner badge, and a short notice in place of a dead link or a form
// that would need the real server. Nothing on these pages sends data anywhere.
(() => {
  const me = document.currentScript;
  const badge = document.createElement('div');
  badge.className = 'demo-badge';
  badge.textContent = (me && me.dataset.label) || 'DEMO';
  document.body.appendChild(badge);

  let toast, timer;
  const say = msg => {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'demo-toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 2400);
  };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-demo-off]');
    if (el && el.tagName !== 'FORM') {
      e.preventDefault();
      e.stopPropagation();
      say('หน้านี้ไม่ได้รวมไว้ใน demo');
    }
  }, true);

  // images whose source is gone (dead hot-links in the original content): a calm placeholder, not a broken icon
  const PH = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="#eceff3"/><g fill="none" stroke="#a3acb9" stroke-width="6" stroke-linejoin="round"><rect x="150" y="100" width="100" height="80" rx="8"/><path d="M160 170l25-28 20 20 15-14 20 22"/></g><circle cx="222" cy="123" r="8" fill="#a3acb9"/><text x="200" y="214" text-anchor="middle" font-family="sans-serif" font-size="17" fill="#7b8594">รูปต้นฉบับโหลดไม่ได้</text></svg>');
  const patch = img => {
    if (img.dataset.demoPh) return;
    img.dataset.demoPh = '1';
    img.removeAttribute('srcset');
    img.src = PH;
  };
  document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src') || '';
    if (src && !/\.svg($|\?)/i.test(src) && img.complete && img.naturalWidth === 0) patch(img);
  });
  document.addEventListener('error', e => { if (e.target.tagName === 'IMG') patch(e.target); }, true);

  document.addEventListener('submit', e => {
    const f = e.target;
    e.preventDefault();
    e.stopPropagation();
    if (f.dataset.demoGo) { location.href = f.dataset.demoGo; return; }
    say('ฟอร์มนี้ปิดไว้ใน demo ไม่มีการส่งข้อมูล');
  }, true);
})();
