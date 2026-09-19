
document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.QONSUL_CONFIG || {};
  const phone = String(cfg.whatsapp || "").replace(/\D/g,"");

  // Active navigation
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === current) a.classList.add("active");
  });

  // Mobile menu
  const menu = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if(menu && navLinks){
    menu.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.textContent = open ? "×" : "☰";
    });
    navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click",()=>navLinks.classList.remove("open")));
  }

  // Config-driven contact data
  document.querySelectorAll("[data-phone]").forEach(el => el.textContent = cfg.phone || "");
  document.querySelectorAll("[data-email]").forEach(el => el.textContent = cfg.email || "");
  document.querySelectorAll("[data-map]").forEach(el => {
    if(cfg.mapEmbed) el.src = cfg.mapEmbed;
  });
  document.querySelectorAll("[data-facebook]").forEach(a => {a.href=cfg.facebook||"#";a.target="_blank";a.rel="noopener";});
  document.querySelectorAll("[data-tiktok]").forEach(a => {a.href=cfg.tiktok||"#";a.target="_blank";a.rel="noopener";});
  document.querySelectorAll("[data-wa]").forEach(a => {
    const msg = a.dataset.message || "مرحباً، أرغب في الاستفسار عن خدمات السفر والسياحة من القنصل.";
    a.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    a.target="_blank"; a.rel="noopener";
  });

  // WhatsApp forms
  const forms = document.querySelectorAll("[data-whatsapp-form],[data-search-whatsapp],[data-demo-submit]");
  forms.forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      if(!phone){ showToast("أضف رقم واتساب الشركة في config.js"); return; }
      const fields = [...form.querySelectorAll("input,select,textarea")];
      const lines = [];
      const heading = form.dataset.messageTitle || "طلب جديد من موقع القنصل";
      lines.push(`*${heading}*`);
      fields.forEach(el => {
        if(!el.name || el.type === "submit" || el.type === "checkbox" || !el.value.trim()) return;
        const label = el.closest(".field")?.querySelector("label")?.innerText?.trim() || el.name;
        lines.push(`• ${label}: ${el.value.trim()}`);
      });
      const message = `السلام عليكم،\n${lines.join("\n")}\n\nأرجو مراجعة التوافر والسعر النهائي والتواصل معي للتأكيد.`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      try {
        if(typeof gtag === "function") gtag("event","conversion",{send_to:"AW-18442009007/-abFCNbRv_McEK_z6tlE"});
      } catch(_){}
      window.open(url,"_blank","noopener");
      showToast("تم تجهيز طلبك وفتح واتساب");
    });
  });

  // Music: never rely on blocked audible autoplay
  const music = document.getElementById("siteMusic");
  const musicBtn = document.querySelector(".music-btn");
  if(music){
    music.volume = .35;
    const saved = localStorage.getItem("qonsulMusic") === "on";
    if(saved){
      const start = () => music.play().then(()=>{
        musicBtn?.classList.add("playing");
        document.removeEventListener("pointerdown", start);
        document.removeEventListener("keydown", start);
      }).catch(()=>{});
      document.addEventListener("pointerdown", start, {once:true});
      document.addEventListener("keydown", start, {once:true});
    }
    musicBtn?.addEventListener("click", async () => {
      try{
        if(music.paused){
          await music.play();
          localStorage.setItem("qonsulMusic","on");
          musicBtn.classList.add("playing");
          showToast("تم تشغيل موسيقى القنصل");
        }else{
          music.pause();
          localStorage.setItem("qonsulMusic","off");
          musicBtn.classList.remove("playing");
          showToast("تم إيقاف الموسيقى");
        }
      }catch(_){ showToast("اضغط مرة أخرى لتشغيل الموسيقى"); }
    });
  }

  // Reveal animations
  const items = document.querySelectorAll(".reveal,.service-card,.dest-card,.trust-card,.flight-card,.hotel-card,.content-card");
  if("IntersectionObserver" in window){
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.style.opacity="1";
          entry.target.style.transform="translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08});
    items.forEach(el=>{
      el.style.opacity="0";
      el.style.transform="translateY(18px)";
      el.style.transition="opacity .55s ease,transform .55s ease";
      observer.observe(el);
    });
  }

  // Date sanity checks
  document.querySelectorAll('input[type="date"]').forEach(d=>{
    d.addEventListener("change",()=>{
      if(d.value && d.name === "departure") {
        document.querySelectorAll('input[name="return"],input[name="checkout"]').forEach(r=>{
          r.min = d.value;
          if(r.value && r.value < d.value) r.value = "";
        });
      }
    });
  });

  // Hide unavailable videos without leaving broken boxes
  document.querySelectorAll("video").forEach(v=>{
    v.addEventListener("error",()=>v.closest(".page-video,.footer-video-banner,.destination-video")?.classList.add("media-unavailable"),true);
  });

  function showToast(text){
    const toast=document.querySelector(".toast");
    if(!toast) return;
    toast.textContent=text; toast.classList.add("show");
    clearTimeout(window.__qonsulToast);
    window.__qonsulToast=setTimeout(()=>toast.classList.remove("show"),3000);
  }
});
