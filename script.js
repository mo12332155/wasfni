"use strict";

/* =========================================================
   وصفني — Local Copy Generator + UI Logic
   ملاحظة معمارية:
   generateProductCopy(input) هي الواجهة الوحيدة بين الـ UI
   ومنطق التوليد. لاحقًا يمكن استبدال جسمها بطلب fetch() إلى
   Backend/API حقيقي دون تغيير أي كود آخر في الملف، طالما بقي
   شكل المُدخل والمُخرج كما هو.
   ========================================================= */

/* ---------- Analytics stub (لا يرسل أي بيانات الآن) ---------- */
function trackEvent(eventName, payload) {
  // مكان مخصص للربط لاحقًا بنظام Analytics حقيقي.
  // حاليًا لا يفعل شيئًا سوى تسجيل محلي اختياري في الـ console.
  // console.debug("[trackEvent]", eventName, payload || {});
}

/* =========================================================
   1) LOCAL GENERATION ENGINE
   ========================================================= */

const TONE_LABELS = {
  professional: "احترافية",
  friendly: "ودية",
  marketing: "تسويقية",
  simple: "بسيطة",
  luxury: "فاخرة",
};

// قوالب العناوين حسب النبرة. {product} = اسم المنتج، {type} = نوع المنتج
const TITLE_TEMPLATES = {
  professional: [
    "{product} — الخيار الأمثل الذي تبحث عنه",
    "{product}: جودة تستحق الثقة",
    "{product} — تصميم مدروس لتجربة أفضل",
  ],
  friendly: [
    "{product} اللي هتحبه من أول استخدام",
    "تعرف على {product}",
    "{product} — رفيقك الجديد",
  ],
  marketing: [
    "{product} 🔥 التجربة اللي كنت مستنيها",
    "اكتشف {product} الآن",
    "{product} — الأفضل في فئته",
  ],
  simple: [
    "{product}",
    "{product} — ببساطة",
    "تعرف على {product}",
  ],
  luxury: [
    "{product} — تميّز يليق بك",
    "{product}: لمسة من الفخامة",
    "{product} — اختيار الذواقة",
  ],
};

// افتتاحيات الوصف حسب النبرة. {type} = نوع المنتج (قد يكون فارغًا)
const DESC_OPENERS = {
  professional: [
    "صُمم {product} ليقدّم تجربة استخدام متكاملة",
    "{product} هو {typePhrase} يجمع بين الجودة والعملية",
    "إذا كنت تبحث عن {typePhraseAlt}، فإن {product} خيار يستحق الاهتمام",
  ],
  friendly: [
    "خلينا نتعرف على {product} 🙂",
    "{product} هو {typePhrase} هيسهّل عليك كتير",
    "جربت {typePhraseAlt}؟ {product} هيغيّر رأيك",
  ],
  marketing: [
    "{product} هنا عشان يغيّر تجربتك مع {typePhraseAlt}",
    "لو بتدوّر على {typePhraseAlt} يستاهل، {product} هو الحل",
    "خلي {product} يكون اختيارك التالي",
  ],
  simple: [
    "{product} هو {typePhrase}",
    "{product}: {typePhrase} بسيط وعملي",
    "تفاصيل {product} في السطور القادمة",
  ],
  luxury: [
    "{product} تجربة مختلفة في عالم {typePhraseAlt}",
    "صُنع {product} لمن يقدّر التفاصيل",
    "{product} — حيث تلتقي الأناقة بالجودة",
  ],
};

// جمل ربط لإضافة المميزات داخل الوصف (تُستخدم فقط إذا وُجدت مميزات)
const DESC_FEATURE_CONNECTORS = {
  professional: "يتميز بـ",
  friendly: "وبيتميز بـ",
  marketing: "ويتميز بمزايا زي",
  simple: "ومن مميزاته",
  luxury: "ويتميز بـ",
};

// جمل ربط للجمهور المستهدف
const DESC_AUDIENCE_CONNECTORS = {
  professional: "وهو مناسب لـ",
  friendly: "وهيكون مناسب لـ",
  marketing: "وهو الاختيار الأمثل لـ",
  simple: "ومناسب لـ",
  luxury: "وهو موجّه لـ",
};

