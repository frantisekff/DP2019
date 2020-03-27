import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  A_ASCII,
  EN_ALPHABET_FREQUENCY,
  ALPHABET,
  REF_BIGRAMS
} from '../../../constants/language.constants';
import {
  MESSAGE,
  EXAMPLE_RND_ALPHABET,
  CHART_OPTIONS_COMPARE_BIGRAMS,
  NAME_CIPHER,
  TYPE_CIPHER,
  ITERATIONS
} from '../monoalphabetic-cipher.constant';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import AnalysisText from 'src/app/analysis-text';
import Utils from 'src/app/utils';
import { GraphComponent } from 'src/app/components/graph/graph.component';
import * as BIGRAMS_IN_MAP from '../../../constants/bigramsInMap.json';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { HeaderService } from 'src/app/components/header/header.service';
import { Keys, GuessKey } from 'src/app/models/common.model';

@Component({
  selector: 'app-monoalphabetic-cipher-component',
  templateUrl: './monoalphabetic-cipher-component.component.html',
  styleUrls: ['./monoalphabetic-cipher-component.component.css']
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
  // Options for Graph - Encrypted text graph
  chartOptionsFreqGraph = CHART_OPTIONS_COMPARE_BIGRAMS;
  @ViewChild('comparefreqBigramsGraph', { static: true })
  comparefreqGraph: GraphComponent;
  dataSourceCompareFreqGraph;

  initKeyPair: [string, number][];
  selectedValue = '1';
  toggleOptions: string[];
  allGuess: GuessKey[] = [];

  constructor(headerService: HeaderService) {
    headerService.cipherName.next(NAME_CIPHER);
    headerService.cipherType.next(TYPE_CIPHER);
  }

  ngOnInit() {
    // referral values of Bigrams for EN language
    this.refBigrams = JSON.parse((REF_BIGRAMS as any).default);

    // Reactive Form for input message
    this.cipherInputsForm = new FormGroup({
      message: new FormControl(this.message, [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
        Validators.minLength(20),
        Validators.maxLength(2000)
      ])
    });

    this.subscrMessage = this.cipherInputsForm.controls.message.valueChanges.subscribe(
      newMessage => {
        this.message = newMessage;
      }
    );

    this.setUpReferalValuesForGraph();

    this.calcDataForPage();
  }

  calcDataForPage() {
    this.keys = this.calcInverseKeyFromRndAlphabet(this.rndKey);
    this.encryptedText = this.enDecrypt(this.message, this.keys.encKey);
    this.decryptedText = this.enDecrypt(this.encryptedText, this.keys.decKey);

    this.allGuess = [];
    // number of attempts to find key
    const numberOfAttempt = 5;
    for (let i = 0; i < numberOfAttempt; i++ ){
      const guessedKey: GuessKey = this.guessKey(ITERATIONS, this.encryptedText);
      this.allGuess.push(guessedKey);
      console.log('Guess Key', i);
      console.log(guessedKey);
    }
    // Generate toogle button for graphs based on number of guessedKeys
    this.toggleOptions = Utils.createArrayOfLength(this.allGuess.length, 1);
    // Set up data to graph
    this.dataSourceCompareFreqGraph = [...this.allGuess[0].bigramsFreqInPerc.values()];
    this.comparefreqGraph.updateGraph();
  }

  // Hill Climbing Alg.
  private guessKey(interations: number, encText: string): GuessKey {
    // generate Random Key
    let rndKey = [...this.keys.decKey];
    rndKey = this.shuffleArray(rndKey);

    const decText = this.enDecrypt(encText, rndKey);
    const freqBigrams = AnalysisText.getFreqOfBigrams(decText);
    const sum: number = AnalysisText.getSumOfDiffBigramsFromRef(
      freqBigrams[0],
      decText.length - 1,
      this.refBigrams
    );
    
    let bestGuess = {} as GuessKey;
    bestGuess.sum = sum;
    bestGuess.key = rndKey.join('');

    for (let index = 0; index < interations; index++) {
      const iterationKey = this.swapTwoLetters([...bestGuess.key.split('')]);
      const decTextIteration = this.enDecrypt(encText, iterationKey);
      // vypocitat freq pre desifrovany text
      const freqBigramsIteration = AnalysisText.getFreqOfBigrams(decTextIteration);
      // Get diff of Referal values (EN) and decrypted text
      // that is fitnes finc for evaluate of decrypted text
      const sumIteration: number = AnalysisText.getSumOfDiffBigramsFromRef(
        freqBigramsIteration[0],
        decTextIteration.length - 1,
        this.refBigrams
      );
      // save only bertter result
      if (sumIteration < bestGuess.sum) {
        const result: GuessKey = {} as GuessKey;
        result.sum = sumIteration;
        result.decryptedText = decTextIteration;
        result.key = iterationKey.join('');
        // sort freq for graph
        result.bigramsFreq = new Map([...freqBigrams[1].entries()].sort());

        const initBigramsMap = new Map(
          [...this.initKeyPair.values()]
        );

        AnalysisText.getFreqOfBigramsPerc(
          this.encryptedText.length - 1,
          result.bigramsFreq, initBigramsMap
        );

        result.bigramsFreqInPerc = initBigramsMap;

        bestGuess = result;
        rndKey = result.key.split('');

      }
    }
    return bestGuess;
  }

  shuffleRndKey() {
    this.rndKey = [...this.shuffleArray(this.rndKey)];
  }

  getDiffFreqFromEnAlph(
    freq: number[],
    decText: string,
    key: Array<string>
  ): GuessKey {
    const diffFreqForKeyLength = [];
    const lang = {} as GuessKey;

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
    lang.key = key.join('');
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
        return [i, item.charCodeAt(0) - A_ASCII];
      })
      .sort((a, b) => (a[1] > b[1] ? 1 : -1));
    keys.decKey = mapping.map(item =>
      String.fromCharCode(item[0] + A_ASCII)
    );
    keys.encKey = mapping
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(item => String.fromCharCode(item[1] + A_ASCII));
    return keys;
  }

  // Method for En/Decrypion based on inverse key
  private enDecrypt(encryptedText: string, keys: Array<string>) {
    let text = '';
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
    this.dataSourceCompareFreqGraph = [...this.allGuess[item.value - 1].bigramsFreqInPerc.values()];
    this.comparefreqGraph.updateGraph();
    console.log('Selected value: ', item.value);
    console.log(this.dataSourceCompareFreqGraph);
  }

  private setUpReferalValuesForGraph (){
    const bigrams = (BIGRAMS_IN_MAP as any).default;
    const bigramsInMap: Map<string, number> = new Map(
      [...bigrams.values()].sort()
    );
    const bigramsKeys = [...bigramsInMap.keys()];
    const bigramsValues = [...bigramsInMap.values()];

    this.initKeyPair = bigramsKeys.map((item) => {
      return [item.toString(), 0];
    });

    this.chartOptionsFreqGraph.xAxis.categories = bigramsKeys;
    this.chartOptionsFreqGraph.series[1].data = bigramsValues;
  }

  ngOnDestroy() {
    this.subscrMessage.unsubscribe();
  }
}
