export const CATEGORIES = [
    { id: 'kaba', name: 'Kaba İnşaat', color: '#F97316' }, // Orange-500
    { id: 'ince', name: 'İnce İşler', color: '#10B981' }, // Emerald-500
    { id: 'elektrik', name: 'Elektrik', color: '#EAB308' }, // Yellow-500
    { id: 'mekanik', name: 'Mekanik', color: '#EF4444' }, // Red-500
    { id: 'peyzaj', name: 'Peyzaj', color: '#8B5CF6' }, // Violet-500
    { id: 'genel', name: 'Genel Gider', color: '#64748B' }  // Slate-500
];

export const SUB_CATEGORY_DEFINITIONS = {
    kaba: [
        { name: 'Hazır Beton (C30)', unit: 'm3', code: '15.120.1003', price: 3250.00, locked: true },
        { name: 'İnşaat Demiri', unit: 'ton', code: '15.160.1004', price: 26500.00, locked: true },
        { name: 'Kalıp İşleri', unit: 'm2', code: '15.180.1001', price: 450.00, locked: true },
        { name: 'Tuğla Duvar', unit: 'm2', code: '15.250.1002', price: 380.00, locked: true },
        { name: 'Gazbeton', unit: 'm3', code: '15.260.1003', price: 2800.00, locked: true },
        { name: 'Çatı Kaplama', unit: 'm2', code: '15.290.1005', price: 1200.00, locked: true },
        { name: 'Kazı/Hafriyat', unit: 'm3', code: '15.110.1001', price: 300.00, locked: true },
        { name: 'Su Yalıtımı', unit: 'm2', code: '15.275.1002', price: 250.00, locked: true },
        { name: 'Diğer', unit: 'adet', code: '---', price: 0, locked: false }
    ],
    ince: [
        { name: 'Kaba Sıva', unit: 'm2', code: '15.280.1001', price: 180.00, locked: true },
        { name: 'Saten Alçı/Boya', unit: 'm2', code: '15.540.1003', price: 220.00, locked: true },
        { name: 'Seramik Kaplama', unit: 'm2', code: '15.420.1004', price: 650.00, locked: true },
        { name: 'Laminat Parke', unit: 'm2', code: '15.430.1002', price: 450.00, locked: true },
        { name: 'PVC Pencere', unit: 'm2', code: '15.650.1001', price: 3500.00, locked: true },
        { name: 'Panel Kapı', unit: 'adet', code: '15.660.1002', price: 4000.00, locked: true },
        { name: 'Mutfak Dolabı', unit: 'mt', code: 'ÖZEL.001', price: 8500.00, locked: true },
        { name: 'Asma Tavan', unit: 'm2', code: '15.530.1001', price: 550.00, locked: true },
        { name: 'Diğer', unit: 'adet', code: '---', price: 0, locked: false }
    ],
    elektrik: [
        { name: 'Kablolama', unit: 'mt', code: '35.100.1001', price: 85.00, locked: true },
        { name: 'Anahtar/Priz', unit: 'adet', code: '35.200.1002', price: 120.00, locked: true },
        { name: 'Aydınlatma', unit: 'adet', code: '35.300.1003', price: 450.00, locked: true },
        { name: 'Pano', unit: 'adet', code: '35.400.1004', price: 15000.00, locked: true },
        { name: 'Diğer', unit: 'adet', code: '---', price: 0, locked: false }
    ],
    mekanik: [
        { name: 'Temiz Su Borusu', unit: 'mt', code: '25.100.1001', price: 180.00, locked: true },
        { name: 'Pis Su Borusu', unit: 'mt', code: '25.200.1002', price: 220.00, locked: true },
        { name: 'Vitrifiye', unit: 'adet', code: '25.300.1003', price: 3500.00, locked: true },
        { name: 'Kombi', unit: 'adet', code: '25.400.1004', price: 25000.00, locked: true },
        { name: 'Radyatör', unit: 'mt', code: '25.500.1005', price: 2800.00, locked: true },
        { name: 'Diğer', unit: 'adet', code: '---', price: 0, locked: false }
    ],
    peyzaj: [
        { name: 'Toprak Serme', unit: 'm3', code: '10.100.1001', price: 600.00, locked: true },
        { name: 'Çim Ekimi', unit: 'm2', code: '10.100.1002', price: 250.00, locked: true },
        { name: 'Parke Taşı', unit: 'm2', code: '10.100.1003', price: 400.00, locked: true },
        { name: 'Bordür', unit: 'mt', code: '10.100.1004', price: 150.00, locked: true },
        { name: 'Diğer', unit: 'adet', code: '---', price: 0, locked: false }
    ],
    genel: [
        { name: 'Ruhsat Gideri', unit: 'adet', code: 'GNL.001', price: 150000.00, locked: false },
        { name: 'Şantiye Kurulum', unit: 'adet', code: 'GNL.002', price: 45000.00, locked: true },
        { name: 'Nakliye', unit: 'sefer', code: 'GNL.003', price: 5000.00, locked: true },
        { name: 'Personel (Günlük)', unit: 'gün', code: 'GNL.004', price: 2500.00, locked: true },
        { name: 'Diğer', unit: 'adet', code: '---', price: 0, locked: false }
    ]
};


export const UNITS = ['m2', 'm3', 'adet', 'ton', 'kg', 'mt', 'top', 'saat', 'gün', 'sefer', 'çuval', 'kutu'];
