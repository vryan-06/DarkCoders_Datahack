from googlesearch import search
import requests
from bs4 import BeautifulSoup as bs


def round_to_lakhs(num):
    return "{:.2f}".format(num / 100000)


def extract_price(bs):
    priceDiv = bs.find()


def get_car_features(query):
    num_results = 1

    agent = {
        "User-Agent": 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'}

    for result in search(query, stop=num_results):
        response = requests.get(result, headers=agent)

        # print(response.content)
        with open('file.html', 'wb') as f:
            f.write(response.content)

        soup = bs(response.content, "html.parser")

        car_features = {}

        # Extract Price
        onRoadPriceSection = soup.find(id="OnRoadPrice")
        raw_price = onRoadPriceSection.find(
            "td", class_="gsc_col-xs-4").getText()
        price = float(raw_price.replace('Rs.', '').replace(',', ''))

        # Extract Specifications
        specs = soup.find(id="specification")
        for row in specs.find_all("tr"):
            data = row.find_all("td")
            car_features[data[0].getText()] = data[1].getText()

        car_features['price'] = round_to_lakhs(price)

        return car_features


query = "site:cardekho.com hyundai creta 1.6 SX petrol"
res = get_car_features(query)
print(res)
