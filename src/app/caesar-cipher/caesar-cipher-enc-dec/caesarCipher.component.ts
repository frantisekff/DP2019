import { Component, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageIcElement, AlphabetElement } from '../../models/common.model';
import { LANGUAGEIC_DATA, EN_ALPHABET_FREQUENCY, ALPHABET, A_ASCII } from '../../constants/language.constants';
import AnalysisText from '../../analysis-text';
import Utils from 'src/app/utils';

let DIFFFREQ_DATA: AlphabetElement[] = [];


@Component({
    selector: 'app-caesarcipher',
    styleUrls: ['./caesarCipher.component.scss'],
    templateUrl: './caesarCipher.component.html'
})
export class CaesarCipher implements OnInit {

    private enAlphabetFrequency = EN_ALPHABET_FREQUENCY;
    private alphabet = ALPHABET;
    private key = 4;
    private message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
        'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque gravida in fermentum et sollicitudin.' +
        ' Libero nunc consequat interdum varius sit. Eros donec ac odio tempor orci dapibus ultrices in iaculis. Rhoncus est' +
        'pellentesque elit ullamcorper dignissim cras tincidunt. Posuere urna nec tincidunt praesent semper feugiat. Ridiculus mus' +
        'mauris vitae ultricies leo integer malesuada nunc vel. Varius vel pharetra vel turpis nunc eget lorem. Lacinia at quis risus sed' +
        'vulputate odio ut enim blandit. Vitae suscipit tellus mauris a diam maecenas sed enim. Malesuada fames ac turpis egestas sed ' +
        ' et pharetra. Elit sed vulputate mi sit amet mauris commodo. Sapien pellentesque habitant morbi tristique senectus et netus et' +
        ' malesuada. Aliquam etiam erat velit scelerisque. Proin fermentum leo vel orci porta non pulvinar neque.fffffffffffff';

