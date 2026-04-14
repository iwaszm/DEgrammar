import { verbs } from '../data/verbs.js';
import { pronomen } from '../data/pronomen.js';
import { artikelData } from '../data/artikel.js';
import { praepositionen } from '../data/praepositionen.js';
import { praepositionenCombo } from '../data/praepositionenCombo.js';
import { verbCombo } from '../data/verbCombo.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navigation Logic ---
    const btnHome = document.getElementById('nav-home');
    const btnBasis = document.getElementById('nav-basis');
    const btnVerben = document.getElementById('nav-verben');
    const btnVerbenPage = document.getElementById('nav-verben-page');
    const btnVerbCombo = document.getElementById('nav-verb-combo');
    const btnPronomen = document.getElementById('nav-pronomen');
    const btnArtikel = document.getElementById('nav-artikel');
    const btnPraepositionen = document.getElementById('nav-praepositionen');
    const btnPraepositionenPage = document.getElementById('nav-praepositionen-page');
    const btnPraepositionenCombo = document.getElementById('nav-praepositionen-combo');
    
    const pageHome = document.getElementById('page-home');
    const pageVerben = document.getElementById('page-verben');
    const pageVerbCombo = document.getElementById('page-verb-combo');
    const pagePronomen = document.getElementById('page-pronomen');
    const pageArtikel = document.getElementById('page-artikel');
    const pagePraepositionen = document.getElementById('page-praepositionen');
    const pagePraepositionenCombo = document.getElementById('page-praepositionen-combo');

    const navContainer = document.getElementById('main-nav-container');
    const navBasisMenu = document.getElementById('nav-basis-menu');
    const navVerbenMenu = document.getElementById('nav-verben-menu');
    const navPraepositionenMenu = document.getElementById('nav-praepositionen-menu');

    const closeNavMenus = () => {
        navBasisMenu?.classList.add('hidden');
        navVerbenMenu?.classList.add('hidden');
        navPraepositionenMenu?.classList.add('hidden');
    };

    const toggleNavMenu = (menu) => {
        if (!menu) return;
        const willOpen = menu.classList.contains('hidden');
        [navBasisMenu, navVerbenMenu, navPraepositionenMenu]
            .filter(otherMenu => otherMenu && otherMenu !== menu)
            .forEach(otherMenu => otherMenu.classList.add('hidden'));
        menu.classList.toggle('hidden', !willOpen);
    };

    const parentNavButtons = [btnBasis, btnVerben, btnPraepositionen];
    const resetNavButtonState = (button) => {
        if (!button) return;
        button.classList.remove('bg-white', 'shadow-sm', 'text-black');
        button.classList.add('text-[#8E8E93]');
    };

    function switchPage(pageId) {
        const pages = [
            { id: 'home', btn: btnHome, el: pageHome },
            { id: 'verben', btn: btnVerben, el: pageVerben },
            { id: 'verb-combo', btn: btnVerbCombo, el: pageVerbCombo },
            { id: 'pronomen', btn: btnPronomen, el: pagePronomen },
            { id: 'artikel', btn: btnArtikel, el: pageArtikel },
            { id: 'praepositionen', btn: btnPraepositionen, el: pagePraepositionen },
            { id: 'praepositionen-combo', btn: btnPraepositionenCombo, el: pagePraepositionenCombo }
        ];

        closeNavMenus();
        parentNavButtons.forEach(resetNavButtonState);

        pages.forEach(p => {
            if (p.id === pageId) {
                p.el.classList.remove('hidden');
                if (p.btn) {
                    p.btn.classList.add('bg-white', 'shadow-sm', 'text-black');
                    p.btn.classList.remove('text-[#8E8E93]');
                }
            } else {
                p.el.classList.add('hidden');
                if (p.btn) {
                    p.btn.classList.remove('bg-white', 'shadow-sm', 'text-black');
                    p.btn.classList.add('text-[#8E8E93]');
                }
            }
        });

        const activeParentMap = {
            'pronomen': btnBasis,
            'artikel': btnBasis,
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

        // Toggle nav visibility
        if (pageId === 'home') {
            navContainer.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                if (pageHome.classList.contains('hidden')) return; 
                navContainer.classList.add('hidden');
            }, 200);
        } else {
            navContainer.classList.remove('hidden');
            setTimeout(() => {
                navContainer.classList.remove('opacity-0', 'pointer-events-none');
            }, 10);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (btnHome) btnHome.addEventListener('click', () => switchPage('home'));
    btnBasis?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNavMenu(navBasisMenu);
    });
    btnVerben.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNavMenu(navVerbenMenu);
    });
    btnVerbenPage?.addEventListener('click', () => switchPage('verben'));
    btnVerbCombo.addEventListener('click', () => switchPage('verb-combo'));
    btnPronomen.addEventListener('click', () => switchPage('pronomen'));
    btnArtikel.addEventListener('click', () => switchPage('artikel'));
    btnPraepositionen.addEventListener('click', (e) => {
        e.stopPropagation();
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

    const italicizeEnding = (word, infinitive = '') => {
        const stem = String(infinitive).replace(/(en|n)$/, '');
        const stemAwareEndings = ['etest', 'etet', 'eten', 'ete', 'test', 'tet', 'ten', 'te', 'est', 'et', 'st', 't', 'en', 'e'];
        const fallbackEndings = ['test', 'tet', 'ten', 'te', 'est', 'et', 'st', 't', 'en', 'e'];
        const w = String(word);

        for (const end of stemAwareEndings) {
            if (stem && w.length > end.length && w.endsWith(end) && w.slice(0, -end.length) === stem) {
                return w.slice(0, -end.length) + '<i>' + end + '</i>';
            }
        }

        for (const end of fallbackEndings) {
            if (w.length > end.length && w.endsWith(end)) {
                return w.slice(0, -end.length) + '<i>' + end + '</i>';
            }
        }
        return w;
    };

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
                        <span>${verb.infinitive}</span>
                        <span class="inline-block w-2.5 h-2.5 rounded-full ${typeDotClass}" title="${verb.type}"></span>
                    </div>
                </td>
                ${verb.conjugations.map(c => `<td class="px-3 pt-4 pb-1 whitespace-nowrap">${italicizeEnding(c, verb.infinitive)}</td>`).join('')}
            `;
            tbodyVerben.appendChild(tr1);

            const tr2 = document.createElement('tr');
            tr2.className = 'verb-row-2 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors';
            tr2.innerHTML = `
                <td class="px-4 pb-4 pt-1 text-sm text-[#8E8E93] whitespace-nowrap">${verb.pastInfo}</td>
                ${verb.pastConjugations.map(c => `<td class="px-3 pb-4 pt-1 text-[#8E8E93] whitespace-nowrap">${italicizeEnding(c, verb.infinitive)}</td>`).join('')}
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
        const escapeHtml = (value) => String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
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
                    cells.push(`<td rowspan="${group.rows.length}" class="px-4 py-4 font-semibold text-black border-r border-gray-100 align-top">${group.verb}</td>`);
                }

                cells.push(`<td class="px-4 py-4 text-[#1C1C1E] border-r border-gray-100 align-top">${row.combo}</td>`);
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
    let currentSearchTerm = '';

    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        applyAllFilters();
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

    function applyAllFilters() {
        // Apply search to all active views
        renderVerbenTable(getFilteredVerbs());
        renderPraepositionenTable();
        renderPraepositionenComboTable();
        // Personal and Artikel are small fixed tables, but we could filter rows if needed.
    }

    function getFilteredVerbs() {
        const selectedVokal = filterVokal.value;
        return verbs.filter(verb => {
            const matchTyp = selectedTypes.size === 0 || selectedTypes.has(verb.type);
            const matchVokal = selectedVokal === 'all' || verb.stemVowel === selectedVokal;
            const matchSearch = !currentSearchTerm || 
                               verb.infinitive.toLowerCase().includes(currentSearchTerm) ||
                               verb.pastInfo.toLowerCase().includes(currentSearchTerm);
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
                <td class="px-5 py-4 font-semibold text-black">${p.nom}</td>
                <td class="px-4 py-4 text-gray-700">${p.possessiv}</td>
                <td class="px-4 py-4 text-gray-700">${p.dativ}</td>
                <td class="px-4 py-4 text-gray-700">${p.akkusativ}</td>
                <td class="px-4 py-4 text-center font-medium text-[#007AFF]">${p.reflexiv}</td>
            `;
            tbodyPronomen.appendChild(tr);
        });
    };

    // --- Artikel Logic ---
    const renderArtikelTable = (tbodyId, data) => {
        const tbody = document.querySelector(`#${tbodyId} tbody`);
        if (!tbody) return;
        tbody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.className = 'group hover:bg-gray-50/50 transition-colors';
            const cellClass = (idx) => idx === 0 ? "px-5 py-4 font-semibold text-[#8E8E93] align-middle" : "px-4 py-4 text-center align-middle";
            const isComplex = tbodyId === 'artikel-unbestimmt-table';
            tr.innerHTML = `
                <td class="${cellClass(0)}">${row.kasus}</td>
                <td class="${cellClass(1)}">${isComplex ? row.m : `<div class="font-medium text-black">${row.m}</div>`}</td>
                <td class="${cellClass(2)}">${isComplex ? row.f : `<div class="font-medium text-black">${row.f}</div>`}</td>
                <td class="${cellClass(3)}">${isComplex ? row.n : `<div class="font-medium text-black">${row.n}</div>`}</td>
                <td class="${cellClass(4)}">${isComplex ? row.pl : `<div class="font-medium text-black">${row.pl}</div>`}</td>
            `;
            tbody.appendChild(tr);
        });
    };

    // --- Präpositionen Logic ---
    const filterPrepCaseTags = document.getElementById('filter-prep-case-tags');
    const filterPrepComboCaseTags = document.getElementById('filter-prep-combo-case-tags');
    const filterPrepComboPrep = document.getElementById('filter-prep-combo-prep');
    const prepComboSearchInput = document.getElementById('prep-combo-search');
    const selectedPrepCases = new Set(); 
    const selectedPrepComboCases = new Set();
    let currentPrepComboSearchTerm = '';

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
            const matchesSearch = !currentSearchTerm || 
                                 item.prep.toLowerCase().includes(currentSearchTerm) ||
                                 item.modes.some(m => 
                                    m.space.some(s => s.rule.toLowerCase().includes(currentSearchTerm)) ||
                                    m.time.some(t => t.rule.toLowerCase().includes(currentSearchTerm))
                                 );
            return matchesCase && matchesSearch;
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
                        <div>${item.prep}</div>
                        <div class="mt-1 text-xs ${cls} bg-transparent px-0 py-0 rounded-none">${mode.case}</div>
                    </div>
                `;
                tr.appendChild(tdPrepCase);

                const renderRules = (arr) => {
                    if (!arr || arr.length === 0) return '';
                    return `<ul class="list-disc pl-4 space-y-3">
                        ${arr.map(r => `<li class="text-sm text-[#1C1C1E] leading-snug">${r.rule}<div class="text-[13px] text-gray-400 italic mt-0.5 leading-snug">${r.ex}</div></li>`).join('')}
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

    const renderPraepositionenComboTable = () => {
        const tbody = document.querySelector('#praepositionen-combo-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const escapeHtml = (value) => String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

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
                        <div>${item.prep}</div>
                        <div class="mt-1 text-xs ${cls} bg-transparent px-0 py-0 rounded-none">${item.kasus}</div>
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
            opt.textContent = `Präposition: ${prep}`;
            filterPrepComboPrep.appendChild(opt);
        });
    };

    filterPrepComboPrep.addEventListener('change', renderPraepositionenComboTable);
    prepComboSearchInput.addEventListener('input', (e) => {
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
    renderPraepositionenTable();
    renderPraepositionenComboTable();
    switchPage('home');

    // Export for external use
    window.switchPage = switchPage;
});
