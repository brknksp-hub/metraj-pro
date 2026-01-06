import { Printer, X, Construction } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { CATEGORIES } from '../../../lib/constants';
import { formatCurrency } from '../../../lib/utils';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, APP_ID } from '../../../lib/firebase';
import { useAuth } from '../../../contexts/AuthContext';

export function ProposalView({ project, items, onClose }) {
    const { user } = useAuth();
    const [companySettings, setCompanySettings] = useState(null);
    const totalCost = items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0);

    useEffect(() => {
        if (!user || !db) return;
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'settings', 'company');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCompanySettings(docSnap.data());
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchSettings();
    }, [user]);

    return (
        <div className="fixed inset-0 bg-slate-100 overflow-y-auto z-50 flex flex-col items-center p-4 print:p-0 print:bg-white print:static print:h-auto print:overflow-visible">
            {/* Controls - Hidden in print */}
            <div className="w-full max-w-[210mm] mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm print:hidden">
                <h2 className="font-bold text-slate-700">Teklif Önizleme</h2>
                <div className="flex gap-2">
                    <Button onClick={() => window.print()} className="gap-2">
                        <Printer size={16} /> <span className="hidden sm:inline">Yazdır</span>
                    </Button>
                    <Button onClick={onClose} variant="secondary" className="gap-2">
                        <X size={16} /> Kapat
                    </Button>
                </div>
            </div>

            {/* A4 Page */}
            <div className="bg-white w-full max-w-[210mm] min-h-[297mm] p-8 md:p-16 shadow-none md:shadow-2xl print:shadow-none print:w-full print:max-w-none text-slate-900 print:m-0">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-8 mb-8">
                    <div className="flex gap-6 items-start">
                        {companySettings?.logo ? (
                            <img src={companySettings.logo} alt="Firma Logo" className="h-24 w-auto object-contain" />
                        ) : (
                            <div className="flex items-center justify-center w-24 h-24 bg-slate-100 rounded-2xl text-orange-600">
                                <Construction size={48} />
                            </div>
                        )}
                        <div>
                            {companySettings ? (
                                <>
                                    <span className="text-3xl font-black tracking-tight uppercase block text-slate-900">{companySettings.companyName}</span>
                                    <div className="text-base text-slate-500 mt-2 font-medium leading-relaxed">
                                        {companySettings.address}<br />
                                        {companySettings.phone}<br />
                                        {companySettings.contactPerson}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="text-3xl font-black tracking-tight block text-slate-900">METRAJPRO</span>
                                    <div className="text-sm text-slate-500 mt-2">
                                        Örnek İnşaat Ltd.<br />(Firma bilgilerinizi ayarlardan giriniz)
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="text-right">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">TEKLİF</h1>
                        <div className="mt-2 text-base text-slate-500 font-bold">
                            Tarih: {new Date().toLocaleDateString('tr-TR')}<br />
                            Teklif No: #{project.id.slice(0, 6).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Client Info */}
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 mb-10">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">SAYIN / FİRMA</h3>
                    <div className="text-2xl font-bold text-slate-900">{project.client}</div>
                    <div className="text-slate-600 mt-1 font-medium text-lg">{project.title} Projesi Kapsamında</div>
                </div>

                {/* Table */}
                <table className="w-full mb-10 text-sm">
                    <thead className="bg-slate-900 text-white">
                        <tr>
                            <th className="py-4 px-6 text-left rounded-l-xl font-bold uppercase tracking-wider">Açıklama</th>
                            <th className="py-4 px-6 text-left font-bold uppercase tracking-wider">Kategori</th>
                            <th className="py-4 px-6 text-right font-bold uppercase tracking-wider">Miktar</th>
                            <th className="py-4 px-6 text-right font-bold uppercase tracking-wider">B. Fiyat</th>
                            <th className="py-4 px-6 text-right rounded-r-xl font-bold uppercase tracking-wider">Toplam</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item, index) => (
                            <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="py-4 px-6">
                                    <div className="font-bold text-slate-900 text-base">{item.description}</div>
                                    <div className="text-xs text-slate-500 font-medium mt-1">
                                        {item.subCategory} {item.dims && `(${item.dims})`}
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-slate-600 font-medium">
                                    {CATEGORIES.find(c => c.id === item.category)?.name}
                                </td>
                                <td className="py-4 px-6 text-right text-slate-700 font-bold">
                                    {item.quantity} {item.unit}
                                </td>
                                <td className="py-4 px-6 text-right text-slate-700 font-medium">
                                    {formatCurrency(item.unitPrice)}
                                </td>
                                <td className="py-4 px-6 text-right font-black text-slate-900 text-base">
                                    {formatCurrency(item.quantity * item.unitPrice)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="4" className="pt-8 text-right font-black text-2xl tracking-tight">GENEL TOPLAM</td>
                            <td className="pt-8 text-right font-black text-2xl text-orange-600 tracking-tight">
                                {formatCurrency(totalCost)}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="5" className="text-right text-xs text-slate-400 font-bold pt-2 uppercase tracking-wide">
                                (Fiyatlara KDV Dahil Değildir)
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* Footer Terms */}
                <div className="grid grid-cols-2 gap-16 mt-20 pt-10 border-t-2 border-slate-100 page-break-inside-avoid">
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4 text-lg">Şartlar & Koşullar</h4>
                        <ul className="list-disc list-inside text-sm text-slate-500 space-y-2 font-medium">
                            <li>Bu teklif 15 gün süreyle geçerlidir.</li>
                            <li>Ödeme planı sözleşme aşamasında belirlenecektir.</li>
                            <li>Ekstra işler ayrıca fiyatlandırılacaktır.</li>
                        </ul>
                    </div>
                    <div className="text-center">
                        <div className="h-32 mb-4 border-b-2 border-slate-300"></div>
                        <div className="font-bold text-slate-900 text-lg">YETKİLİ İMZA / KAŞE</div>
                        <div className="text-sm text-slate-500 mt-1 font-medium">
                            {companySettings ? companySettings.companyName : 'Firma Yetkilisi'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
