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

  class Row {
    constructor({
      city,
      population,
      area,
      density,
      country,
    }) {
      this.city = city;
      this.population = population;
      this.area = area;
      this.density = density;
      this.country = country;
      this.relativeDensity = undefined;
    }

    static fromString(stringRow) {
      const row = stringRow.split(',').map((cell) => cell.trim());
      const city = row[0];
      const population = Number(row[1]);
      const area = Number(row[2]);
      const density = Number(row[3]);
      const country = row[4];
      return new Row({ city, population, area, density, country });
    }
  }

class Table {
  constructor(rows) {
    this.rows = rows;
  }

  calculateMaxPopulationDensity() {
    let maxDensity = 0;
    for (const row of this.rows) {
      if (row.density > maxDensity) {
        maxDensity = row.density;
      }
    }
    return maxDensity;
  }

  addRelativePopulationDensity() {
    const maxDensity = this.calculateMaxPopulationDensity();
    this.rows = this.rows.map((row) => {
      const relativeDensity = Math.round((row.density * 100) / maxDensity);
      return { ...row, relativeDensity };
    });
    return this;
  };

  sortByRelativePopulationDensity() {
    this.rows = this.rows.toSorted(
      (a, b) => b.relativeDensity - a.relativeDensity,
    );
    return this;
  }

  static fromStringData(stringData) {
    const stringRows = stringData.split('\n');
    const rows = stringRows.slice(1).map(
      (stringRow) => Row.fromString(stringRow),
    );
    return new Table(rows);
  }
}

const table = Table.fromStringData(data)
  .addRelativePopulationDensity()
  .sortByRelativePopulationDensity();

console.table(table.rows);
