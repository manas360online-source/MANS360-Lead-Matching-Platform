
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  role: 'admin' | 'therapist';
  onRoleChange: (role: 'admin' | 'therapist') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, onRoleChange }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl">M</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">MANS360</h1>
            <p className="text-xs text-slate-400">Institutional Lead Portal</p>
          </div>
        </div>

        <nav className="flex items-center gap-2 bg-slate-950 p-1 rounded-full border border-slate-800">
          <button
            onClick={() => onRoleChange('admin')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${role === 'admin' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            BD Admin
          </button>
          <button
            onClick={() => onRoleChange('therapist')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${role === 'therapist' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Therapist
          </button>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 p-6 text-center text-slate-500 text-sm">
        &copy; 2026 MANS360 Product Team. Version 2.0
      </footer>
    </div>
  );
};

export default Layout;
