export const ToastUiMap: Record<string, {
  title: string;
  icon: string;
  color: string;
}> = {
  created: {
    title: 'Oluşturuldu',
    icon: 'fa-solid fa-check',
    color: '#22c55e'
  },
  updated: {
    title: 'Güncellendi',
    icon: 'fa-solid fa-arrows-rotate',
    color: '#3b82f6'
  },
  deleted: {
    title: 'Silindi',
    icon: 'fa-solid fa-trash',
    color: '#ef4444'
  },
  approved: {
    title: 'Onaylandı',
    icon: 'fa-solid fa-circle-check',
    color: '#7c3aed'
  },
  transferred: {
    title: 'Transfer Edildi',
    icon: 'fa-solid fa-paper-plane',
    color: '#0ea5e9'
  },
  completed: {
    title: 'Tamamlandı',
    icon: 'fa-solid fa-check',
    color: '#16a34a'
  },
  error: {
    title: 'Hata',
    icon: 'fa-solid fa-circle-xmark',
    color: '#d9534f'
  },
  warning: {
    title: 'Uyarı',
    icon: 'fa-solid fa-triangle-exclamation',
    color: '#f59e0b'
  }
};
