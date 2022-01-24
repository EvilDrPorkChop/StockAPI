import StockEnv
import math


def calcValue(state):
  return float(state.Shares * state.Price + state.Balance)


def getAverage(prices):
  total = 0
  for p in prices:
    total += p
  return total / len(prices)


def getStdDeviation(macd, sig):
  totaldif = 0
  for i in range(len(macd)):
    totaldif+= math.fabs(macd[i]-sig[i])

  return totaldif/len(macd)


def calcMACD(prices):
  n1 = 5
  n2 = 10
  n3 = 8
  ema1 = []
  ema2 = []
  ema3 = []

  ema = getAverage(prices[0:n1])

  for i in range(0, len(prices)):
    if i >= n1:
      ema = prices[i] * (2 / (n1 + 1)) + (ema * (1 - (2 / (n1 + 1))))
    ema1.append(ema)

  ema = getAverage(prices[0:n2])

  for i in range(0, len(prices)):
    if i >= n2:
      ema = prices[i] * (2 / (n2 + 1)) + (ema * (1 - (2 / (n2 + 1))))
    ema2.append(ema)

  macDs = []
  for i in range(0, len(prices)):
    macDs.append(ema2[i] - ema1[i])

  ema = getAverage(macDs[0:n3])

  for i in range(0, len(prices)):
    if i >= n3:
      ema = macDs[i] * (2 / (n3 + 1)) + (ema * (1 - (2 / (n3 + 1))))
    ema3.append(ema)

  return macDs, ema3


class Trader:

  def __init__(self, dataInput, startbal):
    self.lastboughtAt = float(0)
    self.env = StockEnv.StockEnv(dataInput, startbal)
    self.prices = []
    self.decided = 'Hold'

  def decide(self, state):
    self.prices.append(state.Price)
    timestep = len(self.prices) - 1
    if timestep > 10:
      macd, sig = calcMACD(prices=self.prices)
      std = getStdDeviation(macd, sig)

      if sig[timestep] < macd[timestep] and std < math.fabs(macd[timestep] - sig[timestep]) and macd[timestep] > 0:
        self.tryToBuy(state, 'Hold')
      elif sig[timestep] > macd[timestep] and std < math.fabs(macd[timestep] - sig[timestep] and macd[timestep] < 0):
        self.tryToSell(state, 'Hold')


    self.env.AdvanceTime()

  def tryToSell(self, state, decisionIfCant):
    s = self.findSharesLower(price=state.Price, number=1)
    if s is not False and len(s) > 0:
      self.env.Sell(s)
      self.decided = 'Sell'
    else:
      if decisionIfCant == 'Buy':
        self.tryToBuy('Hold')
      else:
        self.env.Hold()
        self.decided = 'Hold'

  def tryToBuy(self, state, decisionIfCant):
    if state.Balance > state.Price:
      self.env.Buy(1)
      self.decided = 'Buy'
    else:
      if decisionIfCant == 'Sell':
        self.tryToSell('Hold')
      else:
        self.env.Hold()
        self.decided = 'Hold'

  def findSharesLower(self, price, number):
    lower = []
    numb = 0
    if len(self.env.Shares) < 1:
      return False

    for s in self.env.Shares:
      if s.boughtAt < price:
        lower.append(s)
        numb += 1
        if numb > number:
          break

    return lower

  def Run(self):
    while not self.env.Finished:
      self.decide(self.env.State)
