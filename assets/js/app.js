import { initBasis } from './features/basis.js';
import { initVerbs } from './features/verbs.js';
import { initNounFamilies } from './features/nounFamilies.js';
import { initPrepositions } from './features/prepositions.js';
import { initNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    initBasis();
    initVerbs();
    initNounFamilies();
    initPrepositions();
    initNavigation();
});
