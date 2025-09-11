// --- Landing Logic ---
function setupLanding(){
  const exploreBtn = document.getElementById('exploreBtn');

  exploreBtn.addEventListener('click', ()=>{
    const name = document.getElementById('username').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const type = document.getElementById('userType').value;
    const remember = document.getElementById('rememberMe').checked;

    if(!name || !email){
      alert("Please enter your name and email before exploring.");
      return;
    }

    // ✅ Save only if Remember Me is checked
    if(remember){
      localStorage.setItem('nsn_user', JSON.stringify({name,email,type}));
    } else {
      localStorage.removeItem('nsn_user'); // clear any old saved data
    }

    // Load homepage
    loadHomepage(name);
  });
}

                  // LOGIN ENDS //



               // NAVBAR // 

function loadHomepage(name){
  // Hide login, show homepage + second navbar
  document.getElementById('landingSection').classList.add('d-none');
  document.getElementById('homeSection').classList.remove('d-none');
  document.getElementById('mainNavbar').classList.remove('d-none'); 

  // Greeting inside navbar
  const greet = `Welcome, ${name}!`;
  if(document.getElementById('greeting')){
    document.getElementById('greeting').textContent = greet;
  }

  // Auto-open Career Bank
  showTab('career');
}



// --- Navbar Logic ---
function setupNavbar(){
  document.querySelectorAll('.nav-link').forEach(link=>{
    link.addEventListener('click', e=>{
      e.preventDefault();
      const tab = link.dataset.tab;
      if(!tab) return;

      // hide all sections
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('d-none'));
      // show clicked one
      const pane = document.getElementById(tab);
      if(pane) pane.classList.remove('d-none');

      // update active link
      document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function showTab(tabName){
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('d-none'));
  document.getElementById(tabName).classList.remove('d-none');

  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  document.querySelector(`.nav-link[data-tab="${tabName}"]`).classList.add('active');
}

// --- App logic ---
(function(){
  // Utility helpers
  const $ = (s, ctx=document)=> ctx.querySelector(s);
  const $$ = (s, ctx=document)=> Array.from(ctx.querySelectorAll(s));

  // State
  let state = {
    userType: 'student',
    username: '',
    recentlyViewed: []
  };

  // Init
  function init(){
    setupClock();
    setupGeo();
    simulateVisitor();
    setupLanding();
    setupNavbar();
    setupSlider();
    populateData();
    bindFilters();
    bindBookmarks();
    bindFeedback();
    updateStatuses();

    // 🔹 Auto-login check
    const saved = localStorage.getItem('nsn_user');
    if(saved){
      const user = JSON.parse(saved);
      loadHomepage(user.name || "Explorer");
    }
  }

  // --- Clock ---
  function setupClock(){
    function tick(){
      const now=new Date();
      $('#clock').textContent = now.toLocaleTimeString();
    }
    tick(); setInterval(tick,1000);
  }

  // --- Geolocation ---
  function setupGeo(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos=>{
        $('#location').textContent = `Location: ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`;
      }, err=>{
        $('#location').textContent = 'Location: (permission denied or unavailable)';
      });
    } else $('#location').textContent = 'Location: (not supported)';
  }

  // --- Visitor counter ---
  function simulateVisitor(){
    const key='nsn_visitors_v1';
    let n = Number(localStorage.getItem(key) || 1245);
    n += Math.floor(Math.random()*3+1);
    localStorage.setItem(key, n);
    $('#visitor').textContent = n.toLocaleString();
  }

  // --- Populate data-driven UI ---
  function populateData(){
    // Career industries
    const industries = ['all', ...new Set(DATA.careers.map(c=>c.industry))];
    const industrySelect = $('#filterIndustry');
    industries.forEach(i=>{
      const opt=document.createElement('option');
      opt.value=i; opt.textContent=i;
      industrySelect.appendChild(opt);
    });

    // Career list
    renderCareers(DATA.careers);

    // Quiz interests
    const qsel = $('#quizInterest');
    DATA.quizzes.forEach(q=>{
      const o=document.createElement('option');
      o.value=q.interest; o.textContent=q.interest;
      qsel.appendChild(o);
    });

    // Media
    renderMedia(DATA.media);

    // Stories
    renderStories(DATA.stories);

    // Resources
    renderResources(DATA.resources);
  }

  // --- Careers ---
  function renderCareers(list){
    const container = $('#careerList'); container.innerHTML='';
    list.forEach(c=>{
      const col = document.createElement('div'); col.className='col-md-6';
      col.innerHTML = `
        <div class="card card-body card-custom h-100">
          <div class="d-flex gap-3">
            <img src="${c.img}" alt="${c.title}" style="width:96px;height:72px;object-fit:cover;border-radius:6px">
            <div>
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="mb-1">${c.title}</h5>
                <div><span class="badge bg-light text-muted">${c.industry}</span></div>
              </div>
              <p class="small-muted mb-1">${c.desc}</p>
              <div class="small-muted mb-2">Education: ${c.education} • Skills: ${c.skills.join(', ')}</div>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-accent add-bookmark" data-id="${c.id}">Bookmark</button>
                <button class="btn btn-sm btn-outline-secondary view-detail" data-id="${c.id}">View</button>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(col);
    });

    // attach events
    $$('.add-bookmark').forEach(b=> b.addEventListener('click', e=>{
      const id=Number(e.currentTarget.dataset.id); addBookmark('career', id);
    }));
    $$('.view-detail').forEach(b=> b.addEventListener('click', e=>{
      const id=Number(e.currentTarget.dataset.id); viewCareer(id);
    }));
  }

  function viewCareer(id){
    const item = DATA.careers.find(c=>c.id===id);
    if(!item) return;
    state.recentlyViewed.unshift({type:'career', id:item.id, title:item.title});
    if(state.recentlyViewed.length>10) state.recentlyViewed.pop();

    // show modal-style detail (simple alert for demo)
    alert(`${item.title}\n\n${item.desc}\n\nEducation: ${item.education}\nSkills: ${item.skills.join(', ')}\nSalary range: ${item.salary_min} - ${item.salary_max}`);
  }

  // --- Filters ---
  function bindFilters(){
    $('#filterIndustry').addEventListener('change', applyCareerFilters);
    $('#sortCareer').addEventListener('change', applyCareerFilters);
    $('#mediaFilter').addEventListener('change', ()=> renderMedia(DATA.media.filter(m=>$('#mediaFilter').value==='all' || m.category===$('#mediaFilter').value)));
    $('#startQuiz').addEventListener('click', startQuiz);
  }

  function applyCareerFilters(){
    const industry = $('#filterIndustry').value;
    const sort = $('#sortCareer').value;
    let list = DATA.careers.slice();
    if(industry!=='all') list = list.filter(c=>c.industry===industry);
    if(sort==='title') list.sort((a,b)=> a.title.localeCompare(b.title));
    if(sort==='salary-asc') list.sort((a,b)=> a.salary_min - b.salary_min);
    if(sort==='salary-desc') list.sort((a,b)=> b.salary_max - a.salary_max);
    renderCareers(list);
    renderRelated(list.slice(0,3));
  }

  function renderRelated(list){
    const r = $('#relatedCareers'); r.innerHTML='';
    list.forEach(c=>{
      const span=document.createElement('div'); span.className='chip';
      span.textContent=c.title; r.appendChild(span);
    });
  }

  // --- Media ---
  function renderMedia(list){
    const container = $('#mediaList'); container.innerHTML='';
    list.forEach(m=>{
      const col=document.createElement('div'); col.className='col-md-6';
      col.innerHTML = `<div class="card card-body card-custom"><h6>${m.title}</h6><p class="small-muted">${m.desc}</p><div style="aspect-ratio:16/9;"><iframe src="${m.url}" title="${m.title}" style="width:100%;height:100%;border:0" allowfullscreen></iframe></div></div>`;
      container.appendChild(col);
    });
  }

  // --- Stories ---
  function renderStories(list){
    const c = $('#storiesList'); c.innerHTML='';
    list.forEach(s=>{
      const col=document.createElement('div'); col.className='col-md-6';
      col.innerHTML = `<div class="card card-body card-custom"><div class="d-flex gap-3"><img src="${s.img}" alt="${s.name}" style="width:84px;height:84px;object-fit:cover;border-radius:8px"><div><h6>${s.name}</h6><div class="small-muted">${s.domain}</div><p class="small-muted">${s.summary}</p><div><button class="btn btn-sm btn-accent-outline share-story" data-id="${s.id}">Share</button></div></div></div></div>`;
      c.appendChild(col);
    });
    $$('.share-story').forEach(b=> b.addEventListener('click', e=>{
      const id=Number(e.currentTarget.dataset.id); const s = DATA.stories.find(x=>x.id===id);
      if(s) navigator.share ? navigator.share({title:s.name,text:s.summary}) : alert('Share: '+s.name+' - '+s.summary);
    }));
  }

  // --- Resources ---
  function renderResources(list){
    const c = $('#resourceList'); c.innerHTML='';
    list.forEach(r=>{
      const col=document.createElement('div'); col.className='col-md-6';
      col.innerHTML = `<div class="card card-body card-custom"><h6>${r.title} <small class="small-muted">(${r.type})</small></h6><p class="small-muted">${r.desc}</p><a class="link-like" href="${r.link}">Open Resource</a></div>`;
      c.appendChild(col);
    });
  }

  // --- Quiz ---
  function startQuiz(){
    const interest = $('#quizInterest').value;
    const q = DATA.quizzes.find(x=>x.interest===interest);
    if(!q) return;
    const area = $('#quizArea'); area.innerHTML='';
    q.questions.forEach((qq, idx)=>{
      const div=document.createElement('div'); div.className='mb-3';
      div.innerHTML = `<label class="form-label">${idx+1}. ${qq.q}</label>`;
      qq.options.forEach((opt,i)=>{
        const id = `q_${idx}_${i}`;
        const radio = document.createElement('div'); radio.className='form-check';
        radio.innerHTML = `<input class="form-check-input" type="radio" name="q_${idx}" id="${id}" value="${opt.v}"><label class="form-check-label" for="${id}">${opt.t}</label>`;
        div.appendChild(radio);
      });
      area.appendChild(div);
    });
    const submit=document.createElement('button'); submit.className='btn btn-accent'; submit.textContent='Get Recommendation';
    submit.addEventListener('click', ()=>{
      let score=0; q.questions.forEach((qq, idx)=>{ const v=document.querySelector(`input[name=q_${idx}]:checked`); if(v) score+=Number(v.value); });
      const res = score >= (q.questions.length*2 - 1) ? q.recommendations[0] : q.recommendations[1] || q.recommendations[0];
      $('#quizResult').innerHTML = `<div class="alert alert-success">Recommended path: <strong>${res}</strong></div>`;
    });
    area.appendChild(submit);
  }

  // --- Bookmarks ---
  function addBookmark(kind, id){
    const key='nsn_bookmarks_v1';
    const all = JSON.parse(localStorage.getItem(key) || '[]');
    let item = null; if(kind==='career') item = DATA.careers.find(x=>x.id===id);
    if(!item) return;
    if(all.find(x=>x.kind===kind && x.id===id)) { alert('Already bookmarked'); return; }
    const note = prompt('Add a short note for this bookmark (optional):','');
    all.push({kind,id,title:item.title,note,ts:Date.now()});
    localStorage.setItem(key, JSON.stringify(all));
    alert('Bookmarked: '+item.title);
    renderBookmarks();
  }

  function renderBookmarks(){
    const key='nsn_bookmarks_v1';
    const all = JSON.parse(localStorage.getItem(key) || '[]');
    const container = $('#bookmarkList'); container.innerHTML='';
    if(!all.length) container.innerHTML='<div class="small-muted">No bookmarks yet. Use "Bookmark" on careers or resources.</div>';
    all.forEach(b=>{
      const div=document.createElement('div'); div.className='p-2 mb-2 border rounded';
      div.innerHTML = `<div class="d-flex justify-content-between align-items-start"><div><strong>${b.title}</strong><div class="small-muted">${b.note || ''}</div></div><div><button class="btn btn-sm btn-outline-danger remove-bookmark" data-ts="${b.ts}">Remove</button></div></div>`;
      container.appendChild(div);
    });
    $$('.remove-bookmark').forEach(btn=> btn.addEventListener('click', e=>{
      const ts = Number(e.currentTarget.dataset.ts);
      const filtered = all.filter(x=> x.ts !== ts);
      localStorage.setItem('nsn_bookmarks_v1', JSON.stringify(filtered)); renderBookmarks();
    }));
  }

  function bindBookmarks(){
    $('#exportBookmarks').addEventListener('click', ()=>{
      const all = JSON.parse(localStorage.getItem('nsn_bookmarks_v1') || '[]');
      if(!all.length) return alert('No bookmarks to export');
      const lines = all.map(b=> `Title: ${b.title}\nNote: ${b.note || '-'}\nSaved: ${new Date(b.ts).toLocaleString()}\n---`);
      const blob = new Blob([lines.join('\n')], {type:'text/plain'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'nextstep_bookmarks.txt'; a.click(); URL.revokeObjectURL(url);
    });
    $('#clearBookmarks').addEventListener('click', ()=>{ if(confirm('Clear all bookmarks?')){ localStorage.removeItem('nsn_bookmarks_v1'); renderBookmarks(); } });
    renderBookmarks();
  }

  // --- Feedback ---
function bindFeedback() {
  const form = document.querySelector('#feedback form');
  const submitBtn = form.querySelector('button[type="button"]');

  if (!form || !submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const topic = form.querySelector('select').value;
    const message = form.querySelector('textarea').value.trim();

    if (!name) {
      alert("Please enter your name.");
      form.querySelector('input[type="text"]').focus();
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      form.querySelector('input[type="email"]').focus();
      return;
    }

    if (!topic) {
      alert("Please select a topic.");
      form.querySelector('select').focus();
      return;
    }

    if (!message) {
      alert("Please enter your message.");
      form.querySelector('textarea').focus();
      return;
    }

    alert("Thank you for your feedback! We appreciate it.");
    form.reset();
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

// Run after DOM is ready
document.addEventListener('DOMContentLoaded', bindFeedback);


async function updateStatuses() {
  try {
    const response = await fetch('data/team-schedule.json');
    const scheduleData = await response.json();

    const now = new Date();
    const day = now.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const currentHour = now.getHours() + now.getMinutes() / 60;

    document.querySelectorAll('.status').forEach(span => {
      const name = span.getAttribute('data-name');
      const schedule = scheduleData[name];
      if (!schedule) return;

      let hours = null;
      if (day >= 1 && day <= 5) {
        hours = schedule.monToFri;
      } else {
        hours = schedule.satSun;
      }

      let online = false;
      if (hours) {
        const [start, end] = hours.map(time => {
          const [h, m] = time.split(':').map(Number);
          return h + m / 60;
        });
        if (currentHour >= start && currentHour <= end) {
          online = true;
        }
      }

      span.classList.remove('online', 'offline');
      span.classList.add(online ? 'online' : 'offline');
      span.textContent = online ? '● Online' : '● Offline';
    });
  } catch (error) {
    console.error('Failed to load schedule data:', error);
  }
}

// Run it when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', updateStatuses);
setInterval(updateStatuses, 5 * 60 * 1000); // 5 mins

function setupSlider() {
  const imageSlider = document.getElementById("image-slider");
  const buttons = document.querySelectorAll(".img-btn");

  if (!imageSlider || buttons.length === 0) return;

  const slideImages = Array.from(buttons).map(btn => btn.getAttribute("data-src"));
  let currentIndex = 0;
  let interval;

  function updateSlide(index) {
    buttons.forEach(btn => btn.classList.remove("active"));
    buttons[index].classList.add("active");

    imageSlider.style.opacity = 0;
    setTimeout(() => {
      imageSlider.src = slideImages[index];
      imageSlider.style.opacity = 1;
    }, 200);
  }

  function autoSlide() {
    currentIndex = (currentIndex + 1) % slideImages.length;
    updateSlide(currentIndex);
  }

  function startAutoSlide() {
    interval = setInterval(autoSlide, 5000); // 5 seconds
  }

  function stopAutoSlide() {
    clearInterval(interval);
  }

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      stopAutoSlide();
      currentIndex = index;
      updateSlide(currentIndex);
      startAutoSlide(); // Restart autoplay
    });
  });

  // Start auto-slide on load
  startAutoSlide();
}


  // Start app
  window.addEventListener('DOMContentLoaded', init);
})();
