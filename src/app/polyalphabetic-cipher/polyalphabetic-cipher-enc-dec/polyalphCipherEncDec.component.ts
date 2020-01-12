import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

export interface LanguageIcElement {
    name: string;
    value: number;
}

export interface AlphabetElement {
    shift: string;
    sum: number;
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
    f: string;
    g: string;
    h: string;
    i: string;
    j: string;
    k: string;
    l: string;
    m: string;
    n: string;
    o: string;
    p: string;
    q: string;
    r: string;
    s: string;
    t: string;
    u: string;
    v: string;
    w: string;
    x: string;
    y: string;
    z: string;
}

const LANGUAGEIC_DATA: LanguageIcElement[] = [
    { name: 'English', value: 0.0667 },
    { name: 'German', value: 0.0762 },
    { name: 'Italian', value: 0.0738 },
    { name: 'French', value: 0.0778 },
    { name: 'Spanish', value: 0.0770 },
    { name: 'Russian', value: 0.0529 },
    { name: 'Min IC', value: 0.0384 }

];
const DIFFFREQ_DATA: AlphabetElement[] = [];


@Component({
    selector: 'app-polyalphcipher',
    styleUrls: ['./polyalphCipherEncDec.component.scss'],
    templateUrl: './polyalphCipherEncDec.component.html'
})
export class PolyalphCipher implements OnInit {
    private enAlphabetFrequency = [8.12, 1.49, 2.71, 4.32, 12.02, 2.30, 2.03, 5.92, 7.31, 0.10,
        0.69, 3.98, 2.61, 6.95, 7.68, 1.82, 0.11, 6.02, 6.28, 9.10, 2.88, 1.11, 2.09, 0.17, 2.11, 0.07];
    private alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
        'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    private key = 'test';
    // Array to length of key for iterate to length of key
    private keyIterator;
    private keyLength;
    private quessKey;
    private quessKeyLength;
    private message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
        'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque gravida in fermentum et sollicitudin.' +
        ' Libero nunc consequat interdum varius sit. Eros donec ac odio tempor orci dapibus ultrices in iaculis. Rhoncus est' +
        'pellentesque elit ullamcorper dignissim cras tincidunt. Posuere urna nec tincidunt praesent semper feugiat. Ridiculus mus' +
        'mauris vitae ultricies leo integer malesuada nunc vel. Varius vel pharetra vel turpis nunc eget lorem. Lacinia at quis risus sed' +
        'vulputate odio ut enim blandit. Vitae suscipit tellus mauris a diam maecenas sed enim. Malesuada fames ac turpis egestas sed ' +
        ' et pharetra. Elit sed vulputate mi sit amet mauris commodo. Sapien pellentesque habitant morbi tristique senectus et netus et' +
        ' malesuada. Aliquam etiam erat velit scelerisque. Proin fermentum leo vel orci porta non pulvinar neque.';

    private encMessageSplitted: string[];
    private colors = ['#7B241C', '#E74C3C', '#9B59B6', '#2980B9', '#85C1E9', '#148F77', '#16A085',
        '#27AE60', '#2ECC71', '#F1C40F', '#F39C12', '#E67E22', '#D35400', '#95A5A6', '#7F8C8D'];

    private minIc = 0.0384;
    private aAscii: number = 'a'.charCodeAt(0);

