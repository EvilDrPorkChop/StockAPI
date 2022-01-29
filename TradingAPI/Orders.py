import config
import alpaca_trade_api as tradeapi
from alpaca_trade_api.common import URL
from alpaca_trade_api.rest import REST, TimeFrame, TimeFrameUnit


def ListAllOrders(api):
    orders = api.list_orders(status=None, limit=None, after=None,
                             until=None, direction=None, nested=None)
    print(orders)
    return orders


def GetOrder(api, order_id):
    status = api.get_order(order_id)
    print(status)
    return status.status


def GetOrderByClientID(api, client_order_id):
    status = api.get_order_by_client_order_id(client_order_id)
    print(status)
    return status.status


def CancelAllOrders(api):
    print("Bad day at the office? Cancelling all outstanding orders.")
    api.cancel_all_orders()
    print("All orders cancelled. Checking for any remaning.")
    orders = ListAllOrders(api)
    if orders == []:
        print("No orders remain!")
    else:
        print("Orders may not have succesfully deleted, please check.")


def CancelOrder(api, order_id):
    api.cancel_order(order_id)
    print("Order ID: " + order_id + " cancelled.")


def SubmitQtyOrder(api, symbol, qtyStr, sideStr, orderTypeStr="market", TIF="day", limitPrice=None, stopPrice=None):
    print("Submitting the order")
    order = api.submit_order(symbol, qty=qtyStr, side=sideStr, type=orderTypeStr, time_in_force=TIF, limit_price=limitPrice, stop_price=stopPrice,
                             client_order_id=None, order_class=None, take_profit=None, stop_loss=None, trail_price=None, trail_percent=None, notional=None)
    print("Order ID: " + order.client_order_id + " submitted. Checking status.")
    GetOrderByClientID(api, order.client_order_id)


def SubmitNotionalOrder(api, symbol, notionalStr, sideStr, orderTypeStr="market", TIF="day", limitPrice=None, stopPrice=None):
    print("Submitting the order")
    order = api.submit_order(symbol, notional=notionalStr, side=sideStr, type=orderTypeStr, time_in_force=TIF, limit_price=limitPrice, stop_price=stopPrice,
                             client_order_id=None, order_class=None, take_profit=None, stop_loss=None, trail_price=None, trail_percent=None)
    print("Order ID: " + order.client_order_id +
          " submitted. Checking status.")
    GetOrderByClientID(api, order.client_order_id)
# api = tradeapi.REST(key_id=config.ALPACA_API_KEY, secret_key=config.ALPACA_SECRET_KEY,
#                     base_url=config.BASE_URL, api_version='v2')
# SubmitQtyOrder(api, 'AAPL', '1', 'buy')
# CancelAllOrders(api)
