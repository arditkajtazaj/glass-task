import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const CompletionCelebration = ({ 
  isVisible = false, 
  onClose = () => {},
  taskTitle = "Task"
}) => {
  const [particles, setParticles] = useState([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Generate particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1 + Math.random() * 0.5,
        size: 4 + Math.random() * 8
      }));
      setParticles(newParticles);
      
      // Show content after brief delay
      setTimeout(() => setShowContent(true), 200);
      
      // Auto close after celebration
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      setParticles([]);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center modal-backdrop">
      {/* Particles */}
      {particles?.map(particle => (
        <div
          key={particle?.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full animate-bounce opacity-80"
          style={{
            left: `${particle?.x}%`,
            top: `${particle?.y}%`,
            animationDelay: `${particle?.delay}s`,
            animationDuration: `${particle?.duration}s`,
            width: `${particle?.size}px`,
            height: `${particle?.size}px`
          }}
        />
      ))}
      {/* Celebration Content */}
      {showContent && (
        <div className="glass rounded-2xl p-8 max-w-md mx-4 text-center animate-scale-in">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-success to-accent flex items-center justify-center animate-pulse">
            <Icon name="CheckCircle" size={40} className="text-white" />
          </div>

          {/* Celebration Text */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              🎉 Well Done!
            </h2>
            <p className="text-muted-foreground">
              You completed "{taskTitle}"
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-success">
              <Icon name="TrendingUp" size={16} />
              <span>Keep up the great work!</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover-lift press-scale transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default CompletionCelebration;