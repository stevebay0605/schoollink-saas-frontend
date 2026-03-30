import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/useAuthStore';
import type { LoginForm } from '../../types';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
});

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const { token, user } = res.data;
      setAuth(user, token);
      toast.success(`Bienvenue, ${user.name} !`);

      switch (user.role) {
        case 'super_admin':
          navigate('/admin/schools', { replace: true });
          break;
        case 'school_admin':
          navigate('/dashboard', { replace: true });
          break;
        case 'teacher':
          navigate('/teacher/dashboard', { replace: true });
          break;
        case 'student':
          navigate('/student/dashboard', { replace: true });
          break;
        case 'parent':
          navigate('/parent/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Panneau gauche — illustration ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f3a20] flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#1a6b3c]/30 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#c9a82c]/20 translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-[#1a6b3c]/15 translate-x-1/2 -translate-y-1/2" />
        {/* Grille de points décorative */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 text-center max-w-sm">
          {/* Logo */}
          <div className="w-20 h-20 rounded-2xl bg-[#c9a82c] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/30">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h1
            className="text-5xl font-bold text-white mb-2 tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            SchoolLink
          </h1>
          <p className="text-[#c9a82c] text-lg font-medium mb-10 tracking-wide">
            Gestion scolaire intelligente
          </p>

          {/* Feature list */}
          <div className="space-y-4 text-left">
            {[
              'Gestion des élèves et enseignants',
              'Suivi des notes et présences',
              'Paiements et statistiques',
              'Multi-tenant et sécurisé',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-[#c9a82c] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* Bandeau bas */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} SchoolLink · Tous droits réservés
            </p>
          </div>
        </div>
      </div>

      {/* ── Panneau droit — formulaire ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-[#f8fafc]">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo mobile uniquement */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#1a6b3c] flex items-center justify-center shadow">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span
              className="text-2xl font-bold text-[#1e293b]"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              SchoolLink
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-8">
            {/* En-tête formulaire */}
            <h2
              className="text-3xl font-bold text-[#1e293b] mb-1"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Connexion
            </h2>
            <p className="text-[#64748b] text-sm mb-8">
              Connectez-vous à votre espace SchoolLink
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    placeholder="votre@email.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] focus:border-[#1a6b3c] bg-[#f8fafc] transition-shadow"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium text-[#1e293b] mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] focus:border-[#1a6b3c] bg-[#f8fafc] transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Bouton Se connecter */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#1a6b3c] text-white rounded-lg font-medium text-sm hover:bg-[#175e34] active:bg-[#144f2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm mt-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Connexion en cours…
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Séparateur + lien inscription */}
            <div className="mt-6 pt-6 border-t border-[#f1f5f9] text-center text-sm text-[#64748b]">
              Vous êtes une école ?{' '}
              <Link
                to="/register"
                className="text-[#1a6b3c] font-medium hover:underline underline-offset-2"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
