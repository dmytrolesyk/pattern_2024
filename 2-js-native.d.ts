type Item = { name: string; price: number };

declare class PurchaseIterator {
  private purchase: PurchaseComposite;
  private names: string[];
  private currentIndex: number;

  constructor(purchase: PurchaseComposite);
  next(): GroupComposite | undefined;
}

declare class PurchaseComposite {
  private groups: Map<string, GroupComposite>;

  constructor();
  addGroup(name: string, items: GroupComposite): void;
  getTotal(): number;
}

declare class GroupComposite {
  private name: string;
  private items: Array<Item>;

  constructor(name: string, items: Array<Item>);
  getTotal(): number;
}

declare class ExpenseObserver {
  private items: Map<string, number>;
  private total: number;

  constructor();
  update(name: string, amount: number): void;
  static validate(name: string, total: number): void;
}

declare abstract class RateStrategy {
  abstract getRate(currency: string): Promise<number>;
}

declare class OpenExchangeRateStrategy extends RateStrategy {
  private host: string;
  private path: string;
  private key: string;

  constructor();
  getRate(currency: string): Promise<number>;
}

declare class ConvertCurrencyCommand {
  private rateStrategy: RateStrategy;

  constructor(rateStrategy: RateStrategy);
  execute(amount: number, currency: string): Promise<number>;
}

declare class PurchaseController {
  private purchase: PurchaseComposite;
  private expense: ExpenseObserver;

  constructor(basket: Record<string, Array<Item>>);
  private initialize(basket: Record<string, Array<Item>>): void;
  processPurchases(): number;
  static convertCurrency(total: number, currency: string): Promise<number>;
  execute(): Promise<void>;
}

export {
  PurchaseIterator,
  PurchaseComposite,
  GroupComposite,
  ExpenseObserver,
  RateStrategy,
  OpenExchangeRateStrategy,
  ConvertCurrencyCommand,
  PurchaseController,
};
