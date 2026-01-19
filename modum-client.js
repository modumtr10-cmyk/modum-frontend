/* ======================================================
🚫 HASSAS SAYFA FİLTRESİ (SEPET, ÖDEME & GİRİŞ GİZLEYİCİ)
Bu kod, belirtilen sayfalarda sistemi tamamen gizler.
====================================================== */
(function () {
  var url = window.location.href.toLowerCase();

  // 1. GİZLENECEK SAYFALAR LİSTESİ
  var restrictedPages = [
    "alisveris-sepetim",
    "siparis/adres",
    "siparis/odeme",
    "/sepet",
    "/checkout",
    "/cart",
    // 🔥 Giriş ve Kayıt sayfalarını da ekledik ki tasarım bozulmasın:
    "kullanici-giris",
    "kullanici-kayit",
    "uye-girisi",
    "uye-kayit",
  ];

  // 2. İSTİSNALAR (Sipariş Başarılı sayfası - Ödül vermek için görünmeli)
  var exceptions = [
    "siparistamamlandi",
    "order/success",
    "checkout/success",
    "success",
    "tamamlandi",
  ];

  // Kontrol: Yasaklı sayfada mıyız?
  var isRestricted = restrictedPages.some(function (page) {
    return url.indexOf(page) > -1;
  });

  // Kontrol: İstisna sayfasında mıyız?
  var isException = exceptions.some(function (exc) {
    return url.indexOf(exc) > -1;
  });

  // KARAR: Yasaklıysa VE İstisna değilse -> GİZLE
  if (isRestricted && !isException) {
    var css = document.createElement("style");

    // Tüm sistem parçalarını (Widget, Topbar, Dock, Hedef Barı, Intro) gizle
    css.innerHTML =
      "#modum-firebase-test-root, .mdm-dock-nav, .mdm-topbar, #mdm-goal-bar, #mdm-intro-overlay { display: none !important; opacity: 0 !important; pointer-events: none !important; }";

    document.head.appendChild(css);

    console.log("🛡️ ModumNet: Hassas sayfadasınız, sistem gizlendi.");
  }
})();
src =
  "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js" >
  (function () {
    // Varsa eskileri temizle
    var oldIcons = document.querySelectorAll('link[href*="font-awesome"]');
    oldIcons.forEach((el) => el.remove());
    var fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    fa.integrity =
      "sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==";
    fa.crossOrigin = "anonymous";
    document.head.appendChild(fa);
  })();
/* --- 🚀 HIZLI INTRO PERDESİ (FOUC ÖNLEYİCİ) --- */
// Bu blok, kodun EN TEPESİNDE olmalı
var fastCSS = document.createElement("style");
fastCSS.innerHTML = `
/* Sayfa yüklenirken her şeyi gizle, sadece siyah ekran göster */
html.intro-active body { visibility: hidden !important; background: #0f172a !important; overflow: hidden !important; }
/* İntro katmanını her zaman görünür yap */
html.intro-active body > #mdm-intro-overlay { visibility: visible !important; }
`;
document.head.appendChild(fastCSS);

// Eğer Çekilişler sayfasındaysak hemen perdeyi indir!
if (window.location.href.includes("cekilisler")) {
  document.documentElement.classList.add("intro-active");
}
(function () {
  var css = document.createElement("style");
  css.innerHTML = `
/* Başlıkları ve Eski İçeriği Yok Et */
.topic-page h1, #ph-title, .topic-title, .page-title { 
display: none !important; 
opacity: 0 !important;
visibility: hidden !important;
}

/* Arka Planı Temizle */
.page.topic-page, .page-container, .topic-body {
background: transparent !important;
border: none !important;
box-shadow: none !important;
padding-top: 0 !important;
margin-top: 0 !important;
}

/* Mobilde Header ile Birleştir */
@media (max-width: 768px) {
.page.topic-page { margin-top: -15px !important; }
#modum-firebase-test-root { margin-top: 0 !important; }
}
`;
  document.head.appendChild(css);
  // HTML2CANVAS KÜTÜPHANESİNİ YÜKLE
  var scriptH2C = document.createElement("script");
  scriptH2C.src =
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
  document.head.appendChild(scriptH2C);
  // GÜVENLİK YAMASI: Object.keys hatasını önle
  if (!Object.keys) {
    Object.keys = (function () {
      "use strict";
      var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString"),
        dontEnums = [
          "toString",
          "toLocaleString",
          "valueOf",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "constructor",
        ],
        dontEnumsLength = dontEnums.length;

      return function (obj) {
        if (
          typeof obj !== "object" &&
          (typeof obj !== "function" || obj === null)
        ) {
          return []; // Hata vermek yerine boş dizi dön
        }
        var result = [],
          prop,
          i;
        for (prop in obj) {
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }
        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
          }
        }
        return result;
      };
    })();
  }
  var globalRaffleTimer = null;

  // ======================================================
  // 🛡️ BAKIM MODU & GELİŞMİŞ OYUN MOTORU (v2.0)
  // ======================================================
  async function checkSystemLock() {
    try {
      var cachedUser = JSON.parse(localStorage.getItem("mdm_user_cache"));
      if (cachedUser && cachedUser.email === "info@modum.tr") {
        return false; // Kilidi kırma, siteyi göster
      }
      const API_URL = "https://api-hjen5442oq-uc.a.run.app";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ islem: "get_settings" }),
      });
      const data = await res.json();

      if (
        data &&
        data.success &&
        data.settings &&
        (data.settings.maintenance_mode === "true" ||
          data.settings.maintenance_mode === true)
      ) {
        // Sadece çekiliş sayfasında çalış
        if (window.location.href.indexOf("cekilisler") === -1) return false;

        console.warn("⛔ BAKIM MODU AKTİF - OYUN HAZIRLANIYOR...");

        window.MDM_SYSTEM_LOCKED = true;

        // Temizlik
        const intro = document.getElementById("mdm-intro-overlay");
        if (intro) intro.remove();
        document.documentElement.classList.remove("intro-active");
        document.body.style.visibility = "visible";
        const egg = document.getElementById("mdm-surprise-egg");
        if (egg) egg.remove();
        const root = document.getElementById("modum-firebase-test-root");
        if (root) root.style.display = "none";

        // OYUN EKRANI (HTML)
        if (!document.getElementById("mdm-maintenance-game")) {
          const gameHTML = `
<div id="mdm-maintenance-game" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:#0f172a; z-index:2147483647; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'Courier New', monospace; user-select:none; touch-action:none;">

<div style="text-align:center; margin-bottom:15px; z-index:2;">
<h1 style="color:#facc15; text-shadow:0 0 10px #b45309; margin:0; font-size:clamp(20px, 5vw, 36px);">🚧 SİSTEM YENİLENİYOR 🚧</h1>
<p style="color:#94a3b8; font-size:14px; margin:5px 0;">XP Topla, Rekorunu Kır!</p>
<div style="font-size:20px; color:#fff; margin-top:10px;">SKOR: <span id="mdm-game-score" style="color:#4ade80; font-weight:bold;">0</span></div>
  </div>

<div style="position:relative; width:90vw; max-width:500px; aspect-ratio:1/1;">

<div id="mdm-start-overlay" onclick="window.mdmStartGame()" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:10; border-radius:12px;">
<div style="background:#10b981; color:white; padding:15px 40px; border-radius:50px; font-size:24px; font-weight:bold; box-shadow:0 0 20px #10b981; animation:pulse 1s infinite;">
▶ OYNA
  </div>
  </div>

<canvas id="mdmGameCanvas" width="500" height="500" style="width:100%; height:100%; background:#1e293b; border:4px solid #334155; border-radius:12px; box-shadow:0 0 30px rgba(0,0,0,0.5); display:block;"></canvas>
  </div>

<div id="mdm-mobile-controls" style="display:none; gap:15px; margin-top:20px; z-index:2;">
<button onclick="window.mdmGameDir={x:-1,y:0}" style="width:60px; height:60px; background:rgba(255,255,255,0.1); color:white; border:2px solid #334155; border-radius:12px; font-size:24px;">⬅️</button>
<div style="display:flex; flex-direction:column; gap:15px;">
<button onclick="window.mdmGameDir={x:0,y:-1}" style="width:60px; height:60px; background:rgba(255,255,255,0.1); color:white; border:2px solid #334155; border-radius:12px; font-size:24px;">⬆️</button>
<button onclick="window.mdmGameDir={x:0,y:1}" style="width:60px; height:60px; background:rgba(255,255,255,0.1); color:white; border:2px solid #334155; border-radius:12px; font-size:24px;">⬇️</button>
  </div>
<button onclick="window.mdmGameDir={x:1,y:0}" style="width:60px; height:60px; background:rgba(255,255,255,0.1); color:white; border:2px solid #334155; border-radius:12px; font-size:24px;">➡️</button>
  </div>

<div style="margin-top:25px; text-align:center; z-index:2;">
<a href="/" style="background:#3b82f6; color:white; padding:12px 30px; border-radius:50px; text-decoration:none; font-weight:bold; font-size:14px; box-shadow:0 4px 15px rgba(37, 99, 235, 0.4);">🛍️ Oyunu Bırak, Alışverişe Dön</a>
  </div>

<style>@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }</style>
  </div>
`;
          document.body.insertAdjacentHTML("beforeend", gameHTML);
          document.body.style.overflow = "hidden";

          // Mobil Kontrol Göster (Ekran darsa)
          if (window.innerWidth < 1024) {
            document.getElementById("mdm-mobile-controls").style.display =
              "flex";
          }

          // Motoru yükle ama başlatma (Tuşa basmayı bekle)
          startGameEngine();

          // ✅ DÜZELTME: Temizlik kodunu BURAYA, if bloğunun içine alıyoruz.
          // Böylece sadece bakım ekranı ilk açıldığında çalışır, oyun oynarken çalışmaz.
          var killId = setTimeout(function () {
            for (var i = killId; i > 0; i--) clearInterval(i);
          }, 10);
        } // <--- if bloğu şimdi burada bitiyor

        return true;
      }
    } catch (e) {}
    return false;
  }

  // 🕹️ OYUN MOTORU (GELİŞMİŞ)
  function startGameEngine() {
    const canvas = document.getElementById("mdmGameCanvas");
    const ctx = canvas.getContext("2d");

    // Canvas boyutunu responsive ayarla
    const gridSize = 25; // Kare boyutu
    const tileCount = 20; // 20x20 kare (500px / 25)

    let score = 0;
    let player = { x: 10, y: 10 };
    let trail = [];
    let tail = 5;
    let apple = { x: 15, y: 15 };

    // Yön (Başlangıçta duruyor)
    window.mdmGameDir = { x: 0, y: 0 };
    window.mdmGameInterval = null;

    // 🔥 BAŞLATMA FONKSİYONU
    window.mdmStartGame = function () {
      document.getElementById("mdm-start-overlay").style.display = "none"; // Butonu gizle
      window.mdmGameDir = { x: 1, y: 0 }; // Sağa doğru hareketi başlat
      if (window.mdmGameInterval) clearInterval(window.mdmGameInterval);
      window.mdmGameInterval = setInterval(gameLoop, 1000 / 12); // Hızı ayarla (12 FPS)
    };

    // Klavye Dinleyici
    document.addEventListener("keydown", function (evt) {
      // Eğer oyun başlamadıysa, tuşa basınca başlat
      if (
        document.getElementById("mdm-start-overlay").style.display !== "none"
      ) {
        window.mdmStartGame();
      }

      switch (evt.keyCode) {
        case 37:
          window.mdmGameDir = { x: -1, y: 0 };
          break; // Sol
        case 38:
          window.mdmGameDir = { x: 0, y: -1 };
          break; // Üst
        case 39:
          window.mdmGameDir = { x: 1, y: 0 };
          break; // Sağ
        case 40:
          window.mdmGameDir = { x: 0, y: 1 };
          break; // Alt
      }
    });

    function gameLoop() {
      if (!document.getElementById("mdm-maintenance-game")) return;

      player.x += window.mdmGameDir.x;
      player.y += window.mdmGameDir.y;

      // Duvarlardan Geçiş (Teleport)
      if (player.x < 0) player.x = tileCount - 1;
      if (player.x > tileCount - 1) player.x = 0;
      if (player.y < 0) player.y = tileCount - 1;
      if (player.y > tileCount - 1) player.y = 0;

      // Arka Plan
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Izgara Çizgileri (Opsiyonel - Daha şık durur)
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
      }

      // Yılan (Modum-Man)
      ctx.fillStyle = "#facc15"; // Sarı
      for (let i = 0; i < trail.length; i++) {
        // Yılanın başı farklı renk olsun
        if (i === trail.length - 1) ctx.fillStyle = "#fff";
        else ctx.fillStyle = "#facc15";

        ctx.fillRect(
          trail[i].x * gridSize,
          trail[i].y * gridSize,
          gridSize - 2,
          gridSize - 2,
        );

        // Kendine çarpma (Ölme)
        if (
          trail[i].x == player.x &&
          trail[i].y == player.y &&
          (window.mdmGameDir.x != 0 || window.mdmGameDir.y != 0)
        ) {
          tail = 5;
          score = 0;
          document.getElementById("mdm-game-score").innerText = score;
          // Yanınca butonu geri getir
          document.getElementById("mdm-start-overlay").style.display = "flex";
          clearInterval(window.mdmGameInterval);
        }
      }
      trail.push({ x: player.x, y: player.y });
      while (trail.length > tail) {
        trail.shift();
      }

      // Hedef (XP)
      ctx.fillStyle = "#4ade80";
      ctx.beginPath();
      ctx.arc(
        apple.x * gridSize + gridSize / 2,
        apple.y * gridSize + gridSize / 2,
        gridSize / 2.5,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#4ade80"; // Parlama efekti

      // Yeme Kontrolü
      if (apple.x == player.x && apple.y == player.y) {
        tail++;
        score += 50; // Her yem 50 puan (Görsel)
        document.getElementById("mdm-game-score").innerText = score;
        apple.x = Math.floor(Math.random() * tileCount);
        apple.y = Math.floor(Math.random() * tileCount);
      }
      ctx.shadowBlur = 0; // Efekti sıfırla
    }
  }

  // ======================================================
  // 1. AYARLAR
  // ======================================================
  var TARGET_ID = "modum-firebase-test-root";
  var API_URL = "https://api-hjen5442oq-uc.a.run.app";
  var ACCOUNT_PAGE_URL = "/hesabim/bilgilerim/";
  var SITE_URL = window.location.origin + "/kullanici-giris";
  var DEFAULT_IMG = "https://www.modum.tr/i/m/001/0013355.png";

  var THEME = {
    bg: "#0f172a",
    cardBg: "#1e293b",
    primary: "#8b5cf6",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    border: "#334155",
    gold: "#fbbf24",
    silver: "#94a3b8",
    bronze: "#b45309",
  };
  var APP_STATE = {
    user: { email: null, name: "Misafir", puan: 0, seviye: "Çaylak" },
    activeTab: "home",
    activeRaffles: [],
    completedRaffles: [],
    leaderboard: [],
    pool: 0,
    myRaffles: [],
  };
  window.APP_STATE = APP_STATE;
  window.fetchApiTest = fetchApi;

  // ======================================================
  // 🔥 GLOBAL ROZET VERİTABANI (TEK MERKEZ)
  // ======================================================
  var BADGES_DB = {
    // --- MEVCUTLAR ---
    gorev_adami: {
      t: "Görev Adamı",
      i: "🎯",
      d: "İlk görevini başarıyla tamamlayanlara verilir.",
    },
    gece_kusu: {
      t: "Gece Kuşu",
      i: "👾",
      d: "Gece 00:00 - 06:00 arası sipariş verenlere verilir.",
    },
    takim_lideri: {
      t: "Takım Lideri",
      i: "🤝",
      d: "Rozet 5 Arkadaşını Davet Ettiğinizde Verilir.",
    },
    sepet_krali: {
      t: "Sepet Kralı",
      i: "🛍️",
      d: "Rozet 6000₺ ve üzeri alışveriş yapanlara verilir.",
    },
    alev_alev: {
      t: "Alev Alev",
      i: "🔥",
      d: "7 gün üst üste giriş yapan sadık üyelere verilir.",
    },
    hazine_avcisi: {
      t: "Hazine Avcısı",
      i: "🕵️",
      d: "Sitedeki gizli altın ürünü bulanlara verilir.",
    },
    sans_melegi: {
      t: "Şans Meleği",
      i: "🍀",
      d: "Çekiliş kazanan şanslı üyelere verilir.",
    },
    bonkor: {
      t: "Bonkör",
      i: "🎁",
      d: "Arkadaşına hediye gönderenlere verilir.",
    },

    // --- 🔥 YENİ EKLENEN SEVİYE ROZETLERİ ---
    lvl_caylak: {
      t: "Çaylak",
      i: "🌱",
      d: "Aramıza yeni katılanlara verilen başlangıç rozeti.",
    },
    lvl_usta: {
      t: "Usta",
      i: "⚔️",
      d: "Deneyimi ve siparişleriyle ustalığını kanıtlayanlara verilir.",
    },
    lvl_sampiyon: {
      t: "Şampiyon",
      i: "🦁",
      d: "Zirveye oynayan, yüksek puanlı liderlere verilir.",
    },
    lvl_efsane: {
      t: "Efsane",
      i: "🐉",
      d: "Sistemin en prestijli rozeti. Sadece en iyilere verilir.",
    },
  };
  // 🔥 PROFİL TEMA SEÇENEKLERİ
  var PROFILE_THEMES = {
    default: {
      name: "Varsayılan",
      bg: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
      border: "rgba(255,255,255,0.1)",
      glow: "transparent",
    },
    neon: {
      name: "Neon Cyber",
      bg: "linear-gradient(135deg, #2e0249, #570a57)",
      border: "#a91079",
      glow: "#a91079",
    },
    fire: {
      name: "Ateş Ruhu",
      bg: "linear-gradient(135deg, #450a0a, #7f1d1d)",
      border: "#ef4444",
      glow: "#ef4444",
    },
    ocean: {
      name: "Okyanus",
      bg: "linear-gradient(135deg, #0c4a6e, #0369a1)",
      border: "#38bdf8",
      glow: "#38bdf8",
    },
    gold: {
      name: "Zenginlik",
      bg: "linear-gradient(135deg, #422006, #713f12)",
      border: "#eab308",
      glow: "#eab308",
    },
    matrix: {
      name: "Matrix",
      bg: "linear-gradient(135deg, #022c22, #14532d)",
      border: "#22c55e",
      glow: "#22c55e",
    },
    love: {
      name: "Aşk",
      bg: "linear-gradient(135deg, #831843, #be185d)",
      border: "#f472b6",
      glow: "#f472b6",
    },
    night: {
      name: "Gece Modu",
      bg: "#000000",
      border: "#333",
      glow: "rgba(255,255,255,0.2)",
    },
    sunset: {
      name: "Gün Batımı",
      bg: "linear-gradient(135deg, #f97316, #db2777)",
      border: "#f97316",
      glow: "#f97316",
    },
    forest: {
      name: "Orman",
      bg: "linear-gradient(135deg, #064e3b, #10b981)",
      border: "#10b981",
      glow: "#10b981",
    },
    royal: {
      name: "Asil",
      bg: "linear-gradient(135deg, #450a0a, #b45309)",
      border: "#fcd34d",
      glow: "#fcd34d",
    },
    sky: {
      name: "Gökyüzü",
      bg: "linear-gradient(135deg, #0ea5e9, #e0f2fe)",
      border: "#38bdf8",
      glow: "#38bdf8",
    },
  };
  // 🔥 ÇERÇEVE VERİTABANI (POP-UP İÇİN)
  var FRAMES_DB = {
    "frame-dark": {
      t: "Karanlık (Dark) Çerçeve",
      d: "Gizemin ve asaletin simgesi.",
    },
    "frame-galaxy": {
      t: "Galaksi Çerçeve",
      d: "Sınır tanımayanlar için uzay teması.",
    },
    "frame-glitch": {
      t: "Glitch (Hata) Çerçeve",
      d: "Siber dünyanın dijital bozulması.",
    },
    "frame-fire": {
      t: "Alev Çerçeve",
      d: "Profilini yakıp kavuracak ateş efekti.",
    },
    "frame-rainbow": {
      t: "Gökkuşağı Çerçeve",
      d: "Rengarenk ve enerjik bir görünüm.",
    },
    "frame-royal": {
      t: "Kraliyet (Royal) Çerçeve",
      d: "Sadece en seçkin üyelere özel.",
    },
    "frame-gold": {
      t: "Altın (Gold) Çerçeve",
      d: "Zenginliğin ve başarının parıltısı.",
    },
    "frame-neon": {
      t: "Neon Çerçeve",
      d: "Gecenin karanlığında parlayan ışık.",
    },
    "frame-nature": {
      t: "Doğa (Nature) Çerçeve",
      d: "Doğallıktan yana olanlar için.",
    },
    "frame-ice": {
      t: "Buzul (Ice) Çerçeve",
      d: "Serin ve karizmatik bir duruş.",
    },
    "frame-robotic": {
      t: "Mekanik (Robotic) Çerçeve",
      d: "Geleceğin teknolojisi profilinde hayat buluyor.",
    },
    "frame-angel": {
      t: "Melek (Angel) Çerçeve",
      d: "Saflığın ve asaletin kutsal ışığı.",
    },
  };

  // ======================================================
  // 2. CSS STİLLERİ (MODAL LAYOUT FİX & MOBİL UYUM)
  // ======================================================
  var cssKodlari =
    `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

/* --- ANA KAPLAYICI --- */
#` +
    TARGET_ID +
    ` { 
font-family: 'Outfit', sans-serif; background-color: ` +
    THEME.bg +
    `; color: ` +
    THEME.text +
    `; 
padding: 0; border-radius: 20px; min-height: 100vh; width: 100%; display: flex; flex-direction: column; 
box-sizing: border-box; position: relative; overflow-x: hidden; border: 1px solid ` +
    THEME.border +
    `;
}
#` +
    TARGET_ID +
    ` * { box-sizing: border-box; }

/* --- MODAL (MASAÜSTÜ VE MOBİL İÇİN ÖZEL LAYOUT) --- */
.mdm-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100000; align-items: center; justify-content: center; backdrop-filter: blur(5px); } 
.mdm-modal.active { display: flex; }

.mdm-modal-content { 
background: ` +
    THEME.cardBg +
    `; 
width: 90%; max-width: 750px; /* Genişlik arttırıldı */
border-radius: 16px; padding: 0; /* Padding sıfırlandı, içerde vereceğiz */
border: 1px solid ` +
    THEME.border +
    `; 
max-height: 90vh; overflow: hidden; /* Taşmayı engelle */
position: relative; display: flex; flex-direction: column;
} 

.mdm-modal-header { 
display: flex; justify-content: space-between; align-items: center; 
padding: 15px 20px; background: rgba(0,0,0,0.2); border-bottom: 1px solid ` +
    THEME.border +
    `;
} 
.mdm-modal-close { font-size: 24px; cursor: pointer; color: ` +
    THEME.textMuted +
    `; transition:0.3s; }
.mdm-modal-close:hover { color: #fff; transform: rotate(90deg); }

/* 🔥 SPLIT LAYOUT (YAN YANA DİZİLİM) 🔥 */
.mdm-modal-split-layout { 
display: flex; 
flex-direction: row; /* Varsayılan: YAN YANA */
height: 500px; /* Sabit yükseklik */
overflow: hidden; 
}

.mdm-modal-left { 
flex: 1; /* %50 Genişlik */
padding: 20px; 
border-right: 1px solid rgba(255,255,255,0.1); 
display: flex; flex-direction: column; gap: 15px; 
overflow-y: auto; 
}

.mdm-modal-right { 
flex: 1; /* %50 Genişlik */
display: flex; flex-direction: column; 
background: rgba(0,0,0,0.1); /* Hafif koyu zemin */
}

/* Sol Taraf Bileşenleri */
.mdm-detail-img { width: 100%; height: 200px; object-fit: contain; background: #0f172a; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
.mdm-detail-title { font-size: 18px; font-weight: 800; color: #fff; line-height: 1.3; }
.mdm-detail-reward { background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); color: #fbbf24; padding: 10px; border-radius: 8px; text-align: center; font-weight: bold; }

.mdm-detail-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.mdm-stat-box { background: rgba(255,255,255,0.03); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.05); }
/* --- SAYAÇ TİTREME FİX --- */
.mdm-stat-val { 
font-size: 14px !important; /* Yazıyı biraz küçülttük ki sığsın */
font-weight: 800; 
color: #fff; 
white-space: nowrap !important; /* KRİTİK KOD: Asla alt satıra inme! */
overflow: visible !important;   /* Gizleme */
display: block;
min-width: 80px; /* Rakam için yer ayır */
}
/* Kalan Süre yazısını da ortalayalım */
.mdm-stat-lbl { text-align: center; width: 100%; display: block; }

/* Sağ Taraf Bileşenleri */
.mdm-detail-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); }
.mdm-dt-tab { flex: 1; padding: 15px; text-align: center; cursor: pointer; color: #94a3b8; font-weight: 600; font-size: 13px; transition: 0.3s; }
.mdm-dt-tab.active { color: ` +
    THEME.primary +
    `; border-bottom: 2px solid ` +
    THEME.primary +
    `; background: rgba(139, 92, 246, 0.05); color: #fff; }

.mdm-participant-list { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }

/* 🔥 LİSTE ELEMANI DÜZELTMESİ (FLEX HİZALAMA) 🔥 */
.mdm-part-item { 
display: flex; 
align-items: center; /* Dikey ortala */
justify-content: space-between; /* Sağa sola yasla */
background: rgba(255,255,255,0.03); 
padding: 10px 12px; 
border-radius: 8px; 
border: 1px solid rgba(255,255,255,0.05); 
}

.mdm-part-user { 
display: flex; 
align-items: center; 
gap: 12px; /* İkon ve yazı arası boşluk */
flex: 1;
}

.mdm-part-icon { 
width: 32px; height: 32px; 
background: #334155; border-radius: 50%; 
display: flex; align-items: center; justify-content: center; 
font-size: 12px; color: #fff; font-weight: bold;
flex-shrink: 0; /* Küçülmesin */
}

.mdm-part-info { display: flex; flex-direction: column; justify-content: center; line-height: 1.3; }
.mdm-part-name { font-size: 13px; font-weight: 600; color: #e2e8f0; }
.mdm-part-ticket { font-size: 10px; color: #f59e0b; font-family: monospace; letter-spacing: 0.5px; }

.mdm-part-time { color: #64748b; font-size: 11px; white-space: nowrap; }

.mdm-participant-list::-webkit-scrollbar { width: 6px; }
.mdm-participant-list::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }

/* --- MOBİL UYUMLULUK (FİNAL: TAM ORTALAMA & KİLİT FİX v5.0) --- */
@media (max-width: 768px) {

#modum-firebase-test-root { 
/* 🔥 1. MATEMATİKSEL ORTALAMA (KAYMAYI ÖNLER) */
width: 100vw !important; 
max-width: 100vw !important;

/* Bu formül parent ne olursa olsun ekranın soluna yapıştırır */
margin-left: calc(21% - 21vw) !important;
margin-right: calc(21% - 21vw) !important;

/* Pozisyonu sıfırla ki 'left' komutları karışmasın */
position: relative !important;
left: auto !important;
right: auto !important;

/* 🔥 2. KİLİT ÇÖZÜCÜ KODLAR (DEVAM EDİYOR) */
height: auto !important;       
min-height: 100vh !important;
overflow-y: visible !important; 
overflow-x: hidden !important;

/* Tasarım Düzeltmeleri */
border: none !important;
border-top: 1px solid #334155 !important;
box-sizing: border-box !important;
padding-bottom: 85px !important; /* Alt menü payı */
background-color: #0f172a !important;
}

/* İçerik Alanı */
.mdm-content-wrapper { 
padding: 15px !important; 
padding-bottom: 100px !important; 
height: auto !important; 
display: block !important; 
overflow: visible !important;
width: 100% !important;
}

/* Modal Ayarları */
.mdm-modal-split-layout { flex-direction: column; height: auto; display: flex; } 
.mdm-modal-left { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
.mdm-modal-content { width: 95% !important; max-width: 95% !important; margin: 0 auto; max-height: 85vh; padding: 15px; overflow-y: auto; }
.mdm-participant-list { max-height: 200px; }

/* Grid Ayarları */
.mdm-grid { grid-template-columns: 1fr !important; }
.mdm-profile-hub { grid-template-columns: repeat(2, 1fr) !important; }
.mdm-mini-profile { display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.05); padding: 4px 6px 4px 10px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; max-width: 140px; }
.mdm-mini-xp { font-size: 12px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } 
.mdm-mini-avatar { width: 28px; height: 28px; background: linear-gradient(135deg, ` +
    THEME.primary +
    `, #6d28d9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: #fff; flex-shrink: 0; }

.mdm-mini-avatar { width: 36px; height: 36px; font-size: 16px; } .mdm-mini-xp { font-size: 14px; }
.mdm-nav-icon { font-size: 16px !important; margin-bottom: 0 !important; }
.mdm-nav-text { font-size: 14px !important; font-weight: 600 !important; }
.mdm-content-wrapper { padding: 0 30px 30px 30px !important; padding-bottom: 30px !important; }
}
.mdm-content-wrapper { flex: 1; padding: 15px; padding-bottom: 90px; width: 100%; max-width: 100%; }
.mdm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; width: 100%; }
@media (max-width: 1024px) { .mdm-grid { grid-template-columns: repeat(2, 1fr); } }
.mdm-raffle-card { background: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border: 1px solid #334155; font-family: 'Outfit', sans-serif; position: relative; display: flex; flex-direction: column; width: 100%; }
.mdm-raffle-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(139, 92, 246, 0.2); border-color: #8b5cf6; }
.mdm-rc-image { width: 100%; height: 160px; background: #0f172a; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.mdm-rc-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; } .mdm-raffle-card:hover .mdm-rc-image img { transform: scale(1.1); }
.mdm-rc-badge { position: absolute; top: 10px; right: 10px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 9px; font-weight: 800; letter-spacing: 0.5px; z-index: 2; }
.mdm-rc-body { padding: 15px; flex: 1; display: flex; flex-direction: column; }
.mdm-rc-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 12px; line-height: 1.4; height: 42px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.mdm-stats-bar { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 8px 12px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.1); }
.mdm-sb-item { text-align: center; } .mdm-sb-lbl { font-size: 8px; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; } .mdm-sb-val { font-size: 12px; font-weight: 700; color: #f8fafc; } .mdm-sb-sep { width: 1px; height: 20px; background: rgba(255,255,255,0.1); }
.mdm-timer-minimal { display: flex; gap: 4px; justify-content: center; margin-bottom: 15px; background: rgba(0,0,0,0.2); padding: 8px 4px; border-radius: 8px; width: 100%; }
.mdm-tm-part { text-align: center; flex: 1; min-width: 0; } .mdm-tm-val { font-size: 16px; font-weight: 800; color: #fbbf24; line-height: 1; white-space: nowrap; } .mdm-tm-lbl { font-size: 7px; color: #64748b; margin-top: 3px; text-transform: uppercase; } .mdm-tm-dots { font-size: 14px; color: #475569; font-weight: bold; margin-top: -2px; }
.mdm-action-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 8px; margin-top: auto; }
.mdm-btn-v2 { border: none; padding: 0; height: 38px; border-radius: 8px; font-weight: 700; cursor: pointer; color: white; font-size: 11px; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 4px; line-height: 1; text-transform: uppercase; width: 100%; }
.btn-detail-v2 { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.1); } .btn-detail-v2:hover { background: rgba(255,255,255,0.2); }
.btn-join-v2 { background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4); } .btn-join-v2:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(139, 92, 246, 0.6); }
.mdm-rc-footer { margin-top: 10px; }
.btn-share-link { background: transparent; border: 1px dashed rgba(255,255,255,0.2); color: #94a3b8; font-size: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px; border-radius: 6px; transition: 0.3s; width: 100%; } .btn-share-link:hover { border-color: #60a5fa; color: #60a5fa; background: rgba(59, 130, 246, 0.05); }
.btn-green { background: #10b981 !important; color: #fff !important; border: 1px solid #059669 !important; cursor: default !important; }
.mdm-tab-content { display: none; animation: fadeIn 0.4s ease-out; width: 100%; } .mdm-tab-content.active { display: block; } @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
.mdm-list-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid ` +
    THEME.border +
    `; font-size: 13px; color: #ddd; } .mdm-list-item:last-child { border-bottom: none; }
/* --- YENİ EKLENEN: VİTRİN BUTONLARI & GÖREV KARTLARI --- */

/* 1. Vitrin Butonları (Yeşil ve Lacivert) */
.mdm-home-actions { display: flex; gap: 10px; margin-bottom: 20px; }

.mdm-btn-lucky { 
flex: 2; /* Geniş Buton */
background: #10b981; color: white; border: none; padding: 12px; border-radius: 12px; 
font-weight: 800; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 8px;
box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3); transition: 0.2s;
}
.mdm-btn-lucky:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(16, 185, 129, 0.5); }

.mdm-btn-notify { 
flex: 1; /* Dar Buton */
background: #1e3a8a; color: white; border: none; padding: 12px; border-radius: 12px; 
font-weight: 700; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;
box-shadow: 0 4px 10px rgba(30, 58, 138, 0.4); transition: 0.2s;
}

/* 2. Görev Kartları (Rakip Tarzı - Koyu Tema) */
.mdm-task-row {
background: #1e293b; /* Koyu Zemin */
border: 1px solid #334155;
border-radius: 12px;
padding: 15px;
margin-bottom: 12px;
display: flex;
align-items: center;
justify-content: space-between;
gap: 15px;
}

.mdm-task-left { flex: 1; }
.mdm-task-head { font-weight: 700; color: #fff; font-size: 14px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
.mdm-task-sub { font-size: 11px; color: #94a3b8; line-height: 1.3; }
.mdm-task-xp { color: #fbbf24; font-weight: 800; font-size: 11px; margin-top: 4px; display: block; }

.mdm-btn-progress {
background: #3b82f6; color: white; border: none; padding: 8px 16px; 
border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; white-space: nowrap;
min-width: 90px; text-align: center;
}
.mdm-btn-progress.done { background: #10b981; cursor: default; opacity: 0.8; }

/* Mobilde Butonları Alt Alta Al */
@media (max-width: 768px) {
.mdm-home-actions { flex-direction: column; }
.mdm-task-row { align-items: flex-start; } /* Mobilde hizalama */
}
/* --- GÖREV KARTLARI v3 (GENİŞLETİLEBİLİR) --- */
.mdm-task-card-v3 {
background: #1e293b; border: 1px solid #334155; border-radius: 12px;
margin-bottom: 15px; overflow: hidden; transition: 0.3s;
}

/* Header (Daima Görünür) */
.mdm-task-header { padding: 15px; display: flex; align-items: center; gap: 12px; }
.mdm-task-icon-box { width: 40px; height: 40px; background: rgba(255,255,255,0.05); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.mdm-task-main-info { flex: 1; }
.mdm-task-title { font-weight: 700; color: #fff; font-size: 14px; margin-bottom: 4px; }
.mdm-task-meta { font-size: 10px; color: #94a3b8; margin-bottom: 6px; }
.mdm-task-progress-track { width: 100%; height: 4px; background: #334155; border-radius: 4px; overflow: hidden; }
.mdm-task-progress-bar { height: 100%; background: #3b82f6; width: 0%; transition: 0.5s; }

.mdm-btn-toggle {
background: #3b82f6; color: white; border: none; padding: 8px 12px; 
border-radius: 6px; font-weight: 700; font-size: 11px; cursor: pointer;
}

/* Body (Açılır Kapanır) */
.mdm-task-body { border-top: 1px solid #334155; background: rgba(0,0,0,0.2); padding: 15px; animation: slideDown 0.3s; }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

.mdm-step-row { display: flex; gap: 12px; margin-bottom: 15px; }
.mdm-step-check { width: 20px; height: 20px; border: 2px solid #64748b; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: transparent; margin-top: 2px; }
.mdm-step-check.done { background: #10b981; border-color: #10b981; color: white; }

.mdm-step-content { flex: 1; }
.mdm-step-text { color: #e2e8f0; font-size: 12px; margin-bottom: 5px; }

.mdm-btn-step-action { background: transparent; border: 1px solid #3b82f6; color: #3b82f6; padding: 4px 10px; border-radius: 20px; font-size: 10px; cursor: pointer; font-weight: bold; }
.mdm-btn-step-action:hover { background: #3b82f6; color: white; }

.mdm-step-input { background: #0f172a; border: 1px solid #475569; color: white; padding: 8px; border-radius: 6px; flex: 1; font-size: 12px; }
.mdm-btn-step-submit { background: #3b82f6; color: white; border: none; padding: 0 15px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px; }
/* --- GİZLİ YUMURTA (SÜRPRİZ KUTU) --- */
.mdm-surprise-box {
position: fixed;
top: 60%; /* Ekranın biraz aşağısında */
right: -100px; /* Başlangıçta ekran dışında */
width: 70px;
height: 70px;
/* Screenshot_108'deki gibi hediye paketi ikonu */
background: url('https://cdn-icons-png.flaticon.com/512/4213/4213958.png') no-repeat center center;
background-size: contain;
z-index: 2147483647; 
cursor: pointer;
transition: right 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Yaylanarak gelme efekti */
filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
}

.mdm-surprise-box.show {
right: 20px; 
display: block !important; /* İŞTE EKSİK OLAN BU! */
animation: mdmShake 3s infinite;
}

.mdm-sb-tooltip {
position: absolute;
bottom: -30px;
left: 50%;
transform: translateX(-50%);
background: #fff;
color: #333;
padding: 4px 8px;
border-radius: 12px;
font-size: 10px;
font-weight: 800;
white-space: nowrap;
box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

@keyframes mdmShake {
0%, 100% { transform: rotate(0deg); }
25% { transform: rotate(10deg); }
75% { transform: rotate(-10deg); }
}

/* Tıklanınca Patlama Efekti (Opsiyonel Süs) */
.mdm-poof {
animation: mdmFadeOut 0.5s forwards;
transform: scale(1.5);
opacity: 0;
}
@keyframes mdmFadeOut {
to { opacity: 0; transform: scale(2); }
}
/* --- SÜSLÜ POP-UP (GİZLİ HAZİNE) --- */
.mdm-popup-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 999999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
.mdm-popup-box { background: white; width: 90%; max-width: 350px; padding: 30px 20px; border-radius: 20px; text-align: center; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: mdmPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes mdmPopIn { from { opacity: 0; transform: scale(0.5) translateY(50px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.mdm-popup-icon { font-size: 60px; margin-bottom: 15px; display: block; filter: drop-shadow(0 5px 15px rgba(251, 191, 36, 0.4)); }
.mdm-popup-title { color: #d97706; font-size: 20px; font-weight: 900; margin-bottom: 10px; text-transform: uppercase; line-height: 1.2; }
.mdm-popup-desc { color: #4b5563; font-size: 13px; line-height: 1.5; margin-bottom: 20px; }
.mdm-popup-reward-box { background: #fffbeb; border: 2px dashed #f59e0b; padding: 15px; border-radius: 12px; margin-bottom: 20px; }
.mdm-popup-reward-lbl { font-size: 10px; color: #92400e; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.mdm-popup-reward-val { font-size: 32px; font-weight: 800; color: #10b981; margin-top: 5px; text-shadow: 0 2px 0 #d1fae5; }
.mdm-popup-btn { background: linear-gradient(to bottom, #fbbf24, #f59e0b); color: #fff; border: none; padding: 12px 30px; border-radius: 50px; font-weight: 800; font-size: 14px; cursor: pointer; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4); width: 100%; transition: 0.2s; text-transform: uppercase; }
.mdm-popup-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(245, 158, 11, 0.6); }
/* --- MAĞAZA SEKMESİ TASARIMI (PRO) --- */

/* Izgara Yapısı (Grid) */
.mdm-store-grid {
display: grid;
grid-template-columns: repeat(2, 1fr); /* Mobilde yan yana 2 */
gap: 12px;
margin-bottom: 20px;
}
@media (min-width: 768px) {
.mdm-store-grid {
grid-template-columns: repeat(4, 1fr); /* Masaüstünde yan yana 4 */
}
}

/* Ürün Kartı */
.mdm-store-card {
background: #fff; /* Kart rengi beyaz */
border: 1px solid #e2e8f0;
border-radius: 12px;
padding: 12px;
display: flex;
flex-direction: column;
position: relative;
transition: transform 0.2s, box-shadow 0.2s;
overflow: hidden;
}
.mdm-store-card:hover {
transform: translateY(-3px);
box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

/* Kilit Katmanı (Overlay) */
.mdm-card-lock-overlay {
position: absolute;
top: 0; left: 0; width: 100%; height: 100%;
background: rgba(255, 255, 255, 0.6); /* Hafif beyaz perde */
display: flex;
align-items: center;
justify-content: center;
z-index: 2;
pointer-events: none; /* Tıklamayı engelleme, buton halledecek */
}
.mdm-lock-icon {
font-size: 24px;
color: #94a3b8;
background: #f1f5f9;
padding: 10px;
border-radius: 50%;
box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Kart İçeriği */
.mdm-sc-icon-box {
width: 40px; height: 40px;
background: #fdf2f8; /* Pembe zemin */
border-radius: 8px;
display: flex; align-items: center; justify-content: center;
font-size: 20px;
color: #db2777; /* İkon rengi */
margin-bottom: 10px;
}

.mdm-sc-title {
font-size: 13px;
font-weight: 700;
color: #1e293b;
margin-bottom: 4px;
line-height: 1.3;
height: 34px; /* 2 satır */
overflow: hidden;
}

.mdm-sc-desc {
font-size: 10px;
color: #64748b;
margin-bottom: 10px;
height: 28px;
overflow: hidden;
line-height: 1.4;
}

.mdm-sc-cost {
font-size: 14px;
font-weight: 800;
color: #d97706; /* Turuncu Puan */
margin-bottom: 10px;
}

/* Butonlar */
.mdm-btn-store {
width: 100%;
padding: 8px;
border: none;
border-radius: 6px;
font-weight: 700;
font-size: 11px;
cursor: pointer;
transition: 0.2s;
text-transform: uppercase;
}

.mdm-btn-store.buy {
background: #22c55e; /* Yeşil */
color: white;
}
.mdm-btn-store.buy:hover {
background: #16a34a;
}

.mdm-btn-store.locked {
background: #94a3b8; /* Gri */
color: white;
cursor: not-allowed;
}

.mdm-btn-store.soldout {
background: #ef4444; /* Kırmızı */
color: white;
cursor: not-allowed;
opacity: 0.7;
}

/* Başlıklar */
.mdm-store-header {
display: flex;
align-items: center;
gap: 8px;
margin: 25px 0 15px 0;
padding-bottom: 5px;
border-bottom: 1px solid #e2e8f0;
}
.mdm-sh-dot {
width: 10px; height: 10px;
border-radius: 50%;
}
.mdm-sh-title {
font-size: 16px;
font-weight: 700;
color: #334155;
}
/* --- 🎰 KAZI KAZAN (SCRATCH CARD) STİLİ --- */
.mdm-scratch-overlay {
position: fixed; top: 0; left: 0; width: 100%; height: 100%;
background: rgba(0,0,0,0.9); z-index: 2147483647;
display: flex; align-items: center; justify-content: center;
backdrop-filter: blur(8px);
flex-direction: column;
}

.mdm-scratch-wrapper {
position: relative;
width: 300px;
height: 300px;
background: #fff;
border-radius: 20px;
overflow: hidden;
box-shadow: 0 0 50px rgba(255, 215, 0, 0.5);
border: 4px solid #f59e0b;
}

/* Arkadaki Ödül Katmanı */
.mdm-scratch-prize {
position: absolute;
top: 0; left: 0; width: 100%; height: 100%;
display: flex; flex-direction: column;
align-items: center; justify-content: center;
background: radial-gradient(circle, #fffbeb 0%, #fef3c7 100%);
z-index: 1; /* Altta kalacak */
}

.mdm-prize-val {
font-size: 48px; font-weight: 900; color: #d97706;
text-shadow: 0 2px 0 #fff; margin: 10px 0;
animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.mdm-prize-lbl {
font-size: 14px; color: #92400e; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;
}

/* Öndeki Gri Katman (Canvas) */
#mdm-scratch-canvas {
position: absolute;
top: 0; left: 0;
width: 100%; height: 100%;
z-index: 2; /* Üstte olacak */
cursor: url('https://cdn-icons-png.flaticon.com/32/686/686308.png'), auto; /* Para ikonu */
touch-action: none; /* Mobilde kaydırmayı engelle */
}

/* Altın Tozu Animasyonu */
@keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
/* --- 👤 YENİ NESİL PROFİL TASARIMI (CYBER STYLE) --- */
.mdm-profile-header-card {
background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
backdrop-filter: blur(10px);
border: 1px solid rgba(255,255,255,0.1);
border-radius: 24px;
padding: 25px;
text-align: center;
position: relative;
overflow: hidden;
box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

/* Arka plan süsleri (Parlamalar) */
.mdm-bg-glow {
position: absolute; width: 150px; height: 150px; border-radius: 50%;
filter: blur(50px); opacity: 0.4; z-index: 0;
}

/* Avatar Alanı */
.mdm-avatar-wrapper {
position: relative;
width: 80px; height: 80px; margin: 0 auto 15px;
z-index: 2;
}
.mdm-avatar-circle {
width: 100%; height: 100%; border-radius: 50%;
display: flex; align-items: center; justify-content: center;
font-size: 32px; font-weight: 800; color: #fff;
box-shadow: 0 5px 15px rgba(0,0,0,0.5);
border: 4px solid rgba(255,255,255,0.1);
position: relative; background: #0f172a;
}
.mdm-rank-badge-icon {
position: absolute; bottom: -5px; right: -5px;
width: 30px; height: 30px; background: #fff; border-radius: 50%;
display: flex; align-items: center; justify-content: center;
font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);
border: 2px solid #0f172a;
}

/* İsim ve XP */
.mdm-user-name { font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 5px; position: relative; z-index: 2; }
.mdm-user-email { font-size: 12px; color: #94a3b8; margin-bottom: 15px; position: relative; z-index: 2; }

/* İstatistik Kutuları */
.mdm-stats-row {
display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;
margin-top: 20px; position: relative; z-index: 2;
}
.mdm-stat-mini {
background: rgba(0,0,0,0.3); border-radius: 12px; padding: 10px 5px;
border: 1px solid rgba(255,255,255,0.05);
}
.mdm-stat-val { font-size: 16px; font-weight: 800; color: #fff; }
.mdm-stat-lbl { font-size: 9px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

/* Level Bar (XP Çubuğu) */
.mdm-xp-container { margin-top: 20px; position: relative; z-index: 2; }
.mdm-xp-bar-bg { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; }
.mdm-xp-bar-fill { height: 100%; border-radius: 10px; transition: width 1s ease-out; box-shadow: 0 0 10px currentColor; }
.mdm-xp-text { display: flex; justify-content: space-between; font-size: 10px; color: #cbd5e1; margin-top: 5px; font-weight: 600; }

/* ====================================================== */
/* 🛠️ MENÜ BUTONLARI (MASAÜSTÜ & MOBİL HİBRİT ÇÖZÜM) 🛠️ */
/* ====================================================== */

/* 1. MASAÜSTÜ (Varsayılan Görünüm) */
.mdm-menu-grid {
display: grid;
grid-template-columns: repeat(2, 1fr); /* Yan yana 2 tane */
gap: 15px;
margin-top: 20px;
width: 100%;
}

.mdm-menu-card {
display: flex;
flex-direction: row; /* İkon solda, yazı sağda */
align-items: center;
justify-content: flex-start; /* Sola yasla */
text-align: left;
padding: 15px;
border-radius: 16px;
cursor: pointer;
transition: all 0.2s;
min-height: 80px; /* Standart yükseklik */
position: relative;
overflow: hidden;
}

.mdm-menu-info {
display: flex;
flex-direction: column;
align-items: flex-start; /* Yazıları sola yasla */
margin-left: 12px;
flex: 1;
}

.mdm-menu-info div:first-child { font-size: 13px; font-weight: 700; color: #fff; }
.mdm-menu-info div:last-child { font-size: 11px; color: #94a3b8; margin-top: 2px; }

/* Masaüstünde Oku Göster */
.mdm-menu-arrow { display: block; font-size: 12px; opacity: 0.7; }

/* ------------------------------------------------------ */

/* 2. MOBİL ÖZEL AYARLARI (768px ve altı) */
@media (max-width: 768px) {
/* Izgarayı biraz sıkılaştır */
.mdm-menu-grid {
gap: 10px !important;
}

/* Kartları Kare Yap (İkon üstte, yazı altta) */
.mdm-menu-card {
flex-direction: column !important;
justify-content: center !important;
align-items: center !important;
text-align: center !important;
padding: 15px 5px !important;
min-height: 100px !important;
}

/* Yazıları ortala */
.mdm-menu-info {
align-items: center !important;
margin-left: 0 !important;
margin-top: 8px !important;
width: 100% !important;
}

.mdm-menu-info div:first-child { font-size: 12px !important; margin-bottom: 2px !important; }
.mdm-menu-info div:last-child { font-size: 10px !important; line-height: 1.2 !important; }

/* Mobilde Oku Gizle (Gereksiz kalabalık) */
.mdm-menu-arrow { display: none !important; }

/* 🔥 ORTAKLIK BUTONU (En alttaki) GENİŞ KALSIN VE YATAY OLSUN */
.mdm-menu-card[onclick*="Affiliate"] {
grid-column: span 2 !important; /* Tam genişlik */
flex-direction: row !important; /* YATAY (Masaüstü gibi) */
justify-content: flex-start !important;
text-align: left !important;
min-height: auto !important;
padding: 15px !important;
margin-top: 5px !important;
}

/* Ortaklık butonu içindeki yazıyı sola yasla */
.mdm-menu-card[onclick*="Affiliate"] .mdm-menu-info {
align-items: flex-start !important;
text-align: left !important;
margin-top: 0 !important;
margin-left: 10px !important;
}

/* Ortaklık butonunda oku göster */
.mdm-menu-card[onclick*="Affiliate"] .mdm-menu-arrow {
display: block !important;
margin-left: auto !important;
}
}

/* Renk Temaları */
.theme-caylak { --color: #10b981; }
.theme-usta { --color: #8b5cf6; }
.theme-sampiyon { --color: #f59e0b; }
.theme-efsane { --color: #ef4444; }
.topic-page .topic-title, 
h1#ph-title {
display: none !important;
}

/* 2. Sayfa Kapsayıcılarının Boşluklarını Sıfırla */
.page.topic-page, 
.page-container, 
.topic-body, 
.topic-content {
padding-top: 0 !important;
padding-bottom: 0 !important;
margin-top: 0 !important;
margin-bottom: 0 !important;
}

/* 3. Mobil İçin Ekstra Yukarı İtme */
@media (max-width: 768px) {
/* Header'a yapıştır */
.page.topic-page {
margin-top: 50px !important; 
}

/* Bizim Widget'ın üst çizgisini kaldır */
#modum-firebase-test-root {
border-top: none !important; 
margin-top: 0 !important;
}
}
@keyframes mdmFadeUp {
from { opacity: 0; transform: translateY(5px); }
to { opacity: 1; transform: translateY(0); }
}
/* --- 🏆 LİDERLER TABLOSU (COMPACT) --- */
.mdm-lb-card {
background: #1e293b; 
border: 1px solid #334155; 
border-radius: 12px; 
padding: 15px; 
margin: 20px 0;
position: relative;
overflow: hidden;
}
.mdm-lb-header {
display: flex; 
justify-content: space-between; 
align-items: center; 
margin-bottom: 10px;
border-bottom: 1px solid rgba(255,255,255,0.1);
padding-bottom: 8px;
}
.mdm-lb-title {
font-size: 14px; 
font-weight: 800; 
color: #fff; 
display: flex; 
align-items: center; 
gap: 6px;
text-transform: uppercase;
letter-spacing: 1px;
}
.mdm-lb-list {
display: flex; 
flex-direction: column; 
gap: 6px;
}
.mdm-lb-row {
display: flex; 
align-items: center; 
justify-content: space-between; 
padding: 8px 10px; 
background: rgba(255,255,255,0.03); 
border-radius: 8px;
font-size: 12px;
transition: 0.2s;
}
.mdm-lb-row:hover {
background: rgba(255,255,255,0.08);
transform: translateX(5px);
}
.mdm-lb-rank {
font-weight: 800; 
width: 25px; 
text-align: center;
}
/* İlk 3 Sıra Renkleri */
.rank-1 { color: #fbbf24; text-shadow: 0 0 10px rgba(251, 191, 36, 0.5); font-size: 14px; } /* Altın */
.rank-2 { color: #94a3b8; font-size: 13px; } /* Gümüş */
.rank-3 { color: #b45309; font-size: 13px; } /* Bronz */

.mdm-lb-user {
flex: 1; 
margin-left: 10px; 
font-weight: 600; 
color: #e2e8f0;
}
.mdm-lb-xp {
font-weight: 800; 
color: #10b981; 
background: rgba(16, 185, 129, 0.1); 
padding: 2px 6px; 
border-radius: 4px;
}
/* Lider Tablosu Avatarı */
.mdm-lb-avatar {
width: 24px; 
height: 24px; 
background: rgba(255,255,255,0.1); 
border-radius: 50%; 
display: flex; 
align-items: center; 
justify-content: center; 
font-size: 14px; 
margin-right: 8px;
border: 1px solid rgba(255,255,255,0.2);
}
/* --- ❓ YARDIM MERKEZİ STİLLERİ --- */
.mdm-help-btn {
background: rgba(255,255,255,0.1); width: 36px; height: 36px; border-radius: 50%;
display: flex; align-items: center; justify-content: center; cursor: pointer;
border: 1px solid rgba(255,255,255,0.2); transition: 0.3s; margin-right: 10px;
animation: mdmPulseWhite 3s infinite;
}
.mdm-help-btn:hover { background: #fff; color: #000; transform: scale(1.1); }

@keyframes mdmPulseWhite {
0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

.mdm-help-layout { display: flex; height: 500px; overflow: hidden; }
.mdm-help-menu { width: 30%; background: rgba(0,0,0,0.2); border-right: 1px solid rgba(255,255,255,0.1); overflow-y: auto; }
.mdm-help-content-area { width: 70%; padding: 25px; overflow-y: auto; background: #1e293b; color: #e2e8f0; font-size: 14px; line-height: 1.6; }

.mdm-help-item {
padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
transition: 0.2s; font-size: 13px; font-weight: 600; color: #94a3b8; display: flex; align-items: center; gap: 8px;
}
.mdm-help-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
.mdm-help-item.active { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border-left: 3px solid #60a5fa; }

/* Mobilde Alt Alta */
@media (max-width: 768px) {
.mdm-help-layout { flex-direction: column; height: 80vh; }
.mdm-help-menu { width: 100%; height: 35%; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
.mdm-help-content-area { width: 100%; height: 65%; }
}
/* --- 🔥 YENİ: HİPER-AKTİF KART STİLLERİ --- */

/* 1. KART ANİMASYONLARI */
@keyframes mdmPulseRed {
0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); border-color: #ef4444; }
70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); border-color: #b91c1c; }
100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); border-color: #ef4444; }
}

@keyframes mdmShine {
100% { left: 125%; }
}

/* 2. ACİL DURUM KARTI (SON 24 SAAT) */
.mdm-card-urgent {
animation: mdmPulseRed 2s infinite;
background: linear-gradient(135deg, #1e293b 0%, #450a0a 100%) !important; /* Hafif Kırmızımsı */
border: 1px solid #ef4444 !important;
}

/* 3. PARLAMA EFEKTİ (MOUSE GELİNCE) */
.mdm-shine-hover {
position: relative;
overflow: hidden;
}
.mdm-shine-hover::after {
content: '';
position: absolute;
top: 0; left: -100%;
width: 50%; height: 100%;
background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
transform: skewX(-25deg);
pointer-events: none;
}
.mdm-shine-hover:hover::after {
animation: mdmShine 0.7s;
}

/* 4. AKILLI ROZETLER */
.mdm-badge-new { background: linear-gradient(135deg, #10b981, #059669); }
.mdm-badge-fire { background: linear-gradient(135deg, #f97316, #ea580c); animation: pulse 1s infinite; }
.mdm-badge-legend { background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 0 10px #8b5cf6; }
.mdm-badge-panic { background: #ef4444; color: #fff; animation: mdmPulseRed 1s infinite; font-weight:900; }

/* 5. ZAMAN ÇUBUĞU */
.mdm-progress-container {
width: 100%; height: 4px; background: #334155; margin-top: auto; position: relative;
}
.mdm-progress-bar {
height: 100%; background: #10b981; transition: width 1s linear;
}
/* Çubuk Renkleri */
.bar-green { background: #10b981; }
.bar-yellow { background: #facc15; }
.bar-red { background: #ef4444; box-shadow: 0 0 10px #ef4444; }

/* 6. SON ŞANS BUTONU */
.btn-panic-mode {
background: #ef4444 !important;
color: white !important;
font-weight: 900 !important;
animation: pulse 1s infinite;
box-shadow: 0 0 15px rgba(239, 68, 68, 0.5) !important;
border: 1px solid #b91c1c !important;
}
/* GİZLİLİK MODALI */
.mdm-privacy-content {
text-align: center; padding: 20px;
}
.mdm-privacy-icon {
font-size: 50px; margin-bottom: 15px; display: block;
}
.mdm-privacy-text {
font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 20px;
}
.mdm-privacy-link {
color: #3b82f6; text-decoration: underline; font-weight: bold;
}
.mdm-btn-approve {
background: #10b981; color: white; border: none; padding: 12px 30px; 
border-radius: 50px; font-weight: bold; cursor: pointer; width: 100%; font-size: 14px;
box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); transition: 0.2s;
}
.mdm-btn-approve:hover { transform: scale(1.05); }
/* --- 🔥 AVATAR ÇERÇEVELERİ (FİXED v3.0 - GEOMETRİ MOTORU) --- */

/* 1. ANA ÇERÇEVE KALIBI (Tüm Çerçevelerin Atası) */
/* Burası en önemli kısım. Bunu doğru yaparsak hepsi düzelir. */
/* 1. ANA ÇERÇEVE KALIBI */
.mdm-avatar-frame {
position: absolute;
inset: -1px;
border-radius: 50%;
pointer-events: none;
z-index: 10;
box-sizing: border-box;
aspect-ratio: 1/1;
display: block;
margin: auto;
background-repeat: no-repeat; /* Tekrar etme */
background-position: center;  /* Ortala */
background-size: cover;       /* Doldur */
}

/* 2. DÖNME ANİMASYONU (Ortak Kullanım) */
@keyframes spinSlow { 
from { transform: rotate(0deg); } 
to { transform: rotate(360deg); } 
}

/* 1. NEON (Klasik Siber) */
.frame-neon {
border: 3px solid #00f3ff;
box-shadow: 0 0 10px #00f3ff, inset 0 0 10px #00f3ff;
animation: pulseNeon 2s infinite;
}
@keyframes pulseNeon {
50% { box-shadow: 0 0 20px #00f3ff, inset 0 0 20px #00f3ff; }
}

/* 2. GOLD (Zengin) */
.frame-gold {
border: 3px solid #fbbf24;
box-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%);
background-size: 200% 200%;
animation: shineGold 3s infinite linear;
}
@keyframes shineGold { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* 3. FIRE (Alev Alev) */
.frame-fire {
border: 3px solid #ef4444;
box-shadow: 0 0 10px #ef4444, 0 -5px 20px #f97316;
animation: burnFire 0.8s infinite alternate;
}
@keyframes burnFire { to { box-shadow: 0 0 20px #ef4444, 0 -8px 25px #f97316; } }

/* 4. ICE (Buzul) */
.frame-ice {
border: 3px solid #e0f2fe;
box-shadow: 0 0 10px #38bdf8, 0 0 20px #0ea5e9;
animation: freezePulse 3s infinite;
}
@keyframes freezePulse { 50% { opacity: 0.7; box-shadow: 0 0 25px #38bdf8; } }

/* 5. NATURE (Doğa/Yaprak) */
.frame-nature {
border: 3px dashed #4ade80;
box-shadow: 0 0 10px #22c55e;
animation: spinSlow 10s linear infinite;
}

/* 6. GLITCH (Siber Hata) */
.frame-glitch {
border: 3px solid #fff;
border-color: #4ade80;
box-shadow: -3px 0 red, 3px 0 blue;
animation: glitchAnim 0.2s infinite;
}
@keyframes glitchAnim {
0% { box-shadow: -2px 0 red, 2px 0 blue; transform: translate(0); }
25% { transform: translate(-1px, 1px); }
50% { box-shadow: 2px 0 red, -2px 0 blue; transform: translate(1px, -1px); }
75% { transform: translate(0); }
100% { transform: translate(0); }
}

/* 7. GALAXY (Uzay) */
.frame-galaxy {
border: 3px solid transparent;
background: linear-gradient(#0f172a, #0f172a) padding-box,
linear-gradient(45deg, #6366f1, #d946ef, #ec4899) border-box;
-webkit-mask: 
linear-gradient(#fff 0 0) padding-box, 
linear-gradient(#fff 0 0);
-webkit-mask-composite: xor;
mask-composite: exclude;
box-shadow: 0 0 15px #6366f1;
}

/* 8. ROYAL (Kraliyet Moru) */
.frame-royal {
border: 4px double #d8b4fe;
box-shadow: 0 0 0 2px #5b21b6, 0 0 15px #7c3aed;
}

/* 9. RAINBOW (Gökkuşağı - Dönen) - DÜZELTİLDİ ✅ */
.frame-rainbow {
border: 4px solid transparent;
border-radius: 50%;
background: conic-gradient(#ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000) border-box;
-webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
-webkit-mask-composite: xor;
mask-composite: exclude;
animation: spinRainbow 2s linear infinite;
}
@keyframes spinRainbow { 100% { transform: rotate(360deg); } }

/* 10. DARK (Karanlık Mod) */
.frame-dark {
border: 3px solid #1e293b;
box-shadow: 0 0 15px #000;
filter: drop-shadow(0 0 5px rgba(0,0,0,0.8));
}
/* 11. ROBOTIC (Mekanik Teknoloji) 🤖 */
.frame-robotic {
border: 3px dashed #00d4ff; /* Kesik çizgili lazer mavisi */
box-shadow: 0 0 10px #00d4ff, inset 0 0 10px rgba(0, 212, 255, 0.3);
background: transparent; /* İçi boş */
border-radius: 50%;
animation: spinSlow 10s linear infinite; /* Sürekli döner */
}

/* 12. ANGEL (Kutsal Işık) 👼 */
.frame-angel {
border: 4px double #fff; /* Çift katmanlı beyaz çizgi */
box-shadow: 0 0 15px #fbbf24, 0 0 30px rgba(251, 191, 36, 0.5); /* Altın hare */
background: transparent; /* İçi boş */
border-radius: 50%;
animation: angelPulse 3s infinite ease-in-out, spinSlow 10s linear infinite; /* Hem nefes alır hem döner */
}

/* Angel için özel nefes alma efekti */
@keyframes angelPulse {
0% { box-shadow: 0 0 15px #fbbf24, 0 0 30px rgba(251, 191, 36, 0.5); transform: scale(1); }
50% { box-shadow: 0 0 25px #fbbf24, 0 0 50px rgba(251, 191, 36, 0.8); transform: scale(1.02); }
100% { box-shadow: 0 0 15px #fbbf24, 0 0 30px rgba(251, 191, 36, 0.5); transform: scale(1); }
}

/* DÖNME EFEKTLERİ İÇİN */
@keyframes spinSlow { 100% { transform: rotate(360deg); } }
/* --- 💄 KOZMETİK MAĞAZASI (PREMIUM SHOP) --- */
.mdm-cosmetic-area {
background: linear-gradient(135deg, #2e1065, #0f172a); /* Koyu Mor Tema */
border-radius: 16px;
padding: 20px;
margin-bottom: 30px;
border: 1px solid #7e22ce;
box-shadow: 0 0 30px rgba(126, 34, 206, 0.2);
text-align: center;
position: relative;
overflow: hidden;
}

/* Arka plan süsü */
.mdm-cosmetic-bg-icon {
position: absolute; top: -20px; right: -20px;
font-size: 100px; opacity: 0.05; color: #d8b4fe; transform: rotate(15deg);
}

.mdm-cosmetic-title {
color: #d8b4fe; font-size: 16px; font-weight: 800; text-transform: uppercase;
letter-spacing: 2px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 10px;
}

/* Çerçeve Vitrini (Yan Yana Kaydırmalı) */
.mdm-frame-showcase {
display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px;
justify-content: center; /* Ortala */
flex-wrap: wrap; /* Mobilde alt alta inebilsin */
}

/* Tekil Çerçeve Kartı */
.mdm-frame-card {
width: 100% !important; /* Grid hücresine tam otursun */
max-width: 110px !important; /* Kartları biraz küçültelim ki 3 tane sığsın */
min-height: 140px !important;
background: rgba(0,0,0,0.3);
border: 1px solid rgba(255,255,255,0.1);
border-radius: 12px;
padding: 15px;
width: 140px;
flex-shrink: 0;
display: flex; flex-direction: column; align-items: center;
transition: 0.3s;
cursor: pointer;
position: relative;
}
.mdm-frame-card:hover {
transform: translateY(-5px);
background: rgba(255,255,255,0.05);
border-color: #a855f7;
}
/* --- MOBİL ÇERÇEVE DÜZENİ (3'lü Grid) --- */
@media (max-width: 768px) {
/* Yatay kaydırmayı iptal et, Grid yap */
.mdm-frame-showcase {
display: grid !important;
grid-template-columns: repeat(3, 1fr) !important; /* Yan yana 3 tane */
gap: 1px !important;
overflow-x: visible !important;
justify-content: center !important;
padding-bottom: 0 !important;
}

/* Kart boyutlarını mobile uydur (Küçült) */
.mdm-frame-card {
width: 100% !important;
max-width: 100% !important;
min-height: 100px !important; /* Yüksekliği azalttık */
padding: 8px 5px !important;
}

/* Avatar önizlemesini küçült */
.mdm-preview-avatar {
width: 45px !important;
height: 45px !important;
font-size: 18px !important;
margin-bottom: 5px !important;
}

/* İsim yazı boyutunu küçült */
.mdm-frame-card > div:nth-child(2) {
font-size: 3px !important;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
max-width: 100%;
}
}
/* 🔥 KÜÇÜLTÜLMÜŞ AVATAR ÖNİZLEME */
.mdm-preview-avatar {
width: 50px; height: 50px; /* 70px'den 50px'e düştü */
background: #1e293b; 
border-radius: 50%;
margin-bottom: 8px; 
position: relative;
display: flex; align-items: center; justify-content: center;
font-size: 20px; /* Emoji boyutu küçüldü */
box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
border: 2px solid rgba(255,255,255,0.05);
}
.mdm-frame-card > div:nth-child(2) {
font-size: 8px !important; /* İsim boyutu */
margin-bottom: 3px !important;
white-space: nowrap; /* İsim tek satır kalsın */
overflow: hidden;
text-overflow: ellipsis;
width: 100%;
}
/* --- ORJİNAL (VARSAYILAN) ÇERÇEVE --- */
.frame-original {
/* Geometri Kuralları (Yumurta olmayı engeller) */
border-radius: 50% !important;       /* Kesinlikle yuvarlak ol */
aspect-ratio: 1/1 !important;        /* En-boy oranını kareye kilitle */
box-sizing: border-box !important;   /* Kenarlıkları boyuta dahil et */

/* Görünüm Ayarları */
border: 2px solid rgba(255, 255, 255, 0.2); /* İnce beyaz çizgi */
box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);     /* Hafif gölge */

/* Konumlandırma (Kaymayı önler) */
display: block;
width: 100%;
height: 100%;
position: absolute;
top: 0; left: 0;
}
/* --- PROFİL KOLEKSİYON IZGARASI (MOBİL DÜZENLEMESİ) --- */
.mdm-collection-grid {
display: grid;
grid-template-columns: repeat(4, 1fr); /* Masaüstü: 4'lü */
gap: 10px;
background: rgba(0,0,0,0.2);
padding: 15px;
border-radius: 16px;
}
@media (max-width: 768px) {
.mdm-collection-grid {
grid-template-columns: repeat(3, 1fr) !important; /* Mobil: 3'lü */
padding: 10px;
gap: 8px;
}
}
/* --- 🎫 SİNEMA BİLETİ TASARIMI --- */
.mdm-real-ticket {
display: flex;
background: #fff;
border-radius: 12px;
overflow: hidden;
margin-bottom: 15px;
position: relative;
box-shadow: 0 4px 15px rgba(0,0,0,0.3);
filter: drop-shadow(0 4px 4px rgba(0,0,0,0.2));
}
/* Sol Taraf (Bilgi) */
.mdm-rt-left {
flex: 1;
background: linear-gradient(135deg, #1e293b, #0f172a);
padding: 15px;
border-right: 2px dashed rgba(255,255,255,0.3);
position: relative;
display: flex;
flex-direction: column;
justify-content: center;
}
/* Sağ Taraf (Koçan/Kod) */
.mdm-rt-right {
width: 90px;
background: #fbbf24;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 10px;
position: relative;
}
/* Yırtılma Efekti (Daireler) */
.mdm-rt-left::after {
content: "";
position: absolute;
top: -10px; right: -10px;
width: 20px; height: 20px;
background: #1e293b; /* Arka plan rengiyle aynı olmalı (Modal BG) */
border-radius: 50%;
}
.mdm-rt-left::before {
content: "";
position: absolute;
bottom: -10px; right: -10px;
width: 20px; height: 20px;
background: #1e293b;
border-radius: 50%;
}
/* --- GÜNCELLENMİŞ INSTAGRAM STİLİ (YATAY ÇERÇEVELİ) --- */
.mdm-insta-card {
display: grid;
/* ESKİSİ: grid-template-columns: 140px 1fr 80px; */
grid-template-columns: 140px 1fr; /* 3. sütunu (80px) kaldırdık */
gap: 15px;
border: 1px solid rgba(255,255,255,0.1); 
border-radius: 20px;
padding: 20px;
margin-bottom: 20px;
position: relative;
transition: background 0.3s ease;
}

/* Ana Kutu (Daha Geniş ve Ferah) */
.mdm-insta-frames { 
display: flex; 
flex-direction: row; 
gap: 15px; /* Araları açtık */
align-items: flex-start; /* Üstten hizala */
border-left: none; 
padding: 20px 10px; /* İç boşluğu artırdık (Kutu büyüdü) */
margin-top: 15px;
margin-bottom: 15px;
width: 100%;
overflow-x: auto; 
white-space: nowrap;
min-height: 110px; /* Yüksekliği sabitledik ki kesilmesin */

/* İsteğe bağlı: Hafif bir arka plan verelim ki "kutu" olduğu belli olsun */
background: rgba(0, 0, 0, 0.15); 
border-radius: 16px;
border: 1px solid rgba(255,255,255,0.05);
}

/* Her Bir Çerçeve Öğesi (İkon + İsim) */
.mdm-frame-wrapper {
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
gap: 8px; /* İkon ile yazı arası boşluk */
cursor: pointer;
min-width: 60px; /* Minimum genişlik */
transition: transform 0.2s;
}

.mdm-frame-wrapper:hover {
transform: translateY(-3px); /* Üzerine gelince hafif zıplasın */
}

/* Çerçeve İsim Yazısı */
.mdm-frame-name {
font-size: 10px;
color: #cbd5e1;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.5px;
text-align: center;
max-width: 70px;
overflow: hidden;
text-overflow: ellipsis;
}

/* İkon Boyutu (Düzeltildi) */
.mdm-mini-frame-icon { 
width: 45px !important; 
height: 45px !important; 
border-radius: 50%; 
background-color: rgba(255,255,255,0.05); 
border: 2px solid rgba(255,255,255,0.2); 
position: relative; 
flex-shrink: 0; 
/* 🔥 Yeni Eklenenler: Resim varsa ortala */
background-position: center;
background-size: cover;
background-repeat: no-repeat;
}

/* Mobilde zaten yataydı ama grid yapısını koruyalım */
@media (max-width: 768px) {
.mdm-insta-card { grid-template-columns: 1fr; text-align: center; }
}

/* 🔥 KAYDIRMA ÖZELLİĞİ BURADA 🔥 */
max-height: 250px;       /* Yükseklik sınırı */
overflow-y: auto;        /* Dikey kaydırma */
}

/* Kaydırma Çubuğu Güzelleştirme */
.mdm-insta-frames::-webkit-scrollbar { width: 4px; }
.mdm-insta-frames::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
.mdm-insta-frames::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }

/* Diğer Ayarlar */
.mdm-insta-avatar-img { 
width: 120px; 
height: 120px; 
aspect-ratio: 1/1; /* 🔥 KİLİT KOD: Asla yumurta olamaz, hep kare/daire kalır */
border-radius: 50%; 
object-fit: cover; 
border: 4px solid #10b981; 
background: transparent; 
margin: 0 auto; /* Mobilde ortalama garantisi */
display: block;
}
.mdm-insta-info { display: flex; flex-direction: column; justify-content: center; }
.mdm-insta-username { font-size: 22px; font-weight: 800; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
.mdm-insta-bio { font-size: 12px; color: #e2e8f0; margin: 10px 0; line-height: 1.4; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
.mdm-insta-stats { display: flex; gap: 20px; margin-bottom: 10px; }
.mdm-stat-item { text-align: center; }
.mdm-stat-num { font-size: 16px; font-weight: 800; color: #fff; display:block; text-shadow: 0 1px 3px rgba(0,0,0,0.5); }
.mdm-stat-label { font-size: 10px; color: #cbd5e1; }
.mdm-mini-frame-icon { width: 45px !important; height: 45px !important; border-radius: 50%; background-color: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); cursor: pointer; position: relative; flex-shrink: 0; background-position: center; background-size: cover; background-repeat: no-repeat; }

/* MOBİL */
@media (max-width: 768px) {
.mdm-insta-card { grid-template-columns: 1fr; text-align: center; }
.mdm-insta-frames { flex-direction: row; border-left: none; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; width: 100%; overflow-x: auto; max-height: none; }
.mdm-insta-avatar-area { margin: 0 auto; }
.mdm-insta-header { justify-content: center; flex-direction: column; }
.mdm-insta-stats { justify-content: center; }
}
/* --- 🔘 PROFİL BUTON GRUBU AYARLARI (RESPONSIVE) --- */

/* Ortak Ayarlar */
.mdm-profile-actions {
display: flex;
gap: 10px;
align-items: center;
}

@media (max-width: 768px) {
.mdm-profile-actions {
justify-content: center; /* Ortala */
margin-top: 10px;
margin-bottom: 10px;
width: 100%;
display: flex;          /* Esnek kutu olduğundan emin olalım */
flex-wrap: wrap !important; /* 🔥 SIĞMAYANI AŞAĞI AT */
gap: 5px !important;    /* Butonlar birbirine yapışmasın */
}

/* Butonların boyutunu mobilde ayarlayalım ki taşmasın */
.mdm-profile-actions button {
flex: 1 1 auto !important; /* Gerektiği kadar genişle */
min-width: 40% !important; /* En az %40 yer kapla (yan yana 2 tane sığar) */
font-size: 11px !important; /* Yazı biraz küçülsün */
white-space: nowrap;       /* Yazı alt satıra kaymasın */
}
}

/* 💻 MASAÜSTÜ GÖRÜNÜM (Geniş Ekran) */
@media (min-width: 769px) {
.mdm-profile-actions {
/* Burayı istediğin gibi oynayabilirsin */
justify-content: flex-start; /* Sola yasla (İsim altına) */
margin-top: 15px;            /* İsimden biraz uzaklaşsın */
margin-left: 0px;            /* Soldan boşluk */

/* Alternatif: Sağa yaslamak istersen 'flex-start' yerine 'flex-end' yaz */
/* Alternatif 2: Eğer butonları büyütmek istersen: transform: scale(1.1); */
}
}
/* --- 📇 DİJİTAL KARTVİZİT (FLIP CARD) EFEKTLERİ --- */
.mdm-flip-scene {
perspective: 1000px; /* 3D derinlik hissi */
}
.mdm-flip-wrapper {
transition: transform 0.8s;
transform-style: preserve-3d;
position: relative;
}
.mdm-flip-wrapper.is-flipped {
transform: rotateY(180deg);
}
/* Ön ve Arka Yüzün Ortak Özellikleri */
.mdm-flip-face-front, .mdm-flip-face-back {
backface-visibility: hidden; /* Arkası dönükken gizle */
-webkit-backface-visibility: hidden;
}
/* Ön Yüz (Mevcut Profil) */
.mdm-flip-face-front {
z-index: 2;
transform: rotateY(0deg);
}
/* Arka Yüz (QR Kod) - Başlangıçta gizli ve ters */
.mdm-flip-face-back {
position: absolute;
top: 0; left: 0; width: 100%; height: 100%;
transform: rotateY(180deg);
border-radius: 20px;
display: flex; flex-direction: column; align-items: center; justify-content: center;
background: #0f172a; /* Arka plan rengi */
border: 1px solid rgba(255,255,255,0.1);
box-shadow: 0 0 20px rgba(0,0,0,0.5);
z-index: 1;
}
/* ====================================================== */
/* ⚓ HİBRİT MENÜ (DOCK) - İKON VE YAZI MANTIĞI ⚓ */
/* ====================================================== */

/* 1. ANA KAPSAYICI (Dock) */
.mdm-dock-nav {
display: flex;
align-items: center;
justify-content: center;
gap: 1px; 
background: rgba(30, 41, 59, 0.9); /* Koyu Lacivert */
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.15);
padding: 10px 20px;
border-radius: 20px;
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
z-index: 9999;

/* Ortala ve Sabitle */
width: fit-content;
margin: 20px auto; /* Masaüstünde yukarıdan boşluk */
position: relative;
}

/* 2. LİNKLER (Butonlar) - Varsayılan: KAPALI */
.mdm-dock-link {
display: flex;
align-items: center;
justify-content: flex-start; /* Sola yasla ki yazı çıkınca kaymasın */

width: 45px; /* Sadece İkon Genişliği */
height: 45px;
border-radius: 12px;

background: transparent;
color: #94a3b8; /* Pasif Rengi (Gri) */
text-decoration: none;

overflow: hidden; /* Taşan yazıyı gizle */
cursor: pointer;
position: relative;

/* 🔥 YUMUŞAK GEÇİŞ */
transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1), background 0.3s, color 0.3s;
}

/* 3. İKON AYARLARI (Sabit Genişlik) */
.mdm-dock-icon {
font-size: 20px;
min-width: 45px; /* İkon alanı ASLA küçülmez */
height: 45px;
display: flex;
align-items: center;
justify-content: center;
}

/* 4. METİN (Gizli Başlar) */
.mdm-dock-text {
font-size: 13px;
font-weight: 700;
opacity: 0; /* Görünmez */
white-space: nowrap;
transform: translateX(20px); /* Sağdan gelsin */
transition: all 0.3s ease;
padding-right: 15px;
}

/* ====================================================== */
/* 💻 MASAÜSTÜ DAVRANIŞI (HOVER İLE AÇILIR) */
/* ====================================================== */
@media (min-width: 769px) {
/* Sadece üzerine gelince genişle */
.mdm-dock-link:hover {
width: 140px; /* Genişle */
background: rgba(255, 255, 255, 0.1);
color: #fff;
}

/* Üzerine gelince yazıyı göster */
.mdm-dock-link:hover .mdm-dock-text {
opacity: 1;
transform: translateX(0);
}

/* Aktif olsa bile (seçili olsa bile) mouse üstünde değilse kapalı dursun */
.mdm-dock-link.active {
width: 140px !important; /* 45px yerine 140px yaptık */
background: rgba(139, 92, 246, 0.2) !important;
color: #fff !important;
}

/* Aktif olanın YAZISI GÖRÜNSÜN */
.mdm-dock-link.active .mdm-dock-text {
opacity: 1 !important;
transform: translateX(0) !important;
display: block !important;
}
}

/* ====================================================== */
/* 📱 MOBİL DAVRANIŞI (TIKLAYINCA AÇILIR) */
/* ====================================================== */
@media (max-width: 768px) {
.mdm-dock-nav {
position: fixed;
bottom: 20px;
top: auto;
left: 50%;
transform: translateX(-50%);
width: 90%;
max-width: 400px;
margin: 0;
justify-content: space-between;
padding: 10px 1px;
}

/* Mobilde Hover iptal (Dokunmatik hatasını önler) */
.mdm-dock-link:hover {
width: 45px; 
}

/* SADECE AKTİF OLAN GENİŞLESİN */
.mdm-dock-link.active {
width: 130px !important; /* Genişle */
background: rgba(255, 255, 255, 0.15);
color: #fff;
box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.mdm-dock-link.active .mdm-dock-text {
opacity: 1;
transform: translateX(0);
}

/* Pasif olanlar küçük kalsın */
.mdm-dock-link:not(.active) {
width: 45px !important;
}
}

/* RENKLENDİRME (Her butonun aktif/hover rengi) */
.mdm-dock-link[data-id="home"].active, .mdm-dock-link[data-id="home"]:hover { color: #a78bfa; }
.mdm-dock-link[data-id="tasks"].active, .mdm-dock-link[data-id="tasks"]:hover { color: #facc15; }
.mdm-dock-link[data-id="store"].active, .mdm-dock-link[data-id="store"]:hover { color: #34d399; }
.mdm-dock-link[data-id="support"].active, .mdm-dock-link[data-id="support"]:hover { color: #60a5fa; }
.mdm-dock-link[data-id="profile"].active, .mdm-dock-link[data-id="profile"]:hover { color: #f472b6; }
/* ================================================================== */
/* 🔥 FİNAL ÜST BAR (TOPBAR) TASARIMI - TEMİZ VE ÇAKIŞMASIZ 🔥 */
/* ================================================================== */

/* 1. ANA ÇERÇEVE (Ortak Ayarlar) */
.mdm-topbar { 
display: flex !important; 
justify-content: space-between !important; 
align-items: center !important; 
width: 100% !important;
background: rgba(15, 23, 42, 0.95) !important; /* Koyu Zemin */
backdrop-filter: blur(12px) !important; 
border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important; 
position: sticky !important; 
top: 0 !important; 
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3) !important;
}

/* 2. LOGO TASARIMI (Ortak) */
.mdm-logo { 
font-weight: 900 !important; 
color: #fff !important; 
display: flex !important; 
align-items: center !important; 
font-family: 'Outfit', sans-serif !important;
} 

.mdm-logo span { 
background: linear-gradient(135deg, #8b5cf6, #f472b6) !important; 
-webkit-background-clip: text !important; 
-webkit-text-fill-color: transparent !important; 
font-weight: 800 !important;
text-transform: uppercase !important;
border: 1px solid rgba(139, 92, 246, 0.3) !important; 
background-color: rgba(139, 92, 246, 0.1) !important; 
border-radius: 6px !important; 
}

/* 3. SAĞ TARAF GRUBU (Kapsayıcı) */
.mdm-header-right {
display: flex !important;
}

/* 4. YARDIM VE XP BUTONLARI (Ortak) */
.mdm-help-btn-pill, .mdm-xp-pill {
cursor: pointer !important;
display: flex !important;
align-items: center !important;
justify-content: center !important;
}

.mdm-help-btn-pill {
background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
color: #fff !important;
border: none !important;
border-radius: 50px !important;
font-weight: 700 !important;
box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3) !important;
white-space: nowrap !important;
}
.mdm-help-btn-pill span { display: inline-block !important; }

/* ------------------------------------------------------------------ */
/* 💻 MASAÜSTÜ ÖZEL AYARLAR (Geniş Ekran) */
/* ------------------------------------------------------------------ */
@media (min-width: 769px) {
.mdm-topbar {
height: 80px !important; 
padding: 0 40px !important;
}

.mdm-logo {
font-size: 24px !important; 
gap: 10px !important;
}
.mdm-logo span {
font-size: 12px !important; 
padding: 4px 10px !important;
letter-spacing: 2px !important;
}

/* Masaüstünde YAN YANA Diz */
.mdm-header-right {
flex-direction: row !important;
align-items: center !important;
gap: 20px !important;
}

/* Buton Boyutları */
.mdm-help-btn-pill {
padding: 8px 25px !important;
font-size: 13px !important;
}
.mdm-xp-pill {
background: rgba(255, 255, 255, 0.05) !important; 
border: 1px solid rgba(255, 255, 255, 0.1) !important; 
padding: 8px 16px !important; 
border-radius: 50px !important; 
gap: 8px !important;
}
}

/* ------------------------------------------------------------------ */
/* 📱 MOBİL ÖZEL AYARLAR (Senin Sevdiğin Düzen) */
/* ------------------------------------------------------------------ */
@media (max-width: 768px) {
.mdm-topbar {
height: 100px !important; 
padding: 10px 15px !important;
}

.mdm-logo {
font-size: 18px !important; /* Küçüldü */
gap: 5px !important;
}
.mdm-logo span {
font-size: 9px !important; /* Küçüldü */
padding: 2px 5px !important;
letter-spacing: 1px !important;
}

/* Mobilde ALT ALTA ve SAĞA YASLI Diz */
.mdm-header-right {
flex-direction: column !important; 
align-items: flex-end !important;
justify-content: center !important;
gap: 5px !important;
}

/* Buton Boyutları (Mobil) */
.mdm-help-btn-pill {
padding: 4px 12px !important;
font-size: 10px !important;
}
.mdm-xp-pill {
background: rgba(255,255,255,0.1) !important; 
border: 1px solid rgba(255,255,255,0.2) !important; 
padding: 4px 10px !important; 
border-radius: 50px !important; 
gap: 6px !important; 
}
#nav-live-xp { font-size: 11px !important; }
}
/* --- 🎫 BİLET CÜZDANI DÜZENLEMELERİ --- */

/* 1. Scroll (Kaydırma) Sorunu Çözümü */
#mdm-ticket-list {
overflow-y: auto !important; /* Dikey kaydırmayı aç */
max-height: 60vh !important; /* Yüksekliği sınırla */
padding-right: 5px; /* Kaydırma çubuğu için boşluk */
padding-bottom: 20px;
}

/* Scroll çubuğu güzelleştirme */
#mdm-ticket-list::-webkit-scrollbar { width: 6px; }
#mdm-ticket-list::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }

/* 2. Kazanan Altın Bilet Tasarımı */
.mdm-real-ticket.winner-ticket {
background: linear-gradient(135deg, #FFD700, #FFA500) !important; /* Altın Gradyan */
border: 2px solid #fff !important;
box-shadow: 0 0 20px rgba(255, 215, 0, 0.6) !important;
transform: scale(1.02);
margin-bottom: 20px;
}

.mdm-real-ticket.winner-ticket .mdm-rt-left {
background: transparent !important; /* Arkaplanı temizle, altın görünsün */
color: #78350f !important; /* Kahverengi yazı */
border-right: 2px dashed rgba(255,255,255,0.5) !important;
}

.mdm-real-ticket.winner-ticket .mdm-ticket-status {
background: #fff;
color: #d97706;
padding: 4px 10px;
border-radius: 20px;
font-weight: 900;
font-size: 10px;
display: inline-block;
margin-bottom: 5px;
box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.mdm-real-ticket.winner-ticket .mdm-rt-title {
color: #451a03 !important; /* Koyu yazı */
text-shadow: 0 1px 0 rgba(255,255,255,0.4);
}

/* 3. Story Paylaş Butonu (Instagram Renkleri) */
.btn-story-share {
background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); 
color: white !important;
border: none !important;
padding: 8px 15px !important;
border-radius: 50px !important;
font-weight: bold !important;
font-size: 11px !important;
cursor: pointer !important;
display: flex;
align-items: center;
gap: 5px;
box-shadow: 0 4px 15px rgba(220, 39, 67, 0.4) !important;
margin-top: 10px;
transition: transform 0.2s;
width: fit-content;
}
.btn-story-share:hover {
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(220, 39, 67, 0.6) !important;
}

/* Modaldaki Bilgi Metni */
.mdm-story-info-text {
font-size: 13px;
color: #cbd5e1;
line-height: 1.6;
background: rgba(255,255,255,0.05);
padding: 15px;
border-radius: 12px;
border: 1px dashed #6366f1;
margin-bottom: 20px;
}
`;

  // ======================================================
  // 3. BAŞLATICI VE VERİ ÇEKME
  // ======================================================
  function init(root) {
    // 🔥 MOBİL SCROLL FİX: Sayfa açılınca zorla en üste git
    try {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0; // Safari için
      document.documentElement.scrollTop = 0; // Diğerleri için
    } catch (e) {}
    // --- 📱 PWA: OTOMATİK LOGO ÜRETİCİ & META ENJEKSİYONU ---
    // Bu kod, dosya yüklemeden "MODUMNET" yazılı özel bir ikon oluşturur.

    var iconURL = "";
    try {
      // 1. Sanal bir tuval (Canvas) oluştur
      var canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      var ctx = canvas.getContext("2d");

      // 2. Arka Planı BEYAZ yap
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 512, 512);

      // 3. Ortaya "MODUMNET" yaz (SİYAH)
      ctx.fillStyle = "#000000";
      ctx.font = "bold 65px sans-serif"; // Yazı boyutu
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Yazıyı tam ortaya yerleştir
      // (Logoyu biraz yukarı almak istersen 256 değerini azalt)
      ctx.fillText("MODUMNET", 256, 256);

      // 4. Resmi Kod'a Dönüştür (Data URI)
      iconURL = canvas.toDataURL("image/png");
    } catch (e) {
      // Hata olursa varsayılan bir link kullan (Yedek)
      iconURL = "https://www.modum.tr/i/m/001/0013355.png";
    }

    var metaHTML = `
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">

<meta name="apple-mobile-web-app-title" content="ModumNet">
<meta name="application-name" content="ModumNet">

<meta name="theme-color" content="#0f172a">
<meta name="msapplication-navbutton-color" content="#0f172a">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<link rel="apple-touch-icon" href="${iconURL}">
<link rel="apple-touch-icon" sizes="152x152" href="${iconURL}">
<link rel="apple-touch-icon" sizes="180x180" href="${iconURL}">
<link rel="icon" sizes="192x192" href="${iconURL}">
<link rel="shortcut icon" href="${iconURL}">

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
`;
    document.head.insertAdjacentHTML("beforeend", metaHTML);
    // --- 🔥 YENİ: REFERANS KODU YAKALAYICI ---
    // Linkte ?ref=VARSA bunu yakala ve kaydet
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");
    if (refCode) {
      console.log("Referans ile gelindi:", refCode);
      localStorage.setItem("pending_ref_code", refCode);
    }

    // ... eski kodlar devam ediyor ...
    var styleTag = document.createElement("style");
    styleTag.innerHTML = cssKodlari;
    root.appendChild(styleTag);

    // Cache Yükle
    APP_STATE.user = JSON.parse(localStorage.getItem("mdm_user_cache")) || {
      email: null,
      name: "Misafir",
      puan: 0,
      seviye: "Çaylak",
    };

    renderApp(root);
    updateDataInBackground(root);
    setTimeout(() => {
      ModumApp.initSurpriseSystem();
    }, 2000);
  }

  // --- VERİ ÇEKME (SERİ SORUNU %100 FİXLENDİ) ---
  async function updateDataInBackground() {
    var user = await detectUser();

    if (user && user.email) {
      APP_STATE.user = user;
      ModumApp.logAction("SİTE_GİRİŞİ", "Müşteri siteyi ziyaret etti.");

      // --- 🔥 YENİ: SAĞ ÜST AVATAR GÜNCELLEME ---
      var navAvatar = document.getElementById("nav-avatar");
      var navName = document.getElementById("nav-user-name");
      var topBarXP = document.getElementById("nav-live-xp");
      if (topBarXP) {
        // Eğer puan undefined ise 0 göster
        var pVal = parseInt(APP_STATE.user.puan) || 0;
        topBarXP.innerText = pVal.toLocaleString() + " XP";
      }

      // 1. Varsayılan (Baş Harf)
      var displayContent = (user.name || "M").charAt(0).toUpperCase();
      var isEmoji = false;

      // 2. Seçili Rozet Var mı Kontrol Et
      var BADGES_ICONS = {
        gorev_adami: "🎯",
        gece_kusu: "👾",
        takim_lideri: "🤝",
        sepet_krali: "🛍️",
        alev_alev: "🔥",
        hazine_avcisi: "🕵️",
        sans_melegi: "🍀",
        bonkor: "🎁",
        lvl_caylak: "🌱",
        lvl_usta: "⚔️",
        lvl_sampiyon: "🦁",
        lvl_efsane: "🐉",
      };

      if (user.selectedAvatar && BADGES_ICONS[user.selectedAvatar]) {
        displayContent = BADGES_ICONS[user.selectedAvatar];
        isEmoji = true;
      }

      // 3. Ekrana Bas (Stil Ayarı ile)
      if (navAvatar) {
        navAvatar.innerHTML = displayContent;
        if (isEmoji) {
          // Emoji ise büyüt ve arkaplanı şeffaf yap
          navAvatar.style.fontSize = "24px";
          navAvatar.style.background = "transparent";
          navAvatar.style.border = "none";
          navAvatar.style.lineHeight = "1";
        } else {
          // Harf ise standart stil (Mor Yuvarlak)
          navAvatar.style.fontSize = "12px";
          navAvatar.style.background =
            "linear-gradient(135deg, #8b5cf6, #6d28d9)";
          navAvatar.style.border = "none";
        }
      }

      // İsmi güncelle (Mevcut kod)
      if (navName) navName.innerText = user.name;

      // --- GÜÇLENDİRİLMİŞ AYAR ÇEKİCİ (TEK PARÇA) ---
      fetchApi("get_settings").then((res) => {
        if (res && res.settings) {
          // 1. AYARLARI GLOBAL DEĞİŞKENE KAYDET (Kritik Nokta)
          // Artık renderProfileTab fonksiyonu limitleri buradan okuyacak.
          window.APP_STATE.settings = res.settings;

          // 2. TEMA MOTORUNU ÇALIŞTIR
          if (res.settings.active_theme) {
            var currentGlobal = localStorage.getItem("mdm_active_theme");
            // Eğer tema değişmişse veya hiç yoksa uygula
            if (currentGlobal !== res.settings.active_theme) {
              applyThemeEngine(res.settings.active_theme);
              localStorage.setItem(
                "mdm_active_theme",
                res.settings.active_theme,
              );
            }
          }

          // 3. EKRANI ANINDA GÜNCELLE (Profil açıksa yeni limitleri görsün)
          if (APP_STATE.activeTab === "profile") {
            var profileContainer = document.getElementById(
              "mdm-profile-container",
            );
            if (profileContainer) {
              profileContainer.innerHTML = renderProfileTab(APP_STATE.user);
            }
          }
        }
      });

      // Veritabanından Taze Bilgi Çek
      fetchApi("get_user_details", { email: user.email }).then((res) => {
        if (res && res.success) {
          var p1 = parseInt(res.user.puan) || 0;
          APP_STATE.user.puan = p1;
          APP_STATE.user.seviye = res.user.seviye;

          // Tarih
          APP_STATE.user.songunlukhaktarihi =
            res.user.songunlukhaktarihi || res.user.sonGiris || "";

          // 🔥 İŞTE ÇÖZÜM BURADA: Hem "gunlukSeri" hem "gunlukseri" kontrolü
          // Veritabanında küçük harfle yazılmışsa onu da yakalar.
          var gelenSeri = res.user.gunlukSeri || res.user.gunlukseri || 0;
          APP_STATE.user.gunlukSeri = parseInt(gelenSeri);

          if (res.user.privacyApproved === true) {
            APP_STATE.user.privacyApproved = true;
          }
          // 🌟 EKLENECEK KISIM (BURASI EKSİKTİ)
          APP_STATE.user.ownedFrames = res.user.ownedFrames || [];
          APP_STATE.user.ownedAvatars = res.user.ownedAvatars || [];
          APP_STATE.user.selectedFrame = res.user.selectedFrame || "";
          if (res.user.profileTheme) {
            APP_STATE.user.profileTheme = res.user.profileTheme;
          }
          // Cache'i Güncelle
          localStorage.setItem(
            "mdm_user_cache",
            JSON.stringify(APP_STATE.user),
          );

          // EKRANDAKİ ÇUBUKLARI BOYA
          var streakDiv = document.getElementById("mdm-streak-container");
          if (streakDiv) {
            streakDiv.innerHTML = renderStreakBars(APP_STATE.user.gunlukSeri);
          }
          if (APP_STATE.activeTab === "profile") {
            var profileContainer = document.getElementById(
              "mdm-profile-container",
            );
            // renderProfileTab fonksiyonunun varlığını kontrol et ve çalıştır
            if (profileContainer && typeof renderProfileTab === "function") {
              profileContainer.innerHTML = renderProfileTab(APP_STATE.user);
            }
          }
        }
      });

      var profileContainer = document.getElementById("mdm-profile-container");
      if (profileContainer)
        profileContainer.innerHTML = renderProfileTab(APP_STATE.user);

      fetchApi("get_user_tickets", { email: user.email }).then((ticketRes) => {
        if (ticketRes && ticketRes.success) {
          APP_STATE.myRaffles = ticketRes.list.map((t) => t.raffleName.trim());
          var activeGrid = document.getElementById("mdm-active-grid");
          if (activeGrid)
            activeGrid.innerHTML = renderRaffles(APP_STATE.activeRaffles, true);
        }
      });
    }

    // Diğer Veriler
    try {
      var pShowcase = fetchApi("get_showcase_data");
      var pSystem = fetchApi("get_system_data");
      var [newShowcase, newSys] = await Promise.all([pShowcase, pSystem]);

      if (newShowcase && newShowcase.success) {
        APP_STATE.activeRaffles = newShowcase.active || [];
        APP_STATE.completedRaffles = newShowcase.completed || [];

        // Aktifleri normal bas
        var aGrid = document.getElementById("mdm-active-grid");
        if (aGrid)
          aGrid.innerHTML = renderRaffles(APP_STATE.activeRaffles, true);

        // --- 🔥 SONUÇLANANLAR: 6'LI LİMİT SİSTEMİ ---
        var cGrid = document.getElementById("mdm-completed-grid");
        var loadBox = document.getElementById("mdm-load-more-box");

        if (cGrid) {
          // Sadece ilk 6 taneyi render et
          cGrid.innerHTML = renderRaffles(
            APP_STATE.completedRaffles.slice(0, 6),
            false,
          );

          // Eğer liste 6'dan uzunsa butonu göster
          if (loadBox) {
            if (APP_STATE.completedRaffles.length > 6) {
              loadBox.innerHTML =
                '<button onclick="ModumApp.loadMoreCompleted()" class="mdm-btn-v2 btn-detail-v2" style="width:auto; padding:8px 30px; margin:0 auto; display:block; background:#334155;">DAHA FAZLA YÜKLE <i class="fas fa-chevron-down"></i></button>';
            } else {
              loadBox.innerHTML = ""; // Gerek yoksa butonu sil
            }
          }
        }
      }

      if (newSys && newSys.data) {
        APP_STATE.pool = newSys.data.legendPool || 0;
        var pDiv = document.getElementById("mdm-pool-val");
        if (pDiv)
          pDiv.innerText = APP_STATE.pool.toLocaleString("tr-TR") + " ₺";
      }
    } catch (e) {}

    if (typeof loadTasksData === "function") loadTasksData();
    startTimer();
    findCartTaskID();
    // --- 🏆 LİDERLER TABLOSU (GÜVENLİ VE AVATARLI + ÇERÇEVELİ VERSİYON) ---
    fetchApi("get_masked_leaderboard")
      .then((res) => {
        // Konsola bilgi verelim
        // console.log("Liderler Tablosu Verisi:", res);

        var lbContainer = document.getElementById("mdm-leaderboard-area");

        // Veri var mı ve Kutu yerinde mi kontrolü
        if (
          res &&
          res.success &&
          res.list &&
          res.list.length > 0 &&
          lbContainer
        ) {
          // Rozet İkonları
          var BADGES_ICONS = {
            gorev_adami: "🎯",
            gece_kusu: "👾",
            takim_lideri: "🤝",
            sepet_krali: "🛍️",
            alev_alev: "🔥",
            hazine_avcisi: "🕵️",
            sans_melegi: "🍀",
            bonkor: "🎁",
            lvl_caylak: "🌱",
            lvl_usta: "⚔️",
            lvl_sampiyon: "🦁",
            lvl_efsane: "🐉",
          };

          var rowsHtml = "";

          // Listeyi döngüye al
          for (var i = 0; i < res.list.length; i++) {
            var u = res.list[i];
            var index = i;

            var rankClass = "rank-" + (index + 1);
            var icon = index + 1 + ".";
            if (index === 0) icon = "👑";
            if (index === 1) icon = "🥈";
            if (index === 2) icon = "🥉";

            // AVATAR BELİRLEME (GÜNCELLENMİŞ)
            var userName = u.name || "Gizli";
            var userAvatar = "🌱"; // Varsayılan
            var avatarStyle =
              "background:transparent; border:none; font-size:18px;";

            var uThemeID = u.theme || "default";
            var uThemeData =
              PROFILE_THEMES[uThemeID] || PROFILE_THEMES["default"];
            var rowStyle = `background: ${uThemeData.bg}; border: 1px solid ${uThemeData.border}; box-shadow: 0 0 10px ${uThemeData.glow}40; transition:0.2s;`;

            // 🔥 1. KONTROL: RESİM LİNKİ VARSA (Anime/Profil Resmi)
            if (
              u.avatar &&
              (u.avatar.indexOf("http") > -1 ||
                u.avatar.indexOf("data:image") > -1)
            ) {
              userAvatar = `<img src="${u.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; display:block;">`;
              // Resim olduğu için padding ve border'ı sıfırlıyoruz ki tam otursun
              avatarStyle = "padding:0; background:transparent; border:none;";
            }
            // 2. KONTROL: EMOJİ ROZET VARSA
            else if (u.avatar && BADGES_ICONS[u.avatar]) {
              userAvatar = BADGES_ICONS[u.avatar];
              avatarStyle =
                "background:transparent; border:none; font-size:17px;";
            }
            // 3. KONTROL: HİÇBİRİ YOKSA RÜTBEYE BAK
            else {
              if (u.level === "Usta") userAvatar = "⚔️";
              else if (u.level === "Şampiyon") userAvatar = "🦁";
              else if (u.level === "Efsane") userAvatar = "🐉";
              else userAvatar = "🌱"; // Çaylak
            }

            var safeXP = u.points ? parseInt(u.points).toLocaleString() : "0";

            // 🔥 ÇERÇEVE HTML OLUŞTURMA (BURASI YENİ) 🔥
            // ... (u.level ve rankClass tanımlamalarından sonra) ...

            // Rütbeye göre renk belirle
            var rankColor = "#10b981"; // Varsayılan Yeşil (Çaylak)
            if (u.level === "Usta") rankColor = "#8b5cf6"; // Mor
            if (u.level === "Şampiyon") rankColor = "#f59e0b"; // Sarı
            if (u.level === "Efsane") rankColor = "#ef4444"; // Kırmızı

            // Çerçeve Mantığı:
            var userFrame = u.frame || "";
            var frameDiv = "";
            var borderStyle = "";

            if (userFrame) {
              if (userFrame.includes("http")) {
                // Linkli Çerçeve
                frameDiv = `<div class="mdm-avatar-frame" style="top:-3px; left:-3px; right:-3px; bottom:-3px; border:none; background-image: url('${userFrame}'); background-size: cover;"></div>`;
              } else {
                // CSS Çerçeve
                frameDiv = `<div class="mdm-avatar-frame ${userFrame}" style="top:-3px; left:-3px; right:-3px; bottom:-3px; border-width:2px;"></div>`;
              }
              borderStyle = "border: 2px solid transparent;";
            } else {
              // Özel çerçeve YOKSA, rütbe renginde border koy
              borderStyle = `border: 2px solid ${rankColor}; box-shadow: 0 0 5px ${rankColor};`;
            }

            // Avatar stiline borderStyle ekle
            avatarStyle += ` position: relative; overflow: visible; ${borderStyle} border-radius: 50%;`;

            rowsHtml += `
<div class="mdm-lb-row" style="${rowStyle}"> 
<div class="mdm-lb-rank ${rankClass}">${icon}</div>

<div class="mdm-lb-user" style="display:flex; align-items:center;">
<div class="mdm-lb-avatar" style="${avatarStyle}">
${frameDiv} 
${userAvatar}
  </div>            

<div>
${userName} 
<span style="font-size:10px; color:#e2e8f0; font-weight:normal; margin-left:5px; opacity:0.8;">(${
              u.level || "Çaylak"
            })</span>
  </div>
  </div>

<div class="mdm-lb-xp" style="background:rgba(0,0,0,0.3); color:#fff;">${safeXP} XP</div>
  </div>
`;
          }

          // HTML'i Bas
          lbContainer.innerHTML = `
<div class="mdm-lb-card">
<div class="mdm-lb-header">
<div class="mdm-lb-title"><i class="fas fa-trophy" style="color:#fbbf24;"></i> Zirvedekiler (Top 5)</div>
<div style="font-size:8px; color:#94a3b8;">Canlı Puan Durumu</div>
  </div>
<div class="mdm-lb-list">
${rowsHtml}
  </div>
  </div>
`;
        }
      })
      .catch((err) => console.log("Tablo Hatası:", err));
  }
  // Destek bildirimlerini arka planda kontrol et
  if (window.ModumApp && window.ModumApp.loadSupportHistory) {
    ModumApp.loadSupportHistory(true); // true = sessiz mod (sadece nokta kontrolü)
  }
  // --- API İLETİŞİMİ (AKILLI CACHE SİSTEMİ - TASARRUF MODU 💰) ---
  // Bu fonksiyon, sık kullanılan verileri tarayıcı hafızasına (LocalStorage) kaydeder.
  // Böylece her sayfa yenilemede sunucuya para ödemezsin.
  async function fetchApi(action, payload = {}) {
    // 1. Önbelleklenecek (Hafızaya Atılacak) İşlemler Listesi
    // Sadece "Okuma" yapan ve anlık değişmesi çok kritik olmayanlar buraya.
    const cacheableActions = [
      "get_showcase_data", // Vitrin (En çok bu çağrılır)
      "get_system_data", // Havuz tutarı
      "get_products", // Ürün listesi
      "get_tasks", // Görevler
      "get_store_items", // Mağaza ürünleri
    ];

    // Cache Süresi: 5 Dakika (300.000 ms)
    // Kullanıcı 5 dakika içinde sayfayı yenilerse sunucuya gitmez, cepten yer.
    const CACHE_DURATION = 5 * 60 * 1000;

    // Cache Anahtarı Oluştur (Örn: mdm_cache_get_showcase_data)
    // Eğer kişiye özel bir veri ise (örn: email varsa) anahtara onu da ekle.
    let cacheKey = "mdm_cache_" + action;
    if (payload.email) cacheKey += "_" + payload.email;

    // 2. Önbellek Kontrolü (Önce cebe bak)
    if (cacheableActions.includes(action)) {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        try {
          const cached = JSON.parse(cachedRaw);
          const now = new Date().getTime();

          // Eğer veri bayatlamamışsa (süresi dolmamışsa)
          if (now - cached.timestamp < CACHE_DURATION) {
            // Konsola yazalım ki çalıştığını gör (Sadece sen görürsün)
            // console.log("⚡ Veri hafızadan okundu (Maliyet: 0₺):", action);
            return cached.data; // API'ye gitmeden veriyi dön!
          }
        } catch (e) {
          // Veri bozuksa sil, yenisini çekeriz
          localStorage.removeItem(cacheKey);
        }
      }
    }
    window.fetchApi = fetchApi;

    // 3. API İsteği (Eğer cache yoksa veya süresi dolduysa mecbur sunucuya git)
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ islem: action, ...payload }),
      });

      const data = await res.json();

      // 4. Yeni Veriyi Önbelleğe Kaydet (Sadece başarılıysa)
      if (data && data.success && cacheableActions.includes(action)) {
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              timestamp: new Date().getTime(),
              data: data,
            }),
          );
        } catch (storageError) {
          // Kota dolduysa sessizce geç, sistemi bozma
          console.log("Cache dolu, yazılamadı.");
        }
      }

      return data;
    } catch (e) {
      return null;
    }
  }

  // --- KULLANICIYI TESPİT ET (CACHE ÇAKIŞMASI FİXLENDİ v4.0) ---
  async function detectUser() {
    // 1. Önce Sayfadaki GERÇEK Veriyi Tara (DOM Öncelikli)
    var foundEmail = null;
    var foundName = "Misafir";

    var inputs = [
      'input[name="Email"]',
      "#Email",
      "#MemberEmail",
      ".member-email",
      'input[type="hidden"][name="Email"]',
    ];
    for (var i = 0; i < inputs.length; i++) {
      var el = document.querySelector(inputs[i]);
      if (el && el.value && el.value.includes("@")) {
        foundEmail = el.value.trim();

        // İsmi de bulmaya çalış
        var nameEl =
          document.querySelector('input[name="FirstName"]') ||
          document.querySelector("#FirstName");
        if (nameEl && nameEl.value) foundName = nameEl.value;

        break; // Bulduysak döngüden çık
      }
    }

    // 2. Şimdi Cache'e Bak
    var cachedUser = JSON.parse(localStorage.getItem("mdm_user_cache"));

    // 3. 🔥 KRİTİK KONTROL: Cache ile Ekran Farklı mı?
    if (foundEmail && cachedUser && cachedUser.email !== foundEmail) {
      console.log(
        "♻️ Kullanıcı değişmiş! Cache temizleniyor... (" +
          cachedUser.email +
          " -> " +
          foundEmail +
          ")",
      );
      localStorage.removeItem("mdm_user_cache"); // Eski veriyi sil
      cachedUser = null; // Cache'i boşalt
    }

    // 4. Kullanıcı Objesini Oluştur
    // Eğer sayfada bulduysak onu kullan, bulamadıysak cache'tekini kullan, o da yoksa boş aç.
    var user = {
      email: foundEmail || (cachedUser ? cachedUser.email : null),
      name: foundEmail ? foundName : cachedUser ? cachedUser.name : "Misafir",
      puan: cachedUser ? cachedUser.puan : 0,
      seviye: cachedUser ? cachedUser.seviye : "Çaylak",
      hak: cachedUser ? cachedUser.hak : 0,
    };

    // 5. Eğer sayfada bulamadıysak ama "Hesabım" linki varsa, arka planda tarama yap (Dedektif Modu)
    if (!user.email) {
      try {
        var targetUrls = [
          "/hesabim/bilgilerim/",
          "/Uye/BilgiGuncelle",
          "/uyelik-bilgilerim",
        ];
        for (let url of targetUrls) {
          if (user.email) break;
          var response = await fetch(url);
          if (response.ok) {
            var text = await response.text();
            var doc = new DOMParser().parseFromString(text, "text/html");
            var mailInput =
              doc.querySelector('input[name="Email"]') ||
              doc.querySelector("#Email") ||
              doc.querySelector("#MemberEmail");

            if (mailInput && mailInput.value && mailInput.value.includes("@")) {
              // Eğer burada bulduğumuz mail de cache'den farklıysa yine cache'i ezmemiz lazım
              var freshEmail = mailInput.value.trim();
              if (cachedUser && cachedUser.email !== freshEmail) {
                localStorage.removeItem("mdm_user_cache");
                user.puan = 0; // Puanı sıfırla ki yanlış göstermesin
              }

              user.email = freshEmail;
              var nameInput =
                doc.querySelector('input[name="FirstName"]') ||
                doc.querySelector("#FirstName");
              if (nameInput) user.name = nameInput.value;
            }
          }
        }
      } catch (e) {
        console.log("Dedektif hatası:", e);
      }
    }

    // 6. Sonuç: E-posta varsa API'ye bildir ve Cache'i Güncelle
    if (user.email) {
      // Oturum tetikle
      fetchApi("user_login_trigger", {
        email: user.email,
        adSoyad: user.name,
      }).then((loginRes) => {
        if (loginRes && loginRes.success && loginRes.isNew) {
          // 👇 SÜREYİ BELİRLEYEN KISIM BURASIDIR 👇
          setTimeout(() => {
            ModumApp.checkWelcome(true, 250);
          }, 8000); // 12000 = 12 Saniye demektir.
        }
      });

      // Detayları çek
      var details = await fetchApi("get_user_details", { email: user.email });
      if (details && details.success) {
        user.puan = details.user.puan || 0;
        user.seviye = details.user.seviye || "Çaylak";
        user.hak = details.user.hak || 0;
        user.gunlukSeri = details.user.gunlukSeri || 0;
        user.katilimSayisi =
          details.user.katilimSayisi || details.user.toplamkatilim || 0;
        user.toplamkatilim =
          details.user.katilimSayisi || details.user.toplamkatilim || 0;

        if (details.user.adSoyad && details.user.adSoyad !== "Misafir")
          user.name = details.user.adSoyad;
        if (details.user.referansKodu)
          user.referansKodu = details.user.referansKodu;
        user.badges = details.user.badges || [];
        user.selectedAvatar = details.user.selectedAvatar || null;
        user.profileTheme = details.user.profileTheme || "default";
        user.bio = details.user.bio || "";

        // Eğer profil sekmesi açıksa anlık güncelle
        if (APP_STATE.activeTab === "profile") {
          var pContainer = document.getElementById("mdm-profile-container");
          if (pContainer) pContainer.innerHTML = renderProfileTab(user);
        }

        // 🔥 EN GÜNCEL HALİNİ KAYDET
        localStorage.setItem("mdm_user_cache", JSON.stringify(user));
      }
    }

    return user;
  }
  // 🔥 GÜNCEL SERİ GÖRSELİ (VERİTABANINA BAĞLI)
  function renderStreakBars(count) {
    var maxDays = 7;
    var html = "";

    // Güvenlik: Count undefined ise 0 yap
    var current = parseInt(count) || 0;

    for (var i = 1; i <= maxDays; i++) {
      // Mantık:
      // Eğer i sayısı, mevcut seriden küçük veya eşitse -> DOLU (Renkli)
      // Değilse -> BOŞ (Sönük)

      var isFilled = i <= current;

      // Renk Ayarları (Doluysa Turuncu/Sarı, Boşsa Gri)
      // Screenshot'taki gibi ateş rengi yapalım
      var bgColor = isFilled
        ? "linear-gradient(to right, #f59e0b, #d97706)"
        : "#334155";
      var border = isFilled
        ? "1px solid #fbbf24"
        : "1px solid rgba(255,255,255,0.1)";
      var opacity = isFilled ? "1" : "0.3";
      var shadow = isFilled ? "0 0 10px rgba(245, 158, 11, 0.5)" : "none";

      // Animasyon (Sadece en son kazanılan gün parlasın)
      var anim =
        isFilled && i === current ? "animation: pulse 2s infinite;" : "";

      html += `
<div style="flex:1; height:30px; display:flex; flex-direction:column; align-items:center; gap:4px;">
<div style="width:100%; height:6px; background:${bgColor}; border-radius:4px; border:${border}; opacity:${opacity}; box-shadow:${shadow}; transition:0.3s; ${anim}"></div>
<div style="font-size:9px; color:${
        isFilled ? "#fbbf24" : "#64748b"
      }; font-weight:${isFilled ? "bold" : "normal"};">${i}.G</div>
  </div>`;
    }
    return html;
  }
  function applyThemeEngine(theme) {
    // 1. Temizlik
    var oldCanvas = document.getElementById("mdm-theme-canvas");
    if (oldCanvas) oldCanvas.remove();
    var oldText = document.getElementById("mdm-theme-slogan");
    if (oldText) oldText.remove();

    var logoBox = document.querySelector(".mdm-logo");
    if (!logoBox) return;

    // Logo Stilini Sıfırla
    logoBox.style.border = "none";
    logoBox.style.padding = "0";
    logoBox.style.boxShadow = "none";

    if (!theme || theme === "default") return;

    // 2. Temaya Özel Sloganlar ve Renkler
    var themeConfigs = {
      newyear: {
        slogan: "🎄 Mutlu Yıllar!",
        color: "#ef4444", // Yılbaşı Kırmızısı
        glow: "rgba(239, 68, 68, 0.5)",
        symbols: ["❄", "❅", "❆", "✨"],
      },
      valentines: {
        slogan: "💖 Aşk Dolu Fırsatlar",
        color: "#ec4899", // Aşk Pembesi
        glow: "rgba(236, 72, 153, 0.5)",
        symbols: ["❤", "♥", "🌸"],
      },
      ramadan: {
        slogan: "🌙 Hayırlı Ramazanlar",
        color: "#fbbf24", // Altın Sarısı
        glow: "rgba(251, 191, 36, 0.5)",
        symbols: ["★", "🌙", "✨"],
      },
      summer: {
        slogan: "☀️ Yazın En Sıcağı",
        color: "#f97316", // Turuncu
        glow: "rgba(249, 115, 22, 0.5)",
        symbols: ["☀️", "🌊", "🌴"],
      },
    };

    var config = themeConfigs[theme];
    if (!config) return;

    // 3. LOGO ÇERÇEVESİ VE PARILTI EKLEME
    logoBox.style.border = "2px solid " + config.color;
    logoBox.style.padding = "4px 12px";
    logoBox.style.borderRadius = "50px";
    logoBox.style.boxShadow = "0 0 15px " + config.glow;
    logoBox.style.transition = "all 0.5s ease";

    // 4. LOGO ALTINA SLOGAN EKLEME
    var slogan = document.createElement("div");
    slogan.id = "mdm-theme-slogan";
    slogan.innerText = config.slogan;
    slogan.style.position = "absolute";
    if (window.innerWidth < 768) {
      slogan.style.top = "85px"; // Mobilde logonun altına iter
      slogan.style.left = "15px"; // Mobilde biraz daha soldan başlatır
      slogan.style.fontSize = "11px"; // Mobilde yazıyı hafif küçültür ki taşmasın
    } else {
      slogan.style.top = "65px"; // Masaüstü için senin orijinal ayarın
      slogan.style.left = "20px";
      slogan.style.fontSize = "14px";
    }
    slogan.style.fontWeight = "800";
    slogan.style.color = config.color;
    slogan.style.textTransform = "uppercase";
    slogan.style.letterSpacing = "1px";
    slogan.style.fontFamily = "'Outfit', sans-serif";
    slogan.style.textShadow = "0 0 5px rgba(255,255,255,0.2)";
    slogan.style.animation = "mdmFadeUp 1s ease-out";

    // Topbar'ın içine ekle (Logo yanına veya altına denk gelir)
    document.querySelector(".mdm-topbar").appendChild(slogan);

    // 5. CANVAS EFEKTİ (Daha optimize hali)
    var canvas = document.createElement("canvas");
    canvas.id = "mdm-theme-canvas";
    Object.assign(canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "99999",
    });
    document.body.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var w = (canvas.width = window.innerWidth);
    var h = (canvas.height = window.innerHeight);
    var particles = [];

    for (var i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        s: Math.random() * 15 + 10,
        sym: config.symbols[Math.floor(Math.random() * config.symbols.length)],
        speed: Math.random() * 1 + 0.5,
        drift: Math.random() * 2 - 1,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.font = "20px Arial";
      ctx.fillStyle = config.color;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        ctx.fillText(p.sym, p.x, p.y);

        // Hareket
        p.y += p.speed;

        // p.drift tanımlı değilse hata vermesin diye || 0 ekledik
        var drift = p.drift || 0;
        p.x += Math.sin(p.y / 50) * 0.5 + drift;

        // 1. Aşağıdan çıktıysa tepeye al (DOĞRU SÜSLÜ PARANTEZ YAPISI)
        if (p.y > h) {
          p.y = -20;
          p.x = Math.random() * w; // Rastgele yatay konuma git
        }

        // 2. 🔥 MOBİL FİX: Yandan çıktıysa geri getir
        if (p.x > w) p.x = 0; // Sağdan çıktıysa sola al
        if (p.x < -20) p.x = w; // Soldan çıktıysa sağa al
      }
      requestAnimationFrame(draw);
    }
    draw(); // Fonksiyonu başlat
  }
  function renderApp(root) {
    var savedGlobalTheme = localStorage.getItem("mdm_global_theme");
    if (savedGlobalTheme) {
      root.setAttribute("data-global-theme", savedGlobalTheme);
    }
    var styleEl = root.querySelector("style");
    root.innerHTML = "";
    if (styleEl) root.appendChild(styleEl);

    // 1. BUGÜNÜN TARİHİ (GARANTİLİ TÜRKİYE SAATİ)
    // Tarayıcı saati ne olursa olsun Türkiye saatine göre YYYY-MM-DD üretir.
    var turkeyDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" }),
    );
    var yyyy = turkeyDate.getFullYear();
    var mm = String(turkeyDate.getMonth() + 1).padStart(2, "0");
    var dd = String(turkeyDate.getDate()).padStart(2, "0");
    var todayStr = yyyy + "-" + mm + "-" + dd;

    // 2. KULLANICININ SON HAK TARİHİ
    var lastDateRaw =
      APP_STATE.user && APP_STATE.user.songunlukhaktarihi
        ? String(APP_STATE.user.songunlukhaktarihi)
        : "";
    var lastDate = "";

    if (lastDateRaw && typeof lastDateRaw === "string") {
      // Boşlukları temizle ve T harfinden öncesini al
      var clean = lastDateRaw.trim();
      lastDate = clean.includes("T") ? clean.split("T")[0] : clean;
    }

    // 3. KARŞILAŞTIRMA (KİLİT MEKANİZMASI)
    var isCollected = lastDate === todayStr;

    var btnClass = isCollected
      ? "background:#334155; cursor:default; opacity:0.6; pointer-events:none;"
      : "background:#10b981; cursor:pointer; animation: pulse 2s infinite;";
    var btnText = isCollected
      ? '<i class="fas fa-check"></i> Bugün Alındı (Yarın Gel)'
      : '<i class="fas fa-gift"></i> Günlük Hakkını Al (+1 Hak)';
    var btnAction = isCollected ? "" : "onclick='ModumApp.dailyCheckIn()'";

    var currentXP =
      APP_STATE.user && APP_STATE.user.puan
        ? parseInt(APP_STATE.user.puan).toLocaleString()
        : "0";

    /* renderApp fonksiyonunun içindeki appHTML değişkeni */
    var appHTML = `
<div class="mdm-topbar">
<div class="mdm-logo">MODUMNET<span>ÇEKİLİŞLER</span></div>

<div class="mdm-header-right" style="display:flex; align-items:center; gap:15px;">
<div onclick="ModumApp.switchTab('profile')" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:6px 12px; border-radius:50px; display:flex; align-items:center; gap:6px; cursor:pointer;">
<i class="fas fa-star" style="color:#fbbf24; font-size:12px; animation:pulse 2s infinite;"></i>
<span id="nav-live-xp" style="color:#fff; font-weight:800; font-size:12px;">${currentXP} XP</span>
  </div>

<div class="mdm-help-btn-pill" onclick="ModumApp.openHelpModal()">
<i class="fas fa-question-circle"></i>
<span>YARDIM</span>
  </div>
  </div>
  </div>

<div class="mdm-dock-nav">
<div class="mdm-dock-link active" data-id="home" onclick="ModumApp.switchTab('home', this)">
<div class="mdm-dock-icon"><i class="fas fa-home"></i></div>
<div class="mdm-dock-text">Vitrin</div>
  </div>

<div class="mdm-dock-link" data-id="tasks" onclick="ModumApp.openTasksTab(this)">
<div class="mdm-dock-icon"><i class="fas fa-tasks"></i></div>
<div class="mdm-dock-text">Görevler</div>
  </div>

<div class="mdm-dock-link" data-id="store" onclick="ModumApp.switchTab('store', this)">
<div class="mdm-dock-icon"><i class="fas fa-shopping-bag"></i></div>
<div class="mdm-dock-text">Mağaza</div>
  </div>

<div class="mdm-dock-link" data-id="support" onclick="ModumApp.switchTab('support', this)">
<div class="mdm-dock-icon"><i class="fas fa-headset"></i></div>
<div class="mdm-dock-text">Destek</div>
  </div>

<div class="mdm-dock-link" data-id="profile" onclick="ModumApp.switchTab('profile', this)">
<div class="mdm-dock-icon"><i class="fas fa-user"></i></div>
<div class="mdm-dock-text">Profil</div>
  </div>
  </div>

<div class="mdm-content-wrapper">
<div id="mdm-welcome-area" style="margin-bottom: 10px;"></div>
<div id="tab-home" class="mdm-tab-content active">

<div id="mdm-leaderboard-area" style="min-height: 100px; margin-bottom: 20px;">
<div style="text-align:center; color:#94a3b8; font-size:12px; padding:20px;">
<i class="fas fa-circle-notch fa-spin"></i> Liderler Yükleniyor...
  </div>
  </div>

<h3 style="color:#fff; font-size:18px; margin:20px 0 15px; display:flex; align-items:center; gap:8px;">
<i class="fas fa-fire" style="color:#f59e0b"></i> Aktif Fırsatlar
  </h3>
<div id="mdm-active-grid" class="mdm-grid">${renderRaffles(
      APP_STATE.activeRaffles,
      true,
    )}</div>

<h3 style="color:#94a3b8; font-size:16px; margin:30px 0 15px; display:flex; align-items:center; gap:8px;"><i class="fas fa-flag-checkered"></i> Sonuçlananlar</h3>

<div id="mdm-completed-grid" class="mdm-grid">${renderRaffles(
      (APP_STATE.completedRaffles || []).slice(0, 6),
      false,
    )}</div>

<div id="mdm-load-more-box" style="margin-top:20px;">
${
  (APP_STATE.completedRaffles || []).length > 6
    ? '<button onclick="ModumApp.loadMoreCompleted()" class="mdm-btn-v2 btn-detail-v2" style="width:auto; padding:8px 30px; margin:0 auto; display:block; background:#334155;">DAHA FAZLA YÜKLE <i class="fas fa-chevron-down"></i></button>'
    : ""
}
  </div>
  </div>

<div id="tab-tasks" class="mdm-tab-content">
<!-- GÜNLÜK SERİ KUTUSU (En Üstte) -->
<div class="mdm-streak-box">
<div style="font-size:14px; color:#fff; font-weight:bold;">🔥 Günlük Seri</div>
<div style="font-size:11px; color:#94a3b8; margin-bottom:10px;">Her gün gel, seriyi bozma, ödülleri katla!</div>

<div id="mdm-streak-container" class="mdm-streak-days" style="display:flex; justify-content:space-between; gap:5px;">
<!-- JS ile dolacak -->
<div id="mdm-streak-container" class="mdm-streak-days" style="display:flex; gap:6px; margin-top:10px; padding:0 5px;">
${renderStreakBars(APP_STATE.user.gunlukSeri)}
  </div>
  </div>
  </div>

<h3 style="color:#fff; font-size:16px; margin:20px 0 10px;">🎯 Aktif Görevler</h3>

<!-- GÖREVLERİN LİSTELENECEĞİ KUTU -->
<div id="mdm-tasks-list">
<div style="text-align:center; padding:20px; color:#64748b;">
<i class="fas fa-circle-notch fa-spin"></i> Yükleniyor...
  </div>
  </div>
  </div>

<div id="tab-store" class="mdm-tab-content">
<h3 style="color:#fff;">🛒 Puan Mağazası</h3>
${renderEarningsInfo()} <h3 style="color:#fff; font-size:16px; margin-top:20px;">🎁 Ödül Vitrini</h3>
<div id="mdm-store-container"></div> 
  </div>

<div id="tab-support" class="mdm-tab-content">

<!-- 1. DEĞERLENDİRME KUTUSU (GÖREV İÇİN) -->
<div style="background:linear-gradient(135deg, #4f46e5, #4338ca); padding:20px; border-radius:16px; margin-bottom:20px; text-align:center; position:relative; overflow:hidden; border:1px solid #6366f1;">
<div style="position:absolute; top:-10px; right:-10px; font-size:80px; opacity:0.1;">⭐</div>
<h3 style="color:#fff; font-size:16px; margin:0 0 5px 0;">Bizi Değerlendirin</h3>
<p style="color:#c7d2fe; font-size:12px; margin-bottom:15px;">Düşünceleriniz bizim için değerli. Yorum yap, "Alışveriş Gurusu" görevini tamamla!</p>

<textarea id="eval-message" rows="2" placeholder="Hizmetimizden memnun kaldınız mı?" style="width:100%; padding:10px; border-radius:8px; border:none; background:rgb(0 0 0 / 10%); color:#fff; font-size:22px; margin-bottom:10px;"></textarea>

<button onclick="ModumApp.submitEvaluation()" style="background:#fbbf24; color:#78350f; border:none; padding:10px 20px; border-radius:50px; font-weight:bold; font-size:12px; cursor:pointer; box-shadow:0 4px 10px rgba(251, 191, 36, 0.3);">
GÖNDER VE KAZAN 🚀
  </button>
  </div>

<!-- 2. DESTEK TALEBİ OLUŞTURMA -->
<h3 style="color:#fff; font-size:15px; margin-bottom:10px; display:flex; align-items:center; gap:8px;">
<i class="fas fa-headset" style="color:#f472b6;"></i> Sorun Bildir / Destek
  </h3>

<div style="background:#1e293b; padding:15px; border-radius:12px; border:1px solid #334155; margin-bottom:25px;">
<input type="text" id="supp-subject" placeholder="Konu (Örn: Kargo, Puan vb.)" style="width:100%; padding:10px; margin-bottom:10px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:6px; font-size:12px;">
<textarea id="supp-message" rows="3" placeholder="Sorunuzu detaylı yazın..." style="width:100%; padding:10px; margin-bottom:10px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:6px; font-size:12px;"></textarea>
<input type="text" id="supp-phone" placeholder="Telefon (Opsiyonel)" style="width:100%; padding:10px; margin-bottom:10px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:6px; font-size:12px;">

<button onclick="ModumApp.submitSupport()" class="mdm-btn-v2 btn-detail-v2" style="width:100%; background:#334155;">TALEBİ GÖNDER</button>
  </div>

<!-- 3. TALEPLERİM LİSTESİ -->
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
<h3 style="color:#fff; font-size:15px; margin:0;">📂 Taleplerim</h3>
<button onclick="ModumApp.loadSupportHistory()" style="background:transparent; border:none; color:#3b82f6; font-size:11px; cursor:pointer;"><i class="fas fa-sync"></i> Yenile</button>
  </div>

<div id="mdm-support-history">
<div style="text-align:center; padding:20px; color:#64748b;">Yükleniyor...</div>
  </div>

  </div>

<div id="tab-profile" class="mdm-tab-content">
<h3 style="color:#fff;">👤 Hesabım</h3>
<div id="mdm-profile-container">${renderProfileTab(APP_STATE.user)}</div>
  </div>
  </div>

<!-- MODALLAR AYNEN KALIYOR -->
<div id="mdm-ticket-modal" class="mdm-modal"><div class="mdm-modal-content"><div class="mdm-modal-header"><h3 style="margin:0;color:#fff;">🎟️ Bilet Cüzdanım</h3><div class="mdm-modal-close" onclick="ModumApp.closeModal('mdm-ticket-modal')">&times;</div></div><div id="mdm-ticket-list"></div></div></div>
<div id="mdm-team-modal" class="mdm-modal"><div class="mdm-modal-content"><div class="mdm-modal-header"><h3 style="margin:0;color:#fff;">🤝 Ekip Arkadaşlarım</h3><div class="mdm-modal-close" onclick="ModumApp.closeModal('mdm-team-modal')">&times;</div></div><ul id="mdm-team-list" class="mdm-team-list"></ul></div></div>
<div id="mdm-history-modal" class="mdm-modal"><div class="mdm-modal-content"><div class="mdm-modal-header"><h3 style="margin:0;color:#fff;">📜 Puan Geçmişi</h3><div class="mdm-modal-close" onclick="ModumApp.closeModal('mdm-history-modal')">&times;</div></div><div id="mdm-history-list"></div></div></div>

<div id="mdm-detail-modal" class="mdm-modal">
<div class="mdm-modal-content">
<div class="mdm-modal-header"><h3 id="mdm-detail-title" style="margin:0; color:#fff; font-size:16px;">Detaylar</h3><div class="mdm-modal-close" onclick="ModumApp.closeModal('mdm-detail-modal')">&times;</div></div>
<div id="mdm-detail-body" style="color:#cbd5e1; font-size:13px; line-height:1.6;"></div>
  </div>
  </div>

<div id="mdm-winners-modal" class="mdm-modal">
<div class="mdm-modal-content">
<div class="mdm-modal-header"><h3 style="margin:0; color:#fff; font-size:16px;">🏆 Kazananlar Listesi</h3><div class="mdm-modal-close" onclick="ModumApp.closeModal('mdm-winners-modal')">&times;</div></div>
<div id="mdm-winners-list" style="max-height:300px; overflow-y:auto;"></div>
  </div>
  </div>
`;

    var contentDiv = document.createElement("div");
    contentDiv.innerHTML = appHTML;
    root.appendChild(contentDiv);

    try {
      var hour = new Date().getHours();
      var greeting = "İyi Günler";
      var icon = "☀️";
      if (hour >= 6 && hour < 12) {
        greeting = "Günaydın";
        icon = "☕";
      } else if (hour >= 18 || hour < 6) {
        greeting = "İyi Akşamlar";
        icon = "🌙";
      }

      var rawName =
        APP_STATE.user && APP_STATE.user.name ? APP_STATE.user.name : "Misafir";
      var firstName = rawName.split(" ")[0];

      // Kutuyu bul ve içini doldur
      var welcomeBox = document.getElementById("mdm-welcome-area");
      if (welcomeBox) {
        welcomeBox.innerHTML = `<div style="padding:0 15px; color:#94a3b8; font-size:13px; font-weight:500;">${icon} ${greeting}, <b style="color:#fff;">${firstName}</b>! Şansın bol olsun.</div>`;
      }
    } catch (e) {
      console.log("Mesaj hatası:", e);
    }

    // Üst bardaki isim ve avatarı güncelle (Eğer kullanıcı varsa)
    if (APP_STATE.user && APP_STATE.user.email) {
      var initial = (APP_STATE.user.name || "M").charAt(0).toUpperCase();
      var navAvatar = document.getElementById("nav-avatar");
      var navName = document.getElementById("nav-user-name");
      if (navAvatar) navAvatar.innerText = initial;
      if (navName) navName.innerText = APP_STATE.user.name;
    }

    if (APP_STATE.activeTab !== "home") ModumApp.switchTab(APP_STATE.activeTab);
    startTimer();
    setTimeout(function () {
      ModumApp.loadStoryBar();
    }, 2000);
  }

  // --- RENDER RAFFLES (SİNEMATİK POSTER TASARIMI - FİNAL v5 SADELEŞTİRİLMİŞ) ---
  function renderRaffles(list, isActive) {
    if (!list || list.length === 0) {
      return `<div style="text-align:center; padding:40px; color:#64748b; background:${
        THEME.cardBg
      }; border-radius:16px; border:1px dashed ${THEME.border}; width:100%;">
<i class="fas fa-ghost" style="font-size:32px; margin-bottom:15px; opacity:0.3;"></i><br>
${
  isActive
    ? "Şu an aktif bir fırsat yok.<br><small>Takipte kal!</small>"
    : "Henüz sonuçlanmış çekiliş yok."
}
  </div>`;
    }

    return list
      .map((r) => {
        var img = r.resim || DEFAULT_IMG;

        // Tarih Hesaplamaları
        var bitisStr = r.bitisTarihi || new Date().toISOString();
        if (bitisStr.length <= 10) bitisStr += "T23:59:00";
        else if (!bitisStr.includes("T")) bitisStr = bitisStr.replace(" ", "T");

        var endDate = new Date(bitisStr).getTime();
        var now = new Date().getTime();
        var hoursLeft = (endDate - now) / (1000 * 60 * 60);

        // --- ROZET BELİRLEME ---
        var badgeHtml = "";
        var katilimci = parseInt(r.katilimciSayisi) || 0;

        if (isActive) {
          if (hoursLeft < 12) {
            badgeHtml =
              '<div class="mdm-rc-badge mdm-badge-panic">⏳ SON SAATLER</div>';
          } else if (hoursLeft < 24) {
            badgeHtml =
              '<div class="mdm-rc-badge mdm-badge-panic">🚨 SON 1 GÜN</div>';
          } else if (katilimci > 100) {
            badgeHtml =
              '<div class="mdm-rc-badge mdm-badge-fire">🔥 ALEV ALEV</div>';
          } else {
            badgeHtml =
              '<div class="mdm-rc-badge mdm-badge-new">✨ YENİ FIRSAT</div>';
          }
        } else {
          badgeHtml =
            '<div class="mdm-rc-badge" style="background:#334155; color:#94a3b8;">SONUÇLANDI</div>';
        }

        // --- BUTONLAR VE İÇERİK ---
        var cleanName = (r.ad || "").toLowerCase().trim();
        var isJoined = APP_STATE.myRaffles.some(
          (myRef) => (myRef || "").toLowerCase().trim() === cleanName,
        );

        var mainBtn = "";
        var middleContent = ""; // Aktifse sayaç, Pasifse BOŞ

        if (isActive) {
          // --- AKTİF ÇEKİLİŞ ---
          if (isJoined) {
            mainBtn = `<button class="mdm-btn-v2 btn-green" style="cursor:default; opacity:0.9;" onclick="ModumApp.openTicketModal()">KATILDINIZ <i class="fas fa-check-circle"></i></button>`;
          } else {
            var isUrgent = hoursLeft < 24;
            var btnStyleClass = isUrgent ? "btn-panic-mode" : "btn-join-v2";
            var btnText = isUrgent ? "SON ŞANS!" : "KATIL";
            mainBtn = `<button class="mdm-btn-v2 ${btnStyleClass}" onclick="ModumApp.joinRaffle('${
              r.id
            }', '${r.ad.replace(
              /'/g,
              "\\'",
            )}')">${btnText} <i class="fas fa-ticket-alt"></i></button>`;
          }

          // Sayaç HTML
          middleContent = `
<div class="mdm-timer-minimal mdm-timer-smart" data-end="${bitisStr}">
<div class="mdm-tm-part"><div class="mdm-tm-val">-</div><div class="mdm-tm-lbl">GN</div></div> <div class="mdm-tm-dots">:</div>
<div class="mdm-tm-part"><div class="mdm-tm-val">-</div><div class="mdm-tm-lbl">SA</div></div> <div class="mdm-tm-dots">:</div>
<div class="mdm-tm-part"><div class="mdm-tm-val">-</div><div class="mdm-tm-lbl">DK</div></div> <div class="mdm-tm-dots">:</div>
<div class="mdm-tm-part"><div class="mdm-tm-val">-</div><div class="mdm-tm-lbl">SN</div></div>
  </div>`;
        } else {
          // --- PASİF ÇEKİLİŞ ---
          // Toplam Katılım Barını SİLDİK. Sadece buton kaldı.
          mainBtn = `<button class="mdm-btn-v2" style="background:#fbbf24; color:#78350f; font-weight:900; width:100%; box-shadow:0 4px 10px rgba(251, 191, 36, 0.3);" onclick="ModumApp.openWinnersModal('${r.ad}')">
<i class="fas fa-trophy"></i> KAZANANLARI GÖR
  </button>`;

          middleContent = ""; // Burası boş kalsın, sade dursun.
        }

        // --- YENİ HTML YAPISI (POSTER) ---
        var urgentClass = isActive && hoursLeft < 24 ? "mdm-card-urgent" : "";

        // Alt Buton Grubu (Sadece aktifken detaylı, pasifken tek buton)
        var actionGrid = "";

        if (isActive) {
          actionGrid = `
<div class="mdm-action-grid">
<button class="mdm-btn-v2 btn-detail-v2" onclick="ModumApp.openDetailModal('${r.id}', '${r.ad}', '${img}', '${r.odul}', '${bitisStr}', '${r.katilimciSayisi}')">
<i class="fas fa-info"></i>
  </button>
<button class="mdm-btn-v2 btn-detail-v2" onclick="ModumApp.subscribeNotification()" style="font-size:11px; font-weight:bold; display:flex; align-items:center; justify-content:center; gap:6px;">
<i class="fas fa-bell"></i> BİLDİRİM
  </button>
${mainBtn}
  </div>

<div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.1);">
<span style="font-size:10px; color:#94a3b8; cursor:pointer; display:flex; align-items:center; gap:4px; transition:0.2s;" onclick="ModumApp.shareRaffle('${r.ad}')">
<i class="fas fa-share-alt"></i> Paylaş
  </span>
<span style="font-size:10px; color:#fbbf24; cursor:pointer; display:flex; align-items:center; gap:4px; font-weight:bold; transition:0.2s;" onclick="ModumApp.addToCalendar('${r.ad}', '${bitisStr}')">
<i class="far fa-calendar-plus"></i> Takvime Ekle
  </span>
  </div>`;
        } else {
          // Pasifken sadece KAZANANLARI GÖR butonu (Tam genişlik)
          actionGrid = `<div style="margin-top:auto;">${mainBtn}</div>`;
        }

        return `
<div class="mdm-raffle-card ${urgentClass}">
<div class="mdm-rc-image">
<img src="${img}" alt="${r.ad}">
  </div>

${badgeHtml}

<div class="mdm-rc-overlay">
<div class="mdm-rc-title">${r.ad}</div>
<div class="mdm-rc-reward">🏆 ${r.odul}</div>

${middleContent}
${actionGrid}
  </div>
  </div>`;
      })
      .join("");
  }

  // --- PROFİL SEKMESİ (BÜTÜNLEŞİK KART TASARIMI - TEMA İÇİNDE) ---
  function renderProfileTab(incomingUser) {
    // 1. GÜVENLİK
    var user = incomingUser;
    if (!user || !user.email) {
      try {
        var cached = JSON.parse(localStorage.getItem("mdm_user_cache"));
        if (cached && cached.email) user = cached;
      } catch (e) {}
    }
    if (!user || !user.email) {
      return `<div style="text-align:center; padding:50px 20px;"><h3 style="color:#fff;">Giriş Yapmalısın</h3><a href="/kullanici-giris" class="mdm-btn-lucky">GİRİŞ YAP</a></div>`;
    }
    var safeBio =
      user.bio && user.bio.length > 0 ? user.bio : "Henüz bir söz yok.";

    // 2. TEMA VE RENK AYARLARI (Acil Durum Kitli)
    var themesDB = null;
    if (typeof PROFILE_THEMES !== "undefined") themesDB = PROFILE_THEMES;
    else if (typeof window.PROFILE_THEMES !== "undefined")
      themesDB = window.PROFILE_THEMES;
    else {
      // Yedek Temalar
      themesDB = {
        default: { bg: "#1e293b", border: "#334155", glow: "#334155" },
        caylak: { bg: "#064e3b", border: "#10b981", glow: "#10b981" },
        usta: { bg: "#3b0764", border: "#8b5cf6", glow: "#8b5cf6" },
        sampiyon: { bg: "#451a03", border: "#f59e0b", glow: "#f59e0b" },
        efsane: { bg: "#450a0a", border: "#ef4444", glow: "#ef4444" },
        gold: {
          bg: "linear-gradient(135deg, #422006, #713f12)",
          border: "#eab308",
          glow: "#eab308",
        },
        dark: { bg: "#000000", border: "#333333", glow: "#ffffff" },
      };
    }

    var myThemeId = user.profileTheme || "default";
    var theme = themesDB[myThemeId] || themesDB["default"];

    // 🔥 KART STİLİ (Tüm içeriği kapsayacak stil)
    var cardStyle = `background: ${theme.bg} !important; border: 1px solid ${theme.border}; box-shadow: 0 0 20px ${theme.glow}40; border-radius: 20px; padding: 20px; margin-bottom: 20px; position: relative; transition: background 0.3s ease;`;

    // 3. TEMEL VERİLER
    var xp = parseInt(user.puan) || 0;
    var level = user.seviye || "Çaylak";
    var name = user.adSoyad || user.name || "Misafir";

    // Önce ayarları güvenli şekilde alalım (Yoksa varsayılanları kullan)
    var s = window.APP_STATE.settings || {};

    var limits = {
      usta: parseInt(s.lvl_usta_min) || 2500,
      sampiyon: parseInt(s.lvl_sampiyon_min) || 7500,
      efsane: parseInt(s.lvl_efsane_min) || 15000,
    };

    var ranks = {
      Çaylak: {
        color: "#10b981",
        icon: "🌱",
        nextName: "Usta",
        next: limits.usta,
        class: "theme-caylak",
      },
      Usta: {
        color: "#8b5cf6",
        icon: "⚔️",
        nextName: "Şampiyon",
        next: limits.sampiyon,
        class: "theme-usta",
      },
      Şampiyon: {
        color: "#f59e0b",
        icon: "🦁",
        nextName: "Efsane",
        next: limits.efsane,
        class: "theme-sampiyon",
      },
      Efsane: {
        color: "#ef4444",
        icon: "👑",
        nextName: "Maksimum",
        next: 9999999,
        class: "theme-efsane",
      },
    };
    var currentRank = ranks[level] || ranks["Çaylak"];

    // İlerleme
    var progressPercent = 100;
    var nextLevelText = "Zirvedesin!";
    if (level !== "Efsane") {
      var goal = currentRank.next;
      var prevLimit = level === "Usta" ? 2500 : level === "Şampiyon" ? 7500 : 0;
      progressPercent = Math.min(
        Math.max(((xp - prevLimit) / (goal - prevLimit)) * 100, 0),
        100,
      );
      nextLevelText = `${currentRank.nextName} için ${goal - xp} XP`;
    }

    // Avatar
    // --- 1. ÖNCE ÇERÇEVEYİ KONTROL ET ---
    var framesFromParam = user.ownedFrames || [];
    var framesFromGlobal =
      (window.APP_STATE &&
        window.APP_STATE.user &&
        window.APP_STATE.user.ownedFrames) ||
      [];
    var mergedFrames = [...new Set([...framesFromParam, ...framesFromGlobal])];

    // --- 🔥 ÇERÇEVE GÖSTERİM MANTIĞI (FİNAL DÜZELTME) ---
    var currentFrame = user.selectedFrame || "";
    var frameHtml = "";

    if (currentFrame) {
      if (currentFrame.includes("http")) {
        // Eğer Link ise (Giphy): Resmi arka plan olarak ayarla, kenarlığı kaldır
        frameHtml = `<div class="mdm-avatar-frame" style="top:-5px; left:-5px; right:-5px; bottom:-5px; border:none; background-image: url('${currentFrame}'); background-size: cover; background-position: center; z-index: 10;"></div>`;
      } else {
        // Eğer Eski Tip ise (CSS Class): Sınıfı ekle
        frameHtml = `<div class="mdm-avatar-frame ${currentFrame}" style="top:-3px; left:-3px; right:-3px; bottom:-3px; border-width:2px;"></div>`;
      }
    }

    // --- 2. SONRA AVATARI ÇİZ (AKILLI KENARLIK) ---
    var avatarUrl = user.selectedAvatar || "";
    var avatarDisplay = "";
    var dbBadges = typeof BADGES_DB !== "undefined" ? BADGES_DB : {};

    // 🔥 KİLİT NOKTA: Eğer çerçeve takılıysa kenarlığı (border) SİL, yoksa Rütbe Rengini koy
    var borderStyle =
      currentFrame && currentFrame !== ""
        ? "border:none !important; box-shadow:none !important;"
        : `border-color:${currentRank.color}`;

    if (avatarUrl.includes("http")) {
      avatarDisplay = `<img src="${avatarUrl}" class="mdm-insta-avatar-img" style="${borderStyle}">`;
    } else if (dbBadges[avatarUrl]) {
      avatarDisplay = `<div class="mdm-insta-avatar-img" style="display:flex;align-items:center;justify-content:center;font-size:60px;background:transparent; ${borderStyle}">${dbBadges[avatarUrl].i}</div>`;
    } else {
      avatarDisplay = `<img src="https://www.modum.tr/i/m/001/0013355.png" class="mdm-insta-avatar-img" style="${borderStyle}">`;
    }

    // --- ÇERÇEVE LİSTESİ OLUŞTURUCU (VERİTABANI BAĞLANTILI) ---

    // 1. "Çıkar" Butonu (En başa eklenir)
    var framesListHtml = `
<div class="mdm-frame-wrapper" onclick="ModumApp.equipFrame('')">
<div class="mdm-mini-frame-icon" style="border:1px dashed #ef4444; display:flex; align-items:center; justify-content:center;">
<i class="fas fa-ban" style="color:#ef4444; font-size:16px;"></i>
  </div>
<div class="mdm-frame-name" style="color:#ef4444;">ÇIKAR</div>
  </div>`;

    // 2. Çerçeveleri Döngüye Al (FİNAL DÜZELTME)
    mergedFrames.forEach(function (f) {
      // Varsayılan stil (Boşken)
      var iconStyle = "";
      var iconClass = "";
      var displayName = "ÇERÇEVE";

      // Eğer bu çerçeve takılıysa, kutunun etrafına yeşil ışık ver (Resmin kendisine değil)
      var wrapperStyle =
        currentFrame === f
          ? "border: 2px solid #4ade80; box-shadow: 0 0 10px #4ade80; border-radius: 12px;"
          : "";
      var nameColor = currentFrame === f ? "color:#4ade80;" : "";

      // Link mi (Giphy), Kod mu (CSS)?
      if (f.includes("http")) {
        displayName = "ÖZEL";
        iconClass = "mdm-mini-frame-icon";

        // 🔥 RESMİ BASAN KISIM:
        // background-image'i inline style olarak basıyoruz.
        iconStyle = `background-image: url('${f}'); border: none;`;
      } else {
        // ESKİ TİP (CSS CLASS)
        var dbInfo = typeof FRAMES_DB !== "undefined" ? FRAMES_DB[f] : null;
        if (dbInfo && dbInfo.t)
          displayName = dbInfo.t
            .replace(" Çerçeve", "")
            .replace(" (Dark)", "")
            .toUpperCase();
        else displayName = f.replace("frame-", "").toUpperCase();

        iconClass = `mdm-mini-frame-icon ${f}`;
        // Seçiliyse ikonun kendisine de hafif efekt ver
        if (currentFrame === f)
          iconStyle = "box-shadow: inset 0 0 10px #4ade80;";
      }

      // HTML'i ekle
      framesListHtml += `
<div class="mdm-frame-wrapper" onclick="ModumApp.openFrameDetail('${f}')" style="${wrapperStyle} padding: 5px; transition: 0.2s;">
<div class="${iconClass}" style="${iconStyle}"></div>
<div class="mdm-frame-name" style="${nameColor}">${displayName}</div>
  </div>`;
    });

    var safeBio = user.bio || "Merhaba! Ben ModumNet üyesiyim. 🛍️";

    // 4. MENU STİLLERİ (Şeffaflaştırıldı çünkü artık renkli kartın içinde)
    var menuStyle = `border:1px solid rgba(255,255,255,0.1); background:rgba(0, 0, 0, 0.2); box-shadow:0 4px 15px rgba(0,0,0,0.1);`;
    var iconStyle = `background:rgba(255,255,255,0.1); color:#fff;`;

    var menuStyle = `border:1px solid rgba(255,255,255,0.1); background:rgba(0, 0, 0, 0.2); box-shadow:0 4px 15px rgba(0,0,0,0.1);`;
    var iconStyle = `background:rgba(255,255,255,0.1); color:#fff;`;

    var oldMenuHtml = `
<div class="mdm-menu-grid" style="margin-top:20px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
<div class="mdm-menu-card" style="${menuStyle} padding:15px; border-radius:12px; cursor:pointer; display:flex; align-items:center; gap:10px;" onclick="ModumApp.openMyCouponsModal()">
<div style="${iconStyle} width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center;"><i class="fas fa-tags"></i></div>
<div style="font-size:12px; font-weight:bold; color:#fff;">Kuponlarım</div>
  </div>
<div class="mdm-menu-card" style="${menuStyle} padding:15px; border-radius:12px; cursor:pointer; display:flex; align-items:center; gap:10px;" onclick="ModumApp.openTicketModal()">
<div style="${iconStyle} width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center;"><i class="fas fa-ticket-alt"></i></div>
<div style="font-size:12px; font-weight:bold; color:#fff;">Biletlerim</div>
  </div>
<div class="mdm-menu-card" style="${menuStyle} padding:15px; border-radius:12px; cursor:pointer; display:flex; align-items:center; gap:10px;" onclick="ModumApp.openTeamModal()">
<div style="${iconStyle} width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center;"><i class="fas fa-users"></i></div>
<div style="font-size:12px; font-weight:bold; color:#fff;">Ekibim</div>
  </div>
<div class="mdm-menu-card" style="${menuStyle} padding:15px; border-radius:12px; cursor:pointer; display:flex; align-items:center; gap:10px;" onclick="ModumApp.openHistoryModal()">
<div style="${iconStyle} width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center;"><i class="fas fa-history"></i></div>
<div style="font-size:12px; font-weight:bold; color:#fff;">Geçmiş</div>
  </div>

<div class="mdm-menu-card" onclick="ModumApp.openInstallGuide()" style="grid-column: span 2; ${menuStyle} padding:15px; border-radius:12px; cursor:pointer; display:flex; align-items:center; gap:10px; background:linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.2)); border:1px solid #3b82f6;">
<div style="background:#3b82f6; color:#fff; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px #3b82f6;"><i class="fas fa-mobile-alt"></i></div>
<div style="flex:1;">
<div style="font-size:12px; font-weight:800; color:#fff;">Uygulamayı Yükle</div>
<div style="font-size:10px; color:#93c5fd;">Daha hızlı erişim için ana ekrana ekle</div>
  </div>
<i class="fas fa-chevron-right" style="color:#60a5fa; font-size:12px;"></i>
  </div>

  </div>`;
    // --- 🔥 YENİ EKLENEN: SÜPER PROFİL PANELE (BUTONLAR & LİDERLİK) ---
    // 1. Günlük Hak Tarih Hesabı
    var turkeyDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" }),
    );
    var todayStr =
      turkeyDate.getFullYear() +
      "-" +
      String(turkeyDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(turkeyDate.getDate()).padStart(2, "0");

    var lastDateRaw = user.songunlukhaktarihi
      ? String(user.songunlukhaktarihi)
      : "";
    var lastDate = lastDateRaw.includes("T")
      ? lastDateRaw.split("T")[0]
      : lastDateRaw;
    var isCollected = lastDate === todayStr;

    var btnClass = isCollected
      ? "background:#334155; cursor:default; opacity:0.6; pointer-events:none;"
      : "background:#10b981; cursor:pointer; animation: pulse 2s infinite;";
    var btnText = isCollected
      ? '<i class="fas fa-check"></i> Bugün Alındı'
      : '<i class="fas fa-gift"></i> Günlük Hak Al';
    var btnAction = isCollected ? "" : "onclick='ModumApp.dailyCheckIn()'";

    var superPanelHtml = `
<div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.1);">

<div class="mdm-home-actions" style="margin-bottom:15px; display:flex; gap:10px;">
<button class="mdm-btn-lucky" style="${btnClass}; flex:2; display:flex; align-items:center; justify-content:center; gap:5px;" ${btnAction}>${btnText}</button>

<button class="mdm-btn-notify" style="flex:1; display:flex; align-items:center; justify-content:center; gap:5px;" onclick="ModumApp.subscribeNotification()">
<i class="fas fa-bell"></i> <span style="font-size:11px;">Bildirim</span>
  </button>
  </div>

<button class="mdm-btn-lucky" style="background:linear-gradient(135deg, #6366f1, #4f46e5); border:none; width:100%; margin-bottom:20px; display:flex; align-items:center; justify-content:center; gap:8px;" onclick="ModumApp.openSurveyModal()">
<i class="fas fa-poll"></i> Söz Sizde! (Anket)
  </button>

  </div>
<div style="height:1px; background:rgba(255,255,255,0.1); margin: 15px 0;"></div>
`;

    // 5. ROZETLER
    var badgeGridHtml =
      '<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; background:rgba(0,0,0,0.2); padding:15px; border-radius:16px;">';
    Object.keys(dbBadges).forEach((key) => {
      var b = dbBadges[key];
      var hasIt = (user.badges || []).includes(key) || key === "lvl_caylak";
      var opacity = hasIt ? "1" : "0.3";
      var filter = hasIt ? "none" : "grayscale(100%)";
      badgeGridHtml += `<div onclick="ModumApp.openBadgeDetail('${key}')" style="position:relative; aspect-ratio:1; background:rgba(255,255,255,0.05); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:24px; cursor:pointer; opacity:${opacity}; filter:${filter}; transition:0.2s;">${b.i}</div>`;
    });
    badgeGridHtml += "</div>";

    // --- HTML ÇIKTISI (BÜYÜK BİRLEŞTİRME) ---
    // 1. QR Kod Linki Hazırla
    // 1. QR Kod Linki Hazırla
    var refCode = user.referansKodu || user.uid || "MODUM";
    var refLink = window.location.origin + "/kullanici-giris?ref=" + refCode;
    // QR rengini temaya göre ayarlamak istersen color parametresini değiştirebilirsin, şimdilik beyaz kalsın.
    var qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      refLink,
    )}&color=000000&bgcolor=transparent`;

    // --- HTML ÇIKTISI (DÜZELTİLMİŞ) ---
    return `
<div class="${currentRank.class}">

<div class="mdm-flip-scene">
<div id="mdm-profile-flipper" class="mdm-flip-wrapper">

<div class="mdm-flip-face-front" style="${cardStyle} min-height: 350px;"> 

<div class="mdm-insta-card" style="background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important;">                

<div class="mdm-insta-avatar-area">
<div style="position:relative;">
${avatarDisplay}
${frameHtml}
  </div>
  </div>

<div class="mdm-insta-info">
<div class="mdm-insta-username">${name}</div>

<div class="mdm-profile-actions">
<button onclick="ModumApp.openEditProfile()" style="background:rgba(255,255,255,0.1); color:#fff; border:1px solid rgba(255,255,255,0.2); padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px; font-weight:bold;">✏️ Profil Düzenle</button>
<button onclick="ModumApp.openAffiliateModal()" style="background: linear-gradient(135deg, #10b981, #059669); border:none; color:#fff; padding:8px 15px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:bold; display:flex; align-items:center; gap:5px; box-shadow: 0 4px 10px rgba(16,185,129,0.3);">
<i class="fas fa-user-plus"></i> Davet Et
  </button>
<button onclick="ModumApp.openThemeSelector()" style="background:rgba(255,255,255,0.1); color:#fff; border:1px solid rgba(255,255,255,0.2); padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px; font-weight:bold; margin-left:10px;">🎨 Tema</button>
<button onclick="document.getElementById('mdm-profile-flipper').classList.add('is-flipped')" style="background:rgba(255,255,255,0.1); color:#fff; border:1px solid rgba(255,255,255,0.2); padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px; font-weight:bold; margin-left:10px;">📇 Kartvizit</button>
  </div>

<div class="mdm-insta-bio">${safeBio}</div>

<div class="mdm-insta-stats" style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-bottom:10px; width:100%;">
<div onclick="ModumApp.openRankInfoModal()" style="background:rgba(255,255,255,0.05); padding:10px 5px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); text-align:center; cursor:pointer;">
<div style="font-weight:800; color:${
      currentRank.color
    }; font-size:13px;">${level}</div>
<div style="font-size:9px; color:rgba(255,255,255,0.5);">RÜTBE</div>
  </div>
<div style="background:rgba(255,255,255,0.05); padding:10px 5px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); text-align:center;">
<div style="font-weight:800; color:#fff; font-size:13px;">${
      user.katilimSayisi || 0
    }</div>
<div style="font-size:9px; color:rgba(255,255,255,0.5);">KATILIM</div>
  </div>
<div style="background:rgba(255,255,255,0.05); padding:10px 5px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); text-align:center;">
<div style="font-weight:800; color:#fff; font-size:13px;">${
      (user.badges || []).length
    }</div>
<div style="font-size:9px; color:rgba(255,255,255,0.5);">ROZET</div>
  </div>
  </div>

<div class="mdm-pro-bar" style="margin-top:15px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">

<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
<div style="font-weight: 800; color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing:0.5px;">
${currentRank.icon} ${level}
  </div>
<div style="font-weight: bold; color: ${currentRank.color}; font-size: 12px;">
%${Math.floor(progressPercent)}
  </div>
  </div>

<div style="width: 100%; background: rgba(0,0,0,0.3); height: 10px; border-radius: 20px; overflow: hidden; position: relative;">
<div style="
width: ${progressPercent}%; 
background: linear-gradient(90deg, ${currentRank.color}, #fff); 
height: 100%; 
border-radius: 20px; 
transition: width 0.5s ease;
box-shadow: 0 0 15px ${currentRank.color}80;
">
<div style="
position: absolute; top: 0; left: 0; bottom: 0; right: 0;
background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
animation: shimmerBar 2s infinite;
"></div>
  </div>
  </div>

<div style="font-size: 10px; color: rgba(255,255,255,0.6); margin-top: 8px; text-align: right; font-weight: 500;">
${nextLevelText}
  </div>

<style>
@keyframes shimmerBar { 
0% { transform: translateX(-150%) skewX(-20deg); } 
100% { transform: translateX(200%) skewX(-20deg); } 
}
  </style>
  </div>
  </div>
  </div> 
<div style="font-size:10px; color:rgba(255,255,255,0.5); margin-top:10px; font-weight:bold;">KOLEKSİYONUM</div>
<div class="mdm-insta-frames">
${framesListHtml}
  </div>

<div style="height:1px; background:rgba(255,255,255,0.1); margin: 10px 0;"></div>

${oldMenuHtml} ${superPanelHtml}

<div style="margin-top:20px;">
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
<div style="font-size:11px; color:#fff; font-weight:700; opacity:0.8;">ROZET VİTRİNİ</div>
<button onclick="ModumApp.initShareProcess()" style="background:linear-gradient(45deg, #f09433, #dc2743); border:none; color:white; font-size:10px; padding:4px 12px; border-radius:20px; cursor:pointer; font-weight:bold;">📸 Story Paylaş</button>
  </div>
${badgeGridHtml}
  </div>

  </div> 

<div class="mdm-flip-face-back" style="${cardStyle} position: absolute !important; top: 0; left: 0; margin: 0; z-index:1;">
<div style="text-align:center; padding:20px; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;">
<div style="margin-bottom:20px;">
<div style="font-size:18px; font-weight:bold; color:#fff; margin-bottom:5px;">${name}</div>
<div style="color:${
      currentRank.color
    }; font-size:12px; font-weight:bold; text-transform:uppercase; letter-spacing:1px;">${level} Üye</div>
  </div>
<div style="background:#fff; padding:15px; border-radius:15px; display:inline-block; margin-bottom:25px; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
<img src="${qrApiUrl}" style="width:160px; height:160px; display:block;">
  </div>
<div style="color:rgba(255,255,255,0.8); font-size:13px; margin-bottom:30px; line-height:1.5;">
QR kodunu arkadaşına tarat davet tamamlanınca anında<br>
<b style="color:#4ade80; font-size:16px;">350 XP senin olsun!</b> 🚀
  </div>
<button onclick="document.getElementById('mdm-profile-flipper').classList.remove('is-flipped')" 
style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#fff; padding:10px 40px; border-radius:50px; cursor:pointer; font-weight:bold; transition:0.2s; display:flex; align-items:center; gap:8px;">
<i class="fas fa-undo"></i> Profili Çevir
  </button>
  </div>
  </div>

  </div>
  </div>  
  </div>
`;
  }

  // --- MAĞAZA KAZANÇ TABLOSU (Responsive & Yeni Limitler) ---
  function renderEarningsInfo() {
    // Limitler ve Ödüller
    const tiers = [
      {
        title: "Standart",
        range: "0 - 999 TL",
        xp: "250 XP",
        color: "#94a3b8",
        bg: "rgba(148, 163, 184, 0.1)",
        icon: "🛍️",
        border: "#475569",
      },
      {
        title: "Bronz",
        range: "1.000 - 2.499 TL",
        xp: "500 XP",
        color: "#cd7f32",
        bg: "rgba(205, 127, 50, 0.1)",
        icon: "🥉",
        border: "#b45309",
      },
      {
        title: "Gümüş",
        range: "2.500 - 4.999 TL",
        xp: "1.000 XP",
        color: "#e2e8f0",
        bg: "rgba(226, 232, 240, 0.1)",
        icon: "🥈",
        border: "#94a3b8",
      },
      {
        title: "Efsane",
        range: "5.000 TL +",
        xp: "2.500 XP",
        color: "#fbbf24",
        bg: "rgba(251, 191, 36, 0.1)",
        icon: "👑",
        border: "#fbbf24",
      },
    ];

    let gridHtml = `<div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:10px; margin-top:15px;">`;

    tiers.forEach((t) => {
      gridHtml += `
<div style="border:1px solid ${t.border}; background:${t.bg}; padding:12px 5px; border-radius:10px; text-align:center; display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:90px;">
<div style="font-size:12px; color:${t.color}; font-weight:700; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;">${t.icon} ${t.title}</div>
<div style="font-size:18px; font-weight:800; color:#fff; margin-bottom:4px; text-shadow:0 2px 10px rgba(0,0,0,0.2);">${t.xp}</div>
<div style="font-size:10px; color:#94a3b8; background:rgba(0,0,0,0.3); padding:2px 8px; border-radius:10px;">${t.range}</div>
  </div>
`;
    });

    gridHtml += `</div>`;

    return `
<div class="mdm-card" style="margin-bottom:20px; background:#1e293b; border:1px solid #334155; padding:20px; border-radius:16px;">
<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">
<h3 style="color:#fff; font-size:15px; margin:0; display:flex; align-items:center; gap:8px;">
<i class="fas fa-shopping-cart" style="color:#3b82f6;"></i> Alışveriş ile Kazan
  </h3>
  </div>
<p style="font-size:11px; color:#94a3b8; margin:10px 0 0 0;">Sipariş tutarına göre anında XP kazan ve seviye atla!</p>
${gridHtml}
  </div>
`;
  }

  function renderLeaderboardList(list) {
    if (!list || list.length === 0)
      return '<li style="padding:15px; text-align:center; color:#94a3b8;">Henüz veri yok.</li>';
    return list
      .map((u, i) => {
        var rankIcon = i + 1;
        var color = THEME.textMuted;
        if (i === 0) {
          rankIcon = "🥇";
          color = THEME.gold;
        } else if (i === 1) {
          rankIcon = "🥈";
          color = THEME.silver;
        } else if (i === 2) {
          rankIcon = "🥉";
          color = THEME.bronze;
        }
        return `<li class="mdm-lb-item"><div class="mdm-lb-rank" style="color:${color}">${rankIcon}</div><div class="mdm-lb-info"><div class="mdm-lb-name">${u.name}</div><div class="mdm-lb-level">${u.level}</div></div><div class="mdm-lb-points">${u.points} XP</div></li>`;
      })
      .join("");
  }

  function renderLevelJourney(user) {
    var levels = [
      { name: "Çaylak", minXP: 0 },
      { name: "Usta", minXP: 2500 },
      { name: "Şampiyon", minXP: 7500 },
      { name: "Efsane", minXP: 15000 },
    ];
    var currentXP = user.puan || 0;
    var currentLevelIndex = 0;
    if (user.seviye === "Usta") currentLevelIndex = 1;
    if (user.seviye === "Şampiyon") currentLevelIndex = 2;
    if (user.seviye === "Efsane") currentLevelIndex = 3;
    var totalProgress = Math.min((currentXP / 15000) * 100, 100);
    var stepsHtml = levels
      .map((lvl, idx) => {
        var status =
          idx < currentLevelIndex
            ? "completed"
            : idx === currentLevelIndex
              ? "active"
              : "";
        var icon = idx === 3 ? "👑" : idx + 1;
        if (status === "completed") icon = "✓";
        return `<div class="mdm-step ${status}"><div class="mdm-step-circle">${icon}</div><div class="mdm-step-label">${lvl.name}</div></div>`;
      })
      .join("");
    return `<div class="mdm-level-journey"><div class="mdm-level-header"><span>Mevcut: <b style="color:#fff">${user.seviye}</b></span><span>${currentXP} XP</span></div><div class="mdm-level-steps"><div class="mdm-level-line"></div><div class="mdm-level-line-fill" style="width:${totalProgress}%"></div>${stepsHtml}</div></div>`;
  }
  // --- MAĞAZA SEKMESİ (YENİ TABLI SİSTEM v2.0) ---
  async function renderStoreTab() {
    const container = document.getElementById("mdm-store-container");
    if (!container) return;

    container.innerHTML =
      '<div style="text-align:center; padding:40px; color:#94a3b8;"><i class="fas fa-circle-notch fa-spin"></i> Mağaza Yükleniyor...</div>';

    // 1. Verileri Çek
    const pItems = fetchApi("get_store_items");
    const pHistory = fetchApi("get_user_history", {
      email: APP_STATE.user.email,
    });

    const [res, resHist] = await Promise.all([pItems, pHistory]);

    // 2. Satın alınanları sadeleştir
    let purchasedItems = [];
    if (resHist && resHist.success && resHist.list) {
      purchasedItems = resHist.list.map((h) =>
        (h.action || h.islem || "").toLowerCase(),
      );
    }

    if (res && res.success && res.items.length > 0) {
      // 3. VERİYİ KAYDET (ModumApp.switchStoreCategory kullanabilsin diye)
      APP_STATE.storeContext = {
        items: res.items,
        purchased: purchasedItems,
      };

      // 4. HTML İSKELETİ (SEKMELER + İÇERİK ALANI)
      // Kullanıcıya iki seçenek sunuyoruz: Dijital Kuponlar ve Ürünler
      container.innerHTML = `
<div style="display:flex; gap:10px; margin-bottom:20px; background:#1e293b; padding:5px; border-radius:12px; border:1px solid #334155;">
<button class="mdm-store-tab-btn" data-tab="coupons" onclick="ModumApp.switchStoreCategory('coupons')" 
style="flex:1; padding:12px; border:1px solid transparent; border-radius:8px; cursor:pointer; font-weight:bold; font-size:13px; transition:0.2s; display:flex; align-items:center; justify-content:center; gap:8px;">
<i class="fas fa-ticket-alt"></i> DİJİTAL KUPONLAR
  </button>
<button class="mdm-store-tab-btn" data-tab="products" onclick="ModumApp.switchStoreCategory('products')" 
style="flex:1; padding:12px; border:1px solid transparent; border-radius:8px; cursor:pointer; font-weight:bold; font-size:13px; transition:0.2s; display:flex; align-items:center; justify-content:center; gap:8px;">
<i class="fas fa-gift"></i> KOZMETİK & AKSESUARLAR
  </button>
  </div>

<div id="mdm-store-dynamic-content">
  </div>
`;

      // 5. Varsayılan Olarak "Kuponlar" Sekmesini Aç
      ModumApp.switchStoreCategory("coupons");
    } else {
      container.innerHTML =
        '<div style="text-align:center; padding:40px; color:#94a3b8;">Mağazada aktif ürün yok.</div>';
    }
  }

  // --- GÜÇLENDİRİLMİŞ SAYAÇ MOTORU (TITREME YOK) ---
  function startTimer() {
    if (window.mdmTimerInterval) clearInterval(window.mdmTimerInterval);

    window.mdmTimerInterval = setInterval(() => {
      document.querySelectorAll(".mdm-timer-smart").forEach((el) => {
        let endStr = el.dataset.end;
        if (!endStr || endStr === "-" || endStr === "undefined") return;

        // Tarih Formatı Temizliği
        let safeStr = endStr.trim();
        if (safeStr.includes(" ") && !safeStr.includes("T")) {
          safeStr = safeStr.replace(" ", "T");
        }
        if (safeStr.length <= 10) safeStr += "T23:59:00"; // Saat yoksa ekle

        const end = new Date(safeStr).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        const boxes = el.querySelectorAll(".mdm-tm-val");

        if (isNaN(end)) return;

        // startTimer fonksiyonu içinde:
        // Son 1 saat (3600000 ms) kaldıysa:
        if (diff < 3600000 && diff > 0) {
          // Yazı rengini kırmızı yap
          el.style.color = "#ef4444";
          // Kutucukların border'ını kırmızı yap
          el.style.border = "1px solid #ef4444";
          // Hafif titreme efekti (CSS'te tanımlı pulse animasyonunu hızlandırabilirsin)
          el.style.animation = "pulse 0.5s infinite";
        }

        if (diff < 0) {
          // Süre dolduysa kutuyu değiştir
          el.innerHTML =
            '<div style="color:#ef4444; font-weight:bold; width:100%; text-align:center; padding:4px; font-size:12px;">SÜRE DOLDU</div>';
        } else {
          // Matematiksel Hesap
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);

          // Kutulara SADECE RAKAM Yaz (Yanına "g" vs koyma, sığmaz)
          if (boxes.length >= 4) {
            boxes[0].innerText = d; // Gün (Örn: 20)
            boxes[1].innerText = h < 10 ? "0" + h : h; // Saat (Örn: 05)
            boxes[2].innerText = m < 10 ? "0" + m : m; // Dakika
            boxes[3].innerText = s < 10 ? "0" + s : s; // Saniye
          }
        }
      });
    }, 1000);
  }

  /* --- WINDOW MODUMAPP (FİNAL TEMİZ SÜRÜM) --- */
  window.ModumApp = {
    switchTab: function (tabId, el) {
      ModumApp.logAction("Sekme Gezdi", tabId.toUpperCase());
      APP_STATE.activeTab = tabId;

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      // İçerik Alanlarını Değiştir
      document
        .querySelectorAll(".mdm-tab-content")
        .forEach((d) => d.classList.remove("active"));
      var target = document.getElementById("tab-" + tabId);
      if (target) target.classList.add("active");

      // 🔥 MENÜ AKTİFLİK AYARI (YENİ DOCK İÇİN)
      // Tüm linklerden 'active' sınıfını kaldır
      document
        .querySelectorAll(".mdm-dock-link")
        .forEach((n) => n.classList.remove("active"));

      // Eğer tıklanan element varsa ona ekle
      if (el) {
        el.classList.add("active");
      } else {
        // Eğer element gelmediyse (kodla çağrıldıysa) data-id ile bul
        var autoEl = document.querySelector(
          `.mdm-dock-link[data-id="${tabId}"]`,
        );
        if (autoEl) autoEl.classList.add("active");
      }

      // 🔥 MAĞAZA İSE YENİLE
      if (tabId === "store") {
        renderStoreTab();
      }

      if (tabId === "home") {
        // Liderlik tablosu kodu buraya taşındı
        setTimeout(function () {
          fetchApi("get_masked_leaderboard").then((res) => {
            var lbContainer = document.getElementById("mdm-leaderboard-area");

            if (
              res &&
              res.success &&
              res.list &&
              res.list.length > 0 &&
              lbContainer
            ) {
              var rowsHtml = "";
              var BADGES_ICONS = {
                gorev_adami: "🎯",
                gece_kusu: "👾",
                takim_lideri: "🤝",
                sepet_krali: "🛍️",
                alev_alev: "🔥",
                hazine_avcisi: "🕵️",
                sans_melegi: "🍀",
                bonkor: "🎁",
                lvl_caylak: "🌱",
                lvl_usta: "⚔️",
                lvl_sampiyon: "🦁",
                lvl_efsane: "🐉",
              };

              for (var i = 0; i < res.list.length; i++) {
                var u = res.list[i];
                var index = i;
                var rankClass = "rank-" + (index + 1);
                var icon = index + 1 + ".";
                if (index === 0) icon = "👑";
                if (index === 1) icon = "🥈";
                if (index === 2) icon = "🥉";

                var userName = u.name || "Gizli";
                var userAvatar = "🌱";
                var avatarStyle =
                  "background:transparent; border:none; font-size:18px;";

                var uThemeData =
                  typeof PROFILE_THEMES !== "undefined" &&
                  PROFILE_THEMES[u.theme]
                    ? PROFILE_THEMES[u.theme]
                    : {
                        bg: "#1e293b",
                        border: "rgba(255,255,255,0.1)",
                        glow: "transparent",
                      };
                var rowStyle = `background: ${uThemeData.bg}; border: 1px solid ${uThemeData.border}; box-shadow: 0 0 10px ${uThemeData.glow}40; transition:0.2s;`;

                if (
                  u.avatar &&
                  (u.avatar.includes("http") || u.avatar.includes("data:image"))
                ) {
                  userAvatar = `<img src="${u.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; display:block;">`;
                  avatarStyle =
                    "padding:0; background:transparent; border:none;";
                } else if (u.avatar && BADGES_ICONS[u.avatar]) {
                  userAvatar = BADGES_ICONS[u.avatar];
                }

                var frameDiv = u.frame
                  ? `<div class="mdm-avatar-frame ${u.frame}" style="top:-3px; left:-3px; right:-3px; bottom:-3px; border-width:2px;"></div>`
                  : "";
                var borderStyle = u.frame
                  ? "border: 2px solid transparent;"
                  : "border: 1px solid rgba(255,255,255,0.2);";
                avatarStyle += ` position: relative; overflow: visible; ${borderStyle} border-radius: 50%;`;

                rowsHtml += `
<div class="mdm-lb-row" style="${rowStyle}"> 
<div class="mdm-lb-rank ${rankClass}">${icon}</div>
<div class="mdm-lb-user" style="display:flex; align-items:center;">
<div class="mdm-lb-avatar" style="${avatarStyle}">
${frameDiv} ${userAvatar}
  </div>            
<div>
${userName} 
<span style="font-size:10px; color:#e2e8f0; margin-left:5px; opacity:0.8;">(${
                  u.level || "Çaylak"
                })</span>
  </div>
  </div>
<div class="mdm-lb-xp" style="background:rgba(0,0,0,0.3); color:#fff;">${parseInt(
                  u.points,
                ).toLocaleString()} XP</div>
  </div>`;
              }

              lbContainer.innerHTML = `
<div class="mdm-lb-card" style="margin:0;">
<div class="mdm-lb-header">
<div class="mdm-lb-title"><i class="fas fa-trophy" style="color:#fbbf24;"></i> Zirvedekiler (Top 5)</div>
<div style="font-size:10px; color:#94a3b8;">Canlı Puan Durumu</div>
  </div>
<div class="mdm-lb-list">${rowsHtml}</div>
  </div>`;
            }
          });
        }, 100);
      }

      // 🔥 PROFİL AÇILINCA SADECE PROFİLİ YENİLE (Tablo artık burada değil)
      if (tabId === "profile") {
        var cached = JSON.parse(localStorage.getItem("mdm_user_cache"));
        var profileContainer = document.getElementById("mdm-profile-container");
        if (cached && profileContainer) {
          profileContainer.innerHTML = renderProfileTab(cached);
        }
      }

      if (tabId === "support") {
        ModumApp.loadSupportHistory();
      }
    },
    // 1. GÜNCELLENMİŞ SATIN ALMA (SINIRSIZ ÜRÜN DESTEKLİ 🔄)
    buyItem: function (id, title, cost) {
      if (!APP_STATE.user || !APP_STATE.user.email)
        return alert("Giriş yapmalısın.");

      var currentPoints = parseInt(APP_STATE.user.puan) || 0;
      if (currentPoints < cost) return alert("Yetersiz Puan!");

      // Onay
      if (
        !confirm(title + " (" + cost + " XP) satın alınacak. Onaylıyor musun?")
      )
        return;

      // Butonu Kilitle (Görsel Efekt Başlangıcı)
      var btn = event.target;
      if (btn.tagName !== "BUTTON") btn = btn.closest("button");

      var originalText = "SATIN AL"; // Varsayılan metin
      var originalBg = "";

      if (btn) {
        originalText = btn.innerHTML; // Eski metni sakla
        originalBg = btn.style.background; // Eski rengi sakla
        btn.innerHTML =
          '<i class="fas fa-circle-notch fa-spin"></i> İşleniyor...';
        btn.disabled = true;
        btn.style.opacity = "0.7";
      }

      fetchApi("buy_store_item", {
        email: APP_STATE.user.email,
        itemId: id,
      }).then((res) => {
        if (res && res.success) {
          // Puanı düş
          APP_STATE.user.puan = currentPoints - cost;
          var navXP = document.getElementById("nav-live-xp");
          if (navXP) navXP.innerText = APP_STATE.user.puan + " XP";

          if (APP_STATE.storeContext && APP_STATE.storeContext.items) {
            // Ürünü mağaza listesinden bul
            var foundItem = APP_STATE.storeContext.items.find(
              (x) => x.id == id || x.title === title,
            );

            if (foundItem && foundItem.type === "animated_avatar") {
              // Resim linkini al (Backend'den gelen veriye göre)
              // Not: StoreContext'te 'image' veya 'image_url' veya 'kupon_kodu' alanında link olabilir.
              var imgLink =
                foundItem.image || foundItem.image_url || foundItem.kupon_kodu;

              // Listeyi başlat (yoksa)
              if (!APP_STATE.user.ownedAvatars)
                APP_STATE.user.ownedAvatars = [];

              // Listede yoksa ekle
              if (imgLink && !APP_STATE.user.ownedAvatars.includes(imgLink)) {
                APP_STATE.user.ownedAvatars.push(imgLink);
                console.log("✅ Avatar hafızaya eklendi:", imgLink);
              }

              // Tarayıcı hafızasına yaz (Sayfa yenilenirse gitmesin diye)
              localStorage.setItem(
                "mdm_user_cache",
                JSON.stringify(APP_STATE.user),
              );

              // Mağaza butonunu anında "SAHİPSİN" yapmak için mağazayı yenile
              if (typeof ModumApp.switchStoreCategory === "function") {
                // Hafif gecikmeli çalıştır ki state otursun
                setTimeout(() => {
                  ModumApp.switchStoreCategory("products");
                }, 100);
              }
            }
          }
          // --- KRİTİK DÜZELTME BİTİŞİ ---

          // 🔥 KRİTİK AYRIM: BU ÜRÜN SINIRSIZ MI?
          var lowerTitle = title.toLowerCase();
          var isUnlimited =
            lowerTitle.includes("hak") ||
            lowerTitle.includes("sandık") ||
            lowerTitle.includes("sandik") ||
            lowerTitle.includes("kutu") ||
            lowerTitle.includes("şans") ||
            lowerTitle.includes("sans");

          if (btn) {
            if (isUnlimited) {
              // --- SINIRSIZ ÜRÜNSE (Hak, Sandık) ---
              // 1. Yeşil "Başarılı" yap
              btn.innerHTML = '<i class="fas fa-check"></i> BAŞARILI';
              btn.style.background = "#10b981"; // Yeşil
              btn.style.opacity = "1";

              // 2. 2 Saniye sonra eski haline döndür (Tekrar alabilsin)
              setTimeout(() => {
                btn.innerHTML = "TEKRAR AL 🔄";
                btn.style.background = originalBg; // Eski rengine dön
                btn.disabled = false; // Kilidi aç
              }, 2000);
            } else {
              // --- TEK SEFERLİK ÜRÜNSE (Kupon, Çerçeve) ---
              // Sonsuza kadar kilitle
              btn.innerHTML = '<i class="fas fa-check"></i> ALINDI';
              btn.classList.add("soldout");
              btn.style.background = "#475569";
              btn.style.cursor = "default";
              btn.disabled = true;
              btn.onclick = null;
            }
          }

          // Çerçeve Kontrolü...
          if (lowerTitle.includes("çerçeve") || lowerTitle.includes("frame")) {
            setTimeout(function () {
              updateDataInBackground();
              ModumApp.switchTab("profile");
            }, 1000);
            ModumApp.showToast(
              "Çerçeve satın alındı! Profilinde hemen dene.",
              "success",
            );
          }

          // 2. 🔥 YENİ: HAREKETLİ AVATAR İSE (Burası Eklendi)
          else if (res.message && res.message.includes("avatar")) {
            // Verileri güncelle
            updateDataInBackground().then(() => {
              // A. Eğer Mağazadaysan -> Yenile (Buton 'SAHİPSİN' olsun)
              if (APP_STATE.activeTab === "store") {
                // 500ms bekle ki veritabanı yetişsin
                setTimeout(() => {
                  ModumApp.switchStoreCategory("products");
                }, 500);
              }

              // B. Eğer Profil Düzenle Açıksa -> Kapatıp Aç (Listeye gelsin)
              if (document.getElementById("mdm-edit-modal")) {
                document.getElementById("mdm-edit-modal").remove(); // Kapat
                setTimeout(() => {
                  ModumApp.openEditProfile();
                }, 300); // Yeniden Aç
              }
            });
            ModumApp.showToast(
              "Hareketli avatar eklendi! Profilini süsledi. ✨",
              "success",
            );
          }
          // Sandık kontrolü (Kazı Kazan Aç)
          else if (res.type === "chest") {
            // Sandık animasyonu bitince modal açılsın
            setTimeout(() => {
              ModumApp.openScratchModal(res.reward);
            }, 500);
          }
          // Hak Paketi ise sadece bilgilendir (Buton zaten yeşil oldu)
          else if (isUnlimited) {
            // Hak paketinde alert ile kullanıcıyı durdurmaya gerek yok, buton geri bildirimi yeterli.
            console.log("Hak paketi eklendi.");
          } else {
            alert("✅ " + res.message);
          }

          updateDataInBackground();
        } else {
          // Hata Durumu (Puan yetmezse veya stok biterse)
          alert("❌ " + (res.message || "Hata oluştu"));
          if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.opacity = "1";
          }
        }
      });
    },
    // --- LİSTENİN TAMAMINI YÜKLE ---
    loadMoreCompleted: function () {
      var grid = document.getElementById("mdm-completed-grid");
      var btnBox = document.getElementById("mdm-load-more-box");

      if (grid) {
        // Hepsini bas (Limit yok)
        grid.innerHTML = renderRaffles(APP_STATE.completedRaffles, false);

        // Şık bir efekt: Yeni gelenlere odaklanmasın, sadece buton kaybolsun
        if (btnBox) btnBox.innerHTML = "";
      }
    },
    // --- 🔥 YENİ: ÇERÇEVE SATIN ALMA POP-UP'I ---
    openFramePurchaseModal: function (id, title, cost, frameClass) {
      // Eski modal varsa temizle
      var old = document.getElementById("mdm-buy-frame-modal");
      if (old) old.remove();

      // Kullanıcının puanı
      var myPuan = parseInt(APP_STATE.user.puan) || 0;
      var canAfford = myPuan >= cost;

      // Buton Durumu (Parası yetiyor mu?)
      var btnHtml = "";
      if (canAfford) {
        btnHtml = `<button onclick="ModumApp.buyItem('${id}', '${title}', ${cost}, '${frameClass}'); document.getElementById('mdm-buy-frame-modal').remove();" 
style="background:#10b981; color:white; border:none; padding:12px; width:100%; border-radius:12px; font-weight:bold; cursor:pointer; font-size:14px; box-shadow:0 4px 15px rgba(16,185,129,0.3); display:flex; align-items:center; justify-content:center; gap:8px;">
SATIN AL (-${cost} XP) <i class="fas fa-check-circle"></i>
  </button>`;
      } else {
        btnHtml = `<button disabled style="background:#334155; color:#94a3b8; border:none; padding:12px; width:100%; border-radius:12px; font-weight:bold; cursor:not-allowed;">
YETERSİZ PUAN (Gereken: ${cost})
  </button>`;
      }

      var html = `
<div id="mdm-buy-frame-modal" class="mdm-modal active" style="display:flex; z-index:2147483647; align-items:center; justify-content:center;">
<div class="mdm-modal-content" style="width:90%; max-width:320px; text-align:center; padding:30px; border-radius:24px; background:#1e293b; border:1px solid #334155; position:relative; box-shadow:0 20px 50px rgba(0,0,0,0.5);">

<div onclick="document.getElementById('mdm-buy-frame-modal').remove()" style="position:absolute; top:15px; right:15px; color:#64748b; cursor:pointer; font-size:24px;">&times;</div>

<div style="font-size:10px; color:#fbbf24; font-weight:bold; text-transform:uppercase; letter-spacing:1px; margin-bottom:15px;">KOZMETİK MAĞAZASI</div>

<div style="width:100px; height:100px; margin:0 auto 20px; position:relative; display:flex; align-items:center; justify-content:center;">
<div class="mdm-avatar-frame ${frameClass}" style="top:-5px; left:-5px; right:-5px; bottom:-5px; border-width:4px;"></div>
<div style="width:100%; height:100%; background:#0f172a; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:40px;">👤</div>
  </div>

<h3 style="color:#fff; margin:0 0 5px 0; font-size:18px;">${title}</h3>
<p style="color:#94a3b8; font-size:12px; line-height:1.5; margin-bottom:20px;">
Bu özel çerçeve ile profilini özelleştir ve diğer üyelerden farklı görün!
  </p>

<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:20px; font-size:13px; color:#e2e8f0;">
Mevcut Puanın: <b style="color:#fff">${myPuan} XP</b>
  </div>

${btnHtml}

  </div>
  </div>`;

      var div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);
    },

    // 2. 🔥 KAZI KAZAN MODALI (RELOAD YOK - DONMA YOK)
    openScratchModal: function (rewardAmount) {
      var old = document.getElementById("mdm-scratch-modal");
      if (old) old.remove();

      var html = `
<div id="mdm-scratch-modal" class="mdm-scratch-overlay">
<h2 style="color:white; margin-bottom:20px; text-shadow:0 2px 10px rgba(0,0,0,0.5);">🎁 KAZIMAYA BAŞLA!</h2>

<div class="mdm-scratch-wrapper">
<div class="mdm-scratch-prize">
<div style="font-size:50px;">🏆</div>
<div class="mdm-prize-lbl">KAZANDINIZ</div>
<div class="mdm-prize-val">+${rewardAmount} XP</div>
  </div>

<canvas id="mdm-scratch-canvas" width="300" height="300"></canvas>
  </div>

<div id="mdm-scratch-hint" style="color:#fbbf24; margin-top:20px; font-size:14px; animation:pulse 1s infinite;">👆 Parmağınla veya mouse ile kazı!</div>

<!-- 🔥 DÜZELTME BURADA: location.reload() YERİNE ModumApp.finishScratch() GELDİ -->
<button id="mdm-claim-btn" onclick="ModumApp.finishScratch()" style="display:none; margin-top:20px; background:#10b981; color:white; border:none; padding:12px 40px; border-radius:30px; font-weight:bold; font-size:16px; cursor:pointer; box-shadow:0 5px 20px rgba(16,185,129,0.4);">
HARİKA! KAPAT
  </button>
  </div>`;

      var div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);

      // --- CANVAS AYARLARI ---
      var canvas = document.getElementById("mdm-scratch-canvas");
      var ctx = canvas.getContext("2d");
      var isDrawing = false;

      ctx.fillStyle = "#94a3b8"; // Gümüş Gri
      ctx.fillRect(0, 0, 300, 300);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("MODUMNET", 150, 140);
      ctx.font = "20px Arial";
      ctx.fillText("GÜMÜŞ SANDIK", 150, 170);

      function scratch(x, y) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        checkProgress();
      }

      function getPos(e) {
        var rect = canvas.getBoundingClientRect();
        var touch = e.touches ? e.touches[0] : e;
        return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      }

      canvas.addEventListener("mousedown", function (e) {
        isDrawing = true;
        var p = getPos(e);
        scratch(p.x, p.y);
      });
      canvas.addEventListener("mousemove", function (e) {
        if (isDrawing) {
          var p = getPos(e);
          scratch(p.x, p.y);
        }
      });
      canvas.addEventListener("mouseup", function () {
        isDrawing = false;
      });

      canvas.addEventListener(
        "touchstart",
        function (e) {
          isDrawing = true;
          var p = getPos(e);
          scratch(p.x, p.y);
          e.preventDefault();
        },
        { passive: false },
      );
      canvas.addEventListener(
        "touchmove",
        function (e) {
          if (isDrawing) {
            var p = getPos(e);
            scratch(p.x, p.y);
            e.preventDefault();
          }
        },
        { passive: false },
      );
      canvas.addEventListener("touchend", function () {
        isDrawing = false;
      });

      var completed = false;
      function checkProgress() {
        if (completed) return;
        if (Math.random() > 0.1) return;

        var imageData = ctx.getImageData(0, 0, 300, 300);
        var pixels = imageData.data;
        var transparent = 0;
        for (var i = 0; i < pixels.length; i += 4) {
          if (pixels[i + 3] < 128) transparent++;
        }
        var percent = (transparent / (pixels.length / 4)) * 100;

        if (percent > 40) {
          completed = true;
          canvas.style.transition = "opacity 0.5s";
          canvas.style.opacity = "0";
          document.getElementById("mdm-scratch-hint").style.display = "none";
          document.getElementById("mdm-claim-btn").style.display = "block";
        }
      }
    },
    // --- 🎫 KUPONLARIM SAYFASI (GELİŞMİŞ KOD YAKALAYICI v4) ---
    openMyCouponsModal: function () {
      ModumApp.logAction("Cüzdan", "Kuponlarına Baktı");
      var old = document.getElementById("mdm-coupons-modal");
      if (old) old.remove();

      var html = `
<div id="mdm-coupons-modal" class="mdm-modal" style="display:flex;">
<div class="mdm-modal-content" style="height:80vh; display:flex; flex-direction:column;">
<div class="mdm-modal-header">
<h3 style="margin:0; color:#fff;">🎫 Kupon Cüzdanım</h3>
<div class="mdm-modal-close" onclick="document.getElementById('mdm-coupons-modal').remove()">×</div>
  </div>
<div id="mdm-coupons-list" style="flex:1; overflow-y:auto; padding:15px; display:flex; flex-direction:column; gap:10px;">
<div style="text-align:center; padding:40px; color:#94a3b8;">
<i class="fas fa-circle-notch fa-spin"></i> Kuponlar taranıyor...
  </div>
  </div>
  </div>
  </div>`;

      var div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);

      fetchApi("get_user_history", { email: APP_STATE.user.email }).then(
        (res) => {
          var listContainer = document.getElementById("mdm-coupons-list");

          if (res && res.success && res.list.length > 0) {
            var validCoupons = [];

            // Yasaklı kelimeler (Sandık vb.)
            var forbiddenWords = [
              "hak",
              "hakkı",
              "çekiliş",
              "cekilis",
              "sandık",
              "sandik",
              "kutu",
              "chest",
              "box",
              "xp",
              "puan",
              "görev",
              "gorev",
              "frame",
              "çerçeve",
            ];

            res.list.forEach((item) => {
              var rawTitle = item.action || item.islem || "";
              var lowerTitle = rawTitle.toLowerCase();

              // 1. Sadece "Mağaza" işlemlerini al
              if (
                lowerTitle.includes("mağaza") ||
                lowerTitle.includes("magaza")
              ) {
                // 2. Yasaklı kelime kontrolü
                var isBanned = forbiddenWords.some((word) =>
                  lowerTitle.includes(word),
                );
                if (isBanned) return;

                // 🔥 KOD ÇÖZÜCÜ MOTORU (GELİŞMİŞ) 🔥

                // A. Önce direkt veritabanı alanlarına bak
                var finalCode = item.kupon_kodu || item.code || item.couponCode;

                // B. Eğer kod yoksa veya geçersizse Başlık'tan avla
                if (
                  !finalCode ||
                  finalCode === "OTOMATIK" ||
                  finalCode === "BULUNAMADI" ||
                  finalCode === "-"
                ) {
                  // Yöntem 1: Parantez içi "(Kod: XYZ)"
                  var match1 = rawTitle.match(/\(Kod:\s*([^\)]+)\)/i);
                  if (match1 && match1[1]) {
                    finalCode = match1[1];
                  }
                  // Yöntem 2: "Kod:" kelimesinden sonrası
                  else if (rawTitle.toLowerCase().includes("kod:")) {
                    var parts = rawTitle.split(/kod:/i);
                    if (parts[1])
                      finalCode = parts[1]
                        .trim()
                        .split(" ")[0]
                        .replace(")", "");
                  }
                  // Yöntem 3: Hiçbir şey bulamazsa "OTOMATIK" yaz ama kullanıcıya gösterme
                  else {
                    finalCode = "KOD ÜRETİLİYOR...";
                  }
                }

                // Temizle
                finalCode = finalCode.trim().toUpperCase();

                validCoupons.push({
                  title: rawTitle
                    .replace("Mağaza: ", "")
                    .replace("Mağaza:", "")
                    .replace("(Alım)", "")
                    .trim(),
                  code: finalCode,
                  date: item.date,
                });
              }
            });

            if (validCoupons.length > 0) {
              var listHtml = "";
              validCoupons.forEach((c) => {
                var codeDisplay = c.code;
                var btnStyle = "background:#f472b6;";
                var copyBtn = "";

                // Eğer kod "ÜRETİLİYOR" veya "OTOMATIK" ise butonu gizle, uyarı ver
                if (
                  codeDisplay.includes("ÜRETİLİYOR") ||
                  codeDisplay === "OTOMATIK" ||
                  codeDisplay === "BULUNAMADI"
                ) {
                  codeDisplay = `<span style="font-size:11px; color:#fbbf24;">⚠️ Kod İşleniyor...<br><small>Lütfen birazdan tekrar deneyin</small></span>`;
                } else {
                  // Geçerli kod varsa kopyala butonu koy
                  copyBtn = `<button onclick="navigator.clipboard.writeText('${c.code}'); this.innerText='Kopyalandı!';" style="${btnStyle} color:white; border:none; padding:6px 12px; border-radius:4px; font-size:11px; cursor:pointer; font-weight:bold;">KOPYALA</button>`;
                }

                listHtml += `
<div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); padding:15px; border-radius:12px;">
<div style="color:#fff; font-weight:bold; font-size:14px;">${c.title}</div>
<div style="color:#64748b; font-size:10px; margin-bottom:5px;">${c.date} tarihinde alındı</div>

<div style="background:#1e293b; border:1px dashed #475569; padding:8px; border-radius:6px; margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
<span style="font-family:monospace; color:#f472b6; font-size:16px; letter-spacing:1px; font-weight:bold;">${codeDisplay}</span>
${copyBtn}
  </div>
  </div>`;
              });
              listContainer.innerHTML = listHtml;
            } else {
              listContainer.innerHTML =
                '<div style="text-align:center; padding:40px; color:#64748b;"><i class="fas fa-ticket-alt" style="font-size:32px; margin-bottom:10px; opacity:0.3;"></i><br>Kupon cüzdanınız boş.<br><small>Mağazadan yeni kuponlar alabilirsiniz.</small></div>';
            }
          } else {
            listContainer.innerHTML =
              '<div style="text-align:center; padding:40px; color:#64748b;">Geçmiş bulunamadı.</div>';
          }
        },
      );
    },
    // --- 🎉 HOŞGELDİN KUTLAMASI ---
    checkWelcome: function (isNewUser, bonusAmount) {
      if (isNewUser) {
        // Konfeti Patlat
        var duration = 3000;
        var end = Date.now() + duration;
        (function frame() {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();

        // Modal Göster
        var html = `
<div id="mdm-welcome-modal" class="mdm-modal active" style="z-index:999999;">
<div class="mdm-modal-content" style="text-align:center; background:linear-gradient(135deg, #4f46e5, #9333ea); border:2px solid #fff;">
<div style="font-size:60px; margin-bottom:10px;">👋</div>
<h2 style="color:#fff; text-shadow:0 2px 10px rgba(0,0,0,0.3);">ARAMIZA HOŞ GELDİN!</h2>
<p style="color:#e0e7ff; font-size:16px;">Seni gördüğümüze çok sevindik. İşte başlangıç hediyen:</p>
<div style="font-size:40px; font-weight:900; color:#fbbf24; text-shadow:0 0 20px #b45309; margin:20px 0;">+${bonusAmount} XP</div>
<button onclick="document.getElementById('mdm-welcome-modal').remove()" style="background:#fff; color:#4f46e5; padding:12px 40px; border-radius:30px; font-weight:bold; border:none; cursor:pointer; box-shadow:0 5px 20px rgba(0,0,0,0.3);">TEŞEKKÜRLER</button>
  </div>
  </div>`;
        document.body.insertAdjacentHTML("beforeend", html);
      }
    },
    // ======================================================
    // 🚀 ZİNCİRLEME KATILIM SİSTEMİ (Gizlilik -> Ortaklık -> Katıl)
    // ======================================================

    // 1. GİRİŞ NOKTASI (Butona basınca burası çalışır)
    joinRaffle: function (raffleId, raffleTitle) {
      // Misafir kontrolü
      if (!APP_STATE.user || !APP_STATE.user.email) {
        this.showGuestPopup("raffle");
        return;
      }

      // Başlık gelmediyse varsayılan yaz
      if (!raffleTitle || raffleTitle === "undefined")
        raffleTitle = "Çekiliş Fırsatı";

      // 🔥 KONTROL BURADA (Tek sefer ve temiz)
      if (APP_STATE.user.privacyApproved === true) {
        // ✅ ONAYLI: Direkt geç
        this.openBuddyModal(raffleId, raffleTitle);
      } else {
        // ❌ ONAYSIZ: Mavi kutuyu aç
        this.openPrivacyModal(raffleId, raffleTitle);
      }
    },

    // 2. GİZLİLİK SÖZLEŞMESİ PENCERESİ (Sadece 1 kez çıkar)
    openPrivacyModal: function (raffleId, raffleTitle) {
      var old = document.getElementById("mdm-privacy-modal");
      if (old) old.remove();

      var html = `
<div id="mdm-privacy-modal" class="mdm-modal active" style="z-index:9999999; display:flex; align-items:center; justify-content:center;">
<div class="mdm-modal-content" style="width:90%; max-width:400px; background:#1e293b; border:1px solid #334155; border-radius:16px; padding:25px; text-align:center;">

<div style="font-size:40px; margin-bottom:15px;">🛡️</div>
<h3 style="color:#fff; margin:0 0 10px 0;">Güvenlik Onayı</h3>
<p style="color:#cbd5e1; font-size:13px; line-height:1.5; margin-bottom:20px;">
Çekilişlere katılabilmek ve ödül kazanabilmek için <a href="https://modum.tr/gizlilik-sozlesmesi/" target="_blank" style="color:#3b82f6; font-weight:bold;">Gizlilik Sözleşmesi</a>'ni okuyup onaylamanız gerekmektedir.
<br><br>
<span style="color:#f59e0b; font-size:11px;">* Bu onayı sadece bir kez vermeniz yeterlidir.</span>
  </p>

<button onclick="ModumApp.approvePrivacy('${raffleId}', '${raffleTitle}')" class="mdm-btn-approve">
OKUDUM, ONAYLIYORUM ✅
  </button>

<div onclick="document.getElementById('mdm-privacy-modal').remove()" style="margin-top:15px; color:#64748b; cursor:pointer; font-size:12px;">Vazgeç</div>
  </div>
  </div>`;

      var d = document.createElement("div");
      d.innerHTML = html;
      document.body.appendChild(d);
    },

    // Gizliliği Onayla ve Devam Et
    approvePrivacy: function (raffleId, raffleTitle) {
      var btn = document.querySelector(".mdm-btn-approve");
      if (btn) {
        btn.innerText = "Kaydediliyor...";
        btn.disabled = true;
      }

      fetchApi("approve_privacy_policy", {
        email: APP_STATE.user.email,
      }).then((res) => {
        if (res && res.success) {
          // 🔥 TARAYICIYI GÜNCELLE (Sayfa yenilenmese bile hatırlar)
          APP_STATE.user.privacyApproved = true;
          localStorage.setItem(
            "mdm_user_cache",
            JSON.stringify(APP_STATE.user),
          );

          // Kutuyu kapat
          document.getElementById("mdm-privacy-modal").remove();

          // Sonraki adıma geç
          ModumApp.openBuddyModal(raffleId, raffleTitle);
        } else {
          alert("Hata oluştu.");
          if (btn) btn.disabled = false;
        }
      });
    },

    // 3. ŞANS ORTAĞI & PAYLAŞIM PENCERESİ (Her katılımda çıkar)
    openBuddyModal: function (raffleId, raffleTitle) {
      var old = document.getElementById("mdm-modal-buddy");
      if (old) old.remove();

      // Referans linkini al
      var refCode =
        APP_STATE.user.referansKodu || APP_STATE.user.uid || "MODUM";
      var refLink = SITE_URL + "?ref=" + refCode;

      // WhatsApp Mesajı
      var waText = encodeURIComponent(
        `Selam! ModumNet'te harika bir çekiliş var: "${raffleTitle}". Bu linkten üye olursan ikimiz de kazanırız! 🚀\n\nLink: ${refLink}`,
      );
      var waLink = `https://wa.me/?text=${waText}`;

      var html = `
<div id="mdm-modal-buddy" class="mdm-modal active" style="z-index:9999999; display:flex; align-items:center; justify-content:center;">
<div class="mdm-modal-content" style="width:90%; max-width:450px; background:#1e293b; border:1px solid #334155; border-radius:16px; padding:0; overflow:hidden;">

<div style="background:linear-gradient(135deg, #1e293b, #0f172a); padding:20px; text-align:center; border-bottom:1px solid #334155;">
<h3 style="color:#fff; margin:0; font-size:18px;">Son Bir Adım! 🚀</h3>
<div style="font-size:12px; color:#94a3b8; margin-top:5px;">${raffleTitle}</div>
  </div>

<div style="padding:25px;">

<div style="background:rgba(255,255,255,0.03); border:1px dashed #3b82f6; border-radius:10px; padding:15px; margin-bottom:20px; text-align:center;">
<div style="color:#60a5fa; font-weight:bold; font-size:14px; margin-bottom:5px;">
🤝 Şansını Arkadaşlarınla Paylaş!
  </div>
<p style="font-size:11px; color:#cbd5e1; line-height:1.4; margin-bottom:15px;">
Aşağıdaki linki arkadaşlarına gönder. Onlar üye olduğunda hem sen <b>350 XP</b> kazan, hem de onlar kazandığında sana sürpriz ödüller gelsin!
  </p>

<a href="${waLink}" target="_blank" style="display:flex; align-items:center; justify-content:center; gap:8px; background:#25D366; color:white; text-decoration:none; padding:10px; border-radius:8px; font-weight:bold; margin-bottom:10px; font-size:13px; box-shadow:0 4px 10px rgba(37, 211, 102, 0.3);">
<i class="fab fa-whatsapp" style="font-size:18px;"></i> WhatsApp ile Gönder
  </a>

<div style="display:flex; gap:5px;">
<input type="text" value="${refLink}" readonly style="flex:1; padding:8px; background:#0f172a; border:1px solid #334155; color:#94a3b8; border-radius:6px; font-size:11px;">
<button onclick="navigator.clipboard.writeText('${refLink}'); this.innerText='Kopyalandı!'" style="background:#334155; color:white; border:none; border-radius:6px; padding:0 15px; cursor:pointer; font-size:11px;">Kopyala</button>
  </div>
  </div>

<button onclick="ModumApp.confirmFinalJoin('${raffleId}')" class="mdm-btn-lucky" style="width:100%; justify-content:center; font-size:16px; padding:15px;">
PAYLAŞMADAN DEVAM ET & KATIL ✅
  </button>

<div onclick="document.getElementById('mdm-modal-buddy').remove()" style="text-align:center; margin-top:15px; color:#ef4444; cursor:pointer; font-size:12px; font-weight:bold;">İptal Et ve Çık</div>

  </div>
  </div>
  </div>`;

      var d = document.createElement("div");
      d.innerHTML = html;
      document.body.appendChild(d);
    },

    confirmFinalJoin: function (raffleId) {
      var btn = document.querySelector("#mdm-modal-buddy .mdm-btn-lucky");
      if (btn) {
        btn.innerHTML =
          '<i class="fas fa-circle-notch fa-spin"></i> İşleniyor...';
        btn.disabled = true;
      }

      // Backend'e SADECE katılım isteği atıyoruz
      fetchApi("join_raffle", {
        email: APP_STATE.user.email,
        raffleId: raffleId,
      }).then((d) => {
        document.getElementById("mdm-modal-buddy").remove();
        if (d) {
          alert(d.message);
          if (d.success) {
            // 🔥 YENİ EKLENEN KISIM: Eski hafızayı siliyoruz ki sayı güncellensin
            localStorage.removeItem("mdm_cache_get_showcase_data");
            if (APP_STATE.user && APP_STATE.user.email) {
              localStorage.removeItem(
                "mdm_cache_get_user_tickets_" + APP_STATE.user.email,
              );
            }
            // -------------------------------------------------------------

            location.reload(); // Şimdi sayfayı yeniliyoruz
          }
        }
      });
    },
    // 3. 🔥 YENİ: SAYFAYI YENİLEMEDEN KAPATAN FONKSİYON
    finishScratch: function () {
      // Modalı kaldır
      var m = document.getElementById("mdm-scratch-modal");
      if (m) m.remove();

      // Verileri arka planda güncelle (Sayfa yenilenmez!)
      if (typeof updateDataInBackground === "function") {
        updateDataInBackground();
      }

      // Puanların güncellendiğini göstermek için mağaza sekmesini yenile
      if (APP_STATE.activeTab === "store") {
        setTimeout(function () {
          renderStoreTab();
        }, 500);
      }
    },
    // --- DESTEK SİSTEMİ FONKSİYONLARI ---

    // 1. Değerlendirme Gönder (Görev Tamamlar)
    submitEvaluation: function () {
      var msg = document.getElementById("eval-message").value;
      if (!msg) return alert("Lütfen kısa bir yorum yazın.");

      if (!APP_STATE.user || !APP_STATE.user.email)
        return alert("Giriş yapmalısın.");

      fetchApi("submit_feedback", {
        email: APP_STATE.user.email,
        message: msg,
        type: "evaluation", // 🔥 Bu sayede görev tetiklenir
        taskId: "alisveris_guru_v1",
      }).then((res) => {
        alert(res.message);
        document.getElementById("eval-message").value = ""; // Temizle

        // Görevleri yenile ki yeşil tik olsun
        setTimeout(function () {
          if (typeof loadTasksData === "function") loadTasksData();
        }, 1000);
      });
    },

    // 2. Destek Talebi Gönder
    submitSupport: function () {
      var subj = document.getElementById("supp-subject").value;
      var msg = document.getElementById("supp-message").value;
      var phone = document.getElementById("supp-phone").value;

      if (!subj || !msg) return alert("Konu ve mesaj zorunludur.");
      if (!APP_STATE.user || !APP_STATE.user.email)
        return alert("Giriş yapmalısın.");

      fetchApi("submit_feedback", {
        email: APP_STATE.user.email,
        subject: subj,
        message: msg,
        phone: phone,
        type: "support", // Normal destek
      }).then((res) => {
        alert(res.message);
        // Formu temizle
        document.getElementById("supp-subject").value = "";
        document.getElementById("supp-message").value = "";

        // Listeyi yenile
        ModumApp.loadSupportHistory();
      });
    },

    // 3. Taleplerimi Yükle (Akıllı Bildirim - Hafızalı Sistem)
    loadSupportHistory: function (silentMode = false) {
      var container = document.getElementById("mdm-support-history");

      // Eğer sessiz mod değilse ve container yoksa çık
      if (!silentMode && !container) return;

      if (!APP_STATE.user || !APP_STATE.user.email) {
        if (container)
          container.innerHTML =
            '<div style="padding:20px; text-align:center; color:#64748b;">Giriş yapmalısın.</div>';
        return;
      }

      fetchApi("get_user_requests", { email: APP_STATE.user.email }).then(
        (res) => {
          if (res && res.success) {
            // --- 1. EN SON CEVAPLANAN TALEBİN ID'SİNİ BUL ---
            // Listeyi tara, cevaplanmış en yeni talebin ID'sini al
            var latestReplyId = "none";
            if (res.list && res.list.length > 0) {
              // Listede 'Cevaplandı' statüsünde veya admin cevabı olan ilk (en yeni) kaydı bul
              var answeredTicket = res.list.find(
                (t) =>
                  t.status === "Cevaplandı" ||
                  t.status === "answered" ||
                  (t.adminReply && t.adminReply.length > 1),
              );
              if (answeredTicket) {
                latestReplyId = answeredTicket.ticketId; // Örn: #TLP-1234
              }
            }

            // --- 2. KIRMIZI NOKTA YÖNETİMİ ---
            var navItems = document.querySelectorAll(".mdm-nav-item");
            navItems.forEach((el) => {
              if (el.innerText.includes("Destek")) {
                var dot = el.querySelector(".notification-dot");

                if (silentMode) {
                  // --- SESSİZ MOD (ARKA PLAN) ---
                  // Tarayıcı hafızasındaki son okunan ID'yi al
                  var lastReadId = localStorage.getItem("mdm_last_read_ticket");

                  // Eğer bildirim varsa VE (daha önce okumamışsak VEYA yeni bir ID geldiyse)
                  if (res.hasNotification && latestReplyId !== lastReadId) {
                    // Nokta yoksa koy
                    if (!dot) {
                      el.style.position = "relative";
                      var posStyle =
                        window.innerWidth < 768
                          ? "top:5px; right:15px;"
                          : "top:-2px; right:-5px;";
                      el.innerHTML += `<div class="notification-dot" style="position:absolute; ${posStyle} width:10px; height:10px; background:#ef4444; border:2px solid #1e293b; border-radius:50%; box-shadow:0 0 5px #ef4444; z-index:10;"></div>`;
                    }
                  }
                } else {
                  // --- NORMAL MOD (SEKME AÇIK) ---
                  // Kullanıcı şu an listeyi görüyor, noktayı sil
                  if (dot) dot.remove();

                  // 🔥 ŞU ANKİ EN YENİ CEVABI "OKUNDU" OLARAK HAFIZAYA KAYDET
                  // Böylece 10 saniye sonraki kontrolde nokta geri gelmeyecek
                  if (latestReplyId !== "none") {
                    localStorage.setItem("mdm_last_read_ticket", latestReplyId);
                  }
                }
              }
            });

            // --- 3. LİSTELEME (Sadece Sekme Açıksa Yap) ---
            if (!silentMode && container && res.list.length > 0) {
              var html = "";
              res.list.forEach((t) => {
                var statusColor =
                  t.status === "Cevaplandı" ? "#10b981" : "#fbbf24";
                var replyHtml = "";
                if (t.adminReply) {
                  replyHtml = `
<div style="margin-top:10px; background:rgba(16, 185, 129, 0.1); border-left:3px solid #10b981; padding:8px; font-size:11px; color:#e2e8f0;">
<div style="font-weight:bold; color:#10b981; margin-bottom:2px;">Yetkili Cevabı:</div>
${t.adminReply}
  </div>`;
                }

                html += `
<div style="background:#1e293b; border:1px solid #334155; padding:12px; border-radius:8px; margin-bottom:10px;">
<div style="display:flex; justify-content:space-between; margin-bottom:5px;">
<span style="font-weight:bold; color:#fff; font-size:13px;">${t.subject}</span>
<span style="font-size:10px; color:${statusColor}; border:1px solid ${statusColor}; padding:2px 6px; border-radius:4px;">${t.status}</span>
  </div>
<div style="font-size:12px; color:#94a3b8; line-height:1.4;">${t.message}</div>
<div style="font-size:9px; color:#64748b; margin-top:5px; text-align:right;">${t.date} | ${t.ticketId}</div>
${replyHtml}
  </div>`;
              });
              container.innerHTML = html;
            } else if (!silentMode && container) {
              container.innerHTML =
                '<div style="padding:20px; text-align:center; color:#64748b;">Henüz destek talebiniz yok.</div>';
            }
          }
        },
      );
    },
    // --- GÖREV FONKSİYONLARI ---

    // 1. Görev Sekmesini Aç ve Yükle
    openTasksTab: function (el) {
      this.switchTab("tasks", el);
      loadTasksData(); // Görevleri çek

      // 🔥 SERİ ÇUBUKLARINI YENİDEN ÇİZ
      // Sekme görünür olduğu an çizim yapılırsa ekrana yansır.
      var streakContainer = document.getElementById("mdm-streak-container");
      if (streakContainer && APP_STATE.user) {
        streakContainer.innerHTML = renderStreakBars(
          APP_STATE.user.gunlukSeri || 0,
        );
      }
    },
    // --- 1. ADIM: ANINDA YÖNLENDİRME (KEEPALIVE TEKNOLOJİSİ) ---
    goAndComplete: function (taskId, link) {
      // Hedef linki belirle
      var targetLink =
        link && link.length > 2 && link !== "#" ? link : "/tum-urunler";

      // Giriş yapmışsa arkaya sinyal fırlat
      if (APP_STATE.user && APP_STATE.user.email) {
        // 🔥 SİHİRLİ KOD: keepalive
        // Bu sayede sayfa değişse bile istek iptal olmaz, sunucuya ulaşır.
        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            islem: "complete_task_step",
            email: APP_STATE.user.email,
            taskId: taskId,
            step: 1,
          }),
          keepalive: true, // <--- İŞTE ÇÖZÜM BU!
        }).catch((e) => console.log("Hata (Önemsiz):", e));
      }

      // HİÇ BEKLEMEDEN DİREKT GİT
      window.location.href = targetLink;
    },

    // ======================================================
    // DÜZELTME 1: YASAKLI SAYFA KONTROLÜ (GARANTİ YÖNTEM)
    // ======================================================
    isPageRestricted: function () {
      var fullUrl = window.location.href.toLowerCase();

      // Bu kelimeler URL'de geçiyorsa kutu ASLA çıkmaz
      var forbidden = [
        "cekilisler",
        "kullanici-giris",
        "kullanici-kayit",
        "sepet", // sepet, sepetim, alisveris-sepetim hepsini yakalar
        "odeme",
        "uye-girisi", // Faprika alternatif giriş linkleri
        "uye-kayit",
      ];

      for (var i = 0; i < forbidden.length; i++) {
        if (fullUrl.indexOf(forbidden[i]) > -1) return true;
      }
      return false;
    },

    // ======================================================
    // DÜZELTME 2: KUTUYU ZORLA BAŞLATMA (RÜTBE LİMİTLİ 👑)
    // ======================================================
    initSurpriseSystem: function () {
      // 1. Yasaklı sayfadaysak dur
      if (this.isPageRestricted()) {
        return;
      }

      // 2. Günlük limit kontrolü (localStorage sıfırlama mantığı)
      var todayStr = new Date().toLocaleDateString("tr-TR");
      var savedDay = localStorage.getItem("mdm_egg_day");

      // Gün değiştiyse sayacı sıfırla
      if (savedDay !== todayStr) {
        localStorage.setItem("mdm_egg_day", todayStr);
        localStorage.setItem("mdm_egg_count", 0);
      }

      // 🔥 RÜTBEYE GÖRE LİMİT BELİRLEME
      var myLevel =
        APP_STATE.user && APP_STATE.user.seviye
          ? APP_STATE.user.seviye
          : "Çaylak";
      var limit = 5; // Varsayılan (Çaylak)
      if (myLevel === "Usta") limit = 8;
      if (myLevel === "Şampiyon") limit = 12;
      if (myLevel === "Efsane") limit = 20;

      var collectedCount = parseInt(localStorage.getItem("mdm_egg_count")) || 0;

      // Eğer limit dolduysa gösterme
      if (collectedCount >= limit) {
        return;
      }

      // 3. Kutuyu Göster (3 saniye gecikmeli)
      setTimeout(() => {
        this.showEgg(limit); // Limiti parametre olarak gönder
      }, 3000);
    },

    // 4. Kutuyu Ekrana Bas (STYLES JS İÇİNDE - EMOJİ VERSİYON)
    showEgg: function (limitOverride) {
      if (this.isPageRestricted()) return;

      // Limiti tekrar hesapla (Parametre gelmezse diye güvenlik)
      var limit = limitOverride || 5;
      if (!limitOverride) {
        var myLevel =
          APP_STATE.user && APP_STATE.user.seviye
            ? APP_STATE.user.seviye
            : "Çaylak";
        if (myLevel === "Usta") limit = 8;
        if (myLevel === "Şampiyon") limit = 12;
        if (myLevel === "Efsane") limit = 20;
      }

      var collectedCount = parseInt(localStorage.getItem("mdm_egg_count")) || 0;
      if (collectedCount >= limit) return; // Rütbe limitine göre dur

      // Varsa sil, yenisini yap
      var old = document.getElementById("mdm-surprise-egg");
      if (old) old.remove();

      var btn = document.createElement("div");
      btn.id = "mdm-surprise-egg";
      btn.onclick = function () {
        ModumApp.clickEgg(this);
      };

      // --- 🔥 GÖRÜNÜM AYARLARI (GÖZDEN KAÇMASI İMKANSIZ) ---
      btn.innerHTML = "🎁"; // Resim değil, EMOJİ!

      Object.assign(btn.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: "70%",
        right: "-100px", // Başlangıçta gizli
        width: "70px",
        height: "70px",
        fontSize: "40px", // Emojinin boyutu
        backgroundColor: "#ef4444", // KIPKIRMIZI ARKAPLAN
        border: "3px solid #fcd34d", // SARI ÇERÇEVE
        borderRadius: "50%",
        boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)",
        zIndex: "2147483647", // En üst katman
        cursor: "pointer",
        transition: "right 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Yaylanma efekti
      });

      // Tooltip (Konuşma Balonu)
      var tip = document.createElement("div");
      tip.innerText = "Beni Yakala!";
      Object.assign(tip.style, {
        position: "absolute",
        bottom: "-25px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        color: "black",
        padding: "2px 8px",
        borderRadius: "10px",
        fontSize: "10px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        pointerEvents: "none",
      });
      btn.appendChild(tip);

      document.body.appendChild(btn);

      // Ekrana Kaydır
      setTimeout(() => {
        btn.style.right = "20px";
      }, 100);

      // 45 Saniye sonra kaybol
      setTimeout(() => {
        if (btn && btn.style.right === "20px") {
          btn.style.right = "-100px";
          setTimeout(() => {
            btn.remove();
          }, 500);
          this.scheduleNextEgg();
        }
      }, 45000);
    },

    // ----------------------------------------------------------------
    // 🔥 DÜZELTME 1: KULLANICIYI DAHA İYİ TANIYAN FONKSİYON
    // ----------------------------------------------------------------
    detectUserInstant: function () {
      // 1. Cache Kontrolü
      var cached = JSON.parse(localStorage.getItem("mdm_user_cache"));
      if (cached && cached.email) return cached;

      // 2. Faprika Input Kontrolü (Genel)
      var inputs = [
        'input[name="Email"]',
        "#Email",
        "#MemberEmail",
        ".member-email",
      ];
      for (var i = 0; i < inputs.length; i++) {
        var el = document.querySelector(inputs[i]);
        if (el && el.value && el.value.includes("@")) {
          return { email: el.value, name: "Üye" }; // Bulduk!
        }
      }

      // 3. Link Kontrolü (Hesabım linki varsa giriş yapılmıştır)
      // Faprika'da genelde giriş yapınca "Hesabım" linki görünür
      var accountLink = document.querySelector('a[href*="/hesabim"]');
      if (accountLink) {
        // Ama e-postayı bulmamız lazım. Hesabım sayfasında değilsek e-postayı göremeyebiliriz.
        // Bu durumda Backend'e "Giriş Var ama Mail Yok" diyemeyiz.
        // Eğer sayfada mail yoksa mecburen misafir muamelesi yapmak zorundayız
        // VEYA daha önce cache'e attıysak onu kullanırız.
      }

      return null;
    },

    // --- KUTUYA TIKLAMA (ORİJİNAL MİSAFİR MANTIĞI) ---
    clickEgg: async function (el) {
      // Kilit kontrolü (Çift tıklamayı önle)
      if (el.dataset.processing === "true") return;
      el.dataset.processing = "true";

      // 1. Efekt: Kutuyu hemen gizle
      el.style.right = "-100px";
      setTimeout(() => {
        el.remove();
      }, 500);

      // 2. KİMLİK KONTROLÜ (Hızlıca bak)
      if (!APP_STATE.user || !APP_STATE.user.email) {
        // Cache'e son bir bakış atalım
        var cached = JSON.parse(localStorage.getItem("mdm_user_cache"));
        if (cached && cached.email) {
          APP_STATE.user = cached;
        } else {
          // Son şans: Sayfada gizli e-posta var mı? (Dedektifi çağır)
          // (this.detectUser DEĞİL, direkt detectUser())
          var freshUser = await detectUser();
          if (freshUser && freshUser.email) {
            APP_STATE.user = freshUser;
          }
        }
      }

      // 3. KARAR ANI: KİMLİK HALA YOKSA -> MİSAFİR POP-UP'I AÇ!
      if (!APP_STATE.user || !APP_STATE.user.email) {
        // 🔥 İŞTE BURASI: Seni bozan yer burasıydı.
        // Artık hata vermiyoruz, direkt misafir kutusunu açıyoruz.
        this.showGuestPopup();

        // Bir sonraki kutuyu planla
        ModumApp.scheduleNextEgg();
        return;
      }

      fetchApi("collect_hidden_egg", { email: APP_STATE.user.email }).then(
        (res) => {
          if (res && res.success) {
            var earned = res.earned || 20; // Kazanılan puan
            var newTotal = res.newTotal; // Yeni Toplam Puan (Backend'den gelirse)

            // Puanı güncelle
            if (newTotal) {
              APP_STATE.user.puan = parseInt(newTotal);
            } else {
              // Backend göndermezse biz ekleyelim
              APP_STATE.user.puan =
                (parseInt(APP_STATE.user.puan) || 0) + parseInt(earned);
            }

            // 1. Üst Barı Anında Güncelle
            var navXP = document.getElementById("nav-live-xp");
            if (navXP)
              navXP.innerText = APP_STATE.user.puan.toLocaleString() + " XP";

            var navNameXP = document.getElementById("nav-user-name");
            if (navNameXP) navNameXP.innerText = APP_STATE.user.puan + " XP";

            // 2. Hafızayı Güncelle (Sayfa yenilenirse gitmesin)
            localStorage.setItem(
              "mdm_user_cache",
              JSON.stringify(APP_STATE.user),
            );

            // 3. Ödül Pop-up'ını Göster
            ModumApp.showMemberPopup(earned);

            // C. Arka planı güncelle
            setTimeout(function () {
              if (typeof loadTasksData === "function") loadTasksData();
              try {
                updateDataInBackground(document.getElementById(TARGET_ID));
              } catch (e) {}
            }, 2000);
          } else {
            alert("⚠️ " + (res.message || "Hata oluştu."));
          }
        },
      );
    },

    scheduleNextEgg: function () {
      // 1 dakika sonra yeni kutu
      setTimeout(() => {
        this.showEgg();
      }, 60000);
    },

    // POPUP: ÜYE (Turuncu)
    showMemberPopup: function (xp) {
      var old = document.getElementById("mdm-reward-popup");
      if (old) old.remove();
      var html = `
<div class="mdm-popup-overlay" id="mdm-reward-popup" style="display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:2147483647; align-items:center; justify-content:center;">
<div style="background:#fff; width:90%; max-width:350px; padding:30px; border-radius:20px; text-align:center; position:relative; box-shadow:0 0 50px rgba(255,215,0,0.5);">
<div style="font-size:60px; margin-bottom:10px;">🎁</div>
<div style="color:#d97706; font-size:20px; font-weight:900; margin-bottom:10px;">GİZLİ HAZİNEYİ BULDUN!</div>
<div style="color:#4b5563; font-size:13px; margin-bottom:20px;">Tebrikler! +${xp} XP hesabına eklendi.</div>
<button onclick="document.getElementById('mdm-reward-popup').remove()" style="background:linear-gradient(to bottom, #fbbf24, #f59e0b); color:white; border:none; padding:12px 30px; border-radius:50px; font-weight:bold; cursor:pointer; width:100%;">HARİKA! DEVAM ET</button>
  </div>
  </div>`;
      var div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);
    },

    // AKILLI MİSAFİR POP-UP'I (DURUMA GÖRE DEĞİŞİR)
    showGuestPopup: function (type) {
      var old = document.getElementById("mdm-guest-popup");
      if (old) old.remove();

      // Varsayılan Metinler (Yumurta İçin)
      let title = "YAKALADIN!";
      let desc = "Bu kutuda <b>20 XP</b> var ama almak için üye olmalısın.";
      let icon = "🥚";
      let btnText = "GİRİŞ YAP VE AL";

      // Duruma Göre Değiştir
      if (type === "daily") {
        title = "GÜNLÜK HEDİYE!";
        desc = "Her gün <b>1 Hak + Puan</b> kazanmak için giriş yapmalısın.";
        icon = "📅";
        btnText = "GİRİŞ YAP";
      } else if (type === "raffle") {
        title = "ÇEKİLİŞE KATIL";
        desc = "Bu fırsatı kaçırma! Çekilişe katılmak için giriş yapmalısın.";
        icon = "🎟️";
        btnText = "GİRİŞ YAP VE KATIL";
      } else if (type === "notify") {
        title = "HABERDAR OL";
        desc = "Fırsatları ilk sen duymak istiyorsan giriş yapmalısın.";
        icon = "🔔";
        btnText = "GİRİŞ YAP";
      }

      var html = `
<div class="mdm-popup-overlay" id="mdm-guest-popup" style="display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:2147483647; align-items:center; justify-content:center; backdrop-filter:blur(5px);">
<div style="background:#fff; width:90%; max-width:350px; padding:30px; border-radius:20px; text-align:center; position:relative; box-shadow:0 10px 40px rgba(0,0,0,0.5);">
<div onclick="document.getElementById('mdm-guest-popup').remove()" style="position:absolute; top:10px; right:15px; font-size:24px; cursor:pointer; color:#999;">&times;</div>
<div style="font-size:60px; margin-bottom:10px;">${icon}</div>
<div style="color:#1e293b; font-size:20px; font-weight:900; margin-bottom:10px;">${title}</div>
<div style="color:#64748b; font-size:13px; margin-bottom:20px; line-height:1.5;">${desc}</div>
<button onclick="window.location.href='/kullanici-giris'" style="background:#2563eb; color:white; border:none; padding:12px 30px; border-radius:50px; font-weight:bold; cursor:pointer; width:100%; transition:0.2s;">${btnText}</button>
  </div>
  </div>`;

      var div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);
    },

    // 1. FONKSİYON: SORU SORAN (Modalı Açar)
    dailyCheckIn: function () {
      if (!APP_STATE.user || !APP_STATE.user.email) {
        this.showGuestPopup("daily");
        return;
      }

      var btn = document.querySelector(".mdm-btn-lucky");
      if (btn && btn.disabled) return; // Zaten alınmışsa açma

      // Varsa eski modalı temizle
      var old = document.getElementById("mdm-confirm-modal");
      if (old) old.remove();

      // HTML ŞABLONU (Siyah/Mor Tasarım)
      var html = `
<div id="mdm-confirm-modal" class="mdm-modal active" style="z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px);">
<div class="mdm-modal-content" style="width:90%; max-width:400px; background:#1e293b; border:1px solid #334155; border-radius:20px; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">

<div style="background:linear-gradient(135deg, #1e293b, #0f172a); padding:25px; text-align:center; border-bottom:1px solid #334155;">
<div style="font-size:40px; margin-bottom:10px;">🤔</div>
<h3 style="color:#fff; margin:0; font-size:18px;">Emin misin?</h3>
<p style="color:#cbd5e1; font-size:14px; margin:5px 0 0 0;">
Tüm çekilişlere katıldın mı?<br>
<span style="color:#fbbf24; font-size:12px;">(Hakkın boşa gitmesin? Katıldığın Tüm Çekilişlere +1 Hak verilir 👑)</span>
  </p>
  </div>

<div style="padding:20px; display:flex; flex-direction:column; gap:10px;">

<button onclick="document.getElementById('mdm-confirm-modal').remove(); ModumApp.confirmDailyCheckIn();" 
style="background:#10b981; color:white; border:none; padding:15px; border-radius:12px; font-weight:bold; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; gap:8px;">
<i class="fas fa-check-circle"></i> EVET, KATILDIM
  </button>

<button onclick="document.getElementById('mdm-confirm-modal').remove(); alert('Lütfen önce vitrine gidip katılın! Hakkınız boşa gitmesin.'); ModumApp.switchTab('home');" 
style="background:rgba(255,255,255,0.05); color:#94a3b8; border:1px solid #334155; padding:15px; border-radius:12px; font-weight:bold; cursor:pointer; font-size:13px;">
HAYIR, BEKLE ✋
  </button>

  </div>
  </div>
  </div>`;

      var d = document.createElement("div");
      d.innerHTML = html;
      document.body.appendChild(d);
    },

    // 2. FONKSİYON: İŞLEMİ YAPAN (API İsteği Atar - TAM DÜZELTİLMİŞ HALİ)
    confirmDailyCheckIn: function () {
      var btn = document.querySelector(".mdm-btn-lucky");
      // Butonu kilitle
      if (btn) {
        btn.innerHTML =
          '<i class="fas fa-circle-notch fa-spin"></i> İşleniyor...';
        btn.disabled = true;
      }

      fetchApi("daily_check_in", { email: APP_STATE.user.email }).then(
        (res) => {
          if (res && res.success) {
            // 1. Puanı ve Seriyi Güncelle
            if (res.newPoints) {
              APP_STATE.user.puan = parseInt(res.newPoints);
              var navXP = document.getElementById("nav-live-xp");
              if (navXP)
                navXP.innerText = APP_STATE.user.puan.toLocaleString() + " XP";
              var navNameXP = document.getElementById("nav-user-name");
              if (navNameXP) navNameXP.innerText = APP_STATE.user.puan + " XP";
            }

            if (res.newStreak) {
              APP_STATE.user.gunlukSeri = parseInt(res.newStreak);
            }

            // 2. 🔥 TARİHİ GÜNCELLE (Butonun anında grileşmesi için)
            // Render fonksiyonundaki mantığın AYNISI:
            var turkeyDate = new Date(
              new Date().toLocaleString("en-US", {
                timeZone: "Europe/Istanbul",
              }),
            );
            var mm = String(turkeyDate.getMonth() + 1).padStart(2, "0");
            var dd = String(turkeyDate.getDate()).padStart(2, "0");
            var todayStr = turkeyDate.getFullYear() + "-" + mm + "-" + dd;

            APP_STATE.user.songunlukhaktarihi = todayStr; // Değişkeni güncelle

            // 3. Hafızayı Kaydet
            localStorage.setItem(
              "mdm_user_cache",
              JSON.stringify(APP_STATE.user),
            );

            // 4. PROFİLİ YENİDEN ÇİZ (Buton "Bugün Alındı" olsun diye)
            var profileContainer = document.getElementById(
              "mdm-profile-container",
            );
            if (profileContainer) {
              profileContainer.innerHTML = renderProfileTab(APP_STATE.user);
            }

            // 5. 🔥🔥 KAYBOLAN LİDERLİK TABLOSUNU GERİ GETİR 🔥🔥
            // Profil çizilince tablo boşaldı, şimdi hemen geri dolduruyoruz.
            setTimeout(function () {
              // Mevcut switchTab fonksiyonunu tetikleyerek tabloyu doldurmasını sağlıyoruz
              // Bu sayede kod tekrarı yapmadan tabloyu geri getiriyoruz.
              ModumApp.switchTab("profile");
            }, 100);

            ModumApp.showToast(res.message, "success");
          } else {
            // Hata Durumu
            ModumApp.showToast(res ? res.message : "Hata oluştu.", "error");
            // Butonu eski haline getir
            if (btn) {
              btn.innerHTML = '<i class="fas fa-gift"></i> Günlük Hak (+1)';
              btn.disabled = false;
            }
          }
        },
      );
    },
    // 3. Görev Başlatıcı
    startTask: function (id, type, link) {
      if (!APP_STATE.user.email) return alert("Giriş yapın.");

      if (type === "secret_code") {
        // Şifre Görevi
        var code = prompt(
          "🔑 Günün Şifresini Giriniz (Instagram Hikayemize Bak!):",
        );
        if (code) {
          fetchApi("redeem_promo_code", {
            email: APP_STATE.user.email,
            code: code,
          }).then((res) => {
            alert(res.success ? "✅ " + res.message : "❌ " + res.message);
            if (res.success)
              updateDataInBackground(document.getElementById(TARGET_ID));
          });
        }
      } else if (type === "golden_product") {
        // Altın Ürün Görevi (Geliştirilecek)
        alert(
          "🕵️ Bu özellik yakında aktif! Sitedeki gizli ürünü bulup kodunu buraya yazacaksın.",
        );
      } else {
        // Link Görevi (Instagram Takip vb.)
        window.open(link || "https://instagram.com/modumnetco", "_blank");

        // Basit Onay Mekanizması
        setTimeout(() => {
          if (confirm("Görevi tamamladın mı?")) {
            fetchApi("complete_task", {
              email: APP_STATE.user.email,
              taskId: id,
            }).then((res) => {
              if (res.success) {
                alert("✅ " + res.message);
                updateDataInBackground(document.getElementById(TARGET_ID));
              } else {
                alert("⚠️ " + res.message);
              }
            });
          }
        }, 2000);
      }
    },
    // --- Link Görevini Onaylatma (Instagram vb.) ---
    completeStepLink: function (taskId, stepNum) {
      if (!confirm("Bu adımı gerçekten tamamladın mı? Kontrol edilecektir."))
        return;

      // "Yaptım" dediği an backend'e sinyal gönder
      fetchApi("complete_task_step", {
        email: APP_STATE.user.email,
        taskId: taskId,
        step: stepNum,
        type: "link_visit", // Manuel onay
      }).then((res) => {
        if (res.success) {
          alert("✅ " + res.message);
          // Listeyi yenile ki yeşil tik olsun
          loadTasksData();
          updateDataInBackground(
            document.getElementById("modum-firebase-test-root"),
          );
        } else {
          alert("⚠️ " + res.message);
        }
      });
    },

    // 4. Bildirim Açma
    subscribeNotification: function () {
      if (!APP_STATE.user || !APP_STATE.user.email) {
        this.showGuestPopup("notify"); // BURAYA 'notify' YAZDIK
        return;
      }
      fetchApi("subscribe_notification", {
        email: APP_STATE.user.email,
      }).then((res) => {
        alert(
          res.success
            ? "✅ Bildirimler açıldı! Fırsatları kaçırmayacaksın."
            : res.message,
        );
      });
    },
    // --- KARTI AÇ/KAPA (V2 - GARANTİLİ) ---
    toggleTask: function (id) {
      // Tıklama olayını izole et (Butona basınca kart kapanmasın)
      if (window.event && window.event.target.tagName === "BUTTON") {
        return;
      }

      var card = document.getElementById("task-card-" + id);
      var body = document.getElementById("task-body-" + id);
      var arrow = card.querySelector(".quest-arrow");
      var btn = card.querySelector(".quest-btn-action"); // Ana butonu bul

      if (!card || !body) return;

      // Kartın açık olup olmadığını kontrol et
      var isOpen = card.classList.contains("open");

      if (isOpen) {
        // KAPAT
        card.classList.remove("open");
        body.style.display = "none"; // Zorla gizle
        body.style.maxHeight = "0";
        if (arrow) arrow.style.transform = "rotate(0deg)";

        // Buton metnini geri yükle
        if (btn && btn.getAttribute("data-original-text")) {
          btn.innerText = btn.getAttribute("data-original-text");
        }
      } else {
        // AÇ
        // Diğer açık olanları kapat (Akordeon efekti - Opsiyonel)
        document.querySelectorAll(".mdm-quest-card.open").forEach((c) => {
          c.classList.remove("open");
          var b = c.querySelector(".quest-body");
          if (b) {
            b.style.display = "none";
            b.style.maxHeight = "0";
          }
          var a = c.querySelector(".quest-arrow");
          if (a) a.style.transform = "rotate(0deg)";
        });

        card.classList.add("open");
        body.style.display = "block"; // Zorla göster

        // Animasyon için küçük bir gecikme ile height ver
        setTimeout(() => {
          body.style.maxHeight = "500px";
        }, 10);

        if (arrow) arrow.style.transform = "rotate(180deg)";

        // Buton metnini "Gizle" yap (Opsiyonel, şık durur)
        if (btn) {
          // Orijinal metni sakla
          if (!btn.getAttribute("data-original-text")) {
            btn.setAttribute("data-original-text", btn.innerText);
          }
          // Eğer tamamlanmadıysa "Gizle" yaz
          if (!btn.classList.contains("done")) {
            btn.innerText = "Gizle 🔼";
          }
        }

        // Ekranı hafifçe karta kaydır (Mobil için iyi olur)
        setTimeout(() => {
          card.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    },

    // 12. Şifre Gönder (Adım Bazlı Güncellendi)
    submitTaskCode: function (taskId, stepNum) {
      // HTML'de input'a verdiğimiz ID'yi oluşturuyoruz: "input-GorevID-s1"
      var inputId = "input-" + taskId + "-s" + stepNum;
      var inputElement = document.getElementById(inputId);

      if (!inputElement) return alert("Hata: Input kutusu bulunamadı.");

      var code = inputElement.value;

      if (!code) return alert("Lütfen şifreyi yazın.");

      // Backend'e soralım
      fetchApi("redeem_promo_code", {
        email: APP_STATE.user.email,
        code: code,
      }).then((res) => {
        if (res.success) {
          // --- 🔥 GÖRSEL HİLE BAŞLANGICI ---
          // 1. Yeni Puanı Hesapla (Backend göndermezse 100 ekle)
          var currentPuan = parseInt(APP_STATE.user.puan) || 0;
          var bonus = 100; // Şifre ödülü genelde 100'dür

          if (res.newTotal) {
            APP_STATE.user.puan = parseInt(res.newTotal);
          } else {
            APP_STATE.user.puan = currentPuan + bonus;
          }

          // 2. Üst Barı Güncelle
          var navXP = document.getElementById("nav-live-xp");
          if (navXP)
            navXP.innerText = APP_STATE.user.puan.toLocaleString() + " XP";

          var navNameXP = document.getElementById("nav-user-name");
          if (navNameXP) navNameXP.innerText = APP_STATE.user.puan + " XP";

          // 3. 🔥 PROFİLİ DE YENİLE (İşte 265'i 285 yapan satır bu!)
          var profileContainer = document.getElementById(
            "mdm-profile-container",
          );
          if (profileContainer) {
            profileContainer.innerHTML = renderProfileTab(APP_STATE.user);
          }

          // 4. Hafızayı Güncelle
          localStorage.setItem(
            "mdm_user_cache",
            JSON.stringify(APP_STATE.user),
          );
          // -----------------------------------

          alert("✅ " + res.message);

          // Listeyi yenile ki yeşil tik olsun
          loadTasksData();
        } else {
          alert("❌ " + res.message);
          btn.innerText = oldText;
          btn.disabled = false;
        }
      });
    },

    // 3. Modal Kapatma (Ortak)
    closeModal: function (id) {
      var m = document.getElementById(id);
      if (m) m.classList.remove("active");

      // 🔥 EKLE: Pencere kapanınca sayacı sustur
      if (globalRaffleTimer) {
        clearInterval(globalRaffleTimer);
        globalRaffleTimer = null;
      }
    },

    // 5. Puan Geçmişi
    openHistoryModal: function () {
      ModumApp.logAction("Profil", "Geçmişine Baktı");
      document.getElementById("mdm-history-modal").classList.add("active");
      var listContainer = document.getElementById("mdm-history-list");
      listContainer.innerHTML =
        '<div class="mdm-loading" style="padding:40px; text-align:center; color:#94a3b8;"><i class="fas fa-circle-notch fa-spin"></i> Yükleniyor...</div>';

      fetchApi("get_user_history", { email: APP_STATE.user.email }).then(
        (res) => {
          if (res && res.success && res.list.length > 0) {
            var html = "";
            res.list.forEach((item) => {
              var color = item.amount > 0 ? "#10b981" : "#ef4444";
              var sign = item.amount > 0 ? "+" : "";
              var amountHtml =
                item.amount !== 0
                  ? `<span style="color:${color}; font-weight:bold;">${sign}${item.amount} XP</span>`
                  : "";
              var rightsHtml =
                item.rights !== 0
                  ? `<span style="color:#f59e0b; font-size:11px; margin-left:5px;">${
                      item.rights > 0 ? "+" : ""
                    }${item.rights} HAK</span>`
                  : "";

              html += `<div class="mdm-list-item" style="padding:12px; border-bottom:1px solid #334155; display:flex; justify-content:space-between;"><div><div style="color:#fff;">${item.action}</div><div style="font-size:10px; color:#64748b;">${item.date}</div></div><div style="text-align:right;">${amountHtml}<br>${rightsHtml}</div></div>`;
            });
            listContainer.innerHTML = `<div style="max-height:400px; overflow-y:auto;">${html}</div>`;
          } else {
            listContainer.innerHTML =
              '<div style="text-align:center; padding:30px; color:#94a3b8;">Geçmiş yok.</div>';
          }
        },
      );
    },

    // 6. Ekibim (GELİŞMİŞ GÖRÜNÜM: PRİM DETAYLI)
    openTeamModal: function () {
      ModumApp.logAction("Ekip", "Referanslarına Baktı");
      document.getElementById("mdm-team-modal").classList.add("active");
      var listContainer = document.getElementById("mdm-team-list");
      listContainer.innerHTML =
        '<div class="mdm-loading" style="text-align:center; padding:30px; color:#94a3b8;"><i class="fas fa-circle-notch fa-spin"></i> Ekip Verileri Alınıyor...</div>';

      fetchApi("get_my_team", { email: APP_STATE.user.email }).then((res) => {
        if (res && res.success && res.list.length > 0) {
          var html = "";

          // Standart Kayıt Ödülü (Ayarlardan farklıysa burayı güncelle)
          var baseReward = 150;

          res.list.forEach((m) => {
            // Matematik: Toplam puandan kayıt ödülünü çıkar, kalanı sipariş primidir.
            var total = m.earned || 0;
            var commission = total - baseReward;
            if (commission < 0) commission = 0; // Negatif çıkmasın
            var signUpBonus = total - commission; // Genelde 150

            // İsim Maskeleme
            var emailShow = m.email; // Zaten maskeli geliyor backendden

            html += `
<li class="mdm-list-item" style="flex-direction:column; align-items:stretch; gap:10px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); margin-bottom:8px; border-radius:10px;">

<!-- Üst Kısım: İsim ve Tarih -->
<div style="display:flex; justify-content:space-between; align-items:center;">
<div style="font-weight:600; color:#fff; display:flex; align-items:center; gap:8px;">
<div style="width:28px; height:28px; background:linear-gradient(135deg, #4f46e5, #4338ca); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px;">👤</div>
${emailShow}
  </div>
<div style="font-size:10px; color:#64748b;">${m.date}</div>
  </div>

<!-- Alt Kısım: Kazanç Detayları -->
<div style="display:flex; gap:8px; margin-top:5px;">
<!-- Kayıt Bonusu -->
<div style="flex:1; background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16, 185, 129, 0.2); padding:6px; border-radius:6px; text-align:center;">
<div style="font-size:9px; color:#6ee7b7; text-transform:uppercase; font-weight:bold;">Kayıt</div>
<div style="font-size:13px; font-weight:800; color:#fff;">+${signUpBonus} XP</div>
  </div>

<!-- Sipariş Primi -->
<div style="flex:1; background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.2); padding:6px; border-radius:6px; text-align:center;">
<div style="font-size:9px; color:#fcd34d; text-transform:uppercase; font-weight:bold;">Sipariş (%5)</div>
<div style="font-size:13px; font-weight:800; color:#fff;">+${commission} XP</div>
  </div>
  </div>

  </li>`;
          });
          listContainer.innerHTML = `<div style="max-height:400px; overflow-y:auto; padding-right:5px;">${html}</div>`;
        } else {
          listContainer.innerHTML =
            '<div style="text-align:center; padding:40px; color:#64748b;"><i class="fas fa-users" style="font-size:32px; margin-bottom:10px; opacity:0.5;"></i><br>Henüz ekibinde kimse yok.<br><small>Linkini paylaşarak kazanmaya başla!</small></div>';
        }
      });
    },

    // 7. Gelişmiş Detay Modalı (AKILLI BİLET SAYACI & MATCH FIX)
    openDetailModal: function (
      id,
      title,
      img,
      reward,
      endDate,
      participantCount,
    ) {
      ModumApp.logAction("Çekiliş İnceledi", title);

      // Eski sayacı temizle
      if (globalRaffleTimer) clearInterval(globalRaffleTimer);

      // Modalı Aç
      document.getElementById("mdm-detail-modal").classList.add("active");
      document.getElementById("mdm-detail-title").innerText = title;
      var body = document.getElementById("mdm-detail-body");

      // --- TARİH DÜZELTME ---
      var safeDateStr = endDate.replace(" ", "T");
      if (safeDateStr.length <= 10) safeDateStr += "T23:59:00";
      var targetTime = new Date(safeDateStr).getTime();

      // Toplam Katılımcı
      var totalP = parseInt(participantCount) || 1; // 0 gelirse 1 yap ki bölme hatası olmasın

      // HTML İskeleti
      var html = `
<div class="mdm-modal-split-layout">
<div class="mdm-modal-left">
<img src="${img}" class="mdm-detail-img">
<div class="mdm-detail-title">${title}</div>
<div class="mdm-detail-reward">🏆 Ödül: ${reward}</div>

<div class="mdm-detail-stats">
<div class="mdm-stat-box">
<div class="mdm-stat-val">${totalP}</div>
<div class="mdm-stat-lbl">Katılımcı</div>
  </div>

<div class="mdm-stat-box" id="mdm-chance-box">
<div class="mdm-stat-val" style="color:#fbbf24;">Hesaplanıyor...</div>
<div class="mdm-stat-lbl">Şansın</div>
  </div>

<div class="mdm-stat-box">
<div class="mdm-stat-val" id="mdm-detail-timer">-</div>
<div class="mdm-stat-lbl">Kalan Süre</div>
  </div>
  </div>

<div style="display:flex; gap:10px; margin-top:15px;">
<button class="mdm-btn-v2 btn-join-v2" style="flex:2; height:45px; font-size:14px;" onclick="ModumApp.joinRaffle('${id}', '${title}')">
HEMEN KATIL <i class="fas fa-ticket-alt"></i>
  </button>
<button class="btn-share-link" style="flex:1; margin-top:0; border:1px solid rgba(255,255,255,0.2);" onclick="ModumApp.shareRaffle('${title}')">
<i class="fas fa-share-alt"></i> Paylaş
  </button>
  </div>
  </div>

<div class="mdm-modal-right">
<div class="mdm-detail-tabs">
<div class="mdm-dt-tab active">👥 Son Katılanlar</div>
  </div>
<div id="mdm-detail-list" class="mdm-participant-list">
<div style="text-align:center; padding:50px; color:#64748b;">
<i class="fas fa-circle-notch fa-spin" style="font-size:24px; margin-bottom:10px;"></i><br>
Veriler Analiz Ediliyor...
  </div>
  </div>
  </div>
  </div>`;

      body.innerHTML = html;

      // --- SAYAÇ BAŞLAT ---
      globalRaffleTimer = setInterval(function () {
        var now = new Date().getTime();
        var dist = targetTime - now;
        var timerDiv = document.getElementById("mdm-detail-timer");

        if (!timerDiv) {
          clearInterval(globalRaffleTimer);
          return;
        }

        if (dist < 0) {
          timerDiv.innerText = "SONA ERDİ";
          timerDiv.style.color = "#ef4444";
          clearInterval(globalRaffleTimer);
        } else {
          var d = Math.floor(dist / (1000 * 60 * 60 * 24));
          var h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
          timerDiv.innerHTML = `<span style="color:#fbbf24">${d}g</span> ${h}s ${m}d`;
        }
      }, 1000);

      // --- LİSTEYİ VE ŞANSI ÇEK ---
      fetchApi("get_participants", { searchQuery: "" }).then((res) => {
        var listDiv = document.getElementById("mdm-detail-list");
        if (!listDiv) return;

        if (res && res.success && res.list) {
          // 🔥 AKILLI FİLTRELEME (İsimlerdeki küçük/büyük harf ve boşluk sorununu çözer)
          var cleanTitle = title.toLowerCase().trim();

          var filtered = res.list.filter((p) => {
            var pName = (p.raffleName || "").toLowerCase().trim();
            return (
              pName === cleanTitle ||
              pName.includes(cleanTitle) ||
              cleanTitle.includes(pName)
            );
          });

          // Kendi bilet sayını bul
          if (APP_STATE.user && APP_STATE.user.email) {
            var myEmail = APP_STATE.user.email.toLowerCase();
            var myCount = filtered.filter(
              (p) => (p.email || "").toLowerCase() === myEmail,
            ).length;

            // Eğer hala 0 ise ve kişi "Katıldım" diyorsa, APP_STATE.myRaffles'a da bak
            if (myCount === 0 && APP_STATE.myRaffles) {
              var joinedBefore = APP_STATE.myRaffles.some(
                (rName) => rName.toLowerCase().trim() === cleanTitle,
              );
              if (joinedBefore) myCount = 1; // En azından 1 göster
            }

            // Şans Hesapla (% Oranı)
            var chanceRate = (myCount / totalP) * 100;
            var chanceText = "Düşük";
            var chanceColor = "#94a3b8"; // Gri

            if (myCount > 0) {
              if (chanceRate > 10) {
                chanceText = "ÇOK YÜKSEK 🔥";
                chanceColor = "#10b981"; // Yeşil
              } else if (chanceRate > 5) {
                chanceText = "YÜKSEK 🚀";
                chanceColor = "#34d399";
              } else if (chanceRate > 1) {
                chanceText = "ORTA ⚖️";
                chanceColor = "#fbbf24"; // Sarı
              } else {
                chanceText = "NORMAL 🤞";
                chanceColor = "#60a5fa"; // Mavi
              }
            } else {
              chanceText = "Biletin Yok";
            }

            // Kutuyu Güncelle
            var chanceBox = document.getElementById("mdm-chance-box");
            if (chanceBox) {
              chanceBox.innerHTML = `<div class="mdm-stat-val" style="color:${chanceColor}; font-size:12px;">${chanceText}</div><div class="mdm-stat-lbl">(${myCount} Bilet)</div>`;
            }
          } else {
            var chanceBox = document.getElementById("mdm-chance-box");
            if (chanceBox) {
              chanceBox.innerHTML =
                '<div class="mdm-stat-val" style="color:#94a3b8; font-size:12px;">%0</div><div class="mdm-stat-lbl">(Giriş Yap)</div>';
            }
          }

          // Listeyi Ekrana Bas (Sadece ilk 50 kişi)
          var listHtml = "";
          filtered.slice(0, 50).forEach((p) => {
            // İsim Gizleme (KVKK) - Örn: Ah*** Yıl***
            var safeName = p.name;

            listHtml += `
<div class="mdm-part-item">
<div class="mdm-part-user">
<div class="mdm-part-icon">👤</div>
<div class="mdm-part-info">
<div class="mdm-part-name">${safeName}</div>
<div class="mdm-part-ticket">${p.ticketId}</div>
  </div>
  </div>
<div class="mdm-part-time" style="font-size:9px;">${
              p.date ? p.date.substring(0, 10) : ""
            }</div>
  </div>`;
          });

          listDiv.innerHTML =
            listHtml ||
            '<div style="padding:20px; text-align:center;">Henüz katılım yok.</div>';
        } else {
          listDiv.innerHTML =
            '<div style="padding:20px; text-align:center;">Veri alınamadı.</div>';
        }
      });
    },

    // 8. Kazananlar Modalı
    openWinnersModal: function (raffleName) {
      document.getElementById("mdm-winners-modal").classList.add("active");
      document.getElementById("mdm-winners-list").innerHTML = "Yükleniyor...";
      fetchApi("get_winners").then((data) => {
        if (data && data.success) {
          var filtered = data.winners.filter(
            (w) => w.raffleName === raffleName,
          );
          var html = filtered.length
            ? filtered
                .map(
                  (w, i) =>
                    `<div style="padding:10px; border-bottom:1px solid #333;">${
                      i + 1
                    }. ${w.userName} <span style="color:#fbbf24;">(${
                      w.prize
                    })</span></div>`,
                )
                .join("")
            : '<div style="padding:20px; text-align:center;">Henüz açıklanmadı.</div>';
          document.getElementById("mdm-winners-list").innerHTML = html;
        }
      });
    },

    // 🔥 GÜNCELLENMİŞ REFERANS MODALI
    openAffiliateModal: function () {
      // 1. Giriş Kontrolü
      if (!APP_STATE.user || !APP_STATE.user.email) {
        alert(
          "Referans linkinizi görmek için lütfen giriş yapın veya kayıt olun.",
        );
        return;
      }

      // 2. Kod Kontrolü (Hata Önleyici)
      var userCode = APP_STATE.user.referansKodu;

      // Eğer kod henüz gelmediyse (internet yavaşsa), kullanıcıyı uyar
      if (!userCode || userCode === "undefined") {
        alert(
          "Referans kodunuz oluşturuluyor, lütfen sayfayı yenileyip tekrar deneyin.",
        );
        return;
      }

      var link = SITE_URL + "?ref=" + userCode;
      // Eğer ana domainde çalışıyorsa direkt: window.location.origin + "?ref=" + userCode;

      // Eski modal varsa temizle
      var eskiModal = document.getElementById("mdm-affiliate-modal");
      if (eskiModal) eskiModal.remove();

      // 3. HTML Oluştur
      var modalHTML = `
<div id="mdm-affiliate-modal" class="mdm-modal" style="display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:2147483647; align-items:center; justify-content:center;">
<div class="mdm-modal-content" style="width:90%; max-width:450px; background:#fff; color:#333; border-radius:16px; padding:20px; position:relative; box-shadow:0 20px 50px rgba(0,0,0,0.5);">

<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
<h3 style="margin:0; color:#d97706; font-size:18px; display:flex; align-items:center; gap:8px;">
<i class="fas fa-handshake"></i> Ortaklık Bağlantın
  </h3>
<div onclick="document.getElementById('mdm-affiliate-modal').remove()" style="font-size:28px; color:#666; cursor:pointer; line-height:0.5;">&times;</div>
  </div>

<div style="background:#fff7ed; border:2px dashed #f97316; padding:15px; border-radius:12px; text-align:center; margin-bottom:20px;">
<div style="font-size:13px; color:#ea580c; margin-bottom:10px; font-weight:bold;">
Bu linki arkadaşlarına gönder:
  </div>

<div style="display:flex; gap:5px; margin-bottom:15px;">
<input type="text" id="affiliate-link-input" value="${link}" readonly style="width:100%; padding:12px; border:1px solid #fdba74; border-radius:8px; background:#fff; color:#333; font-size:13px; font-family:monospace;">
<button onclick="var copyText=document.getElementById('affiliate-link-input');copyText.select();document.execCommand('copy');this.innerText='Kopyalandı!';" style="background:#f97316; color:white; border:none; padding:0 20px; border-radius:8px; cursor:pointer; font-weight:bold; transition:0.2s;">Kopyala</button>
  </div>

<div style="display:flex; gap:10px;">
<button onclick="window.open('https://api.whatsapp.com/send?text=${encodeURIComponent(
        "Sana harika bir hediye linki bıraktım! Üye ol, kazan: " + link,
      )}', '_blank')" style="flex:1; background:#25D366; color:white; border:none; padding:12px; border-radius:8px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:5px; font-weight:bold;">
<i class="fab fa-whatsapp"></i> WhatsApp
  </button>
<button onclick="window.open('https://t.me/share/url?url=${encodeURIComponent(
        link,
      )}&text=${encodeURIComponent(
        "ModumNet fırsatlarına katıl!",
      )}', '_blank')" style="flex:1; background:#0088cc; color:white; border:none; padding:12px; border-radius:8px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:5px; font-weight:bold;">
<i class="fab fa-telegram"></i> Telegram
  </button>
  </div>
  </div>

<div style="background:#f8fafc; padding:15px; border-radius:12px; border:1px solid #e2e8f0;">
<div style="font-size:12px; color:#64748b; margin-bottom:5px; text-align:center;">Kazanç Tablosu</div>
<div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:10px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:5px;">
<span>👤 Arkadaşın Üye Olunca</span>
<span style="color:#16a34a; font-weight:bold;">+350 XP</span>
  </div>
<div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:10px; border-radius:8px; border:1px solid #e2e8f0;">
<span>🛒 Arkadaşın Alışveriş Yapınca</span>
<span style="color:#d97706; font-weight:bold; background:#fff7ed; padding:2px 8px; border-radius:4px;">%5 PRİM</span>
  </div>
  </div>
  </div>
  </div>
`;

      var div = document.createElement("div");
      div.innerHTML = modalHTML;
      document.body.appendChild(div);
    },

    // 10. Link Kopyala
    copyAffiliateLink: function () {
      var input = document.getElementById("affiliate-link-input");
      if (input) {
        input.select();
        document.execCommand("copy");
        alert("✅ Bağlantı kopyalandı!");
      }
    },

    // 11. WhatsApp Paylaş
    shareWhatsapp: function () {
      var link = APP_STATE.affiliateLink || window.location.href;
      var text =
        "ModumNet'e bu linkten üye ol, harika ödüller kazan! Link: " + link;
      window.open(
        "https://api.whatsapp.com/send?text=" + encodeURIComponent(text),
        "_blank",
      );
    },

    // 12. Telegram Paylaş
    shareTelegram: function () {
      var link = APP_STATE.affiliateLink || window.location.href;
      var text = "ModumNet'e katıl, kazan!";
      window.open(
        "https://t.me/share/url?url=" +
          encodeURIComponent(link) +
          "&text=" +
          encodeURIComponent(text),
        "_blank",
      );
    },
    // 14. 🔥 AKILLI LOGLAMA (SİSTEM LOGLARINA VERİ GÖNDERİR)
    logAction: function (actionName, actionDetails) {
      // Sadece üye giriş yapmışsa log tut (Gereksiz veri dolmasın)
      if (APP_STATE.user && APP_STATE.user.email) {
        fetchApi("log_frontend_action", {
          email: APP_STATE.user.email,
          action: actionName,
          details: actionDetails,
        });
      }
    },

    // 13. Genel Paylaşım (Çekiliş Kartı İçin)
    shareRaffle: function (title) {
      if (navigator.share) {
        navigator
          .share({
            title: "ModumNet",
            text: title,
            url: window.location.href,
          })
          .catch(console.error);
      } else {
        alert("Linki kopyaladım: " + window.location.href);
      }
    },
    // --- 🔥 ROZET DETAY PENCERESİ ---
    openBadgeDetail: function (badgeId) {
      var b = BADGES_DB[badgeId];
      var userBadges =
        APP_STATE.user && APP_STATE.user.badges ? APP_STATE.user.badges : [];
      var hasIt = userBadges.includes(badgeId) || badgeId === "lvl_caylak";

      var old = document.getElementById("mdm-badge-modal");
      if (old) old.remove();

      // Buton Durumu
      var btnHtml = "";
      if (hasIt) {
        btnHtml = `
<div style="display:flex; flex-direction:column; gap:10px; width:100%;">
<button onclick="ModumApp.setProfileBadge('${badgeId}')" style="background:#10b981; color:white; border:none; padding:12px; width:100%; border-radius:10px; font-weight:bold; cursor:pointer; font-size:14px; box-shadow:0 4px 15px rgba(16,185,129,0.3);">
Profil Resmi Yap
  </button>
<button onclick="ModumApp.generateStoryImage('${badgeId}')" style="background:linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color:white; border:none; padding:12px; width:100%; border-radius:10px; font-weight:bold; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; gap:8px;">
<i class="fab fa-instagram"></i> Story Olarak Paylaş (+50 XP)
  </button>
  </div>`;
      } else {
        // ... (Kilitli butonu aynen kalıyor) ...
        btnHtml = `<button disabled style="background:#334155; color:#94a3b8; border:none; padding:12px; width:100%; border-radius:10px; font-weight:bold; cursor:not-allowed;">🔒 Henüz Kazanılmadı</button>`;
      }

      var html = `
<div id="mdm-badge-modal" class="mdm-modal" style="display:flex; z-index:100001; align-items:center; justify-content:center;">
<div class="mdm-modal-content" style="width:90%; max-width:320px; text-align:center; padding:30px; border-radius:24px; background:#1e293b; border:1px solid #334155; position:relative;">
<div onclick="document.getElementById('mdm-badge-modal').remove()" style="position:absolute; top:15px; right:15px; color:#64748b; cursor:pointer; font-size:24px;">&times;</div>
<div style="font-size:60px; margin-bottom:15px; filter:drop-shadow(0 0 20px rgba(255,255,255,0.2)); ${
        hasIt ? "" : "filter:grayscale(100%); opacity:0.5;"
      }">
${b.i}
  </div>
<h3 style="color:#fff; margin:0 0 10px 0; font-size:20px;">${b.t}</h3>
<p style="color:#94a3b8; font-size:13px; line-height:1.5; margin-bottom:25px;">${
        b.d
      }</p>
${btnHtml}
  </div>
  </div>`;

      var div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);
    },

    // --- 🔥 ROZETİ PROFİL RESMİ OLARAK AYARLA ---
    setProfileBadge: function (badgeId) {
      if (!APP_STATE.user || !APP_STATE.user.email) return;

      var btn = document.querySelector("#mdm-badge-modal button");
      if (btn) {
        btn.innerText = "İşleniyor...";
        btn.disabled = true;
      }

      fetchApi("set_avatar_badge", {
        email: APP_STATE.user.email,
        badgeId: badgeId,
      }).then((res) => {
        if (res && res.success) {
          document.getElementById("mdm-badge-modal").remove();
          APP_STATE.user.selectedAvatar = badgeId;
          localStorage.setItem(
            "mdm_user_cache",
            JSON.stringify(APP_STATE.user),
          );
          var profileContainer = document.getElementById(
            "mdm-profile-container",
          );
          if (profileContainer)
            profileContainer.innerHTML = renderProfileTab(APP_STATE.user);
          updateDataInBackground();
          alert("✅ Profil resmin güncellendi!");
        } else {
          alert("Hata: " + res.message);
          if (btn) {
            btn.innerText = "Profil Resmi Yap";
            btn.disabled = false;
          }
        }
      });
    },
    // --- 🎨 TEMA SEÇİCİ PENCERE ---
    openThemeSelector: function () {
      var old = document.getElementById("mdm-theme-modal");
      if (old) old.remove();

      var gridHtml = "";
      Object.keys(PROFILE_THEMES).forEach((key) => {
        var t = PROFILE_THEMES[key];
        var isSelected =
          APP_STATE.user.profileTheme === key ||
          (!APP_STATE.user.profileTheme && key === "default");
        var border = isSelected
          ? "2px solid #fff"
          : "1px solid rgba(255,255,255,0.1)";

        gridHtml += `
<div onclick="ModumApp.setTheme('${key}')" style="cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:5px;">
<div style="width:50px; height:50px; border-radius:50%; background:${
          t.bg
        }; border:${border}; box-shadow:0 0 10px ${t.glow};">
${
  isSelected
    ? '<div style="display:flex;align-items:center;justify-content:center;height:100%;"><i class="fas fa-check" style="color:white;text-shadow:0 0 5px black;"></i></div>'
    : ""
}
  </div>
<div style="font-size:10px; color:#cbd5e1;">${t.name}</div>
  </div>`;
      });

      var html = `
<div id="mdm-theme-modal" class="mdm-modal" style="display:flex; z-index:100002; align-items:center; justify-content:center;">
<div class="mdm-modal-content" style="width:90%; max-width:350px; background:#0f172a; padding:25px; border-radius:20px; border:1px solid #334155; text-align:center;">
<div style="display:flex; justify-content:space-between; margin-bottom:20px;">
<h3 style="color:white; margin:0; font-size:16px;">Profil Temanı Seç</h3>
<div onclick="document.getElementById('mdm-theme-modal').remove()" style="cursor:pointer; color:#94a3b8; font-size:20px;">&times;</div>
  </div>
<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:15px;">
${gridHtml}
  </div>
  </div>
  </div>`;

      var div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);
    },

    // --- TEMAYI KAYDET (DÜZELTİLMİŞ) ---
    setTheme: function (themeId) {
      if (!APP_STATE.user || !APP_STATE.user.email) return;

      // 1. Global Durumu Güncelle
      APP_STATE.user.profileTheme = themeId;

      // 2. 🔥 KRİTİK DÜZELTME: Önce Hafızayı Güncelle (Eşitle)
      // Böylece renderProfileTab fonksiyonu eski veriyi okumaz.
      localStorage.setItem("mdm_user_cache", JSON.stringify(APP_STATE.user));

      // 3. Profili Yeniden Çiz (Anında Görünüm)
      var profileContainer = document.getElementById("mdm-profile-container");
      if (profileContainer) {
        // Doğrudan APP_STATE'i gönderiyoruz, cache'den okumasın diye
        profileContainer.innerHTML = renderProfileTab(APP_STATE.user);
      }

      document.getElementById("mdm-theme-modal").remove();

      // 4. Arka Planda Sunucuya Kaydet
      fetchApi("set_profile_theme", {
        email: APP_STATE.user.email,
        themeId: themeId,
      }).then((res) => {
        console.log("Tema sunucuya kaydedildi.");
      });
    },
    // --- 📸 PREMIUM STORY OLUŞTURUCU (HAVALI TASARIM v3) ---
    generateStoryImage: function (badgeId) {
      if (typeof html2canvas === "undefined")
        return alert("Sistem hazırlanıyor, 3 saniye sonra tekrar dene.");

      // Yükleniyor Mesajı
      var btnText = event && event.target ? event.target : null;
      var originalBtnContent = "";
      if (btnText) {
        originalBtnContent = btnText.innerHTML;
        btnText.innerHTML =
          '<i class="fas fa-circle-notch fa-spin"></i> Hazırlanıyor...';
        btnText.disabled = true;
      }

      var b = BADGES_DB[badgeId];
      var name = (APP_STATE.user.name || "MİSAFİR").toUpperCase();

      // 1. Kartı Oluştur (PREMIUM TASARIM - 1080x1920)
      var cardHtml = `
<div id="mdm-share-card" style="position:fixed; top:0; left:0; width:1080px; height:1920px; background:#020617; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'Outfit',sans-serif; text-align:center; z-index:-5; pointer-events:none;">

<div style="position:absolute; top:0; left:0; width:100%; height:100%; background:radial-gradient(circle at 50% 40%, #1e293b 0%, #000000 80%); z-index:-2;"></div>

<div style="font-size:1200px; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%) rotate(-10deg); opacity:0.04; color:white; filter:blur(2px); z-index:-1;">
${b.i}
  </div>

<div style="z-index:10; display:flex; flex-direction:column; align-items:center; transform:scale(1.3);">

<div style="font-size:40px; color:#94a3b8; font-weight:800; letter-spacing:15px; margin-bottom:80px; text-shadow:0 0 20px rgba(0,0,0,1);">MODUMNET</div>

<div style="font-size:350px; filter:drop-shadow(0 0 80px rgba(139,92,246,0.5)); margin-bottom:60px; transform:scale(1.1); animation:none;">
${b.i}
  </div>

<div style="font-size:45px; color:#fff; background:rgba(255,255,255,0.08); padding:20px 80px; border-radius:100px; border:2px solid rgba(255,255,255,0.15); font-weight:700; box-shadow:0 20px 40px rgba(0,0,0,0.5); white-space:nowrap;">
${name}
  </div>

<div style="font-size:80px; font-weight:900; color:#fbbf24; text-transform:uppercase; margin-top:50px; text-shadow:0 5px 0 #b45309, 0 0 50px rgba(251, 191, 36, 0.5); letter-spacing:2px; line-height:1.1;">
${b.t}
  </div>

<div style="font-size:30px; color:#cbd5e1; margin-top:30px; letter-spacing:5px; font-weight:300; text-transform:uppercase;">ROZETİNİ KAZANDI! 🏆</div>
  </div>

<div style="position:absolute; bottom:120px; font-size:35px; color:#64748b; font-weight:bold; letter-spacing:4px; opacity:0.6;">WWW.MODUM.TR</div>
  </div>`;

      document.body.insertAdjacentHTML("beforeend", cardHtml);
      var element = document.getElementById("mdm-share-card");

      // 2. Fotoğrafı Çek
      setTimeout(() => {
        html2canvas(element, {
          scale: 1,
          backgroundColor: "#020617",
          useCORS: true,
          allowTaint: true,
        })
          .then((canvas) => {
            // İndir
            var link = document.createElement("a");
            link.download = "ModumNet-Odul.jpg";
            link.href = canvas.toDataURL("image/jpeg", 0.95);
            link.click();

            // Temizlik
            element.remove();
            if (btnText) {
              btnText.innerHTML = originalBtnContent;
              btnText.disabled = false;
            }

            // Ödül Puanını İşle
            fetchApi("share_story_reward", {
              email: APP_STATE.user.email,
            }).then((res) => {
              if (res && res.success) updateDataInBackground();
            });

            // Yönlendirme Pop-up'ı
            var guideHtml = `
<div id="mdm-share-guide" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999999; display:flex; align-items:center; justify-content:center; padding:20px;">
<div style="background:#1e293b; border:1px solid #334155; border-radius:20px; padding:30px; text-align:center; max-width:350px; position:relative; box-shadow:0 0 50px rgba(0,0,0,0.8);">
<div onclick="document.getElementById('mdm-share-guide').remove()" style="position:absolute; top:15px; right:15px; color:#94a3b8; font-size:24px; cursor:pointer;">&times;</div>

<div style="font-size:60px; margin-bottom:15px; filter:drop-shadow(0 0 10px rgba(255,255,255,0.2));">📸</div>
<h3 style="color:#fff; margin:0 0 10px 0; font-size:20px;">Görsel Hazır!</h3>
<p style="color:#cbd5e1; font-size:14px; line-height:1.5; margin-bottom:25px;">
Özel tasarım kartın <b>galerine kaydedildi.</b><br>Şimdi Instagram'ı açıp havalı bir story atabilirsin!
  </p>

<button onclick="window.location.href='instagram://story-camera'; setTimeout(()=>{ document.getElementById('mdm-share-guide').remove(); }, 1000);" 
style="background:linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color:white; border:none; padding:15px 30px; border-radius:50px; font-weight:bold; cursor:pointer; width:100%; font-size:14px; box-shadow:0 5px 20px rgba(220, 39, 67, 0.4);">
Instagram'ı Aç 🚀
  </button>
  </div>
  </div>`;
            var gd = document.createElement("div");
            gd.innerHTML = guideHtml;
            document.body.appendChild(gd);
          })
          .catch((e) => {
            element.remove();
            if (btnText) {
              btnText.innerHTML = originalBtnContent;
              btnText.disabled = false;
            }
            alert("Hata oluştu, lütfen tekrar dene.");
          });
      }, 1000); // 1 saniye bekle (Fontlar ve stiller tam otursun)
    },
    // --- YENİ: ROZET PAYLAŞIM KONTROLÜ ---
    initShareProcess: function () {
      var userBadges =
        APP_STATE.user && APP_STATE.user.badges ? APP_STATE.user.badges : [];

      if (userBadges.length === 0) {
        alert(
          "⚠️ Henüz kazanılmış bir rozetin yok. Görevleri tamamlayarak rozet kazan, sonra paylaş!",
        );
        return;
      }

      if (userBadges.length === 1) {
        // Tek rozet varsa direkt onu oluştur
        ModumApp.generateStoryImage(userBadges[0]);
      } else {
        // Birden fazla rozet varsa seçim menüsünü aç
        ModumApp.openBadgeSelectorModal(userBadges);
      }
    },

    // MEVCUT EN SON FONKSİYONUN (Muhtemelen bu):
    openBadgeSelectorModal: function (badgeList) {
      var old = document.getElementById("mdm-badge-select");
      if (old) old.remove();
      // ... (kodların devamı) ...
      var d = document.createElement("div");
      d.innerHTML = html;
      document.body.appendChild(d);
    }, // <--- DİKKAT: BURAYA MUTLAKA VİRGÜL KOY! (Eğer yoksa)

    // 👇👇👇 YENİ KODLARI BURADAN İTİBAREN YAPIŞTIR 👇👇👇

    // --- ❓ YARDIM SİSTEMİ (İSKELET) ---
    helpData: [
      {
        id: 1,
        title: "🚀 ModumNet Çekiliş Dünyası",
        content: `
<div style="width:100%; height:200px; overflow:hidden; border-radius:12px; border:1px solid #334155; position:relative; margin-bottom:20px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
<img src="https://www.modum.tr/i/m/001/0016133.jpeg" style="width:100%; height:100%; object-position:center;">
<div style="position:absolute; bottom:0; left:0; width:100%; background:linear-gradient(to top, #0f172a, transparent); height:80px;"></div>
  </div>

<div style="font-size:15px; color:#e2e8f0; line-height:1.6; margin-bottom:20px;">
Hoş geldin! <b>ModumNet</b> sadece bir alışveriş sitesi değil, aynı zamanda kazanabileceğin dev bir eğlence platformudur. Burada attığın her adım sana puan ve ödül olarak geri döner.
  </div>

<div style="text-align:center; margin-bottom:25px; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px;">
<img src="https://www.modum.tr/i/m/001/0016297.png" style="max-width:100%; height:auto; border-radius:6px;">
<div style="font-size:12px; color:#94a3b8; margin-top:5px;">🎟️ Çekilişlere katılmak ve kazanmak tamamen ücretsizdir!</div>
  </div>

<div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">

<div style="background:rgba(30, 41, 59, 0.8); padding:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); text-align:center;">
<div style="font-size:32px; color:#4ade80; margin-bottom:10px;">
<i class="fas fa-check-circle"></i> </div>
<h4 style="margin:0 0 5px 0; color:#fff; font-size:14px;">✅Görevleri Yap</h4>
<div style="font-size:11px; color:#cbd5e1;">Basit görevleri tamamla, anında XP Puan kazan.</div>
  </div>

<div style="background:rgba(30, 41, 59, 0.8); padding:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); text-align:center;">
<div style="font-size:32px; color:#facc15; margin-bottom:10px;">
<i class="fas fa-crown"></i> </div>
<h4 style="margin:0 0 5px 0; color:#fff; font-size:14px;">👑Rütbeni Yükselt</h4>
<div style="font-size:11px; color:#cbd5e1;">Puan topla, Çaylak'tan Efsane'ye yüksel!</div>
  </div>

  </div>
`,
      },
      {
        id: 2,
        title: "🎟️ Çekilişlere Katılım (Tamamen Ücretsiz!)",
        content: `
<div style="font-size:15px; color:#e2e8f0; margin-bottom:20px;">
ModumNet'te çekilişlere katılmak için <b>hiçbir ücret ödemezsin.</b> Kargo parası, katılım ücreti veya gizli bir şart yoktur. Sadece tek bir tıklama ile şansını deneyebilirsin!
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:20px; margin-bottom:20px; display:flex; align-items:center; gap:20px; border:1px solid rgba(255,255,255,0.1);">
<div style="flex:1;">
<div style="background:#22c55e; color:#fff; font-weight:bold; font-size:12px; padding:4px 10px; border-radius:20px; display:inline-block; margin-bottom:10px;">ADIM 1</div>
<h4 style="margin:0 0 5px 0; color:#fff;">Beğendiğin Çekilişi Seç</h4>
<p style="font-size:13px; color:#94a3b8; margin:0;">Vitrindeki kutulardan gözüne kestirdiğin bir ödülün altındaki yeşil <b>"KATILDINIZ"</b> veya <b>"HEMEN KATIL"</b> butonunu bul.</p>
  </div>
<div style="width:120px; text-align:center;">
<img src="https://www.modum.tr/i/m/001/0016299.png" style="width:100%; border-radius:8px; border:1px solid #334155; box-shadow:0 5px 15px rgba(0,0,0,0.3);">
  </div>
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:20px; display:flex; align-items:center; gap:20px; border:1px solid rgba(255,255,255,0.1);">
<div style="width:120px; text-align:center;">
<img src="https://www.modum.tr/i/m/001/0016300.png" style="width:100%; border-radius:8px; border:1px solid #334155; box-shadow:0 5px 15px rgba(0,0,0,0.3);">
  </div>
<div style="flex:1;">
<div style="background:#0ea5e9; color:#fff; font-weight:bold; font-size:12px; padding:4px 10px; border-radius:20px; display:inline-block; margin-bottom:10px;">ADIM 2</div>
<h4 style="margin:0 0 5px 0; color:#fff;">Tıkla ve Bitir!</h4>
<p style="font-size:13px; color:#94a3b8; margin:0;">Butona bastığın an işlem tamamdır. Buton rengi değişir ve <b>"KATILIMCI"</b> sayacı artar. Artık sonuçları bekleyebilirsin.</p>
  </div>
  </div>

<div style="margin-top:20px; padding:15px; background:rgba(245, 158, 11, 0.1); border-left:4px solid #f59e0b; border-radius:4px; font-size:13px; color:#fcd34d;">
<i class="fas fa-info-circle"></i> <b>İpucu:</b> Katıldığın her çekiliş sana ayrıca <b>XP (Puan)</b> kazandırır ve rütbeni yükseltmene yardımcı olur.
  </div>
`,
      },
      {
        id: 3,
        title: "📅 Günlük Yoklama (Şansını Artır)",
        content: `
<div style="font-size:14px; color:#e2e8f0; margin-bottom:20px;">
Şansını katlamanın en kolay yolu! Her gün siteye bir kez uğrayıp "Yoklama" alarak hem <b>XP Puanı</b> hem de <b>Ekstra Çekiliş Hakkı</b> kazanırsın.
  </div>

<div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:25px;">

<div style="text-align:center;">
<div style="background:#22c55e; color:#fff; font-size:10px; font-weight:bold; padding:2px 8px; border-radius:10px; display:inline-block; margin-bottom:5px;">ADIM 1: TIKLA</div>
<img src="https://www.modum.tr/i/m/001/0016298.png" style="width:100%; border-radius:8px; border:2px solid #22c55e; box-shadow:0 5px 15px rgba(34, 197, 94, 0.2);">
<div style="font-size:11px; color:#86efac; margin-top:5px;">Her gün yeşil butonu bul</div>
  </div>

<div style="text-align:center;">
<div style="background:#64748b; color:#fff; font-size:10px; font-weight:bold; padding:2px 8px; border-radius:10px; display:inline-block; margin-bottom:5px;">ADIM 2: KAZAN</div>
<img src="https://www.modum.tr/i/m/001/0016139.png" style="width:100%; border-radius:8px; border:2px solid #64748b; opacity:0.8;">
<div style="font-size:11px; color:#cbd5e1; margin-top:5px;">Ödüller hesabına yatar</div>
  </div>

  </div>

<div style="background:linear-gradient(to right, rgba(245, 158, 11, 0.1), transparent); border-left:4px solid #f59e0b; padding:15px; border-radius:4px;">
<h4 style="margin:0 0 10px 0; color:#fcd34d; font-size:14px;">🎁 Kazandığın Ödül: Ekstra Hak Bileti</h4>

<img src="https://www.modum.tr/i/m/001/0016297.png" style="width:100%; max-width:250px; margin-bottom:10px; display:block;">

<p style="font-size:13px; color:#e2e8f0; margin:0;">
Bu bilet sayesinde, o gün katıldığın <b>TÜM çekilişlerde</b> ismin listeye 1 kez daha yazılır. Yani kazanma şansın otomatik olarak artar!
  </p>
  </div>
`,
      },
      {
        id: 4,
        title: "✨ XP (Puan) Nedir? Nasıl Kazanılır?",
        content: `
<div style="font-size:14px; color:#e2e8f0; margin-bottom:20px;">
XP (Deneyim Puanı), ModumNet dünyasındaki gücünü ve seviyeni gösterir. Sitede ne kadar aktif olursan, o kadar çok XP kazanırsın.
  </div>

<div style="display:flex; align-items:center; gap:15px; background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; margin-bottom:25px; border:1px solid rgba(255,255,255,0.1);">
<div style="width:100px;">
<img src="https://www.modum.tr/i/m/001/0016301.png" style="width:100%; border-radius:8px; border:1px solid #475569;">
  </div>
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#facc15;">Puanın Burada Yazar!</h4>
<div style="font-size:12px; color:#cbd5e1;">
Sol menüdeki profil kartında veya üst bar'da toplam puanını (XP) ve mevcut rütbeni anlık olarak takip edebilirsin.
  </div>
  </div>
  </div>

<h4 style="color:#fff; margin-bottom:10px; font-size:14px;">⚡ Nasıl Hızlı XP Kazanırım?</h4>
<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:25px;">
<div style="background:#1e293b; padding:10px; border-radius:8px; display:flex; align-items:center; gap:10px;">
<i class="fas fa-calendar-check" style="color:#4ade80; font-size:18px;"></i>
<span style="font-size:12px; color:#cbd5e1;"><b>Günlük Yoklama</b><br>Her gün gel, puanı kap.</span>
  </div>
<div style="background:#1e293b; padding:10px; border-radius:8px; display:flex; align-items:center; gap:10px;">
<i class="fas fa-shopping-bag" style="color:#f472b6; font-size:18px;"></i>
<span style="font-size:12px; color:#cbd5e1;"><b>Alışveriş Yaparak</b><br>Siparişlerin puana dönüşsün.</span>
  </div>
<div style="background:#1e293b; padding:10px; border-radius:8px; display:flex; align-items:center; gap:10px;">
<i class="fas fa-tasks" style="color:#60a5fa; font-size:18px;"></i>
<span style="font-size:12px; color:#cbd5e1;"><b>Görevleri Bitir</b><br>Basit görevleri tamamla.</span>
  </div>
<div style="background:#1e293b; padding:10px; border-radius:8px; display:flex; align-items:center; gap:10px;">
<i class="fas fa-user-plus" style="color:#fbbf24; font-size:18px;"></i>
<span style="font-size:12px; color:#cbd5e1;"><b>Arkadaş Davet Et</b><br>Getirdiğin her kişi kazandırır.</span>
  </div>
  </div>

<div style="background:rgba(15, 23, 42, 0.6); border:1px solid #334155; border-radius:12px; padding:15px; text-align:center;">
<h4 style="margin:0 0 10px 0; color:#fff; font-size:14px;">🏆 Zirvedekiler Listesi (Top 5)</h4>
<div style="display:flex; justify-content:center; margin-bottom:10px;">
<img src="https://www.modum.tr/i/m/001/0016302.png" style="width:100%; max-width:280px; border-radius:8px; box-shadow:0 5px 15px rgba(0,0,0,0.3);">
  </div>
<div style="font-size:12px; color:#94a3b8;">
En çok XP toplayanlar ana sayfada yayınlanır ve herkes tarafından görülür. Zirveye çıkmak senin elinde!
  </div>
  </div>
`,
      },
      {
        id: 5,
        title: "🛒 Puan Mağazası ve Kupon Kullanımı",
        content: `
<div style="font-size:14px; color:#e2e8f0; margin-bottom:20px;">
Biriktirdiğin XP puanlarını <b>Puan Mağazası</b>'nda gerçek ödüllere dönüştürebilirsin. İndirim kuponları, sürpriz kutular ve daha fazlası seni bekliyor!
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:15px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.1);">
<div style="display:flex; align-items:center; gap:15px;">
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#fff; font-size:14px;">1. Ürünü Seç ve Satın Al</h4>
<p style="font-size:12px; color:#94a3b8; margin:0;">Puan Mağazasına gir, bütçene uygun ödülün altındaki <b>"SATIN AL"</b> butonuna tıkla.</p>
  </div>
<div style="width:80px;">
<img src="https://www.modum.tr/i/m/001/0016303.png" style="width:100%; border-radius:6px; border:1px solid #334155;">
  </div>
  </div>
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:15px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.1);">
<div style="display:flex; align-items:center; gap:15px;">
<div style="width:100px;">
<img src="https://www.modum.tr/i/m/001/0016304.png" style="width:100%; border-radius:6px; border:1px solid #334155;">
  </div>
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#fff; font-size:14px;">2. Profiline Git</h4>
<p style="font-size:12px; color:#94a3b8; margin:0;">Satın aldığın kuponlar anında hesabına tanımlanır. Profilindeki <b>"Kuponlarım"</b> sekmesine tıkla.</p>
  </div>
  </div>
  </div>

<div style="background:rgba(14, 165, 233, 0.1); border:1px dashed #0ea5e9; border-radius:12px; padding:15px; text-align:center;">
<h4 style="margin:0 0 10px 0; color:#fff; font-size:14px;">3. Kodunu Al ve Alışverişe Başla!</h4>
<img src="https://www.modum.tr/i/m/001/0016144.png" style="width:100%; max-width:250px; border-radius:8px; margin-bottom:10px; box-shadow:0 5px 15px rgba(0,0,0,0.3);">
<div style="font-size:12px; color:#cbd5e1;">
Açılan ekranda indirim kodunu göreceksin. Bu kodu ödeme sayfasında kullanarak indirimini anında aktif edebilirsin!
  </div>
  </div>
`,
      },
      {
        id: 6,
        title: "🏆 Rozet Sistemi",
        content: `
<div style="font-size:14px; color:#e2e8f0; margin-bottom:20px;">
ModumNet'te sadece alışveriş yapmazsın, başarılarınla rütbe atlarsın! Kazandığın rozetler profilini süsler ve sana <b>Ekstra XP</b> kazandırır.
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:15px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.1); text-align:center;">
<h4 style="margin:0 0 10px 0; color:#fff; font-size:14px;">1. Rozet Vitrini</h4>
<img src="https://www.modum.tr/i/m/001/0016145.png" style="width:100%; border-radius:6px; margin-bottom:10px;">
<p style="font-size:12px; color:#94a3b8; margin:0;">
Profilinde kilitli veya açık tüm rozetleri görebilirsin. Her birinin değeri ve zorluğu farklıdır.
  </p>
  </div>

<div style="display:flex; align-items:center; gap:15px; background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.1);">
<div style="width:110px;">
<img src="https://www.modum.tr/i/m/001/0016146.png" style="width:100%; border-radius:6px; border:1px solid #334155;">
  </div>
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#facc15; font-size:13px;">Nasıl Açılır?</h4>
<p style="font-size:12px; color:#cbd5e1; margin:0;">
Merak ettiğin rozetin <b>üstüne tıkla</b>. Açılan pencerede senden istenen görevi (Örn: "3 Arkadaş Davet Et") gör ve tamamla!
  </p>
  </div>
  </div>

<div style="background:linear-gradient(to right, rgba(168, 85, 247, 0.1), transparent); border-left:4px solid #a855f7; padding:15px; border-radius:4px;">
<h4 style="margin:0 0 10px 0; color:#e879f9; font-size:14px;">🎁 Rozetini Aldığında Ne Olur?</h4>

<img src="https://www.modum.tr/i/m/001/0016147.png" style="width:100%; border-radius:8px; margin-bottom:10px; box-shadow:0 5px 15px rgba(0,0,0,0.3);">

<ul style="font-size:12px; color:#e2e8f0; margin:0; padding-left:20px; line-height:1.6;">
<li>Rozet görselini <b>Profil Resmi</b> yapabilirsin.</li>
<li>Başarını Story'de paylaşıp anında <b>50 XP</b> kazanabilirsin.</li>
<li>Rütben yükselir ve liderlik tablosunda öne çıkarsın!</li>
  </ul>
  </div>
`,
      },
      {
        id: 7,
        title: "🎯 Görevler ile Hızlı Puan",
        content: `
<div style="font-size:14px; color:#e2e8f0; margin-bottom:20px;">
Sadece çekiliş beklemek yetmez diyorsan, <b>Görevler</b> sekmesi tam sana göre! Sosyal medya takibi, yorum yapma gibi basit işlerle anında XP kazanabilirsin.
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:15px; margin-bottom:20px; border:1px solid rgba(255,255,255,0.1);">
<div style="display:flex; gap:15px;">
<div style="width:100px;">
<img src="https://www.modum.tr/i/m/001/0016148.png" style="width:100%; height:140px; object-fit:cover; object-position:top; border-radius:6px; border:1px solid #334155;">
  </div>
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#fff; font-size:14px;">1. Görevini Seç</h4>
<p style="font-size:12px; color:#94a3b8; margin:0;">
Listeden puanı ve süresi sana uygun olan bir göreve tıkla. Bazı görevler <b>Süreli (Saatlik)</b> olabilir, kaçırma!
  </p>
  </div>
  </div>
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:15px; margin-bottom:20px; border:1px solid rgba(255,255,255,0.1);">
<div style="display:flex; flex-direction:row-reverse; gap:15px;">
<div style="width:120px;">
<img src="https://www.modum.tr/i/m/001/0016150.png" style="width:100%; border-radius:6px; border:1px solid #334155;">
  </div>
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#4ade80; font-size:14px;">2. Kontrol Et ve Bitir</h4>
<p style="font-size:12px; color:#94a3b8; margin:0;">
Görevin adımlarını yap ve <b>"Kontrol Et"</b> butonuna bas. Eğer doğru yaptıysan yanına <b>Yeşil Tik ✅</b> gelir. Tüm adımlar bitince ödülün hesabına yatar!
  </p>
  </div>
  </div>
  </div>

<div style="background:rgba(234, 179, 8, 0.1); border-left:4px solid #eab308; padding:15px; border-radius:4px; font-size:12px; color:#fef08a;">
<i class="fas fa-bolt"></i> <b>İpucu:</b> Görevler sürekli yenilenir. Yüksek puanlı "Efsane" görevleri yakalamak için burayı sık sık kontrol et.
  </div>
`,
      },
      {
        id: 8,
        title: "🤝 Arkadaşını Davet Et (Ortaklık)",
        content: `
<div style="font-size:14px; color:#e2e8f0; margin-bottom:20px;">
ModumNet'te kazanmanın en hızlı yolu arkadaşlarını davet etmektir. Senin referansınla gelen her arkadaşın sana ömür boyu <b>XP ve Bonus</b> kazandırır.
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:15px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.1);">
<div style="display:flex; align-items:center; gap:15px;">
<div style="width:100px; text-align:center;">
<img src="https://www.modum.tr/i/m/001/0016304.png" style="width:100%; border-radius:8px; border:1px solid #334155;">
  </div>
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#fff; font-size:14px;">1. Ortaklık Menüsü</h4>
<p style="font-size:12px; color:#94a3b8; margin:0;">
Profiline gir ve menüdeki <b>"Ortaklık"</b> butonuna tıkla. Tüm referans işlemlerini buradan yöneteceksin.
  </p>
  </div>
  </div>
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:15px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.1);">
<div style="display:flex; align-items:center; gap:15px; flex-direction:row-reverse;">
<div style="width:120px; text-align:center;">
<img src="https://www.modum.tr/i/m/001/0016305.png" style="width:100%; border-radius:8px; border:1px solid #334155;">
  </div>
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#4ade80; font-size:14px;">2. Linkini Paylaş</h4>
<p style="font-size:12px; color:#94a3b8; margin:0;">
Sana özel oluşturulan <b>Referans Linkini</b> kopyala ve arkadaşlarına gönder. Onlar bu linkle kayıt olduklarında otomatik olarak senin ekibine dahil olurlar.
  </p>
  </div>
  </div>
  </div>

<div style="background:rgba(30, 41, 59, 0.6); border:1px dashed #64748b; border-radius:12px; padding:15px; text-align:center;">
<h4 style="margin:0 0 10px 0; color:#fff; font-size:14px;">3. Ekibini Büyüt</h4>
<div style="display:flex; justify-content:center; margin-bottom:10px;">
<img src="https://www.modum.tr/i/m/001/0016153.png" style="width:100%; max-width:200px; border-radius:6px;">
  </div>
<div style="font-size:12px; color:#cbd5e1;">
Davet ettiğin kişileri <b>"Ekip Arkadaşım"</b> sekmesinden görebilirsin. Ekibin ne kadar büyükse, kazancın o kadar artar!
  </div>
  </div>
`,
      },
      {
        id: 9,
        title: "🕵️ Altın Ürün Avı (Büyük Ödül)",
        content: `
<div style="font-size:14px; color:#e2e8f0; margin-bottom:20px;">
Kendine güveniyor musun dedektif? ModumNet'te her gün rastgele bir ürün <b>"Altın Ürün"</b> seçilir. İpuçlarını takip et, gizli ürünü bul ve büyük XP ödülünü kap!
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:15px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.1);">
<div style="display:flex; align-items:center; gap:15px;">
<div style="width:120px;">
<img src="https://www.modum.tr/i/m/001/0016154.png" style="width:100%; border-radius:6px; border:1px solid #334155;">
  </div>
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#facc15; font-size:14px;">1. İpucunu Yakala</h4>
<p style="font-size:12px; color:#94a3b8; margin:0;">
Görevler sayfasına git ve <b>"Altın Ürün"</b> kartını bul. Hangi kategoride (Örn: Ayakkabı, Çanta) arama yapman gerektiği orada yazar.
  </p>
  </div>
  </div>
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:15px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.1);">
<div style="text-align:center; margin-bottom:10px;">
<h4 style="margin:0 0 10px 0; color:#4ade80; font-size:14px;">2. Gizli Ürünü Buldun!</h4>
<img src="https://www.modum.tr/i/m/001/0016155.png" style="width:100%; max-width:250px; border-radius:8px; box-shadow:0 0 15px rgba(74, 222, 128, 0.2);">
  </div>
<p style="font-size:12px; color:#cbd5e1; text-align:center; margin:0;">
Doğru ürünün sayfasına girdiğin an ekrana bu <b>Özel Pop-up</b> çıkar. Tebrikler, hazineyi buldun!
  </p>
  </div>

<div style="display:flex; align-items:center; gap:15px; background:linear-gradient(to right, rgba(234, 179, 8, 0.1), transparent); border-left:4px solid #eab308; padding:15px; border-radius:4px;">
<div style="width:120px;">
<img src="https://www.modum.tr/i/m/001/0016157.png" style="width:100%; border-radius:6px;">
  </div>
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#fef08a; font-size:13px;">Hazine Hesabında!</h4>
<p style="font-size:12px; color:#e2e8f0; margin:0;">
Ödül anında bakiyene yansır. Puan geçmişinde <b>+300 XP</b> (veya o günün ödülü neyse) kazancını görebilirsin.
  </p>
  </div>
  </div>
`,
      },
      {
        id: 10,
        title: "🎁 Sürpriz Kutu (Yumurta) Avı",
        content: `
<div style="font-size:14px; color:#e2e8f0; margin-bottom:20px;">
Dikkatli bak! ModumNet'in farklı sayfalarına her gün rastgele <b>Sürpriz Kutular</b> gizlenir. Onları bulmak, ekstra XP kazanmanın en eğlenceli yoludur.
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:15px; margin-bottom:15px; border:1px solid rgba(255,255,255,0.1);">
<div style="display:flex; align-items:center; gap:15px;">
<div style="width:120px;">
<img src="https://www.modum.tr/i/m/001/0016158.png" style="width:100%; border-radius:6px; border:1px solid #334155;">
  </div>
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#facc15; font-size:14px;">1. Av Başlasın!</h4>
<p style="font-size:12px; color:#94a3b8; margin:0;">
Görevler sayfasına bak. Günde belirli bir sayıda (Örn: 5 kez) kutu bulma hakkın vardır. Sayacı buradan takip et.
  </p>
  </div>
  </div>
  </div>

<div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:15px;">

<div style="background:rgba(30, 41, 59, 0.6); padding:15px; border-radius:12px; border:1px dashed #ec4899; text-align:center;">
<h4 style="margin:0 0 10px 0; color:#f472b6; font-size:13px;">Bunu Bulmalısın!</h4>
<img src="https://www.modum.tr/i/m/001/0016160.png" style="width:80px; height:auto; margin-bottom:10px; animation: float 3s ease-in-out infinite;">
<p style="font-size:11px; color:#cbd5e1; margin:0;">
Kategori sayfalarında, ürün altlarında veya footer'da bu hediye kutusunu ara ve <b>üstüne tıkla</b>.
  </p>
  </div>

<div style="background:rgba(30, 41, 59, 0.6); padding:15px; border-radius:12px; border:1px solid #4ade80; text-align:center;">
<h4 style="margin:0 0 10px 0; color:#4ade80; font-size:13px;">Buldun!</h4>
<img src="https://www.modum.tr/i/m/001/0016159.png" style="width:100%; border-radius:6px; margin-bottom:5px;">
<p style="font-size:11px; color:#cbd5e1; margin:0;">
Doğru kutuya tıkladığında ekrana bu <b>Tebrikler</b> mesajı gelir.
  </p>
  </div>

  </div>

<div style="background:linear-gradient(to right, rgba(236, 72, 153, 0.1), transparent); border-left:4px solid #ec4899; padding:15px; border-radius:4px;">
<div style="display:flex; align-items:center; gap:15px;">
<div style="width:100px;">
<img src="https://www.modum.tr/i/m/001/0016161.png" style="width:100%; border-radius:6px; margin-bottom:10px;">
<img src="https://www.modum.tr/i/m/001/0016162.png" style="width:100%; border-radius:6px;">
  </div>
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#f9a8d4; font-size:13px;">Puanları Topla!</h4>
<p style="font-size:12px; color:#e2e8f0; margin:0;">
Her buluşta anında XP kazanırsın (Örn: +20 XP). Ayrıca görev ilerleme çubuğun dolar. Günlük tüm kutuları bul, bonusları kap!
  </p>
  </div>
  </div>
  </div>

<style>
@keyframes float {
0% { transform: translateY(0px); }
50% { transform: translateY(-10px); }
100% { transform: translateY(0px); }
}
  </style>
`,
      },
      {
        id: 11,
        title: "🖼️ Rütbe Tablosu ve Seviyeler",
        content: `
<div style="font-size:14px; color:#e2e8f0; margin-bottom:20px;">
ModumNet'te statünü belirleyen şey XP puanındır. Puan kazandıkça rütbe ilerleme çubuğun dolar ve bir üst lige çıkarsın. İşte yol haritan!
  </div>

<div style="background:rgba(255,255,255,0.05); border-radius:12px; padding:15px; margin-bottom:20px; border:1px solid rgba(255,255,255,0.1);">
<div style="display:flex; align-items:center; gap:15px;">
<div style="width:120px;">
<img src="https://www.modum.tr/i/m/001/0016163.png" style="width:100%; border-radius:6px; border:1px solid #334155;">
  </div>
<div style="flex:1;">
<h4 style="margin:0 0 5px 0; color:#fff; font-size:14px;">1. İlerlemeni Takip Et</h4>
<p style="font-size:12px; color:#94a3b8; margin:0;">
Profilinde rütbe çubuğunu görebilirsin. Çubuk dolduğunda otomatik olarak bir üst rütbeye atlarsın ve profilin daha havalı görünür!
  </p>
  </div>
  </div>
  </div>

<div style="background:rgba(30, 41, 59, 0.6); padding:15px; border-radius:12px; border:1px solid #6366f1; text-align:center;">
<h4 style="margin:0 0 10px 0; color:#818cf8; font-size:14px;">📈 Hedef Tablosu</h4>
<div style="margin-bottom:15px;">
<img src="https://www.modum.tr/i/m/001/0016164.png" style="width:100%; border-radius:8px; box-shadow:0 0 20px rgba(99, 102, 241, 0.2);">
  </div>
<div style="font-size:12px; color:#cbd5e1; text-align:left; background:rgba(0,0,0,0.2); padding:10px; border-radius:6px;">
<ul style="margin:0; padding-left:20px; line-height:1.8;">
<li><b>Çaylak & Bronz:</b> Yolun başı.</li>
<li><b>Gümüş & Altın:</b> İndirimlerin açıldığı seviye.</li>
<li><b>Elmas & Efsane:</b> Sitenin kralları! Özel ayrıcalıklar.</li>
  </ul>
  </div>
  </div>

<div style="margin-top:20px; text-align:center; padding:15px; background:linear-gradient(to right, #10b981, #3b82f6); border-radius:8px; color:white;">
<h4 style="margin:0 0 5px 0;">🎉 Tebrikler!</h4>
<div style="font-size:13px;">
ModumNet rehberini tamamladın. Artık kazanmaya hazırsın. Bol şans!
  </div>
  </div>
`,
      },
    ],

    openHelpModal: function () {
      var old = document.getElementById("mdm-help-modal");
      if (old) old.remove();
      var menuHtml = "";
      this.helpData.forEach((item, index) => {
        var activeClass = index === 0 ? "active" : "";
        menuHtml += `<div class="mdm-help-item ${activeClass}" onclick="ModumApp.loadHelpTopic(${item.id}, this)">${item.title}</div>`;
      });

      var html = `
<div id="mdm-help-modal" class="mdm-modal" style="display:flex; z-index:200000;">
<div class="mdm-modal-content" style="max-width:900px; width:95%;">
<div class="mdm-modal-header" style="background:#0f172a;">
<h3 style="margin:10; color:#fff; display:flex; align-items:center; gap:10px;"><i class="fas fa-book-open" style="color:#60a5fa"></i> Yardım & Rehber</h3>
<div class="mdm-modal-close" onclick="document.getElementById('mdm-help-modal').remove()">&times;</div>
  </div>
<div class="mdm-help-layout">
<div class="mdm-help-menu">${menuHtml}</div>
<div id="mdm-help-detail-area" class="mdm-help-content-area"></div>
  </div>
  </div>
  </div>`;

      var d = document.createElement("div");
      d.innerHTML = html;
      document.body.appendChild(d);
      this.loadHelpTopic(1);
    },

    loadHelpTopic: function (id, el) {
      if (el) {
        document
          .querySelectorAll(".mdm-help-item")
          .forEach((i) => i.classList.remove("active"));
        el.classList.add("active");
      }
      var topic = this.helpData.find((t) => t.id === id);
      var container = document.getElementById("mdm-help-detail-area");
      if (topic && container) {
        container.innerHTML = `
<h2 style="color:#fff; border-bottom:1px solid #334155; padding-bottom:10px; margin-top:0;">${topic.title}</h2>
<div style="font-size:15px; color:#cbd5e1;">${topic.content}</div>
`;
      }
    },
    // --- 🏆 RÜTBE SİSTEMİ BİLGİ PENCERESİ (YENİ) ---
    openRankInfoModal: function () {
      var userXP =
        APP_STATE.user && APP_STATE.user.puan
          ? parseInt(APP_STATE.user.puan)
          : 0;
      var currentLevel =
        APP_STATE.user && APP_STATE.user.seviye
          ? APP_STATE.user.seviye
          : "Çaylak";

      // Rütbe Tanımları
      var ranks = [
        {
          name: "Çaylak",
          icon: "🌱",
          min: 0,
          color: "#10b981",
          desc: "Başlangıç seviyesi. Aramıza hoş geldin! Usta İçin +1 Sipariş Verilmesi Gerekli",
        },
        {
          name: "Usta",
          icon: "⚔️",
          min: 2500,
          color: "#8b5cf6",
          desc: "Deneyimli üye. Artık işi biliyorsun.Şampion İçin +2 Sipariş Verilmesi Gerekli",
        },
        {
          name: "Şampiyon",
          icon: "🦁",
          min: 7500,
          color: "#f59e0b",
          desc: "Lider ruhlu. Rakiplerin senden korksun.Efsane için +3 Sipariş Verilmesi Gerekli",
        },
        {
          name: "Efsane",
          icon: "🐉",
          min: 15000,
          color: "#ef4444",
          desc: "Zirvenin sahibi. Saygı duyulan üye.",
        },
      ];

      var listHtml = "";

      ranks.forEach((r) => {
        var isCurrent = r.name === currentLevel;
        var isPassed = userXP >= r.min;

        // Stil Ayarları
        var bg = isCurrent
          ? `background:linear-gradient(90deg, ${r.color}20, transparent); border-left:4px solid ${r.color};`
          : `background:rgba(255,255,255,0.03); border-left:4px solid #334155;`;
        var opacity = isPassed || isCurrent ? "1" : "0.5";
        var checkIcon = isPassed
          ? '<i class="fas fa-check-circle" style="color:#10b981"></i>'
          : '<i class="far fa-circle" style="color:#64748b"></i>';
        if (isCurrent)
          checkIcon =
            '<span style="background:' +
            r.color +
            '; color:white; font-size:9px; padding:2px 6px; border-radius:4px;">MEVCUT</span>';

        listHtml += `
<div style="display:flex; align-items:center; gap:15px; padding:12px; margin-bottom:8px; border-radius:8px; ${bg} opacity:${opacity}; transition:0.2s;">
<div style="font-size:24px; width:40px; text-align:center;">${r.icon}</div>
<div style="flex:1;">
<div style="font-weight:800; color:#fff; font-size:14px; display:flex; justify-content:space-between;">
<span>${r.name}</span>
<span style="font-size:12px; color:${
          r.color
        }">${r.min.toLocaleString()} XP</span>
  </div>
<div style="font-size:11px; color:#94a3b8; margin-top:2px;">${r.desc}</div>
  </div>
<div>${checkIcon}</div>
  </div>
`;
      });

      // Modal HTML
      var html = `
<div id="mdm-rank-modal" class="mdm-modal active" style="z-index:999999; display:flex; align-items:center; justify-content:center;">
<div class="mdm-modal-content" style="width:90%; max-width:400px; background:#0f172a; padding:0; border-radius:20px; border:1px solid #334155; overflow:hidden;">

<div style="background:linear-gradient(135deg, #1e293b, #0f172a); padding:20px; text-align:center; border-bottom:1px solid #334155; position:relative;">
<div onclick="document.getElementById('mdm-rank-modal').remove()" style="position:absolute; top:15px; right:15px; color:#64748b; cursor:pointer; font-size:20px;">&times;</div>
<div style="font-size:40px; margin-bottom:10px;">🏆</div>
<h3 style="margin:0; color:#fff; font-size:18px;">Rütbe Sistemi</h3>
<p style="margin:5px 0 0; font-size:12px; color:#94a3b8;">Puan topla, rütbeni yükselt, ayrıcalık kazan!</p>
  </div>

<div style="padding:20px; max-height:400px; overflow-y:auto;">
${listHtml}

<div style="margin-top:20px; background:rgba(59, 130, 246, 0.1); border:1px dashed #3b82f6; padding:10px; border-radius:8px; font-size:11px; color:#60a5fa; text-align:center;">
<i class="fas fa-info-circle"></i> Rütben arttıkça, mağazada kilitli olan özel ürünleri ve indirimleri alabilirsin.
  </div>
  </div>

  </div>
  </div>`;

      var d = document.createElement("div");
      d.innerHTML = html;
      document.body.appendChild(d);
    },
    // --- 🌍 GOOGLE GÖREVİ DOĞRULAMA (ModumApp İÇİNE UYUMLU VERSİYON) ---
    verifyGoogleTask: function (taskId, link) {
      // 1. Güvenlik
      if (!APP_STATE.user || !APP_STATE.user.email) {
        return alert("Puan kazanmak için önce giriş yapmalısın! 🔒");
      }

      // 2. Linki Aç
      if (link && link !== "undefined") window.open(link, "_blank");

      // 3. Butonu Bul (Otomatik Algılama)
      var btn = window.event ? window.event.target : null;
      if (btn && (btn.tagName === "I" || btn.tagName === "SPAN")) {
        btn = btn.closest("button");
      }

      var originalText = "";
      if (btn) {
        originalText = btn.innerHTML;
        btn.innerHTML =
          '<i class="fas fa-circle-notch fa-spin"></i> Kontrol...';
        btn.disabled = true;
        btn.style.opacity = "0.7";
      }

      // 4. Bekle ve Onayla
      setTimeout(function () {
        fetchApi("complete_task_step", {
          email: APP_STATE.user.email,
          taskId: taskId,
          step: 1, // Adım 1 Onayı
        }).then((res) => {
          if (res && res.success) {
            alert("🎉 TEBRİKLER! Görev onaylandı.");
            if (btn) {
              btn.innerHTML = "✅ TAMAMLANDI";
              btn.style.background = "#10b981";
            }
            var outerBtn = document.querySelector(
              "#task-card-" + taskId + " .mdm-btn-toggle",
            );
            if (outerBtn) {
              outerBtn.innerText = "Tamamlandı ✅";
              outerBtn.style.background = "#10b981"; // Onu da Yeşil yap
              // Butonun hafızasını da güncelle ki kapanıp açılınca bozulmasın
              outerBtn.setAttribute("data-original-text", "Tamamlandı ✅");
            }
            if (window.loadTasksData) window.loadTasksData();
            if (window.updateDataInBackground) window.updateDataInBackground();
          } else {
            ModumApp.showToast(res ? res.message : "Hata oluştu.", "error");
            if (btn) {
              btn.innerHTML = originalText;
              btn.disabled = false;
              btn.style.opacity = "1";
            }
          }
        });
      }, 5000);
    }, // <-- BU VİRGÜL ÇOK ÖNEMLİ! YOKSA SİSTEM ÇÖKER.
    // --- 🖼️ ÇERÇEVE GÖREVİ DOĞRULAMA (SIKI KONTROL v2.0) ---
    verifyFrameTask: function (taskId) {
      // 1. Güvenlik
      if (!APP_STATE.user || !APP_STATE.user.email) {
        return alert("Lütfen önce giriş yapın.");
      }

      // 2. Çerçeve Analizi (Sıkı Filtre)
      var rawFrames = APP_STATE.user.ownedFrames || [];

      // Boşlukları, null'ları ve 'default' değerlerini temizle
      var validFrames = rawFrames.filter(function (f) {
        return (
          f && f !== "" && f !== "default" && f !== "null" && f !== "undefined"
        );
      });

      var hasRealFrame = validFrames.length > 0;

      if (hasRealFrame) {
        // --- A. GEÇERLİ ÇERÇEVE VARSA: GÖREVİ TAMAMLA ---
        var btn = window.event ? window.event.target : null;
        if (btn) {
          btn.innerHTML =
            '<i class="fas fa-circle-notch fa-spin"></i> Onaylanıyor...';
          btn.disabled = true;
        }

        // Backend'e sinyal gönder
        fetchApi("complete_task_step", {
          email: APP_STATE.user.email,
          taskId: taskId,
          step: 1,
        }).then((res) => {
          if (res && res.success) {
            ModumApp.showToast(
              "🎉 Profil Mimarı görevi tamamlandı! +250 XP",
              "success",
            );

            // Butonu Yeşil Yap
            if (btn) {
              btn.innerHTML = "✅ TAMAMLANDI";
              btn.style.background = "#10b981";
            }

            // Ekranı Yenile
            if (window.loadTasksData) window.loadTasksData();
            if (window.updateDataInBackground) updateDataInBackground();
          } else {
            ModumApp.showToast(
              "⚠️ " + (res ? res.message : "Hata oluştu."),
              "error",
            );
            if (btn) {
              btn.innerHTML = "Tekrar Dene";
              btn.disabled = false;
            }
          }
        });
      } else {
        // --- B. ÇERÇEVE YOKSA: MAĞAZAYA YÖNLENDİR ---
        if (
          confirm(
            "Henüz koleksiyonunda hiç çerçeve yok. 🛍️\n\nBu görevi tamamlamak için Mağazadan bir çerçeve satın almalısın. Mağazaya gidilsin mi?",
          )
        ) {
          ModumApp.switchTab("store");
          // Mağazada direkt "Kozmetik" sekmesini açtırabiliriz
          setTimeout(() => {
            ModumApp.switchStoreCategory("products");
          }, 500);
        }
      }
    },
    // --- 🗳️ ANKET LİSTESİ MODALI (YENİ) ---
    openSurveyModal: function () {
      if (!APP_STATE.user || !APP_STATE.user.email)
        return ModumApp.showGuestPopup("daily");

      // Önce temizlik
      var old = document.getElementById("mdm-survey-modal");
      if (old) old.remove();

      // Yükleniyor ekranı
      var loadingHtml = `<div id="mdm-survey-modal" class="mdm-modal active" style="z-index:99999;"><div class="mdm-modal-content" style="text-align:center; padding:40px;"><i class="fas fa-circle-notch fa-spin"></i> Anketler Yükleniyor...</div></div>`;
      document.body.insertAdjacentHTML("beforeend", loadingHtml);

      // Listeyi Çek
      fetchApi("get_all_surveys_for_user", {
        email: APP_STATE.user.email,
      }).then((res) => {
        var modalDiv = document.getElementById("mdm-survey-modal");
        if (!modalDiv) return;

        if (!res.success || res.list.length === 0) {
          modalDiv.innerHTML = `<div class="mdm-modal-content" style="padding:30px; text-align:center; background:#1e293b; border:1px solid #334155;">
<h3>📭 Aktif Anket Yok</h3>
<p style="color:#94a3b8;">Şu an aktif bir oylama bulunmuyor.</p>
<button onclick="document.getElementById('mdm-survey-modal').remove()" class="mdm-btn-lucky" style="width:auto; padding:8px 20px; margin-top:15px;">Kapat</button>
  </div>`;
          return;
        }

        // Listeyi Oluştur
        var listHtml = "";
        res.list.forEach((s) => {
          var icon = s.hasVoted
            ? '<i class="fas fa-check-circle" style="color:#10b981;"></i>'
            : '<i class="far fa-circle" style="color:#fbbf24;"></i>';
          var statusText = s.hasVoted
            ? '<span style="color:#10b981; font-size:11px;">Tamamlandı</span>'
            : `<span style="color:#fbbf24; font-size:11px;">+${s.reward} XP Kazan</span>`;
          var bgStyle = s.hasVoted
            ? "background:rgba(255,255,255,0.02); opacity:0.7;"
            : "background:rgba(255,255,255,0.05); border-color:#6366f1;";

          listHtml += `
<div onclick="ModumApp.loadSurveyDetail('${s.id}')" style="${bgStyle} border:1px solid #334155; padding:15px; border-radius:10px; margin-bottom:10px; cursor:pointer; display:flex; align-items:center; gap:12px; transition:0.2s;">
<div style="font-size:20px;">${icon}</div>
<div style="flex:1;">
<div style="color:#fff; font-weight:600; font-size:13px;">${s.question}</div>
<div style="margin-top:2px;">${statusText}</div>
  </div>
<i class="fas fa-chevron-right" style="color:#64748b; font-size:12px;"></i>
  </div>`;
        });

        var modalBody = `
<div class="mdm-modal-content" style="background:#1e293b; max-width:450px; border:1px solid #475569; max-height:80vh; overflow-y:auto;">
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
<h3 style="margin:0; color:#fff;">📢 Anketler</h3>
<span onclick="document.getElementById('mdm-survey-modal').remove()" style="cursor:pointer; color:#94a3b8; font-size:20px;">×</span>
  </div>
<div id="survey-list-area">${listHtml}</div>
  </div>`;

        modalDiv.innerHTML = modalBody;
      });
    },

    // --- TEKİL ANKET DETAYINI AÇ ---
    loadSurveyDetail: function (surveyId) {
      var area = document.getElementById("survey-list-area");
      if (area)
        area.innerHTML =
          '<div style="text-align:center; padding:20px; color:#94a3b8;"><i class="fas fa-circle-notch fa-spin"></i> Yükleniyor...</div>';

      fetchApi("get_survey_detail", {
        email: APP_STATE.user.email,
        surveyId: surveyId,
      }).then((res) => {
        if (!res.success) return alert(res.message);

        var htmlContent = "";

        // EĞER OY KULLANDIYSA -> SONUÇLARI GÖSTER
        if (res.hasVoted) {
          var totalVotes = res.totalVotes || 1;
          var barsHtml = "";

          res.options.forEach((opt, idx) => {
            var count = res.votes[idx] || 0;
            var percent = Math.round((count / totalVotes) * 100);

            barsHtml += `
<div style="margin-bottom:10px;">
<div style="display:flex; justify-content:space-between; font-size:12px; color:#fff; margin-bottom:3px;">
<span>${opt}</span>
<span>%${percent} (${count} oy)</span>
  </div>
<div style="width:100%; height:8px; background:#334155; border-radius:10px; overflow:hidden;">
<div style="width:${percent}%; height:100%; background:linear-gradient(90deg, #10b981, #34d399);"></div>
  </div>
  </div>`;
          });

          htmlContent = `
<div style="text-align:center; margin-bottom:20px;">
<i class="fas fa-check-circle" style="font-size:40px; color:#10b981; margin-bottom:10px;"></i>
<h3 style="margin:0; color:#fff;">Oyunuz Alındı!</h3>
<p style="color:#94a3b8; font-size:12px;">Teşekkürler. İşte sonuçlar:</p>
  </div>
<div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:12px; border:1px solid #334155;">
${barsHtml}
  </div>
<button onclick="ModumApp.openSurveyModal()" style="width:100%; margin-top:15px; background:transparent; border:1px solid #475569; color:#cbd5e1; padding:10px; border-radius:8px; cursor:pointer;">🔙 Listeye Dön</button>
`;
        }
        // EĞER OY KULLANMADIYSA -> OY KULLANMA EKRANI
        else {
          var btnsHtml = "";
          res.options.forEach((opt, idx) => {
            btnsHtml += `
<button onclick="ModumApp.submitVote('${res.id}', ${idx})" 
style="width:100%; text-align:left; background:rgba(255,255,255,0.05); border:1px solid #334155; padding:15px; border-radius:10px; color:#fff; margin-bottom:10px; cursor:pointer; transition:0.2s; display:flex; align-items:center;">
<div style="width:24px; height:24px; border:2px solid #64748b; border-radius:50%; margin-right:10px; display:flex; align-items:center; justify-content:center;"></div>
${opt}
  </button>`;
          });

          htmlContent = `
<h3 style="color:#fff; text-align:center; margin-top:0;">${res.question}</h3>
<div style="background:#f59e0b20; border:1px dashed #f59e0b; color:#f59e0b; padding:8px; border-radius:8px; font-size:11px; text-align:center; margin-bottom:20px;">
🎁 Oylamaya katıl, anında <b>${res.reward} XP</b> kazan!
  </div>
<div id="survey-options-area">${btnsHtml}</div>
<button onclick="ModumApp.openSurveyModal()" style="width:100%; margin-top:10px; background:transparent; border:none; color:#64748b; font-size:12px; cursor:pointer;">İptal ve Geri Dön</button>
`;
        }

        if (area) area.innerHTML = htmlContent;
      });
    },

    // OY GÖNDERME
    submitVote: function (surveyId, index) {
      var area = document.getElementById("survey-options-area");
      if (area) area.style.opacity = "0.5";

      fetchApi("vote_survey", {
        email: APP_STATE.user.email,
        surveyId: surveyId,
        optionIndex: index,
      }).then((res) => {
        if (res.success) {
          alert("🎉 " + res.message);
          ModumApp.loadSurveyDetail(surveyId); // Sonuçları göster
          updateDataInBackground();
        } else {
          alert("Hata: " + res.message);
        }
      });
    },
    // --- 🔥 YENİ: MAĞAZA KATEGORİ DEĞİŞTİRİCİ (REVİZE EDİLMİŞ) ---
    switchStoreCategory: function (category) {
      if (!APP_STATE.storeContext) return;

      var items = APP_STATE.storeContext.items || [];
      var purchased = APP_STATE.storeContext.purchased || [];
      var ownedFrames = APP_STATE.user.ownedFrames || [];

      // 1. Buton Görselliği
      document.querySelectorAll(".mdm-store-tab-btn").forEach((btn) => {
        if (btn.dataset.tab === category) {
          btn.style.background = "#3b82f6";
          btn.style.color = "#fff";
          btn.style.borderColor = "#60a5fa";
          btn.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.4)";
        } else {
          btn.style.background = "rgba(255,255,255,0.05)";
          btn.style.color = "#94a3b8";
          btn.style.borderColor = "rgba(255,255,255,0.1)";
          btn.style.boxShadow = "none";
        }
      });

      var container = document.getElementById("mdm-store-dynamic-content");
      if (!container) return;

      var finalHtml = "";

      // --- 🅰️ TAB 1: DİJİTAL KUPONLAR + ÖZEL FIRSATLAR ---
      if (category === "coupons") {
        // 1. Önce "Özel Fırsatları" Bul (Sandık, Hak, Bilet)
        const specialItems = items.filter((i) => {
          let t = i.title.toLowerCase();
          let isFrame = t.includes("çerçeve") || i.type === "avatar_frame";
          let isSpecial =
            t.includes("sandık") ||
            t.includes("kutu") ||
            t.includes("hak") ||
            t.includes("bilet");
          return !isFrame && isSpecial;
        });

        // 2. Sonra "Normal Kuponları" Bul
        const couponItems = items.filter((i) => {
          let t = i.title.toLowerCase();
          let isFrame = t.includes("çerçeve") || i.type === "avatar_frame";
          let isSpecial =
            t.includes("sandık") ||
            t.includes("kutu") ||
            t.includes("hak") ||
            t.includes("bilet");
          return !isFrame && !isSpecial;
        });

        // 3. EKRANA BAS (Önce Özeller, Sonra Kuponlar)

        // A) ÖZEL FIRSATLAR (En Tepeye)
        if (specialItems.length > 0) {
          finalHtml += ModumApp.renderStoreGrid(
            specialItems,
            purchased,
            "🔥 ÖZEL FIRSATLAR",
          );
        }

        // B) STANDART KUPONLAR
        if (couponItems.length > 0) {
          // Araya bir çizgi çekelim şık dursun
          if (specialItems.length > 0)
            finalHtml += `<div style="height:1px; background:#334155; margin:30px 10px;"></div>`;
          finalHtml += ModumApp.renderStoreGrid(
            couponItems,
            purchased,
            "🎫 İNDİRİM KUPONLARI",
          );
        }

        if (specialItems.length === 0 && couponItems.length === 0) {
          finalHtml +=
            '<div style="text-align:center; padding:30px; color:#94a3b8;">Aktif kupon bulunamadı.</div>';
        }
      }

      // --- 🅱️ TAB 2: ÜRÜNLER (Sadece Çerçeveler ve Gelecek Ürünler) ---
      if (category === "products") {
        // Sadece Çerçeveleri Bul
        const frameItems = items.filter(
          (i) =>
            i.title.toLowerCase().includes("çerçeve") ||
            i.type === "avatar_frame",
        );

        if (frameItems.length > 0) {
          let framesHtml = "";
          frameItems.forEach((f) => {
            const frameClass = f.kupon_kodu || f.code || "";
            const isOwned =
              ownedFrames.includes(frameClass) ||
              purchased.some((h) => h.includes(f.title.toLowerCase()));

            let btnText = `<div style="font-size:12px; font-weight:800; color:#fbbf24;">${f.costXP} XP</div>`;
            let action = `onclick="ModumApp.openFramePurchaseModal('${f.id}', '${f.title}', ${f.costXP}, '${frameClass}')"`;
            let cardStyle = "";

            if (isOwned) {
              btnText = `<div style="font-size:10px; font-weight:bold; color:#4ade80;">SAHİPSİN ✅</div>`;
              action = "";
              cardStyle = "opacity:0.6; filter:grayscale(0.5);";
            }

            framesHtml += `
<div class="mdm-frame-card" style="${cardStyle}" ${action}>
<div class="mdm-preview-avatar">
<div class="mdm-avatar-frame ${frameClass}"></div> 👤
  </div>
<div style="font-size:11px; color:#fff; font-weight:bold; margin-bottom:5px; text-align:center; line-height:1.2;">${f.title}</div>
${btnText}
  </div>`;
          });

          finalHtml += `
<div class="mdm-cosmetic-area" style="margin-top:0;">
<i class="fas fa-magic mdm-cosmetic-bg-icon"></i>
<div class="mdm-cosmetic-title"><i class="fas fa-gem"></i> KOZMETİK & AKSESUAR</div>
<div class="mdm-frame-showcase">${framesHtml}</div>
  </div>`;
        } else {
          finalHtml +=
            '<div style="text-align:center; padding:30px; color:#94a3b8;">Yakında buraya efsane ürünler gelecek!</div>';
        }
      }

      container.innerHTML = finalHtml;
    },

    // --- YARDIMCI: GRİD BASMA MOTORU (PREMIUM TICKET TASARIMI 🎟️) ---
    renderStoreGrid: function (productList, purchasedList, headerTitle) {
      const LEVEL_POWER = { Çaylak: 1, Usta: 2, Şampiyon: 3, Efsane: 4 };
      const userLevel = APP_STATE.user.seviye || "Çaylak";
      const myPower = LEVEL_POWER[userLevel] || 1;
      const myCurrentPuan = parseInt(APP_STATE.user.puan) || 0;

      // Gruplama
      const groups = { Çaylak: [], Usta: [], Şampiyon: [], Efsane: [] };
      productList.forEach((item) => {
        let lvl = "Çaylak";
        let r = (item.minLevel || "").toLowerCase();
        if (r.includes("efsane")) lvl = "Efsane";
        else if (r.includes("şampiyon") || r.includes("sampiyon"))
          lvl = "Şampiyon";
        else if (r.includes("usta")) lvl = "Usta";
        groups[lvl].push(item);
      });

      let html = "";
      const order = ["Çaylak", "Usta", "Şampiyon", "Efsane"];

      order.forEach((groupName) => {
        const products = groups[groupName];
        if (products.length === 0) return;

        let themeClass = "theme-caylak";
        if (groupName === "Usta") themeClass = "theme-usta";
        if (groupName === "Şampiyon") themeClass = "theme-sampiyon";
        if (groupName === "Efsane") themeClass = "theme-efsane";

        const reqPower = LEVEL_POWER[groupName] || 1;
        const isLockedGroup = myPower < reqPower;
        const lockIcon = isLockedGroup ? '<i class="fas fa-lock"></i>' : "";

        // Grup Başlığı
        html += `<div style="margin-top:20px; margin-bottom:10px; padding-left:10px; border-left:4px solid #fff; opacity:0.8;">
<h3 style="color:#fff; font-size:14px; margin:0; font-weight:800;">${groupName} ${headerTitle} ${lockIcon}</h3>
  </div>
<div class="mdm-store-grid">`;

        products.forEach((p) => {
          let titleLower = p.title.toLowerCase();
          let isUnlimited =
            titleLower.includes("hak") ||
            titleLower.includes("sandık") ||
            titleLower.includes("kutu");
          let alreadyBought =
            !isUnlimited && purchasedList.some((h) => h.includes(titleLower));
          let itemCost = parseInt(p.costXP) || 0;
          let stock = parseInt(p.stock) || 0;

          let btnHtml = "";
          let btnStyle = "";
          let cardOpacity = "1";

          // Buton ve Durum Mantığı
          if (isLockedGroup) {
            btnHtml = `<i class="fas fa-lock"></i> SEVİYE YETERSİZ`;
            btnStyle = "background:#334155; color:#94a3b8; cursor:not-allowed;";
            cardOpacity = "0.5";
          } else if (stock <= 0) {
            btnHtml = "TÜKENDİ";
            btnStyle = "background:#ef4444; color:white; cursor:not-allowed;";
            cardOpacity = "0.7";
          } else if (alreadyBought) {
            btnHtml = `<i class="fas fa-check"></i> ALINDI`;
            btnStyle = "background:#475569; color:#fff; cursor:default;";
            cardOpacity = "0.6";
          } else if (myCurrentPuan < itemCost) {
            btnHtml = "PUAN YETERSİZ";
            btnStyle =
              "background:rgba(255,255,255,0.1); color:#94a3b8; border:1px solid #334155; cursor:not-allowed;";
          } else {
            btnHtml = "SATIN AL";
            btnStyle =
              "background:#10b981; color:white; box-shadow:0 4px 10px rgba(16,185,129,0.3); animation:pulse 2s infinite;";
          }

          // Satın Alma Aksiyonu
          let action =
            btnHtml === "SATIN AL"
              ? `onclick="ModumApp.buyItem('${p.id}', '${p.title}', ${p.costXP})"`
              : "";

          // İkon Belirleme
          let icon = "🎁";
          if (titleLower.includes("indirim")) icon = "🏷️";
          if (titleLower.includes("kargo")) icon = "🚚";
          if (titleLower.includes("hak")) icon = "🎟️";
          if (titleLower.includes("sandık")) icon = "🎰";

          // HTML (Yeni Ticket Tasarımı)
          html += `
<div class="mdm-premium-ticket ${themeClass}" style="opacity:${cardOpacity};">
<div class="ticket-left">
<div class="ticket-icon">${icon}</div>
<div class="ticket-cost">${
            p.costXP
          }<br><span style="font-size:10px; font-weight:normal; color:#cbd5e1;">XP</span></div>
<div class="ticket-lvl">${groupName}</div>
  </div>
<div class="ticket-right">
<div class="ticket-title">${p.title}</div>
<div class="ticket-desc">${
            p.description || "Hemen kullanabileceğin özel kupon."
          }</div>

${
  stock < 5 && stock > 0
    ? `<div style="font-size:9px; color:#ef4444; font-weight:bold; margin-bottom:5px;">🔥 SON ${stock} ADET!</div>`
    : ""
}

<button class="ticket-btn" style="${btnStyle}" ${action}>${btnHtml}</button>
  </div>
  </div>`;
        });
        html += `</div>`;
      });
      return html;
    },
    // --- 📱 PWA KURULUM REHBERİ ---
    openInstallGuide: function () {
      // Cihaz Tespiti
      var ua = navigator.userAgent.toLowerCase();
      var isIOS = /iphone|ipad|ipod/.test(ua);
      var isAndroid = /android/.test(ua);

      // İçerik Hazırla
      var icon = isIOS ? "fas fa-share-square" : "fas fa-ellipsis-v"; // iOS için Paylaş ikonu, Android için 3 nokta
      var step1 = isIOS
        ? "Aşağıdaki <b>Paylaş</b> butonuna bas."
        : "Tarayıcının sağ üstündeki <b>3 Nokta</b> menüsüne bas.";
      var step2 = "Açılan menüden <b>'Ana Ekrana Ekle'</b> seçeneğini bul.";
      var step3 = "Sağ üst köşeden <b>'Yükle'</b> diyerek tamamla.";

      var html = `
<div id="mdm-install-modal" class="mdm-modal active" style="z-index:999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px);">
<div class="mdm-modal-content" style="width:90%; max-width:350px; background:#1e293b; border:1px solid #334155; border-radius:24px; padding:30px; text-align:center; position:relative;">

<div onclick="document.getElementById('mdm-install-modal').remove()" style="position:absolute; top:15px; right:15px; font-size:24px; color:#64748b; cursor:pointer;">×</div>

<div style="width:60px; height:60px; background:linear-gradient(135deg, #3b82f6, #2563eb); border-radius:16px; margin:0 auto 20px; display:flex; align-items:center; justify-content:center; font-size:30px; color:white; box-shadow:0 10px 30px rgba(59, 130, 246, 0.4);">
<i class="fas fa-download"></i>
  </div>

<h3 style="color:white; margin:0 0 10px 0; font-size:18px;">Uygulamayı Yükle</h3>
<p style="color:#94a3b8; font-size:13px; line-height:1.5; margin-bottom:25px;">ModumNet'e daha hızlı erişmek ve tam ekran deneyimi yaşamak için ana ekranına ekle.</p>

<div style="text-align:left; background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
<div style="display:flex; gap:10px; margin-bottom:10px;">
<div style="width:24px; height:24px; background:#334155; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold;">1</div>
<div style="font-size:12px; color:#cbd5e1; flex:1;">${step1} <i class="${icon}" style="color:#fbbf24; margin-left:5px;"></i></div>
  </div>
<div style="display:flex; gap:10px; margin-bottom:10px;">
<div style="width:24px; height:24px; background:#334155; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold;">2</div>
<div style="font-size:12px; color:#cbd5e1; flex:1;">${step2} <i class="fas fa-plus-square" style="color:#fbbf24; margin-left:5px;"></i></div>
  </div>
<div style="display:flex; gap:10px;">
<div style="width:24px; height:24px; background:#334155; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold;">3</div>
<div style="font-size:12px; color:#cbd5e1; flex:1;">${step3}</div>
  </div>
  </div>

<button onclick="document.getElementById('mdm-install-modal').remove()" style="width:100%; margin-top:20px; background:#3b82f6; color:white; border:none; padding:12px; border-radius:12px; font-weight:bold; cursor:pointer;">Anladım 👍</button>
  </div>
  </div>`;

      var div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);
    },
    // --- 🔔 MODERN TOAST BİLDİRİM SİSTEMİ ---
    showToast: function (msg, type = "success") {
      // 1. Eğer stil eklenmediyse ekle
      if (!document.getElementById("mdm-toast-style")) {
        var css = `
#mdm-toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
.mdm-toast { 
min-width: 300px; background: #1e293b; color: #fff; padding: 16px; border-radius: 12px; 
box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 12px;
animation: toastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; 
border-left: 5px solid #334155; pointer-events: auto; opacity: 0; transform: translateX(50px);
font-family: 'Outfit', sans-serif; font-size: 13px; line-height: 1.4;
}
.mdm-toast.success { border-left-color: #10b981; }
.mdm-toast.success .t-icon { color: #10b981; }
.mdm-toast.error { border-left-color: #ef4444; }
.mdm-toast.error .t-icon { color: #ef4444; }
.mdm-toast.info { border-left-color: #3b82f6; }
.mdm-toast.info .t-icon { color: #3b82f6; }

.t-icon { font-size: 20px; background: rgba(255,255,255,0.05); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.t-close { margin-left: auto; cursor: pointer; color: #64748b; font-size: 16px; transition: 0.2s; }
.t-close:hover { color: #fff; }

@keyframes toastIn { to { opacity: 1; transform: translateX(0); } }
@keyframes toastOut { to { opacity: 0; transform: translateX(100px); } }

@media (max-width: 768px) {
#mdm-toast-container { top: auto; bottom: 80px; right: 10px; left: 10px; align-items: center; }
.mdm-toast { width: 100%; min-width: auto; animation: toastUp 0.3s forwards; }
@keyframes toastUp { from { transform: translateY(50px); opacity:0; } to { transform: translateY(0); opacity:1; } }
}
`;
        var s = document.createElement("style");
        s.id = "mdm-toast-style";
        s.innerHTML = css;
        document.head.appendChild(s);

        var c = document.createElement("div");
        c.id = "mdm-toast-container";
        document.body.appendChild(c);
      }

      var container = document.getElementById("mdm-toast-container");
      var icon =
        type === "success"
          ? '<i class="fas fa-check"></i>'
          : type === "error"
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-info"></i>';

      var t = document.createElement("div");
      t.className = `mdm-toast ${type}`;
      t.innerHTML = `
<div class="t-icon">${icon}</div>
<div>${msg}</div>
<div class="t-close" onclick="this.parentElement.remove()">×</div>
`;

      container.appendChild(t);

      // Ses Efekti (Hafif bir 'bip')
      // İstersen buraya ses kodu ekleyebiliriz ama şimdilik sessiz kalsın.

      // 4 Saniye sonra sil
      setTimeout(() => {
        t.style.animation = "toastOut 0.3s forwards";
        setTimeout(() => {
          t.remove();
        }, 300);
      }, 4000);
    },
    // --- 📅 GOOGLE TAKVİM HATIRLATMA ---
    addToCalendar: function (title, dateStr) {
      // Tarih formatını düzelt (YYYYMMDDTHHmmSSZ formatına çevir)
      var d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        // Eğer tarih bozuksa yarına ayarla
        d = new Date();
        d.setDate(d.getDate() + 1);
      }

      var start = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      var end = new Date(d.getTime() + 60 * 60 * 1000)
        .toISOString()
        .replace(/-|:|\.\d\d\d/g, ""); // 1 saat sonrası

      var calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        title + " - Son Şans!",
      )}&dates=${start}/${end}&details=${encodeURIComponent(
        "ModumNet çekilişi sona eriyor! Hemen katıl: " + window.location.href,
      )}&sf=true&output=xml`;

      window.open(calendarUrl, "_blank");
    }, // <-- Buraya virgül koymayı unutma, eğer devamında kod varsa. Yoksa gerek yok.
    // --- 🕵️ ANA SAYFA STİL DEDEKTİFİ (Story Bar Yöneticisi) ---
    loadStoryBar: async function () {
      // Sadece Ana Sayfada Çalış
      var path = window.location.pathname;
      if (path !== "/" && path !== "/index.html" && path !== "") return;

      var container = document.getElementById("mdm-story-container");
      if (!container) return; // HTML yoksa dur

      // 1. MİSAFİR MODU
      if (!APP_STATE.user || !APP_STATE.user.email) {
        container.innerHTML = `
            <div class="mdm-story-item" onclick="ModumApp.showGuestPopup('style')">
                <div class="mdm-story-ring" style="border:2px dashed #94a3b8; width:68px; height:68px;">
                    <div class="mdm-story-img" style="display:flex;align-items:center;justify-content:center;font-size:24px;background:#1e293b;">🔒</div>
                </div>
                <div class="mdm-story-name">Stilini Seç</div>
            </div>`;
        return;
      }

      // 2. ÜYE MODU (Durumu Kontrol Et)
      // Backend'e soruyoruz: Bu adamın stili kayıtlı mı?
      var res = await fetchApi("get_style_recommendations", {
        email: APP_STATE.user.email,
      });

      // DURUM A: ANKET YOK -> Anket Butonu Göster
      if (res.needSurvey) {
        container.innerHTML = `
            <div class="mdm-story-item" onclick="ModumApp.openStyleSurvey()">
                <div class="mdm-story-ring survey-ring" style="width:68px; height:68px;">
                    <div class="mdm-story-img" style="display:flex;align-items:center;justify-content:center;font-size:30px;background:#0f172a;">👗</div>
                </div>
                <div class="mdm-story-name" style="color:#fbbf24; font-weight:bold;">Anketi Çöz</div>
            </div>
            
            <div style="font-size:11px; color:#64748b; align-self:center; margin-left:10px;">
                👈 Sana özel vitrin için<br>tercihlerini belirt.
            </div>`;
        return;
      }

      // DURUM B: ANKET VAR -> Ürünleri (Storyleri) Göster
      if (res.success && res.list.length > 0) {
        // Anket butonunu sildik, yerine ürünleri diziyoruz
        var html = "";

        // Başlık (Opsiyonel, şık durur)
        html += `
            <div class="mdm-story-item">
                <div class="mdm-story-ring" style="background:transparent; border:2px solid #334155; width:68px; height:68px;">
                   <div class="mdm-story-img" style="display:flex;align-items:center;justify-content:center;font-size:24px;background:#0f172a;">💖</div>
                </div>
                <div class="mdm-story-name">Sana Özel</div>
            </div>`;

        // Ürünler
        res.list.forEach((p) => {
          html += `
                <div class="mdm-story-item" onclick="ModumApp.openProductPopup('${p.id}', '${p.title}', '${p.price}', '${p.image}', '${p.link}')">
                    <div class="mdm-story-ring" style="width:68px; height:68px;">
                        <img src="${p.image}" class="mdm-story-img">
                    </div>
                    <div class="mdm-story-name">${p.price} TL</div>
                </div>`;
        });

        // En sona "Ayarlar" butonu (Tercih değiştirmek isterse)
        html += `
            <div class="mdm-story-item" onclick="ModumApp.openStyleSurvey()">
                <div class="mdm-story-ring" style="background:#334155; width:68px; height:68px;">
                   <div class="mdm-story-img" style="display:flex;align-items:center;justify-content:center;font-size:18px;background:#1e293b; color:#94a3b8;"><i class="fas fa-cog"></i></div>
                </div>
                <div class="mdm-story-name">Düzenle</div>
            </div>`;

        container.innerHTML = html;
      }
    },

    // --- 👗 ANKET PENCERESİ (Modal) ---
    openStyleSurvey: function () {
      if (!APP_STATE.user || !APP_STATE.user.email)
        return ModumApp.showGuestPopup("style");

      // Varsa eskisini sil
      var old = document.getElementById("mdm-style-survey");
      if (old) old.remove();

      var html = `
        <div id="mdm-style-survey" class="mdm-modal active" style="z-index:999999; display:flex; align-items:center; justify-content:center;">
            <div class="mdm-modal-content" style="width:95%; max-width:500px; background:#1e293b; border-radius:16px; padding:0; overflow:hidden;">
                
                <div style="background:linear-gradient(135deg, #ec4899, #8b5cf6); padding:20px; text-align:center;">
                    <h3 style="color:white; margin:0;">👗 Modum Stilisti</h3>
                    <p style="color:white; opacity:0.9; font-size:12px; margin-top:5px;">Seni tanıyalım, vitrini sana göre döşeyelim. (+500 XP)</p>
                </div>

                <div style="padding:20px; max-height:60vh; overflow-y:auto;">
                    
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:20px;">
                        <div>
                            <label style="color:#cbd5e1; font-size:10px; font-weight:bold; display:block; margin-bottom:5px;">Ayakkabı</label>
                            <select id="sty-shoe" style="width:100%; padding:8px; border-radius:6px; background:#0f172a; border:1px solid #334155; color:white;">
                                <option value="36">36</option><option value="37">37</option><option value="38">38</option><option value="39">39</option><option value="40">40</option>
                            </select>
                        </div>
                        <div>
                            <label style="color:#cbd5e1; font-size:10px; font-weight:bold; display:block; margin-bottom:5px;">Üst Giyim</label>
                            <select id="sty-top" style="width:100%; padding:8px; border-radius:6px; background:#0f172a; border:1px solid #334155; color:white;">
                                <option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option>
                            </select>
                        </div>
                        <div>
                            <label style="color:#cbd5e1; font-size:10px; font-weight:bold; display:block; margin-bottom:5px;">Alt Giyim</label>
                            <select id="sty-bot" style="width:100%; padding:8px; border-radius:6px; background:#0f172a; border:1px solid #334155; color:white;">
                                <option value="36">36</option><option value="38">38</option><option value="40">40</option><option value="42">42</option>
                            </select>
                        </div>
                    </div>

                    <label style="color:#cbd5e1; font-size:12px; font-weight:bold; margin-bottom:10px; display:block;">Sevdiğin Renkler (En az 5 tane seç)</label>
                    <div id="sty-colors" style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px;">
                        ${[
                          "Siyah",
                          "Beyaz",
                          "Kırmızı",
                          "Mavi",
                          "Yeşil",
                          "Sarı",
                          "Pembe",
                          "Mor",
                          "Turuncu",
                          "Gri",
                          "Bej",
                          "Lacivert",
                          "Kahverengi",
                          "Bordo",
                        ]
                          .map(
                            (c) =>
                              `<div onclick="this.classList.toggle('selected')" class="sty-color-opt" data-color="${c}" style="padding:6px 12px; border:1px solid #475569; border-radius:20px; color:#cbd5e1; font-size:11px; cursor:pointer; transition:0.2s;">${c}</div>`,
                          )
                          .join("")}
                    </div>
                    
                    <div style="display:flex; gap:10px; align-items:flex-start; margin-bottom:20px; background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                        <input type="checkbox" id="sty-kvkk" style="margin-top:3px;">
                        <span style="font-size:10px; color:#94a3b8; line-height:1.4;">
                            Beden ve renk tercihlerimin bana özel ürün önerileri sunulması amacıyla işlenmesini ve <a href="https://modum.tr/gizlilik-sozlesmesi/" target="_blank" style="color:#60a5fa; text-decoration:underline;">Gizlilik Sözleşmesi</a>'ni kabul ediyorum.
                        </span>
                    </div>

                    <button onclick="ModumApp.saveStyleSurvey()" style="width:100%; padding:15px; background:#10b981; color:white; font-weight:bold; border:none; border-radius:10px; cursor:pointer; font-size:14px; box-shadow:0 4px 15px rgba(16,185,129,0.3);">
                        KAYDET VE VİTRİNİ GÖR 👁️
                    </button>

                </div>
                <div onclick="document.getElementById('mdm-style-survey').remove()" style="text-align:center; padding:15px; color:#64748b; cursor:pointer; font-size:12px;">Vazgeç</div>
            </div>
            <style>
                .sty-color-opt.selected { background: #3b82f6 !important; color: white !important; border-color: #3b82f6 !important; transform: scale(1.05); box-shadow: 0 0 10px rgba(59,130,246,0.3); }
            </style>
        </div>`;
      document.body.insertAdjacentHTML("beforeend", html);
    },

    // --- ANKETİ KAYDET (VE EKRANI DEĞİŞTİR) ---
    saveStyleSurvey: function () {
      var kvkk = document.getElementById("sty-kvkk").checked;
      if (!kvkk)
        return alert("Devam etmek için gizlilik sözleşmesini onaylamalısınız.");

      var colors = [];
      document
        .querySelectorAll(".sty-color-opt.selected")
        .forEach((el) => colors.push(el.dataset.color));

      if (colors.length < 5)
        return alert("Lütfen en az 5 renk seçiniz. (" + colors.length + "/5)");

      var prefs = {
        shoeSize: document.getElementById("sty-shoe").value,
        dressSize: document.getElementById("sty-top").value,
        pantSize: document.getElementById("sty-bot").value,
        colors: colors,
      };

      var btn = event.target;
      btn.innerHTML = "Kaydediliyor...";
      btn.disabled = true;

      fetchApi("submit_style_survey", {
        email: APP_STATE.user.email,
        preferences: prefs,
      }).then((res) => {
        if (res.success) {
          // 1. Modalı Kapat
          document.getElementById("mdm-style-survey").remove();

          // 2. Hafızayı Güncelle
          localStorage.setItem("mdm_style_completed", "true");

          // 3. 🔥 KRİTİK NOKTA: Story Barı HEMEN Yenile (Anket gidecek, ürünler gelecek)
          ModumApp.loadStoryBar();

          // 4. Konfeti Patlat ve Puanı Güncelle
          ModumApp.checkWelcome(true, 500);
          updateDataInBackground();
        } else {
          alert(res.message);
          btn.disabled = false;
          btn.innerHTML = "TEKRAR DENE";
        }
      });
    },

    // --- 🛍️ ÜRÜN DETAY POPUP (2 Butonlu) ---
    openProductPopup: function (id, title, price, img, link) {
      var old = document.getElementById("mdm-prod-popup");
      if (old) old.remove();

      var html = `
        <div id="mdm-prod-popup" class="mdm-modal active" style="z-index:999999; display:flex; align-items:center; justify-content:center;">
            <div class="mdm-modal-content" style="width:90%; max-width:350px; background:white; border-radius:20px; padding:25px; text-align:center; position:relative; box-shadow:0 0 50px rgba(0,0,0,0.5);">
                <div onclick="document.getElementById('mdm-prod-popup').remove()" style="position:absolute; top:15px; right:15px; font-size:24px; cursor:pointer; color:#333;">×</div>
                
                <div style="width:100%; height:250px; overflow:hidden; border-radius:12px; margin-bottom:15px; background:#f1f5f9; display:flex; align-items:center; justify-content:center;">
                    <img src="${img}" style="width:100%; height:100%; object-fit:contain;">
                </div>
                
                <h4 style="margin:0 0 5px 0; color:#333; font-size:16px; line-height:1.3;">${title}</h4>
                <div style="font-size:20px; font-weight:900; color:#10b981; margin-bottom:20px;">${price} TL</div>

                <div style="display:flex; flex-direction:column; gap:10px;">
                    <a href="${link}" class="mdm-btn-v2" style="background:#0f172a; color:white; text-decoration:none; padding:12px; border-radius:50px; justify-content:center;">
                        ÜRÜNE GİT ↗️
                    </a>
                    
                    <button onclick="ModumApp.switchTab('store'); document.getElementById('mdm-prod-popup').remove();" class="mdm-btn-v2" style="background:#fef3c7; color:#d97706; border:1px solid #fbbf24; padding:12px; border-radius:50px; justify-content:center;">
                        % İNDİRİM KUPONU AL
                    </button>
                </div>
            </div>
        </div>`;
      document.body.insertAdjacentHTML("beforeend", html);
    },
  }; // <--- BURASI ÇOK ÖNEMLİ: window.ModumApp BU NOKTALI VİRGÜL İLE BİTER.

  /* ======================================================
     🚀 FİNAL BAŞLATICI (SAYFA VE KONUM KONTROLLÜ) v8.5
     ====================================================== */
  checkSystemLock().then((isLocked) => {
    // Kilitli değilse işlemlere başla
    if (!isLocked) {
      // 1. GLOBAL ÖZELLİKLERİ HER YERDE BAŞLAT (Dedektifler)
      // Bu özellikler ana sayfa, ürün detay vb. her yerde çalışmalı.
      if (document.body && !window.mdmEggStarted) {
        window.mdmEggStarted = true;

        // 🥚 Sürpriz Yumurta (Her yerde çalışır)
        if (window.ModumApp && ModumApp.initSurpriseSystem) {
          ModumApp.initSurpriseSystem();
        }

        // 🕵️ Altın Ürün Avı (Her yerde çalışır)
        window.addEventListener("load", function () {
          setTimeout(initGoldenHunt, 2000);
        });

        // 🛒 Günlük Sepet Dedektifi (Her yerde çalışır)
        // (Zaten kendi kendine çalışan bir IIFE içinde tanımlı, ek işleme gerek yok)
      }

      // 2. ANA PANEL (DASHBOARD) SADECE "ÇEKİLİŞLER" SAYFASINDA AÇILSIN
      var currentUrl = window.location.href.toLowerCase();
      var isRafflePage = currentUrl.indexOf("cekilisler") > -1;

      // Kök elementi bul
      var root = document.getElementById(TARGET_ID);

      if (isRafflePage) {
        // --- SENARYO A: ÇEKİLİŞLER SAYFASINDAYIZ ---
        console.log(
          "🎯 ModumNet: Çekiliş Sayfası Algılandı. Panel Başlatılıyor...",
        );

        // Footer sorununu çözen CSS yamasını ekle
        // Bu CSS, paneli sayfanın en üstüne sabitler ve tam ekran yapar.
        var fixStyle = document.createElement("style");
        fixStyle.innerHTML = `
          #modum-firebase-test-root {
            display: flex !important;
            flex-direction: column !important;
            position: relative !important;
            z-index: 999 !important;
            width: 100% !important;
            min-height: 100vh !important;
            background-color: #0f172a !important; /* Arkaplan rengi */
            margin: 0 !important;
            padding: 0 !important;
            top: 0 !important;
          }
          /* Faprika'nın varsayılan container paddinglerini ez */
          .page-container, .container, .row {
             max-width: 100% !important;
             padding: 0 !important;
             margin: 0 !important;
          }
        `;
        document.head.appendChild(fixStyle);

        // Widget'ı Başlat (Eğer root varsa)
        if (root) {
          init(root);
        } else {
          // Root henüz oluşmadıysa bekle ve başlat
          var attempts = 0;
          var initInterval = setInterval(function () {
            root = document.getElementById(TARGET_ID);
            attempts++;
            if (root) {
              clearInterval(initInterval);
              init(root);
            } else if (attempts > 50) {
              // 25 saniye dene
              clearInterval(initInterval);
              console.error("❌ ModumNet: Root elementi bulunamadı.");
            }
          }, 500);
        }
      } else {
        // --- SENARYO B: DİĞER SAYFALAR (ANA SAYFA, ÜRÜN VB.) ---
        // Paneli gizle ki footer'da çirkin durmasın.
        if (root) {
          root.style.display = "none";
          root.innerHTML = ""; // İçini boşalt, kaynak tüketmesin
        }
        console.log(
          "🛡️ ModumNet: Diğer sayfadasınız. Panel gizlendi, ajanlar aktif.",
        );
      }
    }
  });

  // --- GÖREVLERİ YÜKLEME (DEBUG MODU + KESİN EŞLEŞTİRME) ---
  async function loadTasksData() {
    var container = document.getElementById("mdm-tasks-list");
    if (!container) return;

    if (!APP_STATE.user || !APP_STATE.user.email) {
      container.innerHTML =
        '<div style="text-align:center; padding:20px; color:#94a3b8;">Görevleri görmek için giriş yapın.</div>';
      return;
    }

    // Verileri Çek
    var pTasks = fetchApi("get_tasks");
    var pProgress = fetchApi("get_user_task_progress", {
      email: APP_STATE.user.email,
    });

    var [resTasks, resProg] = await Promise.all([pTasks, pProgress]);

    // İlerlemeleri Map'e çevir (Hızlı erişim için)
    var myProgressMap = {};
    if (resProg && resProg.success && resProg.list) {
      resProg.list.forEach((p) => {
        // Olası tüm anahtarları ekleyelim
        if (p.taskId) myProgressMap[p.taskId] = p;
        if (p.taskTitle) myProgressMap[p.taskTitle] = p;
        if (p.gorevserisiid) myProgressMap[p.gorevserisiid] = p;
        // Özel kontrol: gunluk_rutin_v2 (Senin ekran görüntüsündeki ID)
        if (p.taskId === "gunluk_rutin_v2")
          myProgressMap["gunluk_rutin_v2"] = p;
      });
    }

    if (resTasks && resTasks.success) {
      var html = "";
      var activeTasks = resTasks.tasks.filter(
        (t) => t.status === "active" || t.status === true || t.aktif === true,
      );
      // 2. 🔥 SIRALA: Günlük Görevler En Üste
      activeTasks.sort(function (a, b) {
        var typeA = (a.type || a.frequency || "").toUpperCase();
        var typeB = (b.type || b.frequency || "").toUpperCase();
        var titleA = (a.title || a.baslik || "").toLowerCase();
        var titleB = (b.title || b.baslik || "").toLowerCase();

        // Günlük mü? (Tipinden veya Başlığından anla)
        var isDailyA =
          typeA === "GUNLUK" ||
          typeA === "GÜNLÜK" ||
          titleA.includes("günlük") ||
          titleA.includes("rutin");
        var isDailyB =
          typeB === "GUNLUK" ||
          typeB === "GÜNLÜK" ||
          titleB.includes("günlük") ||
          titleB.includes("rutin");

        if (isDailyA && !isDailyB) return -1; // A yukarı
        if (!isDailyA && isDailyB) return 1; // B yukarı
        return 0;
      });

      // --- 🚀 YENİ NESİL GÖREV KARTLARI (QUEST V2 - FIXED BUTTONS) ---

      if (activeTasks.length === 0) {
        container.innerHTML =
          '<div style="text-align:center; padding:20px; color:#94a3b8;">Aktif görev yok.</div>';
        return;
      }

      activeTasks.forEach((t) => {
        var title = t.baslik || t.title;
        var reward = t.buyukodul_xp || t.reward;

        // İlerleme Verileri
        var myP =
          myProgressMap[t.id] ||
          myProgressMap[t.customId] ||
          myProgressMap[title] ||
          {};
        var defaultTarget = title.toLowerCase().includes("kutu") ? 5 : 1;
        var target1 = parseInt(t.adim1_hedef) || defaultTarget;
        var currentProgress =
          parseInt(myP.adim1_ilerleme) || parseInt(myP.count) || 0;
        if (myP.adim1_ilerleme === true) currentProgress = target1;

        var stepsHtml = "";
        var totalStepsCount = 0;
        var completedStepsCount = 0;

        // ====================================================
        // 1. ADIM BUTONLARI (ESKİ MANTIK - YENİ TASARIM)
        // ====================================================
        if (t.adim1_tanim) {
          totalStepsCount++;
          var isDone1 = currentProgress >= target1;
          if (isDone1) completedStepsCount++;

          var actionHtml1 = "";
          var tanimKucuk = (t.adim1_tanim || "").toLowerCase();

          if (isDone1) {
            // Tamamlandı Rozeti
            actionHtml1 = `<div style="padding:6px 10px; background:rgba(16,185,129,0.1); border:1px solid #10b981; border-radius:6px; color:#10b981; font-size:11px; font-weight:bold; display:inline-flex; align-items:center; gap:5px;"><i class="fas fa-check"></i> TAMAMLANDI</div>`;
          } else {
            // --- ÖZEL BUTONLAR ---

            // Profil Mimarı (Çerçeve)
            if (
              t.id === "gorev_profil_mimari" ||
              (t.customId && t.customId === "gorev_profil_mimari")
            ) {
              var myFrames = (APP_STATE.user.ownedFrames || []).filter(
                (f) => f && f !== "" && f !== "default",
              );
              var hasFrame = myFrames.length > 0;
              var btnText = hasFrame ? "Kontrol Et & Al 🎁" : "Çerçeve Al 🛒";
              var btnStyle = hasFrame
                ? "background:#10b981;"
                : "background:#8b5cf6;";
              actionHtml1 = `<button onclick="event.stopPropagation(); ModumApp.verifyFrameTask('${t.id}')" class="quest-btn-action" style="${btnStyle}">${btnText}</button>`;
            }
            // Google Harita
            else if (t.id === "gorev_google_maps") {
              var gLink =
                t.adim1_link || "https://maps.app.goo.gl/E2ZY9EjNxB8jVDhn7";
              actionHtml1 = `<button onclick="event.stopPropagation(); ModumApp.verifyGoogleTask('${t.id}', '${gLink}')" class="quest-btn-action" style="background:#3b82f6;">Haritaya Git 🗺️</button>`;
            }
            // Yılan Oyunu
            else if (t.id === "gunluk_yilan_gorevi") {
              actionHtml1 = `<button onclick="event.stopPropagation(); var btn=document.getElementById('v2-game-btn'); if(btn){ btn.click(); window.scrollTo({ top: 0, behavior: 'smooth' }); } else { alert('Oyun yükleniyor...'); }" class="quest-btn-action" style="background:#8b5cf6;">🎮 Oyna</button>`;
            }
            // Kule Oyunu
            else if (t.id === "gunluk_kule_gorevi") {
              actionHtml1 = `<button onclick="event.stopPropagation(); var btn=document.getElementById('v2-game-btn'); if(btn){ btn.click(); window.scrollTo({ top: 140, behavior: 'smooth' }); if(window.ModumV2) window.ModumV2.openGame('stacker'); }" class="quest-btn-action" style="background:#f59e0b;">🏗️ Kuleye Git</button>`;
            }
            // Alışveriş veya Sepet Görevi (SADECE YÖNLENDİRME YAPAR - BİTİRMEZ)
            else if (
              t.id === "alisveris_guru_v1" ||
              title.toLowerCase().includes("alışveriş") ||
              title.toLowerCase().includes("sepet") ||
              title.toLowerCase().includes("tamamla")
            ) {
              // 🔥 DÜZELTME: ModumApp.goAndComplete YERİNE window.location.href kullanıyoruz.
              // Böylece butona basınca puan vermez, sadece sayfaya gider.
              var targetLink = "/sepet"; // Varsayılan sepet linki
              if (t.adim1_link && t.adim1_link.length > 2)
                targetLink = t.adim1_link;

              actionHtml1 = `<button onclick="event.stopPropagation(); window.location.href='${targetLink}'" class="quest-btn-action" style="background:#f59e0b;">Sepete Git 🛍️</button>`;
            }
            // Alışveriş veya Sepet Görevi (SADECE YÖNLENDİRME YAPAR - PUAN VERMEZ)
            // 🔥 DÜZELTME: ID'si 'gunluk_sepet_v1' olan görev için özel kural.
            else if (
              t.id === "gunluk_sepet_v1" ||
              title.toLowerCase().includes("sepeti tamamla")
            ) {
              // BURAYA DİKKAT: ModumApp.goAndComplete YERİNE window.location.href kullanıyoruz.
              // Böylece butona basınca görev BİTMEZ, sadece sepete gider.

              actionHtml1 = `<button onclick="event.stopPropagation(); window.location.href='/sepet'" class="quest-btn-action" style="background:#f59e0b;">Sepete Git 🛍️</button>`;
            }
            // Altın Ürün Bilgisi
            else if (
              t.id.includes("altin_urun") ||
              title.toLowerCase().includes("altın ürün")
            ) {
              actionHtml1 = `<div style="font-size:10px; color:#fbbf24; background:rgba(251,191,36,0.1); padding:5px 8px; border-radius:6px; border:1px dashed #fbbf24;"><i class="fas fa-search"></i> Sitede altın ürünü bul.</div>`;
            }
            // Doğum Günü
            else if (t.adim1_gorevtipi === "dogum_tarihi_gir") {
              actionHtml1 = `<button onclick="event.stopPropagation(); window.location.href='/hesabim/bilgilerim/'" class="quest-btn-action" style="background:#e11d48;">Doğum Gününü Gir 🎂</button>`;
            }
            // Çekiliş (Vitrin)
            else if (t.adim1_gorevtipi === "cekilise_katil") {
              actionHtml1 = `<button onclick="event.stopPropagation(); ModumApp.switchTab('home')" class="quest-btn-action" style="background:#3b82f6;">Vitrine Git 🎟️</button>`;
            }
            // Kutu Sayacı
            else if (tanimKucuk.includes("kutu")) {
              var kalan = target1 - currentProgress;
              actionHtml1 = `<div style="font-size:11px; color:#fbbf24; font-weight:bold;">📦 Bulunan: ${currentProgress}/${target1} <span style="opacity:0.7">(Kalan: ${kalan})</span></div>`;
            }
            // Genel Link Görevi
            else {
              var link = t.adim1_link;
              var btnText = "Görevi Yap 🚀";
              var btnColor = "#3b82f6";

              if (t.adim1_gorevtipi === "instagram") {
                link = "https://instagram.com/modumnetco";
                btnText = "Instagram'a Git 📸";
                btnColor = "#E1306C";
              }
              if (t.adim1_gorevtipi === "urun_gez") {
                link = "/tum-urunler";
                btnText = "Ürünleri İncele 🛍️";
                btnColor = "#f59e0b";
              }
              if (t.adim1_gorevtipi === "sifre_gir") {
                link = "#";
                btnText = "Şifreyi Buldun mu? 🔑";
              }

              if (!link) link = "/";

              actionHtml1 = `<button onclick="event.stopPropagation(); ModumApp.goAndComplete('${t.id}', '${link}')" class="quest-btn-action" style="background:${btnColor};">${btnText}</button>`;
            }
          }

          stepsHtml += `
<div class="quest-step-row">
<div class="step-text"><span style="color:#64748b; margin-right:5px;">1.</span> ${t.adim1_tanim}</div>
<div class="step-status">${actionHtml1}</div>
  </div>`;
        }

        // ====================================================
        // 2. ADIM BUTONLARI (ESKİ MANTIK - YENİ TASARIM)
        // ====================================================
        if (t.adim2_tanim) {
          totalStepsCount++;
          var prog2 = parseInt(myP.adim2_ilerleme) || 0;
          var isDone2 = prog2 >= 1;

          // Günlük Rutin Kontrolü
          if (
            title.toLowerCase().includes("günlük rutin") ||
            t.id.includes("gunluk_rutin")
          ) {
            var trDate = new Date(
              new Date().toLocaleString("en-US", {
                timeZone: "Europe/Istanbul",
              }),
            );
            var todayStr = trDate.toISOString().split("T")[0];
            var userLastDate =
              APP_STATE.user && APP_STATE.user.songunlukhaktarihi
                ? String(APP_STATE.user.songunlukhaktarihi)
                : "";
            if (userLastDate.indexOf(todayStr) > -1) isDone2 = true;
          }

          if (isDone2) completedStepsCount++;

          var actionHtml2 = "";

          if (isDone2) {
            actionHtml2 = `<div style="padding:6px 10px; background:rgba(16,185,129,0.1); border:1px solid #10b981; border-radius:6px; color:#10b981; font-size:11px; font-weight:bold; display:inline-flex; align-items:center; gap:5px;"><i class="fas fa-check"></i> TAMAMLANDI</div>`;
          } else {
            // --- ÖZEL 2. ADIM BUTONLARI ---

            // Google Yorum Kontrolü
            if (
              t.id === "gorev_google_maps" ||
              t.adim2_gorevtipi === "manuel_onay"
            ) {
              actionHtml2 = `<button onclick="event.stopPropagation(); ModumApp.verifyGoogleTask('${t.id}')" class="quest-btn-action" style="background:#10b981;">Kontrol Et 🔄</button>`;
            }
            // Referans Linki
            else if (
              t.adim2_gorevtipi === "referans_yap" ||
              (t.adim2_tanim && t.adim2_tanim.toLowerCase().includes("davet"))
            ) {
              actionHtml2 = `<button onclick="event.stopPropagation(); ModumApp.openAffiliateModal()" class="quest-btn-action" style="background:#8b5cf6;">Linkini Al 🤝</button>`;
            }
            // Şifre Giriş Kutusu (Özel Tasarım)
            else if (t.adim2_gorevtipi === "sifre_gir") {
              var inputId = "input-" + t.id + "-s2";
              actionHtml2 = `<div style="display:flex; gap:5px; margin-top:5px;" onclick="event.stopPropagation();">
<input type="text" id="${inputId}" placeholder="Şifre..." style="flex:1; padding:6px; border-radius:6px; border:1px solid #334155; background:#0f172a; color:white; font-size:11px; width:80px;">
<button onclick="ModumApp.submitTaskCode('${t.id}', 2)" class="quest-btn-action" style="padding:6px 10px;">OK</button>
  </div>`;
            }
            // Değerlendirme Yap
            else if (
              t.id === "alisveris_guru_v1" ||
              (t.adim2_tanim && t.adim2_tanim.toLowerCase().includes("destek"))
            ) {
              actionHtml2 = `<button onclick="event.stopPropagation(); ModumApp.switchTab('support')" class="quest-btn-action" style="background:#8b5cf6;">Değerlendir 💬</button>`;
            }
            // Sepet / Genel
            else {
              var btnLink2 =
                t.adim2_gorevtipi === "sepete_ekle" ? "/tum-urunler" : "#";
              actionHtml2 = `<button onclick="event.stopPropagation(); window.location.href='${btnLink2}'" class="quest-btn-action" style="background:transparent; border:1px solid #475569; color:#94a3b8;">Görevi Yap</button>`;
            }
          }

          stepsHtml += `
<div class="quest-step-row">
<div class="step-text"><span style="color:#64748b; margin-right:5px;">2.</span> ${t.adim2_tanim}</div>
<div class="step-status">${actionHtml2}</div>
  </div>`;
        }

        // --- KART DURUMU VE RENKLER ---
        var progressPercent = 0;
        if (totalStepsCount > 0)
          progressPercent = (completedStepsCount / totalStepsCount) * 100;

        var isCompleted =
          completedStepsCount >= totalStepsCount && totalStepsCount > 0;
        var cardClass = isCompleted ? "completed" : "";

        // Ana buton metni (Kart kapalıyken görünen)
        var mainBtnText = isCompleted ? "Tamamlandı ✅" : "İlerleme";
        var mainBtnColor = isCompleted ? "#10b981" : "#3b82f6";

        // İKON SEÇİMİ (Otomatik)
        var icon = "📌";
        var tLower = title.toLowerCase();
        if (tLower.includes("instagram")) icon = "📸";
        if (tLower.includes("sepet") || tLower.includes("alışveriş"))
          icon = "🛍️";
        if (
          tLower.includes("oyun") ||
          tLower.includes("yılan") ||
          tLower.includes("kule")
        )
          icon = "🎮";
        if (tLower.includes("davet")) icon = "🤝";
        if (tLower.includes("şifre")) icon = "🔑";
        if (tLower.includes("doğum")) icon = "🎂";
        if (tLower.includes("günlük")) icon = "📅";
        if (tLower.includes("altın")) icon = "🕵️";

        // --- FİNAL KART HTML ---
        html += `
<div class="mdm-quest-card ${cardClass}" id="task-card-${
          t.id
        }" onclick="ModumApp.toggleTask('${t.id}')">

<div class="quest-header">
<div class="quest-icon-box">${icon}</div>
<div class="quest-info">
<div class="quest-title">${title}</div>
<div class="quest-xp-badge">+${reward} XP</div>
  </div>
<button class="quest-btn-action main-toggle-btn" 
data-original-text="${mainBtnText}"
style="background:${mainBtnColor}; pointer-events:none;">
${mainBtnText}
  </button>
<div class="quest-arrow" style="margin-left:10px;"><i class="fas fa-chevron-down"></i></div>
  </div>

<div class="quest-progress-track">
<div class="quest-progress-fill" style="width:${progressPercent}%;"></div>
  </div>

<div class="quest-body" id="task-body-${t.id}">
<div style="padding:10px 16px; font-size:11px; color:#94a3b8; font-style:italic; border-bottom:1px solid rgba(255,255,255,0.05);">
${t.aciklama || "Görevi tamamla, ödülü kap!"}
  </div>
<div class="quest-steps-container">
${stepsHtml}
  </div>
  </div>
  </div>`;
      });

      container.innerHTML = html;
    }
  }
  // Görev Ekleme Modal'ı içindeki Sıklık Selectbox'ı
  // ID'sinin "task_frequency" (veya senin kodundaki name="frequency") olduğunu varsayıyorum.
  // ID inputunun da id="custom_task_id" olduğunu varsayıyorum. Lütfen kendi kodundaki ID'lerle eşleştir.

  $('select[name="frequency"], #task_frequency').on("change", function () {
    var secim = $(this).val();
    var idInput = $('input[name="custom_task_id"], #custom_task_id');

    // Eğer seçim "Günlük" ise (Value değerine dikkat et, genelde 'daily' veya '1' olabilir)
    // Senin selectbox'ında "Günlük (Her Gece Sıfırlanır)" yazan seçeneğin value değeri neyse onu yazmalısın.
    // Örnek: value="daily" ise:

    if (secim == "daily" || secim == "gunluk") {
      // Rastgele sayı üretip sonuna ekleyelim ki benzersiz olsun
      var randomNum = Math.floor(Math.random() * 1000);
      idInput.val("gunluk_rutin_" + randomNum);

      // Kullanıcı değiştiremesin diye kilitleyebiliriz (opsiyonel)
      // idInput.prop('readonly', true);
    } else {
      // Günlük değilse boşaltabilir veya manuel girişe izin verebilirsin
      idInput.val("");
    }
  });
  // --- 🛒 SEPETE EKLEME DİNLEYİCİSİ (SÜPER YAKALAYICI + HAFIZA KONTROLÜ v4) ---
  window.addEventListener(
    "click",
    function (e) {
      // Tıklanan öğe .add-to-cart-button sınıfına sahip mi? (veya içinde mi?)
      var btn = e.target.closest(".add-to-cart-button");

      // Eğer sınıf ile bulamadıysa, ID ile de şansımızı deneyelim
      if (
        !btn &&
        e.target.id &&
        e.target.id.indexOf("add-to-cart-button") > -1
      ) {
        btn = e.target;
      }

      if (btn) {
        // 🔥 KRİTİK EKLEME: Önce Hafızayı (LocalStorage) Zorla Oku
        // Sayfa yeni açıldıysa değişken boş olabilir, hafızadan taze çekelim.
        var cachedUser = JSON.parse(localStorage.getItem("mdm_user_cache"));
        if (cachedUser && cachedUser.email) {
          APP_STATE.user = cachedUser;
        }

        // Şimdi Kontrol Et
        if (APP_STATE.user && APP_STATE.user.email) {
          // Eğer sepet görevi hafızada yoksa son bir kez bulmayı dene
          var cartTaskId = localStorage.getItem("mdm_cart_task_id");
          if (!cartTaskId) {
            findCartTaskID(); // Acil durum araması
          }

          if (cartTaskId) {
            // Backend'e '2. Adımı Tamamla' sinyali
            fetchApi("complete_task_step", {
              email: APP_STATE.user.email,
              taskId: cartTaskId,
              step: 2,
            }).then((res) => {
              if (res && res.success) {
                // Listeleri Yenile
                if (typeof loadTasksData === "function") loadTasksData();
                updateDataInBackground();
              }
            });
          } else {
            console.log(
              "⚠️ Görev ID bulunamadı (Görevler sekmesini hiç açmadınız mı?)",
            );
          }
        } else {
          console.log(
            "❌ Kullanıcı hala bulunamadı. Lütfen bir kez 'Hesabım' sayfasına tıklayın.",
          );
        }
      }
    },
    true,
  );
  // --- 🕵️ AJAN: Site Açılınca Sepet Görevini Bul ---
  function findCartTaskID() {
    fetchApi("get_tasks").then((res) => {
      if (res && res.success && res.tasks) {
        res.tasks.forEach((t) => {
          // Görevin 2. adımı "sepete" kelimesi içeriyorsa veya tipi "sepete_ekle" ise
          if (
            (t.adim2_tanim && t.adim2_tanim.toLowerCase().includes("sepete")) ||
            t.adim2_gorevtipi === "sepete_ekle"
          ) {
            localStorage.setItem("mdm_cart_task_id", t.id);
          }
        });
      }
    });
  }
  /* ======================================================
   🏆 MODUMNET ALTIN ÜRÜN AVI (GOLDEN PRODUCT HUNT)
   ====================================================== */
  (function () {
    // Sayfa Yüklendiğinde Çalıştır
    window.addEventListener("load", function () {
      setTimeout(initGoldenHunt, 2000); // 2 saniye bekle ki Faprika her şeyi yüklesin
    });

    // Başına 'window.' ekledik
    window.initGoldenHunt = async function () {
      var sku = detectPageSKU();
      if (!sku) return;

      console.log("🕵️ Altın Ürün Aranıyor: [" + sku + "]");

      var userEmail = "guest";
      var cachedUser = JSON.parse(localStorage.getItem("mdm_user_cache"));
      if (cachedUser && cachedUser.email) userEmail = cachedUser.email;

      try {
        const res = await fetch("https://api-hjen5442oq-uc.a.run.app", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            islem: "check_golden_product",
            email: userEmail,
            sku: sku,
          }),
        });
        const data = await res.json();

        // --- KONSOLDA CEVABI GÖRMEK İÇİN ---
        console.log("📡 Sunucu Cevabı:", data);

        if (data.success && data.isGolden) {
          if (data.isGuest) {
            showGoldenPopup("guest", sku);
          } else if (data.alreadyFound) {
            console.log("✅ Bu ödül zaten alınmış.");
          } else {
            showGoldenPopup("winner", sku, data);
            if (window.ModumApp && window.ModumApp.updateDataInBackground) {
              window.ModumApp.updateDataInBackground();
            }
          }
        } else {
          console.warn("❌ Üzgünüm, bu ürün Altın Ürün listesinde değil.");
        }
      } catch (e) {
        console.error("Bağlantı Hatası:", e);
      }
    };

    // GÜÇLENDİRİLMİŞ SKU BULUCU (Senin Siten İçin Özel)
    function detectPageSKU() {
      // 1. Senin verdiğin HTML yapısı: <span class="value" itemprop="sku">...</span>
      var el = document.querySelector('span[itemprop="sku"]');

      // 2. Eğer bulamazsa alternatif: class="sku" içindeki class="value"
      if (!el) {
        el = document.querySelector(".sku .value");
      }

      if (el && el.innerText) {
        // .trim() komutu baştaki ve sondaki boşlukları siler!
        return el.innerText.trim();
      }

      // 3. Yedek (Hidden Inputlar)
      var el3 = document.querySelector('input[name="ProductCode"]');
      if (el3) return el3.value.trim();

      return null;
    }

    // 🔥 ALTIN POPUP GÖSTERİCİ
    function showGoldenPopup(type, sku, reward) {
      // Varsa eskileri sil
      var old = document.getElementById("mdm-gold-modal");
      if (old) old.remove();

      // İçerik Hazırla
      let title, desc, btnText, btnAction, iconAnim;

      if (type === "guest") {
        title = "HAZİNEYİ BULDUN!";
        desc = `Tebrikler! Gizli <b>Altın Ürünü</b> (${sku}) buldun.<br>Ancak <b>300 XP</b> ödülünü almak için giriş yapmalısın.`;
        btnText = "GİRİŞ YAP VE ÖDÜLÜ AL 🚀";
        btnAction = "window.location.href='/kullanici-giris'"; // Yönlendirme
        iconAnim = "🔒";
      } else {
        title = "TEBRİKLER! 300 XP KAZANDIN!";
        desc = `Muhteşem! <b>Altın Ürünü</b> buldun ve görevi tamamladın.<br><br>
<span style="color:#10b981; font-weight:bold;">+150 XP</span> Ürün Bonusu<br>
<span style="color:#10b981; font-weight:bold;">+150 XP</span> Görev Tamamlama<br>
<hr style="border:0; border-top:1px dashed #ccc; margin:10px 0;">
Toplam: <b style="font-size:18px; color:#d97706;">+300 XP</b> Hesabına Yüklendi!`;
        btnText = "HARİKA! DEVAM ET 😎";
        btnAction = "document.getElementById('mdm-gold-modal').remove()";
        iconAnim = "🏆";
      }

      // HTML & CSS
      var html = `
<div id="mdm-gold-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px);">
<div style="background:linear-gradient(135deg, #fffbeb, #fff); width:90%; max-width:450px; padding:30px; border-radius:24px; text-align:center; position:relative; box-shadow:0 0 60px rgba(251, 191, 36, 0.6); border:4px solid #f59e0b; animation: mdmPopIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">

<!-- Konfeti Efekti -->
<div style="position:absolute; top:-20px; left:50%; transform:translateX(-50%); font-size:60px; filter:drop-shadow(0 10px 10px rgba(0,0,0,0.2));">
${iconAnim}
  </div>

<div style="margin-top:40px;">
<h2 style="color:#b45309; font-weight:900; font-size:24px; margin:0 0 10px 0; text-transform:uppercase; letter-spacing:1px; line-height:1.2;">${title}</h2>
<div style="color:#4b5563; font-size:14px; line-height:1.6; margin-bottom:25px;">${desc}</div>

<button onclick="${btnAction}" style="background:linear-gradient(to bottom, #f59e0b, #d97706); color:white; border:none; padding:15px 30px; border-radius:50px; font-weight:800; font-size:14px; cursor:pointer; width:100%; box-shadow:0 5px 15px rgba(217, 119, 6, 0.4); transition:0.2s; text-transform:uppercase;">
${btnText}
  </button>
  </div>

<!-- Kapatma X -->
<div onclick="document.getElementById('mdm-gold-modal').remove()" style="position:absolute; top:15px; right:15px; cursor:pointer; color:#9ca3af; font-size:24px;">&times;</div>
  </div>
  </div>
<style>
@keyframes mdmPopIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
  </style>
`;

      var div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);
    }
  })();
  /* ======================================================
       🎂 DOĞUM GÜNÜ YAKALAYICI (FAPRIKA SELECT YAPISINA ÖZEL)
       ====================================================== */
  (function () {
    // Sadece "Bilgilerim" veya "Üye Bilgi" sayfalarında çalış
    if (
      window.location.href.indexOf("/hesabim/bilgilerim") > -1 ||
      window.location.href.indexOf("/Uye/BilgiGuncelle") > -1 ||
      window.location.href.indexOf("uyelik-bilgilerim") > -1
    ) {
      // 1. Sayfa yüklenince kontrol et
      window.addEventListener("load", function () {
        setTimeout(checkAndSyncBirthday, 1000);
      });

      // 2. Müşteri kutulardan seçim yaparsa anlık kontrol et (Change Event)
      document.addEventListener("change", function (e) {
        if (
          e.target.name === "DateOfBirthDay" ||
          e.target.name === "DateOfBirthMonth" ||
          e.target.name === "DateOfBirthYear"
        ) {
          setTimeout(checkAndSyncBirthday, 500);
        }
      });

      // 3. Kaydet butonuna basınca da kontrol et
      document.addEventListener("click", function (e) {
        // Butonun içinde "Kaydet" veya "Güncelle" yazıyorsa
        var txt = e.target.innerText || e.target.value || "";
        if (txt.includes("Kaydet") || txt.includes("Güncelle")) {
          setTimeout(checkAndSyncBirthday, 2000);
        }
      });
    }

    async function checkAndSyncBirthday() {
      // Senin attığın HTML yapısındaki Select'leri buluyoruz
      var dayEl = document.querySelector('select[name="DateOfBirthDay"]');
      var monthEl = document.querySelector('select[name="DateOfBirthMonth"]');
      var yearEl = document.querySelector('select[name="DateOfBirthYear"]');

      // Eğer elementler sayfada yoksa dur
      if (!dayEl || !monthEl || !yearEl) return;

      var d = dayEl.value;
      var m = monthEl.value;
      var y = yearEl.value;

      // "0" değeri "Gün", "Ay", "Yıl" yazısıdır. Seçim yapılmamış demektir.
      // Hepsi seçiliyse işlem yap
      if (d !== "0" && m !== "0" && y !== "0") {
        // Tarihi birleştir: "26.8.1997" formatı
        var birthDate = d + "." + m + "." + y;

        var user = JSON.parse(localStorage.getItem("mdm_user_cache"));

        // Kullanıcı giriş yapmışsa gönder
        if (user && user.email) {
          // Mükerrer gönderimi önlemek için ufak bir kontrol (Opsiyonel ama iyi olur)
          if (localStorage.getItem("mdm_bd_sent") === birthDate) return;

          console.log("🎂 Doğum Tarihi Tespit Edildi: " + birthDate);

          // Backend'e gönder
          fetch("https://api-hjen5442oq-uc.a.run.app", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              islem: "register_birthday",
              email: user.email,
              birthDate: birthDate,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                console.log("✅ Doğum günü işlendi: " + data.message);
                localStorage.setItem("mdm_bd_sent", birthDate); // Tarayıcıya not al

                // Widget'ı yenile (Puanı görsün)
                if (window.ModumApp && window.ModumApp.updateDataInBackground) {
                  window.ModumApp.updateDataInBackground();
                }
              }
            });
        }
      }
    }
  })();
  // --- 📡 OTOMATİK BİLDİRİM TARAYICI (HER 10 SANİYEDE BİR) ---
  setInterval(function () {
    // Sadece kullanıcı giriş yapmışsa ve fonksiyon yüklüyse
    if (
      APP_STATE.user &&
      APP_STATE.user.email &&
      window.ModumApp &&
      ModumApp.loadSupportHistory
    ) {
      // true parametresi = Sessiz Mod (Sadece kırmızı nokta kontrolü)
      ModumApp.loadSupportHistory(true);
    }
  }, 10000); // 10 saniyede bir
  /* ======================================================
       🎬 SİNEMATİK INTRO (FİNAL: PERDE + ORİJİNAL YAZI + MOBİL)
       ====================================================== */
  (function runCinematicIntro() {
    // 1. SADECE ÇEKİLİŞLER SAYFASINDA ÇALIŞSIN
    if (!window.location.href.includes("cekilisler")) return;

    // 2. SİTE İÇERİĞİNİ GİZLE
    var rootEl = document.getElementById("modum-firebase-test-root");
    if (rootEl) rootEl.style.opacity = "0";

    // 3. AYARLAR
    var gifUrl =
      window.innerWidth > 768
        ? "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnR2N3puZWUzaTBkZ2VobXR6c2k2Mnp6Y295ODU0ZXVtNmd2NXdsdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ASd0Ukj0y3qMM/giphy.gif" // <--- Yeni Masaüstü GIF Linkin
        : "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnR2N3puZWUzaTBkZ2VobXR6c2k2Mnp6Y295ODU0ZXVtNmd2NXdsdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ASd0Ukj0y3qMM/giphy.gif"; // Senin GIF Linkin

    // Tema Rengi
    var savedTheme = localStorage.getItem("mdm_active_theme") || "default";
    var themeConfig = {
      default: {
        color: "#8b5cf6",
        glow: "rgba(139, 92, 246, 0.8)",
        text: "KEYİFLİ ALIŞVERİŞLER",
      },
      newyear: {
        color: "#ef4444",
        glow: "rgba(239, 68, 68, 0.8)",
        text: "🎄 YENİ YILINIZ KUTLU OLSUN 🎄",
      },
    };
    var activeStyle = themeConfig[savedTheme] || themeConfig.default;

    // 4. CSS STİLLERİ
    var style = document.createElement("style");
    style.innerHTML = `
/* Ana Kapsayıcı */
#mdm-intro-overlay {
position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
z-index: 2147483647; 
overflow: hidden;
pointer-events: none;
}

/* --- PERDE YAPISI (GIF BURADA) --- */
.mdm-curtain-panel {
position: absolute; top: 0; width: 50%; height: 100%;
overflow: hidden; background: #0f172a;
transition: transform 1.5s cubic-bezier(0.77, 0, 0.175, 1);
z-index: 10;
}
.mdm-left-panel { left: 0; border-right: 1px solid rgba(255,255,255,0.1); }
.mdm-right-panel { right: 0; border-left: 1px solid rgba(255,255,255,0.1); }

/* PERDE AÇILMA HAREKETİ */
#mdm-intro-overlay.open-curtain .mdm-left-panel { transform: translateX(-100%); }
#mdm-intro-overlay.open-curtain .mdm-right-panel { transform: translateX(100%); }

/* GIF RESMİ (Tam Ekran ve Ortalanmış) */
.mdm-bg-gif {
position: absolute; 
top: 0; 
left: 0; 
width: 100vw; 
height: 100vh;
object-fit: cover; /* Resmi ekrana tam yayar, boşluk bırakmaz */
max-width: none !important;
}

/* Sol ve Sağ panel ayarları aynı kalıyor */
.mdm-left-panel .mdm-bg-gif { left: 0; }
.mdm-right-panel .mdm-bg-gif { left: -50vw; } /* Sağ tarafı tamamlayan parça */

/* --- YAZI KATMANI (ESKİ STİL GERİ GELDİ) --- */
.mdm-intro-content {
position: absolute; top: 0; left: 0; width: 100%; height: 100%;
display: flex; flex-direction: column; align-items: center; justify-content: center;
z-index: 20; /* Perdenin üstünde */
transition: opacity 0.5s ease;
}

/* Yazıların Grubu (Biraz yukarıda) */
.mdm-intro-content-wrapper {
display: flex; flex-direction: column; align-items: center;
transform: translateY(-50px);
text-align: center;
}

.mdm-intro-box { display: flex; align-items: center; justify-content: center; }

/* LOGO 'M' HARFİ */
.mdm-intro-m {
font-family: 'Inter', sans-serif; font-weight: 900; font-size: 80px;
color: ${activeStyle.color}; text-shadow: 0 0 30px ${activeStyle.glow};
opacity: 0; animation: dropM 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* 'ODUMNET' YAZISI */
.mdm-intro-text {
font-family: 'Inter', sans-serif; font-weight: 800; font-size: 80px;
color: #fff; overflow: hidden; white-space: nowrap; width: 0;
opacity: 0; margin-left: 2px;
text-shadow: 0 5px 15px rgba(0,0,0,0.8); /* Okunabilirlik için gölge */
animation: expandText 0.8s ease-out 0.6s forwards;
}

/* ÜST SLOGAN */
.mdm-intro-slogan {
margin-top: 20px; font-family: 'Outfit', sans-serif; font-size: 14px;
letter-spacing: 6px; color: #cbd5e1; text-transform: uppercase;
background: rgba(0,0,0,0.6); padding: 5px 15px; border-radius: 4px; /* Arkasına hafif siyahlık */
opacity: 0; animation: fadeUp 0.6s ease-out 0.8s forwards;
}

/* ALT SLOGAN (Dinamik) */
.mdm-intro-sub {
margin-top: 10px; font-family: 'Outfit', sans-serif; font-size: 16px;
letter-spacing: 2px; color: ${activeStyle.color}; font-weight: 800;
text-transform: uppercase; text-shadow: 0 0 10px ${activeStyle.glow};
background: rgba(0,0,0,0.6); padding: 5px 15px; border-radius: 20px;
opacity: 0; animation: fadeUp 0.6s ease-out 1.1s forwards;
}

/* --- ANİMASYONLAR --- */
@keyframes dropM { 0% { opacity: 0; transform: translateY(-200px) scale(5); filter: blur(20px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
@keyframes expandText { 0% { width: 0; opacity: 0; } 100% { width: 460px; opacity: 1; } }
@keyframes fadeUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }

/* --- MOBİL UYUMLULUK (HİZALAMA DÜZELTİLDİ) --- */
@media (max-width: 768px) {

/* 1. YAZIYI YUKARI TAŞIMA */
.mdm-intro-content-wrapper { 
transform: translateY(-130px) !important; 
display: flex !important;           /* Flexbox kullan */
justify-content: center !important; /* Ortala */
align-items: center !important;     /* Hizala */
gap: 0 !important;                  /* Aradaki tüm boşlukları öldür */
}

/* 2. 'M' HARFİ AYARI */
.mdm-intro-m { 
font-size: 40px !important; 
margin-right: -2px !important;  /* Hafifçe yazıya yapıştır */
margin-left: 0 !important;
padding: 0 !important;
width: auto !important;         /* Gereksiz genişlik kaplamasın */
display: block !important;
}

/* 3. 'ODUMNET' YAZISI AYARI */
.mdm-intro-text { 
font-size: 40px !important; 

/* 🔥 ÖNEMLİ: Yazıyı kutunun SOLUNA yasla ki M'den kaçmasın */
text-align: left !important;    

margin-left: 0 !important;      /* Ekstra margine gerek yok, M hallediyor */
padding-left: 0 !important;
}

/* Yazı Açılma Animasyonu */
@keyframes expandText { 
0% { width: 0; opacity: 0; } 
100% { width: 190px; opacity: 1; } 
}

/* Slogan Ayarları */
.mdm-intro-slogan { 
font-size: 9px !important; letter-spacing: 1px !important; 
margin-top: 5px !important; width: 100%; 
}
.mdm-intro-sub { 
font-size: 10px !important; letter-spacing: 1px !important; 
}

/* GIF AYARI (Sabit) */
.mdm-bg-gif {
object-fit: contain !important; 
height: auto !important;
top: 50% !important;
transform: translateY(-50%) !important;
background: #0f172a; 
}
}
`;
    document.head.appendChild(style);

    // 5. HTML YAPISI
    var overlay = document.createElement("div");
    overlay.id = "mdm-intro-overlay";
    overlay.innerHTML = `
<div class="mdm-curtain-panel mdm-left-panel">
<img src="${gifUrl}" class="mdm-bg-gif">
  </div>

<div class="mdm-curtain-panel mdm-right-panel">
<img src="${gifUrl}" class="mdm-bg-gif">
  </div>

<div class="mdm-intro-content" id="mdm-intro-text-layer">
<div class="mdm-intro-content-wrapper">
<div class="mdm-intro-box">
<div class="mdm-intro-m">M</div>
<div class="mdm-intro-text">ODUMNET</div>
  </div>
<div class="mdm-intro-slogan">FIRSAT DÜNYASINA HOŞGELDİNİZ</div>
<div class="mdm-intro-sub">${activeStyle.text}</div>
  </div>
  </div>
`;
    document.body.appendChild(overlay);

    // 6. ZAMANLAMA (3.5 Saniye sonra açılır)
    setTimeout(function () {
      // Yazıları nazikçe sil
      var textLayer = document.getElementById("mdm-intro-text-layer");
      if (textLayer) textLayer.style.opacity = "0";

      // Perdeyi Aç
      overlay.classList.add("open-curtain");

      // Arkadaki Siteyi Göster
      document.documentElement.classList.remove("intro-active");
      if (rootEl) {
        rootEl.style.transition = "opacity 1.5s ease-in";
        rootEl.style.opacity = "1";
      }

      // Temizlik
      setTimeout(function () {
        overlay.remove();
      }, 1600);
    }, 1500);
  })();
  // ======================================================
  // 🛡️ GÜVENLİK DUVARI ARAYÜZÜ (SPAM KORUMASI)
  // ======================================================
  (function setupSecurityMonitor() {
    // Orijinal fetch fonksiyonunu yedekle
    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
      const response = await originalFetch(...args);

      // Yanıtı kopyala (okumak için)
      const clone = response.clone();

      clone
        .json()
        .then((data) => {
          // Eğer sunucu "SPAM_LOCK" hatası döndürdüyse
          if (data && data.error === "SPAM_LOCK") {
            console.warn("⛔ GÜVENLİK KİLİDİ AKTİF!");

            // Sadece Çekilişler sayfasındaysak kilitle (İsteğe göre kaldırılabilir)
            if (window.location.href.includes("cekilisler") || true) {
              lockScreen();
            }
          }
        })
        .catch(() => {}); // JSON değilse umursama

      return response;
    };

    function lockScreen() {
      // Varsa eski kilidi kaldır (üst üste binmesin)
      const oldLock = document.getElementById("mdm-security-lock");
      if (oldLock) return;

      document.body.style.overflow = "hidden"; // Kaydırmayı kapat

      const lockHTML = `
<div id="mdm-security-lock" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15, 23, 42, 0.98); z-index:9999999; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; font-family:sans-serif; text-align:center; padding:20px;">
<div style="font-size:80px; margin-bottom:20px;">🛡️</div>
<h1 style="color:#ef4444; font-size:36px; margin:0 0 10px 0; text-transform:uppercase; letter-spacing:2px;">Sistem Kilitlendi</h1>
<p style="color:#cbd5e1; font-size:18px; max-width:600px; line-height:1.6;">
Güvenlik protokolü gereği IP adresinizden şüpheli yoğunlukta işlem tespit edildi.
<br><br>
<span style="color:#fbbf24; font-weight:bold;">Sistem güvenliği için erişiminiz 24 saat süreyle durdurulmuştur.</span>
  </p>
<div style="margin-top:40px; padding:15px 30px; background:rgba(255,255,255,0.1); border-radius:10px; font-size:14px; color:#94a3b8;">
Hata olduğunu düşünüyorsanız: info@modum.tr
  </div>
  </div>
`;

      const div = document.createElement("div");
      div.innerHTML = lockHTML;
      document.body.appendChild(div);
    }
  })();

  /* ======================================================
   ❤️ MODUMNET: GÜNLÜK FAVORİ (WISHLIST) GÖREVİ TETİKLEYİCİSİ
   ====================================================== */
  document.addEventListener("click", function (e) {
    // Tıklanan öğe veya ebeveyni, hedef butonlarımızdan biri mi?
    // 1. Hedef: Ürün Detay Sayfası Butonu (.add-to-wishlist-button)
    // 2. Hedef: Kategori Sayfası Butonu (.add-to-wishlist)

    var targetBtn =
      e.target.closest(".add-to-wishlist-button") ||
      e.target.closest(".add-to-wishlist");

    if (targetBtn) {
      console.log("ModumNet: Favori butonu yakalandı ❤️");

      // 1. Kullanıcı giriş yapmış mı kontrolü
      if (
        typeof APP_STATE !== "undefined" &&
        APP_STATE.user &&
        APP_STATE.user.email
      ) {
        // 2. Backend'e 'Görevi Tamamla' emrini gönder
        // ID: gorev_gunluk_favori (Admin panelindeki ID ile AYNI olmalı)
        fetchApi("complete_task", {
          email: APP_STATE.user.email,
          taskId: "gorev_gunluk_favori",
        }).then(function (res) {
          if (res && res.success) {
            // 3. Başarılıysa kullanıcıya bildirim göster
            console.log("✅ Favori görevi tamamlandı: +100 XP");

            if (typeof ModumApp !== "undefined" && ModumApp.showMemberPopup) {
              ModumApp.showMemberPopup(100, "Favorilere Eklendi!");
            }
          } else {
            // Kullanıcı muhtemelen görevi bugün zaten yapmıştır
            console.log("ℹ️ Görev durumu: " + (res.message || "İşlem yok."));
          }
        });
      } else {
        console.log("⚠️ Kullanıcı giriş yapmamış, puan verilemedi.");
      }
    }
  });

  /* ======================================================
   🛒 MODUMNET: GÜNLÜK YORUM GÖREVİ TETİKLEYİCİSİ
   ====================================================== */
  document.addEventListener("click", function (e) {
    // 1. Tıklanan öğe "Yorum Gönder" butonu mu?
    // Faprika altyapısında genelde bu class veya ID kullanılır
    if (
      e.target &&
      (e.target.closest(".write-product-review-button") ||
        e.target.id === "btnReviewSubmit")
    ) {
      console.log("ModumNet: Yorum butonu algılandı. Kontrol ediliyor... 🕵️");

      // 2. Yorum kutusunu bul
      var reviewInput = document.getElementById("AddProductReview_ReviewText");

      // Eğer kutu bulunduysa ve içine en az 5 harf yazılmışsa
      if (reviewInput && reviewInput.value.trim().length >= 5) {
        // 3. Kullanıcı giriş yapmış mı? (APP_STATE kontrolü)
        // Not: faprika.js içinde APP_STATE genellikle globaldir.
        if (
          typeof APP_STATE !== "undefined" &&
          APP_STATE.user &&
          APP_STATE.user.email
        ) {
          // 4. Backend'e 'Görevi Tamamla' sinyali gönder
          // ID: gorev_gunluk_yorum (Admin panelinde verdiğin ID ile AYNI olmalı)
          fetchApi("complete_task", {
            email: APP_STATE.user.email,
            taskId: "gorev_gunluk_yorum",
          }).then(function (res) {
            if (res && res.success) {
              // 5. Başarılıysa kullanıcıyı tebrik et
              console.log("✅ Yorum görevi tamamlandı: +150 XP");

              // Eğer ModumApp popup fonksiyonu varsa çalıştır
              if (typeof ModumApp !== "undefined" && ModumApp.showMemberPopup) {
                ModumApp.showMemberPopup(150, "Yorum Yaptın!");
              }
            } else {
              console.log("ℹ️ Sonuç: " + (res.message || "İşlem yapılamadı."));
            }
          });
        }
      } else {
        console.log("⚠️ Yorum çok kısa veya kutu bulunamadı.");
      }
    }
  });

  // --- 🔥 YENİ: ÇERÇEVE DETAY & ÖN İZLEME POP-UP'I (GIPHY FİXLİ) ---
  window.ModumApp.openFrameDetail = function (frameCode) {
    // 1. Varsayılan Bilgiler
    var title = "ÇERÇEVE";
    var desc = "Profilin için özel görünüm.";
    var framePreviewHtml = "";

    // 2. Link mi, Kod mu? Kontrolü
    if (frameCode.includes("http")) {
      // Giphy Linki İse
      title = "ÖZEL TASARIM";
      desc = "Bu hareketli çerçeveyi profilinde kullanmak ister misin?";

      // 🔥 GÜNCELLENMİŞ KISIM: background-repeat ve border:none eklendi
      // Bu sayede resim tekrar etmez ve tam oturur.
      framePreviewHtml = `<div class="mdm-avatar-frame" style="top:-5px; left:-5px; right:-5px; bottom:-5px; border:none; background-image: url('${frameCode}'); background-size: cover; background-position: center; background-repeat: no-repeat;"></div>`;
    } else {
      // CSS Class İse (Eskiler)
      // Veritabanı varsa ismini çek, yoksa koddan üret
      var dbEntry =
        typeof FRAMES_DB !== "undefined" ? FRAMES_DB[frameCode] : null;
      if (dbEntry) {
        title = dbEntry.t;
        desc = dbEntry.d;
      }
      framePreviewHtml = `<div class="mdm-avatar-frame ${frameCode}" style="top:-5px; left:-5px; right:-5px; bottom:-5px; border-width:4px;"></div>`;
    }

    // 3. Eski Modalı Temizle
    var old = document.getElementById("mdm-frame-modal");
    if (old) old.remove();

    // 4. Yeni Modalı Oluştur
    var html = `
<div id="mdm-frame-modal" class="mdm-modal active" style="display:flex; z-index:2147483647; align-items:center; justify-content:center;">
<div class="mdm-modal-content" style="width:90%; max-width:320px; text-align:center; padding:30px; border-radius:24px; background:#1e293b; border:1px solid #334155; position:relative; box-shadow:0 20px 50px rgba(0,0,0,0.5);">

<div onclick="document.getElementById('mdm-frame-modal').remove()" style="position:absolute; top:15px; right:15px; color:#64748b; cursor:pointer; font-size:24px;">×</div>

<div style="width:100px; height:100px; margin:0 auto 20px; position:relative; display:flex; align-items:center; justify-content:center;">
${framePreviewHtml}
<div style="width:100%; height:100%; background:#0f172a; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:40px;">👤</div>
  </div>

<h3 style="color:#fff; margin:0 0 10px 0; font-size:18px;">${title}</h3>
<p style="color:#94a3b8; font-size:13px; line-height:1.5; margin-bottom:25px;">${desc}</p>

<button onclick="ModumApp.equipFrame('${frameCode}'); document.getElementById('mdm-frame-modal').remove();" 
style="background:linear-gradient(135deg, #3b82f6, #2563eb); color:white; border:none; padding:12px; width:100%; border-radius:12px; font-weight:bold; cursor:pointer; font-size:14px; box-shadow:0 4px 15px rgba(37,99,235,0.4); display:flex; align-items:center; justify-content:center; gap:8px;">
ÇERÇEVE YAP <i class="fas fa-check-circle"></i>
  </button>

  </div>
  </div>`;

    var div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);
  };

  // --- ÇERÇEVE TAKMA (HIZLI VE SORUNSUZ VERSİYON) ---
  ModumApp.equipFrame = async function (frameCode) {
    // 1. Giriş Kontrolü
    if (!APP_STATE.user || !APP_STATE.user.email)
      return alert("Lütfen giriş yapın.");

    // 2. GÖRSELİ ANINDA GÜNCELLE (Backend cevabını bekleme - Optimistic UI)
    // Global durumu güncelle
    APP_STATE.user.selectedFrame = frameCode;

    // Tarayıcı hafızasını (Cache) güncelle
    localStorage.setItem("mdm_user_cache", JSON.stringify(APP_STATE.user));

    // Profili hemen yeniden çiz (Kullanıcı değişikliği anında görsün)
    var container = document.getElementById("mdm-profile-container");
    if (container) {
      container.innerHTML = renderProfileTab(APP_STATE.user);
    }

    // Kullanıcıya bilgi ver (Opsiyonel, zaten görsel değişiyor)
    // alert("✅ Çerçeve güncellendi!");

    // 3. ARKA PLANDA SUNUCUYA KAYDET
    try {
      await fetchApi("equip_avatar_frame", {
        email: APP_STATE.user.email,
        frameCode: frameCode,
      });
      fetchApi("complete_task", {
        email: APP_STATE.user.email,
        taskId: "gorev_profil_mimari", // Backend'de oluşturduğumuz ID
      }).then((res) => {
        if (res && res.success) {
          // Eğer ilk kez yapıyorsa bildirim göster
          alert(
            "🎉 TEBRİKLER! 'Profil Mimarı' görevini tamamladın ve +250 XP kazandın!",
          );
          updateDataInBackground();
        }
      });

      // 🔥 KRİTİK DÜZELTME: updateDataInBackground'ı hemen çağırma!
      // Sunucunun veritabanına yazması 1-2 saniye sürebilir.
      // Hemen çağırırsak eski veriyi çeker ve çerçeve kaybolur.
      // O yüzden sadece sessizce kaydediyoruz, listeyi yenilemeye gerek yok.
    } catch (e) {
      console.error("Çerçeve kayıt hatası:", e);
      // Hata olursa kullanıcıya söyleyebiliriz, ama görsel bozulmasın diye ellemiyoruz
    }
  };
  // --- 👇 BUNLARI DOSYANIN EN ALTINA YAPIŞTIR 👇 ---

  // 1. Profil Düzenleme Penceresini Aç
  ModumApp.openEditProfile = function () {
    var user = APP_STATE.user;

    // Avatar Seçenekleri (En başta tanımladığın AVATAR_LIBRARY)
    var avatarOptionsHtml = "";
    if (typeof AVATAR_LIBRARY !== "undefined") {
      avatarOptionsHtml = AVATAR_LIBRARY.map(
        (url) =>
          `<img src="${url}" onclick="document.getElementById('new-avatar-input').value='${url}'; this.parentElement.querySelectorAll('img').forEach(i=>i.style.border='2px solid transparent'); this.style.border='3px solid #10b981';" 
style="width:50px; height:50px; border-radius:50%; cursor:pointer; border:2px solid transparent;">`,
      ).join("");
    } else {
      avatarOptionsHtml =
        "<div style='color:#ccc; font-size:12px;'>Avatar kütüphanesi yüklenemedi.</div>";
    }

    var modalHtml = `
<div id="mdm-edit-modal" class="mdm-modal active" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; align-items:center; justify-content:center;">
<div class="mdm-modal-content" style="background:#1e293b; width:90%; max-width:400px; padding:20px; border-radius:15px; border:1px solid #334155;">
<h3 style="color:#fff; margin-bottom:15px; text-align:center;">Profili Düzenle</h3>

<label style="color:#94a3b8; font-size:12px; display:block; margin-bottom:5px;">Biyografi (Hakkında)</label>
<textarea id="edit-bio-input" style="width:100%; background:#0f172a; border:1px solid #334155; color:#fff; padding:10px; border-radius:8px; margin-bottom:15px; font-family:inherit;" rows="3" placeholder="Kendinden bahset...">${
      user.bio || ""
    }</textarea>

<label style="color:#94a3b8; font-size:12px; display:block; margin-bottom:5px;">Avatar Değiştir</label>
<input type="hidden" id="new-avatar-input" value="${user.selectedAvatar || ""}">
<div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px; max-height:150px; overflow-y:auto; padding:5px; background:#0f172a; border-radius:8px;">
${avatarOptionsHtml}
  </div>

<button onclick="ModumApp.saveProfile()" style="width:100%; background:#10b981; color:#fff; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; margin-bottom:10px;">KAYDET</button>
<button onclick="document.getElementById('mdm-edit-modal').remove()" style="width:100%; background:transparent; color:#ef4444; border:1px solid #ef4444; padding:10px; border-radius:8px; cursor:pointer;">İptal</button>
  </div>
  </div>
`;

    // Varsa eskisini sil
    var old = document.getElementById("mdm-edit-modal");
    if (old) old.remove();

    document.body.insertAdjacentHTML("beforeend", modalHtml);
  };

  // 2. Kaydetme Fonksiyonu
  ModumApp.saveProfile = async function () {
    var newBio = document.getElementById("edit-bio-input").value;
    var newAvatar = document.getElementById("new-avatar-input").value;

    // Backend'e Gönder
    // Not: fetchApi fonksiyonun faprika.js içinde tanımlı olduğunu varsayıyoruz.
    var res = await fetchApi("update_user_profile", {
      email: APP_STATE.user.email,
      newBio: newBio,
      newAvatar: newAvatar,
    });

    if (res && res.success) {
      alert("Profil güncellendi! ✅");
      document.getElementById("mdm-edit-modal").remove();

      // Yerel değişkeni güncelle
      APP_STATE.user.bio = newBio;
      if (newAvatar) APP_STATE.user.selectedAvatar = newAvatar;

      // Profili yeniden çiz (Sayfa yenilemeden)
      if (document.getElementById("mdm-profile-container")) {
        document.getElementById("mdm-profile-container").innerHTML =
          renderProfileTab(APP_STATE.user);
      } else {
        // Container id farklıysa sayfayı yenile
        window.location.reload();
      }
    } else {
      alert("Hata: " + (res ? res.message : "Sunucu yanıt vermedi."));
    }
  };
  // --- faprika js (En Alt Kısım) ---

  var lastCheckEmail = null;
  var detectiveInterval = null;

  // Sadece sayfa görünürken çalıştır (Performance Boost)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (detectiveInterval) clearInterval(detectiveInterval);
    } else {
      startDetective();
    }
  });

  function startDetective() {
    if (detectiveInterval) clearInterval(detectiveInterval);
    detectiveInterval = setInterval(function () {
      // Zaten giriş yapmışsa (APP_STATE doluysa) dedektifi durdur, yorma.
      if (
        window.APP_STATE &&
        window.APP_STATE.user &&
        window.APP_STATE.user.email
      ) {
        return;
      }

      var foundEmail = null;
      // ... (Input arama kodların aynı kalsın) ...
      var emailInput =
        document.getElementById("Email") ||
        document.querySelector('input[name="Email"]');
      if (
        emailInput &&
        emailInput.value &&
        emailInput.value.indexOf("@") > -1
      ) {
        foundEmail = emailInput.value.trim();
      }

      if (foundEmail && foundEmail !== lastCheckEmail) {
        console.log("🕵️ Dedektif Yakaladı: " + foundEmail);
        lastCheckEmail = foundEmail;
        // Veriyi güncelle
        updateDataInBackground();
      }
    }, 4000); // Süreyi 2000 yerine 4000 (4 saniye) yapalım. Daha az yorar.
  }

  startDetective(); // Başlat
})(); // Bu satır en altta kalsın

(function () {
  "use strict";

  // --- GARANTİ AVATAR KÜTÜPHANESİ (STANDART RESİMLER) ---
  var DEFAULT_AVATARS = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Molly",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Alexsandra",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=skala",
    "https://api.dicebear.com/7.x/big-ears/svg?seed=Tiger",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=bella",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=declan",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=maylo",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=ryla",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=roblox",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=profil",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=profil2",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=profil3",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=loki",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Batman",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Profil4",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=kedi",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Profil5",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=profil6",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Kadın",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=kadın1",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=kadın3",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=kadın5",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=kadın7",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=kadın11",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=kadın17",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=kadın22",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=kadın23",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=kadın26",
  ];

  // 1. SADECE ÇEKİLİŞ SAYFASINDA ÇALIŞ
  if (window.location.href.indexOf("cekilisler") === -1) return;

  // 2. ANA SİSTEMİ BEKLE (Loop)
  var v2Interval = setInterval(function () {
    var dockNav = document.querySelector(".mdm-dock-nav");
    var contentWrapper = document.querySelector(".mdm-content-wrapper");
    var mainEngineReady =
      window.ModumApp && window.APP_STATE && window.fetchApi;

    if (dockNav && contentWrapper && mainEngineReady) {
      clearInterval(v2Interval);
      initModumV2(dockNav, contentWrapper);
      initCosmeticSystem(); // 🔥 KOZMETİK SİSTEMİNİ BAŞLAT
    }
  }, 500);

  // 3. V2 SİSTEMİNİ KUR (OYUNLAR: YILAN 🐍 + KULE 🎁)
  function initModumV2(dockNav, contentWrapper) {
    // --- A) MENÜYE BUTON EKLE ---
    if (!document.getElementById("v2-game-btn")) {
      var gameBtn = document.createElement("div");
      gameBtn.id = "v2-game-btn";
      gameBtn.className = "mdm-dock-link";
      gameBtn.innerHTML = `<div class="mdm-dock-icon"><i class="fas fa-gamepad"></i></div><div class="mdm-dock-text">Oyunlar</div>`;

      gameBtn.onclick = function () {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document
          .querySelectorAll(".mdm-dock-link")
          .forEach((el) => el.classList.remove("active"));
        this.classList.add("active");
        document
          .querySelectorAll(".mdm-tab-content")
          .forEach((el) => el.classList.remove("active"));
        document.getElementById("v2-game-area").style.display = "block";
        window.ModumV2.updateScores();
      };

      var supportBtn = dockNav.querySelector('[data-id="support"]');
      if (supportBtn) dockNav.insertBefore(gameBtn, supportBtn);
      else dockNav.appendChild(gameBtn);
    }

    // --- B) OYUN ALANINI OLUŞTUR (GİZLİ) ---
    var gameArea = document.createElement("div");
    gameArea.id = "v2-game-area";
    gameArea.style.display = "none";
    gameArea.className = "mdm-tab-content";
    gameArea.innerHTML = `
<style>
.mv2-card { background:#1e293b; border:1px solid #334155; border-radius:16px; padding:20px; text-align:center; overflow:hidden; margin-bottom:20px; transition:0.3s; }
.mv2-card:hover { transform: translateY(-5px); border-color: #8b5cf6; }
.mv2-btn { background:#10b981; color:#fff; border:none; padding:8px 20px; border-radius:50px; font-weight:bold; cursor:pointer; font-size:12px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); width:100%; }

/* --- 📱 MOBİL KONTROLLER & EKRAN --- */
#mv2-controls-area { display: none !important; } /* Ok tuşlarını tamamen gizle */

/* Oyun Alanı Canvas Ayarları */
/* Masaüstü: Sabit büyük */
#mv2-canvas { width: 500px !important; height: 500px !important; } 
#mv2-stacker-canvas { width: 400px !important; height: 600px !important; }

/* Mobil: Responsive ve Daha Büyük */
@media (max-width: 768px) {
#mv2-canvas { 
width: 100vw !important; /* Ekran genişliğinin %90'ı */
height: 100vw !important; /* Kare olması için yükseklik de aynı */
max-width: 400px; max-height: 400px; /* Çok devasa olmasın */
}
#mv2-stacker-canvas { width: 90vw !important; height: 120vw !important; max-width: 400px; }
.mv2-game-grid { grid-template-columns: 1fr !important; }

/* Mobilde bilgi mesajını göster */
.mv2-mobile-hint { display: block !important; }
}

/* Bilgi Mesajı (Sadece Mobilde Görünür) */
.mv2-mobile-hint {
display: none;
color: #94a3b8; font-size: 12px; margin-top: 15px; font-weight: bold;
animation: pulse 2s infinite;
}

.mv2-game-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
  </style>

<h3 style="color:#fff; margin-bottom:15px; display:flex; align-items:center; gap:10px;">
<i class="fas fa-rocket" style="color:#f472b6;"></i> Oyun Salonu <span style="font-size:10px; background:#f472b6; padding:2px 6px; border-radius:4px; color:#fff;">BETA</span>
  </h3>

<div id="mv2-menu">
<div class="mv2-game-grid">
<div class="mv2-card" onclick="ModumV2.openGame('snake')">
<div style="font-size:40px; margin-bottom:10px;">🐍</div>
<div style="color:#fff; font-weight:bold; font-size:14px; margin-bottom:5px;">Yılan Ustası</div>
<div style="display:flex; justify-content:space-between; padding:0 10px; margin-bottom:10px; font-size:11px;">
<span style="color:#facc15;">Rekor: <b id="mv2-snake-best">-</b></span>
<span style="color:#4ade80;">Bugün: <b id="mv2-snake-daily">0</b></span>
  </div>
<button class="mv2-btn">OYNA</button>
  </div>

<div class="mv2-card" onclick="ModumV2.openGame('stacker')">
<div style="font-size:40px; margin-bottom:10px;">🎁</div>
<div style="color:#fff; font-weight:bold; font-size:14px; margin-bottom:5px;">Kule Mimarı</div>
<div style="display:flex; justify-content:space-between; padding:0 10px; margin-bottom:10px; font-size:11px;">
<span style="color:#facc15;">Rekor: <b id="mv2-stacker-best">-</b></span>
<span style="color:#4ade80;">Bugün: <b id="mv2-stacker-daily">0</b></span>
  </div>
<button class="mv2-btn" style="background:#8b5cf6; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">BAŞLA</button>
  </div>
  </div>

<div style="margin-top:15px; background:#1e293b; border-radius:12px; border:1px solid #334155; overflow:hidden;">
<div onclick="ModumV2.toggleLeaderboard()" style="padding:12px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; background:rgba(255,255,255,0.05);">
<div style="font-size:12px; color:#fbbf24; font-weight:bold;">🏆 HAFTANIN ŞAMPİYONLARI</div>
<i class="fas fa-chevron-down" style="color:#94a3b8; font-size:12px;"></i>
  </div>

<div id="mv2-leaderboard-panel" style="display:none; padding:10px;">
<div style="text-align:center; padding:20px; color:#94a3b8; font-size:11px;">
<i class="fas fa-circle-notch fa-spin"></i> Yükleniyor...
  </div>
  </div>

<div style="background:rgba(0,0,0,0.2); padding:8px; font-size:10px; color:#64748b; text-align:center; border-top:1px solid #334155;">
Her Pazartesi: 1.ye <b>500 XP</b>, 2.ye <b>250 XP</b>, 3.ye <b>150 XP</b>
  </div>
  </div>

<div style="margin-top:15px; background:rgba(0,0,0,0.2); padding:10px; border-radius:12px; border:1px solid rgba(255,255,255,0.05);">
<div style="font-size:11px; color:#94a3b8; text-align:left; margin-bottom:5px; font-weight:bold;">📜 SON OYUNLARIN</div>
<div id="mv2-history-list" style="display:flex; flex-direction:column; gap:5px;">
<div style="font-size:11px; color:#475569;">Henüz oyun yok.</div>
  </div>
  </div>
  </div>

<div id="mv2-stage-snake" style="display:none; flex-direction:column; align-items:center; min-height:85vh; width:100%;">
<div style="width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
<button onclick="ModumV2.closeGame()" style="background:rgba(255,255,255,0.1); border:none; color:#fff; padding:5px 12px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:12px;"><i class="fas fa-arrow-left"></i> Çık</button>
<div style="font-size:16px; color:#facc15; font-weight:bold;">Skor: <span id="mv2-score">0</span></div>
  </div>

<div style="position:relative;">
<canvas id="mv2-canvas" width="300" height="300" style="background:#0f172a; border-radius:12px; border:2px solid #475569; touch-action: none;"></canvas>

<div id="mv2-snake-start" onclick="ModumV2.startSnake()" style="position:absolute; top:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; color:#fff; cursor:pointer; flex-direction:column; border-radius:12px; z-index:10;">
<i class="fas fa-play" style="font-size:40px; color:#10b981;"></i>
<div style="font-weight:bold; margin-top:10px;">BAŞLAT</div>
  </div>
  </div>

<div class="mv2-mobile-hint">👆 Yılanı yönlendirmek için parmağını kaydır!</div>
  </div>

<div id="mv2-stage-stacker" style="display:none; flex-direction:column; align-items:center; min-height:85vh; width:100%;">
<div style="width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
<button onclick="ModumV2.closeGame()" style="background:rgba(255,255,255,0.1); border:none; color:#fff; padding:5px 12px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:12px;"><i class="fas fa-arrow-left"></i> Çık</button>
<div style="font-size:16px; color:#8b5cf6; font-weight:bold;">Kat: <span id="mv2-stack-score">0</span></div>
  </div>

<div style="position:relative;" onmousedown="ModumV2.stackerAction()" ontouchstart="ModumV2.stackerAction(); event.preventDefault();">
<canvas id="mv2-stacker-canvas" width="300" height="400"></canvas>

<div id="mv2-stacker-start" style="position:absolute; top:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; color:#fff; cursor:pointer; flex-direction:column; border-radius:8px; z-index:10; text-align:center; padding:20px;">
<div style="font-size:50px; margin-bottom:10px;">🎁</div>
<div style="font-weight:bold; font-size:20px; color:#fbbf24;">KULE MİMARI</div>
<div style="font-size:12px; color:#cbd5e1; margin-top:5px;">Kutuları tam üst üste diz!</div>
<div style="font-size:11px; color:#94a3b8; margin-top:5px;">(Başlamak için ekrana dokun)</div>
  </div>
  </div>
<div style="font-size:12px; color:#64748b; margin-top:15px; text-align:center;">Durdurmak için ekrana herhangi bir yere tıkla.</div>
  </div>`;

    contentWrapper.appendChild(gameArea);

    // --- C) ÇİFT MOTORLU OYUN SİSTEMİ ---
    window.ModumV2 = {
      particles: [], // Patlama efektleri için
      activeGame: null,
      gameInterval: null,
      score: 0,

      // --- GÜVENLİK İÇİN TOKEN ALMA ---
      activeToken: null, // Token'ı burada saklayacağız

      // 🔥 YENİ: Oyun Oturumu Başlatma (Güvenlik)
      startGameSession: function (gameType) {
        this.activeToken = null; // Eskiyi sil
        if (!APP_STATE.user || !APP_STATE.user.email) return;

        // Backend'den token iste
        window
          .fetchApi("start_game_session", {
            email: APP_STATE.user.email,
            game: gameType,
          })
          .then((res) => {
            if (res && res.success) {
              this.activeToken = res.token;
              console.log("🔒 Oyun Oturumu Başladı: " + res.token);
            } else {
              console.log(
                "⚠️ Oturum hatası: " + (res ? res.message : "Bilinmiyor"),
              );
            }
          });
      },

      // --- ORTAK MENÜ ---
      openGame: function (gameType) {
        // ... (eski kodlar: menüyü gizle vs.) ...
        document.getElementById("mv2-menu").style.display = "none";
        document.body.style.overflow = "hidden";

        // 🔥 YENİ EKLENEN SATIR: GÜVENLİK OTURUMUNU BAŞLAT
        this.startGameSession(gameType);

        if (gameType === "snake") {
          document.getElementById("mv2-stage-snake").style.display = "flex";
          this.activeGame = "snake";
          document.getElementById("mv2-snake-start").style.display = "flex";
        } else if (gameType === "stacker") {
          document.getElementById("mv2-stage-stacker").style.display = "flex";
          this.activeGame = "stacker";
          this.initStacker(); // Kuleyi hazırla
          document.getElementById("mv2-stacker-start").style.display = "flex";
        }

        // Scroll fix
        setTimeout(() => {
          // Eğer ekran 768px'den küçükse (Mobil) 200, büyükse (Masaüstü) 250 olsun
          var hedef = window.innerWidth <= 768 ? 200 : 250;

          window.scrollTo({
            top: hedef,
            behavior: "smooth", // Yumuşak kayar
          });
        }, 100);
      },

      closeGame: function () {
        if (this.gameInterval) clearInterval(this.gameInterval);
        if (this.stackerAnim) cancelAnimationFrame(this.stackerAnim);

        document.getElementById("mv2-stage-snake").style.display = "none";
        document.getElementById("mv2-stage-stacker").style.display = "none";
        document.getElementById("mv2-menu").style.display = "block";
        document.body.style.overflow = "auto";
        this.updateScores();
        this.renderHistory();
        this.activeGame = null;
      },

      updateScores: function () {
        if (!APP_STATE.user || !APP_STATE.user.email) return;
        fetchApi("get_user_details", { email: APP_STATE.user.email }).then(
          (res) => {
            if (res && res.success && res.user) {
              var games = res.user.games || {};

              // BUGÜNÜN TARİHİNİ AL (YYYY-MM-DD)
              var now = new Date();
              // Türkiye saatine ayarla
              var trDate = new Date(
                now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }),
              );
              var yyyy = trDate.getFullYear();
              var mm = String(trDate.getMonth() + 1).padStart(2, "0");
              var dd = String(trDate.getDate()).padStart(2, "0");
              var todayStr = yyyy + "-" + mm + "-" + dd;

              // YILAN SKORLARI
              if (document.getElementById("mv2-snake-best"))
                document.getElementById("mv2-snake-best").innerText =
                  (games.snake && games.snake.highScore) || 0;

              // Günlük Skor Kontrolü: Tarih bugün mü?
              var snakeDaily = 0;
              if (games.snake && games.snake.lastPlayed === todayStr) {
                snakeDaily = games.snake.dailyScore || 0;
              }
              if (document.getElementById("mv2-snake-daily"))
                document.getElementById("mv2-snake-daily").innerText =
                  snakeDaily;

              // KULE SKORLARI
              if (document.getElementById("mv2-stacker-best"))
                document.getElementById("mv2-stacker-best").innerText =
                  (games.stacker && games.stacker.highScore) || 0;

              // Günlük Skor Kontrolü: Tarih bugün mü?
              var stackDaily = 0;
              if (games.stacker && games.stacker.lastPlayed === todayStr) {
                stackDaily = games.stacker.dailyScore || 0;
              }
              if (document.getElementById("mv2-stacker-daily"))
                document.getElementById("mv2-stacker-daily").innerText =
                  stackDaily;
            }
          },
        );
      },

      startSnake: function () {
        this.startGameSession("snake");
        var cvs = document.getElementById("mv2-canvas");
        var ctx = cvs.getContext("2d");
        document.getElementById("mv2-snake-start").style.display = "none";

        var gs = 15,
          tc = 20,
          px = 10,
          py = 10,
          ax = 15,
          ay = 15,
          xv = 1,
          yv = 0,
          trail = [],
          tail = 5;
        this.score = 0;
        document.getElementById("mv2-score").innerText = "0";

        // --- KLAVYE KONTROLLERİ (Masaüstü için) ---
        document.onkeydown = function (e) {
          if (ModumV2.activeGame !== "snake") return;
          if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) e.preventDefault();

          switch (e.keyCode) {
            case 37:
            case 65:
              if (xv !== 1) {
                xv = -1;
                yv = 0;
              }
              break; // Sol
            case 38:
            case 87:
              if (yv !== 1) {
                xv = 0;
                yv = -1;
              }
              break; // Üst
            case 39:
            case 68:
              if (xv !== -1) {
                xv = 1;
                yv = 0;
              }
              break; // Sağ
            case 40:
            case 83:
              if (yv !== -1) {
                xv = 0;
                yv = 1;
              }
              break; // Alt
          }
        };

        // --- 🔥 MOBİL SWIPE (KAYDIRMA) KONTROLLERİ ---
        var touchStartX = 0;
        var touchStartY = 0;

        cvs.addEventListener(
          "touchstart",
          function (e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            e.preventDefault(); // Sayfanın kaymasını engelle
          },
          { passive: false },
        );

        cvs.addEventListener(
          "touchend",
          function (e) {
            if (ModumV2.activeGame !== "snake") return;

            var touchEndX = e.changedTouches[0].screenX;
            var touchEndY = e.changedTouches[0].screenY;

            var diffX = touchEndX - touchStartX;
            var diffY = touchEndY - touchStartY;

            // Hareket çok küçükse (yanlışlıkla dokunma) sayma
            if (Math.abs(diffX) < 20 && Math.abs(diffY) < 20) return;

            // Yatay mı Dikey mi daha çok kaydırıldı?
            if (Math.abs(diffX) > Math.abs(diffY)) {
              // YATAY HAREKET
              if (diffX > 0) {
                if (xv !== -1) {
                  xv = 1;
                  yv = 0;
                }
              } // Sağ
              else {
                if (xv !== 1) {
                  xv = -1;
                  yv = 0;
                }
              } // Sol
            } else {
              // DİKEY HAREKET
              if (diffY > 0) {
                if (yv !== -1) {
                  xv = 0;
                  yv = 1;
                }
              } // Aşağı
              else {
                if (yv !== 1) {
                  xv = 0;
                  yv = -1;
                }
              } // Yukarı
            }
            e.preventDefault();
          },
          { passive: false },
        );

        window.mv2Dir = function (x, y) {
          if (x === 1 && xv !== -1) {
            xv = 1;
            yv = 0;
          }
          if (x === -1 && xv !== 1) {
            xv = -1;
            yv = 0;
          }
          if (y === 1 && yv !== -1) {
            xv = 0;
            yv = 1;
          }
          if (y === -1 && yv !== 1) {
            xv = 0;
            yv = -1;
          }
        };

        function gameLoop() {
          px += xv;
          py += yv;
          if (px < 0) px = tc - 1;
          if (px > tc - 1) px = 0;
          if (py < 0) py = tc - 1;
          if (py > tc - 1) py = 0;

          ctx.fillStyle = "#0f172a";
          ctx.fillRect(0, 0, cvs.width, cvs.height);
          ctx.fillStyle = "#10b981"; // Yılan rengi

          // Partiküller
          for (var k = 0; k < ModumV2.particles.length; k++) {
            var p = ModumV2.particles[k];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            ctx.fillStyle = "rgba(250, 204, 21, " + p.life / 20 + ")";
            ctx.fillRect(p.x * gs, p.y * gs, gs / 2, gs / 2);
          }
          ModumV2.particles = ModumV2.particles.filter((p) => p.life > 0);

          for (var i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
            if (trail[i].x === px && trail[i].y === py && tail > 5) {
              clearInterval(ModumV2.gameInterval);
              ModumV2.endGame("snake", ModumV2.score);
              return;
            }
          }
          trail.push({ x: px, y: py });
          while (trail.length > tail) trail.shift();

          ctx.fillStyle = "#facc15"; // Yem rengi
          ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
          if (ax === px && ay === py) {
            for (var i = 0; i < 8; i++) {
              ModumV2.particles.push({
                x: px,
                y: py,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                life: 20,
              });
            }
            tail++;
            ModumV2.score += 10;
            document.getElementById("mv2-score").innerText = ModumV2.score;
            ax = Math.floor(Math.random() * tc);
            ay = Math.floor(Math.random() * tc);
          }
        }
        if (this.gameInterval) clearInterval(this.gameInterval);
        this.gameInterval = setInterval(gameLoop, 1000 / 10);
      },

      // --- 🎁 KULE (STACKER) MANTIĞI ---
      stackerVars: {},
      stackerAnim: null,

      initStacker: function () {
        var cvs = document.getElementById("mv2-stacker-canvas");
        var ctx = cvs.getContext("2d");

        this.stackerVars = {
          ctx: ctx,
          width: cvs.width,
          height: cvs.height,
          blocks: [],
          score: 0,
          speed: 3,
          currentBase: 100, // Başlangıç genişliği
          currentX: 0,
          direction: 1,
          state: "start", // start, playing, over
        };

        // İlk Zemin
        this.stackerVars.blocks.push({
          x: (300 - 100) / 2,
          y: 400 - 30,
          w: 100,
          h: 30,
          color: "#334155",
        });

        this.drawStacker();
      },

      startStackerGame: function () {
        this.startGameSession("stacker");
        var v = this.stackerVars;
        v.state = "playing";
        v.score = 0;
        v.speed = 2;
        v.currentBase = 100;
        v.blocks = [{ x: 100, y: 370, w: 100, h: 30, color: "#334155" }];

        // İlk hareketli blok
        this.spawnStackerBlock();
        document.getElementById("mv2-stack-score").innerText = "0";
        this.stackerLoop();
      },

      spawnStackerBlock: function () {
        var v = this.stackerVars;
        var prev = v.blocks[v.blocks.length - 1];

        v.currentBlock = {
          x: 0,
          y: prev.y - 30,
          w: v.currentBase,
          h: 30,
          color: this.getStackerColor(v.score),
        };
        v.currentX = 0;
        v.direction = 1;
      },

      getStackerColor: function (score) {
        var colors = [
          "#f472b6",
          "#a78bfa",
          "#60a5fa",
          "#34d399",
          "#facc15",
          "#fb923c",
          "#f87171",
        ];
        return colors[score % colors.length];
      },

      stackerAction: function () {
        if (this.activeGame !== "stacker") return;
        var v = this.stackerVars;

        if (v.state === "start" || v.state === "over") {
          document.getElementById("mv2-stacker-start").style.display = "none";
          this.startStackerGame();
          return;
        }

        // Blok Yerleştirme Mantığı
        var moving = v.currentBlock;
        var prev = v.blocks[v.blocks.length - 1];

        var diff = moving.x - prev.x;
        var overlap = moving.w - Math.abs(diff);

        if (overlap > 0) {
          // MERKEZLEME HESABI (Mükemmel mi?)
          // Eğer kayma payı (diff) 3 pikselden azsa "Mükemmel" sayalım.
          var isPerfect = Math.abs(diff) < 3;

          if (isPerfect) {
            if (Math.abs(diff) === 0) {
              // Tam isabetse
              // Ekranı beyazlat (Flash Efekti)
              var canvas = document.getElementById("mv2-stacker-canvas");
              canvas.style.filter = "brightness(2)";
              setTimeout(() => (canvas.style.filter = "brightness(1)"), 100);

              // Varsa ses çal (Daha önce eklediğin ses sistemini kullan)
              if (window.MDM_SOUND) window.MDM_SOUND.play("coin"); // Veya özel bir 'combo' sesi
            }
            // Mükemmel ise bloğu tam ortala (Kaymayı düzelt)
            moving.x = prev.x;
            overlap = moving.w; // Kesilme olmaz
            v.combo = (v.combo || 0) + 1; // Kombo sayacını artır

            // Görsel Efekt (Basit bir parlama)
            document.getElementById("mv2-stacker-canvas").style.boxShadow =
              `0 0 ${20 + v.combo * 5}px #4ade80`;
            setTimeout(
              () =>
                (document.getElementById("mv2-stacker-canvas").style.boxShadow =
                  ""),
              200,
            );

            // Ekstra Puan (Kombo başına +1)
            v.score += v.combo;
          } else {
            v.combo = 0; // Hata yaparsa kombo sıfırlanır
          }
          // Başarılı Yerleştirme
          v.score++;
          document.getElementById("mv2-stack-score").innerText = v.score;

          // Bloğu kes
          var newW = overlap;
          var newX = prev.x + (diff > 0 ? diff : 0);

          v.blocks.push({
            x: newX,
            y: moving.y,
            w: newW,
            h: moving.h,
            color: moving.color,
          });

          v.currentBase = newW; // Sonraki blok bu genişlikte olacak

          // Hızlandır
          if (v.score % 5 === 0) v.speed += 0.5;

          // Sahneyi kaydır (Eğer çok yükseldiyse)
          if (v.blocks.length > 8) {
            v.blocks.forEach((b) => (b.y += 30));
            v.blocks.shift(); // En alttakini sil
          }

          this.spawnStackerBlock();
        } else {
          // Boşa Bastı -> Game Over
          v.state = "over";
          cancelAnimationFrame(this.stackerAnim);
          this.endGame("stacker", v.score);
        }
      },

      stackerLoop: function () {
        if (
          this.activeGame !== "stacker" ||
          this.stackerVars.state !== "playing"
        )
          return;

        var v = this.stackerVars;

        // Hareket
        v.currentBlock.x += v.speed * v.direction;

        // Duvarlara çarpma
        if (v.currentBlock.x + v.currentBlock.w > v.width) v.direction = -1;
        if (v.currentBlock.x < 0) v.direction = 1;

        this.drawStacker();
        this.stackerAnim = requestAnimationFrame(() => this.stackerLoop());
      },

      drawStacker: function () {
        var v = this.stackerVars;
        var ctx = v.ctx;

        ctx.clearRect(0, 0, v.width, v.height);

        // Sabit Bloklar
        v.blocks.forEach((b) => {
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          // Kutu Süsü (Şerit)
          ctx.fillStyle = "rgba(255,255,255,0.2)";
          ctx.fillRect(b.x + b.w / 2 - 5, b.y, 10, b.h);
          ctx.strokeStyle = "#0f172a";
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        });

        // Hareketli Blok
        if (v.state === "playing" && v.currentBlock) {
          var b = v.currentBlock;
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.fillStyle = "rgba(255,255,255,0.2)";
          ctx.fillRect(b.x + b.w / 2 - 5, b.y, 10, b.h);
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.strokeRect(b.x, b.y, b.w, b.h);
        }
      },

      // --- ORTAK BİTİŞ ---
      endGame: function (gameType, score) {
        var title = gameType === "snake" ? "Yılan Bitti" : "Kule Yıkıldı";
        alert(`${title}! Puanın: ${score}`);

        if (gameType === "snake")
          document.getElementById("mv2-snake-start").style.display = "flex";
        if (gameType === "stacker")
          document.getElementById("mv2-stacker-start").style.display = "flex";

        this.saveLocal(score, gameType);

        if (score > 0 && APP_STATE.user && APP_STATE.user.email) {
          // 🔥 GÜNCEL KOD BURASI: Token ile gönderiyoruz
          var payload = {
            email: APP_STATE.user.email,
            game: gameType,
            score: score,
          };

          // Eğer token varsa ekle
          if (this.activeToken) {
            payload.token = this.activeToken;
          } else {
            console.warn(
              "⚠️ Uyarı: Token alınamadı, skor güvensiz gönderiliyor.",
            );
          }

          fetchApi("submit_game_score", payload).then((res) => {
            if (res && res.isRecord) alert("🏆 YENİ REKOR: " + score);
            if (res && !res.success) alert("⚠️ " + res.message); // Hile uyarısı gelirse göster
            this.updateScores();
            this.renderHistory();
            this.activeToken = null; // Token'ı yak (Tek kullanımlık)
          });
        }
      },

      renderHistory: function () {
        // Basitlik için sadece snake geçmişini gösteriyoruz veya birleştirebiliriz.
        // Şimdilik yerel depolamadan karışık çekelim.
        var list = JSON.parse(
          localStorage.getItem("mv2_local_history") || "[]",
        );
        var container = document.getElementById("mv2-history-list");
        if (!container) return;
        if (list.length === 0) {
          container.innerHTML =
            '<div style="font-size:11px; color:#475569;">Henüz oyun yok.</div>';
          return;
        }

        var html = "";
        list.forEach((item) => {
          var icon = item.game === "stacker" ? "🎁" : "🐍";
          html += `<div style="display:flex; justify-content:space-between; font-size:11px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:3px;">
<span style="color:#cbd5e1;">${icon} Skor: <b style="color:#fff;">${item.score}</b></span>
<span style="color:#64748b;">${item.date}</span>
  </div>`;
        });
        container.innerHTML = html;
      },

      saveLocal: function (score, gameType) {
        if (score <= 0) return;
        var list = JSON.parse(
          localStorage.getItem("mv2_local_history") || "[]",
        );
        var time = new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        list.unshift({ score: score, date: time, game: gameType });
        if (list.length > 5) list = list.slice(0, 5);
        localStorage.setItem("mv2_local_history", JSON.stringify(list));
        this.renderHistory();
      },

      // --- 🔥 YENİ: LİDERLİK TABLOSU MANTIĞI ---
      toggleLeaderboard: function () {
        var panel = document.getElementById("mv2-leaderboard-panel");
        if (panel.style.display === "none") {
          panel.style.display = "block";
          this.loadLeaderboard();
        } else {
          panel.style.display = "none";
        }
      },

      loadLeaderboard: function () {
        var panel = document.getElementById("mv2-leaderboard-panel");
        if (!window.fetchApi) return;

        window.fetchApi("get_game_leaderboard").then((res) => {
          if (res && res.success && res.list.length > 0) {
            var html = "";

            // Rozet İkonları (Yedek)
            var BADGES = {
              gorev_adami: "🎯",
              gece_kusu: "👾",
              takim_lideri: "🤝",
              sepet_krali: "🛍️",
              alev_alev: "🔥",
              hazine_avcisi: "🕵️",
              sans_melegi: "🍀",
              bonkor: "🎁",
              lvl_caylak: "🌱",
              lvl_usta: "⚔️",
              lvl_sampiyon: "🦁",
              lvl_efsane: "🐉",
            };

            res.list.forEach((u, i) => {
              // 1. Sıralama Rengi ve İkonu
              var rankStyle =
                "background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05);";
              var rankIcon = `<span style="color:#64748b; font-size:11px; font-weight:bold;">${
                i + 1
              }.</span>`;

              if (i === 0) {
                // 1. Lider (Altın)
                rankStyle =
                  "background:linear-gradient(90deg, rgba(251, 191, 36, 0.15), transparent); border:1px solid rgba(251, 191, 36, 0.3);";
                rankIcon = "👑";
              } else if (i === 1) {
                // 2. (Gümüş)
                rankStyle =
                  "background:linear-gradient(90deg, rgba(148, 163, 184, 0.15), transparent); border:1px solid rgba(148, 163, 184, 0.3);";
                rankIcon = "🥈";
              } else if (i === 2) {
                // 3. (Bronz)
                rankStyle =
                  "background:linear-gradient(90deg, rgba(180, 83, 9, 0.15), transparent); border:1px solid rgba(180, 83, 9, 0.3);";
                rankIcon = "🥉";
              }

              // 2. Avatar Hazırlığı
              var userAvatar = "👤";
              var imgStyle = "";

              // Resim Linki varsa
              if (
                u.avatar &&
                (u.avatar.includes("http") || u.avatar.includes("data:image"))
              ) {
                userAvatar = `<img src="${u.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
              }
              // Rozet ID'si varsa
              else if (u.avatar && BADGES[u.avatar]) {
                userAvatar = BADGES[u.avatar];
                imgStyle =
                  "font-size:16px; display:flex; align-items:center; justify-content:center;";
              }

              // 3. Çerçeve Hazırlığı
              // 3. Çerçeve ve Tema Hazırlığı
              var frameHtml = "";
              var borderStyle = "border: 1px solid rgba(255,255,255,0.2);"; // Varsayılan gri

              // Temayı Bul (Global tema listesinden rengi al)
              var uTheme = u.theme || "default";
              var themeColor = "#cbd5e1"; // Varsayılan

              // Eğer global tema listesi yüklüyse oradan rengi çek
              if (window.PROFILE_THEMES && window.PROFILE_THEMES[uTheme]) {
                // Temanın border rengini alıyoruz
                themeColor = window.PROFILE_THEMES[uTheme].border || "#cbd5e1";
              }

              if (u.frame && u.frame.length > 2) {
                // Çerçeve varsa kenarlığı kaldır (Çerçeve CSS'i halleder)
                frameHtml = `<div class="mdm-avatar-frame ${u.frame}" style="top:-2px; left:-2px; right:-2px; bottom:-2px;"></div>`;
                borderStyle = "border:none;";
              } else {
                // Çerçeve yoksa, TEMA RENGİNDE kenarlık ve parlama ekle 🔥
                borderStyle = `border: 2px solid ${themeColor}; box-shadow: 0 0 10px ${themeColor}60;`;
              }

              // 4. HTML Satırı
              html += `
<div style="display:flex; align-items:center; justify-content:space-between; padding:10px; margin-bottom:6px; border-radius:8px; ${rankStyle}">

<div style="display:flex; align-items:center; gap:12px;">
<div style="width:20px; text-align:center; font-size:16px;">${rankIcon}</div>

<div style="width:32px; height:32px; position:relative; background:rgba(0,0,0,0.3); border-radius:50%; ${borderStyle} ${imgStyle}">
${frameHtml}
${userAvatar}
  </div>

<div style="font-size:12px; color:#fff; font-weight:600;">${u.name}</div>
  </div>

<div style="font-size:12px; color:#fff; font-weight:800; text-shadow:0 0 10px rgba(255,255,255,0.3);">${u.score} P</div>
  </div>`;
            });

            panel.innerHTML = html;
          } else {
            panel.innerHTML =
              '<div style="text-align:center; padding:15px; color:#64748b; font-size:11px;">Henüz bu hafta skor yok. İlk sen ol!</div>';
          }
        });
      },
    };

    document.querySelectorAll(".mdm-dock-link").forEach((btn) => {
      if (btn.id !== "v2-game-btn") {
        btn.addEventListener("click", function () {
          if (document.getElementById("v2-game-area"))
            document.getElementById("v2-game-area").style.display = "none";
          var gameBtn = document.getElementById("v2-game-btn");
          if (gameBtn) gameBtn.classList.remove("active");
          // Oyun açıksa kapat
          if (window.ModumV2 && window.ModumV2.activeGame)
            window.ModumV2.closeGame();
        });
      }
    });

    if (window.ModumV2) {
      window.ModumV2.renderHistory();
      window.ModumV2.updateScores();
    }

    // ... (Bilet Cüzdanı kodları buradan devam eder, onları elleme) ...

    // --- 🎫 BİLET CÜZDANI ---
    window.ModumApp.openTicketModal = function () {
      ModumApp.logAction("Cüzdan", "Biletlerine Baktı");
      document.getElementById("mdm-ticket-modal").classList.add("active");
      var container = document.getElementById("mdm-ticket-list");
      container.innerHTML =
        '<div class="mdm-loading" style="text-align:center;color:#fff; padding:40px;"><i class="fas fa-circle-notch fa-spin"></i> Biletler Taranıyor...</div>';
      window
        .fetchApi("get_user_tickets", { email: window.APP_STATE.user.email })
        .then((data) => {
          if (data && data.success && data.list.length > 0) {
            var html = "";
            data.list.sort(
              (a, b) => (b.isWinner === true) - (a.isWinner === true),
            );
            data.list.forEach((t) => {
              var firstCode = t.tickets[0].code;
              var rafName = t.raffleName;
              var count = t.totalTickets;
              var isWin = t.isWinner === true;
              var cardClass = isWin
                ? "mdm-real-ticket winner-ticket"
                : "mdm-real-ticket";
              var statusBadge = isWin
                ? `<div class="mdm-ticket-status">🎉 TEBRİKLER KAZANDINIZ!</div>`
                : `<div style="font-size:10px; color:#94a3b8; margin-bottom:5px;">MODUMNET ÇEKİLİŞİ</div>`;
              var titleStyle = isWin ? "mdm-rt-title" : "color:#fff;";
              var dateText = isWin
                ? "🏆 Ödülünüzü kontrol edin!"
                : "📅 Çekiliş Tarihi Bekleniyor";
              var dateColor = isWin ? "#78350f" : "#fbbf24";
              var storyBtn = isWin
                ? `<button class="btn-story-share" onclick="window.ModumApp.openShareStoryModal('${rafName.replace(
                    /'/g,
                    "\\'",
                  )}', '${count}', '${firstCode}')"><i class="fab fa-instagram"></i> Story Paylaş (+100 XP)</button>`
                : "";
              html += `<div class="${cardClass}"><div class="mdm-rt-left">${statusBadge}<div class="${titleStyle}" style="font-size:14px; font-weight:bold; line-height:1.3;">${rafName}</div><div style="font-size:10px; color:${dateColor}; margin-top:8px; font-weight:bold;">${dateText}</div>${storyBtn}</div><div class="mdm-rt-right"><div style="font-size:24px; font-weight:900; color:#78350f;">x${count}</div><div style="font-size:10px; color:#78350f; font-weight:bold; text-align:center;">BİLET</div><div style="margin-top:auto; font-size:9px; font-family:monospace; transform:rotate(-90deg); white-space:nowrap; width:10px;">${firstCode}...</div></div></div>`;
            });
            container.innerHTML = html;
          } else {
            container.innerHTML =
              '<div style="text-align:center; padding:50px; color:#94a3b8;"><i class="fas fa-ticket-alt" style="font-size:40px; margin-bottom:15px; opacity:0.3;"></i><br>Henüz biletiniz yok.<br><small>Vitrinden bir çekilişe katılın!</small></div>';
          }
        });
    };

    // --- STORY MODAL ---
    window.ModumApp.openShareStoryModal = function (
      raffleName,
      ticketCount,
      ticketCode,
    ) {
      var old = document.getElementById("mdm-share-info-modal");
      if (old) old.remove();
      var html = `<div id="mdm-share-info-modal" class="mdm-modal active" style="z-index:999999; display:flex; align-items:center; justify-content:center;"><div class="mdm-modal-content" style="width:90%; max-width:400px; background:#1e293b; border:1px solid #334155; border-radius:16px; padding:25px; text-align:center;"><div style="font-size:50px; margin-bottom:15px;">📸</div><h3 style="color:#fff; margin:0 0 10px 0;">Instagram'da Paylaş</h3><div class="mdm-story-info-text">Bu zaferini Instagram Hikayende paylaş! <br>Bizi etiketlersen <b>(@modumnetco)</b> hikayemizde paylaşacağız ve hesabına anında <b style="color:#fbbf24;">100 XP Ödül</b> yüklenecektir! 🚀</div><button onclick="window.ModumApp.generateTicketStory('${raffleName}', '${ticketCount}', '${ticketCode}')" class="mdm-btn-lucky" style="width:100%; justify-content:center;"><i class="fas fa-magic"></i> Görseli Oluştur</button><div onclick="document.getElementById('mdm-share-info-modal').remove()" style="margin-top:15px; color:#64748b; font-size:12px; cursor:pointer;">Vazgeç</div></div></div>`;
      document.body.insertAdjacentHTML("beforeend", html);
    };

    window.ModumApp.generateTicketStory = function (
      raffleName,
      ticketCount,
      ticketCode,
    ) {
      var btn = document.querySelector("#mdm-share-info-modal .mdm-btn-lucky");
      if (btn) {
        btn.innerHTML = "Hazırlanıyor...";
        btn.disabled = true;
      }
      var userName = (window.APP_STATE.user.name || "MİSAFİR").toUpperCase();
      var safeCode = ticketCode || "#KOD-YOK";
      var cardHtml = `<div id="mdm-ticket-share-card" style="position:fixed; top:0; left:0; width:1080px; height:1920px; background:#0f172a; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:'Outfit',sans-serif; text-align:center; z-index:-5; pointer-events:none;"><div style="position:absolute; top:0; left:0; width:100%; height:100%; background:radial-gradient(circle at 50% 30%, #1e293b 0%, #000000 90%); z-index:-2;"></div><div style="font-size:600px; position:absolute; top:40%; left:50%; transform:translate(-50%, -50%) rotate(-20deg); opacity:0.03; color:#fff;">🏆</div><div style="position:absolute; top:10%; left:10%; width:30px; height:30px; background:#facc15; border-radius:50%;"></div><div style="position:absolute; top:20%; right:15%; width:20px; height:20px; background:#ef4444; border-radius:50%;"></div><div style="position:absolute; bottom:30%; left:20%; width:40px; height:40px; background:#3b82f6; border-radius:50%;"></div><div style="font-size:50px; color:#94a3b8; font-weight:800; letter-spacing:15px; margin-bottom:80px; text-transform:uppercase; text-shadow:0 0 20px rgba(0,0,0,0.5);">MODUMNET</div><div style="display:flex; width: 900px; filter: drop-shadow(0 20px 50px rgba(0,0,0,0.6));"><div style="flex:1; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 30px 0 0 30px; padding: 50px; text-align:left; position:relative; border-right: 4px dashed rgba(0,0,0,0.2);"><div style="background:rgba(255,255,255,0.2); color:#fff; font-weight:bold; font-size:24px; padding:10px 30px; border-radius:50px; display:inline-block; margin-bottom:30px;">🎉 KAZANAN TALİHLİ</div><div style="font-size: 55px; font-weight: 900; line-height: 1.1; margin-bottom: 40px; color:#fff; text-transform:uppercase; text-shadow:0 2px 0 rgba(0,0,0,0.1);">${raffleName}</div><div style="display:flex; align-items:center; gap:20px;"><div style="width:80px; height:80px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:40px;">👤</div><div><div style="font-size:18px; color:rgba(255,255,255,0.8); font-weight:bold;">KULLANICI ADI</div><div style="font-size:40px; color:#fff; font-weight:900;">${userName}</div></div></div><div style="position:absolute; bottom:20px; right:20px; font-size:100px; opacity:0.2;">🎁</div></div><div style="width: 250px; background: #fbbf24; border-radius: 0 30px 30px 0; padding: 40px 20px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative;"><div style="font-size:20px; color:#78350f; font-weight:bold; text-transform:uppercase; letter-spacing:2px; writing-mode: vertical-rl; transform: rotate(180deg);">MODUMNET</div><div style="margin: 40px 0; width: 100%; height: 2px; background: rgba(120, 53, 15, 0.2);"></div><div style="font-size:16px; color:#78350f; font-weight:bold;">BİLET NO</div><div style="font-size:26px; color:#451a03; font-weight:900; margin-top:5px; font-family:monospace; background:rgba(255,255,255,0.4); padding:5px 10px; border-radius:8px;">${safeCode}</div></div></div><div style="font-size: 45px; color: #fff; margin-top: 100px; font-weight: bold;">SEN DE KATIL, SEN DE KAZAN! 🚀</div><div style="font-size: 30px; color: #94a3b8; margin-top: 20px; font-weight:500;">@modumnetco | www.modum.tr</div></div>`;
      document.body.insertAdjacentHTML("beforeend", cardHtml);
      var element = document.getElementById("mdm-ticket-share-card");
      setTimeout(() => {
        if (typeof html2canvas === "undefined") {
          alert("Görsel oluşturucu yüklenemedi.");
          return;
        }
        html2canvas(element, {
          scale: 1,
          backgroundColor: "#0f172a",
          useCORS: true,
          allowTaint: true,
        })
          .then((canvas) => {
            var link = document.createElement("a");
            link.download = "ModumNet-Kazanan-" + safeCode + ".jpg";
            link.href = canvas.toDataURL("image/jpeg", 0.95);
            link.click();
            element.remove();
            document.getElementById("mdm-share-info-modal").remove();
            var guideHtml = `<div id="mdm-share-final" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999999; display:flex; align-items:center; justify-content:center; padding:20px;"><div style="background:#1e293b; border:1px solid #334155; border-radius:20px; padding:30px; text-align:center; max-width:350px; position:relative;"><div onclick="document.getElementById('mdm-share-final').remove()" style="position:absolute; top:15px; right:15px; color:#94a3b8; font-size:24px; cursor:pointer; line-height:0.5;">×</div><div style="font-size:50px; margin-bottom:15px;">✅</div><h3 style="color:#fff; margin:0 0 10px 0;">Görsel Hazır!</h3><p style="color:#cbd5e1; font-size:13px; margin-bottom:20px;">Görsel galerine kaydedildi.</p><button onclick="window.location.href='instagram://story-camera'; setTimeout(()=>{ document.getElementById('mdm-share-final').remove(); }, 1000);" style="background:linear-gradient(45deg, #f09433, #dc2743); color:white; border:none; padding:12px 30px; border-radius:50px; font-weight:bold; cursor:pointer; width:100%;">Instagram'ı Aç 🚀</button></div></div>`;
            document.body.insertAdjacentHTML("beforeend", guideHtml);
          })
          .catch((err) => {
            alert("Hata oluştu: " + err);
            element.remove();
            document.getElementById("mdm-share-info-modal").remove();
          });
      }, 1000);
    };

    // --- KAYAN YAZI (FİXED: BOZULMAYAN VERSİYON) ---
    var marqueeStyle = document.createElement("style");
    // ÖNEMLİ DÜZELTME: box-sizing ve max-width ekledik. Artık taşma yapmaz.
    marqueeStyle.innerHTML = `#mdm-announcement-bar { width: 100%; max-width: 100%; box-sizing: border-box; background-color: #ef4444; color: #fff; overflow: hidden; white-space: nowrap; position: relative; z-index: 9990; font-size: 12px; font-weight: 700; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; align-items: center; height: 32px; margin: 0; padding: 0; border: none; } .mdm-marquee-content { display: inline-block; padding-left: 100%; animation: mdmMarquee 20s linear infinite; padding-right: 50px; } @keyframes mdmMarquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }`;
    document.head.appendChild(marqueeStyle);

    setTimeout(function () {
      if (window.fetchApi) {
        window.fetchApi("get_scrolling_text").then(function (res) {
          if (res && res.success && res.data && res.data.active) {
            var bar = document.createElement("div");
            bar.id = "mdm-announcement-bar";
            bar.style.backgroundColor = res.data.color || "#ef4444";
            bar.innerHTML =
              '<div class="mdm-marquee-content">' + res.data.text + "</div>";

            // SİTEYİ BOZMADAN YERLEŞTİRMEK İÇİN:
            // Topbar varsa onun hemen altına, yoksa en başa ekle.
            var topbar = document.querySelector(".mdm-topbar");
            if (topbar && topbar.parentNode) {
              topbar.parentNode.insertBefore(bar, topbar.nextSibling);
            } else {
              document.body.prepend(bar);
            }
          }
        });
      }
    }, 1500);
  } // initModumV2 Son

  /* ======================================================
   🚀 KOZMETİK VE AVATAR SİSTEMİ (SATIN ALINANLAR DÜZELTİLDİ)
   ====================================================== */
  function initCosmeticSystem() {
    if (!window.ModumApp) return;

    // 1. MAĞAZA KATEGORİSİNİ GÜNCELLEME
    window.ModumApp.switchStoreCategory = function (category) {
      if (!APP_STATE.storeContext) return;
      var items = APP_STATE.storeContext.items || [];
      var purchased = APP_STATE.storeContext.purchased || [];
      var ownedFrames = APP_STATE.user.ownedFrames || [];
      // 🔥 BURASI ÖNEMLİ: Local State'den okuyoruz
      var ownedAvatars = APP_STATE.user.ownedAvatars || [];

      document.querySelectorAll(".mdm-store-tab-btn").forEach((btn) => {
        btn.style.background =
          btn.dataset.tab === category ? "#3b82f6" : "rgba(255,255,255,0.05)";
        btn.style.color = btn.dataset.tab === category ? "#fff" : "#94a3b8";
      });

      var container = document.getElementById("mdm-store-dynamic-content");
      if (!container) return;
      var finalHtml = "";

      // --- KUPONLAR SEKMESİ ---
      if (category === "coupons") {
        const specials = items.filter((i) => {
          let t = (i.title || "").toLowerCase();
          let type = (i.type || "").toLowerCase();
          return (
            t.includes("kutu") ||
            t.includes("sandık") ||
            t.includes("hak") ||
            t.includes("bilet") ||
            type === "hak_paketi" ||
            type === "chest"
          );
        });

        const coupons = items.filter((i) => {
          let t = (i.title || "").toLowerCase();
          let type = (i.type || "").toLowerCase();
          let isSpecial =
            t.includes("kutu") ||
            t.includes("sandık") ||
            t.includes("hak") ||
            t.includes("bilet") ||
            type === "hak_paketi" ||
            type === "chest";
          let isCosmetic =
            t.includes("çerçeve") ||
            type === "avatar_frame" ||
            type === "animated_avatar";
          return !isSpecial && !isCosmetic;
        });

        if (specials.length > 0)
          finalHtml += ModumApp.renderStoreGrid(
            specials,
            purchased,
            "🔥 ÖZEL FIRSATLAR",
          );
        if (specials.length > 0 && coupons.length > 0)
          finalHtml += `<div style="height:1px; background:#334155; margin:30px 10px;"></div>`;
        if (coupons.length > 0)
          finalHtml += ModumApp.renderStoreGrid(
            coupons,
            purchased,
            "🎫 İNDİRİM KUPONLARI",
          );

        if (!finalHtml)
          finalHtml =
            '<div style="padding:30px;text-align:center;color:#888;">Aktif ürün yok.</div>';
      }

      // --- 🔥 KOZMETİK SEKMESİ (DÜZELTİLDİ) ---
      if (category === "products") {
        // A) HAREKETLİ AVATARLAR
        const avatarItems = items.filter((i) => i.type === "animated_avatar");
        if (avatarItems.length > 0) {
          let avatarHtml = "";
          avatarItems.forEach((f) => {
            const imgLink =
              f.image ||
              f.image_url ||
              f.kupon_kodu ||
              "https://media.giphy.com/media/3o7TKSjRrfIPjeiQQo/giphy.gif";

            // Kontrol: Kullanıcıda bu link var mı?
            const isOwned = ownedAvatars.includes(imgLink);

            let action = `onclick="ModumApp.openAvatarPreview('${f.id}', '${f.title}', ${f.costXP}, '${imgLink}', ${isOwned})"`;
            let btnText = isOwned
              ? `<span style="color:#4ade80;">SAHİPSİN ✅</span>`
              : `<span style="color:#fbbf24;">${f.costXP} XP</span>`;
            let opacity = isOwned ? "0.7" : "1";

            avatarHtml += `
<div class="mdm-frame-card" style="opacity:${opacity}; cursor:pointer;" ${action}>
<div style="height:80px; display:flex; align-items:center; justify-content:center; margin-bottom:5px;">
<img src="${imgLink}" style="width:70px; height:70px; border-radius:50%; object-fit:cover; border:2px solid #fff; box-shadow:0 0 10px rgba(255,255,255,0.2);">
  </div>
<div style="font-size:11px; color:#fff; font-weight:bold; text-align:center; overflow:hidden; height:26px;">${f.title}</div>
<div style="text-align:center; margin-top:5px; font-weight:bold; font-size:11px;">${btnText}</div>
  </div>`;
          });
          finalHtml += `<div class="mdm-cosmetic-area" style="margin-top:0; border:1px solid #7e22ce;"><div class="mdm-cosmetic-title"><i class="fas fa-user-astronaut"></i> HAREKETLİ AVATARLAR</div><div class="mdm-frame-showcase" style="flex-wrap:wrap; justify-content:center; gap:10px;">${avatarHtml}</div></div>`;
        }

        // B) PROFİL ÇERÇEVELERİ
        const frameItems = items.filter(
          (i) =>
            i.title.toLowerCase().includes("çerçeve") ||
            i.type === "avatar_frame",
        );

        if (frameItems.length > 0) {
          let frameHtml = "";
          frameItems.forEach((f) => {
            const code = f.code || f.kupon_kodu;
            const isOwned = ownedFrames.includes(code);

            // 🔥 DÜZELTME BURADA: Tıklayınca direkt alma, "openFramePurchaseModal" ile ön izle!
            let action = isOwned
              ? ""
              : `onclick="ModumApp.openFramePurchaseModal('${f.id}', '${f.title}', ${f.costXP}, '${code}')"`;

            let btnText = isOwned
              ? `<span style="color:#4ade80;">SAHİPSİN ✅</span>`
              : `<span style="color:#fbbf24;">${f.costXP} XP</span>`;

            // Çerçeve Gösterim Mantığı (Link mi Class mı?)
            let frameDiv = "";
            if (code && code.includes("http")) {
              // Giphy Linki
              frameDiv = `<div class="mdm-avatar-frame" style="top:-5px; left:-5px; right:-5px; bottom:-5px; border:none; background-image: url('${code}'); background-size: cover; background-position: center;"></div>`;
            } else {
              // CSS Class
              frameDiv = `<div class="mdm-avatar-frame ${code}" style="top:-5px; left:-5px; right:-5px; bottom:-5px; border-width:4px;"></div>`;
            }

            frameHtml += `
<div class="mdm-frame-card" style="${
              isOwned ? "opacity:0.6" : ""
            }; cursor:pointer;" ${action}>
<div style="height:80px; display:flex; align-items:center; justify-content:center;">
<div class="mdm-preview-avatar">
${frameDiv} 
👤
  </div>
  </div>
<div style="font-size:11px; color:#fff; font-weight:bold; text-align:center; overflow:hidden; height:24px;">${
              f.title
            }</div>
<div style="text-align:center; font-size:11px; font-weight:bold;">${btnText}</div>
  </div>`;
          });

          finalHtml += `<div class="mdm-cosmetic-area" style="margin-top:20px; border:1px solid #3b82f6;"><div class="mdm-cosmetic-title" style="color:#60a5fa;"><i class="far fa-id-badge"></i> PROFİL ÇERÇEVELERİ</div><div class="mdm-frame-showcase" style="flex-wrap:wrap; justify-content:center; gap:10px;">${frameHtml}</div></div>`;
        }
      }
      container.innerHTML =
        finalHtml ||
        '<div style="text-align:center;padding:20px;">Ürün bulunamadı.</div>';
    };

    // --- 🔥 YENİ: ÇERÇEVE SATIN ALMA POP-UP'I (DÜZELTİLMİŞ FİNAL) ---
    window.ModumApp.openFramePurchaseModal = function (
      id,
      title,
      cost,
      frameClass,
    ) {
      // Eski modal varsa temizle
      var old = document.getElementById("mdm-buy-frame-modal");
      if (old) old.remove();

      // Kullanıcının puanı
      var myPuan = parseInt(APP_STATE.user.puan) || 0;
      var canAfford = myPuan >= cost;

      // Görsel Hazırlığı (Link mi Class mı?)
      var frameHtml = "";
      if (frameClass.includes("http")) {
        // Giphy Linki
        frameHtml = `<div class="mdm-avatar-frame" style="top:-5px; left:-5px; right:-5px; bottom:-5px; border:none; background-image: url('${frameClass}'); background-size: cover; background-position: center;"></div>`;
      } else {
        // CSS Sınıfı
        frameHtml = `<div class="mdm-avatar-frame ${frameClass}" style="top:-5px; left:-5px; right:-5px; bottom:-5px; border-width:4px;"></div>`;
      }

      // 🔥 KRİTİK DÜZELTME: Başlık içindeki tırnak işaretlerini temizle (JavaScipt'i kırmasın)
      var safeTitle = title.replace(/'/g, "\\'").replace(/"/g, "&quot;");

      // Buton Durumu
      var btnHtml = "";
      if (canAfford) {
        // buyItem fonksiyonuna 3 parametre gönderiyoruz: ID, Başlık, Fiyat
        btnHtml = `<button onclick="ModumApp.buyItem('${id}', '${safeTitle}', ${cost}); document.getElementById('mdm-buy-frame-modal').remove();" 
style="background:#10b981; color:white; border:none; padding:12px; width:100%; border-radius:12px; font-weight:bold; cursor:pointer; font-size:14px; box-shadow:0 4px 15px rgba(16,185,129,0.3); display:flex; align-items:center; justify-content:center; gap:8px;">
SATIN AL (-${cost} XP) <i class="fas fa-check-circle"></i>
  </button>`;
      } else {
        btnHtml = `<button disabled style="background:#334155; color:#94a3b8; border:none; padding:12px; width:100%; border-radius:12px; font-weight:bold; cursor:not-allowed;">
YETERSİZ PUAN (Gereken: ${cost})
  </button>`;
      }

      var html = `
<div id="mdm-buy-frame-modal" class="mdm-modal active" style="display:flex; z-index:2147483647; align-items:center; justify-content:center;">
<div class="mdm-modal-content" style="width:90%; max-width:320px; text-align:center; padding:30px; border-radius:24px; background:#1e293b; border:1px solid #334155; position:relative; box-shadow:0 20px 50px rgba(0,0,0,0.5);">

<div onclick="document.getElementById('mdm-buy-frame-modal').remove()" style="position:absolute; top:15px; right:15px; color:#64748b; cursor:pointer; font-size:24px;">×</div>

<div style="font-size:10px; color:#fbbf24; font-weight:bold; text-transform:uppercase; letter-spacing:1px; margin-bottom:15px;">KOZMETİK MAĞAZASI</div>

<div style="width:100px; height:100px; margin:0 auto 20px; position:relative; display:flex; align-items:center; justify-content:center;">
${frameHtml}
<div style="width:100%; height:100%; background:#0f172a; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:40px;">👤</div>
  </div>

<h3 style="color:#fff; margin:0 0 5px 0; font-size:18px;">${title}</h3>
<p style="color:#94a3b8; font-size:12px; line-height:1.5; margin-bottom:20px;">
Bu özel çerçeve ile profilini özelleştir ve diğer üyelerden farklı görün!
  </p>

<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:20px; font-size:13px; color:#e2e8f0;">
Mevcut Puanın: <b style="color:#fff">${myPuan} XP</b>
  </div>

${btnHtml}

  </div>
  </div>`;

      var div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);
    };

    // --- 3. ÖN İZLEME MODALI ---
    window.ModumApp.openAvatarPreview = function (
      id,
      title,
      cost,
      imgLink,
      isOwned,
    ) {
      var old = document.getElementById("mdm-avatar-preview");
      if (old) old.remove();

      var btnHtml = "";
      if (isOwned) {
        btnHtml = `<button onclick="document.getElementById('mdm-avatar-preview').remove(); ModumApp.openEditProfile();" style="background:#10b981; color:white; border:none; padding:12px; width:100%; border-radius:10px; font-weight:bold; cursor:pointer;">ŞİMDİ KULLAN (PROFİLE GİT)</button>`;
      } else {
        btnHtml = `<button onclick="ModumApp.buyItem('${id}', '${title}', ${cost}); document.getElementById('mdm-avatar-preview').remove();" style="background:linear-gradient(135deg, #f09433, #dc2743); color:white; border:none; padding:12px; width:100%; border-radius:10px; font-weight:bold; cursor:pointer; box-shadow:0 4px 15px rgba(220, 39, 67, 0.4);">SATIN AL (-${cost} XP)</button>`;
      }

      var html = `<div id="mdm-avatar-preview" class="mdm-modal active" style="z-index:999999; display:flex; align-items:center; justify-content:center;"><div class="mdm-modal-content" style="width:90%; max-width:350px; background:#1e293b; border:1px solid #334155; border-radius:20px; padding:30px; text-align:center; position:relative;"><div onclick="document.getElementById('mdm-avatar-preview').remove()" style="position:absolute; top:15px; right:15px; color:#64748b; font-size:24px; cursor:pointer;">×</div><div style="font-size:10px; color:#f472b6; font-weight:bold; letter-spacing:1px; margin-bottom:20px;">AVATAR ÖN İZLEME</div><div style="width:120px; height:120px; border-radius:50%; border:4px solid #fff; margin:0 auto 20px; overflow:hidden; box-shadow:0 0 30px rgba(0,0,0,0.5); background:#000;"><img src="${imgLink}" style="width:100%; height:100%; object-fit:cover;"></div><h3 style="color:#fff; margin:0 0 10px 0;">${title}</h3><p style="color:#94a3b8; font-size:12px; margin-bottom:25px; line-height:1.5;">Bu avatarı satın aldıktan sonra <b>Profil > Düzenle</b> kısmından profil fotoğrafı olarak ayarlayabilirsin.</p>${btnHtml}</div></div>`;
      document.body.insertAdjacentHTML("beforeend", html);
    };

    // --- 4. PROFİL DÜZENLEME (ÖZEL KOLEKSİYON ALANI EKLENDİ) ---
    var originalOpenEdit = window.ModumApp.openEditProfile;
    window.ModumApp.openEditProfile = function () {
      // Önce orijinal pencereyi aç (İskeleti oluştursun)
      if (originalOpenEdit) originalOpenEdit();

      setTimeout(function () {
        var user = APP_STATE.user;
        var purchasedAvatars = user.ownedAvatars || [];

        var modalContent = document.querySelector(
          "#mdm-edit-modal .mdm-modal-content",
        );
        if (modalContent) {
          var listContainer = modalContent.querySelector(
            "div[style*='overflow-y:auto']",
          );
          if (listContainer) {
            listContainer.innerHTML = ""; // İçini temizle

            // --- A. ✨ ÖZEL KOLEKSİYONUM (Satın Alınanlar) ---
            if (purchasedAvatars.length > 0) {
              var myCollectionHtml = `<div style="width:100%; font-size:12px; color:#fbbf24; font-weight:800; margin-bottom:8px; margin-top:5px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px;">✨ ÖZEL KOLEKSİYONUM (GIF)</div>`;

              purchasedAvatars.forEach((url) => {
                myCollectionHtml += `<img src="${url}" onclick="document.getElementById('new-avatar-input').value='${url}'; highlightAvatar(this);" style="width:55px; height:55px; border-radius:50%; cursor:pointer; border:2px solid #fbbf24; object-fit:cover; background:#000; margin-right:8px; margin-bottom:8px; box-shadow:0 0 10px rgba(251, 191, 36, 0.3);">`;
              });

              listContainer.innerHTML += myCollectionHtml;
            } else {
              listContainer.innerHTML += `<div style="width:100%; font-size:11px; color:#64748b; margin-bottom:10px; font-style:italic;">Henüz özel avatar satın almadın.</div>`;
            }

            // --- B. STANDART GALERİ (Mevcutlar) ---
            var stdHtml = `<div style="width:100%; font-size:11px; color:#94a3b8; font-weight:bold; margin-bottom:8px; margin-top:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px;">GENEL GALERİ</div>`;
            if (typeof DEFAULT_AVATARS !== "undefined") {
              DEFAULT_AVATARS.forEach((url) => {
                stdHtml += `<img src="${url}" onclick="document.getElementById('new-avatar-input').value='${url}'; highlightAvatar(this);" style="width:50px; height:50px; border-radius:50%; cursor:pointer; border:2px solid transparent; object-fit:cover; margin-right:5px; margin-bottom:5px;">`;
              });
            }
            listContainer.innerHTML += stdHtml;

            // --- C. SEÇİM EFEKTİ FONKSİYONU ---
            window.highlightAvatar = function (el) {
              el.parentElement.querySelectorAll("img").forEach((i) => {
                // Özel olanların sarı kenarlığını bozma, diğerlerini temizle
                if (i.style.borderColor !== "rgb(251, 191, 36)")
                  i.style.border = "2px solid transparent";
                i.style.transform = "scale(1)";
              });
              el.style.border = "3px solid #10b981"; // Seçilince Yeşil
              el.style.transform = "scale(1.1)";
            };
          }
        }
      }, 100);
    };
  }
  /* ======================================================
   👑 SEVİYE AVANTAJLARI BUTONU (EK YAMA)
   ====================================================== */
  (function () {
    // 1. Tablo HTML'ini Sayfaya Gömer
    var perkModalHTML = `
<div id="mdm-level-perks-modal" class="mdm-modal" style="z-index:999999;">
<div class="mdm-modal-content" style="max-width:600px; background:#0f172a; border:1px solid #334155;">
<div class="mdm-modal-header" style="background:linear-gradient(90deg, #1e293b, #0f172a);">
<h3 style="margin:0; color:#fff; display:flex; align-items:center; gap:10px;">
<i class="fas fa-crown" style="color:#facc15;"></i> Rütbe Avantajları
  </h3>
<div class="mdm-modal-close" onclick="document.getElementById('mdm-level-perks-modal').classList.remove('active')">×</div>
  </div>

<div style="padding:20px; overflow-y:auto; max-height:70vh;">
<p style="color:#94a3b8; font-size:13px; margin-bottom:20px; text-align:center;">
Seviye atladıkça ModumNet'te kazancın katlanarak artar. İşte avantaj tablosu:
  </p>

<div style="overflow-x:auto;">
<table style="width:100%; border-collapse:collapse; color:#fff; font-size:12px; text-align:center;">
<thead>
<tr style="background:#1e293b; color:#94a3b8;">
<th style="padding:10px; border:1px solid #334155;">Özellik</th>
<th style="padding:10px; border:1px solid #334155; color:#10b981;">🌱 Çaylak</th>
<th style="padding:10px; border:1px solid #334155; color:#8b5cf6;">⚔️ Usta</th>
<th style="padding:10px; border:1px solid #334155; color:#facc15;">🦁 Şampiyon</th>
<th style="padding:10px; border:1px solid #334155; color:#ef4444;">👑 Efsane</th>
  </tr>
  </thead>
<tbody>
<tr>
<td style="padding:10px; border:1px solid #334155; text-align:left;">🎟️ <b>Çekiliş Hakkı</b><br><span style="font-size:10px; color:#64748b;">(Katıl butonuna basınca)</span></td>
<td style="padding:10px; border:1px solid #334155;">1 Bilet</td>
<td style="padding:10px; border:1px solid #334155; font-weight:bold; color:#8b5cf6;">2 Bilet</td>
<td style="padding:10px; border:1px solid #334155; font-weight:bold; color:#facc15;">3 Bilet</td>
<td style="padding:10px; border:1px solid #334155; font-weight:bold; color:#ef4444;">5 Bilet</td>
  </tr>
<tr>
<td style="padding:10px; border:1px solid #334155; text-align:left;">📅 <b>Günlük Hak</b><br><span style="font-size:10px; color:#64748b;">(Her çekiliş için)</span></td>
<td style="padding:10px; border:1px solid #334155;">+1 Hak</td>
<td style="padding:10px; border:1px solid #334155; font-weight:bold; color:#8b5cf6;">+2 Hak</td>
<td style="padding:10px; border:1px solid #334155; font-weight:bold; color:#facc15;">+3 Hak</td>
<td style="padding:10px; border:1px solid #334155; font-weight:bold; color:#ef4444;">+5 Hak</td>
  </tr>
<tr>
<td style="padding:10px; border:1px solid #334155; text-align:left;">🎁 <b>Sürpriz Kutu</b><br><span style="font-size:10px; color:#64748b;">(Günlük Limit)</span></td>
<td style="padding:10px; border:1px solid #334155;">5 Adet</td>
<td style="padding:10px; border:1px solid #334155; font-weight:bold; color:#8b5cf6;">8 Adet</td>
<td style="padding:10px; border:1px solid #334155; font-weight:bold; color:#facc15;">12 Adet</td>
<td style="padding:10px; border:1px solid #334155; font-weight:bold; color:#ef4444;">20 Adet</td>
  </tr>
<tr>
<td style="padding:10px; border:1px solid #334155; text-align:left;">⚡ <b>XP Çarpanı</b><br><span style="font-size:10px; color:#64748b;">(Tüm kazançlarda)</span></td>
<td style="padding:10px; border:1px solid #334155;">1.0x</td>
<td style="padding:10px; border:1px solid #334155; font-weight:bold; color:#8b5cf6;">1.2x</td>
<td style="padding:10px; border:1px solid #334155; font-weight:bold; color:#facc15;">1.5x</td>
<td style="padding:10px; border:1px solid #334155; font-weight:bold; color:#ef4444;">2.0x</td>
  </tr>
  </tbody>
  </table>
  </div>

<button onclick="document.getElementById('mdm-level-perks-modal').classList.remove('active')" style="width:100%; margin-top:20px; padding:12px; background:#334155; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">Anladım 👍</button>
  </div>
  </div>
  </div>`;

    document.body.insertAdjacentHTML("beforeend", perkModalHTML);

    // 2. Butonu Profil Ekranına Enjekte Etme (Sürekli kontrol eder)
    var perksInterval = setInterval(function () {
      var profileActions = document.querySelector(".mdm-profile-actions");

      // Eğer profil butonu grubu varsa ve bizim buton henüz eklenmediyse
      if (profileActions && !document.getElementById("btn-level-perks")) {
        var btn = document.createElement("button");
        btn.id = "btn-level-perks";
        btn.onclick = function () {
          document
            .getElementById("mdm-level-perks-modal")
            .classList.add("active");
        };

        // Stil
        Object.assign(btn.style, {
          background: "rgba(251, 191, 36, 0.1)", // Altın sarımsı transparan
          color: "#fbbf24",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          padding: "6px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: "bold",
          marginLeft: "10px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        });

        btn.innerHTML = '<i class="fas fa-crown"></i>Seviye Avantajları';

        // Butonu ekle
        profileActions.appendChild(btn);
      }
    }, 100);
  })();
  // --- BENİ UNUTMA (TAB BAŞLIĞI) ---
  (function () {
    var originalTitle = document.title;
    var blinkInterval;

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        var count = 0;
        blinkInterval = setInterval(function () {
          document.title =
            count % 2 === 0 ? "🎁 1 Yeni Hediyen Var!" : "Kaçırma! ⏳";
          count++;
        }, 2000);
      } else {
        clearInterval(blinkInterval);
        document.title = originalTitle;
      }
    });
  })();
  /* ======================================================
   🎯 AKILLI HEDEF ÇUBUĞU (SMART GOAL BAR) - V2
   XP ve Sipariş Sayısını analiz eder, kullanıcıyı yönlendirir.
   ====================================================== */
  (function () {
    // 1. AYARLAR: Rütbe Geçiş Kuralları (Backend ile uyumlu olmalı)
    var RANK_RULES = {
      Çaylak: { next: "Usta", xp: 2500, order: 1, color: "#8b5cf6" }, // Mora geçer
      Usta: { next: "Şampiyon", xp: 7500, order: 2, color: "#f59e0b" }, // Sarıya geçer
      Şampiyon: { next: "Efsane", xp: 15000, order: 5, color: "#ef4444" }, // Kırmızıya geçer
      Efsane: { next: null }, // Son seviye
    };

    // 2. CSS STİLLERİ (Sayfaya Enjekte Edilir)
    var style = document.createElement("style");
    style.innerHTML = `
#mdm-goal-bar {
background: linear-gradient(90deg, #0f172a, #1e293b);
border-bottom: 1px solid #334155;
padding: 10px 15px;
display: flex;
align-items: center;
justify-content: space-between;
width: 100%;
box-sizing: border-box;
position: relative;
z-index: 99;
box-shadow: 0 4px 10px rgba(0,0,0,0.2);
animation: slideDown 0.5s ease-out;
}
.mdm-goal-info { display: flex; flex-direction: column; }
.mdm-goal-title { color: #fff; font-weight: 800; font-size: 13px; margin-bottom: 2px; }
.mdm-goal-desc { color: #94a3b8; font-size: 11px; }

.mdm-goal-btn {
background: #10b981;
color: white;
border: none;
padding: 6px 12px;
border-radius: 50px;
font-size: 11px;
font-weight: bold;
cursor: pointer;
text-transform: uppercase;
animation: pulse 2s infinite;
white-space: nowrap;
margin-left: 10px;
text-decoration: none;
display: inline-block;
}

/* İlerleme Çubuğu Arkaplanı */
.mdm-goal-progress-bg {
position: absolute; bottom: 0; left: 0; height: 3px; background: rgba(255,255,255,0.1); width: 100%;
}
.mdm-goal-progress-fill {
height: 100%; background: #10b981; width: 0%; transition: width 1s ease;
}

@keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* MOBİL UYUM */
@media (max-width: 768px) {
#mdm-goal-bar { flex-direction: row; padding: 8px 12px; }
.mdm-goal-title { font-size: 12px; }
.mdm-goal-desc { font-size: 10px; line-height: 1.2; }
.mdm-goal-btn { padding: 5px 10px; font-size: 10px; }
}
`;
    document.head.appendChild(style);

    // 3. SİSTEMİ BAŞLATAN FONKSİYON
    function initGoalBar() {
      // Ana kapsayıcıyı bul (faprika.js içindeki main wrapper)
      var wrapper = document.querySelector(".mdm-content-wrapper");

      // Eğer wrapper yoksa veya kullanıcı giriş yapmamışsa çalışma
      if (
        !wrapper ||
        !window.APP_STATE ||
        !window.APP_STATE.user ||
        !window.APP_STATE.user.email
      ) {
        var oldBar = document.getElementById("mdm-goal-bar");
        if (oldBar) oldBar.remove(); // Giriş yapmamışsa barı kaldır
        return;
      }

      var user = window.APP_STATE.user;
      var currentLevel = user.seviye || "Çaylak";
      var nextData = RANK_RULES[currentLevel];

      // Zaten Efsane ise barı gösterme (Veya "Zirvedesin" yazdırabiliriz)
      if (!nextData || !nextData.next) {
        var oldBar = document.getElementById("mdm-goal-bar");
        if (oldBar)
          oldBar.innerHTML = `<div style="width:100%;text-align:center;color:#fbbf24;font-weight:bold;">👑 ZİRVEDESİN EFSANE!</div>`;
        return;
      }

      // --- HESAPLAMALAR ---
      var currentXP = parseInt(user.puan) || 0;
      // Sipariş sayısını faprika.js'deki cache'den veya veritabanından alıyoruz
      // (Not: faprika.js user objesinde siparisSayisi'ni tutmalı, yoksa 0 kabul ederiz)
      var currentOrders =
        parseInt(user.siparisSayisi) || parseInt(user.siparissayisi) || 0;

      var neededXP = nextData.xp - currentXP;
      var neededOrders = nextData.order - currentOrders;

      // Eksiye düşmesin
      if (neededXP < 0) neededXP = 0;
      if (neededOrders < 0) neededOrders = 0;

      // --- SENARYO ANALİZİ ---
      var title = "";
      var desc = "";
      var btnText = "";
      var btnAction = "";
      var progressPercent = 0;

      // Durum 1: Hem XP Hem Sipariş Eksik
      if (neededXP > 0 && neededOrders > 0) {
        title = `${nextData.next} Olmak İçin Hedefin:`;
        desc = `<span style="color:#facc15">${neededXP} XP</span> ve <span style="color:#f472b6">${neededOrders} Sipariş</span> daha gerekli.`;
        btnText = "GÖREVLERİ YAP";
        btnAction = "ModumApp.switchTab('tasks')";
        // İlerleme: XP'nin yüzdesini alalım
        progressPercent = (currentXP / nextData.xp) * 100;
      }
      // Durum 2: XP Tamam, Sadece Sipariş Eksik (KRİTİK NOKTA 🛍️)
      else if (neededXP <= 0 && neededOrders > 0) {
        title = `🔥 ${nextData.next} Olmaya Çok Yakınsın!`;
        desc = `Puanın hazır! Sadece <b style="color:#fff; text-decoration:underline;">${neededOrders} Sipariş</b> ver, anında rütbe atla!`;
        btnText = "ALIŞVERİŞ YAP";
        btnAction = "window.location.href='/tum-urunler'"; // Mağazaya yönlendir
        progressPercent = 95; // Neredeyse bitti hissi
      }
      // Durum 3: Sipariş Tamam, Sadece XP Eksik
      else if (neededXP > 0 && neededOrders <= 0) {
        title = `📦 Sipariş Hedefi Tamam!`;
        desc = `Sadece <b style="color:#facc15">${neededXP} XP</b> kaldı. Görev yaparak tamamla.`;
        btnText = "PUAN KAZAN";
        btnAction = "ModumApp.switchTab('tasks')";
        progressPercent = (currentXP / nextData.xp) * 100;
      }

      // --- HTML OLUŞTURMA ---
      var barHTML = `
<div class="mdm-goal-info">
<div class="mdm-goal-title">${title}</div>
<div class="mdm-goal-desc">${desc}</div>
  </div>
<button onclick="${btnAction}" class="mdm-goal-btn">${btnText}</button>
<div class="mdm-goal-progress-bg"><div class="mdm-goal-progress-fill" style="width:${progressPercent}%"></div></div>
`;

      // --- EKRANA BASMA (VARSA GÜNCELLE, YOKSA EKLE) ---
      var existingBar = document.getElementById("mdm-goal-bar");

      if (existingBar) {
        existingBar.innerHTML = barHTML;
      } else {
        var barDiv = document.createElement("div");
        barDiv.id = "mdm-goal-bar";
        barDiv.innerHTML = barHTML;

        // İçeriğin en tepesine ekle (Hoşgeldin mesajının altına veya üstüne)
        // .mdm-content-wrapper içindeki ilk elemanın öncesine ekliyoruz
        wrapper.insertBefore(barDiv, wrapper.firstChild);
      }
    }

    // 4. OTOMATİK KONTROL (Her 3 saniyede bir veriyi kontrol edip barı günceller)
    // Bu sayede puan artınca veya sayfa değişince bar anında tepki verir.
    setInterval(initGoalBar, 3000);

    // İlk açılışta hemen çalıştır
    setTimeout(initGoalBar, 1000);
  })();

  /* ======================================================
   💎 PREMIUM UI STYLES V2 (MAĞAZA MOBİL FIX & QUEST)
   ====================================================== */
  (function () {
    var style = document.createElement("style");
    style.innerHTML = `
/* --- 🎟️ MAĞAZA: TICKET KUPON TASARIMI --- */
.mdm-premium-ticket {
display: flex;
background: #fff;
border-radius: 12px;
overflow: hidden;
position: relative;
box-shadow: 0 4px 15px rgba(0,0,0,0.1);
transition: transform 0.2s;
margin-bottom: 15px;
min-height: 100px;
border: 1px solid rgba(255,255,255,0.1);
}
.mdm-premium-ticket:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }

/* Sol Taraf */
.ticket-left {
width: 90px;
background: #1e293b;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
position: relative;
border-right: 2px dashed rgba(255,255,255,0.2);
padding: 10px;
text-align: center;
flex-shrink: 0; /* Küçülmeyi engelle */
}
.ticket-left::after, .ticket-left::before {
content: ""; position: absolute; right: -10px; width: 20px; height: 20px;
background: #0f172a; border-radius: 50%; /* Arkaplan rengiyle aynı olmalı */
}
.ticket-left::after { top: -10px; }
.ticket-left::before { bottom: -10px; }

.ticket-icon { font-size: 24px; margin-bottom: 5px; }
.ticket-cost { color: #facc15; font-weight: 900; font-size: 14px; }
.ticket-lvl { font-size: 8px; text-transform: uppercase; color: #94a3b8; margin-top: 5px; }

/* Sağ Taraf */
.ticket-right {
flex: 1;
padding: 12px;
display: flex;
flex-direction: column;
justify-content: center;
background: linear-gradient(135deg, #1e293b, #0f172a);
}
.ticket-title { color: #fff; font-weight: 800; font-size: 13px; line-height: 1.3; margin-bottom: 4px; }
.ticket-desc { color: #94a3b8; font-size: 10px; line-height: 1.4; margin-bottom: 8px; }
.ticket-btn { width: 100%; padding: 8px; border: none; border-radius: 6px; font-weight: 800; font-size: 11px; cursor: pointer; text-transform: uppercase; margin-top: auto; }

/* Renk Temaları */
.theme-caylak .ticket-left { background: #064e3b; }
.theme-usta .ticket-left { background: #4c1d95; }
.theme-sampiyon .ticket-left { background: #78350f; }
.theme-efsane .ticket-left { background: #7f1d1d; }

/* --- 🔥 MOBİL DÜZELTMESİ (STORE GRID) --- */
.mdm-store-grid {
display: grid;
grid-template-columns: repeat(4, 1fr); /* Masaüstü 4'lü */
gap: 15px;
}
@media (max-width: 1024px) { .mdm-store-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { 
.mdm-store-grid { grid-template-columns: 1fr !important; } /* Mobil TEK SÜTUN */
.ticket-left { width: 80px; } /* Mobilde sol tarafı biraz daralt */
.ticket-title { font-size: 14px; } /* Başlığı büyüt */
}

/* --- 📜 GÖREVLER: QUEST CARD V2 (NEON & GLASS) --- */
.mdm-quest-card {
background: rgba(30, 41, 59, 0.6); /* Transparan */
backdrop-filter: blur(10px); /* Buzlu Cam */
border: 1px solid rgba(255, 255, 255, 0.08);
border-left: 4px solid #3b82f6; /* Mavi Çizgi */
border-radius: 12px;
margin-bottom: 12px;
position: relative;
overflow: hidden;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
cursor: pointer;
}
.mdm-quest-card:hover {
transform: translateY(-2px);
box-shadow: 0 10px 30px -10px rgba(59, 130, 246, 0.2);
border-color: rgba(59, 130, 246, 0.3);
}

.mdm-quest-card.completed {
border-left-color: #10b981; /* Yeşil Çizgi */
background: rgba(6, 78, 59, 0.4);
}

/* Kart Başlığı */
.quest-header {
padding: 15px;
display: flex;
align-items: center;
gap: 15px;
}

.quest-icon-box {
width: 44px; height: 44px;
background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
border-radius: 10px;
display: flex; align-items: center; justify-content: center;
font-size: 22px;
border: 1px solid rgba(255,255,255,0.1);
flex-shrink: 0;
}

.quest-info { flex: 1; }
.quest-title { color: #fff; font-weight: 700; font-size: 14px; margin-bottom: 4px; }
.quest-reward { 
display: inline-flex; align-items: center; gap: 5px;
font-size: 11px; color: #fbbf24; font-weight: 800; 
background: rgba(251, 191, 36, 0.1); padding: 2px 8px; border-radius: 4px;
}

/* Ok İşareti */
.quest-arrow {
color: #64748b; font-size: 14px; transition: 0.3s;
width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
background: rgba(255,255,255,0.05); border-radius: 50%;
}
.mdm-quest-card.open .quest-arrow { transform: rotate(180deg); background: #3b82f6; color: white; }

/* İlerleme Çubuğu */
.quest-progress-track {
height: 3px; background: rgba(255,255,255,0.05); width: 100%;
position: absolute; bottom: 0; left: 0;
}
.quest-progress-fill {
height: 100%; background: #3b82f6; width: 0%; transition: width 0.5s ease;
box-shadow: 0 0 10px #3b82f6;
}
.mdm-quest-card.completed .quest-progress-fill { background: #10b981; box-shadow: 0 0 10px #10b981; }

/* Açılır Alan (Gövde) */
.quest-body {
background: rgba(15, 23, 42, 0.6);
border-top: 1px solid rgba(255,255,255,0.05);
padding: 0;
max-height: 0;
overflow: hidden;
transition: max-height 0.4s ease, opacity 0.4s ease;
opacity: 0;
}
.mdm-quest-card.open .quest-body {
max-height: 500px; /* Yeterince büyük */
opacity: 1;
padding-bottom: 15px;
}

/* Adım Satırları */
.quest-step-row {
display: flex; align-items: center; justify-content: space-between;
padding: 12px 16px;
border-bottom: 1px dashed rgba(255,255,255,0.1);
}
.quest-step-row:last-child { border-bottom: none; }

.step-text { font-size: 12px; color: #cbd5e1; flex: 1; padding-right: 10px; }

/* Buton Tasarımı */
.quest-btn-action {
background: linear-gradient(135deg, #3b82f6, #2563eb); 
color: white; border: none; 
padding: 8px 16px; border-radius: 8px; 
font-weight: 700; font-size: 11px; cursor: pointer;
box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
transition: 0.2s; white-space: nowrap;
}
.quest-btn-action:hover { transform: translateY(-2px); filter: brightness(1.1); }
`;
    document.head.appendChild(style);
  })();
  (function () {
    var style = document.createElement("style");
    style.innerHTML = `
/* --- 🎬 SİNEMATİK VİTRİN KARTI (NETFLIX STYLE) --- */
.mdm-raffle-card {
background: #0f172a;
border-radius: 16px;
overflow: hidden;
position: relative;
/* Dikey Oran (Poster Gibi) */
aspect-ratio: 9/13; 
box-shadow: 0 10px 30px rgba(0,0,0,0.5);
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
border: 1px solid rgba(255,255,255,0.1);
display: flex;
flex-direction: column;
}

.mdm-raffle-card:hover {
transform: scale(1.03);
box-shadow: 0 20px 50px rgba(139, 92, 246, 0.4);
border-color: #8b5cf6;
z-index: 10;
}

/* Resim (Tüm alanı kaplasın) */
.mdm-rc-image {
width: 100%;
height: 100%;
position: absolute;
top: 0; left: 0;
z-index: 0;
}
.mdm-rc-image img {
width: 100%;
height: 100%;
object-fit: cover; /* Resmi keserek tam oturtur */
transition: transform 0.5s;
}
.mdm-raffle-card:hover .mdm-rc-image img {
transform: scale(1.1);
}

/* Gradyan Katmanı (Yazıların okunması için) */
.mdm-rc-overlay {
position: absolute;
bottom: 0; left: 0; width: 100%;
background: linear-gradient(to top, #0f172a 10%, rgba(15, 23, 42, 0.9) 60%, transparent 100%);
padding: 15px;
z-index: 2;
display: flex;
flex-direction: column;
gap: 8px;
}

/* Başlık ve Ödül */
.mdm-rc-title {
font-size: 16px; font-weight: 900; color: #fff;
text-shadow: 0 2px 10px rgba(0,0,0,0.8);
line-height: 1.2;
margin: 0;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
}

.mdm-rc-reward {
font-size: 12px; color: #fbbf24; font-weight: 700;
margin-bottom: 5px;
}

/* Sayaç (Kartın içinde daha kompakt) */
.mdm-timer-minimal {
background: rgba(255,255,255,0.1);
border-radius: 6px;
padding: 5px;
margin-bottom: 10px;
backdrop-filter: blur(5px);
}
.mdm-tm-val { font-size: 14px; }
.mdm-tm-lbl { font-size: 8px; }


/* --- BUTON IZGARASI (2 Satırlı Premium Düzen) --- */
.mdm-action-grid { 
display: grid; 
/* Üst satır: Bilgi butonu dar (50px), Bildirim butonu kalanı kaplasın (1fr) */
grid-template-columns: 50px 1fr; 
gap: 8px; 
margin-top: auto; 
}

/* 3. sıradaki eleman (yani KATIL butonu) alt satıra geçsin ve tam yayılsın */
.mdm-action-grid > button:last-child,
.mdm-action-grid > .mdm-btn-v2:last-child {
grid-column: span 2; /* İki sütunu da kapla */
width: 100%;
}

/* Etiketler (Sol Üst) */
.mdm-rc-badge {
position: absolute; top: 10px; left: 10px; z-index: 5;
padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 800;
box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}
/* Sadece masaüstü ekranlar için (992px ve üzeri) */
@media (min-width: 992px) {
.firsat-karti-gorsel-alani img {
/* Görseli biraz aşağı itmek için margin veya padding */
margin-top: 15px; 
/* Veya görselin boyutunu biraz küçültüp ortalamak istersen: */
width: 80%; 
margin-left: auto;
margin-right: auto;
}
}
/* Masaüstü ekranlarda görseli güzelleştirme */
@media (min-width: 992px) {
/* Bu sınıf ismini kendi görselinin olduğu div ile değiştirebilirsin */
.firsat-karti-gorsel-alani img, 
.card-img-top { 
width: 80%; /* Görsel çok yayılmasın, %80 genişlikte dursun */
margin: 20px auto; /* Yukarıdan 20px boşluk bırak, sağdan soldan ortala */
display: block; /* Ortalamanın çalışması için gerekli */
}
}
/* --- 🚨 SON 1 GÜN KIRMIZI ALARM EFEKTİ (Burası aynı kalsın) --- */
.mdm-card-urgent {
border: 2px solid #ef4444 !important;
box-shadow: 0 0 15px rgba(239, 68, 68, 0.6) !important;
animation: mdmPulseRed 1.5s infinite alternate;
}

@keyframes mdmPulseRed {
from { box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); border-color: #ef4444; }
to { box-shadow: 0 0 25px rgba(239, 68, 68, 0.9); border-color: #b91c1c; }
}

/* --- 🖥️ MASAÜSTÜ GÖRÜNÜM DÜZELTMESİ (YENİ VERSİYON) --- */
@media (min-width: 992px) {
/* Resim Alanı: Yüksekliği biraz artıralım ki resim rahatlasın */
.mdm-raffle-card .mdm-rc-image {
height: 220px !important; /* Yüksekliği artırdık */
background: #0f172a; /* Arkası koyu kalsın */
}

/* Resim: Sığdırmak yerine DOLDUR (Cover) ama ortala */
.mdm-raffle-card .mdm-rc-image img {
object-fit: cover !important; /* Kutuyu tam doldur */
object-position: center center !important; /* Tam ortadan hizala */
width: 100% !important;
height: 100% !important;
padding: 0 !important; /* Boşlukları kaldır */
background: transparent !important;
transform: scale(1) !important;
}

/* Hover Efekti: Hafif yaklaşsın */
.mdm-raffle-card:hover .mdm-rc-image img {
transform: scale(1.1) !important;
}
}
`;
    document.head.appendChild(style);
  })();
  /* ======================================================
   🧠 MODUMNET SMART NOTIFIER (AKILLI BİLDİRİM MOTORU)
   Müşteriyi Alışverişe ve Görevlere Yönlendiren Beyin
   ====================================================== */
  (function () {
    // Ayarlar
    const NOTIFY_INTERVAL = 3 * 60 * 1000; // 3 Dakikada bir (Ms cinsinden)
    const NOTIFY_KEY = "mdm_last_smart_notify"; // Tarayıcı hafıza anahtarı

    // Motoru Başlat
    setInterval(runSmartAnalysis, 15000); // Her 15 saniyede bir "Zamanı geldi mi?" diye kontrol et

    async function runSmartAnalysis() {
      // 1. Temel Kontroller
      if (
        !window.APP_STATE ||
        !window.APP_STATE.user ||
        !window.APP_STATE.user.email
      )
        return; // Giriş yapmamışsa sus

      // 2. Zaman Kontrolü (Sık boğaz etmemek için)
      const lastTime = parseInt(localStorage.getItem(NOTIFY_KEY)) || 0;
      const now = Date.now();
      if (now - lastTime < NOTIFY_INTERVAL) return; // Henüz vakit gelmedi

      // 3. Verileri Topla (Mağaza ve Görevler Hafızada Yoksa Çek)
      // Store Context yoksa çekelim
      if (!APP_STATE.storeContext || !APP_STATE.storeContext.items) {
        try {
          const resStore = await window.fetchApi("get_store_items");
          if (resStore.success) {
            APP_STATE.storeContext = { items: resStore.items, purchased: [] }; // Basit cache
          }
        } catch (e) {
          return;
        }
      }

      // Görev İlerlemesi yoksa çekelim (Hafif bir istek)
      let incompleteTasks = [];
      try {
        const resTasks = await window.fetchApi("get_tasks"); // Tüm görev tanımları
        const resProg = await window.fetchApi("get_user_task_progress", {
          email: APP_STATE.user.email,
        }); // İlerlemeler

        if (resTasks.success && resTasks.tasks) {
          const myProgMap = {};
          if (resProg && resProg.list) {
            resProg.list.forEach((p) => (myProgMap[p.taskId] = p.completed));
          }
          // Yapılmamış ve Aktif görevleri filtrele
          incompleteTasks = resTasks.tasks.filter(
            (t) =>
              (t.status === "active" || t.aktif === true) && !myProgMap[t.id], // Tamamlanmamış
          );
        }
      } catch (e) {}

      // 4. ANALİZ VE KARAR MOTORU 🧠
      const userPoints = parseInt(APP_STATE.user.puan) || 0;
      const storeItems = APP_STATE.storeContext.items || [];

      // Senaryoları Belirle
      let scenario = "";
      let message = "";
      let actionFn = null;

      // Rastgelelik ekleyelim ki hep aynı şeyi söylemesin
      const dice = Math.random();

      // SENARYO A: ZENGİN MÜŞTERİ (Puanı bir ürüne yetiyor) -> HARCATMA
      // Puanının yettiği en pahalı ürünü bul
      const affordableItems = storeItems.filter(
        (i) => parseInt(i.costXP) <= userPoints && parseInt(i.costXP) > 0,
      );

      if (dice < 0.4 && affordableItems.length > 0) {
        // Rastgele birini seç (Hep aynı ürünü önermesin)
        const targetItem =
          affordableItems[Math.floor(Math.random() * affordableItems.length)];
        const icon = targetItem.title.toLowerCase().includes("indirim")
          ? "🎫"
          : "🎁";

        scenario = "spend";
        message = `${icon} <b>${userPoints} XP Puanın Var!</b><br>Bunu <b>${targetItem.title}</b> almak için kullanabilirsin. İndirimi kaçırma!`;
        actionFn = function () {
          ModumApp.switchTab("store");
        };
      }

      // SENARYO B: FAKİR MÜŞTERİ (Puanı yetmiyor) -> GÖREV YAPTIRMA
      // Puanının yetmediği ama yakın olduğu bir ürünü bul
      else if (dice < 0.8 && incompleteTasks.length > 0) {
        // Hedef ürün (Puanının yetmediği en ucuz ürün)
        const dreamItems = storeItems
          .filter((i) => parseInt(i.costXP) > userPoints)
          .sort((a, b) => a.costXP - b.costXP);
        const dreamItem = dreamItems[0]; // En yakın hedef

        // Rastgele bir görev seç
        const targetTask =
          incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
        const reward =
          parseInt(targetTask.buyukodul_xp || targetTask.reward) || 50;

        if (dreamItem) {
          const needed = parseInt(dreamItem.costXP) - userPoints;
          message = `🛍️ <b>${
            dreamItem.title
          }</b> ister misin?<br>Sadece <b>${needed} XP</b> eksiğin var. <br>🎯 <b>"${
            targetTask.baslik || targetTask.title
          }"</b> görevini yap ve ${reward} XP kazan!`;
        } else {
          // Hiç hedef yoksa sadece görev öner
          message = `🚀 Puanlarını Katla!<br><b>"${
            targetTask.baslik || targetTask.title
          }"</b> görevini tamamla, anında <b>+${reward} XP</b> hesabına yatsın.`;
        }
        actionFn = function () {
          ModumApp.openTasksTab();
        };
      }

      // SENARYO C: GENEL GAZLAMA (Seviye veya Sepet)
      else {
        const nextLevels = {
          Çaylak: "Usta",
          Usta: "Şampiyon",
          Şampiyon: "Efsane",
        };
        const currentLvl = APP_STATE.user.seviye || "Çaylak";
        const nextLvl = nextLevels[currentLvl];

        if (nextLvl) {
          message = `👑 <b>Hedef: ${nextLvl} Olmak!</b><br>Rütbeni yükselterek mağazadaki kilitli <b>Özel İndirimleri</b> açabilirsin. Alışverişe devam et!`;
          actionFn = function () {
            window.location.href = "/tum-urunler";
          };
        } else {
          message = `🔥 <b>Efsane Üye!</b><br>Puanların birikti. Mağazadaki <b>Kozmetik ve Avatar</b> ürünlerine göz attın mı?`;
          actionFn = function () {
            ModumApp.switchTab("store");
          };
        }
      }

      // 5. BİLDİRİMİ GÖSTER (TOAST)
      if (message) {
        showSmartToast(message, actionFn);
        localStorage.setItem(NOTIFY_KEY, Date.now()); // Zamanı kaydet
      }
    }

    // --- ÖZEL AKILLI TOAST TASARIMI ---
    function showSmartToast(htmlMsg, onClickFn) {
      // Ses efekti (Hafif bildirim sesi)
      // const audio = new Audio('https://www.modum.tr/notification.mp3'); audio.play().catch(e=>{}); (Opsiyonel)

      const div = document.createElement("div");
      div.className = "mdm-smart-toast";
      div.innerHTML = `
<div class="mst-icon">
<img src="https://cdn-icons-png.flaticon.com/512/3602/3602145.png" alt="Bot">
  </div>
<div class="mst-content">${htmlMsg}</div>
<div class="mst-arrow"><i class="fas fa-chevron-right"></i></div>
<div class="mst-close" onclick="event.stopPropagation(); this.parentElement.remove();">×</div>
`;

      // Tıklama aksiyonu
      div.onclick = function () {
        if (onClickFn) onClickFn();
        div.remove();
      };

      // CSS Ekle (Eğer yoksa)
      if (!document.getElementById("mdm-smart-toast-style")) {
        const style = document.createElement("style");
        style.id = "mdm-smart-toast-style";
        style.innerHTML = `
.mdm-smart-toast {
position: fixed; top: 100px; right: -350px; /* Sağdan gelir */
width: 320px; background: rgba(15, 23, 42, 0.95); 
border-left: 4px solid #facc15; border-radius: 12px;
padding: 15px; display: flex; align-items: center; gap: 15px;
box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(5px);
z-index: 2147483647; cursor: pointer;
transition: right 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
font-family: 'Outfit', sans-serif;
}
.mdm-smart-toast.show { right: 20px; }
.mst-icon img { width: 40px; height: 40px; animation: bounce 2s infinite; }
.mst-content { flex: 1; color: #fff; font-size: 12px; line-height: 1.4; }
.mst-content b { color: #facc15; }
.mst-arrow { color: #94a3b8; font-size: 14px; }
.mst-close { position: absolute; top: 5px; right: 8px; color: #64748b; font-size: 16px; font-weight: bold; padding: 2px; }
.mst-close:hover { color: #ef4444; }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform: translateY(0);} 40% {transform: translateY(-5px);} 60% {transform: translateY(-3px);} }
`;
        document.head.appendChild(style);
      }

      document.body.appendChild(div);

      // Animasyonla Aç
      setTimeout(() => div.classList.add("show"), 100);

      // 10 Saniye sonra otomatik kapat
      setTimeout(() => {
        if (div && div.parentElement) {
          div.classList.remove("show");
          setTimeout(() => div.remove(), 500);
        }
      }, 10000);
    }
  })();
  /* ======================================================
   🛒 SEPET KURTARMA AJANI v2.1 (800 XP & GÜNLÜK)
   ====================================================== */
  (function () {
    // AYARLAR
    const IDLE_LIMIT_MINUTES = 20; // Müşteri 20 dk hareketsiz kalırsa çıksın (İdeal süre)
    const RECOVERY_REWARD = 800; // Vaat edilen XP

    // Sepet İkonu Sınıfı (Faprika Standartları)
    const CART_COUNT_SELECTOR =
      ".cart-qty, .cart-count, .basket-count, .header-cart-count";

    function checkCartAndTrigger() {
      // 1. Sepet Dolu mu?
      const countEl = document.querySelector(CART_COUNT_SELECTOR);
      let itemCount = 0;

      if (countEl) {
        itemCount = parseInt(countEl.innerText || countEl.textContent || "0");
      }

      // Eğer sepet boşsa veya sipariş tamamlandı sayfasındaysak çık
      if (
        itemCount <= 0 ||
        window.location.href.includes("siparis-tamamlandi")
      ) {
        localStorage.removeItem("mdm_cart_last_activity");
        return;
      }

      // 2. Zaman Kontrolü
      const now = Date.now();
      let lastActivity = localStorage.getItem("mdm_cart_last_activity");

      if (!lastActivity) {
        localStorage.setItem("mdm_cart_last_activity", now);
      } else {
        const diffMins = (now - parseInt(lastActivity)) / (1000 * 60);

        // Oturumda daha önce gösterilmediyse ve süre dolduysa
        const sessionShown = sessionStorage.getItem("mdm_recovery_shown");

        if (diffMins >= IDLE_LIMIT_MINUTES && !sessionShown) {
          showRecoveryPopup(itemCount);
        }
      }
    }

    function showRecoveryPopup(count) {
      sessionStorage.setItem("mdm_recovery_shown", "true");

      // 🔥 SİNEMATİK POP-UP HTML
      const html = `
<div id="mdm-recovery-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15, 23, 42, 0.95); z-index:9999999; display:flex; align-items:center; justify-content:center; font-family:'Outfit', sans-serif;">
<div style="background:#1e293b; border:2px solid #f59e0b; border-radius:24px; padding:30px; text-align:center; max-width:400px; width:90%; position:relative; box-shadow:0 0 60px rgba(245, 158, 11, 0.4); animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">

<div style="font-size:60px; margin-bottom:15px; filter:drop-shadow(0 0 10px rgba(255,255,255,0.5));">🛍️</div>

<h2 style="color:#fff; margin:0 0 10px 0; font-weight:900; font-size:22px; text-transform:uppercase; letter-spacing:1px;">Sepetinde Ürünler Var!</h2>

<p style="color:#cbd5e1; font-size:14px; line-height:1.6; margin-bottom:20px;">
Sepetindeki <b>${count} ürünü</b> unutma.<br>
Siparişi şimdi tamamlarsan <b>Günün Fırsatı</b> aktif olacak:
  </p>

<div style="background:linear-gradient(135deg, #451a03, #78350f); border:1px solid #f59e0b; color:#fbbf24; padding:15px; border-radius:12px; font-size:24px; font-weight:900; margin-bottom:20px; box-shadow:inset 0 0 20px rgba(0,0,0,0.5);">
+${RECOVERY_REWARD} XP BONUS
  </div>

<div style="font-size:12px; color:#94a3b8; margin-bottom:5px;">Teklifin Geçerlilik Süresi:</div>
<div id="mdm-rec-timer" style="font-size:28px; font-weight:800; color:#fff; font-variant-numeric:tabular-nums; letter-spacing:2px; margin-bottom:25px;">
30:00
  </div>

<button onclick="activateRecoveryBonus()" style="background:linear-gradient(135deg, #10b981, #059669); color:white; border:none; padding:15px 30px; border-radius:50px; font-weight:bold; cursor:pointer; width:100%; font-size:15px; box-shadow:0 10px 20px rgba(16, 185, 129, 0.3); transition:0.2s; text-transform:uppercase;">
FIRSATI YAKALA & TAMAMLA 🚀
  </button>

<div onclick="document.getElementById('mdm-recovery-modal').remove()" style="margin-top:15px; color:#64748b; font-size:11px; cursor:pointer; text-decoration:underline;">
İstemiyorum, puanlar yansın.
  </div>
  </div>
  </div>
<style>@keyframes popIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }</style>
`;

      const div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);

      // Geri Sayım
      let timeLeft = 30 * 60;
      const timerEl = document.getElementById("mdm-rec-timer");
      const interval = setInterval(() => {
        if (timeLeft <= 0) {
          clearInterval(interval);
          document.getElementById("mdm-recovery-modal").remove();
          return;
        }
        timeLeft--;
        const m = Math.floor(timeLeft / 60)
          .toString()
          .padStart(2, "0");
        const s = (timeLeft % 60).toString().padStart(2, "0");
        if (timerEl) timerEl.innerText = `${m}:${s}`;
      }, 1000);
    }

    // Buton Aksiyonu
    window.activateRecoveryBonus = function () {
      localStorage.setItem("mdm_cart_mission_active", "true");
      document.getElementById("mdm-recovery-modal").remove();
      if (
        !window.location.href.includes("sepet") &&
        !window.location.href.includes("odeme")
      ) {
        window.location.href = "/sepet";
      }
    };

    setInterval(checkCartAndTrigger, 5000);
  })();

  /* ================================================================
   🕵️‍♂️ GÜNLÜK SEPET DEDEKTİFİ (Sipariş Sonuç Kontrolü)
   Bu kod, müşteri ödemeyi tamamlayıp "Sipariş Alındı" sayfasına
   düştüğü an çalışır ve "gunluk_sepet_v1" görevini bitirir.
   ================================================================
*/
  (function dailyCartDetective() {
    // 1. URL Kontrolü: Burası bir sipariş başarı sayfası mı?
    var url = window.location.href.toLowerCase();
    // Faprika ve çoğu altyapıda sipariş bitince URL'de bunlar yazar:
    var isOrderSuccess =
      url.includes("/siparistamamlandi") ||
      url.includes("/order/success") ||
      url.includes("checkout/success") ||
      url.includes("tamamlandi");

    // Eğer sipariş sayfası değilse, hemen dur. Sistemi yorma.
    if (!isOrderSuccess) return;

    console.log("🛒 Sipariş Başarılı! Dedektif görevi kontrol ediyor...");

    // 2. Kullanıcıyı Tanı
    // faprika.js'deki APP_STATE'i kullanıyoruz.
    var user =
      window.APP_STATE && window.APP_STATE.user ? window.APP_STATE.user : null;

    // Eğer APP_STATE hazır değilse (nadir olur), hafızadan oku
    if (!user || !user.email) {
      try {
        user = JSON.parse(localStorage.getItem("mdm_user_cache"));
      } catch (e) {}
    }

    // Kullanıcı yoksa işlem yapma
    if (!user || !user.email) return;

    // 3. Çifte Puan Koruması (Sayfa yenilenirse tekrar puan vermesin)
    var lastProcessed = localStorage.getItem("mdm_last_order_processed");
    if (lastProcessed === url) {
      console.log("⚠️ Bu sipariş için ödül zaten verildi.");
      return;
    }

    // 4. GÖREVİ TAMAMLA VE PUANI VER
    // Adım 1'de belirlediğimiz ID'yi buraya yazıyoruz.
    var TARGET_TASK_ID = "gunluk_sepet_v1";

    if (window.fetchApi) {
      window
        .fetchApi("complete_task", {
          email: user.email,
          taskId: TARGET_TASK_ID,
        })
        .then(function (res) {
          if (res && res.success) {
            // A. Ekrana Yeşil Kutu Çıkar (Tebrikler!)
            if (window.ModumApp && window.ModumApp.showMemberPopup) {
              // Ödül miktarını göster (Varsayılan 500)
              window.ModumApp.showMemberPopup(res.reward || 500);
            }

            // B. Bu siparişi "işlendi" olarak işaretle
            localStorage.setItem("mdm_last_order_processed", url);

            // C. Puanı anlık güncelle
            if (window.ModumApp && window.ModumApp.updateDataInBackground) {
              window.ModumApp.updateDataInBackground();
            }
          } else {
            console.log(
              "ℹ️ Görev sonucu: " + (res.message || "Zaten yapılmış olabilir."),
            );
          }
        });
    }
  })(); // <--- Dedektif burada biter ve otomatik çalışır.
  /*sistem güncellendi v3*/
})();
