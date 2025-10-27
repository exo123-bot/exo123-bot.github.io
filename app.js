// Toggle nav (mobile)
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Tahun otomatis di footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Form sederhana + validasi
const form = document.getElementById('earlyAccessForm');
const formMsg = document.getElementById('formMsg');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    if (!data.name || !validateEmail(data.email) || !form.agree.checked) {
      formMsg.hidden = false;
      formMsg.textContent = 'Lengkapi nama, email valid, dan centang persetujuan.';
      formMsg.style.color = '#ffb4c0';
      return;
    }
    try {
      await new Promise(r => setTimeout(r, 700)); // simulasi submit
      form.reset();
      formMsg.hidden = false;
      formMsg.textContent = 'Berhasil daftar! Cek email kamu untuk konfirmasi.';
      formMsg.style.color = '#9effc6';
    } catch {
      formMsg.hidden = false;
      formMsg.textContent = 'Terjadi masalah. Coba lagi nanti.';
      formMsg.style.color = '#ffb4c0';
    }
  });
}

// Smooth anchor scroll + fokus aksesibilitas
if ('scrollBehavior' in document.documentElement.style) {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({behavior: 'smooth', block:'start'});
        el.setAttribute('tabindex', '-1');
        el.focus({preventScroll:true});
      }
    });
  });
}

// Event tracking ringan (opsional)
window.nxTrack = (event, meta = {}) => console.debug('[NX-TRACK]', event, meta);
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('click', ()=> window.nxTrack('btn_click', {text: btn.textContent.trim()}));
});

// === Slider Testimoni (viewport + min-width fix) ===
const tViewport = document.querySelector('.t-viewport');
const tTrack = document.querySelector('.t-track');
const tCards = document.querySelectorAll('.t-card');
const tNext = document.querySelector('.t-next');
const tPrev = document.querySelector('.t-prev');
let tIndex = 0, tTimer;

function showSlide(i){
  if (!tTrack) return;
  tIndex = (i + tCards.length) % tCards.length;
  tTrack.style.transform = `translateX(-${tIndex * 100}%)`;
  tCards.forEach((c,idx)=> c.classList.toggle('active', idx===tIndex));
}
function startAuto(){ tTimer = setInterval(()=> showSlide(tIndex + 1), 5000); }
function stopAuto(){ clearInterval(tTimer); }

tNext?.addEventListener('click', ()=>{ stopAuto(); showSlide(tIndex + 1); startAuto(); });
tPrev?.addEventListener('click', ()=>{ stopAuto(); showSlide(tIndex - 1); startAuto(); });
tViewport?.addEventListener('mouseenter', stopAuto);
tViewport?.addEventListener('mouseleave', startAuto);

if (tTrack) startAuto();
