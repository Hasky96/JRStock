from __future__ import absolute_import, unicode_literals
from email.mime.multipart import MIMEMultipart

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'JRstock.settings')

import django
django.setup()

from celery import shared_task
from django.conf import settings
import smtplib
from email.mime.text import MIMEText
DEFAULT_FROM_EMAIL = getattr(settings, 'DEFAULT_FROM_EMAIL', None)
EMAIL_HOST_PASSWORD = getattr(settings, 'EMAIL_HOST_PASSWORD', None)

@shared_task
def email_authentication(message, to):
    mail_title = "JRstock 이메일 인증 안내"
    
    smtp = smtplib.SMTP('smtp.gmail.com', 587)
    smtp.starttls()
    smtp.login(DEFAULT_FROM_EMAIL, EMAIL_HOST_PASSWORD)
    msg = MIMEMultipart()
    msg['Subject'] = mail_title
    msg.attach(MIMEText(message, 'html'))
    smtp.sendmail(DEFAULT_FROM_EMAIL, to, msg.as_string())
    smtp.quit()
    
    message = 'Sent [' + to + '] an email authentication email'
    return message

@shared_task
def reset_email(pw, to):
    message_data = """\
    <div style="font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid #212121; margin: 100px auto; padding: 30px 0; box-sizing: border-box;">
        <h1 style="margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;">
            <span style="font-size: 15px; margin: 0 0 10px 3px;">JRstock</span><br />
            <span style="color: #212121;">비밀번호 초기화</span> 안내입니다. </h1>
        <p style="font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;">
            안녕하세요.<br />
            초기화된 비밀번호는 다음과 같습니다.<br />
            <b style="color: #212121;">" %s "</b><br />
            감사합니다</p>
    </div>
    """ % (pw)
    
    mail_title = "JRstock 비밀번호 초기화 안내"
    
    smtp = smtplib.SMTP('smtp.gmail.com', 587)
    smtp.starttls()
    smtp.login(DEFAULT_FROM_EMAIL, EMAIL_HOST_PASSWORD)
    msg = MIMEMultipart()
    msg['Subject'] = mail_title
    msg.attach(MIMEText(message_data, 'html'))
    smtp.sendmail(DEFAULT_FROM_EMAIL, to, msg.as_string())
    smtp.quit()
    
    message = 'Sent [' + to + '] a password initialization email'
    return message  
    
@shared_task
def contact_email(name, email, message):
    message_data = """\
    <div style="font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid #212121; margin: 100px auto; padding: 30px 0; box-sizing: border-box;">
        <h1 style="margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;">
            <span style="font-size: 15px; margin: 0 0 10px 3px;">JRstock</span><br />
            <span style="color: #212121;">" %s(%s) "</span> 님에게서<br /> 건의사항이 도착하였습니다. </h1>
        <p style="font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;">
            <b style="color: #212121;">건의내용 : " %s "</b><br /></p>
    </div>
    """ % (name, email, message)
    
    mail_title = f"{name}({email})님에게서 JRstock 건의사항 도착"
    
    smtp = smtplib.SMTP('smtp.gmail.com', 587)
    smtp.starttls()
    smtp.login(DEFAULT_FROM_EMAIL, EMAIL_HOST_PASSWORD)
    msg = MIMEMultipart()
    msg['Subject'] = mail_title
    msg.attach(MIMEText(message_data, 'html'))
    smtp.sendmail(email, DEFAULT_FROM_EMAIL, msg.as_string())
    smtp.quit()
    
    message = f'Received suggestions email from [{email}]'
    return message 

@shared_task
def add(a, b):
    return a + b
