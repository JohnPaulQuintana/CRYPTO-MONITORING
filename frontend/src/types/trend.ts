export interface TrendPoint {

    date: string;

    exchange_rate: number;

}


export interface CurrencyTrends {

    [currency:string]: TrendPoint[];

}


export interface CryptoTrends {

    [crypto:string]: CurrencyTrends;

}


export interface Trends {

    [brand:string]: CryptoTrends;

}