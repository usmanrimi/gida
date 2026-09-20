/**
 * GIDA Dynamic CMS Synchronization Engine
 * Connects Super Admin directly to public website via shared persistent data layer.
 * Architecture: Super Admin -> Shared Database/CMS (Server / assets/data/cms-data.json) -> Public Website
 * Also utilizes localStorage and BroadcastChannel for instant zero-latency cross-tab live updates.
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'gida_cms_data';
  const CHANNEL_NAME = 'gida_cms_channel';
  let activeCmsData = null;

  // 1. REAL-TIME CROSS-TAB BROADCAST CHANNEL
  let broadcastChannel = null;
  try {
    if ('BroadcastChannel' in window) {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      broadcastChannel.onmessage = function(event) {
        if (event.data && event.data.type === 'CMS_UPDATE' && event.data.payload) {
          activeCmsData = event.data.payload;
          applyCmsToDom(activeCmsData);
        }
      };
    }
  } catch(e) {}

  // 2. STORAGE EVENT LISTENER (Cross-tab fallback)
  window.addEventListener('storage', function(e) {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        activeCmsData = JSON.parse(e.newValue);
        applyCmsToDom(activeCmsData);
      } catch(err) {}
    }
  });

  // 3. INITIALIZATION & DUAL-LAYER FETCHING
  function initCms() {
    // A. Read cached localStorage data immediately for instant, flicker-free rendering
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        activeCmsData = JSON.parse(cached);
        applyCmsToDom(activeCmsData);
      } catch(e) {}
    }

    // B. Fetch canonical server data to ensure synchronization
    fetch('/api/get-cms?t=' + Date.now())
      .catch(() => fetch('assets/data/cms-data.json?t=' + Date.now()))
      .then(response => {
        if (!response.ok) throw new Error('CMS file fetch failed');
        return response.json();
      })
      .then(serverData => {
        if (!serverData) return;
        // If server data is newer or active data missing, hydrate from server
        if (!activeCmsData || (serverData.updatedAt && (!activeCmsData.updatedAt || new Date(serverData.updatedAt) >= new Date(activeCmsData.updatedAt)))) {
          activeCmsData = serverData;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
          applyCmsToDom(activeCmsData);
        }
      })
      .catch(err => {
        // Cached or static DOM remains functional
      });
  }

  // 4. COMPREHENSIVE DOM HYDRATION
  function applyCmsToDom(cms) {
    if (!cms) return;

    // --- A. CEO / EXECUTIVE LEADERSHIP MESSAGE ---
    if (cms.ceo) {
      const ceoSections = document.querySelectorAll('.ceo-message-section');
      ceoSections.forEach(section => {
        if (cms.ceo.visible === false) {
          section.style.display = 'none';
          return;
        } else {
          section.style.display = '';
        }

        if (cms.ceo.photo) {
          const img = section.querySelector('.ceo-img');
          if (img) img.src = cms.ceo.photo;
        }
        if (cms.ceo.name) {
          const nameEl = section.querySelector('.ceo-name');
          if (nameEl) nameEl.textContent = cms.ceo.name;
        }
        if (cms.ceo.role) {
          const roleEl = section.querySelector('.ceo-role');
          if (roleEl) roleEl.textContent = cms.ceo.role;
        }
        if (cms.ceo.quote) {
          const quoteEl = section.querySelector('.ceo-quote');
          if (quoteEl) quoteEl.textContent = '“' + cms.ceo.quote.replace(/^[“"]|[”"]$/g, '') + '”';
        }
        if (cms.ceo.body) {
          const bodyEl = section.querySelector('.ceo-body');
          if (bodyEl) bodyEl.textContent = cms.ceo.body;
        }
      });
    }

    // --- B. HOMEPAGE HERO VISUAL & TEXT ---
    if (cms.heroVisual || (cms.images && cms.images.find(i => i.id === 'hp-logo-emblem'))) {
      const emblemImg = document.getElementById('cms-img-hero-logo');
      const emblemData = cms.heroVisual || cms.images.find(i => i.id === 'hp-logo-emblem');
      if (emblemImg && emblemData && emblemData.src) {
        emblemImg.src = emblemData.src;
        if (emblemData.alt) emblemImg.alt = emblemData.alt;
      }
    }

    if (cms.homepage) {
      const hpKicker = document.querySelector('.hero-sub-kicker');
      if (hpKicker && cms.homepage.kicker) hpKicker.textContent = cms.homepage.kicker;
      const hpHead = document.querySelector('.hero-headline');
      if (hpHead && cms.homepage.headline) hpHead.textContent = cms.homepage.headline;
      const hpDesc = document.querySelector('.hero-lede');
      if (hpDesc && cms.homepage.desc) hpDesc.textContent = cms.homepage.desc;
      const hpProsperity = document.querySelector('.prosperity-highlight-text');
      if (hpProsperity && cms.homepage.prosperity) hpProsperity.textContent = cms.homepage.prosperity;
    }

    // --- C. HOMEPAGE LATEST STORIES (index.html) ---
    const homeStoriesGrid = document.getElementById('homeLatestStoriesGrid');
    if (homeStoriesGrid && Array.isArray(cms.articles)) {
      const publishedArticles = cms.articles.filter(a => a.status === 'published');
      if (publishedArticles.length > 0) {
        // Take latest 2 or 3 articles
        const displayArticles = publishedArticles.slice(0, 2);
        homeStoriesGrid.innerHTML = displayArticles.map(art => `
          <div class="article-card">
            <img src="${art.image || 'assets/img/agri.jpg'}" alt="${escapeHtml(art.title)}" class="article-img">
            <div class="article-content">
              <span class="article-tag">${escapeHtml(art.category || 'Field Insights')}</span>
              <h3 class="article-title">
                <a href="article.html?id=${art.id}" style="color:inherit; text-decoration:none;">${escapeHtml(art.title)}</a>
              </h3>
              <p class="article-excerpt">${escapeHtml(art.excerpt || '')}</p>
              <div class="article-actions">
                <a href="article.html?id=${art.id}" class="btn-read-more" style="font-weight:700; color:var(--green-deep); text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                  Read Story &rarr;
                </a>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    // --- D. BLOG HUB (blog.html) ---
    const blogFeaturedContainer = document.getElementById('blogFeaturedContainer');
    const blogArticlesGrid = document.getElementById('blogArticlesGrid');
    const noArticlesBox = document.getElementById('noArticlesBox');

    if (blogArticlesGrid && Array.isArray(cms.articles)) {
      const publishedArticles = cms.articles.filter(a => a.status === 'published');
      
      if (publishedArticles.length === 0) {
        if (blogFeaturedContainer) blogFeaturedContainer.style.display = 'none';
        blogArticlesGrid.innerHTML = '';
        if (noArticlesBox) noArticlesBox.style.display = 'block';
      } else {
        if (noArticlesBox) noArticlesBox.style.display = 'none';

        // Find featured article or pick the first one
        let featuredArt = publishedArticles.find(a => a.featured) || publishedArticles[0];
        let gridArticles = publishedArticles.filter(a => a.id !== featuredArt.id);
        if (gridArticles.length === 0 && publishedArticles.length === 1) {
          gridArticles = [featuredArt]; // Show in grid too if only one article exists
        }

        // Hydrate featured card
        if (blogFeaturedContainer) {
          blogFeaturedContainer.style.display = 'block';
          blogFeaturedContainer.innerHTML = `
            <div class="blog-featured-card">
              <div class="blog-featured-media">
                <img src="${featuredArt.image || 'assets/img/agri.jpg'}" alt="${escapeHtml(featuredArt.title)}">
              </div>
              <div class="blog-featured-body">
                <div class="blog-meta-strip">
                  <span class="blog-tag">${escapeHtml(featuredArt.category || 'Field Insights')}</span>
                  <span class="blog-date">${escapeHtml(featuredArt.date || '2026')}</span>
                </div>
                <h3 class="blog-featured-title">${escapeHtml(featuredArt.title)}</h3>
                <p class="blog-featured-excerpt">${escapeHtml(featuredArt.excerpt || '')}</p>
                <div class="blog-author-row">
                  <span class="blog-author-byline">By <strong>${escapeHtml(featuredArt.author || 'GIDA')}</strong></span>
                  <a href="article.html?id=${featuredArt.id}" class="btn btn-gold">Read Full Story</a>
                </div>
              </div>
            </div>
          `;
        }

        // Render remaining articles in grid
        renderBlogGrid(gridArticles);

        // Setup category filter pills
        setupCategoryFilter(publishedArticles);
      }
    }

    // --- E. ARTICLE DETAIL PAGE (article.html) ---
    const articleTitleEl = document.getElementById('articleTitle');
    if (articleTitleEl && Array.isArray(cms.articles)) {
      const params = new URLSearchParams(window.location.search);
      const artId = params.get('id');
      const isPreview = params.get('preview') === 'true';

      let foundArt = cms.articles.find(a => String(a.id) === String(artId));
      if (!foundArt && cms.articles.length > 0) {
        foundArt = cms.articles[0]; // fallback to first article
      }

      if (foundArt && (foundArt.status === 'published' || isPreview)) {
        document.title = foundArt.title + ' — GIDA';
        articleTitleEl.textContent = foundArt.title;

        const crumbEl = document.getElementById('articleCrumb');
        if (crumbEl) crumbEl.textContent = foundArt.category || 'Story';

        const catEl = document.getElementById('articleCategory');
        if (catEl) catEl.textContent = foundArt.category || 'Field Insights';

        const dateEl = document.getElementById('articleDate');
        if (dateEl) dateEl.textContent = foundArt.date || '2026';

        const authorEl = document.getElementById('articleAuthor');
        if (authorEl) authorEl.textContent = foundArt.author || 'GIDA Technical Team';

        const heroImg = document.getElementById('articleHeroImage');
        if (heroImg && foundArt.image) {
          heroImg.src = foundArt.image;
          heroImg.alt = foundArt.title;
        }

        const bodyEl = document.getElementById('articleContent');
        if (bodyEl && foundArt.content) {
          bodyEl.innerHTML = formatMarkdownProse(foundArt.content);
        }

        // Related stories
        const relatedGrid = document.getElementById('relatedArticlesGrid');
        if (relatedGrid) {
          const others = cms.articles.filter(a => a.status === 'published' && String(a.id) !== String(foundArt.id));
          if (others.length === 0) {
            const relSec = relatedGrid.closest('section');
            if (relSec) relSec.style.display = 'none';
          } else {
            relatedGrid.innerHTML = others.slice(0, 2).map(art => `
              <div class="blog-card">
                <div class="blog-card-media">
                  <img src="${art.image || 'assets/img/agri.jpg'}" alt="${escapeHtml(art.title)}" class="blog-card-img">
                </div>
                <div class="blog-card-body">
                  <div class="blog-card-meta">
                    <span class="blog-tag">${escapeHtml(art.category || 'Field Insights')}</span>
                    <span class="blog-date">${escapeHtml(art.date || '')}</span>
                  </div>
                  <h3 class="blog-card-title"><a href="article.html?id=${art.id}">${escapeHtml(art.title)}</a></h3>
                  <p class="blog-card-excerpt">${escapeHtml(art.excerpt || '')}</p>
                  <div class="blog-card-footer">
                    <span class="blog-author-byline">By <strong>${escapeHtml(art.author || 'GIDA')}</strong></span>
                    <a href="article.html?id=${art.id}" class="blog-card-readmore">Read Story &rarr;</a>
                  </div>
                </div>
              </div>
            `).join('');
          }
        }
      }
    }

    // --- F. ANNOUNCEMENTS (programs.html) ---
    const annContainer = document.getElementById('announcementsContainer');
    if (annContainer && Array.isArray(cms.announcements)) {
      const publishedAnn = cms.announcements.filter(a => a.status === 'published');
      if (publishedAnn.length === 0) {
        annContainer.innerHTML = `
          <div style="grid-column: 1/-1; text-align:center; padding:36px; background:#fff; border-radius:16px; border:1px dashed #cbd5e1;">
            <h4 style="color:var(--green-deep); margin-bottom:6px;">No active public notices</h4>
            <p style="color:#64748b; font-size:0.95rem;">All upcoming procurement calls, RFP opportunities, and public notices will be published here.</p>
          </div>
        `;
      } else {
        annContainer.innerHTML = publishedAnn.map(ann => `
          <div class="announcement-card">
            <div class="announcement-header">
              <span class="announcement-badge">${escapeHtml(ann.category || 'Notice / RFP')}</span>
              <span class="announcement-date">${escapeHtml(ann.date || '2026')}</span>
            </div>
            <h3 class="announcement-title">${escapeHtml(ann.title)}</h3>
            <p class="announcement-summary">${escapeHtml(ann.summary || '')}</p>
            <div class="announcement-actions">
              <a href="publication-viewer.html?type=announcement&id=${ann.id}" class="btn btn-gold" style="font-size:0.88rem; padding:8px 18px;">
                View Notice &amp; PDF
              </a>
              ${ann.file ? `
                <a href="${ann.file}" download class="btn btn-outline" style="font-size:0.88rem; padding:8px 16px;">
                  Download PDF
                </a>
              ` : ''}
            </div>
          </div>
        `).join('');
      }
    }

    // --- G. PUBLICATIONS REPOSITORY (safeguarding.html) ---
    const pubGrid = document.getElementById('publicationsGrid');
    if (pubGrid && Array.isArray(cms.publications)) {
      const publishedPubs = cms.publications.filter(p => p.status === 'published');
      if (publishedPubs.length > 0) {
        pubGrid.innerHTML = publishedPubs.map(p => `
          <article class="pub-card">
            <div class="pub-header-strip">
              <span class="pub-tag">${escapeHtml(p.category || 'Strategic Plan')}</span>
              <span class="pub-date">${escapeHtml(p.date || '2026')}</span>
            </div>
            <div class="pub-body">
              <h3 class="pub-title">${escapeHtml(p.title)}</h3>
              <p class="pub-summary">${escapeHtml(p.summary || '')}</p>
              <div class="pub-actions">
                <a href="publication-viewer.html?id=${p.id}" class="pub-btn-read">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  Read Document
                </a>
                <a href="${p.file || 'assets/docs/gida-strategic-framework-2026-2030.pdf'}" download class="pub-btn-download" title="Download PDF">
                  <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  PDF
                </a>
              </div>
            </div>
          </article>
        `).join('');
      }
    }

    // --- H. VACANCIES (career.html) ---
    const vacancyGrid = document.getElementById('vacancyListContainer');
    const noVacanciesBox = document.getElementById('noVacanciesBox');
    if (vacancyGrid && Array.isArray(cms.vacancies)) {
      const published = cms.vacancies.filter(v => v.status === 'published');
      if (published.length === 0) {
        vacancyGrid.style.display = 'none';
        if (noVacanciesBox) noVacanciesBox.style.display = 'block';
      } else {
        vacancyGrid.style.display = 'grid';
        if (noVacanciesBox) noVacanciesBox.style.display = 'none';
        vacancyGrid.innerHTML = published.map(v => `
          <div class="vacancy-card">
            <span class="vacancy-badge">${escapeHtml(v.type || 'Full-Time · Technical')}</span>
            <h3 class="vacancy-title">${escapeHtml(v.title)}</h3>
            <p class="vacancy-summary">${escapeHtml(v.summary || '')}</p>
            <div class="vacancy-meta">
              <div class="vacancy-meta-item">
                <span class="meta-label">Department</span>
                <span class="meta-val">${escapeHtml(v.dept || 'Operations')}</span>
              </div>
              <div class="vacancy-meta-item">
                <span class="meta-label">Location</span>
                <span class="meta-val">${escapeHtml(v.loc || 'Kano (HQ), with field travel')}</span>
              </div>
              <div class="vacancy-meta-item meta-deadline">
                <span class="meta-label">Closing Date</span>
                <span class="meta-val">${escapeHtml(v.deadline || 'Open until filled')}</span>
              </div>
            </div>
            <a href="job-detail.html?id=${v.id}" class="btn btn-gold" style="justify-content:center; text-align:center;">View Opportunity &amp; Apply</a>
          </div>
        `).join('');
      }
    }

    // --- I. MANAGED IMAGES ---
    if (cms.images && Array.isArray(cms.images)) {
      cms.images.forEach(img => {
        if (img.src && img.selector) {
          const el = document.querySelector(img.selector);
          if (el) {
            if (el.tagName === 'IMG') {
              el.src = img.src;
              if (img.alt) el.alt = img.alt;
            } else {
              el.style.backgroundImage = `url('${img.src}')`;
            }
          }
        }
      });
    }
  }

  // HELPER: Category filtering in blog.html
  function setupCategoryFilter(allArticles) {
    const filterPills = document.querySelectorAll('#blogCategoryPills .cat-pill');
    filterPills.forEach(pill => {
      pill.onclick = function() {
        filterPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const cat = this.getAttribute('data-category');
        if (cat === 'all') {
          renderBlogGrid(allArticles);
        } else {
          const filtered = allArticles.filter(a => a.category && a.category.toLowerCase() === cat.toLowerCase());
          renderBlogGrid(filtered);
        }
      };
    });
  }

  function renderBlogGrid(articles) {
    const grid = document.getElementById('blogArticlesGrid');
    const empty = document.getElementById('noArticlesBox');
    if (!grid) return;
    if (articles.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.style.display = 'block';
    } else {
      if (empty) empty.style.display = 'none';
      grid.innerHTML = articles.map(art => `
        <div class="blog-card">
          <div class="blog-card-media">
            <img src="${art.image || 'assets/img/agri.jpg'}" alt="${escapeHtml(art.title)}" class="blog-card-img">
          </div>
          <div class="blog-card-body">
            <div class="blog-card-meta">
              <span class="blog-tag">${escapeHtml(art.category || 'Field Insights')}</span>
              <span class="blog-date">${escapeHtml(art.date || '')}</span>
            </div>
            <h3 class="blog-card-title"><a href="article.html?id=${art.id}">${escapeHtml(art.title)}</a></h3>
            <p class="blog-card-excerpt">${escapeHtml(art.excerpt || '')}</p>
            <div class="blog-card-footer">
              <span class="blog-author-byline">By <strong>${escapeHtml(art.author || 'GIDA')}</strong></span>
              <a href="article.html?id=${art.id}" class="blog-card-readmore">Read Story &rarr;</a>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // HELPER: Convert Markdown into Clean Semantic HTML
  function formatMarkdownProse(markdownText) {
    if (!markdownText) return '';
    let html = '';
    const paragraphs = markdownText.split(/\n\n+/);
    
    paragraphs.forEach(para => {
      para = para.trim();
      if (!para) return;

      if (para.startsWith('### ')) {
        html += `<h3>${escapeHtml(para.replace('### ', ''))}</h3>`;
      } else if (para.startsWith('## ')) {
        html += `<h2>${escapeHtml(para.replace('## ', ''))}</h2>`;
      } else if (para.startsWith('> ')) {
        html += `<blockquote>${escapeHtml(para.replace(/^>\s*/gm, ''))}</blockquote>`;
      } else if (para.startsWith('- ') || para.startsWith('* ')) {
        const items = para.split(/\n[-*]\s+/).map(it => it.replace(/^[-*]\s+/, ''));
        html += `<ul>${items.map(it => `<li>${formatInlineMarkup(it)}</li>`).join('')}</ul>`;
      } else if (/^\d+\.\s+/.test(para)) {
        const items = para.split(/\n\d+\.\s+/).map(it => it.replace(/^\d+\.\s+/, ''));
        html += `<ol>${items.map(it => `<li>${formatInlineMarkup(it)}</li>`).join('')}</ol>`;
      } else {
        html += `<p>${formatInlineMarkup(para)}</p>`;
      }
    });

    return html;
  }

  function formatInlineMarkup(text) {
    let out = escapeHtml(text);
    // Bold **text**
    out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    out = out.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return out;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCms);
  } else {
    initCms();
  }

  // 5. GLOBAL PERSISTENCE HELPER FOR SUPER ADMIN
  // Writes to LocalStorage, broadcasts to open tabs, and synchronizes to disk via POST /api/save-cms
  window.GIDA_PERSIST_CMS = async function(updatedData) {
    if (!updatedData) return { success: false, error: 'Empty data' };
    
    updatedData.updatedAt = new Date().toISOString();
    
    // 1. Local storage instant update
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    
    // 2. Broadcast Channel instant notification to other open tabs
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type: 'CMS_UPDATE', payload: updatedData });
      } catch(e) {}
    }

    // 3. Hydrate current DOM immediately
    applyCmsToDom(updatedData);

    // 4. Persist directly to physical disk via backend API
    let serverSaved = false;
    let message = 'Saved to browser storage and synced live across tabs.';
    try {
      const response = await fetch('/api/save-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        const resJson = await response.json();
        serverSaved = true;
        message = 'CMS successfully synchronized to server database and live site!';
      }
    } catch(err) {
      // Backend not running (e.g. purely static server), localStorage & Broadcast still function
      console.warn('[CMS] Server sync unavailable, saved locally.', err);
    }

    return {
      success: true,
      serverSaved: serverSaved,
      message: message,
      data: updatedData
    };
  };

  // Backwards compatibility alias
  window.GIDA_SYNC_CMS = function(data) {
    return window.GIDA_PERSIST_CMS(data);
  };

})();
