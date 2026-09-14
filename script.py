import os
import re

d = r'c:\Users\DELL\Downloads\gida-site\gida-site'

# about.html
p1 = os.path.join(d, 'about.html')
with open(p1, 'r', encoding='utf-8') as f:
    c1 = f.read()

rep1 = '''      <div class="team-grid reveal mt-xl" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:24px;">
        <div class="team-member">
          <img src="assets/img/director.jpg" alt="Executive Director" style="width:100%;border-radius:8px;object-fit:cover;aspect-ratio:1/1;">
          <h4 class="mt-s">Amina Yusuf</h4>
          <p class="body-text" style="font-size:0.9em;color:#666">Executive Director</p>
        </div>
      </div>'''

c1 = re.sub(r'<div class="notice reveal mt-xl">Board of Directors.*?</div\>', rep1, c1, flags=re.DOTALL)
with open(p1, 'w', encoding='utf-8') as f:
    f.write(c1)

# programs.html
p2 = os.path.join(d, 'programs.html')
with open(p2, 'r', encoding='utf-8') as f:
    c2 = f.read()

rep2 = '''      <div class="gallery-grid reveal mt-xl" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:24px;">
        <img src="assets/img/agri.jpg" alt="Agricultural program" style="width:100%;border-radius:8px;object-fit:cover;">
        <img src="assets/img/market.jpg" alt="Market systems" style="width:100%;border-radius:8px;object-fit:cover;">
      </div>'''

c2 = re.sub(r'<div class="notice reveal mt-xl".*?>No program photography.*?</div\>', rep2, c2, flags=re.DOTALL)
with open(p2, 'w', encoding='utf-8') as f:
    f.write(c2)
