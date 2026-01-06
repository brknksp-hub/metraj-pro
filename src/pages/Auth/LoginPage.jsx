import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, LogIn } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault(); // Stop reload
        setError('');
        setLoading(true);

        try {
            console.log("Attempting Professional Login...", { email });
            // STRICT MODULAR SDK USAGE (Verified)
            await signInWithEmailAndPassword(auth, email, password);

            // Success
            navigate('/dashboard');
        } catch (err) {
            console.error("Firebase Login Error:", err);
            let msg = 'Giriş başarısız.';
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                msg = 'Hatalı e-posta veya şifre.';
            } else if (err.code === 'auth/invalid-email') {
                msg = 'Geçersiz e-posta formatı.';
            } else if (err.code === 'auth/too-many-requests') {
                msg = 'Çok fazla deneme yapıldı. Lütfen bekleyin.';
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-white p-8 md:p-10">
                <div className="mb-8">
                    <Link to="/" className="text-slate-500 hover:text-orange-600 transition-colors inline-flex items-center gap-2 mb-6 text-sm font-bold group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Ana Sayfa
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                            <LogIn size={24} strokeWidth={3} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Giriş Yap</h1>
                    </div>
                    <p className="text-slate-500 font-medium text-lg">MetrajPro hesabınıza erişin.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                        <span className="text-lg">⚠️</span>
                        <span className="pt-0.5">{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">E-Posta Adresi</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="text-slate-900 font-medium py-3.5"
                            placeholder="ornek@sirket.com"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-slate-700">Şifre</label>
                            <a href="#" className="text-xs font-bold text-orange-600 hover:underline">Şifremi Unuttum?</a>
                        </div>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="text-slate-900 font-medium py-3.5"
                            placeholder="******"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 text-lg shadow-xl shadow-orange-200 mt-6 hover:shadow-orange-300 transition-all font-black"
                    >
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </Button>
                </form>

                <div className="mt-8 text-center pt-8 border-t border-slate-100">
                    <p className="text-slate-500 font-medium">
                        Hesabınız yok mu?{' '}
                        <Link to="/register" className="text-orange-600 font-black hover:underline ml-1">
                            Hemen Kayıt Ol
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
