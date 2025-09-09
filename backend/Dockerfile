FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN pip install fastapi uvicorn openai python-dotenv pyPDF2 python-multipart

EXPOSE 5000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]