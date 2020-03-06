import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from "@angular/forms";
import {
  AlphabetElement,
  SortTable,
  Ordering
} from "../../../models/common.model";
import {
  LANGUAGEIC_DATA,
  EN_ALPHABET_FREQUENCY,
  ALPHABET,
  A_ASCII,
  EN_ALPHABET_FREQUENCY_PERC
} from "../../../constants/language.constants";
import AnalysisText from "../../../analysis-text";
import Utils from "src/app/utils";
import { GraphComponent } from "src/app/components/graph/graph.component";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { CaesarCipherService } from "../caesar-cipher.service";
import {
  CHART_OPTIONS_FREQ_GRAPH,
  CHART_OPTIONS_COMPARE_FREQ,
  COLUMNS_REFFREQ_LANGUAGE,
  COLUMN_CALC_FREQ_LANGUAGE,
  MESSAGE,
  EQUATION
} from "../caesar-cipher.constant";
import { Subscribable, Subscription } from "rxjs";

let DIFF_FREQ_DATA: AlphabetElement[] = [];

@Component({
  selector: "app-caesarcipher",
  styleUrls: ["./caesar-cipher.component.scss"],
  templateUrl: "./caesar-cipher.component.html"
})
export class CaesarCipher implements OnInit, OnDestroy {
  private enAlphabetFrequency = EN_ALPHABET_FREQUENCY;
  private alphabet = ALPHABET;
  private key = 4;
  private subscrKey: Subscription;
  private message = MESSAGE;
  private subscrMessage: Subscription;
  private frequencyInPercentage = [];
  private formatedMessage;
  private decryptedTexts = [];
  private freqDecryptedTexts = [];
  private diffFreqDecryptedTexts = [];

  // Variables for Tables
  sortRefFreqLang: SortTable = {
    sortByColumn: "value",
    order: Ordering.asc
  } as SortTable;
  sortCalcFreqLang: SortTable = {
    sortByColumn: "sum",
    order: Ordering.asc
  } as SortTable;
  columnsRefFreqLanguage = COLUMNS_REFFREQ_LANGUAGE;
  columnsCalcFreqLanguage = COLUMN_CALC_FREQ_LANGUAGE;

  dataSourceRefFreqLang = new MatTableDataSource(LANGUAGEIC_DATA);
  dataSourceCalcFreqLang = new MatTableDataSource();

  // Options for Graph - Encrypted text graph
  updateFlagFreqGraph = false;
  chartOptionsFreqGraph = CHART_OPTIONS_FREQ_GRAPH;

  // Options for Graph - Compare letter accuracy with language data values
  updateFlagCompareFreq = false;
  chartOptionsCompareFreq = CHART_OPTIONS_COMPARE_FREQ;
  frequency = [];
  encryptedText = "";
  decryptedText = "";
  ic = -1;
  passedMinIc = false;
  nearestLanguage: string;
  selectedValue = "15";
  toggleOptions: string[] = Utils.createArrayOfLength(26);
  minDisctanceLength = "";
  isLinear = false;
  inputsFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  @ViewChild("comparefreqGraph", { static: true })
  comparefreqGraph: GraphComponent;
  @ViewChild("freqGraph", { static: true }) freqGraph: GraphComponent;

  @ViewChild("sortCalcFreq", { static: true }) sortCalcFreq: MatSort;
  @ViewChild("sortRefFreq", { static: true }) sortRefFreq: MatSort;

  dataSourceCompareFreqGraph;
  dataSourceFreqGraph;

  equation = EQUATION;

  constructor(
    private _formBuilder: FormBuilder,
    private caesarCipherService: CaesarCipherService
  ) {}

  ngOnInit(): void {
    this.inputsFormGroup = this._formBuilder.group({
      key: [this.key, Validators.required],
      message: [MESSAGE, Validators.required]
    });

    this.subscrMessage = this.inputsFormGroup.controls.message.valueChanges.subscribe(
      newMessage => {
        this.message = newMessage;
      }
    );

    this.subscrKey = this.inputsFormGroup.controls.key.valueChanges.subscribe(
      newKey => {
        this.key = newKey;
      }
    );

    // Setting sorting for table
    this.dataSourceRefFreqLang.sort = this.sortRefFreq;
    this.dataSourceCalcFreqLang.sort = this.sortCalcFreq;

    this.enDeCryptMessage();
  }

