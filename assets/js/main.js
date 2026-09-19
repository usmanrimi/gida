document.addEventListener('DOMContentLoaded', () => {
  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
  }

  /* Scroll reveal */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('in'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* Animated counters */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !prefersReduced && 'IntersectionObserver' in window) {
    const format = (val, suffix) => Math.round(val).toLocaleString() + suffix;
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(target * eased, suffix);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animate(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => co.observe(el));
  } else {
    counters.forEach(el => { el.textContent = parseFloat(el.dataset.count).toLocaleString() + (el.dataset.suffix || ''); });
  }

  /* Header background on scroll */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.style.boxShadow = window.scrollY > 8 ? '0 1px 0 rgba(20,36,32,.08)' : 'none';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const articles = document.querySelectorAll('.article-card');
  articles.forEach(card => {
    // Make entire card click open an alert for reading
    const img = card.querySelector('.article-img');
    const title = card.querySelector('.article-title');
    const excerpt = card.querySelector('.article-excerpt');
    const triggerRead = () => { window.location.href = 'article.html'; };
    
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
          alert("Your comment '\"" + comment + "\"' has been posted!");
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

document.addEventListener('DOMContentLoaded', () => {
  const projImgs = document.querySelectorAll('.project-img');
  if(projImgs.length > 0) {
    // Inject modal HTML
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


/* =================== CMS IMAGE SYNCHRONIZATION =================== */
document.addEventListener('DOMContentLoaded', () => {
  try {
    const cmsData = JSON.parse(localStorage.getItem('gida_cms_data'));
    if (cmsData && cmsData.images && Array.isArray(cmsData.images)) {
      cmsData.images.forEach(img => {
        // Hero logo
        if (img.id === 'hero-showcase') {
          const el = document.getElementById('cms-img-hero-logo');
          if (el) { el.src = img.src; el.alt = img.alt || el.alt; }
        }
        // About feature
        if (img.id === 'about-feature') {
          const el = document.querySelector('.about-feature-img');
          if (el) { el.src = img.src; el.alt = img.alt || el.alt; }
        }
      });
    }
  } catch(e) {}
});
