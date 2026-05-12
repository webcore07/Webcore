// ===== Webcore — site interactions =====
const WHATSAPP_NUMBER = "918608865811";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mkoypqdz"; // <- replace with your Formspree ID


// Chatbot replies

(function () {
  'use strict';

  /* ── DOM refs ── */
  const trigger  = document.getElementById('wc-trigger');
  const box      = document.getElementById('wc-box');
  if (!trigger || !box) return;
  const closeBtn = document.getElementById('wc-close');
  const messages = document.getElementById('wc-messages');
  const input    = document.getElementById('wc-input');
  const sendBtn  = document.getElementById('wc-send');
  const badge    = document.getElementById('wc-badge');
  const quickBar = document.getElementById('wc-quick');

  let opened = false;
  let botBusy = false;

  /* ── Knowledge base ── */
  const KB = [
    {
      keys: ['service','offer','provide','what do you do','help with','work'],
      reply: '🚀 We provide modern website development, responsive UI/UX design, portfolio websites, business websites and e-commerce stores for your business growth.'
    },
    {
      keys: ['Demo Website','sample','idea','show me','example','portfolio','previous work'],
      reply: '🎨 Check out our <a href="webdevelop.html" target="_blank" style="color:#00d4ff">Demo Website</a> to see our work in action!'
    },
    {
      keys: ['price','pricing','cost','how much','package','plan','rate','charge'],
      reply: '💰 Our packages start from affordable rates for landing pages all the way to full e-commerce solutions. Check out our <a href="webdevelop.html" target="_blank" style="color:#00d4ff">Website development</a> page for detailed pricing, or contact us for a custom quote!'
    },
    {
      keys: ['contact','reach','call','phone','email','get in touch','whatsapp','message you'],
      reply: '📞 You can reach our team at <strong><a href="https://wa.me/918608865811" target="_blank" style="color:#00d4ff">WhatsApp</a ></strong> or email us at <strong><a href="mailto:webcore.com@gmail.com" target="_blank" style="color:#00d4ff">webcore.com@gmail.com</a></strong>. We respond within 24 hours!'
    },
    {
      keys: ['portfolio','work','project','example','previous','sample','showcase'],
      reply: '🎨 We have built 10+ projects across industries. Explore our work in the "Our Works" section on the <a href="index.html" target="_blank" style="color:#00d4ff">WebCore homepage</a>.'
    },
    {
      keys: ['delivery','time','how long','deadline','timeline','days','weeks','duration','complete'],
      reply: '⏱ Delivery time depends on the project scope. A landing page typically takes 3–5 days. A full business website takes 7–14 days. E-commerce projects are 2–4 weeks. We always aim to deliver before the deadline!'
    },
    {
      keys: ['custom','unique','specific','tailor','personaliz','bespoke'],
      reply: '✅ Absolutely! Every WebCore project is 100% custom-built to match your brand identity, goals, and target audience. No templates — all original.'
    },
    {
      keys: ['mobile','responsive','phone','tablet','screen size','device'],
      reply: '📱 Yes! All WebCore websites are fully mobile-responsive and tested across all screen sizes. Mobile-first development is our standard — no exceptions.'
    },
    {
      keys: ['seo','search engine','rank','google','optimiz','traffic','visibility'],
      reply: '🔍 Yes, we implement on-page SEO best practices including fast load times, clean code, semantic HTML, meta tags, and performance optimization so your site ranks well on Google.'
    },
    {
      keys: ['instagram','social media','facebook','manage'],
      reply: '📲 Yes, Click to view our Instagram page!<strong><a href="https://www.instagram.com/web_core.in?igsh=dnJreGhweXFncTB4" target="_blank" style="color:#00d4ff"> Instagram </a></strong>and <strong><a href="https://www.instagram.com/web_core.in?igsh=dnJreGhweXFncTB4" target="_blank" style="color:#00d4ff"> Facebook </a></strong>. We share our latest projects, design tips, and behind-the-scenes looks at our process.'
    },
    {
      keys: ['ecommerce','e-commerce','shop','store','product','sell online','woocommerce','shopify'],
      reply: '🛒 Yes! We build fully functional e-commerce stores with product management, payment integration, and a smooth checkout experience — designed to convert visitors into customers.'
    },
    {
      keys: ['support','maintenance','after launch','update','fix','bug'],
      reply: '🛡️ We provide 24/7 support and post-launch maintenance. Your success is our priority. Just reach out and we\'ll handle it fast.'
    },
    {
      keys: ['who','about','team','founder','company','webcore'],
      reply: '🏢 WebCore was founded by <strong>Nawlir Iniyan B</strong> and — a passionate team of designers and developers building premium, futuristic websites engineered to convert.'
    },
    {
      keys: ['hello','hi','hey','greet','good morning','good evening','howdy'],
      reply: '👋 Hello! Welcome to WebCore. I\'m here to help you with info about our services, pricing, portfolio, and more. What can I assist you with today?'
    },
    {
      keys: ['thank','thanks','appreciate','great','awesome','perfect'],
      reply: '😊 You\'re welcome! It\'s our pleasure. If you have more questions, feel free to ask. We\'re always here to help!'
    },
  ];

  const FALLBACK = '<strong>WEB CORE</strong> For detailed discussions or advanced inquiries, please contact our team directly or send an email to <strong><a href="mailto:webcore.com@gmail.com" target="_blank" style="color:#00d4ff">webcore.com@gmail.com</a></strong> — we\'ll get back to you within 24 hours!';

  /* ── Helpers ── */
  function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendMessage(text, role) {
    const wrap = document.createElement('div');
    wrap.className = 'wc-bubble-wrap ' + role;

    const av = document.createElement('div');
    av.className = 'wc-bubble-avatar' + (role === 'user' ? ' user-av' : '');
    av.innerHTML = role === 'user' ? '<i class="fas fa-user"></i>' : '<img src="Webcore.png" alt="WebCore Logo">';

    const bub = document.createElement('div');
    bub.className = 'wc-bubble ' + role;
    bub.innerHTML = text;

    const ts = document.createElement('div');
    ts.className = 'wc-ts';
    ts.textContent = getTime();

    if (role === 'user') {
      wrap.append(av, bub, ts);
    } else {
      wrap.append(av, bub, ts);
    }

    messages.appendChild(wrap);
    scrollToBottom();
    return bub;
  }

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'wc-bubble-wrap bot';
    wrap.id = 'wc-typing-wrap';

    const av = document.createElement('div');
    av.className = 'wc-bubble-avatar';
    av.innerHTML = '<img src="Webcore.png" alt="WebCore Logo">';

    const typing = document.createElement('div');
    typing.className = 'wc-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';

    wrap.append(av, typing);
    messages.appendChild(wrap);
    scrollToBottom();
  }

  function removeTyping() {
    const tw = document.getElementById('wc-typing-wrap');
    if (tw) tw.remove();
  }

  function typeReply(el, text) {
    el.innerHTML = '';
    let i = 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const rawText = tempDiv.textContent; // for typing
    const interval = setInterval(() => {
      if (i < rawText.length) {
        el.textContent += rawText[i++];
        scrollToBottom();
      } else {
        // Replace with full HTML (links etc)
        el.innerHTML = text;
        scrollToBottom();
        clearInterval(interval);
        botBusy = false;
      }
    }, 18);
  }

  function getReply(msg) {
    const lower = msg.toLowerCase();
    for (const item of KB) {
      if (item.keys.some(k => lower.includes(k))) {
        return item.reply;
      }
    }
    return FALLBACK;
  }

  function sendMessage(text) {
    text = text.trim();
    if (!text || botBusy) return;

    botBusy = true;
    badge.style.display = 'none';

    appendMessage(text, 'user');
    input.value = '';

    const delay = 800 + Math.random() * 600;
    showTyping();

    setTimeout(() => {
      removeTyping();
      const replyText = getReply(text);
      const bubEl = appendMessage('', 'bot');
      typeReply(bubEl, replyText);
    }, delay);
  }

  /* ── Welcome message ── */
  function showWelcome() {
    if (messages.children.length === 0) {
      setTimeout(() => {
        appendMessage('👋 Welcome to <strong>WebCore</strong>! I\'m your assistant — ask me anything about our services, pricing, delivery, or how to get in touch. I\'m here to help!', 'bot');
        botBusy = false;
      }, 400);
    }
  }

  /* ── Toggle open/close ── */
  function openChat() {
    opened = true;
    box.classList.add('wc-open');
    trigger.style.display = 'none';
    badge.style.display = 'none';
    showWelcome();
    setTimeout(() => input.focus(), 350);
  }

  function closeChat() {
    opened = false;
    box.classList.remove('wc-open');
    trigger.style.display = '';
  }

  /* ── Event Listeners ── */
  trigger.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(input.value); });

  // Quick reply buttons
  quickBar.querySelectorAll('.wc-qr').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.textContent));
  });

  // Close when clicking outside (desktop)
  document.addEventListener('click', e => {
    if (opened && !box.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
      closeChat();
    }
  });

})();









