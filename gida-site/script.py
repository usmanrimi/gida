import re

with open('assets/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update Eyebrow
css = re.sub(
    r'\.eyebrow\{[^}]+\}',
    '.eyebrow{ display:block; font-family:var(--font-head); font-weight:700; font-size:1.4rem; color:var(--teal-dark); margin-bottom:12px; }',
    css
)
css = re.sub(r'\.eyebrow::before\{[^}]+\}', '', css)

# 2. Update Footer
css = re.sub(
    r'(\.site-footer\{\s*background:var\(--green-dark\);\s*color:rgba\(247,243,234,\.72\);\s*padding-block:64px 32px;)',
    r'\1 border-top: 1px solid rgba(255, 255, 255, 0.15);',
    css
)

# 3. Add styles for article cards and team members
css += '''

/* =================== ARTICLE CARDS =================== */
.article-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; margin-top: 40px; }
.article-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: transform 0.3s ease; border: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; }
.article-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.article-img { width: 100%; height: 200px; object-fit: cover; }
.article-content { padding: 24px; flex: 1; display: flex; flex-direction: column; }
.article-tag { font-size: 0.8rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; display: inline-block; }
.article-title { font-size: 1.25rem; font-family: var(--font-head); font-weight: 700; color: var(--teal-dark); margin-bottom: 12px; line-height: 1.3; }
.article-excerpt { font-size: 0.95rem; color: var(--text-muted); margin-bottom: 24px; flex: 1; }
.article-actions { display: flex; align-items: center; gap: 16px; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 16px; margin-top: auto; }
.action-btn { background: none; border: none; display: flex; align-items: center; gap: 6px; color: #666; font-size: 0.9rem; cursor: pointer; transition: color 0.2s; font-family: inherit; }
.action-btn:hover { color: var(--gold); }
.action-btn svg { width: 18px; height: 18px; fill: currentColor; }

/* =================== TEAM GRID =================== */
.team-member { background: #fff; padding: 24px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.05); }
.team-member-img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 16px; border: 3px solid #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.team-member h4 { color: var(--teal-dark); font-size: 1.15rem; font-family: var(--font-head); margin-bottom: 4px; }
.team-member p { font-size: 0.9rem; color: #666; }
'''

with open('assets/css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)
