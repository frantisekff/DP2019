import { EN_ALPHABET_FREQUENCY, ALPHABET } from 'src/app/constants/language.constants';

export const NAME_CIPHER = 'Simple Substitution Cipher';
export const TYPE_CIPHER = 'Monoalphabetic';

export const EXAMPLE_RND_ALPHABET = [
  'v',
  'b',
  'd',
  'e',
  'f',
  'c',
  'g',
  'h',
  'j',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'i',
  'r',
  'z',
  's',
  'k',
  't',
  'u',
  'x',
  'w',
  'y',
  'a'
];

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

export const CHART_OPTIONS_COMPARE_BIGRAMS = {
  chart: {
    type: 'column'
  },
  title: {
    text: 'Compare bigrams frequency with language data values'
  },
  // subtitle: {
  //     text: 'Source: WorldClimate.com'
  // },
  xAxis: {
    categories: [],
    crosshair: true
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Frequency of bigrams'
    }
  },
  tooltip: {
    pointFormat: 'Population {point.y:.1f} %</b>'
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0
    }
  },
  series: [
    {
      name: 'Frequencies of bigrams for decrypted text',
      data: []
    },
    {
      name: 'Reference frequencies for language',
      data: []
    }
  ]
};
