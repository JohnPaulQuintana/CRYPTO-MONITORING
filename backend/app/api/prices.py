from fastapi import APIRouter

from ..sheet_reader import get_sheet_data



router = APIRouter()



@router.get("/trends")
def trends():

    return get_sheet_data()

@router.get("/prices")
def prices():

    return get_sheet_data()