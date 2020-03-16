import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import {
  A_ASCII,
  EN_ALPHABET_FREQUENCY,
  ALPHABET,
  REF_BIGRAMS
} from "../../../constants/language.constants";
import {
  MESSAGE,
  EXAMPLE_RND_ALPHABET,
  CHART_OPTIONS_COMPARE_BIGRAMS
} from "../monoalphabetic-cipher.constant";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import AnalysisText from "src/app/analysis-text";
import Utils from "src/app/utils";
import { GraphComponent } from "src/app/components/graph/graph.component";
import * as BIGRAMS from "../../../constants/refBigrams.json";
import * as BIGRAMS_IN_MAP from "../../../constants/bigramsInMap.json";
import { MatButtonToggleChange } from '@angular/material/button-toggle';

const iterations = 1000;

export interface GuyessKey {
  key: string;
  decryptedText: string;
  sum: number;
  bigramsFreq: Map<string, number>;
  bigramsFreqInPerc: Map<string, number>;

}

interface Keys {
  encKey: Array<string>;
  decKey: Array<string>;
}

interface Guess {
  rndKey: string[];
  allBetterGuess: Array<GuyessKey>;
}

@Component({
  selector: "app-monoalphabetic-cipher-component",
  templateUrl: "./monoalphabetic-cipher-component.component.html",
  styleUrls: ["./monoalphabetic-cipher-component.component.css"]
})
export class MonoalphCipher implements OnInit, OnDestroy {
  rndKey = EXAMPLE_RND_ALPHABET;
  message = MESSAGE;
  refBigrams;
  subscrMessage: Subscription;
  keys: Keys;
  encryptedText: string;
  decryptedText: string;
  cipherInputsForm: FormGroup;
  guessedKey: Guess;
  iterStartKey: string[];

  // Options for Graph - Encrypted text graph
  chartOptionsFreqGraph = CHART_OPTIONS_COMPARE_BIGRAMS;
  @ViewChild("comparefreqBigramsGraph", { static: true })
  comparefreqGraph: GraphComponent;
  dataSourceCompareFreqGraph;


  initKeyPair: [string, number][];

  selectedValue = '1';
  toggleOptions: string[];


  constructor() {}

  ngOnInit() {
    this.refBigrams = JSON.parse((REF_BIGRAMS as any).default);
    this.cipherInputsForm = new FormGroup({
      message: new FormControl(this.message, [
        Validators.required,
        Validators.pattern("^[a-zA-Z]+$"),
        Validators.minLength(20),
        Validators.maxLength(2000)
      ])
    });

    this.subscrMessage = this.cipherInputsForm.controls.message.valueChanges.subscribe(
      newMessage => {
        this.message = newMessage;
      }
    );

    const bigrams = (BIGRAMS_IN_MAP as any).default;
    const bigramsInMap: Map<string, number> = new Map(
      [...bigrams.values()].sort()
    );
    const bigramsKeys = [...bigramsInMap.keys()];
    const bigramsValues = [...bigramsInMap.values()];

    this.initKeyPair = bigramsKeys.map((item) => {
      return [item.toString(), 0];
    });

    // tslint:disable-next-line: no-unused-expression
    // tslint:disable-next-line: one-variable-per-declaration
    

    this.chartOptionsFreqGraph.xAxis.categories = bigramsKeys;
    this.chartOptionsFreqGraph.series[1].data = bigramsValues;

    this.calcDataForPage();
  }

  calcDataForPage() {
    this.keys = this.calcInverseKeyFromRndAlphabet(this.rndKey);
    this.encryptedText = this.enDecrypt(this.message, this.keys.encKey);
    this.decryptedText = this.enDecrypt(this.encryptedText, this.keys.decKey);
    const ref = (BIGRAMS as any).default;
    // const ref3 = (BIGRAMS_IN_MAP as any).default;

    // const ref2 = AnalysisText.getMapFromMapping(ref);
    // const stringify = JSON.stringify([...ref2]);
    // const parse = new Map(JSON.parse(ref3));

    this.guessedKey = this.guessKey(iterations, this.encryptedText);

    this.toggleOptions = Utils.createArrayOfLength(this.guessedKey.allBetterGuess.length, 1);

    this.dataSourceCompareFreqGraph = [...this.guessedKey.allBetterGuess[0].bigramsFreqInPerc.values()];
    this.comparefreqGraph.updateGraph();
  }

