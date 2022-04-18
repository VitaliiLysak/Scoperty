export interface PriceTrend {
  date: string;
  price: number;
}

export interface PriceTrendObj {
  uuid: string;
  trends: PriceTrend[];
}

export interface PriceTrends {
  property: PriceTrendObj;
  city: PriceTrendObj;
}
