
import { Card } from '@/components/ui/card';
import { FileText, Mic, Smile, TrendingUp, ArrowRight } from 'lucide-react';

const ProcessFlow = () => {
  const steps = [
    {
      icon: FileText,
      title: 'Answer Questions',
      description: 'Share your thoughts through writing prompts',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: Mic,
      title: 'Speak Aloud',
      description: 'Record your voice for vocal pattern analysis',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Smile,
      title: 'Show Your Face',
      description: 'Quick facial scan for micro-expression insights',
      color: 'from-cyan-500 to-green-500'
    },
    {
      icon: TrendingUp,
      title: 'Get Your Results',
      description: 'Receive detailed personality analysis',
      color: 'from-green-500 to-yellow-500'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How It <span className="text-accent">Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-lora">
            Our advanced AI analyzes multiple dimensions of your personality through a simple 4-step process
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <Card className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300 w-64">
                <div className={`bg-gradient-to-r ${step.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="bg-accent text-[#1B1F3B] rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300 font-lora text-sm">{step.description}</p>
              </Card>
              
              {index < steps.length - 1 && (
                <ArrowRight className="hidden lg:block h-8 w-8 text-accent mx-4 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-300 font-lora mb-6">
            "The accuracy of this AI analysis amazed me. It revealed aspects of my personality I never fully understood."
          </p>
          <p className="text-accent font-medium">— Sarah K., Beta Tester</p>
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;