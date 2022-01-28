# Get rich, not greedy.
# V1 of swing trader. Do not use this and expect to make money it is a hot mess.
# Key issue - Limited upside, unlimited downside.

import json
import random
import pandas as pd
import alpaca_trade_api as tradeapi
from alpaca_trade_api.common import URL
from alpaca_trade_api.rest import REST, TimeFrame, TimeFrameUnit
import config
import Trader
import Orders as Orders
import time

# To-do
# Edit targets based on TOD
# Add total gain check (full liquidation at target)
# Potentially split stock baskets by volatility to hedge risk
# Convert to use datastream

returnTarget = 0.004
bearTarget = -0.05

# this can probably be moved to a seperate file for modularity,at the moment I'm using it to update a simple JSON file on initilisation to keep track of positions held.

stockBasket = ['QQQ',
               'TSLA',
               'AAPL',
               'MSFT',
               'TQQQ',
               'AMZN',
               'AMD',
               'NVDA',
               'FB',
               'V',
               'GOOG',
               'INTC',
               'GOOGL',
               'CVX',
               'SMH',
               'XOM',
               'SQQQ',
               'NFLX',
               'SE',
               'MU',
               'JPM',
               'SOXX',
               'BAC',
               'CMCSA',
               'SHOP',
               'NEE',
               'CAT',
               'TLT',
               'MA',
               'BABA',
               'TEAM',
               'QCOM',
               'CP',
               'WFC',
               'AMAT',
               'NIO',
               'LCID',
               'NOW',
               'BBL',
               'ADBE',
               'CRM',
               'TSM',
               'BA',
               'MS',
               'T',
               'F',
               'CSCO',
               'SQ',
               'VZ',
               'DIS',
               'C',
               'GM',
               'BHP',
               'MRK',
               'NKE',
               'PYPL',
               'WDC',
               'JNJ',
               'MDLZ',
               'AVGO',
               'VALE',
               'PBR',
               'ABT',
               'SBUX',
               'FCX',
               'RIVN',
               'TXN',
               'ABBV',
               'CHTR',
               'ATVI',
               'PFE',
               'UBER',
               'HD',
               'AAL',
               'WM',
               'PG',
               'DHR',
               'RBLX',
               'TMUS',
               'LRCX',
               'PEP',
               'GILD',
               'UNH',
               'SLB',
               'GS',
               'KO',
               'ASML',
               'XLNX',
               'COP',
               'SNOW',
               'EMB',
               'JD',
               'MDT',
               'COIN',
               'CVS',
               'IEF',
               'BX',
               'BMY',
               'WMT',
               'MMM'
               ]


def deletePositionObject(ticker):
    with open('positions.json', 'r+') as f:
        data = json.load(f)

        for stock in data:
            print("this is the stock" + stock['symbol'])
            if stock['symbol'] == ticker:
                del stock
                with open("positions.json", "w") as jsonFile:
                    json.dump(data, jsonFile)


def getPositions(api):
    positions = api.list_positions()
    # print(positions)
    position_file_name = 'G:\StockAPI\positions.json'
    keyValue = 0
    data = []
    for pos in positions:
        positionJSON = {"id": keyValue}
        positionJSON["symbol"] = pos.symbol
        positionJSON["quantity"] = pos.qty
        positionJSON["average_entry_price"] = pos.avg_entry_price
        positionJSON["algo_mode"] = "Hold"
        data.append(positionJSON)
        keyValue = keyValue + 1
    with open(position_file_name, "w+") as file:
        json.dump(data, file)

# this can probably be moved to a seperate file for modularity.


def checkPosition(api, tickerSymbol):
    # get ticker info
    stockPos = api.get_position(tickerSymbol)
    stockBuyPrice = stockPos.avg_entry_price
    stockCurrentPrice = stockPos.current_price
    stockDiffPercentage = stockPos.unrealized_plpc
    stockQty = stockPos.qty
    # print(stockPos)
    # print(stockBuyPrice)
    # print(stockCurrentPrice)
    return stockDiffPercentage, stockQty


def getRandomFromBasket(int):
    stocks = random.sample(stockBasket, int)
    return stocks


def buyTodaysStocks(api):
    stocks = getRandomFromBasket(10)
    print(stocks)
    for stock in stocks:
        Orders.SubmitQtyOrder(api, stock, 10, 'buy')
    print("stocks bought")


def comparePL(api, ticker, qty, pl, currentStatus):
    pl = float(pl)
    if currentStatus == None:
        return 'Hold'
    if currentStatus == 'Hold':
        if pl >= returnTarget:
            print("sold " + ticker + "Qty " + qty)
            Orders.SubmitQtyOrder(api, ticker, qty, 'sell')
            # sell
            return 'Sold'
        if pl < returnTarget and pl > bearTarget:
            # do nothing
            pl
            return 'Hold'
        if pl < bearTarget:
            # change mode
            return 'Dump'
        else:
            return 'Hold'
    if currentStatus == 'Dump':
        if pl >= 0:
            Orders.SubmitQtyOrder(api, ticker, qty, 'sell')
            # sell
            return 'Sold'
        else:
            return 'Dump'
    if currentStatus == 'Sell':
        if pl >= returnTarget:
            Orders.SubmitQtyOrder(api, ticker, qty, 'sell')
            # sell it then you dummy.
            return 'Sold'
        else:
            return 'Sell'


def openPositionsFile():
    with open('positions.json', 'r+') as f:
        data = json.load(f)
        return data


api = tradeapi.REST(key_id=config.ALPACA_API_KEY, secret_key=config.ALPACA_SECRET_KEY,
                    base_url=config.BASE_URL, api_version='v2')
# buyTodaysStocks(api)
# checkPosition(api, 'AAPL')
getPositions(api)
data = openPositionsFile()
while True:
    for stock in data:
        # print("this is the stock" + stock['symbol'])
        if stock['symbol'] != "":
            position = checkPosition(api, stock['symbol'])
            currentPc = list(position)[0]
            currentQty = list(position)[1]
            operation = comparePL(
                api, stock['symbol'], currentQty, currentPc, stock['algo_mode'])
            print(operation)
            if operation != 'Sold':
                stock['algo_mode'] = operation
                with open("positions.json", "w") as jsonFile:
                    json.dump(data, jsonFile)
            else:
                time.sleep(5)
                getPositions(api)
                data = openPositionsFile()
    time.sleep(2)
