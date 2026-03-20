export const artikelData = {
    bestimmter: [
        { kasus: "Nom", m: "der <span class=\"text-[#007AFF]\">-e</span>", f: "die <span class=\"text-[#007AFF]\">-e</span>", n: "das <span class=\"text-[#007AFF]\">-e</span>", pl: "die <span class=\"text-[#FF3B30]\">-en</span>" },
        { kasus: "Gen", m: "des <span class=\"text-[#FF3B30]\">-en</span>", f: "der <span class=\"text-[#FF3B30]\">-en</span>", n: "des <span class=\"text-[#FF3B30]\">-en</span>", pl: "der <span class=\"text-[#FF3B30]\">-en</span>" },
        { kasus: "Dat", m: "dem <span class=\"text-[#FF3B30]\">-en</span>", f: "der <span class=\"text-[#FF3B30]\">-en</span>", n: "dem <span class=\"text-[#FF3B30]\">-en</span>", pl: "den <span class=\"text-[#FF3B30]\">-en</span>" },
        { kasus: "Akk", m: "den <span class=\"text-[#FF3B30]\">-en</span>", f: "die <span class=\"text-[#007AFF]\">-e</span>", n: "das <span class=\"text-[#007AFF]\">-e</span>", pl: "die <span class=\"text-[#FF3B30]\">-en</span>" }
    ],
    unbestimmter: [
        { 
            kasus: "Nom", 
            m: `<div class="font-medium text-black">ein <span class="text-[#FF9500]">-er</span></div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser / euer</div>`,
            f: `<div class="font-medium text-black">ein<i class="italic">e</i> <span class="text-[#007AFF]">-e</span></div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">e</i> / eur<i class="italic">e</i></div>`,
            n: `<div class="font-medium text-black">ein <span class="text-[#FF9500]">-es</span></div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser / euer</div>`,
            pl: `<div class="font-medium text-[#8E8E93]">(kein<i class="italic">e</i> <span class="text-[#FF3B30]">-en</span>)</div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">e</i> / eur<i class="italic">e</i></div>`
        },
        { 
            kasus: "Gen", 
            m: `<div class="font-medium text-black">ein<i class="italic">es</i> <span class="text-[#FF3B30]">-en</span></div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">es</i> / eur<i class="italic">es</i></div>`,
            f: `<div class="font-medium text-black">ein<i class="italic">er</i> <span class="text-[#FF3B30]">-en</span></div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">er</i> / eur<i class="italic">er</i></div>`,
            n: `<div class="font-medium text-black">ein<i class="italic">es</i> <span class="text-[#FF3B30]">-en</span></div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">es</i> / eur<i class="italic">es</i></div>`,
            pl: `<div class="font-medium text-[#8E8E93]">(kein<i class="italic">er</i> <span class="text-[#FF3B30]">-en</span>)</div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">er</i> / eur<i class="italic">er</i></div>`
        },
        { 
            kasus: "Dat", 
            m: `<div class="font-medium text-black">ein<i class="italic">em</i> <span class="text-[#FF3B30]">-en</span></div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">em</i> / eur<i class="italic">em</i></div>`,
            f: `<div class="font-medium text-black">ein<i class="italic">er</i> <span class="text-[#FF3B30]">-en</span></div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">er</i> / eur<i class="italic">er</i></div>`,
            n: `<div class="font-medium text-black">ein<i class="italic">em</i> <span class="text-[#FF3B30]">-en</span></div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">em</i> / eur<i class="italic">em</i></div>`,
            pl: `<div class="font-medium text-[#8E8E93]">(kein<i class="italic">en</i> <span class="text-[#FF3B30]">-en</span>)</div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">en</i> / eur<i class="italic">en</i></div>`
        },
        { 
            kasus: "Akk", 
            m: `<div class="font-medium text-black">ein<i class="italic">en</i> <span class="text-[#FF3B30]">-en</span></div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">en</i> / eur<i class="italic">en</i></div>`,
            f: `<div class="font-medium text-black">ein<i class="italic">e</i> <span class="text-[#007AFF]">-e</span></div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">e</i> / eur<i class="italic">e</i></div>`,
            n: `<div class="font-medium text-black">ein <span class="text-[#FF9500]">-es</span></div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser / euer</div>`,
            pl: `<div class="font-medium text-[#8E8E93]">(kein<i class="italic">e</i> <span class="text-[#FF3B30]">-en</span>)</div><div class="text-[11px] font-medium text-[#8E8E93] mt-0.5">unser<i class="italic">e</i> / eur<i class="italic">e</i></div>`
        }
    ],
    nullartikel: [
        { kasus: "Nom", m: "-er", f: "-e", n: "-es", pl: "-e" },
        { kasus: "Gen", m: "-en", f: "-er", n: "-en", pl: "-er" },
        { kasus: "Dat", m: "-em", f: "-er", n: "-em", pl: "-en" },
        { kasus: "Akk", m: "-en", f: "-e", n: "-es", pl: "-e" }
    ]
};