    // Variables for Tables
    private columnsRefFreqLanguage: string[] = ['name', 'value'];
    private columnsCalcFreqLanguage = ['shift', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
        'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'sum'];

    private dataSourceRefFreqLang = LANGUAGEIC_DATA;
    private dataSourceCalcFreqLang = DIFFFREQ_DATA;

    private enAlphabetFreqPerc = [];
    private frequency = [];
    private frequencyInPercentage = [];
    private formatedMessage;
    private encryptedText = '';
    private decryptedText = '';
    private ic = -1;
    private passedMinIc = false;
    private nearestLanguage: string;
    private decryptedTexts = [];
    private freqDecryptedTexts = [];
    private actualDataInCompareGraph = [];
    private diffFreqDecryptedTexts = [];
    private sumDiffFreq = [];
    public selectedValue = '2';
    private maxSelectedValue = 17;
    private toggleOptions: string[] = [];


    private allBoxesFrequency: number[][][] = [];
    private allBoxesIc: number[][] = [];
    private allBoxesAvgIc: number[] = [];
    private allBoxes;
    public highestIC;
    public bestKeyLength;

    ngOnInit(): void {
        //  ---------------   Polyalphabetic Cipher  -------------
        console.log(' ------------ Polyalphabetic Cipher ------------');
        this.enAlphabetFrequency.forEach(element => {
            this.enAlphabetFreqPerc.push(Math.round(element * 100) / 10000);
        });
        this.toggleOptions = Array.from({ length: this.maxSelectedValue - 2 }, (x, i) => (i + 2).toString());

        this.enDeCryptMessage();
        this.selectionOfGraphChanged({ value: this.selectedValue });
    }

    public enDeCryptMessage() {
        this.keyIterator = this.key.split('');
        this.keyLength = this.key.length;


        // word and function will be executed for every match
        // Strip all whitespaces and toLowerCase
        this.formatedMessage = this.message.replace(/\s/g, '').toLowerCase();
        this.encryptedText = this.encrypt(this.formatedMessage, this.key);
        this.decryptedText = this.decrypt(this.encryptedText, this.key);
        if (this.formatedMessage.length < this.maxSelectedValue - 2) {
            this.toggleOptions = Array.from({ length: this.formatedMessage.length - 2 }, (x, i) => (i + 2).toString());
            this.selectedValue = '2';
        }

        // this.frequencyInPercentage = this.calculateFreqPerc(this.encryptedText);
        // console.log('Frequency in %', this.frequencyInPercentage);

        // this.ic = this.getIC(this.frequencyInPercentage);
        // this.findNearestLanguage();
        // if (this.nearestLanguage === 'Min IC') {
        //     this.passedMinIc = true;
        // }


        this.encMessageSplitted = this.encryptedText.split('');
        this.allBoxes = this.calculateBoxes(this.encMessageSplitted);
        console.log('Boxes');
        console.log(this.allBoxes);


        this.allBoxes.forEach(boxes => {
            const boxesFrequency: number[][] = [];
            const boxesIc: number[] = [];
            boxes.forEach(box => {
                const boxFreq: number[] = this.calculateFreqPerc(box);
                boxesFrequency.push(boxFreq);
                boxesIc.push(this.getIC(boxFreq));
            });
            this.allBoxesFrequency.push(boxesFrequency);
            this.allBoxesIc.push(boxesIc);
            console.log('Boxes IC ', boxesIc);
            const sum = boxesIc.reduce((a, b) => a + b, 0);
            const avg = (sum / boxesIc.length) || 0;
            this.allBoxesAvgIc.push(avg);
            console.log(`The sum is: ${sum}. The average is: ${avg}.`);
        });
        console.log(this.allBoxesFrequency);
        console.log(this.allBoxesIc);
        this.highestIC = this.allBoxesAvgIc.sort((a, b) => b - a)[0];
        this.bestKeyLength = this.allBoxesAvgIc.indexOf(this.highestIC);
    }

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
            const key = keys[i % keys.length].charCodeAt(0) - this.aAscii;
            const encryptedLetter: number = ((letterAscii - this.aAscii + key) % 26) + this.aAscii;
            encText += String.fromCharCode(encryptedLetter);
        }
        return encText;
    }

    public decrypt(encryptedText: string, keys: string): string {
        let decText = '';
        for (let i = 0; i < encryptedText.length; i++) {
            const letterAscii = encryptedText[i].charCodeAt(0);
            const key = keys[i % keys.length].charCodeAt(0) - this.aAscii;
            const decryptedLetter: number = ((letterAscii - this.aAscii - key + 26) % 26) + this.aAscii;
            decText += String.fromCharCode(decryptedLetter);
        }
        return decText;
    }

    // Change data for updateFlagCompareFreq based of selection <1-26>
    public selectionOfGraphChanged(item) {
        this.ic = this.allBoxesAvgIc[item.value - 2];
        this.findNearestLanguage();
        if (this.nearestLanguage === 'Min IC') {
            this.passedMinIc = true;
        }
        // this.calculateFreqPerc = calculateFreqPerc();
        this.quessKey = Array.from({ length: item.value }, (x, i) => i);
        this.quessKeyLength = this.quessKey.length;
        console.log('Selected value: ' + item.value);
    }

    // Calculate Index of coincidence and find nearest Language
    public getIC(frequencyInPercentage: number[]): number {
        let ic = 0;
        frequencyInPercentage.forEach(element => {
            element = element / 100;
            ic += element * element;
        });

        return ic;
    }

    public findNearestLanguage() {
        let nearestLang = '';
        let nearestValue = 10;

        this.dataSourceRefFreqLang.forEach(element => {
            const actualDiff = Math.abs(element.value - this.ic);
            if (nearestValue > actualDiff) {
                nearestValue = actualDiff;
                nearestLang = element.name;
            }
        });
        this.nearestLanguage = nearestLang;
    }


    // Calculate Frequency and convert it to percentage
    public calculateFreqPerc(message: string): number[] {
        const frequency = this.getFrequencyOfText(message);
        const frequencyInPercentage = [];
        const encryptedTextLength = message.length;

        console.log('Frequency', frequency);
        const tmpData = [];
        for (const item of frequency) {
            let inPercentage = item / encryptedTextLength * 100;
            inPercentage = Math.round(inPercentage * 100) / 100;
            frequencyInPercentage.push(inPercentage);
            tmpData.push(inPercentage);
        }
        return frequencyInPercentage;
    }

    private getFrequencyOfText(message: string): number[] {
        const tmpFrequency = [];
        // console.log(message);
        for (const char of this.alphabet) {
            const splittedText = message.split(char);
            tmpFrequency.push(splittedText.length - 1);
        }
        return tmpFrequency;
    }



}