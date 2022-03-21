# ./Dockerfile 
FROM python:3

WORKDIR /backend

COPY . .
## Install packages
COPY requirements.txt ./

RUN pip install -r requirements.txt

RUN pip install psycopg2

RUN python manage.py migrate

RUN python manage.py collectstatic

# RUN celery -A JRstock worker -l info -P solo

# RUN celery -A JRstock beat -l info

## Run the application on the port 8090
EXPOSE 8090

# GAMIL, SMTP 포트 열기
EXPOSE 587
EXPOSE 25

# gunicorn 배포 명령어
# CMD ["gunicorn", "--bind", "허용하는 IP:열어줄 포트", "project.wsgi:application"]
CMD ["gunicorn", "--bind", "0.0.0.0:8090", "JRstock.wsgi:application"]
