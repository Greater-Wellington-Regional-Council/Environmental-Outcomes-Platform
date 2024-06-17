FROM python:3.12-slim

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

ENV NAME GW Python API

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
