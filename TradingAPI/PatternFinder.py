import yfinance as yf
import pandas as pd
from pandas_datareader import data as pdr
from numpy import datetime64


def hr_func(ts):
  return ts.hour

def getPercent(before, this):
  return float(this/before*100)

class PatternFinder:

  def __init__(self, ticker, period, interval):
    self.ticker = ticker
    self.period = period
    self.interval = interval
    self.data = self.LoadData()

    if 'Date' in self.data:
      self.dateString = 'Date'
    elif 'Datetime' in self.data:
      self.dateString = 'Datetime'
    else:
      self.dateString = 'index'

    self.data['time'] = self.data[self.dateString].apply(hr_func)

  def LoadData(self):
    yf.pdr_override()
    tick = yf.Ticker(self.ticker)
    data = tick.history(period=self.period, interval=self.interval).dropna()
    data = data.reset_index()
    return data

  def averageOutEachHour(self):
    hours = self.data['time'].unique()

    df = self.data.loc[self.data['time'] == hours[0]]
    days = len(df.index)

    hourFrames = []

    for hour in hours:
      hourFrames.append(self.data.loc[self.data['time'] == hour])

    hourPercents = []
    for index in range(len(hourFrames)):
      dayPercents = []
      for day in range(days):
        if index == 0:
          dayPercents.append(100)
        else:
          thisHourPrice = hourFrames[index].iloc[day]['Open']
          lastHourPrice = hourFrames[index - 1].iloc[day]['Open']
          dayPercents.append(getPercent(lastHourPrice, thisHourPrice))
      hourPercents.append(dayPercents)


    averages = []
    for hour in hourPercents:
      total = 0
      for day in hour:
        total += day
      av = total / len(hour)
      averages.append(av)

    return hours, averages

  def averageOutDayTrend(self):
    hours = self.data['time'].unique()

    df = self.data.loc[self.data['time'] == hours[0]]
    days = len(df.index)

    hourFrames = []

    for hour in hours:
      hourFrames.append(self.data.loc[self.data['time'] == hour])

    hourPercents = []
    for index in range(len(hourFrames)):
      dayPercents = []
      for day in range(days):
        if index == 0:
          dayPercents.append(100)
        else:
          thisHourPrice = hourFrames[index].iloc[day]['Open']
          dayPercents.append(getPercent(hourFrames[0].iloc[day]['Open'], thisHourPrice))
      hourPercents.append(dayPercents)


    averages = []
    for hour in hourPercents:
      total = 0
      for day in hour:
        total += day
      av = total / len(hour)
      averages.append(av)

    return hours, averages
