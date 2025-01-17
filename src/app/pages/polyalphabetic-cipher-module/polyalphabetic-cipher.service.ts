import { AlphabetElement } from "src/app/models/common.model";
import {
  EN_ALPHABET_FREQUENCY,
  ALPHABET
} from "src/app/constants/language.constants";
import Utils from "src/app/utils";
import { EventEmitter } from "@angular/core";
import { Subject } from 'rxjs';

export class PolyalphCipherService {
  selectedValue = new Subject<number>();

  // Calculate differencies between en alphabet freq and all decrypted options.
  calcDiffEnAlphAndAllDecTexts(
    freqAllCombinations: number[][][],
    allCombinations,
    decryptedAllCombinations,
    keyLength
  ) {
    const diffFreqAllCombinations = [];
    const minimDiffFreqAllCombinations = [];

    let diffFreqDecryptedTexts = [];
    let minForKeyLength = 1000;
    let minForKeyLengthIndex = 0;

    for (let row = 0; row < freqAllCombinations[0].length; row++) {
      const freqForKeyLength = freqAllCombinations[0][row];
      const diffFreqForKeyLength = [];
      const lang = {} as AlphabetElement;

      for (let letter = 0; letter < freqForKeyLength.length; letter++) {
        const freqDiff =
          Math.round(
            Math.abs(freqForKeyLength[letter] - EN_ALPHABET_FREQUENCY[letter]) *
              100
          ) / 100;
        diffFreqForKeyLength.push(freqDiff);
        lang[ALPHABET[letter]] = freqDiff;
      }

      lang.sum =
        Math.round(diffFreqForKeyLength.reduce(Utils.sumFunc) * 100) / 100;
      lang.key = allCombinations[keyLength - 1][row];
      lang.decryptedText = decryptedAllCombinations[0][row];
      // Find min sum for KeyLength
      if (minForKeyLength > lang.sum) {
        minForKeyLength = lang.sum;
        minForKeyLengthIndex = row;
      }

      diffFreqDecryptedTexts[row] = lang;
    }
    // console.log('Diff Freq for All Combinations', diffFreqDecryptedTexts);
    diffFreqAllCombinations.push(diffFreqDecryptedTexts);
    // console.log('Minimum', minForKeyLength);
    minimDiffFreqAllCombinations.push({
      index: minForKeyLengthIndex,
      value: minForKeyLength,
      decryptedText: decryptedAllCombinations[0][minForKeyLengthIndex]
    });
    console.log("Decrypted all combinations ");

    return { diffFreqAllCombinations, minimDiffFreqAllCombinations };
  }

  // choose the best 10 result
  // <1 - maxGuessLength> do: sort asc combination of n length, then get first 3
  chooseBestResults(diffFreqAllCombinations) {
    const sortedDiff = [];
    for (const combinationOfLength of diffFreqAllCombinations) {
      sortedDiff.push(
        ...combinationOfLength.sort((a, b) => a.sum - b.sum).slice(0, 15)
      );
    }
    return sortedDiff.sort((a, b) => a.sum - b.sum);
  }

  findBestResultLength(diffFreqAllCombinations): number {
    let minSum = {...diffFreqAllCombinations[0][0]};
    minSum.sum = 1000;
    for (const combinationOfLength of diffFreqAllCombinations) {
      const minForNcombination = combinationOfLength
        .sort((a, b) => a.sum - b.sum)
        .slice(0, 3)[0];
      minSum =
        minForNcombination.sum < minSum.sum ? minForNcombination : minSum;
    }
    const lengthOfBestKey = minSum.key.length;
    return lengthOfBestKey;
  }

  // Generate all combination of letters. It is Bbrute force attack with all words of length
  computeCombinationKeyLength(maxGuessKeyLength: number): string[] {
    const allCombinations = [];
    allCombinations[0] = ALPHABET;
    for (let index = 1; index <= maxGuessKeyLength; index++) {
      const result = this.addAllCombinationForArray(allCombinations[index - 1]);
      console.log("All Combinations for KeyLength ", index, "Result", result);
      allCombinations.push(result);
    }
    return allCombinations;
  }

  addAllCombinationForArray(inputArray: string[]): string[] {
    const allCombinations = [];
    for (const input of inputArray) {
      for (const letter1 of ALPHABET) {
        const word = input + letter1;
        allCombinations.push(word);
      }
    }
    return allCombinations;
  }
}
