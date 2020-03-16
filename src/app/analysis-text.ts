import { ALPHABET, A_ASCII } from "./constants/language.constants";
import { LanguageIcElement } from "./models/common.model";
import * as BIGRAMS from "./constants/refBigramsArray.json";

export default class AnalysisText {
  // Calculate Frequency and convert it to percentage
  static getFrequencyOfTextPerc(message: string): number[] {
    const frequency = this.getFrequencyOfText(message);
    const encryptedTextLength = message.length;
    const frequencyInPercentage = this.freqToPerc(
      frequency,
      encryptedTextLength
    );

    return frequencyInPercentage;
  }

  static freqToPerc(
    frequency: number[],
    encryptedTextLength: number
  ): number[] {
    const frequencyInPercentage = [];
    for (const item of frequency) {
      let inPercentage = (item / encryptedTextLength) * 100;
      inPercentage = Math.round(inPercentage * 100) / 100;
      frequencyInPercentage.push(inPercentage);
    }

    return frequencyInPercentage;
  }

  // Method, which return mapping of letter to freq in percentage
  static mapLetterToFreqPerc(
    frequency: number[],
    frequencyInPercentage: number[]
  ): [string, number][] {
    const data = [];

    for (let index = 0; index < frequency.length; index++) {
      data.push([ALPHABET[index], frequencyInPercentage[index]]);
    }
    return data;
  }

  static getFreqOfBigramsPerc(
    textLength: number,
    freqBigrams: Map<string, number>, outputBigrams: Map<string, number>
  ) {
    for (const iterator of freqBigrams) {
      console.log(iterator);
      outputBigrams.set(iterator[0], iterator[1] / textLength);
    }
  }

  static getFreqOfBigrams(text: string): [number[][], Map<string, number>] {
    const freqOfBigrams = new Array(26)
      .fill(0)
      .map(() => new Array(26).fill(0));
    const freqOfBigramsNames = new Map();

    for (let index = 0; index < text.length - 1; index++) {
      const a: number = text.charCodeAt(index) - A_ASCII;
      const b: number = text.charCodeAt(index + 1) - A_ASCII;
      freqOfBigrams[a][b] += 1;
      const key = text.charAt(index) + text.charAt(index + 1);
      if (freqOfBigramsNames.has(key)) {
        freqOfBigramsNames.set(key, freqOfBigramsNames.get(key) + 1);
      } else {
        freqOfBigramsNames.set(key, 1);
      }
    }
    return [freqOfBigrams, freqOfBigramsNames];
  }

  // Method compute difference freq between bigrams and sum result
  // Freq is transformed to percentage
  static getSumOfDiffBigramsFromRef(
    freqOfBigrams: number[][],
    textLength: number,
    refBigrams: number[][]
  ) {
    let sum = 0;
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 26; j++) {
        const diff = refBigrams[i][j] - freqOfBigrams[i][j] / textLength;
        sum += Math.abs(Math.round(diff * 100) / 100);
      }
      return sum;
    }
  }

  static getFrequencyOfText(message: string): number[] {
    const tmpFrequency = [];
    // console.log(message);
    for (const char of ALPHABET) {
      const splittedText = message.split(char);
      tmpFrequency.push(splittedText.length - 1);
    }
    return tmpFrequency;
  }

  static findNearestLanguage(ic: number, data: LanguageIcElement[]): string {
    let nearestLang = "";
    let nearestValue = 10;

    data.forEach(element => {
      const actualDiff = Math.abs(element.value - ic);
      if (nearestValue > actualDiff) {
        nearestValue = actualDiff;
        nearestLang = element.name;
      }
    });
    return nearestLang;
  }

  // Calculate Index of coincidence
  static getIC(absoluteFreq: number[], length: number): number {
    let ic = 0;
    absoluteFreq.forEach(element => {
      ic += element * (element - 1);
    });
    ic /= length * (length - 1);
    return ic;
  }

  static computeFreqForArray(texts: string[]): number[][] {
    const freqForTexts = [];
    texts.forEach(text => {
      const freqInPerc = AnalysisText.getFrequencyOfTextPerc(text);
      freqForTexts.push(freqInPerc);
    });
    return freqForTexts;
  }

  static getArrayFromMapping(ref) {
    const ref2 = new Array(26).fill(0).map(() => new Array(26).fill(0));
    ref.forEach(element => {
      const a = element[0][0].charCodeAt(0) - A_ASCII;
      const b = element[0][1].charCodeAt(0) - A_ASCII;
      const refFreq = element[1];
      ref2[a][b] = refFreq;
    });
  }

  static getMapFromMapping(ref): Map<string, number>{
    const ref2 = new Map<string, number>();
    ref.forEach(element => {
      const bigram_name = element[0][0];
      const refFreq = element[1];
      ref2.set(bigram_name, refFreq);
    });

    return ref2;
  }
}
