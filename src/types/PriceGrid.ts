export interface PriceRow {
  height: number;
  values: number[];
}

export interface PriceGridData {
  widths: number[];
  prices: PriceRow[];
}