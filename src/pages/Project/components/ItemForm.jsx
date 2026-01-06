import { useState, useEffect, useMemo } from 'react';
import { Calculator, Save, X, Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { CATEGORIES, SUB_CATEGORY_DEFINITIONS, UNITS } from '../../../lib/constants';
import { ministryData, inferCategory } from '../../../lib/ministryData';
import { cn } from '../../../lib/utils';

export function ItemForm({ initialData, onSubmit, onCancel, isEditing }) {
    const [formData, setFormData] = useState({
        pozNo: '',
        description: '',
        category: 'kaba',
        subCategory: '',
        quantity: '',
        unit: 'adet',
        unitPrice: '',
        dims: ''
    });

    const [dims, setDims] = useState({ w: '', l: '', h: '', c: '1' });
    const [isCalculated, setIsCalculated] = useState(false);
    const [isUnitLocked, setIsUnitLocked] = useState(true);
    const [foundPoz, setFoundPoz] = useState(false);

    // Initialize
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);

            // Determine lock state from subcategory OR if it was a poz item (assuming user didn't change it manually)
            const defs = SUB_CATEGORY_DEFINITIONS[initialData.category] || [];
            const subDef = defs.find(d => d.name === initialData.subCategory);
            setIsUnitLocked(subDef?.locked === true || !!initialData.pozNo);
            setFoundPoz(!!initialData.pozNo);

        } else {
            const firstSub = SUB_CATEGORY_DEFINITIONS['kaba'][0];
            setFormData(prev => ({
                ...prev,
                pozNo: '',
                category: 'kaba',
                subCategory: firstSub.name,
                unit: firstSub.unit,
                unitPrice: firstSub.price || ''
            }));
            setIsUnitLocked(firstSub.locked === true);
        }
    }, [initialData]);

    const currentSubCategories = useMemo(() =>
        SUB_CATEGORY_DEFINITIONS[formData.category] || [],
        [formData.category]
    );

    const handlePozNoChange = (e) => {
        const val = e.target.value;

        // Search in Ministry Data
        const match = ministryData.find(m => m.pozNo === val);

        if (match) {
            // Auto-fill found data
            setFormData(prev => ({
                ...prev,
                pozNo: val,
                description: match.description,
                category: match.category || inferCategory(val),
                subCategory: 'Diğer', // Since it's a specific Poz, we set subCategory to Other/Custom to avoid conflict with standard list
                unit: match.unit,
                unitPrice: match.unitPrice,
            }));
            setIsUnitLocked(true);
            setFoundPoz(true);
        } else {
            // Just update value, don't reset everything immediately to allow typing
            setFormData(prev => ({ ...prev, pozNo: val }));
            setFoundPoz(false);
        }
    };

    const handleCategoryChange = (e) => {
        const cat = e.target.value;
        const subs = SUB_CATEGORY_DEFINITIONS[cat] || [];
        const first = subs[0];

        setFormData(prev => ({
            ...prev,
            category: cat,
            subCategory: first ? first.name : '',
            unit: first ? first.unit : 'adet',
            unitPrice: first ? (first.price || '') : '',
            quantity: '',
            dims: ''
        }));

        setIsUnitLocked(first?.locked === true);
        setDims({ w: '', l: '', h: '', c: '1' });
        setIsCalculated(false);
    };

    const handleSubCategoryChange = (e) => {
        const subName = e.target.value;
        const subObj = currentSubCategories.find(s => s.name === subName);

        if (subObj) {
            setFormData(prev => ({
                ...prev,
                subCategory: subName,
                unit: subObj.unit,
                unitPrice: subObj.price || ''
            }));
            setIsUnitLocked(subObj.locked === true);
            setDims({ w: '', l: '', h: '', c: '1' });
            setIsCalculated(false);
        }
    };

    const showWidth = ['m2', 'm3'].includes(formData.unit);
    const showLength = ['m2', 'm3', 'mt'].includes(formData.unit);
    const showHeight = ['m3'].includes(formData.unit);
    const showCount = ['m2', 'm3', 'mt'].includes(formData.unit);

    // Smart Quantity Logic
    useEffect(() => {
        const isDimensional = showWidth || showLength || showHeight;
        const hasDimInput = (dims.w && parseFloat(dims.w) !== 0) ||
            (dims.l && parseFloat(dims.l) !== 0) ||
            (dims.h && parseFloat(dims.h) !== 0);

        if (isDimensional && hasDimInput) {
            setIsCalculated(true);
            const w = parseFloat(dims.w) || 0;
            const l = parseFloat(dims.l) || 0;
            const h = parseFloat(dims.h) || 0;
            const c = parseFloat(dims.c) || 0;

            let result = 0;
            let dimsString = '';

            if (formData.unit === 'm3') {
                if (w && l && h && c) {
                    result = w * l * h * c;
                    dimsString = `${w}x${l}x${h} (${c} ad.)`;
                }
            } else if (formData.unit === 'm2') {
                if (w && l && c) {
                    result = w * l * c;
                    dimsString = `${w}x${l} (${c} ad.)`;
                }
            } else if (formData.unit === 'mt') {
                if (l && c) {
                    result = l * c;
                    dimsString = `${l}mt (${c} ad.)`;
                }
            }

            if (result > 0) {
                setFormData(prev => ({
                    ...prev,
                    quantity: result.toFixed(2),
                    dims: dimsString
                }));
            }
        } else {
            setIsCalculated(false);
        }
    }, [dims, formData.unit, showWidth, showLength, showHeight]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* ROW 1: Poz & Classification */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Poz No</label>
                    <div className="relative">
                        <Input
                            name="pozNo"
                            value={formData.pozNo}
                            onChange={handlePozNoChange}
                            placeholder="15.150..."
                            className={cn("text-slate-900 font-bold", foundPoz ? "border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-100" : "")}
                        />
                        <div className="absolute right-3 top-3 text-slate-400">
                            <Search size={20} />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium appearance-none text-slate-900 cursor-pointer"
                    >
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Açıklama / İş Kalemi</label>
                    {foundPoz ? (
                        <Input
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="text-slate-900 bg-slate-50 font-medium"
                        />
                    ) : (
                        <div className="flex gap-2">
                            <select
                                name="subCategory"
                                value={formData.subCategory}
                                onChange={handleSubCategoryChange}
                                className="w-1/3 px-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none text-slate-900 font-medium"
                            >
                                {currentSubCategories.map(sub => <option key={sub.name} value={sub.name}>{sub.name}</option>)}
                            </select>
                            <Input
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detaylı Açıklama (Örn: Salon Duvarı)"
                                className="w-2/3 text-slate-900 bg-white"
                            />
                        </div>
                    )}
                </div>

                {/* ROW 2: Calculations */}
                {(showWidth || showLength || showHeight) && (
                    <div className="md:col-span-4 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                        <div className="grid grid-cols-4 gap-6 items-end">
                            {showWidth && (
                                <div>
                                    <label className="block text-xs font-bold text-orange-900 mb-2">EN (m)</label>
                                    <Input type="number" step="0.01" value={dims.w} onChange={e => setDims({ ...dims, w: e.target.value })} className="bg-white text-slate-900 font-bold text-lg" placeholder="0.00" />
                                </div>
                            )}
                            {showLength && (
                                <div>
                                    <label className="block text-xs font-bold text-orange-900 mb-2">BOY (m)</label>
                                    <Input type="number" step="0.01" value={dims.l} onChange={e => setDims({ ...dims, l: e.target.value })} className="bg-white text-slate-900 font-bold text-lg" placeholder="0.00" />
                                </div>
                            )}
                            {showHeight && (
                                <div>
                                    <label className="block text-xs font-bold text-orange-900 mb-2">YÜKSEKLİK (m)</label>
                                    <Input type="number" step="0.01" value={dims.h} onChange={e => setDims({ ...dims, h: e.target.value })} className="bg-white text-slate-900 font-bold text-lg" placeholder="0.00" />
                                </div>
                            )}
                            {showCount && (
                                <div>
                                    <label className="block text-xs font-bold text-orange-900 mb-2">ADET (Çarpan)</label>
                                    <Input type="number" value={dims.c} onChange={e => setDims({ ...dims, c: e.target.value })} className="bg-white text-slate-900 font-bold text-lg" placeholder="1" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ROW 3: Results */}
                <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Miktar {isCalculated && <span className="text-orange-600 font-normal ml-1">(Otomatik)</span>}
                    </label>
                    <Input
                        name="quantity"
                        type="number"
                        step="0.01"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        className={cn(
                            "text-slate-900 font-black text-lg transition-colors",
                            isCalculated ? "bg-slate-100 cursor-not-allowed" : "bg-white"
                        )}
                        readOnly={isCalculated}
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Birim</label>
                    <div className="relative">
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            disabled={isUnitLocked}
                            className={cn(
                                "w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-orange-500 appearance-none",
                                isUnitLocked ? "bg-slate-100 text-slate-500 cursor-not-allowed" : "bg-white cursor-pointer"
                            )}
                        >
                            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        {isUnitLocked && <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 pl-2">Kilitli</span>}
                    </div>
                </div>
                <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Birim Fiyat (TL)</label>
                    <Input
                        name="unitPrice"
                        type="number"
                        step="0.01"
                        value={formData.unitPrice}
                        onChange={handleChange}
                        required
                        className="text-slate-900 font-bold"
                    />
                </div>
                <div className="md:col-span-1 flex items-end">
                    <div className="w-full p-3 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-end justify-center h-[52px]">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Tahmini Tutar</span>
                        <span className="font-black text-slate-900">
                            {formData.quantity && formData.unitPrice
                                ? (parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })
                                : '₺0,00'}
                        </span>
                    </div>
                </div>

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel} className="px-8">
                        İptal
                    </Button>
                )}
                <Button type="submit" className="px-8 shadow-lg shadow-orange-200 text-lg" variant={isEditing ? 'outline' : 'primary'}>
                    <Save size={18} className="mr-2" />
                    {isEditing ? 'Güncelle' : 'Kaydet'}
                </Button>
            </div>
        </form>
    );
}
