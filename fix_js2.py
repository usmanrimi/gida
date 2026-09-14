with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re

bad_script_start = text.find('// Inject modal HTML')
if bad_script_start != -1:
    text = text[:bad_script_start]
    
    correct_injection = """// Inject modal HTML
    const modalHtml = `
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
    `;
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
"""
    text = text + correct_injection

    with open('assets/js/main.js', 'w', encoding='utf-8') as f:
        f.write(text)
