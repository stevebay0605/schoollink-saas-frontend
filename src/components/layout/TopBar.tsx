import React, { useState } from 'react';
import { Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuthStore } from '../../store/useAuthStore';
import type { UserRole } from '../../types';

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

const TopBar: React.FC = () => {
  const { user, school, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="h-14 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 flex-shrink-0 z-10">

      {/* ── Gauche : fil d'info école ──────────── */}
      <div className="flex items-center gap-2 min-w-0">
        {school && (
          <>
            {/* Badge plan */}
            <span
              className={clsx(
                'hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider',
                school.plan === 'enterprise' && 'bg-[#0d3520]/10 text-[#0d3520]',
                school.plan === 'premium'    && 'bg-[#c9a82c]/15 text-[#8a6c10]',
                school.plan === 'basic'      && 'bg-slate-100 text-slate-500',
              )}
            >
              {school.plan}
            </span>

            <span className="text-sm font-semibold text-[#1e293b] truncate max-w-[220px]">
              {school.name}
            </span>

            <span className="hidden md:inline text-xs text-[#94a3b8] font-mono">
              #{school.code}
            </span>
          </>
        )}
      </div>

      {/* ── Droite : actions ───────────────────── */}
      <div className="flex items-center gap-1">

        {/* Cloche notifications */}
        <button
          title="Notifications"
          className="relative p-2 rounded-lg text-[#64748b] hover:bg-slate-100 hover:text-[#1e293b] transition-colors"
        >
          <Bell size={18} />
          {/* Pastille — à alimenter dynamiquement côté backend */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c9a82c] ring-2 ring-white" />
        </button>

        {/* Séparateur */}
        <div className="w-px h-6 bg-[#e2e8f0] mx-1" />

        {/* Menu utilisateur */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 pl-2 pr-1 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#1a6b3c] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : getInitials(user.name)
              }
            </div>

            {/* Nom + rôle */}
            <div className="hidden md:flex flex-col items-start min-w-0">
              <span className="text-sm font-semibold text-[#1e293b] leading-tight truncate max-w-[120px]">
                {user.name}
              </span>
              <span className="text-[11px] text-[#94a3b8] leading-tight">
                {roleLabel[user.role]}
              </span>
            </div>

            <ChevronDown
              size={14}
              className={clsx(
                'text-[#94a3b8] transition-transform duration-200 hidden md:block',
                menuOpen && 'rotate-180',
              )}
            />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <>
              {/* Overlay invisible pour fermer */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />

              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl border border-[#e2e8f0] shadow-lg z-20 py-1 animate-fade-in">
                {/* Infos utilisateur */}
                <div className="px-4 py-2.5 border-b border-[#f1f5f9]">
                  <div className="text-sm font-semibold text-[#1e293b] truncate">{user.name}</div>
                  <div className="text-xs text-[#94a3b8] truncate">{user.email}</div>
                </div>

                {/* Actions */}
                <div className="py-1">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#475569] hover:bg-slate-50 hover:text-[#1e293b] transition-colors"
                  >
                    <User size={15} />
                    Mon profil
                  </button>

                  <div className="my-1 h-px bg-[#f1f5f9] mx-3" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Déconnexion
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
