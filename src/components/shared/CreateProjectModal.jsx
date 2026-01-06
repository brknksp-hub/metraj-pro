import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, APP_ID } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export function CreateProjectModal({ isOpen, onClose }) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const title = e.target.elements.projectTitle.value;
        const client = e.target.elements.clientName.value;

        if (!title || !user) return;

        setLoading(true);
        try {
            await addDoc(collection(db, 'artifacts', APP_ID, 'users', user.uid, 'projects'), {
                title,
                client,
                createdAt: serverTimestamp(),
                status: 'Devam Ediyor'
            });
            showToast("Proje başarıyla oluşturuldu!");
            onClose();
        } catch (err) {
            console.error(err);
            showToast("Hata oluştu: " + err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Yeni Proje">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Proje Adı</label>
                    <Input
                        name="projectTitle"
                        autoFocus
                        required
                        placeholder="Örn: Vadi Konutları"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Müşteri / Kurum</label>
                    <Input
                        name="clientName"
                        placeholder="Örn: XYZ İnşaat"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        İptal
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Oluşturuluyor...' : 'Oluştur'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
