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
    if (!email) return; // Giriş yapmamışsa butonu gösterme

    // 🔥 Backend'e soruyoruz: Bu kişi partner mi? Kodu ne?
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ islem: "get_partner_stats", email: email }),
      });
      const res = await response.json();

      // Eğer veritabanında kaydı varsa (Success: true)
      if (res.success && res.stats) {
        // Veriyi tarayıcı hafızasına alıyoruz ki her yerde kullanalım
        window.PartnerData = res.stats;
        renderPartnerButton();
      }
    } catch (e) {
      console.log("Partner kontrol hatası:", e);
    }
  }

  // --- SOL BUTON ---
  function renderPartnerButton() {
    var oldBtn = document.getElementById("mdm-partner-btn");
    if (oldBtn) oldBtn.remove();

    var btn = document.createElement("div");
    btn.id = "mdm-partner-btn";
    btn.innerHTML = `
<div style="display:flex; align-items:center; gap:8px;">
    <span style="font-size:18px;">👑</span>
    <span style="font-weight:800; font-family:'Inter', sans-serif; font-size:12px; letter-spacing:0.5px;">ORTAK PANELİ</span>
</div>
`;
    Object.assign(btn.style, {
      position: "fixed",
      left: "20px",
      bottom: "100px",
      zIndex: "999999",
      background: "linear-gradient(135deg, #0f172a, #334155)",
      color: "#fbbf24",
      padding: "12px 20px",
      borderRadius: "50px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      cursor: "pointer",
      border: "2px solid #fbbf24",
      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });

    btn.onmouseover = function () {
      this.style.transform = "scale(1.05) translateY(-3px)";
      this.style.boxShadow = "0 10px 30px rgba(251, 191, 36, 0.3)";
    };
    btn.onmouseout = function () {
      this.style.transform = "scale(1) translateY(0)";
      this.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
    };
    btn.onclick = function () {
      openPartnerDashboard();
    };
    document.body.appendChild(btn);
  }

  // --- DASHBOARD ARAYÜZÜ ---
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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
.p-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); z-index:9999999; backdrop-filter:blur(8px); display:flex; justify-content:center; align-items:center; font-family:'Outfit', sans-serif; }
.p-app { width:100%; height:100%; background:#f8fafc; position:relative; display:flex; flex-direction:column; overflow:hidden; }
@media (min-width: 769px) { .p-app { width:450px; height:85vh; border-radius:24px; box-shadow:0 20px 50px rgba(0,0,0,0.5); border:1px solid #cbd5e1; } }
.p-header { background:#0f172a; padding:20px; padding-top:40px; color:white; border-bottom:1px solid #334155; }
.p-body { flex:1; overflow-y:auto; padding:20px; padding-bottom:100px; }
.p-nav { position:absolute; bottom:0; width:100%; height:70px; background:white; border-top:1px solid #e2e8f0; display:flex; justify-content:space-around; align-items:center; z-index:10; }
.p-nav-item { display:flex; flex-direction:column; align-items:center; color:#94a3b8; font-size:10px; font-weight:600; cursor:pointer; transition:0.2s; }
.p-nav-item i { font-size:20px; margin-bottom:4px; }
.p-nav-item.active { color:#3b82f6; transform:translateY(-5px); }
.p-card { background:white; border-radius:16px; padding:20px; margin-bottom:15px; box-shadow:0 4px 10px rgba(0,0,0,0.03); border:1px solid #e2e8f0; }
.p-stat-val { font-size:28px; font-weight:900; color:#0f172a; letter-spacing:-1px; }
.p-stat-lbl { font-size:11px; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
.p-btn { width:100%; padding:14px; border:none; border-radius:12px; font-weight:800; font-size:14px; cursor:pointer; transition:0.2s; display:flex; align-items:center; justify-content:center; gap:8px; }
.p-btn-primary { background:#3b82f6; color:white; box-shadow:0 4px 15px rgba(59,130,246,0.3); }
.p-btn-primary:active { transform:scale(0.98); }

/* Tier Info Table */
.tier-table { width:100%; border-collapse:collapse; margin-top:10px; font-size:12px; }
.tier-table th { text-align:left; color:#64748b; padding-bottom:8px; border-bottom:1px solid #e2e8f0; }
.tier-table td { padding:8px 0; border-bottom:1px solid #f1f5f9; color:#334155; font-weight:600; }
</style>
`;

    var html = `
<div id="mdm-partner-modal" class="p-overlay">
${css}
<div class="p-app">
    <div class="p-header">
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <div style="font-size:12px; color:#94a3b8;">Hoşgeldin Ortak,</div>
                <div id="p-header-name" style="font-size:20px; font-weight:800; text-transform:capitalize;">${name}</div>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
                <div onclick="PartnerApp.showTierInfo()" style="cursor:pointer; background:rgba(255,255,255,0.1); padding:5px 10px; border-radius:20px; font-size:11px; display:flex; align-items:center; gap:5px;">
                    <i class="fas fa-info-circle"></i> Oranlar
                </div>
                <div onclick="document.getElementById('mdm-partner-modal').remove()" style="width:36px; height:36px; background:rgba(255,255,255,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">✕</div>
            </div>
        </div>
    </div>

    <div id="p-content-area" class="p-body"></div>

    <div class="p-nav">
        <div class="p-nav-item active" onclick="PartnerApp.loadTab('home', this)"><i class="fas fa-chart-pie"></i> Özet</div>
        <div class="p-nav-item" onclick="PartnerApp.loadTab('links', this)"><i class="fas fa-link"></i> Linkler</div>
        <div class="p-nav-item" onclick="PartnerApp.loadTab('wallet', this)"><i class="fas fa-wallet"></i> Cüzdan</div>
        <div class="p-nav-item" onclick="PartnerApp.loadTab('marketing', this)"><i class="fas fa-images"></i> Pazarlama</div>
        <div class="p-nav-item" onclick="PartnerApp.loadTab('academy', this)"><i class="fas fa-graduation-cap"></i> Akademi</div>
    </div>
</div>
</div>
`;

    document.body.insertAdjacentHTML("beforeend", html);

    window.PartnerApp = {
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
        }, 300);
      },

      // 🔥 YENİ: SEVİYE BİLGİ PENCERESİ
      showTierInfo: function () {
        let infoHtml = `
      <div id="p-tier-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:99999999; display:flex; justify-content:center; align-items:center; padding:20px;">
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
                            <td>10.000+ ₺</td>
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
            '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Veriler yükleniyor...</div>';

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

          let myRate = s.commission_rate || 10;
          let myLevel = s.level || "Bronz";
          let currentRev = parseFloat(s.totalRevenue || 0);

          // Seviye İlerleme Çubuğu Hesaplama
          let nextLevel = "Gümüş";
          let nextTarget = 10000;
          if (currentRev >= 10000) {
            nextLevel = "Altın";
            nextTarget = 50000;
          }
          if (currentRev >= 50000) {
            nextLevel = "Max";
            nextTarget = currentRev;
          }

          let progress =
            nextTarget > 0 ? Math.min((currentRev / nextTarget) * 100, 100) : 0;

          // HTML ÇIKTISI
          container.innerHTML = `
        <div class="p-card" style="background:linear-gradient(135deg, #1e293b, #0f172a); color:white; border:none; padding:20px; border-radius:16px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <div>
                    <div style="font-size:11px; opacity:0.7;">MEVCUT SEVİYE</div>
                    <div style="font-size:18px; font-weight:800; color:#fbbf24;">${myLevel} (%${myRate})</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:11px; opacity:0.7;">BAKİYE</div>
                    <div style="font-size:24px; font-weight:800; color:#10b981;">${parseFloat(s.balance).toLocaleString()} ₺</div>
                </div>
            </div>
            
            <div style="margin-top:10px;">
                <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:4px; opacity:0.8;">
                    <span>Ciro: ${currentRev.toLocaleString()} ₺</span>
                    <span>Hedef: ${nextTarget.toLocaleString()} ₺</span>
                </div>
                <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:10px; overflow:hidden;">
                    <div style="width:${progress}%; height:100%; background:#fbbf24;"></div>
                </div>
            </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:20px;">
            <div class="p-card" style="padding:15px; text-align:center; margin:0;">
                <div class="p-stat-val" style="font-size:18px;">${s.totalClicks || 0}</div>
                <div class="p-stat-lbl">TIK</div>
            </div>
            <div class="p-card" style="padding:15px; text-align:center; margin:0;">
                <div class="p-stat-val" style="font-size:18px;">${s.totalSales || 0}</div>
                <div class="p-stat-lbl">SATIŞ</div>
            </div>
            <div class="p-card" style="padding:15px; text-align:center; margin:0; border:1px solid #a78bfa; background:#f5f3ff;">
                <div class="p-stat-val" style="font-size:18px; color:#8b5cf6;">${s.referralCount || 0}</div>
                <div class="p-stat-lbl" style="color:#7c3aed;">ÜYE</div>
            </div>
        </div>
        
        <h4 style="margin:0 0 10px 0; font-size:12px; color:#64748b;">SON 7 GÜN KAZANÇ</h4>
        <div style="background:white; border-radius:12px; padding:10px; border:1px solid #e2e8f0;">
            <canvas id="p-chart" height="150"></canvas>
        </div>
      `;

          // GRAFİK ÇİZİMİ (HATA KORUMALI)
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

      renderLinks: function (c) {
        // 🔥 VERİ KONTROLÜ VE VARSAYILAN DEĞERLER
        var pData = window.PartnerData || {};
        var myRefCode = pData.refCode || "Lütfen Sayfayı Yenileyin";
        var myCoupon = pData.custom_coupon || "Tanımlanmamış";
        var homeLink = "https://www.modum.tr/?ref=" + myRefCode;

        // İndirim Kodu HTML'i (Eğer varsa göster)
        let couponHTML = "";
        if (myCoupon !== "Tanımlanmamış") {
          couponHTML = `
          <div class="p-card" style="background:linear-gradient(135deg, #8b5cf6, #6d28d9); color:white; border:none; padding:15px; margin-bottom:20px; position:relative; overflow:hidden;">
              <div style="position:absolute; top:-10px; right:-10px; font-size:60px; opacity:0.1;">🎟️</div>
              <label style="font-size:10px; opacity:0.8; font-weight:bold; display:block;">MÜŞTERİLERİN İÇİN İNDİRİM KODU</label>
              <div style="font-family:monospace; font-size:28px; font-weight:900; margin-top:5px; letter-spacing:1px;">${myCoupon}</div>
              <div style="font-size:11px; opacity:0.8; margin-top:5px;">Bu kodu kullanan takipçilerin indirim kazanır, sen de komisyon alırsın!</div>
              <button onclick="navigator.clipboard.writeText('${myCoupon}'); alert('Kupon Kopyalandı!')" class="p-btn" style="background:white; color:#6d28d9; margin-top:10px; height:36px; font-size:12px;">Kopyala</button>
          </div>`;
        } else {
          couponHTML = `
          <div class="p-card" style="border:1px dashed #cbd5e1; padding:15px; margin-bottom:20px; text-align:center;">
              <div style="font-size:12px; color:#64748b;">Henüz sana özel bir indirim kuponu tanımlanmamış.</div>
          </div>`;
        }

        c.innerHTML = `
          <h3 style="margin:0 0 15px 0;">🔗 Link ve Kuponlarım</h3>
          
          ${couponHTML}
          
          <div class="p-card" style="background:#f0f9ff; border:1px solid #bae6fd; padding:15px; margin-bottom:20px;">
              <label class="p-stat-lbl" style="color:#0284c7; display:block; margin-bottom:5px;">🏠 ANA SAYFA LİNKİN (REF)</label>
              <div style="background:white; padding:12px; border-radius:8px; font-family:monospace; color:#0369a1; border:1px dashed #0ea5e9; word-break:break-all; font-size:12px; margin-bottom:10px;">
                  ${homeLink}
              </div>
              
              <div style="display:flex; gap:10px;">
                  <button onclick="navigator.clipboard.writeText('${homeLink}'); alert('Kopyalandı!')" class="p-btn" style="background:#0ea5e9; color:white; height:40px; font-size:13px; border:none; border-radius:8px; flex:1; cursor:pointer;">
                      <i class="fas fa-copy"></i> Kopyala
                  </button>
                  <a href="https://api.whatsapp.com/send?text=${encodeURIComponent("Harika ürünler var! Link: " + homeLink)}" target="_blank" class="p-btn" style="background:#25D366; color:white; height:40px; font-size:13px; border:none; border-radius:8px; width:50px; display:flex; align-items:center; justify-content:center; text-decoration:none;">
                      <i class="fab fa-whatsapp" style="font-size:18px;"></i>
                  </a>
              </div>
          </div>

          <hr style="border:0; border-top:1px solid #e2e8f0; margin:20px 0;">

          <p style="font-size:13px; color:#334155; margin-bottom:15px; font-weight:600;">📦 Belirli bir ürünü paylaşmak için:</p>

          <div class="p-card" style="padding:20px; border-radius:12px; border:1px solid #e2e8f0; background:white;">
              <label class="p-stat-lbl" style="display:block; margin-bottom:8px;">ÜRÜN LİNKİNİ YAPIŞTIR</label>
              <input type="text" id="pl-input" placeholder="https://www.modum.tr/urun/siyah-elbise..." style="width:100%; padding:12px; border:1px solid #cbd5e1; border-radius:8px; box-sizing:border-box; outline:none; font-size:13px;">
              
              <button onclick="PartnerApp.createLink('${myRefCode}')" class="p-btn p-btn-primary" style="margin-top:15px; background:#3b82f6; color:white; border:none; padding:12px; border-radius:8px; width:100%; font-weight:bold; cursor:pointer;">
                  Link Oluştur ✨
              </button>
          </div>

          <div id="pl-result" style="display:none; margin-top:20px;" class="p-card">
              <div class="p-stat-lbl" style="color:#3b82f6; margin-bottom:10px;">ÖZEL PAYLAŞIM LİNKİN:</div>
              <div id="pl-final" style="background:#eff6ff; padding:12px; border-radius:8px; font-family:monospace; color:#1e40af; margin-bottom:15px; word-break:break-all; font-size:12px; border:1px solid #dbeafe;"></div>
              
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
                  <a id="btn-wa" href="#" target="_blank" class="p-btn" style="background:#25D366; color:white; text-decoration:none; display:flex; align-items:center; justify-content:center; padding:10px; border-radius:8px; font-size:13px; font-weight:bold;">
                      <i class="fab fa-whatsapp" style="font-size:16px; margin-right:5px;"></i> WhatsApp
                  </a>
                  <a id="btn-tg" href="#" target="_blank" class="p-btn" style="background:#0088cc; color:white; text-decoration:none; display:flex; align-items:center; justify-content:center; padding:10px; border-radius:8px; font-size:13px; font-weight:bold;">
                      <i class="fab fa-telegram" style="font-size:16px; margin-right:5px;"></i> Telegram
                  </a>
              </div>
              
              <button onclick="navigator.clipboard.writeText(document.getElementById('pl-final').innerText); alert('Kopyalandı!')" class="p-btn" style="background:#1e293b; color:white; width:100%; padding:12px; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">
                  <i class="fas fa-copy"></i> Linki Kopyala
              </button>
          </div>
      `;
      },
      createLink: function (refCode) {
        var val = document.getElementById("pl-input").value;
        if (!val) return alert("Lütfen bir ürün linki giriniz.");

        // Linki oluştur (Var olan parametreleri koru)
        var final = val + (val.includes("?") ? "&" : "?") + "ref=" + refCode;

        // Ekrana yaz ve kutuyu göster
        document.getElementById("pl-final").innerText = final;
        document.getElementById("pl-result").style.display = "block";

        // Mesaj Hazırla (Otomatik doldurma)
        var msgWA = encodeURIComponent(
          "Bu ürüne bayıldım, kesin bakmalısın! Link: " + final,
        );
        var msgTG = encodeURIComponent("Harika bir ürün buldum! 👇");

        // Buton Linklerini Güncelle
        document.getElementById("btn-wa").href =
          "https://api.whatsapp.com/send?text=" + msgWA;
        document.getElementById("btn-tg").href =
          "https://t.me/share/url?url=" +
          encodeURIComponent(final) +
          "&text=" +
          msgTG;
      },

      renderWallet: async function (container) {
        container.innerHTML =
          '<div style="text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin"></i> Cüzdan yükleniyor...</div>';

        var email = detectUser();
        if (!email)
          return (container.innerHTML =
            "<div style='padding:20px; text-align:center;'>Giriş yapmalısınız.</div>");

        try {
          // 1. Geçmiş Verileri Çek
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
              let icon = tx.type === "sale_commission" ? "🛒" : "💸";
              let color = tx.type === "sale_commission" ? "#10b981" : "#ef4444";
              let sign = tx.type === "sale_commission" ? "+" : "-";

              // 🔥 Ürün Listesini Hazırla (HTML)
              let productsHTML = "";
              if (tx.soldItemsList && tx.soldItemsList.length > 0) {
                productsHTML = `<ul style="margin:5px 0 0 20px; padding:0; font-size:11px; color:#475569;">`;
                tx.soldItemsList.forEach((p) => {
                  productsHTML += `<li style="margin-bottom:2px;">${p}</li>`;
                });
                productsHTML += `</ul>`;
              } else if (tx.soldItems) {
                // Eski usul metin varsa
                productsHTML = `<div style="font-size:11px; color:#475569; margin-top:5px;">${tx.soldItems}</div>`;
              }

              // 🔥 Akordeon Yapısı
              historyHTML += `
            <div class="p-card" style="padding:0; margin-bottom:10px; overflow:hidden;">
                <div style="padding:15px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" 
                      onclick="var el = this.nextElementSibling; el.style.display = el.style.display === 'none' ? 'block' : 'none';">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="background:#f1f5f9; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px;">${icon}</div>
                        <div>
                            <div style="font-weight:bold; font-size:13px; color:#334155;">${tx.desc}</div>
                            <div style="font-size:10px; color:#94a3b8;">${tx.date}</div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-weight:bold; color:${color}; font-size:14px;">${sign}${parseFloat(tx.commission).toLocaleString()} ₺</div>
                        ${tx.type === "sale_commission" ? '<div style="font-size:9px; color:#94a3b8;">▼ Detay</div>' : ""}
                    </div>
                </div>
                
                <div style="display:none; background:#f8fafc; padding:15px; border-top:1px solid #e2e8f0; border-left:4px solid ${color};">
                    <div style="font-size:11px; color:#64748b;"><b>Durum:</b> ${tx.status}</div>
                    <div style="font-size:11px; color:#64748b;"><b>İşlem Tutarı:</b> ${tx.amount} ₺</div>
                    
                    ${
                      productsHTML
                        ? `<div style="margin-top:8px; padding-top:8px; border-top:1px dashed #cbd5e1;">
                        <b style="font-size:11px; color:#334155;">📦 Satılan Ürünler:</b>
                        ${productsHTML}
                    </div>`
                        : ""
                    }
                </div>
            </div>
            `;
            });
          } else {
            historyHTML =
              '<div style="text-align:center; padding:20px; color:#94a3b8;">Henüz işlem geçmişi yok.</div>';
          }

          // Ana Yapı
          container.innerHTML = `
        <div class="p-card" style="text-align:center; padding:30px 20px; background:linear-gradient(135deg, #10b981, #059669); color:white; border:none;">
            <div style="font-size:11px; opacity:0.9; font-weight:bold;">AKTİF BAKİYE</div>
            <div class="p-stat-val" style="color:white; font-size:36px; margin:5px 0;">...</div> 
            <button class="p-btn" style="background:white; color:#059669; margin-top:10px;" onclick="PartnerApp.requestPayout()">🚀 ÖDEME İSTE</button>
        </div>
        
        <h4 style="margin:20px 0 10px 0; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Son Hareketler</h4>
        ${historyHTML}
    `;

          // Bakiyeyi güncelle
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
            container.innerHTML = `<h3 style="margin:0 0 15px 0;">🎓 Partner Akademisi</h3>`;
            if (res.list.length === 0) {
              container.innerHTML +=
                "<div style='text-align:center; color:#999; padding:20px;'>Henüz eğitim eklenmemiş.</div>";
              return;
            }

            res.list.forEach((l) => {
              let icon = "🎥"; // Varsayılan Video
              let actionText = "İZLE";
              // Tırnak işaretlerini kaçırmak için güvenli hale getir
              let safeLink = (l.link || "").replace(/'/g, "\\'");
              let clickAction = `window.open('${safeLink}', '_blank')`;
              let badgeColor = "#ef4444"; // Kırmızı (YouTube rengi)

              if (l.type === "article") {
                icon = "📝";
                actionText = "OKU";
                badgeColor = "#3b82f6"; // Mavi

                // Makale içeriğini güvenli hale getir (Satır sonları ve tırnaklar)
                const safeContent = (l.content || "")
                  .replace(/'/g, "\\'")
                  .replace(/"/g, "&quot;")
                  .replace(/\n/g, "<br>");

                clickAction = `PartnerApp.openArticleModal('${l.title.replace(/'/g, "\\'")}', '${safeContent}')`;
              } else if (l.type === "pdf") {
                icon = "📄";
                actionText = "İNDİR";
                badgeColor = "#f59e0b"; // Turuncu
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

      // 🔥 YENİ: Makale Okuma Penceresi (Basit Modal)
      openArticleModal: function (title, content) {
        // Varolan modal varsa sil
        let old = document.getElementById("p-article-modal");
        if (old) old.remove();

        let html = `
<div id="p-article-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:99999999; display:flex; justify-content:center; align-items:center; padding:20px;">
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
            container.innerHTML = `<h3 style="margin:0 0 15px 0;">🎨 Pazarlama Kiti</h3>`;

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
      },
    };

    // Açılış
    window.PartnerApp.loadTab("home");
  }

  // Başlat
  setTimeout(initPartnerSystem, 1000);

  /*sistem güncellendi v7*/
})();