// ---------- Data ----------
const landingPackages = [
  { name: "Silver", price: "₹4,999", tagline: "Perfect for getting online fast",
    features: ["1 Page Landing Site", "Mobile Responsive Design", "Contact Form Integration", "Basic SEO Setup", "1 Round of Revisions", "5 Day Delivery"], highlight: false },
  { name: "Gold", price: "₹9,999", tagline: "Most popular for growing brands",
    features: ["Up to 5 Pages", "Premium Animated Design", "WhatsApp & Form Integration", "Advanced SEO + Analytics", "3 Rounds of Revisions", "Speed Optimized", "7 Day Delivery"], highlight: true },
  { name: "Platinum", price: "₹14,999", tagline: "Premium solution, end-to-end",
    features: ["Up to 10 Custom Pages", "Bespoke UI/UX Design", "CMS / Blog Integration", "Premium SEO + Schema", "Unlimited Revisions", "Priority Support", "10 Day Delivery"], highlight: false },
];

const ecomPackages = [
  { name: "Gold", price: "₹14,999", tagline: "WhatsApp Integrated Store",
    features: ["Up to 50 Products", "WhatsApp Order Integration", "Mobile-First Storefront", "Product Catalog & Cart", "Basic SEO Setup", "Admin Dashboard", "10 Day Delivery"], highlight: false },
  { name: "Platinum", price: "₹24,999", tagline: "Payment Gateway + WhatsApp",
    features: ["Unlimited Products", "Razorpay/Stripe Integration", "WhatsApp Order Notifications", "Customer Accounts & Wishlist", "Coupons & Discounts", "Advanced SEO + Analytics", "Priority Support", "15 Day Delivery"], highlight: true },
];

