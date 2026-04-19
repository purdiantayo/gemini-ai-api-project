// Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.style.display = 'none';
  });
});

// Chat Widget
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');

const API_URL = 'http://localhost:4000/api/chat';
let conversationHistory = [];

// Toggle chat window
chatToggle.addEventListener('click', () => {
  chatWindow.classList.toggle('active');
  if (chatWindow.classList.contains('active')) {
    userInput.focus();
    document.querySelector('.notification-badge').style.display = 'none';
  }
});

closeChat.addEventListener('click', () => {
  chatWindow.classList.remove('active');
});

// Send message
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  // Add user message to history and display
  conversationHistory.push({ role: 'user', text: message });
  displayMessage('user', message);
  userInput.value = '';

  // Disable input while loading
  userInput.disabled = true;
  chatForm.querySelector('button').disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation: conversationHistory }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const data = await response.json();
    const botMessage = data.result;

    // Add bot response to history and display
    conversationHistory.push({ role: 'bot', text: botMessage });
    displayMessage('bot', botMessage, true);

  } catch (error) {
    console.error('Error:', error);
    displayMessage('bot', '❌ Sorry, there was an error. Please try again.');
    conversationHistory.pop(); // Remove failed message
  } finally {
    userInput.disabled = false;
    chatForm.querySelector('button').disabled = false;
    userInput.focus();
  }
});

function displayMessage(sender, text, isMarkdown = false) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', sender);

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble');

  if (isMarkdown && sender === 'bot') {
    bubble.innerHTML = marked.parse(text);
  } else {
    bubble.textContent = text;
  }

  messageDiv.appendChild(bubble);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all cards for animation
document.querySelectorAll('.service-card, .news-card, .testimonial-card').forEach(card => {
  card.style.opacity = '0';
  observer.observe(card);
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name') || contactForm.querySelector('input[placeholder="Your Name"]').value,
      email: formData.get('email') || contactForm.querySelector('input[placeholder="Your Email"]').value,
      company: formData.get('company') || contactForm.querySelector('input[placeholder="Company Name"]').value,
      service: contactForm.querySelector('select').value,
      message: contactForm.querySelector('textarea').value,
    };

    try {
      // In production, you would send this to a backend endpoint
      console.log('Contact form submitted:', data);
      alert('Thank you for your message! We will contact you soon.');
      contactForm.reset();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message. Please try again.');
    }
  });
}

// Add typing indicator
function addTypingIndicator() {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', 'bot');

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble');
  bubble.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';

  messageDiv.appendChild(bubble);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return messageDiv;
}

// Particles effect (optional, for visual enhancement)
function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 4 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = `rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2})`;
    particle.style.borderRadius = '50%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.pointerEvents = 'none';
    particle.style.animation = `float ${Math.random() * 10 + 5}s infinite ease-in-out`;

    hero.appendChild(particle);
  }
}

createParticles();

// Parallax effect on scroll
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.hero-visual');

  parallaxElements.forEach(element => {
    element.style.transform = `translateY(${scrolled * 0.5}px)`;
  });
});

// Add CSS for typing indicator
const style = document.createElement('style');
style.textContent = `
  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 5px;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    background: rgba(0, 212, 255, 0.6);
    border-radius: 50%;
    animation: bounce 1.4s infinite;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes bounce {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.6;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
