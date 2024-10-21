'use strict';

const test = require('node:test');
const assert = require('node:assert');

const {
  PurchaseIterator,
  PurchaseComposite,
  GroupComposite,
  ExpenseObserver,
  RateStrategy,
  OpenExchangeRateStrategy,
  ConvertCurrencyCommand,
  PurchaseController,
} = require('./2-js-native.js');

const basket = {
  Electronics: [
    { name: 'Laptop', price: 1500 },
    { name: 'Mouse', price: 25 },
    { name: 'Keyboard', price: 100 },
    { name: 'HDMI cable', price: 10 },
  ],
  Textile: [
    { name: 'Bag', price: 50 },
    { name: 'Mouse pad', price: 5 },
  ],
};

test('Week 2: GroupComposite total', () => {
  const group = new GroupComposite('Electronics', basket.Electronics);
  const total = group.getTotal();
  assert.strictEqual(total, 1635);
});

test('Week 2: GroupComposite negative price', () => {
  const invalidBasket = [{ name: 'Faulty Item', price: -10 }];
  const group = new GroupComposite('FaultyGroup', invalidBasket);

  assert.throws(() => {
    group.getTotal();
  }, /Negative price/);
});

test('Week 2: PurchaseComposite total', () => {
  const purchase = new PurchaseComposite();
  const electronics = new GroupComposite('Electronics', basket.Electronics);
  purchase.addGroup('Electronics', electronics);
  const textile = new GroupComposite('Textile', basket.Textile);
  purchase.addGroup('Textile', textile);

  const total = purchase.getTotal();
  assert.strictEqual(total, 1690);
});

test('Week 2: ExpenseObserver updates', () => {
  const observer = new ExpenseObserver();
  observer.update('Electronics', 1635);
  observer.update('Textile', 55);

  assert.strictEqual(observer.total, 1690);
  assert.strictEqual(observer.items.get('Electronics'), 1635);
});

test('Week 2: ExpenseObserver MAX_PURCHASE', () => {
  const observer = new ExpenseObserver();
  assert.throws(() => {
    observer.update('ExpensiveGroup', 3000);
  }, /ExpensiveGroup total is above the limit/);
});

test('Week 2: PurchaseIterator', () => {
  const purchase = new PurchaseComposite();
  const electronics = new GroupComposite('Electronics', basket.Electronics);
  purchase.addGroup('Electronics', electronics);
  const textile = new GroupComposite('Textile', basket.Textile);
  purchase.addGroup('Textile', textile);

  const iterator = new PurchaseIterator(purchase);
  let group = iterator.next();

  assert.strictEqual(group.name, 'Electronics');
  assert.strictEqual(group.getTotal(), 1635);

  group = iterator.next();
  assert.strictEqual(group.name, 'Textile');
  assert.strictEqual(group.getTotal(), 55);

  group = iterator.next();
  assert.strictEqual(group, undefined);
});

test('Week 2: ConvertCurrencyCommand calls RateStrategy', async () => {
  const mockRateStrategy = {
    async getRate(currency) {
      assert.strictEqual(currency, 'UAH');
      return 41;
    },
  };

  const convert = new ConvertCurrencyCommand(mockRateStrategy);
  const convertedAmount = await convert.execute(100, 'UAH');
  assert.strictEqual(convertedAmount, 4100);
});

test('Week 2: PurchaseController', async () => {
  const { getRate } = OpenExchangeRateStrategy.prototype;
  const { log } = console;

  OpenExchangeRateStrategy.prototype.getRate = async function(currency) {
    assert.strictEqual(currency, 'UAH');
    return 41;
  };

  const controller = new PurchaseController(basket);

  let logOutput = '';
  console.log = (msg) => {
    logOutput = msg;
  };
  await controller.execute();
  assert.match(logOutput, /Total: 69290/);

  OpenExchangeRateStrategy.prototype.getRate = getRate;
  console.log = log;
  console.log(logOutput);
});