// const projects = [
//   { title: "Luxe Commerce", category: "E-Commerce",   img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80" },
//   { title: "FinEdge SaaS",  category: "Landing Page", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80" },
//   { title: "Bistro Online", category: "Restaurant",   img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80" },
//   { title: "Pulse Fitness", category: "Branding Site",img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80" },
//   { title: "Nova Realty",   category: "Real Estate",  img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80" },
//   { title: "Aurora Studio", category: "Portfolio",    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80" },
// ];


let currentType = "Landing Page";
let chosenPackage = "";

// ---------- Utilities ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function showToast(msg, kind = "") {
  const t = $("#toast");
  t.textContent = msg;
  t.className = "toast show " + kind;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (t.className = "toast " + kind), 3000);
}

// ---------- Year ----------
$("#year").textContent = new Date().getFullYear();

// ---------- Navbar scroll ----------
const navbar = $("#navbar");
let scrollTicking = false;
const onScroll = () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Mobile menu ----------
const navToggle = $("#navToggle");
const mobileMenu = $("#mobileMenu");
navToggle.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  navToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
$$("#mobileMenu a").forEach(a => a.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));

// ---------- Render packages ----------
function renderPackages() {
  const grid = $("#packagesGrid");
  if (!grid) return;
  const list = currentType === "Landing Page" ? landingPackages : ecomPackages;
  grid.className = "packages-grid " + (list.length === 2 ? "cols-2" : "cols-3");
  grid.innerHTML = list.map((p, i) => `
    <div class="pkg glass-card ${p.highlight ? "highlight" : ""} reveal" style="--d:${i * 0.08}s">
      ${p.highlight ? `<div class="pkg-badge"><i class="fa-solid fa-sparkles"></i> MOST POPULAR</div>` : ""}
      <h3 class="pkg-name grad-text">${p.name}</h3>
      <p class="pkg-tag">${p.tagline}</p>
      <div class="pkg-price"><span class="amt">${p.price}</span><span class="per">/ project</span></div>
      <div class="pkg-divider"></div>
      <ul class="pkg-features">
        ${p.features.map(f => `<li><span class="pkg-check"><i class="fa-solid fa-check"></i></span><span>${f}</span></li>`).join("")}
      </ul>
      <button class="btn ${p.highlight ? "btn-neon" : "btn-neon-outline"} btn-lg" data-pkg="${p.name}">Choose Plan</button>
    </div>
  `).join("");
  observeReveal();
  $$("#packagesGrid [data-pkg]").forEach(b =>
    b.addEventListener("click", () => openPackageModal(b.dataset.pkg))
  );
}

