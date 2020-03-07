import { EN_ALPHABET_FREQUENCY, ALPHABET } from 'src/app/constants/language.constants';

export const COLUMN_CALC_FREQ_LANGUAGE = ['shift', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'sum'];

export const COLUMNS_REFFREQ_LANGUAGE: string[] = ['name', 'value'];

export const MESSAGE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,' +
        'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque gravida in fermentum et sollicitudin.' +
        ' Libero nunc consequat interdum varius sit. Eros donec ac odio tempor orci dapibus ultrices in iaculis. Rhoncus est' +
        'pellentesque elit ullamcorper dignissim cras tincidunt. Posuere urna nec tincidunt praesent semper feugiat. Ridiculus mus' +
        'mauris vitae ultricies leo integer malesuada nunc vel. Varius vel pharetra vel turpis nunc eget lorem. Lacinia at quis risus sed' +
        'vulputate odio ut enim blandit. Vitae suscipit tellus mauris a diam maecenas sed enim. Malesuada fames ac turpis egestas sed ' +
        ' et pharetra. Elit sed vulputate mi sit amet mauris commodo. Sapien pellentesque habitant morbi tristique senectus et netus et' +
        ' malesuada. Aliquam etiam erat velit scelerisque. Proin fermentum leo vel orci porta non pulvinar neque.fffffffffffff';

export const EQUATION = "\\sum_{i=A}^{i=Z}\\frac {n_i (n_i - 1)} {N (N - 1)}";

export const CHART_OPTIONS_FREQ_GRAPH = {
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


export const CHART_OPTIONS_COMPARE_FREQ = {
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