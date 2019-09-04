import yfinance as yf

msft = yf.Ticker("MSFT")

# get stock info
print(msft.info)

# get historical market data
# hist = msft.history(period="max")
# print(hist)

# show actions (dividends, splits)
# msft.actions

# show dividends
# msft.dividends

# show splits
# msft.splits

data = yf.download("SPY AAPL", start="2017-01-01", end="2017-04-30")
print(data)