// Type switch
$$(".type-btn").forEach(btn => btn.addEventListener("click", () => {
  $$(".type-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentType = btn.dataset.type;
  renderPackages();
  const isLanding = currentType === "Landing Page";
  const d1 = $("#demo1"), d2 = $("#demo2");
  if (d1) d1.style.display = isLanding ? "" : "none";
  if (d2) {
    d2.style.display = isLanding ? "none" : "";
    if (!isLanding) {
      const iframe = d2.querySelector("iframe[data-src]");
      if (iframe) { iframe.src = iframe.dataset.src; iframe.removeAttribute("data-src"); }
    }
  }
}));

// ---------- Render works ----------
function renderWorks() {
  if (!$("#worksGrid")) return;
}

// ---------- Modals ----------
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add("open");
  m.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal(m) {
  m.classList.remove("open");
  m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  // Reset contact view if needed
  if (m.id === "contactModal") {
    $("#contactFormView").hidden = false;
    $("#contactSuccessView").hidden = true;
    $("#contactForm").reset();
  }
}
function openPackageModal(name) {
  chosenPackage = name;
  $("#packageModalTitle").innerHTML = `<span class="grad-text">${name}</span> · ${currentType}`;
  $("#packageForm").reset();
  openModal("packageModal");
}

// Open triggers
$$("[data-open]").forEach(el => el.addEventListener("click", () => {
  const target = el.dataset.open;
  if (target === "contact") openModal("contactModal");
}));
// Close triggers
$$("[data-close]").forEach(el => el.addEventListener("click", () => {
  const m = el.closest(".modal");
  if (m) closeModal(m);
}));
document.addEventListener("keydown", e => {
  if (e.key === "Escape") $$(".modal.open").forEach(closeModal);
});

// ---------- Validation ----------
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ---------- Package form -> WhatsApp ----------
$("#packageForm").addEventListener("submit", e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = (fd.get("name") || "").toString().trim();
  const phone = (fd.get("phone") || "").toString().trim();
  const email = (fd.get("email") || "").toString().trim();
  const business = (fd.get("business") || "").toString().trim();

  if (name.length < 2) return showToast("Please enter your name", "error");
  if (phone.length < 7) return showToast("Please enter a valid phone number", "error");
  if (!isEmail(email)) return showToast("Please enter a valid email", "error");
  if (business.length < 2) return showToast("Please enter your business type", "error");

  const message =
`WEB CORE, New Request for ${currentType} - ${chosenPackage}

CLIENT DETAILS

👤 Name: ${name}
📞 Mobile number: ${phone}
✉️ Email ID: ${email}
💼 Business type: ${business}

_____________________________________________

PACKAGE DETAILS

🌐 Website type: ${currentType}
🚀 Chosen Package: ${chosenPackage}`;

// Direct WhatsApp App Open
const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

// Replace window.open
window.location.href = url;

showToast("Opening WhatsApp...", "success");
closeModal($("#packageModal"));
});

