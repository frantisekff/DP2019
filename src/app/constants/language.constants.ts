import { LanguageIcElement } from '../models/common.model';

export const LANGUAGEIC_DATA: LanguageIcElement[] = [
    { name: 'English', value: 0.0667 },
    { name: 'German', value: 0.0762 },
    { name: 'Italian', value: 0.0738 },
    { name: 'French', value: 0.0778 },
    { name: 'Spanish', value: 0.0770 },
    { name: 'Russian', value: 0.0529 },
    { name: 'Min IC', value: 0.0384 }
];

export const EN_ALPHABET_FREQUENCY = [8.12, 1.49, 2.71, 4.32, 12.02, 2.30, 2.03, 5.92, 7.31, 0.10,
    0.69, 3.98, 2.61, 6.95, 7.68, 1.82, 0.11, 6.02, 6.28, 9.10, 2.88, 1.11, 2.09, 0.17, 2.11, 0.07];

export const EN_ALPHABET_FREQUENCY_PERC = [0.0812, 0.0149, 0.0271, 0.0432, 0.1202, 0.023, 0.0203,
    0.0592, 0.0731, 0.001, 0.0069, 0.0398, 0.0261, 0.0695, 0.0768, 0.0182, 0.0011, 0.0602, 0.0628,
     0.091, 0.0288, 0.0111, 0.0209, 0.0017, 0.0211, 0.0007];

export const ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

export const COLORS = ['#2980B9', '#F1C40F', '#E74C3C', '#7B241C', '#9B59B6', '#85C1E9', '#148F77', '#16A085',
    '#27AE60', '#2ECC71', '#F39C12', '#E67E22', '#D35400', '#95A5A6', '#7F8C8D'];

export const MIN_IC = 0.0384;
export const A_ASCII: number = 'a'.charCodeAt(0);
