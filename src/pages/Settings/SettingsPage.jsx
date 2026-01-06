import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, APP_ID } from '../../lib/firebase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Info, Upload, ImageIcon, Building2, Phone, User, MapPin } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Preview URL (for UI)
    const [previewUrl, setPreviewUrl] = useState(null);
    // Actual file object to upload
    const [selectedFile, setSelectedFile] = useState(null);

    const [settings, setSettings] = useState({});

    useEffect(() => {
        if (!user || !db) return;
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'settings', 'company');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSettings(data);
                    setPreviewUrl(data.logo); // Existing logo URL
                }
            } catch (err) {
                console.error(err);
                showToast("Ayarlar yüklenirken hata oluştu", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [user, showToast]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 1. Validation: 10MB Limit
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                alert("Dosya boyutu 10MB'dan küçük olmalıdır.");
                return;
            }

            // Set file for later upload
            setSelectedFile(file);

            // Create local preview immediately
            const reader = new FileReader();
            reader.onloadend = () => { setPreviewUrl(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Safeguard: Timeout after 15 seconds to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("İşlem zaman aşımına uğradı. İnternet bağlantınızı kontrol edip tekrar deneyin.")), 15000)
        );

        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            // Main Save Operation
            const saveOperation = async () => {
                let finalLogoUrl = previewUrl;

                if (selectedFile) {
                    const extension = selectedFile.name.split('.').pop();
                    const storageRef = ref(storage, `artifacts/${APP_ID}/users/${user.uid}/company_logo.${extension}`);

                    try {
                        const snapshot = await uploadBytes(storageRef, selectedFile);
                        finalLogoUrl = await getDownloadURL(snapshot.ref);
                    } catch (uploadError) {
                        console.error("Upload Error:", uploadError);
                        // If upload fails (e.g. CORS), we still want to save the text data
                        // but maybe warn the user or just keep the old logo?
                        // For now, alerting specific upload error
                        if (uploadError.message.includes('CORS')) {
                            throw new Error("Resim yüklenemedi (CORS Hatası). Lütfen konsoldaki talimatları uygulayın.");
                        }
                        throw new Error("Resim yüklenirken hata oluştu: " + uploadError.message);
                    }
                }

                data.logo = finalLogoUrl;
                await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'settings', 'company'), data);
                return data;
            };

            // Race between save operation and timeout
            const savedData = await Promise.race([saveOperation(), timeoutPromise]);

            setSettings(savedData);
            alert("Ayarlar başarıyla kaydedildi! ✅");

        } catch (err) {
            console.error("FULL FIREBASE ERROR:", err.code, err.message, err);
            let message = err.message;
            if (err.code === 'permission-denied') {
                message = "YETKİ HATASI: Veritabanına yazma izniniz yok. Lütfen Firestore Kurallarını kontrol edin.";
            } else if (message.includes("offline")) {
                message = "Bağlantı hatası: İstemci çevrimdışı görünüyor. Sayfayı yenileyip tekrar deneyin.";
            }
            alert("HATA: " + message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6 print:hidden p-4 md:p-0 h-full overflow-y-auto pb-24 md:pb-0">
            <h1 className="text-2xl font-bold text-slate-900 hidden md:block">Firma Ayarları</h1>

            <div className="bg-white p-6 md:p-12 rounded-3xl border border-slate-200 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="flex items-start gap-4 p-5 bg-orange-50 rounded-2xl border border-orange-100 text-orange-800 text-sm font-medium">
                        <Info className="shrink-0" size={20} />
                        <p>Bu bilgiler ve logo, oluşturacağınız tüm PDF tekliflerin en üstünde otomatik olarak görünecektir.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-4">Firma Logosu</label>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="w-32 h-32 rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden relative group hover:border-orange-400 transition-colors">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                                ) : (
                                    <ImageIcon size={32} className="text-slate-300" />
                                )}
                            </div>
                            <div className="flex flex-col items-center md:items-start gap-3 pt-2">
                                <label className="cursor-pointer bg-white border border-slate-200 hover:border-orange-500 hover:text-orange-600 px-6 py-3 rounded-xl text-sm font-bold text-slate-700 transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
                                    <Upload size={18} /> Logo Yükle
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </label>
                                <div className="text-xs text-slate-400 font-medium">Maksimum 10MB (JPG/PNG)</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Firma Ünvanı</label>
                            <div className="relative">
                                <Building2 size={20} className="absolute left-4 top-3.5 text-slate-400" />
                                <Input name="companyName" defaultValue={settings?.companyName} className="pl-12" placeholder="Örn: Yapı Mimarlık Ltd. Şti." />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Telefon</label>
                            <div className="relative">
                                <Phone size={20} className="absolute left-4 top-3.5 text-slate-400" />
                                <Input name="phone" defaultValue={settings?.phone} className="pl-12" placeholder="05XX XXX XX XX" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Yetkili Kişi</label>
                            <div className="relative">
                                <User size={20} className="absolute left-4 top-3.5 text-slate-400" />
                                <Input name="contactPerson" defaultValue={settings?.contactPerson} className="pl-12" placeholder="Ad Soyad" />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Adres</label>
                            <div className="relative">
                                <MapPin size={20} className="absolute left-4 top-3.5 text-slate-400" />
                                <Input name="address" defaultValue={settings?.address} className="pl-12" placeholder="Mahalle, Cadde, No, İlçe/İl" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full text-lg shadow-xl shadow-orange-200"
                            disabled={saving} // Check disabled state
                        >
                            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
