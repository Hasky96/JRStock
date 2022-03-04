import six
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.conf import settings

BASE_URL = getattr(settings, 'BASE_URL', None)

class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (six.text_type(user.pk) + six.text_type(timestamp)) + six.text_type(user.is_active)
    
account_activation_token = AccountActivationTokenGenerator()

def message(uidb64, token):
    url = f"{BASE_URL}api/user/email_confirm/{uidb64}/{token}"
    msg = """\
        <div style="font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid #212121; margin: 100px auto; padding: 30px 0; box-sizing: border-box;">
            <h1 style="margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;">
                <span style="font-size: 15px; margin: 0 0 10px 3px;">JRstock</span><br />
                <span style="color: #212121;">메일인증</span> 안내입니다. </h1>
            <p style="font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;">
                안녕하세요.<br />
                JRstock에 가입해 주셔서 진심으로 감사드립니다.<br />
                아래 <b style="color: #212121;">'메일 인증'</b> 버튼을 클릭하여 회원가입을 완료해 주세요.<br />
                감사합니다</p>
            <a style="color: #FFF; text-decoration: none; text-align: center;" href="%s" target="_blank"><p style="display: inline-block; width: 210px; height: 45px; margin: 30px 5px 40px; background: #212121; line-height: 45px; vertical-align: middle; font-size: 16px;">
                메일 인증</p></a>
        </div>
        """ % (url)
    
    return msg


