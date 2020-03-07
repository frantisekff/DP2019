import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";

import {
  AlphabetElement,
  SortTable,
  Ordering
} from "../../../models/common.model";
import {
  LANGUAGEIC_DATA,
  EN_ALPHABET_FREQUENCY,
  ALPHABET,
  COLORS,
  A_ASCII,
  EN_ALPHABET_FREQUENCY_PERC
} from "../../../constants/language.constants";
import Utils from "src/app/utils";
import AnalysisText from "src/app/analysis-text";
import { Subject } from "rxjs";
import { MESSAGE } from "../polyalphabetic-cipher.constants";
import { PolyalphCipherService } from "../polyalphabetic-cipher.service";

@Component({
  selector: "app-polyalphcipher",
  styleUrls: ["./polyalph-cipher.component.scss"],
  templateUrl: "./polyalph-cipher.component.html"
})
export class PolyalphCipher implements OnInit {
  colors = COLORS;
  private key = "abc";
  private message = MESSAGE;
  private encMessageSplitted: string[];
  private enAlphabetFreqPerc = EN_ALPHABET_FREQUENCY_PERC;
  private formatedMessage;
  private encryptedText = "";
  private nearestLanguage: string;
  private maxSelectedValue = 17;
  private allBoxesFrequency: number[][][] = [];
  private allBoxesAvgIc = [];
  private webWorker: Worker;
  private maxGuessKeyLength = 3;

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
  allCombinations = [];

  constructor(private polyalphCipherService: PolyalphCipherService) {}

  ngOnInit(): void {
    if (typeof Worker !== "undefined") {
      this.webWorker = new Worker("./polyalphabetic-cipher-webworker.worker", {
        type: `module`
      });

      this.webWorker.onmessage = event => {
        const freqAllCombinations = event.data.freqAllCombinations;
        const decryptedAllCombinations = event.data.decryptedAllCombinations;

        const result = this.polyalphCipherService.calcDiffEnAlphAndAllDecTexts(
          freqAllCombinations,
          this.allCombinations,
          decryptedAllCombinations
        );
        const sortedDiff = this.polyalphCipherService.choose10bestResults(
          result.diffFreqAllCombinations
        );
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
    this.formatedMessage = Utils.stripWhiteSpToLowerCase(this.message);
    // Encrypt message
    this.encryptedText = this.encrypt(this.formatedMessage, this.key);
    // Decrypt message
    this.decryptedText = this.decrypt(this.encryptedText, this.key);

    if (this.formatedMessage.length < this.maxSelectedValue - 2) {
      this.toggleOptions = Utils.createArrayOfLength(
        this.formatedMessage.length - 2,
        2
      );
      this.selectedValue = "2";
    }

    // Split message to Boxes
    // For Example max is 3. We start from 2, we will be 2 boxex, text abcd produce 1: ac and box2: bd
    this.encMessageSplitted = this.encryptedText.split("");
    this.allBoxes = this.calculateBoxes(this.encMessageSplitted);
    console.log("Boxes");
    console.log(this.allBoxes);

    this.calcFreqAndICForAllBoxes();
    console.log(this.allBoxesFrequency);
    console.log(this.allBoxesIc);
    console.log("All Boxes Avg IC", this.allBoxesAvgIc);

    // Create copy and sort by ic (asc)
    const copy = Object.assign([], this.allBoxesAvgIc);
    const sortedIC = copy.sort((a, b) => b.value - a.value).slice();
    console.log("Sorted IC", sortedIC);

    // with smallest IC
    this.bestKeyLength = sortedIC[0];
    console.log("Best Key length ", this.bestKeyLength);

    this.highestIC = this.allBoxesAvgIc.filter(
      item => sortedIC[0].value - item.value <= 0.015
    );
    console.log("Highest IC after filter ", this.highestIC);

    this.selectionOfGraphChanged({ value: this.selectedValue });

    this.allCombinations = this.polyalphCipherService.computeCombinationKeyLength(
      this.maxGuessKeyLength
    );
    this.webWorker.postMessage([this.allCombinations, this.encryptedText]);
  }

  // For every box calculate IC and Frequency
  private calcFreqAndICForAllBoxes() {
    let counterBoxes = 2;

    this.allBoxes.forEach(boxes => {
      const boxesFrequency: number[][] = [];
      const boxesIc: number[] = [];
      boxes.forEach(box => {
        const boxFreq: number[] = AnalysisText.getFrequencyOfText(box);
        boxesFrequency.push(boxFreq);
        boxesIc.push(AnalysisText.getIC(boxFreq, box.length));
      });

      this.allBoxesFrequency.push(boxesFrequency);
      this.allBoxesIc.push(boxesIc);
      console.log("Boxes IC ", boxesIc);

      //  Compute sum and avg
      const sum = boxesIc.reduce((a, b) => a + b, 0);
      const avg = sum / boxesIc.length || 0;
      const tmp = { box: 0, value: 0 };
      tmp.box = counterBoxes;
      tmp.value = avg;
      this.allBoxesAvgIc.push(tmp);
      counterBoxes += 1;
      console.log(`The sum is: ${sum}. The average is: ${avg}.`);
    });
  }

  // remap data for Table
  private remapDataTableBestResult(sortedDiff) {
    this.best10Results = sortedDiff.slice(0, 15).map(data => {
      data["decryptedText"] = data["decryptedText"].substring(0, 30);
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

  // Change data for updateFlagCompareFreq based of selection <1-26>
  public selectionOfGraphChanged(item) {
    this.ic = this.allBoxesAvgIc[item.value - 2];
    console.log("All Boxes Avg IC: ", this.allBoxesAvgIc);

    this.nearestLanguage = AnalysisText.findNearestLanguage(
      this.ic,
      LANGUAGEIC_DATA
    );
    if (this.nearestLanguage === "Min IC") {
      this.passedMinIc = true;
    }
    console.log("Selected value: " + item.value);
  }
}
