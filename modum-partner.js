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
          renderVirtualShop(res.partnerName, res.products, collectionRef);
        }
      } catch (e) {
        console.log("Koleksiyon yüklenemedi:", e);
      }
    }
  }

  // --- HTML ÇİZİCİ (BEDEN GÖSTERİMLİ & YENİ SEKME MODU) ---
  function renderVirtualShop(partnerName, products, refCode) {
    if (!products || products.length === 0) return;

    let itemsHtml = "";

    products.forEach((p) => {
      // --- BEDENLERİ HAZIRLA ---
      let sizesHtml = "";
      if (p.sizes && Array.isArray(p.sizes) && p.sizes.length > 0) {
        // Sadece ilk 5 bedeni gösterelim, taşmasın
        const showSizes = p.sizes.slice(0, 5);
        sizesHtml = `<div style="display:flex; gap:3px; flex-wrap:wrap; margin-bottom:8px;">`;
        showSizes.forEach((s) => {
          sizesHtml += `<span style="font-size:10px; border:1px solid #cbd5e1; color:#64748b; padding:1px 4px; border-radius:3px;">${s}</span>`;
        });
        if (p.sizes.length > 5)
          sizesHtml += `<span style="font-size:9px; color:#999;">+${p.sizes.length - 5}</span>`;
        sizesHtml += `</div>`;
      } else {
        // Beden yoksa (Çanta vs.) boş geç
        sizesHtml = `<div style="height:21px;"></div>`;
      }

      itemsHtml += `
            <div style="background:white; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.05); border:1px solid #f1f5f9; display:flex; flex-direction:column; transition:transform 0.2s;">
                <a href="${p.url}?ref=${refCode}" target="_blank" style="text-decoration:none; color:inherit; flex:1;">
                    <div style="position:relative; padding-top:100%; overflow:hidden;">
                        <img src="${p.image}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
                        ${p.stock < 5 ? '<span style="position:absolute; bottom:5px; left:5px; background:#ef4444; color:white; font-size:9px; padding:2px 6px; border-radius:4px;">Son Ürünler</span>' : ""}
                    </div>
                    <div style="padding:10px 10px 0;">
                        <div style="font-size:12px; color:#334155; margin-bottom:5px; height:32px; overflow:hidden; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${p.title}</div>
                        
                        ${sizesHtml}
                        
                        <div style="font-weight:900; color:#10b981; font-size:15px; margin-bottom:5px;">${p.price}</div>
                    </div>
                </a>
                
                <div style="padding:0 10px 15px;">
                    <a href="${p.url}?ref=${refCode}" target="_blank" style="display:flex; align-items:center; justify-content:center; width:100%; padding:8px; background:#1e293b; color:white; border:none; border-radius:6px; font-weight:bold; font-size:12px; text-decoration:none; gap:5px;">
                        <span>İncele & Al</span> <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
         `;
    });

    // Eski modal varsa sil
    let old = document.getElementById("mdm-virtual-shop");
    if (old) old.remove();

    const html = `
        <div id="mdm-virtual-shop" style="position:fixed; top:0; left:0; width:100%; height:100%; background:#f8fafc; z-index:2147483647; overflow-y:auto; -webkit-overflow-scrolling:touch;">
            
            <div style="background:linear-gradient(135deg, #1e293b, #0f172a); color:white; padding:30px 20px 50px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.2); position:relative;">
                <button onclick="document.getElementById('mdm-virtual-shop').remove()" style="position:absolute; top:15px; right:15px; background:rgba(255,255,255,0.1); border:none; color:white; font-size:24px; cursor:pointer; width:35px; height:35px; border-radius:50%; display:flex; align-items:center; justify-content:center;">&times;</button>
                
                <div style="width:70px; height:70px; background:white; color:#333; font-size:35px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; border:4px solid rgba(255,255,255,0.2);">🛍️</div>
                <h1 style="margin:0; font-size:20px; font-weight:800;">${partnerName}'in Seçtikleri</h1>
                <p style="opacity:0.8; margin:5px 0 0; font-size:12px; max-width:400px; margin:5px auto;">
                    Beğendiğin ürüne tıkla, numaranı seç ve sepete ekle. (Beğendiğiniz ürüne tıklayın. Ürün yeni sekmede açılır; koleksiyon sayfanız açık kalır. Dilediğinizde geri dönebilirsiniz.)
                </p>
            </div>

            <div style="max-width:1000px; margin: -30px auto 0; padding:0 10px 50px; position:relative; z-index:10;">
                <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:10px; @media(min-width:768px){grid-template-columns: repeat(4, 1fr); gap:15px;}">
                    ${itemsHtml}
                </div>
            </div>

            <div style="text-align:center; padding:20px; color:#94a3b8; font-size:11px;">
                Güvenli Alışveriş • ModumNet Garantisiyle
            </div>
        </div>
      `;

    document.body.insertAdjacentHTML("beforeend", html);
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

  // --- DASHBOARD ARAYÜZÜ ---
  function openPartnerDashboard() {
    var old = document.getElementById("mdm-partner-modal");
    if (old) old.remove();

    // Verileri Hafızadan Al (API'den gelenler)
    var pData = window.PartnerData || {};
    var name = pData.name || "Ortak";

    // 🔥 İŞTE BURASI: VERİTABANINDAKİ GERÇEK KODU ALIYORUZ
    // Eğer kod gelmediyse hata vermesin diye varsayılan koyduk
    var myRefCode = pData.refCode || "Henüz Kod Oluşmadı";

    var css = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');

/* --- 1. ANA KAPLAYICI (Overlay) --- */
.p-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.8); z-index:2147483647; backdrop-filter:blur(5px); display:flex; justify-content:center; align-items:center; font-family:'Inter', sans-serif; }

/* --- 2. UYGULAMA KUTUSU --- */
.p-app { width:100%; height:100%; background:#f1f5f9; position:relative; display:flex; flex-direction:row; overflow:hidden; }
@media (min-width: 769px) { 
  .p-app { width:900px; height:85vh; border-radius:16px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); } 
}

/* --- 3. ORTAK SOL MENÜ (Hem Mobil Hem PC) --- */
.p-nav {
  width: 70px; /* PC Kapalı Genişlik */
  height: 100%;
  background: #0f172a;
  border-right: 1px solid #e2e8f0;
  display: flex; flex-direction: column;
  padding-top: 20px; gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative; z-index: 50;
  flex-shrink: 0;
}

/* Mobilde menüyü başlangıçta gizle (sola it) veya dar tut */
@media (max-width: 768px) {
  .p-nav { position: absolute; left: -70px; top: 0; bottom: 0; width: 70px; }
  .p-nav.mobile-open { left: 0; width: 200px; } /* Mobilde açılınca genişle */
  .p-app { flex-direction: column; } /* Mobilde içerik alta kaysın */
}

/* PC'de Genişleme */
@media (min-width: 769px) {
  .p-nav.expanded { width: 200px; }
}

/* Menü İçi */
.p-nav-logo { height:60px; display:flex; align-items:center; justify-content:center; width:100%; color:white; font-size:24px; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:10px; }

