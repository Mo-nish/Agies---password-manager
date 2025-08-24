/**
 * Agies Icon Service
 * Provides default icons for vault creation and management
 */

class IconService {
  constructor() {
    this.defaultIcons = [
      // Personal icons
      { id: 'personal-home', emoji: '🏠', category: 'personal', name: 'Home' },
      { id: 'personal-user', emoji: '👤', category: 'personal', name: 'Personal' },
      { id: 'personal-heart', emoji: '❤️', category: 'personal', name: 'Personal Data' },
      { id: 'personal-lock', emoji: '🔒', category: 'personal', name: 'Private' },

      // Work icons
      { id: 'work-briefcase', emoji: '💼', category: 'work', name: 'Work' },
      { id: 'work-office', emoji: '🏢', category: 'work', name: 'Office' },
      { id: 'work-computer', emoji: '💻', category: 'work', name: 'Computer' },
      { id: 'work-network', emoji: '🌐', category: 'work', name: 'Network' },
      { id: 'work-email', emoji: '📧', category: 'work', name: 'Email' },

      // Family icons
      { id: 'family-home', emoji: '👨‍👩‍👧‍👦', category: 'family', name: 'Family' },
      { id: 'family-heart', emoji: '💝', category: 'family', name: 'Family Love' },
      { id: 'family-house', emoji: '🏡', category: 'family', name: 'Family Home' },

      // Shared icons
      { id: 'shared-group', emoji: '👥', category: 'shared', name: 'Shared' },
      { id: 'shared-network', emoji: '🔗', category: 'shared', name: 'Shared Network' },
      { id: 'shared-team', emoji: '🤝', category: 'shared', name: 'Team' },

      // Business icons
      { id: 'business-building', emoji: '🏢', category: 'business', name: 'Business' },
      { id: 'business-money', emoji: '💰', category: 'business', name: 'Finance' },
      { id: 'business-chart', emoji: '📊', category: 'business', name: 'Analytics' },
      { id: 'business-handshake', emoji: '🤝', category: 'business', name: 'Business Deal' },

      // Security icons
      { id: 'security-shield', emoji: '🛡️', category: 'security', name: 'Security' },
      { id: 'security-lock', emoji: '🔐', category: 'security', name: 'Encrypted' },
      { id: 'security-key', emoji: '🔑', category: 'security', name: 'Keys' },
      { id: 'security-fingerprint', emoji: '👆', category: 'security', name: 'Biometric' },

      // Finance icons
      { id: 'finance-bank', emoji: '🏦', category: 'finance', name: 'Bank' },
      { id: 'finance-credit', emoji: '💳', category: 'finance', name: 'Credit Card' },
      { id: 'finance-money', emoji: '💵', category: 'finance', name: 'Money' },
      { id: 'finance-investment', emoji: '📈', category: 'finance', name: 'Investment' },

      // Social icons
      { id: 'social-facebook', emoji: '📘', category: 'social', name: 'Facebook' },
      { id: 'social-twitter', emoji: '🐦', category: 'social', name: 'Twitter' },
      { id: 'social-instagram', emoji: '📷', category: 'social', name: 'Instagram' },
      { id: 'social-linkedin', emoji: '💼', category: 'social', name: 'LinkedIn' },

      // Entertainment icons
      { id: 'entertainment-game', emoji: '🎮', category: 'entertainment', name: 'Gaming' },
      { id: 'entertainment-music', emoji: '🎵', category: 'entertainment', name: 'Music' },
      { id: 'entertainment-movie', emoji: '🎬', category: 'entertainment', name: 'Movies' },
      { id: 'entertainment-book', emoji: '📚', category: 'entertainment', name: 'Books' },

      // Development icons
      { id: 'dev-code', emoji: '💻', category: 'development', name: 'Development' },
      { id: 'dev-server', emoji: '🖥️', category: 'development', name: 'Server' },
      { id: 'dev-database', emoji: '🗄️', category: 'development', name: 'Database' },
      { id: 'dev-cloud', emoji: '☁️', category: 'development', name: 'Cloud' },

      // Travel icons
      { id: 'travel-plane', emoji: '✈️', category: 'travel', name: 'Travel' },
      { id: 'travel-car', emoji: '🚗', category: 'travel', name: 'Car Rental' },
      { id: 'travel-hotel', emoji: '🏨', category: 'travel', name: 'Hotel' },
      { id: 'travel-passport', emoji: '🛂', category: 'travel', name: 'Passport' },

      // Health icons
      { id: 'health-medical', emoji: '⚕️', category: 'health', name: 'Medical' },
      { id: 'health-fitness', emoji: '💪', category: 'health', name: 'Fitness' },
      { id: 'health-heart', emoji: '❤️', category: 'health', name: 'Health' },

      // Education icons
      { id: 'education-school', emoji: '🎓', category: 'education', name: 'Education' },
      { id: 'education-book', emoji: '📖', category: 'education', name: 'Study' },
      { id: 'education-graduation', emoji: '🎓', category: 'education', name: 'Graduation' },

      // Shopping icons
      { id: 'shopping-cart', emoji: '🛒', category: 'shopping', name: 'Shopping' },
      { id: 'shopping-amazon', emoji: '📦', category: 'shopping', name: 'Online Shopping' },
      { id: 'shopping-store', emoji: '🏪', category: 'shopping', name: 'Store' },

      // Communication icons
      { id: 'comm-email', emoji: '📧', category: 'communication', name: 'Email' },
      { id: 'comm-phone', emoji: '📱', category: 'communication', name: 'Phone' },
      { id: 'comm-chat', emoji: '💬', category: 'communication', name: 'Chat' },
      { id: 'comm-video', emoji: '📹', category: 'communication', name: 'Video Call' },

      // Utility icons
      { id: 'utility-tools', emoji: '🔧', category: 'utility', name: 'Tools' },
      { id: 'utility-settings', emoji: '⚙️', category: 'utility', name: 'Settings' },
      { id: 'utility-help', emoji: '❓', category: 'utility', name: 'Help' },
      { id: 'utility-info', emoji: 'ℹ️', category: 'utility', name: 'Information' }
    ];

    this.categories = this.getUniqueCategories();
  }

