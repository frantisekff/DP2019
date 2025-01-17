import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener
} from "@angular/core";
import {
  A_ASCII,
  EN_ALPHABET_FREQUENCY,
  ALPHABET,
  REF_BIGRAMS
} from "../../../constants/language.constants";
import {
  MESSAGE,
  EXAMPLE_RND_ALPHABET,
  CHART_OPTIONS_COMPARE_BIGRAMS,
  NAME_CIPHER,
  TYPE_CIPHER,
  ITERATIONS,
  CHART_OPTIONS_ITER_SCORE,
  SIDE_MENU,
  TOP_GAP,
  CHART_OPTIONS_MATCH_RATE_INCREASE
} from "../monoalphabetic-cipher.constant";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription, Subject } from "rxjs";
import AnalysisText from "src/app/analysis-text";
import Utils from "src/app/utils";
import { GraphComponent } from "src/app/components/graph/graph.component";
import * as BIGRAMS_IN_MAP from "../../../constants/bigramsInMap.json";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { HeaderService } from "src/app/components/header/header.service";
import {
  Keys,
  GuessKey,
  SortTable,
  Ordering
} from "src/app/models/common.model";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-monoalphabetic-cipher-component",
  templateUrl: "./monoalphabetic-cipher-component.component.html",
  styleUrls: ['../../../app.component.css', "./monoalphabetic-cipher-component.component.css"]
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
  @ViewChild("comparefreqBigramsGraph", { static: true })
  comparefreqGraph: GraphComponent;
  dataSourceCompareFreqGraph = {};

  // Options for Graph - Iteration vs Score
  chartOptionsIterScoreGraph = CHART_OPTIONS_ITER_SCORE;
  @ViewChild("iterScoreGraph", { static: true })
  iterScoreGraph: GraphComponent;
  dataSourceiterScoreGraph;

  // Options for Graph - Match Rate
  chartOptionsMatchRateIncreaseGraph = CHART_OPTIONS_MATCH_RATE_INCREASE;
  @ViewChild("matchRateIncrease", { static: true })
  matchRateIncreaseGraph: GraphComponent;
  dataSourceMatchRateIncreaseGraph;

  //Variables for Final Table
  columnsBestResults: string[] = [
    "iteration",
    "key",
    "matchRate",
    "sum",
    "decryptedText"
  ];
  stickyColumns = { stickyStart: "key", stickyEnd: "", stickyHeader: false };
  sortBestResults: SortTable = {
    sortByColumn: "iteration",
    order: Ordering.asc
  } as SortTable;
  dataSourceBestResults = new MatTableDataSource<any>();
  dataSourceBestResultsReady = new Subject<boolean>();

  initKeyPair: [string, number][];
  selectedValue = "1";
  toggleOptions: string[];
  allGuess: GuessKey[] = [];
  private webWorker: Worker;
  // number of attempts to find key
  // numberOfAttempt = 2;
  // Show the data after calculation
  calcDone = false;

  // var for sideNavbar
  sideMenu = SIDE_MENU;
  topGap = TOP_GAP;
  
  // Form inputs
  cipherAttemptForm: FormGroup;
  numberOfAttempt = 5;
  private numberOfAttemptSubscr: Subscription;

  numberOfIterations = 2500;
  private numberOfIterationsSubscr: Subscription;



  theBestGuess: GuessKey;

  constructor(headerService: HeaderService) {
    headerService.showInfoPanel.next(true);
    headerService.cipherName.next(NAME_CIPHER);
    headerService.cipherType.next(TYPE_CIPHER);
  }

  ngOnInit() {
    const first = "abcdef";
    const second = "abdcef";

    const result = AnalysisText.matchRate(first, second);
    console.log("Match Rate Result", result);

    this.cipherAttemptForm = new FormGroup({
      numberOfAttempt: new FormControl(this.numberOfAttempt, [
        Validators.required,
        Validators.min(1),
        Validators.max(10)
      ]),
      numberOfIterations: new FormControl(this.numberOfIterations, [
        Validators.required,
        Validators.min(100),
        Validators.max(10000)
      ])
    });

    this.numberOfAttemptSubscr = this.cipherAttemptForm.controls.numberOfAttempt.valueChanges.subscribe(
      newValue => {
        this.numberOfAttempt = newValue;
      }
    );

    this.numberOfIterationsSubscr =  this.cipherAttemptForm.controls.numberOfIterations.valueChanges.subscribe(
      newValue => {
        this.numberOfIterations = newValue;
      }
    );

    // referral values of Bigrams for EN language
    this.refBigrams = JSON.parse((REF_BIGRAMS as any).default);

    // Reactive Form for input message
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

    this.setUpReferalValuesForGraph();

    if (typeof Worker !== "undefined") {
      this.webWorker = new Worker("./monoalphabetic-cipher-webworker.worker", {
        type: `module`
      });

      this.webWorker.onmessage = event => {
        console.log(event.data);
        this.allGuess.push(event.data);

        if (this.allGuess.length === this.numberOfAttempt) {
          // Generate toogle button for graphs based on number of guessedKeys
          this.toggleOptions = Utils.createArrayOfLength(
            this.allGuess.length,
            1
          );
          // Sort allGuess desc
          this.allGuess.sort((a, b) => (a.sum > b.sum ? 1 : -1));

          // Get data to arrays, we use it in graph
          const iterations = [] as Array<number>;
          const sums = [] as Array<number>;
          const matchRates = [] as Array<number>;
          const matchRatesIncrease = [] as Array<number>;

          this.theBestGuess =  this.allGuess[0];

          for (const guess of this.theBestGuess.allBestGuess) {
            iterations.push(guess.iteration);
            sums.push(guess.sum);
            matchRates.push(guess.matchRate);
            matchRatesIncrease.push((Math.round(guess.matchRateIncrease * 1000) / 1000) * 100);
          }

          // Send data to graph Compare Sum and Match Rate
          this.chartOptionsIterScoreGraph.xAxis.categories = iterations;
          this.dataSourceiterScoreGraph = [sums, matchRates];
          this.iterScoreGraph.updateGraph();

           // Send data to graph Show MAtch Rate increase
           this.chartOptionsMatchRateIncreaseGraph.xAxis.categories = iterations;
           this.dataSourceMatchRateIncreaseGraph = [matchRatesIncrease];
           this.matchRateIncreaseGraph.updateGraph();

          // Prepare data for table
          // Choose every n-th element from results
          const numChoosenElements = 5;
          const numElements = this.allGuess[0].allBestGuess.length;
          const choooseEveryNthElement = Math.floor(
            numElements / numChoosenElements
          );
          const allBestGuessNthEl = [];

          for (let i = 0; i < numElements; i = i + choooseEveryNthElement) {
            // Last element not push, we will do it out of loop
            if (i === numElements - 1) {
              continue;
            }
            const tmpGuess = this.allGuess[0].allBestGuess[i];
            tmpGuess.sum = Math.round(tmpGuess.sum * 1000) / 1000;
            tmpGuess.matchRate = Math.round(tmpGuess.matchRate * 1000) / 1000;
            allBestGuessNthEl.push(this.allGuess[0].allBestGuess[i]);
          }
          // Push to table the best/last result too.
          const bestGuess = this.allGuess[0].allBestGuess[numElements - 1];
          bestGuess.sum = Math.round(bestGuess.sum * 1000) / 1000;
          bestGuess.matchRate = Math.round(bestGuess.matchRate * 1000) / 1000;
          allBestGuessNthEl.push(
            bestGuess
          );

          // Send data to table
          this.dataSourceBestResults.data = allBestGuessNthEl;
          this.dataSourceBestResultsReady.next(true);

          // Calculation done show data to user
          this.calcDone = true;

          // Set up data to graph
          // this.dataSourceCompareFreqGraph = [
          //   ...this.allGuess[0].bigramsFreqInPerc.values()
          // ];
          // this.comparefreqGraph.updateGraph();
        }
      };
    }
    this.calcDataForPage();
  }

  encryptEndDecryptMessage() {
    this.keys = this.calcInverseKeyFromRndAlphabet(this.rndKey);
    this.encryptedText = this.enDecrypt(this.message, this.keys.encKey);
    this.decryptedText = this.enDecrypt(this.encryptedText, this.keys.decKey);
  }

  calcDataForPage() {
    if (this.cipherAttemptForm.invalid || this.cipherInputsForm.invalid) {
      return;
    }

    this.encryptEndDecryptMessage();
    this.calcDone = false;
    this.allGuess = [];

    const initKeyPairValues = this.initKeyPair.values();
    for (let i = 0; i < this.numberOfAttempt; i++) {
      let rndKey = [...this.rndKey];
      rndKey = this.shuffleArray(rndKey);
      this.webWorker.postMessage([
        this.numberOfIterations,
        this.encryptedText,
        rndKey,
        [...this.refBigrams],
        [...initKeyPairValues],
        this.decryptedText
      ]);
      // const guessedKey: GuessKey = this.guessKey(ITERATIONS, this.encryptedText);
    }
  }

  shuffleRndKey() {
    this.rndKey = [...this.shuffleArray(this.rndKey)];
  }

  private randomKey(): Array<string> {
    let abc = "";
    for (let i = 0; i < 26 /*abc length == key length*/; i++) {
      abc += String.fromCharCode(i + A_ASCII);
    }
    const rndKey = this.shuffleArray(abc.split(""));
    return rndKey;
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

  // Generate inverse key from input
  private calcInverseKeyFromRndAlphabet(rndAlphabet: Array<string>): Keys {
    const keys = {} as Keys;
    const mapping = rndAlphabet
      .map((item, i) => {
        return [i, item.charCodeAt(0) - A_ASCII];
      })
      .sort((a, b) => (a[1] > b[1] ? 1 : -1));
    keys.decKey = mapping.map(item => String.fromCharCode(item[0] + A_ASCII));
    keys.encKey = mapping
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(item => String.fromCharCode(item[1] + A_ASCII));
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
    this.dataSourceCompareFreqGraph = [
      ...this.allGuess[item.value - 1].bigramsFreqInPerc.values()
    ];
    // this.comparefreqGraph.updateGraph();
    console.log("Selected value: ", item.value);
    console.log(this.dataSourceCompareFreqGraph);
  }

  private setUpReferalValuesForGraph() {
    const bigrams = (BIGRAMS_IN_MAP as any).default;
    const bigramsInMap: Map<string, number> = new Map(
      [...bigrams.values()].sort()
    );
    const bigramsKeys = [...bigramsInMap.keys()];
    const bigramsValues = [...bigramsInMap.values()];

    this.initKeyPair = bigramsKeys.map(item => {
      return [item.toString(), 0];
    });

    // this.chartOptionsFreqGraph.xAxis.categories = bigramsKeys;
    // this.chartOptionsFreqGraph.series[1].data = bigramsValues;
  }

  @HostListener("window:scroll")
  checkScroll() {
    // if (window.pageYOffset >= 70) {
    //   this.topGap = 100;
    // } else {
    //   this.topGap = 250;
    // }
  }

  ngOnDestroy() {
    this.subscrMessage.unsubscribe();
    this.numberOfAttemptSubscr.unsubscribe();
    this.numberOfIterationsSubscr.unsubscribe();
    this.webWorker.terminate();
  }
}
