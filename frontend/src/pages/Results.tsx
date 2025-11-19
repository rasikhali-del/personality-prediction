import Navigation from '@/components/Navigation';
import ResultsDashboard from '@/components/ResultsDashboard';
import Footer from '@/components/Footer';

const Results = () => {
  return (
    <div className="min-h-screen bg-gradient-main">
      <Navigation />
      <ResultsDashboard />
      <Footer />
    </div>
  );
};

export default Results;