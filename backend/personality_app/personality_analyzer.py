import json
import re
import threading
from typing import Dict, List, Any
import numpy as np
from django.utils import timezone

from .models import PersonalityTest, AnalysisLog

class PersonalityAnalyzer:
    """
    AI-powered personality analysis engine
    Analyzes text, voice, and facial expression data to determine Big Five personality traits
    """
    
    def __init__(self):
        # Big Five personality traits
        self.traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
        
        # Keyword mappings for text analysis (simplified NLP approach)
        self.trait_keywords = {
            'openness': {
                'positive': ['creative', 'imaginative', 'curious', 'adventurous', 'artistic', 'innovative', 
                           'original', 'intellectual', 'abstract', 'philosophical', 'complex', 'variety'],
                'negative': ['conventional', 'traditional', 'practical', 'routine', 'simple', 'concrete']
            },
            'conscientiousness': {
                'positive': ['organized', 'responsible', 'reliable', 'disciplined', 'careful', 'thorough',
                           'punctual', 'persistent', 'achievement', 'goal', 'plan', 'systematic'],
                'negative': ['disorganized', 'careless', 'unreliable', 'spontaneous', 'flexible', 'casual']
            },
            'extraversion': {
                'positive': ['outgoing', 'social', 'talkative', 'energetic', 'assertive', 'enthusiastic',
                           'friendly', 'party', 'people', 'team', 'group', 'leadership'],
                'negative': ['quiet', 'reserved', 'solitary', 'withdrawn', 'shy', 'introspective']
            },
            'agreeableness': {
                'positive': ['cooperative', 'trusting', 'helpful', 'compassionate', 'kind', 'empathetic',
                           'supportive', 'understanding', 'generous', 'forgiving', 'harmonious'],
                'negative': ['competitive', 'suspicious', 'critical', 'argumentative', 'selfish']
            },
            'neuroticism': {
                'positive': ['anxious', 'worried', 'stressed', 'emotional', 'moody', 'nervous',
                           'insecure', 'sensitive', 'volatile', 'unstable', 'pressure'],
                'negative': ['calm', 'stable', 'relaxed', 'confident', 'secure', 'resilient']
            }
        }
    
    def analyze_personality_async(self, test_id: str):
        """Run personality analysis in a separate thread"""
        thread = threading.Thread(target=self._analyze_personality_thread, args=(test_id,))
        thread.start()
    
    def _analyze_personality_thread(self, test_id: str):
        """Thread worker for personality analysis"""
        try:
            test = PersonalityTest.objects.get(id=test_id)
            self.analyze_personality(test)
        except Exception as e:
            print(f"Background analysis failed for test {test_id}: {e}")
    
    def analyze_personality(self, test: PersonalityTest) -> Dict[str, Any]:
        """
        Main personality analysis function
        Combines text, voice, and facial analysis
        """
        try:
            # Update status
            test.processing_status = 'processing'
            test.save()
            
            self._log_analysis_step(test, 'analysis_started', 'started')
            
            # Initialize scores
            trait_scores = {trait: 50.0 for trait in self.traits}  # Start with neutral scores
            confidence_scores = {trait: 0.0 for trait in self.traits}
            
            # Analyze text responses
            if test.text_response:
                text_scores, text_confidence = self._analyze_text(test.text_response)
                trait_scores = self._combine_scores(trait_scores, text_scores, weight=0.4)
                confidence_scores = self._combine_confidence(confidence_scores, text_confidence)
                self._log_analysis_step(test, 'text_analysis', 'completed', {'scores': text_scores})
            
            # Analyze voice patterns (placeholder - would need actual audio processing)
            if test.audio_file:
                voice_scores, voice_confidence = self._analyze_voice(test)
                trait_scores = self._combine_scores(trait_scores, voice_scores, weight=0.3)
                confidence_scores = self._combine_confidence(confidence_scores, voice_confidence)
                self._log_analysis_step(test, 'voice_analysis', 'completed', {'scores': voice_scores})
            
            # Analyze facial expressions
            if test.facial_expressions_data or test.expressions.exists():
                facial_scores, facial_confidence = self._analyze_facial_expressions(test)
                trait_scores = self._combine_scores(trait_scores, facial_scores, weight=0.3)
                confidence_scores = self._combine_confidence(confidence_scores, facial_confidence)
                self._log_analysis_step(test, 'facial_analysis', 'completed', {'scores': facial_scores})
            
            # Normalize scores to 0-100 range
            for trait in self.traits:
                trait_scores[trait] = max(0, min(100, trait_scores[trait]))
                confidence_scores[trait] = max(0, min(100, confidence_scores[trait]))
            
            # Generate personality insights
            personality_results = self._generate_personality_insights(trait_scores, confidence_scores)
            
            # Update test with results
            test.openness = trait_scores['openness']
            test.conscientiousness = trait_scores['conscientiousness']
            test.extraversion = trait_scores['extraversion']
            test.agreeableness = trait_scores['agreeableness']
            test.neuroticism = trait_scores['neuroticism']
            test.personality_results = personality_results
            test.confidence_scores = confidence_scores
            test.is_complete = True
            test.processing_status = 'completed'
            test.save()
            
            self._log_analysis_step(test, 'analysis_completed', 'completed', {
                'trait_scores': trait_scores,
                'confidence_scores': confidence_scores
            })
            
            return personality_results
            
        except Exception as e:
            test.processing_status = 'failed'
            test.save()
            self._log_analysis_step(test, 'analysis_failed', 'failed', error_message=str(e))
            raise e
    
    def _analyze_text(self, text: str) -> tuple[Dict[str, float], Dict[str, float]]:
        """Analyze text responses for personality traits"""
        text = text.lower()
        words = re.findall(r'\b\w+\b', text)
        
        trait_scores = {}
        confidence_scores = {}
        
        for trait in self.traits:
            positive_matches = sum(1 for word in words if word in self.trait_keywords[trait]['positive'])
            negative_matches = sum(1 for word in words if word in self.trait_keywords[trait]['negative'])
            
            total_matches = positive_matches + negative_matches
            
            if total_matches > 0:
                # Calculate score based on keyword ratio
                score = 50 + ((positive_matches - negative_matches) / total_matches) * 25
                confidence = min(total_matches * 10, 80)  # Higher confidence with more matches
            else:
                score = 50  # Neutral if no keywords found
                confidence = 20  # Low confidence
            
            trait_scores[trait] = score
            confidence_scores[trait] = confidence
        
        return trait_scores, confidence_scores
    
    def _analyze_voice(self, test: PersonalityTest) -> tuple[Dict[str, float], Dict[str, float]]:
        """Analyze voice patterns (placeholder implementation)"""
        # This would integrate with actual voice analysis libraries
        # For now, we'll return moderate scores based on audio duration
        
        duration = test.audio_duration
        trait_scores = {}
        confidence_scores = {}
        
        for trait in self.traits:
            if trait == 'extraversion':
                # Longer recordings might indicate higher extraversion
                score = min(50 + (duration * 2), 80)
            elif trait == 'neuroticism':
                # Shorter recordings might indicate higher neuroticism
                score = max(30, 70 - (duration * 1.5))
            else:
                # Neutral scores for other traits
                score = 50 + np.random.normal(0, 5)  # Small random variation
            
            trait_scores[trait] = max(20, min(80, score))
            confidence_scores[trait] = 40  # Moderate confidence for voice analysis
        
        return trait_scores, confidence_scores
    
    def _analyze_facial_expressions(self, test: PersonalityTest) -> tuple[Dict[str, float], Dict[str, float]]:
        """Analyze facial expressions for personality traits"""
        trait_scores = {}
        confidence_scores = {}
        
        expressions = test.expressions.all()
        
        if expressions.exists():
            # Analyze expression patterns
            expression_counts = {}
            for expr in expressions:
                expr_type = expr.expression_type
                expression_counts[expr_type] = expression_counts.get(expr_type, 0) + 1
            
            # Calculate trait scores based on expression patterns
            for trait in self.traits:
                if trait == 'extraversion':
                    # More smiles indicate higher extraversion
                    score = 40 + (expression_counts.get('smile', 0) * 15)
                elif trait == 'neuroticism':
                    # More sad expressions indicate higher neuroticism
                    score = 40 + (expression_counts.get('sad', 0) * 20)
                elif trait == 'openness':
                    # More surprised expressions indicate higher openness
                    score = 40 + (expression_counts.get('surprised', 0) * 15)
                else:
                    # Neutral scores for other traits
                    score = 50 + np.random.normal(0, 8)
                
                trait_scores[trait] = max(20, min(80, score))
                confidence_scores[trait] = 60  # Good confidence for facial analysis
        else:
            # No expression data available
            for trait in self.traits:
                trait_scores[trait] = 50
                confidence_scores[trait] = 20
        
        return trait_scores, confidence_scores
    
    def _combine_scores(self, base_scores: Dict[str, float], new_scores: Dict[str, float], weight: float) -> Dict[str, float]:
        """Combine multiple analysis scores with weighting"""
        combined = {}
        for trait in self.traits:
            base_value = base_scores.get(trait, 50)
            new_value = new_scores.get(trait, 50)
            combined[trait] = base_value * (1 - weight) + new_value * weight
        return combined
    
    def _combine_confidence(self, base_confidence: Dict[str, float], new_confidence: Dict[str, float]) -> Dict[str, float]:
        """Combine confidence scores"""
        combined = {}
        for trait in self.traits:
            base_conf = base_confidence.get(trait, 0)
            new_conf = new_confidence.get(trait, 0)
            # Take the maximum confidence
            combined[trait] = max(base_conf, new_conf)
        return combined
    
    def _generate_personality_insights(self, trait_scores: Dict[str, float], confidence_scores: Dict[str, float]) -> Dict[str, Any]:
        """Generate human-readable personality insights"""
        
        insights = {
            'summary': self._generate_summary(trait_scores),
            'traits': {},
            'strengths': [],
            'areas_for_growth': [],
            'career_suggestions': [],
            'relationship_style': ''
        }
        
        # Generate trait descriptions
        for trait in self.traits:
            score = trait_scores[trait]
            confidence = confidence_scores[trait]
            
            insights['traits'][trait] = {
                'score': round(score, 1),
                'confidence': round(confidence, 1),
                'level': self._get_trait_level(score),
                'description': self._get_trait_description(trait, score)
            }
        
        # Generate strengths and growth areas
        insights['strengths'] = self._identify_strengths(trait_scores)
        insights['areas_for_growth'] = self._identify_growth_areas(trait_scores)
        insights['career_suggestions'] = self._suggest_careers(trait_scores)
        insights['relationship_style'] = self._describe_relationship_style(trait_scores)
        
        return insights
    
    def _generate_summary(self, trait_scores: Dict[str, float]) -> str:
        """Generate a personality summary"""
        high_traits = [trait for trait, score in trait_scores.items() if score >= 70]
        low_traits = [trait for trait, score in trait_scores.items() if score <= 30]
        
        summary = "Based on your responses, you appear to be "
        
        if high_traits:
            trait_descriptions = []
            for trait in high_traits:
                if trait == 'openness':
                    trait_descriptions.append("creative and open to new experiences")
                elif trait == 'conscientiousness':
                    trait_descriptions.append("organized and reliable")
                elif trait == 'extraversion':
                    trait_descriptions.append("outgoing and energetic")
                elif trait == 'agreeableness':
                    trait_descriptions.append("cooperative and trusting")
                elif trait == 'neuroticism':
                    trait_descriptions.append("emotionally sensitive")
            
            summary += ", ".join(trait_descriptions) + ". "
        
        summary += "This personality profile suggests unique strengths and perspectives that you bring to your relationships and work."
        
        return summary
    
    def _get_trait_level(self, score: float) -> str:
        """Convert numerical score to descriptive level"""
        if score >= 70:
            return "High"
        elif score >= 30:
            return "Moderate"
        else:
            return "Low"
    
    def _get_trait_description(self, trait: str, score: float) -> str:
        """Get description for trait based on score"""
        descriptions = {
            'openness': {
                'high': "You enjoy exploring new ideas, are creative, and appreciate art and beauty.",
                'moderate': "You balance practicality with openness to new experiences.",
                'low': "You prefer familiar experiences and practical approaches to problems."
            },
            'conscientiousness': {
                'high': "You are highly organized, reliable, and goal-oriented.",
                'moderate': "You balance structure with flexibility in your approach to tasks.",
                'low': "You tend to be more spontaneous and flexible with rules and schedules."
            },
            'extraversion': {
                'high': "You are outgoing, energetic, and enjoy being around people.",
                'moderate': "You enjoy both social interaction and quiet time alone.",
                'low': "You prefer quieter environments and smaller groups of people."
            },
            'agreeableness': {
                'high': "You are cooperative, trusting, and considerate of others.",
                'moderate': "You balance cooperation with standing up for your own interests.",
                'low': "You tend to be more competitive and skeptical of others' motives."
            },
            'neuroticism': {
                'high': "You tend to experience emotions intensely and may worry frequently.",
                'moderate': "You experience a normal range of emotions and handle stress reasonably well.",
                'low': "You tend to be emotionally stable and calm under pressure."
            }
        }
        
        level = self._get_trait_level(score).lower()
        return descriptions[trait][level]
    
    def _identify_strengths(self, trait_scores: Dict[str, float]) -> List[str]:
        """Identify personality strengths"""
        strengths = []
        
        if trait_scores['conscientiousness'] >= 60:
            strengths.append("Strong organizational and planning skills")
        if trait_scores['agreeableness'] >= 60:
            strengths.append("Excellent interpersonal and teamwork abilities")
        if trait_scores['openness'] >= 60:
            strengths.append("Creative problem-solving and adaptability")
        if trait_scores['extraversion'] >= 60:
            strengths.append("Natural leadership and communication skills")
        if trait_scores['neuroticism'] <= 40:
            strengths.append("Emotional stability and resilience under pressure")
        
        return strengths[:3]  # Return top 3 strengths
    
    def _identify_growth_areas(self, trait_scores: Dict[str, float]) -> List[str]:
        """Identify areas for personal growth"""
        growth_areas = []
        
        if trait_scores['conscientiousness'] <= 40:
            growth_areas.append("Developing better organization and time management")
        if trait_scores['agreeableness'] <= 40:
            growth_areas.append("Building stronger collaborative relationships")
        if trait_scores['openness'] <= 40:
            growth_areas.append("Embracing new experiences and perspectives")
        if trait_scores['extraversion'] <= 40:
            growth_areas.append("Building confidence in social situations")
        if trait_scores['neuroticism'] >= 70:
            growth_areas.append("Developing stress management techniques")
        
        return growth_areas[:2]  # Return top 2 growth areas
    
    def _suggest_careers(self, trait_scores: Dict[str, float]) -> List[str]:
        """Suggest career paths based on personality"""
        careers = []
        
        if trait_scores['openness'] >= 60:
            careers.extend(["Artist", "Designer", "Researcher", "Writer"])
        if trait_scores['conscientiousness'] >= 60:
            careers.extend(["Project Manager", "Accountant", "Engineer", "Administrator"])
        if trait_scores['extraversion'] >= 60:
            careers.extend(["Sales Representative", "Teacher", "Manager", "Consultant"])
        if trait_scores['agreeableness'] >= 60:
            careers.extend(["Counselor", "Human Resources", "Social Worker", "Healthcare"])
        
        # Remove duplicates and return top suggestions
        return list(set(careers))[:4]
    
    def _describe_relationship_style(self, trait_scores: Dict[str, float]) -> str:
        """Describe relationship and communication style"""
        if trait_scores['extraversion'] >= 60 and trait_scores['agreeableness'] >= 60:
            return "You likely enjoy meeting new people and building warm, supportive relationships."
        elif trait_scores['extraversion'] <= 40 and trait_scores['agreeableness'] >= 60:
            return "You prefer deep, meaningful relationships with a smaller circle of close friends."
        elif trait_scores['extraversion'] >= 60 and trait_scores['agreeableness'] <= 40:
            return "You enjoy social interaction but may be more competitive in your relationships."
        else:
            return "You value independence and prefer relationships that respect your personal space."
    
    def _log_analysis_step(self, test: PersonalityTest, step: str, status: str, details: Dict = None, error_message: str = None):
        """Log analysis steps for debugging"""
        AnalysisLog.objects.create(
            test=test,
            analysis_step=step,
            status=status,
            details=details or {},
            error_message=error_message
        )
