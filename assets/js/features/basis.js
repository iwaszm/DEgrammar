import { pronomen } from '../../data/pronomen.js';
import { artikelData } from '../../data/artikel.js';
import { escapeHtml, renderPronounLabel, sanitizeTrustedMarkup } from '../utils/html.js';

export function initBasis() {
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
    renderPronomenTable();
    renderArtikelTable('artikel-bestimmt-table', artikelData.bestimmter);
    renderArtikelTable('artikel-unbestimmt-table', artikelData.unbestimmter);
    renderArtikelTable('artikel-null-table', artikelData.nullartikel);
}
