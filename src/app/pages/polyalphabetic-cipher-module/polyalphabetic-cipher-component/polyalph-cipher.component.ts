import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import * as ALL_COMBINATIONS_KEY from "../../../constants/allCombinations1_3.json";

import { SortTable, Ordering } from "../../../models/common.model";
import { COLORS, A_ASCII, LANGUAGEIC_DATA } from "../../../constants/language.constants";
import Utils from "src/app/utils";
import AnalysisText from "src/app/analysis-text";
import { Subject, Subscription } from "rxjs";
import {
  MESSAGE,
  TYPE_CIPHER,
  NAME_CIPHER,
  SIDE_MENU,
  TOP_GAP
} from "../polyalphabetic-cipher.constants";
import { PolyalphCipherService } from "../polyalphabetic-cipher.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HeaderService } from "src/app/components/header/header.service";

@Component({
  selector: "app-polyalphcipher",
  styleUrls: ["./polyalph-cipher.component.scss"],
  templateUrl: "./polyalph-cipher.component.html"
})
export class PolyalphCipher implements OnInit, OnDestroy {
  sideMenu = SIDE_MENU;
  topGap = TOP_GAP;

  colors = COLORS;
  private key = "abr";
  private subscrKey: Subscription;
  keyLength = this.key.length;
  private message = MESSAGE;
  private subscrMessage: Subscription;
  encMessageSplitted: string[];
  private formatedMessage;
  private encryptedText = "";
  private maxSelectedValue = 17;
  private allBoxesFrequency: number[][][] = [];
  allBoxesAvgIc = [];
  private webWorker: Worker;
  private maxGuessKeyLength = 2;

  decryptedText = "";
  ic = -1;
  passedMinIc = false;
  selectedValue = "2";
  toggleOptions: string[] = [];
  allBoxesIc: number[][] = [];
  allBoxes;
  highestIC;
  bestKeyLength;
  best10Results = [];
  columnsBestResults: string[] = ["key", "sum", "decryptedText"];
  sortBestResults: SortTable = {
    sortByColumn: "sum",
    order: Ordering.asc
  } as SortTable;
  dataSourceBestResults = new MatTableDataSource<any>();
  dataSourceBestResultsReady = new Subject<boolean>();
  // allCombinations = [];
  allCombinations: any = (ALL_COMBINATIONS_KEY as any).default;
  cipherInputsForm: FormGroup;

  constructor(
    private polyalphCipherService: PolyalphCipherService,
    headerService: HeaderService
  ) {
    headerService.cipherName.next(NAME_CIPHER);
    headerService.cipherType.next(TYPE_CIPHER);
  }

