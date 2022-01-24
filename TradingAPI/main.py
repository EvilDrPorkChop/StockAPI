import yfinance as yf
from flask import Flask, jsonify
from flask_restful import Resource, Api, reqparse
import pandas as pd

import PeakTrader
import TimedTrader
import TraderSD
import TickerDataFetcher
from DataInput import DataInput
from PatternFinder import PatternFinder
from StockEnv import StockEnv
import Trader
import LongInvestor

app = Flask(__name__)
api = Api(app)


def getDataInput(args):
  dataInput = DataInput(ticker=str(args['ticker']), interval=int(args['interval']),
                        intervalType=str(args['intervalType']), fromDate=str(args['fromDate']),
                        toDate=str(args['toDate']))
  return dataInput


class Ticker(Resource):

  def get(self):
    parser = reqparse.RequestParser()
    parser.add_argument('ticker', required=True)
    parser.add_argument('interval', required=True)
    parser.add_argument('intervalType', required=True)
    parser.add_argument('fromDate', required=True)
    parser.add_argument('toDate', required=True)

    args = parser.parse_args()

    td = TickerDataFetcher.TickerDataFetcher(getDataInput(args))
    data = td.LoadData()

    response = jsonify(dates=data.reset_index().iloc[:, 0].tolist(), opens=data['open'].tolist(),
                       volumes=data['volume'].tolist())
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response  # return data and 200 OK code

  pass


class StartRun(Resource):

  def get(self):
    parser = reqparse.RequestParser()

    parser.add_argument('ticker', required=True)
    parser.add_argument('interval', required=True)
    parser.add_argument('intervalType', required=True)
    parser.add_argument('fromDate', required=True)
    parser.add_argument('toDate', required=True)
    parser.add_argument('startBalance', required=True)

    args = parser.parse_args()

    trad = TraderSD.Trader(getDataInput(args), args['startBalance'])
    long = LongInvestor.Trader(getDataInput(args), startbal=args['startBalance'])
    trad.Run()
    long.Run()


    response = jsonify(states=[state.serialize() for state in trad.env.States], opens=trad.env.Data['open'].tolist(),
                       longs=[state.serialize() for state in long.env.States],
                       dates=trad.env.Data['timestamp'].tolist())

    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


class CheckForDailyPatterns(Resource):

  def get(self):
    parser = reqparse.RequestParser()

    parser.add_argument('ticker', required=True)
    parser.add_argument('fromDate', required=True)
    parser.add_argument('toDate', required=True)

    args = parser.parse_args()

    pat = PatternFinder(args['ticker'], args['fromDate'], args['toDate'])

    hours, hourly = pat.hourAverages()
    _, day = pat.dayAverages()
    minmax, dates, average = pat.dayAveragesFomOpen()

    response = jsonify(dayPattern=day, hourPattern=hourly, hours=hours, minmaxs=minmax, dates=dates, average=average)
    response.headers.add("Access-Control-Allow-Origin", "*")

    return response


api.add_resource(Ticker, '/ticker')
api.add_resource(StartRun, '/startRun')
api.add_resource(CheckForDailyPatterns, '/checkForDailyPatterns')

if __name__ == '__main__':
  app.run(host='localhost', port=701)  # run our Flask app
