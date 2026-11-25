const pageConfig = [
    { id: 'pronomen', label: 'Pronomen', button: 'nav-pronomen', parent: 'nav-basis' },
    { id: 'artikel', label: 'Artikel', button: 'nav-artikel', parent: 'nav-basis' },
    { id: 'plural-regeln', label: 'Plural-Regeln', button: 'nav-plural-regeln', parent: 'nav-basis' },
    { id: 'substantiv-familien', label: 'Substantivfamilien', button: 'nav-substantiv-familien', parent: 'nav-nomen' },
    { id: 'v2n', label: 'Verb zu Nomen', button: 'nav-v2n', parent: 'nav-nomen' },
    { id: 'a2n', label: 'Adjektiv zu Nomen', button: 'nav-a2n', parent: 'nav-nomen' },
    { id: 'verben', label: 'Verben', button: 'nav-verben-page', parent: 'nav-verben' },
    { id: 'verb-combo', label: 'Verbkombinationen', button: 'nav-verb-combo', parent: 'nav-verben' },
    { id: 'praepositionen', label: 'Präpositionen', button: 'nav-praepositionen-page', parent: 'nav-praepositionen' },
    { id: 'praepositionen-combo', label: 'Präpositionale Verbindungen', button: 'nav-praepositionen-combo', parent: 'nav-praepositionen' }
];

const menuConfig = [
    { button: 'nav-basis', menu: 'nav-basis-menu', defaultPage: 'pronomen' },
    { button: 'nav-nomen', menu: 'nav-nomen-menu', defaultPage: 'substantiv-familien' },
    { button: 'nav-verben', menu: 'nav-verben-menu', defaultPage: 'verben' },
    { button: 'nav-praepositionen', menu: 'nav-praepositionen-menu', defaultPage: 'praepositionen' }
];

const legacyPages = {
    basis: 'pronomen',
    'nomen-bildung': 'v2n'
};

export function initNavigation() {
    const nav = document.getElementById('main-nav-container');
    const pageTitle = document.getElementById('page-title');
    const pages = pageConfig.map(page => ({
        ...page,
        element: document.getElementById(`page-${page.id}`),
        buttonElement: document.getElementById(page.button),
        parentElement: document.getElementById(page.parent)
    }));
    const menus = menuConfig.map(item => ({
        ...item,
        buttonElement: document.getElementById(item.button),
        menuElement: document.getElementById(item.menu)
    }));
    const validPages = new Set(pages.map(page => page.id));

    const setMenuOpen = (item, open) => {
        item.menuElement.classList.toggle('hidden', !open);
        item.buttonElement.setAttribute('aria-expanded', String(open));
    };
    const closeMenus = () => menus.forEach(item => setMenuOpen(item, false));

    const renderPage = (pageId, scroll = false) => {
        const current = validPages.has(pageId) ? pageId : 'pronomen';
        closeMenus();
        pages.forEach(page => {
            const active = page.id === current;
            page.element.classList.toggle('hidden', !active);
            page.buttonElement.setAttribute('aria-current', active ? 'page' : 'false');
            page.buttonElement.classList.toggle('bg-white', active);
            page.buttonElement.classList.toggle('shadow-sm', active);
            page.buttonElement.classList.toggle('text-black', active);
            page.buttonElement.classList.toggle('text-[#8E8E93]', !active);
        });

        const currentPage = pages.find(page => page.id === current);
        const parent = currentPage.parentElement;
        parent.classList.add('bg-white', 'shadow-sm', 'text-black');
        parent.classList.remove('text-[#8E8E93]');
        menus.filter(item => item.buttonElement !== parent).forEach(item => {
            item.buttonElement.classList.remove('bg-white', 'shadow-sm', 'text-black');
            item.buttonElement.classList.add('text-[#8E8E93]');
        });

        nav.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        pageTitle.textContent = currentPage.label;
        document.title = `${currentPage.label} | Deutsche Grammatik`;
        if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const pageFromHash = () => location.hash.slice(1);
    const navigate = pageId => {
        const target = legacyPages[pageId] || pageId;
        if (!validPages.has(target)) return;
        if (pageFromHash() !== target) history.pushState(null, '', `#${target}`);
        renderPage(target, true);
    };
    const syncFromUrl = () => {
        const requested = pageFromHash();
        const pageId = legacyPages[requested] || requested;
        const target = validPages.has(pageId) ? pageId : 'pronomen';
        if (requested !== target) history.replaceState(null, '', `#${target}`);
        renderPage(target);
    };

    pages.forEach(page => {
        page.buttonElement.addEventListener('click', () => navigate(page.id));
    });
    menus.forEach(item => {
        item.buttonElement.addEventListener('click', event => {
            event.stopPropagation();
            const wasOpen = !item.menuElement.classList.contains('hidden');
            navigate(item.defaultPage);
            if (!wasOpen) setMenuOpen(item, true);
        });
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('#main-nav-container')) closeMenus();
    });
    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        const openMenu = menus.find(item => !item.menuElement.classList.contains('hidden'));
        if (openMenu) {
            closeMenus();
            openMenu.buttonElement.focus();
        }
    });
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
    syncFromUrl();

    // Retain the small public API used by external links or embedded scripts.
    window.switchPage = navigate;
}