// ---------- Contact form -> Formspree ----------
$("#contactForm").addEventListener("submit", async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = {
    name: (fd.get("name") || "").toString().trim(),
    phone: (fd.get("phone") || "").toString().trim(),
    email: (fd.get("email") || "").toString().trim(),
    reason: (fd.get("reason") || "").toString().trim(),
  };
  if (data.name.length < 2) return showToast("Please enter your name", "error");
  if (data.phone.length < 7) return showToast("Please enter a valid phone number", "error");
  if (!isEmail(data.email)) return showToast("Please enter a valid email", "error");
  if (data.reason.length < 5) return showToast("Please share a reason", "error");

  const btn = $("#contactSubmit");
  btn.disabled = true; btn.textContent = "Sending...";
  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
  } catch (_) { /* show success regardless to avoid blocking on demo endpoint */ }
  finally {
    btn.disabled = false; btn.innerHTML = "Send Message";
    $("#contactFormView").hidden = true;
    $("#contactSuccessView").hidden = false;
  }
});

// ---------- Reveal on scroll ----------
let revealObserver;
function observeReveal() {
  const els = $$(".reveal:not(.in)");
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }
  els.forEach(el => revealObserver.observe(el));
}

// ---------- Smooth-scroll fix for header offset (small) ----------
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (id.length > 1 && document.querySelector(id)) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ---------- Init ----------
document.documentElement.classList.add("js-ready");
renderPackages();
renderWorks();
observeReveal();


// Logo aniamtion js file

if (document.getElementById('three-container')) {
  window.onload = init;
}
console.warn = function() {}; // what warnings?

function init() {
  var root = new THREERoot({
    createCameraControls: !true,
    antialias: (window.devicePixelRatio === 1),
    fov: 80
  });

  root.renderer.setClearColor(0x000000, 0);
  root.renderer.setPixelRatio(window.devicePixelRatio || 1);
  root.camera.position.set(0, 0, 60);

  var width = 60;
  var height = 60;

  var slide = new Slide(width, height, 'out');
	var l1 = new THREE.ImageLoader();
	l1.setCrossOrigin('Anonymous');
  slide.setImage(l1.load('Webcore.png'));
  root.scene.add(slide);

  var slide2 = new Slide(width, height, 'in');
  var l2 = new THREE.ImageLoader();
	l2.setCrossOrigin('Anonymous');
	slide2.setImage(l2.load('Webcore.png'));
  root.scene.add(slide2);

  var tl = new TimelineMax({repeat:-1, repeatDelay:1.0, yoyo: true});

  tl.add(slide.transition(), 0);
  tl.add(slide2.transition(), 0);

  createTweenScrubber(tl);

  window.addEventListener('keyup', function(e) {
    if (e.keyCode === 80) {
      tl.paused(!tl.paused());
    }
  });
}

////////////////////
// CLASSES
////////////////////