  getAllIcons() {
    return this.defaultIcons;
  }

  getIconsByCategory(category) {
    if (category === 'all') {
      return this.defaultIcons;
    }
    return this.defaultIcons.filter(icon => icon.category === category);
  }

  getIconById(id) {
    return this.defaultIcons.find(icon => icon.id === id);
  }

  getUniqueCategories() {
    const categories = [...new Set(this.defaultIcons.map(icon => icon.category))];
    return categories.sort();
  }

  searchIcons(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.defaultIcons.filter(icon =>
      icon.name.toLowerCase().includes(lowercaseQuery) ||
      icon.emoji.includes(query) ||
      icon.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  getRandomIcon(category = null) {
    const icons = category ? this.getIconsByCategory(category) : this.defaultIcons;
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
  }

  // Create icon element for UI
  createIconElement(icon, options = {}) {
    const {
      size = 'medium',
      selected = false,
      clickable = true
    } = options;

    const sizeClasses = {
      small: 'h-8 w-8',
      medium: 'h-10 w-10',
      large: 'h-12 w-12'
    };

    const baseClasses = [
      sizeClasses[size],
      'rounded-lg',
      'flex',
      'items-center',
      'justify-center',
      'border-2',
      'transition-all',
      'duration-200',
      'icon-option'
    ];

    const selectedClasses = selected ?
      ['border-purple-500', 'bg-purple-600', 'text-white'] :
      ['border-gray-600', 'bg-gray-700', 'text-gray-300', 'hover:border-purple-400', 'hover:bg-gray-600'];

    const clickableClasses = clickable ? ['cursor-pointer'] : [];

    const allClasses = [...baseClasses, ...selectedClasses, ...clickableClasses].join(' ');

    return `
      <div class="${allClasses}"
           data-icon-id="${icon.id}"
           title="${icon.name}">
        <span class="text-xl">${icon.emoji}</span>
      </div>
    `;
  }

  // Create icon grid for selection
  createIconGrid(icons, options = {}) {
    const {
      columns = 5,
      selectedIconId = '',
      showCategories = false
    } = options;

    let html = `<div class="grid grid-cols-${columns} gap-3">`;

    if (icons.length === 0) {
      html += `
        <div class="col-span-${columns} text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">🔍</div>
          <p>No icons found</p>
        </div>
      `;
    } else {
      icons.forEach(icon => {
        const selected = icon.id === selectedIconId;
        html += this.createIconElement(icon, { selected, clickable: true });
      });
    }

    html += '</div>';

    if (showCategories && icons.length > 0) {
      html += this.createCategoryFilter();
    }

    return html;
  }

  createCategoryFilter() {
    const categories = this.categories;
    let html = `
      <div class="mt-4 border-t border-gray-600 pt-4">
        <label class="block text-sm font-medium text-gray-300 mb-2">Filter by Category:</label>
        <div class="flex flex-wrap gap-2">
    `;

    html += `
      <button class="px-3 py-1 bg-purple-600 text-white rounded-full text-sm category-filter active"
              data-category="all">All</button>
    `;

    categories.forEach(category => {
      const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
      html += `
        <button class="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm category-filter hover:bg-gray-600"
                data-category="${category}">${capitalizedCategory}</button>
      `;
    });

    html += '</div></div>';

    return html;
  }

  // Get icon data for storage
  getIconData(iconId) {
    const icon = this.getIconById(iconId);
    if (!icon) return null;

    return {
      id: icon.id,
      emoji: icon.emoji,
      name: icon.name,
      category: icon.category
    };
  }

  // Validate icon ID
  isValidIconId(iconId) {
    return this.defaultIcons.some(icon => icon.id === iconId);
  }

  // Get default icon for category
  getDefaultIconForCategory(category) {
    const categoryIcons = this.getIconsByCategory(category);
    return categoryIcons.length > 0 ? categoryIcons[0] : this.getRandomIcon();
  }
}

// Export for global use
if (typeof window !== 'undefined') {
  window.IconService = IconService;
}

// Initialize default icon service
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
      window.iconService = new IconService();
    }
  });
}
