import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileSpreadsheet, FileText, Calculator, Edit2, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MetrajTable } from './components/MetrajTable';
import { ItemForm } from './components/ItemForm';
import { AnalysisView } from './components/AnalysisView';
import { ProposalView } from './components/ProposalView';
import { CATEGORIES } from '../../lib/constants';
import { formatCurrency, downloadCSV } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { db, APP_ID } from '../../lib/firebase';
import {
    doc, getDoc, collection, query, where, onSnapshot,
    addDoc, updateDoc, deleteDoc, serverTimestamp
} from 'firebase/firestore';

export default function ProjectPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [project, setProject] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('metraj');
    const [proposalMode, setProposalMode] = useState(false);

    // Filters
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [textFilter, setTextFilter] = useState('');

    // Editing state
    const [editingItem, setEditingItem] = useState(null);
    const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);

    // Accordion State
    const [isFormExpanded, setIsFormExpanded] = useState(false);

    // Fetch Project & Items
    useEffect(() => {
        if (!user || !projectId) return;

        // Fetch Project Details
        const fetchProject = async () => {
            try {
                const docRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'projects', projectId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProject({ id: docSnap.id, ...docSnap.data() });
                } else {
                    showToast("Proje bulunamadı", "error");
                    navigate('/');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();

        // Subscribe to Items
        const itemsRef = collection(db, 'artifacts', APP_ID, 'users', user.uid, 'items');
        const q = query(itemsRef, where('projectId', '==', projectId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            allItems.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setItems(allItems);
        });

        return () => unsubscribe();
    }, [user, projectId, navigate]);

    const handleAddItem = async (itemData) => {
        try {
            await addDoc(collection(db, 'artifacts', APP_ID, 'users', user.uid, 'items'), {
                projectId,
                ...itemData,
                createdAt: serverTimestamp()
            });
            showToast("Kalem listeye eklendi");
            setIsMobileFormOpen(false);
            setIsFormExpanded(false); // Collapse after adding
        } catch (err) {
            showToast("Ekleme başarısız: " + err.message, "error");
        }
    };

    const handleUpdateItem = async (formData) => {
        if (!editingItem) return;
        try {
            await updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'items', editingItem.id), {
                ...formData,
                updatedAt: serverTimestamp()
            });
            showToast("Kalem güncellendi");
            setEditingItem(null);
            setIsMobileFormOpen(false);
            setIsFormExpanded(false);
        } catch (err) {
            showToast("Güncelleme başarısız", "error");
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!confirm('Bu kalemi silmek istediğinize emin misiniz?')) return;
        try {
            await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'items', itemId));
            showToast("Kalem silindi");
        } catch (err) {
            showToast("Silme hatası", "error");
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        // On desktop, expand form and scroll to it
        // On mobile, open sheet
        if (window.innerWidth >= 768) {
            setIsFormExpanded(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setIsMobileFormOpen(true);
        }
    };

    const totalCost = items.reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.unitPrice)), 0);

    if (loading) return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>;
    if (!project) return null;

    if (proposalMode) {
        return <ProposalView project={project} items={items} onClose={() => setProposalMode(false)} />;
    }

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col md:block print:hidden">
            {/* Mobile Sticky Header */}
            <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-4 h-16">
                    <div className="flex items-center gap-3 w-full">
                        <Link to="/dashboard" className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft size={22} />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <h1 className="font-bold text-slate-800 truncate text-lg">{project.title}</h1>
                            <p className="text-xs text-slate-500 truncate">{project.client}</p>
                        </div>
                        <button
                            onClick={() => setProposalMode(true)}
                            className="p-2.5 text-orange-600 bg-orange-50 rounded-xl border border-orange-100"
                        >
                            <FileText size={20} />
                        </button>
                    </div>
                </div>
                <div className="px-4 pb-3 flex gap-2">
                    <Button
                        onClick={() => setActiveTab('metraj')}
                        variant={activeTab === 'metraj' ? 'primary' : 'secondary'}
                        size="sm"
                        className={activeTab === 'metraj' ? 'bg-slate-800 hover:bg-slate-900 shadow-none' : ''}
                    >
                        Metraj Listesi
                    </Button>
                    <Button
                        onClick={() => setActiveTab('analiz')}
                        variant={activeTab === 'analiz' ? 'primary' : 'secondary'}
                        size="sm"
                        className={activeTab === 'analiz' ? 'bg-slate-800 hover:bg-slate-900 shadow-none' : ''}
                    >
                        Maliyet Analizi
                    </Button>
                </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between gap-6 mb-8 mt-4 md:mt-0">
                <div className="flex items-center gap-5">
                    <Link to="/dashboard" className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-full text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{project.title}</h1>
                        <p className="text-slate-500 font-medium text-lg">{project.client}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => downloadCSV(items, `${project.title}-metraj.csv`, CATEGORIES)}
                        title="Excel'e Aktar"
                    >
                        <FileSpreadsheet size={20} className="text-emerald-600" />
                        <span className="hidden sm:inline ml-2">Excel</span>
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => setProposalMode(true)}
                        title="Teklif Hazırla"
                    >
                        <FileText size={20} className="text-orange-600" />
                        <span className="hidden sm:inline ml-2">Teklif Hazırla</span>
                    </Button>

                    <div className="bg-slate-900 px-6 py-3 rounded-xl shadow-lg shadow-slate-200 ml-2 flex flex-col items-end min-w-[160px]">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">TOPLAM TUTAR</div>
                        <div className="text-2xl font-black text-white tracking-tight">{formatCurrency(totalCost)}</div>
                    </div>
                </div>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:flex space-x-1 bg-white p-1.5 rounded-xl w-fit mb-8 border border-slate-200 shadow-sm">
                <button
                    onClick={() => setActiveTab('metraj')}
                    className={selected => `px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'metraj' ? 'bg-orange-50 text-orange-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    Metraj Listesi
                </button>
                <button
                    onClick={() => setActiveTab('analiz')}
                    className={selected => `px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'analiz' ? 'bg-orange-50 text-orange-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                    Maliyet Analizi
                </button>
            </div>

            {activeTab === 'metraj' && (
                <div className="flex flex-col gap-8 pb-24 md:pb-0">

                    {/* Accordion Form Section */}
                    <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                        <div
                            onClick={() => setIsFormExpanded(!isFormExpanded)}
                            className={`p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${isFormExpanded ? 'border-b border-slate-100' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl transition-all ${editingItem || isFormExpanded ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {editingItem ? <Edit2 size={24} /> : <Plus size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{editingItem ? 'Kalemi Düzenle' : 'Yeni Kalem Ekle'}</h3>
                                    <p className="text-sm text-slate-500 font-medium">Projenize yeni metraj kalemi eklemek için tıklayın.</p>
                                </div>
                            </div>
                            <button className="p-2 rounded-full hover:bg-slate-200 text-slate-400">
                                {isFormExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                            </button>
                        </div>

                        {isFormExpanded && (
                            <div className="p-8 bg-white animate-in slide-in-from-top-4 duration-300">
                                <ItemForm
                                    initialData={editingItem}
                                    onSubmit={editingItem ? handleUpdateItem : handleAddItem}
                                    onCancel={() => {
                                        setEditingItem(null);
                                        setIsFormExpanded(false);
                                    }}
                                    isEditing={!!editingItem}
                                />
                            </div>
                        )}
                    </div>

                    {/* Main List Area */}
                    <div className="space-y-6 px-4 md:px-0">
                        {/* Filters */}
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                            <button
                                onClick={() => setCategoryFilter('all')}
                                className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${categoryFilter === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                            >
                                Tümü
                            </button>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategoryFilter(cat.id)}
                                    className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${categoryFilter === cat.id ? 'text-white shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                    style={{ backgroundColor: categoryFilter === cat.id ? cat.color : 'white', borderColor: categoryFilter === cat.id ? cat.color : undefined }}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Metraj Table */}
                        <MetrajTable
                            items={items}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteItem}
                            categoryFilter={categoryFilter}
                            textFilter={textFilter}
                        />
                    </div>
                </div>
            )}

            {activeTab === 'analiz' && (
                <AnalysisView items={items} />
            )}

            {/* Mobile Add FAB */}
            <button
                onClick={() => { setEditingItem(null); setIsMobileFormOpen(true); }}
                className="md:hidden fixed bottom-24 right-5 w-16 h-16 bg-orange-600 rounded-full shadow-[0_8px_30px_rgba(234,88,12,0.5)] text-white flex items-center justify-center z-40 active:scale-90 transition-transform border-4 border-white/20"
            >
                <Plus size={32} />
            </button>

            {/* Mobile Form Sheet */}
            {isMobileFormOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileFormOpen(false)}
                    ></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 h-[85vh] flex flex-col shadow-[0_-10px_60px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-full duration-300">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8 shrink-0"></div>
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="font-bold text-xl text-slate-900">{editingItem ? 'Kalemi Düzenle' : 'Yeni Kalem Ekle'}</h3>
                            <button onClick={() => setIsMobileFormOpen(false)} className="bg-slate-50 hover:bg-slate-100 p-2.5 rounded-full transition-colors">
                                <X size={22} className="text-slate-500" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto pb-10">
                            <ItemForm
                                initialData={editingItem}
                                onSubmit={editingItem ? handleUpdateItem : handleAddItem}
                                onCancel={() => setIsMobileFormOpen(false)}
                                isEditing={!!editingItem}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
