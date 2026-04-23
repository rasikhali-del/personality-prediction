from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import TestResult
from .serializers import UserSerializer, TestResultSerializer


# ===== AUTHENTICATION ENDPOINTS =====

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user"""
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')
        
        # Validation
        if not all([username, email, password, confirm_password]):
            return Response(
                {'error': 'All fields are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if password != confirm_password:
            return Response(
                {'error': 'Passwords do not match'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(password) < 6:
            return Response(
                {'error': 'Password must be at least 6 characters'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Email already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user and return tokens"""
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Authenticate with username
        user_auth = authenticate(username=user.username, password=password)
        
        if not user_auth:
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user_auth)
        
        return Response({
            'user': UserSerializer(user_auth).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get current authenticated user"""
    return Response({
        'user': UserSerializer(request.user).data
    }, status=status.HTTP_200_OK)


# ===== TEST RESULT ENDPOINTS =====

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_test_result(request):
    """Save test result for authenticated user"""
    try:
        modalities_used = []
        result_data = {
            'user': request.user,
        }
        
        # Parse individual modality results
        if 'text_result' in request.data and request.data['text_result']:
            result_data['text_result'] = request.data.get('text_result')
            modalities_used.append('text')
        
        if 'voice_result' in request.data and request.data['voice_result']:
            result_data['voice_result'] = request.data.get('voice_result')
            modalities_used.append('voice')
        
        if 'face_result' in request.data and request.data['face_result']:
            result_data['face_result'] = request.data.get('face_result')
            modalities_used.append('face')
        
        if 'fusion_result' in request.data and request.data['fusion_result']:
            result_data['fusion_result'] = request.data.get('fusion_result')
        
        result_data['modalities_used'] = modalities_used
        
        # Create test result
        test_result = TestResult.objects.create(**result_data)
        
        return Response(
            TestResultSerializer(test_result).data,
            status=status.HTTP_201_CREATED
        )
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_results(request):
    """Get all test results for authenticated user"""
    try:
        results = TestResult.objects.filter(user=request.user).order_by('-created_at')
        
        # Pagination
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))
        
        start = (page - 1) * page_size
        end = start + page_size
        
        total_count = results.count()
        paginated_results = results[start:end]
        
        return Response({
            'results': TestResultSerializer(paginated_results, many=True).data,
            'total': total_count,
            'page': page,
            'page_size': page_size,
            'pages': (total_count + page_size - 1) // page_size,
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ===== ADMIN ENDPOINTS =====

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_all_users(request):
    """Get all users (admin only)"""
    try:
        if not request.user.is_superuser:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        search = request.GET.get('search', '')
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))
        
        # Filter users
        users_query = User.objects.all()
        if search:
            users_query = users_query.filter(
                username__icontains=search
            ) | users_query.filter(
                email__icontains=search
            )
        
        users_query = users_query.order_by('-date_joined')
        
        # Pagination
        start = (page - 1) * page_size
        end = start + page_size
        
        total_count = users_query.count()
        paginated_users = users_query[start:end]
        
        # Add test count for each user
        users_data = []
        for user in paginated_users:
            user_data = UserSerializer(user).data
            user_data['total_tests'] = TestResult.objects.filter(user=user).count()
            user_data['date_joined'] = user.date_joined.isoformat()
            users_data.append(user_data)
        
        return Response({
            'users': users_data,
            'total': total_count,
            'page': page,
            'page_size': page_size,
            'pages': (total_count + page_size - 1) // page_size,
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_get_user_details(request, user_id):
    """Get user details with all test results (admin only)"""
    try:
        if not request.user.is_superuser:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        user = User.objects.get(id=user_id)
        results = TestResult.objects.filter(user=user).order_by('-created_at')
        
        user_data = UserSerializer(user).data
        user_data['results'] = TestResultSerializer(results, many=True).data
        user_data['total_tests'] = results.count()
        user_data['profile'] = {
            'age': None,
            'gender': None,
            'total_tests': results.count(),
            'last_test_date': results.first().created_at.isoformat() if results.exists() else None,
        }
        user_data['date_joined'] = user.date_joined.isoformat()
        
        return Response(user_data, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
