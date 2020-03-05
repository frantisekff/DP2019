export default class Utils {
  static sumFunc(total, num) {
    return total + num;
  }

  static getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  static createArrayOfLength(num: number): string[] {
    return Array.from(Array(num), (x, index) => (index + 1).toString());
  }

  // Strip all whitespaces and toLowerCase
  static stripWhiteSpToLowerCase(text: string): string{
    return text.replace(/\s/g, '').toLowerCase();
  }

  static sortAsc(data: {}): string[]{
    const sorted = Object.keys(data).sort(
        (a, b) => {
          return data[a] - data[b];
        }
      )
    return sorted;
  }
}
