import StockEnv


def calcValue(state):
    return float(state.Shares * state.Price + state.Balance)

def getAverage(prices):
    total = 0
    for p in prices:
        total += p
    return total/len(prices)

def calcMACD(prices):
    n1 = 5
    n2 = 10
    n3 = 8
    ema1 = []
    ema2 = []
    ema3 = []

    ema = getAverage(prices[0:n1])

    for i in range(0,len(prices)):
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
        macDs.append(ema2[i]-ema1[i])

    ema = getAverage(macDs[0:n3])

    for i in range(0, len(prices)):
        if i >= n3:
            ema = macDs[i] * (2 / (n3 + 1)) + (ema * (1 - (2 / (n3 + 1))))
        ema3.append(ema)

    return macDs, ema3

class Trader:

    def __init__(self, ticker, startbal, period, interval):
        self.lastboughtAt = float(0)
        self.env = StockEnv.StockEnv(ticker, startbal, period, interval)
        self.prices = []

    def decide(self, state):
      self.prices.append(state.Price)
      timestep = len(self.prices)-1
      if timestep > 10:
        macd, sig = calcMACD(prices = self.prices)
        if macd[timestep] > sig[timestep]:
          if macd[timestep] < macd[timestep-1]:
            self.env.Step('Buy')
          else:
            self.env.Step('Hold')
        elif sig[timestep] > macd[timestep]:
          if macd[timestep] > macd[timestep-1]:
            self.env.Step('Sell')
          else:
            self.env.Step('Hold')
        else:
          self.env.Step('Hold')
      else:
        self.env.Step('Hold')


    def Run(self):
        while not self.env.Finished:
            self.decide(self.env.State)
