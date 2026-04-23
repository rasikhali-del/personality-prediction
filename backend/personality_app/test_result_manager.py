"""
Test result management utilities
"""
from personality_app.models import TestResult
from django.contrib.auth.models import User
import logging
import json

logger = logging.getLogger(__name__)


class TestResultManager:
    """Test result management and storage"""
    
    @staticmethod
    def save_test_result(user_id, text_result=None, voice_result=None, 
                        face_result=None, fusion_result=None):
        """Save test results for a user"""
        try:
            user = User.objects.get(id=user_id)
            
            modalities_used = []
            if text_result:
                modalities_used.append('text')
            if voice_result:
                modalities_used.append('voice')
            if face_result:
                modalities_used.append('face')
            
            test_result = TestResult.objects.create(
                user=user,
                text_result=text_result,
                voice_result=voice_result,
                face_result=face_result,
                fusion_result=fusion_result,
                modalities_used=modalities_used
            )
            
            logger.info(f"✅ Test result saved for user: {user.username}")
            return test_result, "Test result saved successfully"
        
        except User.DoesNotExist:
            logger.error(f"❌ User not found: {user_id}")
            return None, "User not found"
        except Exception as e:
            logger.error(f"❌ Error saving test result: {str(e)}")
            return None, str(e)
    
    @staticmethod
    def get_user_results(user_id, skip=0, limit=10):
        """Get all test results for a user"""
        try:
            user = User.objects.get(id=user_id)
            results = TestResult.objects.filter(user=user).order_by('-created_at')
            total = results.count()
            paginated_results = results[skip:skip + limit]
            
            return paginated_results, total, "Results retrieved"
        
        except User.DoesNotExist:
            return [], 0, "User not found"
        except Exception as e:
            logger.error(f"❌ Error retrieving results: {str(e)}")
            return [], 0, str(e)
    
    @staticmethod
    def get_result_by_id(result_id):
        """Get specific test result"""
        try:
            result = TestResult.objects.get(id=result_id)
            return result, "Result found"
        except TestResult.DoesNotExist:
            return None, "Result not found"
        except Exception as e:
            return None, str(e)
    
    @staticmethod
    def get_all_results(skip=0, limit=10):
        """Get all test results (admin only)"""
        try:
            results = TestResult.objects.all().order_by('-created_at')
            total = results.count()
            paginated_results = results[skip:skip + limit]
            
            return paginated_results, total, "Results retrieved"
        except Exception as e:
            logger.error(f"❌ Error retrieving all results: {str(e)}")
            return [], 0, str(e)
    
    @staticmethod
    def get_results_by_modality(modality):
        """Get results by modality type (text, voice, face)"""
        try:
            results = TestResult.objects.all()
            filtered_results = []
            
            for result in results:
                if modality in result.modalities_used:
                    filtered_results.append(result)
            
            return filtered_results, "Results retrieved"
        except Exception as e:
            logger.error(f"❌ Error filtering results: {str(e)}")
            return [], str(e)
    
    @staticmethod
    def get_user_stats(user_id):
        """Get test statistics for a user"""
        try:
            user = User.objects.get(id=user_id)
            results = TestResult.objects.filter(user=user)
            
            text_count = sum(1 for r in results if 'text' in r.modalities_used)
            voice_count = sum(1 for r in results if 'voice' in r.modalities_used)
            face_count = sum(1 for r in results if 'face' in r.modalities_used)
            fusion_count = sum(1 for r in results if r.fusion_result)
            
            stats = {
                'total_tests': results.count(),
                'text_tests': text_count,
                'voice_tests': voice_count,
                'face_tests': face_count,
                'fusion_tests': fusion_count,
                'first_test': results.last().created_at if results.exists() else None,
                'last_test': results.first().created_at if results.exists() else None,
            }
            
            return stats, "Stats retrieved"
        
        except User.DoesNotExist:
            return {}, "User not found"
        except Exception as e:
            logger.error(f"❌ Error getting stats: {str(e)}")
            return {}, str(e)
    
    @staticmethod
    def delete_result(result_id):
        """Delete a test result"""
        try:
            result = TestResult.objects.get(id=result_id)
            user = result.user.username
            result.delete()
            logger.info(f"✅ Result deleted for user: {user}")
            return True, "Result deleted successfully"
        
        except TestResult.DoesNotExist:
            return False, "Result not found"
        except Exception as e:
            logger.error(f"❌ Error deleting result: {str(e)}")
            return False, str(e)
    
    @staticmethod
    def export_results_as_json(user_id):
        """Export user's test results as JSON"""
        try:
            user = User.objects.get(id=user_id)
            results = TestResult.objects.filter(user=user)
            
            export_data = {
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
                'results': []
            }
            
            for result in results:
                export_data['results'].append({
                    'id': result.id,
                    'text_result': result.text_result,
                    'voice_result': result.voice_result,
                    'face_result': result.face_result,
                    'fusion_result': result.fusion_result,
                    'modalities_used': result.modalities_used,
                    'created_at': result.created_at.isoformat(),
                })
            
            return json.dumps(export_data, indent=2), "Export successful"
        
        except User.DoesNotExist:
            return None, "User not found"
        except Exception as e:
            logger.error(f"❌ Error exporting results: {str(e)}")
            return None, str(e)
