import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  A_ASCII,
  EN_ALPHABET_FREQUENCY,
  ALPHABET
} from "../../../constants/language.constants";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import AnalysisText from "src/app/analysis-text";
import { AlphabetElement } from "src/app/models/common.model";
import Utils from "src/app/utils";

const exampleRndAlphabet = [
  "v",
  "b",
  "d",
  "e",
  "f",
  "c",
  "g",
  "h",
  "j",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "i",
  "r",
  "z",
  "s",
  "k",
  "t",
  "u",
  "x",
  "w",
  "y",
  "a"
];
const MESSAGE =
  "theenglishwikipediawasthefirstwikipediaeditionandhasremainedthelargestithaspioneeredmanyi" +
  "deasasconventionspoliciesorfeatureswhichwerelateradoptedbywikipediaeditionsinsomeoftheother" +
  "languagestheseideasincludefeaturedarticlestheneutralpointofviewpolicynavigationtemplatesthesor" +
  "tingofshortstubarticlesintosubcategoriesdisputeresolutionmechanismssuchasmediationandarbitration" +
  "andweeklycollaborationstheenglishwikipediahasadoptedfeaturesfromwikipediasinotherlanguagesthesefeatures" +
  "includeverifiedrevisionsfromthegermanwikipediadewikiandtownpopulationlookuptemplatesfromthedutchwikipedianlwikial" +
  "thoughtheenglishwikipediastoresimagesandaudiofilesaswellastextfilesmanyoftheimageshavebeenmovedtowikimediacommonswiththe" +
  "samenameaspassedthroughfileshowevertheenglishwikipediaalsohasfairuseimagesandaudiovideofileswithcopyrightrestrictionsmostof" +
  "whicharenotallowedoncommonsmanyofthemostactiveparticipantsinthewikimediafoundationandthedevelopersofthemediawikisoftwarethat" +
  "powerswikipediaareenglishusers";

const iterations = 10000;

interface Keys {
  encKey: Array<string>;
  decKey: Array<string>;
}

@Component({
  selector: "app-monoalphabetic-cipher-component",
  templateUrl: "./monoalphabetic-cipher-component.component.html",
  styleUrls: ["./monoalphabetic-cipher-component.component.css"]
})
export class MonoalphCipher implements OnInit, OnDestroy {
  rndKey = exampleRndAlphabet;
  message = MESSAGE;
  subscrMessage: Subscription;
  keys: Keys;
  encryptedText: string;
  decryptedText: string;
  cipherInputsForm: FormGroup;
  bestGuess: AlphabetElement;

  constructor() {}

  ngOnInit() {
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

    this.calcDataForPage();
  }

  calcDataForPage() {
    this.keys = this.calcInverseKeyFromRndAlphabet(this.rndKey);
    this.encryptedText = this.enDecrypt(this.message, this.keys.encKey);
    this.decryptedText = this.enDecrypt(this.encryptedText, this.keys.decKey);

    this.bestGuess = this.guessKey(iterations, this.encryptedText);

  }

  // Hill Climbing Alg.
  private guessKey(interations: number, encText: string): AlphabetElement  {
    // generate Random Key 
    let rndKey = [...this.rndKey];
    rndKey = this.shuffleArray(rndKey);

    let bestGuess = {} as AlphabetElement;
    bestGuess.sum = 1000;

    for (let index = 0; index < interations; index++) {
      // swap v kluci
      const iterationKey = [...this.swapTwoLetters(rndKey)];
      // desifrovat
      const decTextIteration = this.enDecrypt(encText, iterationKey);
      // vypocitat freq pre desifrovany text
      const freqOfTextIteration = AnalysisText.getFrequencyOfTextPerc(decTextIteration);

      // desifrovany text treba ohodnotit
      // rozdiely medzi refer. hodnotami jazyka
      const result: AlphabetElement = this.getDiffFreqFromEnAlph(
        freqOfTextIteration,
        decTextIteration,
        iterationKey
      );

      if(result.sum < bestGuess.sum){
        bestGuess = result;
        rndKey = result.key.split('');
      }

    }

    return bestGuess;
  }
  generateRndKey() {
    this.rndKey = [...this.shuffleArray(this.rndKey)];
  }

  getDiffFreqFromEnAlph(
    freq: number[],
    decText: string,
    key: Array<string>
  ): AlphabetElement {
    const diffFreqForKeyLength = [];
    const lang = {} as AlphabetElement;

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

    return (swappedKey);
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

  ngOnDestroy() {
    this.subscrMessage.unsubscribe();
  }
}
