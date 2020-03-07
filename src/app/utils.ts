export default class Utils {
  static sumFunc(total, num) {
    return total + num;
  }

  static getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  static createArrayOfLength(num: number, from?: number): string[] {
    const fromNumber = from ?  from : 0;
    return Array.from(Array(num), (x, index) => (index + fromNumber).toString());
  }

  // Strip all whitespaces and toLowerCase
  static stripWhiteSpToLowerCase(text: string): string{
    return text.replace(/\s/g, '').toLowerCase();
  }

  static sortObjectAsc(data: {}): string[]{
    const sorted = Object.keys(data).sort(
        (a, b) => {
          return data[a] - data[b];
        }
      )
    return sorted;
  }
}
