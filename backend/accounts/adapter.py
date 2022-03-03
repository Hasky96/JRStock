from accounts.models import User
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


class MySocialAccountAdapter(DefaultSocialAccountAdapter):

    def save_user(self, request, sociallogin, form=None):
        user = super(MySocialAccountAdapter, self).save_user(
            request, sociallogin, form)

        # 소셜로그인 정보를 이용해 내 유저 정보에 맞게 DB에 입력
        User.objects.create_social_user(
            user_pk=user.id)

        return user
