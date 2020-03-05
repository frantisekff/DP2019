import { ALPHABET } from "./constants/language.constants";
import { LanguageIcElement } from "./models/common.model";

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
  static getIC(frequencyInPercentage: number[], length: number): number {
    let ic = 0;
    frequencyInPercentage.forEach(element => {
      ic += element * (element - 1);
    });
    ic /= length * (length - 1);
    return ic;
  }

  static computeFreqForArray(texts: string[]) {
    const freqForTexts = [];
    texts.forEach(text => {
      const length = text.length;
      const compFreq = AnalysisText.getFrequencyOfText(text);
      const compFreqInPerc = [];

      compFreq.forEach(alphabet => {
        let inPercentage = (alphabet / length) * 100;
        inPercentage = Math.round(inPercentage * 100) / 100;
        compFreqInPerc.push(inPercentage);
      });
      freqForTexts.push(compFreqInPerc);
    });
    return freqForTexts;
  }
}
