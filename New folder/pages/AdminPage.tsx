import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Lock, History, Gift, RefreshCcw, LogOut, Edit2, X, Save, Check } from 'lucide-react';
import { 
  getPapers, 
  getGroupedPapers, 
  getHistory, 
  addPaper, 
  deletePaperGroup, 
  updatePaperGroup,
  clearHistory 
} from '../services/storageService';
import { Paper } from '../types';

interface GroupedPaper {
  content: string;
  count: number;
}

// Internal Component: Delete Button with confirmation state
const DeleteButton = ({ content, onDelete }: { content: string, onDelete: (c: string) => void }) => {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (confirming) {
      const timer = setTimeout(() => setConfirming(false), 2000); // Reset after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [confirming]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirming) {
      onDelete(content);
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-200 z-20 flex items-center justify-center ${
        confirming 
          ? 'bg-red-500 text-white shadow-lg scale-110' 
          : 'text-white/40 hover:text-red-400 hover:bg-red-400/10'
      }`}
      title={confirming ? "اضغط مرة أخرى للتأكيد" : "حذف"}
    >
      {confirming ? <Trash2 size={18} className="animate-pulse" /> : <Trash2 size={18} />}
    </button>
  );
};

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  // Data State
  const [groupedPapers, setGroupedPapers] = useState<GroupedPaper[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [history, setHistory] = useState<Paper[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [newPaperContent, setNewPaperContent] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [shake, setShake] = useState(false);

  // Edit Mode State
  const [editingItem, setEditingItem] = useState<GroupedPaper | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editCount, setEditCount] = useState(1);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, activeTab]);

  const refreshData = () => {
    const groups = getGroupedPapers();
    setGroupedPapers(groups);
    setTotalCount(getPapers().length);
    setHistory(getHistory());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '123') {
      setIsAuthenticated(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPasswordInput('');
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaperContent.trim()) return;
    for (let i = 0; i < quantity; i++) {
      addPaper(newPaperContent);
    }
    setNewPaperContent('');
    setQuantity(1);
    refreshData();
  };

  const handleDeleteGroup = (content: string) => {
    deletePaperGroup(content);
    refreshData();
  };

  const handleEditClick = (item: GroupedPaper) => {
    setEditingItem(item);
    setEditContent(item.content);
    setEditCount(item.count);
  };

  const handleSaveEdit = () => {
    if (editingItem && editContent.trim()) {
      updatePaperGroup(editingItem.content, editContent, editCount);
      setEditingItem(null);
      refreshData();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('مسح السجل بالكامل؟')) {
      clearHistory();
      refreshData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className={`glass-panel p-10 rounded-[40px] w-full max-w-sm border border-white/10 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 p-5 rounded-full ring-2 ring-white/20 shadow-neon-pink">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-display text-center text-white mb-8">منطقة سرية</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••"
              className="w-full px-4 py-4 rounded-2xl border border-white/10 bg-black/20 text-center text-xl text-white tracking-widest focus:border-chic-primary focus:outline-none focus:ring-1 focus:ring-chic-primary transition-all placeholder-white/20"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-chic-primary to-chic-secondary hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all shadow-neon-pink"
            >
              دخول
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-white/40 hover:text-white transition-colors">
              عودة
            </Link>
          </div>
        </div>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      {/* Edit Overlay Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-[32px] border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white font-display">تعديل الورقة</h3>
              <button onClick={() => setEditingItem(null)} className="text-white/50 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1 block">المحتوى</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-32 p-4 rounded-xl border border-white/10 bg-black/30 text-white focus:border-chic-accent focus:outline-none"
                />
              </div>
              
              <div>
                <label className="text-sm text-white/60 mb-1 block">العدد في الصندوق</label>
                <div className="flex items-center gap-4 bg-black/30 p-2 rounded-xl border border-white/10">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={editCount}
                    onChange={(e) => setEditCount(parseInt(e.target.value))}
                    className="flex-1 accent-chic-accent h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <input 
                    type="number"
                    value={editCount}
                    onChange={(e) => setEditCount(parseInt(e.target.value))}
                    className="w-16 bg-transparent text-center text-white font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveEdit}
                className="w-full mt-4 bg-chic-accent hover:bg-cyan-400 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-neon-blue"
              >
                <Save size={20} />
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <Link 
          to="/" 
          className="group flex items-center gap-3 text-white/70 hover:text-white transition-all bg-white/5 px-5 py-2.5 rounded-full border border-white/10 hover:border-white/30"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">الخروج</span>
        </Link>
        <h1 className="font-display text-3xl md:text-4xl text-gradient font-bold text-center drop-shadow-sm">
          لوحة التحكم
        </h1>
      </header>

      {/* Tabs */}
      <div className="flex justify-center mb-8 p-1 bg-white/5 backdrop-blur-md rounded-full w-fit mx-auto border border-white/10">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${
            activeTab === 'active' 
              ? 'bg-chic-primary text-white shadow-neon-pink' 
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Gift size={18} />
          الورق المتاح
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${
            activeTab === 'history' 
              ? 'bg-chic-secondary text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <History size={18} />
          الأرشيف
        </button>
      </div>

      {activeTab === 'active' ? (
        <div className="grid gap-8 md:grid-cols-[1fr,1.5fr]">
          {/* Add New Section */}
          <section className="glass-panel p-8 rounded-[32px] h-fit sticky top-4">
            <h2 className="font-display text-2xl text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-chic-accent/20 rounded-lg text-chic-accent">
                <Plus size={24} />
              </div>
              <span>إضافة جديد</span>
            </h2>
            <form onSubmit={handleAdd} className="space-y-5">
              <textarea
                value={newPaperContent}
                onChange={(e) => setNewPaperContent(e.target.value)}
                placeholder="اكتبي هنا..."
                className="w-full h-40 p-5 rounded-2xl border border-white/10 focus:border-chic-accent focus:outline-none bg-black/20 text-white resize-none placeholder-white/20 focus:ring-1 focus:ring-chic-accent transition-all"
              />
              
              <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
                <label className="text-sm font-bold text-white/70 px-2 whitespace-nowrap">العدد:</label>
                <div className="flex-1 flex items-center gap-2">
                  <input 
                    type="range" 
                    min="1" 
                    max="50"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full accent-chic-accent h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="w-10 text-center font-mono font-bold text-white">{quantity}</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!newPaperContent.trim()}
                className="w-full bg-gradient-to-r from-chic-accent to-blue-500 hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all shadow-neon-blue active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إضافة ⚡
              </button>
            </form>
          </section>

          {/* List Section (Grouped) */}
          <section className="glass-panel p-8 rounded-[32px]">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h2 className="font-display text-xl text-white">المحتوى الحالي</h2>
              <div className="flex gap-2">
                <span className="text-white/60 text-sm flex items-center">
                  الإجمالي: <b className="text-white ml-1">{totalCount}</b>
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {groupedPapers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-white/30 gap-4">
                  <Gift size={48} className="opacity-20" />
                  <span className="italic">الصندوق فارغ</span>
                </div>
              ) : (
                groupedPapers.map((item) => (
                  <div 
                    key={item.content} 
                    className="group bg-white/5 hover:bg-white/10 p-4 rounded-2xl flex justify-between items-center gap-4 border border-white/5 hover:border-chic-primary/30 transition-all relative"
                  >
                    <div className="flex-1">
                      <p className="text-white/90 font-medium line-clamp-2 leading-relaxed">{item.content}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 z-10">
                      <span className="bg-chic-primary/20 text-chic-primary px-3 py-1 rounded-lg font-mono font-bold text-sm min-w-[3rem] text-center border border-chic-primary/20">
                        x{item.count}
                      </span>
                      
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditClick(item)}
                          className="p-2 text-white/40 hover:text-chic-accent hover:bg-chic-accent/10 rounded-full transition-colors z-20"
                          title="تعديل"
                        >
                          <Edit2 size={18} />
                        </button>
                        
                        <DeleteButton 
                          content={item.content} 
                          onDelete={handleDeleteGroup} 
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      ) : (
        /* History View */
        <section className="glass-panel p-8 rounded-[32px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-xl text-white">سجل الفتح</h2>
            <div className="flex items-center gap-3">
               <span className="bg-white/10 border border-white/10 px-4 py-1 rounded-full text-white font-mono text-sm">
                {history.length}
              </span>
              {history.length > 0 && (
                <button 
                  type="button"
                  onClick={handleClearHistory}
                  className="flex items-center gap-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-full hover:bg-red-500/20 transition-all"
                >
                  <RefreshCcw size={14} />
                  مسح
                </button>
              )}
            </div>
           
          </div>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-white/30 gap-4">
                <History size={48} className="opacity-20" />
                <span className="italic">لا يوجد سجل</span>
              </div>
            ) : (
              [...history].reverse().map((paper) => (
                <div 
                  key={paper.id} 
                  className="bg-white/5 p-4 rounded-2xl flex justify-between items-center gap-3 border border-white/5 text-white/60"
                >
                  <p className="font-medium line-clamp-2">{paper.content}</p>
                  {paper.openedAt && (
                    <span className="text-xs bg-black/20 px-2 py-1 rounded-md font-mono">
                      {new Date(paper.openedAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};