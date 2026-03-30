import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth';
import type { RegisterForm } from '../../types';

const registerSchema = z
  .object({
    school_name: z.string().min(2, "Nom de l'école requis"),
    school_email: z.string().email("Email de l'école invalide"),
    school_phone: z.string().optional(),
    school_address: z.string().optional(),
    admin_name: z.string().min(2, "Nom de l'administrateur requis"),
    admin_email: z.string().email('Email administrateur invalide'),
    password: z.string().min(8, 'Mot de passe minimum 8 caractères'),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['password_confirmation'],
  });

/* ── Helpers de style ── */
const fieldClass =
  'w-full pl-10 pr-4 py-2.5 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] focus:border-[#1a6b3c] bg-white transition-shadow';
const fieldClassRight =
  'w-full pl-10 pr-10 py-2.5 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] focus:border-[#1a6b3c] bg-white transition-shadow';
const labelClass = 'block text-sm font-medium text-[#1e293b] mb-1.5';
const iconClass = 'absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none';

interface FieldErrorProps {
  message?: string;
}
const FieldError: React.FC<FieldErrorProps> = ({ message }) =>
  message ? (
    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
      <span className="inline-block w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
      {message}
    </p>
  ) : null;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await authApi.registerSchool(data);
      toast.success('École créée avec succès ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4">
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* ── En-tête ── */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#1a6b3c] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#1a6b3c]/25">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1
            className="text-4xl font-bold text-[#1e293b] tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            SchoolLink
          </h1>
          <p className="text-[#64748b] mt-1.5 text-sm">
            Créez le compte de votre établissement en quelques minutes
          </p>
        </div>

        {/* ── Indicateur d'étapes visuel ── */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1a6b3c] flex items-center justify-center text-white text-xs font-semibold shadow-sm">
              1
            </div>
            <span className="text-xs font-medium text-[#1a6b3c] hidden sm:block">Informations école</span>
          </div>
          <ChevronRight size={14} className="text-[#94a3b8]" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#c9a82c] flex items-center justify-center text-white text-xs font-semibold shadow-sm">
              2
            </div>
            <span className="text-xs font-medium text-[#c9a82c] hidden sm:block">Compte administrateur</span>
          </div>
        </div>

        {/* ── Carte formulaire ── */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>

            {/* ─ Section 1 : Informations de l'école ─ */}
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#f1f5f9]">
                <div className="w-7 h-7 rounded-lg bg-[#1a6b3c]/10 flex items-center justify-center flex-shrink-0">
                  <Building2 size={15} className="text-[#1a6b3c]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#1e293b] text-sm">Informations de l'école</h2>
                  <p className="text-xs text-[#94a3b8]">Identifiez votre établissement</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nom de l'école */}
                <div>
                  <label className={labelClass}>
                    Nom de l'école <span className="text-[#1a6b3c]">*</span>
                  </label>
                  <div className="relative">
                    <Building2 size={16} className={iconClass} />
                    <input
                      {...register('school_name')}
                      placeholder="Lycée Jean Moulin"
                      className={fieldClass}
                    />
                  </div>
                  <FieldError message={errors.school_name?.message} />
                </div>

                {/* Email de l'école */}
                <div>
                  <label className={labelClass}>
                    Email de l'école <span className="text-[#1a6b3c]">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className={iconClass} />
                    <input
                      {...register('school_email')}
                      type="email"
                      autoComplete="off"
                      placeholder="contact@ecole.fr"
                      className={fieldClass}
                    />
                  </div>
                  <FieldError message={errors.school_email?.message} />
                </div>

                {/* Téléphone */}
                <div>
                  <label className={labelClass}>Téléphone</label>
                  <div className="relative">
                    <Phone size={16} className={iconClass} />
                    <input
                      {...register('school_phone')}
                      type="tel"
                      placeholder="+33 1 23 45 67 89"
                      className={fieldClass}
                    />
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <label className={labelClass}>Adresse</label>
                  <div className="relative">
                    <MapPin size={16} className={iconClass} />
                    <input
                      {...register('school_address')}
                      placeholder="123 rue de l'École, Paris"
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ─ Section 2 : Compte administrateur ─ */}
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#f1f5f9]">
                <div className="w-7 h-7 rounded-lg bg-[#c9a82c]/15 flex items-center justify-center flex-shrink-0">
                  <User size={15} className="text-[#c9a82c]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#1e293b] text-sm">Compte administrateur</h2>
                  <p className="text-xs text-[#94a3b8]">Vos identifiants de connexion</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nom complet */}
                <div>
                  <label className={labelClass}>
                    Nom complet <span className="text-[#1a6b3c]">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className={iconClass} />
                    <input
                      {...register('admin_name')}
                      placeholder="Jean Dupont"
                      autoComplete="name"
                      className={fieldClass}
                    />
                  </div>
                  <FieldError message={errors.admin_name?.message} />
                </div>

                {/* Email admin */}
                <div>
                  <label className={labelClass}>
                    Email administrateur <span className="text-[#1a6b3c]">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className={iconClass} />
                    <input
                      {...register('admin_email')}
                      type="email"
                      autoComplete="email"
                      placeholder="admin@ecole.fr"
                      className={fieldClass}
                    />
                  </div>
                  <FieldError message={errors.admin_email?.message} />
                </div>

                {/* Mot de passe */}
                <div>
                  <label className={labelClass}>
                    Mot de passe <span className="text-[#1a6b3c]">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className={iconClass} />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={fieldClassRight}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <FieldError message={errors.password?.message} />
                </div>

                {/* Confirmer mot de passe */}
                <div>
                  <label className={labelClass}>
                    Confirmer le mot de passe <span className="text-[#1a6b3c]">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className={iconClass} />
                    <input
                      {...register('password_confirmation')}
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={fieldClassRight}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
                      aria-label={showConfirm ? 'Masquer' : 'Afficher'}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <FieldError message={errors.password_confirmation?.message} />
                </div>
              </div>
            </div>

            {/* ─ Bouton de soumission ─ */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1a6b3c] text-white rounded-lg font-medium hover:bg-[#175e34] active:bg-[#144f2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Création en cours…
                  </>
                ) : (
                  <>
                    <GraduationCap size={17} />
                    Créer mon école
                  </>
                )}
              </button>

              {/* Mention légale */}
              <p className="text-center text-xs text-[#94a3b8] mt-3">
                En créant un compte, vous acceptez nos{' '}
                <span className="text-[#1a6b3c] cursor-pointer hover:underline underline-offset-2">
                  conditions d'utilisation
                </span>
              </p>
            </div>

            {/* Lien connexion */}
            <div className="pt-4 border-t border-[#f1f5f9] text-center text-sm text-[#64748b]">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-[#1a6b3c] font-medium hover:underline underline-offset-2"
              >
                Se connecter
              </Link>
            </div>
          </form>
        </div>

        {/* Pied de page */}
        <p className="text-center text-xs text-[#94a3b8] mt-6">
          © {new Date().getFullYear()} SchoolLink · Gestion scolaire intelligente
        </p>
      </div>
    </div>
  );
};

export default Register;