// قوالب CTA حسب النبرة
const CTA_TEMPLATES = {
  professional: [
    "اطلب {product} الآن وابدأ تجربتك.",
    "لا تفوّت فرصة اقتناء {product}.",
    "تواصل معنا الآن للحصول على {product}.",
  ],
  friendly: [
    "يلا جرّب {product} دلوقتي 😊",
    "اطلبه دلوقتي وشاركنا رأيك في {product}.",
    "متتردّدش، {product} مستنيك.",
  ],
  marketing: [
    "احجز {product} الآن قبل نفاد الكمية!",
    "اطلب {product} النهاردة وجرب الفرق.",
    "متأخرش، {product} في انتظارك الآن.",
  ],
  simple: [
    "اطلب {product} الآن.",
    "جرّب {product} اليوم.",
    "تواصل معنا لطلب {product}.",
  ],
  luxury: [
    "اقتنِ {product} الآن واستمتع بتجربة استثنائية.",
    "{product} بانتظارك — اطلبه الآن.",
    "امنح نفسك {product} اليوم.",
  ],
};

// قوالب المنشور القصير (سوشيال ميديا)
const SOCIAL_TEMPLATES = {
  professional: [
    "✨ {product}\n{shortFeatures}\nتواصل معنا الآن للطلب.",
    "🔹 {product}\n{shortFeatures}",
  ],
  friendly: [
    "😍 {product} وصلكم!\n{shortFeatures}\nاطلبوا دلوقتي 👇",
    "🙌 {product}\n{shortFeatures}",
  ],
  marketing: [
    "🔥 {product} 🔥\n{shortFeatures}\nاطلب الآن قبل نفاد الكمية!",
    "🚀 {product}\n{shortFeatures}\nمتأخرش!",
  ],
  simple: [
    "{product}\n{shortFeatures}",
    "{product} — {shortFeatures}",
  ],
  luxury: [
    "✨ {product} ✨\n{shortFeatures}\nتميّز يليق بك.",
    "{product}\n{shortFeatures}",
  ],
};

const GENERIC_TYPE_PHRASES = ["المنتج", "هذا المنتج"];

/**
 * ينظّف نصًا مُدخلاً من المستخدم: يزيل وسوم HTML المحتملة والمسافات الزائدة.
 * (طبقة دفاعية إضافية بجانب استخدام textContent عند العرض)
 */
function sanitizeInput(text) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * يحوّل نص المميزات (مفصول بفواصل أو أسطر) إلى مصفوفة نظيفة بدون تكرار.
 */
function parseFeatures(rawFeatures) {
  if (!rawFeatures) return [];
  const parts = rawFeatures
    .split(/[،,\n]+/)
    .map((f) => sanitizeInput(f))
    .filter((f) => f.length > 0);

  const seen = new Set();
  const unique = [];
  for (const part of parts) {
    const key = part.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(part);
    }
  }
  return unique.slice(0, 8); // حد أقصى منطقي لعدد المميزات
}

/**
 * اختيار عنصر عشوائي من مصفوفة مع استبعاد فهرس سابق إن أمكن (لتنويع النتائج).
 */
function pickVariant(list, excludeIndex) {
  if (list.length === 1) return { text: list[0], index: 0 };
  let index = Math.floor(Math.random() * list.length);
  if (list.length > 1 && index === excludeIndex) {
    index = (index + 1) % list.length;
  }
  return { text: list[index], index };
}

function fillTemplate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : match
  );
}

/**
 * الدالة الأساسية: تُحوّل مُدخلات المستخدم إلى نتيجة منظمة.
 * @param {Object} input
 * @param {string} input.productName
 * @param {string} input.productType
 * @param {string} input.featuresRaw
 * @param {string} input.audience
 * @param {string} input.tone
 * @param {Object} [previousVariant] - فهارس القوالب المستخدمة سابقًا لتنويع النتيجة
 * @returns {{title:string, description:string, features:string[], cta:string, social:string, variant:Object}}
 */
