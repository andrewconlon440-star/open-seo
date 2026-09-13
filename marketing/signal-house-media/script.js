const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

const setHeaderState = () => header?.classList.toggle('scrolled', window.scrollY > 24);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('in-view'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  revealElements.forEach((element) => observer.observe(element));
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

const copyEmailButton = document.querySelector('[data-copy-email]');
const copyStatus = document.querySelector('[data-copy-status]');

copyEmailButton?.addEventListener('click', async () => {
  const email = 'sales@signalhousemedia.com.au';

  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = 'Email address copied. Paste it into any email app.';
    copyEmailButton.firstChild.textContent = 'Email copied ';
  } catch {
    const temporaryField = document.createElement('textarea');
    temporaryField.value = email;
    temporaryField.setAttribute('readonly', '');
    temporaryField.style.position = 'fixed';
    temporaryField.style.opacity = '0';
    document.body.appendChild(temporaryField);
    temporaryField.select();
    document.execCommand('copy');
    temporaryField.remove();
    copyStatus.textContent = 'Email address copied. Paste it into any email app.';
    copyEmailButton.firstChild.textContent = 'Email copied ';
  }
});

const clientShowcase = document.querySelector('[data-client-showcase]');

if (clientShowcase) {
  const clients = [
    {
      name: 'Allsawted Tree Services',
      label: 'Client signal / Allsawted',
      title: 'Built alongside a real Perth service business.',
      description: 'Allsawted Tree Services is one of our Perth clients. The work is practical: clearer service pages, stronger local relevance, verified customer proof and improvements published to the live site.',
      facts: [['5.0 / 5', 'Google rating when checked'], ['39', 'Google reviews on 8 Sep 2026'], ['5', 'focused Ellenbrook service pages']],
      category: 'LOCAL VISIBILITY',
      heading: 'Evidence turned into action.',
      items: ['Service pages published', 'Review proof clarified', 'Community recognition verified', 'Measurement continues'],
      logo: './clients/allsawted.png',
      story: '/work/allsawted/',
      site: 'https://allsawted.com.au/',
      note: 'Rating and review count are a dated observation, not a performance claim by Signal House Media.',
    },
    {
      name: 'Rhino Mechanical Services',
      label: 'Client signal / Rhino Mechanical',
      title: 'A local workshop built around practical service.',
      description: 'Rhino Mechanical Services supports Ellenbrook drivers with servicing, repairs and workshop expertise. The opportunity is to turn that broad capability into a clear, confident digital presence.',
      facts: [['Ellenbrook', 'local workshop'], ['5', 'core service areas'], ['Family owned', 'business identity']],
      category: 'LOCAL SERVICE BRAND',
      heading: 'Make capability easy to see.',
      items: ['Service story clarified', 'Local relevance strengthened', 'Visual content opportunity mapped', 'Digital journey reviewed'],
      logo: './clients/rhino-mechanical.png',
      story: '/work/rhino-mechanical/',
      site: 'https://rhinomechanicalservices.com.au/',
      note: 'Business details reflect publicly available information. Outcomes appear only when verified.',
    },
    {
      name: 'Ellenbrook Community Pantry',
      label: 'Client signal / Community Pantry',
      title: 'A community service that deserves to be understood.',
      description: 'Ellenbrook Community Pantry helps local people access food relief with dignity. Clear communication can help residents understand the service and supporters see how they can contribute.',
      facts: [['Ellenbrook', 'community focus'], ['Food relief', 'core service'], ['Local', 'people supporting people']],
      category: 'COMMUNITY COMMUNICATION',
      heading: 'Make help easier to find.',
      items: ['Purpose made clear', 'Audience needs considered', 'Support pathways identified', 'Story ready to grow'],
      logo: './clients/ellenbrook-community-pantry.png',
      story: '/work/ellenbrook-community-pantry/',
      site: 'https://ellenbrook.net.au/',
      note: 'Community information reflects publicly available material. No fundraising result is implied.',
    },
    {
      name: 'Grayz Engineering',
      label: 'Client signal / Grayz Engineering',
      title: 'Specialist engineering needs a precise story.',
      description: 'Grayz Engineering brings mobile line boring, bore welding and onsite machining capability to Western Australian industry. The digital job is to make specialist value clear to the people who need it.',
      facts: [['WA', 'service coverage'], ['Mobile', 'onsite capability'], ['Specialist', 'engineering focus']],
      category: 'INDUSTRIAL POSITIONING',
      heading: 'Precision in the message.',
      items: ['Capability organised', 'Industrial audience defined', 'Service language sharpened', 'Enquiry path reviewed'],
      logo: './clients/grayz-engineering.png',
      story: '/work/grayz-engineering/',
      site: 'https://grayzengineering.au/',
      note: 'Service descriptions reflect publicly available business information.',
    },
    {
      name: 'Invoicing for Idiots',
      label: 'Client signal / Invoicing for Idiots',
      title: 'A digital product with a refreshingly direct promise.',
      description: 'Invoicing for Idiots is designed to make everyday business admin easier to understand. Its strongest opportunity is a simple product story that moves quickly from frustration to action.',
      facts: [['Simple', 'product promise'], ['Online', 'digital delivery'], ['Small business', 'primary audience']],
      category: 'DIGITAL PRODUCT',
      heading: 'Remove friction from the first click.',
      items: ['Product promise focused', 'User problem defined', 'Journey made clearer', 'Growth path considered'],
      logo: './clients/invoicing-for-idiots.jpg',
      story: '/work/invoicing-for-idiots/',
      site: 'https://invoicingforidiots.com/',
      note: 'Product descriptions reflect publicly available information. Performance claims require verified data.',
    },
    {
      name: 'HomeBrew Works',
      label: 'Client signal / HomeBrew Works',
      title: 'Premium equipment backed by practical knowledge.',
      description: 'HomeBrew Works serves home brewers with brewing, kegging and carbon dioxide equipment. The opportunity is to pair premium products with useful advice that earns trust before purchase.',
      facts: [['2013', 'established brand mark'], ['Wangara', 'Western Australia'], ['Equipment', 'and practical advice']],
      category: 'ECOMMERCE AND EXPERTISE',
      heading: 'Turn knowledge into confidence.',
      items: ['Product range organised', 'Expertise brought forward', 'Customer questions identified', 'Purchase journey reviewed'],
      logo: './clients/homebrewworks.png',
      story: '/work/homebrewworks/',
      site: 'https://homebrewworks.com.au/',
      note: 'Business details reflect publicly available information. Sales outcomes require verified data.',
    },
  ];

  const title = clientShowcase.querySelector('[data-showcase-title]');
  const description = clientShowcase.querySelector('[data-showcase-description]');
  const logo = clientShowcase.querySelector('[data-showcase-logo]');
  const label = clientShowcase.querySelector('[data-showcase-label]');
  const category = clientShowcase.querySelector('[data-showcase-category]');
  const heading = clientShowcase.querySelector('[data-showcase-heading]');
  const list = clientShowcase.querySelector('[data-showcase-list]');
  const story = clientShowcase.querySelector('[data-showcase-story]');
  const site = clientShowcase.querySelector('[data-showcase-site]');
  const count = clientShowcase.querySelector('[data-showcase-count]');
  const note = document.querySelector('[data-showcase-note]');
  const graphic = clientShowcase.querySelector('[data-showcase-graphic]');
  let currentClient = 0;
  let carouselTimer;

  const showClient = (nextIndex) => {
    currentClient = (nextIndex + clients.length) % clients.length;
    const client = clients[currentClient];
    clientShowcase.classList.add('is-switching');

    window.setTimeout(() => {
      title.textContent = client.title;
      description.textContent = client.description;
      client.facts.forEach(([value, factLabel], index) => {
        clientShowcase.querySelector(`[data-showcase-fact-value="${index}"]`).textContent = value;
        clientShowcase.querySelector(`[data-showcase-fact-label="${index}"]`).textContent = factLabel;
      });
      logo.src = client.logo;
      logo.alt = `${client.name} logo`;
      label.textContent = client.label;
      category.textContent = client.category;
      heading.textContent = client.heading;
      list.innerHTML = client.items.map((item, index) => `<li><span>${index === client.items.length - 1 ? '→' : '✓'}</span> ${item}</li>`).join('');
      story.href = client.story;
      site.href = client.site;
      count.textContent = `${String(currentClient + 1).padStart(2, '0')} / ${String(clients.length).padStart(2, '0')}`;
      note.textContent = client.note;
      graphic.setAttribute('aria-label', `${client.name} delivery summary`);
      clientShowcase.classList.remove('is-switching');
    }, reducedMotion ? 0 : 180);
  };

  const restartCarousel = () => {
    window.clearInterval(carouselTimer);
    if (!reducedMotion) carouselTimer = window.setInterval(() => showClient(currentClient + 1), 7000);
  };

  clientShowcase.querySelector('[data-showcase-previous]')?.addEventListener('click', () => {
    showClient(currentClient - 1);
    restartCarousel();
  });
  clientShowcase.querySelector('[data-showcase-next]')?.addEventListener('click', () => {
    showClient(currentClient + 1);
    restartCarousel();
  });
  clientShowcase.addEventListener('mouseenter', () => window.clearInterval(carouselTimer));
  clientShowcase.addEventListener('mouseleave', restartCarousel);
  clientShowcase.addEventListener('focusin', () => window.clearInterval(carouselTimer));
  clientShowcase.addEventListener('focusout', restartCarousel);
  restartCarousel();
}

const enquiryForm = document.querySelector('[data-enquiry-form]');

enquiryForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(enquiryForm);
  const name = String(formData.get('name') || '').trim();
  const business = String(formData.get('business') || '').trim();
  const need = String(formData.get('need') || '').trim();
  const subject = encodeURIComponent(`Signal House Media enquiry from ${business}`);
  const body = encodeURIComponent(`Name: ${name}\nBusiness: ${business}\n\nWhat needs to work better:\n${need}`);
  window.location.href = `mailto:sales@signalhousemedia.com.au?subject=${subject}&body=${body}`;
});
