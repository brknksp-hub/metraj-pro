import { Home, Settings, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export function MobileNav() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-around items-center h-20 z-50 px-6 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.04)] print:hidden">
            <NavLink
                to="/dashboard"
                end
                className={({ isActive }) => cn(
                    "flex flex-col items-center justify-center space-y-1.5 transition-colors p-2",
                    isActive ? "text-orange-600" : "text-slate-400"
                )}
            >
                <Home size={26} strokeWidth={2} />
                <span className="text-[10px] font-bold">Ana Sayfa</span>
            </NavLink>

            <NavLink
                to="/dashboard/settings"
                className={({ isActive }) => cn(
                    "flex flex-col items-center justify-center space-y-1.5 transition-colors p-2",
                    isActive ? "text-orange-600" : "text-slate-400"
                )}
            >
                <Settings size={26} strokeWidth={2} />
                <span className="text-[10px] font-bold">Ayarlar</span>
            </NavLink>

            <button
                onClick={handleLogout}
                className="flex flex-col items-center justify-center space-y-1.5 text-slate-400 active:text-red-500 transition-colors p-2"
            >
                <LogOut size={26} strokeWidth={2} />
                <span className="text-[10px] font-bold">Çıkış</span>
            </button>
        </div>
    );
}
