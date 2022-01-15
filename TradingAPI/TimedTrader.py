import StockEnv


class Trader:

  def __init__(self, ticker, startbal, period, interval, buyHour, sellHour):
    self.lastboughtAt = float(0)
    self.env = StockEnv.StockEnv(ticker, startbal, period, interval)
    self.buyHour = buyHour
    self.sellHour = sellHour

  def decide(self, state):
    hour = state.Date.hour

    if hour == self.buyHour:
      self.tryToBuy(state, 'Hold')
    elif hour == self.sellHour:
      self.tryToSell(state, 'Hold')
    else:
      self.env.Hold()

    self.env.AdvanceTime()

  def tryToSell(self, state, decisionIfCant):
    s = self.findSharesLower(price=state.Price)
    if s is not False and len(s) > 0:
      self.env.Sell(s)
      self.decided = 'Sell'
    else:
      if decisionIfCant == 'Buy':
        self.tryToBuy('Hold')
      else:
        self.env.Hold()

  def tryToBuy(self, state, decisionIfCant):
    if state.Balance > state.Price:
      self.env.Buy(int(state.Balance/state.Price))
      self.decided = 'Buy'
    else:
      if decisionIfCant == 'Sell':
        self.tryToSell('Hold')
      else:
        self.env.Hold()

  def findSharesLower(self, price):
    lower = []
    if len(self.env.Shares) < 1:
      return False

    for s in self.env.Shares:
      lower.append(s)

    return lower

  def Run(self):
    while not self.env.Finished:
      self.decide(self.env.State)
