import { verbs } from '../../data/verbs.js';
import { verbCombo } from '../../data/verbCombo.js';
import { escapeHtml, safeItalicizeEnding } from '../utils/html.js';
import { showEmptyRow } from '../utils/table.js';

export function initVerbs() {
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
        if (sortedData.length === 0) showEmptyRow(tbodyVerben, 6);
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
        if (filteredGroups.length === 0) showEmptyRow(tbodyVerbCombo, 3);
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
    renderVerbenTable(verbs);
    renderVerbComboTable();
}
