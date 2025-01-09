const serviceContent = {
  salesSupport: {
    title: "Sales Team Support",
    content: `
      <h2>Sales Team Support</h2>
      <div class="content-icon">
        <i class="fas fa-user-tie"></i>
      </div>
      <h3><span style="color: #20bdff;">Transform Your Sales Organization</span></h3>
      <p>Enhance your team's performance with:</p>
      <ul>
        <li>Needs Assessment & Customization</li>
        <li>Sales Team Setup & Training</li>
        <li>Sales Outreach & Engagement</li>
        <li>Performance Tracking & Reporting</li>
        <li>Ongoing Support & Optimization</li>
      </ul>
      <p>We tailor solutions to achieve measurable results.</p>
    `
  },
  leadClosing: {
    title: "Lead Closing",
    content: `
      <h2>Lead Closing</h2>
      <div class="content-icon">
        <i class="fas fa-handshake"></i>
      </div>
      <h3><span style="color: #20bdff;">Maximize Conversions</span></h3>
      <p>Convert prospects with:</p>
      <ul>
        <li>Lead Qualification & Assessment</li>
        <li>Personalized Communication & Engagement</li>
        <li>Objection Handling & Negotiation</li>
        <li>Offering Incentives & Creating Demands</li>
        <li>Closing Call</li>
        <li>Post-Closing Follow-Up & Relationship Building</li>
      </ul>
      <p>Our experts simplify the closing process.</p>
    `
  },
  trainingPrograms: {
    title: "Training Programs",
    content: `
      <h2>Training Programs</h2>
      <div class="content-icon">
        <i class="fas fa-chalkboard-teacher"></i>
      </div>
      <h3><span style="color: #20bdff;">Elevate Team Skills</span></h3>
      <p>Empower your team with training in:</p>
      <ul>
        <li>Customized Training Program Design</li>
        <li>Onboarding & Sales Process Integration</li>
        <li>Interactive & Engaging Learning Methods</li>
        <li>Sales Team Empowerment & Confidence Building</li>
        <li>Performance Tracking & Analytics</li>
      </ul>
      <p>Tailored programs for your team's growth.</p>
    `
  }
};

// Configuration and types
const MOBILE_BREAKPOINT = 768;
const SCROLL_TRIGGER_THRESHOLD = '80%';

class ServicesManager {
  constructor() {
    this.serviceCards = document.querySelectorAll('.service-card');
    this.servicesContainer = document.querySelector('.services-container');
    this.contentWrapper = document.querySelector('.content-wrapper');
    this.servicesSection = document.querySelector('.services-section');
    this.defaultContent = document.getElementById('defaultContent');
    this.activeCard = null;
    this.isIntersectionObserverSupported = 'IntersectionObserver' in window;
    this.MOBILE_BREAKPOINT = 768; // Define a breakpoint for mobile devices
    this.cardFocusIndex = 0;

    this.init();
  }

  init() {
    this.setupContentPanels();
    this.setupIntersectionObserver();
    this.setupEventListeners();
    this.setupSmoothScroll();
  }

  setupContentPanels() {
    const fragment = document.createDocumentFragment();
    Object.entries(serviceContent).forEach(([key, data]) => {
      const panel = document.createElement('div');
      panel.className = 'panel-content';
      panel.dataset.content = key;
      panel.innerHTML = data.content;
      fragment.appendChild(panel);
    });
    this.contentWrapper.appendChild(fragment);
  }

  setupIntersectionObserver() {
    if (!this.isIntersectionObserverSupported) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.handleSectionEntry();
          }
        });
      },
      { threshold: 0.1 }
    );

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activateCard(entry.target);
          }
        });
      },
      {
        threshold: 0.7,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    sectionObserver.observe(this.servicesSection);
    this.serviceCards.forEach(card => cardObserver.observe(card));
  }

  setupEventListeners() {
    this.servicesContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.service-card');
      if (card) this.activateCard(card);
    });

    this.servicesContainer.addEventListener('keydown', (e) => {
      const card = e.target.closest('.service-card');
      if (!card) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.activateCard(card);
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.navigateCards('next', card);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.navigateCards('prev', card);
          break;
      }
    });

    const debouncedResize = this.debounce(() => {
      this.handleResize();
    }, 250);

    window.addEventListener('resize', debouncedResize);
  }

  setupSmoothScroll() {
    if (window.innerWidth > this.MOBILE_BREAKPOINT) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  navigateCards(direction, currentCard) {
    const cards = Array.from(this.serviceCards);
    const currentIndex = cards.indexOf(currentCard);
    const targetIndex = direction === 'next'
      ? Math.min(currentIndex + 1, cards.length - 1)
      : Math.max(currentIndex - 1, 0);

    cards[targetIndex].focus();
    this.activateCard(cards[targetIndex]);
  }

  activateCard(card) {
    if (this.activeCard === card) return;

    if (this.activeCard) {
      this.activeCard.classList.remove('active');
      this.activeCard.setAttribute('aria-selected', 'false');
    }

    card.classList.add('active');
    card.setAttribute('aria-selected', 'true');
    this.activeCard = card;
    this.updateContentPanel(card.dataset.service);
    this.animateCard(card);
  }

  updateContentPanel(serviceKey) {
    const panels = this.contentWrapper.querySelectorAll('.panel-content');
    panels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.content === serviceKey);
    });

    if (this.defaultContent) {
      this.defaultContent.style.display = 'none';
    }
  }

  animateCard(card) {
    if (window.innerWidth > this.MOBILE_BREAKPOINT) return;

    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  }

  handleSectionEntry() {
    this.cardFocusIndex = 0; // Reset the focus index when entering the section
  }

  handleSectionExit() {
    this.cardFocusIndex = 0; // Reset when exiting the section
    this.serviceCards.forEach(card => card.blur());
  }

  handleResize() {
    if (window.innerWidth <= this.MOBILE_BREAKPOINT) {
      this.setupMobileAnimations();
    }
  }

  setupMobileAnimations() {
    gsap.utils.toArray('.service-card').forEach((card, index) => {
      gsap.set(card, { opacity: 0, y: 20 });
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true
        }
      });
    });
  }

  initializeFirstCard() {
    const firstCard = this.serviceCards[0];
    if (firstCard) this.activateCard(firstCard);
  }

  // Scroll directly to the next section when cards are fully revealed
  scrollToNextSection() {
    const nextSection = this.servicesSection.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ServicesManager();
});

