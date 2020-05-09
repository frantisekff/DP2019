import { EN_ALPHABET_FREQUENCY, ALPHABET } from 'src/app/constants/language.constants';

export const NAME_CIPHER = 'Caesar Cipher';
export const TYPE_CIPHER = 'Brute-force key search on';

export const COLUMN_CALC_FREQ_LANGUAGE = ['shift', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'sum'];

export const COLUMNS_REFFREQ_LANGUAGE: string[] = ['Name','English', 'German', 'Italian', 'French', 'Spanish', 'Russian', 'minIC' ];

export const MESSAGE =
    'theenglishwikipediawasthefirstwikipediaeditionandhasremainedthelargestithaspioneeredmanyi' +
    'deasasconventionspoliciesorfeatureswhichwerelateradoptedbywikipediaeditionsinsomeoftheother' +
    'languagestheseideasincludefeaturedarticlestheneutralpointofviewpolicynavigationtemplatesthesor' +
    'tingofshortstubarticlesintosubcategoriesdisputeresolutionmechanismssuchasmediationandarbitration' +
    'andweeklycollaborationstheenglishwikipediahasadoptedfeaturesfromwikipediasinotherlanguagesthesefeatures' +
    'includeverifiedrevisionsfromthegermanwikipediadewikiandtownpopulationlookuptemplatesfromthedutchwikipedianlwikial' +
    'thoughtheenglishwikipediastoresimagesandaudiofilesaswellastextfilesmanyoftheimageshavebeenmovedtowikimediacommonswiththe' +
    'samenameaspassedthroughfileshowevertheenglishwikipediaalsohasfairuseimagesandaudiovideofileswithcopyrightrestrictionsmostof' +
    'whicharenotallowedoncommonsmanyofthemostactiveparticipantsinthewikimediafoundationandthedevelopersofthemediawikisoftwarethat' +
    'powerswikipediaareenglishusers';

export const EQUATION = "\\sum_{i=A}^{i=Z}\\frac {n_i (n_i - 1)} {N (N - 1)}";

export const CHART_OPTIONS_FREQ_GRAPH = {
    chart: {
        type: 'column',
        scrollablePlotArea: {
            minWidth: 700,
            scrollPositionX: 1
          }
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
            },
            overflow: 'justify'

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


export const CHART_OPTIONS_COMPARE_FREQ = {
    chart: {
        type: 'column',
        scrollablePlotArea: {
            minWidth: 700,
            scrollPositionX: 1
          }
    },
    title: {
        text: 'Compare letter accuracy with language data values'
    },
    // subtitle: {
    //     text: 'Source: WorldClimate.com'
    // },
    xAxis: {
        categories: ALPHABET,
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
        name: 'Frequencies for decrypted text',
        data: []
    }, {
        name: 'Reference frequencies for language',
        data: EN_ALPHABET_FREQUENCY
    }]
};
export const TOP_GAP = 110;
export const SIDE_MENU = [
  {
    title: "Set inputs",
    active: true,
    id: "inputs",
    bottomPosition: 0,
    topPosition: 0

  },
  {
    title: "Description of Attack",
    active: true,
    id: "attack",
    bottomPosition: 0,
    topPosition: 0
  },
  {
    title: "Frequency of Encrypted Message",
    active: true,
    id: "frequency",
    bottomPosition: 0,
    topPosition: 0
  },
  {
    title: "Differences between frequencies",
    active: true,
    id: "differences",
    bottomPosition: 0,
    topPosition: 0
  },
  {
    title: "Comparsion of language frequencies",
    active: true,
    id: "compare",
    bottomPosition: 0,
    topPosition: 0
  }
];