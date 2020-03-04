import { Component, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, filter } from 'rxjs/operators';

import { AlphabetElement, SortTable, Ordering } from '../../../models/common.model';
import { LANGUAGEIC_DATA, EN_ALPHABET_FREQUENCY, ALPHABET, COLORS, A_ASCII } from '../../../constants/language.constants';
import Utils from 'src/app/utils';
import AnalysisText from 'src/app/analysis-text';

const DIFFFREQ_DATA: AlphabetElement[] = [];

@Component({
    selector: 'app-polyalphcipher',
    styleUrls: ['./polyalph-cipher.component.scss'],
    templateUrl: './polyalph-cipher.component.html'
})
export class PolyalphCipher implements OnInit {
    colors = COLORS;

    private key = 'abc';
    // Array to length of key for iterate to length of key
    private message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
        'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque gravida in fermentum et sollicitudin.' +
        ' Libero nunc consequat interdum varius sit. Eros donec ac odio tempor orci dapibus ultrices in iaculis. Rhoncus est' +
        'pellentesque elit ullamcorper dignissim cras tincidunt. Posuere urna nec tincidunt praesent semper feugiat. Ridiculus mus';

    private encMessageSplitted: string[];

    private enAlphabetFreqPerc = [];
    private formatedMessage;
    private encryptedText = '';
    decryptedText = '';
    ic = -1;
    passedMinIc = false;
    private nearestLanguage: string;
    selectedValue = '2';
    private maxSelectedValue = 17;
    toggleOptions: string[] = [];
    private allBoxesFrequency: number[][][] = [];
    allBoxesIc: number[][] = [];
    private allBoxesAvgIc = [];
    allBoxes;
    highestIC;
    bestKeyLength;
    best10Results = [];
    columnsBestResults: string[] = ['key', 'sum', 'decryptedText'];
    sortBestResults: SortTable = { sortByColumn: 'sum', order: Ordering.desc } as SortTable;
    dataSourceBestResults: MatTableDataSource<any>;

    ngOnInit(): void {


        //  ---------------   Polyalphabetic Cipher  -------------
        console.log(' ------------ Polyalphabetic Cipher ------------');

        // Frequency to percentage
        EN_ALPHABET_FREQUENCY.forEach(element => {
            this.enAlphabetFreqPerc.push(Math.round(element * 100) / 10000);
        });
        // generate array <2-16>
        this.toggleOptions = Array.from({ length: this.maxSelectedValue - 2 }, (x, i) => (i + 2).toString());


        this.enDeCryptMessage();
        this.selectionOfGraphChanged({ value: this.selectedValue });

        const maxGuessKeyLength = 3;
        const allCombinations = this.computeCombinationKeyLength(maxGuessKeyLength);
        console.log('All Combinations', allCombinations);

        // Decrypt encrypted text for every key
        const decryptedAllCombinations = [];

        for (const allKeysOfLength of allCombinations) {
            const decryptedForLength = [];
            for (const key of allKeysOfLength) {
                const decryptedText = this.decrypt(this.encryptedText, key);
                decryptedForLength.push(decryptedText);
            }
            decryptedAllCombinations.push(decryptedForLength);
        }
        console.log('Decrypted Texts for All Combinations', decryptedAllCombinations);


        // Calculate frequency for all decrypted options.
        const freqAllCombinations = [];
        for (const allMessagesOfLength of decryptedAllCombinations) {
            const forArray = AnalysisText.computeFreqForArray(allMessagesOfLength);
            freqAllCombinations.push(forArray);
        }
        console.log('Freq for All Combinations', freqAllCombinations);

        // Calculate differencies between en alphabet freq and all decrypted options.
        // Find minimum differences from all decrypted texts
        const diffFreqAllCombinations = [];
        const minimDiffFreqAllCombinations = [];

        for (let keyLength = 0; keyLength < freqAllCombinations.length; keyLength++) {
            let diffFreqDecryptedTexts = [];
            let minForKeyLength = 1000;
            let minForKeyLengthIndex = 0;

            for (let row = 0; row < freqAllCombinations[keyLength].length; row++) {
                const freqForKeyLength = freqAllCombinations[keyLength][row];
                const diffFreqForKeyLength = [];
                const lang = {} as AlphabetElement;

                for (let letter = 0; letter < freqForKeyLength.length; letter++) {
                    const freqDiff = Math.round(Math.abs(freqForKeyLength[letter] - EN_ALPHABET_FREQUENCY[letter]) * 100) / 100;
                    diffFreqForKeyLength.push(freqDiff);
                    lang[ALPHABET[letter]] = freqDiff;
                }

                lang.sum = Math.round(diffFreqForKeyLength.reduce(Utils.sumFunc) * 100) / 100;
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
                value: minForKeyLength, decryptedText: decryptedAllCombinations[keyLength][minForKeyLengthIndex]
            });
            minForKeyLength = 1000;
            console.log('Decrypted all combinations ');
        }
        // minimDiffFreqAllCombinations.push({
        //     index: 28,
        //     value: diffFreqAllCombinations[2][28], decryptedText: decryptedAllCombinations[2][28]
        // });

        console.log('All Minimum', minimDiffFreqAllCombinations);
        console.log('All Diff', diffFreqAllCombinations);

