from fastapi import FastAPI

from .sheet_reader import read_sheet


app = FastAPI()



@app.get("/")
def home():

    return {
        "app":"Crypto Monitor"
    }



@app.get("/api/trends")
def prices():

    return read_sheet()