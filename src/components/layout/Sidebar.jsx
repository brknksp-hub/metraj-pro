import { LayoutDashboard, Settings, LogOut, Construction, ChevronRight } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export function Sidebar({ projects = [] }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-20 hidden md:flex border-r border-slate-800 h-screen sticky top-0">
            <div className="p-8 flex items-center space-x-4 border-b border-slate-800/50">
                <div className="bg-orange-500 p-2.5 rounded-xl shadow-lg shadow-orange-900/20">
                    <Construction size={26} className="text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight">MetrajPro</span>
            </div>

            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) => cn(
                        "w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all font-medium group",
                        isActive ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                >
                    <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                    <span>Genel Bakış</span>
                </NavLink>

                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) => cn(
                        "w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all font-medium group",
                        isActive ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                >
                    <Settings size={20} className="group-hover:rotate-90 transition-transform" />
                    <span>Firma Ayarları</span>
                </NavLink>

                {projects.length > 0 && (
                    <>
                        <div className="pt-8 pb-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Son Projeler</div>
                        <div className="space-y-1">
                            {projects.slice(0, 5).map(p => (
                                <NavLink
                                    key={p.id}
                                    to={`/dashboard/project/${p.id}`}
                                    className={({ isActive }) => cn(
                                        "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-colors",
                                        isActive ? "bg-slate-800 text-orange-400 border border-slate-700" : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    )}
                                >
                                    <span className="truncate">{p.title}</span>
                                    <ChevronRight size={14} />
                                </NavLink>
                            ))}
                        </div>
                    </>
                )}
            </nav>

            <div className="p-6 border-t border-slate-800/50">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 text-slate-400 hover:text-red-400 text-sm px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                    <LogOut size={18} /> Çıkış Yap
                </button>
            </div>
        </aside>
    );
}
