import React, { useEffect, useRef } from 'react';

export default function CSSCube() {
  return (
    <div className="absolute bottom-0 left-0 w-64 h-64 flex items-center justify-center pointer-events-none">
      <div className="cube-container">
        <div className="cube">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face right"></div>
          <div className="face left"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>
      
      <style>{`
        .cube-container {
          perspective: 1000px;
        }
        .cube {
          width: 150px;
          height: 150px;
          position: relative;
          transform-style: preserve-3d;
          animation: rotate 20s infinite linear;
        }
        .face {
          position: absolute;
          width: 150px;
          height: 150px;
          border: 2px solid #87ceeb;
          background: transparent;
        }
        .front  { transform: translateZ(75px); }
        .back   { transform: translateZ(-75px) rotateY(180deg); }
        .right  { transform: rotateY(90deg) translateZ(75px); }
        .left   { transform: rotateY(-90deg) translateZ(75px); }
        .top    { transform: rotateX(90deg) translateZ(75px); }
        .bottom { transform: rotateX(-90deg) translateZ(75px); }
        
        @keyframes rotate {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}