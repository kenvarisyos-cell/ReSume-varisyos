/* เว็บบริษัท (ทุกหน้า) — ชั้นเอฟเฟคเพิ่ม (2026-10-08) · คู่กับ assets/site-fx.css · โหลดจาก inc/foot.php และ en/_layout.php
   แถบความคืบหน้า · ปุ่มกลับขึ้นบน · ประกายทองในหัวหน้า · โลโก้ลอยตามเมาส์ · พื้นหลังหัวหน้าเลื่อนช้า
   · แสงวาบบนรูปการ์ด · เส้นแสงสแกนบนวิดีโอ · รูปจางเข้าเมื่อโหลดเสร็จ · ประกายตอนคลิก
   ไม่แตะเนื้อหาเดิม — แค่เพิ่ม element ตกแต่ง (aria-hidden) */
(function () {
  'use strict';
  if (window.__NT_SITE_FX__) return;
  window.__NT_SITE_FX__ = true;
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function el(tag, cls, parent) { var e = document.createElement(tag); e.className = cls; e.setAttribute('aria-hidden', 'true'); if (parent) parent.appendChild(e); return e; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  // 1 · แถบความคืบหน้า + ปุ่มกลับขึ้นบน (วงแหวนตามระยะที่เลื่อน)
  var bar = el('div', 'fx-progress', document.body);
  var top = document.createElement('button');
  top.type = 'button'; top.className = 'fx-top';
  top.setAttribute('aria-label', root.lang === 'en' ? 'Back to top' : 'กลับขึ้นด้านบน');
  top.innerHTML = '<svg viewBox="0 0 50 50" aria-hidden="true"><circle class="tr" cx="25" cy="25" r="22"/><circle class="pg" cx="25" cy="25" r="22"/></svg><i class="bi bi-arrow-up" aria-hidden="true"></i>';
  top.addEventListener('click', function () {
    if (window.NTIBuzzSmoothScroll && window.NTIBuzzSmoothScroll.scrollTo) window.NTIBuzzSmoothScroll.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
  document.body.appendChild(top);

  var head = document.querySelector('.hero, .phero');
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY || root.scrollTop, max = Math.max(1, root.scrollHeight - window.innerHeight);
      var p = Math.min(1, y / max).toFixed(4);
      bar.style.setProperty('--p', p);
      top.style.setProperty('--p', p);
      top.classList.toggle('show', y > 640);
      // พื้นหลังหัวหน้าเลื่อนช้ากว่าหน้า — เฉพาะจอที่มีเมาส์ (2026-10-14: บนจอสัมผัส ตั้งค่า --hs ทุกเฟรมที่เลื่อน = ทั้ง hero คำนวณสไตล์ใหม่
      //   + ภาพพื้นหลังที่ผสมสี overlay ต้องผสมใหม่ทุกเฟรม → เสี่ยงกระพริบบน Android)
      if (head && fine && !reduce && y < head.offsetHeight + 200) head.style.setProperty('--hs', (y * 0.32).toFixed(1));
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // 2 · รูปที่ยังโหลดไม่เสร็จ → ค่อย ๆ จางเข้า (รูปที่โหลดแล้วไม่แตะ · โหลดพัง/ช้าเกิน 4 วิ ก็แสดงเลย)
  if (!reduce) {
    document.querySelectorAll('main img, section img, .container img').forEach(function (img) {
      if (img.complete || img.closest('.nt-navbar, .ft, .nt-chat, .marquee')) return;
      img.classList.add('fx-img');
      var show = function () { img.classList.add('fx-in'); };
      img.addEventListener('load', show, { once: true });
      img.addEventListener('error', show, { once: true });
      setTimeout(show, 4000);
    });
  }

  if (reduce) return;   // ที่เหลือเป็นเอฟเฟคเคลื่อนไหวล้วน

  // 3 · ประกายทองลอยขึ้นในหัวหน้า (หน้าแรกเยอะกว่า)
  if (head) {
    var box = el('div', 'fx-sparks', null);
    head.insertBefore(box, head.firstChild);
    var isHome = head.classList.contains('hero');
    var count = window.innerWidth < 768 ? (isHome ? 12 : 7) : (isHome ? 22 : 12);
    for (var i = 0; i < count; i++) {
      var s = el('span', 'fx-spark', box);
      s.style.setProperty('--x', rnd(2, 98).toFixed(1) + '%');
      s.style.setProperty('--s', rnd(3, 8).toFixed(1) + 'px');
      s.style.setProperty('--d', rnd(isHome ? 7 : 6, isHome ? 15 : 11).toFixed(1) + 's');
      s.style.setProperty('--dl', (-rnd(0, 15)).toFixed(1) + 's');
      s.style.setProperty('--dx', rnd(-60, 60).toFixed(0) + 'px');
    }
    // โลโก้กลางหน้าแรกลอยตามเมาส์ (คนละทิศกับเมาส์ ให้ดูมีมิติ)
    var emblem = head.querySelector('.hero-emblem');
    if (emblem && fine) {
      head.addEventListener('mousemove', function (e) {
        var r = head.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        emblem.style.setProperty('--ex', (-x * 26).toFixed(1) + 'px');
        emblem.style.setProperty('--ey', (-y * 20).toFixed(1) + 'px');
      });
      head.addEventListener('mouseleave', function () { emblem.style.setProperty('--ex', '0px'); emblem.style.setProperty('--ey', '0px'); });
    }
  }

  // 4 · แสงวาบบนรูปการ์ด (หน้าแรก/บริการ/ข่าว/เกี่ยวกับเรา)
  document.querySelectorAll('.prod-cover, .news .thumb, .svc-media, .svc-cover, .vm-media').forEach(function (c) {
    if (getComputedStyle(c).position === 'static') c.style.position = 'relative';
    el('i', 'fx-shine', c);
  });

  // 5 · เส้นแสงสแกนบนวิดีโอ
  document.querySelectorAll('.vframe').forEach(function (v) { el('i', 'fx-scan', v); });

  // 6 · ประกายทองแตกออกตรงจุดที่คลิก (ไม่ทำในช่องกรอก/แชท)
  document.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 || (e.target.closest && e.target.closest('input, textarea, select, .nt-chat'))) return;
    for (var n = 0; n < 9; n++) {
      var b = el('i', 'fx-burst', document.body);
      var a = (Math.PI * 2 * n) / 9 + rnd(-.3, .3), d = rnd(26, 52);
      b.style.left = e.clientX + 'px'; b.style.top = e.clientY + 'px';
      b.style.setProperty('--bx', (Math.cos(a) * d).toFixed(1) + 'px');
      b.style.setProperty('--by', (Math.sin(a) * d).toFixed(1) + 'px');
      setTimeout(function (x) { return function () { x.remove(); }; }(b), 760);
    }
  });
})();
