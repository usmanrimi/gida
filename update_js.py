import re

with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace the alert behavior with location.href = 'article.html'
js = re.sub(
    r'const triggerRead = \(\) => alert\("Opening full article: " \+ title\.innerText \+ "\\n\\nThis would load the full publication page\."\);',
    r"const triggerRead = () => { window.location.href = 'article.html'; };",
    js
)

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
