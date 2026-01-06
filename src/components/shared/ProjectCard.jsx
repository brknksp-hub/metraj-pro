import { Trash2, ChevronRight, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProjectCard({ project, onDelete }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/dashboard/project/${project.id}`)}
            className="bg-white group hover:border-orange-500/50 hover:ring-4 hover:ring-orange-50/20 transition-all border border-slate-200 rounded-2xl p-6 shadow-sm cursor-pointer relative flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                    <Construction className="text-orange-600" size={24} />
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Bu projeyi silmek istediğinize emin misiniz?")) {
                            onDelete(project.id);
                        }
                    }}
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">{project.title}</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">{project.client || 'Müşteri Belirtilmedi'}</p>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 uppercase tracking-wide">
                    {project.status || 'Devam Ediyor'}
                </span>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    );
}
