import logging
from alpaca_trade_api.stream import Stream
import config

# This is a wip

log = logging.getLogger(__name__)


async def print_trade(t):
    print('trade', t)


async def print_quote(q):
    print('quote', q)


async def print_trade_update(tu):
    print('trade update', tu)


async def print_crypto_trade(t):
    print('crypto trade', t)


async def trade_callback(t):
    print('trade', t)


async def quote_callback(q):
    print('quote', q)


def main():
    logging.basicConfig(level=logging.INFO)
    feed = 'iex'
    stream = Stream(key_id=config.ALPACA_API_KEY, secret_key=config.ALPACA_SECRET_KEY,
                    base_url=config.BASE_URL, data_feed=feed, raw_data=True)
    stream.subscribe_trade_updates(print_trade_update)
    stream.subscribe_trades(print_trade, 'AAPL')
    stream.subscribe_quotes(print_quote, 'IBM')
    stream.subscribe_crypto_trades(print_crypto_trade, 'BTCUSD')

    @stream.on_bar('MSFT')
    async def _(bar):
        print('bar', bar)

    @stream.on_status("*")
    async def _(status):
        print('status', status)

    @stream.on_luld('AAPL', 'MSFT')
    async def _(luld):
        print('LULD', luld)

    stream.run()


main()
