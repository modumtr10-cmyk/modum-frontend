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

  // BUTONU ÇİZEN FONKSİYON (Güncellendi)
  function renderPartnerButton() {
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

    Object.assign(btn.style, {
      position: "fixed", left: "20px", bottom: "100px", zIndex: "999999",
      background: "linear-gradient(135deg, #fbbf24, #d97706)", color: "#fff",
      padding: "12px 20px", borderRadius: "50px",
      boxShadow: "0 4px 15px rgba(251, 191, 36, 0.5)", cursor: "pointer",
      border: "2px solid #fff", transition: "transform 0.2s"
    });

    btn.onmouseover = function() { this.style.transform = "scale(1.05)"; };
    btn.onmouseout = function() { this.style.transform = "scale(1)"; };

    // 🔥 TIKLAYINCA PANELİ AÇ
    btn.onclick = function() {
      openPartnerDashboard();
    };

    document.body.appendChild(btn);
  }

  // --- 🌟 ORTAKLIK DASHBOARD (DEV PANEL) ---
  function openPartnerDashboard() {
    // Varsa eskisini sil
    var old = document.getElementById("mdm-partner-modal");
    if (old) old.remove();

    // Kullanıcı bilgisini al
    var email = detectUser() || "Misafir";

    var html = `
    <div id="mdm-partner-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.95); z-index:9999999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(5px);">
      <div style="width:90%; max-width:1000px; height:85vh; background:#fff; border-radius:20px; display:flex; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.5);">
        
        <div style="width:250px; background:#1e293b; color:#fff; padding:20px; display:flex; flex-direction:column;">
          <div style="font-size:18px; font-weight:800; color:#fbbf24; margin-bottom:30px; display:flex; align-items:center; gap:10px;">
            <i class="fas fa-crown"></i> PARTNER HUB
          </div>
          
          <div class="p-menu-item active" onclick="switchPTab('home', this)">🏠 Genel Bakış</div>
          <div class="p-menu-item" onclick="switchPTab('links', this)">🔗 Link Oluşturucu</div>
          <div class="p-menu-item" onclick="switchPTab('wallet', this)">💰 Cüzdan & Ödeme</div>
          <div class="p-menu-item" onclick="switchPTab('assets', this)">🎨 Görsel Kitaplığı</div>
          
          <div style="margin-top:auto; font-size:11px; color:#64748b;">
            Oturum: ${email}<br>v1.0.0
          </div>
        </div>

        <div style="flex:1; background:#f8fafc; padding:30px; overflow-y:auto; position:relative;">
           <span onclick="document.getElementById('mdm-partner-modal').remove()" style="position:absolute; top:20px; right:20px; font-size:24px; cursor:pointer; color:#64748b;">&times;</span>

           <div id="p-tab-home" class="p-tab-content active">
              <h2 style="color:#1e293b; margin-top:0;">Hoşgeldin Ortak! 👋</h2>
              
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; margin-bottom:30px;">
                 <div class="p-stat-card">
                    <div class="p-lbl">TOPLAM KAZANÇ</div>
                    <div class="p-val" style="color:#10b981;">12.540 ₺</div>
                 </div>
                 <div class="p-stat-card">
                    <div class="p-lbl">BU AYKİ TIKLAMA</div>
                    <div class="p-val" style="color:#3b82f6;">8.420</div>
                 </div>
                 <div class="p-stat-card">
                    <div class="p-lbl">BEKLEYEN BAKİYE</div>
                    <div class="p-val" style="color:#f59e0b;">1.250 ₺</div>
                 </div>
              </div>

              <div style="background:#fff; border-radius:12px; padding:20px; border:1px solid #e2e8f0; height:300px; display:flex; align-items:center; justify-content:center; color:#94a3b8;">
                  📊 Performans Grafiği (Backend Verisi Bekleniyor)
              </div>
           </div>

           <div id="p-tab-links" class="p-tab-content">
              <h2 style="color:#1e293b; margin-top:0;">🔗 Özel Link Oluştur</h2>
              <p style="color:#64748b; font-size:13px;">Paylaşmak istediğin ürünün linkini yapıştır, sana özel takip linkini al.</p>
              
              <div style="background:#fff; padding:20px; border-radius:12px; border:1px solid #e2e8f0;">
                 <label style="font-weight:bold; font-size:12px; color:#334155;">HEDEF URL</label>
                 <div style="display:flex; gap:10px; margin-top:5px;">
                    <input type="text" id="p-gen-input" placeholder="https://www.modum.tr/urun/..." style="flex:1; padding:10px; border:1px solid #cbd5e1; border-radius:6px;">
                    <button onclick="generateMyLink()" style="background:#3b82f6; color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer;">OLUŞTUR</button>
                 </div>

                 <div id="p-gen-result" style="margin-top:20px; display:none; background:#eff6ff; padding:15px; border-radius:8px; border:1px dashed #3b82f6;">
                    <div style="font-size:11px; color:#1e40af; font-weight:bold; margin-bottom:5px;">TAKİP LİNKİN:</div>
                    <div id="p-final-link" style="font-family:monospace; color:#334155; word-break:break-all;">...</div>
                 </div>
              </div>
           </div>

           <div id="p-tab-wallet" class="p-tab-content">
              <h2>💰 Cüzdan</h2>
              <p>Ödeme geçmişi ve talep ekranı burada olacak.</p>
           </div>
           
           <div id="p-tab-assets" class="p-tab-content">
              <h2>🎨 Görsel Kitaplığı</h2>
              <p>Reklam materyalleri burada olacak.</p>
           </div>

        </div>
      </div>
      <style>
        .p-menu-item { padding:12px 15px; cursor:pointer; border-radius:8px; font-size:13px; font-weight:600; color:#94a3b8; margin-bottom:5px; transition:0.2s; }
        .p-menu-item:hover, .p-menu-item.active { background:rgba(255,255,255,0.1); color:#fff; }
        .p-tab-content { display:none; animation:fadeIn 0.3s; }
        .p-tab-content.active { display:block; }
        .p-stat-card { background:#fff; padding:20px; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 2px 5px rgba(0,0,0,0.05); }
        .p-lbl { font-size:10px; color:#64748b; font-weight:bold; margin-bottom:5px; }
        .p-val { font-size:24px; font-weight:900; }
        @keyframes fadeIn { from {opacity:0; transform:translateY(10px);} to {opacity:1; transform:translateY(0);} }
      </style>
    </div>
    `;

    var div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);

    // Global Fonksiyonları Window'a Ata (HTML içinden erişmek için)
    window.switchPTab = function(id, el) {
      document.querySelectorAll(".p-tab-content").forEach(d => d.classList.remove("active"));
      document.getElementById("p-tab-" + id).classList.add("active");
      
      document.querySelectorAll(".p-menu-item").forEach(d => d.classList.remove("active"));
      el.classList.add("active");
    };

    window.generateMyLink = function() {
       var input = document.getElementById("p-gen-input").value;
       if(!input) return alert("Link giriniz.");
       
       // Basit bir ID üretimi (Gerçekte veritabanından gelecek)
       var refCode = "REF-" + email.substring(0,3).toUpperCase() + new Date().getSeconds(); 
       
       var final = input + (input.includes("?") ? "&" : "?") + "ref=" + refCode;
       
       document.getElementById("p-final-link").innerText = final;
       document.getElementById("p-gen-result").style.display = "block";
    };
  }

  // Başlat
  setTimeout(initPartnerSystem, 2000);

})();
