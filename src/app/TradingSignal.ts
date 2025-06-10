export interface TradingSignal {
  Date: string;
  chart_url: string;
  symbol: string;
  price: string;
  trend: string;
  Primary_Trade_Strategy: string;
  Secondary_Trade_Strategy: string;
  support1: string;
  support2: string;
  support3: string;
  resistance1: string;
  resistance2: string;
  resistance3: string;
  Forecast: string;
  trend_meter: string;
  key_news1: string;
  key_news2: string;
  import_timestamp: { $date: string; };
  _id?: string | { $oid: string };
  duration: string;
  type: string;
  Entry:string;
  Target1:string;
  Target2:string;
  StopLoss:string;

}
