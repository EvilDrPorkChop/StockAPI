import yfinance as yf
import pandas as pd
from pandas_datareader import data as pdr
from numpy import datetime64


class TickerDataFetcher:

  def __init__(self, ticker, interval, period):
    self.ticker = ticker
    self.interval = interval
    self.period = period

  def LoadData(self):
    yf.pdr_override()
    ftse = yf.Ticker(self.ticker)
    data = ftse.history(period=self.period, interval=self.interval).dropna()
    data = data.tz_convert(None)
    data = data.reset_index()

    if 'Date' in data:
      dateString = 'Date'
    elif 'Datetime' in data:
      dateString = 'Datetime'
    else:
      dateString = 'index'

    print(data)
    print(data.dtypes)

    return data
