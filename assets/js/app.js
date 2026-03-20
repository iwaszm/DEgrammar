import { verbs } from '../data/verbs.js';
import { pronomen } from '../data/pronomen.js';
import { artikelData } from '../data/artikel.js';
import { praepositionen } from '../data/praepositionen.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navigation Logic ---
    const btnVerben = document.getElementById('nav-verben');
    const btnPronomen = document.getElementById('nav-pronomen');
    const btnArtikel = document.getElementById('nav-artikel');
    const btnPraepositionen = document.getElementById('nav-praepositionen');
    const pageVerben = document.getElementById('page-verben');
    const pagePronomen = document.getElementById('page-pronomen');
    const pageArtikel = document.getElementById('page-artikel');
    const pagePraepositionen = document.getElementById('page-praepositionen');

    function switchPage(page) {
        const pages = [
            { id: 'verben', btn: btnVerben, el: pageVerben },
            { id: 'pronomen', btn: btnPronomen, el: pagePronomen },
            { id: 'artikel', btn: btnArtikel, el: pageArtikel },
            { id: 'praepositionen', btn: btnPraepositionen, el: pagePraepositionen }
        ];

        pages.forEach(p => {
            if (p.id === page) {
                p.el.classList.remove('hidden');
                p.btn.classList.add('bg-white', 'shadow-sm', 'text-black');
                p.btn.classList.remove('text-[#8E8E93]');
            } else {
                p.el.classList.add('hidden');
                p.btn.classList.remove('bg-white', 'shadow-sm', 'text-black');
                p.btn.classList.add('text-[#8E8E93]');
            }
        });
    }

    btnVerben.addEventListener('click', () => switchPage('verben'));
    btnPronomen.addEventListener('click', () => switchPage('pronomen'));
    btnArtikel.addEventListener('click', () => switchPage('artikel'));
    btnPraepositionen.addEventListener('click', () => switchPage('praepositionen'));

    // --- Verben Logic ---
    const tbodyVerben = document.querySelector('#verbs-table tbody');
    const filterTypTags = document.getElementById('filter-typ-tags');
    const filterVokal = document.getElementById('filter-vokal');
    
    const selectedTypes = new Set(); // empty = all

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
        // Sort alphabetically by infinitive
        const sortedData = [...data].sort((a, b) => a.infinitive.localeCompare(b.infinitive));
        
        tbodyVerben.innerHTML = '';
        sortedData.forEach(verb => {
            const tr1 = document.createElement('tr');
            tr1.className = 'verb-row-1 group hover:bg-gray-50/50 transition-colors';
            tr1.innerHTML = `
                <td class="px-5 pt-4 pb-1 font-semibold text-black">${verb.infinitive}</td>
                ${verb.conjugations.map(c => `<td class="px-4 pt-4 pb-1">${italicizeEnding(c)}</td>`).join('')}
                <td rowspan="2" class="px-4 py-4 align-middle text-center border-b border-gray-100">
                    <span class="verb-typ inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${verb.typeClass}">${verb.type}</span>
                </td>
                <td rowspan="2" class="px-4 py-4 align-middle text-center border-b border-gray-100 text-[#8E8E93] verb-vokal ${verb.stemVowel !== '-' ? 'font-mono text-[#1C1C1E]' : ''}">${verb.stemVowel}</td>
            `;
            tbodyVerben.appendChild(tr1);

            const tr2 = document.createElement('tr');
            tr2.className = 'verb-row-2 border-b border-gray-100 group hover:bg-gray-50/50 transition-colors';
            tr2.innerHTML = `
                <td class="px-5 pb-4 pt-1 text-sm text-[#8E8E93]">${verb.pastInfo}</td>
                ${verb.pastConjugations.map(c => `<td class="px-4 pb-4 pt-1 text-[#8E8E93]">${italicizeEnding(c)}</td>`).join('')}
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
        const isAll = value === 'all';
        const active = isAll ? selectedTypes.size === 0 : selectedTypes.has(value);

        // reset
        btn.classList.remove(
            'bg-[#E5E5EA]','text-[#1C1C1E]','hover:bg-[#D1D1D6]',
            'bg-red-100','text-red-700',
            'bg-green-100','text-green-700',
            'bg-amber-100','text-amber-700',
            'bg-purple-100','text-purple-700'
        );

        if (active) {
            if (isAll) {
                btn.classList.add('bg-[#007AFF]', 'text-white');
            } else {
                btn.classList.add(...(typeStyle[value] || 'bg-[#007AFF] text-white').split(' '));
            }
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
            if (typValue === 'all') {
                selectedTypes.clear();
            } else {
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
    Array.from(types).sort().forEach(t => {
        filterTypTags.appendChild(createTag(t, t));
    });

    Array.from(vokals).sort().forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = `Stammvokal: ${v}`;
        filterVokal.appendChild(opt);
    });

    function applyFilters() {
        const selectedVokal = filterVokal.value;
        const filtered = verbs.filter(verb => {
            const matchTyp = selectedTypes.size === 0 || selectedTypes.has(verb.type);
            const matchVokal = selectedVokal === 'all' || verb.stemVowel === selectedVokal;
            return matchTyp && matchVokal;
        });
        renderVerbenTable(filtered);
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
            
            // Helper to determine text alignment and styling
            const cellClass = (idx) => idx === 0 
                ? "px-5 py-4 font-semibold text-[#8E8E93] align-middle" // Kasus column
                : "px-4 py-4 text-center align-middle"; // Other columns

            // For simpler tables (Bestimmter, Nullartikel), value is just a string.
            // For complex table (Unbestimmter), value is HTML string.
            // We can treat them uniformly if data structure aligns.
            
            // Check if it is simple or complex (unbestimmter has HTML in data)
            const isComplex = tbodyId === 'artikel-unbestimmt-table';
            
            // Bestimmter/Nullartikel structure: { kasus, m, f, n, pl }
            // Unbestimmter structure: { kasus, m, f, n, pl } (values are HTML)
            
            // We just render innerHTML for m, f, n, pl
            tr.innerHTML = `
                <td class="${cellClass(0)}">${row.kasus}</td>
                <td class="${cellClass(1)}">
                    ${isComplex ? row.m : `<div class="font-medium text-black">${row.m}</div>`}
                </td>
                <td class="${cellClass(2)}">
                    ${isComplex ? row.f : `<div class="font-medium text-black">${row.f}</div>`}
                </td>
                <td class="${cellClass(3)}">
                    ${isComplex ? row.n : `<div class="font-medium text-black">${row.n}</div>`}
                </td>
                <td class="${cellClass(4)}">
                    ${isComplex ? row.pl : `<div class="font-medium text-black">${row.pl}</div>`}
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    // --- Präpositionen Logic ---
    const renderPraepositionenTable = () => {
        const tbody = document.querySelector('#praepositionen-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const caseTagClass = {
            GEN: 'bg-yellow-100 text-yellow-700',
            DAT: 'bg-green-100 text-green-700',
            AKK: 'bg-blue-100 text-blue-700'
        };

        praepositionen.forEach(item => {
            const rowCount = item.modes.length;

            item.modes.forEach((mode, index) => {
                const tr = document.createElement('tr');
                tr.className = 'group hover:bg-gray-50/50 transition-colors align-top border-b border-gray-100 last:border-b-0';

                // 1. Präposition (Rowspan if first)
                if (index === 0) {
                    const tdPrep = document.createElement('td');
                    tdPrep.className = "px-5 py-4 font-bold text-lg text-black align-top border-r border-gray-100 bg-white group-hover:bg-gray-50/50";
                    tdPrep.rowSpan = rowCount;
                    tdPrep.textContent = item.prep;
                    tr.appendChild(tdPrep);
                }

                // 2. Case Tag
                const tdCase = document.createElement('td');
                tdCase.className = "px-4 py-4 text-center align-top border-r border-gray-100";
                const cls = caseTagClass[mode.case] || 'bg-gray-100 text-gray-700';
                tdCase.innerHTML = `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cls}">${mode.case}</span>`;
                tr.appendChild(tdCase);

                // Helper for Rule+Ex list
                const renderRules = (arr) => {
                    if (!arr || arr.length === 0) return '<span class="text-xs text-gray-300">-</span>';
                    return `<ul class="list-disc pl-4 space-y-3">
                        ${arr.map(r => `
                            <li class="text-sm text-[#1C1C1E] leading-snug">
                                ${r.rule}
                                <div class="text-[13px] text-gray-400 italic mt-0.5 leading-snug">${r.ex}</div>
                            </li>
                        `).join('')}
                    </ul>`;
                };

                // Helper for Combo list
                const renderCombos = (arr) => {
                    if (!arr || arr.length === 0) return '<span class="text-xs text-gray-300">-</span>';
                    return `<ul class="list-none space-y-2">
                        ${arr.map(c => `
                            <li class="text-sm text-[#1C1C1E] leading-snug pl-2 border-l-2 border-gray-100">
                                ${c}
                            </li>
                        `).join('')}
                    </ul>`;
                };

                // 3. Space
                const tdSpace = document.createElement('td');
                tdSpace.className = "px-4 py-4 align-top border-r border-gray-100";
                tdSpace.innerHTML = renderRules(mode.space);
                tr.appendChild(tdSpace);

                // 4. Time
                const tdTime = document.createElement('td');
                tdTime.className = "px-4 py-4 align-top border-r border-gray-100";
                tdTime.innerHTML = renderRules(mode.time);
                tr.appendChild(tdTime);

                // 5. Verb Fixed
                const tdVerb = document.createElement('td');
                tdVerb.className = "px-4 py-4 align-top border-r border-gray-100";
                tdVerb.innerHTML = renderCombos(mode.verbFixed);
                tr.appendChild(tdVerb);

                // 6. Adj Fixed
                const tdAdj = document.createElement('td');
                tdAdj.className = "px-4 py-4 align-top";
                tdAdj.innerHTML = renderCombos(mode.adjFixed);
                tr.appendChild(tdAdj);

                tbody.appendChild(tr);
            });
        });
    };

    // --- Initial Render ---
    renderVerbenTable(verbs);
    renderPronomenTable();
    renderArtikelTable('artikel-bestimmt-table', artikelData.bestimmter);
    renderArtikelTable('artikel-unbestimmt-table', artikelData.unbestimmter);
    renderArtikelTable('artikel-null-table', artikelData.nullartikel);
    renderPraepositionenTable();
});
