import gspread

from google.oauth2.service_account import Credentials
from datetime import datetime
from .analytics import generate_trends
from .config import settings

def transform_data(rows):

    result = []


    for row in rows:

        result.append({

            "date": datetime.strptime(
                row.get("DATE"),
                "%Y-%m-%d %H:%M:%S"
            ),

            "brand": row.get("BRAND"),

            "crypto": row.get("CRYPTO"),

            "currency": row.get("CURRENCY"),


            "usd_price": float(
                row.get("USD PRICE", 0)
            ),


            "bo_market_price": float(
                str(row.get("BO MARKET PRICE", 0))
                .replace(",", "")
            ),


            "binance_rate": float(
                str(row.get("BINANCE RATE", 0))
                .replace(",", "")
            ),


            "exchange_rate": float(
                row.get("EXCHANGE RATE", 0)
            ),


            "status":
                row.get("EXCHANGE RATE SIGN")

        })


    return result


def get_credentials():


    info = {

        "type": settings.TYPE,

        "project_id": settings.PROJECT_ID,

        "private_key_id": settings.PRIVATE_KEY_ID,

        "private_key": settings.PRIVATE_KEY,

        "client_email": settings.CLIENT_EMAIL,

        "client_id": settings.CLIENT_ID,

        "auth_uri": settings.AUTH_URI,

        "token_uri": settings.TOKEN_URI,

        "auth_provider_x509_cert_url":
            settings.AUTH_PROVIDER_CERT_URL,

        "client_x509_cert_url":
            settings.CLIENT_CERT_URL,

        "universe_domain":
            settings.UNIVERSE_DOMAIN
    }


    scopes = [
        "https://www.googleapis.com/auth/spreadsheets.readonly"
    ]


    return Credentials.from_service_account_info(
        info,
        scopes=scopes
    )



def read_sheet():

    creds = get_credentials()

    client = gspread.authorize(creds)


    spreadsheet = client.open_by_key(
        settings.SHEET_ID
    )


    worksheet = spreadsheet.sheet1


    data = worksheet.get_all_records()


    transformed = transform_data(data)


    return generate_trends(transformed)