import moment from 'moment-timezone';

export class CardData {
  private readonly expMonth: number;
  private readonly expYear: number;

  constructor(expMonth: number, expYear: number) {
    const currentYear = moment().year();
    if (expMonth < 0) {
      throw new Error('Month must be greater than 0');
    }
    if (expMonth > 12) {
      throw new Error('Month must be less than 12');
    }
    if (expYear < currentYear) {
      throw new Error('Year must be greater than current year');
    }
    this.expMonth = expMonth;
    this.expYear = expYear;
  }

  getExpMonth(): number {
    return this.expMonth;
  }

  getExpYear(): number {
    return this.expYear;
  }

  monthToString(): string {
    return this.expMonth < 10 ? `0${this.expMonth}` : `${this.expMonth}`;
  }

  yearToString(): string {
    return this.expYear.toString().substring(2);
  }
}

export class TransactionPrice {
  private readonly gatewayPrice: number;

  constructor(apiPrice: number) {
    if (apiPrice < 1500) {
      throw new Error('The minimum amount of a transaction is $1,500 excluding taxes');
    }
    this.gatewayPrice = Math.floor(apiPrice) * 100;
  }

  getGatewayPrice(): number {
    return this.gatewayPrice;
  }
}
