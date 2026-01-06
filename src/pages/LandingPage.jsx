import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layout, Calculator, FileSpreadsheet } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200">
                            M
                        </div>
                        <span className="font-black text-2xl text-slate-900 tracking-tight">MetrajPro</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="font-bold text-slate-600 hover:text-slate-900 transition-colors">
                            Giriş Yap
                        </Link>
                        <Link to="/register">
                            <Button className="shadow-lg shadow-orange-200">
                                Kayıt Ol
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-bold border border-orange-100">
                            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
                            2025 Bakanlık Pozları Entegre
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                            İnşaat Metrajlarınızı <span className="text-orange-600">Profesyonelce</span> Yönetin.
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                            Karmaşık Excel tablolarından kurtulun. Teklif hazırlama, hak ediş ve metraj hesaplarını tek bir yerden, hatasız yapın.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/register">
                                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg hover:shadow-orange-300 shadow-xl shadow-orange-200">
                                    Ücretsiz Başla <ArrowRight className="ml-2" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <button className="w-full sm:w-auto h-14 px-8 text-lg font-bold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all">
                                    Demo İncele
                                </button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                            <CheckCircle2 size={16} className="text-emerald-500" /> Kredi kartı gerekmez
                            <span className="w-1 h-1 rounded-full bg-slate-300 mx-2"></span>
                            <CheckCircle2 size={16} className="text-emerald-500" /> Kurulum gerektirmez
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-100/50 to-purple-100/50 rounded-[40px] transform rotate-3 scale-105 -z-10"></div>
                        <div className="bg-white rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.1)] border border-slate-200 p-2 transform rotate-0 hover:-rotate-1 transition-transform duration-500">
                            <div className="bg-slate-50 rounded-[24px] overflow-hidden border border-slate-100 aspect-[4/3] flex items-center justify-center relative">
                                {/* Simplified UI Mockup */}
                                <div className="absolute top-0 w-full h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 p-8 w-full mt-8 opacity-90">
                                    <div className="h-32 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600"><Layout /></div>
                                        <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
                                        <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="h-32 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><Calculator /></div>
                                        <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
                                        <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="col-span-2 h-24 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600"><FileSpreadsheet /></div>
                                        <div className="space-y-2 flex-1">
                                            <div className="h-2 w-32 bg-slate-100 rounded-full"></div>
                                            <div className="h-2 w-48 bg-slate-100 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
