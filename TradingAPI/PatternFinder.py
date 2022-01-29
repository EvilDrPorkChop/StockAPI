import yfinance as yf
import pandas as pd
from pandas_datareader import data as pdr
from numpy import datetime64

from DataInput import DataInput
from TickerDataFetcher import TickerDataFetcher


class hourList:
  def __init__(self, h):
    self.hour = h
    self.percentAv = 0

class hour:

  def __init__(self, df, h):
    if len(df['open'].values) > 0:
      self.value = df['open'].values[0]
    self.hour = h
    self.percent = 100

  def setPercent(self, perc):
    self.percent = perc


class day:

  def __init__(self, df):
    self.df = df
    self.minmax = 100

  def getHour(self, h):
    df = self.df.loc[self.df['hour'] == h]
    return hour(df, h)

  def setMinMax(self, minmax):
    self.minmax = minmax


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
    dataInput = DataInput(ticker, 1, 'hour', fromDate, toDate)
    self.data = TickerDataFetcher(dataInput).LoadData()
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
    self.data = self.data[['timestamp', 'open', 'hour', 'day', 'month', 'year']]

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
                h.setPercent(getPercent(dayObj.getHour(lasthour).value, h.value))
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
            total = 0
            for hour in hours:
              h = dayObj.getHour(hour)
              total += h.value
            average = total/len(hours)
            for hour in hours:
              h = dayObj.getHour(hour)
              h.setPercent(getPercent(average, h.value))
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


  def dayAveragesFomOpen(self):
    years = self.data['year'].unique().tolist()
    dayObjs = []
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
            min = 100
            max = 100
            openVal = dayObj.getHour(hours[0])
            for hour in hours:
              h = dayObj.getHour(hour)
              perc = getPercent(openVal.value, h.value)
              if min > perc:
                min = perc
              elif max < perc:
                max = perc
            if abs(min-100) > abs(max-100):
              dayObj.setMinMax(min)
            else:
              dayObj.setMinMax(max)
            dayObjs.append(dayObj)
    minmaxs = []
    dates = []
    total = 0
    print(dayObjs[0].df['timestamp'].values[0].__str__())
    for dO in dayObjs:
      total += dO.minmax
      minmaxs.append(dO.minmax)
      dates.append(dO.df['timestamp'].values[0].__str__())
    average = total/len(dayObjs)

    return minmaxs, dates, average
