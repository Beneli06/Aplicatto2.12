import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Footer, Modal, Input, Button } from './components';
import { LandingPage, PublicLinesView, PublicProjectsView, PublicCoursesView, AdminDashboard, TeacherDashboard, StudentDashboard, UserProfileView } from './views';
import { User, UserRole, ResearchLine, Project, Course } from './types';
import { loginApi } from './services/authApi';
import { fetchLineas } from './services/lineasApi';
import { fetchProyectos } from './services/proyectosApi';
import { fetchCursos, createCurso } from './services/cursosApi';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const FALLBACK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@aplicatto.edu', role: UserRole.ADMIN, password: '123' },
  { id: '2', name: 'Prof. Jhon Doe', email: 'prof@aplicatto.edu', role: UserRole.DOCENTE, specialty: 'Data Science', password: '123', bio: 'Experto en IA.', interests: ['ML', 'Python'] },
  { id: '3', name: 'Estudiante Ana', email: 'ana@est.edu', role: UserRole.ESTUDIANTE, password: '123', bio: 'Estudiante de ingeniería.', interests: ['IoT'] },
];

const App: React.FC = () => {
  const [users] = useState<User[]>(FALLBACK_USERS); // solo para métricas en Admin hasta tener endpoint de usuarios
  const [lines, setLines] = useState<ResearchLine[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ls, ps, cs] = await Promise.all([
          fetchLineas(),
          fetchProyectos(),
          fetchCursos(),
        ]);
        setLines(ls);
        setProjects(ps);
        setCourses(cs);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los datos del servidor.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resetAuthForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setAuthMode('login');
  };

  const handleAuth = async () => {
    if (authMode === 'login') {
      try {
        const res = await loginApi(email, password);
        setToken(res.token);
        // Backend devuelve { id, name, role }; completamos email con el ingresado.
        const user: User = {
          id: res.user.id,
          name: res.user.name,
          email,
          role: res.user.role as UserRole,
          password: '',
        };
        setCurrentUser(user);
        setLoginModalOpen(false);
        resetAuthForm();
      } catch (e) {
        console.error(e);
        alert('Credenciales incorrectas o error de red.');
      }
    } else {
      alert('Registro no implementado en la API. Usa las cuentas demo (pwd: 123).');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    window.location.hash = '/';
  };

  const handleAddCourse = async (newCourse: Course) => {
    if (!currentUser || !token) {
      alert('Inicia sesión para crear cursos.');
      return;
    }
    try {
      const created = await createCurso({
        title: newCourse.title,
        description: newCourse.description,
        docenteId: currentUser.id,
        level: newCourse.level,
        lineId: newCourse.lineId,
        projectId: newCourse.projectId,
        modules: newCourse.modules ?? [],
        enrolledStudentIds: newCourse.enrolledStudentIds ?? [],
        isPublic: newCourse.isPublic,
      }, token);
      setCourses(prev => [...prev, created]);
    } catch (e) {
      console.error(e);
      alert('No se pudo crear el curso (revisa credenciales/rol).');
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    // No persistimos en backend aún; sólo estado local para perfil
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
          {loading ? (
            <div className="max-w-4xl mx-auto py-12 px-4 text-center text-slate-500">Cargando...</div>
          ) : error ? (
            <div className="max-w-4xl mx-auto py-12 px-4 text-center text-red-600">{error}</div>
          ) : (
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/lineas" element={<PublicLinesView lines={lines} />} />
              <Route path="/proyectos" element={<PublicProjectsView projects={projects} lines={lines} />} />
              <Route path="/cursos-publicos" element={<PublicCoursesView courses={courses} />} />
              <Route path="/equipo" element={<LandingPage />} />
              
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

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
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
                <p>Demo (pwd: 123):</p>
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
