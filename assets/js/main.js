/*
  GlossGhost JavaScript scaffold.
  Move the inline behavior from GG4index.html into this file when you split the page.
*/

let cart = {};

function toggleCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const isOpened = drawer.classList.contains('translate-x-0');

  if (isOpened) {
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');
    overlay.classList.remove('opacity-100', 'pointer-events-auto');
    overlay.classList.add('opacity-0', 'pointer-events-none');
  } else {
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'pointer-events-auto');
  }
}

function addToCart(id, name, price) {
  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = { id, name, price, qty: 1 };
  }
  updateCartUI();
  toggleCartDrawer();
}

function changeQty(id, delta) {
  if (cart[id]) {
    cart[id].qty += delta;
    if (cart[id].qty <= 0) {
      delete cart[id];
    }
  }
  updateCartUI();
}

function clearCart() {
  cart = {};
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const emptyState = document.getElementById('cart-empty-state');
  const listWrapper = document.getElementById('cart-items-list');
  const checkoutBox = document.getElementById('cart-checkout-box');
  const subtotalText = document.getElementById('cart-subtotal');
  const totalText = document.getElementById('cart-total');

  const items = Object.values(cart);
  let totalQty = 0;
  let subtotal = 0;

  if (items.length === 0) {
    emptyState.classList.remove('hidden');
    listWrapper.classList.add('hidden');
    checkoutBox.classList.add('hidden');
    badge.innerText = '0';
  } else {
    emptyState.classList.add('hidden');
    listWrapper.classList.remove('hidden');
    checkoutBox.classList.remove('hidden');

    listWrapper.innerHTML = '';
    items.forEach(item => {
      totalQty += item.qty;
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'flex items-center justify-between p-4 rounded-2xl bg-brand-card/90 border border-white/5 hover:border-brand-cyan/20 transition-all duration-200';
      itemEl.innerHTML = `
        <div class="flex items-center space-x-4 text-left">
          <div class="w-12 h-12 bg-brand-dark rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXwAAAI6CAYAAAAkDvMmAAEAAElEQVR42uxdd3wU1fb/3jszu5tNTwi9944QUFCkKRYEUTCxI1jA3p5iNwSf4lMsqOgDG/qeLSAqKCIqBAFBmiDSQkkIpPeyfebe3x9TdnazCQR5zd8cP/lINruzM3funHvu93zP9wCWWWaZZZZZZplllllmmWWWWWaZZZZZZplllllmmWWWWWaZZZZZZplllllm2X+hcc4p55xaI2GZZZZZ9u+1jIwMy/9aZplllll2hiN7APjuu+/O+/bbb0foq401MpZZZpll//rIHgCysrJGrF279jyzTz5VE5vz5lmzZgkA2ObNm68jhAQAbC4qKhIAMOt2WGaZZZb960z3tZt/+eXqHr16SAA2LV68uFn+VzydL/Z4PLWcc9m6BZZZZpll/15zu+vrfB7fafnu0/oQpVTgnFtRvWWWWWbZv9lEUaSUQjgt332aDt8adcsss8yy/4jR0/bBp+25GbMCfMsss8yyf7+7ByjOsMPXufbmnyuuuIJyzinRzPxa+I91WyyzzDLLTs9O6n85J5xzOnbs2Gb530YxfEJIpBDeBwAPPPCAz+fxBLT3+P5sg63RnygAzJkzRyGE8HXr1onZ2dksMzOTmW4KmTNnjmB+X2OvZ2Rk0DFjxtDs7OyQ92ZlZQl79+4l/fr14+np6QrnnGRnZwtjx46V9XMZM2YM1X8Pf7/pnPV7yebMmcOzs7OF7OxsAMCYMWMQfu6NTDKify78MxkZGXQMxtBsZCMzM1NR385pdnY2HTt2rGw6bwWAcb1jxoxh2dnZdMyYMcY1a2OJOXPmKNnZ2QYWWVZWxgEgJSWFZGdnI/waAZB169YZ79ePqX83AOjnrv9bv34gG2PHZsrr1q0TAcA0vmK/fv343r17uXmcw8cl/H7qx9GOpXDOYb4W89jp5zdmzBhF+5ug/910fxUAvKn7k5WVJQBA2JgY45mZmSmb58KYMWNQVlbG09PTFf17zOc3Z84c6Pcv0jzQ3omxYzNDrk/7LgWA8VzMmTMHc+bMofo5rFu3TtTvvfme6OfT1LiGj82YMWOUsLFtMHf0+ZKSkkLMr+nn879mTfnf6dOmB1z19fx0/C8Jd3SZmZnshx9+aLdjx45PKysrBR0rIoSAM4XY7A5++PDhTpxz3qdPn3y3y02oQDkhBJQD4IQ7Y50kdejQ+8aPH79NW5H+l/AfioY0JxL+MOpjFf5ZzjnXHVtTn2/kuyJ9d1PvJ7rDO5mz+CNzT/th4U4hwnUG5wrnZ/L7eVOL88kWslM9VmOLYGPXeSqBQ1PndobGybimP3KupxmFkmbMdctOcb4sWbKkXUFBwVK32w1CiIHXc85JlNPp2/3rrnaxsbFil65dC31eD4V2DwghkGUZKSkpdWlpade3a9euPPwekUZupC0/P3+AJEkkEAgYr7tcLjElJUV+951371UUWb7r7rvfLCwsFKOjo+VAIAAJgCwTwkXOvV7vb/379/f/r22jCCHM46nu/tJLCyZER0fX33//Xz4khMjr1q27vaqqav2UKVP2Z2VlCVo0Hve3F/92bcHxAvr4449/3qZNm1LtOK1ffvHlazx+V/0TTzz1KSGknnPeftFbi66S7FLNzTff/DEhxEcpxZdffnnRb7/92nvIkCHHJ0yY9MXPv/7arrKg4BJK6T8nTJjgW7VqVTenw3lBpy6dPuzSpYt306b147755rueZ/XvX3LD9Olf+P1+UEqRlZV1dV5eXus2ndt8d93U60o///zzGysqKvySJDEAjqioqDXXXnvt/khOSJ8UlZWV8Rs3b0w7dvSYGB8fT8aPH7+6TZs2uQBQXVLdbfEH71ykKIHyRx99dBkhhG/YsGG42+3ud/HFF7+7Zs2aPvHx8aPPPvvsJYQQ3/btv3c4" alt="Product" class="w-full h-full object-cover">
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-black text-white tracking-wide uppercase max-w-[200px] truncate">${item.name}</span>
            <span class="text-[10px] text-brand-cyan font-bold mt-1">£${item.price.toFixed(2)}</span>
          </div>
        </div>
        <div class="flex items-center space-x-3 bg-white/5 rounded-xl border border-white/5 px-2.5 py-1">
          <button onclick="changeQty(${item.id}, -1)" class="text-white hover:text-brand-cyan transition-colors text-xs font-bold px-1.5">-</button>
          <span class="text-xs font-black text-white">${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)" class="text-white hover:text-brand-cyan transition-colors text-xs font-bold px-1.5">+</button>
        </div>
      `;
      listWrapper.appendChild(itemEl);
    });

    badge.innerText = totalQty;
    subtotalText.innerText = `£${subtotal.toFixed(2)}`;
    totalText.innerText = `£${subtotal.toFixed(2)}`;
  }
}

