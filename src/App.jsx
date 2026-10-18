import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, FileText, Clock3, ChartNoAxesColumn, Users, Settings,
  CircleHelp, Search, Bell, ChevronDown, Plus, Eye, Pencil, CheckCircle2,
  Hourglass, CircleAlert, X, Menu, GraduationCap, Filter, Trash2, CalendarDays,
  MessageSquareText, ArrowUpRight, LogOut, Download
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from "recharts";

const INITIAL = [
  { id: "REC-2026-012", student: "Amine Ben Salem", email: "amine.bensalem@sesame.com.tn", subject: "Problème de connexion au Wi-Fi", category: "Informatique", date: "2026-10-16", status: "En cours", priority: "Élevée", description: "Je n'arrive pas à me connecter au réseau Wi-Fi du campus depuis ce matin." },
  { id: "REC-2026-011", student: "Rawen Trabelsi", email: "rawen.trabelsi@sesame.com.tn", subject: "Demande de relevé de notes", category: "Scolarité", date: "2026-10-12", status: "En cours", priority: "Normale", description: "J'aurais besoin d'une copie de mon relevé de notes pour mon dossier." },
  { id: "REC-2026-010", student: "Youssef Khelifi", email: "youssef.khelifi@sesame.com.tn", subject: "Accès à la bibliothèque numérique", category: "Informatique", date: "2026-09-30", status: "En attente", priority: "Normale", description: "Mon compte ne me permet plus d'accéder aux ressources numériques." },
  { id: "REC-2026-009", student: "Sarra Mansour", email: "sarra.mansour@sesame.com.tn", subject: "Erreur sur l'emploi du temps", category: "Scolarité", date: "2026-09-27", status: "Résolue", priority: "Normale", description: "Un cours apparaît à deux horaires différents sur mon emploi du temps." },
  { id: "REC-2026-008", student: "Salma Hkiri", email: "Salma.hkiri@sesame.com.tn", subject: "Problème de paiement", category: "Finance", date: "2026-09-24", status: "Résolue", priority: "Élevée", description: "Le paiement est confirmé mais le portail affiche toujours un impayé." },
  { id: "REC-2026-007", student: "Fares Gharbi", email: "fares.gharbi@sesame.com.tn", subject: "Carte étudiant non reçue", category: "Administration", date: "2026-09-20", status: "Résolue", priority: "Faible", description: "Je n'ai pas encore reçu ma carte étudiant." },
  { id: "REC-2026-006", student: "Ines Chaari", email: "ines.chaari@sesame.com.tn", subject: "Demande d'attestation", category: "Scolarité", date: "2026-09-18", status: "Résolue", priority: "Normale", description: "Demande d'attestation de présence." },
  { id: "REC-2026-005", student: "Ahmed Saidi", email: "ahmed.saidi@sesame.com.tn", subject: "Accès au compte étudiant", category: "Informatique", date: "2026-09-15", status: "Résolue", priority: "Normale", description: "Réinitialisation du mot de passe du compte étudiant." },
  { id: "REC-2026-004", student: "Rania Ben Amor", email: "rania.benamor@sesame.com.tn", subject: "Demande de changement de groupe", category: "Scolarité", date: "2026-09-12", status: "Résolue", priority: "Normale", description: "Demande de changement de groupe de TD." },
  { id: "REC-2026-003", student: "Omar Ayari", email: "omar.ayari@sesame.com.tn", subject: "Matériel de salle défectueux", category: "Infrastructure", date: "2026-09-08", status: "Résolue", priority: "Faible", description: "Le vidéoprojecteur de la salle ne fonctionne pas correctement." },
  { id: "REC-2026-002", student: "Lina Haddad", email: "lina.haddad@sesame.com.tn", subject: "Question sur les absences", category: "Administration", date: "2026-09-05", status: "Résolue", priority: "Normale", description: "Question concernant le décompte des absences." },
  { id: "REC-2026-001", student: "Tasnim Brari", email: "tasnim.brari@sesame.com.tn", subject: "Accès à la plateforme pédagogique", category: "Informatique", date: "2026-09-01", status: "Résolue", priority: "Normale", description: "Impossible de se connecter à la plateforme pédagogique." }
];

const STATUS = ["Tous les statuts", "En cours", "En attente", "Résolue", "Fermée"];
const CATEGORIES = ["Informatique", "Scolarité", "Administration", "Finance", "Infrastructure", "Autre"];
const EMPTY_FORM = { student: "", email: "", subject: "", category: "Scolarité", status: "En cours", priority: "Normale", description: "" };

