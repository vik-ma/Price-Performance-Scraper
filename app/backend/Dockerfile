FROM python:3.10-slim

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONFAULTHANDLER 1

WORKDIR /app/backend

COPY requirements.txt /app/backend
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/backend/

CMD [ "python", "price_fetcher.py" ]