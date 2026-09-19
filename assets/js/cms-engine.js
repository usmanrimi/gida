/**
 * GIDA Client-Side CMS Synchronization Engine
 * Bridges Admin CMS (localStorage: 'gida_cms_data') to public frontend pages.
 */
(function() {
  'use strict';

  // Retrieve CMS state
  const rawData = localStorage.getItem('gida_cms_data');
  if (!rawData) return; // Use default static page markup

  let cms;
  try {
    cms = JSON.parse(rawData);
  } catch (e) {
    console.error('Failed to parse gida_cms_data:', e);
    return;
  }

  // 1. SYNC CEO / LEADERSHIP MESSAGE (Homepage & About Us)
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

  // 2. SYNC VACANCIES (career.html)
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
          <span class="vacancy-badge">${v.type || 'Full-Time · Technical'}</span>
          <h3 class="vacancy-title">${v.title}</h3>
          <p class="vacancy-summary">${v.summary || ''}</p>
          <div class="vacancy-meta">
            <div class="vacancy-meta-item"><span>Department:</span> <strong>${v.dept || 'Operations'}</strong></div>
            <div class="vacancy-meta-item"><span>Location:</span> <strong>${v.loc || 'Kano (HQ), with field travel'}</strong></div>
            <div class="vacancy-meta-item"><span>Closing Date:</span> <strong>${v.deadline || 'Open until filled'}</strong></div>
          </div>
          <a href="job-detail.html?id=${v.id}" class="btn btn-gold" style="justify-content:center; text-align:center;">View Opportunity &amp; Apply</a>
        </div>
      `).join('');
    }
  }

  // 3. SYNC PUBLICATIONS (safeguarding.html)
  const pubGrid = document.getElementById('publicationsGrid');
  if (pubGrid && Array.isArray(cms.publications)) {
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

  // 4. SYNC CONTACT INFORMATION
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

  // 5. SYNC MANAGED IMAGES
  if (cms.images && Array.isArray(cms.images)) {
    cms.images.forEach(imgData => {
      if (imgData.src) {
        // Find by selector or id
        if (imgData.selector) {
          const el = document.querySelector(imgData.selector);
          if (el) {
            if (el.tagName === 'IMG') {
              el.src = imgData.src;
              if (imgData.alt) el.alt = imgData.alt;
            } else {
              el.style.backgroundImage = `url('${imgData.src}')`;
            }
          }
        }
      }
    });
  }

})();