function Slide(width, height, animationPhase) {
  var plane = new THREE.PlaneGeometry(width, height, width * 2, height * 2);

  THREE.BAS.Utils.separateFaces(plane);

  var geometry = new SlideGeometry(plane);

  geometry.bufferUVs();

  var aAnimation = geometry.createAttribute('aAnimation', 2);
  var aStartPosition = geometry.createAttribute('aStartPosition', 3);
  var aControl0 = geometry.createAttribute('aControl0', 3);
  var aControl1 = geometry.createAttribute('aControl1', 3);
  var aEndPosition = geometry.createAttribute('aEndPosition', 3);

  var i, i2, i3, i4, v;

  var minDuration = 0.8;
  var maxDuration = 1.2;
  var maxDelayX = 0.9;
  var maxDelayY = 0.125;
  var stretch = 0.11;

  this.totalDuration = maxDuration + maxDelayX + maxDelayY + stretch;

  var startPosition = new THREE.Vector3();
  var control0 = new THREE.Vector3();
  var control1 = new THREE.Vector3();
  var endPosition = new THREE.Vector3();

  var tempPoint = new THREE.Vector3();

  function getControlPoint0(centroid) {
    var signY = Math.sign(centroid.y);

    tempPoint.x = THREE.Math.randFloat(0.1, 0.3) * 50;
    tempPoint.y = signY * THREE.Math.randFloat(0.1, 0.3) * 70;
    tempPoint.z = THREE.Math.randFloatSpread(20);

    return tempPoint;
  }

  function getControlPoint1(centroid) {
    var signY = Math.sign(centroid.y);

    tempPoint.x = THREE.Math.randFloat(0.3, 0.6) * 50;
    tempPoint.y = -signY * THREE.Math.randFloat(0.3, 0.6) * 70;
    tempPoint.z = THREE.Math.randFloatSpread(20);

    return tempPoint;
  }

  for (i = 0, i2 = 0, i3 = 0, i4 = 0; i < geometry.faceCount; i++, i2 += 6, i3 += 9, i4 += 12) {
    var face = plane.faces[i];
    var centroid = THREE.BAS.Utils.computeCentroid(plane, face);

    // animation
    var duration = THREE.Math.randFloat(minDuration, maxDuration);
    var delayX = THREE.Math.mapLinear(centroid.x, -width * 0.5, width * 0.5, 0.0, maxDelayX);
    var delayY;

    if (animationPhase === 'in') {
      delayY = THREE.Math.mapLinear(Math.abs(centroid.y), 0, height * 0.5, 0.0, maxDelayY)
    }
    else {
      delayY = THREE.Math.mapLinear(Math.abs(centroid.y), 0, height * 0.5, maxDelayY, 0.0)
    }

    for (v = 0; v < 6; v += 2) {
      aAnimation.array[i2 + v]     = delayX + delayY + (Math.random() * stretch * duration);
      aAnimation.array[i2 + v + 1] = duration;
    }

    // positions

    endPosition.copy(centroid);
    startPosition.copy(centroid);

    if (animationPhase === 'in') {
      control0.copy(centroid).sub(getControlPoint0(centroid));
      control1.copy(centroid).sub(getControlPoint1(centroid));
    }
    else { // out
      control0.copy(centroid).add(getControlPoint0(centroid));
      control1.copy(centroid).add(getControlPoint1(centroid));
    }

    for (v = 0; v < 9; v += 3) {
      aStartPosition.array[i3 + v]     = startPosition.x;
      aStartPosition.array[i3 + v + 1] = startPosition.y;
      aStartPosition.array[i3 + v + 2] = startPosition.z;

      aControl0.array[i3 + v]     = control0.x;
      aControl0.array[i3 + v + 1] = control0.y;
      aControl0.array[i3 + v + 2] = control0.z;

      aControl1.array[i3 + v]     = control1.x;
      aControl1.array[i3 + v + 1] = control1.y;
      aControl1.array[i3 + v + 2] = control1.z;

      aEndPosition.array[i3 + v]     = endPosition.x;
      aEndPosition.array[i3 + v + 1] = endPosition.y;
      aEndPosition.array[i3 + v + 2] = endPosition.z;
    }
  }

  var material = new THREE.BAS.BasicAnimationMaterial(
    {
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0}
      },
      shaderFunctions: [
        THREE.BAS.ShaderChunk['cubic_bezier'],
        //THREE.BAS.ShaderChunk[(animationPhase === 'in' ? 'ease_out_cubic' : 'ease_in_cubic')],
        THREE.BAS.ShaderChunk['ease_in_out_cubic'],
        THREE.BAS.ShaderChunk['quaternion_rotation']
      ],
      shaderParameters: [
        'uniform float uTime;',
        'attribute vec2 aAnimation;',
        'attribute vec3 aStartPosition;',
        'attribute vec3 aControl0;',
        'attribute vec3 aControl1;',
        'attribute vec3 aEndPosition;',
      ],
      shaderVertexInit: [
        'float tDelay = aAnimation.x;',
        'float tDuration = aAnimation.y;',
        'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
        'float tProgress = ease(tTime, 0.0, 1.0, tDuration);'
        //'float tProgress = tTime / tDuration;'
      ],
      shaderTransformPosition: [
        (animationPhase === 'in' ? 'transformed *= tProgress;' : 'transformed *= 1.0 - tProgress;'),
        'transformed += cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);'
      ]
    },
    {
      map: new THREE.Texture(),
    }
  );

  THREE.Mesh.call(this, geometry, material);

  this.frustumCulled = false;
}
Slide.prototype = Object.create(THREE.Mesh.prototype);
Slide.prototype.constructor = Slide;
Object.defineProperty(Slide.prototype, 'time', {
  get: function () {
    return this.material.uniforms['uTime'].value;
  },
  set: function (v) {
    this.material.uniforms['uTime'].value = v;
  }
});

