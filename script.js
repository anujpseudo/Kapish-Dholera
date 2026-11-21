/* ==========================================================================
   AURELIA LANDMARK — INTERACTIVE UI, ROI SIMULATOR & MODALS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Luxury Theme Palette Switcher
  const htmlEl = document.documentElement;
  const themeDots = document.querySelectorAll('.theme-dot');

  themeDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const selectedTheme = dot.getAttribute('data-set-theme');
      htmlEl.setAttribute('data-theme', selectedTheme);
      themeDots.forEach((d) => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  // 2. Sticky Header & Mobile Drawer Toggle
  const siteHeader = document.getElementById('siteHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 24) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Interactive Plot Size & ROI Appreciation Simulator
  const assetTypeSelect = document.getElementById('assetTypeSelect');
  const plotSizeRange = document.getElementById('plotSizeRange');
  const plotSizeDisplay = document.getElementById('plotSizeDisplay');
  const horizonButtons = document.querySelectorAll('.horizon-btn');

  const roiInitialValue = document.getElementById('roiInitialValue');
  const roiProjectedValue = document.getElementById('roiProjectedValue');
  const roiYearsLabel = document.getElementById('roiYearsLabel');
  const roiNetGain = document.getElementById('roiNetGain');

  let selectedYears = 5;

  function formatLakhsOrCrores(amountInRupees) {
    const lakhs = amountInRupees / 100000;
    if (lakhs >= 100) {
      return `₹${(lakhs / 100).toFixed(2)} Cr`;
    }
    return `₹${lakhs.toFixed(2)} Lakhs`;
  }

  function updateRoiEstimator() {
    if (!assetTypeSelect || !plotSizeRange) return;
    const selectedOption = assetTypeSelect.options[assetTypeSelect.selectedIndex];
    const ratePerSqYd = parseFloat(selectedOption.value);
    const cagr = parseFloat(selectedOption.getAttribute('data-cagr'));
    const sqYards = parseInt(plotSizeRange.value, 10);

    plotSizeDisplay.textContent = `${sqYards.toLocaleString('en-IN')} Sq. Yds`;

    const initialCost = ratePerSqYd * sqYards;
    const projectedCost = initialCost * Math.pow(1 + cagr, selectedYears);
    const netGain = projectedCost - initialCost;
    const gainPct = Math.round(((projectedCost - initialCost) / initialCost) * 100);

    roiInitialValue.textContent = formatLakhsOrCrores(initialCost);
    roiYearsLabel.textContent = String(selectedYears);
    roiProjectedValue.textContent = formatLakhsOrCrores(projectedCost);
    roiNetGain.textContent = `+${formatLakhsOrCrores(netGain)} (+${gainPct}%)`;
  }

  if (assetTypeSelect && plotSizeRange) {
    assetTypeSelect.addEventListener('change', updateRoiEstimator);
    plotSizeRange.addEventListener('input', updateRoiEstimator);

    horizonButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        horizonButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        selectedYears = parseInt(btn.getAttribute('data-years'), 10);
        updateRoiEstimator();
      });
    });

    updateRoiEstimator();
  }

  // 4. Township Category Filter Tabs
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden-card');
        } else {
          card.classList.add('hidden-card');
        }
      });
    });
  });

  // 5. Modals Management (Booking, Project Quick-View, 3D Walkthrough)
  const bookingModal = document.getElementById('bookingModal');
  const projectModal = document.getElementById('projectModal');
  const walkthroughModal = document.getElementById('walkthroughModal');
  const allModals = [bookingModal, projectModal, walkthroughModal];

  function openModal(modal) {
    if (!modal) return;
    allModals.forEach((m) => m && m.classList.remove('open'));
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeAllModals() {
    allModals.forEach((m) => {
      if (m) {
        m.classList.remove('open');
        m.setAttribute('aria-hidden', 'true');
      }
    });
  }

  document.querySelectorAll('.open-booking-modal').forEach((trigger) => {
    trigger.addEventListener('click', () => openModal(bookingModal));
  });

  document.querySelectorAll('.switch-to-booking').forEach((btn) => {
    btn.addEventListener('click', () => openModal(bookingModal));
  });

  document.querySelectorAll('.open-project-modal').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById('projModalTitle').textContent = btn.getAttribute('data-title');
      document.getElementById('projModalLoc').textContent = btn.getAttribute('data-location');
      document.getElementById('projModalStatus').textContent = btn.getAttribute('data-status');
      document.getElementById('projModalPrice').textContent = btn.getAttribute('data-price');
      document.getElementById('projModalSizes').textContent = btn.getAttribute('data-sizes');
      document.getElementById('projModalDesc').textContent = btn.getAttribute('data-desc');
      document.getElementById('projModalImg').src = btn.getAttribute('data-image');
      openModal(projectModal);
    });
  });

  const openWalkthroughBtn = document.getElementById('openWalkthroughModal');
  if (openWalkthroughBtn) {
    openWalkthroughBtn.addEventListener('click', () => openModal(walkthroughModal));
  }

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  allModals.forEach((modal) => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // 6. Toast Feedback & Form Submissions
  const toastBanner = document.getElementById('toastBanner');
  let toastTimeout;

  function showToast(message) {
    if (!toastBanner) return;
    toastBanner.textContent = message;
    toastBanner.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastBanner.classList.remove('show');
    }, 4200);
  }

  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('leadName').value.trim();
      closeAllModals();
      bookingForm.reset();
      showToast(`Thank you, ${name}! Our Senior Advisor will send the brochure & call you shortly.`);
    });
  }

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.reset();
      showToast('Subscribed! You will receive pre-launch alerts and quarterly valuation reports.');
    });
  }

  // 7. Scroll Reveal IntersectionObserver
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }
});
