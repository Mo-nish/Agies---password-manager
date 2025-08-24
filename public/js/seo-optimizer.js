/**
 * Agies SEO Optimization System
 * Comprehensive SEO tools for better search engine rankings
 */

class AgiesSEOOptimizer {
    constructor() {
        this.isInitialized = false;
        this.keywords = new Map();
        this.metaTags = new Map();
        this.structuredData = new Map();
        this.sitemapData = [];
        this.init();
    }

    async init() {
        try {
            await this.loadKeywords();
            await this.setupMetaTags();
            await this.setupStructuredData();
            await this.generateSitemap();
            await this.optimizeContent();
            this.isInitialized = true;
            console.log('✅ SEO Optimizer initialized successfully');
        } catch (error) {
            console.error('❌ SEO optimization failed:', error);
        }
    }

    // Load target keywords
    async loadKeywords() {
        this.keywords.set('primary', [
            'password manager',
            'enterprise password management',
            'team password manager',
            'secure password storage',
            'business password manager',
            'password security',
            'password vault',
            'password sharing',
            '2FA password manager',
            'AI password security'
        ]);

        this.keywords.set('secondary', [
            'password generator',
            'password autofill',
            'dark web monitoring',
            'SSO integration',
            'team collaboration',
            'password compliance',
            'SOC 2 password manager',
            'GDPR password manager',
            'enterprise security',
            'zero-knowledge encryption'
        ]);

        this.keywords.set('longtail', [
            'best password manager for business',
            'secure password manager for teams',
            'enterprise password management solution',
            'password manager with AI security',
            'team password sharing software',
            'business password vault solution',
            'secure password storage for companies',
            'password manager with SSO',
            'compliance password manager',
            'enterprise-grade password security'
        ]);

        console.log('✅ Keywords loaded:', this.keywords.size, 'categories');
    }

    // Setup meta tags
    async setupMetaTags() {
        // Page-specific meta tags
        this.metaTags.set('homepage', {
            title: 'Agies Password Manager - Enterprise Security Made Simple | Start Free Trial',
            description: 'Join 10,000+ organizations using Agies Password Manager. Military-grade encryption, AI-powered threat detection, team collaboration, and 99.99% uptime. Start free trial today.',
            keywords: 'password manager, enterprise security, team collaboration, AI security, business password management',
            ogTitle: 'Agies Password Manager - Enterprise Security Made Simple',
            ogDescription: 'Protect your organization with military-grade encryption, AI-powered threat detection, and seamless team collaboration.',
            ogImage: 'https://agies-password-manager.vercel.app/assets/og-image.png',
            ogUrl: 'https://agies-password-manager.vercel.app',
            twitterCard: 'summary_large_image',
            canonical: 'https://agies-password-manager.vercel.app'
        });

        this.metaTags.set('pricing', {
            title: 'Pricing - Agies Password Manager | Enterprise Security Plans',
            description: 'Choose the perfect Agies plan for your organization. From free personal use to enterprise solutions with AI security, team management, and 24/7 support.',
            keywords: 'password manager pricing, enterprise password management cost, team password manager plans, business password security pricing',
            ogTitle: 'Agies Password Manager Pricing - Enterprise Security Plans',
            ogDescription: 'Simple, transparent pricing for enterprise password management. Start free, scale as you grow.',
            ogImage: 'https://agies-password-manager.vercel.app/assets/pricing-og.png',
            ogUrl: 'https://agies-password-manager.vercel.app/pricing.html',
            twitterCard: 'summary_large_image',
            canonical: 'https://agies-password-manager.vercel.app/pricing.html'
        });

        this.metaTags.set('demo', {
            title: 'Agies Password Manager - Professional Demo | See Features in Action',
            description: 'Experience the power of Agies Password Manager - Enterprise-grade security, AI-powered protection, and seamless cross-platform synchronization.',
            keywords: 'password manager demo, enterprise password management demo, team password manager features, AI security demo',
            ogTitle: 'Agies Password Manager - Professional Demo',
            ogDescription: 'See enterprise-grade password security in action. Try all features with our interactive demo.',
            ogImage: 'https://agies-password-manager.vercel.app/assets/demo-og.png',
            ogUrl: 'https://agies-password-manager.vercel.app/demo.html',
            twitterCard: 'summary_large_image',
            canonical: 'https://agies-password-manager.vercel.app/demo.html'
        });

        console.log('✅ Meta tags configured for', this.metaTags.size, 'pages');
    }

