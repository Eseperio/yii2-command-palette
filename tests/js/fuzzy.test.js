/**
 * Tests for the fuzzy search algorithms
 * Run with: node --test tests/js
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { levenshtein, fuzzyMinLevenshtein, filterItems } from '../../src/assets/src/js/fuzzy.js';

test('levenshtein computes the edit distance between two strings', () => {
    assert.equal(levenshtein('kitten', 'sitting'), 3);
    assert.equal(levenshtein('same', 'same'), 0);
    assert.equal(levenshtein('', 'abc'), 3);
});

test('fuzzyMinLevenshtein matches close individual words within a longer text', () => {
    // "usrs" is close to the word "users" contained in the subtitle
    assert.equal(fuzzyMinLevenshtein('usrs', 'Manage users'), 1);
});

test('fuzzyMinLevenshtein does not match a short query against a much longer word', () => {
    // A 4 letter query should not match a substring of a much longer 7 letter word
    // just because that substring happens to be close (length difference > 2)
    assert.equal(fuzzyMinLevenshtein('caja', 'catalog'), Infinity);
});

test('fuzzyMinLevenshtein still matches when the length difference is within the allowed range', () => {
    // "caja" (4) vs "caj" (3) -> length diff 1, distance 1
    assert.equal(fuzzyMinLevenshtein('caja', 'caj'), 1);
});

test('filterItems does not return actions from a much longer, unrelated word via fuzzy matching', () => {
    const items = [
        { name: 'Catalog management', subtitle: 'Manage the product catalog' },
        { name: 'Cash box', subtitle: 'caja' },
    ];

    const results = filterItems('caja', items);

    assert.equal(results.length, 1);
    assert.equal(results[0].name, 'Cash box');
});

test('filterItems keeps matching close terms of similar length', () => {
    const items = [
        { name: 'Users', subtitle: 'Manage application users' },
    ];

    const results = filterItems('usrs', items);

    assert.equal(results.length, 1);
    assert.equal(results[0].name, 'Users');
});
