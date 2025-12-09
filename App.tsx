import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Footer, Modal, Input, Button } from './components';
import { LandingPage, PublicLinesView, PublicProjectsView, PublicCoursesView, AdminDashboard, TeacherDashboard, StudentDashboard, UserProfileView } from './views';
import { User, UserRole, ResearchLine, Project, Course, ProjectState } from './types';

// --- MOCK DATA ---
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@aplicatto.edu', role: UserRole.ADMIN, password: '123' },
  { id: '2', name: 'Prof. Jhon Doe', email: 'prof@aplicatto.edu', role: UserRole.DOCENTE, specialty: 'Data Science', password: '123', bio: 'Experto en IA.', interests: ['ML', 'Python'] },
  { id: '3', name: 'Estudiante Ana', email: 'ana@est.edu', role: UserRole.ESTUDIANTE, password: '123', bio: 'Estudiante de ingeniería.', interests: ['IoT'] },
];

const INITIAL_LINES: ResearchLine[] = [
  { id: 'l1', name: 'Inteligencia Artificial', description: 'Aplicación de modelos de ML y DL en contextos sociales.', leaderId: '2' },
  { id: 'l2', name: 'IoT y Ciudades', description: 'Sensores y conectividad para mejorar la vida urbana.', leaderId: '2' },
];

const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', title: 'Predicción de calidad del aire', description: 'Uso de redes neuronales para predecir PM2.5 en Medellín.', lineId: 'l1', leaderId: '2', year: 2024, state: ProjectState.IN_PROGRESS, tags: ['AI', 'Python', 'Ambiental'] },
  { id: 'p2', title: 'Sensores de ruido low-cost', description: 'Dispositivos IoT para medir contaminación auditiva.', lineId: 'l2', leaderId: '2', year: 2023, state: ProjectState.PUBLISHED, tags: ['IoT', 'Arduino', 'Hardware'] },
];

const INITIAL_COURSES: Course[] = [
  { id: 'c1', title: 'Fundamentos de Python', description: 'Curso introductorio para investigación.', docenteId: '2', level: 'Básico', modules: [], enrolledStudentIds: ['3'], isPublic: true },
  { id: 'c2', title: 'Machine Learning I', description: 'Modelos supervisados y no supervisados.', docenteId: '2', level: 'Intermedio', modules: [], enrolledStudentIds: [], isPublic: true },
];

// --- APP COMPONENT ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  // Global State (Simulating DB)
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [lines] = useState<ResearchLine[]>(INITIAL_LINES);
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login/Register Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Handlers
  const handleAuth = () => {
    if (authMode === 'login') {
      const user = users.find(u => u.email === email);
      if (user && user.password === password) {
        setCurrentUser(user);
        setLoginModalOpen(false);
        resetAuthForm();
      } else {
        alert('Credenciales incorrectas.');
      }
    } else {
      // Register
      if (!email || !password || !name) {
        alert('Por favor completa todos los campos.');
        return;
      }
      if (users.some(u => u.email === email)) {
        alert('El correo ya está registrado.');
        return;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: UserRole.ESTUDIANTE, // Default role for registration
        bio: '',
        interests: []
      };
      
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setLoginModalOpen(false);
      resetAuthForm();
    }
  };

  const resetAuthForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setAuthMode('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    window.location.hash = '/';
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses([...courses, newCourse]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    // Update global user list
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    
    // Update current user session
    setCurrentUser(updatedUser);
  };

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar 
          user={currentUser} 
          onLogout={handleLogout} 
          onLoginClick={() => { setAuthMode('login'); setLoginModalOpen(true); }} 
        />

        <div className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/lineas" element={<PublicLinesView lines={lines} />} />
            <Route path="/proyectos" element={<PublicProjectsView projects={projects} lines={lines} />} />
            <Route path="/cursos-publicos" element={<PublicCoursesView courses={courses} />} />
            
            {/* Private Routes */}
            <Route path="/dashboard" element={
              currentUser ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                  {currentUser.role === UserRole.ADMIN && (
                    <AdminDashboard users={users} projects={projects} courses={courses} lines={lines} />
                  )}
                  {currentUser.role === UserRole.DOCENTE && (
                    <TeacherDashboard currentUser={currentUser} courses={courses} projects={projects} onAddCourse={handleAddCourse} lines={lines} />
                  )}
                  {currentUser.role === UserRole.ESTUDIANTE && (
                    <StudentDashboard currentUser={currentUser} courses={courses} />
                  )}
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } />

            <Route path="/profile" element={
              currentUser ? (
                <UserProfileView user={currentUser} onUpdateUser={handleUpdateUser} />
              ) : (
                <Navigate to="/" replace />
              )
            } />
          </Routes>
        </div>

        <Footer />

        {/* Auth Modal */}
        <Modal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} title={authMode === 'login' ? "Iniciar Sesión" : "Registrarse"}>
          <div className="space-y-4">
            
            {authMode === 'register' && (
              <Input 
                label="Nombre Completo" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Tu nombre"
              />
            )}

            <Input 
              label="Correo Electrónico" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="ejemplo@aplicatto.edu"
            />
            
            <Input 
              label="Contraseña" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="******"
            />

            {authMode === 'login' && (
              <div className="text-xs text-slate-400 bg-slate-100 p-2 rounded">
                <p>Demo accounts (pwd: 123):</p>
                <p>admin@aplicatto.edu</p>
                <p>prof@aplicatto.edu</p>
                <p>ana@est.edu</p>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-2">
               <button 
                 className="text-sm text-blue-600 hover:underline"
                 onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); }}
               >
                 {authMode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
               </button>
               <Button onClick={handleAuth}>{authMode === 'login' ? 'Entrar' : 'Registrarse'}</Button>
            </div>
          </div>
        </Modal>

      </div>
    </HashRouter>
  );
};

export default App;