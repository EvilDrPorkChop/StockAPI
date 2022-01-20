import pandas as pd
from alpaca_trade_api.common import URL
from alpaca_trade_api.rest import REST, TimeFrame, TimeFrameUnit
import config
class TickerDataFetcher:

  def __init__(self, ticker, interval, intervalType, fromDate, toDate):
    self.ticker = ticker
    self.interval = interval
    self.intervalType = intervalType
    self.fromDate = fromDate
    self.toDate = toDate

  def LoadData(self):
    if self.intervalType == "day":
      tf = TimeFrameUnit.Day
    elif self.intervalType == "minute":
      tf = TimeFrameUnit.Minute
    else:
      tf = TimeFrameUnit.Hour

    print(self.fromDate)
    # Instantiate REST API Connection
    api = REST(key_id=config.ALPACA_API_KEY, secret_key=config.ALPACA_SECRET_KEY, base_url=config.BASE_URL, api_version='v2')
    data = api.get_bars(symbol=self.ticker, timeframe=TimeFrame(self.interval, tf), start=self.fromDate, end=self.toDate, adjustment='raw').df

    print(data)
    print(data.dtypes)

    return data
