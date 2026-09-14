import re

# 1. Update safeguarding.html (Pillars -> hover cards, Vetting -> colorful cards)
with open('safeguarding.html', 'r', encoding='utf-8') as f:
    safe = f.read()

def replace_safe_pillar(match):
    num = match.group(1)
    title = match.group(2)
    ul = match.group(3)
    return f'''<article class="pillar-card">
  <div class="pillar-header">
    <span class="pillar-num">{num}</span>
    <div class="pillar-title-area">
      <span class="tag">Policy</span>
      <h3>{title}</h3>
    </div>
  </div>
  <div class="pillar-details">
    <ul class="pillar-sub">
      {ul}
    </ul>
  </div>
</article>'''

safe = re.sub(
    r'<div class="pillar-row">\s*<span class="num">(.*?)</span>\s*<div>\s*<h3>(.*?)</h3>\s*<ul class="pillar-sub">(.*?)</ul>\s*</div>\s*</div>',
    replace_safe_pillar,
    safe,
    flags=re.DOTALL
)

# Vetting cards
vetting_html = '''<div class="vetting-grid mt-xl reveal-stagger" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:24px;">
  <div class="vetting-card" style="background:#e8f5e9; padding:32px; border-radius:12px; transition:0.4s; cursor:default; border:1px solid #c8e6c9;">
    <h4 style="color:#2e7d32; margin-bottom:12px; font-size:1.25rem;">Employee vetting</h4>
    <p style="color:#444;">Mandatory background and reference checks for all staff, consultants, and field enumerators prior to engagement.</p>
  </div>
  <div class="vetting-card" style="background:#e3f2fd; padding:32px; border-radius:12px; transition:0.4s; cursor:default; border:1px solid #bbdefb;">
    <h4 style="color:#1565c0; margin-bottom:12px; font-size:1.25rem;">Binding partner addendum</h4>
    <p style="color:#444;">All partners and contractors must sign the GIDA Safeguarding Code of Conduct Addendum as a binding condition of contract execution.</p>
  </div>
  <div class="vetting-card" style="background:#fff3e0; padding:32px; border-radius:12px; transition:0.4s; cursor:default; border:1px solid #ffe0b2;">
    <h4 style="color:#ef6c00; margin-bottom:12px; font-size:1.25rem;">Annual policy audit</h4>
    <p style="color:#444;">Reviewed annually by the Lead - Inclusive Development to maintain compliance with evolving donor regulations.</p>
  </div>
</div>'''

safe = re.sub(r'<ul class="side-list mt-xl reveal-stagger"[^>]*>.*?</ul>', vetting_html, safe, flags=re.DOTALL)

with open('safeguarding.html', 'w', encoding='utf-8') as f:
    f.write(safe)


# 2. Update about.html (Fix broken image)
with open('about.html', 'r', encoding='utf-8') as f:
    about = f.read()
about = about.replace('assets/img/program_agri.jpg', 'assets/img/agri.jpg')
with open('about.html', 'w', encoding='utf-8') as f:
    f.write(about)


# 3. Update programs.html (Project Popup)
with open('programs.html', 'r', encoding='utf-8') as f:
    prog = f.read()

# I will wrap the images in an <a> tag that opens the article.html page so they "pop up and see the full projects".
# Or, even better, just add a class that JS will catch and trigger a modal.
prog = prog.replace('<img src="assets/img/agri.jpg"', '<img src="assets/img/agri.jpg" class="project-img"')
prog = prog.replace('<img src="assets/img/market.jpg"', '<img src="assets/img/market.jpg" class="project-img"')
with open('programs.html', 'w', encoding='utf-8') as f:
    f.write(prog)


# 4. Update contact.html (Hero background & map)
with open('contact.html', 'r', encoding='utf-8') as f:
    contact = f.read()

contact = contact.replace('<section class="page-head">', '<section class="page-head" style="background-image: url(\'assets/img/market.jpg\');">')

map_iframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124844.75782782721!2d8.441029177112042!3d11.996160912128795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11ae80f7cb679fcd%3A0xc6b659c4033ec090!2sKano%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1714421160352!5m2!1sen!2sus" width="100%" height="250" style="border:0; border-radius:12px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
contact = re.sub(r'<div class="placeholder-note"[^>]*>Interactive map<br>to be embedded</div>', map_iframe, contact)

