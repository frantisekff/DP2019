import { AlphabetElement } from "src/app/models/common.model";
import {
  EN_ALPHABET_FREQUENCY,
  ALPHABET,
  A_ASCII
} from "src/app/constants/language.constants";
import Utils from "src/app/utils";
import { EventEmitter } from "@angular/core";

export class PolyalphCipherService {
  selectedValue = new EventEmitter<string>();

  // Calculate differencies between en alphabet freq and all decrypted options.
  calcDiffEnAlphAndAllDecTexts(
    freqAllCombinations: number[][][],
    allCombinations,
    decryptedAllCombinations
  ) {
    const diffFreqAllCombinations = [];
    const minimDiffFreqAllCombinations = [];
    for (
      let keyLength = 0;
      keyLength < freqAllCombinations.length;
      keyLength++
    ) {
      let diffFreqDecryptedTexts = [];
      let minForKeyLength = 1000;
      let minForKeyLengthIndex = 0;

      for (let row = 0; row < freqAllCombinations[keyLength].length; row++) {
        const freqForKeyLength = freqAllCombinations[keyLength][row];
        const diffFreqForKeyLength = [];
        const lang = {} as AlphabetElement;

        for (let letter = 0; letter < freqForKeyLength.length; letter++) {
          const freqDiff =
            Math.round(
              Math.abs(
                freqForKeyLength[letter] - EN_ALPHABET_FREQUENCY[letter]
              ) * 100
            ) / 100;
          diffFreqForKeyLength.push(freqDiff);
          lang[ALPHABET[letter]] = freqDiff;
        }

        lang.sum =
          Math.round(diffFreqForKeyLength.reduce(Utils.sumFunc) * 100) / 100;
        lang.key = allCombinations[keyLength][row];
        lang.decryptedText = decryptedAllCombinations[keyLength][row];
        // Find min sum for KeyLength
        if (minForKeyLength > lang.sum) {
          minForKeyLength = lang.sum;
          minForKeyLengthIndex = row;
        }

        diffFreqDecryptedTexts[row] = lang;
      }
      // console.log('Diff Freq for All Combinations', diffFreqDecryptedTexts);
      diffFreqAllCombinations.push(diffFreqDecryptedTexts);
      diffFreqDecryptedTexts = [];
      // console.log('Minimum', minForKeyLength);
      minimDiffFreqAllCombinations.push({
        index: minForKeyLengthIndex,
        value: minForKeyLength,
        decryptedText: decryptedAllCombinations[keyLength][minForKeyLengthIndex]
      });
      minForKeyLength = 1000;
      console.log("Decrypted all combinations ");
    }

    return { diffFreqAllCombinations, minimDiffFreqAllCombinations };
  }

  // choose the best 10 result
  // <1 - maxGuessLength> do: sort asc combination of n length, then get first 3
  choose10bestResults(diffFreqAllCombinations) {
    const sortedDiff = [];
    for (const combinationOfLength of diffFreqAllCombinations) {
      sortedDiff.push(
        ...combinationOfLength.sort((a, b) => a.sum - b.sum).slice(0, 3)
      );
    }
    return sortedDiff;
  }

  findBestResultLength(diffFreqAllCombinations): number {
    let minSum = diffFreqAllCombinations[0][0] ;
    minSum.sum = 1000;
    for (const combinationOfLength of diffFreqAllCombinations) {
      const minForNcombination = combinationOfLength
        .sort((a, b) => a.sum - b.sum)
        .slice(0, 3)[0];
      minSum = minForNcombination.sum < minSum.sum ? minForNcombination : minSum;
    }
    const lengthOfBestKey = minSum.key.length;
    return lengthOfBestKey;
  }

  // Generate all combination of letters. It is Bbrute force attack with all words of length
  computeCombinationKeyLength(maxGuessKeyLength: number): string[] {
    const allCombinations = [];
    allCombinations[0] = ALPHABET;
    for (let index = 1; index < maxGuessKeyLength; index++) {
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