  ngOnInit(): void {
    this.cipherInputsForm = new FormGroup({
      key: new FormControl(this.key, [
        Validators.required,
        Validators.pattern("^[a-zA-Z]{2,3}$"),
        Validators.maxLength(3),
        Validators.minLength(2)
      ]),
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

    this.subscrKey = this.cipherInputsForm.controls.key.valueChanges.subscribe(
      newKey => {
        this.key = newKey;
      }
    );

    this.cipherInputsForm.statusChanges.subscribe(status => {
      console.log(status);
      console.log(this.cipherInputsForm);
    });

    if (typeof Worker !== "undefined") {
      this.webWorker = new Worker("./polyalphabetic-cipher-webworker.worker", {
        type: `module`
      });

      this.webWorker.onmessage = event => {
        const freqAllCombinationsOfDecMessage = event.data.freqAllCombinations;
        const decryptedAllCombinations = event.data.decryptedAllCombinations;

        const result = this.polyalphCipherService.calcDiffEnAlphAndAllDecTexts(
          freqAllCombinationsOfDecMessage,
          this.allCombinations,
          decryptedAllCombinations,
          this.highestIC[0].box
        );
        const sortedDiff = this.polyalphCipherService.chooseBestResults(
          result.diffFreqAllCombinations
        );
        // const minSum = this.polyalphCipherService.findBestResultLength(
        //   result.diffFreqAllCombinations
        // );
        // this.polyalphCipherService.selectedValue.emit(
        //   result.minimDiffFreqAllCombinations.toString()
        // );
        this.remapDataTableBestResult(sortedDiff);
        console.log("From Web Worker:", event.data);
      };
    }
    // generate array <2-16>
    this.toggleOptions = Utils.createArrayOfLength(
      this.maxSelectedValue - 2,
      2
    );

    this.calcDataForPage();
  }

  public calcDataForPage() {
    console.log(this.cipherInputsForm);
    this.formatedMessage = Utils.stripWhiteSpToLowerCase(this.message);
    this.keyLength = this.key.length;
    // Encrypt message
    this.encryptedText = this.encrypt(this.formatedMessage, this.key);
    // Decrypt message
    this.decryptedText = this.decrypt(this.encryptedText, this.key);

    // recalculate toggle options when formated messasge is to small
    if (this.formatedMessage.length < this.maxSelectedValue - 2) {
      this.toggleOptions = Utils.createArrayOfLength(
        this.formatedMessage.length - 2,
        2
      );
      this.polyalphCipherService.selectedValue.next(2);
    }

    // Split message to Boxes
    // For Example max is 3. We start from 2, we will be 2 boxex, text abcd produce 1: ac and box2: bd
    this.encMessageSplitted = this.encryptedText.split("");
    this.allBoxes = this.calculateBoxes(this.encMessageSplitted);
    console.log("Boxes");
    console.log(this.allBoxes);

    // we claculate Freq and IC for All Boxes
    const result = this.calcFreqAndICForAllBoxes(this.allBoxes);
    this.allBoxesFrequency = result.allBoxesFrequency;
    this.allBoxesIc = result.allBoxesIc;
    this.allBoxesAvgIc = result.allBoxesAvgIc;
    console.log(this.allBoxesFrequency);
    console.log(this.allBoxesIc);
    console.log("All Boxes Avg IC", this.allBoxesAvgIc);

    const refValueEn = LANGUAGEIC_DATA[0].value;

    // Create copy and sort by ic (desc)
    const copyAllBoxesAvgIc = Object.assign([], this.allBoxesAvgIc);
    const sortedIC = copyAllBoxesAvgIc
      .sort((a) => refValueEn - a.value)
      .slice();
    console.log("Sorted IC", sortedIC);
    this.highestIC = sortedIC;
    // with highest IC
    this.bestKeyLength = sortedIC[0];
    console.log("Best Key length ", this.bestKeyLength);

    const minDiffBetweenEnFreqAndText = 0.01;
    // Filter only values which are near to Best Key Length and select only first 5 values
    this.highestIC = this.allBoxesAvgIc
      .filter(
        item => this.bestKeyLength.value - item.value <= minDiffBetweenEnFreqAndText
      )
      .slice(0, 5);
    console.log("Highest IC after filter ", this.highestIC);

    // ref. IC for En alphabet
    // I expect that language is English so
    // I am looking for values that are near to ref. IC for english.
    // this.highestIC = this.highestIC
    // .filter(
    //   item => refValueEn - item.value <= minDiffBetweenEnFreqAndText
    // ).slice(0, 5);

    this.polyalphCipherService.selectedValue.next(this.highestIC[0].box);

    this.webWorker.postMessage([
      this.allCombinations[this.highestIC[0].box - 1],
      this.encryptedText
    ]);
  }

  // For every box calculate IC and Frequency
  private calcFreqAndICForAllBoxes(allBoxes) {
    let counterBoxes = 2;
    const allBoxesFrequency = [];
    const allBoxesIc = [];
    const allBoxesAvgIc = [];
    allBoxes.forEach(boxes => {
      const boxesFrequency: number[][] = [];
      const boxesIc: number[] = [];
      boxes.forEach(box => {
        const boxFreq: number[] = AnalysisText.getFrequencyOfText(box);
        boxesFrequency.push(boxFreq);
        boxesIc.push(AnalysisText.getIC(boxFreq, box.length));
      });

      allBoxesFrequency.push(boxesFrequency);
      allBoxesIc.push(boxesIc);
      console.log("Boxes IC ", boxesIc);

      //  Compute sum and avg
      const sum = boxesIc.reduce((a, b) => a + b, 0);
      const avg = sum / boxesIc.length || 0;
      const tmp = { box: 0, value: 0 };
      tmp.box = counterBoxes;
      tmp.value = avg;
      allBoxesAvgIc.push(tmp);
      counterBoxes += 1;
      console.log(`The sum is: ${sum}. The average is: ${avg}.`);
    });
    return { allBoxesFrequency, allBoxesIc, allBoxesAvgIc };
  }

  // remap data for Table
  private remapDataTableBestResult(sortedDiff) {
    this.best10Results = sortedDiff.slice(0, 10).map(data => {
      data["decryptedText"] = data["decryptedText"];
      return data;
    });

    // update data in table
    this.dataSourceBestResults.data = this.best10Results;
    this.dataSourceBestResultsReady.next(true);
  }

  // Split message to boxes, number of boxes is defined by maxSelectedValue
  public calculateBoxes(message: string[]): string[][] {
    const boxes: string[][] = [];

    for (let k = 2; k < this.maxSelectedValue; k++) {
      const box = [];
      for (let index = 0; index < message.length; index++) {
        for (let j = 2; j < k + 2; j++) {
          const numBox = index % k;
          if (!box[numBox]) {
            box[numBox] = [];
          }
          if (numBox === j - 2) {
            box[numBox].push(message[index]);
          }
        }
      }
      const boxToString: string[] = [];
      box.forEach(element => {
        boxToString.push(element.join(""));
      });
      boxes.push(boxToString);
    }

    return boxes;
  }

  private encrypt(plainText: string, keys: string): string {
    let encText = "";
    for (let i = 0; i < plainText.length; i++) {
      const letterAscii = plainText[i].charCodeAt(0);
      const key = keys[i % keys.length].charCodeAt(0) - A_ASCII;
      const encryptedLetter: number =
        ((letterAscii - A_ASCII + key) % 26) + A_ASCII;
      encText += String.fromCharCode(encryptedLetter);
    }
    return encText;
  }

  private decrypt(encryptedText: string, keys: string): string {
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

  ngOnDestroy() {
    this.subscrMessage.unsubscribe();
    this.subscrKey.unsubscribe();
    this.webWorker.terminate();
  }
}
