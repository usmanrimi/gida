
// ==========================================
// DEFAULT STORE CONFIGURATION
// ==========================================
const DEFAULT_MANAGED_IMAGES = [
  {
    id: 'hp-hero',
    title: 'Homepage Main Hero Visual',
    section: 'Homepage',
    ratio: 'Recommended: 16:9 (1920x1080)',
    src: 'assets/img/agri.jpg',
    alt: 'Sustainable agricultural systems and rural prosperity in Northern Nigeria',
    usage: 'Homepage Top Hero Background',
    selector: '.hero-visual'
  },
  {
    id: 'hp-director',
    title: 'Executive Director / CEO Portrait',
    section: 'Homepage',
    ratio: 'Recommended: 4:5 (Portrait 800x1000)',
    src: 'assets/img/director.jpg',
    alt: 'Executive Director of Growth Innovation for Development Action',
    usage: 'Homepage & About Leadership Section',
    selector: '.ceo-img'
  },
  {
    id: 'about-banner',
    title: 'About Page Hero Visual',
    section: 'About',
    ratio: 'Recommended: 16:9 (1920x1080)',
    src: 'assets/img/market.jpg',
    alt: 'Rural community market enterprise and economic empowerment',
    usage: 'About Us Page Top Banner',
    selector: '.page-head'
  },
  {
    id: 'about-profile',
    title: 'About Page Profile Feature',
    section: 'About',
    ratio: 'Recommended: 4:3 (Landscape)',
    src: 'assets/img/agri.jpg',
    alt: 'Field agronomists and farmers testing bio-safe inputs',
    usage: 'About Us Institutional Profile Section',
    selector: '.about-profile-img'
  },
  {
    id: 'programs-banner',
    title: 'Programs & Pillars Banner',
    section: 'Programs',
    ratio: 'Recommended: 16:9 (1920x1080)',
    src: 'assets/img/market.jpg',
    alt: 'Market system and rural commerce development',
    usage: 'Pillars & Programs Page Top Banner'
  },
  {
    id: 'safeguarding-banner',
    title: 'Safeguarding & Publications Banner',
    section: 'Safeguarding',
    ratio: 'Recommended: 16:9 (1920x1080)',
    src: 'assets/img/director.jpg',
    alt: 'Dignified community representation and institutional leadership',
    usage: 'Safeguarding Page Top Hero Background'
  },
  {
    id: 'career-banner',
    title: 'Career & Vacancies Hero Banner',
    section: 'Career',
    ratio: 'Recommended: 16:9 (1920x1080)',
    src: 'assets/img/market.jpg',
    alt: 'Field development professionals collaborating in rural communities',
    usage: 'Careers Page Top Banner'
  },
  {
    id: 'contact-banner',
    title: 'Contact Us Hero Banner',
    section: 'Contact',
    ratio: 'Recommended: 16:9 (1920x1080)',
    src: 'assets/img/market.jpg',
    alt: 'Rural community hub and headquarters contact backdrop',
    usage: 'Contact Us Page Top Banner'
  }
];

const DEFAULT_STORE = {
  heroVisual: {
    src: "assets/img/gida-logo-official.png",
    alt: "GIDA Official Organization Emblem & Identity",
    title: "GIDA Official Seal",
    kicker: "",
    headline: "Where people prosper.",
    desc: "Cultivating resilient rural market systems, low-cost green infrastructure, community and planetary health, and gender-transformative livelihoods."
  },
  homepage: {
    kicker: "",
    headline: "Where people prosper.",
    desc: "Cultivating resilient rural market systems, low-cost green infrastructure, community and planetary health, and gender-transformative livelihoods.",
    prosperity: "GIDA defines prosperity holistically, as equitable economic wealth, physical and biological health, social dignity, and environmental resilience, working together rather than in isolation."
  },
  about: {
    heading: "Equitable systems. Resilient land. Enduring human prosperity.",
    lead: "Growth Innovation for Development Action (GIDA) is a specialized development organization incorporated as a Company Limited by Guarantee (LTD/GTE) in Kano, Nigeria. We bridge systemic research with pragmatic, community-anchored execution.",
    approach: "Our holistic model addresses rural poverty not as isolated technical deficits, but as deeply interconnected market failures, planetary vulnerabilities, and structural social exclusion."
  },
  safeguarding: {
    zeroTolerance: "GIDA enforces a zero-tolerance policy against gender-based discrimination, sexual exploitation, abuse, and harassment (PSEAH), child labour, and financial fraud across all operations and partnerships.",
    email: "safeguarding@gida-action.org",
    hotline: "+234 800 GIDA SAFE (0800 4432 7233)"
  },
  ceo: {
    name: 'Bukola F. Sanni',
    role: 'Lead Inclusion Development',
    photo: 'assets/img/ceo-bukola.png',
    quote: 'True economic transformation takes root when rural women and youth lead market design, cold storage aggregation, and financial stewardship across every community hub.',
    body: 'At GIDA, we ground every strategic intervention in local dignity and measurable economic impact. From expanding micro-irrigation to structuring de-risked value chains, our commitment is ensuring that every rural producer has the tools, infrastructure, and institutional backing to thrive.',
    visible: true
  },
  leadershipSection: {
    title: "Leadership",
    kicker: "Messages & Perspectives",
    desc: "Guidance, strategic vision, and field perspectives from executive leadership, technical experts, and core development partners.",
    visible: true
  },
  leadershipMessages: [
    {
      id: 1,
      name: "Bukola F. Sanni",
      role: "Lead Inclusion Development",
      organization: "Growth Innovation for Development Action (GIDA)",
      expertise: "Financial Inclusion • Gender Equality • Rural Markets",
      category: "Executive Leadership",
      photo: "assets/img/ceo-bukola.png",
      date: "October 2026",
      excerpt: "GIDA’s approach to inclusive development goes beyond representation, focusing on real ownership, opportunity, and participation for women, youth, persons differently abled, and marginalized communities.",
      fullMessage: "GIDA’s approach to inclusive development goes beyond representation, focusing on real ownership, opportunity, and participation for women, youth, persons differently abled, and marginalized communities.\n\nThat belief sits at the center of everything we do; it’s why our institutional promise is simple: Where People Prosper. Through strong safeguarding standards, community-centered programmes, and equitable partnerships, GIDA works to ensure development creates lasting value and shared prosperity for everyone.",
      ctaText: "Read Full Message",
      featured: true,
      status: "published",
      order: 1
    },
    {
      id: 2,
      name: "Food Systems & Policy Advisor",
      role: "Food Systems & Policy Advisor",
      organization: "Growth Innovation for Development Action (GIDA)",
      expertise: "Food Systems Policy • Agricultural Law • Compliance & Governance",
      category: "Advisory & Governance",
      photo: "assets/img/advisor-food-systems.jpg",
      date: "October 2026",
      excerpt: "I lead policy development, programme implementation and stakeholder engagement across food systems and sustainable agriculture, drawing on legal professionalism, compliance and governance.",
      fullMessage: "As a Food Systems & Policy Advisor at GIDA, I lead policy development, programme implementation and stakeholder engagement across food systems and sustainable agriculture. Drawing on my legal professionalism, I bring a strong focus on policy, contracts, compliance and governance.\n\nMy interest lies at the intersection of policy, law and food systems. I lead and contribute to research, project development and the development of practical tools that strengthen GIDA’s work and drive activities across its programmes.",
      ctaText: "Read Full Message",
      featured: false,
      status: "published",
      order: 2
    }
  ],
  videoSection: {
    title: "Featured Sessions & Video Insights",
    kicker: "",
    desc: "Recorded webinars, technical dialogues, and field documentaries from GIDA programmes, sprints, and stakeholder forums."
  },
  videos: [
    {
      id: 1791219800000,
      title: "Beyond Gender-Blind Finance: Activating Gender-Disaggregated Data",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "assets/img/video-cover-gender-finance.jpg",
      thumbnailType: "custom",
      speaker: "Bukola F. Sanni & Technical Panelists",
      event: "AIR × CBN Design Sprint Dialogue",
      category: "Dialogue & Webinar",
      duration: "38 mins",
      date: "October 2026",
      excerpt: "Exploring alternative credit-assessment methodologies, VSLA transaction data, and flexible financing models to unlock productive capital for women-led agribusinesses.",
      description: "Watch the complete session recording exploring how gender-disaggregated data, alternative credit assessments, and flexible financing models can expand formal credit access for female smallholders and agribusiness entrepreneurs across Sub-Saharan Africa.",
      featuredOnHome: true,
      status: "published",
      order: 1
    },
    {
      id: 1791219800001,
      title: "Regenerative Soil Systems & Microbial Testing at the Farm Gate",
      youtubeUrl: "https://www.youtube.com/watch?v=y881t8ilMyc",
      youtubeId: "y881t8ilMyc",
      thumbnail: "assets/img/video-cover-regenerative-soil.jpg",
      thumbnailType: "custom",
      speaker: "GIDA Agronomy Technical Unit",
      event: "Northern Corridors Farmer Summit",
      category: "Field Masterclass",
      duration: "24 mins",
      date: "September 2026",
      excerpt: "Practical field demonstration of rapid colorimetric soil assays and indigenous microorganism culturing that boosted sorghum yields by 38%.",
      description: "Technical field masterclass demonstrating rapid on-farm soil testing, indigenous microorganism fermentation, and cover-crop nitrogen fixation methods deployed across 12,000 smallholders.",
      featuredOnHome: true,
      status: "published",
      order: 2
    },
    {
      id: 1791219800002,
      title: "Decentralized Solar Cold Storage & Women-Led Aggregation Hubs",
      youtubeUrl: "https://www.youtube.com/watch?v=7X8II6J-6mU",
      youtubeId: "7X8II6J-6mU",
      thumbnail: "assets/img/video-cover-solar-cold-storage.jpg",
      thumbnailType: "custom",
      speaker: "Horticultural Cooperative Leaders & Engineers",
      event: "Green Infrastructure Showcase",
      category: "Impact Documentary",
      duration: "16 mins",
      date: "August 2026",
      excerpt: "How rural female cooperatives curtailed perishable crop spoilage by 85% using 100% solar walk-in cold rooms and Pay-As-You-Store fees.",
      description: "A field documentary highlighting the deployment and cooperative governance of decentralized 100% solar cold storage hubs across perishable crop trading junctions.",
      featuredOnHome: true,
      status: "published",
      order: 3
    }
  ],
  articles: [
    {
      id: 1,
      title: "Scaling Regenerative Soil Systems Across Northern Agricultural Corridors",
      category: "Field Insights",
      author: "GIDA Agronomy Team",
      date: "15 September 2026",
      excerpt: "How bio-innovations, indigenous compost amendments, and microbial soil testing are revitalizing exhausted farmlands while raising smallholder yields by over 38%.",
      image: "assets/img/agri.jpg",
      status: "published",
      featured: true,
      content: "Sustainable rural prosperity starts with the health of the soil under our feet. For generations, northern farming clusters have battled severe topsoil degradation, nutrient leaching, and dependency on costly synthetic inputs that degrade long-term soil biology.\n\nOver the past two cropping seasons, GIDA's Community & Planetary Health team has partnered with over 12,000 smallholders across Kano, Jigawa, and Kaduna corridors to pilot low-cost bio-safe soil fertility protocols.\n\n### The Core Interventions\n\n1. **On-Farm Microbial Soil Testing:** Rapid colorimetric assays enabling farmers to assess nitrogen, phosphorus, and organic carbon levels within minutes at the farm gate.\n2. **Indigenous Microorganism (IMO) Culturing:** Sourcing indigenous forest fungi and beneficial microbes to accelerate organic compost fermentation from 90 days down to 21 days.\n3. **Cover Crop Nitrogen Fixation:** Integrating deep-rooted leguminous cover crops into cereal rotations, sequestering atmospheric nitrogen while suppressing weed proliferation without herbicides.\n\n### Documented Field Impact\n\nInitial harvest data demonstrates that participating farmer clusters achieved a 38.4% increase in sorghum and millet yields, alongside a 45% reduction in synthetic fertilizer expenditure. Furthermore, soil moisture retention increased measurably, shielding crops during dry spells and late-season heatwaves.\n\nAs we expand this model to 50,000 farmers in 2027, GIDA remains committed to transforming scientific ecological research into practical, community-owned wealth."
    },
    {
      id: 2,
      title: "Women-Led Solar Cold Hubs: Breaking the Post-Harvest Loss Cycle",
      category: "Market Systems",
      author: "Amina Bello, Market Systems Lead",
      date: "28 August 2026",
      excerpt: "Deploying 100% solar-powered decentralized cold storage units managed exclusively by female cooperative clusters in rural aggregation centers.",
      image: "assets/img/market.jpg",
      status: "published",
      featured: false,
      content: "In horticultural value chains across northern Nigeria, post-harvest losses among perishable crops such as tomatoes, peppers, and leafy greens routinely exceed 42%. Smallholder women, who bear the primary burden of harvest aggregation and retail trading, are forced to distress-sell at cut-throat prices before evening sets in.\n\nGIDA's Green Infrastructure and GESI units joined forces to introduce decentralized, solar-powered walk-in cold rooms located directly at key rural trading junctions.\n\n### Cooperative Ownership & Governance\n\nUnlike conventional top-down donor projects, these facilities are structured as community-owned enterprises governed entirely by female agricultural cooperatives:\n\n- **Pay-As-You-Store Micro-Fees:** Farmers pay a modest daily crate fee (less than 10% of typical distress-sale losses), ensuring commercial viability and ongoing maintenance reserves.\n- **Digital Traceability & Inventory:** A simplified Hausa-language mobile SMS ledger tracks crate ownership, temperature stability, and release times.\n- **Direct Institutional Off-Taking:** Aggregated produce meets institutional buyer standards, allowing women to sell directly to urban supermarkets and processors at premium rates.\n\n### Results and Next Phase\n\nParticipating cooperatives recorded an 85% reduction in spoilage and a 52% average increase in seasonal household income. GIDA is now structuring blended micro-guarantee facilities with regional financial institutions to deploy 30 additional units across regional agricultural corridors."
    },
    {
      id: 3,
      title: "One Health at the Frontline: Surveillance of Zoonotic Pathogens in Livestock Corridors",
      category: "One Health",
      author: "Dr. Kabir Sani, Epidemiologist",
      date: "10 August 2026",
      excerpt: "Bridging veterinary medicine, human clinical care, and ecological monitoring to safeguard rural communities against emerging infectious spillover risks.",
      image: "assets/img/director.jpg",
      status: "published",
      featured: false,
      content: "The boundary between human well-being, livestock resilience, and ecological stability is inseparable. In pastoral and agro-pastoral communities, close daily contact between animals and families creates critical vulnerabilities to zoonotic transmissions and antimicrobial resistance.\n\nGIDA's One Health initiative unites local veterinary officers, primary healthcare workers, and pastoralist leaders in a coordinated early-warning sentinel surveillance network.\n\n### Integrated Community Health Protocols\n\n- **Cross-Sectoral Diagnostic Teams:** Joint health post visits where veterinary and human clinicians share syndromic reports, tracking fever clusters and livestock abortions concurrently.\n- **Antimicrobial Stewardship:** Discouraging prophylactic antibiotic misuse in cattle and poultry through participatory community dialogues and subsidized probiotic alternatives.\n- **Clean Water Point Separation:** Engineering bio-sand filtration systems that physically isolate human domestic drinking points from livestock watering troughs.\n\nBy building trusted institutional connections between pastoralists and public health authorities, GIDA is demonstrating that planetary health is fundamental to rural security and economic dignity."
    }
  ],
  announcements: [
    {
      id: 1,
      title: "Call for Expressions of Interest: Community Bio-Input Aggregation Hubs (Batch 2)",
      category: "Notice / Procurement",
      date: "18 September 2026",
      summary: "GIDA invites registered agricultural cooperatives and youth enterprise clusters across Kano and Jigawa states to submit expressions of interest to host decentralized bio-input aggregation centers.",
      file: "assets/docs/gida-strategic-framework-2026-2030.pdf",
      status: "published",
      details: "Under our Inclusive Market Systems pillar, GIDA is deploying 15 decentralized aggregation hubs equipped with solar power, digital moisture meters, and bio-fertilizer blending kits. Selected cooperatives will receive equipment grants, operational training, and direct links to off-takers. Interested cooperatives should download the official guidelines and application dossier below."
    },
    {
      id: 2,
      title: "Public Notice: Stakeholder Consultation on Rural Climate Adaptation & Safeguarding Standards",
      category: "Institutional Notice",
      date: "05 September 2026",
      summary: "Notice of public stakeholder hearings and multi-stakeholder policy roundtables regarding GIDA's updated 2026–2030 environmental and community safeguarding compliance standards.",
      file: "assets/docs/gida-pseah-safeguarding-mandate.pdf",
      status: "published",
      details: "In alignment with GIDA's transparent governance framework and international PSEAH standards, we are hosting four hybrid regional stakeholder consultations throughout October 2026. Civil society organizations, local government representatives, farmer federations, and academic researchers are cordially invited to participate and review draft frameworks."
    }
  ],
  vacancies: [
    {
      id: 1,
      ref: 'GIDA-VAC-2026-01',
      title: 'Senior Rural Market Systems Specialist',
      dept: 'Market Systems & Livelihoods',
      loc: 'Kano (HQ), with field travel',
      type: 'Full-Time · Technical',
      deadline: '15 October 2026',
      summary: 'Lead the co-design and execution of inclusive market linkages, digital financial tools, and equitable value-chain partnerships for smallholders and NMSMEs.',
      status: 'published'
    },
    {
      id: 2,
      ref: 'GIDA-VAC-2026-02',
      title: 'One Health & Bio-Innovations Officer',
      dept: 'Community & Planetary Health',
      loc: 'Northern Region Field Hubs',
      type: 'Full-Time · Science & Health',
      deadline: '28 October 2026',
      summary: 'Spearhead microbial water testing, mycotoxin post-harvest mitigation, and bio-safe soil fertility protocols across rural cluster cooperatives.',
      status: 'published'
    },
    {
      id: 3,
      ref: 'GIDA-VAC-2026-03',
      title: 'GESI & Safeguarding Focal Lead',
      dept: 'Safeguarding & Governance',
      loc: 'Kano / Hybrid',
      type: 'Contract · Safeguarding',
      deadline: '10 November 2026',
      summary: 'Oversee community-based grievance redress mechanisms, PSEAH compliance standards, and transformative gender empowerment across all operations.',
      status: 'published'
    }
  ],
  publications: [
    {
      id: 1,
      title: 'GIDA Strategic Operational Framework (2026–2030)',
      category: 'Strategic Plan',
      date: 'January 2026',
      file: 'assets/docs/gida-strategic-framework-2026-2030.pdf',
      summary: 'Five-pillar strategic blueprint detailing our multi-year interventions across rural market systems, renewable infrastructure, and planetary health.',
      status: 'published'
    },
    {
      id: 2,
      title: 'Comprehensive Safeguarding & PSEAH Policy Mandate',
      category: 'Policy Standard',
      date: 'March 2026',
      file: 'assets/docs/gida-pseah-safeguarding-mandate.pdf',
      summary: 'Institutional zero-tolerance standards, survivor-centered protocols, community reporting mechanisms, and contractual escalation timelines.',
      status: 'published'
    },
    {
      id: 3,
      title: 'One Health & Rural Bio-Security Field Guidelines',
      category: 'Technical Report',
      date: 'February 2026',
      file: 'assets/docs/gida-one-health-field-standards.pdf',
      summary: 'Standard operational procedures for water microbiological testing, post-harvest mycotoxin assays, and community zoonotic disease surveillance.',
      status: 'published'
    },
    {
      id: 4,
      title: 'Gender-Transformative Livelihoods & Market Equity Assessment',
      category: 'Research Publication',
      date: 'April 2026',
      file: 'assets/docs/gida-gesi-cooperatives-assessment.pdf',
      summary: 'Baseline field assessment analyzing female smallholder aggregations, digital financial inclusion tools, and solar cold storage outcomes.',
      status: 'published'
    }
  ],
  programs: [
    { id: 1, num: '01', title: 'Inclusive Market Systems & Rural Livelihoods', tag: 'Livelihoods', status: 'published' },
    { id: 2, num: '02', title: 'Green Infrastructure & Low-Cost Eco-Buildings', tag: 'Green infrastructure', status: 'published' },
    { id: 3, num: '03', title: 'Community & Planetary Health, One Health & Bio-Innovations', tag: 'One Health', status: 'published' },
    { id: 4, num: '04', title: 'Gender Equality and Social Inclusion / Gender Transformative', tag: 'GESI', status: 'published' },
    { id: 5, num: '05', title: 'Local Governance, Policy & Climate Risk Resilience', tag: 'Governance & climate', status: 'published' }
  ],
  images: DEFAULT_MANAGED_IMAGES,
  partners: [
    { id: 1, name: 'State Ministry of Agriculture', type: 'Governmental Partner' },
    { id: 2, name: 'AGRA Alliance for a Green Revolution', type: 'Strategic Partner' },
    { id: 3, name: 'Federal Research Institute for Agro-Ecology', type: 'Research Affiliate' },
    { id: 4, name: 'Rural Energy Access Fund', type: 'Infrastructure Partner' }
  ],
  contact: {
    email: 'info@gida-action.org',
    careers: 'careers@gida-action.org',
    phone: '+234 800 GIDA ACTION',
    address: 'Kano, Nigeria (Company Limited by Guarantee LTD/GTE)'
  },
  social: {
    twitter: 'https://twitter.com/gida_action',
    linkedin: 'https://linkedin.com/company/gida-action',
    facebook: 'https://facebook.com/gidaaction',
    instagram: 'https://instagram.com/gida_action'
  },
  googleSheetsWebhookUrl: 'https://script.google.com/macros/s/AKfycbzWW5wzRbD1KU5iYMkGTSoKyZeI3YBVPxeEI9keJg3KCKRqc_cJ_FX1HcUNUZfzA887/exec'
};

