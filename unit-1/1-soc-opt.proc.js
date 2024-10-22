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

const calculateMaxPopulationDensity = (rows) => {
  let maxDensity = 0;
  for (const row of rows) {
    if (row.density > maxDensity) {
      maxDensity = row.density;
    }
  }
  return maxDensity;
};

const addRelativePopulationDensity = (rows) => {
  const maxDensity = calculateMaxPopulationDensity(rows);
  return rows.map((row) => {
    const relativeDensity = Math.round((row.density * 100) / maxDensity);
    return { ...row, relativeDensity };
  });
};

const createRow = (stringRow) => {
  const row = stringRow.split(',').map((cell) => cell.trim());
  const city = row[0];
  const population = Number(row[1]);
  const area = Number(row[2]);
  const density = Number(row[3]);
  const country = row[4];
  return {
    city,
    population,
    area,
    density,
    country,
  };
};

const createRows = (stringData) => stringData
  .split('\n')
  .slice(1)
  .map(createRow);

const createTable = (stringData) => {
  const rows = addRelativePopulationDensity(createRows(stringData));
  return rows.toSorted((a, b) => b.relativeDensity - a.relativeDensity);
};

const table = createTable(data);

console.table(table);

module.exports = {
  data,
  calculateMaxPopulationDensity,
  addRelativePopulationDensity,
  createRow,
  createTable,
  createRows,
};
