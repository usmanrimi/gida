import re

# 1. INDEX.HTML Updates
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

# Remove trust-bar
idx = re.sub(r'<!-- DONOR & COMPLIANCE TRUST BAR -->.*?</section>', '', idx, flags=re.DOTALL)
idx = re.sub(r'<section class="trust-bar">.*?</section>', '', idx, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx)

# 2. ABOUT.HTML Updates
with open('about.html', 'r', encoding='utf-8') as f:
    about = f.read()

# Revert hero text
bad_lede = 'Growth Innovation for Development Action (GIDA) is a development organization committed to building inclusive, healthy, green, and resilient rural communities. We empower people through sustainable livelihoods, market opportunities, green infrastructure, community health, innovation, and social inclusion. Creating spaces where people prosper.'
original_lede = 'GIDA bridges cutting-edge science, market systems engineering, and community-led execution, as an incorporated Company Limited by Guarantee dedicated to public impact.'
about = about.replace(bad_lede, original_lede)

# Remove Organization profile / History section and replace with the text they wanted
org_text = 'Growth Innovation for Development Action (GIDA) is a development organization committed to building inclusive, healthy, green, and resilient rural communities. We empower people through sustainable livelihoods, market opportunities, green infrastructure, community health, innovation, and social inclusion. Creating spaces where people prosper.'

new_section = f'''
<section class="section-pad">
  <div class="wrap" style="display:grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;">
    <div class="reveal">
      <h2 class="h-2">About Us</h2>
      <p class="body-text mt-m" style="font-size:1.15rem; line-height:1.7;">{org_text}</p>
    </div>
    <div class="reveal">
      <img src="assets/img/program_agri.jpg" alt="About GIDA" style="width:100%; border-radius:12px; box-shadow:0 12px 30px rgba(0,0,0,0.1);">
    </div>
  </div>
</section>
'''

about = re.sub(r'<!-- ORGANIZATION PROFILE -->.*?</section>', new_section, about, flags=re.DOTALL)

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(about)


# 3. FIX HERO BACKGROUNDS FOR 3 PAGES
for page, img in [('about.html', 'agri.jpg'), ('programs.html', 'market.jpg'), ('safeguarding.html', 'director.jpg')]:
    with open(page, 'r', encoding='utf-8') as f:
        html = f.read()
    
    html = html.replace('<section class="page-head">', f'<section class="page-head" style="background-image: url(\'assets/img/{img}\');">')
    
    with open(page, 'w', encoding='utf-8') as f:
        f.write(html)
