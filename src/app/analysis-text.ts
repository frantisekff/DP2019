import { ALPHABET } from './constants/language.constants';
import { LanguageIcElement } from './models/common.model';

export default class AnalysisText {

    // Calculate Frequency and convert it to percentage
    static calculateFreqPerc(message: string): number[] {
        const frequency = this.getFrequencyOfText(message);
        const frequencyInPercentage = [];
        const encryptedTextLength = message.length;

        console.log(frequency);
        const tmpData = [];
        for (const item of frequency) {
            let inPercentage = item / encryptedTextLength * 100;
            inPercentage = Math.round(inPercentage * 100) / 100;
            frequencyInPercentage.push(inPercentage);
            tmpData.push(inPercentage);
        }
        return frequencyInPercentage;
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
        let nearestLang = '';
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
            // element = element / 100;
            ic += element * (element - 1);
        });
        ic /= length * (length - 1);
        return ic;
    }

    static computeFreqForArray(texts: string[]) {
        const freqForTexts = [];
        // this.decryptedTexts.forEach(element => {
        texts.forEach(text => {
            const length = text.length;
            const compFreq = AnalysisText.getFrequencyOfText(text);
            const compFreqInPerc = [];

            compFreq.forEach(alphabet => {
                let inPercentage = alphabet / length * 100;
                inPercentage = Math.round(inPercentage * 100) / 100;
                compFreqInPerc.push(inPercentage);
            });
            // this.freqDecryptedTexts.push(compFreqInPerc);
            freqForTexts.push(compFreqInPerc);
        });
        return freqForTexts;
    }
}