let store = DEFAULT_STORE;
try {
  const existing = JSON.parse(localStorage.getItem('gida_cms_data') || '{}');
  if (existing && typeof existing === 'object') {
    store = { ...DEFAULT_STORE, ...existing };
    if (!store.leadershipSection) store.leadershipSection = DEFAULT_STORE.leadershipSection;
    if (!Array.isArray(store.leadershipMessages) || store.leadershipMessages.length === 0) store.leadershipMessages = DEFAULT_STORE.leadershipMessages;
    if (!store.videoSection) store.videoSection = DEFAULT_STORE.videoSection;
    if (!Array.isArray(store.videos) || store.videos.length === 0) store.videos = DEFAULT_STORE.videos;
    if (!store.googleSheetsWebhookUrl) store.googleSheetsWebhookUrl = DEFAULT_STORE.googleSheetsWebhookUrl;
  }
} catch(e) {
  store = DEFAULT_STORE;
}

// PERSISTENCE ENGINE: Saves to browser storage and synchronizes directly to server disk
async function persist() {
  store.updatedAt = new Date().toISOString();
  if (typeof window.GIDA_PERSIST_CMS === 'function') {
    const res = await window.GIDA_PERSIST_CMS(store);
    if (res && res.serverSaved) {
      console.log('[CMS SYNC] Persisted to server disk and broadcasted to all tabs.');
    }
  } else if (typeof window.GIDA_SYNC_CMS === 'function') {
    window.GIDA_SYNC_CMS(store);
  } else {
    localStorage.setItem('gida_cms_data', JSON.stringify(store));
  }
}

// ==========================================
// AUTHENTICATION & INITIAL SERVER SYNC
// ==========================================
const AUTH_KEY = 'gida_admin_authenticated';

async function syncWithServer() {
  try {
    let serverData = null;
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      try {
        const res = await fetch('/api/get-cms?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) serverData = await res.json();
      } catch(e) {}
    }
    if (!serverData) {
      try {
        const fileRes = await fetch('assets/data/cms-data.json?t=' + Date.now(), {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
        });
        if (fileRes.ok) serverData = await fileRes.json();
      } catch(e) {}
    }
    if (serverData && typeof serverData === 'object') {
      store = { ...DEFAULT_STORE, ...store, ...serverData };
      localStorage.setItem('gida_cms_data', JSON.stringify(store));
      renderAll();
    }
    checkServerConnection();
  } catch(e) {
    console.warn('[CMS] Server sync notice:', e);
  }
}

// ==========================================
// SECURE AUTHENTICATION & ROUTE PROTECTION
// ==========================================
function getAdminRequestedTab() {
  const path = window.location.pathname.replace(/^\/admin\/?/, '').trim();
  const aliasMap = {
    'dashboard': 'overview',
    'blog': 'articles',
    'news': 'articles',
    'reports': 'publications',
    'careers': 'vacancies',
    'jobs': 'vacancies',
    'registrations': 'registrations',
    'events': 'registrations',
    'event-registrations': 'registrations'
  };
  if (path) {
    const segment = path.split('/')[0].toLowerCase();
    return aliasMap[segment] || segment;
  }
  if (window.location.hash) {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    return aliasMap[hash] || hash;
  }
  return '';
}

function checkAuth() {
  const token = sessionStorage.getItem('gida_admin_token');
  const isAuth = sessionStorage.getItem(AUTH_KEY) === 'true' && Boolean(token);
  const loginScreen = document.getElementById('loginScreen');
  const adminApp = document.getElementById('adminApp');
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPass');

  if (isAuth) {
    if (loginScreen) loginScreen.style.display = 'none';
    if (adminApp) adminApp.style.display = 'block';

    // Route to requested tab if pending
    const pendingTab = sessionStorage.getItem('gida_post_login_tab') || getAdminRequestedTab();
    if (pendingTab) {
      sessionStorage.removeItem('gida_post_login_tab');
      switchTab(pendingTab);
    }

    renderAll();
    syncWithServer();
  } else {
    // If not authenticated, keep adminApp hidden and enforce login screen
    if (adminApp) adminApp.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';

    // Store requested subroute to restore upon authentication, and clean URL to /admin
    const reqTab = getAdminRequestedTab();
    if (reqTab) {
      sessionStorage.setItem('gida_post_login_tab', reqTab);
    }
    if (window.location.pathname !== '/admin' && window.location.pathname !== '/admin/') {
      try {
        window.history.replaceState(null, '', '/admin');
      } catch(e) {}
    }

    // Ensure fields are empty
    if (emailInput && !emailInput.value) emailInput.value = '';
    if (passInput) passInput.value = '';
  }
}

// Show/Hide password toggle control
const togglePassBtn = document.getElementById('togglePassBtn');
if (togglePassBtn) {
  togglePassBtn.addEventListener('click', (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const passInput = document.getElementById('loginPass');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeSlashIcon = document.getElementById('eyeSlashIcon');
    if (!passInput) return;
    if (passInput.type === 'password') {
      passInput.type = 'text';
      if (eyeIcon) eyeIcon.style.display = 'none';
      if (eyeSlashIcon) eyeSlashIcon.style.display = 'block';
    } else {
      passInput.type = 'password';
      if (eyeIcon) eyeIcon.style.display = 'block';
      if (eyeSlashIcon) eyeSlashIcon.style.display = 'none';
    }
    passInput.focus();
  });
}

function showLoginError(msg) {
  const errBox = document.getElementById('loginError');
  const errText = document.getElementById('loginErrorText');
  if (errBox) {
    if (errText) errText.innerText = msg || 'Invalid email or password.';
    errBox.style.display = 'flex';
  }
}

function hideLoginError() {
  const errBox = document.getElementById('loginError');
  if (errBox) errBox.style.display = 'none';
}

document.getElementById('loginEmail')?.addEventListener('input', hideLoginError);
document.getElementById('loginPass')?.addEventListener('input', hideLoginError);

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideLoginError();

  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPass');
  const submitBtn = document.getElementById('loginSubmitBtn');

  const identifier = (emailInput?.value || '').trim();
  const password = passInput?.value || '';

  if (!identifier || !password) {
    showLoginError('Please enter your email or username, and password.');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = 'Authenticating...';
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success && data.token) {
      sessionStorage.setItem('gida_admin_token', data.token);
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem('gida_admin_user', data.user || identifier);

      // Clear password field immediately
      if (passInput) passInput.value = '';

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Sign In to Dashboard';
      }

      showToast('Authenticated as Super Administrator');
      checkAuth();
    } else {
      showLoginError('Invalid email or password.');
      if (passInput) {
        passInput.value = '';
        passInput.focus();
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Sign In to Dashboard';
      }
    }
  } catch(err) {
    console.error('[AUTH ERROR]', err);
    showLoginError('Invalid email or password.');
    if (passInput) {
      passInput.value = '';
      passInput.focus();
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Sign In to Dashboard';
    }
  }
});

async function logout() {
  if (!confirm("Do you confirm signing out of Super Admin?")) return;
  try {
    const token = sessionStorage.getItem('gida_admin_token');
    await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (token || '')
      }
    }).catch(() => {});
  } catch(e) {}

  sessionStorage.removeItem('gida_admin_token');
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem('gida_admin_user');
  sessionStorage.removeItem('gida_post_login_tab');

  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPass');
  if (emailInput) emailInput.value = '';
  if (passInput) passInput.value = '';
  hideLoginError();

  showToast('Logged out securely');
  checkAuth();
}

// ==========================================
// DUAL-MODE PUSH TO LIVE (LOCAL GIT & GITHUB REST API)
// ==========================================
async function checkServerConnection() {
  const badge = document.getElementById('connStatusBadge');
  const dot = document.getElementById('connStatusDot');
  const text = document.getElementById('connStatusText');
  const ghPill = document.getElementById('ghStatusPill');

  try {
    const res = await fetch('/api/health?t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      if (dot) dot.style.background = '#22c55e';
      const healthData = await res.json().catch(() => ({}));
      const activePort = healthData.port || window.location.port || '8000';
      if (text) text.innerText = 'Server Connected (Port ' + activePort + ')';
      if (badge) {
        badge.style.background = '#dcfce7';
        badge.style.color = '#15803d';
        badge.title = 'Local Python server is active. Changes push directly via Git.';
      }
      if (ghPill) {
        ghPill.innerText = 'Local Server Active';
        ghPill.className = 'badge-status badge-published';
      }
      return true;
    }
  } catch(e) {}

  // Not on local server, check if GitHub token is present
  const ghToken = localStorage.getItem('gida_github_token');
  if (ghToken) {
    if (dot) dot.style.background = '#0284c7';
    if (text) text.innerText = 'GitHub API Mode (Direct)';
    if (badge) {
      badge.style.background = '#e0f2fe';
      badge.style.color = '#0369a1';
      badge.title = 'Super Admin is configured with GitHub Token for 1-click cloud publishing.';
    }
    if (ghPill) {
      ghPill.innerText = 'GitHub Token Configured';
      ghPill.className = 'badge-status badge-published';
    }
    return false;
  } else {
    if (dot) dot.style.background = '#f59e0b';
    if (text) text.innerText = 'Cloud Mode (Setup Token)';
    if (badge) {
      badge.style.background = '#fef3c7';
      badge.style.color = '#b45309';
      badge.title = 'Running on hosted web. Enter GitHub token in Settings to enable 1-click push.';
    }
    if (ghPill) {
      ghPill.innerText = 'Token Needed for Cloud Push';
      ghPill.className = 'badge-status badge-draft';
    }
    return false;
  }
}

