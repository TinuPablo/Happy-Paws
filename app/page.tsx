'use client';

import React, { useState, useEffect } from 'react';
import { 
  PawPrint, 
  Bell, 
  Star, 
  Utensils, 
  Droplets, 
  Home as HomeIcon, 
  Smile, 
  Book, 
  User,
  Check,
  ShoppingBag,
  Gamepad2,
  Footprints,
  Moon,
  Bath,
  Pencil,
  Shield,
  Syringe,
  Flame,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Camera,
  Mail,
  Gavel,
  Trash2,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Screen = 'login' | 'home' | 'virtual' | 'vaccines' | 'tips' | 'profile' | 'editpet' | 'legal';
type PetState = 'idle' | 'eating' | 'excited';

interface PetData {
  name: string;
  breed: string;
  age: number;
  gender: string;
  type: string;
}

const STORAGE_KEY = 'happy_paws_state';

const SHOP_ITEMS = [
  { id: 'hat_1', emoji: '🎩', name: 'Sombrero', cost: 80, category: 'hat' },
  { id: 'hat_2', emoji: '🎀', name: 'Moño', cost: 50, category: 'hat' },
  { id: 'cloth_1', emoji: '👗', name: 'Camperita', cost: 120, category: 'clothing' },
  { id: 'cloth_2', emoji: '🧣', name: 'Bufanda', cost: 60, category: 'clothing' },
  { id: 'eyes_1', emoji: '👓', name: 'Gafas', cost: 90, category: 'eyes' },
  { id: 'eyes_2', emoji: '📿', name: 'Collar', cost: 150, category: 'eyes' },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('login');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [petTab, setPetTab] = useState<'actions' | 'shop' | 'inventory'>('actions');
  const [petExpression, setPetExpression] = useState<PetState>('idle');
  const [foodAnim, setFoodAnim] = useState<{ active: boolean, type: string } | null>(null);
  
  // States initialized from localStorage or default values
  const [points, setPoints] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).points : 320;
    }
    return 320;
  });

  const [mood, setMood] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).mood : 82;
    }
    return 82;
  });

  const [petData, setPetData] = useState<PetData>(() => {
    const defaultValue = { name: 'Firulais', breed: 'Labrador', age: 3, gender: 'Macho', type: '🐶' };
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).petData : defaultValue;
    }
    return defaultValue;
  });

  const [ownedItems, setOwnedItems] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).ownedItems || [] : [];
    }
    return [];
  });

  const [equippedItems, setEquippedItems] = useState<string[]>(() => {
    const defaultValue = ['🎩', '🧣'];
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).equippedItems : defaultValue;
    }
    return defaultValue;
  });

  const [tasks, setTasks] = useState(() => {
    const defaultTasks = [
      { id: 1, title: 'Dar de comer', time: '08:00 — Ración de la mañana', done: true, icon: Utensils },
      { id: 2, title: 'Cambiar el agua', time: '12:00 — Hidratación diaria', done: false, icon: Droplets },
    ];
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tasks) {
          const iconMap: { [key: string]: React.ElementType } = { Utensils, Droplets };
          return parsed.tasks.map((t: { id: number, title: string, time: string, done: boolean }) => ({
            ...t,
            icon: iconMap[t.title === 'Dar de comer' ? 'Utensils' : 'Droplets'] || Utensils
          }));
        }
      }
    }
    return defaultTasks;
  });

  const [vaccines, setVaccines] = useState(() => {
    const defaultValue = [{ id: 1, name: 'Vacuna antirrábica', date: '2026-06-15' }];
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).vaccines : defaultValue;
    }
    return defaultValue;
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 5, 1)); // June 2026

  const [profileImage, setProfileImage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).profileImage : null;
    }
    return null;
  });

  const [petImage, setPetImage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).petImage : null;
    }
    return null;
  });

  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).notifications : true;
    }
    return true;
  });

  const [emailReminders, setEmailReminders] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).emailReminders : false;
    }
    return false;
  });
  
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({ title: '', body: '' });

  // Save to localStorage on change
  useEffect(() => {
    const stateToSave = {
      points,
      mood,
      petData,
      ownedItems,
      equippedItems,
      tasks: tasks.map(({ id, title, time, done }) => ({ id, title, time, done })), 
      vaccines,
      profileImage,
      petImage,
      notifications,
      emailReminders
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [points, mood, petData, ownedItems, equippedItems, tasks, vaccines, profileImage, petImage, notifications, emailReminders]);

  const triggerToast = (title: string, body: string) => {
    setToastContent({ title, body });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2600);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'profile' | 'pet') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === 'profile') setProfileImage(base64String);
        else setPetImage(base64String);
        triggerToast('¡Foto actualizada! 📸', '');
      };
      reader.readAsDataURL(file);
    }
  };

  // --- MOTOR DE NOTIFICACIONES LOCALES ---
  const requestNotificationPermissions = async () => {
    const win = window as unknown as { Capacitor?: { Plugins?: { LocalNotifications?: any } } };
    if (win.Capacitor?.Plugins?.LocalNotifications) {
      try {
        const result = await win.Capacitor.Plugins.LocalNotifications.requestPermissions();
        return result.display === 'granted';
      } catch (e) {
        console.error("Error solicitando permisos nativos", e);
        return false;
      }
    }
    return true; 
  };

  const scheduleVaccineNotification = async (vacId: number, vacName: string, dateStr: string) => {
    const scheduledDate = new Date(dateStr);
    scheduledDate.setHours(9, 0, 0, 0);

    const win = window as unknown as { Capacitor?: { Plugins?: { LocalNotifications?: any } } };
    if (win.Capacitor?.Plugins?.LocalNotifications) {
      try {
        await win.Capacitor.Plugins.LocalNotifications.schedule({
          notifications: [
            {
              title: "🐾 ¡Recordatorio de Vacunación!",
              body: `Es hora de aplicar la vacuna ${vacName} a ${petData.name}. ¡Cuidá a tu mejor amigo!`,
              id: vacId,
              schedule: { at: scheduledDate },
              sound: "default"
            }
          ]
        });
      } catch (e) {
        console.error("Error agendando notificación nativa", e);
      }
    }
  };

  const cancelVaccineNotification = async (vacId: number) => {
    const win = window as unknown as { Capacitor?: { Plugins?: { LocalNotifications?: any } } };
    if (win.Capacitor?.Plugins?.LocalNotifications) {
      try {
        await win.Capacitor.Plugins.LocalNotifications.cancel({
          notifications: [{ id: vacId }]
        });
      } catch (e) {
        console.error("Error cancelando notificación nativa", e);
      }
    }
  };

  const deleteVaccine = async (id: number) => {
    await cancelVaccineNotification(id);
    setVaccines(prev => prev.filter(v => v.id !== id));
    triggerToast('Vacuna eliminada', 'La notificación ha sido cancelada');
  };

  const navigateTo = (screen: Screen) => {
    console.log("Navigating to:", screen);
    setActiveScreen(screen);
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newState = !t.done;
        if (newState) {
          setPoints(p => p + 10);
          setMood(m => Math.min(100, m + 5));
          triggerToast('¡Tarea completada!', '+10 puntos ganados 🐾');
        } else {
          setPoints(p => Math.max(0, p - 10));
          setMood(m => Math.max(0, m - 5));
        }
        return { ...t, done: newState };
      }
      return t;
    }));
  };

  const petAction = (label: string, cost: number) => {
    if (points < cost) {
      triggerToast('No tenés suficientes puntos 😕', 'Cumplí más tareas para ganar puntos');
      return;
    }
    setPoints(p => p - cost);
    setMood(m => Math.min(100, m + 8));
    
    setPetExpression('excited');
    setTimeout(() => setPetExpression('idle'), 1500);

    triggerToast(`¡${label}!`, `A ${petData.name} le encantó 🐾`);
  };

  const feedPet = (foodType: '🍖' | '🍪' | '💧', cost: number) => {
    if (points < cost) {
      triggerToast('No tenés suficientes puntos 😕', 'Cumplí más tareas para ganar puntos');
      return;
    }

    setFoodAnim({ active: true, type: foodType });
    setPoints(p => p - cost);
    
    setTimeout(() => {
      setFoodAnim(null);
      setPetExpression('eating');
      
      setTimeout(() => {
        setPetExpression('excited');
        setMood(m => Math.min(100, m + 15));
        triggerToast(`¡Añam! A ${petData.name} le encantó ${foodType}`, '');
        
        setTimeout(() => {
          setPetExpression('idle');
        }, 1500);
      }, 1800);
    }, 600);
  };

  const getItemCategory = (emoji: string): 'hat' | 'clothing' | 'eyes' => {
    const categories: { [key: string]: 'hat' | 'clothing' | 'eyes' } = {
      '🎩': 'hat', '🎀': 'hat',
      '👗': 'clothing', '🧣': 'clothing',
      '👓': 'eyes', '📿': 'eyes'
    };
    return categories[emoji] || 'clothing';
  };

  const buyItem = (item: { emoji: string, name: string, cost: number }) => {
    if (points < item.cost) {
      triggerToast('No tenés suficientes puntos 😕', 'Cumplí más tareas para ganar puntos');
      return;
    }
    if (ownedItems.includes(item.emoji)) {
      triggerToast('Ya tienes este objeto', 'Búscalo en tu inventario');
      return;
    }
    setPoints(p => p - item.cost);
    setOwnedItems(prev => [...prev, item.emoji]);
    triggerToast(`¡Compraste ${item.name}!`, '🎉 Ahora lo tienes en tu inventario');
  };

  const toggleEquip = (emoji: string) => {
    const category = getItemCategory(emoji);
    setEquippedItems(prev => {
      const isEquipped = prev.includes(emoji);
      const filtered = prev.filter(e => getItemCategory(e) !== category);
      if (isEquipped) {
        triggerToast('Accesorio quitado', '');
        return filtered;
      } else {
        triggerToast('¡Accesorio equipado!', 'Tu mascota se ve genial 🐾');
        setPetExpression('excited');
        setTimeout(() => setPetExpression('idle'), 1000);
        return [...filtered, emoji];
      }
    });
  };

  const renderNav = () => {
    if (activeScreen === 'login' || activeScreen === 'shop' || activeScreen === 'editpet') return null;

    return (
      <nav className="flex shrink-0 border-t-2 border-brown-darker bg-brown-dark h-[70px] z-50">
        {[
          { id: 'home', icon: HomeIcon, label: 'Inicio' },
          { id: 'virtual', icon: Smile, label: 'Mascota' },
          { id: 'vaccines', icon: Syringe, label: 'Vacunas' },
          { id: 'tips', icon: Book, label: 'Guías' },
          { id: 'profile', icon: User, label: 'Perfil' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigateTo(item.id as Screen)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] transition-colors cursor-pointer",
              activeScreen === item.id ? "text-brown-lightest" : "text-brown-lightest/55"
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    );
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#EDE0CF] font-sans antialiased overflow-hidden">
      {/* Container simulating a mobile phone */}
      <div className="relative h-[640px] w-full max-w-[420px] rounded-[28px] border-2 border-brown-light bg-brown-lightest shadow-[0_8px_40px_rgba(75,40,14,0.18)] flex flex-col overflow-hidden mx-4">
        
        {/* Toast Notification */}
        <div className={cn(
          "fixed top-1/2 left-1/2 z-[100] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-brown-dark p-4 text-brown-lightest shadow-2xl transition-all duration-300",
          showToast ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        )}>
          <div className="text-sm font-bold mb-1 text-center">{toastContent.title}</div>
          <div className="text-xs opacity-90 text-center">{toastContent.body}</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          
          {/* LOGIN / REGISTER SCREEN */}
          {activeScreen === 'login' && (
            <div className="flex flex-col h-full bg-brown-lightest px-6 py-10 overflow-y-auto">
              <div className="mb-10 text-center">
                <div className="mx-auto mb-4 flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-[24px] shadow-[0_10px_30px_rgba(74,42,14,0.1)] border border-brown-light/20 relative">
                  <div className="absolute inset-0 z-10 shadow-[inset_0_0_15px_rgba(253,246,238,0.4)] pointer-events-none" />
                  <img 
                    src="/assets/logo.jpg" 
                    alt="Happy Paws Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <h1 className="text-3xl font-black text-brown-darker tracking-tight">Happy Paws</h1>
                <p className="text-sm font-medium text-brown-mid mt-1">Cuidando a tu mejor amigo</p>
              </div>

              <div className="rounded-3xl border border-brown-light bg-white p-6 shadow-md">
                <h2 className="text-xl font-bold text-brown-darker mb-6 text-center">
                  {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-brown-mid px-1">Correo electrónico</label>
                    <input 
                      type="email" 
                      placeholder="tu@email.com"
                      className="w-full rounded-xl border-2 border-brown-light bg-cream p-3 text-sm font-bold text-brown-darker focus:border-brown-main outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-brown-mid px-1">Contraseña</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full rounded-xl border-2 border-brown-light bg-cream p-3 text-sm font-bold text-brown-darker focus:border-brown-main outline-none transition-colors"
                    />
                  </div>

                  {authMode === 'register' && (
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-brown-mid px-1">Confirmar contraseña</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="w-full rounded-xl border-2 border-brown-light bg-cream p-3 text-sm font-bold text-brown-darker focus:border-brown-main outline-none transition-colors"
                      />
                    </div>
                  )}

                  <button 
                    type="button"
                    onClick={() => {
                      triggerToast(authMode === 'login' ? '¡Bienvenida María! 🐾' : '¡Cuenta creada! 🐾', '');
                      setTimeout(() => navigateTo('home'), 800);
                    }}
                    className="w-full rounded-2xl bg-brown-dark py-4 text-sm font-bold text-brown-lightest shadow-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer mt-4"
                  >
                    {authMode === 'login' ? 'Ingresar' : 'Registrarse'}
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button 
                  type="button"
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-sm font-bold text-brown-main hover:text-brown-dark transition-colors cursor-pointer"
                >
                  {authMode === 'login' 
                    ? '¿No tienes cuenta? Regístrate gratis' 
                    : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
              </div>

              <div className="mt-auto pt-6 text-center opacity-30 text-[10px] font-bold uppercase tracking-[0.2em] text-brown-mid">
                🐾 🐾 🐾
              </div>
            </div>
          )}

          {/* HOME SCREEN */}
          {activeScreen === 'home' && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-2.5 bg-brown-dark px-5 py-4 text-brown-lightest shrink-0">
                <PawPrint size={20} />
                <span className="flex-1 font-bold">Mi mascota y yo</span>
                <Bell size={20} className="cursor-pointer" onClick={() => triggerToast(`🐾 ¡Recordatorio!`, `Hora de darle agua a ${petData.name}`)} />
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="relative mt-4 mb-4 overflow-hidden rounded-[20px] bg-brown-dark p-6 text-brown-lightest shadow-lg">
                  <div className="absolute -right-2 -bottom-2 pointer-events-none text-9xl opacity-10">🐾</div>
                  <div className="mb-3 flex h-[64px] w-[64px] items-center justify-center rounded-full border-4 border-brown-light bg-brown-mid text-3xl shadow-inner">
                    {petData.type}
                  </div>
                  <h2 className="text-2xl font-bold mb-1">¡Hola, María!</h2>
                  <p className="text-sm opacity-80 mb-3">{petData.name} te espera — {tasks.filter(t => !t.done).length} tareas pendientes</p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-brown-darker shadow-sm">
                    <Star size={16} fill="currentColor" />
                    <span>{points} puntos</span>
                  </div>
                </div>

                <div className="mt-6 mb-3 text-[13px] font-bold tracking-widest text-brown-mid uppercase">Tareas de hoy</div>
                {tasks.map(task => (
                  <div key={task.id} className="mb-3 rounded-2xl border border-brown-light bg-white p-4 shadow-sm transition-transform active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brown-light text-brown-dark">
                        <task.icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <strong className="block text-sm text-brown-darker font-bold truncate">{task.title}</strong>
                        <span className="block text-xs text-brown-mid truncate">{task.time}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all cursor-pointer shadow-sm",
                          task.done ? "bg-green-600 border-green-600 text-white" : "border-brown-mid text-brown-mid"
                        )}
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {vaccines.sort((a,b) => a.date.localeCompare(b.date)).map(vac => {
                  const diff = Math.ceil((new Date(vac.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                  if (diff > 15 || diff < 0) return null; 
                  return (
                    <div key={vac.id} className="mb-3 rounded-2xl border border-brown-light bg-white p-4 shadow-sm transition-transform active:scale-[0.98]">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF0D6] text-[#7A4A00]">
                          <Syringe size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <strong className="block text-sm text-brown-darker font-bold truncate">{vac.name}</strong>
                          <span className="block text-xs text-brown-mid truncate">Próxima: {new Date(vac.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</span>
                        </div>
                        <div className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold",
                          diff <= 7 ? "bg-red-50 text-red-600" : "bg-[#FFF0D6] text-[#7A4A00]"
                        )}>
                          <Bell size={10} />
                          <span>{diff === 0 ? 'Hoy' : `${diff} días`}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="mt-6 mb-3 text-[13px] font-bold tracking-widest text-brown-mid uppercase">Progreso semanal</div>
                <div className="rounded-2xl border border-brown-light bg-white p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-brown-darker">Esta semana</span>
                    <div className="inline-flex items-center gap-1 rounded-full bg-[#FFF0D6] px-2.5 py-1 text-[11px] font-bold text-[#7A4A00]">
                      <Flame size={12} fill="currentColor" />
                      <span>5 días seguidos</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                      <div key={day} className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-brown-mid">{day}</span>
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-base",
                          i < 5 ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-300"
                        )}>
                          {i < 5 ? '✅' : '⬜'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIRTUAL PET SCREEN (POU STYLED) */}
          {activeScreen === 'virtual' && (
            <div className="flex flex-col h-full bg-[#FAF3E8] overflow-hidden">
              {/* Header inside screen */}
              <div className="flex items-center justify-between bg-brown-dark px-5 py-4 text-brown-lightest shrink-0">
                <div className="flex items-center gap-2 font-bold">
                  <Smile size={20} />
                  <span>{petData.name}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-brown-darker px-3 py-1 text-xs font-bold text-gold">
                  <Star size={14} fill="currentColor" />
                  <span>{points} Pts</span>
                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-brown-light/40 border-b border-brown-light px-5 py-3 shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-brown-darker uppercase tracking-wider">Humor / Energía</span>
                  <span className="text-xs font-black text-brown-main">{mood}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-brown-light">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-500" style={{ width: `${mood}%` }} />
                </div>
              </div>

              {/* STAGE: THE PET ESCENARIO */}
              <div className="relative flex-1 bg-gradient-to-b from-[#EBF4FA] to-[#FAF3E8] flex flex-col items-center justify-center p-4">
                
                {/* PROYECTIL DE COMIDA VOLADOR */}
                {foodAnim?.active && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-4xl z-40 animate-[foodFly_0.6s_ease-in-out_forwards]">
                    {foodAnim.type}
                  </div>
                )}

                {/* CONTENEDOR DE LA MASCOTA CON CAPAS ABSOLUTAS */}
                <div className={cn(
                  "relative w-44 h-44 flex items-center justify-center select-none",
                  petExpression === 'idle' && "animate-[petFloat_3s_ease-in-out_infinite]",
                  petExpression === 'eating' && "animate-[petChew_0.3s_ease-in-out_infinite]",
                  petExpression === 'excited' && "animate-[petJump_0.5s_ease-in-out_infinite]"
                )}>
                  
                  {/* CAPA 1: CUERPO BASE (Limpio) */}
                  <div className="text-8xl filter drop-shadow-md z-10 transition-transform">
                    {petExpression === 'eating' ? '😮' : petExpression === 'excited' ? '🤩' : '🐶'}
                  </div>

                  {/* CAPA 2: SOMBREROS / MOÑOS EN LA CABEZA */}
                  <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 text-5xl z-30 pointer-events-none drop-shadow-sm">
                    {equippedItems.includes('🎩') && '🎩'}
                    {equippedItems.includes('🎀') && '🎀'}
                  </div>

                  {/* CAPA 3: GAFAS EN LOS OJOS */}
                  <div className="absolute top-[28px] left-1/2 -translate-x-1/2 text-4xl z-25 pointer-events-none drop-shadow-sm">
                    {equippedItems.includes('👓') && '👓'}
                  </div>

                  {/* CAPA 4: CUELLO (BUFANDA / COLLAR) */}
                  <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 text-4xl z-20 pointer-events-none drop-shadow-sm">
                    {equippedItems.includes('🧣') && '🧣'}
                    {equippedItems.includes('📿') && '📿'}
                  </div>

                  {/* CAPA 5: PRENDA EXTRA */}
                  {equippedItems.includes('👗') && (
                    <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 text-5xl z-15 opacity-85 pointer-events-none">
                      👗
                    </div>
                  )}
                </div>

                {/* Sombra de la mascota */}
                <div className="w-28 h-3.5 bg-brown-dark/10 rounded-full blur-xs mt-2 animate-[shadowPulse_3s_ease-in-out_infinite]" />
              </div>

              {/* FOOTER INTERACTIVO: PANELES */}
              <div className="bg-white border-t-2 border-brown-light flex flex-col shrink-0">
                {/* Tabs Selector */}
                <div className="flex border-b border-brown-light bg-cream/50">
                  {[
                    { id: 'actions', label: 'Cuidado' },
                    { id: 'shop', label: 'Tienda' },
                    { id: 'inventory', label: 'Ropero' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPetTab(tab.id as any)}
                      className={cn(
                        "flex-1 py-3 text-xs font-bold text-center border-b-2 transition-all cursor-pointer",
                        petTab === tab.id ? "border-brown-dark text-brown-dark bg-white" : "border-transparent text-brown-mid"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content Box */}
                <div className="p-4 h-[130px] overflow-y-auto bg-white">
                  
                  {/* ACCIONES DE CUIDADO */}
                  {petTab === 'actions' && (
                    <div className="flex justify-center gap-3 py-1">
                      <button onClick={() => feedPet('🍖', 15)} className="flex flex-col items-center justify-center bg-cream border border-brown-light rounded-2xl p-2.5 w-20 shadow-xs hover:bg-brown-lightest active:scale-95 transition-all cursor-pointer">
                        <span className="text-2xl mb-1">🍖</span>
                        <span className="text-[10px] font-bold text-brown-darker">Dar Carne</span>
                        <span className="text-[9px] font-black text-brown-main mt-0.5">-15 Pts</span>
                      </button>
                      <button onClick={() => feedPet('💧', 5)} className="flex flex-col items-center justify-center bg-cream border border-brown-light rounded-2xl p-2.5 w-20 shadow-xs hover:bg-brown-lightest active:scale-95 transition-all cursor-pointer">
                        <span className="text-2xl mb-1">💧</span>
                        <span className="text-[10px] font-bold text-brown-darker">Dar Agua</span>
                        <span className="text-[9px] font-black text-brown-main mt-0.5">-5 Pts</span>
                      </button>
                      <button onClick={() => petAction('Pasear 🌳', 25)} className="flex flex-col items-center justify-center bg-cream border border-brown-light rounded-2xl p-2.5 w-20 shadow-xs hover:bg-brown-lightest active:scale-95 transition-all cursor-pointer">
                        <span className="text-2xl mb-1">🌳</span>
                        <span className="text-[10px] font-bold text-brown-darker">Pasear</span>
                        <span className="text-[9px] font-black text-brown-main mt-0.5">-25 Pts</span>
                      </button>
                      <button onClick={() => petAction('Bañar 🧼', 10)} className="flex flex-col items-center justify-center bg-cream border border-brown-light rounded-2xl p-2.5 w-20 shadow-xs hover:bg-brown-lightest active:scale-95 transition-all cursor-pointer">
                        <span className="text-2xl mb-1">🧼</span>
                        <span className="text-[10px] font-bold text-brown-darker">Bañar</span>
                        <span className="text-[9px] font-black text-brown-main mt-0.5">-10 Pts</span>
                      </button>
                    </div>
                  )}

                  {/* TIENDA DE ITEMS */}
                  {petTab === 'shop' && (
                    <div className="grid grid-cols-3 gap-2">
                      {SHOP_ITEMS.map(item => {
                        const bought = ownedItems.includes(item.emoji);
                        return (
                          <button
                            key={item.id}
                            disabled={bought}
                            onClick={() => buyItem(item)}
                            className={cn(
                              "flex items-center justify-between border rounded-xl p-2 bg-cream text-left transition-all active:scale-95 cursor-pointer",
                              bought ? "opacity-50 border-gray-300" : "border-brown-light hover:bg-brown-lightest"
                            )}
                          >
                            <span className="text-xl">{item.emoji}</span>
                            <div className="flex flex-col items-end">
                              <span className="text-[9px] font-black text-brown-darker truncate max-w-[50px]">{item.name}</span>
                              <span className="text-[9px] font-bold text-gold">{bought ? 'Comprado' : `${item.cost} P`}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* INVENTARIO / CLOSET */}
                  {petTab === 'inventory' && (
                    <div>
                      {ownedItems.length === 0 ? (
                        <div className="text-center text-xs text-brown-mid py-4 font-medium">No compraste accesorios todavía. ¡Ve a la tienda! 🛍️</div>
                      ) : (
                        <div className="grid grid-cols-4 gap-2">
                          {ownedItems.map((emoji, index) => {
                            const isEquipped = equippedItems.includes(emoji);
                            return (
                              <button
                                key={index}
                                onClick={() => toggleEquip(emoji)}
                                className={cn(
                                  "relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all active:scale-95 cursor-pointer",
                                  isEquipped ? "bg-brown-dark border-brown-dark text-white" : "bg-cream border-brown-light text-brown-darker"
                                )}
                              >
                                <span className="text-2xl">{emoji}</span>
                                {isEquipped && <span className="absolute top-0 right-1 text-[8px]">✔️</span>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* VACCINES SCREEN */}
          {activeScreen === 'vaccines' && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-2.5 bg-brown-dark px-5 py-4 text-brown-lightest shrink-0">
                <Syringe size={20} />
                <span className="flex-1 font-bold">Calendario de Vacunas</span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-[13px] font-bold tracking-widest text-brown-mid uppercase">Programar Vacuna</div>
                  <button 
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="flex items-center gap-1.5 rounded-full bg-brown-light px-3 py-1.5 text-[11px] font-bold text-brown-dark active:scale-95 transition-all cursor-pointer"
                  >
                    <Calendar size={14} />
                    {showCalendar ? 'Ocultar calendario' : 'Ver calendario'}
                  </button>
                </div>

                {showCalendar && (
                  <div className="mt-4 mb-6 rounded-3xl border border-brown-light bg-white p-5 shadow-md">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="text-sm font-bold text-brown-darker capitalize">
                        {currentCalendarDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1))}
                          className="p-1 text-brown-mid hover:text-brown-dark transition-colors cursor-pointer"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1))}
                          className="p-1 text-brown-mid hover:text-brown-dark transition-colors cursor-pointer"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
                      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                        <span key={d} className="text-[11px] font-medium text-brown-mid">{d}</span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1.5">
                      {(() => {
                        const year = currentCalendarDate.getFullYear();
                        const month = currentCalendarDate.getMonth();
                        
                        const firstDayOfMonth = new Date(year, month, 1).getDay();
                        const startingDayIndex = (firstDayOfMonth + 6) % 7;
                        
                        const daysInMonth = new Date(year, month + 1, 0).getDate();
                        const daysInPrevMonth = new Date(year, month, 0).getDate();
                        
                        const calendarCells = [];
                        
                        for (let i = startingDayIndex - 1; i >= 0; i--) {
                          calendarCells.push(
                            <div key={`prev-${i}`} className="aspect-square flex items-center justify-center text-[13px] text-brown-mid opacity-30">
                              {daysInPrevMonth - i}
                            </div>
                          );
                        }
                        
                        for (let d = 1; d <= daysInMonth; d++) {
                          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                          const hasVaccine = vaccines.find(v => v.date === dateStr);
                          const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
                          
                          calendarCells.push(
                            <button
                              key={`curr-${d}`}
                              type="button"
                              onClick={() => {
                                if (hasVaccine) {
                                  triggerToast(`🐾 Vacuna: ${hasVaccine.name}`, `Asignada para el ${d} de ${currentCalendarDate.toLocaleDateString('es-AR', { month: 'long' })}`);
                                }
                              }}
                              className={cn(
                                "aspect-square rounded-[10px] flex flex-col items-center justify-center text-[13px] relative transition-all active:scale-90 cursor-pointer",
                                isToday ? "bg-brown-light font-bold text-brown-dark" : "text-brown-darker",
                                hasVaccine ? "border border-brown-main/40" : ""
                              )}
                            >
                              <span>{d}</span>
                              {hasVaccine && (
                                <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-gold shadow-sm" />
                              )}
                            </button>
                          );
                        }

                        const remainingCells = 42 - calendarCells.length; 
                        for (let i = 1; i <= remainingCells; i++) {
                          calendarCells.push(
                            <div key={`next-${i}`} className="aspect-square flex items-center justify-center text-[13px] text-brown-mid opacity-30">
                              {i}
                            </div>
                          );
                        }
                        
                        return calendarCells;
                      })()}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-brown-light bg-white p-6 shadow-sm mb-6 mt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-brown-mid px-1">Nombre de la vacuna</label>
                      <input 
                        type="text" 
                        placeholder="Ej: Antirrábica"
                        id="vac-name"
                        className="w-full rounded-xl border-2 border-brown-light bg-cream p-3 text-sm font-bold text-brown-darker focus:border-brown-main outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-brown-mid px-1">Fecha programada</label>
                      <input 
                        type="date" 
                        id="vac-date"
                        className="w-full rounded-xl border-2 border-brown-light bg-cream p-3 text-sm font-bold text-brown-darker focus:border-brown-main outline-none transition-colors"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={async () => {
                        const nameEl = document.getElementById('vac-name') as HTMLInputElement;
                        const dateEl = document.getElementById('vac-date') as HTMLInputElement;
                        if (nameEl.value && dateEl.value) {
                          const newId = Math.floor(Math.random() * 1000000);
                          const newVac = { id: newId, name: nameEl.value, date: dateEl.value };
                          
                          const hasPermission = await requestNotificationPermissions();
                          if (hasPermission) {
                            await scheduleVaccineNotification(newId, newVac.name, newVac.date);
                          }

                          setVaccines(prev => [...prev, newVac]);
                          nameEl.value = '';
                          dateEl.value = '';
                          triggerToast('Vacuna agendada 🐾', 'Se mostrará en tu calendario y recordatorios');
                        }
                      }}
                      className="w-full rounded-2xl bg-brown-dark py-3.5 text-sm font-bold text-brown-lightest shadow-lg active:scale-95 transition-all cursor-pointer mt-2"
                    >
                      Guardar Vacuna
                    </button>
                  </div>
                </div>

                <div className="mt-6 mb-3 text-[13px] font-bold tracking-widest text-brown-mid uppercase">Próximas Vacunas</div>
                <div className="space-y-3">
                  {vaccines.length === 0 ? (
                    <p className="text-center text-xs text-brown-mid py-8 italic">No hay vacunas programadas</p>
                  ) : (
                    vaccines.sort((a,b) => a.date.localeCompare(b.date)).map(vac => {
                      const diff = Math.ceil((new Date(vac.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                      return (
                        <div key={vac.id} className="rounded-2xl border border-brown-light bg-white p-4 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF0D6] text-[#7A4A00]">
                              <Syringe size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <strong className="block text-sm text-brown-darker font-bold truncate">{vac.name}</strong>
                              <span className="block text-xs text-brown-mid truncate">Fecha: {new Date(vac.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</span>
                            </div>
                            <div className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold",
                              diff < 0 ? "bg-red-50 text-red-600" : diff === 0 ? "bg-red-50 text-red-600" : "bg-[#FFF0D6] text-[#7A4A00]"
                            )}>
                              <Calendar size={10} />
                              <span>{diff < 0 ? 'Vencida' : diff === 0 ? 'Hoy' : `${diff} días`}</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => deleteVaccine(vac.id)}
                              className="p-2 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TIPS SCREEN */}
          {activeScreen === 'tips' && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-2.5 bg-brown-dark px-5 py-4 text-brown-lightest shrink-0">
                <Book size={20} />
                <span className="flex-1 font-bold">Guías de cuidado</span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="mt-6 mb-6 rounded-3xl bg-brown-dark p-6 text-brown-lightest shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20"><Star size={40} /></div>
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gold">Destacado</div>
                  <h3 className="text-lg font-bold mb-2">Hidratación en verano 🌞</h3>
                  <p className="text-xs leading-relaxed opacity-90">Los perros necesitan entre 50–60 ml de agua por kilo al día. En días calurosos, duplicá la cantidad.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-[12px] font-bold tracking-widest text-brown-mid uppercase mb-3">Alimentación</div>
                    <div className="rounded-2xl border-l-4 border-brown-main bg-cream p-4 shadow-sm">
                      <h4 className="text-sm font-bold text-brown-darker mb-1">¿Cuánto darle de comer?</h4>
                      <p className="text-xs leading-relaxed text-brown-mid">Depende del peso y edad. Un adulto de 10kg necesita 250-300g diarios.</p>
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] font-bold tracking-widest text-brown-mid uppercase mb-3">Salud</div>
                    <div className="rounded-2xl border-l-4 border-brown-main bg-cream p-4 shadow-sm">
                      <h4 className="text-sm font-bold text-brown-darker mb-1">Vacunación</h4>
                      <p className="text-xs leading-relaxed text-brown-mid">Las esenciales son: moquillo, parvovirus y rabia. Esta última es anual y obligatoria.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE SCREEN */}
          {activeScreen === 'profile' && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-2.5 bg-brown-dark px-5 py-4 text-brown-lightest shrink-0">
                <User size={20} />
                <span className="flex-1 font-bold">Mi perfil</span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="my-8 text-center">
                  <div className="relative mx-auto mb-3 h-20 w-20">
                    <button 
                      type="button"
                      onClick={() => document.getElementById('profile-input')?.click()}
                      className="flex h-full w-full items-center justify-center rounded-full border-4 border-brown-light bg-brown-mid text-4xl shadow-md overflow-hidden cursor-pointer"
                    >
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        '👩'
                      )}
                    </button>
                    <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brown-dark text-white border-2 border-white shadow-sm pointer-events-none">
                      <Camera size={14} />
                    </div>
                    <input 
                      id="profile-input" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageChange(e, 'profile')}
                    />
                  </div>
                  <div className="text-xl font-bold text-brown-darker">María González</div>
                  <div className="text-xs text-brown-mid font-medium">Dueña responsable desde 2021</div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { label: 'Puntos', value: points },
                    { label: 'Racha', value: '5d' },
                    { label: 'Tareas', value: 48 },
                  ].map(stat => (
                    <div key={stat.label} className="rounded-2xl bg-brown-light p-3 text-center shadow-sm">
                      <strong className="block text-lg font-bold text-brown-darker">{stat.value}</strong>
                      <span className="text-[10px] font-bold text-brown-mid uppercase tracking-tighter">{stat.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <div className="text-[12px] font-bold tracking-widest text-brown-mid uppercase mb-3 px-1">Mi mascota real</div>
                  <div className="rounded-2xl border border-brown-light bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 shrink-0">
                        <button 
                          type="button"
                          onClick={() => document.getElementById('pet-photo-input')?.click()}
                          className="flex h-full w-full items-center justify-center rounded-xl bg-brown-light text-3xl shadow-inner overflow-hidden cursor-pointer"
                        >
                          {petImage ? (
                            <img src={petImage} alt="Pet" className="h-full w-full object-cover" />
                          ) : (
                            petData.type
                          )}
                        </button>
                        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brown-dark text-white border-2 border-white shadow-sm pointer-events-none">
                          <Camera size={10} />
                        </div>
                        <input 
                          id="pet-photo-input" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleImageChange(e, 'pet')}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <strong className="block text-base text-brown-darker font-bold">{petData.name}</strong>
                        <span className="block text-xs text-brown-mid font-medium">{petData.breed} · {petData.age} años</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => navigateTo('editpet')} 
                        className="p-2.5 text-brown-main border-2 border-brown-main rounded-full cursor-pointer hover:bg-brown-light transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-[12px] font-bold tracking-widest text-brown-mid uppercase mb-3 px-1">Opciones y Configuración</div>
                  <div className="rounded-2xl border border-brown-light bg-white divide-y divide-brown-light shadow-sm overflow-hidden">
                    <div className="flex items-center gap-4 w-full px-5 py-4 transition-colors">
                      <Bell className="text-brown-main" size={20} />
                      <span className="flex-1 text-sm font-bold text-brown-darker">Notificaciones push</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setNotifications(!notifications);
                          triggerToast(notifications ? 'Notificaciones desactivadas' : 'Notificaciones activadas', '');
                        }}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
                          notifications ? "bg-brown-main" : "bg-brown-light"
                        )}
                      >
                        <span className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          notifications ? "translate-x-5" : "translate-x-0"
                        )} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 w-full px-5 py-4 transition-colors">
                      <Mail className="text-brown-main" size={20} />
                      <span className="flex-1 text-sm font-bold text-brown-darker">Recordatorios por email</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setEmailReminders(!emailReminders);
                          triggerToast(emailReminders ? 'Emails desactivados' : 'Emails activados', '');
                        }}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
                          emailReminders ? "bg-brown-main" : "bg-brown-light"
                        )}
                      >
                        <span className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          emailReminders ? "translate-x-5" : "translate-x-0"
                        )} />
                      </button>
                    </div>

                    {[
                      { label: 'Datos de mascota', icon: PawPrint, act: () => navigateTo('editpet') },
                      { label: 'Términos y privacidad', icon: Shield, act: () => navigateTo('legal') },
                    ].map((item, i) => (
                      <button 
                        key={i} 
                        type="button"
                        onClick={item.act}
                        className="flex items-center gap-4 w-full px-5 py-4 hover:bg-brown-lightest transition-colors cursor-pointer text-left"
                      >
                        <item.icon className="text-brown-main" size={20} />
                        <span className="flex-1 text-sm font-bold text-brown-darker">{item.label}</span>
                        <ChevronRight size={18} className="text-brown-light" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEGAL / PRIVACY SCREEN */}
          {activeScreen === 'legal' && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-2.5 bg-brown-dark px-5 py-4 text-brown-lightest shrink-0">
                <button type="button" onClick={() => navigateTo('profile')} className="p-1 -ml-1 cursor-pointer">←</button>
                <span className="flex-1 font-bold">Términos y Privacidad</span>
                <Gavel size={18} className="opacity-80" />
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-8 bg-cream/30">
                <div className="space-y-8">
                  <section>
                    <h3 className="text-lg font-black text-brown-darker mb-3 flex items-center gap-2">
                      <div className="h-6 w-1 bg-brown-main rounded-full" />
                      Propiedad Intelectual
                    </h3>
                    <p className="text-sm leading-relaxed text-brown-mid font-medium">
                      Todo el código fuente, la marca <span className="text-brown-dark font-bold">&quot;Happy Paws&quot;</span>, los diseños visuales, ilustraciones y mecánicas de gamificación contenidos en esta aplicación son propiedad exclusiva del desarrollador. Queda terminantemente prohibida su reproducción, copia, distribución o ingeniería inversa sin autorización expresa por escrito.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-black text-brown-darker mb-3 flex items-center gap-2">
                      <div className="h-6 w-1 bg-brown-main rounded-full" />
                      Uso de la Aplicación
                    </h3>
                    <p className="text-sm leading-relaxed text-brown-mid font-medium">
                      El software se proporciona para la gestión personal del cuidado de mascotas. El usuario se compromete a realizar un uso responsable y lícito del sistema. Nos reservamos el derecho de modificar las funciones para mejorar la experiencia del usuario.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-lg font-black text-brown-darker mb-3 flex items-center gap-2">
                      <div className="h-6 w-1 bg-brown-main rounded-full" />
                      Privacidad de Datos
                    </h3>
                    <p className="text-sm leading-relaxed text-brown-mid font-medium">
                      En <span className="text-brown-dark font-bold">Happy Paws</span> respetamos tu privacidad. Todos los datos ingresados, incluyendo nombres de mascotas, fechas de vacunación y fotografías, se procesan y almacenan únicamente de forma local en tu dispositivo para asegurar el correcto funcionamiento de las alertas y la personalización. No vendemos ni compartimos tu información con terceros.
                    </p>
                  </section>
                </div>

                <div className="mt-12 mb-8 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brown-light mb-4">🐾 Happy Paws v1.0 🐾</div>
                  <button 
                    type="button"
                    onClick={() => navigateTo('profile')}
                    className="w-full rounded-2xl bg-brown-dark py-4 text-sm font-bold text-brown-lightest shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    Entendido y Volver
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT PET SCREEN */}
          {activeScreen === 'editpet' && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-2.5 bg-brown-dark px-5 py-4 text-brown-lightest shrink-0">
                <button type="button" onClick={() => navigateTo('profile')} className="p-1 -ml-1 cursor-pointer">←</button>
                <span className="flex-1 font-bold">Datos de mi mascota</span>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-8">
                <div className="my-8 text-center">
                  <span className="text-8xl block mb-6 drop-shadow-lg">{petData.type}</span>
                  <div className="flex justify-center gap-3">
                    {['🐶', '🐱', '🐰', '🐹', '🦜'].map((emoji) => (
                      <button 
                        key={emoji} 
                        type="button"
                        onClick={() => setPetData(prev => ({ ...prev, type: emoji }))}
                        className={cn(
                          "flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-2xl transition-all cursor-pointer shadow-sm active:scale-90",
                          petData.type === emoji ? "bg-brown-light border-brown-main scale-110" : "bg-white border-brown-light"
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="rounded-2xl border border-brown-light bg-white p-6 shadow-md space-y-5">
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-brown-mid">Nombre</label>
                      <input 
                        type="text" 
                        value={petData.name} 
                        onChange={(e) => setPetData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-xl border-2 border-brown-light bg-cream p-3 text-sm font-bold text-brown-darker focus:border-brown-main outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-brown-mid">Raza</label>
                      <input 
                        type="text" 
                        value={petData.breed} 
                        onChange={(e) => setPetData(prev => ({ ...prev, breed: e.target.value }))}
                        className="w-full rounded-xl border-2 border-brown-light bg-cream p-3 text-sm font-bold text-brown-darker focus:border-brown-main outline-none transition-colors" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-brown-mid">Edad</label>
                        <input 
                          type="number" 
                          value={petData.age} 
                          onChange={(e) => setPetData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                          className="w-full rounded-xl border-2 border-brown-light bg-cream p-3 text-sm font-bold text-brown-darker focus:border-brown-main outline-none transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-brown-mid">Sexo</label>
                        <select 
                          value={petData.gender}
                          onChange={(e) => setPetData(prev => ({ ...prev, gender: e.target.value }))}
                          className="w-full rounded-xl border-2 border-brown-light bg-cream p-3 text-sm font-bold text-brown-darker focus:border-brown-main outline-none transition-colors appearance-none"
                        >
                          <option>Macho</option>
                          <option>Hembra</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => { triggerToast('¡Guardado correctamente! 🐾', ''); setTimeout(() => navigateTo('profile'), 800); }}
                    className="w-full rounded-3xl bg-brown-dark py-4 text-sm font-bold text-brown-lightest shadow-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Navigation Bar (Always rendered at the bottom of the shell) */}
        {renderNav()}
      </div>
    </div>
  );
}