import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';

import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, APP_ID } from '../lib/firebase';


export function DashboardLayout() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);

    // Fetch projects globally for the sidebar
    useEffect(() => {
        if (!user || !db) return;

        // Using the same structure as original: artifacts/{appId}/users/{uid}/projects
        const projectsRef = collection(db, 'artifacts', APP_ID, 'users', user.uid, 'projects');
        const q = query(projectsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (err) => console.error(err));

        return () => unsubscribe();
    }, [user]);

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden print:h-auto print:overflow-visible">
            <Sidebar projects={projects} />

            <main className="flex-1 flex flex-col overflow-hidden relative print:overflow-visible print:h-auto bg-[#f8fafc]">
                {/* We can put a standard header here or let pages define their own header. 
            The original had a changing header. We'll let pages handle the header content 
            or make a generic Header component if needed. For now, using direct Outlet. 
            But sticky mobile header logic might need to be in pages or here.
            Let's put the container scroll logic here.
        */}
                <div className="flex-1 overflow-y-auto w-full print:p-0 print:overflow-visible pb-24 md:pb-0 scroll-smooth">
                    <Outlet context={{ projects }} />
                </div>

                <MobileNav />

                {/* Footer Signature */}
                <div className="hidden md:block fixed bottom-4 right-6 text-[10px] text-slate-300 font-bold uppercase tracking-widest pointer-events-none select-none z-0 hover:text-slate-400 transition-colors">
                    created by brknksp
                </div>
            </main>
        </div>
    );
}
