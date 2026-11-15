import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
// Run the pure TypeScript helpers with the project's existing compiler; no test dependency.
const output = ts.transpileModule(fs.readFileSync('src/lib/directory.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
const helpers = { exports: {} }
new Function('exports', output)(helpers.exports)
const { filterBusinesses, parseLocationFilter } = helpers.exports
const rows = [
  { id: 'a', name: 'Alpha', category: 'Groceries', suburb: 'Carlton', description: 'Refill shop', lat: -37.8, lng: 144.96, criteria: ['Vegan', 'Organic'] },
  { id: 'b', name: 'Beta', category: 'Fashion', suburb: 'Fitzroy', lat: null, lng: null, criteria: ['Vegan'] },
]
test('search, category, suburb and all selected criteria combine', () => {
  assert.deepEqual(filterBusinesses(rows, 'Groceries', 'REFILL', { mode: 'suburb', suburb: 'Carlton' }, ['Vegan', 'Organic']).map(b => b.id), ['a'])
  assert.equal(filterBusinesses(rows, 'All', '', { mode: 'none' }, ['Organic', 'Vegan']).length, 1)
  assert.equal(filterBusinesses(rows, 'Fashion', 'Alpha', { mode: 'none' }, []).length, 0)
})
test('Near Me excludes missing coordinates and applies distance', () => {
  assert.equal(filterBusinesses(rows, 'All', '', { mode: 'nearMe', lat: -37.8, lng: 144.96, radius: 2 }, []).length, 1)
  assert.equal(filterBusinesses(rows, 'All', '', { mode: 'nearMe', lat: 0, lng: 0, radius: 2 }, []).length, 0)
})
test('URL location precedence and malformed coordinates/radius', () => {
  assert.deepEqual(parseLocationFilter(new URLSearchParams('suburb=Carlton&lat=1&lng=2')), { mode: 'suburb', suburb: 'Carlton' })
  for (const query of ['lat=Infinity&lng=2', 'lat=91&lng=2', 'lat=1&lng=181', 'lat=no&lng=2']) assert.deepEqual(parseLocationFilter(new URLSearchParams(query)), { mode: 'none' })
  assert.equal(parseLocationFilter(new URLSearchParams('lat=0&lng=0&radius=-2')).radius, 5)
  assert.equal(parseLocationFilter(new URLSearchParams('lat=0&lng=0&radius=20')).radius, 20)
})

test('map coordinates accept zero and reject missing or invalid positions', () => {
  const { hasMapCoordinates } = helpers.exports
  assert.equal(hasMapCoordinates({ lat: 0, lng: 0 }), true)
  for (const point of [{lat: null, lng: 1}, {lat: Infinity, lng: 1}, {lat: 91, lng: 1}, {lat: 1, lng: 181}]) assert.equal(hasMapCoordinates(point), false)
})

test('Supabase project URL normalization is shared by server and browser', () => {
  const config = {}
  new Function('exports', ts.transpileModule(fs.readFileSync('src/lib/supabase/config.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(config)
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  try {
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-placeholder'
    for (const suffix of ['', '/rest/v1', '/rest/v1/']) {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.invalid' + suffix
      assert.equal(config.getSupabaseConfig().url, 'https://example.invalid')
    }
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    assert.throws(() => config.getSupabaseConfig(), /not configured/)
  } finally {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl
    if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey
  }
})
