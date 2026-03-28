import { bootCommon } from './common.js';
bootCommon('add');

const state = {step:1, category:'car', subtype:'sell', images:Array(9).fill(''), primary:2};
const stepNames = ['القسم','النوع','الصور','التفاصيل','التواصل','المراجعة'];
const subtypes = {
  car:[['sell','سيارات للبيع'],['rent','مركبات للإيجار']],
  part:[['engine','محركات'],['gearbox','كمبيو'],['battery','بطاريات'],['lights','فنارات']],
  service:[['diag','فحص كمبيوتر'],['rescue','إنقاذ سريع'],['electric','كهرباء سيارات'],['oil','تغيير زيوت']]
};

function render(){
  document.getElementById('app').innerHTML = `
  <main class="page">
    <section class="page-head"><div class="container">
      <h2 class="page-title">أضف إعلانًا فاخرًا</h2>
      <p class="page-sub">تجربة إضافة إعلان متعددة الخطوات، أنظف وأفخم.</p>
      <div class="steps">${stepNames.map((n,i)=>`<span class="step-pill ${state.step===i+1?'active':''}">${i+1}. ${n}</span>`).join('')}</div>
      ${renderStep()}
    </div></section>
  </main>`;
  bind();
}
function renderStep(){
  if(state.step===1) return `
    <div class="step-card">
      <h3 class="section-title">ما الذي تود بيعه أو الإعلان عنه؟</h3>
      <p class="section-desc">اختر القسم المناسب.</p>
      <div class="category-grid" style="margin-top:16px">
        <button class="section-card choose-cat" data-cat="car"><div class="mini">1</div><h4>سيارات ومركبات</h4><p>سيارات للبيع والإيجار.</p></button>
        <button class="section-card choose-cat" data-cat="part"><div class="mini">2</div><h4>قطع غيار</h4><p>محركات، كمبيو، بطاريات، جنوط.</p></button>
        <button class="section-card choose-cat" data-cat="service"><div class="mini">3</div><h4>خدمات متنقلة</h4><p>فحص، كهرباء، إنقاذ سريع.</p></button>
      </div>
      <div class="actions"><span></span><button class="primary-btn next-btn">التالي</button></div>
    </div>`;
  if(state.step===2) return `
    <div class="step-card">
      <h3 class="section-title">اختر النوع الفرعي</h3>
      <div class="list-card" style="margin-top:16px">
        ${subtypes[state.category].map(([v,t])=>`<button class="list-row choose-sub" data-sub="${v}" style="width:100%;background:none;border:none;text-align:inherit"><span>${t}</span><span>←</span></button>`).join('')}
      </div>
      <div class="actions"><button class="soft-btn prev-btn">السابق</button><button class="primary-btn next-btn">التالي</button></div>
    </div>`;
  if(state.step===3) return `
    <div class="step-card">
      <h3 class="section-title">أضف صور الإعلان</h3>
      <div class="info-box">
        <div>يمكن إضافة 30 صورة.</div>
        <div>الصور تزيد عدد المشاهدات.</div>
        <div>اختر صورة رئيسية واضحة.</div>
      </div>
      <label style="display:flex;align-items:center;gap:10px;margin:16px 0"><input type="checkbox" checked> إخفاء رقم اللوحة</label>
      <div class="upload-grid">
        ${Array.from({length:9}).map((_,i)=>`
          <label class="upload-slot ${state.primary===i?'primary':''}">
            ${state.images[i] ? `<img src="${state.images[i]}">` : ''}
            <span>${state.primary===i?'الرئيسية':'إضافة صورة'}</span>
            <input type="file" accept="image/*" data-upload="${i}">
          </label>`).join('')}
      </div>
      <div class="actions"><button class="soft-btn prev-btn">السابق</button><button class="primary-btn next-btn">التالي</button></div>
    </div>`;
  if(state.step===4) return `
    <div class="step-card">
      <h3 class="section-title">تفاصيل الإعلان</h3>
      <div class="form-grid" style="margin-top:16px">
        <div><label>العنوان</label><input placeholder="مثال: سوناتا 2016 أو كمبيو أوبتيما"></div>
        <div><label>السعر</label><input type="number" placeholder="مثال: 45000"></div>
        <div><label>الماركة</label><input placeholder="Hyundai / Kia"></div>
        <div><label>الموديل</label><input placeholder="Sonata / K5"></div>
        <div><label>السنة</label><input type="number" placeholder="2016"></div>
        <div><label>المدينة</label><input placeholder="طرابلس"></div>
        <div style="grid-column:1/-1"><label>المسافة / الحالة</label><input placeholder="95,000 كم أو جديدة"></div>
        <div style="grid-column:1/-1"><label>الوصف</label><textarea placeholder="اكتب تفاصيل الإعلان"></textarea></div>
      </div>
      <div class="actions"><button class="soft-btn prev-btn">السابق</button><button class="primary-btn next-btn">التالي</button></div>
    </div>`;
  if(state.step===5) return `
    <div class="step-card">
      <h3 class="section-title">بيانات التواصل</h3>
      <div class="form-grid" style="margin-top:16px">
        <div><label>الاسم</label><input placeholder="اسمك أو اسم النشاط"></div>
        <div><label>رقم الهاتف</label><input placeholder="0912345678"></div>
        <div><label>واتساب</label><input placeholder="0912345678"></div>
        <div><label>المدينة</label><input placeholder="طرابلس"></div>
      </div>
      <div class="actions"><button class="soft-btn prev-btn">السابق</button><button class="primary-btn next-btn">التالي</button></div>
    </div>`;
  return `
    <div class="step-card">
      <h3 class="section-title">المراجعة قبل النشر</h3>
      <div class="review-grid" style="margin-top:16px">
        <div class="review-box"><h4>القسم</h4><p>${state.category}</p></div>
        <div class="review-box"><h4>النوع</h4><p>${state.subtype}</p></div>
        <div class="review-box"><h4>الصور</h4><p>${state.images.filter(Boolean).length} صور</p></div>
        <div class="review-box"><h4>الحالة</h4><p>سيتم الإرسال للمراجعة</p></div>
      </div>
      <div class="actions"><button class="soft-btn prev-btn">السابق</button><button class="primary-btn" id="sendBtn">إرسال الإعلان</button></div>
    </div>`;
}
function bind(){
  document.querySelectorAll('.choose-cat').forEach(btn=>btn.onclick=()=>state.category=btn.dataset.cat);
  document.querySelectorAll('.choose-sub').forEach(btn=>btn.onclick=()=>state.subtype=btn.dataset.sub);
  document.querySelectorAll('.prev-btn').forEach(btn=>btn.onclick=()=>{state.step=Math.max(1,state.step-1);render();});
  document.querySelectorAll('.next-btn').forEach(btn=>btn.onclick=()=>{state.step=Math.min(6,state.step+1);render();});
  document.querySelectorAll('[data-upload]').forEach(inp=>inp.addEventListener('change', e=>{
    const idx = Number(inp.dataset.upload);
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{state.images[idx]=reader.result;state.primary=idx;render();};
    reader.readAsDataURL(file);
  }));
  const send = document.getElementById('sendBtn');
  if(send) send.onclick = ()=> alert('تم تجهيز النسخة النظيفة. المرحلة التالية: ربط الحفظ الحقيقي مع Firebase.');
}
render();