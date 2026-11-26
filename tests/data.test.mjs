import assert from 'node:assert/strict';
import test from 'node:test';

import { verbs } from '../assets/data/verbs.js';
import { praepositionen } from '../assets/data/praepositionen.js';
import { praepositionenCombo } from '../assets/data/praepositionenCombo.js';
import { verbCombo } from '../assets/data/verbCombo.js';
import { substantivFamilienHeaders, substantivFamilienRows } from '../assets/data/substantivFamilien.js';
import { substantivFamilienGlosses, substantivFamilienPrefixHints } from '../assets/data/substantivFamilienGlosses.js';

test('verbs data integrity', () => {
    assert.ok(verbs.length >= 130, 'should have at least 130 verbs');
    const seen = new Set();
    verbs.forEach(v => {
        assert.ok(!seen.has(v.infinitive), `duplicate verb: ${v.infinitive}`);
        seen.add(v.infinitive);
        assert.equal(v.conjugations.length, 5, `invalid conjugations length for ${v.infinitive}`);
        assert.equal(v.pastConjugations.length, 5, `invalid pastConjugations length for ${v.infinitive}`);
        assert.ok(v.pastInfo && v.pastInfo.length > 3, `missing pastInfo for ${v.infinitive}`);
        // Präteritum ich and er should be identical
        assert.equal(v.pastConjugations[0], v.pastConjugations[2], `Prät ich !== er for ${v.infinitive}`);
    });
});

test('substantivFamilien and glosses completeness', () => {
    assert.ok(substantivFamilienHeaders.length > 25, 'should have headers');
    assert.ok(substantivFamilienRows.length > 30, 'should have rows');

    substantivFamilienHeaders.slice(1).forEach(prefix => {
        assert.ok(substantivFamilienPrefixHints[prefix], `missing prefix hint for: ${prefix}`);
    });

    const missingGlosses = [];
    substantivFamilienRows.forEach(row => {
        assert.equal(row.length, substantivFamilienHeaders.length, 'row length should match headers');
        row.slice(1).forEach(cell => {
            if (!cell) return;
            const words = cell.split('\n').filter(Boolean);
            words.forEach(w => {
                if (!substantivFamilienGlosses[w]) {
                    missingGlosses.push(w);
                }
            });
        });
    });
    assert.deepEqual(missingGlosses, [], 'should have glosses for all noun family entries');
});

test('praepositionen and praepositionenCombo completeness', () => {
    assert.ok(praepositionen.length >= 35, 'should have prepositions');
    const validCases = new Set(['GEN', 'DAT', 'AKK']);

    praepositionen.forEach(p => {
        assert.ok(p.prep, 'missing prep');
        assert.ok(Array.isArray(p.modes), `modes should be array in ${p.prep}`);
        p.modes.forEach(m => {
            assert.ok(validCases.has(m.case), `invalid case ${m.case} in ${p.prep}`);
        });
    });

    assert.ok(praepositionenCombo.length >= 20, 'should have combo groups');
    praepositionenCombo.forEach(entry => {
        assert.ok(entry.prep, 'combo entry missing prep');
        assert.ok(validCases.has(entry.kasus), `combo entry invalid case ${entry.kasus}`);
        ['norm', 'verb', 'adj'].forEach(type => {
            const arr = entry[type] || [];
            assert.ok(arr.length > 0, `empty ${type} in ${entry.prep} ${entry.kasus}`);
            const seen = new Set();
            arr.forEach(item => {
                assert.ok(item.combo, `missing combo in ${entry.prep} ${type}`);
                assert.ok(item.ex, `missing ex in ${entry.prep} ${type}`);
                const key = item.combo.toLowerCase().replace(/^(sich|s\.)\s+/i, '').trim();
                assert.ok(!seen.has(key), `duplicate combo "${item.combo}" in ${entry.prep} ${entry.kasus} ${type}`);
                seen.add(key);
            });
        });
    });
});

test('verbCombo completeness', () => {
    assert.ok(verbCombo.length >= 24, 'should have at least 24 verb groups');
    verbCombo.forEach(group => {
        assert.ok(group.verb, 'group missing verb');
        assert.ok(Array.isArray(group.items) && group.items.length > 0, `empty items in ${group.verb}`);
        group.items.forEach(item => {
            assert.ok(item.combo, `item missing combo in ${group.verb}`);
            assert.ok(item.ex, `item missing ex in ${group.verb}`);
            assert.ok(item.ex.endsWith('.') || item.ex.endsWith('!') || item.ex.endsWith('?'), `example without punctuation in ${group.verb}: ${item.ex}`);
        });
    });
});
