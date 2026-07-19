from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .sheet_reader import read_sheet


app = FastAPI()
origins = [
    "http://localhost:5173",  # Local development
    "https://coins-automation.netlify.app",  # Your Netlify frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():

    return {
        "app":"Crypto Monitor"
    }



@app.get("/api/trends")
def prices():

    return read_sheet()