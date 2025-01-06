FROM python:3.9.18-alpine3.18

RUN apk add build-base

RUN apk add postgresql-dev gcc python3-dev musl-dev

ARG FLASK_APP=app
ARG FLASK_ENV=production
ARG DATABASE_URL=sqlite:///dev.db
ARG SCHEMA=freshly_schema
ARG SECRET_KEY=lkasjdf09ajsdkfljalsiorj12n3490re9485309irefvn,u90818734902139489230
# ARG FLASK_DEBUG=true
# ARG FLASK_RUN_PORT=8000



WORKDIR /var/www

COPY requirements.txt .

RUN pip install -r requirements.txt
RUN pip install psycopg2

COPY . .

RUN flask db upgrade
RUN flask seed all
CMD gunicorn app:app