with open('contact.html', 'w', encoding='utf-8') as f:
    f.write(contact)


# 5. Update index.html (5 pillars compact)
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

compact_pillars = '''<div class="quick-pillars mt-xl reveal-stagger" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
  <a href="programs.html#pillar-1" class="quick-pillar-card">
    <span class="num">01</span>
    <h4>Inclusive Market Systems</h4>
  </a>
  <a href="programs.html#pillar-2" class="quick-pillar-card">
    <span class="num">02</span>
    <h4>Green Infrastructure</h4>
  </a>
  <a href="programs.html#pillar-3" class="quick-pillar-card">
    <span class="num">03</span>
    <h4>Planetary Health</h4>
  </a>
  <a href="programs.html#pillar-4" class="quick-pillar-card">
    <span class="num">04</span>
    <h4>Gender Transformation</h4>
  </a>
  <a href="programs.html#pillar-5" class="quick-pillar-card">
    <span class="num">05</span>
    <h4>Local Governance</h4>
  </a>
</div>'''

idx = re.sub(r'<div class="pillar-list mt-xl reveal-stagger">.*?</div>\s*<a class="btn btn-ghost mt-l"', compact_pillars + '\n<a class="btn btn-ghost mt-l"', idx, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx)

# 6. Update style.css
with open('assets/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

css += '''
.vetting-card:hover { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(0,0,0,0.1); }
.quick-pillar-card {
  background: var(--surface, #fff);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.quick-pillar-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  border-color: var(--gold);
}
.quick-pillar-card .num {
  font-size: 2rem;
  font-weight: 800;
  color: var(--gold);
  line-height: 1;
}
.quick-pillar-card h4 {
  color: var(--teal-dark);
  font-size: 1.1rem;
  font-family: var(--font-head);
  margin: 0;
}
.project-img { cursor: pointer; transition: all 0.3s; }
.project-img:hover { transform: scale(1.03); box-shadow: 0 12px 30px rgba(0,0,0,0.2); }

/* Modal Styles */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8); z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none; transition: 0.3s;
}
.modal-overlay.active { opacity: 1; pointer-events: auto; }
.modal-content {
  background: #fff; width: 90%; max-width: 800px;
  border-radius: 12px; overflow: hidden; position: relative;
  transform: translateY(20px); transition: 0.3s;
}
.modal-overlay.active .modal-content { transform: translateY(0); }
.modal-close {
  position: absolute; top: 16px; right: 16px;
  background: rgba(0,0,0,0.5); color: #fff;
  border: none; border-radius: 50%; width: 36px; height: 36px;
  font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.modal-img { width: 100%; height: 350px; object-fit: cover; }
.modal-body { padding: 32px; }
.modal-body h3 { margin-bottom: 12px; color: var(--teal-dark); font-family: var(--font-head); font-size: 1.5rem; }
.modal-body p { color: #555; line-height: 1.6; margin-bottom: 24px; }
'''

with open('assets/css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

# 7. Update main.js for project modal
js = '''
document.addEventListener('DOMContentLoaded', () => {
  const projImgs = document.querySelectorAll('.project-img');
  if(projImgs.length > 0) {
    // Inject modal HTML
    const modalHtml = 
      <div class="modal-overlay" id="projModal">
        <div class="modal-content">
          <button class="modal-close" id="projClose">&times;</button>
          <img src="" class="modal-img" id="projImg">
          <div class="modal-body">
            <h3 id="projTitle">Project Title</h3>
            <p>This is a full view of the field project. GIDA implements comprehensive documentation and reporting for all initiatives to ensure transparent and measurable rural impact. Read the full case study to see how this translates into sustainable community growth.</p>
            <a href="article.html" class="btn btn-gold">Read Full Case Study</a>
          </div>
        </div>
      </div>
    ;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = document.getElementById('projModal');
    const close = document.getElementById('projClose');
    const mImg = document.getElementById('projImg');
    const mTitle = document.getElementById('projTitle');
    
    projImgs.forEach(img => {
      img.addEventListener('click', () => {
        mImg.src = img.src;
        mTitle.innerText = img.alt;
        modal.classList.add('active');
      });
    });
    
    close.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('active'); });
  }
});
'''

with open('assets/js/main.js', 'a', encoding='utf-8') as f:
    f.write(js)

