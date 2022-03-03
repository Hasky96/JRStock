from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login

from dj_rest_auth.registration.views import SocialLoginView

from accounts.serializers import UserSerializer

from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.google import views as google_view

from accounts.models import User
from django.http import JsonResponse
import requests

BASE_URL = 'http://localhost:8000/'

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def user_detail(request):
    serializer = UserSerializer(request.user)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name')

    serializer = UserSerializer(data=request.data)
    serializer.email = email
    serializer.name = name

    if serializer.is_valid(raise_exception=True):
        user = serializer.save()
        user.set_password(password)
        user.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(email=email, password=password)
    if user is None:
        return Response({'message': '아이디 또는 비밀번호가 일치하지 않습니다.'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    update_last_login(None, user)

    return Response({'refresh_token': str(refresh),
                     'access_token': str(refresh.access_token), }, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    # 구글 토큰을 받아옴
    access_token = request.data.get('accessToken')
    userinfo_req = requests.get(
        f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}")
    userinfo_req_status = userinfo_req.status_code
    if userinfo_req_status != 200:
        return JsonResponse({'message': '유저 정보를 얻어오는데 실패하였습니다.'}, status=status.HTTP_400_BAD_REQUEST)
    # 토큰에서 정보 추출
    userinfo = userinfo_req.json()
    email = userinfo['email']
    
    # 이미 가입된 유저인지 확인
    try:
        user = User.objects.get(email=email)
        social_user = SocialAccount.objects.get(user=user)
        # 기존에 일반회원으로 가입된 유저인지 확인
        if social_user is None:
            return JsonResponse({'message': '이미 일반회원으로 가입되어있는 유저입니다.'}, status=status.HTTP_400_BAD_REQUEST)
        data = {'access_token': access_token}
        accept = requests.post(
            f"{BASE_URL}api/user/login/google/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({'message': '로그인에 실패하였습니다.'}, status=accept_status)
        accept_json = accept.json()
        accept_json.pop('user', None)
        return JsonResponse(accept_json)
    except User.DoesNotExist:
        # 기존에 가입된 유저가 없으면 새로 가입
        data = {'access_token': access_token}
        accept = requests.post(
            f"{BASE_URL}api/user/login/google/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({'message': '로그인에 실패하였습니다.'}, status=accept_status)
        accept_json = accept.json()
        accept_json.pop('user', None)
        return JsonResponse(accept_json)
    
class GoogleLogin(SocialLoginView):
    adapter_class = google_view.GoogleOAuth2Adapter
    client_class = OAuth2Client