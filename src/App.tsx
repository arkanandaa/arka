import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Github, Linkedin, Mail, Plus, Trash2, Edit2, Save, LogOut } from 'lucide-react';
import { db, storage } from './lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, orderBy, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { Role, Expertise, Project, Skill, Profile } from './types';
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

  const navLinks = [
    { name: 'Expertise', href: '/#expertise' },
    { name: 'Works', href: '/#projects' },
    { name: 'Stack', href: '/#skills' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out",
      scrolled ? "bg-paper/80 backdrop-blur-2xl py-4 border-b border-ink/5" : "bg-transparent py-10"
    )}>
      <div className="flex items-center justify-between px-8 md:px-16 max-w-[1600px] mx-auto">
        <Link to="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-black font-serif font-bold text-xl transition-transform duration-500 group-hover:rotate-[360deg]">
            A
          </div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-serif font-medium tracking-widest"
          >
            ARKA<span className="text-accent">.</span>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {!isAdmin ? (
            <>
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="px-6 py-2 typewriter text-[9px] hover:text-accent transition-colors relative group/link"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-accent transition-all duration-300 group-hover/link:w-1/2" />
                </a>
              ))}
              <Link to="/admin" className="ml-4 px-6 py-2 border border-ink/10 rounded-full typewriter text-[9px] hover:bg-ink hover:text-paper transition-all">
                Access
              </Link>
            </>
          ) : (
            <>
              <Link to="/admin" className="px-6 py-2 typewriter text-[9px]">Dashboard</Link>
              <Link to="/" className="ml-4 px-6 py-2 border border-accent/20 rounded-full typewriter text-[9px] text-accent hover:bg-accent hover:text-black transition-all">Exit</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-ink/10" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-paper/95 backdrop-blur-3xl border-b border-ink/10 overflow-hidden"
          >
            <div className="p-12 flex flex-col gap-8">
              {!isAdmin ? (
                <>
                  {navLinks.map((link) => (
                    <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-4xl font-serif hover:text-accent transition-colors">
                      {link.name}
                    </a>
                  ))}
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="typewriter text-accent mt-4">System Access</Link>
                </>
              ) : (
                <>
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="text-4xl font-serif">Dashboard</Link>
                  <Link to="/" onClick={() => setIsOpen(false)} className="text-4xl font-serif text-accent">Exit</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const Hero = ({ profileImage }: { profileImage: string }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 px-6 overflow-hidden">
      <div className="max-w-[1440px] w-full grid lg:grid-cols-[1.618fr_1fr] gap-16 items-center">
        <div className="z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="typewriter text-accent mb-6 block">Computer Science @ UI</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-12 leading-[0.9] tracking-tight">
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

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="text-lg md:text-xl opacity-60 max-w-xl mb-12 font-light leading-relaxed"
          >
            Architecting scalable digital ecosystems and high-performance microservices. 
            Focused on the intersection of robust engineering and intuitive design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-wrap gap-6"
          >
            <a href="#projects" className="btn-prestige bg-accent text-black">Explore Works</a>
            <a href="#contact" className="btn-prestige">Get In Touch</a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[1/1.618] w-full max-w-md mx-auto lg:mx-0"
        >
          <div className="absolute inset-0 border border-accent/20 translate-x-6 translate-y-6 rounded-[2rem]" />
          <div className="relative w-full h-full overflow-hidden rounded-[2rem] bg-card">
            <img
              src={profileImage || "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/img_0089_9.jpeg"}
              alt="Professional Portrait"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -right-8 bg-card p-6 rounded-full shadow-2xl border border-ink/5 cursor-pointer hover:scale-110 transition-transform"
          >
            <ArrowRight className="rotate-45 text-accent" size={28} />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
        <span className="typewriter text-[8px]">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-12 bg-ink"
        />
      </div>
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
    <span className="typewriter text-accent mb-4 block font-semibold">{subtitle}</span>
    <h2 className="text-5xl md:text-7xl font-serif leading-tight">{title}</h2>
  </motion.div>
);

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'projects', id), (snap) => {
      if (snap.exists()) {
        setProject({ id: snap.id, ...snap.data() } as Project);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center typewriter">Loading System...</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center typewriter">Project Not Found</div>;

  return (
    <PageTransition>
      <Navbar />
      <div className="pt-40 pb-32 px-6 md:px-12 max-w-[1440px] mx-auto">
        <Link to="/" className="flex items-center gap-2 typewriter text-accent mb-12 group">
          <ArrowRight className="rotate-180 group-hover:-translate-x-2 transition-transform" size={16} />
          Back to Terminal
        </Link>
        
        <div className="grid lg:grid-cols-[1fr_1.618fr] gap-20">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">{project.title}</h1>
            <div className="flex flex-wrap gap-3 mb-12">
              {project.tags?.map(tag => (
                <span key={tag} className="typewriter text-[10px] border border-accent/20 px-6 py-2 rounded-full text-accent">
                  {tag}
                </span>
              ))}
            </div>
            <div className="space-y-8 opacity-70 leading-relaxed text-lg font-light">
              <p>{project.description}</p>
              {project.longDescription && <p>{project.longDescription}</p>}
            </div>
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="btn-prestige mt-12 inline-block bg-accent text-black">
                Live Deployment
              </a>
            )}
          </div>
          <div className="rounded-[3rem] overflow-hidden shadow-2xl">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

const ExpertiseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Expertise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'expertise', id), (snap) => {
      if (snap.exists()) {
        setItem({ id: snap.id, ...snap.data() } as Expertise);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center typewriter">Loading Module...</div>;
  if (!item) return <div className="min-h-screen flex items-center justify-center typewriter">Module Not Found</div>;

  return (
    <PageTransition>
      <Navbar />
      <div className="pt-40 pb-32 px-6 md:px-12 max-w-[1000px] mx-auto">
        <Link to="/" className="flex items-center gap-2 typewriter text-accent mb-12 group">
          <ArrowRight className="rotate-180 group-hover:-translate-x-2 transition-transform" size={16} />
          Back to Core
        </Link>
        <div className="glass-card p-16 rounded-[4rem]">
          <span className="typewriter text-accent mb-6 block">Core Competency</span>
          <h1 className="text-6xl md:text-8xl font-serif mb-12 leading-tight">{item.title}</h1>
          <div className="w-24 h-[1px] bg-accent/30 mb-12" />
          <div className="space-y-8 opacity-80 leading-relaxed text-xl font-light">
            <p className="text-2xl italic font-serif text-accent/90">{item.description}</p>
            {item.longDescription && <p>{item.longDescription}</p>}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

// --- Main Portfolio Page ---

const Portfolio = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [expertise, setExpertise] = useState<Expertise[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // One-time update to the requested profile image
    const updateProfileImage = async () => {
      const targetUrl = "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/img_0089_9.jpeg";
      await setDoc(doc(db, 'profile', 'main'), { imageUrl: targetUrl }, { merge: true });
    };
    updateProfileImage();

    const qRoles = query(collection(db, 'roles'));
    const qExpertise = query(collection(db, 'expertise'));
    const qProjects = query(collection(db, 'projects'));
    const qProfile = doc(db, 'profile', 'main');

    const unsubRoles = onSnapshot(qRoles, (snap) => {
      setRoles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Role)));
    });
    const unsubExpertise = onSnapshot(qExpertise, (snap) => {
      setExpertise(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expertise)));
    });
    const unsubProjects = onSnapshot(qProjects, (snap) => {
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });
    const unsubProfile = onSnapshot(qProfile, (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as Profile);
      }
    });

    return () => {
      unsubRoles();
      unsubExpertise();
      unsubProjects();
      unsubProfile();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero profileImage={profile?.imageUrl || ''} />

      {/* Role Section */}
      <section id="role" className="py-32 px-6 md:px-12 max-w-[1440px] mx-auto border-t border-ink/5">
        <div className="grid lg:grid-cols-[1fr_1.618fr] gap-20 items-start">
          <div>
            <SectionHeader title="Professional Trajectory" subtitle="01 / Status" />
            <div className="w-24 h-[1px] bg-accent/30" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-16"
          >
            <p className="text-3xl md:text-5xl font-serif italic leading-tight text-ink/90">
              "Computer Science scholar at the University of Indonesia, specializing in high-performance distributed systems and modern microservices."
            </p>
            <div className="grid md:grid-cols-2 gap-12">
              {(roles.length > 0 ? roles : [
                { title: "Full-Stack Engineer", description: "Engineered and deployed over 15 enterprise-grade client projects utilizing React, Node.js, and modern cloud infrastructures." },
                { title: "Systems Architect", description: "Spearheaded the transition from monolithic legacy systems to microservices, resulting in a 40% improvement in system reliability." },
                { title: "Technical Mentor", description: "Dedicated to fostering growth in junior developers while implementing robust CI/CD pipelines and DevOps best practices." }
              ]).map((role, idx) => (
                <motion.div
                  key={role.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className="group"
                >
                  <div className="flex flex-col gap-6 border-l border-ink/10 pl-8 transition-all duration-500 group-hover:border-accent">
                    <span className="typewriter opacity-30">0{idx + 1}</span>
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 group-hover:text-accent transition-colors">{role.title}</h3>
                      <p className="text-base opacity-50 leading-relaxed font-light">{role.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-24 px-6 md:px-12 bg-card/20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-[1.618fr_1fr] gap-16 items-end mb-16">
            <SectionHeader title="Core Competencies" subtitle="02 / Expertise" />
            <p className="typewriter opacity-40 mb-16 text-right max-w-xs ml-auto">
              High-performance solutions through technical precision.
            </p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {(expertise.length > 0 ? expertise : [
              { title: "Frontend Engineering", description: "Developing complex, state-driven user interfaces with React and Next.js." },
              { title: "Cloud Infrastructure", description: " Architecting resilient, serverless environments on GCP and AWS." },
              { title: "Product Design", description: "Synthesizing engineering constraints with user-centric design." },
              { title: "Cybersecurity", description: "Implementing enterprise-grade security protocols and monitoring." },
              { title: "AI Integration", description: "Deploying context-aware LLMs to enhance digital products." }
            ]).map((item, idx) => (
              <Link
                key={item.id || idx}
                to={item.id ? `/expertise/${item.id}` : '#'}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.6 }}
                  className="p-8 bg-card border border-ink/5 rounded-[2rem] hover:border-accent/30 transition-all duration-500 group h-full flex flex-col"
                >
                  <div className="w-12 h-12 bg-accent/5 rounded-xl flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-black transition-colors duration-500">
                    <Plus size={18} />
                  </div>
                  <h3 className="text-xl font-serif mb-4 group-hover:italic transition-all duration-500">{item.title}</h3>
                  <p className="text-xs leading-relaxed opacity-40 group-hover:opacity-70 transition-opacity duration-500 font-light line-clamp-3">{item.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.618fr] gap-16 items-end mb-16">
          <SectionHeader title="Selected Works" subtitle="03 / Projects" />
          <div className="flex gap-4 mb-16 justify-end">
            <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center opacity-30">
              <ArrowRight className="rotate-180" size={20} />
            </div>
            <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center hover:bg-accent hover:text-black hover:border-accent transition-all cursor-pointer">
              <ArrowRight size={20} />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {(projects.length > 0 ? projects : [
            {
              id: 'p1',
              title: 'Lumina Microservices',
              imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
              tags: ['Node.js', 'GCP'],
              link: '#'
            },
            {
              id: 'p2',
              title: 'Aura E-Commerce',
              imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
              tags: ['React', 'TypeScript'],
              link: '#'
            },
            {
              id: 'p3',
              title: 'Academic Portal',
              imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
              tags: ['Next.js', 'Figma'],
              link: '#'
            },
            {
              id: 'p4',
              title: 'Sentinel Security',
              imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
              tags: ['Python', 'AWS'],
              link: '#'
            },
            {
              id: 'p5',
              title: 'Neural Visualizer',
              imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
              tags: ['TensorFlow', 'WebGL'],
              link: '#'
            },
            {
              id: 'p6',
              title: 'Quantum Ledger',
              imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200',
              tags: ['Rust', 'Blockchain'],
              link: '#'
            }
          ]).map((project, idx) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="group cursor-pointer block"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="overflow-hidden rounded-[2rem] mb-6 relative aspect-[4/5] shadow-xl shadow-black/5">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-paper/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-accent text-black flex items-center justify-center shadow-xl">
                      <ArrowRight className="-rotate-45" size={20} />
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <h3 className="text-2xl font-serif mb-4 group-hover:text-accent transition-colors duration-500">{project.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="typewriter text-[7px] border border-accent/10 px-3 py-1 rounded-full text-accent/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-6 md:px-12 bg-card/30 overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.618fr] gap-24 items-start">
            <div>
              <SectionHeader title="Technical Stack" subtitle="04 / Expertise" />
              <p className="typewriter opacity-40 max-w-xs">
                Engineered for performance, scalability, and maintainability.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16">
              {[
                { title: "Frontend", items: ["React / Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Redux / Zustand", "Three.js"] },
                { title: "Backend", items: ["Node.js / Bun", "Express / NestJS", "PostgreSQL / Prisma", "Redis / RabbitMQ", "GraphQL / gRPC"] },
                { title: "Infrastructure", items: ["Docker / K8s", "AWS / GCP / Azure", "Terraform / Ansible", "CI/CD Pipelines", "Microservices"] },
                { title: "Tools & UX", items: ["Git / GitHub", "Figma / Adobe CC", "Postman / Insomnia", "Firebase / Supabase", "Jest / Cypress"] }
              ].map((cat, idx) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                >
                  <h4 className="typewriter text-accent mb-10 border-b border-accent/20 pb-4">{cat.title}</h4>
                  <ul className="space-y-6 font-serif text-3xl">
                    {cat.items.map(item => (
                      <motion.li
                        key={item}
                        whileHover={{ x: 10, color: "#c69749" }}
                        className="cursor-default transition-all duration-300 font-light"
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-40 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-[1.618fr_1fr] gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="typewriter text-accent mb-6 block">Inquiries</span>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-16 leading-tight">
              Let's build something <br />
              <span className="italic text-accent">extraordinary</span>.
            </h2>
            <div className="flex flex-wrap gap-12 mb-24">
              {[
                { icon: Mail, label: "arkaalfatih1758@gmail.com", href: "mailto:arkaalfatih1758@gmail.com" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
                { icon: Github, label: "GitHub", href: "https://github.com/arkanandaa" }
              ].map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  whileHover={{ y: -5 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-full border border-ink/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black group-hover:border-accent transition-all duration-500">
                    <link.icon size={24} />
                  </div>
                  <span className="typewriter text-sm group-hover:text-accent transition-colors duration-500">{link.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          <div className="glass-card p-12 rounded-[3rem]">
            <h3 className="text-3xl mb-8">Direct Transmission</h3>
            <form className="space-y-6">
              <div>
                <label className="typewriter opacity-40 mb-2 block">Identity</label>
                <input type="text" className="w-full bg-transparent border-b border-ink/10 py-4 outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label className="typewriter opacity-40 mb-2 block">Email</label>
                <input type="email" className="w-full bg-transparent border-b border-ink/10 py-4 outline-none focus:border-accent transition-colors" />
              </div>
              <div>
                <label className="typewriter opacity-40 mb-2 block">Message</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-ink/10 py-4 outline-none focus:border-accent transition-colors" />
              </div>
              <button className="btn-prestige w-full bg-accent text-black mt-8">Send Message</button>
            </form>
          </div>
        </div>
        <div className="pt-20 mt-32 border-t border-ink/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
          <span className="typewriter">© 2026 Arka Ananda Al Fatih</span>
          <div className="flex gap-8">
            <span className="typewriter">Jakarta, Indonesia</span>
            <span className="typewriter">UI Computer Science</span>
          </div>
        </div>
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
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card p-12 rounded-3xl shadow-xl border border-white/5"
      >
        <h1 className="text-4xl font-serif mb-8 text-center">Admin Access</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="typewriter opacity-60 mb-2 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-paper border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent/20 outline-none text-ink"
              placeholder="atmin"
            />
          </div>
          <div>
            <label className="typewriter opacity-60 mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-paper border-none rounded-xl px-6 py-4 focus:ring-2 focus:ring-accent/20 outline-none text-ink"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-accent text-black py-4 rounded-xl font-medium hover:bg-accent/80 transition-colors"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'expertise' | 'projects' | 'profile'>('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [expertise, setExpertise] = useState<Expertise[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Form states
  const [newRole, setNewRole] = useState({ title: '', description: '' });
  const [newExpertise, setNewExpertise] = useState({ title: '', description: '', longDescription: '' });
  const [newProject, setNewProject] = useState({ title: '', description: '', longDescription: '', imageUrl: '', link: '', tags: '' });
  const [profileUrl, setProfileUrl] = useState('');
  const [uploading, setUploading] = useState(false);

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
    const unsubProfile = onSnapshot(doc(db, 'profile', 'main'), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Profile;
        setProfile(data);
        setProfileUrl(data.imageUrl);
      }
    });
    return () => { unsubRoles(); unsubExpertise(); unsubProjects(); unsubProfile(); };
  }, []);

  const handleAddRole = async () => {
    if (!newRole.title) return;
    await addDoc(collection(db, 'roles'), newRole);
    setNewRole({ title: '', description: '' });
  };

  const handleAddExpertise = async () => {
    if (!newExpertise.title) return;
    await addDoc(collection(db, 'expertise'), newExpertise);
    setNewExpertise({ title: '', description: '', longDescription: '' });
  };

  const handleAddProject = async () => {
    if (!newProject.title) return;
    await addDoc(collection(db, 'projects'), {
      ...newProject,
      tags: newProject.tags.split(',').map(t => t.trim())
    });
    setNewProject({ title: '', description: '', imageUrl: '', link: '', tags: '' });
  };

  const handleUpdateProfileUrl = async () => {
    await setDoc(doc(db, 'profile', 'main'), { imageUrl: profileUrl });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    console.log("Starting upload to bucket:", storage.app.options.storageBucket);
    setUploading(true);
    
    try {
      // Use a simpler path to avoid potential issues
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, fileName);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      await new Promise((resolve, reject) => {
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          }, 
          (error) => {
            console.error("Upload task error:", error);
            reject(error);
          }, 
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              setProfileUrl(url);
              await setDoc(doc(db, 'profile', 'main'), { imageUrl: url });
              resolve(url);
            } catch (e) {
              reject(e);
            }
          }
        );
      });
    } catch (err: any) {
      console.error("Firebase Storage Error Detail:", err);
      if (err.code === 'storage/retry-limit-exceeded') {
        alert(`Upload timed out. \n\nCurrent Bucket: ${storage.app.options.storageBucket}\n\nTroubleshooting:\n1. Check if Firebase Storage is ENABLED in your console.\n2. Ensure the bucket name matches exactly.\n3. Check your internet connection.`);
      } else if (err.code === 'storage/unauthorized') {
        alert('Upload failed: Unauthorized. Please check your Firebase Storage security rules.');
      } else {
        alert(`Upload failed: ${err.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (coll: string, id: string) => {
    await deleteDoc(doc(db, coll, id));
  };

  return (
    <div className="min-h-screen bg-paper pt-24 px-6 md:px-12 pb-24">
      <Navbar isAdmin />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-serif">Dashboard</h1>
          <div className="flex bg-card rounded-full p-1 shadow-sm border border-white/5">
            {(['roles', 'expertise', 'projects', 'profile'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all",
                  activeTab === tab ? "bg-accent text-black" : "hover:bg-white/5 text-ink/60"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-xl border border-white/5">
          {activeTab === 'roles' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  placeholder="Role Title"
                  className="bg-paper p-4 rounded-xl outline-none text-ink"
                  value={newRole.title}
                  onChange={e => setNewRole({ ...newRole, title: e.target.value })}
                />
                <input
                  placeholder="Description"
                  className="bg-paper p-4 rounded-xl outline-none md:col-span-2 text-ink"
                  value={newRole.description}
                  onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                />
                <button onClick={handleAddRole} className="bg-accent text-black p-4 rounded-xl flex items-center justify-center gap-2 font-bold">
                  <Plus size={18} /> Add Role
                </button>
              </div>
              <div className="space-y-4">
                {roles.map(role => (
                  <div key={role.id} className="flex justify-between items-center p-6 bg-paper rounded-2xl border border-white/5">
                    <div>
                      <h3 className="font-semibold">{role.title}</h3>
                      <p className="text-sm opacity-60">{role.description}</p>
                    </div>
                    <button onClick={() => handleDelete('roles', role.id!)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expertise' && (
            <div className="space-y-8">
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="Expertise Title"
                    className="bg-paper p-4 rounded-xl outline-none text-ink"
                    value={newExpertise.title}
                    onChange={e => setNewExpertise({ ...newExpertise, title: e.target.value })}
                  />
                  <input
                    placeholder="Short Description"
                    className="bg-paper p-4 rounded-xl outline-none text-ink"
                    value={newExpertise.description}
                    onChange={e => setNewExpertise({ ...newExpertise, description: e.target.value })}
                  />
                </div>
                <textarea
                  placeholder="Long Description (for detail page)"
                  className="bg-paper p-4 rounded-xl outline-none text-ink w-full"
                  rows={3}
                  value={newExpertise.longDescription}
                  onChange={e => setNewExpertise({ ...newExpertise, longDescription: e.target.value })}
                />
                <button onClick={handleAddExpertise} className="bg-accent text-black p-4 rounded-xl flex items-center justify-center gap-2 font-bold">
                  <Plus size={18} /> Add Expertise
                </button>
              </div>
              <div className="space-y-4">
                {expertise.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-6 bg-paper rounded-2xl border border-white/5">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm opacity-60">{item.description}</p>
                    </div>
                    <button onClick={() => handleDelete('expertise', item.id!)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="grid gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="Project Title"
                    className="bg-paper p-4 rounded-xl outline-none text-ink"
                    value={newProject.title}
                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                  />
                  <input
                    placeholder="Image URL"
                    className="bg-paper p-4 rounded-xl outline-none text-ink"
                    value={newProject.imageUrl}
                    onChange={e => setNewProject({ ...newProject, imageUrl: e.target.value })}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="Short Description"
                    className="bg-paper p-4 rounded-xl outline-none text-ink"
                    value={newProject.description}
                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                  />
                  <input
                    placeholder="Tags (comma separated)"
                    className="bg-paper p-4 rounded-xl outline-none text-ink"
                    value={newProject.tags}
                    onChange={e => setNewProject({ ...newProject, tags: e.target.value })}
                  />
                </div>
                <textarea
                  placeholder="Long Description (for detail page)"
                  className="bg-paper p-4 rounded-xl outline-none text-ink w-full"
                  rows={3}
                  value={newProject.longDescription}
                  onChange={e => setNewProject({ ...newProject, longDescription: e.target.value })}
                />
                <button onClick={handleAddProject} className="bg-accent text-black p-4 rounded-xl flex items-center justify-center gap-2 font-bold">
                  <Plus size={18} /> Add Project
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <div key={project.id} className="p-6 bg-paper rounded-2xl relative group border border-white/5">
                    <img src={project.imageUrl} alt="" className="w-full h-32 object-cover rounded-xl mb-4" />
                    <h3 className="font-semibold">{project.title}</h3>
                    <div className="flex gap-2 mt-2">
                      {project.tags?.map(tag => (
                        <span key={tag} className="text-[8px] uppercase tracking-widest bg-card px-2 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleDelete('projects', project.id!)}
                      className="absolute top-4 right-4 bg-card text-red-500 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-12">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                  <h3 className="text-2xl font-serif">Profile Picture Settings</h3>
                  
                  <div className="space-y-4">
                    <label className="typewriter opacity-60 block">Option 1: External URL (Google Drive, etc.)</label>
                    <div className="flex gap-4">
                      <input
                        placeholder="https://drive.google.com/..."
                        className="flex-1 bg-paper p-4 rounded-xl outline-none text-ink"
                        value={profileUrl}
                        onChange={e => setProfileUrl(e.target.value)}
                      />
                      <button 
                        onClick={handleUpdateProfileUrl}
                        className="bg-accent text-black px-8 rounded-xl font-bold hover:bg-accent/80 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                    <p className="text-[10px] opacity-40 italic">Note: For Google Drive, ensure the link is a direct download link or publicly accessible.</p>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-white/5">
                    <div className="flex justify-between items-center">
                      <label className="typewriter opacity-60 block">Option 2: Upload Local File</label>
                      <span className="text-[10px] text-accent/60">Ensure Storage Rules allow writes</span>
                    </div>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploading}
                      />
                      <div className={cn(
                        "w-full p-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all",
                        uploading ? "border-accent/50 bg-accent/5" : "border-white/10 group-hover:border-accent/30 group-hover:bg-white/5"
                      )}>
                        <Plus className={cn("text-accent", uploading && "animate-spin")} size={32} />
                        <span className="typewriter text-sm">
                          {uploading ? "Uploading System..." : "Click or Drag to Upload"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="typewriter text-accent">Current Preview</h3>
                  <div className="aspect-[1/1.618] w-full max-w-xs mx-auto relative rounded-[2rem] overflow-hidden bg-paper border border-white/5 shadow-2xl">
                    <img
                      src={profile?.imageUrl || "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/img_0089_9.jpeg"}
                      alt="Profile Preview"
                      className="w-full h-full object-cover grayscale"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const AnimatedRoutes = ({ isLoggedIn, setIsLoggedIn }: { isLoggedIn: boolean, setIsLoggedIn: (v: boolean) => void }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} className="w-full">
        <Routes location={location}>
          <Route path="/" element={<Portfolio />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/expertise/:id" element={<ExpertiseDetail />} />
          <Route 
            path="/admin" 
            element={
              isLoggedIn ? <AdminDashboard /> : <AdminLogin onLogin={() => setIsLoggedIn(true)} />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <AnimatedRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}
