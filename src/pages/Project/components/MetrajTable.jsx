import { Edit2, Trash2 } from 'lucide-react';
import { formatCurrency, cn } from '../../../lib/utils';
import { CATEGORIES } from '../../../lib/constants';

export function MetrajTable({ items, onEdit, onDelete, categoryFilter = 'all', textFilter = '' }) {
    const filteredItems = items.filter(item => {
        const matchesText = item.description.toLowerCase().includes(textFilter.toLowerCase()) ||
            item.subCategory?.toLowerCase().includes(textFilter.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesText && matchesCategory;
    });

    if (filteredItems.length === 0) {
        return (
            <div className="py-24 text-center flex flex-col items-center border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <span className="text-slate-400 font-medium text-lg">Kayıt bulunamadı.</span>
            </div>
        );
    }

    return (
        <>
            {/* Desktop View */}
            <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-8 py-5">Açıklama</th>
                            <th className="px-8 py-5">Sınıflandırma</th>
                            <th className="px-8 py-5 text-right">Miktar</th>
                            <th className="px-8 py-5 text-right">Birim Fiyat</th>
                            <th className="px-8 py-5 text-right">Tutar</th>
                            <th className="px-8 py-5 rounded-tr-2xl"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredItems.map(item => {
                            const cat = CATEGORIES.find(c => c.id === item.category);
                            const total = item.quantity * item.unitPrice;
                            return (
                                <tr key={item.id} className="group hover:bg-slate-50/80 transition-colors">
                                    <td className="px-8 py-5 font-bold text-slate-800 text-base">{item.description}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col items-start gap-1.5">
                                            <span
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wide shadow-sm"
                                                style={{ backgroundColor: `${cat?.color}10`, color: cat?.color, borderColor: `${cat?.color}20` }}
                                            >
                                                {cat?.name}
                                            </span>
                                            <span className="text-xs text-slate-500 pl-1 font-medium">{item.subCategory}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right text-slate-600 font-bold text-base">
                                        {item.quantity} <span className="text-sm font-normal text-slate-400">{item.unit}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right text-slate-600 font-medium">
                                        {formatCurrency(item.unitPrice)}
                                    </td>
                                    <td className="px-8 py-5 text-right font-black text-slate-900 text-lg tracking-tight">
                                        {formatCurrency(total)}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="text-slate-400 hover:text-white hover:bg-orange-500 p-2.5 rounded-xl transition-all shadow-sm"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="text-slate-400 hover:text-white hover:bg-red-500 p-2.5 rounded-xl transition-all shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 pb-20">
                {filteredItems.map(item => {
                    const cat = CATEGORIES.find(c => c.id === item.category);
                    const total = item.quantity * item.unitPrice;
                    return (
                        <div
                            key={item.id}
                            onClick={() => onEdit(item)}
                            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all relative overflow-hidden"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: cat?.color }}></div>
                            <div className="flex justify-between items-start mb-3 pl-4">
                                <div className="pr-4">
                                    <h4 className="font-bold text-slate-900 text-base leading-snug mb-1.5">{item.description}</h4>
                                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 font-medium">
                                        {item.subCategory}
                                        {item.dims && <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-lg border border-orange-100 text-[10px] font-bold tracking-wide">{item.dims}</span>}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="font-black text-emerald-600 text-lg tracking-tight">{formatCurrency(total)}</div>
                                    <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg inline-block mt-1">
                                        {formatCurrency(item.unitPrice)} / {item.unit}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pl-4 mt-4 pt-3 border-t border-slate-50">
                                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
                                    {item.quantity} {item.unit}
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
                                    className="text-slate-300 hover:text-red-500 p-2 -mr-2"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