        const sortedDiff = diffFreqAllCombinations[2].sort((a, b) => a.sum - b.sum);

        console.log('Sorted Diff', sortedDiff);
        this.best10Results = sortedDiff.slice(0, 9).map((data) => {
            data['decryptedText'] = data['decryptedText'].substring(0, 30);
            return data;
        });
        this.dataSourceBestResults = new MatTableDataSource(this.best10Results);

    }

    public enDeCryptMessage() {
        this.allBoxesFrequency = [];
        this.allBoxesIc = [];
        this.allBoxesAvgIc = [];


        // word and function will be executed for every match
        // Strip all whitespaces and toLowerCase
        this.formatedMessage = this.message.replace(/\s/g, '').toLowerCase();
        // Encrypt message
        this.encryptedText = this.encrypt(this.formatedMessage, this.key);
        // Decrypt message
        this.decryptedText = this.decrypt(this.encryptedText, this.key);

        if (this.formatedMessage.length < this.maxSelectedValue - 2) {
            this.toggleOptions = Array.from({ length: this.formatedMessage.length - 2 }, (x, i) => (i + 2).toString());
            this.selectedValue = '2';
        }

        // Split message to Boxes 
        // For Example max is 3. We start from 2, we will be 2 boxex, text abcd produce 1: ac and box2: bd
        this.encMessageSplitted = this.encryptedText.split('');
        this.allBoxes = this.calculateBoxes(this.encMessageSplitted);
        let counterBoxes = 2;
        console.log('Boxes');
        console.log(this.allBoxes);

        // For every box calculate IC and Frequency
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
            console.log('Boxes IC ', boxesIc);

            //  Compute sum and avg
            const sum = boxesIc.reduce((a, b) => a + b, 0);
            const avg = (sum / boxesIc.length) || 0;
            const tmp = { 'box': 0, 'value': 0 };
            tmp.box = counterBoxes;
            tmp.value = avg;
            this.allBoxesAvgIc.push(tmp);
            counterBoxes += 1;
            console.log(`The sum is: ${sum}. The average is: ${avg}.`);
        });
        console.log(this.allBoxesFrequency);
        console.log(this.allBoxesIc);
        console.log('All Boxes Avg IC', this.allBoxesAvgIc);

        // Create copy and sort by ic (asc)
        const copy = Object.assign([], this.allBoxesAvgIc);
        const sortedIC = copy.sort((a, b) => b.value - a.value).slice();
        console.log('Sorted IC', sortedIC);

        // with smallest IC
        this.bestKeyLength = sortedIC[0];
        console.log('Best Key length ', this.bestKeyLength);

        this.highestIC = this.allBoxesAvgIc.filter(item => (sortedIC[0].value - item.value) <= 0.015);
        console.log('Highest IC after filter ', this.highestIC);

    }

    public getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
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
                    if (numBox === (j - 2)) {
                        box[numBox].push(message[index]);
                    }
                }
            }
            const boxToString: string[] = [];
            box.forEach(element => {
                boxToString.push(element.join(''));
            });
            boxes.push(boxToString);
        }

        return boxes;
    }

    public encrypt(plainText: string, keys: string): string {
        let encText = '';
        for (let i = 0; i < plainText.length; i++) {
            const letterAscii = plainText[i].charCodeAt(0);
            const key = keys[i % keys.length].charCodeAt(0) - A_ASCII;
            const encryptedLetter: number = ((letterAscii - A_ASCII + key) % 26) + A_ASCII;
            encText += String.fromCharCode(encryptedLetter);
        }
        return encText;
    }

    public decrypt(encryptedText: string, keys: string): string {
        let decText = '';
        for (let i = 0; i < encryptedText.length; i++) {
            const letterAscii = encryptedText[i].charCodeAt(0);
            const key = keys[i % keys.length].charCodeAt(0) - A_ASCII;
            const decryptedLetter: number = ((letterAscii - A_ASCII - key + 26) % 26) + A_ASCII;
            decText += String.fromCharCode(decryptedLetter);
        }
        return decText;
    }

    // Generate all combination of letters. It is Bbrute force attack with all words of length
    public computeCombinationKeyLength(maxGuessKeyLength: number): string[] {
        const allCombinations = [];
        allCombinations[0] = ALPHABET;
        for (let index = 1; index < maxGuessKeyLength; index++) {
            const result = this.addAllCombinationForArray(allCombinations[index - 1]);
            console.log('All Combinations for KeyLength ', index, 'Result', result);
            allCombinations.push(result);
        }
        return allCombinations;
    }

    public addAllCombinationForArray(inputArray: string[]): string[] {
        const allCombinations = [];
        for (const input of inputArray) {
            for (const letter1 of ALPHABET) {
                const word = input + letter1;
                allCombinations.push(word);
            }
        }
        return allCombinations;
    }

    // Change data for updateFlagCompareFreq based of selection <1-26>
    public selectionOfGraphChanged(item) {
        this.ic = this.allBoxesAvgIc[item.value - 2];
        console.log('All Boxes Avg IC: ', this.allBoxesAvgIc);

        this.nearestLanguage = AnalysisText.findNearestLanguage(this.ic, LANGUAGEIC_DATA);
        if (this.nearestLanguage === 'Min IC') {
            this.passedMinIc = true;
        }
        console.log('Selected value: ' + item.value);
    }
}