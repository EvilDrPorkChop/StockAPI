import StockEnv


def calcValue(state):
    return float(state.Shares * state.Price + state.Balance)

def getAverage(prices):
    total = 0
    for p in prices:
        total += p
    return total/len(prices)

def calcMACD(prices):
    n1 = 12
    n2 = 26
    n3 = 9
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
        self.MACD = 0

    def decide(self, state):
        self.prices.append(state.Price)

        if state.Balance > state.Price and state.Price < getAverage(self.prices):
            self.lastboughtAt = state.Price
            return 'Buy'
        elif state.Shares > 0 and state.Price>self.lastboughtAt:
            return 'Sell'
        else:
            return 'Hold'

    def Run(self):
        while not self.env.Finished:
            self.env.Step(self.decide(self.env.State))
