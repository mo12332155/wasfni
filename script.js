// Local Storage Demo Counter Keys
const STORAGE_KEY_USAGE = 'wasfni_usage_count';
const MAX_FREE_USAGE = 5;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  updateUsageDisplay();
});

// Get current usage count
function getUsageCount() {
  const saved = localStorage.getItem(STORAGE_KEY_USAGE);
  return saved ? parseInt(saved, 10) : 0;
}

// Update Usage Count Display & Limit Check
function updateUsageDisplay() {
  const count = getUsageCount();
  const countElem = document.getElementById('usage-count');
  const bannerElem = document.getElementById('usage-banner');
  const generateBtn = document.getElementById('generate-btn');

  if (countElem) {
    countElem.textContent = count;
  }

  if (bannerElem) {
    if (count >= MAX_FREE_USAGE) {
      bannerElem.classList.add('limit-reached');
      bannerElem.innerHTML = `
        <span>استهلكت استخداماتك المجانية (5/5). يمكنك طلب Pro للحصول على استخدام أكبر.</span>
        <button type="button" onclick="openProModal()" class="btn btn-primary" style="margin-right:10px; padding:4px 12px; font-size:0.85rem;">تواصل لطلب Pro</button>
      `;
    } else {
      bannerElem.classList.remove('limit-reached');
      bannerElem.innerHTML = `<span>استخدمت <strong id="usage-count">${count}</strong> من ${MAX_FREE_USAGE} أوصاف مجانية</span>`;
    }
  }
}

// Increment Usage Count
function incrementUsage() {
  let count = getUsageCount();
  count += 1;
  localStorage.setItem(STORAGE_KEY_USAGE, count.toString());
  updateUsageDisplay();
}

// Main Copy Generation Function
function generateProductCopy() {
  const nameInput = document.getElementById('product-name');
  const featuresInput = document.getElementById('product-features');
  const toneSelect = document.getElementById('tone-select');

  const productName = nameInput ? nameInput.value.trim() : '';
  const productFeatures = featuresInput ? featuresInput.value.trim() : '';
  const tone = toneSelect ? toneSelect.value : 'friendly';

  if (!productName) {
    showToast('يرجى كتابة اسم المنتج أولاً.');
    if (nameInput) nameInput.focus();
    return;
  }

  // Local Usage Limit Check
  const currentUsage = getUsageCount();
  if (currentUsage >= MAX_FREE_USAGE) {
    showToast('استهلكت استخداماتك المجانية. يمكنك طلب Pro للحصول على استخدام أكبر.');
    openProModal();
    return;
  }

  // Show Loading State
  showState('loading');

  // Simulate Generation Delay
  setTimeout(() => {
    try {
      // Build Output Content based on input
      const title = `${productName} — الاختيار الأمثل لاحتياجك`;
      
      let desc = '';
      if (tone === 'professional') {
        desc = `تم تصميم ${productName} خصيصاً ليقدم لك أعلى مستويات الجودة والأداء. يعتمد على حلول مدروسة لتلبية تطلعاتك بكفاءة عالية.`;
      } else if (tone === 'enthusiastic') {
        desc = `لا تفوّت فرصة الحصول على ${productName}! المنتج الأكثر روعة الذي سيغير تجربتك بالكامل ويمنحك التميز الذي تستحقه اليوم!`;
      } else {
        desc = `استمتع بتجربة فريدة مع ${productName}. صُمم بحب وعناية ليكون الخيار الأنسب لك في كل وقت.`;
      }

      const featureItems = productFeatures
        ? productFeatures.split(/,|\n/).map(f => f.trim()).filter(f => f.length > 0)
        : ['جودة ممتازة وسعر مناسب', 'سهولة الاستخدام والراحة', 'تصميم عصري وجذاب'];

      const cta = `اطلب ${productName} الآن واستفد من العرض الحصري قبل نفاذ الكمية!`;
      const social = `✨ هل تبحث عن ${productName}؟\nالحل الجاهز بين يديك الآن! 🚀\nاطلبه اليوم واحصل على أفضل تجربة. #وصفني #${productName.replace(/\s+/g, '_')}`;

      // Populate Result Fields
      document.getElementById('title-output').textContent = title;
      document.getElementById('desc-output').textContent = desc;
      
      const featuresUl = document.getElementById('features-output');
      featuresUl.innerHTML = '';
      featureItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        featuresUl.appendChild(li);
      });

      document.getElementById('cta-output').textContent = cta;
      document.getElementById('social-output').textContent = social;

      // Increment Usage Counter
      incrementUsage();

      // Display Content State
      showState('content');

    } catch (err) {
      showError('حدث خطأ أثناء إعداد الوصف. يرجى المحاولة مرة أخرى.');
    }
  }, 700);
}

// UI State Switcher
function showState(stateName) {
  const placeholder = document.getElementById('result-placeholder');
  const loading = document.getElementById('result-loading');
  const error = document.getElementById('result-error');
  const content = document.getElementById('result-content');

  if (placeholder) placeholder.hidden = (stateName !== 'placeholder');
  if (loading) loading.hidden = (stateName !== 'loading');
  if (error) error.hidden = (stateName !== 'error');
  if (content) content.hidden = (stateName !== 'content');
}

// Show Error
function showError(message) {
  const errorText = document.getElementById('error-text');
  if (errorText) errorText.textContent = message;
  showState('error');
}

// Form Clear
function clearForm() {
  document.getElementById('product-name').value = '';
  document.getElementById('product-features').value = '';
  document.getElementById('tone-select').selectedIndex = 0;
  showState('placeholder');
}

// Copy Text Helper
function copyText(elementId) {
  const elem = document.getElementById(elementId);
  if (!elem) return;

  let textToCopy = '';
  if (elem.tagName === 'UL') {
    textToCopy = Array.from(elem.querySelectorAll('li')).map(li => `• ${li.textContent}`).join('\n');
  } else {
    textToCopy = elem.textContent;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('تم النسخ بنجاح!');
    }).catch(() => {
      fallbackCopy(textToCopy);
    });
  } else {
    fallbackCopy(textToCopy);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('تم النسخ بنجاح!');
  } catch (err) {
    showToast('تعذر النسخ تلقائياً.');
  }
  document.body.removeChild(textArea);
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(() => {
    toast.hidden = true;
  }, 2500);
}

// Pro Modal Controls
function openProModal() {
  const modal = document.getElementById('pro-modal');
  if (modal) {
    modal.hidden = false;
  }
}

function closeProModal() {
  const modal = document.getElementById('pro-modal');
  if (modal) {
    modal.hidden = true;
  }
}

function closeProModalOnBackdrop(event) {
  if (event.target.id === 'pro-modal') {
    closeProModal();
  }
}
