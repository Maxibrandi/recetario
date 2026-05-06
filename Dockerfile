FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 1. Directorio base
WORKDIR /code

# 2. Instalamos dependencias del sistema
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# 3. Copiamos el requirements a la carpeta donde estamos (/code)
COPY requirements.txt .

# 4. Instalamos las librerías
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copiamos todo el proyecto
COPY . .

# 6. Nos movemos a la carpeta backend para arrancar
WORKDIR /code/backend

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]