//Easter Egg - Dino
console.log(`%c
               __
              / _)
     _.----._/ /
    /         /
 __/ (  | (  |
/__.-'|_|--|_|  
exit console 🦖 and Type "dino" (only works on homepage)`, 'color: white; font-family: consolas; font-size: 14px;');

document.addEventListener("DOMContentLoaded", function () {
  let schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Karan Soni",
    "url": "https://simplisoni.github.io/"
  };

  let scriptTag = document.createElement("script");
  scriptTag.type = "application/ld+json";
  scriptTag.textContent = JSON.stringify(schemaData);
  document.head.appendChild(scriptTag);
});

document.addEventListener('DOMContentLoaded', function () {
  const easterEggContainer = document.getElementById('easter-egg-container');

  // Create the close button dynamically
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'btn-close';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.id = 'close-easter-egg';
  closeButton.textContent = ''; // Remove visible close symbol
  closeButton.setAttribute('aria-label', 'Close'); // Accessible for screen readers


  // Exact same style as the removed HTML button
  closeButton.style.position = 'fixed';
  closeButton.style.bottom = '20px';
  closeButton.style.left = '50%';
  closeButton.style.transform = 'translateX(-50%)';
  closeButton.style.backgroundColor = '#f00';
  closeButton.style.color = '#fff';
  closeButton.style.border = 'none';
  closeButton.style.padding = '10px 20px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.zIndex = '10000';

  // Append the close button to the container
  easterEggContainer.appendChild(closeButton);

  // Function to hide the Easter egg container
  function hideEasterEgg() {
    easterEggContainer.style.display = 'none';
    const iframe = easterEggContainer.querySelector('iframe');
    iframe.blur();
    iframe.src = iframe.src; // Reset iframe state
  }

  // Event listener for the close button
  closeButton.addEventListener('click', hideEasterEgg);

  // Event listener for Escape key to close the iframe
  document.addEventListener('keydown', function (event) {
    if (event.code === "Escape" && easterEggContainer.style.display === 'flex') {
      hideEasterEgg();
    }
  });

  // 'dino' key sequence to show the Easter egg
  let typedKeys = '';
  document.addEventListener("keydown", function (event) {
    typedKeys += event.key.toLowerCase();

    if (typedKeys === "dino") {
      easterEggContainer.style.display = 'flex';
      const iframe = easterEggContainer.querySelector('iframe');
      iframe.focus();
      typedKeys = ''; // Reset after triggering
    } else if (!"dino".startsWith(typedKeys)) {
      typedKeys = ''; // Reset if sequence doesn't match
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("assets/data/testimonials.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("testimonial-container");
      container.innerHTML = ""; // Clear existing content

      data.forEach((testimonial, index) => {
        const delay = index * 200; // AOS delay for staggered animations

        const card = `
          <div class="col-md-4" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="${delay}">
            <div class="card testimonial-card p-4" style="background-color: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div class="testimonial-content">
                <i class="fas fa-quote-left quote-icon mb-3" style="color: var(--accent-color); font-size: 24px;"></i>
                <p class="card-text" style="color: var(--light-text);">"${testimonial.message}"</p>
                <small style="color: rgba(255, 255, 255, 0.6);">- ${testimonial.name}, ${testimonial.position}</small>
              </div>
            </div>
          </div>
        `;

        container.innerHTML += card;
      });

      AOS.init(); // Reinitialize AOS animations
    })
    .catch(error => console.error("Error loading testimonials:", error));
});
