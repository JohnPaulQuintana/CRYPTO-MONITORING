import os
from dotenv import load_dotenv


load_dotenv()


class Settings:

    APP_NAME = os.getenv(
        "APP_NAME"
    )

    REFRESH_SECONDS = int(
        os.getenv(
            "REFRESH_SECONDS",
            60
        )
    )


    SHEET_ID = os.getenv(
        "SHEET_ID"
    )


    TYPE = os.getenv(
        "TYPE"
    )


    PROJECT_ID = os.getenv(
        "PROJECT_ID"
    )


    PRIVATE_KEY_ID = os.getenv(
        "PRIVATE_KEY_ID"
    )


    PRIVATE_KEY = os.getenv(
        "PRIVATE_KEY"
    ).replace(
        "\\n",
        "\n"
    )


    CLIENT_EMAIL = os.getenv(
        "CLIENT_EMAIL"
    )


    CLIENT_ID = os.getenv(
        "CLIENT_ID"
    )


    AUTH_URI = os.getenv(
        "AUTH_URI"
    )


    TOKEN_URI = os.getenv(
        "TOKEN_URI"
    )


    AUTH_PROVIDER_CERT_URL = os.getenv(
        "AUTH_PROVIDER_CERT_URL"
    )


    CLIENT_CERT_URL = os.getenv(
        "CLIENT_CERT_URL"
    )


    UNIVERSE_DOMAIN = os.getenv(
        "UNIVERSE_DOMAIN"
    )


settings = Settings()