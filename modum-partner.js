/**
 * 👑 MODUM PARTNER PRO (Influencer Hub)
 * v3.0 - Tier (Seviye) Sistemi, Bildirimler ve Sol Buton
 */

(function () {
  console.log("🚀 Modum Partner Pro (v3.0) Başlatılıyor...");

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

  // --- BAŞLATICI ---
  async function initPartnerSystem() {
    var email = detectUser();
    // Test İçin: Giriş yoksa bile butonu görmek istersen bu satırı yorum satırı yap
    // if (!email) return;

    // 🔥 Backend Kontrolü (Simüle)
    // Gerçekte API'den isPartner:true gelmeli.
    // Şimdilik herkes partner gibi görünsün ki tasarlayabilelim:
    var isPartner = true;

    if (isPartner) {
      renderPartnerButton();
    }
  }

  // --- 👑 YENİ NESİL BUTON (SOLDA & İSİMLİ) ---
  function renderPartnerButton() {
    var oldBtn = document.getElementById("mdm-partner-btn");
    if (oldBtn) oldBtn.remove();

    var btn = document.createElement("div");
    btn.id = "mdm-partner-btn";

    // İçerik: İkon + Yazı
    btn.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">👑</span>
            <span style="font-weight:800; font-family:'Inter', sans-serif; font-size:12px; letter-spacing:0.5px;">ORTAK PANELİ</span>
        </div>
    `;

    Object.assign(btn.style, {
      position: "fixed",
      left: "20px", // SOL TARAFTA
      bottom: "100px", // Whatsapp butonunun üstünde kalacak şekilde ayarla
      zIndex: "999999",
      background: "linear-gradient(135deg, #0f172a, #334155)", // Koyu Premium Tema
      color: "#fbbf24", // Altın Sarısı Yazı
      padding: "12px 20px",
      borderRadius: "50px", // Hap şekli
      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      cursor: "pointer",
      border: "2px solid #fbbf24", // Altın Çerçeve
      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });

    // Hover Efekti
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

  // --- 🌟 DASHBOARD ARAYÜZÜ (FULL SCREEN APP) ---
  function openPartnerDashboard() {
    var old = document.getElementById("mdm-partner-modal");
    if (old) old.remove();

    var email = detectUser() || "Misafir Ortak";
    var name = email.split("@")[0];

    // Mobil Uyumlu CSS
    var css = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        .p-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); z-index:9999999; backdrop-filter:blur(8px); display:flex; justify-content:center; align-items:center; font-family:'Outfit', sans-serif; }
        .p-app { width:100%; height:100%; background:#f8fafc; position:relative; display:flex; flex-direction:column; overflow:hidden; }
        
        /* Masaüstünde ortalı modal gibi dursun */
        @media (min-width: 769px) {
            .p-app { width:450px; height:85vh; border-radius:24px; box-shadow:0 20px 50px rgba(0,0,0,0.5); border:1px solid #cbd5e1; }
        }

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
                        <div style="font-size:20px; font-weight:800;">${name}</div>
                    </div>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <div onclick="PartnerApp.loadTab('notifications', null)" style="position:relative; cursor:pointer;">
                            <i class="fas fa-bell" style="font-size:20px; color:#94a3b8;"></i>
                            <div style="position:absolute; top:-2px; right:-2px; width:8px; height:8px; background:#ef4444; border-radius:50%;"></div>
                        </div>
                        <div onclick="document.getElementById('mdm-partner-modal').remove()" style="width:36px; height:36px; background:rgba(255,255,255,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">✕</div>
                    </div>
                </div>
            </div>

            <div id="p-content-area" class="p-body">
                </div>

            <div class="p-nav">
                <div class="p-nav-item active" onclick="PartnerApp.loadTab('home', this)">
                    <i class="fas fa-chart-pie"></i> Özet
                </div>
                <div class="p-nav-item" onclick="PartnerApp.loadTab('links', this)">
                    <i class="fas fa-link"></i> Linkler
                </div>
                <div class="p-nav-item" onclick="PartnerApp.loadTab('wallet', this)">
                    <i class="fas fa-wallet"></i> Cüzdan
                </div>
                <div class="p-nav-item" onclick="PartnerApp.loadTab('academy', this)">
                    <i class="fas fa-graduation-cap"></i> Akademi
                </div>
            </div>

        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);

    // PARTNER FONKSİYONLARI (GLOBAL NESNE)
    window.PartnerApp = {
      loadTab: function (tab, el) {
        // Menü Aktifliği
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
          if (tab === "academy") this.renderAcademy(area);
          if (tab === "notifications") this.renderNotifications(area);
        }, 300);
      },

      // 🔥 GÜNCELLENMİŞ DASHBOARD (SEVİYE SİSTEMİ)
      renderHome: function (container) {
        // Simüle Edilmiş Veri (Backend'den çekilecek)
        let totalRevenue = 12450;
        let currentLevel = "Bronz";
        let nextLevel = "Gümüş";
        let nextTarget = 50000;
        let progress = (totalRevenue / nextTarget) * 100;
        let commissionRate = 10;

        // Basit Mantık (Backend'dekiyle aynı olmalı)
        if (totalRevenue > 50000) {
          currentLevel = "Altın";
          nextLevel = "Max";
          progress = 100;
          commissionRate = 15;
        } else if (totalRevenue > 10000) {
          currentLevel = "Gümüş";
          nextLevel = "Altın";
          nextTarget = 50000;
          progress = (totalRevenue / 50000) * 100;
          commissionRate = 12;
        } else {
          nextTarget = 10000;
          progress = (totalRevenue / 10000) * 100;
        }

        container.innerHTML = `
                <div class="p-card" style="background:linear-gradient(135deg, #1e293b, #0f172a); color:white; border:none; position:relative; overflow:hidden;">
                    <div style="position:absolute; top:-10px; right:-10px; font-size:80px; opacity:0.1;">👑</div>
                    
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div class="p-stat-lbl" style="color:#94a3b8;">MEVCUT SEVİYE</div>
                            <div style="font-size:24px; font-weight:900; color:#fbbf24;">${currentLevel} Ortak</div>
                            <div style="font-size:11px; color:#4ade80;">Komisyon Oranı: <b>%${commissionRate}</b></div>
                        </div>
                        <div style="text-align:right;">
                              <div class="p-stat-lbl" style="color:#94a3b8;">SONRAKİ HEDEF</div>
                              <div style="font-weight:bold;">${nextLevel}</div>
                        </div>
                    </div>

                    <div style="margin-top:15px;">
                        <div style="display:flex; justify-content:space-between; font-size:10px; color:#cbd5e1; margin-bottom:5px;">
                            <span>${totalRevenue.toLocaleString()} ₺</span>
                            <span>${nextTarget.toLocaleString()} ₺</span>
                        </div>
                        <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:10px; overflow:hidden;">
                            <div style="width:${progress}%; height:100%; background:linear-gradient(90deg, #fbbf24, #f59e0b);"></div>
                        </div>
                        <div style="font-size:10px; color:#94a3b8; margin-top:5px; text-align:center;">
                            Seviye atlamak için <b>${(nextTarget - totalRevenue).toLocaleString()} ₺</b> daha satış yapmalısın.
                        </div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
                    <div class="p-card" style="margin:0; text-align:center;">
                        <i class="fas fa-mouse-pointer" style="color:#3b82f6; font-size:20px; margin-bottom:5px;"></i>
                        <div class="p-stat-val" style="font-size:20px;">8.420</div>
                        <div class="p-stat-lbl">TIKLAMA</div>
                    </div>
                    <div class="p-card" style="margin:0; text-align:center;">
                        <i class="fas fa-shopping-bag" style="color:#10b981; font-size:20px; margin-bottom:5px;"></i>
                        <div class="p-stat-val" style="font-size:20px;">142</div>
                        <div class="p-stat-lbl">SATIŞ</div>
                    </div>
                </div>

                <div class="p-card">
                    <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                        <div class="p-stat-lbl">PERFORMANS GRAFİĞİ</div>
                        <div style="font-size:10px; background:#eff6ff; color:#3b82f6; padding:2px 8px; border-radius:4px; font-weight:bold;">SON 7 GÜN</div>
                    </div>
                    <canvas id="p-chart" height="200"></canvas>
                </div>
            `;

        // Grafik
        new Chart(document.getElementById("p-chart"), {
          type: "line",
          data: {
            labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
            datasets: [
              {
                label: "Kazanç",
                data: [150, 230, 180, 320, 290, 450, 400],
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            plugins: { legend: { display: false } },
            scales: { x: { grid: { display: false } } },
          },
        });
      },

      renderLinks: function (container) {
        container.innerHTML = `
                <h3 style="margin:0 0 10px 0;">🔗 Link Oluşturucu</h3>
                <p style="font-size:13px; color:#64748b; margin-bottom:20px;">Paylaşmak istediğin herhangi bir ürünün linkini yapıştır, sana özel takip linkini al.</p>

                <div class="p-card">
                    <label class="p-stat-lbl">ÜRÜN LİNKİ</label>
                    <input type="text" id="pl-input" placeholder="https://www.modum.tr/urun/..." style="width:100%; padding:12px; border:1px solid #e2e8f0; border-radius:8px; margin-top:5px; box-sizing:border-box;">
                    
                    <button onclick="PartnerApp.createLink()" class="p-btn p-btn-primary" style="margin-top:15px;">
                        Link Oluştur ✨
                    </button>
                </div>

                <div id="pl-result" style="display:none;" class="p-card">
                    <div class="p-stat-lbl" style="color:#3b82f6;">ÖZEL LİNKİNİZ:</div>
                    <div id="pl-final" style="background:#eff6ff; padding:10px; border-radius:8px; font-family:monospace; color:#1e40af; margin:10px 0; word-break:break-all; font-size:12px;"></div>
                    <button onclick="navigator.clipboard.writeText(document.getElementById('pl-final').innerText); alert('Kopyalandı!')" class="p-btn" style="background:#1e293b; color:white;">
                        <i class="fas fa-copy"></i> Kopyala
                    </button>
                </div>
            `;
      },

      createLink: function () {
        var val = document.getElementById("pl-input").value;
        if (!val) return alert("Link giriniz.");
        var refCode = "REF-" + email.substring(0, 3).toUpperCase();
        var final = val + (val.includes("?") ? "&" : "?") + "ref=" + refCode;
        document.getElementById("pl-final").innerText = final;
        document.getElementById("pl-result").style.display = "block";
      },

      renderWallet: function (container) {
        container.innerHTML = `
                <div class="p-card" style="text-align:center; padding:40px 20px;">
                    <div style="font-size:40px; margin-bottom:10px;">💰</div>
                    <div class="p-stat-lbl">ÇEKİLEBİLİR BAKİYE</div>
                    <div class="p-stat-val" style="color:#10b981; font-size:40px; margin:10px 0;">1.250 ₺</div>
                    
                    <button class="p-btn p-btn-primary" style="background:#10b981;" onclick="ModumPartner.requestPayout()">
  ÖDEME TALEP ET
</button>
                    <div style="font-size:11px; color:#94a3b8; margin-top:10px;">Alt limit: 500 ₺ • Her Cuma Ödeme</div>
                </div>

                <h4 style="margin:20px 0 10px 0; color:#64748b; font-size:13px; text-transform:uppercase;">Son Hareketler</h4>
                
                <div class="p-card" style="padding:0;">
                    <div style="padding:15px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                        <div><div style="font-weight:bold; font-size:13px;">Satış Primi</div><div style="font-size:10px; color:#94a3b8;">Bugün</div></div>
                        <div style="font-weight:bold; color:#10b981;">+125 ₺</div>
                    </div>
                    <div style="padding:15px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
                        <div><div style="font-weight:bold; font-size:13px;">Ödeme (Banka)</div><div style="font-size:10px; color:#94a3b8;">Dün</div></div>
                        <div style="font-weight:bold; color:#ef4444;">-2.500 ₺</div>
                    </div>
                </div>
            `;
      },

      renderAcademy: function (container) {
        container.innerHTML = `
              <h3 style="margin:0 0 15px 0;">🎓 Partner Akademisi</h3>
              <div class="p-card">
                  <div style="font-weight:bold; margin-bottom:5px;">Nasıl daha çok satarım?</div>
                  <p style="font-size:12px; color:#64748b;">Instagram storylerinizde "Yukarı Kaydır" yerine link çıkartması kullanın...</p>
              </div>
              <div class="p-card">
                  <div style="font-weight:bold; margin-bottom:5px;">En çok satan ürünler</div>
                  <p style="font-size:12px; color:#64748b;">Bu hafta "Yaz Koleksiyonu" çok popüler. Hemen paylaş!</p>
              </div>
            `;
      },

      // 🔥 YENİ: BİLDİRİM EKRANI
      renderNotifications: function (container) {
        container.innerHTML = `
                <h3 style="margin:0 0 15px 0;">🔔 Bildirimler</h3>
                <div class="p-card" style="padding:0;">
                    <div style="padding:15px; border-bottom:1px solid #f1f5f9;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <b style="color:#10b981;">💰 Yeni Satış!</b>
                            <span style="font-size:10px; color:#94a3b8;">10 dk önce</span>
                        </div>
                        <div style="font-size:12px; color:#334155;">Tebrikler! Paylaştığın linkten 1.500 TL satış geldi. +150 TL kazandın.</div>
                    </div>
                    <div style="padding:15px; border-bottom:1px solid #f1f5f9;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <b style="color:#3b82f6;">🚀 Seviye Yaklaşıyor</b>
                            <span style="font-size:10px; color:#94a3b8;">1 saat önce</span>
                        </div>
                        <div style="font-size:12px; color:#334155;">Altın Partner olmaya sadece 2 satış kaldı! Komisyonun %15'e çıkacak.</div>
                    </div>
                    <div style="padding:15px; border-bottom:1px solid #f1f5f9;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <b style="color:#f59e0b;">🎓 Yeni Ders</b>
                            <span style="font-size:10px; color:#94a3b8;">Dün</span>
                        </div>
                        <div style="font-size:12px; color:#334155;">"Instagram Reels ile Satış Artırma" rehberi akademiye eklendi.</div>
                    </div>
                </div>
            `;
      }, // window.ModumPartner objesinin içine ekle:

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

  /*sistem güncellendi v1*/
})();