.p-nav-item { 
  height: 50px; display: flex; align-items: center; 
  color: #94a3b8; cursor: pointer; transition: 0.2s;
  text-decoration: none; padding: 0 20px;
  justify-content: center; /* Kapalıyken ortala */
}
.p-nav-item:hover { background: rgba(255,255,255,0.1); color:white; }
.p-nav-item.active { background: #3b82f6; color:white; border-right: 3px solid #60a5fa; }

.p-nav-icon { font-size: 18px; min-width: 30px; text-align: center; }
.p-nav-text { font-size: 13px; font-weight: 500; white-space: nowrap; opacity: 0; width: 0; overflow: hidden; transition: 0.3s; }

/* Menü Açıkken Yazıları Göster */
.p-nav.expanded .p-nav-text, .p-nav.mobile-open .p-nav-text { opacity: 1; width: auto; margin-left: 10px; }
.p-nav.expanded .p-nav-item, .p-nav.mobile-open .p-nav-item { justify-content: flex-start; }

/* Toggle Butonu (PC) */
.p-toggle-btn { 
  display:none; /* Mobilde gizli */
  position:absolute; bottom:0; left:0; width:100%; height:50px; 
  color:#64748b; cursor:pointer; border-top:1px solid rgba(255,255,255,0.1); 
  align-items:center; justify-content:center;
}
@media (min-width: 769px) { .p-toggle-btn { display:flex; } }
.p-nav.expanded .p-toggle-btn { justify-content:flex-end; padding-right:20px; }

/* --- 4. HEADER VE İÇERİK --- */
.p-content-wrapper { flex:1; display:flex; flex-direction:column; overflow:hidden; position:relative; width: 100%; }
.p-header { 
  height:60px; background:white; border-bottom:1px solid #e2e8f0; 
  display:flex; align-items:center; justify-content:space-between; padding:0 20px; 
  flex-shrink:0; 
}
.p-body { flex:1; overflow-y:auto; padding:20px; padding-bottom:215px; }

/* Mobil Hamburger Menü Butonu */
.mobile-menu-btn { display:none; font-size:24px; color:#334155; cursor:pointer; margin-right:10px; }
@media (max-width: 768px) { .mobile-menu-btn { display:block; } }

/* Mobil Overlay (Menü açılınca arkaplanı karart) */
.mobile-nav-overlay {
  display: none; position: absolute; top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.5); z-index: 40;
}
.p-nav.mobile-open + .p-content-wrapper .mobile-nav-overlay { display: block; }

/* --- 5. ORANLAR ve BİLDİRİM BUTONLARI --- */
.header-action-btn {
  width:32px; height:32px; border-radius:50%; 
  display:flex; align-items:center; justify-content:center; 
  cursor:pointer; transition:0.2s;
}
.btn-rates { background:#f0fdf4; color:#166534; border:1px solid #bbf7d0; font-size:12px; padding:0 10px; width:auto; border-radius:20px; font-weight:600; gap:5px; }
.btn-bell { background:#eff6ff; color:#3b82f6; border:1px solid #bfdbfe; }
.btn-close { background:#fee2e2; color:#ef4444; border:1px solid #fecaca; }

/* --- 6. DİĞER STİLLER (Vitrin vb.) --- */
.showcase-img-box { width: 100%; aspect-ratio: 1 / 1; background: #fff; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border-bottom: 1px solid #f1f5f9; }
.showcase-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.p-card { background:white; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:15px; overflow:hidden; box-shadow:0 2px 4px rgba(0,0,0,0.02); }
.p-stat-val { font-size:24px; font-weight:800; color:#0f172a; }
.p-stat-lbl { font-size:11px; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
.p-btn { width:100%; padding:12px; border:none; border-radius:8px; font-weight:700; font-size:13px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:5px; transition:0.2s; }
.p-btn:active { transform:scale(0.98); }

/* Oranlar Tablosu */
.tier-table { width:100%; border-collapse:collapse; margin-top:10px; font-size:12px; }
.tier-table th { text-align:left; color:#64748b; padding-bottom:8px; border-bottom:1px solid #e2e8f0; }
.tier-table td { padding:8px 0; border-bottom:1px solid #f1f5f9; color:#334155; font-weight:600; }
</style>
`;

    var html = `
<div id="mdm-partner-modal" class="p-overlay">
${css}
<div class="p-app">
  
  <div id="p-nav-container" class="p-nav">
      <div class="p-nav-logo">👑</div>

      <div class="p-nav-item active" onclick="PartnerApp.loadTab('home', this)">
          <div class="p-nav-icon"><i class="fas fa-chart-pie"></i></div>
          <span class="p-nav-text">Özet</span>
      </div>
      <div class="p-nav-item" onclick="PartnerApp.loadTab('links', this)">
          <div class="p-nav-icon"><i class="fas fa-link"></i></div>
          <span class="p-nav-text">Linkler</span>
      </div>
      <div class="p-nav-item" onclick="PartnerApp.loadTab('showcase', this)">
          <div class="p-nav-icon"><i class="fas fa-fire"></i></div>
          <span class="p-nav-text">Vitrin</span>
      </div>
      <div class="p-nav-item" onclick="PartnerApp.loadTab('my_collection', this)">
  <div class="p-nav-icon"><i class="fas fa-store"></i></div>
  <span class="p-nav-text">Mağazam</span>
</div>
      <div class="p-nav-item" onclick="PartnerApp.loadTab('wallet', this)">
          <div class="p-nav-icon"><i class="fas fa-wallet"></i></div>
          <span class="p-nav-text">Cüzdan</span>
      </div>
      <div class="p-nav-item" onclick="PartnerApp.loadTab('marketing', this)">
          <div class="p-nav-icon"><i class="fas fa-images"></i></div>
          <span class="p-nav-text">Medya</span>
      </div>
      <div class="p-nav-item" onclick="PartnerApp.loadTab('academy', this)">
          <div class="p-nav-icon"><i class="fas fa-graduation-cap"></i></div>
          <span class="p-nav-text">Akademi</span>
      </div>

      <div class="p-toggle-btn" onclick="PartnerApp.toggleSidebar()">
          <i class="fas fa-angle-double-right" id="p-toggle-icon"></i>
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
                  <span style="font-size:10px; color:#64748b; display:block; line-height:1;">MODUM PARTNER</span>
                  <div style="font-weight:800; color:#1e293b; font-size:15px;">${name}</div>
              </div>
          </div>
          
          <div style="display:flex; gap:8px;">
                <div class="header-action-btn btn-rates" onclick="PartnerApp.showTierInfo()">
                  <i class="fas fa-star" style="color:#16a34a"></i> Oranlar
              </div>
              
              <div class="header-action-btn btn-bell" onclick="PartnerApp.renderNotifications(document.getElementById('p-content-area'))">
                  <i class="fas fa-bell"></i>
              </div>

              <div class="header-action-btn btn-close" onclick="document.getElementById('mdm-partner-modal').remove()">✕</div>
          </div>
      </div>

      <div id="p-content-area" class="p-body"></div>
  </div>

</div>
</div>
`;

    document.body.insertAdjacentHTML("beforeend", html);

    // Açılış
    window.PartnerApp.loadTab("home");
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
        if (tab === "my_collection") this.renderMyCollection(area);
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
                      <td>0 - 10.000 ₺</td>
                      <td><span style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px;">%10</span></td>
                  </tr>
                  <tr>
                      <td>🥈 <b style="color:#94a3b8">Gümüş</b></td>
                      <td>10.000₺ - 49.999₺</td>
                      <td><span style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px;">%15</span></td>
                  </tr>
                  <tr>
                      <td>👑 <b style="color:#d97706">Altın</b></td>
                      <td>50.000+ ₺</td>
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

    renderHome: async function (container) {
      var email = detectUser();
      if (!email) {
        container.innerHTML =
          "<div style='padding:20px; text-align:center'>Giriş yapmalısınız.</div>";
        return;
      }

      try {
        // Yükleniyor...
        container.innerHTML =
          '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Veriler analiz ediliyor...</div>';

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

        // --- VERİ HAZIRLIĞI ---
        let currentRev = parseFloat(s.totalRevenue || 0);
        let myRate = parseFloat(s.commission_rate || 10);
        let tClicks = parseInt(s.totalClicks || 0);
        let tSales = parseInt(s.totalSales || 0);

        // 🔥 PRO ANALİZ HESAPLAMALARI (CR & EPC)

        // 1. Dönüşüm Oranı (CR)
        // Formül: (Satış / Tık) * 100
        let conversionRate =
          tClicks > 0 ? ((tSales / tClicks) * 100).toFixed(2) : "0.00";
        let crColor =
          conversionRate > 2.0
            ? "#10b981"
            : conversionRate > 1.0
              ? "#f59e0b"
              : "#ef4444"; // İyi: Yeşil, Orta: Sarı, Kötü: Kırmızı

        // 2. Tık Başı Kazanç (EPC)
        // Formül: (Toplam Tahmini Kazanç / Tık)
        let estimatedEarnings = currentRev * (myRate / 100);
        let epcVal =
          tClicks > 0 ? (estimatedEarnings / tClicks).toFixed(2) : "0.00";

        // --- TIER (SEVİYE) HESAPLAMA MOTORU ---
        let nextLevelName = "Maksimum";
        let nextTargetAmount = 0;
        let progressPercent = 0;
        let barColor = "#fbbf24";

        if (currentRev < 10000) {
          nextLevelName = "Gümüş (%15)";
          nextTargetAmount = 10000;
          progressPercent = (currentRev / 10000) * 100;
          barColor = "#94a3b8";
        } else if (currentRev < 50000) {
          nextLevelName = "Altın (%20)";
          nextTargetAmount = 50000;
          progressPercent = ((currentRev - 10000) / (50000 - 10000)) * 100;
          barColor = "#fbbf24";
        } else {
          nextLevelName = "Efsane";
          nextTargetAmount = currentRev;
          progressPercent = 100;
          barColor = "#ef4444";
        }

        let progressHTML = "";
        if (progressPercent < 100) {
          let remaining = (nextTargetAmount - currentRev).toLocaleString(
            "tr-TR",
          );
          progressHTML = `
              <div style="margin-top:15px;">
                  <div style="display:flex; justify-content:space-between; font-size:11px; color:rgba(255,255,255,0.8); margin-bottom:5px;">
                      <span>🚀 Sonraki: <b>${nextLevelName}</b></span>
                      <span>Kalan: <b>${remaining} ₺</b></span>
                  </div>
                  <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:10px; overflow:hidden;">
                      <div style="width:${progressPercent}%; height:100%; background:${barColor}; transition: width 1s ease-in-out;"></div>
                  </div>
                  <div style="font-size:10px; text-align:center; margin-top:3px; color:rgba(255,255,255,0.5);">
                      Hedef: ${nextTargetAmount.toLocaleString()} ₺ 
                  </div>
              </div>
          `;
        } else {
          progressHTML = `
              <div style="margin-top:15px; text-align:center; background:rgba(255,255,255,0.1); padding:5px; border-radius:8px;">
                  <span style="font-size:12px;">🏆 Zirvedesin! Maksimum oran geçerli.</span>
              </div>
          `;
        }

        // --- HTML ÇIKTISI ---
        container.innerHTML = `
          <div class="p-card" style="background:linear-gradient(135deg, #1e293b, #0f172a); color:white; border:none; padding:20px; border-radius:16px; margin-bottom:20px; box-shadow:0 10px 30px rgba(15, 23, 42, 0.4);">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                      <div style="font-size:11px; opacity:0.7; letter-spacing:1px;">MEVCUT SEVİYE</div>
                      <div style="font-size:22px; font-weight:800; color:${barColor}; text-shadow:0 0 10px ${barColor}40;">
                          ${s.level || "Bronz"} <span style="font-size:14px; color:white; opacity:0.8;">(%${myRate})</span>
                      </div>
                  </div>
                  <div style="text-align:right;">
                      <div style="font-size:11px; opacity:0.7; letter-spacing:1px;">BAKİYE</div>
                      <div style="font-size:24px; font-weight:800; color:#10b981;">${parseFloat(s.balance).toLocaleString("tr-TR")} ₺</div>
                  </div>
              </div>
              ${progressHTML}
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:10px;">
              <div class="p-card" style="padding:15px; text-align:center; margin:0;">
                  <div class="p-stat-val" style="font-size:18px;">${tClicks}</div>
                  <div class="p-stat-lbl">TIK</div>
              </div>
              <div class="p-card" style="padding:15px; text-align:center; margin:0;">
                  <div class="p-stat-val" style="font-size:18px;">${tSales}</div>
                  <div class="p-stat-lbl">SATIŞ</div>
              </div>
              <div class="p-card" style="padding:15px; text-align:center; margin:0; border:1px solid #a78bfa; background:#f5f3ff;">
                  <div class="p-stat-val" style="font-size:18px; color:#8b5cf6;">${s.referralCount || 0}</div>
                  <div class="p-stat-lbl" style="color:#7c3aed;">ÜYE</div>
              </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
              
              <div class="p-card" style="padding:15px; margin:0; background:#f0f9ff; border:1px solid #bae6fd;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                      <div class="p-stat-lbl" style="color:#0369a1;">DÖNÜŞÜM (CR)</div>
                      <i class="fas fa-percent" style="color:#0ea5e9; opacity:0.5;"></i>
                  </div>
                  <div class="p-stat-val" style="font-size:20px; color:${crColor}; margin-top:5px;">%${conversionRate}</div>
                  <div style="font-size:9px; color:#64748b; margin-top:3px;">Her 100 tıkta satış</div>
              </div>

              <div class="p-card" style="padding:15px; margin:0; background:#f0fdf4; border:1px solid #bbf7d0;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                      <div class="p-stat-lbl" style="color:#15803d;">TIK DEĞERİ (EPC)</div>
                      <i class="fas fa-coins" style="color:#22c55e; opacity:0.5;"></i>
                  </div>
                  <div class="p-stat-val" style="font-size:20px; color:#166534; margin-top:5px;">${epcVal} ₺</div>
                  <div style="font-size:9px; color:#64748b; margin-top:3px;">Tıklama başı getiri</div>
              </div>

          </div>
          
          <h4 style="margin:0 0 10px 0; font-size:12px; color:#64748b;">SON 7 GÜN KAZANÇ</h4>
          <div style="background:white; border-radius:12px; padding:10px; border:1px solid #e2e8f0;">
              <canvas id="p-chart" height="150"></canvas>
          </div>
        `;

        // GRAFİK ÇİZİMİ
        try {
          if (s.chart && s.chart.labels && s.chart.data) {
            new Chart(document.getElementById("p-chart"), {
              type: "line",
              data: {
                labels: s.chart.labels,
                datasets: [
                  {
                    label: "Kazanç",
                    data: s.chart.data,
                    borderColor: "#10b981",
                    tension: 0.4,
                    pointRadius: 3,
                    fill: true,
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                  },
                ],
              },
              options: {
                plugins: { legend: { display: false } },
                scales: {
                  x: { display: false, grid: { display: false } },
                  y: { display: false, grid: { display: false } },
                },
                responsive: true,
                maintainAspectRatio: false,
              },
            });
          } else {
            document.getElementById("p-chart").parentElement.innerHTML =
              "<div style='text-align:center; padding:20px; font-size:11px; color:#999;'>Grafik verisi yok.</div>";
          }
        } catch (err) {
          console.log("Grafik hatası:", err);
          document.getElementById("p-chart").parentElement.style.display =
            "none";
        }
      } catch (e) {
        container.innerHTML =
          "<div style='padding:20px; text-align:center; color:red;'>Bağlantı Hatası: " +
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
                    Nerede paylaşacağını seç, sana özel linki oluşturalım.
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

    // --- CÜZDAN & GEÇMİŞ (DEKONT BUTONLU FİNAL HALİ) ---
    renderWallet: async function (container) {
      container.innerHTML =
        '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Cüzdan yükleniyor...</div>';
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

        let historyHTML = "";
        if (data.success && data.list.length > 0) {
          data.list.forEach((tx) => {
            // --- 1. DEĞERLERİ HAZIRLA ---
            let val = parseFloat(tx.commission || tx.amount || 0);
            if (isNaN(val)) val = 0;

            let icon = "🛒";
            let color = "#10b981";
            let sign = "+";
            let desc = tx.desc;

            // --- 2. TİP KONTROLÜ ---
            if (tx.type === "payout_request") {
              icon = "💸";
              color = "#ef4444";
              sign = "-";
              if (!desc || desc === "Para Çekme Talebi") desc = "Ödeme Alındı";
            }

            // --- 3. İADE KONTROLÜ ---
            let isRefunded = tx.status === "refunded";
            let statusBadge = "";
            let amountText = `${sign}${val.toLocaleString()} ₺`;

            if (isRefunded) {
              color = "#94a3b8";
              amountText = `<span style="text-decoration:line-through;">${amountText}</span> <span style="color:red; font-size:10px;">(İADE)</span>`;
              statusBadge =
                '<span style="background:#fee2e2; color:red; padding:2px 6px; border-radius:4px; font-size:9px; margin-left:5px;">İADE EDİLDİ</span>';
              icon = "↩️";
            }

            // --- 4. DEKONT BUTONU ---
            let receiptBtn = "";
            if (tx.receiptUrl && tx.receiptUrl.length > 5) {
              receiptBtn = `<a href="${tx.receiptUrl}" target="_blank" onclick="event.stopPropagation()" style="display:inline-block; margin-top:2px; font-size:10px; background:#eff6ff; color:#3b82f6; padding:2px 6px; border-radius:4px; text-decoration:none; font-weight:bold; border:1px solid #dbeafe;">📄 Dekont</a>`;
            }

            // --- 🔥 5. KAYNAK ETİKETİ (YENİ EKLENDİ) ---
            let sourceBadge = "";
            // Backend'den 'sourceTag' alanı geliyorsa ve 'direct' değilse göster
            if (tx.soldItems && tx.soldItems.includes("🏷️")) {
              // Eski versiyonlarda sourceTag yoksa diye manuel parse denemesi (Gerekmeyebilir ama garanti olsun)
            }

            // Backend'den tx.sourceTag gelmesini bekliyoruz (Controller'da eklemiştik)
            // Eğer backend henüz göndermiyorsa, geçici olarak boş kalır.
            if (tx.sourceTag && tx.sourceTag !== "direct") {
              sourceBadge = `<span style="background:#f3e8ff; color:#7c3aed; font-size:9px; padding:2px 6px; border-radius:4px; margin-left:5px; border:1px solid #ddd6fe;">🏷️ ${tx.sourceTag}</span>`;
            }

            // --- 6. ÜRÜN LİSTESİ ---
            let productsHTML = "";
            let rawProd = "";

            if (
              tx.soldItemsList &&
              Array.isArray(tx.soldItemsList) &&
              tx.soldItemsList.length > 0
            ) {
              rawProd = tx.soldItemsList.join(", ");
            } else if (tx.soldItems) {
              rawProd = tx.soldItems;
            }

            if (rawProd.includes("%") || rawProd === "") {
              if (tx.type === "sale_commission")
                productsHTML = `<div style="font-size:10px; color:#ccc; margin-top:5px;">Ürün detayı yok</div>`;
            } else {
              productsHTML = `<div style="margin-top:10px; background:white; padding:8px; border-radius:6px; border:1px dashed #cbd5e1;">
                  <div style="font-size:10px; font-weight:bold; color:#64748b; margin-bottom:4px;">📦 SATILAN ÜRÜNLER:</div>
                  <div style="font-size:11px; color:#334155;">${rawProd}</div>
              </div>`;
            }

            // --- 7. KART HTML OLUŞTUR ---
            historyHTML += `
        <div class="p-card" style="padding:0; margin-bottom:10px; overflow:hidden; border:${isRefunded ? "1px solid #fee2e2" : "1px solid #e2e8f0"}">
            <div style="padding:15px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; background:${isRefunded ? "#fff1f2" : "white"};" 
                  onclick="var el = this.nextElementSibling; el.style.display = el.style.display === 'none' ? 'block' : 'none';">
                
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="background:#f1f5f9; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px;">${icon}</div>
                    <div>
                        <div style="font-weight:bold; font-size:13px; color:#334155;">
                            ${desc} ${statusBadge} ${sourceBadge} </div>
                        <div style="font-size:10px; color:#94a3b8;">${tx.date}</div>
                    </div>
                </div>
                
                <div style="text-align:right;">
                    <div style="font-weight:bold; color:${color}; font-size:14px;">${amountText}</div>
                    ${receiptBtn}
                    <div style="font-size:9px; color:#94a3b8; margin-top:2px;">▼ Detay</div>
                </div>
            </div>
            
            <div style="display:none; background:#f8fafc; padding:15px; border-top:1px solid #e2e8f0;">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px;">
                    <span style="color:#64748b">İşlem ID:</span>
                    <span style="font-family:monospace; color:#334155;">#${tx.id.substring(0, 6)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px;">
                    <span style="color:#64748b">Durum:</span>
                    <span style="font-weight:bold;">${tx.status === "paid" ? "ÖDENDİ ✅" : tx.status.toUpperCase()}</span>
                </div>
                ${productsHTML}
            </div>
        </div>`;
          });
        } else {
          historyHTML =
            '<div style="text-align:center; padding:20px; color:#94a3b8;">Henüz işlem geçmişi yok.</div>';
        }

        // --- BURASI GÜNCELLENDİ (ÖDEME İSTE BUTONU KALKTI, BEKLEYEN EKLENDİ) ---

        // Önce partner verisinin yüklü olduğundan emin olalım
        let pStats = window.PartnerData || {};

        // Eğer API'den gelen veriyi kullanmak istersen (daha güncel):
        // Ancak 'res' değişkeni sadece 'get_partner_history' çağrısının sonucudur, 'stats' içermez.
        // Bu yüzden window.PartnerData'yı kullanmak daha güvenlidir.

        let safeBalance = parseFloat(pStats.balance || 0);
        let pendingVal = parseFloat(pStats.pending_balance || 0);

        // 🔥 YENİ BAŞLIK EKLENDİ
        container.innerHTML = `
  <div style="background:#fff; border-left:4px solid #10b981; padding:15px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.05); margin-bottom:20px;">
      <h3 style="margin:0 0 5px 0; font-size:16px; color:#1e293b;">💰 Cüzdan ve Ödemeler</h3>
      <p style="margin:0; font-size:12px; color:#64748b; line-height:1.5;">
          Kazançlarınız satış onaylandıktan 14 gün sonra (iade süresi bitince) çekilebilir bakiyeye aktarılır.
      </p>
  </div>

  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:20px;">
      <div class="p-card" style="text-align:center; padding:20px; background:linear-gradient(135deg, #10b981, #059669); color:white; border:none; box-shadow:0 10px 20px rgba(16, 185, 129, 0.2); margin:0;">
          <div style="font-size:10px; opacity:0.9; font-weight:bold;">ÇEKİLEBİLİR BAKİYE</div>
          <div class="p-stat-val" style="color:white; font-size:28px; margin:5px 0;">${safeBalance.toLocaleString("tr-TR")} ₺</div> 
          <div style="font-size:10px; background:rgba(255,255,255,0.2); padding:2px 8px; border-radius:10px; display:inline-block;">Otomatik Ödenir</div>
      </div>

      <div class="p-card" style="text-align:center; padding:20px; background:#fffbeb; border:1px solid #fcd34d; color:#b45309; margin:0;">
          <div style="font-size:10px; opacity:0.8; font-weight:bold;">14 GÜN BEKLEYEN</div>
          <div class="p-stat-val" style="color:#d97706; font-size:28px; margin:5px 0;">${pendingVal.toLocaleString("tr-TR")} ₺</div> 
          <div style="font-size:10px; color:#d97706; opacity:0.8;">İade süresi dolunca aktarılır</div>
      </div>
  </div>
  
  <div style="background:#ecfdf5; border:1px dashed #10b981; padding:12px; border-radius:8px; margin-bottom:20px; display:flex; gap:10px; align-items:center;">
      <div style="font-size:20px;">🗓️</div>
      <div>
          <div style="font-weight:bold; color:#065f46; font-size:12px;">HAFTALIK ÖDEME GÜNÜ</div>
          <div style="font-size:11px; color:#047857;">Çekilebilir bakiyeniz 500 TL üzerindeyse her <b style="text-decoration:underline;">Çarşamba</b> günü otomatik olarak IBAN'ınıza yatırılır.</div>
      </div>
  </div>
  
  <div style="display:flex; justify-content:space-between; align-items:center; margin:20px 0 10px 0;">
      <h4 style="margin:0; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Hesap Hareketleri</h4>
      <button onclick="PartnerApp.downloadPDFStatement()" class="p-btn" style="width:auto; padding:6px 12px; font-size:11px; background:#1e293b; color:white; border:none;">
          <i class="fas fa-file-pdf"></i> Ekstre İndir (PDF)
      </button>
  </div>    
  ${historyHTML}
`;
        // Son olarak güncel bakiyeyi tekrar çekip ekrana basalım (Garanti olsun)
        PartnerApp.updateBalanceDisplay(container);
      } catch (e) {
        container.innerHTML = "Hata: " + e.message;
      }
    }, // 🔥 EKSİK OLAN FONKSİYON BURAYA EKLENECEK:
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
          data.list.forEach((p) => {
            // Ref linki hazırla
            let shareLink =
              p.url + (p.url.includes("?") ? "&" : "?") + "ref=" + myRefCode;

            // Ürün verisini güvenli bir şekilde string'e çevir (fonksiyona parametre olarak geçmek için)
            // Tırnak işaretleri sorun çıkarmasın diye encodeURIComponent kullanıyoruz.
            let safeProductData = encodeURIComponent(JSON.stringify(p));

            gridHtml += `
    <div class="p-card" style="padding:0; margin:0; display:flex; flex-direction:column; height:100%;">
        
        <div class="showcase-img-box">
            <img src="${p.image}" class="showcase-img">
            <div style="position:absolute; top:10px; right:10px; background:#ef4444; color:white; font-size:10px; padding:3px 8px; border-radius:4px; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
                Fırsat
            </div>
        </div>

        <div style="padding:12px; flex:1; display:flex; flex-direction:column; background:#fff;">
            <div style="font-weight:700; font-size:12px; color:#1e293b; margin-bottom:5px; line-height:1.4; height:34px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
                ${p.title}
            </div>
            
            <div style="margin-top:auto;">
                <div style="color:#10b981; font-weight:900; font-size:16px; margin-bottom:10px;">${p.price}</div>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;">
                    <button class="p-btn" style="background:#f1f5f9; color:#334155; font-size:11px;" onclick="PartnerApp.openQuickLink('${p.url}', '${myRefCode}')">
        <i class="fas fa-link"></i> Link
    </button>
                    <button class="p-btn" style="background:#3b82f6; color:white; font-size:11px;" onclick="PartnerApp.openStoryEditor('${safeProductData}')">
                        <i class="fas fa-paint-brush"></i> Story Yap
                    </button>
                </div>

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
    }, // --- 🛍️ MAĞAZAM (KOLEKSİYON YÖNETİMİ) ---
    renderMyCollection: async function (container) {
      container.innerHTML =
        '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Koleksiyonun yükleniyor...</div>';

      var pData = window.PartnerData || {};
      var myRefCode = pData.refCode;
      var collectionLink = "https://www.modum.tr/?koleksiyon=" + myRefCode;

      try {
        // Kendi koleksiyonunu çek (Public fonksiyonu kullanabiliriz)
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
                            Sitede gezerken "Koleksiyona Ekle" dediğin ürünler burada listelenir.
                        </p>
                        
                        <div style="display:flex; gap:10px; background:#eff6ff; padding:10px; border-radius:8px; border:1px solid #dbeafe; align-items:center;">
                            <input type="text" value="${collectionLink}" readonly style="flex:1; background:transparent; border:none; font-family:monospace; color:#1e40af; outline:none;">
                            <button onclick="navigator.clipboard.writeText('${collectionLink}'); alert('✅ Link Kopyalandı!');" class="p-btn" style="width:auto; padding:5px 15px; font-size:11px; background:#3b82f6; color:white;">
                                <i class="fas fa-copy"></i> Linki Kopyala
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

          let grid = `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:15px;">`;

          products.forEach((p) => {
            // Ürün Datasını string olarak sakla (Silmek için)
            // Sadece ID ve gerekli bilgileri gönderiyoruz
            const pSafe = encodeURIComponent(
              JSON.stringify({
                id: p.id,
                title: p.title,
                image: p.image,
                price: p.price,
                url: p.url,
              }),
            );

            grid += `
                        <div style="background:white; border-radius:8px; overflow:hidden; border:1px solid #e2e8f0; position:relative;">
                            <div style="height:150px; overflow:hidden; position:relative;">
                                <img src="${p.image}" style="width:100%; height:100%; object-fit:cover;">
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

          grid += `</div>`;
          container.innerHTML += grid;
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
    // 🔥 YENİ: PDF HAKEDİŞ RAPORU OLUŞTURUCU
    downloadPDFStatement: async function () {
      var email = detectUser();
      var pData = window.PartnerData || {};
      var name = pData.name || "Sayın Ortağımız";

      // Butona basıldığını hissettir
      const btn = event.target;
      const oldText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Hazırlanıyor...';
      btn.disabled = true;

      try {
        // 1. Verileri Çek (Son 100 işlem)
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            islem: "get_partner_history",
            email: email,
          }),
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

        // --- TASARIM BAŞLIYOR ---

        // Logo & Başlık (Mavi Şerit)
        doc.setFillColor(30, 41, 59); // Koyu Lacivert (#1e293b)
        doc.rect(0, 0, 210, 40, "F"); // Üst şerit

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("MODUMNET", 15, 20);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("PARTNER HAKEDIS EKSTRESI", 15, 28);

        // Sağ Üst Bilgi
        doc.setFontSize(9);
        doc.text("Tarih: " + new Date().toLocaleDateString("tr-TR"), 195, 20, {
          align: "right",
        });
        doc.text("Ortak: " + name, 195, 28, { align: "right" });
        doc.text("E-Posta: " + email, 195, 33, { align: "right" });

        // Özet Bilgi Kutusu
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.text(
          `Sayin ${name}, asagida ModumNet ortaklik programi kapsaminda gerceklesen`,
          15,
          50,
        );
        doc.text(
          `satis ve hakedis islemlerinizin dokumu yer almaktadir.`,
          15,
          55,
        );

        // Tablo Verisini Hazırla
        let tableRows = [];
        data.list.forEach((tx) => {
          let amount = parseFloat(tx.commission || tx.amount || 0).toFixed(2);
          let type =
            tx.type === "payout_request" ? "ODEME CIKISI" : "SATIS KAZANCI";
          let status =
            tx.status === "paid"
              ? "ODENDI"
              : tx.status === "pending"
                ? "BEKLIYOR"
                : "ONAYLANDI";
          let sign = tx.type === "payout_request" ? "-" : "+";

          // Türkçe karakter sorununu aşmak için basit replace (jsPDF default fontu TR karakter sevmez)
          let desc = (tx.desc || "")
            .replace(/İ/g, "I")
            .replace(/ı/g, "i")
            .replace(/Ş/g, "S")
            .replace(/ş/g, "s")
            .replace(/Ğ/g, "G")
            .replace(/ğ/g, "g");

          tableRows.push([tx.date, type, desc, status, sign + amount + " TL"]);
        });

        // Tabloyu Çiz
        doc.autoTable({
          startY: 65,
          head: [["Tarih", "Islem Tipi", "Aciklama", "Durum", "Tutar"]],
          body: tableRows,
          theme: "grid",
          headStyles: {
            fillColor: [67, 97, 238],
            textColor: 255,
            fontStyle: "bold",
          }, // Mavi başlık
          styles: { fontSize: 8, cellPadding: 3 },
          alternateRowStyles: { fillColor: [241, 245, 249] }, // Açık gri satırlar
        });

        // Alt Bilgi (Footer)
        let finalY = doc.lastAutoTable.finalY + 20;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          "Bu belge bilgilendirme amaclidir. Resmi fatura yerine gecmez.",
          105,
          finalY,
          { align: "center" },
        );
        doc.text("ModumNet E-Ticaret Sistemleri", 105, finalY + 5, {
          align: "center",
        });

        // İndir
        doc.save(`Modum_Ekstre_${new Date().toISOString().slice(0, 10)}.pdf`);
      } catch (e) {
        console.error("PDF Hatası:", e);
        alert("PDF oluşturulurken bir hata oluştu.");
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
                      Nerede paylaşacağını seç, sana özel linki oluşturalım.
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
    },
  };
  // --- 🚀 SİTE-ÜSTÜ HIZLI LİNK VE KOLEKSİYON ÇUBUĞU (FİNAL) ---
  function renderSiteStripe() {
    if (document.getElementById("mdm-stripe-bar")) return;

    var pData = window.PartnerData || {};
    var myRefCode = pData.refCode;
    if (!myRefCode) return;

    // Ürün sayfası kontrolü (Faprika uyumlu)
    var isProductPage =
      window.location.href.includes("-p-") ||
      document.querySelector('meta[property="product:price:amount"]') ||
      document.querySelector(".product-price");

    // Koleksiyon Linki
    var collectionLink = "https://www.modum.tr/?koleksiyon=" + myRefCode;

    // Butonlar
    var collectionBtn = "";
    if (isProductPage) {
      collectionBtn = `
            <button onclick="PartnerApp.toggleCollectionItem()" class="mdm-btn" style="background:#f59e0b; color:#fff; border:1px solid #d97706;">
                <i class="fas fa-plus-circle"></i> <span class="hide-mobile">Ekle</span>
            </button>
        `;
    }

    var stripeHTML = `
    <style>
        #mdm-stripe-bar {
            position: fixed; top: 0; left: 0; width: 100%; height: 45px; 
            background: #0f172a; color: white; z-index: 2147483640; 
            display: flex; align-items: center; justify-content: space-between; 
            padding: 0 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); 
            font-family: 'Inter', sans-serif; box-sizing: border-box;
            border-bottom: 2px solid #3b82f6;
        }
        .mdm-btn {
            background: #334155; color: white; border: 1px solid #475569; padding: 6px 12px; 
            border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;
            display: flex; align-items: center; gap: 6px; text-decoration: none;
            transition: 0.2s; white-space: nowrap; height: 32px;
        }
        .mdm-btn:active { transform: scale(0.95); }
        .mdm-divider { width:1px; height:20px; background:#334155; margin:0 5px; }
        
        /* Mobil Düzenlemeler */
        @media (max-width: 600px) {
            .hide-mobile { display: none; }
            #mdm-stripe-bar { padding: 0 8px; }
            .mdm-btn { padding: 6px 10px; font-size: 13px; }
        }
    </style>
    <div id="mdm-stripe-bar">
        <div style="display:flex; align-items:center; gap:10px;">
            <div style="font-weight:900; color:#fbbf24; font-size:18px;">👑</div>
            
            <button onclick="PartnerApp.openShareMenu('${window.location.href}')" class="mdm-btn" style="background:#3b82f6; border-color:#2563eb;">
                <i class="fas fa-share-alt"></i> Paylaş
            </button>
        </div>
        
        <div style="display:flex; gap:8px; align-items:center;">
             ${collectionBtn}
             
             <div class="mdm-divider"></div>

             <button onclick="PartnerApp.openShareMenu('${window.location.href}')" class="mdm-btn" style="background:#10b981; border-color:#059669;">
                <i class="fas fa-store"></i> <span class="hide-mobile">Mağazam</span>
            </button>

            <div onclick="closeStripe()" style="padding:0 5px; cursor:pointer; color:#94a3b8; font-size:22px; line-height:1; margin-left:5px;">&times;</div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", stripeHTML);

    // Siteyi aşağı it
    document.body.style.marginTop = "45px";
    var headers = document.querySelectorAll(
      "header, .header, #header, .header-container, .top-bar, .sticky-header",
    );
    headers.forEach(function (h) {
      var style = window.getComputedStyle(h);
      if (style.position === "fixed" || style.position === "sticky") {
        h.style.top = "45px";
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

    // --- CSS STİLLERİ (MOBİL UYUMLU) ---
    const style = `
  <style>
      /* GENEL MASAÜSTÜ AYARLARI */
      .app-hero { width:100%; height:300px; background:url('${BANNER_IMG}') center/cover no-repeat; position:relative; display:flex; align-items:center; justify-content:center; }
      .app-hero::after { content:''; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); }
      .app-hero-content { position:relative; z-index:2; text-align:center; color:white; padding:20px; }
      .app-hero h1 { font-size:40px; font-weight:900; margin:0; text-transform:uppercase; letter-spacing:2px; }
      .app-hero p { font-size:18px; opacity:0.9; margin-top:10px; }
      
      /* Kutuların taşmasını önleyen sihirli kod */
      .app-container * { box-sizing: border-box; }
      .app-container { max-width:1100px; margin: -50px auto 50px; position:relative; z-index:10; padding:0 15px; width:100%; overflow:hidden; }
      
      /* KARTLAR */
      .benefit-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; margin-bottom:40px; }
      .b-card { background:white; padding:30px; border-radius:16px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.05); transition:0.3s; }
      .b-card:hover { transform:translateY(-10px); }
      .b-card img { width:80px; height:80px; border-radius:50%; margin-bottom:15px; object-fit:cover; }
      .b-card h4 { font-size:18px; color:#1e293b; margin:0 0 10px; }
      .b-card p { font-size:13px; color:#64748b; line-height:1.5; }

      /* FORM KUTUSU */
      .form-box { display:flex; background:white; border-radius:20px; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.1); min-height:550px; }
      .form-left { width:40%; background:url('${FORM_SIDE_IMG}') center/cover; position:relative; }
      .form-left::after { content:''; position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(to top, #0f172a, transparent); }
      .form-left-text { position:absolute; bottom:30px; left:30px; color:white; z-index:2; }
      
      .form-right { width:60%; padding:40px; display:flex; flex-direction:column; }
      
      /* ADIMLAR VE INPUTLAR */
      .step-indicator { display:flex; gap:10px; margin-bottom:30px; }
      .step-dot { flex:1; height:4px; background:#e2e8f0; border-radius:4px; }
      .step-dot.active { background:#3b82f6; }
      
      .inp-group { margin-bottom:15px; }
      .inp-group label { display:block; font-size:12px; font-weight:bold; color:#475569; margin-bottom:5px; }
      .inp-group input, .inp-group select, .inp-group textarea { width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; outline:none; font-family:'Inter', sans-serif; box-sizing:border-box; }
      .inp-group input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }

      .btn-next { background:#0f172a; color:white; border:none; padding:15px; width:100%; border-radius:8px; font-weight:bold; cursor:pointer; margin-top:auto; font-size:16px; transition:0.2s; }
      .btn-next:hover { background:#1e293b; transform:scale(1.02); }

      /* 🔥 MOBİL İÇİN ÖZEL AYARLAR (GÜNCELLENMİŞ) */
      @media(max-width:768px) {
          /* Bannerı Düzelt */
          .app-hero { 
              height: auto; 
              min-height: 250px; /* Yüksekliği biraz artır */
              background-position: top center; /* Görselin üst kısmını göster */
              padding: 40px 15px; /* İçerik için boşluk */
              align-items: flex-end; /* Yazıları alta it */
          }
          .app-hero h1 { font-size: 20px; line-height: 1.2; }
          .app-hero p { font-size: 13px; margin-top: 5px; }
          
          /* Konteynırı yukarı çek */
          .app-container { margin-top: -20px; padding: 0 15px; }

          /* Kartları daha kompakt yap (Yatay Liste Gibi) */
          .benefit-grid { grid-template-columns: 1fr; gap: 10px; margin-bottom: 20px; }
          .b-card { padding: 15px; display: flex; align-items: center; text-align: left; gap: 15px; }
          .b-card img { width: 50px; height: 50px; margin-bottom: 0; }
          .b-card h4 { font-size: 15px; margin-bottom: 2px; }
          .b-card p { font-size: 11px; margin: 0; }

          /* Form Yapısı */
          .form-box { flex-direction: column; min-height: auto; } /* Yüksekliği serbest bırak */
          
          /* 🔥 Yan resmi mobilde GİZLE */
          .form-left { display: none; } 
          
          /* Sağ tarafı tam genişlik yap */
          .form-right { width: 100%; padding: 20px 15px; }
          
          /* Inputları rahatlat */
          .inp-group input, .btn-next { font-size: 16px; } 
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
  function renderFormContent(status, email) {
    const area = document.getElementById("app-form-area");

    // 1. ÖNCE HER DURUMDA FORMU YÜKLE (Böylece herkes sayfayı görür)
    window.appData = { email: email };
    showStep1(); // Formu ekrana basar

    // 2. ŞİMDİ DURUMA GÖRE KISITLAMA GETİR (Inputları Kilitle)

    // SENARYO 1: GİRİŞ YAPMAMIŞ (Formu gizle, Giriş butonu koy)
    if (!email) {
      area.innerHTML = `
          <div class="form-left"><div class="form-left-text"><h3 style="margin:0;">Aramıza Katıl</h3></div></div>
          <div class="form-right" style="justify-content:center; text-align:center;">
              <div style="font-size:50px; margin-bottom:20px;">🔒</div>
              <h2 style="margin:0; color:#1e293b;">Önce Giriş Yapmalısın</h2>
              <p style="color:#64748b; margin:10px 0 30px;">Başvuru yapabilmek için üye olmalısınız.</p>
              <a href="/uyelik-girisi" class="btn-next" style="text-decoration:none; display:block; line-height:20px;">GİRİŞ YAP / KAYIT OL</a>
          </div>`;
      return;
    }

    // SENARYO 2: ZATEN PARTNER (Formu Kilitle + Panele Git Butonu)
    if (status === "active") {
      disableFormArea("👑 Tebrikler! Zaten onaylı bir iş ortağımızsınız.");

      // Butonu Değiştir
      setTimeout(() => {
        const btn = area.querySelector(".btn-next");
        if (btn) {
          btn.innerText = "ORTAKLIK PANELİNE GİT ➔";
          btn.style.background = "#3b82f6"; // Mavi
          btn.onclick = function () {
            PartnerApp.openPartnerDashboard();
          }; // Panele yönlendir
        }
      }, 100);
    }

    // SENARYO 3: BEKLEMEDE (Formu Kilitle + Bilgi Ver)
    else if (status === "pending") {
      disableFormArea("⏳ Başvurunuz alındı ve şu an inceleme aşamasında.");

      // Butonu Pasif Yap
      setTimeout(() => {
        const btn = area.querySelector(".btn-next");
        if (btn) {
          btn.innerText = "SONUÇ BEKLENİYOR...";
          btn.style.background = "#94a3b8"; // Gri
          btn.style.cursor = "default";
          btn.onclick = null; // Tıklamayı iptal et
        }
      }, 100);
    }

    // SENARYO 4: REDDEDİLMİŞ (Form Açık + Uyarı Ver)
    else if (status === "rejected") {
      // Inputları kilitlemiyoruz, sadece uyarı ekliyoruz
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
    window.appData = { email: email };
    showIntro(); // 🔥 ÖNCE TANITIM EKRANI AÇILSIN
  }

  // --- ADIM 0: SİSTEM TANITIMI (YENİ) ---
  window.showIntro = function () {
    const area = document.getElementById("app-form-area");
    area.innerHTML = `
      <div class="form-left">
          <div class="form-left-text">
              <h3 style="margin:0;">Hoş Geldin!</h3>
              <p style="margin:5px 0 0; opacity:0.8;">Kazanmaya başlamadan önce...</p>
          </div>
      </div>
      <div class="form-right">
          <h2 style="color:#1e293b; margin-top:0;">ModumNet Partner Programı</h2>
          <p style="color:#64748b; font-size:13px; line-height:1.6;">
              Sosyal medya gücünü gelire dönüştürmeye hazır mısın? ModumNet Partner programı ile paylaştığın her linkten komisyon kazanabilirsin.
          </p>

          <div style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:20px;">
              <h4 style="margin:0 0 10px 0; color:#334155;">💎 Kazanç Oranları</h4>
              <ul style="margin:0; padding-left:20px; font-size:12px; color:#475569; line-height:1.8;">
                  <li><b>🥉 Bronz Seviye:</b> %10 Komisyon (Başlangıç)</li>
                  <li><b>🥈 Gümüş Seviye:</b> %15 Komisyon (10.000 TL üzeri ciro)</li>
                  <li><b>👑 Altın Seviye:</b> %20 Komisyon (50.000 TL üzeri ciro)</li>
              </ul>
          </div>

          <div style="background:#f0fdf4; padding:10px; border-radius:6px; border:1px solid #bbf7d0; font-size:12px; color:#166534; margin-bottom:20px;">
              <i class="fas fa-gift"></i> Ayrıca takipçilerine özel tanımlayacağın <b>İndirim Kuponu</b> ile satışlarını artırabilirsin!
          </div>

          <button onclick="showStep1()" class="btn-next">BAŞVURUYA BAŞLA &rarr;</button>
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

  function renderFormLogic(email) {
    const area = document.getElementById("app-form-area");

    // SENARYO A: GİRİŞ YAPMAMIŞ
    if (!email) {
      area.innerHTML = `
          <div class="form-left">
              <div class="form-left-text">
                  <h3 style="margin:0;">Aramıza Katıl</h3>
                  <p style="margin:5px 0 0; opacity:0.8;">ModumNet ailesinin bir parçası ol.</p>
              </div>
          </div>
          <div class="form-right" style="justify-content:center; text-align:center;">
              <div style="font-size:50px; margin-bottom:20px;">🔒</div>
              <h2 style="margin:0; color:#1e293b;">Önce Giriş Yapmalısın</h2>
              <p style="color:#64748b; margin:10px 0 30px;">Partner başvurusu yapabilmek için ModumNet üyesi olman gerekiyor. Hesabın varsa giriş yap, yoksa hemen ücretsiz oluştur.</p>
              
              <a href="/uyelik-girisi" class="btn-next" style="text-decoration:none; display:block; line-height:20px;">
                  GİRİŞ YAP / KAYIT OL
              </a>
          </div>
        `;
      return;
    }

    // SENARYO B: GİRİŞ YAPMIŞ -> BAŞVURU FORMU (ADIM 1)
    window.appData = { email: email }; // Verileri toplamak için
    showStep1();
  }

  // --- ADIM 1: SOSYAL MEDYA ---
  window.showStep1 = function () {
    const area = document.getElementById("app-form-area");
    area.innerHTML = `
      <div class="form-left">
          <div class="form-left-text">
              <h3 style="margin:0;">Adım 1/3</h3>
              <p style="margin:5px 0 0; opacity:0.8;">Sosyal medya gücünü tanıyalım.</p>
          </div>
      </div>
      <div class="form-right">
          <div class="step-indicator">
              <div class="step-dot active"></div><div class="step-dot"></div><div class="step-dot"></div>
          </div>
          
          <h3 style="margin:0 0 20px 0; color:#1e293b;">Sosyal Medya Hesapların</h3>

          <div class="inp-group">
              <label>Instagram Kullanıcı Adın (Zorunlu)</label>
              <input type="text" id="app_insta" placeholder="@kullaniciadi">
          </div>
          <div class="inp-group">
              <label>TikTok, YouTube veya Diğerleri (Varsa)</label>
              <input type="text" id="app_other" placeholder="Örn: TikTok: @modum, YouTube: ModumKanal (Hepsini yazabilirsiniz)">
              <div style="font-size:10px; color:#94a3b8; margin-top:3px;">Birden fazla hesabınız varsa araya virgül koyarak yazabilirsiniz.</div>
          </div>
          <div class="inp-group">
              <label>Toplam Takipçi Sayın (Tahmini)</label>
              <select id="app_followers">
                  <option value="1k-5k">1.000 - 5.000</option>
                  <option value="5k-10k">5.000 - 10.000</option>
                  <option value="10k-50k">10.000 - 50.000</option>
                  <option value="50k+">50.000+</option>
              </select>
          </div>

          <button onclick="validateStep1()" class="btn-next">DEVAM ET &rarr;</button>
      </div>
    `;
  };

  window.validateStep1 = function () {
    const insta = document.getElementById("app_insta").value;
    if (insta.length < 3) return alert("Lütfen Instagram kullanıcı adını gir.");

    window.appData.social = {
      instagram: insta,
      other: document.getElementById("app_other").value,
      followers: document.getElementById("app_followers").value,
    };
    showStep2();
  };

  // --- ADIM 2: KİŞİSEL BİLGİLER, KUPON VE BANKA ---
  window.showStep2 = function () {
    const area = document.getElementById("app-form-area");
    area.innerHTML = `
      <div class="form-left">
          <div class="form-left-text">
              <h3 style="margin:0;">Adım 2/3</h3>
              <p style="margin:5px 0 0; opacity:0.8;">Kimlik ve Ödeme Bilgileri.</p>
          </div>
      </div>
      <div class="form-right">
          <div class="step-indicator">
              <div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot"></div>
          </div>
          
          <div class="inp-group">
              <label>Adın Soyadın (Hesap Sahibi)</label>
              <input type="text" id="app_name" placeholder="Tam adınız">
          </div>
          <div class="inp-group">
              <label>Telefon Numaran (WhatsApp)</label>
              <input type="tel" id="app_phone" placeholder="0555 555 55 55">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <div class="inp-group">
                  <label>Banka Seçiniz</label>
                  <select id="app_bank_name">
                      <option value="">Seç...</option>
                      <option value="Ziraat">Ziraat Bankası</option>
                      <option value="Garanti">Garanti BBVA</option>
                      <option value="IsBank">İş Bankası</option>
                      <option value="Akbank">Akbank</option>
                      <option value="Yapikredi">Yapı Kredi</option>
                      <option value="Finansbank">QNB Finansbank</option>
                      <option value="Halkbank">Halkbank</option>
                      <option value="Vakifbank">Vakıfbank</option>
                      <option value="Diger">Diğer / Papara</option>
                  </select>
              </div>
              <div class="inp-group">
                  <label>IBAN Numarası</label>
                  <input type="text" id="app_iban" placeholder="TR..." maxlength="32" oninput="this.value = this.value.toUpperCase()">
              </div>
          </div>

          <div class="inp-group" style="background:#fff7ed; padding:10px; border:1px solid #fdba74; border-radius:8px;">
              <label style="color:#c2410c;">İstediğin İndirim Kodu</label>
              <input type="text" id="app_coupon" placeholder="Örn: AHMET15" style="font-weight:bold; color:#c2410c;">
          </div>

          <div class="inp-group">
              <label>Neden ModumNet?</label>
              <textarea id="app_reason" rows="2" placeholder="Hedeflerin neler?"></textarea>
          </div>

          <div style="display:flex; gap:10px;">
              <button onclick="showStep1()" class="btn-next" style="background:#e2e8f0; color:#334155;">&larr; Geri</button>
              <button onclick="validateStep2()" class="btn-next">SON ADIM &rarr;</button>
          </div>
      </div>
    `;
  };

  // --- VALIDATION GÜNCELLEMESİ (IBAN KONTROLÜ) ---
  window.validateStep2 = function () {
    const name = document.getElementById("app_name").value;
    const phone = document.getElementById("app_phone").value;
    const coupon = document
      .getElementById("app_coupon")
      .value.toUpperCase()
      .replace(/[^A-Z0-9]/g, "");

    // Yeni Banka Verileri
    const bankName = document.getElementById("app_bank_name").value;
    let iban = document.getElementById("app_iban").value.trim();

    if (name.length < 3 || phone.length < 10)
      return alert("Ad ve telefon zorunludur.");
    if (coupon.length < 3)
      return alert("Lütfen geçerli bir kupon kodu belirleyin.");

    // IBAN Kontrolü (Basit)
    if (!bankName) return alert("Lütfen bankanızı seçiniz.");
    if (!iban.startsWith("TR") || iban.length < 10)
      return alert("Lütfen geçerli bir IBAN giriniz (TR ile başlamalı).");

    window.appData.personal = {
      name: name,
      phone: phone,
      reason: document.getElementById("app_reason").value,
      customCoupon: coupon,
      bankInfo: `${bankName} - ${iban}`, // 🔥 Tek satırda birleştirip saklıyoruz
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

  // --- 🔥 BAŞVURU GÖNDER (GLOBAL WINDOW FIX) ---
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
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          islem: "submit_application", // Backend fonksiyon adını kontrol et (submit_application olmalı)
          email: window.appData.email,
          name: window.appData.personal.name,
          phone: window.appData.personal.phone,
          reason: window.appData.personal.reason,
          socialLinks: window.appData.social,
          // Eğer özel kupon isteği varsa buraya ekleyebiliriz, şimdilik boş
          customCoupon: window.appData.personal.customCoupon,
          bankInfo: window.appData.personal.bankInfo,
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

  /*sistem güncellendi v1*/
})();
