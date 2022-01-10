# -*- coding: utf-8 -*-
"""
Created on Sat Feb  6 00:36:36 2021

@author: Benst
"""
import pandas
import yfinance as yf
from pandas_datareader import data as pdr
import copy


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

    def __init__(self, ticker, startBal, period, interval):
        self.ticker = ticker
        self.dateString = 'Date'
        self.startbal = int(startBal)
        self.period = period
        self.interval = interval
        self.Finished = False
        self.TimeStep = 0
        data = self.LoadData()
        self.Data = data
        firstrow = self.Data.iloc[0]

        if 'Date' in self.Data:
          self.dateString = 'Date'
        else:
          self.dateString = 'Datetime'

        self.State = State(firstrow[self.dateString], firstrow['Open'], firstrow['Volume'], 0, startBal)
        self.States = []

    def LoadData(self):
        yf.pdr_override()
        ftse = yf.Ticker(self.ticker)
        data = ftse.history(period=self.period, interval=self.interval).dropna()
        data = data.reset_index()
        return data

    def Step(self, action):
        if action == 'Buy':
            self.Buy()
        elif action == 'Sell':
            self.Sell()
        else:
            self.Hold()

        self.AdvanceTime()

    def AdvanceTime(self):
        self.State.calcValue()
        self.States.append(copy.deepcopy(self.State))

        self.TimeStep += 1

        if self.TimeStep >= len(self.Data.index) - 1:
            self.Finished = True
        else:
            row = self.Data.iloc[self.TimeStep]
            self.State = State(date=(row[self.dateString]), price=(row['Open']), volume=(row['Volume']),
                               shares=self.State.Shares, balance=self.State.Balance)

    def Buy(self):
        if self.State.Balance - self.State.Price < 0:
            self.Hold()
        else:
            self.State.Balance -= self.State.Price
            self.State.Shares += 1
            self.State.Action = "Buy"

    def Hold(self):
        self.State.Action = "Hold"

    def Sell(self):
        if self.State.Shares < 1:
            self.Hold()
        else:
            self.State.Balance += self.State.Price
            self.State.Shares -= 1
            self.State.Action = "Sell"
