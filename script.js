<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>وصفني | اكتب وصف منتجك في ثوانٍ</title>
  <meta name="description" content="وصفني يساعدك على تحويل معلومات منتجك إلى وصف عربي جاهز للنشر والبيع.">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Header -->
  <header class="site-header">
    <div class="container header-container">
      <a href="#top" class="logo">وصفني</a>
      <nav aria-label="التنقل الرئيسي" class="main-nav">
        <a href="#tool">أداة التوليد</a>
        <a href="#pricing">الخطط والأسعار</a>
        <a href="#faq">الأسئلة الشائعة</a>
      </nav>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-container">
        <h1>اكتب وصف منتجك في ثوانٍ</h1>
        <p>وصفني يساعدك على تحويل معلومات منتجك إلى وصف عربي جاهز للنشر والبيع.</p>
      </div>
    </section>

    <!-- Generator Tool Section -->
    <section id="tool" class="tool-section">
      <div class="container">
        
        <!-- Banner/Counter for Local Free Limit Demo -->
        <div id="usage-banner" class="usage-banner" aria-live="polite">
          <span>استخدمت <strong id="usage-count">0</strong> من 5 أوصاف مجانية</span>
        </div>

        <div class="tool-grid">
          <!-- Input Form -->
          <div class="card form-card">
            <h2>بيانات المنتج</h2>
            <form id="product-form" onsubmit="event.preventDefault(); generateProductCopy();">
              <div class="form-group">
                <label for="product-name">اسم المنتج <span class="required">*</span></label>
                <input type="text" id="product-name" placeholder="مثال: حذاء رياضي مريح" required>
              </div>

              <div class="form-group">
                <label for="product-features">مميزات المنتج / التفاصيل</label>
                <textarea id="product-features" rows="4" placeholder="مثال: مريح للمشي الطويل، نعل طبي، خفيف الوزن، متوفر بألوان متعددة"></textarea>
              </div>

              <div class="form-group">
                <label for="tone-select">نبرة الكتابة</label>
                <select id="tone-select">
                  <option value="friendly">ودي وجذاب</option>
                  <option value="professional">احترافي ومباشر</option>
                  <option value="enthusiastic">حماسي ومشجع</option>
                </select>
              </div>

              <div class="form-actions">
                <button type="submit" id="generate-btn" class="btn btn-primary">إنشاء الوصف</button>
                <button type="button" id="clear-btn" class="btn btn-secondary" onclick="clearForm()">مسح</button>
              </div>
            </form>
          </div>

          <!-- Output Results -->
          <div class="card result-card">
            <h2>النتيجة</h2>
            <div aria-live="polite" id="result-container">
              <!-- Placeholder State -->
              <div id="result-placeholder" class="result-state">
                <p>املأ بيانات المنتج على اليمين ثم اضغط "إنشاء الوصف" لترى النتيجة هنا.</p>
              </div>

              <!-- Loading State -->
              <div id="result-loading" class="result-state" hidden>
                <div class="spinner" aria-hidden="true"></div>
                <p>جاري تجهيز الوصف...</p>
              </div>

              <!-- Error State -->
              <div id="result-error" class="result-state error-message" hidden>
                <p id="error-text"></p>
              </div>

              <!-- Content State -->
              <div id="result-content" class="result-state" hidden>
                <div class="result-block">
                  <div class="result-header">
                    <h3>عنوان المنتج</h3>
                    <button class="btn-copy" onclick="copyText('title-output')">نسخ</button>
                  </div>
                  <p id="title-output"></p>
                </div>

                <div class="result-block">
                  <div class="result-header">
                    <h3>الوصف التسويقي</h3>
                    <button class="btn-copy" onclick="copyText('desc-output')">نسخ</button>
                  </div>
                  <p id="desc-output"></p>
                </div>

                <div class="result-block">
                  <div class="result-header">
                    <h3>المميزات</h3>
                    <button class="btn-copy" onclick="copyText('features-output')">نسخ</button>
                  </div>
                  <ul id="features-output"></ul>
                </div>

                <div class="result-block">
                  <div class="result-header">
                    <h3>دعوة لاتخاذ إجراء (CTA)</h3>
                    <button class="btn-copy" onclick="copyText('cta-output')">نسخ</button>
                  </div>
                  <p id="cta-output"></p>
                </div>

                <div class="result-block">
                  <div class="result-header">
                    <h3>منشور قصير لسوشيال ميديا</h3>
                    <button class="btn-copy" onclick="copyText('social-output')">نسخ</button>
                  </div>
                  <p id="social-output"></p>
                </div>

                <div class="result-actions">
                  <button type="button" class="btn btn-secondary" onclick="generateProductCopy()">إعادة توليد</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing-section">
      <div class="container">
        <div class="section-title">
          <h2>اختر الخطة المناسبة لمشروعك</h2>
          <p>ابدأ مجانًا ورَقّ حسابك عندما تحتاج لنتائج أكبر وأسرع</p>
        </div>

        <div class="pricing-grid">
          <!-- FREE Plan -->
          <div class="pricing-card">
            <div class="plan-header">
              <h3>مجاني</h3>
              <div class="plan-price">0 <span>جنيه</span></div>
              <p>لتجربة الأداة وبدء كتابة أوصاف منتجاتك</p>
            </div>
            <ul class="plan-features">
              <li>✓ 5 أوصاف</li>
              <li>✓ عنوان المنتج</li>
              <li>✓ وصف المنتج</li>
              <li>✓ المميزات</li>
              <li>✓ نسخ النتيجة</li>
            </ul>
            <a href="#tool" class="btn btn-outline">استخدمه الآن مجاناً</a>
          </div>

          <!-- PRO Plan -->
          <div class="pricing-card plan-pro">
            <div class="badge">الأكثر طلباً</div>
            <div class="plan-header">
              <h3>Pro</h3>
              <div class="plan-price">50 <span>جنيه</span></div>
              <p>للمتاجر الإلكترونية وصُنّاع المحتوى المحترفين</p>
            </div>
            <ul class="plan-features">
              <li>✓ 100 وصف</li>
              <li>✓ إعادة توليد للنتائج</li>
              <li>✓ منشور قصير للسوشيال ميديا</li>
              <li>✓ نبرات كتابة إضافية</li>
              <li>✓ الوصول إلى الميزات الجديدة</li>
            </ul>
            <button type="button" class="btn btn-primary" onclick="openProModal()">احصل على Pro — 50 جنيه</button>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="faq-section">
      <div class="container">
        <div class="section-title">
          <h2>الأسئلة الشائعة</h2>
        </div>
        <div class="faq-list">
          <div class="faq-item">
            <h3>هل أحتاج إلى حساب؟</h3>
            <p>لا، يمكنك استخدام الأداة بدون تسجيل.</p>
          </div>
          <div class="faq-item">
            <h3>هل Pro متاح الآن؟</h3>
            <p>يتم تفعيل Pro بعد تأكيد الطلب والدفع.</p>
          </div>
          <div class="faq-item">
            <h3>هل يمكن تجربة الأداة مجانًا؟</h3>
            <p>نعم.</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container footer-container">
      <div>
        <p class="footer-logo">وصفني</p>
        <p>أداة عربية بسيطة لمساعدة أصحاب المشاريع على كتابة أوصاف أفضل لمنتجاتهم.</p>
      </div>
    </div>
  </footer>

  <!-- Pro Modal -->
  <div id="pro-modal" class="modal-backdrop" hidden onclick="closeProModalOnBackdrop(event)">
    <div class="modal-dialog" role="dialog" aria-labelledby="modal-title">
      <button class="modal-close" onclick="closeProModal()" aria-label="إغلاق">&times;</button>
      <div class="modal-header">
        <h2 id="modal-title">باقة Pro</h2>
        <div class="modal-price">50 جنيه</div>
      </div>
      <div class="modal-body">
        <p>لإتمام الطلب، تواصل معنا وسيتم تفعيل الباقة بعد تأكيد الدفع.</p>
      </div>
      <div class="modal-footer">
        <!-- Placeholder contact button (WhatsApp or Email placeholder) -->
        <a href="https://wa.me/200000000000?text=%D0%A3%D1%80%D0%B8%D0%B4%20%D0%B7%D0%B0%D0%BB%D0%B1%20%D0%B1%D0%B0%D0%20Pro" target="_blank" rel="noopener" class="btn btn-primary btn-block">تواصل لطلب Pro</a>
        <button type="button" class="btn btn-secondary btn-block" onclick="closeProModal()">إلغاء</button>
      </div>
    </div>
  </div>

  <!-- Status / Toast Notification -->
  <div id="toast" class="toast" aria-live="polite" role="status" hidden></div>

  <script src="app.js"></script>
</body>
</html>
