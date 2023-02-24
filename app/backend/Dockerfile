FROM python:3.10-slim

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONFAULTHANDLER 1

WORKDIR /app/backend

RUN apt-get update && apt-get -y install libpq-dev gcc && pip install psycopg2

COPY requirements.txt /app/backend
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/backend

# CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]