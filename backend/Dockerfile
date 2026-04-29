FROM python:3.11-slim

WORKDIR /app

# Copiamos e instalamos las librerías
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código
COPY . .

# Comando para arrancar
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]