function generateProductCopy(input, previousVariant) {
  const tone = TONE_LABELS[input.tone] ? input.tone : "professional";
  const productName = sanitizeInput(input.productName);
  const productType = sanitizeInput(input.productType);
  const audience = sanitizeInput(input.audience);
  const features = parseFeatures(input.featuresRaw);

  const prev = previousVariant || {};

  // --- typePhrase / typePhraseAlt: عبارات بديلة إذا لم يُذكر نوع المنتج ---
  const typePhrase = productType || GENERIC_TYPE_PHRASES[0];
  const typePhraseAlt = productType || GENERIC_TYPE_PHRASES[1];

  const baseVars = {
    product: productName,
    type: productType,
    typePhrase,
    typePhraseAlt,
  };

  // --- العنوان ---
  const titleList = TITLE_TEMPLATES[tone];
  const titlePick = pickVariant(titleList, prev.titleIndex);
  const title = fillTemplate(titlePick.text, baseVars);

  // --- الوصف ---
  const openerList = DESC_OPENERS[tone];
  const openerPick = pickVariant(openerList, prev.openerIndex);
  let description = fillTemplate(openerPick.text, baseVars).trim();
  if (!/[.!؟]$/.test(description)) description += ".";

  if (features.length > 0) {
    const connector = DESC_FEATURE_CONNECTORS[tone];
    const featureText = features.slice(0, 4).join("، ");
    description += ` ${connector} ${featureText}.`;
  }

  if (audience) {
    const audienceConnector = DESC_AUDIENCE_CONNECTORS[tone];
    description += ` ${audienceConnector} ${audience}.`;
  }

  // --- المميزات (Bullet Points) ---
  const featureBullets = features.length > 0
    ? features
    : ["أضف مميزات منتجك في النموذج لتظهر هنا بشكل منظم"];

  // --- CTA ---
  const ctaList = CTA_TEMPLATES[tone];
  const ctaPick = pickVariant(ctaList, prev.ctaIndex);
  const cta = fillTemplate(ctaPick.text, baseVars);

  // --- منشور قصير ---
  const shortFeaturesText = features.length > 0
    ? features.slice(0, 3).map((f) => `✔ ${f}`).join("\n")
    : `✔ ${typePhrase}`;

  const socialList = SOCIAL_TEMPLATES[tone];
  const socialPick = pickVariant(socialList, prev.socialIndex);
  const social = fillTemplate(socialPick.text, {
    ...baseVars,
    shortFeatures: shortFeaturesText,
  });

  return {
    title,
    description,
    features: featureBullets,
    cta,
    social,
    variant: {
      titleIndex: titlePick.index,
      openerIndex: openerPick.index,
      ctaIndex: ctaPick.index,
      socialIndex: socialPick.index,
    },
  };
}

/* =========================================================
   2) UI STATE & DOM REFERENCES
   ========================================================= */

const STORAGE_KEY = "wasfni_last_input_v1";

const state = {
  lastInput: null,
  lastVariant: null,
};

const el = {
  form: document.getElementById("productForm"),
  productName: document.getElementById("productName"),
  productType: document.getElementById("productType"),
  productFeatures: document.getElementById("productFeatures"),
  targetAudience: document.getElementById("targetAudience"),
  writingTone: document.getElementById("writingTone"),

  productNameError: document.getElementById("productNameError"),

  generateBtn: document.getElementById("generateBtn"),
  clearBtn: document.getElementById("clearBtn"),
  regenerateBtn: document.getElementById("regenerateBtn"),

  saveLocallyToggle: document.getElementById("saveLocallyToggle"),
  clearStorageBtn: document.getElementById("clearStorageBtn"),

  emptyState: document.getElementById("emptyState"),
  loadingState: document.getElementById("loadingState"),
  errorState: document.getElementById("errorState"),
  errorStateMessage: document.getElementById("errorStateMessage"),
  resultContent: document.getElementById("resultContent"),

  resultTitle: document.getElementById("resultTitle"),
  resultDescription: document.getElementById("resultDescription"),
  resultFeatures: document.getElementById("resultFeatures"),
  resultCta: document.getElementById("resultCta"),
  resultSocial: document.getElementById("resultSocial"),

  heroCta: document.getElementById("heroCta"),
  toast: document.getElementById("toast"),

  privacyLink: document.getElementById("privacyLink"),
  termsLink: document.getElementById("termsLink"),
  legalModal: document.getElementById("legalModal"),
  modalOverlay: document.getElementById("modalOverlay"),
  modalClose: document.getElementById("modalClose"),
  modalTitle: document.getElementById("modalTitle"),
  modalBody: document.getElementById("modalBody"),
};

