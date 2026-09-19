/**
 * GIDA Dynamic CMS Synchronization Engine
 * Connects Super Admin directly to public website via shared persistent data layer.
 * Supports LocalStorage, BroadcastChannel (real-time cross-tab sync), and canonical JSON database.
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'gida_cms_data';
  const CHANNEL_NAME = 'gida_cms_channel';
  let activeCmsData = null;

  // 1. BROADCAST CHANNEL FOR REAL-TIME CROSS-TAB SYNC
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

  // 2. STORAGE EVENT LISTENER
  window.addEventListener('storage', function(e) {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        activeCmsData = JSON.parse(e.newValue);
        applyCmsToDom(activeCmsData);
      } catch(err) {}
    }
  });

  // 3. INITIALIZATION & DATA FETCHING
  function initCms() {
    // Try localStorage first for instant rendering
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        activeCmsData = JSON.parse(cached);
        applyCmsToDom(activeCmsData);
      } catch(e) {}
    }

    // Also fetch canonical JSON file to ensure latest version is seeded
    fetch('assets/data/cms-data.json?t=' + Date.now())
      .then(response => {
        if (!response.ok) throw new Error('Network response not ok');
        return response.json();
      })
      .then(serverData => {
        if (!activeCmsData || (serverData.updatedAt && (!activeCmsData.updatedAt || new Date(serverData.updatedAt) > new Date(activeCmsData.updatedAt)))) {
          activeCmsData = serverData;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
          applyCmsToDom(activeCmsData);
        }
      })
      .catch(err => {
        // Fallback to cached or static markup
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

    // --- B. CAREER VACANCIES (career.html) ---
    const vacancyGrid = document.getElementById('vacancyListContainer');
    const noVacanciesBox = document.getElementById('noVacanciesBox');
    if (vacancyGrid && Array.isArray(cms.vacancies)) {
      // STRICT: Show ONLY published vacancies; Drafts are hidden from public
      const published = cms.vacancies.filter(v => v.status === 'published');
      if (published.length === 0) {
        vacancyGrid.style.display = 'none';
        if (noVacanciesBox) noVacanciesBox.style.display = 'block';
      } else {
        vacancyGrid.style.display = 'grid';
        if (noVacanciesBox) noVacanciesBox.style.display = 'none';
        vacancyGrid.innerHTML = published.map(v => `
          <div class="vacancy-card">
            <span class="vacancy-badge">${v.type || 'Full-Time · Technical'}</span>
            <h3 class="vacancy-title">${v.title}</h3>
            <p class="vacancy-summary">${v.summary || ''}</p>
            <div class="vacancy-meta">
              <div class="vacancy-meta-item">
                <span class="meta-label">Department</span>
                <span class="meta-val">${v.dept || 'Operations'}</span>
              </div>
              <div class="vacancy-meta-item">
                <span class="meta-label">Location</span>
                <span class="meta-val">${v.loc || 'Kano (HQ), with field travel'}</span>
              </div>
              <div class="vacancy-meta-item meta-deadline">
                <span class="meta-label">Closing Date</span>
                <span class="meta-val">${v.deadline || 'Open until filled'}</span>
              </div>
            </div>
            <a href="job-detail.html?id=${v.id}" class="btn btn-gold" style="justify-content:center; text-align:center;">View Opportunity &amp; Apply</a>
          </div>
        `).join('');
      }
    }

    // --- C. JOB DETAIL PAGE (job-detail.html) ---
    const jobTitleEl = document.getElementById('jobTitle');
    if (jobTitleEl && Array.isArray(cms.vacancies)) {
      const params = new URLSearchParams(window.location.search);
      const reqId = params.get('id');
      const isPreview = params.get('preview') === 'true';
      let foundJob = cms.vacancies.find(v => String(v.id) === String(reqId));
      
      // If requested job is draft and not in preview mode, don't show it publicly
      if (foundJob && foundJob.status === 'draft' && !isPreview) {
        foundJob = null;
      }

      if (foundJob) {
        document.title = foundJob.title + ' — GIDA Careers';
        jobTitleEl.textContent = foundJob.title;
        const badge = document.getElementById('jobBadge');
        if (badge) badge.textContent = foundJob.type;
        const crumb = document.getElementById('jobCrumb');
        if (crumb) crumb.textContent = foundJob.title;
        const lede = document.getElementById('jobLede');
        if (lede) lede.textContent = foundJob.summary || foundJob.title;
        const ref = document.getElementById('jobRef');
        if (ref) ref.textContent = foundJob.ref || ('GIDA-VAC-2026-' + foundJob.id);
        const dept = document.getElementById('jobDept');
        if (dept) dept.textContent = foundJob.dept;
        const loc = document.getElementById('jobLoc');
        if (loc) loc.textContent = foundJob.loc;
        const type = document.getElementById('jobType');
        if (type) type.textContent = foundJob.type;
        const deadline = document.getElementById('jobDeadline');
        if (deadline) deadline.textContent = foundJob.deadline;
        const overview = document.getElementById('jobOverview');
        if (overview && foundJob.overview) overview.textContent = foundJob.overview;

        if (Array.isArray(foundJob.responsibilities)) {
          const respUl = document.getElementById('jobResponsibilities');
          if (respUl) respUl.innerHTML = foundJob.responsibilities.map(r => `<li>${r}</li>`).join('');
        }
        if (Array.isArray(foundJob.qualifications)) {
          const qualUl = document.getElementById('jobQualifications');
          if (qualUl) qualUl.innerHTML = foundJob.qualifications.map(q => `<li>${q}</li>`).join('');
        }

        const emailBtn = document.getElementById('btnEmailApply');
        if (emailBtn) {
          emailBtn.href = `mailto:careers@gida-action.org?subject=Application:%20${encodeURIComponent(foundJob.title)}%20(${encodeURIComponent(foundJob.ref || 'VAC')})`;
        }
      }
    }

    // --- D. PUBLICATIONS (safeguarding.html) ---
    const pubGrid = document.getElementById('publicationsGrid');
    if (pubGrid && Array.isArray(cms.publications)) {
      // STRICT: Show ONLY published publications
      const publishedPubs = cms.publications.filter(p => p.status === 'published');
      if (publishedPubs.length > 0) {
        pubGrid.innerHTML = publishedPubs.map(p => `
          <article class="pub-card">
            <div class="pub-header-strip">
              <span class="pub-tag">${p.category || 'Strategic Plan'}</span>
              <span class="pub-date">${p.date || '2026'}</span>
            </div>
            <div class="pub-body">
              <h3 class="pub-title">${p.title}</h3>
              <p class="pub-summary">${p.summary || ''}</p>
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

    // --- E. DOCUMENT VIEWER (publication-viewer.html) ---
    const viewerTitle = document.getElementById('docTitle');
    if (viewerTitle && Array.isArray(cms.publications)) {
      const params = new URLSearchParams(window.location.search);
      const pubId = params.get('id');
      const foundPub = cms.publications.find(p => String(p.id) === String(pubId));
      if (foundPub) {
        document.title = foundPub.title + ' — GIDA Document Viewer';
        viewerTitle.textContent = foundPub.title;
        const cat = document.getElementById('docCategory');
        if (cat) cat.textContent = foundPub.category;
        const date = document.getElementById('docDate');
        if (date) date.textContent = 'Published: ' + foundPub.date;
        const sum = document.getElementById('docSummary');
        if (sum) sum.textContent = foundPub.summary;
        const frame = document.getElementById('pdfFrame');
        if (frame && foundPub.file) frame.src = foundPub.file + '#toolbar=1';
        const dlBtn = document.getElementById('btnDownload');
        if (dlBtn && foundPub.file) dlBtn.href = foundPub.file;
      }
    }

    // --- F. HOMEPAGE HERO & PROSPERITY ---
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

    // --- G. CONTACT INFO ---
    if (cms.contact) {
      if (cms.contact.email) {
        document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
          if (!a.href.includes('careers@')) {
            a.href = 'mailto:' + cms.contact.email;
            if (a.textContent.includes('@')) a.textContent = cms.contact.email;
          }
        });
      }
      if (cms.contact.phone) {
        document.querySelectorAll('a[href^="tel:"]').forEach(a => {
          a.href = 'tel:' + cms.contact.phone.replace(/[^0-9+]/g, '');
          a.textContent = cms.contact.phone;
        });
      }
    }

    // --- H. MANAGED IMAGES ---
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

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCms);
  } else {
    initCms();
  }

  // Expose global helper for admin to trigger immediate sync
  window.GIDA_SYNC_CMS = function(updatedData) {
    if (!updatedData) return;
    updatedData.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type: 'CMS_UPDATE', payload: updatedData });
      } catch(e) {}
    }
    applyCmsToDom(updatedData);
  };

})();
