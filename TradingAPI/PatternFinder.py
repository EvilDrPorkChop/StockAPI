import yfinance as yf
import pandas as pd
from pandas_datareader import data as pdr
from numpy import datetime64

from TickerDataFetcher import TickerDataFetcher


class hourList:
  def __init__(self, h):
    self.hour = h
    self.percentAv = 0

class hour:

  def __init__(self, df, h):
    self.value = df['open'].values[0]
    self.hour = h
    self.percent = 100

  def setPercent(self, perc):
    self.percent = perc


class day:

  def __init__(self, df):
    self.df = df

  def getHour(self, h):
    df = self.df.loc[self.df['hour'] == h]
    return hour(df, h)


class month:

  def __init__(self, df):
    self.df = df

  def getDay(self, d):
    df = self.df.loc[self.df['day'] == d]
    return day(df)


class year:

  def __init__(self, df):
    self.df = df

  def getMonth(self, m):
    df = self.df.loc[self.df['month'] == m]
    return month(df)


def yr_func(ts):
  return ts.year

def mnth_func(ts):
  return ts.month

def dy_func(ts):
  return ts.day

def hr_func(ts):
  return ts.hour

def getPercent(before, this):
  return float(this/before*100)

class PatternFinder:

  def __init__(self, ticker, fromDate, toDate):
    self.ticker = ticker
    self.data = TickerDataFetcher(ticker, 1, 'hour', fromDate, toDate).LoadData()
    self.data = self.data.reset_index()
    if 'Date' in self.data:
      self.dateString = 'Date'
    elif 'Datetime' in self.data:
      self.dateString = 'Datetime'
    else:
      self.dateString = 'timestamp'

    print(self.data.dtypes)

    self.data['hour'] = self.data[self.dateString].apply(hr_func)
    self.data['day'] = self.data[self.dateString].apply(dy_func)
    self.data['month'] = self.data[self.dateString].apply(mnth_func)
    self.data['year'] = self.data[self.dateString].apply(yr_func)
    self.data = self.data[['open', 'hour', 'day', 'month', 'year']]

  def hourAverages(self):
    years = self.data['year'].unique().tolist()
    hourObjs = []
    for y in years:
      yearObj = year(self.data.loc[self.data['year'] == y])
      months = yearObj.df['month'].unique().tolist()
      for m in months:
        monthObj = yearObj.getMonth(m)
        days = monthObj.df['day'].unique().tolist()
        for d in days:
          dayObj = monthObj.getDay(d)
          hours = dayObj.df['hour'].unique().tolist()
          if len(hours) > 1:
            for hour in hours:
              h = dayObj.getHour(hour)
              if hour == hours[0]:
                h.setPercent(100)
              else:
                h.setPercent(getPercent(dayObj.getHour(lasthour).value, dayObj.getHour(hour).value))
              lasthour = hour
              hourObjs.append(h)

    hours = self.data['hour'].unique().tolist()
    hourLists = []
    for hour in hours:
      hList = hourList(hour)
      hourTotal = 0
      num = 0

      for obj in hourObjs:
        if obj.hour == hour:
          hourTotal += obj.percent
          num += 1

      hList.percentAv = float(hourTotal/num)
      hourLists.append(hList)

    hours = []
    averages = []
    for hL in hourLists:
      hours.append(hL.hour)
      averages.append(hL.percentAv)

    return hours, averages

  def dayAverages(self):
    years = self.data['year'].unique().tolist()
    hourObjs = []
    for y in years:
      yearObj = year(self.data.loc[self.data['year'] == y])
      months = yearObj.df['month'].unique().tolist()
      for m in months:
        monthObj = yearObj.getMonth(m)
        days = monthObj.df['day'].unique().tolist()
        for d in days:
          dayObj = monthObj.getDay(d)
          hours = dayObj.df['hour'].unique().tolist()
          if len(hours) > 1:
            for hour in hours:
              h = dayObj.getHour(hour)
              if hour == hours[0]:
                firstHour = hour
                h.setPercent(100)
              else:
                h.setPercent(getPercent(dayObj.getHour(firstHour).value, dayObj.getHour(hour).value))
              hourObjs.append(h)

    hours = self.data['hour'].unique().tolist()
    hourLists = []
    for hour in hours:
      hList = hourList(hour)
      hourTotal = 0
      num = 0

      for obj in hourObjs:
        if obj.hour == hour:
          hourTotal += obj.percent
          num += 1

      hList.percentAv = float(hourTotal/num)
      hourLists.append(hList)

    hours = []
    averages = []
    for hL in hourLists:
      hours.append(hL.hour)
      averages.append(hL.percentAv)

    return hours, averages
