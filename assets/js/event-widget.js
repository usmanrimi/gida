/**
 * GIDA - Growth Innovation for Development Action
 * Floating Event Registration Widget & Invitation Modal
 * Event: International Day for Rural Women 2026: Rural Women Rising
 */

(function() {
  'use strict';

  // Do not run inside admin or if already on registration pages
  var path = (window.location.pathname || '').toLowerCase();
  if (
    path.includes('admin') ||
    path.includes('register') ||
    path.includes('registration')
  ) {
    return;
  }

  // Prevent multiple injections
  if (document.getElementById('gidaFloatingEventBtn')) return;

  var DISMISS_KEY = 'gida_event_invite_dismissed_2026';
  var SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  // Determine correct registration link relative to current path
  var regUrl = 'registration.html';
  if (path.endsWith('/') || path === '') {
    regUrl = 'registration.html';
  }

  // Inject CSS Styles
  var style = document.createElement('style');
  style.id = 'gidaEventWidgetStyles';
  style.textContent = `
    /* Floating Event Registration Button */
    .gida-floating-event-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9990;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #0d231d;
      color: #ffffff !important;
      padding: 12px 20px;
      border-radius: 999px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 0.92rem;
      font-weight: 700;
      text-decoration: none !important;
      border: 1.5px solid rgba(217, 130, 43, 0.45);
      box-shadow: 0 10px 25px -5px rgba(13, 35, 29, 0.35), 0 4px 10px -2px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      outline: none;
    }
    .gida-floating-event-btn:hover, .gida-floating-event-btn:focus-visible {
      background: #14352c;
      transform: translateY(-2px);
      box-shadow: 0 14px 30px -4px rgba(13, 35, 29, 0.45), 0 6px 12px -2px rgba(0, 0, 0, 0.2);
      border-color: #d9822b;
      color: #ffffff !important;
    }
    .gida-floating-icon-wrap {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: rgba(217, 130, 43, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f0a855;
      flex-shrink: 0;
    }
    .gida-floating-badge-dot {
      width: 8px;
      height: 8px;
      background: #d9822b;
      border-radius: 50%;
      display: inline-block;
      animation: gidaPulseDot 2s infinite ease-in-out;
    }
    @keyframes gidaPulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }

    /* Modal Overlay */
    .gida-event-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(13, 35, 29, 0.68);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.25s ease-out;
    }
    .gida-event-modal-overlay.active {
      display: flex;
      opacity: 1;
    }

    /* Modal Dialog */
    .gida-event-modal-dialog {
      background: #ffffff;
      border-radius: 20px;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(20, 36, 32, 0.1);
      padding: 32px 28px 28px;
      position: relative;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      transform: scale(0.95) translateY(10px);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .gida-event-modal-overlay.active .gida-event-modal-dialog {
      transform: scale(1) translateY(0);
    }
    .gida-event-modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: #f1f5f9;
      border: none;
      color: #64748b;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      font-size: 20px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .gida-event-modal-close:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    .gida-event-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(217, 130, 43, 0.12);
      color: #b45309;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 0.76rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    .gida-event-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: #0d231d;
      line-height: 1.25;
      margin: 0 0 6px 0;
    }
    .gida-event-theme {
      font-size: 0.96rem;
      font-weight: 700;
      color: #00828a;
      line-height: 1.4;
      margin-bottom: 12px;
    }
    .gida-event-desc {
      font-size: 0.90rem;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .gida-event-meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 22px;
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 0.82rem;
      color: #334155;
    }
    .gida-event-meta-box strong {
      color: #0f172a;
    }
    .gida-event-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .gida-btn-register {
      flex: 1;
      min-width: 160px;
      background: #d9822b;
      color: #ffffff !important;
      text-align: center;
      text-decoration: none !important;
      padding: 12px 22px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 0.95rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      border: none;
      cursor: pointer;
    }
    .gida-btn-register:hover {
      background: #b4681b;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(217, 130, 43, 0.35);
    }
    .gida-btn-secondary {
      background: transparent;
      color: #64748b;
      border: 1px solid #cbd5e1;
      padding: 11px 18px;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.90rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .gida-btn-secondary:hover {
      background: #f8fafc;
      color: #0f172a;
      border-color: #94a3b8;
    }

    /* Mobile adjustments */
    @media (max-width: 600px) {
      .gida-floating-event-btn {
        bottom: 18px;
        right: 16px;
        padding: 10px 15px;
        font-size: 0.84rem;
        gap: 8px;
      }
      .gida-event-modal-dialog {
        padding: 24px 20px 20px;
      }
      .gida-event-title {
        font-size: 1.25rem;
      }
      .gida-event-meta-box {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }
      .gida-event-actions {
        flex-direction: column;
        width: 100%;
      }
      .gida-btn-register, .gida-btn-secondary {
        width: 100%;
        text-align: center;
      }
    }
  `;
  document.head.appendChild(style);

  // Floating Button HTML
  var floatingBtn = document.createElement('button');
  floatingBtn.id = 'gidaFloatingEventBtn';
  floatingBtn.className = 'gida-floating-event-btn';
  floatingBtn.type = 'button';
  floatingBtn.setAttribute('aria-label', 'View Upcoming Events');
  floatingBtn.setAttribute('title', 'Upcoming Events - Growth Innovation for Development Action');
  floatingBtn.innerHTML = `
    <span class="gida-floating-icon-wrap">
      <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z"/>
      </svg>
    </span>
    <span>Upcoming Events</span>
  `;
  document.body.appendChild(floatingBtn);

  // Modal HTML
  var modalOverlay = document.createElement('div');
  modalOverlay.id = 'gidaEventInvitationModal';
  modalOverlay.className = 'gida-event-modal-overlay';
  modalOverlay.setAttribute('role', 'dialog');
  modalOverlay.setAttribute('aria-modal', 'true');
  modalOverlay.setAttribute('aria-labelledby', 'gidaEventTitle');
  modalOverlay.innerHTML = `
    <div class="gida-event-modal-dialog">
      <button type="button" class="gida-event-modal-close" id="gidaEventModalCloseBtn" aria-label="Close modal">&times;</button>
      <div class="gida-event-pill">
        <span>GIDA Events</span>
      </div>
      <h3 class="gida-event-title" id="gidaEventTitle">Upcoming Events</h3>
      <p class="gida-event-desc" style="font-size:1.02rem;color:#334155;line-height:1.65;margin:16px 0 24px 0;">
        Our next event is coming soon. Please check back for updates.
      </p>
      <div class="gida-event-actions">
        <button type="button" class="gida-btn-register" id="gidaBtnCloseEvents" style="cursor:pointer;flex:none;padding:10px 28px;">
          <span>Close</span>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  // Logic: Open / Close Modal
  function openModal() {
    modalOverlay.style.display = 'flex';
    // Force reflow for CSS transition
    void modalOverlay.offsetWidth;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    setTimeout(function() {
      modalOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 250);
  }

  // Floating button click
  floatingBtn.addEventListener('click', function(e) {
    e.preventDefault();
    openModal();
  });

  // Close handlers
  var closeBtn = document.getElementById('gidaEventModalCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      closeModal();
    });
  }

  var closeEventsBtn = document.getElementById('gidaBtnCloseEvents');
  if (closeEventsBtn) {
    closeEventsBtn.addEventListener('click', function() {
      closeModal();
    });
  }

  // Backdrop click
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Escape key handler
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

})();
