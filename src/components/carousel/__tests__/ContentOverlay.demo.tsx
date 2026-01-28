/**
 * ContentOverlay Component Demo
 * 
 * This demo shows how the ContentOverlay component works with different
 * content types and animation states. This file is for development
 * reference and is not part of the test suite.
 */

import React, { useState, useEffect } from 'react';
import { ContentOverlay } from '../ContentOverlay';
import { PortableTextBlock } from '@/types/sanity.types';

// Sample content for demonstration
const sampleContent: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'block1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'span1',
        text: 'Experience seamless connectivity with our advanced network infrastructure. ',
        marks: [],
      },
      {
        _type: 'span',
        _key: 'span2',
        text: 'Fast, reliable, and secure',
        marks: ['strong'],
      },
      {
        _type: 'span',
        _key: 'span3',
        text: ' - everything you need for modern communication.',
        marks: [],
      },
    ],
  },
  {
    _type: 'block',
    _key: 'block2',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'span4',
        text: 'Join thousands of satisfied customers who have made the switch to better service.',
        marks: ['em'],
      },
    ],
  },
];

const stepContent: PortableTextBlock[] = [
  {
    _type: 'block',
    _key: 'step1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'step-span1',
        text: 'Browse our flexible plans and find the perfect fit for your needs. Compare features, data allowances, and pricing to make an informed decision.',
        marks: [],
      },
    ],
  },
];

export function ContentOverlayDemo() {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Animate progress for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 0.01;
        return next > 1 ? 0 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto p-8">
        <h1 className="text-white text-3xl font-bold mb-8 text-center">
          ContentOverlay Component Demo
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regular Content Example */}
          <div className="bg-black/20 rounded-lg overflow-hidden relative h-96">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-80"></div>
            <ContentOverlay
              content={sampleContent}
              heading="Transform Your Experience"
              subheading="Discover the power of next-generation connectivity"
              progress={progress}
              isActive={isActive}
            />
          </div>

          {/* Step-based Content Example */}
          <div className="bg-black/20 rounded-lg overflow-hidden relative h-96">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 opacity-80"></div>
            <ContentOverlay
              content={stepContent}
              heading="01 Choose the right plan for you"
              subheading="Find your perfect match"
              progress={progress}
              isActive={isActive}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 bg-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Demo Controls</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Progress: {Math.round(progress * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={progress}
                onChange={(e) => setProgress(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Active State
              </label>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isActive 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isActive ? 'Active' : 'Inactive'}
              </button>
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Animation
              </label>
              <button
                onClick={() => {
                  setProgress(0);
                  const animate = () => {
                    setProgress(prev => {
                      const next = prev + 0.02;
                      if (next < 1) {
                        requestAnimationFrame(animate);
                      }
                      return Math.min(1, next);
                    });
                  };
                  animate();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
              >
                Replay Animation
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">🎭 Animation</h4>
            <p className="text-white/80 text-sm">
              Smooth opacity and transform animations based on scroll progress
            </p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">📱 Responsive</h4>
            <p className="text-white/80 text-sm">
              Adaptive typography and spacing across all screen sizes
            </p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">🔢 Step Numbers</h4>
            <p className="text-white/80 text-sm">
              Automatic extraction and display of step numbers from headings
            </p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">📝 Rich Text</h4>
            <p className="text-white/80 text-sm">
              Full support for Sanity portable text with formatting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentOverlayDemo;