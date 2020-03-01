export interface LanguageIcElement {
    name: string;
    value: number;
}
export interface AlphabetElement {
    key: string;
    decryptedText: string;
    sum: number;
    shift: string;
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

export enum Ordering {
  asc = 'asc',
  desc = 'desc'
}

export interface SortTable {
    sortByColumn: string;
    order: Ordering; 
}
