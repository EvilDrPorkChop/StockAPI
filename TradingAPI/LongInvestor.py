import StockEnv

def calcValue(state):
    return float(state.Shares * state.Price + state.Balance)

class Trader:

    def __init__(self, ticker, startbal, period, interval):
        self.lastboughtAt = float(0)
        self.env = StockEnv.StockEnv(ticker, startbal, period, interval)
        self.prices = []

    def decide(self, state):
      self.env.Step('Buy')


    def Run(self):
        while not self.env.Finished:
            self.env.Step(self.decide(self.env.State))
