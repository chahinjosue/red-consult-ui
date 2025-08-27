import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Library,
  Play,
  Award,
  CheckCircle2,
  BarChart2,
  Settings,
  Search,
  BookOpen,
  User,
  GraduationCap,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ---------------------------------------------------------------------------
// Red Consult – React Demo UI
// Single-file demo showcasing: Dashboard, Catalog, Course Player, Certificate,
// and Admin screens. Uses TailwindCSS for styling and lucide-react + recharts
// for icons/analytics. Animated with framer-motion. No backend required.
// ---------------------------------------------------------------------------

// Sample data
const sampleCourses = [
  {
    id: "aml-101",
    title: "Fundamentos de PLA/FT para Cooperativas",
    short: "Marco legal, riesgos y controles clave en Honduras.",
    level: "Básico",
    duration: "4h 30m",
    progress: 65,
    tags: ["Cumplimiento", "Cooperativas", "Honduras"],
  },
  {
    id: "aml-201",
    title: "Gestión de Riesgo LA/FT basada en ISO 31000",
    short: "Metodología práctica de identificación y matrices.",
    level: "Intermedio",
    duration: "6h 10m",
    progress: 15,
    tags: ["Riesgo", "ISO 31000"],
  },
  {
    id: "reg-101",
    title: "Normativa CNBS para el Sector Cooperativo",
    short: "Obligaciones, reportes, y mejores prácticas locales.",
    level: "Básico",
    duration: "3h 05m",
    progress: 0,
    tags: ["CNBS", "Regulación"],
  },
  {
    id: "fraud-110",
    title: "Fraude Operativo: Señales y Controles",
    short: "Casos reales en CA, indicadores y protocolos.",
    level: "Intermedio",
    duration: "5h 20m",
    progress: 0,
    tags: ["Fraude", "Operaciones"],
  },
];

const weeklyStudy = [
  { w: "Lun", min: 35 },
  { w: "Mar", min: 12 },
  { w: "Mié", min: 55 },
  { w: "Jue", min: 28 },
  { w: "Vie", min: 40 },
  { w: "Sáb", min: 75 },
  { w: "Dom", min: 20 },
];

const modules = [
  {
    id: 1,
    title: "Introducción al marco PLA/FT",
    duration: "14:28",
    done: true,
  },
  {
    id: 2,
    title: "Obligaciones regulatorias y reportes",
    duration: "11:12",
    done: true,
  },
  {
    id: 3,
    title: "Metodología de evaluación de riesgo",
    duration: "18:44",
    done: false,
  },
  { id: 4, title: "Señales de alerta y casos", duration: "16:01", done: false },
  { id: 5, title: "Examen final y certificación", duration: "10:03", done: false },
];

// UI Helpers
const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl bg-white shadow-sm p-5 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-slate-600">
    {children}
  </span>
);

function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-slate-800"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

