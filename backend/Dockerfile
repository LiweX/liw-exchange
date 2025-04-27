FROM python:alpine
ENV PYRHONUNBUFFERED=1
RUN apk add --no-cache \
    libpq-dev \
    gcc \
    musl-dev \
    python3-dev \
    libffi-dev
WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app/
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]