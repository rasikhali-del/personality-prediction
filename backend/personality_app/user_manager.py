"""
User management utilities for authentication and storage
"""
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
import logging

logger = logging.getLogger(__name__)


class UserManager:
    """User management for registration, login, and profile"""
    
    @staticmethod
    def create_user(username, email, password):
        """Create new user with hashed password"""
        try:
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                return None, "Username already exists"
            
            if User.objects.filter(email=email).exists():
                return None, "Email already exists"
            
            # Create user with hashed password
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            logger.info(f"✅ User created: {username} ({email})")
            return user, "User created successfully"
        
        except Exception as e:
            logger.error(f"❌ Error creating user: {str(e)}")
            return None, str(e)
    
    @staticmethod
    def authenticate_user(email, password):
        """Authenticate user by email and password"""
        try:
            # Find user by email
            user = User.objects.get(email=email)
            
            # Check password
            if check_password(password, user.password):
                logger.info(f"✅ User authenticated: {user.username}")
                return user, "Login successful"
            else:
                logger.warning(f"⚠️ Invalid password for user: {email}")
                return None, "Invalid email or password"
        
        except User.DoesNotExist:
            logger.warning(f"⚠️ User not found: {email}")
            return None, "Invalid email or password"
        except Exception as e:
            logger.error(f"❌ Authentication error: {str(e)}")
            return None, str(e)
    
    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        try:
            user = User.objects.get(id=user_id)
            return user, "User found"
        except User.DoesNotExist:
            return None, "User not found"
        except Exception as e:
            return None, str(e)
    
    @staticmethod
    def get_user_by_email(email):
        """Get user by email"""
        try:
            user = User.objects.get(email=email)
            return user, "User found"
        except User.DoesNotExist:
            return None, "User not found"
        except Exception as e:
            return None, str(e)
    
    @staticmethod
    def get_all_users(skip=0, limit=10, search=None):
        """Get all users with pagination and search"""
        try:
            query = User.objects.all()
            
            if search:
                query = query.filter(
                    username__icontains=search
                ) | query.filter(
                    email__icontains=search
                )
            
            total = query.count()
            users = query[skip:skip + limit]
            
            return users, total, "Users retrieved"
        except Exception as e:
            logger.error(f"❌ Error retrieving users: {str(e)}")
            return [], 0, str(e)
    
    @staticmethod
    def update_user(user_id, **kwargs):
        """Update user information"""
        try:
            user = User.objects.get(id=user_id)
            
            # Update fields
            for key, value in kwargs.items():
                if hasattr(user, key) and key != 'password':
                    setattr(user, key, value)
            
            user.save()
            logger.info(f"✅ User updated: {user.username}")
            return user, "User updated successfully"
        
        except User.DoesNotExist:
            return None, "User not found"
        except Exception as e:
            logger.error(f"❌ Error updating user: {str(e)}")
            return None, str(e)
    
    @staticmethod
    def delete_user(user_id):
        """Delete user"""
        try:
            user = User.objects.get(id=user_id)
            username = user.username
            user.delete()
            logger.info(f"✅ User deleted: {username}")
            return True, "User deleted successfully"
        
        except User.DoesNotExist:
            return False, "User not found"
        except Exception as e:
            logger.error(f"❌ Error deleting user: {str(e)}")
            return False, str(e)
    
    @staticmethod
    def change_password(user_id, old_password, new_password):
        """Change user password"""
        try:
            user = User.objects.get(id=user_id)
            
            # Verify old password
            if not check_password(old_password, user.password):
                return False, "Old password is incorrect"
            
            # Set new password
            user.set_password(new_password)
            user.save()
            logger.info(f"✅ Password changed for user: {user.username}")
            return True, "Password changed successfully"
        
        except User.DoesNotExist:
            return False, "User not found"
        except Exception as e:
            logger.error(f"❌ Error changing password: {str(e)}")
            return False, str(e)
    
    @staticmethod
    def get_user_stats(user_id):
        """Get user statistics"""
        try:
            from personality_app.models import TestResult
            
            user = User.objects.get(id=user_id)
            test_results = TestResult.objects.filter(user=user)
            
            stats = {
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'total_tests': test_results.count(),
                'date_joined': user.date_joined,
                'last_login': user.last_login,
                'is_admin': user.is_superuser,
            }
            
            return stats, "Stats retrieved"
        except Exception as e:
            logger.error(f"❌ Error getting user stats: {str(e)}")
            return {}, str(e)
