# -*- coding: utf-8 -*-
"""
Created on Sat Feb  6 00:36:36 2021

@author: Benst
"""
import pandas
import yfinance as yf
from pandas_datareader import data as pdr
import copy

from TickerDataFetcher import TickerDataFetcher


class Share:
  def __init__(self, price):
    self.boughtAt = price


class State:
  def serialize(self):
    return {
      'Date': self.Date,
      'Price': self.Price,
      'Volume': self.Volume,
      'Shares': self.Shares,
      'Balance': self.Balance,
      'Action': self.Action,
      'Value': self.Value,
    }

  def __init__(self, date, price, volume, shares, balance):
    self.Date = date
    self.Price = float(price)
    self.Volume = int(volume)
    self.Shares = int(shares)
    self.Balance = int(balance)
    self.Action = ""
    self.Value = float(self.Shares * self.Price + self.Balance)

  def calcValue(self):
    self.Value = float(self.Shares * self.Price + self.Balance)


class StockEnv:

  def __init__(self, dataInput, startBal):
    self.dateString = 'Date'
    self.startbal = int(startBal)
    self.Finished = False
    self.TimeStep = 0
    self.Shares = []
    self.movingAverage = []
    data = TickerDataFetcher(dataInput).LoadData()
    self.Data = data

    self.Data['MA'] = ""
    self.Data['MAGradient'] = ""
    self.Data = self.Data.reset_index()
    firstrow = self.Data.iloc[0]
    if 'Date' in self.Data:
      self.dateString = 'Date'
    elif 'Datetime' in self.Data:
      self.dateString = 'Datetime'
    else:
      self.dateString = 'timestamp'

    self.State = State(firstrow[self.dateString], firstrow['open'], firstrow['volume'], 0, startBal)
    self.States = []
    self.calcMA(20)

  def LoadData(self):
    ftse = yf.Ticker(self.ticker)
    data = ftse.history(period=self.period, interval=self.interval).dropna()
    data = data.reset_index()
    return data

  def AdvanceTime(self):
    self.State.calcValue()
    self.States.append(copy.deepcopy(self.State))
    self.TimeStep += 1

    if self.TimeStep >= len(self.Data.index) - 1:
      self.Finished = True
    else:
      row = self.Data.iloc[self.TimeStep]
      self.State = State(date=(row[self.dateString]), price=(row['open']), volume=(row['volume']),
                         shares=self.State.Shares, balance=self.State.Balance)
    self.calcMA(20)

  def Buy(self, number):
    if self.State.Balance - self.State.Price < 0:
      self.Hold()
    else:
      for i in range(number):
        if self.State.Balance - self.State.Price > 0:
          self.State.Balance -= self.State.Price
          self.State.Shares += 1
          self.State.Action = "Buy"
          self.Shares.append(Share(self.State.Price))

  def Hold(self):
    self.State.Action = "Hold"

  def Sell(self, shares):
    if len(shares) > 1:
      for share in shares:
        if self.Shares.__contains__(share):
          self.State.Balance += self.State.Price
          self.State.Shares -= 1
          self.State.Action = "Sell"
          self.Shares.remove(share)
    else:
      if self.State.Shares < 1 or not self.Shares.__contains__(shares[0]):
        self.Hold()
      else:
        self.State.Balance += self.State.Price
        self.State.Shares -= 1
        self.State.Action = "Sell"
        self.Shares.remove(shares[0])

  def calcMA(self, n):
    if self.TimeStep == 0:
      self.Data.at[self.TimeStep, 'MA'] = self.Data['open'].iloc[0]
      self.Data.at[self.TimeStep, 'MAGradient'] = 0
    else:
      startIndex = self.TimeStep - n
      if startIndex < 0:
        startIndex = 0
        n = self.TimeStep
      total = 0
      for i in range(startIndex, self.TimeStep):
        total += self.Data['open'].iloc[i]
      self.Data.at[self.TimeStep, 'MA'] = float(total / n)
      lastMa = self.Data['MA'].iloc[self.TimeStep-1]
      self.Data.at[self.TimeStep, 'MAGradient'] = float(total/n) - lastMa
