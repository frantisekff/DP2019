/// <reference lib="webworker" />
import AnalysisText from "src/app/analysis-text";
import { A_ASCII } from 'src/app/constants/language.constants';

function calcFreqForTexts(allCombinations, encryptedText) {
  const decryptedAllCombinations = decryptForAllCombinations(allCombinations, encryptedText);
  const freqAllCombinations: number[][][] = [];
  for (const allMessagesOfLength of decryptedAllCombinations) {
    const forArray = AnalysisText.computeFreqForArray(allMessagesOfLength);
    freqAllCombinations.push(forArray);
  }
  return { freqAllCombinations, decryptedAllCombinations };
}

// Decrypt encrypted text for every key
function decryptForAllCombinations(allCombinations, encryptedText) {
  const decryptedAllCombinations = [];

  for (const allKeysOfLength of allCombinations) {
    const decryptedForLength = [];
    for (const key of allKeysOfLength) {
      const decryptedText = decrypt(encryptedText, key);
      decryptedForLength.push(decryptedText);
    }
    decryptedAllCombinations.push(decryptedForLength);
  }
  return decryptedAllCombinations;
}

function decrypt(encryptedText: string, keys: string): string {
  let decText = "";
  for (let i = 0; i < encryptedText.length; i++) {
    const letterAscii = encryptedText[i].charCodeAt(0);
    const key = keys[i % keys.length].charCodeAt(0) - A_ASCII;
    const decryptedLetter: number =
      ((letterAscii - A_ASCII - key + 26) % 26) + A_ASCII;
    decText += String.fromCharCode(decryptedLetter);
  }
  return decText;
}

addEventListener("message", ({ data }) => {
  postMessage(calcFreqForTexts(data[0], data[1]));
});
