FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code/backend+

RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Instalamos FastAPI y Uvicorn
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /code/

# El comando para arrancar FastAPI (suponiendo que tu archivo se llama main.py)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]