/* =========================================================
   3) VIEW STATE HELPERS
   ========================================================= */

function showState(stateName) {
  el.emptyState.hidden = stateName !== "empty";
  el.loadingState.hidden = stateName !== "loading";
  el.errorState.hidden = stateName !== "error";
  el.resultContent.hidden = stateName !== "result";
}

function showFieldError(message) {
  const group = el.productName.closest(".form-group");
  el.productNameError.textContent = message || "";
  if (message) {
    group.classList.add("has-error");
    el.productName.setAttribute("aria-invalid", "true");
  } else {
    group.classList.remove("has-error");
    el.productName.removeAttribute("aria-invalid");
  }
}

let toastTimer = null;
function showToast(message) {
  el.toast.textContent = message;
  el.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.toast.hidden = true;
  }, 2200);
}

/* =========================================================
   4) RENDERING RESULT (safe: textContent only)
   ========================================================= */

function renderResult(result) {
  el.resultTitle.textContent = result.title;
  el.resultDescription.textContent = result.description;
  el.resultCta.textContent = result.cta;
  el.resultSocial.textContent = result.social;

  el.resultFeatures.textContent = "";
  result.features.forEach((feature) => {
    const li = document.createElement("li");
    li.textContent = feature;
    el.resultFeatures.appendChild(li);
  });

  showState("result");
}

function getCopyableText(targetId) {
  if (targetId === "resultFeatures") {
    return Array.from(el.resultFeatures.querySelectorAll("li"))
      .map((li) => `- ${li.textContent}`)
      .join("\n");
  }
  const node = document.getElementById(targetId);
  return node ? node.textContent : "";
}

/* =========================================================
   5) VALIDATION
   ========================================================= */

function validateForm() {
  const name = el.productName.value.trim();
  if (!name) {
    showFieldError("اكتب اسم المنتج أولًا.");
    el.productName.focus();
    return false;
  }
  showFieldError("");
  return true;
}

/* =========================================================
   6) FORM SUBMIT / GENERATE
   ========================================================= */

function collectInput() {
  return {
    productName: el.productName.value,
    productType: el.productType.value,
    featuresRaw: el.productFeatures.value,
    audience: el.targetAudience.value,
    tone: el.writingTone.value,
  };
}

function handleGenerate(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const input = collectInput();
  state.lastInput = input;
  state.lastVariant = null;

  saveInputIfAllowed(input);

  showState("loading");
  el.generateBtn.disabled = true;

  // محاكاة زمن معالجة قصير وواقعي (لا يوجد استدعاء شبكة فعلي)
  setTimeout(() => {
    try {
      const result = generateProductCopy(input, null);
      state.lastVariant = result.variant;
      renderResult(result);
      trackEvent("generate_copy", { tone: input.tone });
    } catch (err) {
      el.errorStateMessage.textContent = "حدث خطأ غير متوقع أثناء إنشاء الوصف. حاول مرة أخرى.";
      showState("error");
    } finally {
      el.generateBtn.disabled = false;
    }
  }, 500);
}

function handleRegenerate() {
  if (!state.lastInput) return;

  el.regenerateBtn.disabled = true;
  const result = generateProductCopy(state.lastInput, state.lastVariant);
  state.lastVariant = result.variant;
  renderResult(result);
  el.regenerateBtn.disabled = false;
  trackEvent("regenerate_copy", { tone: state.lastInput.tone });
}

function handleClear() {
  el.form.reset();
  showFieldError("");
  showState("empty");
  state.lastInput = null;
  state.lastVariant = null;
  trackEvent("clear_form");
}

/* =========================================================
   7) COPY TO CLIPBOARD (with fallback)
   ========================================================= */

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch (err) {
    succeeded = false;
  }
  document.body.removeChild(textarea);
  return succeeded;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return fallbackCopy(text);
    }
  }
  return fallbackCopy(text);
}

