from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None):

        user = self.model(
            email=self.normalize_email(email),
            name=name,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password):
        user = self.create_user(
            email,
            name=name,
            password=password,
        )

        user.is_active = True
        user.is_admin = True
        user.save(using=self._db)
        return user
    
    def create_social_user(self, user_pk):
        from allauth.socialaccount.models import SocialAccount

        user = User.objects.get(pk=user_pk)
        socialaccount = SocialAccount.objects.get(user_id=user_pk)
        user.name = socialaccount.extra_data['name']
        user.profile_img_url = socialaccount.extra_data['picture']
        user.save()

        return user


class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email',
        max_length=100,
        unique=True,
    )
    name = models.CharField(max_length=30)
    profile_img = models.ImageField(null=True, blank=True) # 장고 내부에 저장된 이미지 파일용
    profile_img_url = models.CharField(max_length=100, blank=True) # 장고 외부 url 프로필 이미지용
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin
    
    class Meta:
        db_table = 'user'
