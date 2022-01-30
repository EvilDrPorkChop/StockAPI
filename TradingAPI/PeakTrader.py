import StockEnv


def calcValue(state):
  return float(state.Shares * state.Price + state.Balance)


def getAverage(prices):
  total = 0
  for p in prices:
    total += p
  return total / len(prices)

class Trader:

  def __init__(self, dataInput, startBal, threshold):
    self.lastboughtAt = float(0)
    self.env = StockEnv.StockEnv(dataInput, startBal)
    self.prices = []
    self.isPeaks = []
    self.isDips = []
    self.threshold = float(threshold)
    self.decided = 'Hold'

  def decide(self, state):
    self.prices.append(state.Price)
    if self.env.TimeStep > 1:
      thisGradient = self.env.Data['MAGradient'].iloc[self.env.TimeStep]
      lastGradient = self.env.Data['MAGradient'].iloc[self.env.TimeStep-1]
      if thisGradient-lastGradient > self.threshold:
        self.isPeaks.append(True)
        self.isDips.append(False)
        self.tryToBuy(state, 'Hold')
      elif lastGradient-thisGradient > self.threshold:
        self.isPeaks.append(False)
        self.isDips.append(True)
        self.tryToSell(state, 'Hold')
      else:
        self.isPeaks.append(False)
        self.isDips.append(False)
    else:
      self.isPeaks.append(False)
      self.isDips.append(False)
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
