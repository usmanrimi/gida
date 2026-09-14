import re, os

# --- 1. ABOUT US PAGE ---
with open('about.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update hero
new_lede = 'Growth Innovation for Development Action (GIDA) is a development organization committed to building inclusive, healthy, green, and resilient rural communities. We empower people through sustainable livelihoods, market opportunities, green infrastructure, community health, innovation, and social inclusion. Creating spaces where people prosper.'
html = re.sub(
    r'<p class="lede reveal[^>]*>.*?</p>',
    f'<p class="lede reveal mt-m" style="color:rgba(255,255,255,0.9); font-size:1.15rem;">{new_lede}</p>',
    html,
    count=1
)

# Add background to hero
html = html.replace('<header class="page-head">', '<header class="page-head" style="background-image: url(\'assets/img/agri.jpg\');">')

# Add bios to team members
# I'll simply replace each team-member's inner content by appending the bio before the closing </div>
team_bios = {
    'David Ojo': 'Visionary leader driving rural transformation through sustainable partnerships and community-centric governance policies.',
    'Dr. Sarah Okafor': 'Expert in market systems and agronomy, dedicated to empowering smallholders with modern, resilient practices.',
    'Amina Yusuf': 'Spearheads strategic initiatives across all pillars, ensuring equitable growth and lasting impact in every project.',
    'Fatima Bello': 'Ensures flawless execution of field operations, building robust pipelines for community service delivery.',
    'Kalu Iheanacho': 'Stewards organizational resources with integrity, enabling scalable and sustainable financial empowerment models.'
}

for name, bio in team_bios.items():
    # Find the block for this person
    pattern = f'(<div class="team-member">.*?<h4>{name}</h4>.*?)(</div>)'
    replacement = rf'\1<div class="team-bio"><p>{bio}</p></div>\2'
    html = re.sub(pattern, replacement, html, flags=re.DOTALL)

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(html)


# --- 2. PROGRAMS PAGE ---
with open('programs.html', 'r', encoding='utf-8') as f:
    prog = f.read()

prog = prog.replace('<header class="page-head">', '<header class="page-head" style="background-image: url(\'assets/img/market.jpg\');">')

# Transform pillar-row into pillar-card
def replace_pillar(match):
    num = match.group(1)
    tag = match.group(2)
    title = match.group(3)
    subtitle = match.group(4)
    ul = match.group(5)
    
    return f'''<article class="pillar-card">
  <div class="pillar-header">
    <span class="pillar-num">{num}</span>
    <div class="pillar-title-area">
      <span class="tag">{tag}</span>
      <h3>{title}</h3>
      <p class="pillar-subtitle">{subtitle}</p>
    </div>
  </div>
  <div class="pillar-details">
    <ul class="pillar-sub">
      {ul}
    </ul>
  </div>
</article>'''

prog = re.sub(
    r'<article class="pillar-row"[^>]*>\s*<span class="num">(.*?)</span>\s*<div>\s*<span class="tag">(.*?)</span>\s*<h3>(.*?)</h3>\s*<p class="body-text">(.*?)</p>\s*<ul class="pillar-sub">(.*?)</ul>\s*</div>\s*</article>',
    replace_pillar,
    prog,
    flags=re.DOTALL
)

with open('programs.html', 'w', encoding='utf-8') as f:
    f.write(prog)


# --- 3. SAFEGUARDING PAGE ---
with open('safeguarding.html', 'r', encoding='utf-8') as f:
    safe = f.read()
safe = safe.replace('<header class="page-head">', '<header class="page-head" style="background-image: url(\'assets/img/director.jpg\');">')
with open('safeguarding.html', 'w', encoding='utf-8') as f:
    f.write(safe)


# --- 4. JS FOR ARTICLES (LIKE/SHARE/COMMENT) ---
js = '''
document.addEventListener('DOMContentLoaded', () => {
  const articles = document.querySelectorAll('.article-card');
  articles.forEach(card => {
    // Make entire card click open an alert for reading
    const img = card.querySelector('.article-img');
    const title = card.querySelector('.article-title');
    const excerpt = card.querySelector('.article-excerpt');
    const triggerRead = () => alert("Opening full article: " + title.innerText + "\\n\\nThis would load the full publication page.");
    
    if(img) img.addEventListener('click', triggerRead);
    if(title) { title.style.cursor = 'pointer'; title.addEventListener('click', triggerRead); }
    if(excerpt) { excerpt.style.cursor = 'pointer'; excerpt.addEventListener('click', triggerRead); }
    if(img) { img.style.cursor = 'pointer'; }

    // Buttons
    const btns = card.querySelectorAll('.action-btn');
    if(btns.length >= 3) {
      const likeBtn = btns[0];
      const commentBtn = btns[1];
      const shareBtn = btns[2];
      
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        likeBtn.classList.toggle('liked');
        let count = parseInt(likeBtn.innerText.replace(/[^0-9]/g, '')) || 0;
        if(likeBtn.classList.contains('liked')) {
          likeBtn.innerHTML = likeBtn.innerHTML.replace(/[0-9]+/, (count + 1));
        } else {
          likeBtn.innerHTML = likeBtn.innerHTML.replace(/[0-9]+/, (count - 1));
        }
      });
      
      commentBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let comment = prompt("Leave a comment on this publication:");
        if(comment) {
          alert("Your comment '\\"" + comment + "\\"' has been posted!");
          let count = parseInt(commentBtn.innerText.replace(/[^0-9]/g, '')) || 0;
          commentBtn.innerHTML = commentBtn.innerHTML.replace(/[0-9]+/, (count + 1));
        }
      });
      
      shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        alert("Share options opened! You can now share this via Email, Twitter, or LinkedIn.");
      });
    }
  });
});
'''
with open('assets/js/main.js', 'a', encoding='utf-8') as f:
    f.write(js)

