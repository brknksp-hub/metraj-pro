import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Construction } from 'lucide-react';

export function AuthLayout() {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500 font-medium">Yükleniyor...</div>;
    if (user) return <Navigate to="/" replace />;

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50 px-4 font-sans relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>

            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center border border-slate-200 relative z-10 transition-all animate-in zoom-in-95 duration-500">
                <div className="bg-orange-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-200 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Construction size={40} className="text-white" />
                </div>

                <Outlet />

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">SaaS v3.3 Final (Orange Theme)</p>
                    <p className="text-[10px] text-slate-300 mt-1 font-bold tracking-wider uppercase">created by brknksp</p>
                </div>
            </div>
        </div>
    );
}
