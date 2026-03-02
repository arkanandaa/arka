import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Github, Linkedin, Mail, Plus, Trash2, Edit2, Save, LogOut } from 'lucide-react';
import { db } from './lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Role, Expertise, Project, Skill } from './types';
import { cn } from './lib/utils';

// --- Components ---

const Navbar = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out",
      scrolled ? "bg-paper/90 backdrop-blur-xl py-4 border-b border-ink/5 shadow-sm" : "bg-transparent py-8"
    )}>
      <div className="flex items-center justify-between px-6 md:px-12 max-w-[1800px] mx-auto">
        <Link to="/" className="group relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-serif font-bold tracking-tighter flex items-baseline gap-1"
          >
            ARKA<span className="italic font-light text-accent">ANANDA</span>
          </motion.div>
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-hover:w-full" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center h-full">
          {!isAdmin ? (
            <>
              <a href="#role" className="nav-item">Role</a>
              <a href="#expertise" className="nav-item">Expertise</a>
              <a href="#projects" className="nav-item">Projects</a>
              <a href="#skills" className="nav-item">Skills</a>
              <a href="#contact" className="nav-item">Contact</a>
              <Link to="/admin" className="nav-item border-r-0 group/admin">
                <span className="opacity-40 group-hover/admin:opacity-100 transition-opacity">Admin</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/admin" className="nav-item">Dashboard</Link>
              <Link to="/" className="nav-item border-r-0">View Site</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 w-full bg-[#f5f2ed] border-b border-black/10 p-6 flex flex-col gap-4"
          >
            {!isAdmin ? (
              <>
                <a href="#role" onClick={() => setIsOpen(false)}>Role</a>
                <a href="#expertise" onClick={() => setIsOpen(false)}>Expertise</a>
                <a href="#projects" onClick={() => setIsOpen(false)}>Projects</a>
                <a href="#skills" onClick={() => setIsOpen(false)}>Skills</a>
                <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
                <Link to="/admin" onClick={() => setIsOpen(false)} className="text-accent font-bold">Admin Login</Link>
              </>
            ) : (
              <>
                <Link to="/admin" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link to="/" onClick={() => setIsOpen(false)}>View Site</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
        className="absolute left-12 top-1/2 -translate-y-1/2 hidden lg:block"
      >
        <span className="vertical-text text-[10px] uppercase tracking-[0.4em]">
          Computer Science • UI Student • Developer
        </span>
      </motion.div>

      <div className="text-center max-w-5xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-[10px] uppercase tracking-[0.6em] mb-10 opacity-50 font-medium">Portfolio 2026</h2>
        </motion.div>

        <h1 className="text-7xl md:text-9xl lg:text-[11rem] mb-12 leading-[0.85] tracking-tight">
          <motion.span
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            Arka Ananda
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="italic font-light text-accent block mt-2"
          >
            Al Fatih
          </motion.span>
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-72 h-96 md:w-96 md:h-[550px] mt-8 group"
      >
        <div className="absolute inset-0 border border-accent/20 oval-mask -rotate-6 group-hover:rotate-0 transition-transform duration-1000"></div>
        <div className="absolute inset-0 border border-ink/5 oval-mask rotate-3 group-hover:rotate-0 transition-transform duration-1000 delay-100"></div>
        <img
          src="https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=800"
          alt="Profile"
          className="w-full h-full object-cover oval-mask shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
          referrerPolicy="no-referrer"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-8 -right-8 bg-white p-6 rounded-full shadow-2xl border border-ink/5 cursor-pointer hover:scale-110 transition-transform"
        >
          <ArrowRight className="rotate-45 text-accent" size={28} />
        </motion.div>
      </motion.div>
    </section>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="mb-20"
  >
    <span className="text-[10px] uppercase tracking-[0.5em] text-accent mb-4 block font-semibold">{subtitle}</span>
    <h2 className="text-5xl md:text-7xl font-serif leading-tight">{title}</h2>
  </motion.div>
);

// --- Main Portfolio Page ---

const Portfolio = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [expertise, setExpertise] = useState<Expertise[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const qRoles = query(collection(db, 'roles'));
    const qExpertise = query(collection(db, 'expertise'));
    const qProjects = query(collection(db, 'projects'));

    const unsubRoles = onSnapshot(qRoles, (snap) => {
      setRoles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Role)));
    });
    const unsubExpertise = onSnapshot(qExpertise, (snap) => {
      setExpertise(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expertise)));
    });
    const unsubProjects = onSnapshot(qProjects, (snap) => {
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });

    return () => {
      unsubRoles();
      unsubExpertise();
      unsubProjects();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Role Section */}
      <section id="role" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-ink/5">
        <SectionHeader title="Current Roles" subtitle="01 / Status" />
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            <p className="text-2xl md:text-4xl font-serif italic leading-tight text-ink/90">
              "Mahasiswa Universitas Indonesia jurusan Computer Science yang berfokus pada pengembangan sistem modern dan arsitektur microservices."
            </p>
            <div className="space-y-10">
              {(roles.length > 0 ? roles : [
                { title: "Fullstack Developer", description: "Developed and maintained 15+ client projects using React and Node.js with a focus on performance." },
                { title: "System Architect", description: "Led the migration of legacy systems to a modern microservices architecture, improving uptime by 40%." },
                { title: "UI/UX Specialist", description: "Crafting high-fidelity prototypes and immersive web experiences using Framer Motion and Figma." }
              ]).map((role, idx) => (
                <motion.div
                  key={role.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className="group"
                >
                  <div className="flex items-baseline gap-6 border-l border-ink/10 pl-8 transition-all duration-500 group-hover:border-accent">
                    <span className="text-[10px] font-mono opacity-30">0{idx + 1}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">{role.title}</h3>
                      <p className="text-sm opacity-50 leading-relaxed max-w-md">{role.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative aspect-square bg-ink/5 rounded-[4rem] flex items-center justify-center overflow-hidden group"
          >
             <div className="absolute inset-0 bg-accent/5 scale-0 group-hover:scale-100 transition-transform duration-1000 rounded-full" />
             <div className="text-center z-10">
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-9xl font-serif block mb-4 text-accent"
                >
                  15+
                </motion.span>
                <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">Projects Delivered</span>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-32 px-6 md:px-12 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Areas of Expertise" subtitle="02 / Skills" />
          <div className="grid md:grid-cols-3 gap-10">
            {(expertise.length > 0 ? expertise : [
              { title: "Frontend Engineering", description: "Building complex, state-driven user interfaces with React, Next.js, and advanced animation libraries." },
              { title: "Cloud Architecture", description: "Designing resilient microservices and serverless infrastructures on GCP and AWS with high availability." },
              { title: "Product Design", description: "Bridging the gap between design and code with high-fidelity Figma prototypes and design systems." }
            ]).map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="p-10 bg-paper/50 border border-ink/5 rounded-3xl hover:bg-white hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                  <Plus size={20} />
                </div>
                <h3 className="text-2xl font-serif mb-6 group-hover:italic transition-all duration-500">{item.title}</h3>
                <p className="text-sm leading-relaxed opacity-50 group-hover:opacity-80 transition-opacity duration-500">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <SectionHeader title="Selected Works" subtitle="03 / Projects" />
        <div className="grid md:grid-cols-2 gap-16">
          {(projects.length > 0 ? projects : [
            {
              id: 'p1',
              title: 'Lumina Microservices Architecture',
              imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
              tags: ['Node.js', 'Docker', 'Redis', 'GCP'],
              link: '#'
            },
            {
              id: 'p2',
              title: 'Aura E-Commerce Platform',
              imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
              tags: ['React', 'TypeScript', 'Stripe', 'Tailwind'],
              link: '#'
            },
            {
              id: 'p3',
              title: 'UI Student Portal Redesign',
              imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
              tags: ['Next.js', 'Framer Motion', 'Figma'],
              link: '#'
            },
            {
              id: 'p4',
              title: 'Sentinel Security Dashboard',
              imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
              tags: ['Python', 'React', 'D3.js', 'AWS'],
              link: '#'
            }
          ]).map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-[2.5rem] mb-8 relative shadow-2xl shadow-black/5">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-[2px]">
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="bg-white text-ink px-8 py-4 rounded-full text-[11px] uppercase tracking-widest font-bold shadow-xl"
                  >
                    View Case Study
                  </motion.span>
                </div>
              </div>
              <div className="flex justify-between items-end px-4">
                <div>
                  <h3 className="text-3xl font-serif mb-3 group-hover:text-accent transition-colors duration-500">{project.title}</h3>
                  <div className="flex flex-wrap gap-3">
                    {project.tags?.map(tag => (
                      <span key={tag} className="text-[9px] uppercase tracking-[0.2em] text-accent/60 font-bold border border-accent/10 px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 5, y: -5 }}
                  className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-500"
                >
                  <ArrowRight className="-rotate-45" size={20} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-6 md:px-12 bg-ink text-paper overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader title="Technical Stack" subtitle="04 / Expertise" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              { title: "Frontend", items: ["React / Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Redux / Zustand", "Three.js"] },
              { title: "Backend", items: ["Node.js / Bun", "Express / NestJS", "PostgreSQL / Prisma", "Redis / RabbitMQ", "GraphQL / gRPC"] },
              { title: "Infrastructure", items: ["Docker / K8s", "AWS / GCP / Azure", "Terraform / Ansible", "CI/CD (GitHub Actions)", "Microservices"] },
              { title: "Tools & UX", items: ["Git / GitHub", "Figma / Adobe CC", "Postman / Insomnia", "Firebase / Supabase", "Jest / Cypress"] }
            ].map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
              >
                <h4 className="text-[10px] font-bold mb-10 opacity-40 uppercase tracking-[0.4em] text-accent">{cat.title}</h4>
                <ul className="space-y-6 font-serif text-2xl">
                  {cat.items.map(item => (
                    <motion.li
                      key={item}
                      whileHover={{ x: 10, color: "#8b7e6a" }}
                      className="cursor-default transition-colors duration-300"
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-40 px-6 md:px-12 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-6xl md:text-8xl font-serif mb-16 leading-tight">
            Let's build something <br />
            <span className="italic text-accent">extraordinary</span>.
          </h2>
          <div className="flex flex-wrap justify-center gap-12 mb-24">
            {[
              { icon: Mail, label: "arka@example.com", href: "mailto:arka@example.com" },
              { icon: Linkedin, label: "LinkedIn", href: "#" },
              { icon: Github, label: "GitHub", href: "#" }
            ].map((link, idx) => (
              <motion.a
                key={link.label}
                href={link.href}
                whileHover={{ y: -5 }}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-500">
                  <link.icon size={20} />
                </div>
                <span className="text-lg font-medium group-hover:text-accent transition-colors duration-500">{link.label}</span>
              </motion.a>
            ))}
          </div>
          <div className="pt-20 border-t border-ink/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
            <span className="text-[10px] uppercase tracking-[0.4em]">© 2026 Arka Ananda Al Fatih</span>
            <div className="flex gap-8">
              <span className="text-[10px] uppercase tracking-[0.4em]">Jakarta, Indonesia</span>
              <span className="text-[10px] uppercase tracking-[0.4em]">UI Computer Science</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

// --- Admin Dashboard ---

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'atmin' && password === 'paswut') {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f2ed] px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-12 rounded-3xl shadow-xl border border-black/5"
      >
        <h1 className="text-4xl font-serif mb-8 text-center">Admin Access</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest opacity-60 mb-2 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#f5f2ed] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-black/5 outline-none"
              placeholder="atmin"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest opacity-60 mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f5f2ed] border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-black/5 outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-black/80 transition-colors"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'expertise' | 'projects'>('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [expertise, setExpertise] = useState<Expertise[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Form states
  const [newRole, setNewRole] = useState({ title: '', description: '' });
  const [newExpertise, setNewExpertise] = useState({ title: '', description: '' });
  const [newProject, setNewProject] = useState({ title: '', description: '', imageUrl: '', link: '', tags: '' });

  useEffect(() => {
    const unsubRoles = onSnapshot(collection(db, 'roles'), (snap) => {
      setRoles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Role)));
    });
    const unsubExpertise = onSnapshot(collection(db, 'expertise'), (snap) => {
      setExpertise(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expertise)));
    });
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });
    return () => { unsubRoles(); unsubExpertise(); unsubProjects(); };
  }, []);

  const handleAddRole = async () => {
    if (!newRole.title) return;
    await addDoc(collection(db, 'roles'), newRole);
    setNewRole({ title: '', description: '' });
  };

  const handleAddExpertise = async () => {
    if (!newExpertise.title) return;
    await addDoc(collection(db, 'expertise'), newExpertise);
    setNewExpertise({ title: '', description: '' });
  };

  const handleAddProject = async () => {
    if (!newProject.title) return;
    await addDoc(collection(db, 'projects'), {
      ...newProject,
      tags: newProject.tags.split(',').map(t => t.trim())
    });
    setNewProject({ title: '', description: '', imageUrl: '', link: '', tags: '' });
  };

  const handleDelete = async (coll: string, id: string) => {
    await deleteDoc(doc(db, coll, id));
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] pt-24 px-6 md:px-12 pb-24">
      <Navbar isAdmin />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-serif">Dashboard</h1>
          <div className="flex bg-white rounded-full p-1 shadow-sm border border-black/5">
            {(['roles', 'expertise', 'projects'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all",
                  activeTab === tab ? "bg-black text-white" : "hover:bg-black/5"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-black/5">
          {activeTab === 'roles' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  placeholder="Role Title"
                  className="bg-[#f5f2ed] p-4 rounded-xl outline-none"
                  value={newRole.title}
                  onChange={e => setNewRole({ ...newRole, title: e.target.value })}
                />
                <input
                  placeholder="Description"
                  className="bg-[#f5f2ed] p-4 rounded-xl outline-none md:col-span-2"
                  value={newRole.description}
                  onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                />
                <button onClick={handleAddRole} className="bg-black text-white p-4 rounded-xl flex items-center justify-center gap-2">
                  <Plus size={18} /> Add Role
                </button>
              </div>
              <div className="space-y-4">
                {roles.map(role => (
                  <div key={role.id} className="flex justify-between items-center p-6 bg-[#f5f2ed] rounded-2xl">
                    <div>
                      <h3 className="font-semibold">{role.title}</h3>
                      <p className="text-sm opacity-60">{role.description}</p>
                    </div>
                    <button onClick={() => handleDelete('roles', role.id!)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expertise' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  placeholder="Expertise Title"
                  className="bg-[#f5f2ed] p-4 rounded-xl outline-none"
                  value={newExpertise.title}
                  onChange={e => setNewExpertise({ ...newExpertise, title: e.target.value })}
                />
                <input
                  placeholder="Description"
                  className="bg-[#f5f2ed] p-4 rounded-xl outline-none md:col-span-2"
                  value={newExpertise.description}
                  onChange={e => setNewExpertise({ ...newExpertise, description: e.target.value })}
                />
                <button onClick={handleAddExpertise} className="bg-black text-white p-4 rounded-xl flex items-center justify-center gap-2">
                  <Plus size={18} /> Add Expertise
                </button>
              </div>
              <div className="space-y-4">
                {expertise.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-6 bg-[#f5f2ed] rounded-2xl">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm opacity-60">{item.description}</p>
                    </div>
                    <button onClick={() => handleDelete('expertise', item.id!)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Project Title"
                  className="bg-[#f5f2ed] p-4 rounded-xl outline-none"
                  value={newProject.title}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                />
                <input
                  placeholder="Image URL"
                  className="bg-[#f5f2ed] p-4 rounded-xl outline-none"
                  value={newProject.imageUrl}
                  onChange={e => setNewProject({ ...newProject, imageUrl: e.target.value })}
                />
                <input
                  placeholder="Tags (comma separated)"
                  className="bg-[#f5f2ed] p-4 rounded-xl outline-none"
                  value={newProject.tags}
                  onChange={e => setNewProject({ ...newProject, tags: e.target.value })}
                />
                <button onClick={handleAddProject} className="bg-black text-white p-4 rounded-xl flex items-center justify-center gap-2">
                  <Plus size={18} /> Add Project
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <div key={project.id} className="p-6 bg-[#f5f2ed] rounded-2xl relative group">
                    <img src={project.imageUrl} alt="" className="w-full h-32 object-cover rounded-xl mb-4" />
                    <h3 className="font-semibold">{project.title}</h3>
                    <div className="flex gap-2 mt-2">
                      {project.tags?.map(tag => (
                        <span key={tag} className="text-[8px] uppercase tracking-widest bg-white px-2 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleDelete('projects', project.id!)}
                      className="absolute top-4 right-4 bg-white text-red-500 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route
          path="/admin"
          element={
            isLoggedIn ? (
              <AdminDashboard />
            ) : (
              <AdminLogin onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
