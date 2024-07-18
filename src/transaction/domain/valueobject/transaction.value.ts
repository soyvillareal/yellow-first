import moment from 'moment-timezone';

export class CardData {
  private readonly expMonth: number;
  private readonly expYear: number;

  constructor(expMonth: number, expYear: number) {
    const currentYear = moment('YY').year();
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
