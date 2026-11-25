import assert from 'node:assert/strict';
import test from 'node:test';
import { initNavigation } from '../assets/js/navigation.js';

class FakeElement {
    constructor(id) {
        this.id = id;
        this.classes = new Set(['hidden', 'opacity-0', 'pointer-events-none']);
        this.attributes = new Map();
        this.handlers = new Map();
        this.classList = {
            contains: name => this.classes.has(name),
            add: (...names) => names.forEach(name => this.classes.add(name)),
            remove: (...names) => names.forEach(name => this.classes.delete(name)),
            toggle: (name, force) => {
                if (force ?? !this.classes.has(name)) this.classes.add(name);
                else this.classes.delete(name);
            }
        };
    }
    setAttribute(name, value) { this.attributes.set(name, value); }
    getAttribute(name) { return this.attributes.get(name); }
    addEventListener(name, handler) { this.handlers.set(name, handler); }
    click() { this.handlers.get('click')?.({ stopPropagation() {} }); }
    focus() { this.focused = true; }
}

test('URL navigation, history, menu state and unknown routes', () => {
    const ids = [
        'main-nav-container', 'page-title',
        'nav-basis', 'nav-pronomen', 'nav-artikel', 'nav-plural-regeln',
        'nav-nomen', 'nav-substantiv-familien', 'nav-v2n', 'nav-a2n',
        'nav-verben', 'nav-verben-page', 'nav-verb-combo',
        'nav-praepositionen', 'nav-praepositionen-page', 'nav-praepositionen-combo',
        'nav-basis-menu', 'nav-nomen-menu', 'nav-verben-menu', 'nav-praepositionen-menu',
        'page-pronomen', 'page-artikel', 'page-plural-regeln',
        'page-v2n', 'page-a2n', 'page-substantiv-familien',
        'page-verben', 'page-verb-combo', 'page-praepositionen', 'page-praepositionen-combo'
    ];
    const elements = new Map(ids.map(id => [id, new FakeElement(id)]));
    const documentHandlers = new Map();
    const windowHandlers = new Map();
    globalThis.document = {
        title: '',
        getElementById: id => elements.get(id),
        addEventListener: (name, handler) => documentHandlers.set(name, handler)
    };
    globalThis.location = { hash: '#verb-combo' };
    globalThis.history = {
        pushState: (_state, _title, hash) => { location.hash = hash; },
        replaceState: (_state, _title, hash) => { location.hash = hash; }
    };
    globalThis.window = {
        addEventListener: (name, handler) => windowHandlers.set(name, handler),
        scrollTo() {}
    };
    const get = id => elements.get(id);

    initNavigation();
    assert.equal(get('page-verb-combo').classList.contains('hidden'), false);
    assert.equal(get('page-pronomen').classList.contains('hidden'), true);
    assert.equal(get('nav-verb-combo').getAttribute('aria-current'), 'page');
    assert.equal(get('page-title').textContent, 'Verbkombinationen');

    get('nav-basis').click();
    assert.equal(location.hash, '#pronomen');
    assert.equal(get('page-pronomen').classList.contains('hidden'), false);
    assert.equal(get('nav-basis').getAttribute('aria-expanded'), 'true');
    get('nav-artikel').click();
    assert.equal(location.hash, '#artikel');
    assert.equal(get('page-artikel').classList.contains('hidden'), false);
    get('nav-plural-regeln').click();
    assert.equal(location.hash, '#plural-regeln');
    assert.equal(get('page-plural-regeln').classList.contains('hidden'), false);

    get('nav-nomen').click();
    assert.equal(location.hash, '#substantiv-familien');
    assert.equal(get('page-substantiv-familien').classList.contains('hidden'), false);
    get('nav-v2n').click();
    assert.equal(location.hash, '#v2n');
    get('nav-a2n').click();
    assert.equal(location.hash, '#a2n');
    assert.equal(get('page-a2n').classList.contains('hidden'), false);

    get('nav-verben').click();
    assert.equal(location.hash, '#verben');
    assert.equal(get('nav-verben').getAttribute('aria-expanded'), 'true');
    documentHandlers.get('keydown')({ key: 'Escape' });
    assert.equal(get('nav-verben').getAttribute('aria-expanded'), 'false');
    assert.equal(get('nav-verben').focused, true);

    location.hash = '#verb-combo';
    windowHandlers.get('popstate')();
    assert.equal(get('page-verb-combo').classList.contains('hidden'), false);

    location.hash = '#unknown';
    windowHandlers.get('hashchange')();
    assert.equal(location.hash, '#pronomen');
    assert.equal(get('page-pronomen').classList.contains('hidden'), false);

    location.hash = '#nomen-bildung';
    windowHandlers.get('hashchange')();
    assert.equal(location.hash, '#v2n');
    assert.equal(get('page-v2n').classList.contains('hidden'), false);
});
