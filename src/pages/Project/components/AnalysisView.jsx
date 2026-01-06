import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { CATEGORIES } from '../../../lib/constants';
import { formatCurrency } from '../../../lib/utils';

export function AnalysisView({ items }) {
    const totalCost = items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0);

    const categoryData = useMemo(() => {
        const data = {};
        items.forEach(item => {
            const total = parseFloat(item.quantity) * parseFloat(item.unitPrice);
            if (data[item.category]) data[item.category] += total;
            else data[item.category] = total;
        });

        return Object.keys(data).map(key => ({
            name: CATEGORIES.find(c => c.id === key)?.name || key,
            value: data[key],
            color: CATEGORIES.find(c => c.id === key)?.color || '#ccc'
        }));
    }, [items]);

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-80 text-slate-300">
                <div className="bg-slate-50 p-8 rounded-full mb-6">
                    <PieChartIcon size={64} className="opacity-20" />
                </div>
                <p className="font-medium text-slate-400 text-lg">Analiz için önce veri girişi yapmalısınız.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[400px] m-4 md:m-0 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                <PieChartIcon className="text-orange-500" size={28} />
                <h3 className="font-bold text-xl text-slate-800">Maliyet Analizi</h3>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
                <div className="w-full h-[360px] max-w-sm relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={90}
                                outerRadius={125}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => formatCurrency(value)}
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                    padding: '12px 16px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">TOPLAM</span>
                        <span className="text-3xl font-black text-slate-800 tracking-tight">{formatCurrency(totalCost)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
                    {categoryData.map((cat, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all cursor-default group">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white group-hover:scale-110 transition-transform" style={{ backgroundColor: cat.color }}></div>
                                <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                            </div>
                            <span className="font-black text-base text-slate-900">{formatCurrency(cat.value)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