async function pushChangesToLive() {
  if (!confirm("Do you confirm pushing all website changes to the live repository and deploying?")) return;

  const btn = document.getElementById('btnPushLive');
  const txt = document.getElementById('btnPushLiveText');
  const originalHtml = txt ? txt.innerText : 'Push Changes to Live';

  try {
    if (btn) btn.disabled = true;
    if (txt) txt.innerText = 'Saving Changes...';
    showToast('Saving and packaging latest CMS data...');

    // 1. Ensure latest store is saved locally & to server disk if running
    await persist();

    // 2. Detect local Python server
    let isServerRunning = false;
    try {
      const ping = await fetch('/api/health?t=' + Date.now(), { cache: 'no-store' });
      if (ping.ok) isServerRunning = true;
    } catch(e) {}

    if (isServerRunning) {
      // --- MODE 1: LOCAL PYTHON SERVER (Localhost:3000) ---
      if (txt) txt.innerText = 'Pushing to GitHub (Local)...';
      showToast('Pushing changes to GitHub via local development server...');

      const response = await fetch('/api/push-changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Update CMS content and site data from Super Admin' })
      });

      const result = await response.json().catch(() => ({}));
      if (response.ok && result.success) {
        showToast('✓ Successfully pushed changes to live repository (' + result.branch + ')');
        alert('Do you confirm completion: Changes have been successfully published and pushed to GitHub (origin/' + result.branch + ')!\n\nYour live website (https://gida-xi.vercel.app) is automatically deploying.');
        checkServerConnection();
        return;
      } else {
        throw new Error(result.error || ('Server returned HTTP ' + response.status));
      }
    }

    // --- MODE 2: DIRECT GITHUB REST API (Works on Vercel / Remote / Cloud) ---
    const token = localStorage.getItem('gida_github_token');
    if (!token) {
      openGitHubModal();
      return;
    }

    if (txt) txt.innerText = 'Pushing to GitHub API...';
    showToast('Pushing directly to GitHub repository via REST API...');

    await pushViaGitHubApi(token);

  } catch (err) {
    console.error('[PUSH ERROR]', err);
    showToast('Push Error: ' + err.message);
    alert('Push Notice: ' + err.message + '\n\nNote: Your changes remain safely saved locally. If running on the web, please check your GitHub Token in Settings.');
  } finally {
    if (btn) btn.disabled = false;
    if (txt) txt.innerText = originalHtml;
  }
}

async function pushViaGitHubApi(token) {
  const repo = 'usmanrimi/gida';
  const branch = 'master';
  const path = 'assets/data/cms-data.json';
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;

  // 1. Fetch current file SHA
  let currentSha = null;
  const getRes = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (getRes.ok) {
    const fileInfo = await getRes.json();
    currentSha = fileInfo.sha;
  } else if (getRes.status === 401 || getRes.status === 403) {
    throw new Error('GitHub authentication failed. Please update your GitHub Token in Settings.');
  }

  // 2. Prepare base64 payload
  const jsonString = JSON.stringify(store, null, 2);
  const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

  const putBody = {
    message: 'Update CMS content and site data from Super Admin [skip ci]',
    content: base64Content,
    branch: branch
  };
  if (currentSha) {
    putBody.sha = currentSha;
  }

  // 3. Commit to GitHub master branch
  const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(putBody)
  });

  if (!putRes.ok) {
    const errData = await putRes.json().catch(() => ({}));
    throw new Error(errData.message || `GitHub API returned ${putRes.status}`);
  }

  showToast('✓ Successfully committed to GitHub master! Vercel auto-deploying...');
  alert('Do you confirm completion: Changes have been successfully committed directly to GitHub (' + repo + ':' + branch + ')!\n\nYour live website (https://gida-xi.vercel.app) is auto-deploying now and will apply across the website momentarily.');
  checkServerConnection();
}

function openGitHubModal() {
  const modal = document.getElementById('githubModal');
  const input = document.getElementById('modalGhToken');
  if (input) input.value = localStorage.getItem('gida_github_token') || '';
  if (modal) modal.style.display = 'flex';
}

async function saveTokenFromModalAndPush() {
  const input = document.getElementById('modalGhToken');
  const token = input ? input.value.trim() : '';
  if (!token) {
    alert('Please enter your GitHub Personal Access Token.');
    return;
  }
  localStorage.setItem('gida_github_token', token);
  closeModal('githubModal');
  showToast('GitHub token saved. Initiating direct push...');
  checkServerConnection();
  try {
    await pushViaGitHubApi(token);
  } catch(err) {
    console.error(err);
    alert('Direct GitHub Push Error: ' + err.message);
  }
}

function saveGitHubSettings() {
  const token = document.getElementById('ghToken').value.trim();
  if (!token) {
    if (confirm("Remove saved GitHub token?")) {
      localStorage.removeItem('gida_github_token');
      showToast('GitHub token removed');
      checkServerConnection();
    }
    return;
  }
  localStorage.setItem('gida_github_token', token);
  showToast('GitHub token saved securely in browser storage');
  checkServerConnection();
}

function toggleTokenVisibility() {
  const input = document.getElementById('ghToken');
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

async function testGitHubConnection() {
  const token = (document.getElementById('ghToken') ? document.getElementById('ghToken').value.trim() : '') || localStorage.getItem('gida_github_token');
  const resDiv = document.getElementById('ghTestResult');
  const pill = document.getElementById('ghStatusPill');

  if (!token) {
    alert('Please enter a GitHub Personal Access Token first.');
    return;
  }

  if (resDiv) {
    resDiv.style.display = 'block';
    resDiv.innerHTML = '<span style="color:#0284c7;">Testing connection to GitHub repository usmanrimi/gida...</span>';
  }

  try {
    const res = await fetch('https://api.github.com/repos/usmanrimi/gida', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const repoData = await res.json();
      const hasPush = repoData.permissions ? repoData.permissions.push : true;
      if (resDiv) {
        resDiv.innerHTML = `<span style="color:#16a34a;font-weight:700;">✓ Connected to GitHub repository "${repoData.full_name}"! Push Permission: ${hasPush ? 'Granted' : 'Read-Only (Requires "repo" scope)'}</span>`;
      }
      if (pill) {
        pill.innerText = 'Connected to GitHub';
        pill.className = 'badge-status badge-published';
      }
      localStorage.setItem('gida_github_token', token);
      showToast('GitHub connection verified successfully');
    } else {
      const err = await res.json().catch(() => ({}));
      if (resDiv) {
        resDiv.innerHTML = `<span style="color:#dc2626;font-weight:700;">✕ Connection failed: ${err.message || res.statusText}</span>`;
      }
      if (pill) {
        pill.innerText = 'Connection Failed';
        pill.className = 'badge-status badge-draft';
      }
    }
  } catch(e) {
    if (resDiv) {
      resDiv.innerHTML = `<span style="color:#dc2626;font-weight:700;">✕ Network error connecting to GitHub: ${e.message}</span>`;
    }
  }
}

// ==========================================
// NAVIGATION & TABS
// ==========================================
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('show');
}

function switchTab(tabName) {
  if (tabName === 'ceo') tabName = 'leadership';
  const btn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
  if (btn) btn.click();
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const tabId = 'tab-' + btn.dataset.tab;
    const target = document.getElementById(tabId);
    if(target) target.classList.add('active');
    document.getElementById('currentSectionTitle').innerText = btn.innerText.trim();
    if (btn.dataset.tab === 'registrations') {
      fetchRegistrations();
    }
    
    // Close sidebar on mobile/tablet after selection
    if (window.innerWidth <= 1024) {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
    }
  });
});

function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// ==========================================
// RENDERING FUNCTIONS
// ==========================================
function renderAll() {
  renderStats();
  renderHomepageForm();
  renderAboutForm();
  renderSafeguardingForm();
  renderLeadershipSection();
  renderLeadershipMessages();
  renderVideoSection();
  renderVideos();
  renderArticles();
  renderVacancies();
  renderPublications();
  renderPrograms();
  renderPartners();
  renderContactForm();
  renderSocialForm();
  renderSettingsForm();
  renderManagedImages(currentFilterSection);
  fetchRegistrations();
  updateSheetsStatusBadge();
}

function renderStats() {
  if (document.getElementById('statPrograms')) document.getElementById('statPrograms').innerText = store.programs ? store.programs.length : 0;
  if (document.getElementById('statPublications')) document.getElementById('statPublications').innerText = store.publications ? store.publications.length : 0;
  if (document.getElementById('statArticles')) document.getElementById('statArticles').innerText = store.articles ? store.articles.length : 0;
  if (document.getElementById('statVideos')) document.getElementById('statVideos').innerText = store.videos ? store.videos.length : 0;
  if (document.getElementById('statLeadership')) document.getElementById('statLeadership').innerText = store.leadershipMessages ? store.leadershipMessages.length : 0;
  if (document.getElementById('statVacancies')) document.getElementById('statVacancies').innerText = store.vacancies ? store.vacancies.length : 0;
  if (document.getElementById('statImages')) document.getElementById('statImages').innerText = store.images ? store.images.length : 0;
}

// --- LEADERSHIP SECTION ---
function renderLeadershipSection() {
  if (!store.leadershipSection) store.leadershipSection = DEFAULT_STORE.leadershipSection;
  const k = document.getElementById('leadSecKicker');
  if (k) k.value = store.leadershipSection.kicker || 'Messages & Perspectives';
  const t = document.getElementById('leadSecTitle');
  if (t) t.value = store.leadershipSection.title || 'Leadership';
  const d = document.getElementById('leadSecDesc');
  if (d) d.value = store.leadershipSection.desc || '';
  const v = document.getElementById('leadSecVisible');
  if (v) v.checked = store.leadershipSection.visible !== false;
}

function saveLeadershipSection(e) {
  e.preventDefault();
  if (!confirm("Do you confirm updating the Leadership section headers?")) return;
  store.leadershipSection = {
    kicker: document.getElementById('leadSecKicker').value,
    title: document.getElementById('leadSecTitle').value,
    desc: document.getElementById('leadSecDesc').value,
    visible: document.getElementById('leadSecVisible').checked
  };
  persist();
  showToast('Leadership section header updated and synced live');
}

function confirmModal(title, message, confirmBtnText, onConfirm) {
  const modal = document.getElementById('gidaDeleteConfirmModal');
  const titleEl = document.getElementById('deleteConfirmTitle');
  const msgEl = document.getElementById('deleteConfirmMessage');
  const btnEl = document.getElementById('btnConfirmDeleteExec');
  
  if (titleEl) titleEl.innerText = title || 'Confirm Deletion';
  if (msgEl) msgEl.innerText = message || 'Are you sure you want to proceed?';
  if (btnEl) {
    btnEl.innerText = confirmBtnText || 'Delete Message';
    btnEl.onclick = function() {
      closeModal('gidaDeleteConfirmModal');
      if (typeof onConfirm === 'function') onConfirm();
    };
  }
  if (modal) modal.style.display = 'flex';
}

