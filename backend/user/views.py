from django.shortcuts import render, get_object_or_404, redirect
import requests
from django.utils.crypto import get_random_string
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializers
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

# CRUD = Create, Read, Update, Delete
# Daily limit save it in cookie or session
# Create your views here.
class UserView(APIView):
    def get(self, request, pk=None): # pk = primary key = id
        if pk:
            try:
                user = User.objects.get(pk=pk) # get = get 1 record
                serializer = UserSerializers(user)
            except:
                return Response({}, status=status.HTTP_200_OK)
        else: #get all data in user table
            users = User.objects.all()
            serializer = UserSerializers(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = UserSerializers(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            if 'password' in request.data:
                user.set_password(request.data['password'])
                user.save()
            return Response(UserSerializers(user).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
    def put(self, request, pk=None):
        if pk is None:
            return Response(
                {"detail": "PUT requires pk in URL."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializers(user, data=request.data)  # full update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk=None):
        if pk is None:
            return Response(
                {"detail": "PATCH requires pk in URL."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializers(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if pk is None:
            return Response(
                {"detail": "DELETE requires pk in URL."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_object_or_404(User, pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class GoogleLoginRedirectView(APIView):
    def get(self, request):
        client_id = settings.GOOGLE_CLIENT_ID
        redirect_uri = settings.GOOGLE_REDIRECT_URI
        scope = "openid email profile"
        
        # Generate and store state for CSRF protection
        state = get_random_string(32)
        request.session['oauth_state'] = state
        
        google_auth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth?"
            f"client_id={client_id}&"
            f"redirect_uri={redirect_uri}&"
            f"response_type=code&"
            f"scope={scope}&"
            f"state={state}&"
            f"access_type=offline&"
            f"prompt=consent"
        )
        return redirect(google_auth_url)

class GoogleCallbackView(APIView):
    def get(self, request):
        code = request.GET.get('code')
        state = request.GET.get('state')
        error = request.GET.get('error')
        
        frontend_callback_url = f"{settings.FRONTEND_URL}/auth/callback"

        if error:
            return redirect(f"{frontend_callback_url}?error={error}")
            
        if not code or not state:
            return redirect(f"{frontend_callback_url}?error=missing_parameters")

        # Verify state to prevent CSRF
        saved_state = request.session.get('oauth_state')
        if not saved_state or saved_state != state:
            return redirect(f"{frontend_callback_url}?error=csrf_validation_failed")
            
        # Clear state after successful verification
        del request.session['oauth_state']

        # Exchange code for token
        token_endpoint = "https://oauth2.googleapis.com/token"
        token_data = {
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code"
        }

        token_response = requests.post(token_endpoint, data=token_data)
        if not token_response.ok:
            return redirect(f"{frontend_callback_url}?error=token_exchange_failed")
        
        access_token = token_response.json().get('access_token')

        # Get user info
        userinfo_endpoint = "https://www.googleapis.com/oauth2/v3/userinfo"
        userinfo_response = requests.get(userinfo_endpoint, headers={"Authorization": f"Bearer {access_token}"})
        
        if not userinfo_response.ok:
            return redirect(f"{frontend_callback_url}?error=user_info_failed")

        user_info = userinfo_response.json()
        email = user_info.get('email')
        given_name = user_info.get('given_name', '')
        family_name = user_info.get('family_name', '')

        if not email:
            return redirect(f"{frontend_callback_url}?error=no_email_provided")

        # Check if user exists
        user = User.objects.filter(email=email).first()
        if not user:
            base_username = email.split('@')[0]
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            user = User(
                username=username,
                email=email,
                first_name=given_name,
                last_name=family_name
            )
            user.set_unusable_password()
            user.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Store tokens securely in cache with a temporary code
        temp_code = get_random_string(64)
        auth_data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializers(user).data
        }
        
        # Cache for 5 minutes
        cache.set(f"oauth_temp_{temp_code}", auth_data, timeout=300)

        # Redirect to frontend with only the temporary code
        return redirect(f"{frontend_callback_url}?code={temp_code}")

class GoogleTokenExchangeView(APIView):
    def post(self, request):
        temp_code = request.data.get('code')
        if not temp_code:
            return Response({"detail": "Temporary code is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        cache_key = f"oauth_temp_{temp_code}"
        auth_data = cache.get(cache_key)
        
        if not auth_data:
            return Response({"detail": "Invalid or expired temporary code."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Delete from cache so it can only be used once
        cache.delete(cache_key)
        
        return Response(auth_data, status=status.HTTP_200_OK)


