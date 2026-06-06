'use client';

import React, { useState } from 'react';
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
  ChevronRight,
  Check,
  ShoppingBag,
  Gamepad2,
  Footprints,
  Moon,
  Bath,
  Pencil,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Screen = 'home' | 'virtual' | 'shop' | 'tips' | 'profile' | 'editpet';

interface PetData {
  name: string;
  breed: string;
  age: number;
  gender: string;
  type: string;
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [points, setPoints] = useState(320);
  const [mood, setMood] = useState(82);
  const [petData, setPetData] = useState<PetData>({
    name: 'Firulais',
    breed: 'Labrador',
    age: 3,
    gender: 'Macho',
    type: '🐶'
  });
  const [equippedItems, setEquippedItems] = useState<string[]>(['🎩', '🧣']);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Dar de comer', time: '08:00 — Ración de la mañana', done: true, icon: Utensils },
    { id: 2, title: 'Cambiar el agua', time: '12:00 — Hidratación diaria', done: false, icon: Droplets },
  ]);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({ title: '', body: '' });

  const triggerToast = (title: string, body: string) => {
    setToastContent({ title, body });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2600);
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
    triggerToast(`¡${label}!`, `A ${petData.name} le encantó 🐾`);
  };

  const buyItem = (item: { emoji: string, name: string, cost: number }) => {
    if (points < item.cost) {
      triggerToast('No tenés suficientes puntos 😕', 'Cumplí más tareas para ganar puntos');
      return;
    }
    if (equippedItems.includes(item.emoji)) {
      triggerToast('Ya tienes este objeto', 'Equípalo en tu mascota virtual');
      return;
    }
    setPoints(p => p - item.cost);
    setEquippedItems(prev => [...prev, item.emoji]);
    triggerToast(`¡Compraste ${item.name}!`, '🎉 Equipado en tu mascota virtual');
  };

  const renderNav = () => {
    // Hide nav on shop and editpet to match prototype feel
    if (activeScreen === 'shop' || activeScreen === 'editpet') return null;

    return (
      <nav className="flex shrink-0 border-t-2 border-brown-darker bg-brown-dark h-[70px] z-50">
        {[
          { id: 'home', icon: HomeIcon, label: 'Inicio' },
          { id: 'virtual', icon: Smile, label: 'Mascota' },
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
            <item.icon size={24} />
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
              </div>
            </div>
          )}

          {/* VIRTUAL PET SCREEN */}
          {activeScreen === 'virtual' && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-2.5 bg-brown-dark px-5 py-4 text-brown-lightest shrink-0">
                <Smile size={20} />
                <span className="flex-1 font-bold">Mascota virtual</span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="mt-4 mb-4 rounded-[24px] border border-brown-light bg-cream p-8 text-center shadow-md relative">
                  <span className="block text-[100px] leading-none mb-4 drop-shadow-lg">{petData.type}</span>
                  <div className="text-xl font-bold text-brown-darker">{petData.name} virtual</div>
                  <div className="text-sm text-brown-mid mt-1 font-medium">
                    {mood >= 80 ? '¡Feliz y contento!' : mood >= 50 ? 'Bien, pero con ganas de jugar' : 'Necesita atención...'}
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between text-xs font-bold text-brown-mid mb-2 uppercase tracking-tighter">
                      <span>Ánimo</span><span>{mood}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-brown-light shadow-inner overflow-hidden">
                      <div className="h-full bg-brown-main transition-all duration-500" style={{ width: `${mood}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 my-4">
                  {[
                    { label: 'Alimentar', icon: Utensils, cost: 10, act: 'Alimentar' },
                    { label: 'Pasear', icon: Footprints, cost: 15, act: 'Pasear' },
                    { label: 'Jugar', icon: Gamepad2, cost: 8, act: 'Jugar' },
                    { label: 'Bañar', icon: Bath, cost: 12, act: 'Bañar' },
                    { label: 'Descansar', icon: Moon, cost: 5, act: 'Descansar' },
                    { label: 'Tienda', icon: ShoppingBag, cost: 0, screen: 'shop' },
                  ].map(item => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => item.screen ? navigateTo(item.screen as Screen) : petAction(item.act!, item.cost)}
                      className="rounded-2xl border border-brown-light bg-white p-4 text-center shadow-sm hover:bg-brown-light/50 active:bg-brown-light transition-all cursor-pointer group"
                    >
                      <item.icon className="mx-auto mb-2 text-brown-dark group-active:scale-110 transition-transform" size={24} />
                      <span className="text-[11px] font-bold text-brown-mid">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SHOP SCREEN */}
          {activeScreen === 'shop' && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-2.5 bg-brown-dark px-5 py-4 text-brown-lightest shrink-0">
                <button type="button" onClick={() => navigateTo('virtual')} className="p-1 -ml-1 cursor-pointer">←</button>
                <span className="flex-1 font-bold">Tienda de accesorios</span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="mt-4 mb-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-brown-darker shadow-sm">
                      <Star size={16} fill="currentColor" />
                      <span>{points} puntos</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-brown-mid font-bold uppercase text-right leading-tight">Ganás puntos<br/>cumpliendo tareas</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {[
                    { emoji: '🎩', name: 'Sombrero', cost: 80 },
                    { emoji: '👗', name: 'Camperita', cost: 120 },
                    { emoji: '🧣', name: 'Bufanda', cost: 60 },
                    { emoji: '👓', name: 'Gafas', cost: 90 },
                    { emoji: '📿', name: 'Collar', cost: 150 },
                    { emoji: '🎀', name: 'Moño', cost: 50 },
                  ].map(item => (
                    <button 
                      key={item.name}
                      type="button"
                      onClick={() => buyItem(item)}
                      className={cn(
                        "rounded-[24px] border-2 p-5 text-center transition-all shadow-sm cursor-pointer active:scale-95",
                        equippedItems.includes(item.emoji) ? "border-green-500 bg-green-50" : "border-brown-light bg-white hover:border-brown-main"
                      )}
                    >
                      <span className="block mb-3 text-5xl drop-shadow-sm">{item.emoji}</span>
                      <div className="text-sm font-bold text-brown-darker mb-2">{item.name}</div>
                      <div className="inline-flex items-center gap-1 rounded-full bg-brown-light px-3 py-1 text-xs font-bold text-brown-darker">
                        <Star size={12} fill="currentColor" /> {item.cost}
                      </div>
                      {equippedItems.includes(item.emoji) && (
                        <div className="mt-2 text-[10px] text-green-600 font-bold uppercase tracking-tighter">Obtenido</div>
                      )}
                    </button>
                  ))}
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
                  <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-brown-light bg-brown-mid text-4xl shadow-md">👩</div>
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
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brown-light text-3xl shadow-inner">
                        {petData.type}
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
                  <div className="text-[12px] font-bold tracking-widest text-brown-mid uppercase mb-3 px-1">Opciones</div>
                  <div className="rounded-2xl border border-brown-light bg-white divide-y divide-brown-light shadow-sm overflow-hidden">
                    {[
                      { label: 'Datos de mascota', icon: PawPrint, act: () => navigateTo('editpet') },
                      { label: 'Notificaciones', icon: Bell },
                      { label: 'Privacidad', icon: Shield },
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
