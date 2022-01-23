# Get rich, not greedy.
import json
import pandas as pd
import alpaca_trade_api as tradeapi
from alpaca_trade_api.common import URL
from alpaca_trade_api.rest import REST, TimeFrame, TimeFrameUnit
import config
import Trader
import Positions_Template

# To-do
# Edit Target based on TOD
# Convert to use datastream
# Buy randomly from basket of stocks
# Fix JSON object update process - this is important for "Mode"

returnTarget = 0.03
bearTarget = -0.05

# this can probably be moved to a seperate file for modularity,at the moment I'm using it to update a simple JSON file on initilisation to keep track of positions held.


def getPositions(api):
    positions = api.list_positions()
    print(positions)
    position_file_name = 'G:\StockAPI\positions.json'
    keyValue = 0
    for pos in positions:
        positionJSON = Positions_Template.positions_template
        positionJSON[str(keyValue)]["symbol"] = pos.symbol
        positionJSON[str(keyValue)]["quantity"] = pos.qty
        positionJSON[str(keyValue)
                     ]["average_entry_price"] = pos.avg_entry_price
        positionJSON[str(keyValue)]["algo_mode"] = "Hold"
        with open(position_file_name, "w") as file:
            json.dump(positionJSON, file)
            keyValue = keyValue + 1

# this can probably be moved to a seperate file for modularity.


def checkPosition(api, tickerSymbol):
    # get ticker info
    stockPos = api.get_position(tickerSymbol)
    stockBuyPrice = stockPos.avg_entry_price
    stockCurrentPrice = stockPos.current_price
    stockDiffPercentage = stockPos.unrealized_plpc
    print(stockPos)
    print(stockBuyPrice)
    print(stockCurrentPrice)
    return stockDiffPercentage


def comparePL(pl, currentStatus):
    pl = float(pl)
    if currentStatus == 'Hold':
        if pl >= returnTarget:
            # sell
            return 'Sell'
        if pl < returnTarget:
            # do nothing
            pl
        if pl < returnTarget:
            # change mode
            return 'Dump'
    if currentStatus == 'Dump':
        if pl >= 0:
            # sell
            return 'Sell'
    if currentStatus == 'Sell':
        if pl >= returnTarget:
            # sell it then you dummy.
            return 'Sell'


api = tradeapi.REST(key_id=config.ALPACA_API_KEY, secret_key=config.ALPACA_SECRET_KEY,
                    base_url=config.BASE_URL, api_version='v2')
checkPosition(api, 'AAPL')
getPositions(api)

with open('positions.json', 'r+') as f:
    data = json.load(f)

    for key in data:
        if data[key]['symbol'] != "":
            currentPc = checkPosition(api, data[key]['symbol'])
            operation = comparePL(currentPc, data[key]['algo_mode'])
            print(operation)
            data[key]['algo_mode'] = operation
            json.dump(data[key], f)
