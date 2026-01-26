(function () {
  console.log("🚀 Modum Partner Modülü Başlatılıyor...");

  // AYARLAR
  var API_URL = "https://api-hjen5442oq-uc.a.run.app"; // Senin API adresin

  // 1. KULLANICIYI TESPİT ET (Faprika'dan)
  function detectUser() {
    // Önce Cache'e bak (modum-client.js zaten bulmuş olabilir)
    var cached = JSON.parse(localStorage.getItem("mdm_user_cache"));
    if (cached && cached.email) return cached.email;

    // Yoksa sayfadan bul
    var inputs = ['input[name="Email"]', "#Email", "#MemberEmail"];
    for (var i = 0; i < inputs.length; i++) {
      var el = document.querySelector(inputs[i]);
      if (el && el.value && el.value.includes("@")) return el.value.trim();
    }
    return null;
  }

  // 2. ORTAKLIK KONTROLÜ VE BUTON ÇİZİMİ
  async function initPartnerSystem() {
    var email = detectUser();

    // Eğer kullanıcı giriş yapmamışsa partner sistemini hiç yükleme
    if (!email) {
      console.log("❌ Partner Modülü: Kullanıcı girişi yok, durduruldu.");
      return;
    }

    console.log("🔍 Partner Kontrolü Yapılıyor: " + email);

    // Backend'e sor: "Bu kişi partner mi?"
    // Not: Bu fonksiyonu backend'e eklemediysek, şimdilik manuel test için
    // sadece senin mailinle çalışacak şekilde frontend hilesi yapıyorum.
    // Backend güncellenince burayı API'ye bağlayacağız.

    // 🔥 TEST İÇİN: Kendi email adresini buraya yaz ki butonu gör
    // Gerçek sistemde burası API'den gelecek cevaba göre çalışacak.
    var adminEmails = ["info@modum.tr",];

    // API SORGUSU SİMÜLASYONU (Şimdilik)
    // İleride: const res = await fetch(API_URL, ... {islem: 'check_partner_status'})
    var isPartner =
      adminEmails.includes(email) ||
      localStorage.getItem("mdm_is_partner") === "true";

    if (isPartner) {
      console.log("✅ ORTAK TESPİT EDİLDİ! Buton ekleniyor...");
      renderPartnerButton();
    } else {
      console.log("ℹ️ Bu kullanıcı bir ortak değil.");
    }
  }

  // 3. BUTONU ÇİZEN FONKSİYON
  function renderPartnerButton() {
    // Varsa eskisini sil
    var oldBtn = document.getElementById("mdm-partner-btn");
    if (oldBtn) oldBtn.remove();

    var btn = document.createElement("div");
    btn.id = "mdm-partner-btn";
    btn.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:16px;">👑</span>
        <span style="font-weight:bold; font-family:sans-serif; font-size:12px;">ORTAK PANELİ</span>
      </div>
    `;

    // CSS Stilleri (Altın Sarısı Buton - Sol Orta)
    Object.assign(btn.style, {
      position: "fixed",
      left: "20px",
      bottom: "100px", // Chat butonlarının üstünde dursun
      zIndex: "999999",
      background: "linear-gradient(135deg, #fbbf24, #d97706)",
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "50px",
      boxShadow: "0 4px 15px rgba(251, 191, 36, 0.5)",
      cursor: "pointer",
      transition: "transform 0.2s",
      border: "2px solid #fff",
    });

    // Hover Efekti
    btn.onmouseover = function () {
      this.style.transform = "scale(1.05)";
    };
    btn.onmouseout = function () {
      this.style.transform = "scale(1)";
    };

    // Tıklama Olayı (Şimdilik sadece test uyarısı)
    btn.onclick = function () {
      alert(
        "🚀 Partner Paneli Yakında Açılıyor!\nBurada gelirlerini, linklerini ve performansını göreceksin.",
      );
    };

    document.body.appendChild(btn);
  }

  // 4. BAŞLAT
  // Sayfa tam yüklensin diye 2 saniye bekle
  setTimeout(initPartnerSystem, 2000);
})();
