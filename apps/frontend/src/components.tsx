// ...existing code...
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, BookOpen, Users, Lightbulb, 
  LayoutDashboard, LogOut, ChevronRight, GraduationCap, User as UserIcon
} from 'lucide-react';
import { UserRole, User } from './types';

// --- BUTTONS & INPUTS ---

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }> = 
  ({ className = '', variant = 'primary', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-400",
    outline: "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
  };
  return <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />;
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <input className={`w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`} {...props} />
  </div>
);

// --- LAYOUT COMPONENTS ---

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
    { name: 'Equipo', path: '/equipo' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-400 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">Aplicatto</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${location.pathname === link.path ? 'border-blue-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="outline" className="flex items-center gap-2">
                    <LayoutDashboard size={16} />
                    Panel {user.role === UserRole.ADMIN ? 'Admin' : user.role === UserRole.DOCENTE ? 'Docente' : 'Estudiante'}
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" title="Mi Perfil">
                    <UserIcon size={18} />
                  </Button>
                </Link>
                <Button variant="ghost" onClick={onLogout} title="Cerrar sesión">
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Button onClick={onLoginClick}>Acceso Miembros</Button>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`${location.pathname === link.path ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-200">
              {user ? (
                <div className="px-4 space-y-2">
                   <p className="text-sm text-slate-500">Hola, {user.name}</p>
                   <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-start mb-2" variant="outline">Ir al Panel</Button>
                   </Link>
                   <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-start mb-2" variant="outline">Mi Perfil</Button>
                   </Link>
                   <Button className="w-full justify-start" variant="ghost" onClick={() => { onLogout(); setIsOpen(false); }}>Cerrar Sesión</Button>
                </div>
              ) : (
                <div className="px-4">
                  <Button className="w-full" onClick={() => { onLoginClick(); setIsOpen(false); }}>Acceso Miembros</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-slate-900 text-white">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
             <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-xs">A</div>
             Aplicatto
          </h3>
          <p className="text-slate-400 text-sm">
            Semillero de investigación para el desarrollo de soluciones digitales con impacto social.
            Construyendo futuro desde la academia.
          </p>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-4 text-slate-200">Enlaces Rápidos</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/lineas" className="hover:text-white">Líneas de Investigación</Link></li>
            <li><Link to="/proyectos" className="hover:text-white">Proyectos Recientes</Link></li>
            <li><Link to="/cursos-publicos" className="hover:text-white">Formación</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-4 text-slate-200">Contacto</h4>
          <p className="text-sm text-slate-400 mb-2">Medellín, Colombia</p>
          <p className="text-sm text-slate-400">contacto@aplicatto-semillero.edu.co</p>
          <div className="mt-4 flex space-x-4">
             {/* Social placeholders */}
             <div className="w-6 h-6 bg-slate-700 rounded-full hover:bg-blue-500 cursor-pointer transition"></div>
             <div className="w-6 h-6 bg-slate-700 rounded-full hover:bg-blue-500 cursor-pointer transition"></div>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Aplicatto Semillero. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

// --- UI CARDS ---

export const MetricCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${color} text-white`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-slate-500 truncate">{title}</dt>
            <dd className="text-2xl font-semibold text-slate-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="md:flex md:items-center md:justify-between mb-6">
    <div className="flex-1 min-w-0">
      <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
    {action && <div className="mt-4 flex md:mt-0 md:ml-4">{action}</div>}
  </div>
);

// --- MODAL ---

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-slate-500 opacity-75" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
             <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">{title}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-500"><X size={20}/></button>
             </div>
             {children}
          </div>
        </div>
      </div>
    </div>
  );
};
