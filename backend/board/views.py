from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import BoardDetailKonexSerializer, BoardDetailKosdaqSerializer, BoardDetailKospiSerializer, BoardKonexSerializer, BoardKosdaqSerializer, BoardKospiSerializer

from .models import Konex, Kosdaq, Kospi

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .parser import get_serializer

page = openapi.Parameter('page', openapi.IN_QUERY, default=1,
                        description="페이지 번호", type=openapi.TYPE_INTEGER)
size = openapi.Parameter('size', openapi.IN_QUERY, default=5,
                        description="한 페이지에 표시할 객체 수", type=openapi.TYPE_INTEGER)
sort = openapi.Parameter('sort', openapi.IN_QUERY, default="id",
                        description="정렬할 기준 Column, 'id'면 오름차순 '-id'면 내림차순", type=openapi.TYPE_STRING)

# ====================================================================== 코스피 ======================================================================
@swagger_auto_schema(
    method='post',
    operation_id='코스피 종목별 게시판 글 등록(유저)',
    operation_description='코스피 종목별 게시판에 글을 등록합니다',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING, description="게시글 제목"),
            'content': openapi.Schema(type=openapi.TYPE_STRING, description="게시글 내용"),
            'code_number': openapi.Schema(type=openapi.TYPE_STRING, description="코스피 종목 코드"),
        }
    ),
    tags=['게시판_코스피'],
    responses={status.HTTP_201_CREATED: ""}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def board_kospi_create(request):
    # request.data에 없는 데이터 추가해주기
    data = request.data.copy()
    data['info_kospi'] = request.data.get('code_number')
        
    serializer = BoardKospiSerializer(data=data)
    
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    method='get',
    operation_id='코스피 종목별 게시판 종목별 조회(아무나)',
    operation_description='코스피 종목별 게시판 종목별로 조회합니다',
    tags=['게시판_코스피'],
    manual_parameters=[page, size],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'count': openapi.Schema(type=openapi.TYPE_STRING, description="전체 게시글 수"),
                'next': openapi.Schema(type=openapi.TYPE_STRING, description="다음 조회 페이지 주소"),
                'previous': openapi.Schema(type=openapi.TYPE_STRING, description="이전 조회 페이지 주소"),
                'results' : get_serializer("board", "게시글 정보"),
            }
        )
    )}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def board_kospi_list(request, code_number):
    board_kospi_list = Kospi.objects.filter(info_kospi=code_number)
    paginator = PageNumberPagination()
    
    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size
    
    result = paginator.paginate_queryset(board_kospi_list, request)
    serializer = BoardKospiSerializer(result, many=True)
    return paginator.get_paginated_response(serializer.data)

@swagger_auto_schema(
    method='get',
    operation_id='코스피 게시글 상세 조회(아무나)',
    operation_description='코스피 게시글을 상세 조회 합니다',
    tags=['게시판_코스피'],
    responses={status.HTTP_200_OK: BoardDetailKospiSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def board_kospi_detail(request, pk):
    board_kospi = get_object_or_404(Kospi, pk=pk)
    serilizer = BoardDetailKospiSerializer(board_kospi)
    
    return Response(serilizer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='put',
    operation_id='코스피 게시글 수정(유저)',
    operation_description='코스피 게시글을 수정합니다',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING, description="수정할 게시글 제목"),
            'content': openapi.Schema(type=openapi.TYPE_STRING, description="수정할 게시글 내용"),
        }
    ),
    tags=['게시판_코스피'],
    responses={status.HTTP_200_OK: ""}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def board_kospi_update(request, pk):
    board_kospi = get_object_or_404(Kospi, pk=pk)
    
    # request.data에 없는 데이터 추가해주기
    data = request.data.copy()
    data['info_kospi'] = board_kospi.info_kospi_id
    
    serializer = BoardKospiSerializer(instance=board_kospi, data=data)
    
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    
@swagger_auto_schema(
    method='delete',
    operation_id='게시글 삭제(유저)',
    operation_description='게시글을 제거합니다',
    tags=['게시판_코스피'],
    responses={status.HTTP_200_OK: ""}
)        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def board_kospi_delete(request, pk):
    board_kospi = get_object_or_404(Kospi, pk=pk)
    board_kospi.delete()
    return Response(status=status.HTTP_200_OK)
    
