def normalize_brand(brand):

    brand_map = {

        "BJ": "BAJI",

        "JEETBUZZ": "JB",

        "SIX6S": "S6",

        "BAGH": "BH",

        "K9BO": "K9",

        "BKB": "BK",

        "BO9": "B9",

        "BTBO": "BT",

        "CITINOW": "CTN"

    }


    brand = str(brand).strip().upper()


    return brand_map.get(
        brand,
        brand
    )

def generate_trends(data):

    trends = {}



    for item in data:


        brand = normalize_brand(
            item["brand"]
        )


        crypto = item["crypto"]

        currency = item["currency"]



        if brand not in trends:

            trends[brand] = {}



        if crypto not in trends[brand]:

            trends[brand][crypto] = {}



        if currency not in trends[brand][crypto]:

            trends[brand][crypto][currency] = []



        trends[brand][crypto][currency].append({

            "date": item["date"].isoformat(),

            "exchange_rate":
                item["exchange_rate"]

        })




    # ensure chronological order

    for brand in trends:

        for crypto in trends[brand]:

            for currency in trends[brand][crypto]:

                trends[brand][crypto][currency].sort(
                    key=lambda x: x["date"]
                )



    return trends