function TopBar({ onSearch }) {
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img
            src="/logo-redconsult-icon.png"
            alt="Red Consult"
            className="h-9 w-auto rounded-md"
          />
          <div className="leading-tight">
            <div className="text-slate-900 font-semibold">RED Consult</div>
          </div>
        </div>

        <div className="ml-3 flex items-center gap-3">
          <button className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-50">
            <HelpCircle size={16} className="inline -mt-0.5 mr-1" /> Ayuda
          </button>
          <div className="h-9 w-9 rounded-full bg-slate-200 grid place-items-center">
            <User size={18} className="text-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ current, onChange }) {
  const items = [
    { id: "dashboard", icon: <Home size={18} />, label: "Inicio" },
    { id: "catalog", icon: <Library size={18} />, label: "Catálogo" },
    { id: "course", icon: <Play size={18} />, label: "Curso" },
    { id: "certificate", icon: <Award size={18} />, label: "Certificación" },
    { id: "admin", icon: <Settings size={18} />, label: "Admin" },
  ];
  return (
    <div className="hidden lg:block w-60 shrink-0 border-r bg-white/60">
      <div className="p-4">
        <div className="text-xs uppercase text-slate-500 mb-2">Navegación</div>
        <div className="grid gap-1">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-slate-100 transition ${
                current === it.id ? "bg-slate-900 text-white hover:bg-slate-900" : ""
              }`}
            >
              <span className="opacity-80">{it.icon}</span>
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="text-xs uppercase text-slate-500 mb-2">Certificaciones</div>
        <div className="grid gap-2">
          <Badge>
            <GraduationCap size={14} className="mr-2" /> PLA/FT Cooperativas
          </Badge>
          <Badge>
            <ShieldCheck size={14} className="mr-2" /> Oficial de Cumplimiento
          </Badge>
        </div>
      </div>
    </div>
  );
}

function MobileTabs({ current, onChange }) {
  const items = [
    { id: "dashboard", icon: <Home size={18} />, label: "Inicio" },
    { id: "catalog", icon: <Library size={18} />, label: "Catálogo" },
    { id: "course", icon: <Play size={18} />, label: "Curso" },
    { id: "certificate", icon: <Award size={18} />, label: "Certificación" },
    { id: "admin", icon: <Settings size={18} />, label: "Admin" },
  ];
  return (
    <div className="lg:hidden fixed bottom-3 inset-x-0 z-50">
      <div className="mx-auto max-w-md rounded-2xl border bg-white shadow-lg">
        <div className="grid grid-cols-5">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className={`flex flex-col items-center gap-1 py-2 text-xs ${
                current === it.id ? "text-slate-900" : "text-slate-500"
              }`}
            >
              {it.icon}
              {it.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, onOpen }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="hover:shadow-md transition cursor-pointer" onClick={onOpen}>
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl bg-slate-900 text-white grid place-items-center">
            <BookOpen size={22} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-900">{course.title}</div>
            <div className="text-sm text-slate-600 mt-0.5">{course.short}</div>
            <div className="mt-3 flex items-center gap-2">
              <Badge>{course.level}</Badge>
              <Badge>{course.duration}</Badge>
              {course.tags.slice(0, 2).map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            <div className="mt-4">
              <ProgressBar value={course.progress} />
              <div className="text-xs text-slate-500 mt-1">Progreso: {course.progress}%</div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function Dashboard() {
  const totalProgress = Math.round(
    sampleCourses.reduce((acc, c) => acc + c.progress, 0) / sampleCourses.length
  );
  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white grid place-items-center">
              <Play size={22} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Cursos activos</div>
              <div className="text-2xl font-semibold">{sampleCourses.length}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white grid place-items-center">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Progreso promedio</div>
              <div className="text-2xl font-semibold">{totalProgress}%</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white grid place-items-center">
              <Award size={22} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Insignias</div>
              <div className="text-2xl font-semibold">7</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Tu actividad semanal</div>
          <div className="text-sm text-slate-500">Minutos estudiados</div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyStudy} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="w" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="min" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Library size={18} />
            <div className="font-semibold">Continuar aprendiendo</div>
          </div>
          <div className="grid gap-3">
            {sampleCourses.slice(0, 2).map((c) => (
              <div key={c.id} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-900 grid place-items-center text-white">
                  <Play size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{c.title}</div>
                  <ProgressBar value={c.progress} />
                </div>
                <button className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50">Reanudar</button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <BarChart2 size={18} />
            <div className="font-semibold">Recomendado para ti</div>
          </div>
          <div className="grid gap-3">
            {sampleCourses.slice(2).map((c) => (
              <div key={c.id} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-900 grid place-items-center text-white">
                  <BookOpen size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{c.title}</div>
                  <div className="text-xs text-slate-500">{c.short}</div>
                </div>
                <button className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50">Ver</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Catalog({ filter, onOpenCourse }) {
  const filtered = useMemo(() => {
    if (!filter) return sampleCourses;
    const f = filter.toLowerCase();
    return sampleCourses.filter(
      (c) => c.title.toLowerCase().includes(f) || c.tags.some((t) => t.toLowerCase().includes(f))
    );
  }, [filter]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold">Catálogo</div>
          <div className="text-sm text-slate-500">Explora cursos y rutas de certificación</div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <select className="rounded-xl border px-3 py-2 text-sm">
            <option>Todos los niveles</option>
            <option>Básico</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
          <select className="rounded-xl border px-3 py-2 text-sm">
            <option>Todos los temas</option>
            <option>Cumplimiento</option>
            <option>Riesgo</option>
            <option>Fraude</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} onOpen={() => onOpenCourse(c)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CoursePlayer() {
  return (
    <div className="grid lg:grid-cols-[1fr,380px] gap-4">
      <Card className="overflow-hidden">
        <div className="aspect-video rounded-xl bg-slate-900 grid place-items-center text-white">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm mb-3">
              <Play size={16} /> Módulo 3 · 18:44
            </div>
            <div className="text-lg font-medium opacity-90">Metodología de evaluación de riesgo</div>
          </div>
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <Card>
            <div className="font-semibold mb-2">Descripción</div>
            <div className="text-sm text-slate-600">
              Aprende a construir matrices de riesgo y controles mitigantes con ejemplos tropicalizados a Honduras y CA.
            </div>
          </Card>
          <Card>
            <div className="font-semibold mb-2">Recursos</div>
            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
              <li>Plantilla matriz de riesgo (XLSX)</li>
              <li>Checklist de alertas (PDF)</li>
              <li>Guía de reportes regulatorios (PDF)</li>
            </ul>
          </Card>
        </div>

        <div className="mt-5">
          <div className="font-semibold mb-2">Quiz rápido</div>
          <div className="rounded-2xl border p-4">
            <div className="text-sm font-medium">¿Cuál es el objetivo principal de la evaluación de riesgo LA/FT?</div>
            <div className="mt-3 grid gap-2">
              {["Priorizar recursos de mitigación", "Cumplir únicamente con el marco legal", "Detectar fraudes internos"].map((opt, i) => (
                <label key={i} className="flex items-center gap-3 rounded-xl border px-3 py-2 text-sm">
                  <input type="radio" name="q1" className="accent-slate-900" />
                  {opt}
                </label>
              ))}
            </div>
            <button className="mt-3 rounded-xl border px-4 py-2 text-sm hover:bg-slate-50">Enviar</button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        <Card>
          <div className="font-semibold mb-3 flex items-center gap-2">
            <Library size={18} /> Contenido del curso
          </div>
          <div className="grid gap-2">
            {modules.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-xl border px-3 py-2 text-sm">
                <div className={`h-8 w-8 rounded-xl grid place-items-center ${m.done ? "bg-green-50" : "bg-slate-100"}`}>
                  {m.done ? <CheckCircle2 className="text-green-600" size={18} /> : <Play size={16} className="text-slate-600" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{m.title}</div>
                  <div className="text-xs text-slate-500">{m.duration}</div>
                </div>
                <button className="rounded-lg border px-3 py-1.5 text-xs hover:bg-slate-50">Abrir</button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="font-semibold mb-2 flex items-center gap-2">
            <MessageSquare size={18} /> Foro del curso
          </div>
          <div className="text-sm text-slate-600">
            Comparte dudas, casos y recursos con otros profesionales. <span className="text-slate-900 font-medium">Próximamente chat en vivo</span>.
          </div>
        </Card>
      </div>
    </div>
  );
}

function Certificate() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <div className="font-semibold mb-3">Vista previa del certificado</div>
        <div className="rounded-2xl border bg-gradient-to-br from-white to-slate-50 p-6">
          <div className="text-center">
            <div className="text-xs tracking-widest uppercase text-slate-500">Red Consult</div>
            <div className="text-2xl font-bold mt-1">Certificado de Finalización</div>
            <div className="mt-6 text-sm text-slate-600">Se otorga a</div>
            <div className="text-2xl font-semibold mt-1">Josue Chahin</div>
            <div className="mt-4 text-sm text-slate-600">por completar satisfactoriamente</div>
            <div className="text-lg font-medium mt-1">“Fundamentos de PLA/FT para Cooperativas”</div>
            <div className="mt-6 grid md:grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xs text-slate-500">ID del certificado</div>
                <div className="font-mono text-sm">RC-AML-101-2025-000123</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Fecha</div>
                <div className="text-sm">26 Ago 2025</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Verificación</div>
                <div className="text-sm">QR / Enlace único</div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-10">
              <div className="text-center">
                <div className="h-14" />
                <div className="border-t w-40 mx-auto" />
                <div className="text-xs text-slate-500 mt-1">Director Académico</div>
              </div>
              <div className="h-20 w-20 rounded-xl bg-slate-200 grid place-items-center text-slate-600 text-xs">
                QR
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50">Descargar PDF</button>
          <button className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50">Copiar enlace de verificación</button>
        </div>
      </Card>

      <Card>
        <div className="font-semibold mb-3">Criterios de certificación</div>
        <ul className="text-sm text-slate-600 list-disc pl-5 space-y-2">
          <li>Completar todos los módulos (100%).</li>
          <li>Obtener al menos 80% en el examen final.</li>
          <li>Aprobar 2 casos prácticos evaluados.</li>
          <li>Verificación pública mediante ID o QR.</li>
        </ul>
        <div className="mt-5 rounded-2xl border p-4">
          <div className="text-sm font-medium">Estado actual</div>
          <div className="mt-2">
            <ProgressBar value={72} />
            <div className="text-xs text-slate-500 mt-1">72% completado</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Admin() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <div className="font-semibold mb-3">Nuevo curso</div>
        <div className="grid gap-3">
          <input className="rounded-xl border px-3 py-2 text-sm" placeholder="Título del curso" />
          <textarea className="rounded-xl border px-3 py-2 text-sm" placeholder="Descripción" rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <select className="rounded-xl border px-3 py-2 text-sm">
              <option>Nivel: Básico</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>
            <input className="rounded-xl border px-3 py-2 text-sm" placeholder="Duración (ej. 4h 30m)" />
          </div>
          <button className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50">Guardar borrador</button>
        </div>
      </Card>

      <Card>
        <div className="font-semibold mb-3">Carga de contenido</div>
        <div className="grid gap-3">
          <div className="rounded-2xl border p-6 text-sm text-slate-600">
            Arrastra y suelta tus videos, PDFs y plantillas aquí
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-xl border p-3 text-sm">
              <div className="font-medium mb-1">Videos (0/10)</div>
              <div className="text-xs text-slate-500">MP4, max 1GB</div>
            </div>
            <div className="rounded-xl border p-3 text-sm">
              <div className="font-medium mb-1">Recursos (0/20)</div>
              <div className="text-xs text-slate-500">PDF, XLSX, DOCX</div>
            </div>
          </div>
          <button className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50">Publicar</button>
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState(null);
  console.log("URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log("KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "OK" : "MISSING");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      <TopBar onSearch={setSearch} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        <Sidebar current={tab} onChange={setTab} />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid gap-6"
            >
              {tab === "dashboard" && <Dashboard />}
              {tab === "catalog" && (
                <Catalog
                  filter={search}
                  onOpenCourse={(c) => {
                    setOpened(c);
                    setTab("course");
                  }}
                />
              )}
              {tab === "course" && <CoursePlayer course={opened} />}
              {tab === "certificate" && <Certificate />}
              {tab === "admin" && <Admin />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MobileTabs current={tab} onChange={setTab} />

      <footer className="mt-12 pb-24 lg:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          © {new Date().getFullYear()} Red Consult · Plataforma demo UI
        </div>
      </footer>
    </div>
  );
}
