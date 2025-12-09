// ...existing code...
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, BookOpen, Users, Lightbulb, 
  LayoutDashboard, LogOut, ChevronRight, GraduationCap, User as UserIcon
} from 'lucide-react';
import { UserRole, User } from '../types';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }> = 
  ({ className = '', variant = 'primary', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-400",
    outline: "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
  } as any;
  return <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />;
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <input className={`w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`} {...props} />
  </div>
);

// Minimal Navbar/Footer for now
interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onLoginClick }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Líneas', path: '/lineas' },
    { name: 'Proyectos', path: '/proyectos' },
    { name: 'Cursos', path: '/cursos-publicos' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center">A</div>
              <span className="font-bold text-xl">Aplicatto</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? <Button variant="ghost" onClick={onLogout}>Salir</Button> : <Button onClick={onLoginClick}>Acceder</Button>}
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-slate-900 text-white py-6 mt-8">
    <div className="max-w-7xl mx-auto px-4">Aplicatto © {new Date().getFullYear()}</div>
  </footer>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose}><X /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const SectionHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="md:flex md:items-center md:justify-between mb-6">
    <div className="flex-1 min-w-0">
      <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
    {action && <div className="mt-4 flex md:mt-0 md:ml-4">{action}</div>}
  </div>
);
