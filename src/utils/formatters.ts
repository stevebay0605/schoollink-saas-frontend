import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

// Formater une date
export const formatDate = (date: string | null | undefined, pattern = 'dd/MM/yyyy'): string => {
  if (!date) return '—';
  try {
    const parsed = parseISO(date);
    if (!isValid(parsed)) return date;
    return format(parsed, pattern, { locale: fr });
  } catch {
    return date;
  }
};

// Formater une date avec l'heure
export const formatDateTime = (date: string | null | undefined): string => {
  return formatDate(date, 'dd/MM/yyyy à HH:mm');
};

// Formater un montant en FCFA
export const formatAmount = (amount: number | null | undefined): string => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Formater une note
export const formatGrade = (score: number | null | undefined, max = 20): string => {
  if (score == null) return '—';
  return `${score}/${max}`;
};

// Formater un pourcentage
export const formatPercent = (value: number | null | undefined): string => {
  if (value == null) return '—';
  return `${Math.round(value)}%`;
};

// Obtenir les initiales d'un nom
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Tronquer un texte
export const truncate = (text: string, length = 50): string => {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
};

// Couleur selon le statut
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'success',
    inactive: 'muted',
    suspended: 'danger',
    paid: 'success',
    pending: 'warning',
    overdue: 'danger',
    cancelled: 'muted',
    present: 'success',
    absent: 'danger',
    late: 'warning',
    excused: 'info',
    published: 'success',
    draft: 'muted',
    open: 'primary',
    closed: 'muted',
  };
  return colors[status] ?? 'muted';
};

// Label français des statuts
export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: 'Actif',
    inactive: 'Inactif',
    suspended: 'Suspendu',
    paid: 'Payé',
    pending: 'En attente',
    overdue: 'En retard',
    cancelled: 'Annulé',
    present: 'Présent',
    absent: 'Absent',
    late: 'En retard',
    excused: 'Excusé',
    published: 'Publié',
    draft: 'Brouillon',
    open: 'Ouvert',
    closed: 'Fermé',
    M: 'Masculin',
    F: 'Féminin',
    super_admin: 'Super Administrateur',
    school_admin: 'Administrateur',
    teacher: 'Enseignant',
    student: 'Élève',
    parent: 'Parent',
  };
  return labels[status] ?? status;
};
