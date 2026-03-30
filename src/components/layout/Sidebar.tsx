import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, ClipboardList,
  CreditCard, ChevronLeft, ChevronRight, School,
  BookMarked, PenTool, BarChart3, Home, UserCheck,
  Building2, LogOut, Settings,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import type { UserRole } from '../../types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navByRole: Record<UserRole, NavItem[]> = {
  school_admin: [
    { label: 'Tableau de bord',  href: '/dashboard',   icon: <LayoutDashboard size={18} /> },
    { label: 'Élèves',           href: '/students',    icon: <GraduationCap size={18} /> },
    { label: 'Enseignants',      href: '/teachers',    icon: <Users size={18} /> },
    { label: 'Classes',          href: '/classrooms',  icon: <School size={18} /> },
    { label: 'Matières',         href: '/subjects',    icon: <BookOpen size={18} /> },
    { label: 'Paiements',        href: '/payments',    icon: <CreditCard size={18} /> },
    { label: 'Utilisateurs',     href: '/users',       icon: <Settings size={18} /> },
  ],
  teacher: [
    { label: 'Mon tableau de bord', href: '/teacher/dashboard',   icon: <LayoutDashboard size={18} /> },
    { label: 'Mes cours',           href: '/teacher/courses',     icon: <BookMarked size={18} /> },
    { label: 'Devoirs',             href: '/teacher/assignments', icon: <ClipboardList size={18} /> },
    { label: 'Notes',               href: '/teacher/grades',      icon: <PenTool size={18} /> },
    { label: 'Présences',           href: '/teacher/attendance',  icon: <UserCheck size={18} /> },
  ],
  student: [
    { label: 'Mon tableau de bord', href: '/student/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Mes cours',           href: '/student/courses',   icon: <BookMarked size={18} /> },
    { label: 'Mon bulletin',        href: '/student/grades',    icon: <BarChart3 size={18} /> },
    { label: 'Mes paiements',       href: '/student/payments',  icon: <CreditCard size={18} /> },
  ],
  parent: [
    { label: 'Tableau de bord', href: '/parent/dashboard', icon: <Home size={18} /> },
    { label: 'Mes enfants',     href: '/parent/children',  icon: <Users size={18} /> },
  ],
  super_admin: [
    { label: 'Toutes les écoles', href: '/admin/schools', icon: <Building2 size={18} /> },
  ],
};

const roleLabel: Record<UserRole, string> = {
  school_admin: 'Administration',
  teacher:      'Enseignant',
  student:      'Élève',
  parent:       'Parent',
  super_admin:  'Super Admin',
};

/** Initiales à partir du nom complet */
const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, school, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  const navItems = navByRole[user.role] ?? [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={clsx(
        'relative flex flex-col h-screen flex-shrink-0 select-none',
        'bg-[#0d3520] text-white transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* ── Logo ────────────────────────────────── */}
      <div
        className={clsx(
          'flex items-center border-b border-[#1a6b3c]/30 flex-shrink-0',
          collapsed ? 'px-3 py-4 justify-center' : 'px-5 py-4 gap-3',
        )}
      >
        {/* Icône */}
        <div className="w-8 h-8 rounded-lg bg-[#c9a82c] flex items-center justify-center flex-shrink-0 shadow-md">
          <GraduationCap size={17} className="text-white" />
        </div>

        {/* Texte */}
        {!collapsed && (
          <div className="min-w-0">
            <div
              className="font-bold text-[1.2rem] leading-none text-white tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              SchoolLink
            </div>
            <div className="text-[10px] text-[#c9a82c] font-medium tracking-widest mt-0.5 truncate uppercase">
              {school?.name || roleLabel[user.role]}
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation ──────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center gap-3 rounded-lg transition-all duration-150',
                    collapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5',
                    isActive
                      ? 'bg-[#1a6b3c] text-white shadow-sm'
                      : 'text-white/60 hover:bg-[#1a6b3c]/40 hover:text-white',
                  )
                }
              >
                {/* Icône */}
                <span className="flex-shrink-0 transition-transform duration-150 group-hover:scale-110">
                  {item.icon}
                </span>

                {/* Label */}
                {!collapsed && (
                  <span className="text-sm font-medium leading-none truncate">
                    {item.label}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Section utilisateur ─────────────────── */}
      <div
        className={clsx(
          'border-t border-[#1a6b3c]/30 p-3 flex-shrink-0',
          collapsed && 'flex justify-center',
        )}
      >
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#1a6b3c] ring-2 ring-[#1a6b3c]/60 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                : getInitials(user.name)
              }
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate leading-tight">
                {user.name}
              </div>
              <div className="text-[11px] text-white/45 truncate leading-tight">
                {roleLabel[user.role]}
              </div>
            </div>

            {/* Bouton déconnexion */}
            <button
              onClick={handleLogout}
              title="Déconnexion"
              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            title="Déconnexion"
            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>

      {/* ── Bouton collapse ─────────────────────── */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        title={collapsed ? 'Déplier la barre' : 'Réduire la barre'}
        className={clsx(
          'absolute -right-3 top-[4.5rem] z-10',
          'w-6 h-6 rounded-full flex items-center justify-center',
          'bg-[#1a6b3c] border border-[#a8d5bc] text-white shadow-md',
          'hover:bg-[#175e34] transition-colors duration-150',
        )}
      >
        {collapsed
          ? <ChevronRight size={12} strokeWidth={2.5} />
          : <ChevronLeft  size={12} strokeWidth={2.5} />
        }
      </button>
    </aside>
  );
};

export default Sidebar;
