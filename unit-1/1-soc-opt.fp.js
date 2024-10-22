'use strict';

const data = `city,population,area,density,country
  Shanghai,24256800,6340,3826,China
  Delhi,16787941,1484,11313,India
  Lagos,16060303,1171,13712,Nigeria
  Istanbul,14160467,5461,2593,Turkey
  Tokyo,13513734,2191,6168,Japan
  Sao Paulo,12038175,1521,7914,Brazil
  Mexico City,8874724,1486,5974,Mexico
  London,8673713,1572,5431,United Kingdom
  New York City,8537673,784,10892,United States
  Bangkok,8280925,1569,5279,Thailand`;

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const createRow = pipe(
  (stringRow) => stringRow.trim(),
  (stringRow) => stringRow.split(','),
  (row) => ({
    city: row.at(0),
    population: Number(row.at(1)),
    area: Number(row.at(2)),
    density: Number(row.at(3)),
    country: row.at(4),
  }),
);

const calculateMaxPopulationDensity = (rows) => rows.reduce(
  (max, row) => Math.max(max, row.density), 0,
);

const addRelativePopulatinDensity = (rows, maxDensity) => rows.map(
  (row) => ({
    ...row,
    relativeDensity: Math.round((row.density * 100) / maxDensity),
  }),
);

const sortByRelativePopulationDensity = (rows) => rows.toSorted(
  (a, b) => b.relativeDensity - a.relativeDensity,
);

const createTable = pipe(
  (str) => str.split('\n'),
  (stringRows) => stringRows.slice(1).map(createRow),
  (rows) => addRelativePopulatinDensity(
    rows, calculateMaxPopulationDensity(rows),
  ),
  (rows) => sortByRelativePopulationDensity(rows),
);

console.table(createTable(data));
