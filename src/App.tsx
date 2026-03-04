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
    { name: 'Portfolio', href: '/#projects' },
    { name: 'Stack', href: '/#skills' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-1000 ease-in-out border-b",
      scrolled ? "bg-paper/95 backdrop-blur-xl py-4 border-white/5" : "bg-transparent py-8 border-transparent"
    )}>
      <div className="flex items-center justify-between px-8 md:px-16 max-w-[1600px] mx-auto">
        <Link to="/" className="group flex items-center gap-4">
          <div className="w-10 h-10 border border-accent/30 flex items-center justify-center text-accent font-serif text-xl transition-all duration-700 group-hover:bg-accent group-hover:text-black">
            A
          </div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-serif tracking-widest uppercase font-light"
          >
            Arka <span className="luxury-gradient-text italic">Alfatih</span>
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
                  className="nav-item-luxury"
                >
                  {link.name}
                </a>
              ))}
              <Link to="/admin" className="btn-luxury ml-8">
                Inquiry
              </Link>
            </>
          ) : (
            <>
              <Link to="/admin" className="nav-item-luxury">Dashboard</Link>
              <Link to="/" className="btn-luxury ml-8">Exit</Link>
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
                    <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-4xl font-display font-bold hover:text-accent transition-colors">
                      {link.name}
                    </a>
                  ))}
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="typewriter text-accent mt-4">_SYSTEM_ACCESS</Link>
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
    <section className="relative min-h-screen flex items-center justify-center pt-32 px-12 overflow-hidden">
      <div className="max-w-[1440px] w-full grid lg:grid-cols-[1.4fr_1fr] gap-24 items-center">
        <div className="z-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="label-caps mb-6 block">Computer Science @ UI</span>
          </motion.div>

          <h1 className="text-7xl md:text-8xl lg:text-9xl mb-12 leading-[0.85] tracking-tighter font-serif font-light uppercase">
            <motion.span
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              Arka Ananda
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="luxury-gradient-text italic block mt-2"
            >
              Al Fatih
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            className="text-xl md:text-2xl text-ink/40 max-w-xl mb-12 font-sans font-light leading-relaxed"
          >
            Architecting sophisticated digital ecosystems and high-performance microservices. 
            Focused on the intersection of robust engineering and editorial elegance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1 }}
            className="flex flex-wrap gap-8"
          >
            <a href="#projects" className="btn-luxury bg-accent text-black border-none">View Works</a>
            <a href="#contact" className="btn-luxury">Get In Touch</a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[1/1.3] w-full max-w-md mx-auto lg:mx-0"
        >
          <div className="absolute inset-0 border border-accent/10 translate-x-8 translate-y-8 -z-10" />
          <div className="relative w-full h-full overflow-hidden bg-card border border-white/5 p-4">
            <img
              src={profileImage || "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/img_0089_9.jpeg"}
              alt="Professional Portrait"
              className="w-full h-full object-cover grayscale brightness-75 hover:brightness-100 transition-all duration-1000 scale-105 hover:scale-100"
              referrerPolicy="no-referrer"
            />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-12 -left-12 bg-paper/80 backdrop-blur-2xl border border-white/5 p-10 shadow-2xl cursor-pointer hover:border-accent/40 transition-all"
          >
            <ArrowRight className="text-accent" size={32} />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
        <span className="label-caps text-[10px]">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-12 bg-accent"
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
    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    className="mb-24"
  >
    <span className="label-caps mb-4 block">{subtitle}</span>
    <h2 className="text-6xl md:text-8xl font-serif font-light tracking-tight uppercase leading-[0.9]">{title}</h2>
    <div className="w-24 h-[1px] bg-accent/30 mt-8" />
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

  if (loading) return <div className="min-h-screen flex items-center justify-center label-caps opacity-40">Synchronizing...</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center label-caps opacity-40">Entry Not Found</div>;

  return (
    <PageTransition>
      <Navbar />
      <div className="pt-48 pb-32 px-12 max-w-[1600px] mx-auto">
        <Link to="/" className="flex items-center gap-4 label-caps text-accent mb-16 group w-fit">
          <ArrowRight className="rotate-180 group-hover:-translate-x-2 transition-transform" size={18} />
          Back to Portfolio
        </Link>
        
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-32 items-start">
          <div className="space-y-16">
            <h1 className="text-6xl md:text-8xl font-serif font-light uppercase leading-[0.9] tracking-tight">{project.title}</h1>
            <div className="flex flex-wrap gap-6">
              {project.tags?.map(tag => (
                <span key={tag} className="label-caps text-[10px] border border-accent/20 px-8 py-3 text-accent bg-accent/5">
                  {tag}
                </span>
              ))}
            </div>
            <div className="space-y-10 text-ink/50 leading-relaxed text-xl font-sans font-light">
              <p className="text-2xl text-ink/80 italic font-serif">{project.description}</p>
              {project.longDescription && <p>{project.longDescription}</p>}
            </div>
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="btn-luxury mt-12 inline-block bg-accent text-black border-none px-12 py-5">
                Visit Project
              </a>
            )}
          </div>
          <div className="border border-white/5 overflow-hidden shadow-2xl bg-card p-4">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" referrerPolicy="no-referrer" />
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

  if (loading) return <div className="min-h-screen flex items-center justify-center label-caps opacity-40">Accessing Archive...</div>;
  if (!item) return <div className="min-h-screen flex items-center justify-center label-caps opacity-40">Module Not Found</div>;

  return (
    <PageTransition>
      <Navbar />
      <div className="pt-48 pb-32 px-12 max-w-[1000px] mx-auto">
        <Link to="/" className="flex items-center gap-4 label-caps text-accent mb-16 group w-fit">
          <ArrowRight className="rotate-180 group-hover:-translate-x-2 transition-transform" size={18} />
          Back to Core
        </Link>
        <div className="bg-card p-20 border border-white/5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-accent/20" />
          <span className="label-caps text-accent mb-8 block">Core Competency</span>
          <h1 className="text-6xl md:text-8xl font-serif font-light uppercase mb-16 leading-[0.9] tracking-tight">{item.title}</h1>
          <div className="luxury-line mb-16" />
          <div className="space-y-12 text-ink/60 leading-relaxed text-xl font-sans font-light">
            <p className="text-3xl font-serif italic text-accent/80 leading-snug">{item.description}</p>
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
      <section id="role" className="py-40 px-12 max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-32 items-start">
          <div>
            <SectionHeader title="Trajectory" subtitle="01 / Status" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-24"
          >
            <p className="text-4xl md:text-6xl font-serif italic leading-[1.1] text-ink/90 tracking-tight">
              "Computer Science scholar at the University of Indonesia, specializing in high-performance distributed systems and modern microservices."
            </p>
            <div className="grid md:grid-cols-2 gap-16">
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
                  transition={{ delay: idx * 0.1, duration: 1 }}
                  className="group"
                >
                  <div className="flex flex-col gap-8 border-l border-white/5 pl-10 transition-all duration-700 group-hover:border-accent/40">
                    <span className="label-caps opacity-20">0{idx + 1}</span>
                    <div>
                      <h3 className="text-3xl font-serif font-light mb-6 group-hover:text-accent transition-colors">{role.title}</h3>
                      <p className="text-lg opacity-40 leading-relaxed font-sans font-light">{role.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-40 px-12 bg-card/30">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-24 items-end mb-24">
            <SectionHeader title="Capabilities" subtitle="02 / Expertise" />
            <p className="label-caps opacity-40 mb-24 text-right max-w-xs ml-auto">
              High-performance solutions through technical precision.
            </p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/5 border border-white/5">
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
                  transition={{ delay: idx * 0.05, duration: 1 }}
                  className="p-10 bg-paper hover:bg-card transition-all duration-700 group h-full flex flex-col relative overflow-hidden"
                >
                  <span className="font-serif text-4xl italic text-accent/10 group-hover:text-accent/30 transition-colors mb-12">0{idx + 1}</span>
                  <h3 className="text-2xl font-serif font-light uppercase mb-6 group-hover:text-accent transition-all duration-700">{item.title}</h3>
                  <p className="text-sm leading-relaxed opacity-30 group-hover:opacity-60 transition-opacity duration-700 font-sans font-light line-clamp-4">{item.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-40 px-12 max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-24 items-end mb-24">
          <SectionHeader title="Portfolio" subtitle="03 / Projects" />
          <div className="flex gap-6 mb-24 justify-end">
            <div className="w-14 h-14 border border-white/5 flex items-center justify-center opacity-20">
              <ArrowRight className="rotate-180" size={24} />
            </div>
            <div className="w-14 h-14 border border-white/5 flex items-center justify-center hover:border-accent/40 hover:text-accent transition-all cursor-pointer group">
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-16">
          {(projects.length > 0 ? projects : [
            { id: 'p1', title: 'Lumina Microservices', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200', tags: ['Node.js', 'GCP'], link: '#' },
            { id: 'p2', title: 'Aura E-Commerce', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200', tags: ['React', 'TypeScript'], link: '#' },
            { id: 'p3', title: 'Academic Portal', imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200', tags: ['Next.js', 'Figma'], link: '#' },
            { id: 'p4', title: 'Sentinel Security', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200', tags: ['Python', 'AWS'], link: '#' },
            { id: 'p5', title: 'Neural Visualizer', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200', tags: ['TensorFlow', 'WebGL'], link: '#' },
            { id: 'p6', title: 'Quantum Ledger', imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200', tags: ['Rust', 'Blockchain'], link: '#' }
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
                transition={{ delay: idx * 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="overflow-hidden mb-8 relative aspect-[3/4] border border-white/5 group-hover:border-accent/20 transition-all duration-700">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-paper/40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 flex items-center justify-center backdrop-blur-[2px]">
                    <button className="btn-luxury border-none bg-paper/80 backdrop-blur-xl">View Details</button>
                  </div>
                </div>
                <div className="px-2 space-y-4">
                  <h3 className="text-3xl font-serif font-light uppercase group-hover:text-accent transition-colors duration-700">{project.title}</h3>
                  <div className="flex flex-wrap gap-4">
                    {project.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="label-caps text-[8px] opacity-40">
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
      <section id="skills" className="py-40 px-12 bg-card/30 overflow-hidden relative">
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-32 items-start">
            <div>
              <SectionHeader title="Stack" subtitle="04 / Expertise" />
              <p className="label-caps opacity-40 max-w-xs leading-relaxed">
                Engineered for performance, scalability, and maintainability.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-24">
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
                  transition={{ delay: idx * 0.1, duration: 1 }}
                >
                  <h4 className="label-caps text-accent mb-12 border-b border-accent/10 pb-6">{cat.title}</h4>
                  <ul className="space-y-8 font-serif font-light text-3xl uppercase tracking-tight">
                    {cat.items.map(item => (
                      <motion.li
                        key={item}
                        whileHover={{ x: 10, color: "#C5A059" }}
                        className="cursor-default transition-all duration-500 opacity-60 hover:opacity-100"
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
      <section id="contact" className="py-48 px-12 max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="label-caps mb-8 block">Inquiries</span>
            <h2 className="text-7xl md:text-8xl lg:text-9xl font-serif font-light uppercase mb-20 leading-[0.85] tracking-tighter">
              Let's build <br />
              <span className="luxury-gradient-text italic">the future</span>.
            </h2>
            <div className="flex flex-wrap gap-16 mb-24">
              {[
                { icon: Mail, label: "arkaalfatih1758@gmail.com", href: "mailto:arkaalfatih1758@gmail.com" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
                { icon: Github, label: "GitHub", href: "https://github.com/arkanandaa" }
              ].map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  whileHover={{ y: -5 }}
                  className="flex items-center gap-6 group"
                >
                  <div className="w-16 h-16 border border-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-black group-hover:border-accent transition-all duration-700">
                    <link.icon size={24} />
                  </div>
                  <span className="label-caps text-xs group-hover:text-accent transition-colors duration-700">{link.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
          <div className="bg-card p-16 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-accent/20" />
            <h3 className="text-4xl font-serif font-light uppercase mb-12">Inquiry Form</h3>
            <form className="space-y-10">
              <div className="space-y-4">
                <label className="label-caps opacity-40 block">Full Name</label>
                <input type="text" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-colors font-serif text-xl" placeholder="Identify yourself" />
              </div>
              <div className="space-y-4">
                <label className="label-caps opacity-40 block">Email Address</label>
                <input type="email" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-colors font-serif text-xl" placeholder="Communication channel" />
              </div>
              <div className="space-y-4">
                <label className="label-caps opacity-40 block">Message</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-accent transition-colors font-serif text-xl resize-none" placeholder="Project details..." />
              </div>
              <button className="btn-luxury w-full bg-accent text-black mt-12 font-bold">Send Message</button>
            </form>
          </div>
        </div>
        <div className="pt-24 mt-40 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-30">
          <span className="label-caps">© 2026 Arka Ananda Al Fatih</span>
          <div className="flex gap-12">
            <span className="label-caps">Jakarta, Indonesia</span>
            <span className="label-caps">UI Computer Science</span>
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
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card p-16 border border-white/5 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-accent/20" />
        <h1 className="text-4xl font-serif font-light uppercase mb-12 text-center tracking-tight">Vault Access</h1>
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="label-caps opacity-60 block">Identity UID</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 px-0 py-4 focus:border-accent outline-none text-ink font-serif text-xl"
              placeholder="atmin"
            />
          </div>
          <div className="space-y-2">
            <label className="label-caps opacity-60 block">Access Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 px-0 py-4 focus:border-accent outline-none text-ink font-serif text-xl"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-[10px] font-mono text-center uppercase tracking-widest">Error: {error}</p>}
          <button
            type="submit"
            className="btn-luxury w-full bg-accent text-black py-5 font-bold mt-8"
          >
            Authenticate
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
    setNewProject({ title: '', description: '', longDescription: '', imageUrl: '', link: '', tags: '' });
  };

  const handleUpdateProfileUrl = async () => {
    await setDoc(doc(db, 'profile', 'main'), { imageUrl: profileUrl });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on('state_changed', null, (err) => {
        console.error("Upload error:", err);
        setUploading(false);
      }, async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setProfileUrl(url);
        await setDoc(doc(db, 'profile', 'main'), { imageUrl: url });
        setUploading(false);
      });
    } catch (err) {
      console.error("Upload setup error:", err);
      setUploading(false);
    }
  };

  const handleDelete = async (coll: string, id: string) => {
    await deleteDoc(doc(db, coll, id));
  };

  return (
    <div className="min-h-screen bg-paper pt-40 pb-32 px-12">
      <Navbar isAdmin />
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <span className="label-caps text-accent mb-4 block">Management</span>
            <h1 className="text-6xl font-serif font-light uppercase tracking-tight">Executive Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-4">
            {(['roles', 'expertise', 'projects', 'profile'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "label-caps px-8 py-3 border transition-all duration-500",
                  activeTab === tab ? "bg-accent text-black border-accent" : "border-white/5 hover:border-accent/40"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-24">
          {/* Form Section */}
          <div className="bg-card p-12 border border-white/5 h-fit sticky top-40">
            <h2 className="text-2xl font-serif font-light uppercase mb-10 border-b border-white/5 pb-6">Add New {activeTab}</h2>
            
            {activeTab === 'roles' && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="label-caps opacity-40 block">Role Title</label>
                  <input
                    type="text"
                    value={newRole.title}
                    onChange={e => setNewRole({ ...newRole, title: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-accent transition-colors font-serif text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-caps opacity-40 block">Description</label>
                  <textarea
                    value={newRole.description}
                    onChange={e => setNewRole({ ...newRole, description: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-accent transition-colors font-serif text-lg resize-none"
                    rows={3}
                  />
                </div>
                <button onClick={handleAddRole} className="btn-luxury w-full bg-accent text-black font-bold mt-4">Add Role</button>
              </div>
            )}

            {activeTab === 'expertise' && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="label-caps opacity-40 block">Expertise Title</label>
                  <input
                    type="text"
                    value={newExpertise.title}
                    onChange={e => setNewExpertise({ ...newExpertise, title: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-accent transition-colors font-serif text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-caps opacity-40 block">Short Description</label>
                  <textarea
                    value={newExpertise.description}
                    onChange={e => setNewExpertise({ ...newExpertise, description: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-accent transition-colors font-serif text-lg resize-none"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-caps opacity-40 block">Long Description</label>
                  <textarea
                    value={newExpertise.longDescription}
                    onChange={e => setNewExpertise({ ...newExpertise, longDescription: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-accent transition-colors font-serif text-lg resize-none"
                    rows={4}
                  />
                </div>
                <button onClick={handleAddExpertise} className="btn-luxury w-full bg-accent text-black font-bold mt-4">Add Expertise</button>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="label-caps opacity-40 block">Project Title</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-accent transition-colors font-serif text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-caps opacity-40 block">Image URL</label>
                  <input
                    type="text"
                    value={newProject.imageUrl}
                    onChange={e => setNewProject({ ...newProject, imageUrl: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-accent transition-colors font-serif text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-caps opacity-40 block">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newProject.tags}
                    onChange={e => setNewProject({ ...newProject, tags: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-accent transition-colors font-serif text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-caps opacity-40 block">Short Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-accent transition-colors font-serif text-lg resize-none"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-caps opacity-40 block">Long Description</label>
                  <textarea
                    value={newProject.longDescription}
                    onChange={e => setNewProject({ ...newProject, longDescription: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-accent transition-colors font-serif text-lg resize-none"
                    rows={3}
                  />
                </div>
                <button onClick={handleAddProject} className="btn-luxury w-full bg-accent text-black font-bold mt-4">Add Project</button>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="label-caps opacity-40 block">Profile Image URL</label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={profileUrl}
                      onChange={e => setProfileUrl(e.target.value)}
                      className="flex-1 bg-transparent border-b border-white/10 py-3 outline-none focus:border-accent transition-colors font-serif text-lg"
                    />
                    <button onClick={handleUpdateProfileUrl} className="btn-luxury px-6 py-2">Update</button>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="label-caps opacity-40 block">Upload New Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <div className="border border-dashed border-white/10 p-12 text-center hover:border-accent/40 transition-colors">
                      <span className="label-caps opacity-40">{uploading ? 'Uploading...' : 'Drop or Click to Upload'}</span>
                    </div>
                  </div>
                </div>
                {profileUrl && (
                  <div className="aspect-square border border-white/5 p-2 bg-paper">
                    <img src={profileUrl} alt="Preview" className="w-full h-full object-cover grayscale" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* List Section */}
          <div className="space-y-6">
            {activeTab === 'roles' && roles.map(role => (
              <div key={role.id} className="bg-card p-10 border border-white/5 flex justify-between items-start group hover:border-accent/20 transition-all duration-700">
                <div>
                  <h3 className="text-2xl font-serif font-light uppercase mb-4 group-hover:text-accent transition-colors">{role.title}</h3>
                  <p className="text-ink/40 font-sans font-light leading-relaxed">{role.description}</p>
                </div>
                <button onClick={() => handleDelete('roles', role.id!)} className="p-4 text-ink/20 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}

            {activeTab === 'expertise' && expertise.map(item => (
              <div key={item.id} className="bg-card p-10 border border-white/5 flex justify-between items-start group hover:border-accent/20 transition-all duration-700">
                <div>
                  <h3 className="text-2xl font-serif font-light uppercase mb-4 group-hover:text-accent transition-colors">{item.title}</h3>
                  <p className="text-ink/40 font-sans font-light leading-relaxed line-clamp-2">{item.description}</p>
                </div>
                <button onClick={() => handleDelete('expertise', item.id!)} className="p-4 text-ink/20 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}

            {activeTab === 'projects' && projects.map(project => (
              <div key={project.id} className="bg-card p-10 border border-white/5 flex gap-10 items-center group hover:border-accent/20 transition-all duration-700">
                <div className="w-32 h-32 bg-paper border border-white/5 p-2 shrink-0">
                  <img src={project.imageUrl} alt="" className="w-full h-full object-cover grayscale" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-serif font-light uppercase mb-4 group-hover:text-accent transition-colors">{project.title}</h3>
                  <p className="text-ink/40 font-sans font-light leading-relaxed line-clamp-1">{project.description}</p>
                </div>
                <button onClick={() => handleDelete('projects', project.id!)} className="p-4 text-ink/20 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
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
