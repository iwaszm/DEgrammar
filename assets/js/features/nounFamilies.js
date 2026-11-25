import { substantivFamilienHeaders, substantivFamilienRows } from '../../data/substantivFamilien.js';
import { substantivFamilienPrefixHints, substantivFamilienGlosses } from '../../data/substantivFamilienGlosses.js';
import { escapeHtml } from '../utils/html.js';
import { showEmptyRow } from '../utils/table.js';

export function initNounFamilies() {
    const substantivFamilienSearchInput = document.getElementById('substantiv-familien-search');
    let currentSubstantivFamilienSearchTerm = '';
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
        if (filteredRows.length === 0) showEmptyRow(tbody, substantivFamilienHeaders.length);
    };

    substantivFamilienSearchInput?.addEventListener('input', (e) => {
        currentSubstantivFamilienSearchTerm = e.target.value.toLowerCase().trim();
        renderSubstantivFamilienTable();
    });
    renderSubstantivFamilienTable();
}
