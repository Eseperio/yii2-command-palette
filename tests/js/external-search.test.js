/**
 * Tests for the ExternalSearch category-suggestion behavior
 * Run with: node --test tests/js
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import ExternalSearch from '../../src/assets/src/js/external-search.js';

function createExternalSearch(overrides = {}) {
    return new ExternalSearch({
        endpoint: '/api/search',
        types: ['users', 'projects', 'documents'],
        ...overrides
    });
}

test('getSuggestedTypes returns nothing for an empty query', () => {
    const search = createExternalSearch();
    assert.deepEqual(search.getSuggestedTypes('', 0), []);
});

test('default behavior: only the matched type is suggested, regardless of result count', () => {
    const search = createExternalSearch();

    const suggestions = search.getSuggestedTypes('user john', 10);

    assert.equal(suggestions.length, 1);
    assert.equal(suggestions[0].type, 'users');
    assert.equal(suggestions[0].searchTerms, 'john');
});

test('default behavior: no suggestion when the query does not match any type', () => {
    const search = createExternalSearch();

    const suggestions = search.getSuggestedTypes('hello world', 1);

    assert.deepEqual(suggestions, []);
});

test('alwaysShowTypeSuggestions disabled by default keeps existing behavior even with few results', () => {
    const search = createExternalSearch();

    const suggestions = search.getSuggestedTypes('hello', 1);

    assert.deepEqual(suggestions, []);
});

test('alwaysShowTypeSuggestions enabled: suggests every type when results are <= 3', () => {
    const search = createExternalSearch({ alwaysShowTypeSuggestions: true });

    const suggestions = search.getSuggestedTypes('hello', 3);

    assert.equal(suggestions.length, 3);
    assert.deepEqual(suggestions.map(s => s.type), ['users', 'projects', 'documents']);
    // No type matched the query, so every suggestion uses the full query as search terms
    suggestions.forEach(s => assert.equal(s.searchTerms, 'hello'));
});

test('alwaysShowTypeSuggestions enabled: falls back to default behavior when results are > 3', () => {
    const search = createExternalSearch({ alwaysShowTypeSuggestions: true });

    const suggestions = search.getSuggestedTypes('hello', 4);

    assert.deepEqual(suggestions, []);
});

test('alwaysShowTypeSuggestions enabled: matched type keeps extracted search terms, others use full query', () => {
    const search = createExternalSearch({ alwaysShowTypeSuggestions: true });

    const suggestions = search.getSuggestedTypes('users john', 2);

    assert.equal(suggestions.length, 3);

    const usersSuggestion = suggestions.find(s => s.type === 'users');
    const projectsSuggestion = suggestions.find(s => s.type === 'projects');

    assert.equal(usersSuggestion.searchTerms, 'john');
    assert.equal(projectsSuggestion.searchTerms, 'users john');
});

test('alwaysShowTypeSuggestions enabled: each type appears only once (no duplicates)', () => {
    const search = createExternalSearch({ alwaysShowTypeSuggestions: true });

    const suggestions = search.getSuggestedTypes('users john', 0);
    const types = suggestions.map(s => s.type);

    assert.equal(types.length, new Set(types).size);
});

test('getSuggestedTypes returns nothing when no types are configured', () => {
    const search = createExternalSearch({ types: [], alwaysShowTypeSuggestions: true });

    assert.deepEqual(search.getSuggestedTypes('hello', 0), []);
});
