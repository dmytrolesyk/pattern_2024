'use strict';

const test = require('node:test');
const assert = require('node:assert');

const {
  data,
  calculateMaxPopulationDensity,
  createRows,
  addRelativePopulationDensity,
  createTable,
} = require('./1-soc-opt.proc');

test('Test calculate maximum population density', () => {
  const rows = createRows(data);
  const maxPopulationDensity = calculateMaxPopulationDensity(rows);
  assert.strictEqual(maxPopulationDensity, 13712);
});

test('Test Add relative population density', () => {
  const rows = addRelativePopulationDensity(createRows(data));
  assert.strictEqual(
    rows.find(({ city }) => city === 'New York City').relativeDensity,
    79,
  );
});

test('Test create table', () => {
  const table = createTable(data);
  assert.strictEqual(table[0].city, 'Lagos');
  assert.strictEqual(table.at(-1).city, 'Istanbul');
});