function handleCopyClick(event) {
  const btn = event.target.closest(".copy-btn");
  if (!btn) return;

  const targetId = btn.getAttribute("data-copy-target");
  const text = getCopyableText(targetId);
  if (!text) return;

  copyText(text).then((success) => {
    if (success) {
      const originalLabel = btn.textContent;
      btn.textContent = "✓ تم النسخ";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = originalLabel;
        btn.classList.remove("copied");
      }, 1800);
      trackEvent("copy_section", { target: targetId });
    } else {
      showToast("تعذّر النسخ. حاول التحديد اليدوي.");
    }
  });
}

/* =========================================================
   8) LOCAL STORAGE
   ========================================================= */

function saveInputIfAllowed(input) {
  if (!el.saveLocallyToggle.checked) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
  } catch (err) {
    // التخزين غير متاح (خاص/ممتلئ) — تجاهل بصمت، الوظيفة الأساسية غير متأثرة
  }
}

function loadSavedInput() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    return;
  }
  if (!raw) return;

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    // بيانات تالفة — تجاهلها
    return;
  }

  if (!data || typeof data !== "object") return;

  if (typeof data.productName === "string") el.productName.value = data.productName;
  if (typeof data.productType === "string") el.productType.value = data.productType;
  if (typeof data.featuresRaw === "string") el.productFeatures.value = data.featuresRaw;
  if (typeof data.audience === "string") el.targetAudience.value = data.audience;
  if (typeof data.tone === "string" && TONE_LABELS[data.tone]) el.writingTone.value = data.tone;
}

function clearSavedInput() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    // تجاهل
  }
  showToast("تم مسح البيانات المحفوظة.");
  trackEvent("clear_storage");
}

/* =========================================================
   9) LEGAL MODAL (Privacy / Terms)
   ========================================================= */

const LEGAL_CONTENT = {
  privacy: {
    title: "سياسة الخصوصية",
    body: [
      "وصفني أداة تعمل بالكامل داخل متصفحك. لا يتم إرسال أي بيانات تُدخلها إلى أي خادم خارجي في هذه النسخة.",
      "قد يتم حفظ آخر بيانات أدخلتها في التخزين المحلي لمتصفحك (localStorage) فقط لتسهيل استخدامك للأداة لاحقًا، ويمكنك مسحها في أي وقت من زر \"مسح البيانات المحفوظة\".",
    ],
  },
  terms: {
    title: "شروط الاستخدام",
    body: [
      "هذه الأداة مقدَّمة \"كما هي\" لأغراض مساعدتك على صياغة أوصاف منتجاتك، دون أي ضمانات صريحة أو ضمنية.",
      "أنت مسؤول عن مراجعة النصوص الناتجة والتأكد من دقتها قبل استخدامها في متجرك أو منصاتك التسويقية.",
    ],
  },
};

function openModal(type) {
  const content = LEGAL_CONTENT[type];
  if (!content) return;

  el.modalTitle.textContent = content.title;
  el.modalBody.textContent = "";
  content.body.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    el.modalBody.appendChild(p);
  });

  el.legalModal.hidden = false;
  el.modalClose.focus();
}

function closeModal() {
  el.legalModal.hidden = true;
}

/* =========================================================
   10) EVENT BINDINGS
   ========================================================= */

el.form.addEventListener("submit", handleGenerate);
el.clearBtn.addEventListener("click", handleClear);
el.regenerateBtn.addEventListener("click", handleRegenerate);

el.productName.addEventListener("input", () => {
  if (el.productName.value.trim()) showFieldError("");
});

document.getElementById("resultArea").addEventListener("click", handleCopyClick);

el.clearStorageBtn.addEventListener("click", clearSavedInput);

el.heroCta.addEventListener("click", () => {
  document.getElementById("tool").scrollIntoView({ behavior: "smooth" });
  el.productName.focus();
});

el.privacyLink.addEventListener("click", () => openModal("privacy"));
el.termsLink.addEventListener("click", () => openModal("terms"));
el.modalClose.addEventListener("click", closeModal);
el.modalOverlay.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !el.legalModal.hidden) closeModal();
});

/* =========================================================
   11) INIT
   ========================================================= */

function init() {
  loadSavedInput();
  showState("empty");
}

init();