function renderLeadershipMessages() {
  const tbody = document.getElementById('leadershipTable');
  if (!tbody) return;
  if (!store.leadershipMessages) store.leadershipMessages = DEFAULT_STORE.leadershipMessages || [];

  store.leadershipMessages.sort((a, b) => (a.order || 0) - (b.order || 0));

  tbody.innerHTML = store.leadershipMessages.map((m, idx) => `
    <tr>
      <td style="white-space:nowrap;">
        <div style="display:inline-flex; align-items:center; gap:4px;">
          <button class="btn-action" onclick="moveLeadership(${m.id}, 'up')" ${idx === 0 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : 'title="Move Up"'} style="padding:4px 8px;font-weight:700;font-size:0.85rem;">&uarr;</button>
          <button class="btn-action" onclick="moveLeadership(${m.id}, 'down')" ${idx === store.leadershipMessages.length - 1 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : 'title="Move Down"'} style="padding:4px 8px;font-weight:700;font-size:0.85rem;">&darr;</button>
          <span style="font-size:0.8rem;color:#64748b;font-weight:600;min-width:20px;text-align:center;">#${idx + 1}</span>
        </div>
      </td>
      <td>
        <div style="width:44px;height:44px;border-radius:12px;overflow:hidden;border:1px solid var(--border);background:#f8fafc;box-shadow:0 2px 4px rgba(0,0,0,0.05);">
          <img src="${m.photo || 'assets/img/avatar-placeholder.png'}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover;">
        </div>
      </td>
      <td>
        <strong>${m.name}</strong>
        <div style="font-size:0.8rem;color:var(--text-muted);">${m.role || ''}</div>
      </td>
      <td><span style="font-size:0.85rem;color:#334155;">${m.organization || 'GIDA'}</span></td>
      <td>
        <span style="font-size:0.78rem;color:var(--green-deep);background:rgba(27,77,62,0.06);padding:3px 8px;border-radius:6px;font-weight:500;display:inline-block;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${m.expertise || 'None specified'}">
          ${m.expertise || '—'}
        </span>
      </td>
      <td><span style="font-size:0.78rem;background:#f1f5f9;color:var(--text);padding:3px 8px;border-radius:6px;white-space:nowrap;">${m.category || 'Leadership'}</span></td>
      <td>
        ${m.featured 
          ? '<span style="font-size:0.75rem;background:#fef3c7;color:#92400e;padding:3px 8px;border-radius:100px;font-weight:700;display:inline-flex;align-items:center;gap:4px;">★ Featured</span>' 
          : '<button class="btn-action" style="font-size:0.75rem;padding:2px 6px;" onclick="toggleFeaturedLeadership(' + m.id + ')">Set Featured</button>'}
      </td>
      <td><span class="badge-status ${m.status==='published'?'badge-published':m.status==='archived'?'badge-draft':'badge-draft'}">${m.status}</span></td>
      <td>
        <div class="action-links">
          <button class="btn-action" onclick="previewLeadership(${m.id})">Preview</button>
          <button class="btn-action" onclick="toggleLeadershipStatus(${m.id})">${m.status==='published'?'Unpublish':'Publish'}</button>
          <button class="btn-action" onclick="editLeadershipMessage(${m.id})">Edit</button>
          <button class="btn-action delete" onclick="deleteLeadershipMessage(${m.id}, '${m.name.replace(/'/g, "\\'")}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
  renderStats();
}

function moveLeadership(id, direction) {
  const idx = store.leadershipMessages.findIndex(x => String(x.id) === String(id));
  if (idx < 0) return;
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= store.leadershipMessages.length) return;
  const temp = store.leadershipMessages[idx];
  store.leadershipMessages[idx] = store.leadershipMessages[targetIdx];
  store.leadershipMessages[targetIdx] = temp;
  store.leadershipMessages.forEach((m, i) => m.order = i + 1);
  persist();
  renderLeadershipMessages();
  showToast('Leadership message order updated');
}

function openAddLeadershipModal() {
  document.getElementById('leadershipModalTitle').innerText = 'Add Leadership Message';
  document.getElementById('leadId').value = '';
  document.getElementById('leadName').value = '';
  document.getElementById('leadRole').value = '';
  document.getElementById('leadOrg').value = 'Growth Innovation for Development Action (GIDA)';
  document.getElementById('leadCategory').value = 'Executive Leadership';
  document.getElementById('leadExpertise').value = '';
  document.getElementById('leadCtaText').value = 'Read Full Message';
  document.getElementById('leadPhotoUrl').value = 'assets/img/avatar-placeholder.png';
  document.getElementById('leadPhotoThumbPreview').src = 'assets/img/avatar-placeholder.png';
  document.getElementById('leadExcerpt').value = '';
  document.getElementById('leadFullMessage').value = '';
  document.getElementById('leadStatus').value = 'published';
  document.getElementById('leadFeatured').checked = false;
  document.getElementById('leadershipModal').style.display = 'flex';
}

function editLeadershipMessage(id) {
  const m = store.leadershipMessages.find(x => String(x.id) === String(id));
  if (!m) return;
  document.getElementById('leadershipModalTitle').innerText = 'Edit Leadership Message';
  document.getElementById('leadId').value = m.id;
  document.getElementById('leadName').value = m.name;
  document.getElementById('leadRole').value = m.role || '';
  document.getElementById('leadOrg').value = m.organization || '';
  document.getElementById('leadCategory').value = m.category || 'Executive Leadership';
  document.getElementById('leadExpertise').value = m.expertise || '';
  document.getElementById('leadCtaText').value = m.ctaText || 'Read Full Message';
  document.getElementById('leadPhotoUrl').value = m.photo || 'assets/img/avatar-placeholder.png';
  document.getElementById('leadPhotoThumbPreview').src = m.photo || 'assets/img/avatar-placeholder.png';
  document.getElementById('leadExcerpt').value = m.excerpt || '';
  document.getElementById('leadFullMessage').value = m.fullMessage || '';
  document.getElementById('leadStatus').value = m.status || 'published';
  document.getElementById('leadFeatured').checked = !!m.featured;
  document.getElementById('leadershipModal').style.display = 'flex';
}

function removeLeadershipPhoto() {
  document.getElementById('leadPhotoUrl').value = 'assets/img/avatar-placeholder.png';
  document.getElementById('leadPhotoThumbPreview').src = 'assets/img/avatar-placeholder.png';
  showToast('Photo reset to default placeholder');
}

function saveLeadershipMessage(e) {
  e.preventDefault();
  const id = document.getElementById('leadId').value;
  const isFeatured = document.getElementById('leadFeatured').checked;

  if (isFeatured && store.leadershipMessages) {
    store.leadershipMessages.forEach(x => { if (String(x.id) !== String(id)) x.featured = false; });
  }

  const leadData = {
    name: document.getElementById('leadName').value.trim(),
    role: document.getElementById('leadRole').value.trim(),
    organization: document.getElementById('leadOrg').value.trim(),
    category: document.getElementById('leadCategory').value,
    expertise: document.getElementById('leadExpertise').value.trim(),
    ctaText: (document.getElementById('leadCtaText').value.trim() || 'Read Full Message'),
    photo: document.getElementById('leadPhotoUrl').value.trim() || 'assets/img/avatar-placeholder.png',
    excerpt: document.getElementById('leadExcerpt').value.trim(),
    fullMessage: document.getElementById('leadFullMessage').value.trim(),
    status: document.getElementById('leadStatus').value,
    featured: isFeatured
  };

  if (id) {
    const existing = store.leadershipMessages.find(x => String(x.id) === String(id));
    if (existing) Object.assign(existing, leadData);
  } else {
    store.leadershipMessages.push({
      id: Date.now(),
      order: store.leadershipMessages.length + 1,
      ...leadData
    });
  }

  if (isFeatured || store.leadershipMessages.length === 1) {
    store.ceo = {
      name: leadData.name,
      role: leadData.role,
      quote: leadData.excerpt,
      body: leadData.fullMessage,
      photo: leadData.photo,
      visible: true
    };
  }

  persist();
  renderLeadershipMessages();
  closeModal('leadershipModal');
  showToast('Leadership message saved and synced live');
}

function toggleFeaturedLeadership(id) {
  store.leadershipMessages.forEach(m => {
    m.featured = String(m.id) === String(id);
    if (m.featured) {
      store.ceo = {
        name: m.name,
        role: m.role,
        quote: m.excerpt,
        body: m.fullMessage,
        photo: m.photo,
        visible: true
      };
    }
  });
  persist();
  renderLeadershipMessages();
  showToast('Featured leadership message updated');
}

function toggleLeadershipStatus(id) {
  const m = store.leadershipMessages.find(x => String(x.id) === String(id));
  if (m) {
    const newStatus = m.status === 'published' ? 'draft' : 'published';
    m.status = newStatus;
    persist();
    renderLeadershipMessages();
    showToast(`Status changed to ${m.status}`);
  }
}

function deleteLeadershipMessage(id, name) {
  confirmModal(
    'Delete Leadership Message',
    `Are you sure you want to delete the leadership message from "${name}"?`,
    'Delete Message',
    function() {
      store.leadershipMessages = store.leadershipMessages.filter(x => String(x.id) !== String(id));
      store.leadershipMessages.forEach((m, i) => m.order = i + 1);
      persist();
      renderLeadershipMessages();
      showToast('Leadership message deleted');
    }
  );
}

function previewLeadership(id) {
  window.open('index.html#leadership-section', '_blank');
}

// Backwards compatibility aliases for CEO message
function renderCeoForm() { renderLeadershipSection(); }
function saveCeoMessage(e) { saveLeadershipSection(e); }
function previewCeoPhoto(input) { handleFileUpload(input, 'leadPhotoUrl', 'leadPhotoThumbPreview'); }
function updateCeoPhotoFromUrl(url) {}

// --- VIDEOS & SESSIONS SECTION ---
function renderVideoSection() {
  if (!store.videoSection) store.videoSection = DEFAULT_STORE.videoSection;
  const k = document.getElementById('videoSecKicker');
  if (k) k.value = store.videoSection.kicker || '';
  const t = document.getElementById('videoSecTitle');
  if (t) t.value = store.videoSection.title || 'Featured Sessions & Video Insights';
  const d = document.getElementById('videoSecDesc');
  if (d) d.value = store.videoSection.desc || '';
}

function saveVideoSection(e) {
  e.preventDefault();
  store.videoSection = {
    kicker: document.getElementById('videoSecKicker').value,
    title: document.getElementById('videoSecTitle').value,
    desc: document.getElementById('videoSecDesc').value
  };
  persist();
  showToast('Video section header updated');
}

function renderVideos() {
  const tbody = document.getElementById('videosTable');
  if (!tbody) return;
  if (!store.videos) store.videos = DEFAULT_STORE.videos || [];

  store.videos.sort((a, b) => (a.order || 0) - (b.order || 0));

  tbody.innerHTML = store.videos.map((v, idx) => `
    <tr>
      <td style="white-space:nowrap;">
        <div style="display:inline-flex; align-items:center; gap:4px;">
          <button class="btn-action" onclick="moveVideo(${v.id}, 'up')" ${idx === 0 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : 'title="Move Up"'} style="padding:4px 8px;font-weight:700;font-size:0.85rem;">&uarr;</button>
          <button class="btn-action" onclick="moveVideo(${v.id}, 'down')" ${idx === store.videos.length - 1 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : 'title="Move Down"'} style="padding:4px 8px;font-weight:700;font-size:0.85rem;">&darr;</button>
          <span style="font-size:0.8rem;color:#64748b;font-weight:600;min-width:20px;text-align:center;">#${idx + 1}</span>
        </div>
      </td>
      <td>
        <div style="width:72px;height:40px;border-radius:6px;overflow:hidden;border:1px solid var(--border);background:#000;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,0.08);" onclick="previewVideoInModal('${v.youtubeId}', '${v.title.replace(/'/g, "\\'")}', '${(v.speaker||'').replace(/'/g, "\\'")}', '${(v.excerpt||'').replace(/'/g, "\\'")}')" title="Play Video">
          <img src="${v.thumbnail || 'https://img.youtube.com/vi/' + v.youtubeId + '/hqdefault.jpg'}" alt="${v.title}" style="width:100%;height:100%;object-fit:cover;">
        </div>
      </td>
      <td>
        <strong>${v.title}</strong>
        <div style="font-size:0.75rem;color:var(--text-muted);font-family:monospace;">ID: ${v.youtubeId}</div>
      </td>
      <td>${v.speaker || 'GIDA'}</td>
      <td><span style="font-size:0.78rem;background:#f1f5f9;color:var(--text);padding:3px 8px;border-radius:6px;">${v.category || 'Session'}</span></td>
      <td>${v.duration || '--:--'}</td>
      <td>
        ${v.featuredOnHome 
          ? '<span style="font-size:0.75rem;background:#dcfce7;color:#15803d;padding:2px 8px;border-radius:100px;font-weight:700;">Showcase</span>' 
          : '<span style="font-size:0.75rem;color:var(--text-muted);">Standard</span>'}
      </td>
      <td><span class="badge-status ${v.status==='published'?'badge-published':v.status==='archived'?'badge-draft':'badge-draft'}">${v.status}</span></td>
      <td>
        <div class="action-links">
          <button class="btn-action" onclick="previewVideoInModal('${v.youtubeId}', '${v.title.replace(/'/g, "\\'")}', '${(v.speaker||'').replace(/'/g, "\\'")}', '${(v.excerpt||'').replace(/'/g, "\\'")}')">Play</button>
          <button class="btn-action" onclick="toggleVideoStatus(${v.id})">${v.status==='published'?'Unpublish':'Publish'}</button>
          <button class="btn-action" onclick="editVideo(${v.id})">Edit</button>
          <button class="btn-action delete" onclick="deleteVideo(${v.id}, '${v.title.replace(/'/g, "\\'")}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
  renderStats();
}

function handleYoutubeInput(val) {
  val = (val || '').trim();
  let ytId = '';
  if (/youtu\.be\/([a-zA-Z0-9_-]+)/.test(val)) {
    ytId = val.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)[1];
  } else if (/v=([a-zA-Z0-9_-]+)/.test(val)) {
    ytId = val.match(/v=([a-zA-Z0-9_-]+)/)[1];
  } else if (/embed\/([a-zA-Z0-9_-]+)/.test(val)) {
    ytId = val.match(/embed\/([a-zA-Z0-9_-]+)/)[1];
  } else if (/^[a-zA-Z0-9_-]{11}$/.test(val)) {
    ytId = val;
  }
  if (ytId) {
    document.getElementById('vidYoutubeId').value = ytId;
    const thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    const thumbInput = document.getElementById('vidThumb');
    if (!thumbInput.value || thumbInput.value.includes('youtube.com') || thumbInput.value.includes('img.youtube.com')) {
      thumbInput.value = thumbUrl;
    }
    const thumbPreview = document.getElementById('vidThumbPreview');
    if (thumbPreview) thumbPreview.src = thumbInput.value || thumbUrl;
  }
}

function resetVideoToYoutubeThumb() {
  let ytId = document.getElementById('vidYoutubeId').value;
  if (!ytId) {
    handleYoutubeInput(document.getElementById('vidYoutubeUrl').value);
    ytId = document.getElementById('vidYoutubeId').value;
  }
  if (ytId) {
    const thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    document.getElementById('vidThumb').value = thumbUrl;
    const thumbPreview = document.getElementById('vidThumbPreview');
    if (thumbPreview) thumbPreview.src = thumbUrl;
    showToast('Cover set to official YouTube thumbnail');
  } else {
    alert('Please enter a valid YouTube Link or ID first.');
  }
}

function openAddVideoModal() {
  document.getElementById('videoModalTitle').innerText = 'Add New Video Session';
  document.getElementById('vidId').value = '';
  document.getElementById('vidTitle').value = '';
  document.getElementById('vidYoutubeUrl').value = '';
  document.getElementById('vidYoutubeId').value = '';
  document.getElementById('vidSpeaker').value = '';
  document.getElementById('vidCategory').value = 'Dialogue & Webinar';
  document.getElementById('vidDuration').value = '20 mins';
  document.getElementById('vidDate').value = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  document.getElementById('vidThumb').value = '';
  document.getElementById('vidThumbPreview').src = '';
  document.getElementById('vidExcerpt').value = '';
  document.getElementById('vidStatus').value = 'published';
  document.getElementById('vidFeaturedHome').checked = true;
  document.getElementById('videoModal').style.display = 'flex';
}

function editVideo(id) {
  const v = store.videos.find(x => String(x.id) === String(id));
  if (!v) return;
  document.getElementById('videoModalTitle').innerText = 'Edit Video Session';
  document.getElementById('vidId').value = v.id;
  document.getElementById('vidTitle').value = v.title;
  document.getElementById('vidYoutubeUrl').value = v.youtubeUrl || v.youtubeId;
  document.getElementById('vidYoutubeId').value = v.youtubeId;
  document.getElementById('vidSpeaker').value = v.speaker || '';
  document.getElementById('vidCategory').value = v.category || 'Dialogue & Webinar';
  document.getElementById('vidDuration').value = v.duration || '';
  document.getElementById('vidDate').value = v.date || '';
  document.getElementById('vidThumb').value = v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;
  document.getElementById('vidThumbPreview').src = v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;
  document.getElementById('vidExcerpt').value = v.excerpt || '';
  document.getElementById('vidStatus').value = v.status || 'published';
  document.getElementById('vidFeaturedHome').checked = v.featuredOnHome !== false;
  document.getElementById('videoModal').style.display = 'flex';
}

function saveVideo(e) {
  e.preventDefault();
  const id = document.getElementById('vidId').value;
  let ytId = document.getElementById('vidYoutubeId').value;
  if (!ytId) {
    handleYoutubeInput(document.getElementById('vidYoutubeUrl').value);
    ytId = document.getElementById('vidYoutubeId').value;
  }
  if (!ytId) {
    alert('Please enter a valid YouTube video URL or ID.');
    return;
  }

  const thumb = document.getElementById('vidThumb').value || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

  const videoData = {
    title: document.getElementById('vidTitle').value.trim(),
    youtubeUrl: document.getElementById('vidYoutubeUrl').value.trim(),
    youtubeId: ytId,
    speaker: document.getElementById('vidSpeaker').value.trim(),
    category: document.getElementById('vidCategory').value,
    duration: document.getElementById('vidDuration').value.trim(),
    date: document.getElementById('vidDate').value.trim(),
    thumbnail: thumb,
    thumbnailType: thumb.includes('youtube.com') ? 'youtube' : 'custom',
    excerpt: document.getElementById('vidExcerpt').value.trim(),
    status: document.getElementById('vidStatus').value,
    featuredOnHome: document.getElementById('vidFeaturedHome').checked
  };

  if (id) {
    const existing = store.videos.find(x => String(x.id) === String(id));
    if (existing) Object.assign(existing, videoData);
  } else {
    store.videos.push({
      id: Date.now(),
      order: store.videos.length + 1,
      ...videoData
    });
  }

  persist();
  renderVideos();
  closeModal('videoModal');
  showToast('Video session saved and synced live');
}

function deleteVideo(id, title) {
  confirmModal(
    'Delete Video Session',
    `Are you sure you want to delete the video session "${title}"?`,
    'Delete Video',
    function() {
      store.videos = store.videos.filter(x => String(x.id) !== String(id));
      store.videos.forEach((v, i) => v.order = i + 1);
      persist();
      renderVideos();
      showToast('Video session deleted');
    }
  );
}

function moveVideo(id, direction) {
  if (!confirm(`Do you confirm reordering this video session?`)) return;
  const idx = store.videos.findIndex(x => String(x.id) === String(id));
  if (idx < 0) return;
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= store.videos.length) return;
  const temp = store.videos[idx];
  store.videos[idx] = store.videos[targetIdx];
  store.videos[targetIdx] = temp;
  store.videos.forEach((v, i) => v.order = i + 1);
  persist();
  renderVideos();
  showToast('Video order updated');
}

function toggleVideoStatus(id) {
  const v = store.videos.find(x => String(x.id) === String(id));
  if (v) {
    const newStatus = v.status === 'published' ? 'draft' : 'published';
    if (!confirm(`Do you confirm changing status of "${v.title}" to ${newStatus}?`)) return;
    v.status = newStatus;
    persist();
    renderVideos();
    showToast(`Video status changed to ${v.status}`);
  }
}

