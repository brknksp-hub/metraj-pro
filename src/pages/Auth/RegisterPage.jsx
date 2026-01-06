import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Şifreler eşleşmiyor.');
        }

        if (password.length < 6) {
            return setError('Şifre en az 6 karakter olmalıdır.');
        }

        setLoading(true);
        try {
            console.log("Attempting Professional Register...", { email });
            // STRICT MODULAR SDK USAGE (Verified)
            await createUserWithEmailAndPassword(auth, email, password);

            // Success
            navigate('/dashboard');
        } catch (err) {
            console.error("Firebase Register Error:", err);

            let msg = 'Kayıt başarısız.';
            if (err.code === 'auth/email-already-in-use') msg = 'Bu e-posta adresi zaten kullanımda.';
            else if (err.code === 'auth/invalid-email') msg = 'Geçersiz e-posta adresi.';
            else if (err.code === 'auth/weak-password') msg = 'Şifre çok zayıf.';

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
                            <UserPlus size={24} strokeWidth={3} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kayıt Ol</h1>
                    </div>
                    <p className="text-slate-500 font-medium text-lg">MetrajPro dünyasına katılın.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                        <span className="text-lg">⚠️</span>
                        <span className="pt-0.5">{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
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
                        <label className="block text-sm font-bold text-slate-700 mb-2">Şifre</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="text-slate-900 font-medium py-3.5"
                            placeholder="******"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Şifre Tekrar</label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                    </Button>
                </form>

                <div className="mt-8 text-center pt-8 border-t border-slate-100">
                    <p className="text-slate-500 font-medium">
                        Zaten hesabınız var mı?{' '}
                        <Link to="/login" className="text-orange-600 font-black hover:underline ml-1">
                            Giriş Yap
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