    // Variables for Tables
    private columnsRefFreqLanguage: string[] = ['name', 'value'];
    private columnsCalcFreqLanguage = ['shift', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
        'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'sum'];

    private dataSourceRefFreqLang = new MatTableDataSource(LANGUAGEIC_DATA);
    private dataSourceCalcFreqLang = new MatTableDataSource();

    private Highcharts = Highcharts;
    // Options for Graph - Encrypted text graph
    private updateFlagFreqGraph = false;
    private chartOptionsFreqGraph = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Frequency for encrypted text'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category',
            title: {
                text: 'Letters in encrypted text'
            },
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Frequency'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Population {point.y:.1f} %</b>'
        },
        series: [{
            name: 'Population',
            data: [],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f} %', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    };

    // Options for Graph - Compare letter accuracy with language data values
    private updateFlagCompareFreq = false;
    private chartOptionsCompareFreq = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Compare letter accuracy with language data values'
        },
        // subtitle: {
        //     text: 'Source: WorldClimate.com'
        // },
        xAxis: {
            categories: this.alphabet,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Frequency'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Frequencies for encrypted text',
            data: []
        }, {
            name: 'Reference frequencies for language',
            data: this.enAlphabetFrequency
        }]
    };

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
    private selectedValue = '15';
    private toggleOptions: string[] = [];
    public minDisctanceLength: string = '';

    isLinear = false;
    inputsFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;


    @ViewChild('sortCalcFreq', { static: true }) sortCalcFreq: MatSort;
    @ViewChild('sortRefFreq', { static: true }) sortRefFreq: MatSort;

    ngOnInit(): void {

        this.inputsFormGroup = this._formBuilder.group({
            key: [this.key, Validators.required],
            message: [this.message, Validators.required]
        });


        // this.dataSourceRefFreqLang.sort = this.sortRefFreq;
        // this.dataSourceCalcFreqLang.sort = this.sortCalcFreq;
        this.dataSourceRefFreqLang.sort = this.sortRefFreq;
        this.dataSourceCalcFreqLang.sort = this.sortCalcFreq;
        //  ---------------   Ceaser Cipher  -------------
        console.log(" ------------ Ceaser Cipher ------------");
        console.log('For testing: aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz');
        this.toggleOptions = Array.from(Array(26), (x, index) => (index + 1).toString());
        this.enAlphabetFrequency.forEach(element => {
            this.enAlphabetFreqPerc.push(Math.round(element * 100) / 10000);
        });
        this.enDeCryptMessage();
    }

    constructor(private _formBuilder: FormBuilder) { }


    public enDeCryptMessage() {
        DIFFFREQ_DATA = [];
        // word and function will be executed for every match
        // Strip all whitespaces and toLowerCase
        this.formatedMessage = this.inputsFormGroup.controls.message.value.replace(/\s/g, '').toLowerCase();
        this.encrypt();
        this.decryptedText = this.decrypt();
        this.calculateFrequencyGraph();

        // TO DO 
        this.getIC();


        this.nearestLanguage = AnalysisText.findNearestLanguage(this.ic, LANGUAGEIC_DATA);
        if (this.nearestLanguage === 'Min IC') {
            this.passedMinIc = true;
        }
        console.log('Frequency in %', this.frequencyInPercentage);


        this.decryptedTexts = this.decryptForEveryKey();


        // Calculate frequency for all decrypted options. Shift 1-25
        this.freqDecryptedTexts = AnalysisText.computeFreqForArray(this.decryptedTexts);
        console.log(this.freqDecryptedTexts);

        // Calculate differecnies between frequancies of input text and referal values for language 
        // for every letter
        let minDistance = 100;
        this.minDisctanceLength = '';
        let approximatedDisLength = {};

        for (let row = 0; row < this.freqDecryptedTexts.length; row++) {
            const freqForOneShift = this.freqDecryptedTexts[row];
            const diffFreqForOneShift = [];
            const lang = {} as AlphabetElement;

            for (let letter = 0; letter < freqForOneShift.length; letter++) {
                const freqDiff = Math.round(Math.abs(freqForOneShift[letter] - this.enAlphabetFrequency[letter]) * 100) / 100;
                diffFreqForOneShift.push(freqDiff);
                lang[this.alphabet[letter]] = freqDiff;
            }
            this.diffFreqDecryptedTexts[row] = diffFreqForOneShift;
            lang.shift = (row + 1).toString();

            lang.sum = Math.round(this.diffFreqDecryptedTexts[row].reduce(Utils.sumFunc) * 100) / 100;
            DIFFFREQ_DATA.push(lang);
            console.log(lang.shift);
            console.log(lang.sum);
            if (lang.sum <= minDistance) {
                minDistance = lang.sum;
                approximatedDisLength[lang.shift] = lang.sum;
            }
        }
        this.dataSourceCalcFreqLang.data = DIFFFREQ_DATA;
        console.log('Data Calc', this.dataSourceCalcFreqLang);
        console.log('Data Ref', this.dataSourceRefFreqLang);
        console.log('approximatedDisLength', approximatedDisLength);

        this.chartOptionsCompareFreq.series[0].data = Array.from(this.freqDecryptedTexts[14]);
        this.updateFlagFreqGraph = true;
        this.minDisctanceLength = Object.keys(approximatedDisLength).sort(function (a, b) {
            return approximatedDisLength[a] - approximatedDisLength[b];
        })[0];
        this.selectedValue = this.minDisctanceLength;
        // console.log('Min Approx Length', this.minDisctanceLength);

        // Object.values(approximatedDisLength).forEach(distance => {
        //     if ((distance < (approximatedDisLength[min] + 1)) || distance === approximatedDisLength[min]) {
        //         // this.minDisctanceLength.push(distance);
        //         console.log(distance);
        //     }
        // });
        console.log('Min Distance Length', this.minDisctanceLength);

    }




    // Change data for updateFlagCompareFreq based of selection <1-26>
    selectionOfGraphChanged(item) {
        this.actualDataInCompareGraph = Array.from(this.freqDecryptedTexts[item.value - 1]);
        this.chartOptionsCompareFreq.series[0].data = this.actualDataInCompareGraph;
        this.updateFlagCompareFreq = true;
        console.log("Selected value: " + item.value);
        console.log(this.actualDataInCompareGraph);
    }

    public encrypt() {
        this.encryptedText = '';
        for (const letter of this.formatedMessage) {
            const letterAscii = letter.charCodeAt(0);

            const encryptedLetter: number = (((letterAscii - A_ASCII) +
                this.inputsFormGroup.controls.key.value + 26) % 26) + A_ASCII;

            this.encryptedText += String.fromCharCode(encryptedLetter);
        }
    }

    public decryptForEveryKey(): Array<string> {
        const decryptedTexts = [];
        for (let key = 1; key <= this.alphabet.length; key++) {
            decryptedTexts.push(this.decrypt(key));
        }
        return decryptedTexts;
    }

    public decrypt(inputKey?: number): string {
        let key: number;
        let decryptedText = '';

        if (typeof inputKey === 'undefined') {
            key = this.inputsFormGroup.controls.key.value;
        } else {
            key = inputKey;
        }
        for (const letter of this.encryptedText) {
            const letterAscii = letter.charCodeAt(0);
            const decryptedLetter: number = ((letterAscii - A_ASCII - key + 26) % 26) + A_ASCII;
            decryptedText += String.fromCharCode(decryptedLetter);
        }
        return decryptedText;
    }

    // Calculate frequencies for updateFlagFreqGraph
    public calculateFrequencyGraph() {
        this.frequency = AnalysisText.getFrequencyOfText(this.encryptedText);
        this.frequencyInPercentage = [];
        const encryptedTextLength = this.encryptedText.length;

        console.log(this.frequency);
        const tmpData = [];
        for (let index = 0; index < this.frequency.length; index++) {
            let inPercentage = this.frequency[index] / encryptedTextLength * 100;
            inPercentage = Math.round(inPercentage * 100) / 100;
            this.frequencyInPercentage.push(inPercentage);
            tmpData.push([this.alphabet[index], inPercentage]);
        }
        this.chartOptionsFreqGraph.series[0].data = tmpData;

        this.updateFlagFreqGraph = true;
        console.log(this.chartOptionsFreqGraph.series[0].data);
    }


    // Calculate Index of coincidence and find nearest Language
    public getIC() {
        let ic = 0;
        this.frequencyInPercentage.forEach(element => {
            element = element / 100;
            ic += element * element;
        });

        this.ic = ic;
   
    }

}