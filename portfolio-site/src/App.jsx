import React, { useState, useEffect } from 'react';
import { motion } from "motion/react"
import profileImg from './assets/profile_img.jpg';
import SocialLinks from "./Socials";
import CSSCube from './Cube';

// Page 1 Component
const Page1 = ({ onNavigate }) => {
  const [rectangles, setRectangles] = React.useState([]);
  const [animationEnabled, setAnimationEnabled] = React.useState(true);
  const technologies = ['React JS', 'Tailwind CSS', 'Python', 'FastAPI', 'Figma', 'Git'];

  React.useEffect(() => {
    if (!animationEnabled) return;

    const spawnInterval = setInterval(() => {
      const newRect = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        speed: 2 + Math.random() * 4,
        width: 40 + Math.random() * 80,
        height: 80 + Math.random() * 120,
        opacity: 0.3 + Math.random() * 0.4,
      };

      setRectangles(prev => [...prev, newRect]);

      setTimeout(() => {
        setRectangles(prev => prev.filter(rect => rect.id !== newRect.id));
      }, newRect.speed * 1000);
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [animationEnabled]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* Toggle Button */}
      <div className="absolute top-6 left-6 z-20 group">
        <button
          onClick={() => setAnimationEnabled(!animationEnabled)}
          className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:border-blue-400"
        >
          <svg 
            className="w-6 h-6 text-gray-700" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {animationEnabled ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
        </button>
        
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            {animationEnabled ? 'pause animation. im sorry, it just looks cool.' : 'resume cool animation'}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-800"></div>
          </div>
        </div>
      </div>

      {/* Grid Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e0f2fe 1px, transparent 1px),
            linear-gradient(to bottom, #e0f2fe 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Animated Rectangles */}
      {rectangles.map(rect => (
        <div
          key={rect.id}
            className="absolute bg-blue-400 rounded-t-lg"
            style={{
              left: `${rect.x}%`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              opacity: rect.opacity,
              bottom: `-${rect.height}px`,
              animation: `slideUp ${rect.speed}s linear forwards`,
              filter: 'blur(8px)',
            }}
        />
      ))}


      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full p-8">

        {/* <div className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none">
          <CSSCube />
        </div> */}

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute w-full max-w-6xl shadow-xl p-8 rounded-3xl border-4 border-white/30">
          <div className="flex gap-8 items-stretch">
            
            {/* Image Section */}
            <div className="hidden md:flex w-96 min-h-[32rem] bg-white/80 backdrop-blur-sm rounded-l-[4rem] shadow-lg items-center justify-center flex-shrink-0 border border-blue-100 p-3 relative">
              <img 
                src={profileImg}
                alt="Profile" 
                className="w-full h-full object-cover rounded-l-[3.5rem]" 
              />
              <div className="absolute bottom-6 right-6 text-white text-xs bg-black/50 backdrop-blur-sm px-3 py-1 rounded-l-full opacity-60 transition-transform duration-300"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.textDecoration = 'none';
                }}>
              
                <a href='https://x.com/xdeyuix' target="_blank">Art: @xdeyuix</a>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 flex flex-col gap-6">
              
              {/* Header */}
              <div className="flex-none bg-white/80 backdrop-blur-sm rounded-tr-3xl shadow-lg p-8 border border-blue-100">
                <h1 className="text-5xl font-bold text-gray-800">Greetings!</h1>
              </div>

              {/* Description */}
              <div className="flex-1 bg-white/80 backdrop-blur-sm shadow-lg p-8 border border-blue-100 flex items-center">
                <p className="text-xl text-gray-600 leading-relaxed">
                  I'm Lawrence,<br /> a Front-end Developer speciallizes in UI design and React JS. <br /> Designated in <span className="font-bold text-green-500">Philippines</span><br /><br /> <hr /><br />
                    <SocialLinks 
                      twitter="https://twitter.com/your-username"
                      github="https://github.com/lawrenceliwanag-lspu"
                      facebook="https://www.facebook.com/Exceea"
                      linkedin="https://linkedin.com/in/your-username"
                      size={24}
                    />
                </p>
              </div>

              {/* Technologies */}
              <div className="flex-none bg-white/80 backdrop-blur-sm rounded-br-3xl shadow-lg p-4 border border-blue-100">
                <div className="flex gap-3 flex-wrap">
                  {technologies.map((tech, index) => (
                    <div 
                      key={index}
                      className="border border-gray-200 px-4 py-2 bg-white/60 rounded-xl text-sm text-gray-700 transition-all duration-300 hover:border-blue-400 hover:shadow-lg cursor-pointer"
                      style={{ transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(71, 255, 102, 0.5)';
                        e.currentTarget.style.borderColor = '#85ff8fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}>
                    
                      {tech}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation Link */}
      <div className="absolute bottom-8 right-8  z-20">
        <button
          onClick={onNavigate}
          className="text-gray-400 text-xl hover:text-green-600 transition-colors duration-300 hover:scale-110 transform text-opacity-95"

        >
          scroll down
        </button>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-120vh);
          }
        }
      `}</style>
    </div>
  );
};

const Page2 = ({ onNavigate }) => {
  return (
    
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-white-100 to-blue-100">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e0f2fe 1px, transparent 1px),
            linear-gradient(to bottom, #e0f2fe 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
        <h1 className="text-6xl font-bold text-gray-800 mb-8">My Projects</h1>
        <p className="text-2xl text-gray-600 mb-12">Coming soon...</p>
        
        <button
          onClick={onNavigate}
          className="text-green-500 text-xl underline hover:text-green-600 transition-colors duration-300"
        >
          back to home
        </button>
      </div>
    </div>
  );
};

// Transition Overlay Component
const TransitionOverlay = ({ phase, direction }) => {
  const getTransform = () => {
    if (phase === 'idle') {
      // Stay where it exited based on last direction
      return direction === 'forward' ? 'translateX(-100%)' : 'translateX(100%)';
    }
    if (phase === 'entering') {
      return 'translateX(0)';
    }
    if (phase === 'exiting') {
      // Exit to opposite side based on direction
      return direction === 'forward' ? 'translateX(-100%)' : 'translateX(100%)';
    }
    // Initial state before any navigation
    return 'translateX(100%)';
  };

  return (
    <div
      className="fixed inset-0 bg-teal-500 z-50 transition-transform duration-700 ease-in-out"
      style={{ transform: getTransform() }}
    />
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('page1');
  const [transitionPhase, setTransitionPhase] = useState('idle');
  const [direction, setDirection] = useState('backward');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigate = (targetPage) => {
    if (isTransitioning) return; // Prevent multiple transitions
    
    setIsTransitioning(true);
    
    // Determine direction
    const isForward = targetPage === 'page2';
    setDirection(isForward ? 'forward' : 'backward');
    
    // Phase 1: Slide in to center
    setTransitionPhase('entering');
    
    // Phase 2: Change page while covered
    setTimeout(() => {
      setCurrentPage(targetPage);
    }, 700);
    
    // Phase 3: Slide out to opposite side
    setTimeout(() => {
      setTransitionPhase('exiting');
    }, 700);
    
    // Phase 4: Stay at exit position
    setTimeout(() => {
      setTransitionPhase('idle');
      setIsTransitioning(false);
    }, 1400);
  };

  // Scroll event listener
  useEffect(() => {
    let lastScrollTime = 0;
    const scrollThrottle = 1500; // Prevent rapid scrolling

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) return;
      
      const now = Date.now();
      if (now - lastScrollTime < scrollThrottle || isTransitioning) return;
      
      lastScrollTime = now;

      if (e.deltaY > 0) {
        
        if (currentPage === 'page1') {
          handleNavigate('page2');
        }
      } else if (e.deltaY < 0) {
        
        if (currentPage === 'page2') {
          handleNavigate('page1');
        }
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentPage, isTransitioning]);

  return (
    <div className="relative">
      {currentPage === 'page1' && <Page1 onNavigate={() => handleNavigate('page2')} />}
      {currentPage === 'page2' && <Page2 onNavigate={() => handleNavigate('page1')} />}
      <TransitionOverlay phase={transitionPhase} direction={direction} />
    </div>
  );
};

export default App;