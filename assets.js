document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================
     1. تشغيل الموسيقى تلقائياً عند أول تفاعل أو دخول للمستخدم
  ========================================================== */
  const music = document.getElementById("siteMusic");
  const musicBtn = document.querySelector(".music-btn");

  if (music) {
    music.volume = 0.4;
    // محاولة التشغيل التلقائي
    const playPromise = music.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // إذا حظر المتصفح التشغيل التلقائي، سيعمل مع أول تفاعل
        const startMusicOnClick = () => {
          music.play();
          if (musicBtn) musicBtn.classList.add("playing");
          document.removeEventListener("click", startMusicOnClick);
        };
        document.addEventListener("click", startMusicOnClick);
      });
    }

    if (musicBtn) {
      musicBtn.addEventListener("click", () => {
        if (music.paused) {
          music.play();
          musicBtn.classList.add("playing");
          showToast("تم تشغيل الموسيقى");
        } else {
          music.pause();
          musicBtn.classList.remove("playing");
          showToast("تم إيقاف الموسيقى");
        }
      });
    }
  }

  /* ==========================================================
     2. Google Ads Conversion Tracking (تتبع الإحالات الناجحة)
  ========================================================== */
  const GOOGLE_ADS_CONVERSION = "AW-18442009007/-abFCNbRv_McEK_z6tlE";

  function reportConversion() {
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        "send_to": GOOGLE_ADS_CONVERSION
      });
    }
  }

  /* ==========================================================
     3. تحويل النماذج إلى رسائل واتساب (بدون قاعدة بيانات)
  ========================================================== */
  const companyPhone = "966567588648"; // رقم الواتساب الخاص بالشركة

  // نموذج الحجز العام / المسافر
  document.querySelectorAll("form[data-demo-submit], form[data-search-whatsapp], form[data-whatsapp-form]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      let message = "السلام عليكم، أرغب في حجز خدمة جديدة من موقع القنصل:\n";
      const inputs = form.querySelectorAll("input, select, textarea");
      
      inputs.forEach(input => {
        if (input.value && input.type !== "submit" && input.type !== "checkbox") {
          const label = input.previousElementSibling ? input.previousElementSibling.innerText : (input.name || "حقل");
          message += `- ${label}: ${input.value}\n`;
        }
      });

      // تفعيل تتبع الإحالة الناجحة لإعلانات جوجل عند الإرسال
      reportConversion();

      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/${companyPhone}?text=${encodedMsg}`, "_blank");
    });
  });

  // أزرار الواتساب العائمة والروابط
  document.querySelectorAll("a[data-wa]").forEach(a => {
    a.href = `https://wa.me/${companyPhone}?text=` + encodeURIComponent("مرحباً، أرغب في الاستفسار عن خدمات السفر والسياحة من القنصل.");
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ==========================================================
     4. تأثيرات الأنيميشن القوية عند التمرير (Intersection Observer)
  ========================================================== */
  const reveals = document.querySelectorAll(".reveal, .service-card, .dest-card, .trust-card");
  
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(25px)";
      el.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
      observer.observe(el);
    });
  }

  // Toast Notifications Helper
  function showToast(text) {
    const toast = document.querySelector(".toast");
    if (toast) {
      toast.textContent = text;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
    }
  }

});