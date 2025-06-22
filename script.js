document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const body = document.body;
  const settingsBtn = document.querySelector('.settings-btn');
  const closeBtn = document.querySelector('.close-btn');
  const settingsModal = document.querySelector('.settings-modal');
  const searchBar = document.querySelector('.search-bar');
  const favoritesContainer = document.querySelector('.favorites-container');
  const themeOptions = document.querySelectorAll('.theme-option');
  const timeElement = document.getElementById('time');
  const dateElement = document.getElementById('date');
  const blurSlider = document.getElementById('blur-slider');
  const brightnessSlider = document.getElementById('brightness-slider');
  const overlaySlider = document.getElementById('overlay-slider');
  const blurValue = document.getElementById('blur-value');
  const brightnessValue = document.getElementById('brightness-value');
  const overlayValue = document.getElementById('overlay-value');
  const favoritesEditor = document.getElementById('favorites-editor');
  const addFavoriteBtn = document.getElementById('add-favorite-btn');
  const saveFavoritesBtn = document.getElementById('save-favorites-btn');

  // Default favorites
  const defaultFavorites = [
    { name: 'Google', url: 'https://www.google.com', icon: 'G' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: '▶️' },
    { name: 'GitHub', url: 'https://www.github.com', icon: '{}' },
    { name: 'Twitter', url: 'https://www.twitter.com', icon: '𝕏' },
    { name: 'Reddit', url: 'https://www.reddit.com', icon: 'R' },
    { name: 'Apple', url: 'https://www.apple.com', icon: '🍏' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org', icon: 'W' },
    { name: 'Gmail', url: 'https://mail.google.com', icon: '✉️' },
    { name: 'Netflix', url: 'https://www.netflix.com', icon: 'N' },
    { name: 'Spotify', url: 'https://www.spotify.com', icon: '♫' },
    { name: 'Amazon', url: 'https://www.amazon.com', icon: 'A' },
    { name: 'Drive', url: 'https://drive.google.com', icon: '⛁' }
  ];

  // Initialize
  initTheme();
  loadBackgroundSettings();
  loadFavorites();
  setupEventListeners();
  updateTime();
  setInterval(updateTime, 1000);

  // Set random background
  setRandomBackground();

  // Functions
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    themeOptions.forEach(option => {
      option.classList.remove('active');
      if (option.dataset.theme === savedTheme) {
        option.classList.add('active');
      }
    });
  }

  function setTheme(theme) {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    
    body.className = theme;
    localStorage.setItem('theme', theme);
  }

  function setRandomBackground() {
    const bgImageUrl = 'https://picsum.photos/1920/1080?random=' + Date.now();
    body.style.backgroundImage = `url(${bgImageUrl})`;
  }

  function loadBackgroundSettings() {
    const blur = localStorage.getItem('bgBlur') || '5';
    const brightness = localStorage.getItem('bgBrightness') || '80';
    const overlay = localStorage.getItem('bgOverlay') || '40';

    blurSlider.value = blur;
    brightnessSlider.value = brightness;
    overlaySlider.value = overlay;

    blurValue.textContent = `${blur}px`;
    brightnessValue.textContent = `${brightness}%`;
    overlayValue.textContent = `${overlay}%`;

    applyBackgroundSettings(blur, brightness, overlay);
  }

  function applyBackgroundSettings(blur, brightness, overlay) {
    document.documentElement.style.setProperty('--overlay-light', `rgba(255, 255, 255, ${overlay/100})`);
    document.documentElement.style.setProperty('--overlay-dark', `rgba(0, 0, 0, ${overlay/100})`);
    body.style.backdropFilter = `blur(${blur}px) brightness(${brightness}%)`;
  }

  function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || defaultFavorites;
    renderFavorites(favorites);
    renderFavoritesEditor(favorites);
  }

  function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites(favorites);
  }

  function renderFavorites(favorites) {
    favoritesContainer.innerHTML = '';
    
    favorites.forEach((fav, index) => {
      const favoriteItem = document.createElement('a');
      favoriteItem.className = `favorite-item fade-in delayed-${index % 4}`;
      favoriteItem.href = fav.url;
      favoriteItem.title = fav.name;
      
      favoriteItem.innerHTML = `
        <div class="favorite-icon">${fav.icon}</div>
        <div class="favorite-name">${fav.name}</div>
      `;
      
      favoriteItem.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: fav.url });
      });
      
      favoritesContainer.appendChild(favoriteItem);
    });
  }

  function renderFavoritesEditor(favorites) {
    favoritesEditor.innerHTML = '';
    
    favorites.forEach((fav, index) => {
      const favItem = document.createElement('div');
      favItem.className = 'favorite-editor-item';
      favItem.style.animationDelay = `${index * 0.05}s`;
      
      favItem.innerHTML = `
        <input type="text" class="fav-icon-input" value="${fav.icon}" placeholder="🎯" maxlength="2">
        <input type="text" class="fav-name-input" value="${fav.name}" placeholder="Name">
        <input type="text" class="fav-url-input" value="${fav.url}" placeholder="https://example.com">
        <button class="remove-fav-btn" data-index="${index}">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      `;
      
      favoritesEditor.appendChild(favItem);
      
      setTimeout(() => {
        favItem.style.animation = 'fadeInSlide 0.3s ease forwards';
      }, 10);
    });
  }

  function updateTime() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    
    timeElement.textContent = now.toLocaleTimeString([], timeOptions);
    dateElement.textContent = now.toLocaleDateString([], dateOptions);
  }

  function debounce(func, wait) {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }

  function generateIconFromUrl(url) {
    if (!url) return '🔗';
    
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      const cleanDomain = domain.replace('www.', '').split('.')[0];
      
      const specialIcons = {
        'youtube': '▶️',
        'google': 'G',
        'github': '{}',
        'twitter': '𝕏',
        'reddit': 'R',
        'apple': '🍏',
        'wikipedia': 'W',
        'gmail': '✉️',
        'netflix': 'N',
        'spotify': '♫',
        'amazon': 'A',
        'drive': '⛁'
      };
      
      for (const [key, icon] of Object.entries(specialIcons)) {
        if (cleanDomain.includes(key)) {
          return icon;
        }
      }
      
      return cleanDomain.charAt(0).toUpperCase();
    } catch {
      return '🔗';
    }
  }

  function collectFavoriteData() {
    const favItems = document.querySelectorAll('.favorite-editor-item');
    const favorites = [];
    
    favItems.forEach(item => {
      const nameInput = item.querySelector('.fav-name-input');
      const urlInput = item.querySelector('.fav-url-input');
      const iconInput = item.querySelector('.fav-icon-input');
      
      const name = nameInput.value.trim();
      let url = urlInput.value.trim();
      let icon = iconInput.value.trim();
      
      if (!name && !url) return;
      
      if (url && !url.match(/^https?:\/\//)) {
        url = `https://${url}`;
        urlInput.value = url;
      }
      
      if (!icon) {
        icon = url ? generateIconFromUrl(url) : (name.charAt(0) || '🔗');
        iconInput.value = icon;
      }
      
      if (name && url) {
        favorites.push({ name, url, icon });
      }
    });
    
    return favorites;
  }

  function validateUrlInput(input) {
    const url = input.value.trim();
    if (url && !url.includes('.')) {
      input.classList.add('invalid');
    } else {
      input.classList.remove('invalid');
    }
  }

  function showSaveConfirmation() {
    const confirmation = document.createElement('div');
    confirmation.className = 'save-confirmation';
    confirmation.textContent = 'Saved!';
    settingsModal.appendChild(confirmation);
    
    setTimeout(() => {
      confirmation.classList.add('fade-out');
      setTimeout(() => confirmation.remove(), 300);
    }, 1500);
  }

  function setupEventListeners() {
    // Settings modal toggle
    settingsBtn.addEventListener('click', () => {
      settingsModal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      settingsModal.classList.remove('active');
    });

    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.remove('active');
      }
    });

    // Theme selection
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        setTheme(option.dataset.theme);
      });
    });

    // Search functionality
    searchBar.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchBar.value.trim();
        if (query) {
          if (query.includes('.') && !query.includes(' ')) {
            const url = query.startsWith('http') ? query : `https://${query}`;
            chrome.tabs.create({ url });
          } else {
            chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(query)}` });
          }
        }
      }
    });

    // Background sliders
    blurSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      blurValue.textContent = `${value}px`;
      localStorage.setItem('bgBlur', value);
      applyBackgroundSettings(value, brightnessSlider.value, overlaySlider.value);
    });

    brightnessSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      brightnessValue.textContent = `${value}%`;
      localStorage.setItem('bgBrightness', value);
      applyBackgroundSettings(blurSlider.value, value, overlaySlider.value);
    });

    overlaySlider.addEventListener('input', (e) => {
      const value = e.target.value;
      overlayValue.textContent = `${value}%`;
      localStorage.setItem('bgOverlay', value);
      applyBackgroundSettings(blurSlider.value, brightnessSlider.value, value);
    });

    // Add new favorite button
    addFavoriteBtn.addEventListener('click', () => {
      const newItem = document.createElement('div');
      newItem.className = 'favorite-editor-item';
      
      newItem.innerHTML = `
        <input type="text" class="fav-icon-input" placeholder="🎯" maxlength="2">
        <input type="text" class="fav-name-input" placeholder="Name">
        <input type="text" class="fav-url-input" placeholder="https://example.com">
        <button class="remove-fav-btn">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      `;
      
      favoritesEditor.appendChild(newItem);
      setTimeout(() => {
        newItem.querySelector('.fav-name-input').focus();
      }, 10);
    });

    // Remove favorite button
    favoritesEditor.addEventListener('click', (e) => {
      if (e.target.closest('.remove-fav-btn')) {
        const item = e.target.closest('.favorite-editor-item');
        item.style.animation = 'fadeOutSlide 0.3s ease forwards';
        
        setTimeout(() => {
          item.remove();
          const updatedFavorites = collectFavoriteData();
          saveFavorites(updatedFavorites);
        }, 300);
      }
    });

    // Auto-save on input changes
    favoritesEditor.addEventListener('input', debounce(() => {
      const updatedFavorites = collectFavoriteData();
      saveFavorites(updatedFavorites);
    }, 500));

    // URL validation
    favoritesEditor.addEventListener('input', (e) => {
      if (e.target.classList.contains('fav-url-input')) {
        validateUrlInput(e.target);
        
        const item = e.target.closest('.favorite-editor-item');
        const iconInput = item.querySelector('.fav-icon-input');
        const url = e.target.value.trim();
        
        if (!iconInput.value || ['🔗', '⭐', '★', '✩'].includes(iconInput.value)) {
          iconInput.value = generateIconFromUrl(url);
        }
      }
    });

    // Manual save button
    if (saveFavoritesBtn) {
      saveFavoritesBtn.addEventListener('click', () => {
        const updatedFavorites = collectFavoriteData();
        saveFavorites(updatedFavorites);
        showSaveConfirmation();
      });
    }
  }
});