import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, Folder, Briefcase, Settings } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ProjectCard } from '../../components/shared/ProjectCard';
import { CreateProjectModal } from '../../components/shared/CreateProjectModal';
import { deleteDoc, doc } from 'firebase/firestore';
import { db, APP_ID } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function DashboardPage() {
    const { projects } = useOutletContext();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDeleteProject = async (projectId) => {
        try {
            await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'projects', projectId));
            showToast("Proje silindi");
        } catch (err) {
            showToast("Silme hatası", "error");
        }
    };

    return (
        <div className="max-w-screen-2xl mx-auto space-y-8 p-4 md:p-10 print:hidden h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Projelerim</h1>
                    <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">Aktif şantiyelerinizi ve tekliflerinizi buradan yönetin.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="hidden md:flex">
                    <Plus size={20} /> Yeni Proje Oluştur
                </Button>
            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className="md:hidden fixed bottom-24 right-5 w-16 h-16 bg-orange-600 rounded-full shadow-[0_8px_30px_rgba(234,88,12,0.4)] text-white flex items-center justify-center z-40 active:scale-90 transition-transform"
            >
                <Plus size={32} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 text-slate-500">
                        <Folder size={24} className="text-orange-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-wider">Toplam Proje</span>
                    </div>
                    <div className="text-4xl font-black text-slate-900">{projects.length}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 text-slate-500">
                        <Briefcase size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-wider">Aktif İşler</span>
                    </div>
                    <div className="text-4xl font-black text-slate-900">{projects.length}</div>
                </div>
                <div className="hidden md:flex bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl shadow-xl text-white flex-col justify-between h-32">
                    <div className="flex items-center gap-3 text-orange-100">
                        <Settings size={24} />
                        <span className="text-sm font-bold uppercase tracking-wider">Firma Profili</span>
                    </div>
                    <div className="text-lg font-medium opacity-90">Logonuz ve bilgileriniz hazır.</div>
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mt-4">Son Projeler</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} onDelete={handleDeleteProject} />
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-300 mx-4 md:mx-0">
                        <div className="mx-auto bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                            <Folder className="text-slate-400" size={48} />
                        </div>
                        <h3 className="text-xl text-slate-900 font-bold">Henüz proje yok</h3>
                        <p className="text-slate-500 mt-2">Yeni bir proje oluşturarak başlayın.</p>
                    </div>
                )}
            </div>

            <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