  // Hill Climbing Alg.
  private guessKey(interations: number, encText: string): Guess {
    const guessed = {} as Guess;
    // generate Random Key
    this.iterStartKey = [...this.keys.decKey];
    this.iterStartKey = [...this.swapTwoLetters(this.iterStartKey)];
    this.iterStartKey = [...this.swapTwoLetters(this.iterStartKey)];
    let rndKey = [...this.iterStartKey];

    // rndKey = this.shuffleArray(rndKey);
    guessed.rndKey = [...rndKey];

    let bestGuess = {} as GuyessKey;
    bestGuess.sum = 1000;
    const allBetterGuess = [];

    for (let index = 0; index < interations; index++) {
      // swap v kluci
      let iterationKey = [...this.swapTwoLetters(rndKey)];
      // iterationKey = [...this.swapTwoLetters(iterationKey)];

      // iterationKey = [...rndKey];

      // desifrovat
      const decTextIteration = this.enDecrypt(encText, iterationKey);
      // vypocitat freq pre desifrovany text
      // const freqOfTextIteration = AnalysisText.getFrequencyOfTextPerc(decTextIteration);
      const freqBigrams = AnalysisText.getFreqOfBigrams(decTextIteration);


      const sum: number = AnalysisText.getSumOfDiffBigramsFromRef(
        freqBigrams[0],
        decTextIteration.length,
        this.refBigrams
      );
      const result: GuyessKey = {} as GuyessKey;
      result.sum = sum;
      result.decryptedText = decTextIteration;
      result.key = iterationKey.join("");
      result.bigramsFreq = new Map([...freqBigrams[1].entries()].sort());

      // desifrovany text treba ohodnotit
      // rozdiely medzi refer. hodnotami jazyka
      // const result: AlphabetElement = this.getDiffFreqFromEnAlph(
      //   freqOfTextIteration,
      //   decTextIteration,
      //   iterationKey
      // );

      if (result.sum < bestGuess.sum && result.sum < 0.06) {

        const initBigramsMap = new Map(
          [...this.initKeyPair.values()]
        );

        AnalysisText.getFreqOfBigramsPerc(
          this.encryptedText.length,
          result.bigramsFreq, initBigramsMap
        );

        result.bigramsFreqInPerc = initBigramsMap;

        bestGuess = result;
        rndKey = result.key.split("");
        allBetterGuess.push(result);

      }
    }
    guessed.allBetterGuess = allBetterGuess;
    console.log(allBetterGuess);
    return guessed;
  }
  generateRndKey() {
    this.rndKey = [...this.shuffleArray(this.rndKey)];
  }

  getDiffFreqFromEnAlph(
    freq: number[],
    decText: string,
    key: Array<string>
  ): GuyessKey {
    const diffFreqForKeyLength = [];
    const lang = {} as GuyessKey;

    for (let letter = 0; letter < ALPHABET.length; letter++) {
      const freqDiff =
        Math.round(
          Math.abs(freq[letter] - EN_ALPHABET_FREQUENCY[letter]) * 100
        ) / 100;
      diffFreqForKeyLength.push(freqDiff);
      lang[ALPHABET[letter]] = freqDiff;
    }

    lang.sum =
      Math.round(diffFreqForKeyLength.reduce(Utils.sumFunc) * 100) / 100;
    lang.key = key.join("");
    lang.decryptedText = decText;

    return lang;
  }

  private shuffleArray(array: Array<string>): Array<string> {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private swapTwoLetters(key: Array<string>) {
    const swappedKey = [...key];
    const i = Math.floor(Math.random() * key.length);
    const j = Math.floor(Math.random() * key.length);
    [swappedKey[i], swappedKey[j]] = [swappedKey[j], swappedKey[i]];

    return swappedKey;
  }

  // Generate inverse key from input
  private calcInverseKeyFromRndAlphabet(rndAlphabet: Array<string>): Keys {
    const keys = {} as Keys;
    const mapping = rndAlphabet
      .map((item, i) => {
        return [i, item.charCodeAt(0) - "a".charCodeAt(0)];
      })
      .sort((a, b) => (a[1] > b[1] ? 1 : -1));
    keys.decKey = mapping.map(item =>
      String.fromCharCode(item[0] + "a".charCodeAt(0))
    );
    keys.encKey = mapping
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(item => String.fromCharCode(item[1] + "a".charCodeAt(0)));
    return keys;
  }

  // Method for En/Decrypion based on inverse key
  private enDecrypt(encryptedText: string, keys: Array<string>) {
    let text = "";
    for (const letter of encryptedText) {
      // let decryptedLetter = (keys.indexOf(letter) + this.a_ascii);
      // this.decryptedText += String.fromCharCode(decryptedLetter);
      const decryptedLetter = letter.charCodeAt(0) - A_ASCII;
      // console.log(decryptedLetter);
      text += keys[decryptedLetter];
    }
    return text;
  }

  
  // Change data for CompareFreq based of selection <1-26>
  selectionOfGraphChanged(item: MatButtonToggleChange) {
    this.dataSourceCompareFreqGraph = [...this.guessedKey.allBetterGuess[item.value - 1].bigramsFreqInPerc.values()];
    this.comparefreqGraph.updateGraph();
    console.log('Selected value: ', item.value);
    console.log(this.dataSourceCompareFreqGraph);
  }

  ngOnDestroy() {
    this.subscrMessage.unsubscribe();
  }
}
