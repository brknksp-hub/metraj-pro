import pozlarData from '../pozlar.json';

// Helper to deduce category if not explicitly set (fallback)
export const inferCategory = (pozNo) => {
    if (pozNo.startsWith('15')) return 'kaba'; // Most construction items
    if (pozNo.startsWith('25')) return 'mekanik';
    if (pozNo.startsWith('35')) return 'elektrik';
    if (pozNo.startsWith('10')) return 'peyzaj';
    return 'genel';
};

const hardcodedData = [
    // KAZI VE HAFRİYAT İŞLERİ
    { pozNo: "15.120.1001", description: "Makine ile yumuşak ve sert toprak kazılması (Serbest kazı)", unit: "m3", unitPrice: 85.50, category: 'kaba' },
    { pozNo: "15.120.1002", description: "Makine ile yumuşak ve sert küskülük kazılması", unit: "m3", unitPrice: 120.75, category: 'kaba' },
    { pozNo: "15.120.1003", description: "Makine ile kaya kazılması", unit: "m3", unitPrice: 180.00, category: 'kaba' },

    // DOLGU VE TESVİYE
    { pozNo: "15.140.1001", description: "Kazı malzemesi ile dolgu yapılması ve sıkıştırılması", unit: "m3", unitPrice: 65.20, category: 'kaba' },

    // BETON İŞLERİ (HAZIR BETON)
    { pozNo: "15.150.1001", description: "C16/20 Hazır Beton Dökülmesi (Pompalı)", unit: "m3", unitPrice: 2450.00, category: 'kaba' },
    { pozNo: "15.150.1002", description: "C20/25 Hazır Beton Dökülmesi (Pompalı)", unit: "m3", unitPrice: 2550.00, category: 'kaba' },
    { pozNo: "15.150.1003", description: "C25/30 Hazır Beton Dökülmesi (Pompalı)", unit: "m3", unitPrice: 2650.00, category: 'kaba' },
    { pozNo: "15.150.1004", description: "C30/37 Hazır Beton Dökülmesi (Pompalı)", unit: "m3", unitPrice: 2800.00, category: 'kaba' },
    { pozNo: "15.150.1005", description: "C35/45 Hazır Beton Dökülmesi (Pompalı)", unit: "m3", unitPrice: 2950.00, category: 'kaba' },

    // DEMİR İŞLERİ
    { pozNo: "15.160.1001", description: "Ø8-Ø12 mm Nervürlü Beton Çelik Çubuğu", unit: "ton", unitPrice: 24500.00, category: 'kaba' },
    { pozNo: "15.160.1002", description: "Ø14-Ø32 mm Nervürlü Beton Çelik Çubuğu", unit: "ton", unitPrice: 24000.00, category: 'kaba' },
    { pozNo: "15.160.1003", description: "Çelik Hasır", unit: "ton", unitPrice: 26500.00, category: 'kaba' },

    // DUVAR İŞLERİ
    { pozNo: "15.180.1001", description: "19x19x13.5 cm Yatay Delikli Tuğla Duvar", unit: "m2", unitPrice: 450.00, category: 'kaba' },
    { pozNo: "15.180.1002", description: "19x19x8.5 cm Yatay Delikli Tuğla Duvar", unit: "m2", unitPrice: 380.00, category: 'kaba' },
    { pozNo: "15.180.1005", description: "Gazbeton Duvar (10 cm)", unit: "m2", unitPrice: 550.00, category: 'kaba' },
    { pozNo: "15.180.1006", description: "Gazbeton Duvar (15 cm)", unit: "m2", unitPrice: 720.00, category: 'kaba' },

    // SIVA VE BOYA
    { pozNo: "15.270.1001", description: "Kireç-Çimento Karışımı Kaba Sıva", unit: "m2", unitPrice: 180.00, category: 'ince' },
    { pozNo: "15.270.1002", description: "Alçı Sıva Yapılması (Perlitli)", unit: "m2", unitPrice: 210.00, category: 'ince' },
    { pozNo: "15.540.1001", description: "Su Bazlı Plastik Boya (2 Kat)", unit: "m2", unitPrice: 120.00, category: 'ince' },
    { pozNo: "15.540.1002", description: "Silikonlu Dış Cephe Boyası", unit: "m2", unitPrice: 160.00, category: 'ince' },

    // KAPLAMA
    { pozNo: "15.420.1001", description: "Seramik Yer Karosu (33x33 cm)", unit: "m2", unitPrice: 650.00, category: 'ince' },
    { pozNo: "15.420.1002", description: "Laminat Parke Kaplama", unit: "m2", unitPrice: 580.00, category: 'ince' }
];

const mappedPozlar = pozlarData.map(item => ({
    pozNo: item.pozNo,
    description: item.tanim,
    unit: item.birim,
    unitPrice: item.birimFiyat,
    category: inferCategory(item.pozNo)
}));

export const ministryData = [
    ...hardcodedData,
    ...mappedPozlar
];
