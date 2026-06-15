import { verbs } from '../data/verbs.js';
import { pronomen } from '../data/pronomen.js';
import { artikelData } from '../data/artikel.js';
import { praepositionen } from '../data/praepositionen.js';
import { praepositionenCombo } from '../data/praepositionenCombo.js';
import { verbCombo } from '../data/verbCombo.js';
import { substantivFamilienHeaders, substantivFamilienRows } from '../data/substantivFamilien.js';

document.addEventListener('DOMContentLoaded', () => {
    const escapeHtml = (value) => String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const safeItalicizeEnding = (word, infinitive = '') => {
        const stem = String(infinitive).replace(/(en|n)$/, '');
        const stemAwareEndings = ['etest', 'etet', 'eten', 'ete', 'test', 'tet', 'ten', 'te', 'est', 'et', 'st', 't', 'en', 'e'];
        const fallbackEndings = ['test', 'tet', 'ten', 'te', 'est', 'et', 'st', 't', 'en', 'e'];
        const w = String(word);

        for (const end of stemAwareEndings) {
            if (stem && w.length > end.length && w.endsWith(end) && w.slice(0, -end.length) === stem) {
                return escapeHtml(w.slice(0, -end.length)) + '<i>' + escapeHtml(end) + '</i>';
            }
        }

        for (const end of fallbackEndings) {
            if (w.length > end.length && w.endsWith(end)) {
                return escapeHtml(w.slice(0, -end.length)) + '<i>' + escapeHtml(end) + '</i>';
            }
        }
        return escapeHtml(w);
    };

    const renderPronounLabel = (value) => {
        const match = String(value).match(/^([^<]+)(?:\s+<span class="text-xs text-\[#8E8E93\] font-normal">\(([^)]+)\)<\/span>)?$/);
        if (!match) return escapeHtml(value);
        const [, base, note] = match;
        return escapeHtml(base.trim()) + (note
            ? ` <span class="text-xs text-[#8E8E93] font-normal">(${escapeHtml(note)})</span>`
            : '');
    };

    const sanitizeTrustedMarkup = (value) => {
        const template = document.createElement('template');
        template.innerHTML = String(value);
        const allowedTags = new Set(['SPAN', 'DIV', 'I']);
        const cleanNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) return;
            if (node.nodeType !== Node.ELEMENT_NODE || !allowedTags.has(node.tagName)) {
                node.replaceWith(document.createTextNode(node.textContent || ''));
                return;
            }
            [...node.attributes].forEach(attr => {
                if (attr.name !== 'class') {
                    node.removeAttribute(attr.name);
                    return;
                }
                const cleanClasses = attr.value
                    .split(/\s+/)
                    .filter(cls => /^[A-Za-z0-9_:[\]#./%-]+$/.test(cls));
                if (cleanClasses.length === 0) node.removeAttribute('class');
                else node.setAttribute('class', cleanClasses.join(' '));
            });
            [...node.childNodes].forEach(cleanNode);
        };
        [...template.content.childNodes].forEach(cleanNode);
        return template.innerHTML;
    };

    // --- Navigation Logic ---
    const btnHome = null;
    const btnBasis = document.getElementById('nav-basis');
    const btnNomen = document.getElementById('nav-nomen');
    const btnNomenBildung = document.getElementById('nav-nomen-bildung');
    const btnSubstantivFamilien = document.getElementById('nav-substantiv-familien');
    const btnVerben = document.getElementById('nav-verben');
    const btnVerbenPage = document.getElementById('nav-verben-page');
    const btnVerbCombo = document.getElementById('nav-verb-combo');
    const btnPraepositionen = document.getElementById('nav-praepositionen');
    const btnPraepositionenPage = document.getElementById('nav-praepositionen-page');
    const btnPraepositionenCombo = document.getElementById('nav-praepositionen-combo');
    
    const pageHome = null;
    const pageVerben = document.getElementById('page-verben');
    const pageVerbCombo = document.getElementById('page-verb-combo');
    const pageBasis = document.getElementById('page-basis');
    const pageNomenBildung = document.getElementById('page-nomen-bildung');
    const pageSubstantivFamilien = document.getElementById('page-substantiv-familien');
    const pagePraepositionen = document.getElementById('page-praepositionen');
    const pagePraepositionenCombo = document.getElementById('page-praepositionen-combo');

    const navContainer = document.getElementById('main-nav-container');
    const navNomenMenu = document.getElementById('nav-nomen-menu');
    const navVerbenMenu = document.getElementById('nav-verben-menu');
    const navPraepositionenMenu = document.getElementById('nav-praepositionen-menu');

    const closeNavMenus = () => {
        navNomenMenu?.classList.add('hidden');
        navVerbenMenu?.classList.add('hidden');
        navPraepositionenMenu?.classList.add('hidden');
    };

    const toggleNavMenu = (menu) => {
        if (!menu) return;
        const willOpen = menu.classList.contains('hidden');
        [navNomenMenu, navVerbenMenu, navPraepositionenMenu]
            .filter(otherMenu => otherMenu && otherMenu !== menu)
            .forEach(otherMenu => otherMenu.classList.add('hidden'));
        menu.classList.toggle('hidden', !willOpen);
    };

    const parentNavButtons = [btnBasis, btnNomen, btnVerben, btnPraepositionen];
    const resetNavButtonState = (button) => {
        if (!button) return;
        button.classList.remove('bg-white', 'shadow-sm', 'text-black');
        button.classList.add('text-[#8E8E93]');
    };

    function switchPage(pageId) {
        const pages = [
            { id: 'basis', btn: btnBasis, el: pageBasis },
            { id: 'nomen-bildung', btn: btnNomenBildung, el: pageNomenBildung },
            { id: 'substantiv-familien', btn: btnSubstantivFamilien, el: pageSubstantivFamilien },
            { id: 'verben', btn: btnVerben, el: pageVerben },
            { id: 'verb-combo', btn: btnVerbCombo, el: pageVerbCombo },
            { id: 'praepositionen', btn: btnPraepositionen, el: pagePraepositionen },
            { id: 'praepositionen-combo', btn: btnPraepositionenCombo, el: pagePraepositionenCombo }
        ];

        closeNavMenus();
        parentNavButtons.forEach(resetNavButtonState);

        pages.forEach(p => {
            if (p.id === pageId) {
                p.el?.classList.remove('hidden');
                if (p.btn) {
                    p.btn.classList.add('bg-white', 'shadow-sm', 'text-black');
                    p.btn.classList.remove('text-[#8E8E93]');
                }
            } else {
                p.el?.classList.add('hidden');
                if (p.btn) {
                    p.btn.classList.remove('bg-white', 'shadow-sm', 'text-black');
                    p.btn.classList.add('text-[#8E8E93]');
                }
            }
        });

        const activeParentMap = {
            'basis': btnBasis,
            'nomen-bildung': btnNomen,
            'substantiv-familien': btnNomen,
            'verb-combo': btnVerben,
            'verben': btnVerben,
            'praepositionen': btnPraepositionen,
            'praepositionen-combo': btnPraepositionen
        };
        const activeParent = activeParentMap[pageId];
        if (activeParent) {
            activeParent.classList.add('bg-white', 'shadow-sm', 'text-black');
            activeParent.classList.remove('text-[#8E8E93]');
        }

        navContainer.classList.remove('hidden', 'opacity-0', 'pointer-events-none');

        if (pageId === 'substantiv-familien') renderSubstantivFamilienTable();
        if (pageId === 'praepositionen') renderPraepositionenTable();
        if (pageId === 'praepositionen-combo') renderPraepositionenComboTable();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    btnBasis?.addEventListener('click', () => switchPage('basis'));
    btnNomen?.addEventListener('click', (e) => {
        e.stopPropagation();
        switchPage('nomen-bildung');
        toggleNavMenu(navNomenMenu);
    });
    btnNomenBildung?.addEventListener('click', () => switchPage('nomen-bildung'));
    btnSubstantivFamilien?.addEventListener('click', () => switchPage('substantiv-familien'));
    btnVerben.addEventListener('click', (e) => {
        e.stopPropagation();
        switchPage('verben');
        toggleNavMenu(navVerbenMenu);
    });
    btnVerbenPage?.addEventListener('click', () => switchPage('verben'));
    btnVerbCombo.addEventListener('click', () => switchPage('verb-combo'));
    btnPraepositionen.addEventListener('click', (e) => {
        e.stopPropagation();
        switchPage('praepositionen');
        toggleNavMenu(navPraepositionenMenu);
    });
    btnPraepositionenPage?.addEventListener('click', () => switchPage('praepositionen'));
    btnPraepositionenCombo.addEventListener('click', () => switchPage('praepositionen-combo'));
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#main-nav-container')) {
            closeNavMenus();
        }
    });

    // Home Page Interaction
    document.querySelectorAll('.home-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.target;
            switchPage(target);
        });
    });

    // --- Verben Logic ---
    const tbodyVerben = document.querySelector('#verbs-table tbody');
    const filterTypTags = document.getElementById('filter-typ-tags');
    const filterVokal = document.getElementById('filter-vokal');
    
    const selectedTypes = new Set();

    const renderVerbenTable = (data) => {
        const sortedData = [...data].sort((a, b) => a.infinitive.localeCompare(b.infinitive));
        tbodyVerben.innerHTML = '';
        sortedData.forEach(verb => {
            const typeDotClass = {
                stark: 'bg-red-500',
                schwach: 'bg-green-500',
                misch: 'bg-orange-500',
                unregelmäßig: 'bg-purple-500'
            }[verb.type] || 'bg-[#8E8E93]';
            const tr1 = document.createElement('tr');
            tr1.className = 'verb-row-1 group hover:bg-gray-50/50 transition-colors';
            tr1.innerHTML = `
                <td class="px-4 pt-4 pb-1 font-semibold text-black min-w-[180px]">
                    <div class="inline-flex items-center gap-2">
                        <span>${escapeHtml(verb.infinitive)}</span>
                        <span class="inline-block w-2.5 h-2.5 rounded-full ${typeDotClass}" title="${escapeHtml(verb.type)}"></span>
                    </div>
                </td>
                ${verb.conjugations.map(c => `<td class="px-3 pt-4 pb-1 whitespace-nowrap">${safeItalicizeEnding(c, verb.infinitive)}</td>`).join('')}
            `;
            tbodyVerben.appendChild(tr1);

            const tr2 = document.createElement('tr');
            tr2.className = 'verb-row-2 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors';
            tr2.innerHTML = `
                <td class="px-4 pb-4 pt-1 text-sm text-[#8E8E93] whitespace-nowrap">${escapeHtml(verb.pastInfo)}</td>
                ${verb.pastConjugations.map(c => `<td class="px-3 pb-4 pt-1 text-[#8E8E93] whitespace-nowrap">${safeItalicizeEnding(c, verb.infinitive)}</td>`).join('')}
            `;
            tbodyVerben.appendChild(tr2);
        });
    };

    const tbodyVerbCombo = document.querySelector('#verb-combo-table tbody');
    const filterVerbComboVerb = document.getElementById('filter-verb-combo-verb');
    const verbComboSearchInput = document.getElementById('verb-combo-search');
    let currentVerbComboSearchTerm = '';
    const normalizeVerbSortKey = (value) => value.toLowerCase().replace(/^sich\s+/i, '').trim();
    const renderVerbComboTable = () => {
        if (!tbodyVerbCombo) return;
        tbodyVerbCombo.innerHTML = '';

        const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const normalizeLexeme = (value) => String(value)
            .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/ß/g, 'ss');
        const buildStems = (value) => {
            const normalized = normalizeLexeme(value);
            const stems = new Set([normalized]);
            const suffixes = ['ungen', 'ung', 'ern', 'eln', 'en', 'er', 'el', 'est', 'st', 'tet', 'ten', 'te', 't', 'e', 'n', 's'];
            suffixes.forEach(suffix => {
                if (normalized.length - suffix.length >= 3 && normalized.endsWith(suffix)) {
                    stems.add(normalized.slice(0, -suffix.length));
                }
            });
            return Array.from(stems).filter(stem => stem.length >= 2);
        };
        const highlightExampleCombo = (fullCombo, example) => {
            const ignoredTerms = new Set(['jdm', 'jdn', 'jdm.', 'jdn.', 'etw', 'etw.', 'sich', 'a', 'd']);
            const shortKeepers = new Set(['in', 'an', 'zu', 'auf', 'aus', 'bei', 'mit', 'vor', 'von', 'am', 'im', 'zum', 'zur']);
            const comboTerms = fullCombo
                .split(/[\s/]+/)
                .map(part => normalizeLexeme(part))
                .filter(Boolean)
                .filter(term => !ignoredTerms.has(term))
                .filter(term => term.length >= 3 || shortKeepers.has(term));
            const termStems = comboTerms.flatMap(buildStems);

            const tokenMatches = (token) => {
                const tokenNorm = normalizeLexeme(token);
                if (!tokenNorm) return false;
                if (comboTerms.includes(tokenNorm)) return true;
                const tokenStems = buildStems(token);
                return tokenStems.some(tokenStem =>
                    termStems.some(termStem =>
                        tokenStem === termStem ||
                        (termStem.length >= 3 && tokenStem.startsWith(termStem)) ||
                        (tokenStem.length >= 3 && termStem.startsWith(tokenStem))
                    )
                );
            };

            return Array.from(example.matchAll(/(\s+|[^\s]+)/g), match => {
                const token = match[0];
                if (/^\s+$/.test(token)) return token;
                const escaped = escapeHtml(token);
                return tokenMatches(token)
                    ? `<strong class="font-semibold text-[#1C1C1E]">${escaped}</strong>`
                    : escaped;
            }).join('');
        };
        const comboIncludesVerb = (combo, verb) => {
            const normalizedCombo = combo.toLowerCase();
            const normalizedVerb = verb.toLowerCase();
            return new RegExp(`(^|\\s|/)${escapeRegExp(normalizedVerb)}($|\\s|/)`, 'i').test(normalizedCombo);
        };
        const stripVerbTail = (combo, currentVerb, allVerbs) => {
            let value = combo.trim();
            const combinedSuffix = allVerbs.length > 1
                ? new RegExp(`\\s+${allVerbs.map(escapeRegExp).join('\\s*/\\s*')}$`, 'i')
                : null;
            const singleSuffix = new RegExp(`\\s+${escapeRegExp(currentVerb)}$`, 'i');

            if (combinedSuffix && combinedSuffix.test(value)) {
                value = value.replace(combinedSuffix, '').trim();
            } else if (singleSuffix.test(value)) {
                value = value.replace(singleSuffix, '').trim();
            }
            return value;
        };

        const groupedRows = verbCombo.flatMap(group => {
            const verbsInGroup = group.verb
                .split('/')
                .map(part => part.trim())
                .filter(Boolean);

            return verbsInGroup.map(currentVerb => ({
                verb: currentVerb,
                rows: group.items
                    .filter(item => {
                        const combosWithSharedTail = verbsInGroup.length > 1 && new RegExp(`\\s+${verbsInGroup.map(escapeRegExp).join('\\s*/\\s*')}$`, 'i').test(item.combo);
                        return combosWithSharedTail || comboIncludesVerb(item.combo, currentVerb);
                    })
                    .map(item => ({
                        fullCombo: item.combo,
                        combo: stripVerbTail(item.combo, currentVerb, verbsInGroup),
                        example: item.ex
                    }))
            }));
        }).filter(group => group.rows.length > 0)
          .sort((a, b) => normalizeVerbSortKey(a.verb).localeCompare(normalizeVerbSortKey(b.verb), 'de'));

        const selectedVerb = filterVerbComboVerb ? filterVerbComboVerb.value : 'all';
        const filteredGroups = groupedRows
            .filter(group => selectedVerb === 'all' || group.verb === selectedVerb)
            .map(group => ({
                ...group,
                rows: group.rows.filter(row => {
                    if (!currentVerbComboSearchTerm) return true;
                    const haystack = [
                        group.verb,
                        row.combo,
                        row.example
                    ].join(' ').toLowerCase();
                    return haystack.includes(currentVerbComboSearchTerm);
                })
            }))
            .filter(group => group.rows.length > 0);

        filteredGroups.forEach(group => {
            group.rows.forEach((row, index) => {
                const tr = document.createElement('tr');
                tr.className = 'group hover:bg-gray-50/50 transition-colors align-top';

                const cells = [];
                if (index === 0) {
                    cells.push(`<td rowspan="${group.rows.length}" class="px-4 py-4 font-semibold text-black border-r border-gray-100 align-top">${escapeHtml(group.verb)}</td>`);
                }

                cells.push(`<td class="px-4 py-4 text-[#1C1C1E] border-r border-gray-100 align-top">${escapeHtml(row.combo)}</td>`);
                cells.push(`<td class="px-4 py-4 text-gray-600 italic align-top">${highlightExampleCombo(row.fullCombo, row.example)}</td>`);

                tr.innerHTML = cells.join('');
                tbodyVerbCombo.appendChild(tr);
            });
        });
    };

    const types = new Set(verbs.map(v => v.type));
    const vokals = new Set(verbs.map(v => v.stemVowel).filter(v => v !== '-'));

    const typeStyle = {
        stark: 'bg-red-100 text-red-700',
        schwach: 'bg-green-100 text-green-700',
        misch: 'bg-amber-100 text-amber-700',
        unregelmäßig: 'bg-purple-100 text-purple-700'
    };

    const applyTypeBtnStyle = (btn) => {
        const value = btn.dataset.value;
        const active = value === 'all' ? selectedTypes.size === 0 : selectedTypes.has(value);
        btn.classList.remove('bg-[#E5E5EA]','text-[#1C1C1E]','hover:bg-[#D1D1D6]','bg-red-100','text-red-700','bg-green-100','text-green-700','bg-amber-100','text-amber-700','bg-purple-100','text-purple-700','bg-[#007AFF]','text-white');
        if (active) {
            if (value === 'all') btn.classList.add('bg-[#007AFF]', 'text-white');
            else btn.classList.add(...(typeStyle[value] || 'bg-[#007AFF] text-white').split(' '));
        } else {
            btn.classList.add('bg-[#E5E5EA]','text-[#1C1C1E]','hover:bg-[#D1D1D6]');
        }
    };

    const createTag = (typValue, label) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className = 'typ-tag px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200';
        btn.dataset.value = typValue;
        applyTypeBtnStyle(btn);
        btn.addEventListener('click', () => {
            if (typValue === 'all') selectedTypes.clear();
            else {
                if (selectedTypes.has(typValue)) selectedTypes.delete(typValue);
                else selectedTypes.add(typValue);
            }
            document.querySelectorAll('.typ-tag').forEach(applyTypeBtnStyle);
            applyFilters();
        });
        return btn;
    };

    filterTypTags.innerHTML = '<span class="text-sm font-semibold text-[#8E8E93] mr-1">Typ:</span>';
    filterTypTags.appendChild(createTag('all', 'Alle'));
    Array.from(types).sort().forEach(t => filterTypTags.appendChild(createTag(t, t)));

    Array.from(vokals).sort().forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = `Stammvokal: ${v}`;
        filterVokal.appendChild(opt);
    });

    Array.from(new Set(verbCombo.flatMap(group => group.verb.split('/').map(part => part.trim()).filter(Boolean))))
        .sort((a, b) => normalizeVerbSortKey(a).localeCompare(normalizeVerbSortKey(b), 'de'))
        .forEach(verb => {
            const opt = document.createElement('option');
            opt.value = verb;
            opt.textContent = `Verb: ${verb}`;
            filterVerbComboVerb.appendChild(opt);
        });

    // --- Global Search Logic ---
    const searchInput = document.getElementById('global-search');
    let currentVerbSearchTerm = '';

    searchInput.addEventListener('input', (e) => {
        currentVerbSearchTerm = e.target.value.toLowerCase().trim();
        renderVerbenTable(getFilteredVerbs());
    });

    if (filterVerbComboVerb) {
        filterVerbComboVerb.addEventListener('change', renderVerbComboTable);
    }
    if (verbComboSearchInput) {
        verbComboSearchInput.addEventListener('input', (e) => {
            currentVerbComboSearchTerm = e.target.value.toLowerCase().trim();
            renderVerbComboTable();
        });
    }

    function getFilteredVerbs() {
        const selectedVokal = filterVokal.value;
        return verbs.filter(verb => {
            const matchTyp = selectedTypes.size === 0 || selectedTypes.has(verb.type);
            const matchVokal = selectedVokal === 'all' || verb.stemVowel === selectedVokal;
            const matchSearch = !currentVerbSearchTerm || 
                               verb.infinitive.toLowerCase().includes(currentVerbSearchTerm) ||
                               verb.pastInfo.toLowerCase().includes(currentVerbSearchTerm);
            return matchTyp && matchVokal && matchSearch;
        });
    }

    function applyFilters() {
        renderVerbenTable(getFilteredVerbs());
    }
    filterVokal.addEventListener('change', applyFilters);

    // --- Pronomen Logic ---
    const tbodyPronomen = document.querySelector('#pronomen-table tbody');
    const renderPronomenTable = () => {
        if (!tbodyPronomen) return;
        tbodyPronomen.innerHTML = '';
        pronomen.forEach(p => {
            const tr = document.createElement('tr');
            tr.className = p.rowClass;
            tr.innerHTML = `
                <td class="px-5 py-4 font-semibold text-black">${renderPronounLabel(p.nom)}</td>
                <td class="px-4 py-4 text-gray-700">${escapeHtml(p.possessiv)}</td>
                <td class="px-4 py-4 text-gray-700">${escapeHtml(p.dativ)}</td>
                <td class="px-4 py-4 text-gray-700">${escapeHtml(p.akkusativ)}</td>
                <td class="px-4 py-4 text-center font-medium text-[#007AFF]">${escapeHtml(p.reflexiv)}</td>
            `;
            tbodyPronomen.appendChild(tr);
        });
    };

    // --- Artikel Logic ---
    const stripEuerPossessive = (html) => html
        .replace(/\s*\/\s*euer/g, '')
        .replace(/\s*\/\s*eur(?:<i class="italic">[^<]*<\/i>)?/g, '');

    const renderArtikelCell = (value, tbodyId) => {
        const cleanHtml = sanitizeTrustedMarkup(value);
        const template = document.createElement('template');
        template.innerHTML = cleanHtml;

        const primary = template.content.firstElementChild?.tagName === 'DIV'
            ? template.content.firstElementChild
            : template.content;
        const endingNode = Array.from(primary.querySelectorAll ? primary.querySelectorAll('span') : [])
            .reverse()
            .find(node => node.textContent.trim().startsWith('-'));

        const trimmedValue = String(value).trim();

        if (!endingNode && tbodyId === 'artikel-null-table' && trimmedValue.startsWith('-')) {
            return `
                <div class="artikel-cell">
                    <div class="artikel-main">-</div>
                    <div class="artikel-ending">${escapeHtml(trimmedValue)}</div>
                </div>
            `;
        }

        if (!endingNode && trimmedValue.startsWith('-')) {
            return `<div class="font-medium text-black">${escapeHtml(trimmedValue)}</div>`;
        }

        if (!endingNode) {
            return `<div class="font-medium text-black">${cleanHtml}</div>`;
        }

        const ending = endingNode.textContent.trim();
        endingNode.remove();

        const mainHtml = (primary.innerHTML || primary.textContent || '').trim();
        const noteNodes = [...template.content.children].slice(1);
        const noteHtml = noteNodes
            .map(node => {
                node.classList.add('artikel-note');
                return stripEuerPossessive(node.outerHTML);
            })
            .join('');
        const showNote = tbodyId === 'artikel-unbestimmt-table' && noteHtml;

        return `
            <div class="artikel-cell">
                <div class="artikel-main">
                    <div>${mainHtml}</div>
                    ${showNote ? noteHtml : ''}
                </div>
                <div class="artikel-ending">${escapeHtml(ending)}</div>
            </div>
        `;
    };

    const renderArtikelTable = (tbodyId, data) => {
        const tbody = document.querySelector(`#${tbodyId} tbody`);
        if (!tbody) return;
        tbody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.className = 'group hover:bg-gray-50/50 transition-colors';
            const cellClass = (idx) => idx === 0 ? "px-5 py-4 font-semibold text-[#8E8E93] align-middle" : "px-4 py-4 text-center align-middle";
            tr.innerHTML = `
                <td class="${cellClass(0)}">${escapeHtml(row.kasus)}</td>
                <td class="${cellClass(1)}">${renderArtikelCell(row.m, tbodyId)}</td>
                <td class="${cellClass(2)}">${renderArtikelCell(row.f, tbodyId)}</td>
                <td class="${cellClass(3)}">${renderArtikelCell(row.n, tbodyId)}</td>
                <td class="${cellClass(4)}">${renderArtikelCell(row.pl, tbodyId)}</td>
            `;
            tbody.appendChild(tr);
        });
    };

    // --- Präpositionen Logic ---
    const filterPrepCaseTags = document.getElementById('filter-prep-case-tags');
    const filterPrepPrep = document.getElementById('filter-prep-prep');
    const filterPrepComboCaseTags = document.getElementById('filter-prep-combo-case-tags');
    const filterPrepComboPrep = document.getElementById('filter-prep-combo-prep');
    const prepComboSearchInput = document.getElementById('prep-combo-search');
    const substantivFamilienSearchInput = document.getElementById('substantiv-familien-search');
    const selectedPrepCases = new Set(); 
    const selectedPrepComboCases = new Set();
    let currentPrepComboSearchTerm = '';
    let currentSubstantivFamilienSearchTerm = '';

    const substantivFamilienPrefixHints = {
        ab: '离开/断开',
        an: '靠近/开始',
        auf: '向上/打开',
        aus: '向外/出来',
        bei: '旁边/附加',
        be: '作用/覆盖',
        durch: '穿过/贯通',
        ein: '进入/纳入',
        ent: '去除/脱离',
        er: '获得/形成',
        fort: '继续/离去',
        gegen: '相对/反向',
        her: '从来/来源',
        hin: '向去/朝向',
        mit: '共同/一起',
        nach: '随后/补充',
        nieder: '向下/放下',
        über: '越过/转移',
        um: '环绕/转换',
        unter: '下方/中断',
        ver: '变化/错失',
        vor: '在前/预先',
        wider: '反对/抵抗',
        zu: '朝向/增加',
        zurück: '返回/退回',
        zusammen: '合并/一起',
        maß: '衡量/措施',
        teil: '部分/参与',
        emp: '感受/接受',
        wieder: '再次/重新'
    };

    const substantivFamilienGlosses = {
        Abbindung: '结扎/截断',
        Anbindung: '接入/连接',
        Aufbindung: '绑上/束起',
        Einbindung: '纳入/嵌入',
        Entbindung: '解除/分娩',
        Überbindung: '转嫁/套上',
        Unterbindung: '阻止/中断',
        Verbindung: '连接/关系',
        Verbund: '联合/复合体',
        Abbruch: '中止/拆除',
        Anbruch: '开始/破开',
        Aufbruch: '出发/破开',
        Ausbruch: '爆发/逃出',
        Durchbruch: '突破/贯通',
        Durchbrechung: '突破/打破',
        Einbruch: '闯入/骤降',
        Umbruch: '转变/改版',
        Unterbrechung: '中断',
        Verbrechen: '犯罪',
        Zusammenbruch: '崩溃/倒塌',
        Abfahrt: '出发/离站',
        Anfahrt: '驶近/前往',
        Auffahrt: '驶上/车道',
        Ausfahrt: '出口/驶出',
        Beifahrt: '同乘/旁路',
        Durchfahrt: '穿行/通道',
        Einfahrt: '入口/驶入',
        Mitfahrt: '搭乘/同车',
        Nachfahrt: '追车/夜行',
        Hinfahrt: '去程',
        Überfahrt: '渡航/横渡',
        Umfahrt: '绕行/改道',
        Vorfahrt: '先行权',
        Zufahrt: '通往入口',
        Rückfahrt: '返程',
        Erfahrung: '经验/经历',
        Abfall: '垃圾/脱落',
        Anfall: '发作/袭来',
        Auffallen: '显眼/注意',
        Ausfall: '故障/缺席',
        Beifall: '掌声/赞同',
        Befall: '侵染/侵袭',
        Durchfall: '腹泻/不及格',
        Einfall: '想法/入侵',
        Überfall: '袭击/抢劫',
        Unfall: '事故',
        Verfall: '衰败/失效',
        Vorfall: '事件/事故',
        Zufall: '偶然',
        Rückfall: '复发/倒退',
        Abfindung: '补偿金',
        Auffindung: '发现/找到',
        Befund: '检查结果',
        Erfindung: '发明',
        Empfindung: '感觉/感受',
        Wiederfindung: '重新找到',
        Abgabe: '提交/交付',
        Angabe: '说明/资料',
        Aufgabe: '任务/放弃',
        Ausgabe: '支出/出版',
        Beigabe: '附赠/添加',
        Durchgabe: '转告/传达',
        Eingabe: '输入/呈文',
        Hingabe: '奉献/投入',
        Mitgabe: '随带赠予',
        Nachgabe: '让步/补给',
        Übergabe: '交接/移交',
        Umgebung: '周围环境',
        Vergabe: '授予/分配',
        Vergebung: '宽恕/赦免',
        Vorgabe: '规定/预设',
        Zugabe: '添加/加演',
        Zurückgabe: '归还',
        Wiedergabe: '复述/播放',
        Abgang: '离开/退场',
        Angang: '开端/着手',
        Aufgang: '升起/入口',
        Ausgang: '出口/结果',
        Beigang: '陪伴/同去',
        Durchgang: '通道/经过',
        Eingang: '入口/收到',
        Fortgang: '进展/继续',
        Hergang: '经过/来龙去脉',
        Hingang: '前往/逝世',
        Mitgang: '同行/随动',
        Nachgang: '后续/余波',
        Niedergang: '衰落/沉降',
        Übergang: '过渡/通道',
        Umgang: '交往/处理',
        Untergang: '灭亡/沉没',
        Vorgang: '过程/事件',
        Zugang: '入口/获得',
        Rückgang: '下降/退回',
        Abhang: '斜坡/山坡',
        Anhang: '附录/追随者',
        Aushang: '公告/张贴',
        Behang: '帘饰/挂饰',
        Durchhang: '下垂/松弛',
        Überhang: '悬垂/过剩',
        Umhang: '披风/斗篷',
        Vorhang: '窗帘/幕布',
        Zusammenhang: '关联/上下文',
        Angriff: '攻击',
        Aufgriff: '拾取/提起',
        Begriff: '概念',
        Eingriff: '干预/介入',
        Übergriff: '越界/侵犯',
        Umgriff: '范围/包围',
        Untergriff: '下握/小概念',
        Vorgriff: '预支/预先引用',
        Zugriff: '访问/抓取',
        Rückgriff: '回溯/借用',
        Anhalt: '线索/停靠',
        Aufenthalt: '停留/逗留',
        Behalt: '保留/记忆',
        Einhaltung: '遵守/保持',
        Enthaltung: '弃权/克制',
        Erhalt: '保存/收到',
        Erhaltung: '保存/维持',
        Unterhalt: '生活费/扶养',
        Unterhaltung: '娱乐/谈话',
        Verhalten: '行为/态度',
        Vorbehalt: '保留/条件',
        Rückhalt: '支持/后盾',
        Zurückhaltung: '克制/保留',
        Zusammenhalt: '凝聚/团结',
        Abkunft: '出身/血统',
        Abkommen: '协定/协议',
        Ankunft: '到达',
        Auskunft: '信息/答复',
        Einkommen: '收入',
        Einkünfte: '收入',
        Herkunft: '来源/出身',
        Übereinkunft: '协议/一致',
        Übereinkommen: '协议/协定',
        Unterkunft: '住宿',
        Nachkommen: '后代/继承人',
        Vorkommen: '出现/矿藏',
        Zukunft: '未来',
        Zusammenkunft: '聚会/会合',
        Ablage: '存放/归档',
        Anlage: '设施/投资',
        Auflage: '版次/条件',
        Auslage: '陈列/垫款',
        Auslegung: '解释/铺设',
        Beilage: '附页/配菜',
        Beilegung: '解决/附加',
        Belegung: '占用/证明',
        Einlage: '存款/嵌入物',
        Einlegung: '插入/提出',
        Niederlegung: '放下/辞职',
        Überlegung: '思考/考虑',
        Umlegung: '改铺/分摊',
        Unterlage: '资料/垫板',
        Verlegung: '搬迁/铺设',
        Vorlage: '模板/提交',
        Zulage: '补贴/附加',
        Rücklage: '储备金',
        Zusammenlegung: '合并',
        Abnahme: '减少/验收',
        Annahme: '接受/假设',
        Aufnahme: '录取/接收',
        Ausnahme: '例外',
        Benehmen: '举止/行为',
        Einnahme: '收入/服用',
        Entnahme: '取出/提取',
        Übernahme: '接管/承担',
        Unternehmen: '企业/事业',
        Zunahme: '增加',
        Maßnahme: '措施',
        Teilnahme: '参加',
        Abschluss: '结束/毕业',
        Anschluss: '连接/接续',
        Aufschluss: '说明/启示',
        Ausschluss: '排除/开除',
        Beschluss: '决议/决定',
        Einschluss: '包含/夹杂',
        Entschluss: '决定/决心',
        Überschluss: '剩余/过量',
        Unterschluss: '下闭合/包含',
        Verschluss: '封闭/盖子',
        Zuschluss: '合上/闭锁',
        Rückschluss: '推论',
        Zusammenschluss: '联合/合并',
        Abschnitt: '段落/部分',
        Anschnitt: '切口/开切',
        Aufschnitt: '冷切肉片',
        Ausschnitt: '摘录/剪裁',
        Durchschnitt: '平均/截面',
        Einschnitt: '切口/转折',
        Überschnitt: '重叠/交叠',
        Verschnitt: '边角料/混合',
        Zuschnitt: '裁剪/剪裁',
        Abschrift: '抄本/副本',
        Abschreibung: '折旧/注销',
        Anschrift: '地址',
        Aufschrift: '题字/标签',
        Ausschreibung: '招标/公告',
        Beischrift: '附注/题注',
        Beschreibung: '描述/说明',
        Einschreibung: '注册/挂号',
        Überschrift: '标题',
        Überschreibung: '覆写/转让',
        Umschrift: '转写/改写',
        Umschreibung: '改写/释义',
        Unterschrift: '签名',
        Vorschrift: '规定/条例',
        Zuschrift: '来信/投稿',
        Zuschreibung: '归因/归属',
        Absicht: '意图/打算',
        Ansicht: '看法/景观',
        Ansehen: '声望/观看',
        Aufsicht: '监督/看管',
        Aussicht: '前景/视野',
        Aussehen: '外貌/样子',
        Durchsicht: '审阅/透视',
        Einsicht: '洞察/理解',
        Hinsicht: '方面',
        Nachsicht: '宽容/体谅',
        Übersicht: '概览/总览',
        Umsicht: '谨慎/周到',
        Vorsicht: '小心/谨慎',
        Versehen: '疏忽/失误',
        Zuversicht: '信心/乐观',
        Rücksicht: '顾及/体谅',
        Absatz: '段落/销售',
        Absetzung: '免职/停用',
        Ansatz: '起点/方法',
        Ansetzung: '安排/估价',
        Aufsatz: '作文/附件',
        Aussatz: '麻风病',
        Aussetzung: '暂停/遗弃',
        Besetzung: '占据/演员阵容',
        Durchsetzung: '贯彻/执行',
        Einsatz: '投入/使用',
        Einsetzung: '任命/插入',
        Entsetzung: '解除/惊恐',
        Ersetzung: '替换',
        Fortsetzung: '继续/续集',
        Gegensatz: '对立/相反',
        Hinsetzung: '坐下/放置',
        Übersetzung: '翻译',
        Umsetzung: '实施/转换',
        Untersetzung: '下传动/支撑',
        Versetzung: '调动/升班',
        Vorsatz: '意图/前置',
        Zusatz: '补充/附加',
        Zurücksetzung: '贬低/重置',
        Zusammensetzung: '组成/复合',
        Absprache: '约定/商议',
        Ansprache: '致辞/讲话',
        Anspruch: '要求/权利',
        Aussprache: '发音/讨论',
        Ausspruch: '言论/判决',
        Besprechung: '会议/讨论',
        Einspruch: '异议',
        Entsprechung: '对应/符合',
        Mitsprache: '参与发言权',
        Nachsprache: '协商/追问',
        Versprechen: '承诺/诺言',
        Vorsprache: '面谈/陈述',
        Widerspruch: '反对/矛盾',
        Zuspruch: '鼓励/赞同',
        Zusprache: '鼓励/分配',
        Abstand: '距离/间隔',
        Anstand: '礼貌/体面',
        Aufstand: '起义/暴动',
        Ausstand: '罢工/缺额',
        Beistand: '援助/支持',
        Einstand: '入职请客/开始',
        Gegenstand: '物品/对象',
        Überstand: '突出部分/熬过',
        Umstand: '情况/麻烦',
        Unterstand: '避难处/棚',
        Verstand: '理智/理解力',
        Vorstand: '董事会/理事会',
        Widerstand: '抵抗/阻力',
        Zustand: '状态/状况',
        Abstieg: '下降/降级',
        Anstieg: '上升/增长',
        Aufstieg: '上升/晋升',
        Ausstieg: '下车/退出',
        Einstieg: '上车/入门',
        Überstieg: '翻越/越过',
        Umstieg: '换乘/转行',
        Zustieg: '上车/登乘',
        Rückstieg: '退步/回落',
        Abtrag: '去除/削减',
        Abtragung: '清偿/去除',
        Antrag: '申请/提案',
        Auftrag: '任务/委托',
        Austrag: '争执/承办',
        Austragung: '举办/解决',
        Betrag: '金额/数额',
        Beitrag: '贡献/文章',
        Eintrag: '条目/登记',
        Eintragung: '登记/记录',
        Ertrag: '收益/产量',
        Nachtrag: '补充/附录',
        Übertragung: '传输/转让',
        Untertragung: '从属转移',
        Vertrag: '合同/协议',
        Vortrag: '演讲/报告',
        Zutrag: '传闻/供应',
        Abtritt: '让与/退场',
        Antritt: '开始/就任',
        Auftritt: '登场/演出',
        Austritt: '退出/离开',
        Beitritt: '加入',
        Eintritt: '进入/入场',
        Übertritt: '越过/转入',
        Vertretung: '代理/代表',
        Vortritt: '优先权',
        Zutritt: '进入许可',
        Rücktritt: '辞职/退回',
        Anwuchs: '生根/增长',
        Aufwuchs: '长出/植被',
        Auswuchs: '赘生物/恶果',
        Bewuchs: '植被覆盖',
        Durchwuchs: '贯穿生长',
        Einwuchs: '内生/长入',
        Nachwuchs: '后代/新秀',
        Überwuchs: '过度生长',
        Zuwachs: '增长/新增',
        Abwurf: '投下/丢弃',
        Anwurf: '开球/抛投',
        Aufwurf: '隆起/堆土',
        Auswurf: '排出物/痰',
        Einwurf: '投递/异议',
        Entwurf: '草案/设计',
        Überwurf: '披肩/套罩',
        Umwurf: '推倒/倾覆',
        Unterwurf: '服从/屈服',
        Verwurf: '丢弃/拒绝',
        Vorwurf: '指责/责备',
        Zuwurf: '抛给/投向',
        Rückwurf: '回投/反射',
        Abzug: '撤离/扣除',
        Anzug: '西装/拉紧',
        Anziehung: '吸引/引力',
        Aufzug: '电梯/升起',
        Auszug: '摘录/搬出',
        Bezug: '关系/购买',
        Beziehung: '关系/联系',
        Durchzug: '穿堂风/通过',
        Einzug: '搬入/进入',
        Entzug: '剥夺/戒断',
        Erziehung: '教育/培养',
        Fortzug: '迁走/离去',
        Gegenzug: '反招/交换',
        Hinzug: '加入/添入',
        Nachzug: '跟进/追加',
        Überzug: '外套/涂层',
        Überziehung: '透支/超期',
        Umzug: '搬家/游行',
        Unterzug: '横梁/下拉',
        Verzug: '延迟/拖欠',
        Vorzug: '优点/偏爱',
        Zuzug: '迁入/加入',
        Rückzug: '撤退/退回'
    };

    const renderSubstantivFamilienHeader = (header, index) => {
        if (index === 0) return escapeHtml(header);
        const hint = substantivFamilienPrefixHints[header];
        return `
            <span class="substantiv-familien-header-prefix">${escapeHtml(header)}</span>
            ${hint ? `<span class="substantiv-familien-header-hint">${escapeHtml(hint)}</span>` : ''}
        `;
    };
    const getSubstantivFamilienGloss = (word) => {
        return substantivFamilienGlosses[word] || '待补充';
    };
    const renderSubstantivFamilienNomen = (value) => {
        return String(value)
            .split('\n')
            .filter(Boolean)
            .map(word => `
                <span class="substantiv-familien-nomen">
                    <span class="substantiv-familien-nomen-word">${escapeHtml(word)}</span>
                    <span class="substantiv-familien-nomen-gloss">${escapeHtml(getSubstantivFamilienGloss(word))}</span>
                </span>
            `)
            .join('');
    };
    const renderSubstantivFamilienStamm = (value) => {
        return String(value)
            .split('\n')
            .filter(Boolean)
            .map((line, index) => {
                const cleanedLine = line.replace(/^Kernverb:\s*/i, '');
                if (index === 0) {
                    return `<span class="substantiv-familien-stamm-verb">${escapeHtml(cleanedLine)}</span>`;
                }

                const match = cleanedLine.match(/^(\S+)\s+(.+)$/);
                if (!match) {
                    return `<span class="substantiv-familien-stamm-nomen"><strong>${escapeHtml(cleanedLine)}</strong></span>`;
                }

                return `<span class="substantiv-familien-stamm-nomen">${escapeHtml(match[1])} <strong>${escapeHtml(match[2])}</strong></span>`;
            })
            .join('');
    };

    const renderSubstantivFamilienTable = () => {
        const thead = document.querySelector('#substantiv-familien-table thead');
        const tbody = document.querySelector('#substantiv-familien-table tbody');
        if (!thead || !tbody) return;

        thead.innerHTML = `
            <tr>
                ${substantivFamilienHeaders.map((header, index) => `
                    <th class="px-2 py-2 text-center align-middle font-semibold border-b border-r border-gray-300 last:border-r-0 whitespace-nowrap ${index === 0 ? 'sticky left-0 z-40 bg-gray-50 min-w-[150px]' : 'min-w-[92px]'}">
                        ${renderSubstantivFamilienHeader(header, index)}
                    </th>
                `).join('')}
            </tr>
        `;

        const filteredRows = substantivFamilienRows.filter(row => {
            if (!currentSubstantivFamilienSearchTerm) return true;
            return row.join(' ').toLowerCase().includes(currentSubstantivFamilienSearchTerm);
        });

        tbody.innerHTML = filteredRows.map(row => {
            return `
            <tr class="group hover:bg-gray-50/50 transition-colors">
                ${row.map((cell, index) => `
                    <td class="px-2 py-1.5 text-center border-b border-r border-gray-200 last:border-r-0 align-middle leading-tight ${index === 0 ? 'sticky left-0 z-20 bg-white group-hover:bg-gray-50 min-w-[150px]' : 'min-w-[92px] text-gray-700'}">
                        ${cell ? (index === 0 ? renderSubstantivFamilienStamm(cell) : renderSubstantivFamilienNomen(cell)) : '<span class="text-gray-300">-</span>'}
                    </td>
                `).join('')}
            </tr>
        `;
        }).join('');
    };

    substantivFamilienSearchInput?.addEventListener('input', (e) => {
        currentSubstantivFamilienSearchTerm = e.target.value.toLowerCase().trim();
        renderSubstantivFamilienTable();
    });

    const caseStyles = {
        DAT: 'bg-green-100 text-green-700',
        AKK: 'bg-blue-100 text-blue-700',
        GEN: 'bg-yellow-100 text-yellow-700'
    };

    const renderPraepositionenTable = () => {
        const tbody = document.querySelector('#praepositionen-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const sorted = [...praepositionen].sort((a,b) => a.prep.localeCompare(b.prep));

        const filtered = sorted.filter(item => {
            const matchesCase = selectedPrepCases.size === 0 || item.modes.some(m => selectedPrepCases.has(m.case));
            const matchesPrep = !filterPrepPrep || filterPrepPrep.value === 'all' || item.prep === filterPrepPrep.value;
            return matchesCase && matchesPrep;
        });

        filtered.forEach(item => {
            const visibleModes = selectedPrepCases.size === 0 
                ? item.modes 
                : item.modes.filter(m => selectedPrepCases.has(m.case));

            const rowCount = visibleModes.length;

            visibleModes.forEach((mode, index) => {
                const tr = document.createElement('tr');
                tr.className = 'group hover:bg-gray-50/50 transition-colors align-top border-b border-gray-100 last:border-b-0';
                const cls = caseStyles[mode.case] || 'bg-gray-100 text-gray-700';
                const tdPrepCase = document.createElement('td');
                tdPrepCase.className = "px-3 py-4 align-top border-r border-gray-100 w-24";
                tdPrepCase.innerHTML = `
                    <div class="font-semibold text-black leading-tight">
                        <div>${escapeHtml(item.prep)}</div>
                        <div class="mt-1 text-xs ${cls} bg-transparent px-0 py-0 rounded-none">${escapeHtml(mode.case)}</div>
                    </div>
                `;
                tr.appendChild(tdPrepCase);

                const renderRules = (arr) => {
                    if (!arr || arr.length === 0) return '';
                    return `<ul class="list-disc pl-4 space-y-3">
                        ${arr.map(r => `<li class="text-sm text-[#1C1C1E] leading-snug">${escapeHtml(r.rule)}<div class="text-[13px] text-gray-400 italic mt-0.5 leading-snug">${sanitizeTrustedMarkup(r.ex)}</div></li>`).join('')}
                    </ul>`;
                };

                const tdSpace = document.createElement('td');
                tdSpace.className = "px-4 py-4 align-top border-r border-gray-100";
                tdSpace.innerHTML = renderRules(mode.space);
                tr.appendChild(tdSpace);

                const tdTime = document.createElement('td');
                tdTime.className = "px-4 py-4 align-top";
                tdTime.innerHTML = renderRules(mode.time);
                tr.appendChild(tdTime);

                tbody.appendChild(tr);
            });
        });
    };

    const compactPraepositionenHeaders = () => {
        document.querySelectorAll('#praepositionen-table thead th:first-child, #praepositionen-combo-table thead th:first-child')
            .forEach(firstHeader => {
                firstHeader.textContent = 'Präp / Kasus';
                firstHeader.classList.remove('w-24');
                firstHeader.classList.add('w-20', 'whitespace-nowrap');
            });
    };

    const renderPraepositionenComboTable = () => {
        const tbody = document.querySelector('#praepositionen-combo-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const styleSentenceMarkup = (entry, kasus, type) => {
            const sentence = entry.ex || '';
            const combo = entry.combo || '';
            const caseTextClass = kasus === 'AKK' ? 'text-blue-700' : 'text-green-700';
            const prep = combo.trim().split(/\s+/).pop();
            const prepVariants = {
                an: ['an', 'am'],
                auf: ['auf'],
                aus: ['aus'],
                bei: ['bei', 'beim'],
                durch: ['durch'],
                für: ['für'],
                gegen: ['gegen'],
                gegenüber: ['gegenüber'],
                in: ['in', 'im', 'ins'],
                mit: ['mit'],
                nach: ['nach'],
                über: ['über'],
                um: ['um'],
                unter: ['unter'],
                von: ['von', 'vom'],
                vor: ['vor'],
                zu: ['zu', 'zum', 'zur']
            };
            const stopHeadWords = new Set(['sich', 'es', 's.']);
            const pronounObjects = new Set([
                'mich', 'dich', 'ihn', 'sie', 'es', 'uns', 'euch',
                'ihnen', 'dir', 'mir', 'ihm', 'ihnen'
            ]);
            const determiners = new Set([
                'der', 'des', 'dem', 'den', 'die', 'das',
                'ein', 'eine', 'einer', 'eines', 'einem', 'einen',
                'kein', 'keine', 'keiner', 'keines', 'keinem', 'keinen',
                'dieser', 'dieses', 'diesem', 'diesen', 'diese',
                'jener', 'jenes', 'jenem', 'jenen', 'jene',
                'mein', 'meine', 'meiner', 'meinem', 'meinen',
                'dein', 'deine', 'deiner', 'deinem', 'deinen',
                'sein', 'seine', 'seiner', 'seinem', 'seinen',
                'ihr', 'ihre', 'ihrer', 'ihrem', 'ihren',
                'unser', 'unsere', 'unserer', 'unserem', 'unseren',
                'euer', 'euere', 'eurer', 'eurem', 'euren',
                'deren', 'dessen', 'aller', 'allen', 'alles', 'alle'
            ]);
            const objectConnectors = new Set(['von', 'vom', 'zu', 'zum', 'zur', 'in', 'im', 'ins', 'mit', 'ohne', 'für', 'gegen', 'unter', 'über']);
            const clauseBreakWords = new Set([
                'bin', 'bist', 'ist', 'sind', 'seid', 'war', 'waren', 'wurde', 'wurden',
                'hat', 'habe', 'hast', 'haben', 'habt', 'hatte', 'hatten',
                'wird', 'werden', 'werde', 'wirst', 'wurdet',
                'macht', 'machte', 'machen', 'machte', 'machten',
                'kommt', 'kam', 'kommen', 'komme', 'kommst',
                'geht', 'ging', 'gehen', 'gehe', 'gehst',
                'fällt', 'fallen', 'fiel', 'liegt', 'lag', 'liegen',
                'bleibt', 'blieb', 'bleiben', 'dauert', 'dauerte',
                'hilft', 'half', 'helfen', 'enthielt', 'enthält',
                'muss', 'müssen', 'musste', 'kann', 'können', 'konnte',
                'darf', 'dürfen', 'durfte', 'soll', 'sollen', 'sollte'
            ]);
            const auxiliaryVerbs = new Set([
                'haben', 'habe', 'hast', 'hat', 'habt', 'hatte', 'hatten',
                'sein', 'bin', 'bist', 'ist', 'seid', 'sind', 'war', 'waren',
                'werden', 'werde', 'wirst', 'wird', 'werdet', 'wurden', 'wurde'
            ]);
            const commonAdverbs = new Set([
                'nicht', 'jetzt', 'oft', 'noch', 'immer', 'schon', 'sehr', 'gern', 'gerne',
                'zufällig', 'bald', 'später', 'heute', 'morgen', 'gestern', 'hier', 'dort',
                'da', 'dann', 'nur', 'auch', 'etwa', 'lange', 'kurz', 'so', 'wie', 'mehr',
                'weniger', 'besonders', 'seit', 'langem', 'wohl'
            ]);
            const separablePrefixes = [
                'zurück', 'zusammen', 'vorbei', 'vor', 'weg', 'weiter', 'wieder', 'zu',
                'zurecht', 'zurecht', 'teil', 'statt', 'los', 'fest', 'fern', 'ein',
                'empor', 'entgegen', 'entlang', 'dazwischen', 'dazu', 'davon', 'darauf',
                'daran', 'aus', 'an', 'auf', 'ab', 'bei', 'mit', 'nach'
            ];

            const normalizeLexeme = (value) => String(value)
                .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/\p{Diacritic}/gu, '')
                .replace(/ß/g, 'ss');

            const buildStems = (value) => {
                const normalized = normalizeLexeme(value);
                const stems = new Set([normalized]);
                const suffixes = ['ungen', 'ung', 'ern', 'eln', 'en', 'er', 'el', 'est', 'st', 'tet', 'ten', 'te', 't', 'e', 'n', 's'];
                suffixes.forEach(suffix => {
                    if (normalized.length - suffix.length >= 3 && normalized.endsWith(suffix)) {
                        stems.add(normalized.slice(0, -suffix.length));
                    }
                });
                return Array.from(stems).filter(stem => stem.length >= 3);
            };

            const buildHeadSearchTerms = (terms, currentType) => {
                const result = [];
                const seen = new Set();

                const addTerm = (term) => {
                    const normalized = normalizeLexeme(term);
                    if (!normalized || seen.has(normalized)) return;
                    seen.add(normalized);
                    result.push(term);
                };

                terms.forEach(addTerm);

                if (currentType === 'verb') {
                    terms.forEach(term => {
                        const normalized = normalizeLexeme(term);
                        const prefix = separablePrefixes.find(item => normalized.startsWith(item) && normalized.length > item.length + 2);
                        if (!prefix) return;
                        addTerm(normalized.slice(prefix.length));
                    });
                }

                return result;
            };

            const isHeadMatch = (tokenValue, term) => {
                const tokenNorm = normalizeLexeme(tokenValue);
                const termNorm = normalizeLexeme(term);
                if (!tokenNorm || !termNorm) return false;
                if (tokenNorm === termNorm) return true;

                const tokenStems = buildStems(tokenValue);
                const termStems = buildStems(term);
                return termStems.some(termStem =>
                    tokenStems.some(tokenStem =>
                        tokenStem === termStem ||
                        (termStem.length >= 4 && tokenStem.startsWith(termStem)) ||
                        (tokenStem.length >= 4 && termStem.startsWith(tokenStem)) ||
                        (termStem.length >= 3 && tokenStem.length >= 3 && termStem.slice(0, 3) === tokenStem.slice(0, 3))
                    )
                );
            };

            const segments = Array.from(sentence.matchAll(/(\s+|[^\s]+)/g), match => {
                const text = match[0];
                return {
                    text,
                    isSpace: /^\s+$/.test(text)
                };
            });

            const words = segments
                .map((segment, index) => ({
                    ...segment,
                    index,
                    normalized: segment.isSpace ? '' : normalizeLexeme(segment.text),
                    isCapitalized: !segment.isSpace && /^[A-ZÄÖÜ]/.test(segment.text.replace(/^[^\p{L}]+/u, ''))
                }))
                .filter(segment => !segment.isSpace && segment.normalized);

            const headTerms = combo
                .split(/\s+/)
                .map(term => term.trim())
                .filter(Boolean)
                .filter(term => {
                    const normalized = normalizeLexeme(term);
                    return normalized && normalized !== normalizeLexeme(prep) && !stopHeadWords.has(normalized);
                });
            const headSearchTerms = buildHeadSearchTerms(headTerms, type);

            const boldIndices = new Set();
            headSearchTerms.forEach(term => {
                const match = words.find(word => !boldIndices.has(word.index) && isHeadMatch(word.text, term));
                if (match) boldIndices.add(match.index);
            });

            const prepForms = new Set((prepVariants[prep] || [prep]).map(normalizeLexeme));
            const prepCandidates = words.filter(word => prepForms.has(word.normalized));
            const boldWordPositions = words
                .filter(word => boldIndices.has(word.index))
                .map(word => word.index);

            const prepWord = prepCandidates.length === 0 ? null : prepCandidates.reduce((best, candidate) => {
                if (boldWordPositions.length === 0) return best || candidate;
                const candidateDistance = Math.min(...boldWordPositions.map(index => Math.abs(index - candidate.index)));
                const bestDistance = best ? Math.min(...boldWordPositions.map(index => Math.abs(index - best.index))) : Number.POSITIVE_INFINITY;
                return candidateDistance < bestDistance ? candidate : best;
            }, null);

            if (prepWord) {
                boldIndices.add(prepWord.index);
            }

            if (type === 'verb') {
                const compactHeadTerms = headSearchTerms
                    .map(normalizeLexeme)
                    .filter(term => term.length >= 4);
                const matchedPrefix = compactHeadTerms
                    .map(term => separablePrefixes.find(prefix => term.startsWith(prefix) && term.length > prefix.length + 2))
                    .find(Boolean);

                const isVerbCandidate = (word) =>
                    !auxiliaryVerbs.has(word.normalized) &&
                    !determiners.has(word.normalized) &&
                    !pronounObjects.has(word.normalized) &&
                    !commonAdverbs.has(word.normalized) &&
                    !prepForms.has(word.normalized) &&
                    !word.isCapitalized;

                if (compactHeadTerms.length > 0 && boldIndices.size <= 1) {
                    const beforePrep = prepWord
                        ? [...words].reverse().find(word => word.index < prepWord.index && isVerbCandidate(word))
                        : words.find(isVerbCandidate);
                    const afterPrepCandidates = prepWord
                        ? words
                            .filter(word => word.index > prepWord.index && isVerbCandidate(word))
                            .filter(word => normalizeLexeme(word.text) !== normalizeLexeme(matchedPrefix || ''))
                        : [];
                    const afterPrep = prepWord && prepWord.index === words[0]?.index
                        ? afterPrepCandidates[0]
                        : afterPrepCandidates[afterPrepCandidates.length - 1];
                    const lexicalVerb = beforePrep || afterPrep || words.find(isVerbCandidate);
                    if (lexicalVerb) {
                        boldIndices.add(lexicalVerb.index);
                    }
                }

                compactHeadTerms.forEach(term => {
                    const currentPrefix = separablePrefixes.find(prefix => term.startsWith(prefix) && term.length > prefix.length + 2);
                    if (!currentPrefix) return;

                    const particle = normalizeLexeme(currentPrefix);
                    const particleWord = [...words]
                        .filter(word => word.normalized === particle)
                        .sort((a, b) => {
                            const aDistance = prepWord ? Math.abs(a.index - prepWord.index) : a.index;
                            const bDistance = prepWord ? Math.abs(b.index - prepWord.index) : b.index;
                            return aDistance - bDistance;
                        })[0];

                    if (particleWord) {
                        boldIndices.add(particleWord.index);
                    }
                });
            }

            if (type === 'adj' && headSearchTerms.length > 0 && !headSearchTerms.some(term =>
                words.some(word => boldIndices.has(word.index) && isHeadMatch(word.text, term))
            )) {
                const adjectiveCandidate = prepWord
                    ? [...words].reverse().find(word =>
                        word.index > prepWord.index &&
                        !determiners.has(word.normalized) &&
                        !pronounObjects.has(word.normalized) &&
                        !prepForms.has(word.normalized) &&
                        !word.isCapitalized
                    )
                    : null;

                if (adjectiveCandidate) {
                    boldIndices.add(adjectiveCandidate.index);
                }
            }

            const colorIndices = new Set();
            if (prepWord) {
                const prepIsContraction = prepWord.normalized !== normalizeLexeme(prep);
                let startCollecting = prepIsContraction;
                let sawNominalCore = false;
                let collectedWords = 0;

                for (const word of words) {
                    if (word.index <= prepWord.index) continue;
                    if (!startCollecting) {
                        startCollecting = true;
                    }

                    if (word.text.match(/^[,;:.!?]+$/)) break;
                    if (clauseBreakWords.has(word.normalized) && sawNominalCore) break;

                    const isPronounObject = pronounObjects.has(word.normalized);
                    const isDeterminer = determiners.has(word.normalized);
                    const isConnector = objectConnectors.has(word.normalized);
                    const isNumberLike = /^[0-9]/.test(word.text);
                    const isNounLike = word.isCapitalized || isPronounObject || isNumberLike;
                    const canContinueBeforeCore = isDeterminer || isConnector || isNounLike || word.normalized.length > 2;
                    const canContinueAfterCore = isDeterminer || isConnector || isNounLike;

                    if ((!sawNominalCore && !canContinueBeforeCore) || (sawNominalCore && !canContinueAfterCore)) {
                        break;
                    }

                    colorIndices.add(word.index);
                    collectedWords += 1;
                    if (isNounLike) sawNominalCore = true;

                    if (sawNominalCore && collectedWords >= 8) break;
                }

                if (prepIsContraction) {
                    colorIndices.add(prepWord.index);
                }
            }

            return segments.map((segment, index) => {
                if (segment.isSpace) return escapeHtml(segment.text);

                const classes = [];
                if (boldIndices.has(index)) classes.push('font-semibold', 'text-[#1C1C1E]');
                if (colorIndices.has(index)) classes.push('font-medium', caseTextClass);

                const content = escapeHtml(segment.text);
                if (classes.length === 0) return content;

                const tag = boldIndices.has(index) ? 'strong' : 'span';
                return `<${tag} class="${Array.from(new Set(classes)).join(' ')}">${content}</${tag}>`;
            }).join('');
        };

        const normalizeComboKey = (combo) => combo
            .toLowerCase()
            .replace(/^(sich|s\.)\s+/i, '')
            .trim();

        const sortAndDedupEntries = (arr) => {
            if (!arr || arr.length === 0) return [];
            const seen = new Set();
            const unique = [];

            arr.forEach(entry => {
                const key = normalizeComboKey(entry.combo);
                if (seen.has(key)) return;
                seen.add(key);
                unique.push(entry);
            });

            return unique.sort((a, b) => normalizeComboKey(a.combo).localeCompare(normalizeComboKey(b.combo), 'de'));
        };

        const sorted = [...praepositionenCombo].sort((a, b) => {
            const prepCmp = a.prep.localeCompare(b.prep);
            return prepCmp !== 0 ? prepCmp : a.kasus.localeCompare(b.kasus);
        });

        const filtered = sorted.filter(item => {
            const matchesCase = selectedPrepComboCases.size === 0 || selectedPrepComboCases.has(item.kasus);
            const matchesPrep = filterPrepComboPrep.value === 'all' || item.prep === filterPrepComboPrep.value;
            const matchesSearch = !currentPrepComboSearchTerm ||
                item.prep.toLowerCase().includes(currentPrepComboSearchTerm) ||
                item.kasus.toLowerCase().includes(currentPrepComboSearchTerm) ||
                item.norm.some(n => n.combo.toLowerCase().includes(currentPrepComboSearchTerm) || n.ex.toLowerCase().includes(currentPrepComboSearchTerm)) ||
                item.verb.some(v => v.combo.toLowerCase().includes(currentPrepComboSearchTerm) || v.ex.toLowerCase().includes(currentPrepComboSearchTerm)) ||
                item.adj.some(a => a.combo.toLowerCase().includes(currentPrepComboSearchTerm) || a.ex.toLowerCase().includes(currentPrepComboSearchTerm));
            return matchesCase && matchesPrep && matchesSearch;
        });

        const renderEntries = (arr, kasus, type) => {
            const entries = sortAndDedupEntries(arr);
            if (entries.length === 0) return '<span class="text-sm text-gray-300">-</span>';
            return `<ul class="list-none space-y-3">
                ${entries.map(entry => `
                    <li class="pl-3 border-l-2 border-gray-100">
                        <div class="text-[13px] text-gray-500 italic mt-0.5 leading-snug">${styleSentenceMarkup(entry, kasus, type)}</div>
                    </li>
                `).join('')}
            </ul>`;
        };

        filtered.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'group hover:bg-gray-50/50 transition-colors align-top border-b border-gray-100 last:border-b-0';
            const cls = caseStyles[item.kasus] || 'bg-gray-100 text-gray-700';

            tr.innerHTML = `
                <td class="px-3 py-4 align-top border-r border-gray-100 w-24">
                    <div class="font-semibold text-black leading-tight">
                        <div>${escapeHtml(item.prep)}</div>
                        <div class="mt-1 text-xs ${cls} bg-transparent px-0 py-0 rounded-none">${escapeHtml(item.kasus)}</div>
                    </div>
                </td>
                <td class="px-4 py-4 align-top border-r border-gray-100">${renderEntries(item.norm, item.kasus, 'norm')}</td>
                <td class="px-4 py-4 align-top border-r border-gray-100">${renderEntries(item.verb, item.kasus, 'verb')}</td>
                <td class="px-4 py-4 align-top">${renderEntries(item.adj, item.kasus, 'adj')}</td>
            `;

            tbody.appendChild(tr);
        });
    };

    const applyPrepTagStyle = (btn) => {
        const val = btn.dataset.value;
        const active = val === 'all' ? selectedPrepCases.size === 0 : selectedPrepCases.has(val);
        btn.classList.remove('bg-[#E5E5EA]','text-[#1C1C1E]','hover:bg-[#D1D1D6]','bg-green-100','text-green-700','bg-blue-100','text-blue-700','bg-yellow-100','text-yellow-700','bg-[#007AFF]','text-white');
        if (active) {
            if (val === 'all') btn.classList.add('bg-[#007AFF]', 'text-white');
            else btn.classList.add(...(caseStyles[val] || 'bg-[#007AFF] text-white').split(' '));
        } else {
            btn.classList.add('bg-[#E5E5EA]','text-[#1C1C1E]','hover:bg-[#D1D1D6]');
        }
    };

    const createPrepTag = (val, label) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className = 'prep-tag px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200';
        btn.dataset.value = val;
        applyPrepTagStyle(btn);
        btn.addEventListener('click', () => {
            if (val === 'all') selectedPrepCases.clear();
            else {
                if (selectedPrepCases.has(val)) selectedPrepCases.delete(val);
                else selectedPrepCases.add(val);
            }
            document.querySelectorAll('.prep-tag').forEach(applyPrepTagStyle);
            renderPraepositionenTable();
        });
        return btn;
    };

    const initPrepFilters = () => {
        filterPrepCaseTags.innerHTML = '<span class="text-sm font-semibold text-[#8E8E93] mr-1">Kasus:</span>';
        filterPrepCaseTags.appendChild(createPrepTag('all', 'Alle'));
        ['GEN', 'DAT', 'AKK'].forEach(c => filterPrepCaseTags.appendChild(createPrepTag(c, c)));

        if (filterPrepPrep) {
            const preps = Array.from(new Set(praepositionen.map(item => item.prep))).sort((a, b) => a.localeCompare(b, 'de'));
            preps.forEach(prep => {
                const opt = document.createElement('option');
                opt.value = prep;
                opt.textContent = prep;
                filterPrepPrep.appendChild(opt);
            });
        }
    };

    const applyPrepComboTagStyle = (btn) => {
        const val = btn.dataset.value;
        const active = val === 'all' ? selectedPrepComboCases.size === 0 : selectedPrepComboCases.has(val);
        btn.classList.remove('bg-[#E5E5EA]','text-[#1C1C1E]','hover:bg-[#D1D1D6]','bg-green-100','text-green-700','bg-blue-100','text-blue-700','bg-yellow-100','text-yellow-700','bg-[#007AFF]','text-white');
        if (active) {
            if (val === 'all') btn.classList.add('bg-[#007AFF]', 'text-white');
            else btn.classList.add(...(caseStyles[val] || 'bg-[#007AFF] text-white').split(' '));
        } else {
            btn.classList.add('bg-[#E5E5EA]','text-[#1C1C1E]','hover:bg-[#D1D1D6]');
        }
    };

    const createPrepComboTag = (val, label) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className = 'prep-combo-tag px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200';
        btn.dataset.value = val;
        applyPrepComboTagStyle(btn);
        btn.addEventListener('click', () => {
            if (val === 'all') selectedPrepComboCases.clear();
            else {
                if (selectedPrepComboCases.has(val)) selectedPrepComboCases.delete(val);
                else selectedPrepComboCases.add(val);
            }
            document.querySelectorAll('.prep-combo-tag').forEach(applyPrepComboTagStyle);
            renderPraepositionenComboTable();
        });
        return btn;
    };

    const initPrepComboFilters = () => {
        filterPrepComboCaseTags.innerHTML = '<span class="text-sm font-semibold text-[#8E8E93] mr-1">Kasus:</span>';
        filterPrepComboCaseTags.appendChild(createPrepComboTag('all', 'Alle'));
        ['DAT', 'AKK'].forEach(c => filterPrepComboCaseTags.appendChild(createPrepComboTag(c, c)));

        const preps = Array.from(new Set(praepositionenCombo.map(item => item.prep))).sort((a, b) => a.localeCompare(b, 'de'));
        preps.forEach(prep => {
            const opt = document.createElement('option');
            opt.value = prep;
            opt.textContent = prep;
            filterPrepComboPrep.appendChild(opt);
        });
    };

    filterPrepPrep?.addEventListener('change', renderPraepositionenTable);
    filterPrepComboPrep?.addEventListener('change', renderPraepositionenComboTable);
    prepComboSearchInput?.addEventListener('input', (e) => {
        currentPrepComboSearchTerm = e.target.value.toLowerCase().trim();
        renderPraepositionenComboTable();
    });

    // --- Initial Render ---
    renderVerbenTable(verbs);
    renderVerbComboTable();
    renderPronomenTable();
    renderArtikelTable('artikel-bestimmt-table', artikelData.bestimmter);
    renderArtikelTable('artikel-unbestimmt-table', artikelData.unbestimmter);
    renderArtikelTable('artikel-null-table', artikelData.nullartikel);
    initPrepFilters();
    initPrepComboFilters();
    compactPraepositionenHeaders();
    renderPraepositionenTable();
    renderPraepositionenComboTable();
    renderSubstantivFamilienTable();
    switchPage('basis');

    // Export for external use
    window.switchPage = switchPage;
});
