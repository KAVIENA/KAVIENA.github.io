/* Shared interaction and navigation layer for the static portfolio. */
(() => {
  const pages = {
    home: 'index.html', projects: 'projects.html', experience: 'experience.html',
    work: 'experience.html', contact: 'contact.html'
  };
  const projectList = [
    ['Clarity KM @ Airbus', 'clarity_km.html'],
    ['Legit Insights', 'strategic_focus.html'],
    ['Container Intelligence', 'container_intelligence.html'],
    ['Container Flow Optimization', 'container_flow_optimization.html'],
    ['HealthBridge CRM', 'healthbridge.html'],
    ['Aviation Sentiment', 'aviation_sentiment.html'],
    ['iRider: Computer Vision for Safety', 'irider.html'],
    ['Royal Enfield Quality Intelligence', 'royal_enfield.html']
  ];
  const cases = Object.fromEntries([
    ['clarity km', 'clarity_km.html'], ['legit insight', 'strategic_focus.html'],
    ['container intelligence', 'container_intelligence.html'],
    ['container relocation', 'container_flow_optimization.html'],
    ['container flow', 'container_flow_optimization.html'], ['healthbridge', 'healthbridge.html'],
    ['british airways', 'aviation_sentiment.html'], ['aviation sentiment', 'aviation_sentiment.html'],
    ['irider', 'irider.html'], ['royal enfield', 'royal_enfield.html']
  ]);

  const normalise = (value) => value.toLowerCase().replace(/\s+/g, ' ').trim();
  const destinationFor = (text) => {
    const label = normalise(text);
    for (const [name, href] of Object.entries(cases)) if (label.includes(name)) return href;
    if (label.includes('consult') || label.includes('contact') || label.includes('get in touch') || label.includes('send message') || label.includes('strategy call') || label.includes("let's talk")) return pages.contact;
    if (label.includes('experience') || label === 'work') return pages.experience;
    if (label.includes('project')) return pages.projects;
    if (label.includes('home')) return pages.home;
    return null;
  };

  const currentFile = () => window.location.pathname.split('/').pop() || 'index.html';
  const links = (items, className = '') => items.map(([label, href]) =>
    `<a class="${className}" href="${href}">${label}</a>`).join('');

  const addProjectJourney = () => {
    const file = currentFile();
    const index = projectList.findIndex(([, href]) => href === file);
    if (index === -1) return;
    const previous = projectList[(index - 1 + projectList.length) % projectList.length];
    const next = projectList[(index + 1) % projectList.length];
    const footer = document.querySelector('footer');
    if (!footer) return;
    const journey = document.createElement('section');
    journey.className = 'portfolio-journey';
    journey.setAttribute('aria-label', 'Project navigation');
    journey.innerHTML = `<p>Explore the portfolio</p><div><a href="${previous[1]}">← ${previous[0]}</a><a href="projects.html">All projects</a><a href="${next[1]}">${next[0]} →</a></div>`;
    footer.before(journey);
  };

  const addMobileMenu = () => {
    const trigger = [...document.querySelectorAll('button')].find((button) =>
      normalise(button.textContent) === 'menu' || normalise(button.getAttribute('aria-label') || '') === 'menu');
    if (!trigger || document.querySelector('.portfolio-menu')) return;
    const menu = document.createElement('div');
    menu.className = 'portfolio-menu';
    menu.hidden = true;
    menu.innerHTML = `<div class="portfolio-menu-panel" role="dialog" aria-modal="true" aria-label="Portfolio navigation">
      <div class="portfolio-menu-top"><strong>Kaviena Sharon</strong><button type="button" aria-label="Close menu">×</button></div>
      <nav>${links([['Home', pages.home], ['Projects', pages.projects], ['Experience', pages.experience], ['Contact', pages.contact]])}</nav>
      <p>Case studies</p><nav>${links(projectList)}</nav>
      <a class="portfolio-menu-email" href="mailto:kaviena.global@gmail.com">Email Kaviena</a>
    </div>`;
    document.body.append(menu);
    const close = () => { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); };
    trigger.type = 'button';
    trigger.setAttribute('aria-label', 'Open portfolio menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', () => { menu.hidden = !menu.hidden; trigger.setAttribute('aria-expanded', String(!menu.hidden)); });
    menu.addEventListener('click', (event) => { if (event.target === menu || event.target.closest('a, button')) close(); });
  };

  const addProjectsPageLinks = () => {
    if (currentFile() !== 'projects.html') return;
    document.querySelectorAll('.glass-card').forEach((card) => {
      const heading = card.querySelector('h2, h3');
      const href = heading && destinationFor(heading.textContent);
      if (!href || card.querySelector(`a[href="${href}"]`)) return;
      const link = document.createElement('a');
      link.className = 'portfolio-card-link';
      link.href = href;
      link.textContent = 'View Case Study →';
      card.append(link);
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
      link.href = normalise(link.textContent).includes('strategy call') ? pages.contact : 'mailto:kaviena.global@gmail.com';
    });
    document.querySelectorAll('form[action^="mailto:"]').forEach((form) => { form.action = 'mailto:kaviena.global@gmail.com'; });
    document.querySelectorAll('a[href="#"]').forEach((link) => {
      const nearbyHeading = link.closest('.cursor-pointer, .glass-card, article, section')?.querySelector('h2, h3');
      const href = destinationFor(link.textContent) || (nearbyHeading && destinationFor(nearbyHeading.textContent));
      if (href) link.href = href;
    });

    document.querySelectorAll('.cursor-pointer').forEach((card) => {
      const heading = card.querySelector('h2, h3');
      const href = heading && destinationFor(heading.textContent);
      if (!href) return;
      card.tabIndex = 0;
      card.setAttribute('role', 'link');
      card.setAttribute('aria-label', `Open ${heading.textContent.trim()} case study`);
      const open = (event) => {
        if (event.target.closest('a, button')) return;
        window.location.href = href;
      };
      card.addEventListener('click', open);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(event); }
      });
    });

    document.querySelectorAll('button').forEach((button) => {
      const href = destinationFor(button.textContent);
      if (href && !button.closest('form')) button.addEventListener('click', () => { window.location.href = href; });
    });

    addProjectJourney();
    addMobileMenu();
    addProjectsPageLinks();
  });

})();
