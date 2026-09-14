import re

# UPDATE ABOUT.HTML
with open('about.html', 'r', encoding='utf-8') as f:
    about = f.read()

about = re.sub(
    r'<div class="placeholder-note">Executive Director portrait<br>to be supplied</div>',
    r'<img src="assets/img/director.jpg" alt="Executive Director" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">',
    about
)

team_grid = '''<div class="team-grid reveal mt-xl" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:24px;">
  <div class="team-member">
    <img src="assets/img/team1.jpg" alt="David Ojo" class="team-member-img">
    <h4>David Ojo</h4>
    <p>Board Chairman</p>
  </div>
  <div class="team-member">
    <img src="assets/img/team2.jpg" alt="Dr. Sarah Okafor" class="team-member-img">
    <h4>Dr. Sarah Okafor</h4>
    <p>Director of Programs</p>
  </div>
  <div class="team-member">
    <img src="assets/img/director.jpg" alt="Amina Yusuf" class="team-member-img">
    <h4>Amina Yusuf</h4>
    <p>Executive Director</p>
  </div>
  <div class="team-member">
    <img src="assets/img/market.jpg" alt="Fatima Bello" class="team-member-img" style="filter:grayscale(1);">
    <h4>Fatima Bello</h4>
    <p>Operations Manager</p>
  </div>
  <div class="team-member">
    <img src="assets/img/agri.jpg" alt="Kalu Iheanacho" class="team-member-img" style="filter:grayscale(1);">
    <h4>Kalu Iheanacho</h4>
    <p>Finance Director</p>
  </div>
</div>'''

about = re.sub(r'<div class="team-grid reveal mt-xl".*?</div>\s*</div>', team_grid, about, flags=re.DOTALL)

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(about)

# UPDATE SAFEGUARDING.HTML
with open('safeguarding.html', 'r', encoding='utf-8') as f:
    safe = f.read()

articles_grid = '''<div class="article-grid mt-xl reveal-stagger">
  <div class="article-card">
    <img src="assets/img/market.jpg" alt="Article Image" class="article-img">
    <div class="article-content">
      <span class="article-tag">Policy Framework</span>
      <h3 class="article-title">Institutional GESI & Safeguarding Policy</h3>
      <p class="article-excerpt">A comprehensive zero-tolerance framework designed to protect vulnerable communities from exploitation and enforce dignity across all operations.</p>
      <div class="article-actions">
        <button class="action-btn"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> 124</button>
        <button class="action-btn"><svg viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg> 45</button>
        <button class="action-btn"><svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg> Share</button>
      </div>
    </div>
  </div>
  <div class="article-card">
    <img src="assets/img/agri.jpg" alt="Article Image" class="article-img">
    <div class="article-content">
      <span class="article-tag">Strategy</span>
      <h3 class="article-title">Strategic Plan Executive Summary, 2026-2030</h3>
      <p class="article-excerpt">Our 5-year vision and roadmap for transforming rural agriculture, market systems, and resilient infrastructure across Nigeria.</p>
      <div class="article-actions">
        <button class="action-btn"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> 89</button>
        <button class="action-btn"><svg viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg> 22</button>
        <button class="action-btn"><svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg> Share</button>
      </div>
    </div>
  </div>
</div>'''

safe = re.sub(r'<div class="mt-xl reveal-stagger">.*?</div>\s*</div>', articles_grid, safe, flags=re.DOTALL)

with open('safeguarding.html', 'w', encoding='utf-8') as f:
    f.write(safe)

# UPDATE INDEX.HTML
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

idx = re.sub(r'<div class="mt-xl reveal-stagger">.*?</div>\s*</div>', articles_grid, idx, flags=re.DOTALL)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx)

