import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import reactLogo from '../assets/react.svg';

const sampleProjects = [
  {
    id: 'p1',
    title: 'Interactive UI Kit',
    desc: 'A small component library with accessible primitives and storybook examples.',
    tags: ['React', 'Design'],
  },
  {
    id: 'p2',
    title: 'Solsense - Terrain Analyzer',
    desc: 'A demo app for visualizing terrain slope value for solar plant planning (experimental).',
    tags: ['React', 'Data'],
  },
  {
    id: 'p3',
    title: 'Portfolio Site',
    desc: 'This very portfolio — built with Vite + Tailwind + Motion.',
    tags: ['React', 'CSS'],
  },
  {
    id: 'p4',
    title: 'Design System',
    desc: 'Tokens, components and guidelines for consistent UI.',
    tags: ['Design', 'Figma'],
  },
];

const Tag = ({ tag, active, onClick }) => (
  <button
    onClick={() => onClick(tag)}
    className={`px-3 py-1 rounded-full text-sm border transition-all duration-200 mr-2 mb-2 ${active ? 'bg-green-500 text-white border-green-500' : 'bg-white/60 text-gray-800 border-gray-200 hover:scale-105'}`}
  >
    {tag}
  </button>
);

export default function ProjectsGallery({ onBack }) {
  const [activeTag, setActiveTag] = useState('All');
  const [query, setQuery] = useState('');

  const tags = useMemo(() => {
    const unique = new Set();
    sampleProjects.forEach(p => p.tags.forEach(t => unique.add(t)));
    return ['All', ...Array.from(unique)];
  }, []);

  const filtered = sampleProjects.filter(p => {
    const matchesTag = activeTag === 'All' || p.tags.includes(activeTag);
    const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase());
    return matchesTag && matchesQuery;
  });

  return (
    <div className="relative w-full h-screen overflow-auto p-8 bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-800">My Projects</h2>
            <p className="text-gray-600">Filter by tag or search by name/description.</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white/70 focus:outline-none"
            />
            <button onClick={onBack} className="text-sm text-green-600 underline">Back</button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center">
          {tags.map(t => (
            <Tag key={t} tag={t} active={t === activeTag} onClick={setActiveTag} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map(project => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-50 hover:shadow-2xl hover:scale-[1.01] transition-transform"
              >
                <div className="flex gap-4 p-4 rounded-xl items-center">
                  <img src={reactLogo} alt="thumb" className="w-20 h-20 object-contain rounded-lg bg-white p-2" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{project.desc}</p>
                    <div className="mt-3 flex flex-wrap">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs mr-2 mb-2 px-2 py-1 rounded-full bg-gray-100 text-gray-700">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
