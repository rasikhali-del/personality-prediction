import { Card } from '@/components/ui/card';
import { Brain, Cpu, Shield, Award, Users, TrendingUp } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Models',
      description: 'State-of-the-art machine learning algorithms analyze multiple personality dimensions'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and never shared. Complete privacy and security guaranteed'
    },
    {
      icon: Award,
      title: 'Scientific Accuracy',
      description: 'Based on validated psychological frameworks including Big Five and MBTI'
    }
  ];

  const stats = [
    { number: '95%', label: 'Accuracy Rate' },
    { number: '10K+', label: 'Users Analyzed' },
    { number: '3', label: 'Analysis Methods' },
    { number: '24/7', label: 'Availability' }
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="text-accent">AI Personality?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-lora">
            Our cutting-edge AI combines multiple analysis methods to provide the most comprehensive 
            personality assessment available today.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card p-8 text-center hover:scale-105 transition-transform">
              <div className="bg-gradient-to-r from-primary to-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 font-lora">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <Card className="glass-card p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.number}</div>
                <div className="text-gray-300 font-lora">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Science Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">The Science Behind It</h3>
            <div className="space-y-4 font-lora text-gray-300">
              <p>
                Our AI personality predictor uses a multi-modal approach, analyzing three distinct 
                data sources to create a comprehensive personality profile.
              </p>
              <p>
                <strong className="text-accent">Text Analysis:</strong> Natural language processing 
                examines writing patterns, word choice, and emotional expression to identify personality traits.
              </p>
              <p>
                <strong className="text-accent">Voice Analysis:</strong> Advanced audio processing 
                analyzes speech patterns, tone, pace, and emotional inflections.
              </p>
              <p>
                <strong className="text-accent">Facial Analysis:</strong> Computer vision technology 
                reads micro-expressions and facial features that correlate with personality dimensions.
              </p>
            </div>
          </div>

          <Card className="glass-card p-8">
            <h4 className="text-xl font-bold text-white mb-6">Validation & Accuracy</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Tested against established psychological assessments</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">95% correlation with professional evaluations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Continuous learning and model improvement</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Peer-reviewed research methodology</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;