function loadComplaints() {
  try {
    const saved = localStorage.getItem("sesame-reclamations-v1");
    return saved ? JSON.parse(saved) : INITIAL;
  } catch { return INITIAL; }
}
function formatDate(date) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date + "T12:00:00"));
}
function StatusBadge({ status }) {
  const className = status === "Résolue" || status === "Fermée" ? "resolved" : status === "En attente" ? "waiting" : "progress";
  return <span className={`status ${className}`}><span className="status-dot" />{status}</span>;
}
function Modal({ title, onClose, children, wide = false }) {
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className={`modal ${wide ? "modal-wide" : ""}`}>
      <div className="modal-head"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Fermer"><X size={19}/></button></div>
      {children}
    </section>
  </div>;
}

export default function App() {
  const [complaints, setComplaints] = useState(loadComplaints);
  const [page, setPage] = useState("Tableau de bord");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous les statuts");
  const [categoryFilter, setCategoryFilter] = useState("Toutes les catégories");
  const [periodFilter, setPeriodFilter] = useState("Toutes les dates");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => { localStorage.setItem("sesame-reclamations-v1", JSON.stringify(complaints)); }, [complaints]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  const stats = useMemo(() => ({
    total: complaints.length,
    progress: complaints.filter(c => c.status === "En cours").length,
    waiting: complaints.filter(c => c.status === "En attente").length,
    resolved: complaints.filter(c => c.status === "Résolue" || c.status === "Fermée").length
  }), [complaints]);

  const filtered = useMemo(() => complaints.filter(c => {
    const text = `${c.id} ${c.subject} ${c.student} ${c.email} ${c.category}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesStatus = statusFilter === "Tous les statuts" || c.status === statusFilter;
    const matchesCategory = categoryFilter === "Toutes les catégories" || c.category === categoryFilter;
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - (periodFilter === "7 derniers jours" ? 7 : 30));
    const matchesPeriod = periodFilter === "Toutes les dates" || new Date(c.date + "T12:00:00") >= cutoff;
    const matchesPage = page !== "Historique" || c.status === "Résolue" || c.status === "Fermée";
    return matchesQuery && matchesStatus && matchesCategory && matchesPeriod && matchesPage;
  }).sort((a, b) => b.date.localeCompare(a.date)), [complaints, query, statusFilter, categoryFilter, periodFilter, page]);

  const pieData = [
    { name: "Résolues", value: stats.resolved, color: "#20b8b0" },
    { name: "En cours", value: stats.progress, color: "#2864ed" },
    { name: "En attente", value: stats.waiting, color: "#f5a000" }
  ];
  const openCreate = () => { setForm(EMPTY_FORM); setShowCreate(true); };
  const saveComplaint = (e) => {
    e.preventDefault();
    if (!form.student.trim() || !form.email.trim() || !form.subject.trim()) {
      setNotice("Veuillez remplir le nom, l'e-mail et le sujet."); return;
    }
    if (editing) {
      setComplaints(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c));
      setNotice("Réclamation mise à jour.");
    } else {
      const next = String(Math.max(0, ...complaints.map(c => Number(c.id.split("-").at(-1)) || 0)) + 1).padStart(3, "0");
      setComplaints(prev => [{ ...form, id: `REC-2026-${next}`, date: new Date().toISOString().slice(0, 10) }, ...prev]);
      setNotice("Nouvelle réclamation ajoutée.");
    }
    setShowCreate(false); setEditing(null);
  };
  const startEdit = (c) => { setSelected(null); setEditing(c); setForm({ student: c.student, email: c.email, subject: c.subject, category: c.category, status: c.status, priority: c.priority, description: c.description }); };
  const changeStatus = (id, status) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
    setNotice("Statut de la réclamation mis à jour.");
  };
  const navItems = [
    { name: "Tableau de bord", icon: LayoutDashboard },
    { name: "Toutes les réclamations", icon: FileText },
    { name: "Historique", icon: Clock3 },
    { name: "Statistiques", icon: ChartNoAxesColumn },
    { name: "Étudiants", icon: Users },
    { name: "Paramètres", icon: Settings }
  ];
  const goTo = (name) => { setPage(name); setSidebarOpen(false); };
  const exportCSV = () => {
    const rows = [["Référence", "Étudiant", "Email", "Sujet", "Catégorie", "Date", "Statut", "Priorité"], ...filtered.map(c => [c.id, c.student, c.email, c.subject, c.category, c.date, c.status, c.priority])];
    const csv = rows.map(row => row.map(value => `"${String(value ?? "").replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = "reclamations-sesame.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="brand">
        <img src="/sesame-logo.png" alt="SESAME — School of High-Tech, AI & Management" className="brand-logo" />
      </div>
      <div className="admin-label">ESPACE ADMINISTRATEUR</div>
      <nav className="nav-list">
        {navItems.map(({ name, icon: Icon }) => <button key={name} onClick={() => goTo(name)} className={`nav-item ${page === name ? "active" : ""}`}><Icon size={19}/><span>{name}</span>{name === "Toutes les réclamations" && <span className="nav-count">{complaints.length}</span>}</button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="support-card"><div className="support-icon"><CircleHelp size={19}/></div><strong>Besoin d'aide ?</strong><p>Consultez le guide de gestion des réclamations.</p><button onClick={() => setNotice("Le guide administrateur sera bientôt disponible.")}>Consulter le guide <ArrowUpRight size={14}/></button></div>
        <div className="sidebar-slogan"><span/>Ensemble pour votre réussite</div>
      </div>
    </aside>

    {sidebarOpen && <button className="mobile-scrim" onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu"/>}
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu icon-button" onClick={() => setSidebarOpen(true)} aria-label="Ouvrir le menu"><Menu/></button>
        <div className="top-search"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher une réclamation, un étudiant..."/><kbd>⌘ K</kbd></div>
        <div className="topbar-right"><button className="bell icon-button" onClick={() => setNotice(`${stats.progress + stats.waiting} réclamation(s) nécessitent une attention.`)} aria-label="Notifications"><Bell size={20}/><i>{stats.progress + stats.waiting}</i></button><div className="profile-avatar">AD</div><div className="profile-copy"><strong>Administrateur</strong><span>Gestion des réclamations</span></div><ChevronDown size={16} className="muted"/></div>
      </header>

      <div className="content">
        <div className="page-heading">
          <div><div className="eyebrow"><span/> ESPACE DE GESTION</div><h1>{page}</h1><p>Gérez les demandes des étudiants et suivez leur traitement en temps réel.</p></div>
          <button className="primary-button" onClick={openCreate}><Plus size={18}/> Nouvelle réclamation</button>
        </div>

        <section className="stats-grid">
          <StatCard title="Total des réclamations" value={stats.total} subtitle="Toutes les demandes enregistrées" icon={FileText} tone="blue"/>
          <StatCard title="En cours" value={stats.progress} subtitle={`${stats.total ? Math.round(stats.progress / stats.total * 100) : 0}% du total`} icon={Clock3} tone="blue"/>
          <StatCard title="En attente" value={stats.waiting} subtitle="Nécessitent un suivi" icon={Hourglass} tone="orange"/>
          <StatCard title="Résolues / fermées" value={stats.resolved} subtitle={`${stats.total ? Math.round(stats.resolved / stats.total * 100) : 0}% du total`} icon={CheckCircle2} tone="teal"/>
        </section>

        {page === "Statistiques" ? <section className="analytics-grid">
          <div className="panel chart-panel"><PanelTitle icon={ChartNoAxesColumn} title="Réclamations par statut" subtitle="Répartition de toutes les demandes"/><div className="donut-wrap"><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={76} outerRadius={108} paddingAngle={3} stroke="none">{pieData.map(d => <Cell key={d.name} fill={d.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{stats.total}</strong><span>au total</span></div></div><div className="legend">{pieData.map(d => <div key={d.name}><span style={{background:d.color}}/>{d.name}<strong>{d.value}</strong></div>)}</div></div>
          <div className="panel category-panel"><PanelTitle icon={FileText} title="Vue d'ensemble" subtitle="Indicateurs de traitement"/>{[["Taux de résolution", stats.total ? Math.round(stats.resolved/stats.total*100) : 0, "#20b8b0"],["Demandes en cours", stats.total ? Math.round(stats.progress/stats.total*100) : 0, "#2864ed"],["Demandes en attente", stats.total ? Math.round(stats.waiting/stats.total*100) : 0, "#f5a000"]].map(([label,value,color])=><div className="progress-row" key={label}><div><span>{label}</span><strong>{value}%</strong></div><div className="progress-track"><span style={{width:`${value}%`,background:color}}/></div></div>)}</div>
        </section> : page === "Étudiants" ? <section className="panel"><PanelTitle icon={Users} title="Étudiants concernés" subtitle="Étudiants ayant envoyé au moins une réclamation"/><div className="student-grid">{[...new Map(complaints.map(c=>[c.email,c])).values()].map(c=><div className="student-card" key={c.email}><div className="student-avatar">{c.student.split(" ").map(n=>n[0]).slice(0,2).join("")}</div><div><strong>{c.student}</strong><span>{c.email}</span><small>{complaints.filter(x=>x.email===c.email).length} réclamation(s)</small></div></div>)}</div></section> : page === "Paramètres" ? <section className="panel settings-panel"><PanelTitle icon={Settings} title="Paramètres de l'application" subtitle="Configuration de démonstration"/><div className="settings-row"><div><strong>Stockage local activé</strong><p>Les modifications sont enregistrées dans ce navigateur.</p></div><span className="settings-tag">Actif</span></div><div className="settings-row"><div><strong>Connexion à une base de données</strong><p>Le projet est prêt à être relié à une API lorsque le backend sera créé.</p></div><span className="settings-tag pending">À configurer</span></div><div className="settings-row"><div><strong>Exporter les données</strong><p>Téléchargez la liste actuellement filtrée au format CSV.</p></div><button className="secondary-button" onClick={exportCSV}><Download size={16}/> Exporter CSV</button></div><div className="settings-row"><div><strong>Réinitialiser les données de démonstration</strong><p>Remplace les données locales par les exemples de départ.</p></div><button className="danger-button" onClick={() => { if (confirm("Réinitialiser toutes les données de démonstration ?")) { setComplaints(INITIAL); setNotice("Données de démonstration réinitialisées."); } }}><Trash2 size={16}/> Réinitialiser</button></div></section> : <section className="panel table-panel">
          <div className="panel-heading"><PanelTitle icon={page === "Historique" ? Clock3 : FileText} title={page === "Historique" ? "Historique des réclamations clôturées" : "Toutes les réclamations"} subtitle={page === "Historique" ? "Consultez les demandes résolues ou fermées" : "Recherchez, filtrez et traitez les demandes des étudiants"}/><button className="secondary-button export-button" onClick={exportCSV}><Download size={16}/> Exporter</button></div>
          <div className="filters">
            <label className="filter-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Référence, sujet ou étudiant..."/>{query && <button onClick={()=>setQuery("")} aria-label="Effacer"><X size={15}/></button>}</label>
            <label className="select-wrap"><Filter size={16}/><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>{STATUS.map(s=><option key={s}>{s}</option>)}</select></label>
            <label className="select-wrap"><select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}><option>Toutes les catégories</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label>
            <label className="select-wrap"><CalendarDays size={16}/><select value={periodFilter} onChange={e=>setPeriodFilter(e.target.value)}><option>Toutes les dates</option><option>7 derniers jours</option><option>30 derniers jours</option></select></label>
          </div>
          <div className="table-scroll"><table><thead><tr><th>Référence</th><th>Étudiant</th><th>Sujet</th><th>Date</th><th>Priorité</th><th>Statut</th><th>Actions</th></tr></thead><tbody>
            {filtered.map(c=><tr key={c.id}><td><span className="reference">{c.id}</span></td><td><div className="table-student"><span className="mini-avatar">{c.student.split(" ").map(n=>n[0]).slice(0,2).join("")}</span><div><strong>{c.student}</strong><small>{c.email}</small></div></div></td><td><div className="subject-cell"><strong>{c.subject}</strong><small>{c.category}</small></div></td><td className="date-cell">{formatDate(c.date)}</td><td><span className={`priority priority-${c.priority.toLowerCase()}`}>{c.priority}</span></td><td><StatusBadge status={c.status}/></td><td><div className="actions"><button className="action-button" title="Consulter" onClick={()=>setSelected(c)}><Eye size={16}/></button><button className="action-button" title="Modifier" onClick={()=>startEdit(c)}><Pencil size={15}/></button></div></td></tr>)}
            {!filtered.length && <tr><td colSpan="7"><div className="empty-state"><Search size={27}/><strong>Aucune réclamation trouvée</strong><span>Modifiez votre recherche ou vos filtres.</span><button className="text-button" onClick={()=>{setQuery("");setStatusFilter(STATUS[0]);setCategoryFilter("Toutes les catégories");setPeriodFilter("Toutes les dates");}}>Réinitialiser les filtres</button></div></td></tr>}
          </tbody></table></div>
          <div className="table-footer"><span>{filtered.length} résultat(s) sur {complaints.length} réclamation(s)</span><span><span className="live-dot"/> Données à jour</span></div>
        </section>}

        {page !== "Statistiques" && page !== "Étudiants" && page !== "Paramètres" && <section className="bottom-grid">
          <div className="panel chart-panel"><PanelTitle icon={ChartNoAxesColumn} title="Réclamations par statut" subtitle="Répartition des demandes"/><div className="donut-wrap small-donut"><ResponsiveContainer width="100%" height={205}><PieChart><Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={56} outerRadius={79} paddingAngle={3} stroke="none">{pieData.map(d=><Cell key={d.name} fill={d.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="donut-center small-center"><strong>{stats.total}</strong><span>au total</span></div></div><div className="legend compact-legend">{pieData.map(d=><div key={d.name}><span style={{background:d.color}}/>{d.name}<strong>{d.value}</strong></div>)}</div></div>
          <div className="panel attention-panel"><PanelTitle icon={CircleAlert} title="À traiter en priorité" subtitle="Demandes ouvertes à surveiller"/>{complaints.filter(c=>c.status==="En cours"||c.status==="En attente").slice(0,4).map(c=><button className="attention-item" key={c.id} onClick={()=>setSelected(c)}><span className={`attention-icon ${c.status==="En attente"?"orange":""}`}>{c.status==="En attente"?<Hourglass size={17}/>:<MessageSquareText size={17}/>}</span><span className="attention-copy"><strong>{c.subject}</strong><small>{c.student} · {c.id}</small></span><ChevronDown size={16} className="attention-chevron"/></button>)}{!stats.progress&&!stats.waiting&&<p className="all-clear">Toutes les réclamations sont traitées. Bravo !</p>}</div>
        </section>}
        <footer className="footer"><span>© 2026 SESAME · Administration</span><span>Portail de gestion des réclamations <span className="live-dot"/></span></footer>
      </div>
    </main>

    {(showCreate || editing) && <Modal title={editing ? "Modifier la réclamation" : "Nouvelle réclamation"} onClose={()=>{setShowCreate(false);setEditing(null);}} wide><form className="complaint-form" onSubmit={saveComplaint}>
      <div className="form-grid"><label>Nom complet de l'étudiant *<input value={form.student} onChange={e=>setForm({...form,student:e.target.value})} placeholder="Ex. Amine Ben Salem" required/></label><label>Adresse e-mail *<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="etudiant@sesame.com.tn" required/></label><label>Sujet de la réclamation *<input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Résumez la demande" required/></label><label>Catégorie<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label><label>Statut<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{STATUS.slice(1).map(s=><option key={s}>{s}</option>)}</select></label><label>Priorité<select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{["Faible","Normale","Élevée"].map(s=><option key={s}>{s}</option>)}</select></label><label className="full-field">Description<textarea rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Détaillez la réclamation..."/></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>{setShowCreate(false);setEditing(null);}}>Annuler</button><button type="submit" className="primary-button"><CheckCircle2 size={17}/>{editing?"Enregistrer les modifications":"Créer la réclamation"}</button></div>
    </form></Modal>}

    {selected && <Modal title="Détail de la réclamation" onClose={()=>setSelected(null)} wide><div className="detail-content"><div className="detail-top"><div><span className="reference">{selected.id}</span><h3>{selected.subject}</h3><p>Créée le {formatDate(selected.date)} · {selected.category}</p></div><StatusBadge status={selected.status}/></div><div className="detail-grid"><div><span>Étudiant</span><strong>{selected.student}</strong></div><div><span>Adresse e-mail</span><strong>{selected.email}</strong></div><div><span>Priorité</span><strong>{selected.priority}</strong></div><div><span>Date de création</span><strong>{formatDate(selected.date)}</strong></div></div><div className="description-box"><strong>Description</strong><p>{selected.description || "Aucune description fournie."}</p></div><div className="status-update"><label>Mettre à jour le statut<select value={selected.status} onChange={e=>changeStatus(selected.id,e.target.value)}>{STATUS.slice(1).map(s=><option key={s}>{s}</option>)}</select></label><button className="secondary-button" onClick={()=>startEdit(selected)}><Pencil size={16}/> Modifier les informations</button></div></div></Modal>}

    {notice && <div className="toast"><CheckCircle2 size={18}/>{notice}<button onClick={()=>setNotice("")} aria-label="Fermer"><X size={15}/></button></div>}
  </div>;
}

function StatCard({ title, value, subtitle, icon: Icon, tone }) {
  return <article className={`stat-card ${tone}`}><div className="stat-icon"><Icon size={21}/></div><div className="stat-copy"><span>{title}</span><strong>{value}</strong><small>{subtitle}</small></div><div className="stat-decoration"><Icon size={45}/></div></article>;
}
function PanelTitle({ icon: Icon, title, subtitle }) {
  return <div className="panel-title"><div className="panel-title-icon"><Icon size={19}/></div><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div>;
}