/// <reference lib="webworker" />
import AnalysisText from "src/app/analysis-text";
import { GuessKey } from "src/app/models/common.model";
import { A_ASCII } from 'src/app/constants/language.constants';


// Hill Climbing Alg.
function guessKey(
  interations: number,
  encText: string,
  rndKey: Array<string>,
  refBigrams,
  initKeyPair
): GuessKey {
  // generate Random Key

  const decText = enDecrypt(encText, rndKey);
  const freqBigrams = AnalysisText.getFreqOfBigrams(decText);
  const sum: number = AnalysisText.getSumOfDiffBigramsFromRef(
    freqBigrams[0],
    decText.length - 1,
    refBigrams
  );

  let bestGuess = {} as GuessKey;
  bestGuess.sum = sum;
  bestGuess.key = rndKey.join("");

  for (let index = 0; index < interations; index++) {
    const iterationKey = swapTwoLetters([...bestGuess.key.split("")]);
    const decTextIteration = enDecrypt(encText, iterationKey);
    // vypocitat freq pre desifrovany text
    const freqBigramsIteration = AnalysisText.getFreqOfBigrams(
      decTextIteration
    );
    // Get diff of Referal values (EN) and decrypted text
    // that is fitnes finc for evaluate of decrypted text
    const sumIteration: number = AnalysisText.getSumOfDiffBigramsFromRef(
      freqBigramsIteration[0],
      decTextIteration.length - 1,
      refBigrams
    );
    // save only bertter result
    if (sumIteration < bestGuess.sum) {
      const result: GuessKey = {} as GuessKey;
      result.sum = sumIteration;
      result.decryptedText = decTextIteration;
      result.key = iterationKey.join("");
      // sort freq for graph
      result.bigramsFreq = new Map([...freqBigrams[1].entries()].sort());

      const initBigramsMap: Map<string, number> = new Map([
        ...initKeyPair.values()
      ]);

      AnalysisText.getFreqOfBigramsPerc(
        encText.length - 1,
        result.bigramsFreq,
        initBigramsMap
      );

      result.bigramsFreqInPerc = initBigramsMap;

      bestGuess = result;
      rndKey = result.key.split("");
    }
  }
  return bestGuess;
}

// Method for En/Decrypion based on inverse key
function enDecrypt(encryptedText: string, keys: Array<string>) {
  let text = "";
  for (const letter of encryptedText) {
    const decryptedLetter = letter.charCodeAt(0) - A_ASCII;
    text += keys[decryptedLetter];
  }
  return text;
}

function swapTwoLetters(key: Array<string>) {
  const swappedKey = [...key];
  const i = Math.floor(Math.random() * key.length);
  const j = Math.floor(Math.random() * key.length);
  [swappedKey[i], swappedKey[j]] = [swappedKey[j], swappedKey[i]];

  return swappedKey;
}

addEventListener("message", ({ data }) => {
  postMessage(guessKey(data[0], data[1], data[2], data[3], data[4]));
});
