/**
 * 👑 MODUM PARTNER PRO (Influencer Hub)
 * v3.1 - Tier Bilgilendirme Sistemi ve Gelişmiş Arayüz
 */

(function () {
  console.log("🚀 Modum Partner Pro (v3.1) Başlatılıyor...");
  window.PartnerApp = window.PartnerApp || {};

  // AYARLAR
  var API_URL = "https://api-hjen5442oq-uc.a.run.app";

  // --- CHART.JS YÜKLE ---
  if (typeof Chart === "undefined") {
    let script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    document.head.appendChild(script);
  }
  // --- PDF KÜTÜPHANESİ YÜKLE (jsPDF) ---
  if (typeof jspdf === "undefined") {
    let s1 = document.createElement("script");
    s1.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    document.head.appendChild(s1);

    let s2 = document.createElement("script");
    s2.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js";
    document.head.appendChild(s2);
  }

  // --- KULLANICI TESPİTİ ---
  function detectUser() {
    var cached = JSON.parse(localStorage.getItem("mdm_user_cache"));
    if (cached && cached.email) return cached.email;

    var inputs = ['input[name="Email"]', "#Email", "#MemberEmail"];
    for (var i = 0; i < inputs.length; i++) {
      var el = document.querySelector(inputs[i]);
      if (el && el.value && el.value.includes("@")) return el.value.trim();
    }
    return null;
  }

  // --- BAŞLATICI (API'den Gerçek Veriyi Çeker) ---
  async function initPartnerSystem() {
    var email = detectUser();
    if (!email) return; // Giriş yapmamışsa hiçbir şey gösterme

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ islem: "get_partner_stats", email: email }),
      });
      const res = await response.json();

      if (res.success && res.stats) {
        window.PartnerData = res.stats;

        // 1. Yuvarlak Paneli Butonunu Göster
        renderPartnerButton();

        // 2. 🔥 YENİ: Tepedeki Hızlı Link Çubuğunu Göster
        renderSiteStripe();
      }
    } catch (e) {
      console.log("Partner kontrol hatası:", e);
    }
  } // ============================================================
  // 🛒 MÜŞTERİ KOLEKSİYON GÖRÜNTÜLEYİCİ (INFLUENCER VİTRİNİ)
  // ============================================================

  async function checkCustomerCollectionLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const collectionRef = urlParams.get("koleksiyon"); // Link: ?koleksiyon=REF123

    if (collectionRef) {
      // 1. Referansı Tarayıcıya Kaydet (Satış olursa bu kişiye yazsın)
      localStorage.setItem("mdm_affiliate_ref", collectionRef);
      console.log("🛒 Koleksiyon modu aktif: " + collectionRef);

      // 2. Veriyi Çek
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            islem: "get_public_collection",
            refCode: collectionRef,
          }),
        }).then((r) => r.json());

        if (res.success) {
          // renderFullPageStore yerine yeni tasarımı çağırıyoruz:
          renderFullPageStore(
            document.body,
            {
              // Container olarak body gönderiyoruz
              partnerName: res.partnerName,
              products: res.products,
            },
            collectionRef,
          );
        }
      } catch (e) {
        console.log("Koleksiyon yüklenemedi:", e);
      }
    }
  }

  // Fonksiyonu çalıştır (Sayfa açılınca URL kontrolü yap)
  checkCustomerCollectionLink();

  // --- SOL BUTON (RESPONSIVE & DİKEY TASARIM) ---
  function renderPartnerButton() {
    var oldBtn = document.getElementById("mdm-partner-btn");
    if (oldBtn) oldBtn.remove();

    // CSS Stillerini JS içine gömüyoruz (Media Query için)
    var style = document.createElement("style");
    style.innerHTML = `
      #mdm-partner-btn {
          position: fixed;
          z-index: 999999;
          background: #0f172a;
          color: #fbbf24;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          border: 1px solid #fbbf24;
          display: flex;
          align-items: center;
          justify-content: center;
      }

      /* --- MASAÜSTÜ GÖRÜNÜMÜ (DİKEY SEKME) --- */
      @media (min-width: 769px) {
          #mdm-partner-btn {
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 40px;
              height: 140px;
              border-radius: 0 12px 12px 0;
              writing-mode: vertical-rl;
              text-orientation: mixed;
              padding: 10px 0;
              font-family: 'Inter', sans-serif;
              font-weight: 800;
              font-size: 12px;
              letter-spacing: 1px;
          }
          #mdm-partner-btn:hover {
              width: 50px; /* Üzerine gelince biraz genişlesin */
              background: #1e293b;
          }
          #mdm-partner-btn span.icon {
              margin-bottom: 10px;
              font-size: 20px;
              transform: rotate(90deg); /* İkonu düzelt */
          }
          #mdm-partner-btn span.text {
              transform: rotate(180deg); /* Yazıyı aşağıdan yukarı okut */
          }
      }

      /* --- MOBİL GÖRÜNÜM (KÜÇÜK YUVARLAK) --- */
      @media (max-width: 768px) {
          #mdm-partner-btn {
              left: 15px;
              bottom: 150px; /* WhatsApp butonunun üstünde kalsın */
              width: 50px;
              height: 50px;
              border-radius: 50%;
              padding: 0;
          }
          #mdm-partner-btn span.text {
              display: none; /* Mobilde yazıyı gizle */
          }
          #mdm-partner-btn span.icon {
              font-size: 24px;
          }
          #mdm-partner-btn:active {
              transform: scale(0.9);
          }
      }
  `;
    document.head.appendChild(style);

    var btn = document.createElement("div");
    btn.id = "mdm-partner-btn";

    // İçerik: İkon ve Yazı
    btn.innerHTML = `
      <span class="icon">👑</span>
      <span class="text">ORTAK PANELİ</span>
  `;

    btn.onclick = function () {
      openPartnerDashboard();
    };
    document.body.appendChild(btn);
  }

  // --- DASHBOARD ARAYÜZÜ (FULL SCREEN / OFİS MODU v4.0) ---
  function openPartnerDashboard() {
    var old = document.getElementById("mdm-partner-modal");
    if (old) old.remove();

    // Arka planı kilitle (Scroll engelle)
    document.body.style.overflow = "hidden";

    // Verileri Hafızadan Al
    var pData = window.PartnerData || {};
    var name = pData.name || "Ortak";
    var myRefCode = pData.refCode || "Henüz Kod Oluşmadı";

    var css = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

/* --- 1. ANA KAPLAYICI (FULL SCREEN) --- */
.p-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: #0f172a; /* Arkadaki siteyi tamamen kapatan koyu renk */
    z-index: 2147483647; /* En, en üstte */
    display: flex; justify-content: center; align-items: center;
    font-family: 'Inter', sans-serif;
    animation: fadeInApp 0.3s ease-out forwards;
}

/* --- 2. UYGULAMA İSKELETİ --- */
.p-app {
    width: 100%; height: 100%; 
    background: #f8fafc; /* Ofis zemin rengi */
    position: relative; display: flex; flex-direction: row; overflow: hidden;
}

/* Animasyonlar */
@keyframes fadeInApp {
    from { opacity: 0; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1); }
}

/* --- 3. SIDEBAR (SOL MENÜ) - OFİSİN SOL KANADI --- */
.p-nav {
  width: 260px; /* PC'de geniş ve ferah */
  height: 100%;
  background: #0f172a; /* Koyu Lacivert/Siyah */
  border-right: 1px solid #1e293b;
  display: flex; flex-direction: column;
  padding: 20px 0; gap: 5px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  box-shadow: 4px 0 20px rgba(0,0,0,0.2);
}

/* Mobilde Sidebar (Gizli Başlar) */
@media (max-width: 768px) {
  .p-nav { 
      position: absolute; left: -100%; top: 0; bottom: 0; width: 280px; 
      transition: left 0.3s ease;
  }
  .p-nav.mobile-open { left: 0; } /* Açılınca gelir */
}

/* Menü İçi */
.p-nav-logo { 
    height: 60px; display: flex; align-items: center; padding-left: 25px;
    color: white; font-size: 18px; font-weight: 800; letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 10px;
    gap: 10px;
}

.p-nav-item { 
  height: 48px; display: flex; align-items: center; 
  color: #94a3b8; cursor: pointer; transition: 0.2s;
  text-decoration: none; padding: 0 25px;
  font-size: 14px; font-weight: 500;
  border-left: 3px solid transparent; /* Sol çizgi efekti */
}

.p-nav-item:hover { 
    background: rgba(255,255,255,0.03); color: #e2e8f0; 
    padding-left: 30px; /* Hoverda hafif sağa kayma */
}

.p-nav-item.active { 
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 100%); 
    color: #60a5fa; 
    border-left-color: #3b82f6; 
}

.p-nav-icon { width: 24px; text-align: center; font-size: 16px; margin-right: 12px; }
.p-nav-text { white-space: nowrap; }

/* PC Toggle Butonu (İsteğe bağlı küçültme için) */
.p-toggle-btn { 
  display:none; /* Tam ekran modunda sidebar sabit kalsın, gerekirse açarız */
}

/* --- 4. HEADER VE İÇERİK ALANI --- */
.p-content-wrapper { 
    flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; width: 100%; 
    background: #f8fafc;
}

.p-header { 
  height: 70px; background: white; border-bottom: 1px solid #e2e8f0; 
  display: flex; align-items: center; justify-content: space-between; padding: 0 30px; 
  flex-shrink: 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  z-index: 40;
}

.p-body { 
    flex: 1; overflow-y: auto; padding: 30px; 
    padding-bottom: 100px; /* Mobilde butonlar için boşluk */
    scroll-behavior: smooth;
}

/* Mobil Hamburger Menü Butonu */
.mobile-menu-btn { display: none; font-size: 20px; color: #334155; cursor: pointer; padding: 10px; background: #f1f5f9; border-radius: 8px; margin-right: 15px; }
@media (max-width: 768px) { 
    .mobile-menu-btn { display: block; } 
    .p-header { padding: 0 15px; height: 60px; }
    .p-body { padding: 15px; }
}

/* Mobil Overlay (Menü açılınca arkaplanı karart) */
.mobile-nav-overlay {
  display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.8); z-index: 45; backdrop-filter: blur(2px);
  animation: fadeInOverlay 0.2s ease;
}
@keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
.p-nav.mobile-open + .p-content-wrapper .mobile-nav-overlay { display: block; }

/* --- 5. AKSİYON BUTONLARI (Header Sağ Taraf) --- */
.header-actions { display: flex; gap: 10px; align-items: center; }