  public enDeCryptMessage() {
    DIFF_FREQ_DATA = [];
    // word and function will be executed for every match

    const formatedMessage = Utils.stripWhiteSpToLowerCase(this.message);
    this.encryptedText = this.caesarCipherService.encrypt(
      formatedMessage,
      this.key
    );
    this.decryptedText = this.caesarCipherService.decrypt(
      this.key,
      this.encryptedText
    );
    this.calculateFrequencyGraph();

    // TO DO
    this.ic = AnalysisText.getIC( this.frequency, this.encryptedText.length);

    this.nearestLanguage = AnalysisText.findNearestLanguage(
      this.ic,
      LANGUAGEIC_DATA
    );

    if (this.nearestLanguage === "Min IC") {
      this.passedMinIc = true;
    }

    // desifrovanie pre kazdy kluc <1-26>
    this.decryptedTexts = this.caesarCipherService.decryptForEveryKey(this.encryptedText);

    // Calculate frequency for all decrypted options. Shift 1-26
    this.freqDecryptedTexts = AnalysisText.computeFreqForArray(
      this.decryptedTexts
    );

    this.calculateDiffFreqGraphTable(this.freqDecryptedTexts);

  }

  // Change data for CompareFreq based of selection <1-26>
  selectionOfGraphChanged(item: MatButtonToggleChange) {
    this.dataSourceCompareFreqGraph = Array.from(
      this.freqDecryptedTexts[item.value - 1]
    );
    this.comparefreqGraph.updateGraph();
    console.log("Selected value: ", item.value);
    console.log(this.dataSourceCompareFreqGraph);
  }

  public calculateDiffFreqGraphTable(freqDecryptedTexts: Array<string>) {

    // Calculate differecnies between frequancies of input text and referal values for language
    // for every letter
    let minDistance = 100;
    this.minDisctanceLength = '';
    const bestDisLength = {};

    for (let currentText = 0; currentText < freqDecryptedTexts.length; currentText++) {
      const freqForOneShift = freqDecryptedTexts[currentText];
      const diffFreqForOneShift = [];
      const lang = {} as AlphabetElement;

      for (let letter = 0; letter < freqForOneShift.length; letter++) {
        const freqDiff =
          Math.round(
            Math.abs(
              +freqForOneShift[letter] - EN_ALPHABET_FREQUENCY[letter]
            ) * 100
          ) / 100;
        diffFreqForOneShift.push(freqDiff);
        lang[this.alphabet[letter]] = freqDiff;
      }
      this.diffFreqDecryptedTexts[currentText] = diffFreqForOneShift;
      lang.shift = (currentText + 1).toString();

      lang.sum =
        Math.round(
          this.diffFreqDecryptedTexts[currentText].reduce(Utils.sumFunc) * 100
        ) / 100;

      DIFF_FREQ_DATA.push(lang);

      if (lang.sum <= minDistance) {
        minDistance = lang.sum;
        bestDisLength[lang.shift] = lang.sum;
      }
    }
    this.dataSourceCalcFreqLang.data = DIFF_FREQ_DATA;

    // console.log("Data Calc", this.dataSourceCalcFreqLang);
    // console.log("Data Ref", this.dataSourceRefFreqLang);
    // console.log("approximatedDisLength", bestDisLength);

    // sortovanie od najmensieh po najvacsie a vybratie najmensieho
    this.minDisctanceLength = Utils.sortAsc(bestDisLength)[0];
    this.selectedValue = this.minDisctanceLength;

    this.dataSourceCompareFreqGraph = Array.from(
      this.freqDecryptedTexts[+this.minDisctanceLength - 1]
    );
    this.comparefreqGraph.updateGraph();

    console.log("Min Distance Length", this.minDisctanceLength);

  }

  // Calculate frequencies for FreqGraph and update data in Graph
  public calculateFrequencyGraph() {
    this.frequency = AnalysisText.getFrequencyOfText(this.encryptedText);
    const encryptedTextLength = this.encryptedText.length;
    this.frequencyInPercentage = AnalysisText.freqToPerc(
        this.frequency,
        encryptedTextLength
      );
    this.dataSourceFreqGraph = AnalysisText.mapLetterToFreqPerc(this.frequency, this.frequencyInPercentage);
    this.freqGraph.updateGraph();
  }

  ngOnDestroy() {
    this.subscrMessage.unsubscribe();
    this.subscrKey.unsubscribe();
  }
}
