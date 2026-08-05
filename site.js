/* Shared interaction and navigation layer for the static portfolio. */
(() => {
  const pages = {
    home: 'index.html', projects: 'projects.html', experience: 'experience.html',
    work: 'experience.html', contact: 'contact.html'
  };
  const cases = {
    'clarity km': 'clarity_km.html', 'legit insight': 'strategic_focus.html',
    'container intelligence': 'container_intelligence.html',
    'container relocation': 'container_flow_optimization.html',
    'healthbridge': 'healthbridge.html', 'british airways': 'aviation_sentiment.html',
    'aviation sentiment': 'aviation_sentiment.html', 'irider': 'irider.html',
    'royal enfield': 'royal_enfield.html'
  };

  const normalise = (value) => value.toLowerCase().replace(/\s+/g, ' ').trim();
  const destinationFor = (text) => {
    const label = normalise(text);
    for (const [name, href] of Object.entries(cases)) if (label.includes(name)) return href;
    if (label.includes('consult') || label.includes('contact')) return pages.contact;
    if (label.includes('experience') || label === 'work') return pages.experience;
    if (label.includes('project')) return pages.projects;
    if (label.includes('home')) return pages.home;
    return null;
  };

  document.addEventListener('DOMContentLoaded', () => {
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
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (form.id !== 'contact-form') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const data = new FormData(form);
    const name = data.get('name') || 'Portfolio visitor';
    const email = data.get('email') || 'Not provided';
    const message = data.get('message') || 'No message provided';
    const topic = data.get('subject') || `Portfolio enquiry from ${name}`;
    const subject = encodeURIComponent(topic);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:kaviena.global@gmail.com?subject=${subject}&body=${body}`;
  }, true);
})();
