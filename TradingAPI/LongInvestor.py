import StockEnv

def calcValue(state):
    return float(state.Shares * state.Price + state.Balance)

class Trader:

    def __init__(self, dataInput, startbal):
        self.env = StockEnv.StockEnv(dataInput, startbal)
        self.prices = []

    def decide(self, state):
      self.env.Buy(int(state.Balance/state.Price))
      self.env.AdvanceTime()


    def Run(self):
        while not self.env.Finished:
            self.decide(self.env.State)