function deleteVideo(id, title) {
  if (confirm(`Do you confirm deleting video session "${title}"?`)) {
    store.videos = store.videos.filter(x => String(x.id) !== String(id));
    persist();
    renderVideos();
    showToast('Video removed');
  }
}

function previewVideoInModal(youtubeId, title, speaker, desc) {
  if (typeof window.openVideoModal === 'function') {
    window.openVideoModal(youtubeId, title, speaker, desc);
  } else {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
  }
}

// --- ARTICLE PROSE EDITOR & FORMATTING TOOLBAR ---
function formatToolbar(action) {
  const textarea = document.getElementById('artContent');
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end);
  let replacement = '';

  switch(action) {
    case 'bold':
      replacement = `**${selected || 'bold text'}**`;
      break;
    case 'italic':
      replacement = `*${selected || 'italic text'}*`;
      break;
    case 'h2':
      replacement = `\n\n## ${selected || 'Section Heading'}\n\n`;
      break;
    case 'h3':
      replacement = `\n\n### ${selected || 'Sub-heading'}\n\n`;
      break;
    case 'quote':
      replacement = `\n\n> ${selected || 'Important quote or emphasis statement'}\n\n`;
      break;
    case 'ul':
      replacement = `\n\n- ${selected || 'Key takeaway point 1'}\n- Second point\n\n`;
      break;
    case 'ol':
      replacement = `\n\n1. ${selected || 'First priority'}\n2. Second priority\n\n`;
      break;
    case 'link':
      const url = prompt('Enter URL link target (https://...):', 'https://');
      if (url) replacement = `[${selected || 'link title'}](${url})`;
      else return;
      break;
  }

  insertAtCursor(textarea, replacement, start, end);
}

function insertAtCursor(textarea, text, start, end) {
  textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
  textarea.focus();
  textarea.setSelectionRange(start + text.length, start + text.length);
}

function insertArticleImagePrompt() {
  const url = prompt('Enter Image Path or URL:', 'assets/img/agri.jpg');
  if (!url) return;
  const caption = prompt('Enter Figure Caption / Alt text:', 'Field demonstration site in northern agricultural corridor') || '';
  const markdownImg = `\n\n![${caption}](${url})\n\n`;
  const textarea = document.getElementById('artContent');
  insertAtCursor(textarea, markdownImg, textarea.selectionStart, textarea.selectionEnd);
}

function insertArticleDocPrompt() {
  const title = prompt('Enter Attached Document Title:', 'GIDA Field Baseline Assessment Report (PDF)');
  if (!title) return;
  const fileUrl = prompt('Enter PDF Document Path / URL:', 'assets/docs/gida-strategic-framework-2026-2030.pdf') || 'assets/docs/gida-strategic-framework-2026-2030.pdf';
  const markdownDoc = `\n\n[pdf:${title}|${fileUrl}]\n\n`;
  const textarea = document.getElementById('artContent');
  insertAtCursor(textarea, markdownDoc, textarea.selectionStart, textarea.selectionEnd);
}

function insertArticleVideoPrompt() {
  const input = prompt('Enter YouTube Video URL or ID:', 'https://www.youtube.com/watch?v=ScMzIvxBSi4');
  if (!input) return;
  let ytId = input.trim();
  if (/v=([a-zA-Z0-9_-]+)/.test(ytId)) ytId = ytId.match(/v=([a-zA-Z0-9_-]+)/)[1];
  else if (/youtu\.be\/([a-zA-Z0-9_-]+)/.test(ytId)) ytId = ytId.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)[1];
  const markdownYt = `\n\n[youtube:${ytId}]\n\n`;
  const textarea = document.getElementById('artContent');
  insertAtCursor(textarea, markdownYt, textarea.selectionStart, textarea.selectionEnd);
}

// --- UNIVERSAL MEDIA PICKER & FILE UPLOADER ---
let activeMediaPickerTargetInput = null;
let activeMediaPickerPreviewImg = null;

function openMediaPickerFor(targetInputId, previewImgId) {
  activeMediaPickerTargetInput = targetInputId;
  activeMediaPickerPreviewImg = previewImgId;
  renderMediaPickerGrid('');
  document.getElementById('mediaPickerModal').style.display = 'flex';
}

function filterMediaPicker(query) {
  renderMediaPickerGrid(query);
}

function renderMediaPickerGrid(query) {
  const grid = document.getElementById('mediaPickerGrid');
  if (!grid) return;
  const list = store.images || [];
  const q = (query || '').toLowerCase().trim();
  const filtered = list.filter(img => !q || (img.title && img.title.toLowerCase().includes(q)) || (img.section && img.section.toLowerCase().includes(q)));

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:#64748b;">No media items matching query.</div>';
    return;
  }

  grid.innerHTML = filtered.map(img => `
    <div class="media-picker-item" onclick="selectMediaItem('${img.src}')" title="${img.title}">
      <div style="aspect-ratio:4/3;overflow:hidden;background:#000;">
        <img src="${img.src}" alt="${img.alt||img.title}" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <div style="padding:6px;font-size:0.75rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
        ${img.title}
      </div>
    </div>
  `).join('');
}

function selectMediaItem(src) {
  if (activeMediaPickerTargetInput) {
    const input = document.getElementById(activeMediaPickerTargetInput);
    if (input) input.value = src;
  }
  if (activeMediaPickerPreviewImg) {
    const img = document.getElementById(activeMediaPickerPreviewImg);
    if (img) img.src = src;
  }
  closeModal('mediaPickerModal');
  showToast('Media selected from library');
}

async function compressImageFile(file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const compressedDataUrl = canvas.toDataURL(mimeType, quality);
      resolve(compressedDataUrl);
    };
    img.onerror = () => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    };
    img.src = url;
  });
}

async function handleFileUpload(input, targetUrlId, previewImgId) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  showToast(`Optimizing & processing ${file.name}...`);

  const optimizedDataUrl = await compressImageFile(file, 1200, 1200, 0.85);

  try {
    const res = await fetch('/api/upload-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        data: optimizedDataUrl
      })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.filePath) {
        if (targetUrlId) document.getElementById(targetUrlId).value = json.filePath;
        if (previewImgId) document.getElementById(previewImgId).src = json.filePath;
        showToast(`✓ Image "${json.filename}" optimized and saved`);
        return;
      }
    }
  } catch(err) {
    console.warn('Backend file upload unavailable, using optimized base64', err);
  }

  // Fallback: use optimized data URI
  if (targetUrlId) document.getElementById(targetUrlId).value = optimizedDataUrl;
  if (previewImgId) document.getElementById(previewImgId).src = optimizedDataUrl;
  showToast(`✓ Image "${file.name}" loaded`);
}

// --- VACANCIES ---

function previewVacancy(id) {
  window.open('job-detail.html?id=' + id + '&preview=true', '_blank');
}

function previewPublication(id) {
  window.open('publication-viewer.html?id=' + id + '&preview=true', '_blank');
}

function previewCeo() {
  window.open('index.html#ceo-section', '_blank');
}

function downloadCmsJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "cms-data.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('cms-data.json downloaded for deployment');
}