Slide.prototype.setImage = function(image) {
  this.material.uniforms.map.value.image = image;
  this.material.uniforms.map.value.needsUpdate = true;
};

Slide.prototype.transition = function() {
  return TweenMax.fromTo(this, 3.0, {time:0.0}, {time:this.totalDuration, ease:Power0.easeInOut});
};


function SlideGeometry(model) {
  THREE.BAS.ModelBufferGeometry.call(this, model);
}
SlideGeometry.prototype = Object.create(THREE.BAS.ModelBufferGeometry.prototype);
SlideGeometry.prototype.constructor = SlideGeometry;
SlideGeometry.prototype.bufferPositions = function () {
  var positionBuffer = this.createAttribute('position', 3).array;

  for (var i = 0; i < this.faceCount; i++) {
    var face = this.modelGeometry.faces[i];
    var centroid = THREE.BAS.Utils.computeCentroid(this.modelGeometry, face);

    var a = this.modelGeometry.vertices[face.a];
    var b = this.modelGeometry.vertices[face.b];
    var c = this.modelGeometry.vertices[face.c];

    positionBuffer[face.a * 3]     = a.x - centroid.x;
    positionBuffer[face.a * 3 + 1] = a.y - centroid.y;
    positionBuffer[face.a * 3 + 2] = a.z - centroid.z;

    positionBuffer[face.b * 3]     = b.x - centroid.x;
    positionBuffer[face.b * 3 + 1] = b.y - centroid.y;
    positionBuffer[face.b * 3 + 2] = b.z - centroid.z;

    positionBuffer[face.c * 3]     = c.x - centroid.x;
    positionBuffer[face.c * 3 + 1] = c.y - centroid.y;
    positionBuffer[face.c * 3 + 2] = c.z - centroid.z;
  }
};


