/**
 * 👑 MODUM PARTNER PRO (Influencer Hub)
 * v2.0 - Mobil Öncelikli, Dinamik ve Profesyonel
 */

(function () {
  console.log("🚀 Modum Partner Pro Başlatılıyor...");

  const API_URL = "https://api-hjen5442oq-uc.a.run.app";

  // --- CHART.JS OTOMATİK YÜKLEYİCİ ---
  if (typeof Chart === "undefined") {
    let script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    document.head.appendChild(script);
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

  // --- BAŞLATICI ---
  async function initPartnerSystem() {
    var email = detectUser();
    if (!email) return;

    // 🔥 Backend Kontrolü (Simüle ediliyor, gerçekte API'ye sorulmalı)
    // Burada backend'e "is_partner" sorgusu atıp true dönerse devam edilmeli.
    // Şimdilik test için localStorage veya belirli mailler:
    var isPartner =
      localStorage.getItem("mdm_is_partner") === "true" ||
      email === "info@modum.tr";

    if (isPartner) {
      renderFloatingButton();
    }
  }

  // --- YÜZEN BUTON (FLOATING ACTION BUTTON) ---
  function renderFloatingButton() {
    if (document.getElementById("mdm-partner-fab")) return;

    var btn = document.createElement("div");
    btn.id = "mdm-partner-fab";
    btn.innerHTML = `<i class="fas fa-chart-line"></i>`;

    Object.assign(btn.style, {
      position: "fixed",
      bottom: "90px",
      right: "20px",
      zIndex: "999990",
      width: "55px",
      height: "55px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #0f172a, #334155)",
      color: "#fbbf24",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      cursor: "pointer",
      border: "2px solid #fbbf24",
      transition: "transform 0.2s",
    });

    btn.onclick = openPartnerApp;
    document.body.appendChild(btn);
  }

  // --- 📱 ANA UYGULAMA ARAYÜZÜ (APP UI) ---
  function openPartnerApp() {
    var email = detectUser();
    var old = document.getElementById("mdm-partner-app");
    if (old) old.remove();

    var css = `
      <style>
          .mpa-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:999999; display:flex; justify-content:center; align-items:flex-end; backdrop-filter:blur(5px); font-family:'Inter', sans-serif; }
          .mpa-app { width:100%; max-width:480px; height:90vh; background:#f8fafc; border-radius:20px 20px 0 0; display:flex; flex-direction:column; overflow:hidden; position:relative; box-shadow:0 -10px 40px rgba(0,0,0,0.5); animation:slideUp 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
          .mpa-header { padding:20px; background:#1e293b; color:white; display:flex; justify-content:space-between; align-items:center; }
          .mpa-body { flex:1; overflow-y:auto; padding:20px; padding-bottom:80px; }
          .mpa-nav { position:absolute; bottom:0; width:100%; background:#fff; border-top:1px solid #e2e8f0; display:flex; justify-content:space-around; padding:10px 0; height:70px; box-sizing:border-box; }
          .mpa-nav-item { display:flex; flex-direction:column; align-items:center; color:#94a3b8; font-size:10px; font-weight:600; cursor:pointer; flex:1; }
          .mpa-nav-item.active { color:#3b82f6; }
          .mpa-nav-item i { font-size:20px; margin-bottom:4px; }
          .mpa-card { background:#fff; padding:20px; border-radius:16px; border:1px solid #e2e8f0; margin-bottom:15px; box-shadow:0 2px 5px rgba(0,0,0,0.02); }
          .mpa-stat-val { font-size:24px; font-weight:900; color:#0f172a; }
          .mpa-stat-lbl { font-size:11px; color:#64748b; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; }
          .mpa-btn-primary { width:100%; background:#3b82f6; color:white; border:none; padding:14px; border-radius:12px; font-weight:bold; font-size:14px; cursor:pointer; box-shadow:0 4px 15px rgba(59, 130, 246, 0.3); }
          @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
      </style>
      `;

    var html = `
      <div id="mdm-partner-app" class="mpa-overlay">
          ${css}
          <div class="mpa-app">
              
              <div class="mpa-header">
                  <div>
                      <div style="font-size:12px; color:#94a3b8;">Hoşgeldin Ortak,</div>
                      <div style="font-size:16px; font-weight:bold;">${email.split("@")[0]}</div>
                  </div>
                  <div onclick="document.getElementById('mdm-partner-app').remove()" style="background:rgba(255,255,255,0.1); width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:50%; cursor:pointer;">✕</div>
              </div>

              <div id="mpa-content" class="mpa-body">
                  <div style="text-align:center; padding:50px; color:#94a3b8;">
                      <i class="fas fa-circle-notch fa-spin" style="font-size:30px;"></i>
                  </div>
              </div>

              <div class="mpa-nav">
                  <div class="mpa-nav-item active" onclick="PartnerApp.loadPage('dashboard', this)">
                      <i class="fas fa-home"></i> Özet
                  </div>
                  <div class="mpa-nav-item" onclick="PartnerApp.loadPage('links', this)">
                      <i class="fas fa-link"></i> Linkler
                  </div>
                  <div class="mpa-nav-item" onclick="PartnerApp.loadPage('wallet', this)">
                      <i class="fas fa-wallet"></i> Cüzdan
                  </div>
              </div>

          </div>
      </div>
      `;

    document.body.insertAdjacentHTML("beforeend", html);

    // Uygulama Fonksiyonlarını Başlat
    window.PartnerApp = {
      loadPage: function (page, el) {
        // Navigasyon Aktifliği
        if (el) {
          document
            .querySelectorAll(".mpa-nav-item")
            .forEach((i) => i.classList.remove("active"));
          el.classList.add("active");
        }

        const content = document.getElementById("mpa-content");
        content.innerHTML =
          '<div style="text-align:center; padding:50px; color:#94a3b8;"><i class="fas fa-circle-notch fa-spin"></i></div>';

        // Sayfa İçerikleri
        if (page === "dashboard") this.renderDashboard(content);
        if (page === "links") this.renderLinkGenerator(content);
        if (page === "wallet") this.renderWallet(content);
      },

      renderDashboard: function (container) {
        // Simüle Edilmiş Veri (Gerçekte Backend'den çekilecek)
        // API'ye endpoint eklenince: fetchApi('get_partner_stats')...

        setTimeout(() => {
          container.innerHTML = `
                  <div class="mpa-card" style="background:linear-gradient(135deg, #1e293b, #0f172a); color:white; border:none;">
                      <div class="mpa-stat-lbl" style="color:#94a3b8;">TOPLAM KAZANÇ</div>
                      <div class="mpa-stat-val" style="color:#fbbf24; font-size:32px;">12.450 ₺</div>
                      <div style="font-size:11px; color:#4ade80; margin-top:5px;">▲ Bu ay %12 artış</div>
                  </div>

                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                      <div class="mpa-card">
                          <div class="mpa-stat-lbl">TIKLAMALAR</div>
                          <div class="mpa-stat-val">8.420</div>
                      </div>
                      <div class="mpa-card">
                          <div class="mpa-stat-lbl">SATIŞLAR</div>
                          <div class="mpa-stat-val">142</div>
                      </div>
                  </div>

                  <div class="mpa-card">
                      <div class="mpa-stat-lbl" style="margin-bottom:15px;">SON 7 GÜN PERFORMANSI</div>
                      <canvas id="mpa-chart" height="200"></canvas>
                  </div>
                  `;

          // Grafiği Çiz
          new Chart(document.getElementById("mpa-chart"), {
            type: "line",
            data: {
              labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
              datasets: [
                {
                  label: "Kazanç (TL)",
                  data: [120, 190, 300, 500, 200, 300, 450],
                  borderColor: "#3b82f6",
                  tension: 0.4,
                  fill: true,
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                },
              ],
            },
            options: {
              responsive: true,
              plugins: { legend: { display: false } },
            },
          });
        }, 500);
      },

      renderLinkGenerator: function (container) {
        container.innerHTML = `
              <div class="mpa-card">
                  <h3 style="margin:0 0 10px 0;">🔗 Link Oluşturucu</h3>
                  <p style="font-size:12px; color:#64748b; margin-bottom:15px;">Paylaşmak istediğin ürünün linkini yapıştır, takip linkini oluştur.</p>
                  
                  <input type="text" id="mpa-link-input" placeholder="https://www.modum.tr/urun/..." style="width:100%; padding:15px; border:1px solid #cbd5e1; border-radius:12px; margin-bottom:15px; box-sizing:border-box;">
                  
                  <button onclick="PartnerApp.generateLink()" class="mpa-btn-primary">Link Oluştur ✨</button>

                  <div id="mpa-link-result" style="display:none; margin-top:20px; background:#eff6ff; padding:15px; border-radius:12px; border:1px dashed #3b82f6;">
                      <div style="font-size:10px; font-weight:bold; color:#1e40af; margin-bottom:5px;">ÖZEL LINKINIZ:</div>
                      <div id="mpa-final-link" style="font-family:monospace; word-break:break-all; font-size:12px; margin-bottom:10px;"></div>
                      <button onclick="PartnerApp.copyLink()" style="background:#fff; border:1px solid #cbd5e1; padding:5px 15px; border-radius:6px; font-size:11px; cursor:pointer;">Kopyala</button>
                  </div>
              </div>
              `;
      },

      generateLink: function () {
        var input = document.getElementById("mpa-link-input").value;
        if (!input) return alert("Link giriniz.");
        // Simüle edilmiş ref kodu
        var refCode = "REF-" + email.substring(0, 3).toUpperCase();
        var final =
          input + (input.includes("?") ? "&" : "?") + "ref=" + refCode;

        document.getElementById("mpa-final-link").innerText = final;
        document.getElementById("mpa-link-result").style.display = "block";
      },

      copyLink: function () {
        var text = document.getElementById("mpa-final-link").innerText;
        navigator.clipboard.writeText(text);
        alert("Kopyalandı! 🎉");
      },

      renderWallet: function (container) {
        container.innerHTML = `
              <div class="mpa-card" style="text-align:center;">
                  <div style="font-size:40px; margin-bottom:10px;">💰</div>
                  <div class="mpa-stat-lbl">ÇEKİLEBİLİR BAKİYE</div>
                  <div class="mpa-stat-val" style="color:#10b981; font-size:36px; margin-bottom:20px;">1.250 ₺</div>
                  
                  <button onclick="alert('Ödeme talebi alındı! Muhasebe ekibi inceliyor.')" class="mpa-btn-primary" style="background:#10b981;">Ödeme Talep Et</button>
                  <p style="font-size:11px; color:#94a3b8; margin-top:10px;">Alt limit: 500 ₺</p>
              </div>

              <h4 style="margin:20px 0 10px 0; font-size:14px; color:#64748b;">Son İşlemler</h4>
              
              <div class="mpa-card" style="padding:0;">
                  <div style="padding:15px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                          <div style="font-weight:bold; font-size:13px;">Satış Primi</div>
                          <div style="font-size:10px; color:#94a3b8;">12.01.2025 - Sipariş #12345</div>
                      </div>
                      <div style="font-weight:bold; color:#10b981;">+125 ₺</div>
                  </div>
                   <div style="padding:15px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                          <div style="font-weight:bold; font-size:13px;">Ödeme Çıkışı</div>
                          <div style="font-size:10px; color:#94a3b8;">10.01.2025 - Banka Havalesi</div>
                      </div>
                      <div style="font-weight:bold; color:#ef4444;">-2.500 ₺</div>
                  </div>
              </div>
              `;
      },
    };

    // İlk Açılış
    PartnerApp.loadPage("dashboard");
  }

  // Başlat
  setTimeout(initPartnerSystem, 2000);
})();