# ====================================================================== 코스닥 ======================================================================
@swagger_auto_schema(
    method='post',
    operation_id='코스닥 종목별 게시판 글 등록(유저)',
    operation_description='코스닥 종목별 게시판에 글을 등록합니다',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING, description="게시글 제목"),
            'content': openapi.Schema(type=openapi.TYPE_STRING, description="게시글 내용"),
            'code_number': openapi.Schema(type=openapi.TYPE_STRING, description="코스닥 종목 코드"),
        }
    ),
    tags=['게시판_코스닥'],
    responses={status.HTTP_201_CREATED: ""}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def board_kosdaq_create(request):
    data = request.data.copy()
    data['info_kospi'] = request.data.get('code_number')
    
    serializer = BoardKosdaqSerializer(data=data)
    
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    method='get',
    operation_id='코스닥 종목별 게시판 종목별 조회(아무나)',
    operation_description='코스닥 종목별 게시판 종목별로 조회합니다',
    tags=['게시판_코스닥'],
    manual_parameters=[page, size],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'count': openapi.Schema(type=openapi.TYPE_STRING, description="전체 게시글 수"),
                'next': openapi.Schema(type=openapi.TYPE_STRING, description="다음 조회 페이지 주소"),
                'previous': openapi.Schema(type=openapi.TYPE_STRING, description="이전 조회 페이지 주소"),
                'results' : get_serializer("board", "게시글 정보"),
            }
        )
    )}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def board_kosdaq_list(request, code_number):
    board_kosdaq_list = Kosdaq.objects.filter(info_kosdaq=code_number)
    paginator = PageNumberPagination()
    
    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size
    
    result = paginator.paginate_queryset(board_kosdaq_list, request)
    serializer = BoardKosdaqSerializer(result, many=True)
    return paginator.get_paginated_response(serializer.data)

@swagger_auto_schema(
    method='get',
    operation_id='코스닥 게시글 상세 조회(아무나)',
    operation_description='코스닥 게시글을 조회 합니다',
    tags=['게시판_코스닥'],
    responses={status.HTTP_200_OK: BoardDetailKosdaqSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def board_kosdaq_detail(request, pk):
    board_kosdaq = get_object_or_404(Kosdaq, pk=pk)
    serilizer = BoardDetailKosdaqSerializer(board_kosdaq)
    
    return Response(serilizer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='코스닥 게시글 상세 조회(아무나)',
    operation_description='코스닥 게시글을 상세 조회 합니다',
    tags=['게시판_코스닥'],
    responses={status.HTTP_200_OK: BoardDetailKosdaqSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def board_kosdaq_detail(request, pk):
    board_kosdaq = get_object_or_404(Kosdaq, pk=pk)
    serilizer = BoardDetailKosdaqSerializer(board_kosdaq)
    
    return Response(serilizer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='put',
    operation_id='코스닥 게시글 수정(유저)',
    operation_description='코스닥 게시글을 수정합니다',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING, description="수정할 게시글 제목"),
            'content': openapi.Schema(type=openapi.TYPE_STRING, description="수정할 게시글 내용"),
        }
    ),
    tags=['게시판_코스닥'],
    responses={status.HTTP_200_OK: ""}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def board_kosdaq_update(request, pk):
    board_kosdaq = get_object_or_404(Kosdaq, pk=pk)
    
    # request.data에 없는 데이터 추가해주기
    data = request.data.copy()
    data['info_kosdaq'] = board_kosdaq.info_kosdaq_id
    
    serializer = BoardKosdaqSerializer(instance=board_kosdaq, data=data)
    
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='delete',
    operation_id='게시글 삭제(유저)',
    operation_description='게시글을 제거합니다',
    tags=['게시판_코스닥'],
    responses={status.HTTP_200_OK: ""}
)        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def board_kosdaq_delete(request, pk):
    board_kosdaq = get_object_or_404(Kosdaq, pk=pk)
    board_kosdaq.delete()
    return Response(status=status.HTTP_200_OK)

# ====================================================================== 코넥스 ======================================================================
@swagger_auto_schema(
    method='post',
    operation_id='코넥스 종목별 게시판 글 등록(유저)',
    operation_description='코넥스 종목별 게시판에 글을 등록합니다',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING, description="게시글 제목"),
            'content': openapi.Schema(type=openapi.TYPE_STRING, description="게시글 내용"),
            'code_number': openapi.Schema(type=openapi.TYPE_STRING, description="코넥스 종목 코드"),
        }
    ),
    tags=['게시판_코넥스'],
    responses={status.HTTP_201_CREATED: ""}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def board_konex_create(request):
    data = request.data.copy()
    data['info_kospi'] = request.data.get('code_number')
    
    serializer = BoardKonexSerializer(data=data)
    
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    method='get',
    operation_id='코넥스 종목별 게시판 종목별 조회(아무나)',
    operation_description='코넥스 종목별 게시판 종목별로 조회합니다',
    tags=['게시판_코넥스'],
    manual_parameters=[page, size],
    responses={status.HTTP_200_OK: openapi.Response(
        description="200 OK",
        schema=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'count': openapi.Schema(type=openapi.TYPE_STRING, description="전체 게시글 수"),
                'next': openapi.Schema(type=openapi.TYPE_STRING, description="다음 조회 페이지 주소"),
                'previous': openapi.Schema(type=openapi.TYPE_STRING, description="이전 조회 페이지 주소"),
                'results' : get_serializer("board", "게시글 정보"),
            }
        )
    )}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def board_konex_list(request, code_number):
    board_konex_list = Konex.objects.filter(info_konex=code_number)
    paginator = PageNumberPagination()
    
    page_size = request.GET.get('size')
    if not page_size == None:
        paginator.page_size = page_size
    
    result = paginator.paginate_queryset(board_konex_list, request)
    serializer = BoardKonexSerializer(result, many=True)
    return paginator.get_paginated_response(serializer.data)

