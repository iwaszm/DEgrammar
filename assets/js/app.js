import { verbs } from '../data/verbs.js';
import { pronomen } from '../data/pronomen.js';
import { artikelData } from '../data/artikel.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navigation Logic ---
    const btnVerben = document.getElementById('nav-verben');
    const btnPronomen = document.getElementById('nav-pronomen');
    const btnArtikel = document.getElementById('nav-artikel');
    const pageVerben = document.getElementById('page-verben');
    const pagePronomen = document.getElementById('page-pronomen');
    const pageArtikel = document.getElementById('page-artikel');

    function switchPage(page) {
        const pages = [
            { id: 'verben', btn: btnVerben, el: pageVerben },
            { id: 'pronomen', btn: btnPronomen, el: pagePronomen },
            { id: 'artikel', btn: btnArtikel, el: pageArtikel }
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

    // --- Verben Logic ---
    const tbodyVerben = document.querySelector('#verbs-table tbody');
    const filterTypTags = document.getElementById('filter-typ-tags');
    const filterVokal = document.getElementById('filter-vokal');
    
    let currentTyp = 'all';

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

    const createTag = (typValue, label) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className = `typ-tag px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
            typValue === currentTyp 
            ? 'bg-[#007AFF] text-white' 
            : 'bg-[#E5E5EA] text-[#1C1C1E] hover:bg-[#D1D1D6]'
        }`;
        btn.dataset.value = typValue;
        
        btn.addEventListener('click', () => {
            currentTyp = typValue;
            document.querySelectorAll('.typ-tag').forEach(t => {
                if(t.dataset.value === currentTyp) {
                    t.classList.remove('bg-[#E5E5EA]', 'text-[#1C1C1E]', 'hover:bg-[#D1D1D6]');
                    t.classList.add('bg-[#007AFF]', 'text-white');
                } else {
                    t.classList.remove('bg-[#007AFF]', 'text-white');
                    t.classList.add('bg-[#E5E5EA]', 'text-[#1C1C1E]', 'hover:bg-[#D1D1D6]');
                }
            });
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
            const matchTyp = currentTyp === 'all' || verb.type === currentTyp;
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

    // --- Initial Render ---
    renderVerbenTable(verbs);
    renderPronomenTable();
    renderArtikelTable('artikel-bestimmt-table', artikelData.bestimmter);
    renderArtikelTable('artikel-unbestimmt-table', artikelData.unbestimmter);
    renderArtikelTable('artikel-null-table', artikelData.nullartikel);
});
