from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

app = FastAPI()


@app.get("/addresses")
async def read_own_items():
    return [
        {"id": 1, "full_address_as_text": "1/1 Example Street, Example Suburb, Example City, 6011", "latitude": -40.96631798673893, "longitude": 175.6536005420695},
    ]


