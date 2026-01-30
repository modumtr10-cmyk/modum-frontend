/**
 * 👑 MODUM PARTNER PRO (Influencer Hub)
 * v3.1 - Tier Bilgilendirme Sistemi ve Gelişmiş Arayüz
 */

(function () {
  console.log("🚀 Modum Partner Pro (v3.1) Başlatılıyor...");

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
  }

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
.p-body { flex:1; overflow-y:auto; padding:20px; padding-bottom:80px; }

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
      },

      // --- LİNKLER & QR KOD (KAYNAK TAKİBİ EKLENDİ v3.2) ---
      renderLinks: function (c) {
        var pData = window.PartnerData || {};
        var myRefCode = pData.refCode || "REF-BEKLENIYOR";
        var myCoupon = pData.custom_coupon || "Tanımlanmamış";
        var homeLink = "https://www.modum.tr/?ref=" + myRefCode;

        // İndirim Kodu HTML
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
            <h3 style="margin:0 0 5px 0; font-size:16px; color:#1e293b;">🔗 Link ve QR Araçları</h3>
            <p style="margin:0; font-size:12px; color:#64748b; line-height:1.5;">
                Buradan kendinize özel takip linkleri oluşturabilirsiniz. Paylaştığınız linklerden gelen her satış size kazanç olarak döner.
            </p>
        </div>

        ${couponHTML}
        
        <div class="p-card" style="background:#f0f9ff; border:1px solid #bae6fd; padding:15px; margin-bottom:20px;">
            <label class="p-stat-lbl" style="color:#0284c7; display:block; margin-bottom:5px;">🏠 ANA SAYFA LİNKİN</label>
            <div style="background:white; padding:12px; border-radius:8px; font-family:monospace; color:#0369a1; border:1px dashed #0ea5e9; word-break:break-all; font-size:12px; margin-bottom:10px;">
                ${homeLink}
            </div>
            <button onclick="navigator.clipboard.writeText('${homeLink}'); alert('Kopyalandı!')" class="p-btn" style="background:#0ea5e9; color:white; height:40px; font-size:13px; border:none; border-radius:8px; flex:1; width:100%;">
                <i class="fas fa-copy"></i> Kopyala
            </button>
        </div>

        <hr style="border:0; border-top:1px solid #e2e8f0; margin:20px 0;">

        <p style="font-size:13px; color:#334155; margin-bottom:15px; font-weight:600;">📦 Akıllı Link Oluşturucu:</p>

        <div class="p-card" style="padding:20px; border-radius:12px; border:1px solid #e2e8f0; background:white;">
            
            <div class="form-group" style="margin-bottom:15px;">
                <label class="p-stat-lbl" style="display:block; margin-bottom:5px;">1. ÜRÜN LİNKİ (Zorunlu)</label>
                <input type="text" id="pl-input" placeholder="https://www.modum.tr/urun/..." style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; box-sizing:border-box; outline:none; font-size:13px;">
            </div>

            <div class="form-group" style="margin-bottom:15px;">
                <label class="p-stat-lbl" style="display:block; margin-bottom:5px; color:#8b5cf6;">2. KAYNAK ETİKETİ (İsteğe Bağlı)</label>
                <input type="text" id="pl-source" placeholder="Örn: story_sabah, youtube_bio" style="width:100%; padding:12px; border:1px solid #ddd6fe; border-radius:8px; box-sizing:border-box; outline:none; font-size:13px; background:#f5f3ff; color:#6d28d9;">
                <div style="font-size:10px; color:#64748b; margin-top:3px;">
                    <i class="fas fa-info-circle"></i> Buraya yazdığınız not (örn: 'instagram'), satış raporlarında görünür. Böylece hangi paylaşımın kazandırdığını takip edebilirsiniz.
                </div>
            </div>
            
            <button onclick="PartnerApp.createLink('${myRefCode}')" class="p-btn p-btn-primary" style="margin-top:5px; background:#3b82f6; color:white; border:none; padding:12px; border-radius:8px; width:100%; font-weight:bold;">
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
            
            <button onclick="navigator.clipboard.writeText(document.getElementById('pl-final').innerText); alert('Kopyalandı!')" class="p-btn" style="background:#1e293b; color:white; width:100%; padding:12px; border:none; border-radius:8px; font-weight:bold;">
                <i class="fas fa-copy"></i> Linki Kopyala
            </button>

            <div id="pl-qr-box" style="display:none; margin-top:15px; background:white; padding:15px; border-radius:12px; border:1px solid #e2e8f0; text-align:center;">
                <div style="font-size:12px; color:#64748b; margin-bottom:10px;">Bu QR kodu okutan, senin referansınla ürüne gider! 👇</div>
                <img id="pl-qr-img" src="" style="width:200px; height:200px; margin:0 auto; display:block; border:1px solid #eee; padding:5px;">
                <a id="pl-qr-dl" href="#" target="_blank" class="p-btn" style="margin-top:10px; background:#f59e0b; color:white; font-size:12px; width:auto; display:inline-flex; text-decoration:none;">
                    📥 Resmi İndir
                </a>
            </div>
        </div>
      `;
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
          qrBox.style.display =
            qrBox.style.display === "none" ? "block" : "none";
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
      }, // 🔥 YENİ: STORY EDİTÖR MODALI AÇ
      openStoryEditor: function (encodedProductData) {
        // Eski modal varsa sil
        let old = document.getElementById("p-story-modal");
        if (old) old.remove();

        // Veriyi geri al
        let product = JSON.parse(decodeURIComponent(encodedProductData));
        let pData = window.PartnerData || {};
        let myCoupon = pData.custom_coupon || "KOD YOK";

        let html = `
<div id="p-story-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:999999999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;">
    <div style="display:flex; justify-content:flex-end; width:100%; max-width:400px; margin-bottom:10px;">
        <span onclick="document.getElementById('p-story-modal').remove()" style="cursor:pointer; font-size:30px; color:white;">&times;</span>
    </div>
    
    <div style="box-shadow:0 20px 50px rgba(0,0,0,0.5); border-radius:12px; overflow:hidden; max-height:70vh; aspect-ratio: 9 / 16;">
        <canvas id="story-canvas" width="1080" height="1920" style="width:100%; height:100%; object-fit:contain;"></canvas>
    </div>

    <div style="margin-top:20px; display:flex; gap:10px;">
        <button id="dl-story-btn" class="p-btn" style="background:#f59e0b; color:white; font-size:16px; padding:12px 30px; opacity:0.5; pointer-events:none;">
            <i class="fas fa-spinner fa-spin"></i> Hazırlanıyor...
        </button>
    </div>
    <div style="color:rgba(255,255,255,0.6); font-size:12px; margin-top:10px;">Hikayende paylaşmak için indir! 👆</div>
</div>
`;
        document.body.insertAdjacentHTML("beforeend", html);

        // Çizim işlemini başlat
        this.drawStory("story-canvas", product, myCoupon);
      },

      // 🔥 YENİ: CANVAS ÇİZİM MOTORU (EN ÖNEMLİ KISIM)
      drawStory: async function (canvasId, product, coupon) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext("2d");
        const btn = document.getElementById("dl-story-btn");

        try {
          // 1. Görseli yükle (Bekle)
          const img = await loadCanvasImage(product.image);

          // 2. Arka Planı Temizle ve Boya (Şık bir koyu degrade)
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          let grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
          grd.addColorStop(0, "#1e293b"); // Koyu lacivert üst
          grd.addColorStop(1, "#0f172a"); // Daha koyu alt
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // 3. Üst Başlık (Marka Adı)
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.font = "bold 30px 'Inter', sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("modum.tr", canvas.width / 2, 100);

          // 4. Ürün Görselini Çiz
          // Görseli kare yapıp ortalayalım.
          const imgSize = 800;
          const imgX = (canvas.width - imgSize) / 2;
          const imgY = 200;

          // Görselin altına hafif bir gölge efekti için
          ctx.fillStyle = "rgba(0,0,0,0.3)";
          ctx.fillRect(imgX + 20, imgY + 20, imgSize, imgSize);
          // Beyaz çerçeve
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(imgX - 10, imgY - 10, imgSize + 20, imgSize + 20);
          // Resmi çiz (Eğer resim kare değilse sündürmemek için object-fit benzeri bir hesaplama yapılabilir ama şimdilik basit tutalım)
          ctx.drawImage(img, imgX, imgY, imgSize, imgSize);

          // 5. Ürün Başlığı (Satır atlamalı)
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 50px 'Inter', sans-serif";
          ctx.textAlign = "center";
          // wrapText(context, text, x, y, maxWidth, lineHeight)
          let nextY = wrapText(
            ctx,
            product.title.toUpperCase(),
            canvas.width / 2,
            imgY + imgSize + 100,
            900,
            70,
          );

          // 6. Fiyat
          ctx.fillStyle = "#fbbf24"; // Sarı renk
          ctx.font = "900 120px 'Inter', sans-serif";
          ctx.fillText(product.price, canvas.width / 2, nextY + 80);

          // 7. Kupon Kutusu Tasarımı
          if (coupon && coupon !== "KOD YOK") {
            const couponBoxY = nextY + 180;
            const boxWidth = 700;
            const boxHeight = 250;
            const boxX = (canvas.width - boxWidth) / 2;

            // Kutunun kendisi (Mor degrade)
            let cGrd = ctx.createLinearGradient(
              boxX,
              couponBoxY,
              boxX + boxWidth,
              couponBoxY + boxHeight,
            );
            cGrd.addColorStop(0, "#8b5cf6");
            cGrd.addColorStop(1, "#6d28d9");
            ctx.fillStyle = cGrd;
            // Basit dikdörtgen yerine köşeleri yuvarlak yapmak için (Basit tutalım şimdilik)
            ctx.fillRect(boxX, couponBoxY, boxWidth, boxHeight);

            // Kutunun kenarlığı
            ctx.lineWidth = 10;
            ctx.strokeStyle = "rgba(255,255,255,0.3)";
            ctx.strokeRect(
              boxX + 5,
              couponBoxY + 5,
              boxWidth - 10,
              boxHeight - 10,
            );

            // Üst yazı
            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.font = "bold 30px 'Inter', sans-serif";
            ctx.fillText(
              "BU KODU KULLAN, İNDİRİMİ KAP!",
              canvas.width / 2,
              couponBoxY + 60,
            );

            // Kupon Kodu (Devasa)
            ctx.fillStyle = "#ffffff";
            ctx.font = "900 100px monospace";
            ctx.letterSpacing = "5px";
            ctx.fillText(coupon, canvas.width / 2, couponBoxY + 180);
          }

          // --- Çizim Bitti ---

          // Butonu aktif et ve indirme fonksiyonunu bağla
          btn.style.opacity = "1";
          btn.style.pointerEvents = "all";
          btn.innerHTML = '<i class="fas fa-download"></i> Görseli İndir';
          btn.onclick = () =>
            this.downloadStory(canvasId, "modum-firsat-" + coupon);
        } catch (e) {
          console.error("Story çizim hatası:", e);
          btn.innerHTML = "Hata Oluştu";
          btn.style.background = "red";
          alert(
            "Görsel oluşturulurken bir hata oluştu. Ürün görseli farklı bir sunucudan geliyor olabilir.",
          );
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
                if (!desc || desc === "Para Çekme Talebi")
                  desc = "Ödeme Alındı";
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
                      <button class="p-btn" style="background:#f1f5f9; color:#334155; font-size:11px;" onclick="navigator.clipboard.writeText('${shareLink}'); alert('✅ Link Kopyalandı!')">
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
      }, // 🔥 YENİ: PDF HAKEDİŞ RAPORU OLUŞTURUCU
      downloadPDFStatement: async function () {
        var email = detectUser();
        var pData = window.PartnerData || {};
        var name = pData.name || "Sayın Ortağımız";

        // Butona basıldığını hissettir
        const btn = event.target;
        const oldText = btn.innerHTML;
        btn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Hazırlanıyor...';
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
          doc.text(
            "Tarih: " + new Date().toLocaleDateString("tr-TR"),
            195,
            20,
            { align: "right" },
          );
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

            tableRows.push([
              tx.date,
              type,
              desc,
              status,
              sign + amount + " TL",
            ]);
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
      },
    };

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
  // --- 🚀 SİTE-ÜSTÜ HIZLI LİNK ÇUBUĞU (AKILLI HEADER KAYDIRMA) ---
  function renderSiteStripe() {
    // 1. Zaten varsa tekrar ekleme
    if (document.getElementById("mdm-stripe-bar")) return;

    // 2. Verileri Al
    var pData = window.PartnerData || {};
    var myRefCode = pData.refCode;

    // Eğer ref kodu yoksa barı gösterme
    if (!myRefCode) return;

    // 3. Link Hazırlığı
    var currentUrl = window.location.href.split("?")[0];
    var finalLink = currentUrl + "?ref=" + myRefCode;
    var waMsg = encodeURIComponent("Bu ürüne bayıldım! Link: " + finalLink);

    // 4. HTML (Sadeleştirilmiş ve Şık)
    var stripeHTML = `
    <style>
        #mdm-stripe-bar {
            position: fixed; top: 0; left: 0; width: 100%; height: 40px; 
            background: #0f172a; color: white; z-index: 999990; 
            display: flex; align-items: center; justify-content: space-between; 
            padding: 0 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); 
            font-family: 'Inter', sans-serif; box-sizing: border-box;
        }
        .mdm-bar-input {
            background: #1e293b; border: 1px solid #334155; color: #fbbf24; 
            padding: 4px 8px; border-radius: 4px; font-family: monospace; 
            font-size: 11px; width: 100%; max-width: 180px; outline: none;
        }
        .mdm-btn {
            background: #3b82f6; color: white; border: none; padding: 5px 10px; 
            border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;
            display: flex; align-items: center; gap: 4px; text-decoration: none;
        }
    </style>
    <div id="mdm-stripe-bar">
        <div style="font-weight:900; color:#fbbf24; font-size:12px;">👑 MODUM</div>
        
        <div style="display:flex; gap:5px; align-items:center; flex:1; justify-content:flex-end;">
            <input type="text" value="${finalLink}" readonly class="mdm-bar-input">
            
            <button onclick="navigator.clipboard.writeText('${finalLink}'); alert('✅ Kopyalandı!')" class="mdm-btn">
                <i class="fas fa-link"></i> 
                <span style="display:none; @media(min-width:400px){display:inline;}">Kopyala</span>
            </button>
            
            <a href="https://api.whatsapp.com/send?text=${waMsg}" target="_blank" class="mdm-btn" style="background:#25D366;">
                <i class="fab fa-whatsapp"></i>
            </a>

            <div onclick="closeStripe()" style="padding:0 5px; cursor:pointer; color:#999;">&times;</div>
        </div>
    </div>
    `;

    // 5. Sayfaya Ekle
    document.body.insertAdjacentHTML("afterbegin", stripeHTML);

    // 6. 🔥 AKILLI KAYDIRMA MOTORU (ÖNEMLİ KISIM)
    var barHeight = 40;

    // A. Body'yi aşağı it (Sayfa içeriği için)
    document.body.style.marginTop = barHeight + "px";

    // B. Faprika'nın Header'ını bul ve aşağı it
    // Faprika genelde 'header' etiketini veya '.header-wrapper' class'ını kullanır.
    // Garanti olsun diye yaygın kullanılan tüm header sınıflarını deniyoruz.
    var headers = document.querySelectorAll(
      "header, .header, #header, .header-container, .top-bar, .sticky-header",
    );

    headers.forEach(function (h) {
      // Eğer header "fixed" veya "sticky" ise, onu aşağı itmemiz lazım
      var style = window.getComputedStyle(h);
      if (style.position === "fixed" || style.position === "sticky") {
        h.style.top = barHeight + "px";
      }
    });

    // 7. Kapatma Fonksiyonu
    window.closeStripe = function () {
      document.getElementById("mdm-stripe-bar").remove();
      document.body.style.marginTop = "0px";
      headers.forEach(function (h) {
        h.style.top = "0px";
      });
    };
    var styleFix = document.createElement("style");
    styleFix.innerHTML = `
        /* Partner Paneli açıldığında her şeyin üstünde olsun */
        #mdm-partner-modal { z-index: 2147483647 !important; }
        
        /* Link Çubuğu bir tık altta olsun */
        #mdm-stripe-bar { z-index: 2147483640 !important; }
        
        /* Eğer mobildeysek, link çubuğu altta olduğu için, 
           Faprika'nın "Sepete Ekle" veya "WhatsApp" butonlarını kapatmasın diye 
           sayfanın altına boşluk ekle */
        @media (max-width: 768px) {
            body { padding-bottom: 50px !important; }
        }
    `;
    document.head.appendChild(styleFix);
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

        /* 🔥 MOBİL İÇİN ÖZEL AYARLAR (EN ÖNEMLİ KISIM) */
        @media(max-width:768px) {
            /* Bannerı küçült */
            .app-hero { height: 200px; }
            .app-hero h1 { font-size: 24px; }
            .app-hero p { font-size: 14px; }
            .form-right { width: 100%; padding: 20px 15px; }
            
            /* Konteynırı yukarı çek */
            .app-container { margin-top: -30px; padding: 0 15px; }

            /* Kartları daha kompakt yap (Yatay Liste Gibi) */
            .benefit-grid { grid-template-columns: 1fr; gap: 10px; margin-bottom: 20px; }
            .b-card { padding: 15px; display: flex; align-items: center; text-align: left; gap: 15px; }
            .b-card img { width: 50px; height: 50px; margin-bottom: 0; }
            .b-card h4 { font-size: 15px; margin-bottom: 2px; }
            .b-card p { font-size: 11px; margin: 0; }

            /* Form Yapısı */
            .form-box { flex-direction: column; }
            
            /* 🔥 Yan resmi mobilde GİZLE (Yer kaplamasın, form odaklı olsun) */
            .form-left { display: none; } 
            
            /* Sağ tarafı tam genişlik yap */
            .form-right { width: 100%; padding: 25px 20px; }
            
            /* Inputları rahatlat */
            .inp-group input, .btn-next { font-size: 16px; } /* Mobilde zoom yapmaması için */
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

  // --- ADIM 2: KİŞİSEL BİLGİLER VE KUPON ---
  window.showStep2 = function () {
    const area = document.getElementById("app-form-area");
    area.innerHTML = `
        <div class="form-left">
            <div class="form-left-text">
                <h3 style="margin:0;">Adım 2/3</h3>
                <p style="margin:5px 0 0; opacity:0.8;">Sana özel kodunu belirle.</p>
            </div>
        </div>
        <div class="form-right">
            <div class="step-indicator">
                <div class="step-dot active"></div><div class="step-dot active"></div><div class="step-dot"></div>
            </div>
            
            <div class="inp-group">
                <label>Adın Soyadın</label>
                <input type="text" id="app_name" placeholder="Tam adınız">
            </div>
            <div class="inp-group">
                <label>Telefon Numaran (WhatsApp)</label>
                <input type="tel" id="app_phone" placeholder="0555 555 55 55">
            </div>

            <div class="inp-group" style="background:#fff7ed; padding:10px; border:1px solid #fdba74; border-radius:8px;">
                <label style="color:#c2410c;">İstediğin İndirim Kodu</label>
                <input type="text" id="app_coupon" placeholder="Örn: AHMET15" style="font-weight:bold; color:#c2410c;">
                <div style="font-size:10px; color:#9a3412; margin-top:3px;">Takipçilerin bu kodu kullanarak indirim kazanacak. (Harf ve Rakam)</div>
            </div>

            <div class="inp-group">
                <label>Neden ModumNet? (Kısaca anlat)</label>
                <textarea id="app_reason" rows="2" placeholder="Hedeflerin neler?"></textarea>
            </div>

            <div style="display:flex; gap:10px;">
                <button onclick="showStep1()" class="btn-next" style="background:#e2e8f0; color:#334155;">&larr; Geri</button>
                <button onclick="validateStep2()" class="btn-next">SON ADIM &rarr;</button>
            </div>
        </div>
      `;
  };

  // VALIDATION GÜNCELLEMESİ
  window.validateStep2 = function () {
    const name = document.getElementById("app_name").value;
    const phone = document.getElementById("app_phone").value;
    const coupon = document
      .getElementById("app_coupon")
      .value.toUpperCase()
      .replace(/[^A-Z0-9]/g, ""); // Sadece harf rakam

    if (name.length < 3 || phone.length < 10)
      return alert("Ad ve telefon zorunludur.");
    if (coupon.length < 3)
      return alert("Lütfen geçerli bir kupon kodu belirleyin (Örn: ADIN10).");

    window.appData.personal = {
      name: name,
      phone: phone,
      reason: document.getElementById("app_reason").value,
      customCoupon: coupon, // 🔥 Veriye ekledik
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
        <div style="font-family: 'Times New Roman', serif; line-height:1.6;">
            <h3 style="text-align:center; border-bottom:1px solid #ddd; padding-bottom:10px;">MODUMNET SATIŞ ORTAKLIĞI (AFFILIATE) SÖZLEŞMESİ</h3>
            
            <p><strong>MADDE 1: TARAFLAR VE KONU</strong><br>
            İşbu sözleşme, ModumNet E-Ticaret Sistemleri ("Şirket") ile başvuru formunu dolduran gerçek/tüzel kişi ("Ortak") arasında, Şirket'in ürünlerinin dijital ortamda pazarlanması ve komisyon ödenmesi şartlarını düzenler.</p>
            
            <p><strong>MADDE 2: KOMİSYON VE HAKEDİŞ</strong><br>
            2.1. Ortak, kendisine özel üretilen bağlantılar (linkler) üzerinden gerçekleşen, iptal/iade edilmeyen her satıştan, sistemde belirtilen "Bronz (%10), Gümüş (%15), Altın (%20)" oranlarında komisyon hak eder.<br>
            2.2. Hakedişler, 6502 sayılı Tüketicinin Korunması Hakkında Kanun gereği 14 günlük yasal cayma süresi dolduktan sonra kesinleşir.<br>
            2.3. Ödemeler, kesinleşmiş bakiye 500 TL (Beş Yüz Türk Lirası) limitine ulaştığında, Ortak tarafından bildirilen IBAN adresine haftalık periyotlarla (Çarşamba günü) yapılır.</p>
            
            <p><strong>MADDE 3: YASAKLI FAALİYETLER VE FESİH</strong><br>
            Aşağıdaki durumların tespiti halinde Şirket, sözleşmeyi tek taraflı feshetme ve içerideki bakiyeyi bloke etme hakkını saklı tutar:<br>
            a) Kendi referans linki üzerinden kişisel alışveriş yapmak (Self-Referral).<br>
            b) Marka itibarını zedeleyici, yanıltıcı veya spam niteliğinde paylaşımlar yapmak.<br>
            c) Sahte sipariş oluşturup iptal ederek sistemi manipüle etmek.</p>
            
            <p><strong>MADDE 4: GİZLİLİK VE KVKK</strong><br>
            Ortak; Ad, Soyad, Telefon ve Banka bilgilerinin, 6698 sayılı KVKK kapsamında sadece ödeme ve iletişim süreçleri için işlenmesine açık rıza gösterir.</p>
            
            <p><strong>MADDE 5: YÜRÜRLÜK</strong><br>
            İşbu sözleşme, Ortağın dijital ortamda "Okudum, Kabul Ediyorum" beyanı ile yürürlüğe girer.</p>
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

  /*sistem güncellendi v7*/
})();