function renderVacancies() {
  const tbody = document.getElementById('vacanciesTable');
  if (!store.vacancies) store.vacancies = [];
  tbody.innerHTML = store.vacancies.map(v => `
    <tr>
      <td><strong>${v.title}</strong></td>
      <td>${v.dept}</td>
      <td><span style="font-size:0.8rem;background:#e0f2fe;color:#0369a1;padding:3px 8px;border-radius:100px;">${v.type}</span></td>
      <td>${v.deadline}</td>
      <td><span class="badge-status ${v.status==='published'?'badge-published':'badge-draft'}">${v.status}</span></td>
      <td>
        <div class="action-links">
          <button class="btn-action" onclick="previewVacancy(${v.id})">Preview</button>
          <button class="btn-action" onclick="toggleVacancyStatus(${v.id})">${v.status==='published'?'Unpublish':'Publish'}</button>
          <button class="btn-action" onclick="editVacancy(${v.id})">Edit</button>
          <button class="btn-action delete" onclick="deleteVacancy(${v.id}, '${v.title.replace(/'/g, "\\'")}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
  renderStats();
}

function openAddVacancyModal() {
  document.getElementById('vacancyModalTitle').innerText = 'Add New Career Vacancy';
  document.getElementById('vacId').value = '';
  document.getElementById('vacTitle').value = '';
  document.getElementById('vacDept').value = '';
  document.getElementById('vacLoc').value = 'Kano (HQ), with field travel';
  document.getElementById('vacType').value = 'Full-Time · Technical';
  document.getElementById('vacDeadline').value = '';
  document.getElementById('vacSummary').value = '';
  document.getElementById('vacStatus').value = 'published';
  document.getElementById('vacancyModal').style.display = 'flex';
}

function editVacancy(id) {
  const v = store.vacancies.find(x => x.id === id);
  if (!v) return;
  document.getElementById('vacancyModalTitle').innerText = 'Edit Career Vacancy';
  document.getElementById('vacId').value = v.id;
  document.getElementById('vacTitle').value = v.title;
  document.getElementById('vacDept').value = v.dept;
  document.getElementById('vacLoc').value = v.loc;
  document.getElementById('vacType').value = v.type;
  document.getElementById('vacDeadline').value = v.deadline;
  document.getElementById('vacSummary').value = v.summary;
  document.getElementById('vacStatus').value = v.status;
  document.getElementById('vacancyModal').style.display = 'flex';
}

function saveVacancy(e) {
  e.preventDefault();
  if (!confirm("Do you confirm saving this career vacancy?")) return;
  const id = document.getElementById('vacId').value;
  const vacancyData = {
    title: document.getElementById('vacTitle').value,
    dept: document.getElementById('vacDept').value,
    loc: document.getElementById('vacLoc').value,
    type: document.getElementById('vacType').value,
    deadline: document.getElementById('vacDeadline').value,
    summary: document.getElementById('vacSummary').value,
    status: document.getElementById('vacStatus').value
  };

  if (id) {
    const existing = store.vacancies.find(x => String(x.id) === String(id));
    if (existing) Object.assign(existing, vacancyData);
  } else {
    const nextId = Date.now();
    store.vacancies.push({
      id: nextId,
      ref: 'GIDA-VAC-2026-' + store.vacancies.length.toString().padStart(2, '0'),
      ...vacancyData
    });
  }
  persist();
  renderVacancies();
  closeModal('vacancyModal');
  showToast('Vacancy saved and synced to Career portal');
}

function toggleVacancyStatus(id) {
  const v = store.vacancies.find(x => x.id === id);
  if (v) {
    const newStatus = v.status === 'published' ? 'draft' : 'published';
    if (!confirm(`Do you confirm changing status of "${v.title}" to ${newStatus}?`)) return;
    v.status = newStatus;
    persist();
    renderVacancies();
    showToast(`Vacancy status changed to ${v.status}`);
  }
}

function deleteVacancy(id, title) {
  if (confirm(`Do you confirm permanently removing vacancy "${title}"?`)) {
    store.vacancies = store.vacancies.filter(x => x.id !== id);
    persist();
    renderVacancies();
    showToast('Vacancy removed');
  }
}

// --- PUBLICATIONS ---
function movePublication(id, direction) {
  if (!store.publications) return;
  if (!confirm(`Do you confirm moving this publication ${direction}?`)) return;
  const idx = store.publications.findIndex(x => String(x.id) === String(id));
  if (idx < 0) return;
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= store.publications.length) return;
  const temp = store.publications[idx];
  store.publications[idx] = store.publications[targetIdx];
  store.publications[targetIdx] = temp;
  persist();
  renderPublications();
  showToast('Publication order updated and synced live across site');
}

function renderPublications() {
  const tbody = document.getElementById('publicationsTable');
  if (!store.publications) store.publications = [];
  tbody.innerHTML = store.publications.map((p, idx) => `
    <tr>
      <td style="white-space:nowrap;">
        <div style="display:inline-flex; align-items:center; gap:4px;">
          <button class="btn-action" onclick="movePublication(${p.id}, 'up')" ${idx === 0 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : 'title="Move Up"'} style="padding:4px 8px;font-weight:700;font-size:0.85rem;">&uarr;</button>
          <button class="btn-action" onclick="movePublication(${p.id}, 'down')" ${idx === store.publications.length - 1 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : 'title="Move Down"'} style="padding:4px 8px;font-weight:700;font-size:0.85rem;">&darr;</button>
          <span style="font-size:0.8rem;color:#64748b;font-weight:600;min-width:20px;text-align:center;">#${idx + 1}</span>
        </div>
      </td>
      <td><strong>${p.title}</strong></td>
      <td><span style="font-size:0.8rem;background:#f1f5f9;color:var(--text);padding:3px 8px;border-radius:6px;">${p.category}</span></td>
      <td>${p.date}</td>
      <td><span class="badge-status ${p.status==='published'?'badge-published':'badge-draft'}">${p.status}</span></td>
      <td>
        <div class="action-links">
          <button class="btn-action" onclick="previewPublication(${p.id})">Preview</button>
          <button class="btn-action" onclick="togglePublicationStatus(${p.id})">${p.status==='published'?'Unpublish':'Publish'}</button>
          <button class="btn-action" onclick="editPublication(${p.id})">Edit</button>
          <button class="btn-action delete" onclick="deletePublication(${p.id}, '${p.title.replace(/'/g, "\\'")}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
  renderStats();
}

function openAddPubModal() {
  document.getElementById('pubModalTitle').innerText = 'Add New Publication';
  document.getElementById('pubId').value = '';
  document.getElementById('pubTitle').value = '';
  document.getElementById('pubCategory').value = 'Strategic Plan';
  document.getElementById('pubDate').value = '2026';
  document.getElementById('pubFile').value = 'assets/docs/gida-strategic-framework-2026-2030.pdf';
  document.getElementById('pubSummary').value = '';
  document.getElementById('pubStatus').value = 'published';
  document.getElementById('pubModal').style.display = 'flex';
}

function editPublication(id) {
  const p = store.publications.find(x => x.id === id);
  if (!p) return;
  document.getElementById('pubModalTitle').innerText = 'Edit Publication';
  document.getElementById('pubId').value = p.id;
  document.getElementById('pubTitle').value = p.title;
  document.getElementById('pubCategory').value = p.category;
  document.getElementById('pubDate').value = p.date;
  document.getElementById('pubFile').value = p.file || '';
  document.getElementById('pubSummary').value = p.summary || '';
  document.getElementById('pubStatus').value = p.status;
  document.getElementById('pubModal').style.display = 'flex';
}

function savePublication(e) {
  e.preventDefault();
  if (!confirm("Do you confirm saving this publication?")) return;
  const id = document.getElementById('pubId').value;
  const pubData = {
    title: document.getElementById('pubTitle').value,
    category: document.getElementById('pubCategory').value,
    date: document.getElementById('pubDate').value,
    file: document.getElementById('pubFile').value,
    summary: document.getElementById('pubSummary').value,
    status: document.getElementById('pubStatus').value
  };

  if (id) {
    const existing = store.publications.find(x => String(x.id) === String(id));
    if (existing) Object.assign(existing, pubData);
  } else {
    store.publications.push({
      id: Date.now(),
      ...pubData
    });
  }
  persist();
  renderPublications();
  closeModal('pubModal');
  showToast('Publication updated and synced live');
}

function togglePublicationStatus(id) {
  const p = store.publications.find(x => x.id === id);
  if (p) {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    if (!confirm(`Do you confirm changing status of "${p.title}" to ${newStatus}?`)) return;
    p.status = newStatus;
    persist();
    renderPublications();
    showToast(`Publication status toggled to ${p.status}`);
  }
}

function deletePublication(id, title) {
  if (confirm(`Do you confirm deleting publication "${title}"?`)) {
    store.publications = store.publications.filter(x => x.id !== id);
    persist();
    renderPublications();
    showToast('Publication deleted');
  }
}

// --- PROGRAMS & PILLARS ---
function renderPrograms() {
  const tbody = document.getElementById('programsTable');
  tbody.innerHTML = store.programs.map(p => `
    <tr>
      <td><strong>${p.num}</strong></td>
      <td>${p.title}</td>
      <td><span style="font-size:0.8rem;background:#e0f2fe;color:#0369a1;padding:3px 8px;border-radius:100px;">${p.tag}</span></td>
      <td><span class="badge-status ${p.status==='published'?'badge-published':'badge-draft'}">${p.status}</span></td>
      <td>
        <div class="action-links">
          <button class="btn-action" onclick="toggleProgramStatus(${p.id})">${p.status==='published'?'Unpublish':'Publish'}</button>
          <button class="btn-action delete" onclick="deleteProgram(${p.id}, '${p.title.replace(/'/g, "\\'")}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function toggleProgramStatus(id) {
  const p = store.programs.find(x => x.id === id);
  if (p) {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    if (!confirm(`Do you confirm changing status of "${p.title}" to ${newStatus}?`)) return;
    p.status = newStatus;
    persist();
    renderPrograms();
    showToast(`Program status set to ${p.status}`);
  }
}

function deleteProgram(id, title) {
  if (confirm(`Do you confirm deleting program "${title}"?`)) {
    store.programs = store.programs.filter(x => x.id !== id);
    persist();
    renderPrograms();
    showToast('Program removed');
  }
}

function openAddProgramModal() {
  const title = prompt('Enter Program Pillar Title:');
  if (title) {
    const tag = prompt('Enter Strategic Tag (e.g. Livelihoods, Green Infrastructure, One Health):', 'Livelihoods') || 'General';
    const nextNum = (store.programs.length + 1).toString().padStart(2, '0');
    store.programs.push({ id: Date.now(), num: nextNum, title, tag, status: 'published' });
    persist();
    renderPrograms();
    showToast('Program Pillar added');
  }
}

// --- PARTNERS ---
function renderPartners() {
  const container = document.getElementById('partnersContainer');
  if (!container) return;
  container.innerHTML = store.partners.map(p => `
    <div style="background:#fff;border:1px solid var(--border);border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:6px;">
      <h4 style="font-size:0.95rem;font-weight:700;color:var(--primary-dark);">${p.name}</h4>
      <span style="font-size:0.78rem;color:var(--text-muted);">${p.type}</span>
      <div style="margin-top:auto;padding-top:8px;">
        <button class="btn-action delete" style="padding:4px 8px;font-size:0.75rem;" onclick="deletePartner(${p.id})">Remove</button>
      </div>
    </div>
  `).join('');
}

function openAddPartnerModal() {
  const name = prompt('Enter Partner Organization Name:');
  if (name) {
    const type = prompt('Enter Partner Type (e.g. Governmental, Multilateral, Research):', 'Strategic Partner') || 'Partner';
    store.partners.push({ id: Date.now(), name, type });
    persist();
    renderPartners();
    showToast('Partner added');
  }
}

function deletePartner(id) {
  const p = store.partners.find(x => x.id === id);
  const name = p ? p.name : 'Partner';
  if (!confirm(`Do you confirm removing partner "${name}"?`)) return;
  store.partners = store.partners.filter(x => x.id !== id);
  persist();
  renderPartners();
  showToast('Partner removed');
}

// --- MANAGED IMAGES & MEDIA ---
let currentFilterSection = 'all';
function filterImages(section, btn) {
  currentFilterSection = section;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderManagedImages(section);
}

function renderManagedImages(filterSection = 'all') {
  const grid = document.getElementById('managedImagesGrid');
  const galleryGrid = document.getElementById('galleryGrid');
  
  const filtered = filterSection === 'all' 
    ? store.images 
    : store.images.filter(img => img.section.toLowerCase() === filterSection.toLowerCase());

  const cardHtml = (img) => `
    <div class="img-manage-card">
      <div class="img-preview-box">
        <img src="${img.src}" alt="${img.alt}" class="img-preview-thumb">
        <span class="img-ratio-badge">${img.ratio}</span>
        <span class="img-location-badge">${img.section}</span>
      </div>
      <div class="img-card-details">
        <h4 class="img-title">${img.title}</h4>
        <p class="img-alt"><strong>ALT:</strong> ${img.alt || '<em>None</em>'}</p>
        <div class="img-meta-row">
          <span>${img.usage}</span>
        </div>
        <div class="img-actions-row">
          <button class="btn-replace" onclick="openReplaceModal('${img.id}')">Replace Image</button>
          <button class="btn-edit-meta" onclick="openEditMetaModal('${img.id}')">Edit ALT</button>
          <button class="btn-delete-img" onclick="triggerSafeDelete('${img.id}')">Delete</button>
        </div>
      </div>
    </div>
  `;

  if (grid) grid.innerHTML = filtered.map(cardHtml).join('');
  if (galleryGrid) galleryGrid.innerHTML = store.images.map(cardHtml).join('');
  renderStats();
}

function openEditMetaModal(id) {
  const img = store.images.find(x => x.id === id);
  if(!img) return;
  document.getElementById('editImageId').value = img.id;
  document.getElementById('editImageTitle').value = img.title;
  document.getElementById('editImageAlt').value = img.alt || '';
  document.getElementById('editImageSection').value = img.section;
  document.getElementById('editImageRatio').value = img.ratio;
  document.getElementById('imageEditModal').style.display = 'flex';
}

function saveImageMeta(e) {
  e.preventDefault();
  if (!confirm("Do you confirm updating this media slot's metadata?")) return;
  const id = document.getElementById('editImageId').value;
  const img = store.images.find(x => x.id === id);
  if(img) {
    img.title = document.getElementById('editImageTitle').value;
    img.alt = document.getElementById('editImageAlt').value;
    img.section = document.getElementById('editImageSection').value;
    img.ratio = document.getElementById('editImageRatio').value;
    persist();
    renderManagedImages(currentFilterSection);
    closeModal('imageEditModal');
    showToast('Media metadata updated');
  }
}

let activeReplaceId = null;
let pendingBase64 = null;
function openReplaceModal(id) {
  activeReplaceId = id;
  const img = store.images.find(x => x.id === id);
  if(!img) return;
  document.getElementById('replaceModalDesc').innerText = `Replacing "${img.title}" in ${img.usage}`;
  document.getElementById('replacePreviewImg').src = img.src;
  document.getElementById('replaceDirectUrl').value = '';
  pendingBase64 = null;
  document.getElementById('imageReplaceModal').style.display = 'flex';
}

function previewReplaceFile(input) {
  if(input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      pendingBase64 = e.target.result;
      document.getElementById('replacePreviewImg').src = pendingBase64;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function confirmImageReplace() {
  const directUrl = document.getElementById('replaceDirectUrl').value;
  const finalSrc = pendingBase64 || directUrl;
  if (!finalSrc) {
    alert('Please choose a file or specify a valid image URL.');
    return;
  }
  if (!confirm("Do you confirm replacing this image media across the website?")) return;
  const img = store.images.find(x => x.id === activeReplaceId);
  if(img) {
    img.src = finalSrc;
    persist();
    renderManagedImages(currentFilterSection);
    closeModal('imageReplaceModal');
    showToast(`Image "${img.title}" updated across site`);
  }
}

let targetDeleteId = null;
function triggerSafeDelete(id) {
  targetDeleteId = id;
  const img = store.images.find(x => x.id === id);
  if(!img) return;
  document.getElementById('safeDeleteWarningText').innerHTML = `This image (<strong>${img.title}</strong>) is currently configured in <strong>${img.usage}</strong>.<br><br>Deleting it will leave an empty placeholder. We recommend using <strong>Replace Instead</strong>.`;
  document.getElementById('safeDeleteModal').style.display = 'flex';
}

function switchToReplace() {
  closeModal('safeDeleteModal');
  if(targetDeleteId) openReplaceModal(targetDeleteId);
}

document.getElementById('confirmDeleteExecBtn').addEventListener('click', () => {
  if(targetDeleteId) {
    if (!confirm("Do you confirm permanently removing this media slot?")) return;
    store.images = store.images.filter(x => x.id !== targetDeleteId);
    persist();
    renderManagedImages(currentFilterSection);
    closeModal('safeDeleteModal');
    showToast('Media slot removed');
  }
});

function triggerAddNewImage() {
  const title = prompt('Enter Image Slot Title:');
  if(!title) return;
  const section = prompt('Enter Page Section (Homepage, About, Programs, Safeguarding, Contact):', 'Homepage') || 'General';
  const usage = prompt('Enter where this image will be displayed:', 'Feature Section') || 'Page Visual';
  const ratio = prompt('Enter Recommended Ratio:', 'Recommended: 16:9 (1920x1080)');
  
  store.images.push({
    id: 'img-' + Date.now(),
    title,
    section,
    ratio,
    src: 'assets/img/agri.jpg',
    alt: title,
    usage
  });
  persist();
  renderManagedImages(currentFilterSection);
  showToast('New media slot registered');
}

// --- HOMEPAGE & HERO VISUAL ---
function renderHomepageForm() {
  if (store.homepage) {
    if (document.getElementById('hpKicker')) document.getElementById('hpKicker').value = store.homepage.kicker || '';
    if (document.getElementById('hpHeadline')) document.getElementById('hpHeadline').value = store.homepage.headline || '';
    if (document.getElementById('hpDesc')) document.getElementById('hpDesc').value = store.homepage.desc || '';
    if (document.getElementById('hpProsperity')) document.getElementById('hpProsperity').value = store.homepage.prosperity || '';
  }
  if (store.heroVisual) {
    if (document.getElementById('heroLogoUrl')) document.getElementById('heroLogoUrl').value = store.heroVisual.src || '';
    if (document.getElementById('heroLogoAlt')) document.getElementById('heroLogoAlt').value = store.heroVisual.alt || '';
    if (document.getElementById('heroLogoPreview')) document.getElementById('heroLogoPreview').src = store.heroVisual.src || 'assets/img/logo.png';
  }
}

function previewHeroLogoFile(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('heroLogoPreview').src = e.target.result;
      document.getElementById('heroLogoUrl').value = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function saveHomepage(e) {
  e.preventDefault();
  if (!confirm("Do you confirm saving these changes to the Homepage?")) return;
  store.homepage = {
    kicker: document.getElementById('hpKicker').value,
    headline: document.getElementById('hpHeadline').value,
    desc: document.getElementById('hpDesc').value,
    prosperity: document.getElementById('hpProsperity').value
  };
  persist();
  showToast('Homepage hero content and highlight statement updated');
}

function saveHeroVisual(e) {
  e.preventDefault();
  if (!confirm("Do you confirm updating the Homepage hero visual emblem?")) return;
  const src = document.getElementById('heroLogoUrl').value || 'assets/img/logo.png';
  const alt = document.getElementById('heroLogoAlt').value || 'GIDA Official Seal';
  store.heroVisual = { src, alt };
  
  // Also synchronize in images array if hp-hero or hp-logo-emblem exists
  if (store.images) {
    const emblem = store.images.find(i => i.id === 'hp-logo-emblem');
    if (emblem) {
      emblem.src = src;
      emblem.alt = alt;
    }
  }
  persist();
  showToast('Homepage hero emblem updated and synced live to site');
}

// --- ABOUT US ---
function renderAboutForm() {
  if (!store.about) return;
  if (document.getElementById('aboutHeading')) document.getElementById('aboutHeading').value = store.about.heading || '';
  if (document.getElementById('aboutLead')) document.getElementById('aboutLead').value = store.about.lead || '';
  if (document.getElementById('aboutApproach')) document.getElementById('aboutApproach').value = store.about.approach || '';
}

function saveAbout(e) {
  e.preventDefault();
  if (!confirm("Do you confirm saving these changes to About Us?")) return;
  store.about = {
    heading: document.getElementById('aboutHeading').value,
    lead: document.getElementById('aboutLead').value,
    approach: document.getElementById('aboutApproach').value
  };
  persist();
  showToast('About profile text updated and synced live');
}

// --- SAFEGUARDING ---
function renderSafeguardingForm() {
  if (!store.safeguarding) return;
  if (document.getElementById('sgZeroTolerance')) document.getElementById('sgZeroTolerance').value = store.safeguarding.zeroTolerance || '';
  if (document.getElementById('sgEmail')) document.getElementById('sgEmail').value = store.safeguarding.email || '';
  if (document.getElementById('sgHotline')) document.getElementById('sgHotline').value = store.safeguarding.hotline || '';
}

function saveSafeguarding(e) {
  e.preventDefault();
  if (!confirm("Do you confirm saving these Safeguarding policy updates?")) return;
  store.safeguarding = {
    zeroTolerance: document.getElementById('sgZeroTolerance').value,
    email: document.getElementById('sgEmail').value,
    hotline: document.getElementById('sgHotline').value
  };
  persist();
  showToast('Safeguarding parameters updated and synced live');
}

// --- CONTACT INFO ---
function renderContactForm() {
  if (!store.contact) return;
  if (document.getElementById('contactEmail')) document.getElementById('contactEmail').value = store.contact.email || '';
  if (document.getElementById('contactCareersEmail')) document.getElementById('contactCareersEmail').value = store.contact.careers || '';
  if (document.getElementById('contactPhone')) document.getElementById('contactPhone').value = store.contact.phone || '';
  if (document.getElementById('contactAddress')) document.getElementById('contactAddress').value = store.contact.address || '';
}

function saveContact(e) {
  e.preventDefault();
  if (!confirm("Do you confirm saving these Contact details?")) return;
  store.contact = {
    email: document.getElementById('contactEmail').value,
    careers: document.getElementById('contactCareersEmail').value,
    phone: document.getElementById('contactPhone').value,
    address: document.getElementById('contactAddress').value
  };
  persist();
  showToast('Contact details saved and synced live');
}

// --- SOCIAL LINKS ---
function renderSocialForm() {
  if (!store.social) return;
  if (document.getElementById('socialTwitter')) document.getElementById('socialTwitter').value = store.social.twitter || '';
  if (document.getElementById('socialLinkedIn')) document.getElementById('socialLinkedIn').value = store.social.linkedin || '';
  if (document.getElementById('socialFacebook')) document.getElementById('socialFacebook').value = store.social.facebook || '';
  if (document.getElementById('socialInstagram')) document.getElementById('socialInstagram').value = store.social.instagram || '';
}

function saveSocial(e) {
  e.preventDefault();
  if (!confirm("Do you confirm saving these Social Media links?")) return;
  store.social = {
    twitter: document.getElementById('socialTwitter').value,
    linkedin: document.getElementById('socialLinkedIn').value,
    facebook: document.getElementById('socialFacebook').value,
    instagram: document.getElementById('socialInstagram').value
  };
  persist();
  showToast('Social links saved and synced live');
}

// --- SETTINGS ---
function renderSettingsForm() {
  if (!store.settings) store.settings = {};
  if (document.getElementById('settingOrgName')) document.getElementById('settingOrgName').value = store.settings.orgName || 'GIDA — Growth Innovation for Development Action';
  if (document.getElementById('settingTagline')) document.getElementById('settingTagline').value = store.settings.tagline || 'Where People Prosper';
  if (document.getElementById('settingHeadquarters')) document.getElementById('settingHeadquarters').value = store.settings.headquarters || 'Kano, Nigeria';
  const savedToken = localStorage.getItem('gida_github_token') || '';
  if (document.getElementById('ghToken')) document.getElementById('ghToken').value = savedToken;
  checkServerConnection();
}

function saveSettings() {
  if (!confirm("Do you confirm saving the Global Website configuration?")) return;
  store.settings = {
    orgName: document.getElementById('settingOrgName').value,
    tagline: document.getElementById('settingTagline').value,
    headquarters: document.getElementById('settingHeadquarters').value
  };
  persist();
  showToast('Global website configuration saved');
}

// --- EDITORIAL BLOG ARTICLES ---
function moveArticle(id, direction) {
  if (!store.articles) return;
  if (!confirm(`Do you confirm moving this article ${direction}?`)) return;
  const idx = store.articles.findIndex(x => String(x.id) === String(id));
  if (idx < 0) return;
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= store.articles.length) return;
  const temp = store.articles[idx];
  store.articles[idx] = store.articles[targetIdx];
  store.articles[targetIdx] = temp;
  persist();
  renderArticles();
  showToast('Article order updated and synced live across site');
}

function renderArticles() {
  const tbody = document.getElementById('articlesTable');
  if (!tbody) return;
  if (!store.articles) store.articles = [];
  tbody.innerHTML = store.articles.map((a, idx) => `
    <tr>
      <td style="white-space:nowrap;">
        <div style="display:inline-flex; align-items:center; gap:4px;">
          <button class="btn-action" onclick="moveArticle(${a.id}, 'up')" ${idx === 0 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : 'title="Move Up"'} style="padding:4px 8px;font-weight:700;font-size:0.85rem;">&uarr;</button>
          <button class="btn-action" onclick="moveArticle(${a.id}, 'down')" ${idx === store.articles.length - 1 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : 'title="Move Down"'} style="padding:4px 8px;font-weight:700;font-size:0.85rem;">&darr;</button>
          <span style="font-size:0.8rem;color:#64748b;font-weight:600;min-width:20px;text-align:center;">#${idx + 1}</span>
        </div>
      </td>
      <td>
        <strong>${a.title}</strong>
        ${a.featured ? '<span style="margin-left:6px;font-size:0.75rem;background:#fef3c7;color:#92400e;padding:2px 6px;border-radius:4px;font-weight:700;">Featured</span>' : ''}
      </td>
      <td><span style="font-size:0.8rem;background:#f1f5f9;color:var(--text);padding:3px 8px;border-radius:6px;">${a.category}</span></td>
      <td>${a.author || 'GIDA'}</td>
      <td>${a.date}</td>
      <td><span class="badge-status ${a.status==='published'?'badge-published':'badge-draft'}">${a.status}</span></td>
      <td>
        <div class="action-links">
          <button class="btn-action" onclick="previewArticle(${a.id})">Preview</button>
          <button class="btn-action" onclick="toggleArticleStatus(${a.id})">${a.status==='published'?'Unpublish':'Publish'}</button>
          <button class="btn-action" onclick="editArticle(${a.id})">Edit</button>
          <button class="btn-action delete" onclick="deleteArticle(${a.id}, '${a.title.replace(/'/g, "\\'")}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
  renderStats();
}

function previewArticle(id) {
  window.open('article.html?id=' + id + '&preview=true', '_blank');
}

function openAddArticleModal() {
  document.getElementById('articleModalTitle').innerText = 'Write New Article';
  document.getElementById('artId').value = '';
  document.getElementById('artTitle').value = '';
  document.getElementById('artCategory').value = 'Field Insights';
  document.getElementById('artDate').value = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('artAuthor').value = 'GIDA Communications';
  document.getElementById('artImage').value = 'assets/img/agri.jpg';
  const preview = document.getElementById('artImageThumbPreview');
  if (preview) preview.src = 'assets/img/agri.jpg';
  document.getElementById('artExcerpt').value = '';
  document.getElementById('artContent').value = '';
  document.getElementById('artStatus').value = 'published';
  document.getElementById('artFeatured').checked = false;
  document.getElementById('articleModal').style.display = 'flex';
}

function editArticle(id) {
  const a = store.articles.find(x => x.id === id);
  if (!a) return;
  document.getElementById('articleModalTitle').innerText = 'Edit Article';
  document.getElementById('artId').value = a.id;
  document.getElementById('artTitle').value = a.title;
  document.getElementById('artCategory').value = a.category;
  document.getElementById('artDate').value = a.date;
  document.getElementById('artAuthor').value = a.author || '';
  document.getElementById('artImage').value = a.image || 'assets/img/agri.jpg';
  const preview = document.getElementById('artImageThumbPreview');
  if (preview) preview.src = a.image || 'assets/img/agri.jpg';
  document.getElementById('artExcerpt').value = a.excerpt || '';
  document.getElementById('artContent').value = a.content || '';
  document.getElementById('artStatus').value = a.status || 'published';
  document.getElementById('artFeatured').checked = !!a.featured;
  document.getElementById('articleModal').style.display = 'flex';
}

function saveArticle(e) {
  e.preventDefault();
  if (!confirm("Do you confirm saving and publishing this article?")) return;
  const id = document.getElementById('artId').value;
  const isFeatured = document.getElementById('artFeatured').checked;
  
  if (isFeatured && store.articles) {
    store.articles.forEach(x => { if (String(x.id) !== String(id)) x.featured = false; });
  }

  const artData = {
    title: document.getElementById('artTitle').value,
    category: document.getElementById('artCategory').value,
    date: document.getElementById('artDate').value,
    author: document.getElementById('artAuthor').value,
    image: document.getElementById('artImage').value,
    excerpt: document.getElementById('artExcerpt').value,
    content: document.getElementById('artContent').value,
    status: document.getElementById('artStatus').value,
    featured: isFeatured
  };

  if (id) {
    const existing = store.articles.find(x => String(x.id) === String(id));
    if (existing) Object.assign(existing, artData);
  } else {
    store.articles.unshift({
      id: Date.now(),
      ...artData
    });
  }
  persist();
  renderArticles();
  closeModal('articleModal');
  showToast('Article saved and synced live across website');
}

function toggleArticleStatus(id) {
  const a = store.articles.find(x => x.id === id);
  if (a) {
    const newStatus = a.status === 'published' ? 'draft' : 'published';
    if (!confirm(`Do you confirm changing status of "${a.title}" to ${newStatus}?`)) return;
    a.status = newStatus;
    persist();
    renderArticles();
    showToast(`Article status set to ${a.status}`);
  }
}

function deleteArticle(id, title) {
  if (confirm(`Do you confirm permanently deleting article "${title}"?`)) {
    store.articles = store.articles.filter(x => x.id !== id);
    persist();
    renderArticles();
    showToast('Article removed');
  }
}

// --- PDF DOCUMENT UPLOADER ---
async function handlePdfUpload(input, targetPathId, statusSpanId) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const statusSpan = document.getElementById(statusSpanId);
  if (statusSpan) statusSpan.innerHTML = `<span style="color:#0284c7">Uploading ${file.name}...</span>`;

  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64Data = e.target.result;
    try {
      const res = await fetch('/api/upload-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          data: base64Data
        })
      });
      if (res.ok) {
        const jsonRes = await res.json();
        if (jsonRes.success && jsonRes.filePath) {
          document.getElementById(targetPathId).value = jsonRes.filePath;
          if (statusSpan) statusSpan.innerHTML = `<span style="color:#16a34a;font-weight:600;">✓ Uploaded to server: ${jsonRes.filename} (${(file.size/1024).toFixed(1)} KB)</span>`;
          showToast(`PDF "${jsonRes.filename}" uploaded successfully to server`);
          return;
        }
      }
    } catch(err) {
      console.warn('Backend upload unavailable, falling back to local data URI', err);
    }
    // Fallback for standalone/offline: store as data URI
    document.getElementById(targetPathId).value = base64Data;
    if (statusSpan) statusSpan.innerHTML = `<span style="color:#16a34a;font-weight:600;">✓ Ready (local): ${file.name} (${(file.size/1024).toFixed(1)} KB)</span>`;
    showToast(`PDF "${file.name}" ready`);
  };
  reader.readAsDataURL(file);
}

