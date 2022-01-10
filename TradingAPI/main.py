import yfinance as yf
from flask import Flask, jsonify
from flask_restful import Resource, Api, reqparse
import pandas as pd

from StockEnv import StockEnv
import Trader
import LongInvestor

app = Flask(__name__)
api = Api(app)


class Ticker(Resource):

  def get(self):
    parser = reqparse.RequestParser()
    parser.add_argument('ticker', required=True)
    parser.add_argument('interval', required=True)
    parser.add_argument('period', required=True)

    args = parser.parse_args()

    tick = yf.Ticker(args['ticker'])
    his = tick.history(period=str(args['period']), interval=str(args['interval'])).dropna()

    print(his)
    response = jsonify(opens=his['Open'].tolist(), highs=his['High'].tolist(),
                       dates=his.reset_index().iloc[:, 0].tolist(), ticker=args['ticker'])
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response  # return data and 200 OK code

  pass


class StartRun(Resource):

  def get(self):
    parser = reqparse.RequestParser()

    parser.add_argument('ticker', required=True)
    parser.add_argument('interval', required=True)
    parser.add_argument('period', required=True)
    parser.add_argument('startBalance', required=True)

    args = parser.parse_args()

    trad = Trader.Trader(args['ticker'], 1000, args['period'], args['interval'])
    long = LongInvestor.Trader(args['ticker'], 1000, args['period'], args['interval'])
    trad.Run()
    long.Run()

    tick = yf.Ticker(args['ticker'])
    his = tick.history(period=str(args['period']), interval=str(args['interval'])).dropna()

    macds, signals = Trader.calcMACD(trad.env.Data['Open'].tolist())

    response = jsonify(states=[state.serialize() for state in trad.env.States], opens=his['Open'].tolist(),
                       longs=[state.serialize() for state in long.env.States],
                       dates=his.reset_index().iloc[:, 0].tolist(), macd=macds, signals=signals)

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


api.add_resource(Ticker, '/ticker')
api.add_resource(StartRun, '/startRun')

if __name__ == '__main__':
  app.run(host='localhost', port=701)  # run our Flask app