.btn-smart {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 50px; cursor: pointer; transition: 0.2s;
    font-size: 12px; font-weight: 600; border: 1px solid transparent;
}
.btn-rates { background: #ecfdf5; color: #059669; border-color: #a7f3d0; }
.btn-rates:hover { background: #d1fae5; transform: translateY(-1px); }

.btn-bell { 
    width: 36px; height: 36px; border-radius: 50%; 
    background: #f1f5f9; color: #64748b; 
    display: flex; align-items: center; justify-content: center; cursor: pointer;
    transition: 0.2s; position: relative;
}
.btn-bell:hover { background: #e2e8f0; color: #3b82f6; }
.btn-bell-badge { position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid white; display: none; }

.btn-exit { 
    background: #fee2e2; color: #b91c1c; padding: 8px 16px; 
    border-radius: 8px; font-weight: bold; cursor: pointer; 
    display: flex; align-items: center; gap: 5px; font-size: 12px;
    transition: 0.2s; border: 1px solid #fecaca;
}
.btn-exit:hover { background: #fecaca; }

/* --- 6. GENEL ELEMENTLER --- */
.p-card { background: white; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02); transition: transform 0.2s; }
.p-stat-val { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
.p-stat-lbl { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
.p-btn { width: 100%; padding: 12px; border: none; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; }
.p-btn:active { transform: scale(0.98); }

/* Tablo Stilleri */
.tier-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
.tier-table th { text-align: left; color: #64748b; padding: 10px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600; }
.tier-table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #334155; }
.tier-table tr:last-child td { border-bottom: none; }

/* Scrollbar Güzelleştirme */
.p-body::-webkit-scrollbar { width: 6px; }
.p-body::-webkit-scrollbar-track { background: transparent; }
.p-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

</style>
`;

    var html = `
<div id="mdm-partner-modal" class="p-overlay">
${css}
<div class="p-app">
  
  <div id="p-nav-container" class="p-nav">
      <div class="p-nav-logo">
          <span style="font-size:24px;">👑</span>
          <div style="display:flex; flex-direction:column; line-height:1.1;">
              <span>MODUM</span>
              <span style="font-size:10px; opacity:0.6; font-weight:400;">PARTNER HUB</span>
          </div>
      </div>

      <div style="padding: 0 15px; margin-bottom: 10px;">
        <div style="font-size:10px; color:#64748b; font-weight:bold; margin-bottom:5px; padding-left:10px;">ANA MENÜ</div>
        
        <div class="p-nav-item active" onclick="PartnerApp.loadTab('home', this)">
            <div class="p-nav-icon"><i class="fas fa-home"></i></div>
            <span class="p-nav-text">Genel Bakış</span>
        </div>
        <div class="p-nav-item" onclick="PartnerApp.loadTab('tasks', this)">
            <div class="p-nav-icon"><i class="fas fa-bullseye"></i></div>
            <span class="p-nav-text">Görevler & Hedef</span>
        </div>
        <div class="p-nav-item" onclick="PartnerApp.loadTab('wallet', this)">
            <div class="p-nav-icon"><i class="fas fa-wallet"></i></div>
            <span class="p-nav-text">Finans Merkezi</span>
        </div>
      </div>

      <div style="padding: 0 15px;">
        <div style="font-size:10px; color:#64748b; font-weight:bold; margin-bottom:5px; padding-left:10px;">ARAÇLAR</div>
        
        <div class="p-nav-item" onclick="PartnerApp.loadTab('showcase', this)">
            <div class="p-nav-icon"><i class="fas fa-fire"></i></div>
            <span class="p-nav-text">Günün Fırsatları</span>
        </div>
        <div class="p-nav-item" onclick="PartnerApp.loadTab('my_collection', this)">
            <div class="p-nav-icon"><i class="fas fa-store"></i></div>
            <span class="p-nav-text">Mağazam</span>
        </div>
        <div class="p-nav-item" onclick="PartnerApp.loadTab('marketing', this)">
            <div class="p-nav-icon"><i class="fas fa-photo-video"></i></div>
            <span class="p-nav-text">Creative Studio</span>
        </div>
        <div class="p-nav-item" onclick="PartnerApp.loadTab('links', this)">
            <div class="p-nav-icon"><i class="fas fa-link"></i></div>
            <span class="p-nav-text">Link Oluşturucu</span>
        </div>
      </div>

      <div style="margin-top:auto; padding: 0 15px 20px;">
        <div class="p-nav-item" onclick="PartnerApp.loadTab('academy', this)">
            <div class="p-nav-icon"><i class="fas fa-graduation-cap"></i></div>
            <span class="p-nav-text">Akademi</span>
        </div>
        <div class="p-nav-item" onclick="PartnerApp.loadTab('profile', this)">
             <div class="p-nav-icon"><i class="fas fa-user-cog"></i></div>
             <span class="p-nav-text">Ayarlar</span>
        </div>
      </div>
  </div>

  <div class="p-content-wrapper">
      <div class="mobile-nav-overlay" onclick="PartnerApp.toggleSidebar()"></div>

      <div class="p-header">
          <div style="display:flex; align-items:center;">
              <div class="mobile-menu-btn" onclick="PartnerApp.toggleSidebar()">
                  <i class="fas fa-bars"></i>
              </div>
              <div>
                  <div style="font-weight:700; color:#1e293b; font-size:16px;">Hoş Geldin, ${name.split(" ")[0]} 👋</div>
                  <span style="font-size:11px; color:#64748b; display:block;">Partner Paneli v3.1</span>
              </div>
          </div>
          
          <div class="header-actions">
                <div class="btn-smart btn-rates" onclick="PartnerApp.showTierInfo()">
                  <i class="fas fa-crown"></i> <span style="display:none; @media(min-width:768px){display:inline;}">Oranlar</span>
              </div>
              
              <div class="btn-bell" onclick="PartnerApp.renderNotifications(document.getElementById('p-content-area'))">
                  <i class="fas fa-bell"></i>
                  <div class="btn-bell-badge"></div>
              </div>

              <div class="btn-exit" onclick="document.body.style.overflow='auto'; document.getElementById('mdm-partner-modal').remove()">
                 <i class="fas fa-sign-out-alt"></i> <span style="display:none; @media(min-width:768px){display:inline;}">Siteye Dön</span>
              </div>
          </div>
      </div>

      <div id="p-content-area" class="p-body"></div>
  </div>

</div>
</div>
`;

    document.body.insertAdjacentHTML("beforeend", html);

    // Açılışta Home sekmesini yükle
    var homeBtn = document.querySelector("#p-nav-container .p-nav-item");
    window.PartnerApp.loadTab("home", homeBtn);
  }
  // --- CANVAS YARDIMCISI: RESİM YÜKLEME ---
  // Bir görselin canvas'a çizilebilmesi için tamamen yüklenmiş olması gerekir.
  function loadCanvasImage(src) {
    return new Promise((resolve, reject) => {
      // 1. Resim linkindeki "https://" kısmını temizleyip temiz URL alalım
      let cleanUrl = src.replace(/^https?:\/\//, "");

      // 2. Güvenli Proxy Servisi (wsrv.nl) üzerinden geçir
      // Bu servis resmi alır, güvenlik izinlerini (CORS) ekler ve bize geri verir.
      // Ayrıca &w=800 diyerek resmi optimize ediyoruz, çok daha hızlı çalışır.
      const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&output=png&w=800&n=-1`;

      const img = new Image();
      img.crossOrigin = "Anonymous"; // Artık bu çalışacak çünkü proxy izin veriyor
      img.onload = () => resolve(img);
      img.onerror = (e) => {
        console.error("Resim yükleme hatası:", e);
        // Proxy başarısız olursa orijinali dene (Yedek plan)
        const backupImg = new Image();
        backupImg.crossOrigin = "Anonymous";
        backupImg.onload = () => resolve(backupImg);
        backupImg.onerror = () => reject(new Error("Resim yüklenemedi"));
        backupImg.src = src;
      };
      img.src = proxyUrl;
    });
  }

  // --- CANVAS YARDIMCISI: UZUN METİNLERİ SATIRLARA BÖLME ---
  // Canvas, uzun metinleri otomatik olarak alt satıra geçirmez. Bunu elle yapıyoruz.
  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(" ");
    var line = "";
    var currentY = y;

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + " ";
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, currentY);
    // Son satırın bittiği Y koordinatını döndür, belki altına bir şey çizeriz.
    return currentY + lineHeight;
  }
  window.PartnerApp = {
    toggleSidebar: function () {
      var sb = document.getElementById("p-nav-container");
      var icon = document.getElementById("p-toggle-icon");
      var isMobile = window.innerWidth <= 768;

      if (isMobile) {
        // Mobilde class 'mobile-open'
        if (sb.classList.contains("mobile-open")) {
          sb.classList.remove("mobile-open");
        } else {
          sb.classList.add("mobile-open");
        }
      } else {
        // PC'de class 'expanded'
        if (sb.classList.contains("expanded")) {
          sb.classList.remove("expanded");
          if (icon) icon.className = "fas fa-angle-double-right";
        } else {
          sb.classList.add("expanded");
          if (icon) icon.className = "fas fa-angle-double-left";
        }
      }
    },
    loadTab: function (tab, el) {
      document
        .querySelectorAll(".p-nav-item")
        .forEach((i) => i.classList.remove("active"));
      if (el) el.classList.add("active");

      var area = document.getElementById("p-content-area");
      area.innerHTML =
        '<div style="text-align:center; padding:50px; color:#94a3b8;"><i class="fas fa-circle-notch fa-spin" style="font-size:30px;"></i></div>';

      setTimeout(() => {
        if (tab === "home") this.renderHome(area);
        if (tab === "links") this.renderLinks(area);
        if (tab === "wallet") this.renderWallet(area);
        if (tab === "marketing") this.renderMarketing(area);
        if (tab === "academy") this.renderAcademy(area);
        if (tab === "showcase") this.renderShowcase(area);
        if (tab === "tasks") this.renderTasks(area);
        if (tab === "my_collection") this.renderMyCollection(area);
        if (tab === "profile") this.renderProfile(area);
      }, 300);
    },

    // 🔥 YENİ: SEVİYE BİLGİ PENCERESİ (Z-INDEX DÜZELTİLDİ)
    showTierInfo: function () {
      let infoHtml = `
<div id="p-tier-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:2147483647; display:flex; justify-content:center; align-items:center; padding:20px;">
  <div style="background:white; width:100%; max-width:350px; border-radius:16px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.5);">
      <div style="padding:20px; background:#0f172a; color:white; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:16px;">💎 Kazanç Seviyeleri</h3>
          <span onclick="document.getElementById('p-tier-modal').remove()" style="cursor:pointer;">&times;</span>
      </div>
      <div style="padding:20px;">
          <p style="font-size:12px; color:#64748b; line-height:1.4;">Toplam satış cironuz arttıkça komisyon oranınız otomatik yükselir.</p>
          <table class="tier-table">
              <thead>
                  <tr>
                      <th>Seviye</th>
                      <th>Ciro Şartı</th>
                      <th>Komisyon</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>🥉 <b style="color:#CD7F32">Bronz</b></td>
                      <td>0 - 50.000 ₺</td>
                      <td><span style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px;">%10</span></td>
                  </tr>
                  <tr>
                      <td>🥈 <b style="color:#94a3b8">Gümüş</b></td>
                      <td>50.000₺ - 119.999₺</td>
                      <td><span style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px;">%15</span></td>
                  </tr>
                  <tr>
                      <td>👑 <b style="color:#d97706">Altın</b></td>
                      <td>120.000+ ₺</td>
                      <td><span style="background:#fef3c7; color:#d97706; padding:2px 6px; border-radius:4px;">%20</span></td>
                  </tr>
              </tbody>
          </table>
          <div style="margin-top:15px; font-size:11px; background:#f0fdf4; color:#166534; padding:10px; border-radius:8px;">
              <i class="fas fa-check-circle"></i> Seviye atladığınızda yeni oran tüm yeni satışlarda geçerli olur.
          </div>
      </div>
  </div>
</div>
`;
      document.body.insertAdjacentHTML("beforeend", infoHtml);
    },

    // --- 7. ANA SAYFA PANELİ (PROFESYONEL DASHBOARD v2) ---
    renderHome: async function (container) {
      var email = detectUser();
      if (!email) {
        container.innerHTML =
          "<div style='padding:20px; text-align:center'>Giriş yapmalısınız.</div>";
        return;
      }

      try {
        // Yükleniyor animasyonu
        container.innerHTML =
          '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Veriler analiz ediliyor...</div>';

        // Verileri Çek
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ islem: "get_partner_stats", email: email }),
        });
        const res = await response.json();
        if (!res.success) {
          container.innerHTML =
            "<div style='padding:20px; color:red; text-align:center'>Hata: " +
            res.message +
            "</div>";
          return;
        }

        const s = res.stats;

        var pData = window.PartnerData || {};

        // --- VERİ HAZIRLIĞI ---
        let currentRev = parseFloat(s.totalRevenue || 0);
        let myRate = parseFloat(s.commission_rate || 10);
        let tClicks = parseInt(s.totalClicks || 0);
        let tSales = parseInt(s.totalSales || 0);
        // --- 🚀 MODUMNET 4 ADIMLI BAŞARI YOLCULUĞU (GAMIFICATION v4.0) ---

        let onboardingHTML = "";

        // 1. Durumları Kontrol Et
        let isKycDone = pData.kycStatus === "verified";
        let isKycPending = pData.kycStatus === "pending";

        // Adımları parçaladık
        let isSetupDone = tClicks > 0; // En az 1 kere linke tıklatmış mı?
        let isTrafficFlowing = tClicks >= 10; // 10 Tıklama barajını geçmiş mi?
        let isSaleDone = currentRev > 0; // Satış yapmış mı?

        // 2. İlerleme Yüzdesi (Her adım %25)
        let progressPercent = 0;
        if (isKycDone || isKycPending) progressPercent += 25;
        if (isSetupDone) progressPercent += 25;
        if (isTrafficFlowing) progressPercent += 25;
        if (isSaleDone) progressPercent += 25;

        // Metinler
        let accType = pData.accountType || "individual";
        let kycTitle =
          accType === "company" ? "Vergi Levhası Yükle" : "Kimlik Doğrulama";

        // EĞER %100 OLMADIYSA GÖSTER (Tamamlanınca kaybolur)
        if (progressPercent < 100) {
          onboardingHTML = `
            <div style="background:white; border-radius:16px; padding:25px; margin-bottom:25px; box-shadow:0 10px 30px rgba(0,0,0,0.03); border:1px solid #e2e8f0; position:relative; overflow:hidden;">
                
                <div style="position:absolute; top:-20px; right:-20px; font-size:120px; opacity:0.03; transform:rotate(10deg); pointer-events:none;">🎯</div>

                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:15px;">
                    <div>
                        <h3 style="margin:0; color:#1e293b; font-size:16px;">🏁 Başlangıç Yol Haritası</h3>
                        <p style="margin:5px 0 0; color:#64748b; font-size:12px;">Profesyonel bir partner olmak için bu 4 görevi tamamla.</p>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-weight:bold; color:#3b82f6; font-size:14px;">%${progressPercent}</div>
                    </div>
                </div>

                <div style="width:100%; height:6px; background:#f1f5f9; border-radius:10px; overflow:hidden; margin-bottom:20px;">
                    <div style="width:${progressPercent}%; height:100%; background:linear-gradient(90deg, #3b82f6, #8b5cf6); transition:width 1s ease;"></div>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
                    
                    <div onclick="PartnerApp.loadTab('profile', document.querySelector('.p-nav-item:nth-child(8)'))" 
                         style="cursor:pointer; background:${isKycDone ? "#f0fdf4" : isKycPending ? "#fffbeb" : "#fff"}; border:1px solid ${isKycDone ? "#bbf7d0" : isKycPending ? "#fcd34d" : "#e2e8f0"}; border-radius:10px; padding:15px; position:relative; transition:0.2s;"
                         onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                        
                        ${isKycDone ? '<div style="position:absolute; top:8px; right:8px; color:#16a34a; font-size:14px;">✅</div>' : ""}
                        
                        <div style="font-size:24px; margin-bottom:8px;">🪪</div>
                        <div style="font-weight:bold; color:#1e293b; font-size:13px; margin-bottom:4px;">1. ${kycTitle}</div>
                        <p style="font-size:11px; color:#64748b; line-height:1.3; margin:0;">
                           Yasal ödeme alabilmek için zorunludur. Profil sekmesinden yükle.
                        </p>
                    </div>

                    <div onclick="PartnerApp.loadTab('academy', document.querySelector('.p-nav-item:nth-child(7)'))" 
                         style="cursor:pointer; background:${isSetupDone ? "#f0fdf4" : "#fff"}; border:1px solid ${isSetupDone ? "#bbf7d0" : "#e2e8f0"}; border-radius:10px; padding:15px; position:relative; transition:0.2s;"
                         onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                        
                        ${isSetupDone ? '<div style="position:absolute; top:8px; right:8px; color:#16a34a; font-size:14px;">✅</div>' : ""}

                        <div style="font-size:24px; margin-bottom:8px;">🎓</div>
                        <div style="font-weight:bold; color:#1e293b; font-size:13px; margin-bottom:4px;">2. Koleksiyon Oluştur</div>
                        <p style="font-size:11px; color:#64748b; line-height:1.3; margin:0;">
                           Akademiyi incele, sonra siteye gidip ürünlerdeki <b>"Koleksiyona Ekle"</b> butonuyla mağazanı kur.
                        </p>
                    </div>

                    <div onclick="PartnerApp.loadTab('links', document.querySelector('.p-nav-item:nth-child(3)'))" 
                         style="cursor:pointer; background:${isTrafficFlowing ? "#f0fdf4" : "#fff"}; border:1px solid ${isTrafficFlowing ? "#bbf7d0" : "#e2e8f0"}; border-radius:10px; padding:15px; position:relative; transition:0.2s;"
                         onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
                        
                        ${isTrafficFlowing ? '<div style="position:absolute; top:8px; right:8px; color:#16a34a; font-size:14px;">✅</div>' : ""}

                        <div style="font-size:24px; margin-bottom:8px;">🚀</div>
                        <div style="font-weight:bold; color:#1e293b; font-size:13px; margin-bottom:4px;">3. Trafik Başlat</div>
                        <div style="font-size:10px; margin-bottom:4px; font-weight:bold; color:${isTrafficFlowing ? "#16a34a" : "#f59e0b"};">
                            ${tClicks} / 10 Tıklama
                        </div>
                        <p style="font-size:11px; color:#64748b; line-height:1.3; margin:0;">
                           Oluşturduğun linkleri paylaş. İlk 10 kişi tıkladığında bu görev tamamlanır.
                        </p>
                    </div>

                    <div style="background:${isSaleDone ? "#f0fdf4" : "#fff"}; border:1px solid ${isSaleDone ? "#bbf7d0" : "#e2e8f0"}; border-radius:10px; padding:15px; position:relative; opacity:${isSaleDone ? "1" : "0.8"};">
                        
                        ${isSaleDone ? '<div style="position:absolute; top:8px; right:8px; color:#16a34a; font-size:14px;">✅</div>' : ""}

                        <div style="font-size:24px; margin-bottom:8px;">💰</div>
                        <div style="font-weight:bold; color:#1e293b; font-size:13px; margin-bottom:4px;">4. İlk Kazanç</div>
                        <p style="font-size:11px; color:#64748b; line-height:1.3; margin:0;">
                            Tebrikler! İlk satışın geldiğinde burası yeşil olacak ve bronz rozetin parlayacak.
                        </p>
                    </div>

                </div>
            </div>`;
        }

        // 1. Dönüşüm Oranı (CR)
        let conversionRate =
          tClicks > 0 ? ((tSales / tClicks) * 100).toFixed(2) : "0.00";
        let crColor =
          conversionRate > 2.0
            ? "#10b981"
            : conversionRate > 1.0
              ? "#f59e0b"
              : "#ef4444";

        // 2. Tık Başı Kazanç (EPC)
        let estimatedEarnings = currentRev * (myRate / 100);
        let epcVal =
          tClicks > 0 ? (estimatedEarnings / tClicks).toFixed(2) : "0.00";

        // 3. Platform Analizi (Source Stats) - 🔥 YENİ KISIM
        const sources = s.sourceStats || {};
        let topSource = "Henüz Yok";
        let sourceHtml = "";

        // Platform ikonları
        const sourceIcons = {
          instagram_story:
            '<i class="fab fa-instagram" style="color:#E1306C"></i>',
          instagram_bio:
            '<i class="fab fa-instagram" style="color:#C13584"></i>',
          whatsapp: '<i class="fab fa-whatsapp" style="color:#25D366"></i>',
          tiktok: '<i class="fab fa-tiktok" style="color:#000"></i>',
          telegram: '<i class="fab fa-telegram" style="color:#229ED9"></i>',
          youtube: '<i class="fab fa-youtube" style="color:#FF0000"></i>',
          other: '<i class="fas fa-link" style="color:#666"></i>',
          direct: '<i class="fas fa-globe" style="color:#999"></i>',
        };

        // Kaynakları listele ve sırala
        const sortedSources = Object.entries(sources).sort(
          (a, b) => b[1] - a[1],
        );

        if (sortedSources.length > 0) {
          topSource = sortedSources[0][0].toUpperCase().replace("_", " ");

          // Toplam tık sayısını tekrar hesapla (garanti olsun)
          let totalTracked = sortedSources.reduce(
            (acc, curr) => acc + curr[1],
            0,
          );

          sortedSources.slice(0, 5).forEach(([key, val]) => {
            // İlk 5 kaynağı göster
            let percent = Math.round((val / totalTracked) * 100);
            let icon = sourceIcons[key] || sourceIcons["other"];
            let cleanName = key.replace("_", " ").toUpperCase();

            sourceHtml += `
                    <div style="display:flex; align-items:center; margin-bottom:8px; font-size:11px;">
                        <div style="width:20px; text-align:center;">${icon}</div>
                        <div style="flex:1; margin-left:8px; color:#334155;">${cleanName}</div>
                        <div style="font-weight:bold; margin-right:10px; color:#1e293b;">${val}</div>
                        <div style="width:40px; background:#f1f5f9; height:4px; border-radius:2px; overflow:hidden;">
                            <div style="width:${percent}%; height:100%; background:${key.includes("instagram") ? "#E1306C" : "#3b82f6"};"></div>
                        </div>
                    </div>
                  `;
          });
        } else {
          sourceHtml = `<div style="text-align:center; color:#94a3b8; font-size:11px; padding:15px; background:#f8fafc; border-radius:8px;">Henüz trafik verisi oluşmadı.<br>Linklerinizi paylaşmaya başlayın!</div>`;
        }

        // Seviye İlerleme Çubuğu (YENİ LİMİTLER)
        let nextTarget = 0;
        let progress = 0;
        let barColor = "#fbbf24";

        if (currentRev < 50000) {
          // Bronz -> Gümüş Hedefi (50.000)
          nextTarget = 50000;
          progress = (currentRev / 50000) * 100;
          barColor = "#b45309"; // Bronz Rengi
        } else if (currentRev < 120000) {
          // Gümüş -> Altın Hedefi (120.000)
          nextTarget = 120000;
          // İlerleme hesabı: (Mevcut - AltLimit) / (ÜstLimit - AltLimit)
          progress = ((currentRev - 50000) / 70000) * 100;
          barColor = "#94a3b8"; // Gümüş Rengi
        } else {
          // Zirve (Altın)
          nextTarget = currentRev;
          progress = 100;
          barColor = "#fbbf24"; // Altın Rengi
        }
        // --- 🔥 YENİ: EN ÇOK SATANLAR VERİSİNİ ÇEK ---
        let topProductsHtml =
          "<div style='text-align:center; padding:10px; color:#999; font-size:11px;'>Veri yok.</div>";

        try {
          // Sessizce veriyi çekiyoruz (Backend'e istek atıyoruz)
          const prodRes = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ islem: "get_top_products", email: email }),
          }).then((r) => r.json());

          if (prodRes.success && prodRes.list && prodRes.list.length > 0) {
            topProductsHtml = ""; // İçini temizle
            prodRes.list.forEach((p, idx) => {
              // 1, 2 ve 3. sıralar için madalya renkleri
              let rankColor =
                idx === 0
                  ? "#FFD700"
                  : idx === 1
                    ? "#C0C0C0"
                    : idx === 2
                      ? "#CD7F32"
                      : "#eff6ff";
              let rankText = idx < 3 ? "white" : "#3b82f6";

              topProductsHtml += `
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f1f5f9;">
                        <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
                            <div style="background:${rankColor}; color:${rankText}; width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold; flex-shrink:0;">${idx + 1}</div>
                            <div style="font-size:11px; color:#334155; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:110px;">${p.name}</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:11px; font-weight:bold; color:#10b981;">+${p.earnings} ₺</div>
                            <div style="font-size:9px; color:#64748b;">${p.qty} Adet</div>
                        </div>
                    </div>`;
            });
          }
        } catch (err) {
          console.log("Top products error:", err);
        }
        // -----------------------------------------------------

        // --- 🔥 YENİ: CANLI AKIŞ BANDI (TICKER) ---
        // Backend'den veriyi çek (Bunu renderHome'un başındaki fetch kısmına da ekleyebilirsin ama hızlıca buraya gömüyoruz)
        let liveFeedHtml = "";
        try {
          const feedRes = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ islem: "get_live_feed", email: email }),
          }).then((r) => r.json());

          if (feedRes.success && feedRes.feed.length > 0) {
            let items = feedRes.feed
              .map(
                (f) => `
                        <div class="ticker-item">
                            <span class="t-icon">${f.icon}</span>
                            <span class="t-text">${f.text}</span>
                            <span class="t-time">${f.time}</span>
                        </div>
                    `,
              )
              .join("");

            // İçeriği iki kere çoğalt ki sonsuz döngü kesintisiz olsun
            items += items;

            liveFeedHtml = `
                    <style>
                        .ticker-wrap {
                            width: 100%;
                            overflow: hidden;
                            background: #fff;
                            border: 1px solid #e2e8f0;
                            border-radius: 8px;
                            margin-bottom: 20px;
                            height: 40px;
                            position: relative;
                            display: flex;
                            align-items: center;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                        }
                        .ticker-title {
                            background: #3b82f6;
                            color: white;
                            font-size: 10px;
                            font-weight: bold;
                            padding: 0 10px;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            z-index: 2;
                            position: absolute;
                            left: 0;
                            top: 0;
                            border-radius: 7px 0 0 7px;
                            box-shadow: 2px 0 5px rgba(0,0,0,0.1);
                        }
                        .ticker-content {
                            display: flex;
                            animation: ticker-scroll 20s linear infinite;
                            padding-left: 100px; /* Başlık kadar boşluk */
                        }
                        .ticker-item {
                            display: flex;
                            align-items: center;
                            white-space: nowrap;
                            padding-right: 30px;
                            font-size: 12px;
                            color: #334155;
                        }
                        .t-icon { margin-right: 5px; font-size: 14px; }
                        .t-text { font-weight: 500; margin-right: 5px; }
                        .t-time { font-size: 10px; color: #94a3b8; background: #f1f5f9; padding: 2px 5px; border-radius: 4px; }
                        
                        @keyframes ticker-scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        
                        /* Hoverda dursun */
                        .ticker-wrap:hover .ticker-content { animation-play-state: paused; }
                    </style>
                    <div class="ticker-wrap">
                        <div class="ticker-title"><i class="fas fa-bolt" style="margin-right:5px;"></i> CANLI</div>
                        <div class="ticker-content">
                            ${items}
                        </div>
                    </div>
                    `;
          }
        } catch (err) {
          console.log("Feed error", err);
        }
        // -------------------------------------------

        // --- HTML ÇIKTISI ---
        container.innerHTML = `
          ${onboardingHTML} <div class="p-card" style="background:linear-gradient(135deg, #1e293b, #0f172a); color:white; border:none; padding:20px; border-radius:16px; margin-bottom:20px; box-shadow:0 10px 30px rgba(15, 23, 42, 0.4);">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                      <div style="font-size:10px; opacity:0.7; letter-spacing:1px; font-weight:600;">SEVİYE</div>
                      <div style="font-size:20px; font-weight:800; color:${barColor}; text-shadow:0 0 10px ${barColor}40;">
                          ${s.level || "Bronz"} <span style="font-size:12px; color:white; opacity:0.8; font-weight:normal;">(%${myRate})</span>
                      </div>
                  </div>
                  <div style="text-align:right;">
                      <div style="font-size:10px; opacity:0.7; letter-spacing:1px; font-weight:600;">BAKİYE</div>
                      <div style="font-size:24px; font-weight:800; color:#10b981;">${parseFloat(s.balance).toLocaleString("tr-TR")} ₺</div>
                  </div>
              </div>
<div style="margin-top:15px;">
    <div style="display:flex; justify-content:space-between; font-size:10px; color:rgba(255,255,255,0.9); margin-bottom:5px;">
        <span>🚀 Sonraki: <b>${s.totalRevenue < 10000 ? "Gümüş (%15)" : s.totalRevenue < 50000 ? "Altın (%20)" : "Maximum"}</b></span>
        <span>Kalan: <b>${(nextTarget - currentRev).toLocaleString()} ₺</b></span>
    </div>
    <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:10px; overflow:hidden;">
        <div style="width:${progress}%; height:100%; background:${barColor};"></div>
    </div>
</div>
          </div>

          ${liveFeedHtml}<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:10px;">
              <div class="p-card" style="padding:15px; text-align:center; margin:0; box-shadow:none; border:1px solid #e2e8f0;">
                  <div class="p-stat-val" style="font-size:18px; color:#334155;">${tClicks}</div>
                  <div class="p-stat-lbl" style="font-size:10px;">TIK</div>
              </div>
              <div class="p-card" style="padding:15px; text-align:center; margin:0; box-shadow:none; border:1px solid #e2e8f0;">
                  <div class="p-stat-val" style="font-size:18px; color:#334155;">${tSales}</div>
                  <div class="p-stat-lbl" style="font-size:10px;">SATIŞ</div>
              </div>
              <div class="p-card" style="padding:15px; text-align:center; margin:0; background:#f5f3ff; border:1px solid #a78bfa;">
                  <div class="p-stat-val" style="font-size:18px; color:#8b5cf6;">${s.referralCount || 0}</div>
                  <div class="p-stat-lbl" style="font-size:10px; color:#7c3aed;">ÜYE</div>
              </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
              <div class="p-card" style="padding:15px; text-align:center; margin:0; background:#f0f9ff; border:1px solid #bae6fd;">
                  <div class="p-stat-val" style="font-size:18px; color:#0369a1;">%${conversionRate}</div>
                  <div class="p-stat-lbl" style="color:#0ea5e9; font-size:10px;">DÖNÜŞÜM (CR)</div>
              </div>
              <div class="p-card" style="padding:15px; text-align:center; margin:0; background:#f0fdf4; border:1px solid #bbf7d0;">
                  <div class="p-stat-val" style="font-size:18px; color:#166534;">${epcVal} ₺</div>
                  <div class="p-stat-lbl" style="color:#15803d; font-size:10px;">TIK DEĞERİ (EPC)</div>
              </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr; gap:15px; @media(min-width:768px){grid-template-columns: 2fr 1fr;}">
              
              <div class="p-card" style="padding:15px; margin:0; border:1px solid #e2e8f0; box-shadow:none;">
                  <h4 style="margin:0 0 15px 0; font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">💰 Son 7 Gün Performansı</h4>
                  <div style="height:180px;">
                      <canvas id="p-chart"></canvas>
                  </div>
              </div>

              <div class="p-card" style="padding:15px; margin:0; border:1px solid #e2e8f0; box-shadow:none;">
                  <h4 style="margin:0 0 15px 0; font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">🌍 Trafik Kaynakları</h4>
                  ${sourceHtml}
                  
                  ${
                    sortedSources.length > 0
                      ? `
                  <div style="margin-top:15px; padding-top:10px; border-top:1px solid #f1f5f9; text-align:center;">
                      <div style="font-size:9px; color:#94a3b8;">EN GÜÇLÜ KANALIN</div>
                      <div style="font-weight:bold; color:#1e293b; font-size:13px;">🔥 ${topSource}</div>
                  </div>`
                      : ""
                  }
              </div>
              <div class="p-card" style="padding:0; margin-top:15px; border:1px solid #e2e8f0; box-shadow:none; overflow:hidden;">
                  <div style="padding:10px 15px; border-bottom:1px solid #e2e8f0; background:#f8fafc; display:flex; align-items:center; gap:5px;">
                      <i class="fas fa-trophy" style="color:#f59e0b;"></i> 
                      <h4 style="margin:0; font-size:11px; color:#334155; text-transform:uppercase; letter-spacing:0.5px;">Senin Yıldızların</h4>
                  </div>
                  <div style="max-height:200px; overflow-y:auto; padding:0 15px;">
                      ${topProductsHtml}
                  </div>
                  <div style="padding:5px; text-align:center; font-size:9px; color:#94a3b8; border-top:1px solid #f1f5f9;">
                      * En çok kazandıran ürünlerin
                  </div>
              </div>
          </div>
          `;

        // GRAFİK ÇİZİMİ
        if (s.chart && s.chart.labels) {
          new Chart(document.getElementById("p-chart"), {
            type: "line",
            data: {
              labels: s.chart.labels,
              datasets: [
                {
                  label: "Günlük Kazanç (₺)",
                  data: s.chart.data,
                  borderColor: "#3b82f6",
                  backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, "rgba(59, 130, 246, 0.2)");
                    gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
                    return gradient;
                  },
                  borderWidth: 2,
                  pointRadius: 0, // Noktaları gizle (daha temiz)
                  pointHoverRadius: 4,
                  fill: true,
                  tension: 0.4,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { font: { size: 9 }, color: "#94a3b8" },
                },
                y: {
                  grid: { color: "#f1f5f9" },
                  beginAtZero: true,
                  ticks: { font: { size: 9 }, color: "#94a3b8" },
                },
              },
              interaction: { intersect: false, mode: "index" },
            },
          });
        }
      } catch (e) {
        container.innerHTML =
          "<div style='color:red; text-align:center;'>Veri hatası: " +
          e.message +
          "</div>";
      }
    }, // --- 1. AKILLI PAYLAŞIM MENÜSÜ ---
    openShareMenu: function (baseUrl, isCollection = false) {
      // Eski modal varsa sil
      let old = document.getElementById("mdm-share-modal");
      if (old) old.remove();

      let title = isCollection ? "Mağaza Linkini Paylaş" : "Bu Ürünü Paylaş";

      let html = `
        <div id="mdm-share-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:2147483650; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(5px);">
            <div style="background:white; width:100%; max-width:320px; border-radius:16px; padding:25px; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.5);">
                
                <h3 style="margin:0 0 10px 0; color:#1e293b;">${title}</h3>
                <p style="font-size:13px; color:#64748b; margin-bottom:20px;">
                    Nerede paylaşacağını seç, sana özel linki oluşturalım.(Linkler 30 gün Geçerlidir.)
                </p>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
                    <button onclick="PartnerApp.copySmartLink('${baseUrl}', 'instagram')" class="p-btn" style="background:#fdf2f8; color:#be185d; border:1px solid #fbcfe8; flex-direction:column; padding:15px; font-size:12px;">
                        <i class="fab fa-instagram" style="font-size:24px; margin-bottom:5px;"></i> Instagram
                    </button>
                    
                    <button onclick="PartnerApp.copySmartLink('${baseUrl}', 'whatsapp')" class="p-btn" style="background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; flex-direction:column; padding:15px; font-size:12px;">
                        <i class="fab fa-whatsapp" style="font-size:24px; margin-bottom:5px;"></i> WhatsApp
                    </button>
                    
                    <button onclick="PartnerApp.copySmartLink('${baseUrl}', 'tiktok')" class="p-btn" style="background:#000000; color:white; border:1px solid #333; flex-direction:column; padding:15px; font-size:12px;">
                        <i class="fab fa-tiktok" style="font-size:24px; margin-bottom:5px;"></i> TikTok
                    </button>

                    <button onclick="PartnerApp.copySmartLink('${baseUrl}', 'telegram')" class="p-btn" style="background:#f0f9ff; color:#0369a1; border:1px solid #bae6fd; flex-direction:column; padding:15px; font-size:12px;">
                        <i class="fab fa-telegram" style="font-size:24px; margin-bottom:5px;"></i> Telegram
                    </button>

                    <button onclick="PartnerApp.copySmartLink('${baseUrl}', 'youtube')" class="p-btn" style="background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; flex-direction:column; padding:15px; font-size:12px;">
                        <i class="fab fa-youtube" style="font-size:24px; margin-bottom:5px;"></i> YouTube
                    </button>

                    <button onclick="PartnerApp.copySmartLink('${baseUrl}', 'other')" class="p-btn" style="background:#f8fafc; color:#475569; border:1px solid #e2e8f0; flex-direction:column; padding:15px; font-size:12px;">
                        <i class="fas fa-link" style="font-size:24px; margin-bottom:5px;"></i> Diğer
                    </button>
                </div>
                
                <div onclick="document.getElementById('mdm-share-modal').remove()" style="cursor:pointer; color:#94a3b8; font-size:13px; text-decoration:underline;">Vazgeç</div>
            </div>
        </div>
        `;
      document.body.insertAdjacentHTML("beforeend", html);
    },

    // --- 2. LİNKİ OLUŞTUR VE KOPYALA ---
    copySmartLink: function (url, source) {
      var pData = window.PartnerData || {};
      var myRefCode = pData.refCode;

      var separator = url.includes("?") ? "&" : "?";
      var finalLink = url;

      if (!url.includes("ref=")) {
        finalLink += separator + "ref=" + myRefCode;
        separator = "&";
      }

      finalLink += separator + "source=" + source;

      navigator.clipboard.writeText(finalLink).then(() => {
        document.getElementById("mdm-share-modal").remove();
        alert(
          `✅ Link Kopyalandı!\n\nKaynak: ${source.toUpperCase()}\n\nBunu ${source} üzerinde paylaşabilirsin.`,
        );
      });
    },

    // --- LİNKLER & QR ARAÇLARI (AKILLI KAYNAK SEÇİCİ v2.0) ---
    renderLinks: function (c) {
      var pData = window.PartnerData || {};
      var myRefCode = pData.refCode || "REF-BEKLENIYOR";
      var myCoupon = pData.custom_coupon || "Tanımlanmamış";
      var homeLink = "https://www.modum.tr/?ref=" + myRefCode;

      // İndirim Kodu HTML (Aynı kalıyor)
      let couponHTML =
        myCoupon !== "Tanımlanmamış"
          ? `<div class="p-card" style="background:linear-gradient(135deg, #8b5cf6, #6d28d9); color:white; border:none; padding:15px; margin-bottom:20px; position:relative; overflow:hidden;">
              <div style="position:absolute; top:-10px; right:-10px; font-size:60px; opacity:0.1;">🎟️</div>
              <label style="font-size:10px; opacity:0.8; font-weight:bold; display:block;">İNDİRİM KODUN</label>
              <div style="font-family:monospace; font-size:28px; font-weight:900; margin-top:5px; letter-spacing:1px;">${myCoupon}</div>
              <button onclick="navigator.clipboard.writeText('${myCoupon}'); alert('Kupon Kopyalandı!')" class="p-btn" style="background:white; color:#6d28d9; margin-top:10px; height:36px; font-size:12px;">Kopyala</button>
            </div>`
          : `<div class="p-card" style="border:1px dashed #cbd5e1; padding:15px; margin-bottom:20px; text-align:center; font-size:12px; color:#64748b;">Kupon tanımlanmamış.</div>`;

      c.innerHTML = `
      <div style="background:#fff; border-left:4px solid #3b82f6; padding:15px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.05); margin-bottom:20px;">
          <h3 style="margin:0 0 5px 0; font-size:16px; color:#1e293b;">🔗 Link ve Analiz</h3>
          <p style="margin:0; font-size:12px; color:#64748b; line-height:1.5;">
              Hangi platformda daha güçlü olduğunu görmek için paylaşım yapacağın yeri seç.
          </p>
      </div>

      ${couponHTML}
      
      <p style="font-size:13px; color:#334155; margin-bottom:15px; font-weight:600;">📦 Akıllı Link Oluşturucu:</p>

      <div class="p-card" style="padding:20px; border-radius:12px; border:1px solid #e2e8f0; background:white;">
          
          <div class="form-group" style="margin-bottom:20px;">
              <label class="p-stat-lbl" style="display:block; margin-bottom:5px;">1. ÜRÜN LİNKİ (Zorunlu)</label>
              <input type="text" id="pl-input" placeholder="https://www.modum.tr/urun/..." style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; box-sizing:border-box; outline:none; font-size:13px;">
          </div>

          <div class="form-group" style="margin-bottom:20px;">
              <label class="p-stat-lbl" style="display:block; margin-bottom:10px; color:#8b5cf6;">2. NEREDE PAYLAŞACAKSIN?</label>
              
              <div id="source-selector" style="display:flex; gap:8px; flex-wrap:wrap;">
                  <div onclick="PartnerApp.selectSource(this, 'instagram_story')" class="source-pill active" style="border:1px solid #e2e8f0; padding:8px 15px; border-radius:20px; font-size:12px; cursor:pointer; background:#3b82f6; color:white; transition:0.2s;">
                      <i class="fab fa-instagram"></i> Story
                  </div>
                  <div onclick="PartnerApp.selectSource(this, 'instagram_bio')" class="source-pill" style="border:1px solid #e2e8f0; padding:8px 15px; border-radius:20px; font-size:12px; cursor:pointer; background:white; color:#64748b; transition:0.2s;">
                      <i class="fas fa-link"></i> Bio
                  </div>
                  <div onclick="PartnerApp.selectSource(this, 'whatsapp')" class="source-pill" style="border:1px solid #e2e8f0; padding:8px 15px; border-radius:20px; font-size:12px; cursor:pointer; background:white; color:#64748b; transition:0.2s;">
                      <i class="fab fa-whatsapp"></i> WhatsApp
                  </div>
                  <div onclick="PartnerApp.selectSource(this, 'telegram')" class="source-pill" style="border:1px solid #e2e8f0; padding:8px 15px; border-radius:20px; font-size:12px; cursor:pointer; background:white; color:#64748b; transition:0.2s;">
                      <i class="fab fa-telegram"></i> Telegram
                  </div>
                  <div onclick="PartnerApp.selectSource(this, 'youtube')" class="source-pill" style="border:1px solid #e2e8f0; padding:8px 15px; border-radius:20px; font-size:12px; cursor:pointer; background:white; color:#64748b; transition:0.2s;">
                      <i class="fab fa-youtube"></i> YouTube
                  </div>
              </div>
              
              <input type="hidden" id="pl-source" value="instagram_story">
          </div>
          
          <button onclick="PartnerApp.createLink('${myRefCode}')" class="p-btn p-btn-primary" style="margin-top:5px; background:#1e293b; color:white; border:none; padding:12px; border-radius:8px; width:100%; font-weight:bold;">
              Link ve QR Oluştur ✨
          </button>
      </div>

      <div id="pl-result" style="display:none; margin-top:20px;" class="p-card">
          <div class="p-stat-lbl" style="color:#3b82f6; margin-bottom:10px;">ÖZEL PAYLAŞIM LİNKİN:</div>
          <div id="pl-final" style="background:#eff6ff; padding:12px; border-radius:8px; font-family:monospace; color:#1e40af; margin-bottom:15px; word-break:break-all; font-size:12px; border:1px solid #dbeafe;"></div>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
              <a id="btn-wa" href="#" target="_blank" class="p-btn" style="background:#25D366; color:white; text-decoration:none; display:flex; align-items:center; justify-content:center; padding:10px; border-radius:8px; font-size:13px; font-weight:bold;">
                  <i class="fab fa-whatsapp" style="margin-right:5px;"></i> WhatsApp
              </a>
              <button id="btn-qr-show" class="p-btn" style="background:#334155; color:white; border:none; padding:10px; border-radius:8px; font-size:13px; font-weight:bold;">
                  <i class="fas fa-qrcode" style="margin-right:5px;"></i> QR Kod
              </button>
          </div>
          
          <button onclick="navigator.clipboard.writeText(document.getElementById('pl-final').innerText); alert('Kopyalandı!')" class="p-btn" style="background:#3b82f6; color:white; width:100%; padding:12px; border:none; border-radius:8px; font-weight:bold;">
              <i class="fas fa-copy"></i> Linki Kopyala
          </button>

          <div id="pl-qr-box" style="display:none; margin-top:15px; background:white; padding:15px; border-radius:12px; border:1px solid #e2e8f0; text-align:center;">
              <img id="pl-qr-img" src="" style="width:200px; height:200px; margin:0 auto; display:block; border:1px solid #eee; padding:5px;">
          </div>
      </div>
    `;
    },

    // SEÇİM FONKSİYONU
    selectSource: function (el, val) {
      // Görsel Değişim
      document.querySelectorAll(".source-pill").forEach((p) => {
        p.style.background = "white";
        p.style.color = "#64748b";
        p.classList.remove("active");
      });
      el.style.background = "#3b82f6";
      el.style.color = "white";
      el.classList.add("active");

      // Değeri Kaydet
      document.getElementById("pl-source").value = val;
    },

    createLink: function (refCode) {
      var val = document.getElementById("pl-input").value;
      var sourceTag = document.getElementById("pl-source").value.trim(); // Kaynak etiketi

      if (!val) return alert("Lütfen bir ürün linki giriniz.");

      // Link zaten parametre içeriyor mu?
      var separator = val.includes("?") ? "&" : "?";
      var final = val + separator + "ref=" + refCode;

      // 🔥 Eğer kaynak etiketi varsa ekle
      if (sourceTag) {
        // Boşlukları tire yap, özel karakterleri temizle
        sourceTag = sourceTag
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "");
        final += "&source=" + sourceTag;
      }

      // Linki Ekrana Bas
      document.getElementById("pl-final").innerText = final;
      document.getElementById("pl-result").style.display = "block";

      // WhatsApp Linki
      var msgWA = encodeURIComponent("Bu ürüne bayıldım! Link: " + final);
      document.getElementById("btn-wa").href =
        "https://api.whatsapp.com/send?text=" + msgWA;

      // QR Kod
      var qrUrl =
        "https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=" +
        encodeURIComponent(final);
      document.getElementById("pl-qr-img").src = qrUrl;
      document.getElementById("pl-qr-dl").href = qrUrl;

      // QR Butonuna Tıklama Olayı
      document.getElementById("btn-qr-show").onclick = function () {
        var qrBox = document.getElementById("pl-qr-box");
        qrBox.style.display = qrBox.style.display === "none" ? "block" : "none";
      };
    },

    // Ana Sayfa QR Kodu İçin Helper
    toggleQR: function (url) {
      // Hızlıca bir modal ile gösterelim
      var qrApi =
        "https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=" +
        encodeURIComponent(url);
      var html = `
      <div id="p-qr-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:999999999; display:flex; justify-content:center; align-items:center;" onclick="this.remove()">
        <div style="background:white; padding:20px; border-radius:16px; text-align:center; max-width:300px;" onclick="event.stopPropagation()">
            <h3 style="margin:0 0 10px 0; color:#333;">📱 QR KODUN</h3>
            <img src="${qrApi}" style="width:100%; display:block; margin-bottom:10px;">
            <a href="${qrApi}" target="_blank" class="p-btn" style="background:#3b82f6; color:white; text-decoration:none;">Resmi İndir</a>
            <div style="margin-top:10px; font-size:11px; color:#999;">Kapatmak için boşluğa tıkla</div>
        </div>
      </div>`;
      document.body.insertAdjacentHTML("beforeend", html);
    }, // 🔥 YENİ: STORY EDİTÖR v2.0 (MODUM CREATIVE STUDIO)
    openStoryEditor: function (encodedProductData) {
      // Eski modal varsa temizle
      let old = document.getElementById("p-story-modal");
      if (old) old.remove();

      // Veriyi güvenli şekilde al
      let product = JSON.parse(decodeURIComponent(encodedProductData));
      let pData = window.PartnerData || {};
      let myRefCode = pData.refCode || "REF-YOK";
      let myCoupon = pData.custom_coupon || "";

      // Ürün Linkini Hazırla (QR İçin)
      let productUrl =
        product.url +
        (product.url.includes("?") ? "&" : "?") +
        "ref=" +
        myRefCode +
        "&source=story_qr";

      // Modal HTML (Şablon Seçici Eklendi)
      let html = `
      <div id="p-story-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.92); z-index:2147483647; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px;">
          
          <div style="width:100%; max-width:400px; display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
              <h3 style="color:white; margin:0; font-size:18px;">🎨 Story Tasarımcısı</h3>
              <span onclick="document.getElementById('p-story-modal').remove()" style="cursor:pointer; font-size:30px; color:white; line-height:0.5;">&times;</span>
          </div>
          
          <div style="background:#1e293b; padding:10px; border-radius:10px; display:flex; gap:10px; margin-bottom:15px; overflow-x:auto; width:100%; max-width:400px; box-sizing:border-box;">
              <button onclick="PartnerApp.changeTemplate('modern')" class="p-btn-tmpl" style="flex:1; background:#3b82f6; color:white; border:none; padding:8px; border-radius:6px; font-size:11px; cursor:pointer;">Modern</button>
              <button onclick="PartnerApp.changeTemplate('sale')" class="p-btn-tmpl" style="flex:1; background:#1e293b; color:#cbd5e1; border:1px solid #334155; padding:8px; border-radius:6px; font-size:11px; cursor:pointer;">🔥 İndirim</button>
              <button onclick="PartnerApp.changeTemplate('minimal')" class="p-btn-tmpl" style="flex:1; background:#1e293b; color:#cbd5e1; border:1px solid #334155; padding:8px; border-radius:6px; font-size:11px; cursor:pointer;">Minimal</button>
          </div>

          <div style="box-shadow:0 20px 50px rgba(0,0,0,0.5); border-radius:12px; overflow:hidden; max-height:65vh; aspect-ratio: 9 / 16;">
              <canvas id="story-canvas" width="1080" height="1920" style="width:100%; height:100%; object-fit:contain;"></canvas>
          </div>

          <div style="margin-top:20px;">
              <button id="dl-story-btn" class="p-btn" style="background:#10b981; color:white; font-size:16px; padding:12px 40px; border:none; border-radius:50px; font-weight:bold; cursor:pointer; box-shadow:0 5px 20px rgba(16,185,129,0.4); opacity:0.5; pointer-events:none;">
                  <i class="fas fa-spinner fa-spin"></i> Oluşturuluyor...
              </button>
          </div>
      </div>
      `;
      document.body.insertAdjacentHTML("beforeend", html);

      // Global değişkenlere ata (Yeniden çizim için)
      this.activeProduct = product;
      this.activeCoupon = myCoupon;
      this.activeUrl = productUrl;

      // Varsayılan şablonla başlat
      this.changeTemplate("modern");
    },

    // Şablon Değiştirme Fonksiyonu
    changeTemplate: function (tmplName) {
      // Butonların stilini güncelle
      document.querySelectorAll(".p-btn-tmpl").forEach((btn) => {
        if (
          btn.innerText
            .toLowerCase()
            .includes(tmplName.includes("sale") ? "indirim" : tmplName)
        ) {
          btn.style.background = "#3b82f6";
          btn.style.color = "white";
          btn.style.border = "none";
        } else {
          btn.style.background = "#1e293b";
          btn.style.color = "#cbd5e1";
          btn.style.border = "1px solid #334155";
        }
      });

      // Çizimi Yeniden Başlat
      const btn = document.getElementById("dl-story-btn");
      if (btn) {
        btn.style.opacity = "0.5";
        btn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Güncelleniyor...';
      }

      this.drawStoryV2(
        "story-canvas",
        this.activeProduct,
        this.activeCoupon,
        this.activeUrl,
        tmplName,
      );
    },

    // 🔥 MOTOR: GELİŞMİŞ CANVAS ÇİZİMİ (HATA DÜZELTİLMİŞ & İNDİRİM HESABI KALDIRILMIŞ)
    drawStoryV2: async function (
      canvasId,
      product,
      coupon,
      productUrl,
      template,
    ) {
      const canvas = document.getElementById(canvasId);
      const ctx = canvas.getContext("2d");
      const btn = document.getElementById("dl-story-btn");

      try {
        // 1. GÖRSELLERİ YÜKLE
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(productUrl)}`;

        const [img, qrImg] = await Promise.all([
          loadCanvasImage(product.image),
          loadCanvasImage(qrApiUrl),
        ]);

        // 2. TEMİZLİK
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 3. ŞABLON RENK AYARLARI
        let bgGradient, titleColor, priceColor, accentColor;

        if (template === "modern") {
          let grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
          grd.addColorStop(0, "#1e293b");
          grd.addColorStop(1, "#0f172a");
          bgGradient = grd;
          titleColor = "#ffffff";
          priceColor = "#fbbf24";
          accentColor = "#3b82f6";
        } else if (template === "sale") {
          let grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
          grd.addColorStop(0, "#b91c1c"); // Koyu Kırmızı
          grd.addColorStop(1, "#7f1d1d");
          bgGradient = grd;
          titleColor = "#ffffff";
          priceColor = "#ffffff";
          accentColor = "#fcd34d"; // Sarı
        } else if (template === "minimal") {
          bgGradient = "#f8fafc"; // Beyaz/Gri
          titleColor = "#1e293b";
          priceColor = "#1e293b";
          accentColor = "#cbd5e1";
        }

        // Arka Planı Boya
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 4. LOGO
        ctx.fillStyle =
          template === "minimal" ? "#94a3b8" : "rgba(255,255,255,0.5)";
        ctx.font = "bold 30px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("modum.tr", canvas.width / 2, 100);

        // 5. ÜRÜN GÖRSELİ
        const imgSize = 800;
        const imgX = (canvas.width - imgSize) / 2;
        const imgY = 200;

        // Gölge ve Çerçeve
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 20;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(imgX - 20, imgY - 20, imgSize + 40, imgSize + 40);
        ctx.shadowColor = "transparent";

        ctx.drawImage(img, imgX, imgY, imgSize, imgSize);

        // 6. ÜRÜN BAŞLIĞI
        ctx.fillStyle = titleColor;
        ctx.font = "bold 50px 'Inter', sans-serif";
        ctx.textAlign = "center";

        // Uzun başlıkları satırlara böl
        let safeTitle = product.title
          ? String(product.title).toUpperCase()
          : "ÜRÜN";
        let nextY = wrapText(
          ctx,
          safeTitle,
          canvas.width / 2,
          imgY + imgSize + 120,
          900,
          70,
        );

        // 7. FİYAT GÖSTERİMİ (SABİT)
        // Fiyat verisini string'e çevirip güvenli hale getiriyoruz (HATA ÇÖZÜMÜ BURADA)
        let finalPriceStr = String(product.price);

        // Eğer sonunda TL yoksa ekleyelim
        if (
          !finalPriceStr.includes("TL") &&
          !finalPriceStr.includes("$") &&
          !finalPriceStr.includes("€")
        ) {
          finalPriceStr += " TL";
        }

        // İndirim modundaysak "FIRSAT ÜRÜNÜ" yazısı ekle
        if (template === "sale") {
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.font = "bold 40px 'Inter', sans-serif";
          ctx.fillText("🔥 FIRSAT ÜRÜNÜ", canvas.width / 2, nextY + 60);
          nextY += 70; // Fiyatı biraz aşağı it
        }

        // Ana Fiyatı Çiz
        ctx.fillStyle = priceColor;
        ctx.font = "900 110px 'Inter', sans-serif";
        ctx.fillText(finalPriceStr, canvas.width / 2, nextY + 80);

        // 8. KUPON KUTUSU
        let bottomY = nextY + 180;

        if (coupon && coupon !== "KOD YOK" && coupon !== "") {
          const boxW = 600;
          const boxH = 180;
          const boxX = (canvas.width - boxW) / 2;

          // Kesikli Çizgi Çerçeve
          ctx.setLineDash([15, 15]);
          ctx.lineWidth = 6;
          ctx.strokeStyle = accentColor;
          ctx.strokeRect(boxX, bottomY, boxW, boxH);
          ctx.setLineDash([]);

          // Metinler
          ctx.fillStyle =
            template === "minimal" ? "#64748b" : "rgba(255,255,255,0.8)";
          ctx.font = "bold 24px 'Inter', sans-serif";
          ctx.fillText("ÖZEL İNDİRİM KODUN", canvas.width / 2, bottomY + 50);

          ctx.fillStyle = template === "minimal" ? "#1e293b" : "#ffffff";
          ctx.font = "900 70px monospace";
          ctx.fillText(coupon, canvas.width / 2, bottomY + 130);
        } else {
          // Kupon yoksa genel mesaj
          ctx.fillStyle = accentColor;
          ctx.font = "bold 40px 'Inter', sans-serif";
          ctx.fillText("TÜKENMEDEN AL!", canvas.width / 2, bottomY + 100);
        }

        // 9. QR KOD
        const qrSize = 220;
        const qrX = canvas.width - qrSize - 40;
        const qrY = canvas.height - qrSize - 40;

        ctx.fillStyle = "white";
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 20;
        ctx.fillRect(qrX, qrY, qrSize, qrSize);
        ctx.shadowColor = "transparent";

        ctx.drawImage(qrImg, qrX + 10, qrY + 10, qrSize - 20, qrSize - 20);

        // "Tıkla & Al" yazısı
        ctx.fillStyle = "#000";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("TARAT & GİT", qrX + qrSize / 2, qrY + qrSize + 25);

        // --- Çizim Bitti ---

        btn.style.opacity = "1";
        btn.style.pointerEvents = "all";
        btn.style.background = "#10b981";
        btn.innerHTML = '<i class="fas fa-download"></i> GÖRSELİ İNDİR';

        // İndirme olayını bağla
        btn.onclick = () =>
          this.downloadStory(canvasId, "modum-story-" + Date.now());
      } catch (e) {
        console.error("Story Hatası:", e);
        btn.innerHTML = "Hata Oluştu";
        btn.style.background = "#ef4444";
        // Hata detayını konsola bas ki görebilelim
        console.log("Hata Detayı:", e.message);
      }
    },

    // 🔥 YENİ: CANVAS İNDİRME FONKSİYONU
    downloadStory: function (canvasId, fileName) {
      const canvas = document.getElementById(canvasId);
      // Canvas'ı resim verisine (Data URL) çevir
      const dataUrl = canvas.toDataURL("image/png", 1.0);

      // Sanal bir link oluştur ve tıkla
      const link = document.createElement("a");
      link.download = fileName + ".png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    // --- CÜZDAN & GEÇMİŞ (DİJİTAL BANKACILIK ARAYÜZÜ v5.0) ---
    renderWallet: async function (container) {
      // Yükleniyor Ekranı
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:400px; color:#64748b;">
            <i class="fas fa-circle-notch fa-spin" style="font-size:40px; color:#3b82f6; margin-bottom:15px;"></i>
            <div style="font-weight:600;">Finansal verileriniz şifrelenerek getiriliyor...</div>
        </div>`;

      var email = detectUser();
      if (!email)
        return (container.innerHTML =
          "<div style='padding:20px; text-align:center;'>Giriş yapmalısınız.</div>");

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            islem: "get_partner_history",
            email: email,
          }),
        });
        const data = await res.json();

        // --- GLOBAL VERİLERİ HAZIRLA ---
        let pStats = window.PartnerData || {};
        let safeBalance = parseFloat(pStats.balance || 0);
        let pendingVal = parseFloat(pStats.pending_balance || 0);
        let accType = pStats.accountType || "individual";

        // --- CSS STİLLERİ (BANKA TASARIMI) ---
        const css = `
        <style>
            /* Kart Grid Yapısı */
            .fin-hero-grid {
                display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;
            }
            /* Kredi Kartı Görünümü */
            .fin-card {
                position: relative; border-radius: 20px; padding: 25px; color: white; overflow: hidden;
                box-shadow: 0 15px 35px rgba(0,0,0,0.1); transition: transform 0.3s ease, box-shadow 0.3s ease;
                display: flex; flex-direction: column; justify-content: space-between; min-height: 160px;
            }
            .fin-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
            
            /* Yeşil Kart (Aktif Bakiye) */
            .fin-card.available {
                background: linear-gradient(135deg, #10b981 0%, #047857 100%);
                box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
            }
            /* Sarı Kart (Bekleyen) */
            .fin-card.pending {
                background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
                box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
            }

            .fin-card-bg-icon { position: absolute; right: -20px; bottom: -20px; font-size: 120px; opacity: 0.1; transform: rotate(-10deg); }
            .fin-chip { width: 40px; height: 30px; background: rgba(255,255,255,0.2); border-radius: 6px; border: 1px solid rgba(255,255,255,0.3); margin-bottom: 15px; position: relative; }
            .fin-chip::after { content:''; position: absolute; top:50%; left:0; width:100%; height:1px; background:rgba(255,255,255,0.3); }
            
            .fin-label { font-size: 11px; text-transform: uppercase; opacity: 0.8; letter-spacing: 1px; font-weight: 600; }
            .fin-amount { font-size: 32px; font-weight: 800; margin: 5px 0; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
            .fin-status { font-size: 12px; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 5px; backdrop-filter: blur(5px); width: fit-content;}

            /* İşlem Geçmişi */
            .fin-history-container { background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
            .fin-history-header { padding: 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
            .fin-history-title { font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 10px; }
            
            .fin-item { 
                padding: 20px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; 
                cursor: pointer; transition: background 0.2s; 
            }
            .fin-item:hover { background: #f8fafc; }
            .fin-item:last-child { border-bottom: none; }
            
            .fin-icon-box { 
                width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; 
                font-size: 20px; margin-right: 15px; flex-shrink: 0;
            }
            .icon-in { background: #ecfdf5; color: #10b981; }
            .icon-out { background: #fff1f2; color: #ef4444; }
            .icon-wait { background: #fffbeb; color: #f59e0b; }

            .fin-detail-box { display: none; background: #f8fafc; padding: 20px; border-top: 1px solid #e2e8f0; animation: slideDown 0.2s ease-out; }
            @keyframes slideDown { from { opacity:0; transform: translateY(-10px); } to { opacity:1; transform: translateY(0); } }

            /* Action Buttons */
            .fin-btn { border: none; padding: 8px 15px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s; }
            .fin-btn-primary { background: #1e293b; color: white; }
            .fin-btn-primary:hover { background: #0f172a; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            
            /* Responsive */
            @media (max-width: 768px) {
                .fin-amount { font-size: 26px; }
            }
        </style>
        `;

        // --- 🔥 HAKEDİŞ TAKVİMİ (SIDEBAR GİBİ) ---
        let calendarHTML = "";
        if (data.calendar && data.calendar.length > 0) {
          let rows = "";
          data.calendar.forEach((day) => {
            rows += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed #e2e8f0;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="background:#fffbeb; color:#d97706; width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; border:1px solid #fcd34d;">
                            ${day.date.split(".")[0]}
                        </div>
                        <div style="line-height:1.2;">
                            <div style="font-size:12px; color:#1e293b; font-weight:700;">${day.date}</div>
                            <div style="font-size:10px; color:#64748b;">${day.count} işlem serbest kalıyor</div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:13px; font-weight:800; color:#059669;">+${day.amount} ₺</div>
                    </div>
                </div>`;
          });

          calendarHTML = `
            <div style="background:white; border-radius:16px; border:1px solid #e2e8f0; padding:20px; margin-bottom:30px; box-shadow:0 4px 6px rgba(0,0,0,0.02);">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
                    <div style="background:#fff7ed; padding:8px; border-radius:8px; color:#c2410c;"><i class="fas fa-hourglass-half"></i></div>
                    <h4 style="margin:0; color:#1e293b; font-size:14px;">Yaklaşan Ödemeler</h4>
                </div>
                <div style="background:#fcfcfc; border-radius:12px; padding:0 15px; border:1px solid #f1f5f9;">
                    ${rows}
                </div>
            </div>`;
        }

        // --- İŞLEM GEÇMİŞİ LİSTESİ ---
        let historyHTML = "";
        if (data.success && data.list.length > 0) {
          data.list.forEach((tx) => {
            // Değerler
            let val = parseFloat(tx.commission || tx.amount || 0);
            if (isNaN(val)) val = 0;
            let amountText = `${val.toLocaleString()} ₺`;

            // Renk ve İkon Mantığı
            let iconClass = "icon-in";
            let iconSymbol = "fa-arrow-down";
            let amountColor = "#10b981";
            let sign = "+";
            let txTitle = tx.desc;

            if (tx.type === "payout_request") {
              iconClass = "icon-out";
              iconSymbol = "fa-arrow-up";
              amountColor = "#1e293b"; // Nötr renk (Ödeme alındı)
              sign = "";
              if (!txTitle || txTitle === "Para Çekme Talebi")
                txTitle = "Banka Transferi";
            }

            if (tx.status === "refunded") {
              iconClass = "icon-out";
              iconSymbol = "fa-undo";
              amountColor = "#94a3b8"; // Gri
              amountText = `<span style="text-decoration:line-through;">${amountText}</span>`;
              txTitle = "İADE / İPTAL";
            }

            // Dekont / PDF Butonları
            let receiptBtn = "";
            if (tx.receiptUrl && tx.receiptUrl.length > 5) {
              receiptBtn = `<a href="${tx.receiptUrl}" target="_blank" onclick="event.stopPropagation()" class="fin-btn" style="background:#eff6ff; color:#3b82f6; border:1px solid #dbeafe; display:inline-flex;">📄 Dekont</a>`;
            }
            let safeTx = encodeURIComponent(JSON.stringify(tx));
            let pdfBtn = `<button onclick="PartnerApp.downloadReceiptPDF(JSON.parse(decodeURIComponent('${safeTx}'))); event.stopPropagation();" class="fin-btn" style="background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; display:inline-flex;">🧾 Makbuz</button>`;

            // Detaylar (HTML İnşaası - Eski Fonksiyonelliği Koru)
            // 1. Kaynak Etiketi
            let sourceBadge = "";
            if (tx.sourceTag && tx.sourceTag !== "direct") {
              sourceBadge = `<span style="background:#f3e8ff; color:#7c3aed; font-size:9px; padding:2px 6px; border-radius:4px; margin-left:5px; border:1px solid #ddd6fe;">🏷️ ${tx.sourceTag}</span>`;
            }

            // 2. Ürün Detayı
            let productsHTML = "";
            if (
              tx.itemsDetail &&
              Array.isArray(tx.itemsDetail) &&
              tx.itemsDetail.length > 0
            ) {
              let rows = "";
              tx.itemsDetail.forEach((item) => {
                let itemStatus =
                  item.status === "refunded"
                    ? '<span style="color:red; font-size:9px;">(İADE)</span>'
                    : '<span style="color:green; font-size:9px;">✔</span>';
                let itemStyle =
                  item.status === "refunded"
                    ? "text-decoration:line-through; color:#999;"
                    : "color:#333;";
                rows += `<tr>
                            <td style="border-bottom:1px dashed #eee; padding:5px 0; ${itemStyle} font-size:11px;">${item.qty}x ${item.name}</td>
                            <td style="border-bottom:1px dashed #eee; padding:5px 0; text-align:right; font-size:11px;">${parseFloat(item.unitPrice).toLocaleString()}₺</td>
                            <td style="border-bottom:1px dashed #eee; padding:5px 0; text-align:right;">${itemStatus}</td>
                        </tr>`;
              });
              productsHTML = `<div style="margin-top:10px; background:white; padding:10px; border-radius:8px; border:1px solid #e2e8f0;"><table style="width:100%; border-collapse:collapse;">${rows}</table></div>`;
            }

            // 3. Vergi Detayı
            let financeDetailHTML = "";
            if (tx.taxAmount && parseFloat(tx.taxAmount) !== 0) {
              let isKDV = (tx.taxType || "").includes("KDV");
              financeDetailHTML = `
                <div style="margin-top:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px; font-size:11px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:3px;"><span>Komisyon:</span><b>${parseFloat(tx.commissionAmount).toFixed(2)} ₺</b></div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:3px; color:${isKDV ? "#059669" : "#dc2626"}"><span>${tx.taxType}:</span><b>${isKDV ? "+" : "-"}${Math.abs(tx.taxAmount).toFixed(2)} ₺</b></div>
                    <div style="border-top:1px solid #ddd; margin-top:3px; padding-top:3px; display:flex; justify-content:space-between; font-weight:800;"><span>NET:</span><span>${parseFloat(tx.netPayout).toFixed(2)} ₺</span></div>
                </div>`;
            }

            // 4. Timeline ve Maturity
            let timelineHTML =
              tx.type === "sale_commission"
                ? generateTimelineHTML(tx.date, tx.status)
                : "";

            // Maturity (Vade) Kartı
            let maturityHTML = "";
            if (tx.status === "pending_maturity" && tx.maturityDateStr) {
              // Basit Vade Hesaplama
              let parts = tx.maturityDateStr.split(".");
              let target = new Date(parts[2], parts[1] - 1, parts[0]);
              let daysLeft = Math.ceil(
                (target - new Date()) / (1000 * 60 * 60 * 24),
              );
              maturityHTML = `<div style="margin-top:15px; background:#fffbeb; padding:10px; border-radius:6px; border:1px solid #fcd34d; font-size:12px; color:#b45309; display:flex; gap:10px; align-items:center;">
                    <i class="fas fa-hourglass-half"></i> <b>Serbest Kalmasına: ${daysLeft} Gün</b>
                 </div>`;
            }

            // --- HTML Item Oluştur ---
            historyHTML += `
                <div>
                    <div class="fin-item" onclick="var el = this.nextElementSibling; el.style.display = el.style.display === 'none' ? 'block' : 'none';">
                        <div style="display:flex; align-items:center;">
                            <div class="fin-icon-box ${iconClass}"><i class="fas ${iconSymbol}"></i></div>
                            <div>
                                <div style="font-weight:600; color:#1e293b; font-size:14px;">${txTitle} ${sourceBadge}</div>
                                <div style="font-size:11px; color:#94a3b8;">${tx.date} • #${tx.id.substring(0, 6)}</div>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-weight:700; color:${amountColor}; font-size:15px;">${sign}${amountText}</div>
                            <div style="font-size:10px; color:${tx.status === "paid" ? "#10b981" : "#f59e0b"}">${tx.status === "paid" ? "Tamamlandı" : tx.status.toUpperCase()}</div>
                        </div>
                    </div>
                    
                    <div class="fin-detail-box">
                        <div style="display:flex; gap:10px; margin-bottom:15px;">
                            ${receiptBtn} ${pdfBtn}
                        </div>
                        ${timelineHTML}
                        ${maturityHTML}
                        ${productsHTML}
                        ${financeDetailHTML}
                    </div>
                </div>
            `;
          });
        } else {
          historyHTML = `<div style="text-align:center; padding:40px; color:#94a3b8;">Henüz işlem geçmişi yok.</div>`;
        }

        // --- AKSİYON ALANI (FATURA / BİLGİ) ---
        let actionArea = "";
        if (accType === "company" && safeBalance >= 500) {
          actionArea = `
            <div style="background:#fff7ed; border:1px dashed #f97316; padding:15px; border-radius:12px; margin-bottom:30px; display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="background:#ffedd5; color:#c2410c; width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px;">📄</div>
                    <div>
                        <div style="font-weight:bold; color:#9a3412; font-size:13px;">FATURA YÜKLEMENİZ GEREKİYOR</div>
                        <div style="font-size:11px; color:#c2410c;">Ödeme için <b>${safeBalance.toLocaleString("tr-TR")} TL + KDV</b> fatura yükleyin.</div>
                    </div>
                </div>
                <button onclick="PartnerApp.uploadInvoice()" class="fin-btn fin-btn-primary" style="background:#ea580c;">Yükle</button> 
            </div>`;
        } else {
          actionArea = `
            <div style="background:#ecfdf5; border:1px dashed #10b981; padding:15px; border-radius:12px; margin-bottom:30px; display:flex; align-items:center; gap:15px;">
                <div style="background:#d1fae5; color:#047857; width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px;">🗓️</div>
                <div>
                    <div style="font-weight:bold; color:#065f46; font-size:13px;">HAFTALIK ÖDEME GÜNÜ: ÇARŞAMBA</div>
                    <div style="font-size:11px; color:#047857;">Bakiyeniz 500 TL üzerindeyse otomatik yatırılır.</div>
                </div>
            </div>`;
        }

        // --- HTML ÇIKTISI (RENDER) ---
        container.innerHTML = `
        ${css}
        
        <div style="animation: fadeInApp 0.5s ease-out;">
            <h3 style="margin:0 0 20px 0; color:#1e293b; font-size:18px;">Finans Merkezi</h3>

            <div class="fin-hero-grid">
                <div class="fin-card available">
                    <i class="fas fa-wallet fin-card-bg-icon"></i>
                    <div>
                        <div class="fin-chip"></div>
                        <div class="fin-label">ÇEKİLEBİLİR BAKİYE</div>
                        <div class="fin-amount p-stat-val" style="color:white;">${safeBalance.toLocaleString("tr-TR")} ₺</div>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div class="fin-status"><div style="width:6px; height:6px; background:#4ade80; border-radius:50%;"></div> Aktif</div>
                        <div style="font-size:24px; opacity:0.8;"><i class="fab fa-cc-visa"></i></div>
                    </div>
                </div>

                <div class="fin-card pending">
                    <i class="fas fa-hourglass-half fin-card-bg-icon"></i>
                    <div>
                        <div class="fin-chip"></div>
                        <div class="fin-label">14 GÜN BEKLEYEN</div>
                        <div class="fin-amount p-stat-val" style="color:white;">${pendingVal.toLocaleString("tr-TR")} ₺</div>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div class="fin-status"><div style="width:6px; height:6px; background:white; border-radius:50%;"></div> Bloke</div>
                        <div style="font-size:12px; opacity:0.9;">İade süresi dolunca aktarılır</div>
                    </div>
                </div>
            </div>

            ${actionArea}
            ${calendarHTML}

            <div class="fin-history-container">
                <div class="fin-history-header">
                    <div class="fin-history-title"><i class="fas fa-history" style="color:#64748b;"></i> Hesap Hareketleri</div>
                    <button onclick="PartnerApp.downloadPDFStatement()" class="fin-btn fin-btn-primary">
                        <i class="fas fa-file-pdf"></i> Ekstre İndir
                    </button>
                </div>
                <div>
                    ${historyHTML}
                </div>
            </div>
        </div>
        `;

        // Bakiyeyi tekrar güncelle (Garanti olsun)
        PartnerApp.updateBalanceDisplay(container);
      } catch (e) {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:red;">Veri yüklenirken hata oluştu: ${e.message}</div>`;
      }
    }, // --- FATURA YÜKLEME FONKSİYONU ---
    uploadInvoice: async function () {
      // Basit bir dosya seçtirme penceresi açar
      let input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.jpg,.png,.jpeg";

      input.onchange = async (e) => {
        let file = e.target.files[0];
        if (!file) return;

        // Dosya boyutu kontrolü (Örn: 5MB)
        if (file.size > 5 * 1024 * 1024)
          return alert("Dosya boyutu çok yüksek! (Max 5MB)");

        // Yükleniyor efekti verelim...
        alert("⏳ Fatura yükleniyor, lütfen bekleyiniz...");

        // Dosyayı Base64 formatına çevir (Sunucuya göndermek için)
        const reader = new FileReader();
        reader.onload = async function (evt) {
          const base64Data = evt.target.result;

          try {
            // Backend'e gönder (API_URL global değişkenini kullanır)
            // Not: Bu fonksiyonun çalışması için Backend'de 'upload_invoice' işleyicisi olması gerekir.
            // Şimdilik sadece frontend kısmını yapıyoruz.
            /* const res = await fetch(API_URL, {
                        method: "POST", 
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            islem: "upload_invoice", 
                            email: detectUser(), 
                            fileData: base64Data 
                        })
                    });
                    */

            // Şimdilik demo mesajı:
            alert(
              "✅ Faturanız başarıyla sisteme yüklendi! Finans ekibi Çarşamba günü kontrol edip ödemenizi yapacaktır.",
            );
          } catch (err) {
            alert("Yükleme sırasında hata oluştu.");
          }
        };
        reader.readAsDataURL(file);
      };
      input.click(); // Pencereyi aç
    },
    // 🔥 EKSİK OLAN FONKSİYON BURAYA EKLENECEK:
    updateBalanceDisplay: async function (container) {
      var email = detectUser(); // Kullanıcı emailini al
      if (!email) return;

      try {
        const res = await fetch("https://api-hjen5442oq-uc.a.run.app", {
          // API URL'ni kontrol et
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ islem: "get_partner_stats", email: email }),
        });
        const data = await res.json();
        if (data.success) {
          const balEl = container.querySelector(".p-stat-val");
          // Eğer element varsa bakiyeyi güncelle
          if (balEl)
            balEl.innerText =
              parseFloat(data.stats.balance).toLocaleString("tr-TR") + " ₺";
        }
      } catch (e) {
        console.log("Bakiye güncelleme hatası:", e);
      }
    },

    renderAcademy: async function (container) {
      container.innerHTML =
        '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Akademi Yükleniyor...</div>';

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ islem: "get_academy_lessons" }),
        }).then((r) => r.json());

        if (res.success) {
          // 🔥 KRİTİK: Veriyi Hafızaya Alıyoruz (Bozulmayı önlemek için)
          window.AcademyData = res.list || [];

          container.innerHTML = `
          <div style="background:#fff; border-left:4px solid #8b5cf6; padding:15px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.05); margin-bottom:20px;">
              <h3 style="margin:0 0 5px 0; font-size:16px; color:#1e293b;">🎓 Partner Akademisi</h3>
              <p style="margin:0; font-size:12px; color:#64748b; line-height:1.5;">
                  Satışlarınızı artırmak, daha çok kişiye ulaşmak ve sistemin inceliklerini öğrenmek için 
                  hazırladığımız eğitimleri buradan takip edebilirsiniz.
              </p>
          </div>
          <h3 style="margin:0 0 15px 0;">Dersler</h3>`;

          if (res.list.length === 0) {
            container.innerHTML +=
              "<div style='text-align:center; color:#999; padding:20px;'>Henüz eğitim eklenmemiş.</div>";
            return;
          }

          // 🔥 DÖNGÜDE ARTIK (index) KULLANIYORUZ
          res.list.forEach((l, index) => {
            let icon = "🎥";
            let actionText = "İZLE";
            let badgeColor = "#ef4444";

            // Tıklama aksiyonunu basitleştirdik: Sadece index gönderiyoruz
            let clickAction = "";

            if (l.type === "article") {
              icon = "📝";
              actionText = "OKU";
              badgeColor = "#3b82f6"; // Mavi
              // 🔥 Sadece sıra numarasını gönderiyoruz (index)
              clickAction = `PartnerApp.openArticleModal(${index})`;
            } else if (l.type === "pdf") {
              icon = "📄";
              actionText = "İNDİR";
              badgeColor = "#f59e0b"; // Turuncu
              clickAction = `window.open('${l.link}', '_blank')`;
            } else {
              // Video vb.
              clickAction = `window.open('${l.link}', '_blank')`;
            }

            container.innerHTML += `
          <div class="p-card" onclick="${clickAction}" style="cursor:pointer; display:flex; gap:15px; align-items:center; margin-bottom:10px;">
              <div style="width:50px; height:50px; background:${badgeColor}20; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:24px;">
                  ${icon}
              </div>
              <div style="flex:1;">
                  <div style="font-weight:bold; color:#1e293b; margin-bottom:2px;">${l.title}</div>
                  <p style="font-size:11px; color:#64748b; margin:0; line-height:1.3;">${l.description}</p>
              </div>
              <div style="font-size:10px; font-weight:bold; color:${badgeColor}; background:white; padding:5px 10px; border-radius:20px; border:1px solid ${badgeColor};">
                  ${actionText}
              </div>
          </div>
      `;
          });
        }
      } catch (e) {
        container.innerHTML = "Hata: " + e.message;
      }
    },

    // 🔥 YENİ: Hafızadan Okuyan Güvenli Modal
    openArticleModal: function (index) {
      // Hafızadaki veriyi al
      let lesson = window.AcademyData[index];
      if (!lesson) return alert("İçerik bulunamadı.");

      // Varolan modal varsa sil
      let old = document.getElementById("p-article-modal");
      if (old) old.remove();

      // İçeriği hazırla
      let title = lesson.title;
      let content = lesson.content;

      let html = `
<div id="p-article-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:2147483647; display:flex; justify-content:center; align-items:center; padding:20px;">
  <div style="background:white; width:100%; max-width:600px; max-height:80vh; border-radius:16px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 10px 40px rgba(0,0,0,0.5);">
      <div style="padding:15px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
          <h3 style="margin:0; font-size:18px; color:#1e293b;">${title}</h3>
          <span onclick="document.getElementById('p-article-modal').remove()" style="cursor:pointer; font-size:24px; color:#94a3b8;">&times;</span>
      </div>
      <div style="padding:20px; overflow-y:auto; line-height:1.6; color:#334155; font-size:14px;">
          ${content}
      </div>
      <div style="padding:15px; border-top:1px solid #eee; text-align:right; background:#f8fafc;">
          <button onclick="document.getElementById('p-article-modal').remove()" class="p-btn" style="width:auto; padding:8px 20px; background:#3b82f6; color:white; border-radius:8px;">Kapat</button>
      </div>
  </div>
</div>
`;
      document.body.insertAdjacentHTML("beforeend", html);
    },

    renderMarketing: async function (container) {
      container.innerHTML =
        '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Görseller yükleniyor...</div>';

      try {
        // Backend'den görselleri çekiyoruz
        const response = await fetch("https://api-hjen5442oq-uc.a.run.app", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ islem: "get_marketing_assets" }),
        });
        const res = await response.json();

        if (res.success) {
          // 🔥 YENİ BAŞLIK
          container.innerHTML = `
          <div style="background:#fff; border-left:4px solid #ef4444; padding:15px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.05); margin-bottom:20px;">
              <h3 style="margin:0 0 5px 0; font-size:16px; color:#1e293b;">🎨 Pazarlama Kiti</h3>
              <p style="margin:0; font-size:12px; color:#64748b; line-height:1.5;">
                  Sosyal medyada paylaşmak için hazırlanmış profesyonel görselleri buradan indirebilirsiniz. 
                  Story ve Post boyutları hazırdır.
              </p>
          </div>
          <h3 style="margin:0 0 15px 0;">Galeri</h3>`;

          if (!res.list || res.list.length === 0) {
            container.innerHTML += `<div style="text-align:center; color:#94a3b8; padding:20px;">Henüz görsel eklenmemiş.</div>`;
            return;
          }

          res.list.forEach((item) => {
            let badgeColor =
              item.type === "story"
                ? "#e1306c"
                : item.type === "post"
                  ? "#3b82f6"
                  : "#ef4444";
            let badgeText =
              item.type === "story"
                ? "STORY (9:16)"
                : item.type === "post"
                  ? "POST (1:1)"
                  : "BANNER";

            // Görsel Kartı HTML'i
            container.innerHTML += `
          <div class="p-card" style="padding:0; overflow:hidden; margin-bottom:15px;">
              <div style="position:relative; background:#f1f5f9; min-height:150px; display:flex; align-items:center; justify-content:center;">
                  <img src="${item.imageUrl}" style="width:100%; display:block; max-height:300px; object-fit:contain;">
                  <span style="position:absolute; top:10px; right:10px; background:${badgeColor}; color:white; font-size:10px; padding:3px 8px; border-radius:4px; font-weight:bold;">${badgeText}</span>
              </div>
              <div style="padding:15px;">
                  <div style="font-weight:bold; margin-bottom:10px; color:#334155;">${item.title}</div>
                  <button onclick="window.open('${item.imageUrl}', '_blank')" class="p-btn" style="background:#f8fafc; color:#334155; font-weight:600; border:1px solid #cbd5e1; width:100%;">
                      <i class="fas fa-download"></i> İndir / Görüntüle
                  </button>
              </div>
          </div>
      `;
          });
        }
      } catch (e) {
        container.innerHTML = `<div style="color:red; text-align:center;">Yükleme hatası: ${e.message}</div>`;
      }
    },

    // 🔥 YENİ: BİLDİRİM EKRANI
    renderNotifications: async function (container) {
      var email = detectUser();
      container.innerHTML =
        '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Bildirimler...</div>';

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            islem: "get_my_notifications",
            email: email,
          }), // Backend'de tanımladık
        }).then((r) => r.json());

        if (res.success) {
          container.innerHTML = `<h3 style="margin:0 0 15px 0;">🔔 Bildirimler</h3>`;
          if (res.list.length === 0)
            container.innerHTML +=
              "<div style='text-align:center; color:#999;'>Yeni bildirim yok.</div>";

          res.list.forEach((n) => {
            let icon =
              n.type === "sale" ? "💰" : n.type === "level_up" ? "🚀" : "📢";
            container.innerHTML += `
          <div class="p-card" style="padding:15px; border-left:4px solid #3b82f6;">
              <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                  <b style="color:#1e293b;">${icon} ${n.title}</b>
                  <span style="font-size:10px; color:#94a3b8;">${n.date}</span>
              </div>
              <div style="font-size:12px; color:#475569;">${n.message}</div>
          </div>
      `;
          });
        }
      } catch (e) {
        container.innerHTML = "Hata.";
      }
    },

    requestPayout: function () {
      var email = detectUser();
      // Bakiye bilgisini ekrandan veya cache'den alabiliriz ama backend zaten kontrol edecek.
      var amountStr = prompt(
        "Çekmek istediğiniz tutarı girin (Min 500 TL):",
        "500",
      );
      if (!amountStr) return;

      var amount = parseFloat(amountStr);
      if (isNaN(amount) || amount < 500)
        return alert("Geçersiz tutar veya 500 TL altı.");

      // Backend isteği
      fetchApi("request_payout", { email: email, amount: amount }).then(
        (res) => {
          if (res.success) {
            alert("✅ " + res.message);
            // Cüzdanı yenile
            ModumPartner.loadTab(
              "wallet",
              document.querySelector(".p-nav-item:nth-child(3)"),
            );
          } else {
            alert("❌ " + res.message);
          }
        },
      );
    }, // --- 🔥 VİTRİN / GÜNÜN FIRSATLARI (GÜNCELLENMİŞ) ---
    renderShowcase: async function (container) {
      container.innerHTML =
        '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Günün ürünleri hazırlanıyor...</div>';

      var pData = window.PartnerData || {};
      var myRefCode = pData.refCode || "REF-YOK";

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ islem: "get_showcase_products" }),
        });
        const data = await res.json();

        if (data.success && data.list.length > 0) {
          // 🔥 YENİ BAŞLIK VE AÇIKLAMA EKLENDİ
          container.innerHTML = `
            <div style="background:#fff; border-left:4px solid #f59e0b; padding:15px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.05); margin-bottom:20px;">
                <h3 style="margin:0 0 5px 0; font-size:16px; color:#1e293b;">🔥 Günün Vitrini</h3>
                <p style="margin:0; font-size:12px; color:#64748b; line-height:1.5;">
                    Sistem her gece en çok satan ve popüler ürünleri analiz ederek buraya getirir. 
                    Ne paylaşsam diye düşünme, buradan seç ve kazan!
                </p>
            </div>

            <div style="background:linear-gradient(to right, #f59e0b, #d97706); padding:15px; border-radius:12px; margin-bottom:15px; color:white; display:flex; align-items:center; justify-content:space-between;">
                <div>
                    <h3 style="margin:0; font-size:16px;">Bugünün Fırsatları</h3>
                    <div style="font-size:11px; opacity:0.9;">Bu ürünler bugün çok satıyor!</div>
                </div>
                <div style="font-size:24px;">🚀</div>
            </div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">`;

          let gridHtml = "";
          // --- ♻️ GÜNCELLENMİŞ KAZANÇ HESAPLAMA BLOĞU (Bunu Kopyala) ---
          data.list.forEach((p) => {
            // 1. Link Hazırlığı
            let shareLink =
              p.url + (p.url.includes("?") ? "&" : "?") + "ref=" + myRefCode;
            let safeProductData = encodeURIComponent(JSON.stringify(p));

            // 2. Partner Verileri
            let baseRate = parseFloat(pData.commission_rate || 10);
            let specialRates = pData.special_rates || {};

            // Ürün Kategorisi (Veri yoksa başlığa bakarak tahmin etmeye çalışsın - YEDEK PLAN)
            let prodCat = (p.category || p.title || "Genel").toLowerCase();

            let appliedRate = baseRate;
            let isSpecial = false;
            let matchReason = ""; // Hangi kelimeden yakaladığını görmek için

            // 🔥 AKILLI EŞLEŞTİRME DÖNGÜSÜ
            // Tanımlı tüm özel oranları tek tek kontrol et
            Object.keys(specialRates).forEach((key) => {
              let rateKey = key.toLowerCase(); // Örn: "kadın sandalet"
              let rateVal = parseFloat(specialRates[key]);

              // Eğer ürünün kategorisinde veya başlığında bu kelime geçiyorsa (Örn: "Sandalet")
              if (prodCat.includes(rateKey)) {
                // Ve bu oran, şu anki orandan yüksekse
                if (rateVal > appliedRate) {
                  appliedRate = rateVal;
                  isSpecial = true;
                  matchReason = key;
                }
              }
            });

            // KONSOLA YAZDIR (Hatayı görmek için F12'de bakabilirsin)
            if (isSpecial) {
              console.log(
                `🔥 Eşleşme Bulundu! Ürün: ${p.title} -> Kural: ${matchReason} -> Oran: %${appliedRate}`,
              );
            }

            // Tahmini Kazanç Hesabı
            let cleanPrice =
              parseFloat(
                p.price
                  .toString()
                  .replace(/[^0-9.,]/g, "")
                  .replace(",", "."),
              ) || 0;
            let potentialEarn = (cleanPrice * appliedRate) / 100;

            // Etiket HTML'i
            let badgeHtml = "";
            if (isSpecial) {
              badgeHtml = `
            <div style="position:absolute; top:10px; left:10px; background:linear-gradient(135deg, #f59e0b, #d97706); color:white; font-size:10px; padding:4px 8px; border-radius:4px; font-weight:bold; box-shadow:0 4px 10px rgba(245, 158, 11, 0.4); z-index:2;">
                🔥 %${appliedRate} KAZANÇ
            </div>
        `;
            }
            // ----------------------------------------

            gridHtml += `
    <div class="p-card" style="padding:0; margin:0; display:flex; flex-direction:column; border:${isSpecial ? "2px solid #f59e0b" : "1px solid #f1f5f9"}; position:relative;">
        
        ${badgeHtml} <div class="showcase-img-box" style="background: #fff;">
            <img src="${p.image}" class="showcase-img" style="width:100%; height:100%; object-fit:contain; padding:10px; box-sizing:border-box;">
            
            <div style="position:absolute; top:10px; right:10px; background:#ef4444; color:white; font-size:9px; padding:2px 6px; border-radius:4px; font-weight:bold; opacity:0.8;">
                Fırsat
            </div>
        </div>

        <div style="padding:12px; flex:1; display:flex; flex-direction:column; background:#fff; border-top:1px solid #f1f5f9;">
            <div style="font-weight:700; font-size:12px; color:#1e293b; margin-bottom:5px; line-height:1.4; height:34px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
                ${p.title}
            </div>
            
            <div style="margin-top:auto;">
                <div style="display:flex; justify-content:space-between; align-items:end; margin-bottom:10px;">
                    <div style="color:#10b981; font-weight:900; font-size:16px;">${p.price}</div>                    
                </div>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; margin-bottom:5px;">
                    <button class="p-btn" style="background:#f1f5f9; color:#334155; font-size:10px; padding:8px;" onclick="PartnerApp.openQuickLink('${p.url}', '${myRefCode}')">
                        <i class="fas fa-link"></i> Link
                    </button>
                    <button class="p-btn" style="background:#3b82f6; color:white; font-size:10px; padding:8px;" onclick="PartnerApp.openStoryEditor('${safeProductData}')">
                        <i class="fas fa-paint-brush"></i> Story
                    </button>
                </div>
                
                <a href="${shareLink}" target="_blank" class="p-btn" style="background:#1e293b; color:white; font-size:11px; width:100%; text-decoration:none; padding:8px; margin-top:0;">
                      <i class="fas fa-external-link-alt"></i> Ürüne Git
                </a>

            </div>
        </div>
    </div>`;
          });

          container.innerHTML += gridHtml + `</div>`;

          // Alt bilgi
          container.innerHTML += `<div style="text-align:center; margin-top:20px; font-size:11px; color:#94a3b8;">
                <i class="fas fa-sync"></i> Liste her gece 00:00'da yenilenir.
            </div>`;
        } else {
          container.innerHTML = `<div style="text-align:center; padding:20px; color:#999;">Bugün için vitrin oluşturulamadı.</div>`;
        }
      } catch (e) {
        container.innerHTML = "Hata: " + e.message;
      }
    }, // --- 🛍️ MAĞAZAM (KOLEKSİYON YÖNETİMİ - FİNAL DÜZELTİLMİŞ) ---
    renderMyCollection: async function (container) {
      container.innerHTML =
        '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Koleksiyonun yükleniyor...</div>';

      var pData = window.PartnerData || {};
      var myRefCode = pData.refCode;
      var collectionLink = "https://www.modum.tr/?koleksiyon=" + myRefCode;

      try {
        // Kendi koleksiyonunu çek
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            islem: "get_public_collection",
            refCode: myRefCode,
          }),
        }).then((r) => r.json());

        if (res.success) {
          const products = res.products || [];

          container.innerHTML = `
                    <div style="background:white; padding:20px; border-radius:12px; border-left:4px solid #3b82f6; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:20px;">
                        <h3 style="margin:0; color:#1e293b;">🛍️ Benim Sanal Mağazam</h3>
                        <p style="font-size:13px; color:#64748b; margin:5px 0 15px;">
                            Sitede gezerken "Koleksiyona Ekle" dediğin ürünler burada listelenir. (Linkler 30 Gün Geçerlidir)
                        </p>
                        
                        <div style="display:flex; gap:10px; background:#eff6ff; padding:10px; border-radius:8px; border:1px solid #dbeafe; align-items:center;">
                            <input type="text" value="${collectionLink}" readonly style="flex:1; background:transparent; border:none; font-family:monospace; color:#1e40af; outline:none;" onclick="this.select();">
                            
                            <button onclick="PartnerApp.openShareMenu('${collectionLink}', true)" class="p-btn" style="width:auto; padding:8px 20px; font-size:12px; background:#3b82f6; color:white; border:none; display:flex; align-items:center; gap:5px;">
                                <i class="fas fa-share-alt"></i> Paylaş
                            </button>
                        </div>
                    </div>

                    <h4 style="margin:0 0 15px 0; color:#334155;">Seçtiğin Ürünler (${products.length}/30)</h4>
                  `;

          if (products.length === 0) {
            container.innerHTML += `
                        <div style="text-align:center; padding:40px; background:#f8fafc; border-radius:12px; border:2px dashed #e2e8f0;">
                            <div style="font-size:40px; margin-bottom:10px;">🛒</div>
                            <div style="color:#64748b; font-weight:bold;">Henüz ürün eklemedin.</div>
                            <p style="font-size:12px; color:#94a3b8;">Siteye git, beğendiğin ürünlerdeki "Koleksiyona Ekle" butonuna bas.</p>
                            <a href="/" class="p-btn" style="width:auto; display:inline-block; margin-top:10px; background:#10b981; color:white; text-decoration:none;">Siteye Git</a>
                        </div>
                      `;
            return;
          }

          // Grid Başlangıcı
          let gridHtml = `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:15px;">`;

          products.forEach((p) => {
            // Ürün Datasını string olarak sakla (Silmek için)
            const pSafe = encodeURIComponent(
              JSON.stringify({
                id: p.id,
                title: p.title,
                image: p.image,
                price: p.price,
                url: p.url,
              }),
            );

            // 🔥 DÜZELTİLMİŞ KART YAPISI (DİKEY GÖRSEL)
            gridHtml += `
                        <div style="background:white; border-radius:8px; overflow:hidden; border:1px solid #e2e8f0; position:relative;">
                            <div style="position:relative; padding-top:150%; overflow:hidden; background:#fff;">
                                <img src="${p.image}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; padding:4px;">
                                <button onclick="PartnerApp.removeProductFromPanel('${pSafe}', this)" style="position:absolute; top:5px; right:5px; background:rgba(239,68,68,0.9); color:white; border:none; width:24px; height:24px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center;">&times;</button>
                            </div>
                            <div style="padding:10px;">
                                <div style="font-size:11px; font-weight:bold; color:#334155; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.title}</div>
                                <div style="font-size:12px; color:#10b981; font-weight:bold; margin-top:2px;">${p.price}</div>
                                <a href="${p.url}" target="_blank" style="display:block; margin-top:8px; font-size:10px; color:#3b82f6; text-decoration:none;">Ürüne Git &rarr;</a>
                            </div>
                        </div>
                      `;
          });

          gridHtml += `</div>`;
          container.innerHTML += gridHtml;
        } else {
          container.innerHTML = "Bir hata oluştu.";
        }
      } catch (e) {
        container.innerHTML = "Bağlantı hatası.";
      }
    },

    // Panelden Silme Fonksiyonu
    removeProductFromPanel: async function (pStr, btnEl) {
      if (!confirm("Bu ürünü koleksiyonundan çıkarmak istiyor musun?")) return;

      const p = JSON.parse(decodeURIComponent(pStr));
      const email = detectUser();

      // Butonu gizle (Hissiyat için)
      const card = btnEl.closest("div[style*='background:white']");
      card.style.opacity = "0.5";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          islem: "toggle_collection_product",
          email: email,
          product: p,
        }),
      }).then((r) => r.json());

      if (res.success && res.action === "removed") {
        card.remove(); // Kartı tamamen sil
      } else {
        alert("Hata: " + res.message);
        card.style.opacity = "1";
      }
    },
    downloadPDFStatement: async function () {
      var email = detectUser();
      var pData = window.PartnerData || {};
      var name = pData.name || "Sayın Ortağımız";

      const btn = event.target;
      const oldText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Hazırlanıyor...';
      btn.disabled = true;

      try {
        // 1. Verileri Çek
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ islem: "get_partner_history", email: email }),
        });
        const data = await res.json();

        if (!data.success || data.list.length === 0) {
          alert("Henüz raporlanacak işlem geçmişiniz yok.");
          btn.innerHTML = oldText;
          btn.disabled = false;
          return;
        }

        // 2. PDF Başlat
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const trFix = (str) => {
          if (!str) return "";
          return String(str)
            .replace(/Ğ/g, "G")
            .replace(/ğ/g, "g")
            .replace(/Ü/g, "U")
            .replace(/ü/g, "u")
            .replace(/Ş/g, "S")
            .replace(/ş/g, "s")
            .replace(/İ/g, "I")
            .replace(/ı/g, "i")
            .replace(/Ö/g, "O")
            .replace(/ö/g, "o")
            .replace(/Ç/g, "C")
            .replace(/ç/g, "c");
        };

        // 1. Header (Kurumsal Başlık)
        doc.setFillColor(30, 41, 59); // Lacivert
        doc.rect(0, 0, 210, 40, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("MODUMNET", 15, 20);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("PARTNER HESAP EKSTRESI", 15, 28);

        // Tarih ve Bilgi
        doc.text(
          trFix(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`),
          195,
          20,
          { align: "right" },
        );
        doc.text(trFix(`Ortak: ${name}`), 195, 28, { align: "right" });

        // 2. Özet Tablosu (Toplam Kazanç / Ödenen)
        let totalEarned = 0;
        let totalPaid = 0;

        let tableRows = [];
        data.list.forEach((tx) => {
          let amount = parseFloat(tx.commission || tx.amount || 0);
          if (tx.type === "sale_commission" && tx.status !== "refunded")
            totalEarned += amount;
          if (tx.type === "payout_request" && tx.status === "paid")
            totalPaid += amount;

          // Tablo Satırı Hazırla
          let typeStr = tx.type === "payout_request" ? "ODEME" : "SATIS";
          let statusStr =
            tx.status === "paid"
              ? "ODENDI"
              : tx.status === "refunded"
                ? "IADE"
                : "ONAYLI";
          let sign = tx.type === "payout_request" ? "-" : "+";

          tableRows.push([
            tx.date,
            typeStr,
            trFix(tx.desc),
            statusStr,
            sign + amount.toFixed(2) + " TL",
          ]);
        });

        // Özet Kutusu
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("HESAP OZETI", 15, 55);

        doc.setDrawColor(200, 200, 200);
        doc.line(15, 58, 195, 58);

        doc.setFontSize(10);
        doc.text(trFix("Toplam Kazanilan Komisyon:"), 15, 65);
        doc.text(`${totalEarned.toFixed(2)} TL`, 80, 65, { align: "right" });

        doc.text(trFix("Hesaba Yatan Tutar:"), 15, 72);
        doc.text(`${totalPaid.toFixed(2)} TL`, 80, 72, { align: "right" });

        doc.setFont("helvetica", "bold");
        doc.text(trFix("Guncel Bakiye:"), 15, 79);
        doc.setTextColor(0, 150, 0);
        doc.text(`${(totalEarned - totalPaid).toFixed(2)} TL`, 80, 79, {
          align: "right",
        });

        // 3. Detaylı Tablo
        doc.autoTable({
          startY: 90,
          head: [["Tarih", "Islem", "Aciklama", "Durum", "Tutar"]],
          body: tableRows,
          theme: "striped",
          headStyles: { fillColor: [30, 41, 59], textColor: 255 },
          styles: { fontSize: 8, cellPadding: 3 },
          alternateRowStyles: { fillColor: [245, 247, 250] },
        });

        // Footer
        let finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.setFont("helvetica", "italic");
        doc.text(
          trFix(
            "Bu belge ModumNet is ortakligi sistemi tarafindan otomatik uretilmistir.",
          ),
          105,
          finalY,
          { align: "center" },
        );

        doc.save(`Modum_Ekstre_${new Date().toISOString().slice(0, 10)}.pdf`);
      } catch (e) {
        console.error("PDF Hatası:", e);
        alert("PDF oluşturulurken hata: " + e.message);
      } finally {
        btn.innerHTML = oldText;
        btn.disabled = false;
      }
    }, // 🔥 VİTRİN İÇİN HIZLI LİNK OLUŞTURUCU (MODAL)
    openQuickLink: function (url, refCode) {
      // Eski modal varsa sil
      let old = document.getElementById("p-quick-link-modal");
      if (old) old.remove();

      let html = `
        <div id="p-quick-link-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:2147483647; display:flex; justify-content:center; align-items:center; padding:20px;">
            <div style="background:white; width:100%; max-width:300px; border-radius:12px; padding:20px; box-shadow:0 10px 40px rgba(0,0,0,0.3); text-align:center;">
                <h4 style="margin:0 0 15px 0; color:#1e293b;">Nerede Paylaşacaksın?</h4>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
                    <button onclick="PartnerApp.copyFinalLink('${url}', '${refCode}', 'instagram_story')" class="p-btn" style="background:#e1306c; color:white; font-size:12px;"><i class="fab fa-instagram"></i> Story</button>
                    <button onclick="PartnerApp.copyFinalLink('${url}', '${refCode}', 'whatsapp')" class="p-btn" style="background:#25D366; color:white; font-size:12px;"><i class="fab fa-whatsapp"></i> WP</button>
                    <button onclick="PartnerApp.copyFinalLink('${url}', '${refCode}', 'telegram')" class="p-btn" style="background:#229ED9; color:white; font-size:12px;"><i class="fab fa-telegram"></i> TG</button>
                    <button onclick="PartnerApp.copyFinalLink('${url}', '${refCode}', 'other')" class="p-btn" style="background:#334155; color:white; font-size:12px;">Diğer</button>
                </div>

                <div onclick="document.getElementById('p-quick-link-modal').remove()" style="font-size:12px; color:#94a3b8; cursor:pointer;">İptal</div>
            </div>
        </div>
        `;
      document.body.insertAdjacentHTML("beforeend", html);
    },

    // Son Aşamada Kopyalama Yapan Fonksiyon
    copyFinalLink: function (url, refCode, source) {
      // Linke Source Ekle
      let separator = url.includes("?") ? "&" : "?";
      let finalLink = url + separator + "ref=" + refCode + "&source=" + source;

      // Kopyala
      navigator.clipboard.writeText(finalLink).then(() => {
        alert("✅ Link Kopyalandı! (" + source + ")");
        document.getElementById("p-quick-link-modal").remove();
      });
    }, // --- 🔥 ÜRÜNÜ KOLEKSİYONA EKLE (SCRAPER) ---
    toggleCollectionItem: async function () {
      const btn = event.target.closest("button"); // Tıklanan butonu bul
      const oldHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      try {
        // 1. Sayfadan Veri Kazıma (Faprika Standartları & Meta Taglar)
        const getMeta = (prop) => {
          const el =
            document.querySelector(`meta[property="${prop}"]`) ||
            document.querySelector(`meta[name="${prop}"]`);
          return el ? el.content : "";
        };

        let pTitle = getMeta("og:title") || document.title;
        let pImage = getMeta("og:image");
        let pUrl = getMeta("og:url") || window.location.href.split("?")[0];

        // Fiyatı bulmak
        let pPrice = getMeta("product:price:amount");
        if (!pPrice) {
          // Yedek: HTML'den oku
          const priceEl =
            document.querySelector(".product-price") ||
            document.querySelector(".current-price") ||
            document.querySelector(".fiyat");
          if (priceEl) pPrice = priceEl.innerText.replace(/[^0-9,.]/g, "");
        }
        if (!pPrice) pPrice = "0";

        // ID Bulma
        let pId = "";
        const urlParts = pUrl.split("-");
        const possibleId = urlParts[urlParts.length - 1].replace("/", "");
        // Eğer ID sayıysa al, değilse URL'i ID yap
        pId = !isNaN(possibleId) && possibleId.length > 0 ? possibleId : pUrl;

        // Veriyi hazırla
        const productData = {
          id: pId,
          title: pTitle,
          image: pImage,
          price: pPrice.includes("TL") ? pPrice : pPrice + " TL",
          url: pUrl,
        };

        // 2. Backend'e Gönder
        // Not: detectUser() fonksiyonunun yukarıda tanımlı olduğundan emin ol
        const email = detectUser();

        // API_URL değişkeninin globalde tanımlı olduğunu varsayıyoruz
        // (Dosyanın en başında var: var API_URL = "...")
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            islem: "toggle_collection_product",
            email: email,
            product: productData,
          }),
        }).then((r) => r.json());

        if (res.success) {
          if (res.action === "added") {
            btn.style.background = "#ef4444";
            btn.style.borderColor = "#b91c1c";
            btn.innerHTML =
              '<i class="fas fa-minus-circle"></i> <span class="hide-mobile">Koleksiyondan</span> Çıkar';
            // Küçük bir bildirim (Toast) gösterebiliriz ama alert yeterli şimdilik
            alert("✅ Ürün koleksiyonuna eklendi!");
          } else {
            btn.style.background = "#f59e0b";
            btn.style.borderColor = "#d97706";
            btn.innerHTML =
              '<i class="fas fa-plus-circle"></i> <span class="hide-mobile">Koleksiyona</span> Ekle';
            alert("🗑️ Ürün koleksiyondan çıkarıldı.");
          }
        } else {
          alert("Hata: " + res.message);
          btn.innerHTML = oldHtml;
        }
      } catch (e) {
        console.error(e);
        alert(
          "Ürün bilgisi alınamadı. Lütfen sayfayı yenileyip tekrar deneyin.",
        );
        btn.innerHTML = oldHtml;
      } finally {
        btn.disabled = false;
      }
    }, // --- 🔥 AKILLI PAYLAŞIM MENÜSÜ ---
    openShareMenu: function (baseUrl, isCollection = false) {
      // Eski modal varsa sil
      let old = document.getElementById("mdm-share-modal");
      if (old) old.remove();

      let title = isCollection ? "Mağaza Linkini Paylaş" : "Bu Ürünü Paylaş";

      let html = `
          <div id="mdm-share-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:2147483650; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(5px);">
              <div style="background:white; width:100%; max-width:320px; border-radius:16px; padding:25px; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.5);">
                  
                  <h3 style="margin:0 0 10px 0; color:#1e293b;">${title}</h3>
                  <p style="font-size:13px; color:#64748b; margin-bottom:20px;">
                      Nerede paylaşacağını seç, sana özel linki oluşturalım.(Linkler 30 gün Geçerlidir.)
                  </p>

                  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
                      <button onclick="PartnerApp.copySmartLink('${baseUrl}', 'instagram')" class="p-btn" style="background:#fdf2f8; color:#be185d; border:1px solid #fbcfe8; flex-direction:column; padding:15px; font-size:12px;">
                          <i class="fab fa-instagram" style="font-size:24px; margin-bottom:5px;"></i> Instagram
                      </button>
                      
                      <button onclick="PartnerApp.copySmartLink('${baseUrl}', 'whatsapp')" class="p-btn" style="background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; flex-direction:column; padding:15px; font-size:12px;">
                          <i class="fab fa-whatsapp" style="font-size:24px; margin-bottom:5px;"></i> WhatsApp
                      </button>
                      
                      <button onclick="PartnerApp.copySmartLink('${baseUrl}', 'tiktok')" class="p-btn" style="background:#000000; color:white; border:1px solid #333; flex-direction:column; padding:15px; font-size:12px;">
                          <i class="fab fa-tiktok" style="font-size:24px; margin-bottom:5px;"></i> TikTok
                      </button>

                      <button onclick="PartnerApp.copySmartLink('${baseUrl}', 'telegram')" class="p-btn" style="background:#f0f9ff; color:#0369a1; border:1px solid #bae6fd; flex-direction:column; padding:15px; font-size:12px;">
                          <i class="fab fa-telegram" style="font-size:24px; margin-bottom:5px;"></i> Telegram
                      </button>

                      <button onclick="PartnerApp.copySmartLink('${baseUrl}', 'youtube')" class="p-btn" style="background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; flex-direction:column; padding:15px; font-size:12px;">
                          <i class="fab fa-youtube" style="font-size:24px; margin-bottom:5px;"></i> YouTube
                      </button>

                      <button onclick="PartnerApp.copySmartLink('${baseUrl}', 'other')" class="p-btn" style="background:#f8fafc; color:#475569; border:1px solid #e2e8f0; flex-direction:column; padding:15px; font-size:12px;">
                          <i class="fas fa-link" style="font-size:24px; margin-bottom:5px;"></i> Diğer
                      </button>
                  </div>
                  
                  <div onclick="document.getElementById('mdm-share-modal').remove()" style="cursor:pointer; color:#94a3b8; font-size:13px; text-decoration:underline;">Vazgeç</div>
              </div>
          </div>
          `;
      document.body.insertAdjacentHTML("beforeend", html);
    },

    // --- LİNKİ OLUŞTUR VE KOPYALA ---
    copySmartLink: function (url, source) {
      var pData = window.PartnerData || {};
      var myRefCode = pData.refCode;

      // URL Temizliği (Eski parametreleri kaldırabiliriz ama şimdilik ekleyelim)
      // Eğer URL zaten bir parametre içeriyorsa (örn: ?koleksiyon=...), '&' ile ekle
      // İçermiyorsa '?' ile ekle
      var separator = url.includes("?") ? "&" : "?";

      // Eğer URL'de zaten 'ref=' varsa, onu tekrar eklemeyelim, sadece source ekleyelim
      var finalLink = url;

      if (!url.includes("ref=")) {
        finalLink += separator + "ref=" + myRefCode;
        separator = "&"; // Artık bir sonraki parametre '&' ile gelecek
      }

      finalLink += separator + "source=" + source;

      // Panoya Kopyala
      navigator.clipboard.writeText(finalLink).then(() => {
        // Modalı kapat
        document.getElementById("mdm-share-modal").remove();

        // Başarı mesajı (Toast gibi)
        alert(
          `✅ Link Kopyalandı!\n\nKaynak: ${source.toUpperCase()}\n\nBunu ${source} üzerinde paylaşabilirsin.`,
        );
      });
    }, // --- 👤 PROFİL & KYC YÖNETİMİ (AKILLI VERSİYON - BANKA & SÜRE KONTROLLÜ) ---
    renderProfile: async function (container) {
      container.innerHTML =
        '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Profil yükleniyor...</div>';

      var email = detectUser();

      // Verileri taze çek
      try {
        const res = await fetch("https://api-hjen5442oq-uc.a.run.app", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ islem: "get_partner_stats", email: email }),
        });
        const data = await res.json();
        window.PartnerData = data.stats;
      } catch (e) {
        console.log(e);
      }

      var pData = window.PartnerData || {};

      // KYC ve Şirket Durumu
      let kycStatus = pData.kycStatus || "none";
      let isCompany = pData.accountType === "company";
      let accountLabel = isCompany ? "🏢 KURUMSAL HESAP" : "👤 BİREYSEL HESAP";

      // 30 Gün Kilidi Kontrolü
      let lastUpdate = pData.lastProfileUpdate || 0;
      let now = Date.now();
      let diffDays = (now - lastUpdate) / (1000 * 60 * 60 * 24);
      let isLocked = diffDays < 30;
      let remainingDays = Math.ceil(30 - diffDays);

      // Değerler
      let valPhone = pData.phone || "";
      let fullBankInfo = pData.bank_info || "";

      // Banka Adı ve IBAN Ayrıştırma (Örn: "Garanti - TR..." ise ayır)
      let selectedBank = "Garanti";
      let valIban = fullBankInfo;

      if (fullBankInfo.includes(" - ")) {
        let parts = fullBankInfo.split(" - ");
        selectedBank = parts[0];
        valIban = parts[1];
      }

      let valTax = isCompany ? pData.taxInfo || "" : pData.tckn || "";

      // Kilit Mesajı
      let lockMsg = isLocked
        ? `<div style="background:#fff7ed; color:#c2410c; padding:10px; font-size:11px; border-radius:6px; margin-bottom:15px; border:1px solid #fdba74;">
                 <i class="fas fa-lock"></i> Bilgilerinizi güvenlik nedeniyle <b>${remainingDays} gün</b> sonra güncelleyebilirsiniz.
               </div>`
        : `<div style="background:#f0fdf4; color:#15803d; padding:10px; font-size:11px; border-radius:6px; margin-bottom:15px; border:1px solid #bbf7d0;">
                 <i class="fas fa-lock-open"></i> Bilgileriniz güncellenebilir durumda.
               </div>`;

      // Input Durumu
      let disabledAttr = isLocked
        ? 'disabled style="background:#f3f4f6; color:#9ca3af;"'
        : "";
      let btnStyle = isLocked
        ? "background:#9ca3af; cursor:not-allowed;"
        : "background:#3b82f6;";
      let btnText = isLocked
        ? `Kilitli (${remainingDays} Gün)`
        : '<i class="fas fa-save"></i> Bilgileri Kaydet';
      let btnAction = isLocked ? "" : 'onclick="PartnerApp.saveProfile()"';

      // Stil
      const style = `
        <style>
            .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            @media (max-width: 768px) {
                .profile-grid { grid-template-columns: 1fr !important; }
                .p-card { padding: 15px !important; }
            }
            .inp-row { margin-bottom:15px; }
            .inp-label { font-size:10px; color:#64748b; font-weight:bold; display:block; margin-bottom:4px; }
            .inp-field { width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; box-sizing:border-box; }
        </style>
        `;

      container.innerHTML =
        style +
        `
            <div style="background:#fff; border-left:4px solid #3b82f6; padding:15px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.05); margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3 style="margin:0 0 5px 0; font-size:16px; color:#1e293b;">${accountLabel}</h3>
                    <p style="margin:0; font-size:12px; color:#64748b;">Kişisel ve yasal bilgileriniz.</p>
                </div>
            </div>

            <div class="profile-grid">
                <div class="p-card" style="padding:20px;">
                    <h4 style="margin:0 0 15px 0; border-bottom:1px solid #eee; padding-bottom:10px;">Kimlik & İletişim</h4>
                    
                    ${lockMsg}

                    <div class="inp-row">
                        <label class="inp-label">AD SOYAD / ÜNVAN</label>
                        <input type="text" value="${pData.name}" disabled class="inp-field" style="background:#f1f5f9;">
                    </div>

                    <div class="inp-row">
                        <label class="inp-label">E-POSTA</label>
                         <input type="text" value="${email}" disabled class="inp-field" style="background:#f1f5f9;">
                    </div>

                    <div class="inp-row">
                        <label class="inp-label">TELEFON (Zorunlu)</label>
                        <input type="text" id="edit-phone" value="${valPhone}" placeholder="0555..." class="inp-field" ${disabledAttr}>
                    </div>

                     <div class="inp-row">
                        <label class="inp-label">${isCompany ? "VERGİ DAİRESİ / NO" : "TC KİMLİK NO"}</label>
                        <input type="text" id="edit-tax" value="${valTax}" placeholder="${isCompany ? "Daire / No" : "11 Haneli TCKN"}" class="inp-field" ${disabledAttr}>
                    </div>

                    <div class="inp-row">
                        <label class="inp-label">BANKA BİLGİLERİ</label>
                        <div style="display:grid; grid-template-columns: 1fr 2fr; gap:10px;">
                            <select id="edit-bank-name" class="inp-field" ${disabledAttr}>
                                <option value="Garanti" ${selectedBank.includes("Garanti") ? "selected" : ""}>Garanti</option>
                                <option value="Ziraat" ${selectedBank.includes("Ziraat") ? "selected" : ""}>Ziraat</option>
                                <option value="IsBank" ${selectedBank.includes("İş") || selectedBank.includes("Is") ? "selected" : ""}>İş Bankası</option>
                                <option value="Akbank" ${selectedBank.includes("Akbank") ? "selected" : ""}>Akbank</option>
                                <option value="YapiKredi" ${selectedBank.includes("Yapı") ? "selected" : ""}>Yapı Kredi</option>
                                <option value="Finans" ${selectedBank.includes("Finans") ? "selected" : ""}>QNB Finans</option>
                                <option value="Diger" ${selectedBank.includes("Diger") ? "selected" : ""}>Diğer</option>
                            </select>
                            <input type="text" id="edit-iban" value="${valIban}" placeholder="TR..." maxlength="32" class="inp-field" ${disabledAttr}>
                        </div>
                    </div>

                    <button ${btnAction} class="p-btn" style="${btnStyle} color:white; margin-top:10px;">
                        ${btnText}
                    </button>
                </div>

                <div class="p-card" style="padding:20px;">
                    <div style="border-bottom:1px solid #eee; padding-bottom:10px; margin-bottom:15px;">
                        <h4 style="margin:0;">Belge Yükleme</h4>
                    </div>
                    <p style="font-size:11px; color:#666; margin-bottom:15px;">
                        ${isCompany ? "Kurumsal hesaplar için Vergi Levhası zorunludur." : "Ödeme alabilmek için Kimlik Ön/Arka yüzünü yüklemelisiniz."}
                    </p>
                    
                    ${this.renderKycSection(pData, isCompany)} 
                </div>
            </div>
        `;
    },

    // --- KYC HTML YARDIMCISI (DÜZELTİLMİŞ) ---
    renderKycSection: function (pData, isCompany) {
      let kycStatus = pData.kycStatus || "none";

      // Onaylandıysa sadece başarı mesajı göster
      if (kycStatus === "verified") {
        return '<div style="background:#f0fdf4; color:#166534; padding:15px; border-radius:8px; text-align:center;"><i class="fas fa-check-circle" style="font-size:24px; margin-bottom:5px;"></i><br>Tüm belgeleriniz onaylandı.<br>Ödeme alabilirsiniz.</div>';
      }

      // Değişkenleri Hazırla
      let docLabel1 = isCompany ? "Vergi Levhası (Zorunlu)" : "Kimlik Ön Yüzü";
      let docType1 = isCompany ? "tax_plate" : "id_front";

      let docLabel2 = isCompany
        ? "İmza Sirküleri (Opsiyonel)"
        : "Kimlik Arka Yüzü";
      let docType2 = isCompany ? "signature_circular" : "id_back";

      // Durum Mesajı
      let statusMsg = "";
      if (kycStatus === "pending") {
        statusMsg =
          '<div style="background:#fffbeb; color:#b45309; padding:10px; border-radius:6px; margin-bottom:15px; font-size:11px; border:1px solid #fcd34d;"><i class="fas fa-clock"></i> Belgeleriniz inceleniyor. Eksik belgeniz varsa yüklemeye devam edebilirsiniz.</div>';
      }
      if (pData.kycRejectionReason) {
        statusMsg = `<div style="background:#fee2e2; color:#991b1b; padding:10px; border-radius:6px; margin-bottom:15px; font-size:11px; border:1px solid #fca5a5;"><i class="fas fa-exclamation-circle"></i> <b>Red Nedeni:</b> ${pData.kycRejectionReason}</div>`;
      }

      return `
            ${statusMsg}

            <div style="margin-bottom:15px; border:1px dashed #cbd5e1; padding:10px; border-radius:8px; background:#fff;">
                <label style="font-size:11px; font-weight:bold; display:block; margin-bottom:5px; color:#334155;">📄 ${docLabel1}</label>
                <input type="file" id="kyc-file-1" accept="image/*" style="font-size:12px; width:100%;">
                <button onclick="PartnerApp.uploadDoc('${docType1}', 'kyc-file-1')" class="p-btn" style="background:#1e293b; color:white; padding:6px 12px; font-size:11px; width:auto; display:inline-block; margin-top:8px;">Yükle / Güncelle</button>
            </div>

            <div style="margin-bottom:15px; border:1px dashed #cbd5e1; padding:10px; border-radius:8px; background:#fff;">
                 <label style="font-size:11px; font-weight:bold; display:block; margin-bottom:5px; color:#334155;">📄 ${docLabel2}</label>
                <input type="file" id="kyc-file-2" accept="image/*" style="font-size:12px; width:100%;">
                 <button onclick="PartnerApp.uploadDoc('${docType2}', 'kyc-file-2')" class="p-btn" style="background:#1e293b; color:white; padding:6px 12px; font-size:11px; width:auto; display:inline-block; margin-top:8px;">Yükle / Güncelle</button>
            </div>
        `;
    },

    // --- PROFİL KAYDETME FONKSİYONU (GÜNCELLENMİŞ) ---
    saveProfile: async function () {
      const btn = event.target;
      const oldText = btn.innerHTML;

      // 1. Validasyon
      const phone = document.getElementById("edit-phone").value;
      const tax = document.getElementById("edit-tax").value;
      const bankName = document.getElementById("edit-bank-name").value;
      const iban = document.getElementById("edit-iban").value;

      if (!phone || phone.length < 10)
        return alert("Lütfen geçerli bir telefon numarası giriniz.");
      if (!tax || tax.length < 5)
        return alert("Lütfen TCKN veya Vergi Numarasını giriniz.");
      if (!iban || !iban.toUpperCase().startsWith("TR") || iban.length < 10)
        return alert("Lütfen geçerli bir TR IBAN giriniz.");

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kaydediliyor...';
      btn.disabled = true;

      var pData = window.PartnerData || {};
      var isCompany = pData.accountType === "company";

      // Banka bilgisini birleştir
      const fullBankInfo = `${bankName} - ${iban.toUpperCase()}`;

      const payload = {
        islem: "update_own_profile",
        email: detectUser(),
        phone: phone,
        bankInfo: fullBankInfo,
        tckn: !isCompany ? tax : null,
        taxInfo: isCompany ? tax : null,
      };

      try {
        const res = await fetch("https://api-hjen5442oq-uc.a.run.app", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then((r) => r.json());

        if (res.success) {
          alert("✅ " + res.message);
          // Ekranı yenile
          this.loadTab(
            "profile",
            document.querySelector(".p-nav-item[onclick*='profile']"),
          );
        } else {
          alert("Uyarı: " + res.message);
        }
      } catch (e) {
        alert("Bağlantı hatası.");
      } finally {
        btn.innerHTML = oldText;
        btn.disabled = false;
      }
    },

    // --- BELGE YÜKLEME (AYNI KALIYOR) ---
    uploadDoc: async function (type, inputId) {
      const input = document.getElementById(inputId);
      if (!input.files || !input.files[0])
        return alert("Lütfen bir dosya seçin.");

      const file = input.files[0];
      const btn = event.target;
      const oldText = btn.innerText;
      btn.innerText = "Yükleniyor %0...";
      btn.disabled = true;

      // Resmi Küçült
      const resizeImage = (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              let width = img.width;
              let height = img.height;
              if (width > height) {
                if (width > 1000) {
                  height *= 1000 / width;
                  width = 1000;
                }
              } else {
                if (height > 1000) {
                  width *= 1000 / height;
                  height = 1000;
                }
              }
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.8));
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        });
      };

      try {
        const base64 = await resizeImage(file);
        btn.innerText = "Gönderiliyor...";

        const res = await fetch("https://api-hjen5442oq-uc.a.run.app", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            islem: "upload_kyc_document",
            email: detectUser(),
            fileBase64: base64,
            fileType: type,
          }),
        }).then((r) => r.json());

        if (res.success) {
          alert("✅ Belge başarıyla gönderildi!");
          this.loadTab(
            "profile",
            document.querySelector(".p-nav-item:nth-child(8)"),
          );
        } else {
          alert("Hata: " + res.message);
        }
      } catch (e) {
        alert("Yükleme hatası: " + e);
      } finally {
        btn.innerText = oldText;
        btn.disabled = false;
      }
    }, // --- 🚀 GÖREVLER VE HEDEFLER SEKMESİ (V2 - HAVALI TASARIM) ---
    renderTasks: async function (container) {
      container.innerHTML =
        '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Hedefler yükleniyor...</div>';
      var email = detectUser();

      try {
        const res = await fetch("https://api-hjen5442oq-uc.a.run.app", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ islem: "get_my_tasks", email: email }),
        }).then((r) => r.json());

        if (res.success) {
          // Şık Başlık Alanı
          container.innerHTML = `
                    <div style="background:linear-gradient(135deg, #0f172a, #1e293b); color:white; padding:25px; border-radius:16px; margin-bottom:25px; position:relative; overflow:hidden; box-shadow:0 10px 30px rgba(15, 23, 42, 0.4);">
                        <div style="position:absolute; top:-20px; right:-20px; font-size:100px; opacity:0.1;">🎯</div>
                        <h3 style="margin:0 0 5px 0; font-size:20px;">Görev Merkezi</h3>
                        <p style="margin:0; font-size:13px; opacity:0.8; max-width:80%;">
                            Hedefleri tamamla, bonusları kap! Kazancını katla.
                        </p>
                    </div>
                `;

          if (res.list.length === 0) {
            container.innerHTML += `
                        <div style="text-align:center; padding:50px; background:white; border-radius:16px; border:1px dashed #cbd5e1;">
                            <div style="font-size:40px; margin-bottom:10px; opacity:0.5;">💤</div>
                            <div style="color:#64748b; font-weight:bold;">Şu an aktif görev yok</div>
                            <div style="font-size:12px; color:#94a3b8;">Yeni görevler eklendiğinde burada görünecek.</div>
                        </div>`;
            return;
          }

          let gridHtml = `<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">`;

          res.list.forEach((t) => {
            let isDone = t.isCompleted;

            // Renk Paleti (Gradyanlar)
            let bgStyle = isDone
              ? "background:linear-gradient(135deg, #059669, #10b981);" // Yeşil (Tamamlandı)
              : "background:white;";

            let titleColor = isDone ? "white" : "#1e293b";
            let descColor = isDone ? "rgba(255,255,255,0.9)" : "#64748b";
            let barBg = isDone ? "rgba(255,255,255,0.3)" : "#f1f5f9";
            let barFill = isDone
              ? "white"
              : "linear-gradient(90deg, #3b82f6, #8b5cf6)";

            // İkon Seçimi
            let typeIcon = t.type === "revenue" ? "💰" : "📦";

            // Buton / Etiket
            let footerContent = "";
            if (isDone) {
              footerContent = `
                            <div style="margin-top:15px; background:rgba(255,255,255,0.2); padding:10px; border-radius:8px; text-align:center; color:white; font-weight:bold; font-size:13px; display:flex; align-items:center; justify-content:center; gap:8px;">
                                <i class="fas fa-check-circle"></i> ÖDÜL CÜZDANDA
                            </div>
                        `;
            } else {
              footerContent = `
                            <div style="margin-top:15px; display:flex; justify-content:space-between; font-size:11px; color:${descColor};">
                                <span>İlerleme: <b>${t.current} / ${t.target}</b></span>
                                <span>Kalan: <b>${(t.target - t.current).toFixed(0)}</b></span>
                            </div>
                            <div style="width:100%; height:8px; background:${barBg}; border-radius:10px; overflow:hidden; margin-top:5px;">
                                <div style="width:${t.percent}%; height:100%; background:${barFill}; transition:width 1s cubic-bezier(0.4, 0, 0.2, 1); border-radius:10px;"></div>
                            </div>
                        `;
            }

            gridHtml += `
                        <div class="p-card" style="${bgStyle} padding:20px; border-radius:16px; border:1px solid rgba(0,0,0,0.05); box-shadow:0 4px 6px rgba(0,0,0,0.02); position:relative; overflow:hidden; transition:transform 0.2s;">
                            
                            ${
                              !isDone
                                ? `<div style="position:absolute; top:15px; right:15px; background:#fef3c7; color:#d97706; padding:4px 10px; border-radius:20px; font-size:10px; font-weight:bold; display:flex; align-items:center; gap:4px;">
                                <i class="fas fa-clock"></i> ${t.remaining}
                            </div>`
                                : ""
                            }

                            <div style="display:flex; align-items:center; gap:15px; margin-bottom:10px;">
                                <div style="width:50px; height:50px; background:${isDone ? "rgba(255,255,255,0.2)" : "#eff6ff"}; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:24px;">
                                    ${typeIcon}
                                </div>
                                <div>
                                    <h4 style="margin:0; color:${titleColor}; font-size:16px;">${t.title}</h4>
                                    <div style="font-size:12px; font-weight:bold; color:${isDone ? "white" : "#f59e0b"}; margin-top:2px;">
                                        🎁 Ödül: ${t.rewardValue} TL
                                    </div>
                                </div>
                            </div>

                            <p style="margin:0; font-size:13px; color:${descColor}; line-height:1.4; min-height:40px;">
                                ${t.description}
                            </p>

                            ${footerContent}
                        </div>
                    `;
          });

          gridHtml += `</div>`;

          // Mobil uyumu için padding
          gridHtml += `<div style="height:20px;"></div>`;

          container.innerHTML += gridHtml;
        }
      } catch (e) {
        container.innerHTML = "Hata: " + e.message;
      }
    },
  };
  // --- 🚀 SİTE-ÜSTÜ AKILLI KAZANÇ VE İNDİRİM ÇUBUĞU (V4.1 - HTML UYUMLU) ---
  function renderSiteStripe() {
    // 1. Zaten varsa tekrar oluşturma
    if (document.getElementById("mdm-stripe-bar")) return;

    var pData = window.PartnerData || {};
    var myRefCode = pData.refCode;
    var accountType = pData.accountType || "individual"; // "individual" veya "company"

    // Veriler yoksa gösterme
    if (!myRefCode) return;

    // --- AYARLAR ---
    var myCommissionRate = parseFloat(pData.commission_rate || 10); // Ortağın kazanç oranı (Örn: %10)
    var customerDiscountRate = parseFloat(pData.discount_rate || 15); // Müşteriye sağlanan indirim (Örn: %15)

    // --- FİYAT VE SAYFA KONTROLÜ (V5 - KATEGORİ SAYFASI FİX) ---
    var productPrice = 0;
    var isProductPage = false;

    // 1. KRİTİK KONTROL: Sayfa gerçekten "Ürün Detay" sayfası mı?
    // Ürün detay sayfasında ana kapsayıcıda schema.org/Product tanımlı olur.
    // Kategori sayfalarında bu yapı ürün kartlarının içindedir, sayfanın kendisinde değil.
    var mainProductContainer = document.querySelector(
      '.product-details-container[itemtype*="Product"], [itemtype*="schema.org/Product"]',
    );

    if (mainProductContainer) {
      // Eğer bu bir ürün detay sayfasıysa fiyatı aramaya başla

      // YÖNTEM A: Schema Price (En Temiz)
      var schemaPrice =
        mainProductContainer.querySelector('[itemprop="price"]');
      if (schemaPrice && schemaPrice.getAttribute("content")) {
        productPrice = parseFloat(schemaPrice.getAttribute("content"));
        isProductPage = true;
      }
      // YÖNTEM B: Faprika Meta Etiketi (Yedek)
      else if (
        document.querySelector('meta[property="product:price:amount"]')
      ) {
        var priceMeta = document.querySelector(
          'meta[property="product:price:amount"]',
        );
        productPrice = parseFloat(priceMeta.content);
        isProductPage = true;
      }
      // YÖNTEM C: CSS Sınıfı (Son Çare - Sadece Container İçinde Ara)
      else {
        var priceEl =
          mainProductContainer.querySelector(".product-price") ||
          mainProductContainer.querySelector(".current-price") ||
          mainProductContainer.querySelector(".fiyat");

        if (priceEl) {
          var txt = priceEl.innerText
            .replace("TL", "")
            .replace("TRY", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim();
          productPrice = parseFloat(txt);
          if (!isNaN(productPrice) && productPrice > 0) isProductPage = true;
        }
      }
    }

    // --- 🔥 FİNANSAL HESAPLAMA MOTORU (DÜZELTİLDİ) ---
    let statsHtml = "";

    if (isProductPage && productPrice > 0) {
      // 1. İndirimli Fiyatı Bul
      let discountAmount = productPrice * (customerDiscountRate / 100);
      let discountedPrice = productPrice - discountAmount;

      // 2. Ham Komisyonu Bul (Brüt Taban)
      let baseEarnings = discountedPrice * (myCommissionRate / 100);

      // 3. Hesap Türüne Göre Gösterilecek Rakamı ve Metni Seç
      let displayAmount = 0;
      let labelText = "";
      let infoText = "";

      // 🔥 Backend'den gelen oranı kullan (yoksa 20 varsay)
      let dynamicTax = pData.tax_rate ? parseFloat(pData.tax_rate) : 20;
      let taxMultiplier = dynamicTax / 100;

      if (accountType === "company") {
        // KURUMSAL: KDV Ekle
        let kdv = baseEarnings * taxMultiplier;
        displayAmount = baseEarnings + kdv;
        labelText = "FATURA TUTARI:";
        infoText = `(KDV Dahil %${dynamicTax})`;
      } else {
        // BİREYSEL: Stopaj Düş
        let stopaj = baseEarnings * taxMultiplier;
        displayAmount = baseEarnings - stopaj;
        labelText = "NET KAZANÇ:";
        infoText = `(Vergi Düşüldü %${dynamicTax})`;
      }

      // HTML ÇIKTISI (Çift yazma hatası düzeltildi)
      statsHtml = `
            <div class="stripe-stats-container">
                <div class="hide-mobile stripe-detail-box">
                    <span style="color:#94a3b8; font-size:10px;">Takipçine İndirim:</span>
                    <span style="color:#f59e0b; font-weight:bold;">-${discountAmount.toFixed(2)} TL</span>
                </div>

                <div class="hide-mobile stripe-divider"></div>

                <div class="stripe-earn-box">
                    <span class="earn-label">${labelText}</span>
                    <div style="display:flex; align-items:center; gap:5px;">
                        <span class="earn-amount">+${displayAmount.toFixed(2)} TL</span>
                        <span style="font-size:9px; color:#64748b;">${infoText}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Linkler
    var currentPageLink = window.location.href.split("?")[0];
    var myStoreLink = "https://www.modum.tr/?koleksiyon=" + myRefCode;

    // Koleksiyon Butonu (Sadece ürün sayfasındaysa görünür)
    var collectionBtnHtml = "";
    if (isProductPage) {
      collectionBtnHtml = `
            <button onclick="PartnerApp.toggleCollectionItem()" class="mdm-btn btn-collection">
                <i class="fas fa-plus-circle"></i> <span class="hide-mobile">Koleksiyona Ekle</span>
            </button>
        `;
    }

    // --- CSS TASARIMI (Responsive & Modern) ---
    var css = `
    <style>
        /* Ana Çubuk */
        #mdm-stripe-bar {
            position: fixed; top: 0; left: 0; width: 100%; height: 60px; 
            background: #0f172a; color: white; z-index: 100; 
            display: flex; align-items: center; justify-content: space-between; 
            padding: 0 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); 
            font-family: 'Inter', sans-serif; box-sizing: border-box;
            border-bottom: 2px solid #3b82f6;
        }

        /* İstatistik Kutusu */
        .stripe-stats-container {
            display: flex; align-items: center; gap: 10px;
            background: #1e293b; padding: 5px 12px; border-radius: 8px;
            border: 1px solid #334155;
        }

        .stripe-detail-box { display: flex; flex-direction: column; line-height: 1.1; }
        .stripe-divider { width: 1px; height: 24px; background: #334155; }
        
        .stripe-earn-box { display: flex; flex-direction: column; line-height: 1.1; align-items: flex-end; }
        .earn-label { font-size: 9px; color: #6ee7b7; text-transform: uppercase; font-weight: 700; }
        .earn-amount { font-size: 14px; color: #34d399; font-weight: 800; text-shadow: 0 0 10px rgba(52, 211, 153, 0.3); }

        /* Butonlar */
        .mdm-btn {
            padding: 0 15px; height: 36px; border-radius: 6px; cursor: pointer; 
            font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; 
            text-decoration: none; transition: 0.2s; white-space: nowrap; border: none;
        }
        .mdm-btn:active { transform: scale(0.95); }

        .btn-share { background: #3b82f6; color: white; }
        .btn-share:hover { background: #2563eb; }

        .btn-collection { background: #f59e0b; color: white; }
        .btn-collection:hover { background: #d97706; }

        .btn-store { background: #10b981; color: white; }
        .btn-store:hover { background: #059669; }

        .mdm-logo-area { display: flex; align-items: center; gap: 10px; }
        .mdm-partner-badge { 
            background: linear-gradient(135deg, #fbbf24, #d97706); color: white; 
            padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; 
            box-shadow: 0 2px 5px rgba(251, 191, 36, 0.3);
        }

        /* MOBİL UYUM */
        @media (max-width: 768px) {
            .hide-mobile { display: none !important; }
            #mdm-stripe-bar { height: 60px; padding: 0 10px; }
            .mdm-btn { padding: 0 10px; height: 32px; }
            .earn-amount { font-size: 13px; }
            .stripe-stats-container { padding: 4px 8px; }
        }
    </style>
    `;

    // --- HTML YAPISI ---
    var html = `
    ${css}
    <div id="mdm-stripe-bar">
        <div class="mdm-logo-area">
            <div class="mdm-partner-badge hide-mobile">PARTNER</div>
            ${statsHtml} </div>
        
        <div style="display:flex; gap:8px; align-items:center;">
             <button onclick="PartnerApp.openShareMenu('${currentPageLink}', false)" class="mdm-btn btn-share">
                <i class="fas fa-share-alt"></i> <span class="hide-mobile">Paylaş</span>
            </button>

             ${collectionBtnHtml}
             
             <button onclick="PartnerApp.openShareMenu('${myStoreLink}', true)" class="mdm-btn btn-store">
                <i class="fas fa-store"></i> <span class="hide-mobile">Mağazam</span>
            </button>

            <div onclick="closeStripe()" style="width:24px; height:24px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#64748b; font-size:18px;">&times;</div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", html);

    // Siteyi aşağı it (Header çakışmasını önle)
    document.body.style.marginTop = "60px";
    var headers = document.querySelectorAll(
      "header, .header, #header, .header-container, .top-bar, .sticky-header",
    );
    headers.forEach(function (h) {
      var style = window.getComputedStyle(h);
      if (style.position === "fixed" || style.position === "sticky") {
        h.style.top = "60px";
      }
    });

    window.closeStripe = function () {
      document.getElementById("mdm-stripe-bar").remove();
      document.body.style.marginTop = "0px";
      headers.forEach(function (h) {
        h.style.top = "0px";
      });
    };
  }
  // ============================================================
  // 🚀 PARTNER BAŞVURU SİHİRBAZI (LANDING PAGE + FORM) - FİNAL SÜRÜM
  // ============================================================
  async function renderApplicationPage() {
    const root = document.getElementById("mdm-application-page");
    if (!root) return; // Bu sayfada değilsek çalışma

    var email = detectUser();

    // --- GÖRSEL LİNKLERİ ---
    const BANNER_IMG = "https://www.modum.tr/i/m/001/0016755.jpeg";
    const ICON_1 = "https://www.modum.tr/i/m/001/0016754.jpeg";
    const ICON_2 = "https://www.modum.tr/i/m/001/0016753.jpeg";
    const ICON_3 = "https://www.modum.tr/i/m/001/0016752.jpeg";
    const FORM_SIDE_IMG = "https://www.modum.tr/i/m/001/0016756.jpeg";

    // --- CSS STİLLERİ (MOBİL UYUMLU & DÜZELTİLMİŞ) ---
    const style = `
  <style>
      /* --- GENEL MASAÜSTÜ AYARLARI --- */
      .app-hero { width:100%; height:300px; background:url('${BANNER_IMG}') center/cover no-repeat; position:relative; display:flex; align-items:center; justify-content:center; }
      .app-hero::after { content:''; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); }
      .app-hero-content { position:relative; z-index:2; text-align:center; color:white; padding:20px; }
      .app-hero h1 { font-size:40px; font-weight:900; margin:0; text-transform:uppercase; letter-spacing:2px; }
      .app-hero p { font-size:18px; opacity:0.9; margin-top:10px; }
      
      .app-container * { box-sizing: border-box; }
      .app-container { max-width:1100px; margin: -50px auto 50px; position:relative; z-index:10; padding:0 15px; width:100%; }
      
      /* Kartlar */
      .benefit-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; margin-bottom:40px; }
      .b-card { background:white; padding:30px; border-radius:16px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.05); transition:0.3s; }
      .b-card:hover { transform:translateY(-10px); }
      .b-card img { width:80px; height:80px; border-radius:50%; margin-bottom:15px; object-fit:cover; }
      .b-card h4 { font-size:18px; color:#1e293b; margin:0 0 10px; }
      .b-card p { font-size:13px; color:#64748b; line-height:1.5; }

      /* Form Kutusu (Masaüstü) */
      .form-box { display:flex; background:white; border-radius:20px; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.1); min-height:550px; }
      .form-left { width:40%; background:url('${FORM_SIDE_IMG}') center/cover; position:relative; flex-shrink: 0; }
      .form-left::after { content:''; position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(to top, #0f172a, transparent); }
      .form-left-text { position:absolute; bottom:30px; left:30px; color:white; z-index:2; width: calc(100% - 60px); }
      
      .form-right { width:60%; padding:40px; display:flex; flex-direction:column; flex-grow: 1; }
      
      /* Inputlar */
      .step-indicator { display:flex; gap:10px; margin-bottom:30px; }
      .step-dot { flex:1; height:4px; background:#e2e8f0; border-radius:4px; }
      .step-dot.active { background:#3b82f6; }
      
      .inp-group { margin-bottom:15px; width: 100%; }
      .inp-group label { display:block; font-size:12px; font-weight:bold; color:#475569; margin-bottom:5px; }
      .inp-group input, .inp-group select, .inp-group textarea { width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none; font-family:'Inter', sans-serif; box-sizing:border-box; background: #fff; }
      .inp-group input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }

      .btn-next { background:#0f172a; color:white; border:none; padding:15px; width:100%; border-radius:8px; font-weight:bold; cursor:pointer; margin-top:auto; font-size:16px; transition:0.2s; }
      .btn-next:hover { background:#1e293b; transform:scale(1.02); }

      /* 🔥 MOBİL DÜZELTMELER (TAMAMEN YENİLENDİ) */
      @media(max-width:768px) {
          .app-hero { min-height: 200px; height: auto; padding: 40px 20px; text-align: center; }
          .app-hero h1 { font-size: 24px; }
          
          /* Kartları alt alta al */
          .benefit-grid { grid-template-columns: 1fr; gap: 15px; }
          .b-card { display: flex; align-items: center; gap: 15px; padding: 15px; text-align: left; }
          .b-card img { width: 50px; height: 50px; margin: 0; }

          /* Form Kutusunu Esnek Yap */
          .form-box { flex-direction: column; height: auto !important; min-height: auto !important; border: 1px solid #e2e8f0; box-shadow: none; }
          
          /* Sol resmi tamamen gizle */
          .form-left { display: none !important; width: 0 !important; height: 0 !important; }
          
          /* Sağ tarafı tam genişlik yap */
          .form-right { width: 100% !important; padding: 20px 15px !important; flex: none !important; }

          /* 🔥 SIKIŞMAYI ÖNLEYEN SİHİRLİ KOD */
          /* Kodun içindeki inline grid stillerini (1fr 1fr vb.) ezer ve tek sütuna düşürür */
          .form-right div[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
              gap: 15px !important;
          }
          
          /* Input yazı boyutunu büyüt (Zoom sorununu önler) */
          .inp-group input, .inp-group select, .inp-group textarea { font-size: 16px !important; }
          
          /* Adım göstergesini küçült */
          .step-indicator { margin-bottom: 20px; }
      }
  </style>
  `;

    // --- 1. DURUM KONTROLÜ (Backend'e Sor) ---
    let appStatus = "none";
    if (email) {
      try {
        root.innerHTML =
          '<div style="text-align:center; padding:100px;"><i class="fas fa-spinner fa-spin fa-3x"></i><br>Durum kontrol ediliyor...</div>';

        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // check_application_status fonksiyonunu backend'e eklemiştik
          body: JSON.stringify({
            islem: "check_application_status",
            email: email,
          }),
        });
        const data = await res.json();
        if (data.success) appStatus = data.status;
      } catch (e) {
        console.log(e);
      }
    }

    // --- 2. HTML İSKELETİNİ KUR ---
    var html = `
  ${style}
  <div class="app-hero">
      <div class="app-hero-content">
          <h1>MODUMNET PARTNER</h1>
          <p>Sosyal medya gücünü kazanca dönüştür.</p>
      </div>
  </div>
  <div class="app-container">
      <div class="benefit-grid">
          <div class="b-card"><img src="${ICON_1}"><h4>Yüksek Komisyon</h4><p>Satış yaptıkça artan oranlar.</p></div>
          <div class="b-card"><img src="${ICON_2}"><h4>Özel Hediyeler</h4><p>Sürpriz kutular ve ürünler.</p></div>
          <div class="b-card"><img src="${ICON_3}"><h4>Partner Akademisi</h4><p>Ücretsiz eğitimlerle geliş.</p></div>
      </div>
      <div class="form-box" id="app-form-area">
          </div>
  </div>
  `;
    root.innerHTML = html;

    // --- 3. DURUMA GÖRE İÇERİĞİ DOLDUR ---
    renderFormContent(appStatus, email);
  }

  // --- İÇERİK YÖNETİCİSİ (GÜNCELLENMİŞ: GÖR AMA DOKUNMA) ---
  // --- İÇERİK YÖNETİCİSİ (GÜNCELLENMİŞ: İKNA EDİCİ GİRİŞ EKRANI) ---
  function renderFormContent(status, email) {
    const area = document.getElementById("app-form-area");

    // SENARYO 1: GİRİŞ YAPMAMIŞ (ÜYE OLMAYANLARA ÖZEL İKNA EKRANI)
    if (!email) {
      area.innerHTML = `
          <div class="form-left">
              <div class="form-left-text">
                  <h3 style="margin:0;">Aramıza Katıl</h3>
                  <p style="margin:5px 0 0; opacity:0.8;">ModumNet ailesinin bir parçası ol.</p>
              </div>
          </div>
          
          <div class="form-right" style="justify-content:center;">
              <h2 style="margin:0 0 10px 0; color:#1e293b; text-align:center;">ModumNet Partner Programı</h2>
              <p style="color:#64748b; font-size:13px; text-align:center; margin-bottom:25px;">
                  Sosyal medya gücünü gelire dönüştürmeye hazır mısın? İşte kazanacakların:
              </p>

              <div style="background:#f8fafc; padding:15px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:20px;">
                  <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                      <div style="width:30px; height:30px; background:#dcfce7; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#166534; font-weight:bold;">%</div>
                      <div style="font-size:13px; color:#334155;"><b>Yüksek Komisyon:</b> Satış başına %20'ye varan kazanç.</div>
                  </div>
                  <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                      <div style="width:30px; height:30px; background:#fef3c7; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#b45309;">🎁</div>
                      <div style="font-size:13px; color:#334155;"><b>Hediye Ürünler:</b> Başarılı partnerlere sürpriz kutular.</div>
                  </div>
                  <div style="display:flex; align-items:center; gap:10px;">
                      <div style="width:30px; height:30px; background:#e0f2fe; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#0369a1;">🎓</div>
                      <div style="font-size:13px; color:#334155;"><b>Ücretsiz Eğitim:</b> Satışlarını artırma taktikleri.</div>
                  </div>
              </div>

              <div style="text-align:center; background:#fff7ed; padding:15px; border-radius:8px; border:1px dashed #fdba74;">
                  <div style="font-size:24px; margin-bottom:5px;">🔒</div>
                  <h4 style="margin:0; color:#9a3412; font-size:14px;">Başvuru Yapabilmek İçin</h4>
                  <p style="font-size:12px; color:#c2410c; margin:5px 0 15px;">
                      Önce ModumNet üyesi olman veya hesabına giriş yapman gerekiyor.
                  </p>
                  
                  <a href="/uyelik-girisi" class="btn-next" style="text-decoration:none; display:block; line-height:20px; background:#1e293b;">
                      GİRİŞ YAP / KAYIT OL
                  </a>
              </div>
          </div>`;
      return;
    }

    // --- GİRİŞ YAPMIŞSA DEVAM EDİYOR ---

    // 1. ÖNCE FORMU YÜKLE (Böylece arkada form hazır olur)
    window.appData = { email: email };

    // SENARYO 2: ZATEN PARTNER (Formu Kilitle + Panele Git Butonu)
    if (status === "active") {
      showStep1(); // Formu bas
      disableFormArea("👑 Tebrikler! Zaten onaylı bir iş ortağımızsınız.");

      // Butonu Değiştir
      setTimeout(() => {
        const btn = document.querySelector("#app-form-area .btn-next");
        if (btn) {
          btn.innerText = "ORTAKLIK PANELİNE GİT ➔";
          btn.style.background = "#3b82f6"; // Mavi
          btn.onclick = function () {
            PartnerApp.openPartnerDashboard();
          };
        }
      }, 100);
    }

    // SENARYO 3: BEKLEMEDE (Formu Kilitle + Bilgi Ver)
    else if (status === "pending") {
      showStep1(); // Formu bas
      disableFormArea("⏳ Başvurunuz alındı ve şu an inceleme aşamasında.");

      // Butonu Pasif Yap
      setTimeout(() => {
        const btn = document.querySelector("#app-form-area .btn-next");
        if (btn) {
          btn.innerText = "SONUÇ BEKLENİYOR...";
          btn.style.background = "#94a3b8"; // Gri
          btn.style.cursor = "default";
          btn.onclick = null;
        }
      }, 100);
    }

    // SENARYO 4: REDDEDİLMİŞ (Form Açık + Uyarı Ver)
    else if (status === "rejected") {
      showStep1(); // Formu bas
      setTimeout(() => {
        const warningHTML = `
            <div style="background:#fee2e2; color:#b91c1c; padding:15px; border-radius:8px; border:1px solid #fca5a5; margin-bottom:20px; font-size:13px; display:flex; align-items:center; gap:10px;">
                <i class="fas fa-exclamation-circle" style="font-size:18px;"></i>
                <div>
                    <b>Önceki Başvurunuz Onaylanmadı</b><br>
                    Bilgilerinizi güncelleyerek tekrar şansınızı deneyebilirsiniz.
                </div>
            </div>`;
        const rightPanel = document.querySelector(".form-right");
        if (rightPanel)
          rightPanel.insertAdjacentHTML("afterbegin", warningHTML);
      }, 100);
    }

    // SENARYO 5: TEMİZ (İlk Kez Başvuruyor)
    else {
      showIntro(); // 🔥 GİRİŞ YAPMIŞ AMA HENÜZ BAŞVURMAMIŞSA TANITIM EKRANINI AÇ
    }
  }

  // --- ADIM 0: SİSTEM TANITIMI VE İKNA EKRANI (PRO VERSİYON) ---
  window.showIntro = function () {
    const area = document.getElementById("app-form-area");

    // İkonlar (FontAwesome varsa kullanır, yoksa emoji)
    const iconMoney =
      '<i class="fas fa-wallet" style="font-size:24px; color:#10b981; margin-bottom:10px;"></i>';
    const iconGift =
      '<i class="fas fa-gift" style="font-size:24px; color:#f59e0b; margin-bottom:10px;"></i>';
    const iconGrowth =
      '<i class="fas fa-chart-line" style="font-size:24px; color:#3b82f6; margin-bottom:10px;"></i>';

    area.innerHTML = `
      <div class="form-left" style="background-image: url('https://www.modum.tr/i/m/001/0016756.jpeg'); background-size: cover; position: relative;">
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent);"></div>
          <div class="form-left-text" style="position: absolute; bottom: 40px; left: 30px; z-index: 2; text-align: left;">
              <h2 style="margin: 0; font-size: 28px; font-weight: 800; color: white; line-height: 1.2;">Tutkunu<br>Kazanca Dönüştür.</h2>
              <p style="margin: 15px 0 0; opacity: 0.9; font-size: 14px; color: #cbd5e1; line-height: 1.6;">
                  ModumNet ile sadece bir satış ortağı değil, markamızın bir yüzü olursun.
                  <br><br>
                  ✨ Haftalık Ödemeler<br>
                  ✨ Sana Özel İndirim Kodları<br>
                  ✨ Hediye Ürün Paketleri
              </p>
          </div>
      </div>
      
      <div class="form-right" style="padding: 40px; display: flex; flex-direction: column; justify-content: center;">
          <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 800;">ModumNet Partner Programı</h2>
              <p style="color: #64748b; font-size: 13px; margin-top: 5px;">Türkiye'nin en hızlı büyüyen influencer topluluğuna katıl.</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 15px 0; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">💎 Neden Bizi Seçmelisin?</h4>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center;">
                  <div style="background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                      ${iconMoney}
                      <div style="font-size: 11px; font-weight: bold; color: #334155;">%20'ye Varan<br>Komisyon</div>
                  </div>
                  <div style="background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                      ${iconGift}
                      <div style="font-size: 11px; font-weight: bold; color: #334155;">Sürpriz<br>Hediyeler</div>
                  </div>
                  <div style="background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                      ${iconGrowth}
                      <div style="font-size: 11px; font-weight: bold; color: #334155;">Ücretsiz<br>Eğitimler</div>
                  </div>
              </div>
          </div>

          <div style="margin-bottom: 25px;">
              <h4 style="margin: 0 0 10px 0; color: #334155; font-size: 14px;">🚀 Nasıl Çalışır?</h4>
              <div style="display: flex; align-items: flex-start; gap: 15px; font-size: 12px; color: #475569;">
                  <div style="flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center;">
                      <div style="width: 30px; height: 30px; background: #eff6ff; color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 5px;">1</div>
                      <span>Başvurunu<br>Tamamla</span>
                  </div>
                  <div style="width: 20px; height: 1px; background: #cbd5e1; margin-top: 15px;"></div>
                  <div style="flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center;">
                      <div style="width: 30px; height: 30px; background: #f0fdf4; color: #166534; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 5px;">2</div>
                      <span>Linkini<br>Paylaş</span>
                  </div>
                  <div style="width: 20px; height: 1px; background: #cbd5e1; margin-top: 15px;"></div>
                  <div style="flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center;">
                      <div style="width: 30px; height: 30px; background: #fffbeb; color: #b45309; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 5px;">3</div>
                      <span>Kazancını<br>Takip Et</span>
                  </div>
              </div>
          </div>

          <button onclick="showStep1()" class="btn-next" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2); transition: transform 0.2s;">
              HEMEN BAŞVUR &rarr;
          </button>
          
          <div style="text-align: center; margin-top: 15px; font-size: 11px; color: #94a3b8;">
              * Başvurunuz 24 saat içinde değerlendirilecektir.
          </div>
      </div>
    `;
  };
  // --- YARDIMCI: FORMU KİLİTLEME FONKSİYONU ---
  function disableFormArea(message) {
    // 1. Uyarı Mesajını Ekle
    const rightPanel = document.querySelector(".form-right");
    if (rightPanel) {
      rightPanel.insertAdjacentHTML(
        "afterbegin",
        `
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; padding:15px; border-radius:8px; margin-bottom:20px; display:flex; align-items:center; gap:10px;">
              <i class="fas fa-check-circle" style="font-size:20px;"></i>
              <span style="font-weight:bold;">${message}</span>
          </div>
        `,
      );
    }

    // 2. Tüm Inputları Bul ve Kilitle (Disabled)
    const inputs = document.querySelectorAll(
      "#app-form-area input, #app-form-area select, #app-form-area textarea",
    );
    inputs.forEach((el) => {
      el.disabled = true;
      el.style.backgroundColor = "#f1f5f9"; // Gri arka plan
      el.style.color = "#94a3b8"; // Soluk yazı
      el.style.cursor = "not-allowed";
    });
  }

  // ============================================================
  // 🚀 PARTNER BAŞVURU SİHİRBAZI v2.0 (GELİŞTİRİLMİŞ)
  // ============================================================

  // --- ADIM 1: SOSYAL MEDYA & ANALİZ (BOT KORUMASI) ---
  window.showStep1 = function () {
    const area = document.getElementById("app-form-area");
    area.innerHTML = `
      <div class="form-left">
          <div class="form-left-text">
              <h3 style="margin:0;">Adım 1/3: Analiz</h3>
              <p style="margin:5px 0 0; opacity:0.8;">Seni ve kitleni daha yakından tanıyalım.</p>
          </div>
      </div>
      <div class="form-right">
          <div class="step-indicator">
              <div class="step-dot active"></div><div class="step-dot"></div><div class="step-dot"></div>
          </div>
          
          <h3 style="margin:0 0 10px 0; color:#1e293b;">Sosyal Medya Gücün</h3>
          <p style="font-size:12px; color:#64748b; margin-bottom:20px;">
              Başvurunun onaylanması için lütfen <b>en aktif olduğun</b> platformu ve gerçek verileri gir.
          </p>

          <div class="inp-group">
              <label>Ana Platformun</label>
              <select id="app_platform">
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Telegram">Telegram / WhatsApp Grubu</option>
              </select>
          </div>

          <div class="inp-group">
              <label>Kullanıcı Adın / Kanal Linkin</label>
              <input type="text" id="app_handle" placeholder="@kullaniciadi veya https://...">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <div class="inp-group">
                  <label>Takipçi Sayın</label>
                  <select id="app_followers">
                      <option value="1k-5k">1.000 - 5.000</option>
                      <option value="5k-10k">5.000 - 10.000</option>
                      <option value="10k-50k">10.000 - 50.000</option>
                      <option value="50k-100k">50.000 - 100.000</option>
                      <option value="100k+">100.000+</option>
                  </select>
              </div>
              <div class="inp-group">
    <label>Son Story İzlenme (Ekran Görüntüsü)</label>
    
    <input type="file" id="app_views_img" accept="image/*" onchange="PartnerApp.previewStoryProof(this)" style="font-size:12px;">
    
    <div id="story-proof-preview" style="display:none; margin-top:10px; border:1px dashed #cbd5e1; padding:5px; border-radius:6px; background:#fff;">
        <img id="img-proof-view" src="" style="width:100%; max-height:200px; object-fit:contain; border-radius:4px;">
        <div style="font-size:10px; color:#16a34a; text-align:center; margin-top:5px;">✅ Kanıt Yüklendi</div>
    </div>
    
    <input type="hidden" id="app_views_base64">
    
    <div style="font-size:10px; color:#64748b; margin-top:4px;">
        * Instagram istatistik ekranının görüntüsünü yükleyin.
    </div>
</div>
          </div>

          <div class="inp-group">
              <label>İçerik Kategorin</label>
              <select id="app_category">
                  <option value="Moda">👗 Moda & Giyim</option>
                  <option value="Güzellik">💄 Güzellik & Bakım</option>
                  <option value="AnneCocuk">👶 Anne & Çocuk</option>
                  <option value="Lifestyle">☕ Lifestyle / Günlük</option>
                  <option value="Ogrenci">🎓 Öğrenci / Kampüs</option>
                  <option value="Diger">Diğer</option>
              </select>
          </div>

          <div class="inp-group">
              <label>Satış Stratejin (Bizi nasıl tanıtacaksın?)</label>
              <textarea id="app_strategy" rows="2" placeholder="Örn: Kombin videoları çekeceğim, indirim kodu paylaşacağım..."></textarea>
          </div>

          <button onclick="validateStep1()" class="btn-next">DEVAM ET &rarr;</button>
      </div>
    `;
  }; // --- RESİM İŞLEYİCİ (MODUM PARTNER JS İÇİNE EKLE) ---
  window.PartnerApp.previewStoryProof = function (input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        // 1. Önizlemeyi göster
        document.getElementById("img-proof-view").src = e.target.result;
        document.getElementById("story-proof-preview").style.display = "block";

        // 2. Resmi Küçült (Canvas ile) - Sunucuyu patlatmamak için şart!
        var img = new Image();
        img.onload = function () {
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");

          // Boyutları ayarla (Max 800px genişlik)
          var MAX_WIDTH = 800;
          var scale = MAX_WIDTH / img.width;
          if (scale > 1) scale = 1; // Zaten küçükse büyütme

          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Sıkıştırılmış veriyi gizli kutuya at
          var dataUrl = canvas.toDataURL("image/jpeg", 0.7); // %70 Kalite
          document.getElementById("app_views_base64").value = dataUrl;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  window.validateStep1 = function () {
    const handle = document.getElementById("app_handle").value;
    const strategy = document.getElementById("app_strategy").value;

    // 🔥 DEĞİŞEN KISIM: Resmi kontrol et
    const proofImg = document.getElementById("app_views_base64").value;

    if (handle.length < 3) return alert("Lütfen kullanıcı adını gir.");
    if (strategy.length < 10) return alert("Lütfen stratejini kısaca anlat.");

    // Resim zorunluluğu
    if (!proofImg || proofImg.length < 100)
      return alert(
        "Lütfen story izlenme kanıtını (ekran görüntüsü) yükleyiniz.",
      );

    window.appData.social = {
      platform: document.getElementById("app_platform").value,
      handle: handle,
      followers: document.getElementById("app_followers").value,

      // 🔥 YENİ: Artık sayı yerine resmi kaydediyoruz
      avg_story_views: "Görsel Kanıtlı",
      story_proof_img: proofImg, // Resmi buraya koyduk

      category: document.getElementById("app_category").value,
      strategy: strategy,
    };
    showStep2();
  };

  // --- ADIM 2: KİMLİK & FİNANS (SADELEŞTİRİLMİŞ & MUHASEBE UYUMLU) ---
  window.showStep2 = function () {
    const area = document.getElementById("app-form-area");
    area.innerHTML = `
      <div class="form-left">
          <div class="form-left-text">
              <h3 style="margin:0;">Ödeme Bilgileri</h3>
              <p style="margin:5px 0 0; opacity:0.8;">Paranı nasıl yatıralım?</p>
          </div>
      </div>
      <div class="form-right">
          <div class="step-indicator">
              <div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot"></div>
          </div>
          
          <h3 style="margin:0 0 15px 0; color:#1e293b;">Hesap Türü</h3>

          <div style="margin-bottom:20px; background:#f0f9ff; padding:15px; border-radius:10px; border:1px solid #bae6fd;">
              <div style="display:flex; gap:20px;">
                  <label style="cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:bold; color:#0369a1;">
                      <input type="radio" name="accType" value="individual" checked onchange="PartnerApp.toggleTaxInput(false)"> 
                      Bireysel (Şirketim Yok)
                  </label>
                  <label style="cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:bold; color:#1e40af;">
                      <input type="radio" name="accType" value="company" onchange="PartnerApp.toggleTaxInput(true)"> 
                      Şirket / Ajans
                  </label>
              </div>
              <div id="tax-warning" style="font-size:11px; color:#64748b; margin-top:10px; background:white; padding:8px; border-radius:6px;">
                  ℹ️ <b>Bireysel hesaplarda:</b> Devlet adına %20 Stopaj vergisi tarafımızca kesilir ve adınıza devlete ödenir. Hesabınıza <b>NET</b> tutar yatar.
              </div>
          </div>

          <div class="inp-group">
              <label>Ad Soyad / Şirket Ünvanı</label>
              <input type="text" id="app_name" placeholder="Örn: Ahmet Yılmaz">
          </div>

          <div id="individual-inputs">
               <div class="inp-group">
                  <label>TC Kimlik No (Zorunlu - Ödeme İçin)</label>
                  <input type="text" id="app_tckn" maxlength="11" placeholder="11 haneli TCKN">
              </div>
          </div>

          <div id="company-inputs" style="display:none;">
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                  <div class="inp-group">
                      <label>Vergi Dairesi</label>
                      <input type="text" id="app_tax_office">
                  </div>
                  <div class="inp-group">
                      <label>Vergi Numarası</label>
                      <input type="text" id="app_tax_no">
                  </div>
              </div>
          </div>

          <div class="inp-group">
              <label>Telefon (WhatsApp)</label>
              <input type="tel" id="app_phone" placeholder="0555 555 55 55">
          </div>

          <hr style="margin:15px 0; border:0; border-top:1px solid #e2e8f0;">
          
          <div style="display:grid; grid-template-columns: 1fr 2fr; gap:10px;">
              <div class="inp-group">
                  <label>Banka</label>
                  <select id="app_bank_name">
                      <option value="Garanti">Garanti BBVA</option>
                      <option value="Ziraat">Ziraat</option>
                      <option value="IsBank">İş Bankası</option>
                      <option value="Akbank">Akbank</option>
                      <option value="YapiKredi">Yapı Kredi</option>
                      <option value="Finans">QNB Finansbank</option>
                      <option value="Diger">Diğer</option>
                  </select>
              </div>
              <div class="inp-group">
                  <label>IBAN (TR ile başlar)</label>
                  <input type="text" id="app_iban" maxlength="32" oninput="this.value = this.value.toUpperCase()" placeholder="TR...">
              </div>
          </div>

          <div class="inp-group" style="background:#fff7ed; padding:10px; border:1px solid #fdba74; border-radius:8px; margin-top:10px;">
              <label style="color:#c2410c;">Sana Özel İndirim Kodu</label>
              <input type="text" id="app_coupon" placeholder="Örn: MERVE15" style="font-weight:bold; color:#c2410c;">
          </div>

          <div style="display:flex; gap:10px; margin-top:20px;">
              <button onclick="showStep1()" class="btn-next" style="background:#e2e8f0; color:#334155;">&larr; Geri</button>
              <button onclick="validateStep2()" class="btn-next">SON ADIM &rarr;</button>
          </div>
      </div>
    `;
  };

  // YARDIMCI: Alanları Aç/Kapa
  window.PartnerApp.toggleTaxInput = function (isCompany) {
    if (isCompany) {
      document.getElementById("individual-inputs").style.display = "none";
      document.getElementById("company-inputs").style.display = "block";
      document.getElementById("tax-warning").innerHTML =
        "ℹ️ <b>Şirket hesaplarında:</b> Hakediş tutarına <b>+KDV</b> eklenir. Ödeme alabilmek için şirketinize ait fatura kesmeniz gerekir.";
    } else {
      document.getElementById("individual-inputs").style.display = "block";
      document.getElementById("company-inputs").style.display = "none";
      document.getElementById("tax-warning").innerHTML =
        "ℹ️ <b>Bireysel hesaplarda:</b> Devlet adına %20 Stopaj vergisi tarafımızca kesilir ve adınıza devlete ödenir. Hesabınıza <b>NET</b> tutar yatar.";
    }
  };

  // DOĞRULAMA (KAYDETME)
  window.validateStep2 = function () {
    const accType = document.querySelector(
      'input[name="accType"]:checked',
    ).value;
    const name = document.getElementById("app_name").value;
    const phone = document.getElementById("app_phone").value;
    const iban = document.getElementById("app_iban").value;
    const coupon = document.getElementById("app_coupon").value;

    // Vergi Kontrolleri
    let tckn = "",
      taxOffice = "",
      taxNo = "";

    if (accType === "individual") {
      tckn = document.getElementById("app_tckn").value;
      if (tckn.length !== 11) return alert("TC Kimlik No 11 haneli olmalıdır.");
    } else {
      taxOffice = document.getElementById("app_tax_office").value;
      taxNo = document.getElementById("app_tax_no").value;
      if (!taxNo) return alert("Vergi numarası zorunludur.");
    }

    if (!name || !phone || !iban || !coupon)
      return alert("Lütfen tüm alanları doldurunuz.");

    // Veriyi Paketle
    window.appData.personal = {
      name,
      phone,
      bankInfo: `Garanti - ${iban}`, // Bankayı Garanti varsayabiliriz veya seçileni alabiliriz
      customCoupon: coupon.toUpperCase(),
      accountType: accType, // "individual" veya "company"
      tckn: tckn,
      taxInfo: accType === "company" ? `${taxOffice} / ${taxNo}` : "",
    };

    showStep3();
  };

  // --- ADIM 3: ONAY VE GÖNDER (AVUKAT MODU & YEŞİL EFEKT) ---
  function showStep3() {
    const area = document.getElementById("app-form-area");
    area.innerHTML = `
      <div class="form-left">
          <div class="form-left-text">
              <h3 style="margin:0;">Tamamla</h3>
              <p style="margin:5px 0 0; opacity:0.8;">Son adım: Resmi işlemler.</p>
          </div>
      </div>
      <div class="form-right">
          <div class="step-indicator">
              <div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot active"></div>
          </div>
          
          <div style="text-align:center; padding:10px;">
              <div style="font-size:40px; margin-bottom:10px;">⚖️</div>
              <h3 style="color:#1e293b; margin:0;">Resmi Başvuru Onayı</h3>
              <p style="color:#64748b; font-size:13px; margin-top:5px;">Aşağıdaki yasal metni okuyup onaylamanız gerekmektedir.</p>
              
              <div id="contract-wrapper" style="text-align:left; background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; margin:20px 0; transition:all 0.3s ease;">
                  <div style="font-size:12px; margin-bottom:10px; color:#334155; display:flex; align-items:center; gap:8px;">
                      <i class="fas fa-file-contract" style="font-size:16px;"></i>
                      <div>
                          <span onclick="openContractModal()" style="color:#3b82f6; text-decoration:underline; cursor:pointer; font-weight:bold;">📄 ModumNet Ortaklık Sözleşmesi</span>'ni okumak için tıklayınız.
                      </div>
                  </div>
                  <label style="display:flex; gap:10px; font-size:12px; cursor:pointer; align-items:center;">
                      <input type="checkbox" id="app_terms">
                      <span id="term-text">Sözleşme hükümlerini okudum, anladım ve kabul ediyorum.</span>
                  </label>
              </div>

              <button onclick="submitApplication()" class="btn-next" style="background:#10b981; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                  BAŞVURUYU TAMAMLA 🚀
              </button>
          </div>
      </div>
    `;
  }

  // --- SÖZLEŞME PENCERESİ (AVUKAT DİLİ) ---
  window.openContractModal = function () {
    let old = document.getElementById("mdm-contract-modal");
    if (old) old.remove();

    // PROFESYONEL SÖZLEŞME METNİ
    let contractText = `
      <div style="font-family:'Times New Roman', serif; line-height:1.6; font-size:15px;">

  <h3 style="text-align:center; border-bottom:1px solid #ccc; padding-bottom:10px;">
      MODUMNET SATIŞ ORTAKLIĞI (AFFILIATE) SÖZLEŞMESİ
  </h3>

  <p>
      <strong>MADDE 1 – TARAFLAR VE SÖZLEŞMENİN KONUSU</strong><br>
      İşbu Satış Ortaklığı Sözleşmesi (“Sözleşme”); ModumNet E-Ticaret Sistemleri (“Şirket”) ile,
      satış ortaklığı başvuru formunu dijital ortamda dolduran gerçek veya tüzel kişi (“Ortak”) arasında,
      Şirket’e ait ürünlerin dijital kanallar aracılığıyla tanıtılması ve bu tanıtım sonucunda
      gerçekleşen satışlar üzerinden komisyon ödenmesine ilişkin usul ve esasları düzenlemek amacıyla akdedilmiştir.
  </p>

  <p>
      <strong>MADDE 2 – SATIŞ ORTAKLIĞI SİSTEMİ</strong><br>
      2.1. Ortak, Şirket tarafından kendisine özel olarak tanımlanan bağlantılar (referans linkleri)
      aracılığıyla Şirket ürünlerinin tanıtımını yapar.<br>
      2.2. Satışların geçerli sayılabilmesi için; siparişin Ortak’a ait referans link üzerinden
      gerçekleşmiş olması, siparişin iptal veya iade edilmemiş olması gerekmektedir.
  </p>

  <p>
      <strong>MADDE 3 – KOMİSYON ORANLARI VE HAKEDİŞ</strong><br>
      3.1. Ortak, gerçekleştirdiği satış hacmine göre aşağıda belirtilen komisyon oranlarından
      faydalanır:<br>
      • Bronz Seviye: %10<br>
      • Gümüş Seviye: %15<br>
      • Altın Seviye: %20<br>
      3.2. Komisyon hakedişi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında
      öngörülen 14 (on dört) günlük cayma süresinin sona ermesiyle kesinleşir.<br>
      3.3. Kesinleşmiş komisyon bakiyesinin 500 TL (Beş Yüz Türk Lirası) tutarına ulaşması halinde,
      ödemeler Ortak tarafından bildirilen IBAN numarasına haftalık olarak, Çarşamba günleri yapılır.
  </p>

  <p>
      <strong>MADDE 4 – YASAKLI FAALİYETLER</strong><br>
      Ortak aşağıda belirtilen fiilleri gerçekleştiremez:<br>
      a) Kendi referans linki üzerinden doğrudan veya dolaylı olarak alışveriş yapmak
      (Self-Referral).<br>
      b) Yanıltıcı, gerçeğe aykırı, spam niteliğinde veya Şirket marka itibarını zedeleyici
      tanıtımlar yapmak.<br>
      c) Sahte sipariş oluşturmak, iptal veya iade süreçlerini manipüle etmeye yönelik girişimlerde bulunmak.
  </p>

  <p>
      <strong>MADDE 5 – FESİH VE YAPTIRIMLAR</strong><br>
      5.1. Ortak’ın işbu Sözleşme hükümlerine aykırı davrandığının tespiti halinde,
      Şirket sözleşmeyi tek taraflı ve derhal feshetme hakkına sahiptir.<br>
      5.2. Fesih halinde, usulsüzlük tespit edilen dönemlere ait komisyonlar iptal edilir ve
      ödenmemiş bakiyeler bloke edilebilir.
  </p>

  <p>
      <strong>MADDE 6 – GİZLİLİK VE KİŞİSEL VERİLERİN KORUNMASI</strong><br>
      Ortak; ad, soyad, iletişim ve banka bilgilerinin 6698 sayılı Kişisel Verilerin Korunması Kanunu
      (“KVKK”) kapsamında yalnızca ödeme, kimlik doğrulama ve iletişim amaçlarıyla işlenmesine
      açık rıza gösterdiğini kabul eder.
  </p>

  <p>
      <strong>MADDE 7 – YETKİLİ MAHKEME VE HUKUK</strong><br>
      İşbu Sözleşme Türk Hukuku’na tabidir. Taraflar arasında doğabilecek uyuşmazlıklarda
      Şirket merkezinin bulunduğu yer Mahkemeleri ve İcra Daireleri yetkilidir.
  </p>

  <p>
      <strong>MADDE 8 – YÜRÜRLÜK</strong><br>
      İşbu Sözleşme, Ortak’ın dijital ortamda “Okudum ve Kabul Ediyorum” beyanında bulunmasıyla
      yürürlüğe girer.
  </p>

</div>
    `;

    let html = `
      <div id="mdm-contract-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:2147483647; display:flex; justify-content:center; align-items:center; padding:20px;">
          <div style="background:white; width:100%; max-width:700px; max-height:85vh; border-radius:12px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
              <div style="padding:15px; border-bottom:1px solid #eee; background:#f8fafc; font-weight:bold; color:#1e293b; display:flex; justify-content:space-between;">
                  <span>⚖️ Ortaklık Sözleşmesi</span>
                  <span onclick="document.getElementById('mdm-contract-modal').remove()" style="cursor:pointer;">&times;</span>
              </div>
              <div style="padding:25px; overflow-y:auto; font-size:13px; color:#334155; background:white;">
                  ${contractText}
              </div>
              <div style="padding:15px; border-top:1px solid #eee; text-align:right; background:#f8fafc;">
                  <button onclick="acceptContract()" class="p-btn" style="width:auto; padding:12px 30px; background:#1e293b; color:white; border-radius:6px; font-weight:bold;">
                      <i class="fas fa-check-circle"></i> Okudum, Anlıyorum ve Kabul Ediyorum
                  </button>
              </div>
          </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
  };

  // --- 🔥 SÖZLEŞMEYİ KABUL ET (YEŞİL EFEKT) ---
  window.acceptContract = function () {
    // 1. Modalı Kapat
    document.getElementById("mdm-contract-modal").remove();

    // 2. Kutucuğu İşaretle
    document.getElementById("app_terms").checked = true;

    // 3. KUTUYU YEŞİLE ÇEVİR (Görsel Onay)
    const wrapper = document.getElementById("contract-wrapper");
    const text = document.getElementById("term-text");

    wrapper.style.backgroundColor = "#dcfce7"; // Açık yeşil arka plan
    wrapper.style.borderColor = "#22c55e"; // Yeşil kenarlık
    wrapper.style.color = "#14532d"; // Koyu yeşil yazı

    text.innerHTML = "<b>✅ Sözleşme Onaylandı.</b> Başvuruya hazırsınız.";

    // Şık bir efekt
    wrapper.style.transform = "scale(1.02)";
    setTimeout(() => (wrapper.style.transform = "scale(1)"), 200);
  };

  // --- 🔥 BAŞVURU GÖNDER (DÜZELTİLMİŞ VERSİYON - VERGİ BİLGİLERİ EKLENDİ) ---
  window.submitApplication = async function () {
    if (!document.getElementById("app_terms").checked) {
      alert("⚠️ Lütfen önce sözleşmeyi okuyup onaylayınız.");
      return;
    }

    // Buton Efekti
    const btn = event.target;
    const oldText = btn.innerText;
    btn.innerHTML =
      '<i class="fas fa-circle-notch fa-spin"></i> Gönderiliyor...';
    btn.style.opacity = "0.7";
    btn.disabled = true;

    try {
      // Backend'e Gönder
      const res = await fetch("https://api-hjen5442oq-uc.a.run.app", {
        // API URL'nin doğru olduğundan emin ol (yukarıdaki global değişkeni de kullanabilirsin)
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          islem: "submit_application",

          // Mevcut Veriler
          email: window.appData.email,
          name: window.appData.personal.name,
          phone: window.appData.personal.phone,
          reason: window.appData.social.strategy || "Strateji belirtilmedi",
          socialLinks: window.appData.social,
          customCoupon: window.appData.personal.customCoupon,
          bankInfo: window.appData.personal.bankInfo,
          userAgent: navigator.userAgent,

          // 🔥 EKLENEN KRİTİK VERİLER (BUNLAR EKSİKTİ) 🔥
          accountType: window.appData.personal.accountType, // "company" veya "individual"
          tckn: window.appData.personal.tckn, // TC Kimlik No
          taxInfo: window.appData.personal.taxInfo, // Vergi Dairesi / No
        }),
      });
      const data = await res.json();

      if (data.success) {
        const area = document.getElementById("app-form-area");
        area.innerHTML = `
              <div style="padding:50px; text-align:center; width:100%;">
                  <div style="font-size:70px; color:#10b981; margin-bottom:20px; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">🎉</div>
                  <h2 style="color:#1e293b;">Başvurunuz Başarıyla Alındı!</h2>
                  <p style="color:#64748b; max-width:400px; margin:10px auto; line-height:1.5;">
                      Teşekkürler <b>${window.appData.personal.name}</b>.<br>
                      Ekibimiz başvurunuzu en kısa sürede (genellikle 24 saat içinde) değerlendirip size dönüş yapacaktır.
                  </p>
                  <div style="margin-top:30px;">
                      <a href="/" class="btn-next" style="display:inline-block; width:auto; padding:12px 30px; text-decoration:none; background:#3b82f6;">Ana Sayfaya Dön</a>
                  </div>
              </div>
              <style>@keyframes popIn { from{transform:scale(0);} to{transform:scale(1);} }</style>
            `;
      } else {
        alert("❌ Hata: " + data.message);
        btn.innerHTML = oldText; // Eski haline dön
        btn.style.opacity = "1";
        btn.disabled = false;
      }
    } catch (e) {
      console.error("Başvuru hatası:", e);
      alert(
        "Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.",
      );
      btn.innerHTML = oldText;
      btn.style.opacity = "1";
      btn.disabled = false;
    }
  };
  // --- ZAMAN ÇİZELGESİ OLUŞTURUCU (Çakışma Önleyici Fix) ---
  function generateTimelineHTML(txDateStr, status) {
    // 1. Tarihleri Hesapla
    let saleDate = new Date();

    if (txDateStr) {
      if (typeof txDateStr === "string" && txDateStr.includes(".")) {
        const parts = txDateStr.split(".");
        if (parts.length === 3) {
          saleDate = new Date(parts[2], parts[1] - 1, parts[0]);
        }
      } else {
        let tryDate = new Date(txDateStr);
        if (!isNaN(tryDate.getTime())) {
          saleDate = tryDate;
        }
      }
    }

    const maturityDate = new Date(saleDate);
    maturityDate.setDate(maturityDate.getDate() + 14);

    const payoutDate = new Date(maturityDate);
    payoutDate.setDate(payoutDate.getDate() + 3);

    const fmt = (d) =>
      d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });

    // 2. Durumu Belirle
    let step = 1;
    if (status === "waiting_verification") step = 1;
    else if (status === "pending_maturity") step = 3;
    else if (status === "approved" || status === "paid") step = 4;

    if (status === "refunded") {
      return `<div style="text-align:center; padding:10px; background:#fff1f2; color:#ef4444; border-radius:8px; font-size:12px; border:1px solid #fecaca;">
                 <i class="fas fa-times-circle"></i> Bu sipariş iade edildiği için süreç iptal edildi.
              </div>`;
    }

    const getCls = (s) => {
      if (step > s) return "completed";
      if (step === s) return "active";
      return "";
    };

    const getIcon = (s) => {
      if (step > s) return "✓";
      if (step === s && s === 3) return "⏳";
      return s;
    };

    // 🔥 DÜZELTME BURADA: Class adını 'mdm-timeline-box' yaptık ve width:100% !important ekledik.
    return `
    <div class="mdm-timeline-box" style="display: flex; justify-content: space-between; margin-top: 20px; position: relative; padding: 0 10px; width: 100% !important; max-width: 100% !important; box-sizing: border-box;">
        
        <div style="position: absolute; top: 14px; left: 35px; right: 35px; height: 3px; background: #e2e8f0; z-index: 1;"></div>
        
        <div class="timeline-step ${getCls(1)}" style="position: relative; z-index: 2; text-align: center; width: 25%;">
            <div class="t-dot">${getIcon(1)}</div>
            <div class="t-label">Sipariş</div>
            <span class="t-date" style="font-size:10px; color:#94a3b8;">${fmt(saleDate)}</span>
        </div>
        
        <div class="timeline-step ${getCls(2)}" style="position: relative; z-index: 2; text-align: center; width: 25%;">
            <div class="t-dot">${getIcon(2)}</div>
            <div class="t-label">Kontrol</div>
            <span class="t-date" style="font-size:10px; color:#94a3b8;">Otomatik</span>
        </div>

        <div class="timeline-step ${getCls(3)}" style="position: relative; z-index: 2; text-align: center; width: 25%;">
            <div class="t-dot">${getIcon(3)}</div>
            <div class="t-label">14 Gün</div>
            <span class="t-date" style="font-size:10px; color:#94a3b8;">${fmt(maturityDate)}</span>
        </div>

        <div class="timeline-step ${getCls(4)}" style="position: relative; z-index: 2; text-align: center; width: 25%;">
            <div class="t-dot">💰</div>
            <div class="t-label">Bakiye</div>
            <span class="t-date" style="font-size:10px; color:#94a3b8;">${fmt(payoutDate)}</span>
        </div>
    </div>
    
    <div style="text-align:center; margin-top:15px; font-size:11px; color:#64748b; background:#f8fafc; padding:5px; border-radius:6px;">
        ${step === 3 ? "✅ Sipariş onaylandı, iade süresinin dolması bekleniyor." : ""}
        ${step === 4 ? "🎉 Tutar çekilebilir bakiyenize eklendi." : ""}
        ${step === 1 ? "⏳ Siparişin sistem tarafından onaylanması bekleniyor." : ""}
    </div>
    `;
  }
  // modum-partner.js içine eklenecek fonksiyon:

  PartnerApp.downloadReceiptPDF = function (transaction) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 🔥 TÜRKÇE KARAKTER DÜZELTİCİ FONKSİYON
    const trFix = (str) => {
      if (!str) return "";
      return String(str)
        .replace(/Ğ/g, "G")
        .replace(/ğ/g, "g")
        .replace(/Ü/g, "U")
        .replace(/ü/g, "u")
        .replace(/Ş/g, "S")
        .replace(/ş/g, "s")
        .replace(/İ/g, "I")
        .replace(/ı/g, "i")
        .replace(/Ö/g, "O")
        .replace(/ö/g, "o")
        .replace(/Ç/g, "C")
        .replace(/ç/g, "c");
    };

    // Şirket Logosu ve Başlık
    doc.setFontSize(22);
    doc.text("MODUMNET", 20, 20);
    doc.setFontSize(12);
    doc.text(trFix("GİDER PUSULASI / HAKEDİŞ RAPORU"), 20, 30);

    // Çizgi
    doc.line(20, 35, 190, 35);

    // Detaylar
    doc.setFontSize(10);
    doc.text(trFix(`İşlem Tarihi: ${transaction.date}`), 20, 50);
    doc.text(trFix(`İşlem ID: #${transaction.id.substring(0, 8)}`), 20, 55);
    doc.text(trFix(`Partner Adı: ${window.PartnerData.name}`), 20, 60);

    // Finansal Tablo
    let y = 80;
    doc.text(trFix("Hakediş Detayı:"), 20, y);
    y += 10;

    // Brüt
    doc.text(trFix("Brüt Komisyon Tutarı:"), 20, y);
    doc.text(`${transaction.commission} TL`, 150, y, { align: "right" });
    y += 8;

    // Vergi Hesaplama
    let amount = parseFloat(transaction.commission);
    let tax = amount * 0.2; // Varsayılan Stopaj
    let net = amount - tax;

    doc.setTextColor(200, 0, 0); // Kırmızı
    doc.text(trFix("Gelir Vergisi (Stopaj %20):"), 20, y);
    doc.text(`-${tax.toFixed(2)} TL`, 150, y, { align: "right" });
    y += 10;
    doc.line(20, y - 5, 190, y - 5); // Ara çizgi

    // Net
    doc.setTextColor(0, 150, 0); // Yeşil
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(trFix("HESABA YATAN NET:"), 20, y);
    doc.text(`${net.toFixed(2)} TL`, 150, y, { align: "right" });

    // Yasal Uyarı
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.setFont(undefined, "normal");
    doc.text(
      trFix(
        "Bu belge ModumNet iş ortaklığı sistemi tarafından dijital olarak üretilmiştir.",
      ),
      20,
      130,
    );
    doc.text(
      trFix(
        "Resmi muhasebe kayıtlarınızda bilgi fişi olarak kullanabilirsiniz.",
      ),
      20,
      135,
    );

    doc.save(`Modum_Makbuz_${transaction.date}.pdf`);
  };

  // --- TAM SAYFA TASARIM ÇİZİCİ (TRENDYOL STİLİ) ---
  function renderFullPageStore(container, data, refCode) {
    const products = data.products || [];
    const pName = data.partnerName || "Modum Partner";

    // Varsayılan Avatar (İsminin baş harfi)
    const avatarLetter = pName.charAt(0).toUpperCase();
    const avatarHtml = `<div style="width:80px; height:80px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:30px; color:#333; font-weight:bold; box-shadow:0 4px 10px rgba(0,0,0,0.1); border:4px solid white;">${avatarLetter}</div>`;

    // Ürün Listesi HTML'i (Mevcut fonksiyonu kullanabiliriz veya buraya özel yazabiliriz)
    let productGrid = "";

    if (products.length === 0) {
      productGrid = `<div style="text-align:center; grid-column:span 4; padding:50px; color:#999;">Bu partner henüz vitrinine ürün eklememiş.</div>`;
    } else {
      products.forEach((p) => {
        productGrid += `
            <div style="background:white; border-radius:8px; overflow:hidden; border:1px solid #f1f5f9; transition:transform 0.2s;">
                <a href="${p.url}?ref=${refCode}" target="_blank" style="text-decoration:none; color:inherit; display:block;">
                    <div style="position:relative; padding-top:120%;">
                        <img src="${p.image}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
                    </div>
                    <div style="padding:10px;">
                        <div style="font-size:12px; color:#334155; margin-bottom:5px; height:32px; overflow:hidden; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${p.title}</div>
                        <div style="font-weight:900; color:#10b981; font-size:15px;">${p.price}</div>
                    </div>
                </a>
            </div>
            `;
      });
    }

    // --- LANDING PAGE TASARIMI ---
    const html = `
    <style>
        .influencer-header {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            padding: 40px 20px;
            text-align: center;
            border-radius: 0 0 20px 20px;
            color: white;
            margin-bottom: 30px;
        }
        .influencer-avatar-box {
            margin-bottom: 10px;
            display: flex; justify-content: center;
        }
        .inf-name { font-size: 24px; font-weight: 800; margin: 0; }
        .inf-badge { background: #f59e0b; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; text-transform: uppercase; font-weight: bold; vertical-align: middle; margin-left: 5px; }
        .inf-bio { font-size: 14px; opacity: 0.8; max-width: 600px; margin: 5px auto 0; }
        
        .inf-grid {
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 10px; 
            padding: 0 10px;
        }
        @media (min-width: 768px) {
            .inf-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 0 20px; max-width: 1200px; margin: 0 auto; }
        }
    </style>

    <div style="background:#f8fafc; min-height:80vh; padding-bottom:50px;">
        <div class="influencer-header">
            <div class="influencer-avatar-box">
                ${avatarHtml}
            </div>
            <h1 class="inf-name">
                ${pName} <span class="inf-badge">Doğrulanmış Partner</span>
            </h1>
            <p class="inf-bio">
                ${pName}'in seçtiği favori ürünleri burada bulabilirsin. Beğendiklerini sepete ekle, fırsatları kaçırma!
            </p>
        </div>

        <div class="inf-grid">
            ${productGrid}
        </div>
        
        <div style="text-align:center; margin-top:40px; color:#94a3b8; font-size:12px;">
            Güvenli Alışveriş • ModumNet Garantisiyle
        </div>
    </div>
    `;

    // İçeriği Faprika sayfasına bas
    container.innerHTML = html;
  }

  // --- SAYFA AÇILINCA ÇALIŞTIR ---
  // Mevcut initPartnerSystem fonksiyonunun EN ALTINA veya window.onload içine:
  // setTimeout(renderApplicationPage, 500);
  // (Ama en sağlıklısı aşağıya yazdığım koddur)

  // Başlat
  setTimeout(initPartnerSystem, 1000);

  // --- 🔥 KRİTİK DÜZELTME: BAŞVURU SAYFASINI TETİKLE ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderApplicationPage);
  } else {
    renderApplicationPage(); // Sayfa zaten yüklendiyse hemen çalıştır
  }

  /*sistem güncellendi v17*/
})();
