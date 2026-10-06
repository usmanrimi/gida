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

    // B. Fetch canonical server/file data to ensure synchronization across devices
    async function fetchCanonicalData() {
      // 1. If running on local server environment, try dynamic API first
      const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocalHost) {
        try {
          const apiRes = await fetch('/api/get-cms?t=' + Date.now(), { cache: 'no-store' });
          if (apiRes.ok) return await apiRes.json();
        } catch(e) {}
      }

      // 2. Guaranteed primary canonical file (always present on Vercel, GitHub Pages, or local server)
      try {
        const fileRes = await fetch('assets/data/cms-data.json?t=' + Date.now(), {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
        });
        if (fileRes.ok) return await fileRes.json();
      } catch(e) {
        console.warn('[CMS Engine] Direct JSON fetch error:', e);
      }
      return null;
    }

    fetchCanonicalData()
      .then(serverData => {
        if (!serverData) return;
        // Apply canonical server / repository data
        activeCmsData = serverData;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
        applyCmsToDom(activeCmsData);
      })
      .catch(err => {
        console.warn('[CMS Engine] Hydration notice:', err);
      });
  }

  // 4. COMPREHENSIVE DOM HYDRATION
  function applyCmsToDom(cms) {
    if (!cms) return;

    // --- A. LEADERSHIP & VOICES CAROUSEL (index.html) ---
    if (cms.leadershipSection) {
      const badge = document.getElementById('cms-leadership-kicker');
      if (badge && cms.leadershipSection.kicker) badge.textContent = cms.leadershipSection.kicker;
      const title = document.getElementById('cms-leadership-title');
      if (title && cms.leadershipSection.title) title.textContent = cms.leadershipSection.title;
      const desc = document.getElementById('cms-leadership-desc');
      if (desc && cms.leadershipSection.desc) desc.textContent = cms.leadershipSection.desc;
    }

    const leadershipTrack = document.getElementById('leadershipTrack');
    if (leadershipTrack && Array.isArray(cms.leadershipMessages)) {
      const published = cms.leadershipMessages.filter(m => m.status === 'published');
      const leadSection = document.getElementById('leadership-section');
      if (published.length === 0) {
        if (leadSection) leadSection.style.display = 'none';
      } else {
        if (leadSection) leadSection.style.display = '';
        // Sort: featured first or by order
        const sorted = [...published].sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (a.order || 0) - (b.order || 0);
        });

        leadershipTrack.innerHTML = sorted.map(m => `
          <article class="leadership-card ${m.featured ? 'is-featured' : ''}" data-id="${m.id}">
            ${m.featured ? '<div class="leadership-featured-tag">★ Featured Voice</div>' : ''}
            <div class="leadership-card-header">
              <div class="leadership-avatar-frame">
                <img src="${m.photo || 'assets/img/avatar-placeholder.png'}" alt="${escapeHtml(m.name)}" class="leadership-avatar-img" loading="lazy">
              </div>
              <div class="leadership-author-meta">
                <h4 class="leadership-author-name">${escapeHtml(m.name)}</h4>
                <div class="leadership-author-role">${escapeHtml(m.role || '')}</div>
                ${m.organization ? `<div class="leadership-author-org">${escapeHtml(m.organization)}</div>` : ''}
              </div>
            </div>
            ${m.expertise ? `<div class="leadership-card-expertise">${escapeHtml(m.expertise)}</div>` : ''}
            <div class="leadership-quote-body">
              ${escapeHtml(m.excerpt || m.quote || '')}
            </div>
            <div class="leadership-card-footer">
              <span class="leadership-category-pill">${escapeHtml(m.category || 'Leadership')}</span>
              <button type="button" class="leadership-read-btn" onclick="openLeadershipModal('${m.id}')" aria-label="Read full message from ${escapeHtml(m.name)}">
                ${escapeHtml(m.ctaText || 'Read Full Message')}
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </article>
        `).join('');

        initLeadershipCarousel(sorted.length);
      }
    }

    // --- A2. CEO / EXECUTIVE LEADERSHIP MESSAGE (Backwards compatibility) ---
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
    if (cms.heroVisual || (cms.images && cms.images.find(i => i.id === 'hp-logo-emblem' || i.id === 'hp-hero'))) {
      const heroVisualImg = document.getElementById('cms-img-hero-visual') || document.getElementById('cms-img-hero-logo');
      const visualData = cms.heroVisual || (cms.images ? cms.images.find(i => i.id === 'hp-hero' || i.id === 'hp-logo-emblem') : null);
      if (heroVisualImg && visualData && visualData.src) {
        heroVisualImg.src = visualData.src;
        if (visualData.alt) heroVisualImg.alt = visualData.alt;
      }
    }

    if (cms.homepage) {
      const hpKicker = document.getElementById('cms-hero-tag') || document.querySelector('.hero-tag') || document.querySelector('.hero-sub-kicker');
      if (hpKicker && cms.homepage.kicker) hpKicker.textContent = cms.homepage.kicker;
      
      const hpHead = document.getElementById('cms-hero-headline') || document.querySelector('.hero h1') || document.querySelector('.h-display') || document.querySelector('.hero-headline');
      if (hpHead && cms.homepage.headline) {
        const text = cms.homepage.headline;
        if (text.includes('<em>')) {
          hpHead.innerHTML = text;
        } else if (/prosper/i.test(text)) {
          hpHead.innerHTML = text.replace(/(prosper\.?)/i, '<em>$1</em>');
        } else {
          hpHead.textContent = text;
        }
      }

      const hpDesc = document.getElementById('cms-hero-lede') || document.querySelector('.hero p.lede') || document.querySelector('.hero-lede');
      if (hpDesc && cms.homepage.desc) hpDesc.textContent = cms.homepage.desc;

      const hpProsperity = document.getElementById('cms-prosperity-statement') || document.querySelector('.prosperity-highlight-text') || document.querySelector('.prosperity-highlight-lead');
      if (hpProsperity && cms.homepage.prosperity) hpProsperity.textContent = cms.homepage.prosperity;
    }

    // --- B2. ABOUT US PROFILE HYDRATION (about.html) ---
    if (cms.about) {
      const abHead = document.getElementById('cms-about-heading') || document.querySelector('.about-text-box h2');
      if (abHead && cms.about.heading) abHead.textContent = cms.about.heading;

      const abLead = document.getElementById('cms-about-lead') || document.querySelector('.about-lead-text');
      if (abLead && cms.about.lead) abLead.textContent = cms.about.lead;

      const abApp = document.getElementById('cms-about-approach') || document.querySelector('.about-approach-text');
      if (abApp && cms.about.approach) abApp.textContent = cms.about.approach;
    }

    // --- B3. SAFEGUARDING HYDRATION (safeguarding.html) ---
    if (cms.safeguarding) {
      const zt = document.getElementById('cms-sg-zerotolerance') || document.querySelector('.mandate-body');
      if (zt && cms.safeguarding.zeroTolerance) zt.textContent = cms.safeguarding.zeroTolerance;

      const sgEmail = document.getElementById('cms-sg-email');
      if (sgEmail && cms.safeguarding.email) {
        sgEmail.textContent = cms.safeguarding.email;
        sgEmail.href = 'mailto:' + cms.safeguarding.email;
      }

      const sgHotline = document.getElementById('cms-sg-hotline');
      if (sgHotline && cms.safeguarding.hotline) sgHotline.textContent = cms.safeguarding.hotline;
    }

    // --- B4. CONTACT INFO HYDRATION (contact.html) ---
    if (cms.contact) {
      const cEmail = document.getElementById('cms-contact-email');
      if (cEmail && cms.contact.email) {
        cEmail.textContent = cms.contact.email;
        cEmail.href = 'mailto:' + cms.contact.email;
      }
      const cAddress = document.getElementById('cms-contact-address');
      if (cAddress && cms.contact.address) cAddress.textContent = cms.contact.address;
    }

    // --- C0. HOMEPAGE VIDEO SHOWCASE (index.html) ---
    if (cms.videoSection) {
      const vk = document.getElementById('cms-video-kicker');
      if (vk && cms.videoSection.kicker) vk.textContent = cms.videoSection.kicker;
      const vt = document.getElementById('cms-video-title');
      if (vt && cms.videoSection.title) vt.textContent = cms.videoSection.title;
      const vd = document.getElementById('cms-video-desc');
      if (vd && cms.videoSection.desc) vd.textContent = cms.videoSection.desc;
    }

    const homeVideoGrid = document.getElementById('homeVideoGrid');
    if (homeVideoGrid && Array.isArray(cms.videos)) {
      const publishedVideos = cms.videos.filter(v => v.status === 'published' && v.featuredOnHome !== false);
      const videoSection = document.getElementById('homeVideoSection');
      if (publishedVideos.length === 0) {
        if (videoSection) videoSection.style.display = 'none';
      } else {
        if (videoSection) videoSection.style.display = '';
        const showcaseVideos = publishedVideos.slice(0, 3);
        homeVideoGrid.innerHTML = showcaseVideos.map(vid => `
          <article class="video-card" onclick="openVideoModal('${escapeHtml(vid.youtubeId)}', '${escapeHtml(vid.title)}', '${escapeHtml(vid.speaker || '')}', '${escapeHtml(vid.excerpt || '')}')" tabindex="0" role="button" aria-label="Watch session: ${escapeHtml(vid.title)}">
            <div class="video-thumb-container">
              <img src="${vid.thumbnail || 'https://img.youtube.com/vi/' + vid.youtubeId + '/hqdefault.jpg'}" alt="${escapeHtml(vid.title)}" class="video-thumb" loading="lazy">
              <span class="video-badge-pill">${escapeHtml(vid.category || 'Session')}</span>
              ${vid.duration ? `<span class="video-duration-pill">${escapeHtml(vid.duration)}</span>` : ''}
              <div class="video-play-btn-circle" aria-label="Play Video">
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            <div class="video-card-body">
              <div class="video-card-meta">
                <span class="video-speaker">${escapeHtml(vid.speaker || 'GIDA')}</span>
                ${vid.date ? `<span class="video-date">${escapeHtml(vid.date)}</span>` : ''}
              </div>
              <h4 class="video-card-title">${escapeHtml(vid.title)}</h4>
              <p class="video-card-excerpt">${escapeHtml(vid.excerpt || '')}</p>
            </div>
          </article>
        `).join('');
      }
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
      const publishedVideos = Array.isArray(cms.videos) ? cms.videos.filter(v => v.status === 'published') : [];
      
      if (publishedArticles.length === 0 && publishedVideos.length === 0) {
        if (blogFeaturedContainer) blogFeaturedContainer.style.display = 'none';
        blogArticlesGrid.innerHTML = '';
        if (noArticlesBox) noArticlesBox.style.display = 'block';
      } else {
        if (noArticlesBox) noArticlesBox.style.display = 'none';

        // Find featured article or pick the first one
        let featuredArt = publishedArticles.find(a => a.featured) || publishedArticles[0];
        let gridArticles = publishedArticles.filter(a => a.id !== (featuredArt ? featuredArt.id : null));
        if (gridArticles.length === 0 && publishedArticles.length === 1) {
          gridArticles = [featuredArt]; // Show in grid too if only one article exists
        }

        // Hydrate featured card
        if (blogFeaturedContainer && featuredArt) {
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

        // Setup category filter pills (with both articles and videos)
        setupCategoryFilter(publishedArticles, publishedVideos);
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

    // --- G2. HOMEPAGE PUBLICATIONS SHOWCASE (index.html) ---
    const homePubGrid = document.getElementById('homePublicationsGrid');
    if (homePubGrid && Array.isArray(cms.publications)) {
      const publishedPubs = cms.publications.filter(p => p.status === 'published');
      if (publishedPubs.length > 0) {
        // Showcase the top 3 publications in their defined order
        const showcasePubs = publishedPubs.slice(0, 3);
        homePubGrid.innerHTML = showcasePubs.map(p => `
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
  function setupCategoryFilter(allArticles, allVideos) {
    const filterPills = document.querySelectorAll('#blogCategoryPills .cat-pill');
    if (!filterPills.length) return;

    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');

    filterPills.forEach(pill => {
      pill.onclick = function() {
        filterPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const cat = this.getAttribute('data-category');
        applyFilter(cat);
      };
    });

    function applyFilter(cat) {
      if (!cat || cat === 'all') {
        renderBlogGrid(allArticles);
      } else if (cat.toLowerCase() === 'videos & sessions' || cat.toLowerCase() === 'videos') {
        renderBlogVideos(allVideos || []);
      } else {
        const filtered = allArticles.filter(a => a.category && a.category.toLowerCase() === cat.toLowerCase());
        renderBlogGrid(filtered);
      }
    }

    if (filterParam === 'videos') {
      const vidPill = Array.from(filterPills).find(p => p.getAttribute('data-category').toLowerCase().includes('video'));
      if (vidPill) {
        filterPills.forEach(p => p.classList.remove('active'));
        vidPill.classList.add('active');
        applyFilter(vidPill.getAttribute('data-category'));
      }
    }
  }

  function renderBlogGrid(articles) {
    const grid = document.getElementById('blogArticlesGrid');
    const empty = document.getElementById('noArticlesBox');
    if (!grid) return;
    if (!articles || articles.length === 0) {
      grid.innerHTML = '';
      if (empty) {
        empty.style.display = 'block';
        const h3 = empty.querySelector('h3');
        if (h3) h3.textContent = 'No stories found in this topic';
      }
    } else {
      if (empty) empty.style.display = 'none';
      grid.innerHTML = articles.map(art => `
        <div class="blog-card">
          <div class="blog-card-media">
            <img src="${art.image || 'assets/img/agri.jpg'}" alt="${escapeHtml(art.title)}" class="blog-card-img" loading="lazy">
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

  function renderBlogVideos(videos) {
    const grid = document.getElementById('blogArticlesGrid');
    const empty = document.getElementById('noArticlesBox');
    if (!grid) return;
    if (!videos || videos.length === 0) {
      grid.innerHTML = '';
      if (empty) {
        empty.style.display = 'block';
        const h3 = empty.querySelector('h3');
        if (h3) h3.textContent = 'No video sessions currently available';
      }
    } else {
      if (empty) empty.style.display = 'none';
      grid.innerHTML = videos.map(vid => `
        <article class="video-card" onclick="openVideoModal('${escapeHtml(vid.youtubeId)}', '${escapeHtml(vid.title)}', '${escapeHtml(vid.speaker || '')}', '${escapeHtml(vid.excerpt || '')}')" tabindex="0" role="button" aria-label="Watch session: ${escapeHtml(vid.title)}">
          <div class="video-thumb-container">
            <img src="${vid.thumbnail || 'https://img.youtube.com/vi/' + vid.youtubeId + '/hqdefault.jpg'}" alt="${escapeHtml(vid.title)}" class="video-thumb" loading="lazy">
            <span class="video-badge-pill">${escapeHtml(vid.category || 'Session')}</span>
            ${vid.duration ? `<span class="video-duration-pill">${escapeHtml(vid.duration)}</span>` : ''}
            <div class="video-play-btn-circle" aria-label="Play Video">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <div class="video-card-body">
            <div class="video-card-meta">
              <span class="video-speaker">${escapeHtml(vid.speaker || 'GIDA')}</span>
              ${vid.date ? `<span class="video-date">${escapeHtml(vid.date)}</span>` : ''}
            </div>
            <h4 class="video-card-title">${escapeHtml(vid.title)}</h4>
            <p class="video-card-excerpt">${escapeHtml(vid.excerpt || '')}</p>
          </div>
        </article>
      `).join('');
    }
  }

  // --- LEADERSHIP CAROUSEL CONTROLLER ---
  let carouselTimer = null;
  let currentLeadIndex = 0;

  function initLeadershipCarousel(totalCards) {
    const track = document.getElementById('leadershipTrack');
    const prevBtn = document.getElementById('leadershipPrevBtn');
    const nextBtn = document.getElementById('leadershipNextBtn');
    const dotsWrap = document.getElementById('leadershipDots');
    const wrapper = track ? track.closest('.leadership-carousel-wrapper') : null;

    if (!track || totalCards <= 0) return;

    function getCardsPerView() {
      if (window.innerWidth >= 992) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }

    function getMaxIndex() {
      const perView = getCardsPerView();
      return Math.max(0, totalCards - perView);
    }

    function renderDots() {
      if (!dotsWrap) return;
      const maxIdx = getMaxIndex();
      if (maxIdx <= 0) {
        dotsWrap.innerHTML = '';
        return;
      }
      let dotsHtml = '';
      for (let i = 0; i <= maxIdx; i++) {
        dotsHtml += `<button class="carousel-dot ${i === currentLeadIndex ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`;
      }
      dotsWrap.innerHTML = dotsHtml;
      dotsWrap.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.onclick = () => {
          currentLeadIndex = parseInt(dot.getAttribute('data-index'), 10);
          updateTrackPosition();
          resetAutoTimer();
        };
      });
    }

    function updateTrackPosition() {
      const maxIdx = getMaxIndex();
      if (currentLeadIndex > maxIdx) currentLeadIndex = maxIdx;
      if (currentLeadIndex < 0) currentLeadIndex = 0;

      const firstCard = track.querySelector('.leadership-card');
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth;
      const gap = 24; // gap defined in CSS
      const offset = currentLeadIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

      if (prevBtn) prevBtn.disabled = currentLeadIndex === 0;
      if (nextBtn) nextBtn.disabled = currentLeadIndex >= maxIdx;

      if (dotsWrap) {
        const dots = dotsWrap.querySelectorAll('.carousel-dot');
        dots.forEach((d, idx) => {
          if (idx === currentLeadIndex) d.classList.add('active');
          else d.classList.remove('active');
        });
      }
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        const maxIdx = getMaxIndex();
        if (currentLeadIndex > 0) {
          currentLeadIndex--;
        } else {
          currentLeadIndex = maxIdx;
        }
        updateTrackPosition();
        resetAutoTimer();
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        const maxIdx = getMaxIndex();
        if (currentLeadIndex < maxIdx) {
          currentLeadIndex++;
        } else {
          currentLeadIndex = 0;
        }
        updateTrackPosition();
        resetAutoTimer();
      };
    }

    function autoSlide() {
      const maxIdx = getMaxIndex();
      if (maxIdx <= 0) return;
      if (currentLeadIndex < maxIdx) {
        currentLeadIndex++;
      } else {
        currentLeadIndex = 0;
      }
      updateTrackPosition();
    }

    function startAutoTimer() {
      stopAutoTimer();
      carouselTimer = setInterval(autoSlide, 5500);
    }

    function stopAutoTimer() {
      if (carouselTimer) clearInterval(carouselTimer);
      carouselTimer = null;
    }

    function resetAutoTimer() {
      stopAutoTimer();
      startAutoTimer();
    }

    if (wrapper) {
      wrapper.onmouseenter = stopAutoTimer;
      wrapper.onmouseleave = startAutoTimer;
      wrapper.ontouchstart = stopAutoTimer;
      wrapper.ontouchend = () => setTimeout(startAutoTimer, 2000);

      // Touch swipe gestures
      let touchStartX = 0;
      let touchEndX = 0;
      wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 45) {
          if (nextBtn) nextBtn.click();
        } else if (touchEndX - touchStartX > 45) {
          if (prevBtn) prevBtn.click();
        }
      }, { passive: true });
    }

    let resizeDebounce = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        renderDots();
        updateTrackPosition();
      }, 150);
    });

    renderDots();
    updateTrackPosition();
    startAutoTimer();
  }

  // --- HELPER: Convert Markdown into Clean Semantic HTML ---
  function formatMarkdownProse(markdownText) {
    if (!markdownText) return '';
    let html = '';
    const paragraphs = markdownText.split(/\n\n+/);
    
    paragraphs.forEach(para => {
      para = para.trim();
      if (!para) return;

      // YouTube embed tag [youtube:ID]
      const ytMatch = para.match(/^\[youtube:([a-zA-Z0-9_-]+)\]$/);
      if (ytMatch) {
        const ytId = ytMatch[1];
        html += `
          <div class="gida-video-player-wrap" style="border-radius:12px; overflow:hidden; margin:28px 0; box-shadow:0 8px 24px rgba(0,0,0,0.12);">
            <iframe src="https://www.youtube.com/embed/${escapeHtml(ytId)}?rel=0" title="Embedded Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;"></iframe>
          </div>
        `;
        return;
      }

      // Document / PDF attachment card [pdf:Title|URL] or [doc:Title|URL]
      const docMatch = para.match(/^\[(pdf|doc):([^|]+)\|([^\]]+)\]$/);
      if (docMatch) {
        const docTitle = docMatch[2];
        const docUrl = docMatch[3];
        html += `
          <div class="article-attached-doc">
            <div class="article-doc-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            </div>
            <div class="article-doc-info">
              <div class="article-doc-title">${escapeHtml(docTitle)}</div>
              <div class="article-doc-meta">Official Attached Document / PDF</div>
            </div>
            <div class="article-doc-btns">
              <a href="${escapeHtml(docUrl)}" target="_blank" rel="noopener" class="btn btn-outline" style="padding:6px 14px; font-size:0.85rem;">View Document</a>
              <a href="${escapeHtml(docUrl)}" download class="btn btn-gold" style="padding:6px 14px; font-size:0.85rem;">Download PDF</a>
            </div>
          </div>
        `;
        return;
      }

      // Standalone image with caption ![Caption](url)
      const imgMatch = para.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        const caption = imgMatch[1];
        const imgSrc = imgMatch[2];
        html += `
          <figure class="article-figure">
            <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(caption)}">
            ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
          </figure>
        `;
        return;
      }

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
    // Inline link [text](url)
    out = out.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
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

  // --- MODAL CONTROLLERS ---
  window.openLeadershipModal = function(id) {
    const list = (activeCmsData && activeCmsData.leadershipMessages) || [];
    const item = list.find(m => String(m.id) === String(id));
    if (!item) return;
    const modal = document.getElementById('leadershipMessageModal');
    if (!modal) return;

    const photo = document.getElementById('modalLeaderPhoto');
    if (photo) photo.src = item.photo || 'assets/img/avatar-placeholder.png';
    const name = document.getElementById('modalLeaderName');
    if (name) name.textContent = item.name;
    const role = document.getElementById('modalLeaderRole');
    if (role) role.textContent = item.role || '';
    const org = document.getElementById('modalLeaderOrg');
    if (org) org.textContent = item.organization || '';
    const expEl = document.getElementById('modalLeaderExpertise');
    if (expEl) {
      if (item.expertise) {
        expEl.textContent = item.expertise;
        expEl.style.display = 'inline-block';
      } else {
        expEl.style.display = 'none';
      }
    }
    const cat = document.getElementById('modalLeaderCategory');
    if (cat) cat.textContent = item.category || 'Leadership Voice';
    const body = document.getElementById('modalLeaderFullProse');
    if (body) {
      body.innerHTML = formatMarkdownProse(item.fullMessage || item.excerpt || '');
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeLeadershipModal = function() {
    const modal = document.getElementById('leadershipMessageModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  window.openVideoModal = function(youtubeId, title, speaker, desc) {
    const modal = document.getElementById('videoPlayerModal');
    const iframeWrap = document.getElementById('videoIframeContainer');
    if (!modal || !iframeWrap) return;

    iframeWrap.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0&modestbranding=1" 
        title="${escapeHtml(title || 'GIDA Video Session')}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen 
        style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;">
      </iframe>
    `;

    const titleEl = document.getElementById('modalVideoTitle');
    if (titleEl) titleEl.textContent = title || '';
    const spkEl = document.getElementById('modalVideoSpeaker');
    if (spkEl) spkEl.textContent = speaker || '';
    const descEl = document.getElementById('modalVideoDesc');
    if (descEl) descEl.textContent = desc || '';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeVideoModal = function() {
    const modal = document.getElementById('videoPlayerModal');
    const iframeWrap = document.getElementById('videoIframeContainer');
    if (iframeWrap) iframeWrap.innerHTML = '';
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  };

  // Close modals on Escape key and overlay click
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.closeLeadershipModal();
      window.closeVideoModal();
    }
  });

  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList && e.target.classList.contains('gida-modal-overlay')) {
      if (e.target.id === 'leadershipMessageModal') window.closeLeadershipModal();
      if (e.target.id === 'videoPlayerModal') window.closeVideoModal();
    }
  });

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
