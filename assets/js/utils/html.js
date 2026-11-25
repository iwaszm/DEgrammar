export const escapeHtml = (value) => String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

export const safeItalicizeEnding = (word, infinitive = '') => {
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

export const renderPronounLabel = (value) => {
        const match = String(value).match(/^([^<]+)(?:\s+<span class="text-xs text-\[#8E8E93\] font-normal">\(([^)]+)\)<\/span>)?$/);
        if (!match) return escapeHtml(value);
        const [, base, note] = match;
        return escapeHtml(base.trim()) + (note
            ? ` <span class="text-xs text-[#8E8E93] font-normal">(${escapeHtml(note)})</span>`
            : '');
    };

export const sanitizeTrustedMarkup = (value) => {
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