function openVideoModal() {
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('watch-video');
  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100', 'pointer-events-auto');

  if (video) {
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Autoplay can be blocked by browser policy until user interacts with controls.
      });
    }
  }
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('watch-video');
  modal.classList.remove('opacity-100', 'pointer-events-auto');
  modal.classList.add('opacity-0', 'pointer-events-none');

  if (video) {
    video.pause();
    video.currentTime = 0;
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}

function openStartupModal() {
  const modal = document.getElementById('startup-modal');
  if (!modal) {
    return;
  }
  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100', 'pointer-events-auto');
}

function closeStartupModal() {
  const modal = document.getElementById('startup-modal');
  if (!modal) {
    return;
  }
  modal.classList.remove('opacity-100', 'pointer-events-auto');
  modal.classList.add('opacity-0', 'pointer-events-none');
}

function jumpToRegisterInterest() {
  closeStartupModal();
  const target = document.getElementById('register-interest');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

async function submitRegisterInterestForm(event) {
  event.preventDefault();

  const form = event.target;
  const emailField = form.querySelector('input[name="email"]');
  const consentField = form.querySelector('input[name="consent"]');
  const honeypotField = form.querySelector('input[name="company"]');
  const submitButton = form.querySelector('button[type="submit"]');

  if (!emailField || !consentField) {
    return;
  }

  if (!consentField.checked) {
    alert('Please provide consent before registering your interest.');
    return;
  }

  if (honeypotField && honeypotField.value.trim() !== '') {
    return;
  }

  const endpoint = form.dataset.endpoint || window.GLOSSGHOST_INTEREST_ENDPOINT || '';
  if (!endpoint || endpoint.includes('REPLACE_WITH_YOUR_FORM_ID')) {
    alert('Endpoint is not configured yet. Replace REPLACE_WITH_YOUR_FORM_ID in the form endpoint before going live.');
    return;
  }

  const formData = new FormData(form);
  formData.set('email', emailField.value.trim());
  formData.set('consent', consentField.checked ? 'yes' : 'no');
  formData.set('consent_text', 'I consent to GlossGhost storing and processing my email to send launch updates.');
  formData.set('submitted_at', new Date().toISOString());
  formData.delete('company');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.classList.add('opacity-70', 'cursor-not-allowed');
    submitButton.textContent = 'SUBMITTING...';
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    form.reset();
    alert('Thanks for registering your interest. Please check your inbox for confirmation (double opt-in).');
  } catch (error) {
    alert('We could not submit your request right now. Please try again shortly or email support@glossghost.com.');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.classList.remove('opacity-70', 'cursor-not-allowed');
      submitButton.textContent = 'REGISTER INTEREST';
    }
  }
}

