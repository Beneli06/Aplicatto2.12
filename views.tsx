import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { 
  User, ResearchLine, Project, Course, UserRole, ProjectState 
} from './types';
import { 
  Button, SectionHeader, MetricCard, Input, Modal 
} from './components';
import { 
  ArrowRight, Users, BookOpen, Layers, Search, Briefcase, Plus, Sparkles, CheckCircle, Lock 
} from 'lucide-react';
import { generateCourseSyllabus, generateProjectAbstract } from './services/geminiService';

// --- PUBLIC VIEWS ---

export const LandingPage: React.FC = () => (
  <div className="flex flex-col">
    {/* Hero */}
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Semillero de Investigación</span>{' '}
                <span className="block text-blue-600 xl:inline">Aplicatto</span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Innovación, tecnología y desarrollo social. Formamos investigadores capaces de transformar realidades a través de soluciones digitales y análisis de datos.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a href="#/lineas" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg">
                    Ver Líneas
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="#/cursos-publicos" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg">
                    Formación
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://picsum.photos/800/600?grayscale"
          alt="Students collaborating"
        />
      </div>
    </div>

    {/* Mission/Vision */}
    <div className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
             <h3 className="text-xl font-bold text-blue-900 mb-2">Misión</h3>
             <p className="text-slate-600">
               Fomentar la cultura investigativa mediante el desarrollo de proyectos tecnológicos aplicados, contribuyendo a la solución de problemáticas locales con un enfoque ético y social.
             </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
             <h3 className="text-xl font-bold text-teal-700 mb-2">Visión</h3>
             <p className="text-slate-600">
               Consolidarnos como un referente en investigación aplicada en Medellín y Colombia para el 2030, liderando iniciativas de transformación digital en comunidades vulnerables.
             </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const PublicLinesView: React.FC<{ lines: ResearchLine[] }> = ({ lines }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <SectionHeader title="Líneas de Investigación" subtitle="Nuestros ejes temáticos principales." />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lines.map((line) => (
        <div key={line.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
          <div className="h-40 bg-slate-200 w-full overflow-hidden">
             <img src={line.imageUrl || `https://picsum.photos/seed/${line.id}/400/200`} alt={line.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{line.name}</h3>
            <p className="text-slate-600 text-sm mb-4 line-clamp-3">{line.description}</p>
            <div className="flex items-center justify-between">
               <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Activa</span>
               <a href="#/proyectos" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                 Ver Proyectos <ArrowRight size={14} className="ml-1"/>
               </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const PublicProjectsView: React.FC<{ projects: Project[], lines: ResearchLine[] }> = ({ projects, lines }) => {
  const [filterLine, setFilterLine] = useState<string>('all');
  
  const filteredProjects = projects.filter(p => filterLine === 'all' || p.lineId === filterLine);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="Proyectos de Investigación" subtitle="Explora el trabajo de nuestros estudiantes y docentes." />
      
      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <select 
          className="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={filterLine}
          onChange={(e) => setFilterLine(e.target.value)}
        >
          <option value="all">Todas las líneas</option>
          {lines.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row gap-6">
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${project.state === ProjectState.PUBLISHED ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {project.state}
                  </span>
                  <span className="text-xs text-slate-500">{project.year}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
                <p className="text-slate-600 mt-2 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
             </div>
             <div className="sm:w-48 flex-shrink-0 flex flex-col justify-center border-l border-slate-100 sm:pl-6">
                <div className="text-sm text-slate-500 mb-1">Línea</div>
                <div className="font-medium text-slate-900 mb-4">{lines.find(l => l.id === project.lineId)?.name}</div>
                <Button variant="outline" className="w-full text-xs">Ver Detalles</Button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PublicCoursesView: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const publicCourses = courses.filter(c => c.isPublic);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader title="Oferta Académica" subtitle="Cursos y talleres para la comunidad." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {publicCourses.map(course => (
          <div key={course.id} className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col">
            <div className="flex-1">
               <span className="inline-block px-2 py-1 text-xs font-semibold tracking-wide text-teal-800 bg-teal-100 rounded-full mb-2">
                 {course.level}
               </span>
               <h3 className="text-lg font-semibold text-slate-900 mb-2">{course.title}</h3>
               <p className="text-sm text-slate-600 line-clamp-3">{course.description}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">{course.modules.length} Módulos</span>
              <Button variant="ghost" className="text-blue-600 p-0 hover:bg-transparent">
                 Más info <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- PRIVATE / DASHBOARD VIEWS ---

import { ChevronRight } from 'lucide-react';

export const AdminDashboard: React.FC<{
  users: User[];
  projects: Project[];
  courses: Course[];
  lines: ResearchLine[];
}> = ({ users, projects, courses, lines }) => {
  // Simple stats for Recharts
  const data = [
    { name: 'Proyectos', value: projects.length },
    { name: 'Cursos', value: courses.length },
    { name: 'Usuarios', value: users.length },
    { name: 'Líneas', value: lines.length },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Panel de Administración" subtitle="Visión general del semillero" />
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Proyectos Activos" value={projects.filter(p => p.state !== ProjectState.FINISHED).length} icon={<Briefcase />} color="bg-blue-500" />
        <MetricCard title="Estudiantes" value={users.filter(u => u.role === UserRole.ESTUDIANTE).length} icon={<Users />} color="bg-teal-500" />
        <MetricCard title="Cursos Ofertados" value={courses.length} icon={<BookOpen />} color="bg-indigo-500" />
        <MetricCard title="Líneas de Inv." value={lines.length} icon={<Layers />} color="bg-pink-500" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Estadísticas Generales</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <RechartsTooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export const TeacherDashboard: React.FC<{
  currentUser: User;
  courses: Course[];
  projects: Project[];
  onAddCourse: (c: Course) => void;
  lines: ResearchLine[];
}> = ({ currentUser, courses, projects, onAddCourse, lines }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseLevel, setNewCourseLevel] = useState<'Básico' | 'Intermedio' | 'Avanzado'>('Básico');
  const [newCourseLine, setNewCourseLine] = useState(lines[0]?.id || '');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const myCourses = courses.filter(c => c.docenteId === currentUser.id);
  const myProjects = projects.filter(p => p.leaderId === currentUser.id); // Simplified logic

  const handleGenerate = async () => {
    if(!newCourseTitle) return;
    setIsGenerating(true);
    const lineName = lines.find(l => l.id === newCourseLine)?.name || 'General';
    const text = await generateCourseSyllabus(newCourseTitle, newCourseLevel, lineName);
    setGeneratedDesc(text);
    setIsGenerating(false);
  };

  const handleCreate = () => {
     const newCourse: Course = {
       id: Date.now().toString(),
       title: newCourseTitle,
       description: generatedDesc || 'Descripción pendiente.',
       docenteId: currentUser.id,
       lineId: newCourseLine,
       level: newCourseLevel,
       modules: [],
       enrolledStudentIds: [],
       isPublic: true
     };
     onAddCourse(newCourse);
     setModalOpen(false);
     setNewCourseTitle('');
     setGeneratedDesc('');
  };

  return (
    <div className="space-y-8">
      <div>
        <SectionHeader 
          title="Mis Cursos" 
          subtitle="Gestiona el contenido académico." 
          action={<Button onClick={() => setModalOpen(true)}><Plus size={16} className="mr-2"/> Crear Curso</Button>} 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.length === 0 ? <p className="text-slate-500">No has creado cursos aún.</p> : myCourses.map(c => (
            <div key={c.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
               <h3 className="font-bold text-lg text-slate-900">{c.title}</h3>
               <p className="text-sm text-slate-500 mt-1 mb-3">{c.level}</p>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-600 flex items-center gap-1"><Users size={14}/> {c.enrolledStudentIds.length} Alumnos</span>
                 <Button variant="ghost" className="text-blue-600 p-0 h-auto">Editar</Button>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 pt-8">
        <SectionHeader title="Mis Proyectos" subtitle="Proyectos que lideras o participas." />
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-slate-200">
            {myProjects.map(project => (
              <li key={project.id}>
                <div className="px-4 py-4 sm:px-6">
                   <div className="flex items-center justify-between">
                     <p className="text-sm font-medium text-blue-600 truncate">{project.title}</p>
                     <div className="ml-2 flex-shrink-0 flex">
                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{project.state}</span>
                     </div>
                   </div>
                   <div className="mt-2 sm:flex sm:justify-between">
                     <div className="sm:flex">
                       <p className="flex items-center text-sm text-slate-500">
                         {lines.find(l => l.id === project.lineId)?.name}
                       </p>
                     </div>
                   </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Crear Nuevo Curso">
         <div className="space-y-4">
            <Input label="Título del Curso" value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="Ej: Introducción a IoT" />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nivel</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-md" value={newCourseLevel} onChange={(e: any) => setNewCourseLevel(e.target.value)}>
                <option>Básico</option>
                <option>Intermedio</option>
                <option>Avanzado</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Línea</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-md" value={newCourseLine} onChange={e => setNewCourseLine(e.target.value)}>
                {lines.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
               <div className="flex justify-between items-center mb-2">
                 <label className="text-sm font-medium text-slate-700">Contenido Sugerido (IA)</label>
                 <Button type="button" variant="secondary" onClick={handleGenerate} disabled={isGenerating || !newCourseTitle} className="text-xs py-1 h-8">
                   {isGenerating ? 'Generando...' : <span className="flex items-center gap-1"><Sparkles size={12}/> Generar Syllabus</span>}
                 </Button>
               </div>
               <textarea 
                  className="w-full h-32 p-2 text-sm border border-slate-300 rounded" 
                  value={generatedDesc} 
                  onChange={e => setGeneratedDesc(e.target.value)}
                  placeholder="Aquí aparecerá la sugerencia de Gemini o puedes escribir la tuya..."
               ></textarea>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleCreate}>Crear Curso</Button>
            </div>
         </div>
      </Modal>
    </div>
  );
};

export const StudentDashboard: React.FC<{ currentUser: User; courses: Course[] }> = ({ currentUser, courses }) => {
  const enrolled = courses.filter(c => c.enrolledStudentIds.includes(currentUser.id));
  const available = courses.filter(c => !c.enrolledStudentIds.includes(currentUser.id) && c.isPublic);

  return (
    <div className="space-y-8">
       <SectionHeader title={`Bienvenido, ${currentUser.name}`} subtitle="Tu panel de aprendizaje." />
       
       <div>
         <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2"><CheckCircle size={20} className="text-green-500"/> Mis Inscripciones</h3>
         {enrolled.length === 0 ? (
           <div className="bg-slate-50 p-6 rounded-md text-center text-slate-500">No estás inscrito en ningún curso.</div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolled.map(c => (
                <div key={c.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
                   <div>
                     <h4 className="font-bold text-slate-800">{c.title}</h4>
                     <p className="text-xs text-slate-500">{c.level} • {c.modules.length} Módulos</p>
                   </div>
                   <Button variant="primary" className="text-sm">Ir al Aula</Button>
                </div>
              ))}
           </div>
         )}
       </div>

       <div>
         <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2"><Lock size={20} className="text-slate-400"/> Cursos Disponibles</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {available.map(c => (
              <div key={c.id} className="bg-white p-4 rounded-lg border border-slate-200">
                 <h4 className="font-semibold text-slate-800 mb-2">{c.title}</h4>
                 <p className="text-xs text-slate-500 mb-4 line-clamp-2">{c.description}</p>
                 <Button variant="outline" className="w-full text-xs">Inscribirse</Button>
              </div>
            ))}
         </div>
       </div>
    </div>
  );
};