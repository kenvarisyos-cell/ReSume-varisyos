// Public copy of ui-theme.js — copied from backend/public
(function(){
  const REPL = [
    {from: /rgba\(179,\s*131,\s*26\s*,/g, to: 'rgba(var(--primary-rgb),'},
    {from: /rgba\(138,\s*100,\s*16\s*,/g, to: 'rgba(var(--primary2-rgb),'},
    {from: /rgba\(201,\s*166,\s*74\s*,/g, to: 'rgba(var(--gold-rgb),'},
    {from: /#b3831a/g, to: 'var(--primary)'},
    {from: /#8a6410/g, to: 'var(--primary2)'},
    {from: /#c9a64a/g, to: 'var(--gold)'}
  ];
  function safePatchSheet(sheet){
    try{
      if(!sheet || !sheet.cssRules) return;
      const owner = sheet.ownerNode;
      if(owner && owner.tagName && owner.tagName.toLowerCase() === 'link' && owner.href){
        try{ if(new URL(owner.href).origin !== location.origin) return; }catch(e){ return; }
      }
      for(let i=0;i<sheet.cssRules.length;i++){
        try{
          const rule = sheet.cssRules[i]; if(!rule||!rule.cssText) continue; let txt = rule.cssText; let changed=false;
          REPL.forEach(r=>{ if(r.from.test(txt)){ txt = txt.replace(r.from, r.to); changed=true; r.from.lastIndex=0;} });
          if(changed){ try{ sheet.deleteRule(i); sheet.insertRule(txt,i); }catch(e){ try{ if(rule.style&&typeof rule.style.cssText==='string'){ rule.style.cssText = rule.style.cssText.replace(/rgba\(179,\s*131,\s*26\s*,/g,'rgba(var(--primary-rgb),'); } }catch(e2){} } }
        }catch(e){}
      }
    }catch(e){}
  }
  function runPatch(){ try{ for(const sheet of Array.from(document.styleSheets)){ safePatchSheet(sheet); } }catch(e){}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', runPatch); else runPatch(); window.NTB_UI_THEME_PATCH = runPatch;
})();

  /* Experimental nav/init enhancements for public site */
  (function(){
    function initNav(){
      try{
        var nav = document.querySelector('.nt-navbar, header.topbar');
        if(!nav) nav = document.querySelector('header.topbar');
        if(!nav) return;
        // add floating underline activation on scroll/active
        var links = nav.querySelectorAll('.nav-link, .nav a');
        links.forEach(function(a){ a.addEventListener('click', function(){ links.forEach(l=>l.classList.remove('active')); a.classList.add('active'); }); });

        // cursor glow
        var glow = document.getElementById('cursorGlow') || document.createElement('div');
        glow.id = 'cursorGlow'; glow.className = 'cursor-glow'; document.body.appendChild(glow);
        document.addEventListener('mousemove', function(e){ glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

        // subtle tilt on brand
        var brand = nav.querySelector('.navbar-brand, .brand');
        if(brand && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
          brand.addEventListener('mousemove', function(ev){ var r=brand.getBoundingClientRect(); var x=(ev.clientX-r.left)/r.width-.5; brand.style.transform = 'perspective(800px) rotateY('+(x*6)+'deg) translateZ(4px)'; });
          brand.addEventListener('mouseleave', function(){ brand.style.transform=''; });
        }
      }catch(e){}
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initNav); else initNav();
  })();
