import { verbs } from '../data/verbs.js';
import { pronomen } from '../data/pronomen.js';
import { artikelData } from '../data/artikel.js';
import { praepositionen } from '../data/praepositionen.js';
import { praepositionenCombo } from '../data/praepositionenCombo.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navigation Logic ---
    const btnHome = document.getElementById('nav-home');
    const btnVerben = document.getElementById('nav-verben');
    const btnPronomen = document.getElementById('nav-pronomen');
    const btnArtikel = document.getElementById('nav-artikel');
    const btnPraepositionen = document.getElementById('nav-praepositionen');
    const btnPraepositionenCombo = document.getElementById('nav-praepositionen-combo');
    
    const pageHome = document.getElementById('page-home');
    const pageVerben = document.getElementById('page-verben');
    const pagePronomen = document.getElementById('page-pronomen');
    const pageArtikel = document.getElementById('page-artikel');
    const pagePraepositionen = document.getElementById('page-praepositionen');
    const pagePraepositionenCombo = document.getElementById('page-praepositionen-combo');

    const navContainer = document.getElementById('main-nav-container');

    function switchPage(pageId) {
        const pages = [
            { id: 'home', btn: btnHome, el: pageHome },
            { id: 'verben', btn: btnVerben, el: pageVerben },
            { id: 'pronomen', btn: btnPronomen, el: pagePronomen },
            { id: 'artikel', btn: btnArtikel, el: pageArtikel },
            { id: 'praepositionen', btn: btnPraepositionen, el: pagePraepositionen },
            { id: 'praepositionen-combo', btn: btnPraepositionenCombo, el: pagePraepositionenCombo }
        ];

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
    btnVerben.addEventListener('click', () => switchPage('verben'));
    btnPronomen.addEventListener('click', () => switchPage('pronomen'));
    btnArtikel.addEventListener('click', () => switchPage('artikel'));
    btnPraepositionen.addEventListener('click', () => switchPage('praepositionen'));
    btnPraepositionenCombo.addEventListener('click', () => switchPage('praepositionen-combo'));

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

    const italicizeEnding = (word) => {
        const endings = ['test','tet','ten','te','est','et','st','t','en','e'];
        const w = String(word);
        for (const end of endings) {
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
                ${verb.conjugations.map(c => `<td class="px-3 pt-4 pb-1 whitespace-nowrap">${italicizeEnding(c)}</td>`).join('')}
            `;
            tbodyVerben.appendChild(tr1);

            const tr2 = document.createElement('tr');
            tr2.className = 'verb-row-2 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors';
            tr2.innerHTML = `
                <td class="px-4 pb-4 pt-1 text-sm text-[#8E8E93] whitespace-nowrap">${verb.pastInfo}</td>
                ${verb.pastConjugations.map(c => `<td class="px-3 pb-4 pt-1 text-[#8E8E93] whitespace-nowrap">${italicizeEnding(c)}</td>`).join('')}
            `;
            tbodyVerben.appendChild(tr2);
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

    // --- Global Search Logic ---
    const searchInput = document.getElementById('global-search');
    let currentSearchTerm = '';

    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        applyAllFilters();
    });

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
                tdPrepCase.className = "px-4 py-4 align-top border-r border-gray-100";
                tdPrepCase.innerHTML = `<div class="flex items-center gap-2 font-semibold text-black"><span>${item.prep} +</span><span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}">${mode.case}</span></div>`;
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

        const renderEntries = (arr) => {
            const entries = sortAndDedupEntries(arr);
            if (entries.length === 0) return '<span class="text-sm text-gray-300">-</span>';
            return `<ul class="list-none space-y-3">
                ${entries.map(entry => `
                    <li class="pl-3 border-l-2 border-gray-100">
                        <div class="text-sm font-semibold text-[#1C1C1E]">${entry.combo}</div>
                        <div class="text-[13px] text-gray-400 italic mt-0.5 leading-snug">${entry.ex}</div>
                    </li>
                `).join('')}
            </ul>`;
        };

        filtered.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'group hover:bg-gray-50/50 transition-colors align-top border-b border-gray-100 last:border-b-0';
            const cls = caseStyles[item.kasus] || 'bg-gray-100 text-gray-700';

            tr.innerHTML = `
                <td class="px-4 py-4 align-top border-r border-gray-100"><div class="flex items-center gap-2 font-semibold text-black"><span>${item.prep} +</span><span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}">${item.kasus}</span></div></td>
                <td class="px-4 py-4 align-top border-r border-gray-100">${renderEntries(item.norm)}</td>
                <td class="px-4 py-4 align-top border-r border-gray-100">${renderEntries(item.verb)}</td>
                <td class="px-4 py-4 align-top">${renderEntries(item.adj)}</td>
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
    renderPronomenTable();
    renderArtikelTable('artikel-bestimmt-table', artikelData.bestimmter);
    renderArtikelTable('artikel-unbestimmt-table', artikelData.unbestimmter);
    renderArtikelTable('artikel-null-table', artikelData.nullartikel);
    initPrepFilters();
    initPrepComboFilters();
    renderPraepositionenTable();
    renderPraepositionenComboTable();

    // Export for external use
    window.switchPage = switchPage;
});