    // Setup structured data
    async setupStructuredData() {
        // Organization structured data
        this.structuredData.set('organization', {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Agies Password Manager",
            "url": "https://agies-password-manager.vercel.app",
            "logo": "https://agies-password-manager.vercel.app/assets/logo.png",
            "description": "Enterprise-grade password management with AI-powered security, zero-knowledge encryption, and military-grade protection.",
            "foundingDate": "2024",
            "sameAs": [
                "https://twitter.com/agiespassword",
                "https://linkedin.com/company/agies-password-manager",
                "https://github.com/agies-password-manager"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-800-AGIES-01",
                "contactType": "customer service",
                "email": "support@agies.com",
                "availableLanguage": "English"
            },
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "US",
                "addressLocality": "San Francisco",
                "addressRegion": "CA"
            }
        });

        // Software application structured data
        this.structuredData.set('software', {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Agies Password Manager",
            "applicationCategory": "SecurityApplication",
            "operatingSystem": "Web, iOS, Android, Windows, macOS, Linux",
            "description": "Enterprise password management solution with AI-powered security, team collaboration, and cross-platform synchronization.",
            "url": "https://agies-password-manager.vercel.app",
            "downloadUrl": "https://agies-password-manager.vercel.app/download",
            "softwareVersion": "1.0.0",
            "releaseNotes": "Initial release with enterprise features",
            "featureList": [
                "Military-grade encryption",
                "AI-powered threat detection",
                "Team collaboration",
                "Cross-platform sync",
                "SSO integration",
                "Dark web monitoring"
            ],
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free plan available"
            }
        });

        // Product structured data
        this.structuredData.set('product', {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Agies Password Manager",
            "description": "Enterprise-grade password management solution",
            "brand": {
                "@type": "Brand",
                "name": "Agies"
            },
            "category": "Password Management Software",
            "url": "https://agies-password-manager.vercel.app",
            "image": "https://agies-password-manager.vercel.app/assets/product.png",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "1250"
            },
            "offers": [
                {
                    "@type": "Offer",
                    "name": "Personal Plan",
                    "price": "0",
                    "priceCurrency": "USD",
                    "description": "Free forever plan"
                },
                {
                    "@type": "Offer",
                    "name": "Premium Plan",
                    "price": "3",
                    "priceCurrency": "USD",
                    "description": "Premium features monthly"
                },
                {
                    "@type": "Offer",
                    "name": "Business Plan",
                    "price": "8",
                    "priceCurrency": "USD",
                    "description": "Enterprise features monthly"
                }
            ]
        });

        console.log('✅ Structured data configured for', this.structuredData.size, 'types');
    }

    // Generate sitemap data
    async generateSitemap() {
        this.sitemapData = [
            {
                url: 'https://agies-password-manager.vercel.app/',
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: '1.0'
            },
            {
                url: 'https://agies-password-manager.vercel.app/demo.html',
                lastmod: new Date().toISOString(),
                changefreq: 'weekly',
                priority: '0.9'
            },
            {
                url: 'https://agies-password-manager.vercel.app/pricing.html',
                lastmod: new Date().toISOString(),
                changefreq: 'weekly',
                priority: '0.8'
            },
            {
                url: 'https://agies-password-manager.vercel.app/marketing.html',
                lastmod: new Date().toISOString(),
                changefreq: 'weekly',
                priority: '0.7'
            },
            {
                url: 'https://agies-password-manager.vercel.app/onboarding.html',
                lastmod: new Date().toISOString(),
                changefreq: 'monthly',
                priority: '0.6'
            },
            {
                url: 'https://agies-password-manager.vercel.app/dashboard-working.html',
                lastmod: new Date().toISOString(),
                changefreq: 'monthly',
                priority: '0.5'
            },
            {
                url: 'https://agies-password-manager.vercel.app/security-dashboard-working.html',
                lastmod: new Date().toISOString(),
                changefreq: 'monthly',
                priority: '0.5'
            }
        ];

        console.log('✅ Sitemap data generated for', this.sitemapData.length, 'pages');
    }

    // Optimize page content
    async optimizeContent() {
        const currentPage = this.getCurrentPage();
        const metaData = this.metaTags.get(currentPage);
        
        if (metaData) {
            this.updateMetaTags(metaData);
            this.updateStructuredData(currentPage);
            this.optimizeHeadings();
            this.optimizeImages();
            this.addInternalLinks();
            this.optimizeContentStructure();
        }

        console.log('✅ Content optimization complete for:', currentPage);
    }

    // Get current page identifier
    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'homepage';
        if (path.includes('pricing')) return 'pricing';
        if (path.includes('demo')) return 'demo';
        if (path.includes('marketing')) return 'marketing';
        if (path.includes('onboarding')) return 'onboarding';
        if (path.includes('dashboard')) return 'dashboard';
        if (path.includes('security')) return 'security';
        return 'homepage';
    }

    // Update meta tags
    updateMetaTags(metaData) {
        // Update title
        if (metaData.title) {
            document.title = metaData.title;
        }

        // Update meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = metaData.description;

        // Update keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = metaData.keywords;

        // Update Open Graph tags
        this.updateOpenGraphTags(metaData);

        // Update Twitter Card tags
        this.updateTwitterCardTags(metaData);

        // Update canonical URL
        this.updateCanonicalUrl(metaData.canonical);
    }

    // Update Open Graph tags
    updateOpenGraphTags(metaData) {
        const ogTags = [
            { property: 'og:title', content: metaData.ogTitle },
            { property: 'og:description', content: metaData.ogDescription },
            { property: 'og:image', content: metaData.ogImage },
            { property: 'og:url', content: metaData.ogUrl },
            { property: 'og:type', content: 'website' },
            { property: 'og:site_name', content: 'Agies Password Manager' }
        ];

        ogTags.forEach(tag => {
            let element = document.querySelector(`meta[property="${tag.property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', tag.property);
                document.head.appendChild(element);
            }
            element.content = tag.content;
        });
    }

    // Update Twitter Card tags
    updateTwitterCardTags(metaData) {
        const twitterTags = [
            { name: 'twitter:card', content: metaData.twitterCard },
            { name: 'twitter:title', content: metaData.ogTitle },
            { name: 'twitter:description', content: metaData.ogDescription },
            { name: 'twitter:image', content: metaData.ogImage }
        ];

        twitterTags.forEach(tag => {
            let element = document.querySelector(`meta[name="${tag.name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.name = tag.name;
                document.head.appendChild(element);
            }
            element.content = tag.content;
        });
    }

    // Update canonical URL
    updateCanonicalUrl(canonicalUrl) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;
    }

    // Update structured data
    updateStructuredData(pageType) {
        // Remove existing structured data
        const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
        existingScripts.forEach(script => script.remove());

        // Add organization structured data to all pages
        this.addStructuredData(this.structuredData.get('organization'));

        // Add page-specific structured data
        if (pageType === 'homepage' || pageType === 'pricing') {
            this.addStructuredData(this.structuredData.get('product'));
        }

        if (pageType === 'homepage') {
            this.addStructuredData(this.structuredData.get('software'));
        }
    }

    // Add structured data script
    addStructuredData(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data, null, 2);
        document.head.appendChild(script);
    }

    // Optimize headings for SEO
    optimizeHeadings() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const keywords = this.keywords.get('primary').concat(this.keywords.get('secondary'));

        headings.forEach((heading, index) => {
            // Ensure proper heading hierarchy
            if (index === 0 && heading.tagName !== 'H1') {
                heading.outerHTML = heading.outerHTML.replace(
                    heading.tagName.toLowerCase(),
                    'h1'
                );
            }

            // Add relevant keywords to headings where appropriate
            const headingText = heading.textContent.toLowerCase();
            const relevantKeywords = keywords.filter(keyword => 
                headingText.includes(keyword.toLowerCase())
            );

            if (relevantKeywords.length > 0) {
                heading.setAttribute('data-seo-keywords', relevantKeywords.join(', '));
            }
        });
    }

    // Optimize images for SEO
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add alt text if missing
            if (!img.alt) {
                const context = this.getImageContext(img);
                img.alt = `Agies Password Manager - ${context}`;
            }

            // Add loading="lazy" for better performance
            if (!img.loading) {
                img.loading = 'lazy';
            }

            // Add width and height attributes if missing
            if (!img.width && !img.height) {
                img.width = '800';
                img.height = '600';
            }
        });
    }

    // Get image context for alt text
    getImageContext(img) {
        const parent = img.parentElement;
        if (parent) {
            const heading = parent.querySelector('h1, h2, h3, h4, h5, h6');
            if (heading) {
                return heading.textContent;
            }
        }
        return 'Enterprise Password Security';
    }

    // Add internal links for better SEO
    addInternalLinks() {
        const content = document.querySelector('main, .content, .container');
        if (!content) return;

        const keywords = this.keywords.get('longtail');
        const internalPages = [
            { url: '/pricing.html', anchor: 'pricing plans' },
            { url: '/demo.html', anchor: 'live demo' },
            { url: '/marketing.html', anchor: 'features' },
            { url: '/onboarding.html', anchor: 'getting started' }
        ];

        // Add internal links where relevant
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            content.innerHTML = content.innerHTML.replace(regex, (match) => {
                const relevantPage = internalPages.find(page => 
                    page.anchor.toLowerCase().includes(keyword.toLowerCase()) ||
                    keyword.toLowerCase().includes(page.anchor.toLowerCase())
                );
                
                if (relevantPage) {
                    return `<a href="${relevantPage.url}" class="internal-link">${match}</a>`;
                }
                return match;
            });
        });
    }

    // Optimize content structure
    optimizeContentStructure() {
        // Add schema markup for better understanding
        const mainContent = document.querySelector('main, .content, .container');
        if (mainContent) {
            mainContent.setAttribute('itemscope', '');
            mainContent.setAttribute('itemtype', 'https://schema.org/WebPage');
        }

        // Add breadcrumb navigation if not present
        this.addBreadcrumbs();

        // Add related content section
        this.addRelatedContent();
    }

    // Add breadcrumb navigation
    addBreadcrumbs() {
        if (document.querySelector('.breadcrumbs')) return;

        const breadcrumbs = document.createElement('nav');
        breadcrumbs.className = 'breadcrumbs';
        breadcrumbs.setAttribute('aria-label', 'Breadcrumb');

        const currentPage = this.getCurrentPage();
        const breadcrumbData = [
            { name: 'Home', url: '/' },
            { name: this.getPageTitle(currentPage), url: window.location.pathname }
        ];

        breadcrumbs.innerHTML = breadcrumbData.map((item, index) => {
            if (index === breadcrumbData.length - 1) {
                return `<span aria-current="page">${item.name}</span>`;
            }
            return `<a href="${item.url}">${item.name}</a>`;
        }).join(' / ');

        // Insert breadcrumbs at the top of main content
        const mainContent = document.querySelector('main, .content, .container');
        if (mainContent) {
            mainContent.insertBefore(breadcrumbs, mainContent.firstChild);
        }
    }

    // Get page title for breadcrumbs
    getPageTitle(pageType) {
        const titles = {
            'homepage': 'Home',
            'pricing': 'Pricing',
            'demo': 'Demo',
            'marketing': 'Features',
            'onboarding': 'Getting Started',
            'dashboard': 'Dashboard',
            'security': 'Security Center'
        };
        return titles[pageType] || 'Page';
    }

    // Add related content section
    addRelatedContent() {
        if (document.querySelector('.related-content')) return;

        const relatedContent = document.createElement('section');
        relatedContent.className = 'related-content';
        relatedContent.innerHTML = `
            <h2>Related Resources</h2>
            <div class="related-links">
                <a href="/demo.html" class="related-link">
                    <h3>Live Demo</h3>
                    <p>Experience Agies features in action</p>
                </a>
                <a href="/pricing.html" class="related-link">
                    <h3>Pricing Plans</h3>
                    <p>Choose the right plan for your needs</p>
                </a>
                <a href="/marketing.html" class="related-link">
                    <h3>Feature Overview</h3>
                    <p>Learn about our security features</p>
                </a>
            </div>
        `;

        // Add to end of main content
        const mainContent = document.querySelector('main, .content, .container');
        if (mainContent) {
            mainContent.appendChild(relatedContent);
        }
    }

    // Generate sitemap XML
    generateSitemapXML() {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        this.sitemapData.forEach(item => {
            xml += '  <url>\n';
            xml += `    <loc>${item.url}</loc>\n`;
            xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
            xml += `    <priority>${item.priority}</priority>\n`;
            xml += '  </url>\n';
        });
        
        xml += '</urlset>';
        return xml;
    }

    // Download sitemap
    downloadSitemap() {
        const xml = this.generateSitemapXML();
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Get SEO score for current page
    getSEOScore() {
        let score = 100;
        const issues = [];

        // Check title length
        const title = document.title;
        if (title.length < 30 || title.length > 60) {
            score -= 10;
            issues.push('Title length should be between 30-60 characters');
        }

        // Check meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc || metaDesc.content.length < 120 || metaDesc.content.length > 160) {
            score -= 10;
            issues.push('Meta description should be between 120-160 characters');
        }

        // Check headings structure
        const h1s = document.querySelectorAll('h1');
        if (h1s.length !== 1) {
            score -= 15;
            issues.push('Page should have exactly one H1 heading');
        }

        // Check images without alt text
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        if (imagesWithoutAlt.length > 0) {
            score -= 5 * imagesWithoutAlt.length;
            issues.push(`${imagesWithoutAlt.length} images missing alt text`);
        }

        // Check internal links
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="."]');
        if (internalLinks.length < 3) {
            score -= 10;
            issues.push('Page should have at least 3 internal links');
        }

        return { score: Math.max(0, score), issues };
    }

    // Get SEO recommendations
    getSEORecommendations() {
        const score = this.getSEOScore();
        const recommendations = [];

        if (score.score < 90) {
            recommendations.push('Optimize page title and meta description');
        }
        if (score.score < 85) {
            recommendations.push('Improve heading structure and hierarchy');
        }
        if (score.score < 80) {
            recommendations.push('Add alt text to all images');
        }
        if (score.score < 75) {
            recommendations.push('Increase internal linking');
        }

        return {
            score: score.score,
            issues: score.issues,
            recommendations: recommendations
        };
    }
}

// Initialize SEO optimizer
const agiesSEO = new AgiesSEOOptimizer();

// Export for global use
window.AgiesSEOOptimizer = AgiesSEOOptimizer;
window.agiesSEO = agiesSEO;

console.log('🔍 Agies SEO Optimizer Ready');
console.log('📈 Search engine optimization active');
console.log('🎯 Keyword targeting configured');