// --- BACKUP & RESTORE ---
function exportData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "gida-cms-database-backup.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Database backup exported as JSON');
}

function importData(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.programs && imported.images) {
          store = imported;
          persist();
          renderAll();
          showToast('Database restored successfully from backup');
        } else {
          alert('Invalid backup structure.');
        }
      } catch (err) {
        alert('Could not parse JSON backup file.');
      }
    };
    reader.readAsText(input.files[0]);
  }
}

function resetToDefaults() {
  if (confirm('Reset all CMS content and media to factory defaults? Any custom drafts will be replaced.')) {
    store = JSON.parse(JSON.stringify(DEFAULT_STORE));
    persist();
    renderAll();
    showToast('Database reset to defaults');
  }
}

// ==========================================
// EVENT REGISTRATIONS MANAGEMENT ENGINE
// ==========================================
let allRegistrations = [];
let currentModalRegId = null;

async function fetchRegistrations(showToastMsg = false) {
  const token = sessionStorage.getItem('gida_admin_token');
  if (!token) return;

  try {
    const res = await fetch('/api/admin/registrations', {
      headers: {
        'Authorization': 'Bearer ' + token
      },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      allRegistrations = Array.isArray(data.registrations) ? data.registrations : [];
      
      const total = data.total || allRegistrations.length;
      if (document.getElementById('statRegistrations')) {
        document.getElementById('statRegistrations').innerText = total;
      }
      if (document.getElementById('navRegBadge')) {
        document.getElementById('navRegBadge').innerText = total;
      }
      if (document.getElementById('regCountBadge')) {
        document.getElementById('regCountBadge').innerText = `${total} Total Registrations`;
      }

      renderRegistrationsTable();
      if (showToastMsg) showToast(`✓ Loaded ${total} registrations from database`);
    } else if (res.status === 401) {
      console.warn('[REGISTRATIONS AUTH EXPIRED]');
    }
  } catch (err) {
    console.error('[FETCH REGISTRATIONS ERROR]', err);
    if (showToastMsg) showToast('Failed to load registrations from server');
  }
}

function handleRegFilterChange() {
  renderRegistrationsTable();
}

function resetRegFilters() {
  const s = document.getElementById('regSearchInput');
  const a = document.getElementById('regFilterArchetype');
  const f = document.getElementById('regFilterFootprint');
  const c = document.getElementById('regFilterConsent');
  const w = document.getElementById('regFilterWg');
  const o = document.getElementById('regSortBy');

  if (s) s.value = '';
  if (a) a.value = 'all';
  if (f) f.value = 'all';
  if (c) c.value = 'all';
  if (w) w.value = 'all';
  if (o) o.value = 'newest';

  renderRegistrationsTable();
  showToast('Filters reset');
}

function renderRegistrationsTable() {
  const tbody = document.getElementById('registrationsTableBody');
  const emptyBox = document.getElementById('regEmptyState');
  if (!tbody) return;

  const searchQ = (document.getElementById('regSearchInput')?.value || '').trim().toLowerCase();
  const filterArchetype = document.getElementById('regFilterArchetype')?.value || 'all';
  const filterFootprint = document.getElementById('regFilterFootprint')?.value || 'all';
  const filterConsent = document.getElementById('regFilterConsent')?.value || 'all';
  const filterWg = document.getElementById('regFilterWg')?.value || 'all';
  const sortBy = document.getElementById('regSortBy')?.value || 'newest';

  let filtered = allRegistrations.filter(r => {
    if (searchQ) {
      const haystack = [
        r.id, r.fullName, r.email, r.phone, r.organization, r.designation
      ].join(' ').toLowerCase();
      if (!haystack.includes(searchQ)) return false;
    }
    if (filterArchetype !== 'all') {
      if (!String(r.stakeholderArchetype || '').toLowerCase().includes(filterArchetype.toLowerCase())) {
        return false;
      }
    }
    if (filterFootprint !== 'all') {
      const fps = (r.operationalFootprint || []).map(f => String(f).toLowerCase());
      if (!fps.some(f => f.includes(filterFootprint.toLowerCase()))) {
        return false;
      }
    }
    if (filterConsent !== 'all') {
      const c = String(r.reportFeatureConsent || '').toLowerCase();
      if (filterConsent === 'publish' && !c.includes('publish')) return false;
      if (filterConsent === 'anonymous' && !c.includes('anonymous') && !c.includes('aggregated')) return false;
    }
    if (filterWg !== 'all') {
      if (String(r.workingGroupInterest || '').toLowerCase() !== filterWg.toLowerCase()) {
        return false;
      }
    }
    return true;
  });

  if (sortBy === 'oldest') {
    filtered.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => String(a.fullName || '').localeCompare(String(b.fullName || '')));
  } else if (sortBy === 'org') {
    filtered.sort((a, b) => String(a.organization || '').localeCompare(String(b.organization || '')));
  } else {
    filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    if (emptyBox) emptyBox.style.display = 'block';
    return;
  }

  if (emptyBox) emptyBox.style.display = 'none';

  tbody.innerHTML = filtered.map(r => {
    const isConsentPublish = String(r.reportFeatureConsent || '').toLowerCase().includes('publish');
    const isWgYes = String(r.workingGroupInterest || '').toLowerCase() === 'yes';
    const subDate = r.submittedAt ? new Date(r.submittedAt).toLocaleString('en-NG', { dateStyle: 'short', timeStyle: 'short', timeZone: 'UTC' }) : '—';
    const fps = Array.isArray(r.operationalFootprint) ? r.operationalFootprint : [];

    return `
      <tr>
        <td>
          <span style="font-family:monospace;font-weight:700;font-size:0.84rem;color:var(--teal-dark);background:rgba(0,130,138,0.08);padding:3px 8px;border-radius:6px;display:inline-block;">
            ${escapeHtml(r.id)}
          </span>
        </td>
        <td>
          <div style="font-weight:700;color:var(--text);font-size:0.92rem;">${escapeHtml(r.fullName)}</div>
          <div style="font-size:0.8rem;color:var(--text-muted);">${escapeHtml(r.designation || '—')}</div>
          <div style="font-size:0.78rem;color:var(--teal);margin-top:2px;">
            <a href="mailto:${escapeHtml(r.email)}" style="color:inherit;text-decoration:none;">${escapeHtml(r.email)}</a> • ${escapeHtml(r.phone)}
          </div>
        </td>
        <td>
          <strong style="color:#1e293b;font-size:0.9rem;">${escapeHtml(r.organization || '—')}</strong>
        </td>
        <td>
          <span style="font-size:0.8rem;color:#334155;background:#f1f5f9;padding:3px 8px;border-radius:6px;display:inline-block;max-width:210px;line-height:1.35;" title="${escapeHtml(r.stakeholderArchetype || '')}">
            ${escapeHtml(r.stakeholderArchetype || '—')}
            ${r.stakeholderArchetypeOther ? `<br><em style="color:#64748b;font-size:0.75rem;">(${escapeHtml(r.stakeholderArchetypeOther)})</em>` : ''}
          </span>
        </td>
        <td>
          <div style="display:flex;flex-wrap:wrap;gap:4px;max-width:180px;">
            ${fps.map(f => {
              const shortName = f.split('(')[0].trim();
              return `<span style="font-size:0.72rem;background:rgba(27,77,62,0.06);color:var(--green-deep);padding:2px 6px;border-radius:4px;font-weight:600;" title="${escapeHtml(f)}">${escapeHtml(shortName)}</span>`;
            }).join('') || '<span style="color:#94a3b8;font-size:0.8rem;">—</span>'}
          </div>
        </td>
        <td>
          <span class="badge-status ${isConsentPublish ? 'badge-published' : 'badge-draft'}" style="font-size:0.72rem;white-space:nowrap;">
            ${isConsentPublish ? 'Profile Public' : 'Anonymous'}
          </span>
        </td>
        <td>
          <span class="badge-status ${isWgYes ? 'badge-published' : 'badge-draft'}" style="font-size:0.72rem;">
            ${isWgYes ? 'Yes' : 'No'}
          </span>
        </td>
        <td>
          <span style="font-size:0.78rem;color:#64748b;white-space:nowrap;">${subDate}</span>
        </td>
        <td style="text-align:right;white-space:nowrap;">
          <div style="display:inline-flex;gap:6px;">
            <button type="button" class="btn-action" onclick="openRegistrationDetailModal('${escapeHtml(r.id)}')" title="View complete 17-question submission">
              View
            </button>
            <button type="button" class="btn-action delete" onclick="confirmDeleteReg('${escapeHtml(r.id)}')" title="Delete registration">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openRegistrationDetailModal(id) {
  const r = allRegistrations.find(item => item.id === id);
  if (!r) return;

  currentModalRegId = id;

  document.getElementById('modalRegName').innerText = r.fullName || 'Delegate';
  document.getElementById('modalRegRefId').innerText = r.id || '—';
  document.getElementById('modalRegOrg').innerText = `${r.organization || '—'} · ${r.designation || '—'}`;
  document.getElementById('modalRegMeta').innerText = `Email: ${r.email || '—'} | Phone: ${r.phone || '—'} | Submitted: ${r.submittedAt ? new Date(r.submittedAt).toUTCString() : '—'}`;

  const fps = Array.isArray(r.operationalFootprint) ? r.operationalFootprint : [];
  const prods = Array.isArray(r.financialProducts) ? r.financialProducts : [];
  const barriers = Array.isArray(r.topBarriers) ? r.topBarriers : [];
  const caps = Array.isArray(r.offerCapabilities) ? r.offerCapabilities : [];

  const bodyEl = document.getElementById('modalRegBodyContent');
  bodyEl.innerHTML = `
    <!-- SECTION 1 -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
      <div style="font-weight:800;color:var(--green-dark);font-size:0.95rem;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">
        Section 1: Delegate &amp; Institutional Identity
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.88rem;">
        <div><strong>1. Full Name:</strong> <br>${escapeHtml(r.fullName)}</div>
        <div><strong>2. Official Email:</strong> <br><a href="mailto:${escapeHtml(r.email)}" style="color:var(--teal);">${escapeHtml(r.email)}</a></div>
        <div><strong>3. Phone / WhatsApp:</strong> <br>${escapeHtml(r.phone)}</div>
        <div><strong>4. Organization:</strong> <br>${escapeHtml(r.organization)}</div>
        <div><strong>5. Job Title / Role:</strong> <br>${escapeHtml(r.designation)}</div>
      </div>
      <div style="margin-top:10px;font-size:0.88rem;">
        <strong>6. Primary Operational Footprint:</strong>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;">
          ${fps.map(f => `<span style="background:#e2e8f0;color:#1e293b;padding:3px 8px;border-radius:6px;font-size:0.8rem;font-weight:600;">${escapeHtml(f)}</span>`).join('') || '—'}
        </div>
      </div>
    </div>

    <!-- SECTION 2 -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
      <div style="font-weight:800;color:var(--green-dark);font-size:0.95rem;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">
        Section 2: Institutional Role in the FI Ecosystem
      </div>
      <div style="font-size:0.88rem;margin-bottom:10px;">
        <strong>7. Stakeholder Archetype:</strong><br>
        <span style="display:inline-block;background:rgba(0,130,138,0.1);color:var(--teal-dark);padding:4px 10px;border-radius:6px;font-weight:700;margin-top:3px;">
          ${escapeHtml(r.stakeholderArchetype)}
        </span>
        ${r.stakeholderArchetypeOther ? `<div style="margin-top:4px;color:#475569;"><em>Specification:</em> ${escapeHtml(r.stakeholderArchetypeOther)}</div>` : ''}
      </div>
      <div style="font-size:0.88rem;">
        <strong>8. Primary Financial Products &amp; Services Delivered:</strong>
        <ul style="margin:6px 0 0 20px;padding:0;line-height:1.5;">
          ${prods.map(p => `<li>${escapeHtml(p)}</li>`).join('') || '<li>None specified</li>'}
        </ul>
      </div>
    </div>

    <!-- SECTION 3 -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
      <div style="font-weight:800;color:var(--green-dark);font-size:0.95rem;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">
        Section 3: Ground-Level Challenges &amp; Bottlenecks
      </div>
      <div style="font-size:0.88rem;margin-bottom:12px;">
        <strong>9. Top 3 Barriers to Rural Women Financial Inclusion:</strong>
        <ul style="margin:6px 0 0 20px;padding:0;line-height:1.5;">
          ${barriers.map(b => `<li style="font-weight:600;color:#0f172a;">${escapeHtml(b)}</li>`).join('') || '<li>None specified</li>'}
        </ul>
      </div>
      <div style="font-size:0.88rem;">
        <strong>10. Single Biggest Operational Challenge (Max 50 Words):</strong>
        <div style="background:#fff;border:1px solid #cbd5e1;border-radius:8px;padding:10px 14px;margin-top:6px;color:#334155;line-height:1.6;white-space:pre-line;">
          ${escapeHtml(r.biggestOperationalChallenge || '—')}
        </div>
      </div>
    </div>

    <!-- SECTION 4 -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
      <div style="font-weight:800;color:var(--green-dark);font-size:0.95rem;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">
        Section 4: Collaboration, Public Funds &amp; Synergies
      </div>
      <div style="font-size:0.88rem;margin-bottom:10px;">
        <strong>11. Assets, Capabilities &amp; Resources Offered:</strong>
        <ul style="margin:6px 0 0 20px;padding:0;line-height:1.5;">
          ${caps.map(c => `<li>${escapeHtml(c)}</li>`).join('') || '<li>None specified</li>'}
        </ul>
      </div>
      <div style="font-size:0.88rem;margin-bottom:10px;">
        <strong>12. Support / Resource Needed Most:</strong><br>
        <div style="background:rgba(217,130,43,0.1);color:#b45309;padding:6px 12px;border-radius:6px;font-weight:700;display:inline-block;margin-top:4px;">
          ${escapeHtml(r.neededSupport || '—')}
        </div>
      </div>
      <div style="font-size:0.88rem;">
        <strong>13. Consortium Participation Interest:</strong> <br>
        <strong style="color:var(--green-dark);">${escapeHtml(r.consortiumInterest || '—')}</strong>
      </div>
    </div>

    <!-- SECTION 5 -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
      <div style="font-weight:800;color:var(--green-dark);font-size:0.95rem;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">
        Section 5: Voice of the Frontline (Qualitative Insights)
      </div>
      <div style="font-size:0.88rem;margin-bottom:12px;">
        <strong>14. Practical Overlooked Opportunity to Prioritize:</strong>
        <div style="background:#fff;border:1px solid #cbd5e1;border-radius:8px;padding:10px 14px;margin-top:6px;color:#334155;line-height:1.6;white-space:pre-line;">
          ${escapeHtml(r.overlookedOpportunity || '—')}
        </div>
      </div>
      <div style="font-size:0.88rem;">
        <strong>15. Successful Project, Tool, or Pilot Model:</strong>
        <div style="background:#fff;border:1px solid #cbd5e1;border-radius:8px;padding:10px 14px;margin-top:6px;color:#334155;line-height:1.6;white-space:pre-line;">
          ${escapeHtml(r.successfulModel || '—')}
        </div>
      </div>
    </div>

    <!-- SECTION 6 -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;">
      <div style="font-weight:800;color:var(--green-dark);font-size:0.95rem;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">
        Section 6: Post-Event Engagement Commitments
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.88rem;">
        <div>
          <strong>16. Feature Profile in 2026 Ecosystem Report:</strong><br>
          <span style="display:inline-block;background:#e2e8f0;color:#0f172a;padding:4px 10px;border-radius:6px;font-weight:700;margin-top:3px;">
            ${escapeHtml(r.reportFeatureConsent || '—')}
          </span>
        </div>
        <div>
          <strong>17. Post-Event Working Group Interest:</strong><br>
          <span style="display:inline-block;background:#e2e8f0;color:#0f172a;padding:4px 10px;border-radius:6px;font-weight:700;margin-top:3px;">
            ${escapeHtml(r.workingGroupInterest || '—')}
          </span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('registrationDetailModal').style.display = 'flex';
}

function deleteCurrentModalReg() {
  if (currentModalRegId) {
    confirmDeleteReg(currentModalRegId);
  }
}

function confirmDeleteReg(id) {
  const r = allRegistrations.find(item => item.id === id);
  const promptEl = document.getElementById('regDeletePromptText');
  const btn = document.getElementById('btnConfirmDeleteReg');

  if (promptEl) {
    promptEl.innerHTML = `Are you sure you want to permanently delete registration <strong>${escapeHtml(id)}</strong> for <strong>${escapeHtml(r ? r.fullName : 'this delegate')}</strong> (${escapeHtml(r ? r.organization : '')})?<br><br>This will permanently remove the record from the database.`;
  }

  if (btn) {
    btn.onclick = () => executeDeleteReg(id);
  }

  document.getElementById('regDeleteModal').style.display = 'flex';
}

async function executeDeleteReg(id) {
  const token = sessionStorage.getItem('gida_admin_token');
  if (!token) return;

  const btn = document.getElementById('btnConfirmDeleteReg');
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Deleting...';
  }

  try {
    const res = await fetch(`/api/admin/registrations?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    const result = await res.json().catch(() => ({}));
    if (res.ok && result.success) {
      closeModal('regDeleteModal');
      closeModal('registrationDetailModal');
      showToast(`✓ Registration ${id} deleted successfully`);
      await fetchRegistrations();
    } else {
      alert('Delete failed: ' + (result.message || 'Server error'));
    }
  } catch (err) {
    console.error('[DELETE ERROR]', err);
    alert('Network error while deleting registration.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'Confirm & Delete';
    }
  }
}

function exportRegistrationsCsv(exportAll) {
  const token = sessionStorage.getItem('gida_admin_token');
  if (!token) {
    alert('Admin session expired. Please sign in again.');
    return;
  }

  let url = `/api/admin/registrations/export?token=${encodeURIComponent(token)}`;

  if (!exportAll) {
    const searchQ = (document.getElementById('regSearchInput')?.value || '').trim();
    const filterArchetype = document.getElementById('regFilterArchetype')?.value || 'all';
    const filterFootprint = document.getElementById('regFilterFootprint')?.value || 'all';
    const filterConsent = document.getElementById('regFilterConsent')?.value || 'all';
    const filterWg = document.getElementById('regFilterWg')?.value || 'all';

    if (searchQ) url += `&q=${encodeURIComponent(searchQ)}`;
    if (filterArchetype !== 'all') url += `&archetype=${encodeURIComponent(filterArchetype)}`;
    if (filterFootprint !== 'all') url += `&footprint=${encodeURIComponent(filterFootprint)}`;
    if (filterConsent !== 'all') url += `&consent=${encodeURIComponent(filterConsent)}`;
    if (filterWg !== 'all') url += `&workingGroup=${encodeURIComponent(filterWg)}`;
  }

  // Trigger download via hidden anchor
  const a = document.createElement('a');
  a.href = url;
  a.download = exportAll ? 'gida-all-event-registrations-2026.csv' : 'gida-filtered-event-registrations-2026.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();

  showToast(exportAll ? 'Exporting all registrations to CSV...' : 'Exporting filtered registrations to CSV...');
}

function printCurrentRegistration() {
  window.print();
}

// ==========================================
// GOOGLE SHEETS LIVE INTEGRATION HELPERS
// ==========================================
function updateSheetsStatusBadge() {
  const badge = document.getElementById('sheetsStatusBadge');
  const input = document.getElementById('inputSheetsWebhookUrl');
  const url = (store.googleSheetsWebhookUrl || '').trim();
  if (input && !input.value) input.value = url;
  if (!badge) return;
  if (url) {
    badge.className = 'badge-status badge-published';
    badge.innerText = '✓ Connected to Webhook';
    badge.style.background = '#dcfce7';
    badge.style.color = '#15803d';
  } else {
    badge.className = 'badge-status badge-draft';
    badge.innerText = '⚙️ Webhook Not Configured';
    badge.style.background = '#fef3c7';
    badge.style.color = '#b45309';
  }
}

function openSheetsConfigModal() {
  const input = document.getElementById('inputSheetsWebhookUrl');
  if (input) input.value = store.googleSheetsWebhookUrl || '';
  const resBox = document.getElementById('sheetsTestResultBox');
  if (resBox) resBox.style.display = 'none';
  document.getElementById('sheetsConfigModal').style.display = 'flex';
}

function openSheetsGuideModal() {
  document.getElementById('sheetsGuideModal').style.display = 'flex';
}

async function saveSheetsWebhookConfig() {
  const input = document.getElementById('inputSheetsWebhookUrl');
  const url = (input ? input.value : '').trim();
  store.googleSheetsWebhookUrl = url;
  await persist();
  updateSheetsStatusBadge();
  closeModal('sheetsConfigModal');
  showToast(url ? 'Google Sheets Webhook URL saved successfully!' : 'Google Sheets Webhook URL cleared.');
}

async function testSheetsWebhookConnection() {
  const input = document.getElementById('inputSheetsWebhookUrl');
  const url = (input ? input.value : '').trim() || (store.googleSheetsWebhookUrl || '').trim();
  const btn = document.getElementById('btnTestWebhookConn');
  const resBox = document.getElementById('sheetsTestResultBox');
  const token = sessionStorage.getItem('gida_admin_token');

  if (!url) {
    if (resBox) {
      resBox.style.display = 'block';
      resBox.style.background = '#fef2f2';
      resBox.style.color = '#991b1b';
      resBox.style.border = '1px solid #fecaca';
      resBox.innerText = 'Please enter a Google Apps Script Web App URL first.';
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Testing connection...';
  }

  try {
    const res = await fetch('/api/admin/test-sheets-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (token || '')
      },
      body: JSON.stringify({ webhookUrl: url })
    });

    const data = await res.json().catch(() => ({}));
    if (resBox) {
      resBox.style.display = 'block';
      if (res.ok && data.success) {
        resBox.style.background = '#f0fdf4';
        resBox.style.color = '#15803d';
        resBox.style.border = '1px solid #bbf7d0';
        resBox.innerHTML = `<strong>✓ Connection Verified!</strong><br>${escapeHtml(data.message || 'Row successfully appended to your Google Sheet.')}`;
      } else {
        resBox.style.background = '#fef2f2';
        resBox.style.color = '#991b1b';
        resBox.style.border = '1px solid #fecaca';
        resBox.innerHTML = `<strong>✕ Verification Failed</strong><br>${escapeHtml(data.message || 'Unable to connect to Google Sheets Webhook.')}`;
      }
    }
  } catch (err) {
    if (resBox) {
      resBox.style.display = 'block';
      resBox.style.background = '#fef2f2';
      resBox.style.color = '#991b1b';
      resBox.style.border = '1px solid #fecaca';
      resBox.innerHTML = `<strong>✕ Network Error:</strong> ${escapeHtml(err.message)}`;
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = '⚡ Test Connection';
    }
  }
}

function copyAppsScriptCode() {
  fetch('google-apps-script.js')
    .then(r => r.text())
    .then(t => {
      navigator.clipboard.writeText(t).then(() => {
        const btn = document.getElementById('btnCopyAppsScript');
        if (btn) btn.innerText = '✓ Copied to Clipboard!';
        setTimeout(() => { if (btn) btn.innerText = '📋 Copy Apps Script Code to Clipboard'; }, 2500);
      });
    })
    .catch(() => {
      alert('Open the file google-apps-script.js in the project repository to copy the script code.');
    });
}

// Initial authentication check
checkAuth();
