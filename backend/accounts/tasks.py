from __future__ import absolute_import, unicode_literals
from django.core.mail.message import EmailMessage
from celery import shared_task

@shared_task
def send_email(pw, to):
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
    mail_to = to
    send_email = EmailMessage(mail_title, message_data, to=[mail_to])
    send_email.content_subtype = "html"
    send_email.send()
    
@shared_task
def add(a, b):
    return a + b