function THREERoot(params) {
  params = utils.extend({
    fov: 60,
    zNear: 10,
    zFar: 100000,

    createCameraControls: true
  }, params);

  this.renderer = new THREE.WebGLRenderer({
    antialias: params.antialias,
    alpha: true
  });
  this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  document.getElementById('three-container').appendChild(this.renderer.domElement);

  this.camera = new THREE.PerspectiveCamera(
    params.fov,
    window.innerWidth / window.innerHeight,
    params.zNear,
    params.zfar
  );

  this.scene = new THREE.Scene();

  if (params.createCameraControls) {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  }

  this.resize = this.resize.bind(this);
  this.tick = this.tick.bind(this);

  this.resize();
  this.tick();

  window.addEventListener('resize', this.resize, false);
}
THREERoot.prototype = {
  tick: function () {
    this.update();
    this.render();
    requestAnimationFrame(this.tick);
  },
  update: function () {
    this.controls && this.controls.update();
  },
  render: function () {
    this.renderer.render(this.scene, this.camera);
  },
  resize: function () {
    var container = document.getElementById('three-container');
    var w = container ? container.clientWidth : window.innerWidth;
    var h = container ? container.clientHeight : window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }
};

////////////////////
// UTILS
////////////////////

var utils = {
  extend: function (dst, src) {
    for (var key in src) {
      dst[key] = src[key];
    }

    return dst;
  },
  randSign: function () {
    return Math.random() > 0.5 ? 1 : -1;
  },
  ease: function (ease, t, b, c, d) {
    return b + ease.getRatio(t / d) * c;
  },
  fibSpherePoint: (function () {
    var vec = {x: 0, y: 0, z: 0};
    var G = Math.PI * (3 - Math.sqrt(5));

    return function (i, n, radius) {
      var step = 2.0 / n;
      var r, phi;

      vec.y = i * step - 1 + (step * 0.5);
      r = Math.sqrt(1 - vec.y * vec.y);
      phi = i * G;
      vec.x = Math.cos(phi) * r;
      vec.z = Math.sin(phi) * r;

      radius = radius || 1;

      vec.x *= radius;
      vec.y *= radius;
      vec.z *= radius;

      return vec;
    }
  })(),
  spherePoint: (function () {
    return function (u, v) {
      u === undefined && (u = Math.random());
      v === undefined && (v = Math.random());

      var theta = 2 * Math.PI * u;
      var phi = Math.acos(2 * v - 1);

      var vec = {};
      vec.x = (Math.sin(phi) * Math.cos(theta));
      vec.y = (Math.sin(phi) * Math.sin(theta));
      vec.z = (Math.cos(phi));

      return vec;
    }
  })()
};

function createTweenScrubber(tween, seekSpeed) {
  seekSpeed = seekSpeed || 0.001;

  function stop() {
    TweenMax.to(tween, 1, {timeScale:0});
  }

  function resume() {
    TweenMax.to(tween, 1, {timeScale:1});
  }

  function seek(dx) {
    var progress = tween.progress();
    var p = THREE.Math.clamp((progress + (dx * seekSpeed)), 0, 1);

    tween.progress(p);
  }

  var _cx = 0;
  var threeContainer = document.getElementById('three-container');

  // desktop — scoped to three-container only
  var mouseDown = false;

  threeContainer.addEventListener('mousedown', function(e) {
    mouseDown = true;
    _cx = e.clientX;
    stop();
  });
  window.addEventListener('mouseup', function(e) {
    mouseDown = false;
    resume();
  });
  window.addEventListener('mousemove', function(e) {
    if (mouseDown === true) {
      var cx = e.clientX;
      var dx = cx - _cx;
      _cx = cx;
      seek(dx);
    }
  });
  // mobile — scoped to three-container only
  threeContainer.addEventListener('touchstart', function(e) {
    _cx = e.touches[0].clientX;
    stop();
  }, { passive: true });
  threeContainer.addEventListener('touchend', function(e) {
    resume();
  }, { passive: true });
  threeContainer.addEventListener('touchmove', function(e) {
    var cx = e.touches[0].clientX;
    var dx = cx - _cx;
    _cx = cx;
    seek(dx);
  }, { passive: true });
}
