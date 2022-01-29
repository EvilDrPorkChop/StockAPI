import StockEnv


def calcValue(state):
  return float(state.Shares * state.Price + state.Balance)


def getAverage(prices):
  total = 0
  for p in prices:
    total += p
  return total / len(prices)

class Trader:

  def __init__(self, dataInput, startBal):
    self.lastboughtAt = float(0)
    self.env = StockEnv.StockEnv(dataInput, startBal)
    self.prices = []
    self.decided = 'Hold'

  def decide(self, state):
    self.prices.append(state.Price)
    self.env.AdvanceTime()

  def tryToSell(self, state, decisionIfCant):
    s = self.findSharesLower(price=state.Price)
    if s is not False and len(s) > 0:
      self.env.Sell(s)
      self.decided = 'Sell'
    else:
      if decisionIfCant == 'Buy':
        self.tryToBuy(state, 'Hold')
      else:
        self.env.Hold()
        self.decided = 'Hold'

  def tryToBuy(self, state, decisionIfCant):
    if state.Balance > state.Price:
      self.env.Buy(int(state.Balance/state.Price))
      self.decided = 'Buy'
    else:
      if decisionIfCant == 'Sell':
        self.tryToSell(state, 'Hold')
      else:
        self.env.Hold()
        self.decided = 'Hold'

  def findSharesLower(self, price):
    lower = []
    if len(self.env.Shares) < 1:
      return False

    for s in self.env.Shares:
      if s.boughtAt < price:
        lower.append(s)

    return lower

  def Run(self):
    while not self.env.Finished:
      self.decide(self.env.State)
