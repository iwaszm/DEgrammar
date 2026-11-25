export function showEmptyRow(tbody, columnCount) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = columnCount;
    cell.className = 'px-4 py-4 text-center text-sm text-[#8E8E93]';
    cell.textContent = 'Keine Treffer. Bitte Suche oder Filter anpassen.';
    row.appendChild(cell);
    tbody.appendChild(row);
}