@swagger_auto_schema(
    method='get',
    operation_id='코넥스 게시글 상세 조회(아무나)',
    operation_description='코넥스 게시글을 조회 합니다',
    tags=['게시판_코넥스'],
    responses={status.HTTP_200_OK: BoardDetailKonexSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def board_konex_detail(request, pk):
    board_konex = get_object_or_404(Konex, pk=pk)
    serilizer = BoardDetailKonexSerializer(board_konex)
    
    return Response(serilizer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_id='코넥스 게시글 상세 조회(아무나)',
    operation_description='코넥스 게시글을 상세 조회 합니다',
    tags=['게시판_코넥스'],
    responses={status.HTTP_200_OK: BoardDetailKonexSerializer},
)
@api_view(['GET'])
@permission_classes([AllowAny])
def board_konex_detail(request, pk):
    board_konex = get_object_or_404(Konex, pk=pk)
    serilizer = BoardDetailKonexSerializer(board_konex)
    
    return Response(serilizer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='put',
    operation_id='코넥스 게시글 수정(유저)',
    operation_description='코넥스 게시글을 수정합니다',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'title': openapi.Schema(type=openapi.TYPE_STRING, description="수정할 게시글 제목"),
            'content': openapi.Schema(type=openapi.TYPE_STRING, description="수정할 게시글 내용"),
        }
    ),
    tags=['게시판_코넥스'],
    responses={status.HTTP_200_OK: ""}
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def board_konex_update(request, pk):
    board_konex = get_object_or_404(Konex, pk=pk)
    
    # request.data에 없는 데이터 추가해주기
    data = request.data.copy()
    data['info_konex'] = board_konex.info_konex_id
    
    serializer = BoardKonexSerializer(instance=board_konex, data=data)
    
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(status=status.HTTP_200_OK)
    
@swagger_auto_schema(
    method='delete',
    operation_id='게시글 삭제(유저)',
    operation_description='게시글을 제거합니다',
    tags=['게시판_코넥스'],
    responses={status.HTTP_200_OK: ""}
)        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def board_konex_delete(request, pk):
    board_konex = get_object_or_404(Konex, pk=pk)
    board_konex.delete()
    return Response(status=status.HTTP_200_OK)