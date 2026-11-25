import { praepositionen } from '../../data/praepositionen.js';
import { praepositionenCombo } from '../../data/praepositionenCombo.js';
import { escapeHtml, sanitizeTrustedMarkup } from '../utils/html.js';
import { showEmptyRow } from '../utils/table.js';

export function initPrepositions() {
    // --- Präpositionen Logic ---
    const filterPrepCaseTags = document.getElementById('filter-prep-case-tags');
    const filterPrepPrep = document.getElementById('filter-prep-prep');
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
        if (filtered.length === 0) showEmptyRow(tbody, 3);
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
        if (filtered.length === 0) showEmptyRow(tbody, 4);
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
    initPrepFilters();
    initPrepComboFilters();
    compactPraepositionenHeaders();
    renderPraepositionenTable();
    renderPraepositionenComboTable();
}