function runHeadlightFlash() {
  const hero = document.getElementById('home');
  if (!hero) {
    return false;
  }

  const flashVideo = document.getElementById('headlight-flash-video');
  if (!flashVideo) {
    return false;
  }

  hero.classList.remove('headlight-video-play', 'headlight-video-fadeout');

  try {
    if (hero._headlightVideoTimers) {
      hero._headlightVideoTimers.forEach((timerId) => window.clearTimeout(timerId));
    }
    hero._headlightVideoTimers = [];

    flashVideo.pause();
    flashVideo.currentTime = 0;
    void hero.offsetWidth;

    let cleanedUp = false;
    const cleanup = () => {
      if (cleanedUp) {
        return;
      }
      cleanedUp = true;
      if (hero._headlightVideoTimers) {
        hero._headlightVideoTimers.forEach((timerId) => window.clearTimeout(timerId));
        hero._headlightVideoTimers = [];
      }
      hero.classList.remove('headlight-video-play', 'headlight-video-fadeout');
      flashVideo.onended = null;
      flashVideo.pause();
      flashVideo.currentTime = 0;
    };

    const startTimer = window.setTimeout(() => {
      hero.classList.add('headlight-video-play');
    }, 30);
    hero._headlightVideoTimers.push(startTimer);

    const naturalMs = Number.isFinite(flashVideo.duration) && flashVideo.duration > 0
      ? Math.ceil(flashVideo.duration * 1000)
      : 1800;

    const holdMs = Math.min(Math.max(750, naturalMs - 950), 1200);
    const fadeOutMs = 1150;

    const fadeTimer = window.setTimeout(() => {
      hero.classList.add('headlight-video-fadeout');
    }, holdMs);
    hero._headlightVideoTimers.push(fadeTimer);

    const cleanupTimer = window.setTimeout(() => {
      cleanup();
    }, holdMs + fadeOutMs + 120);
    hero._headlightVideoTimers.push(cleanupTimer);

    flashVideo.onended = () => {
      hero.classList.add('headlight-video-fadeout');
      const endCleanupTimer = window.setTimeout(() => {
        cleanup();
      }, 520);
      hero._headlightVideoTimers.push(endCleanupTimer);
    };

    const playPromise = flashVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        cleanup();
      });
    }

    return true;
  } catch (error) {
    hero.classList.remove('headlight-video-play', 'headlight-video-fadeout');
    if (hero._headlightVideoTimers) {
      hero._headlightVideoTimers.forEach((timerId) => window.clearTimeout(timerId));
      hero._headlightVideoTimers = [];
    }
    flashVideo.onended = null;
    flashVideo.pause();
    flashVideo.currentTime = 0;
    return false;
  }
}

function queueHeadlightFlash() {
  let attempts = 0;
  const maxAttempts = 35;

  const tryFlash = () => {
    attempts += 1;
    if (runHeadlightFlash()) {
      return;
    }

    if (attempts < maxAttempts) {
      window.setTimeout(tryFlash, 80);
    }
  };

  window.setTimeout(tryFlash, 80);
}

document.addEventListener('DOMContentLoaded', () => {
  const currentYear = document.getElementById('current-year');
  if (currentYear) {
    currentYear.innerText = new Date().getFullYear();
  }
});

document.addEventListener('sections:loaded', () => {
  queueHeadlightFlash();
});
