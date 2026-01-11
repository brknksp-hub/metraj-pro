import re
import json
import os


new_raw_text = """
**10.130.2679** | 17,5 cm kalınlıkta techizatlı gazbeton lento (600 kg/m³) | m² | 970,37
**10.130.2680** | 19 cm kalınlıkta techizatlı gazbeton lento (600 kg/m³) | m² | 1.053,54
**10.130.2681** | 20 cm kalınlıkta techizatlı gazbeton lento (600 kg/m³) | m² | 1.108,99
**10.130.2682** | 22,5 cm kalınlıkta techizatlı gazbeton lento (600 kg/m³) | m² | 1.247,62
**10.130.2683** | 25 cm kalınlıkta techizatlı gazbeton lento (600 kg/m³) | m² | 1.386,24
**10.130.2684** | 27,5 cm kalınlıkta techizatlı gazbeton lento (600 kg/m³) | m² | 1.524,36
**10.130.2685** | 30 cm kalınlıkta techizatlı gazbeton lento (600 kg/m³) | m² | 1.663,49
**10.130.2686** | 32,5 cm kalınlıkta techizatlı gazbeton lento (600 kg/m³) | m² | 1.802,11
**10.130.2687** | 35 cm kalınlıkta techizatlı gazbeton lento (600 kg/m³) | m² | 1.940,70
**10.130.2701** | Techizatlı gazbeton döşeme elemanı (600 kg/m³) | m³ | 5.248,00
**10.130.2702** | 10 cm kalınlıkta techizatlı gazbeton döşeme elemanı | m² | 524,80
**10.130.2703** | 12,5 cm kalınlıkta techizatlı gazbeton döşeme elemanı | m² | 656,00
**10.130.2704** | 15 cm kalınlıkta techizatlı gazbeton döşeme elemanı | m² | 787,20
**10.130.2705** | 17,5 cm kalınlıkta techizatlı gazbeton döşeme elemanı | m² | 918,40
**10.130.2706** | 20 cm kalınlıkta techizatlı gazbeton döşeme elemanı | m² | 1.049,60
**10.130.2707** | 22,5 cm kalınlıkta techizatlı gazbeton döşeme elemanı | m² | 1.180,80
**10.130.2708** | 25 cm kalınlıkta techizatlı gazbeton döşeme elemanı | m² | 1.312,00
**10.130.2709** | 27,5 cm kalınlıkta techizatlı gazbeton döşeme elemanı | m² | 1.443,20
**10.130.2721** | Techizatlı gazbeton çatı elemanı (500 kg/m³) | m³ | 4.669,00
**10.130.2722** | 10 cm kalınlıkta techizatlı gazbeton çatı elemanı | m² | 466,94
**10.130.2743** | 12,5 cm kalınlıkta techizatlı gazbeton duvar elemanı | m² | 583,68
**10.130.2744** | 15 cm kalınlıkta techizatlı gazbeton duvar elemanı | m² | 700,42
**10.130.2745** | 17,5 cm kalınlıkta techizatlı gazbeton duvar elemanı | m² | 817,15
**10.130.2746** | 20 cm kalınlıkta techizatlı gazbeton duvar elemanı | m² | 933,89
**10.130.2747** | 22,5 cm kalınlıkta techizatlı gazbeton duvar elemanı | m² | 1.050,62
**10.130.2748** | 25 cm kalınlıkta techizatlı gazbeton duvar elemanı | m² | 1.167,36
**10.130.2749** | 27,5 cm kalınlıkta techizatlı gazbeton duvar elemanı | m² | 1.284,10
**10.130.2750** | 30 cm kalınlıkta techizatlı gazbeton duvar elemanı | m² | 1.400,83
**10.130.2761** | Techizatlı gazbeton duvar elemanı (600 kg/m³) | m³ | 5.544,96
**10.130.2762** | 10 cm kalınlıkta techizatlı gazbeton duvar elemanı (600 kg/m³) | m² | 554,50
**10.130.2763** | 12,5 cm kalınlıkta techizatlı gazbeton duvar elemanı (600 kg/m³) | m² | 693,12
**10.130.2764** | 15 cm kalınlıkta techizatlı gazbeton duvar elemanı (600 kg/m³) | m² | 831,74
**10.130.2765** | 17,5 cm kalınlıkta techizatlı gazbeton duvar elemanı (600 kg/m³) | m² | 970,37
**10.130.2766** | 20 cm kalınlıkta techizatlı gazbeton duvar elemanı (600 kg/m³) | m² | 1.108,99
**10.130.2767** | 22,5 cm kalınlıkta techizatlı gazbeton duvar elemanı (600 kg/m³) | m² | 1.247,62
**10.130.2768** | 25 cm kalınlıkta techizatlı gazbeton duvar elemanı (600 kg/m³) | m² | 1.386,24
**10.130.2769** | 27,5 cm kalınlıkta techizatlı gazbeton duvar elemanı (600 kg/m³) | m² | 1.524,86
**10.130.2770** | 30 cm kalınlıkta techizatlı gazbeton duvar elemanı (600 kg/m³) | m² | 1.663,49
**10.130.2902** | 10 cm kalınlıkta taşıyıcı olmayan bimsbeton duvar bloğu | m² | 87,00
**10.130.2903** | 13,5 cm kalınlıkta taşıyıcı olmayan bimsbeton duvar bloğu | m² | 115,00
**10.130.2904** | 15 cm kalınlıkta taşıyıcı olmayan bimsbeton duvar bloğu | m² | 130,00
**10.130.2905** | 17,5 cm kalınlıkta taşıyıcı olmayan bimsbeton duvar bloğu | m² | 152,00
**10.130.2906** | 19 cm kalınlıkta taşıyıcı olmayan bimsbeton duvar bloğu | m² | 166,00
**10.130.2907** | 25 cm kalınlıkta taşıyıcı olmayan bimsbeton duvar bloğu | m² | 217,00
**10.130.2908** | 30 cm kalınlıkta taşıyıcı olmayan bimsbeton duvar bloğu | m² | 254,00
**10.130.2921** | 10 cm kalınlıkta taşıyıcı bimsbeton duvar bloğu | m² | 101,00
**10.130.2922** | 15 cm kalınlıkta taşıyıcı bimsbeton duvar bloğu | m² | 150,00
**10.130.2923** | 19 cm kalınlıkta taşıyıcı bimsbeton duvar bloğu | m² | 184,00
**10.130.2931** | 20 cm yükseklikte bimsbeton asmolen bloğu | m² | 142,00
**10.130.2932** | 22 cm yükseklikte bimsbeton asmolen bloğu | m² | 157,00
**10.130.2933** | 23 cm yükseklikte bimsbeton asmolen bloğu | m² | 164,00
**10.130.2934** | 25 cm yükseklikte bimsbeton asmolen bloğu | m² | 178,00
**10.130.2935** | 28 cm yükseklikte bimsbeton asmolen bloğu | m² | 195,00
**10.130.2936** | 30 cm yükseklikte bimsbeton asmolen bloğu | m² | 215,00
**10.130.2937** | 32 cm yükseklikte bimsbeton asmolen bloğu | m² | 229,00
**10.130.2938** | 35 cm yükseklikte bimsbeton asmolen bloğu | m² | 246,00
**10.130.2951** | 10 cm kalınlıkta techizatlı bimsbeton lento | m² | 362,00
**10.130.2952** | 13,5 cm kalınlıkta techizatlı bimsbeton lento | m² | 507,00
**10.130.2953** | 15 cm kalınlıkta techizatlı bimsbeton lento | m² | 567,00
**10.130.2954** | 19 cm kalınlıkta techizatlı bimsbeton lento | m² | 727,00
**10.130.2955** | Bimsbeton tutkalı | Kg | 4,92
**10.130.3001** | 9 cm kalınlıkta hafif agregalı beton kargir birim | m² | 82,00
**10.130.3002** | 14 cm kalınlıkta hafif agregalı beton kargir birim | m² | 125,00
**10.130.3003** | 19 cm kalınlıkta hafif agregalı beton kargir birim | m² | 171,00
**10.130.3004** | 24 cm kalınlıkta hafif agregalı beton kargir birim | m² | 214,00
**10.130.3005** | 29 cm kalınlıkta hafif agregalı beton kargir birim | m² | 248,00
**10.130.3052** | 15 cm kalınlıkta dört gözü dolgulu beton kargir birim | m² | 156,00
**10.130.3054** | 19 cm kalınlıkta dört gözü dolgulu beton kargir birim | m² | 171,00
**10.130.3056** | 22,5 cm kalınlıkta dört gözü dolgulu beton kargir birim | m² | 200,00
**10.130.3101** | 14 cm kalınlıkta yalıtım tabakalı sandviç hafif kargir birim (EPS) | m² | 314,00
**10.130.3102** | 15 cm kalınlıkta yalıtım tabakalı sandviç hafif kargir birim (EPS) | m² | 156,00
**10.130.3103** | 19 cm kalınlıkta yalıtım tabakalı sandviç hafif kargir birim (EPS) | m² | 168,00
**10.130.3104** | 19,5 cm kalınlıkta yalıtım tabakalı sandviç hafif kargir birim (EPS) | m² | 370,00
**10.130.3105** | 20 cm kalınlıkta yalıtım tabakalı sandviç hafif kargir birim (EPS) | m² | 171,00
**10.130.3106** | 14 cm kalınlıkta lento (EPS yalıtımlı) | m² | 2.011,00
**10.130.3107** | 19,5 cm kalınlıkta lento (EPS yalıtımlı) | m² | 2.315,00
**10.130.3108** | 20 cm kalınlıkta asmolen bloğu (EPS yalıtımlı) | m² | 316,00
**10.130.3109** | 22,5 cm kalınlıkta asmolen bloğu (EPS yalıtımlı) | m² | 329,00
**10.130.3110** | 25 cm kalınlıkta asmolen bloğu (EPS yalıtımlı) | m² | 336,00
**10.130.3151** | 14,5 cm kalınlıkta yalıtım tabakalı sandviç hafif kargir birim (Taş Yünü) | m² | 247,00
**10.130.3152** | 19,5 cm kalınlıkta yalıtım tabakalı sandviç hafif kargir birim (Taş Yünü) | m² | 329,00
**10.130.3153** | 24,5 cm kalınlıkta yalıtım tabakalı sandviç hafif kargir birim (Taş Yünü) | m² | 374,00
**10.130.3154** | 29,5 cm kalınlıkta yalıtım tabakalı sandviç hafif kargir birim (Taş Yünü) | m² | 462,00
**10.130.3171** | 14,5 cm kalınlıkta ses yalıtımlı duvar bloğu (Taş Yünü) | m² | 316,00
**10.130.3172** | 19,5 cm kalınlıkta ses yalıtımlı duvar bloğu (Taş Yünü) | m² | 386,00
**10.130.3173** | 24,5 cm kalınlıkta ses yalıtımlı duvar bloğu (Taş Yünü) | m² | 450,00
**10.130.3174** | 29,5 cm kalınlıkta ses yalıtımlı duvar bloğu (Taş Yünü) | m² | 526,00
**10.130.3201** | 37,5 X 11,5 X 19 cm kireç kumtaşı duvar bloğu | Adet | 3,35
**10.130.3202** | 37,5 X 19 X 19 cm kireç kumtaşı duvar bloğu | Adet | 5,65
**10.130.3203** | 37,5 X 24 X 19 cm kireç kumtaşı duvar bloğu | Adet | 6,30
**10.130.3251** | 8 cm kalınlığında boşluklu alçı blok | m² | 144,00
**10.130.3252** | 10 cm kalınlığında boşluklu alçı blok | m² | 166,00
**10.130.3301** | Genleştirilmiş perlitten mamul levha ve bloklar | m³ | 819,00
**10.130.3401** | Taşıyıcı olmayan köpük beton kagir birimler | m³ | 531,00
**10.130.3501** | EPS katkılı beton blok ve levhalar | m³ | 1.336,00
**10.130.3521** | EPS katkılı beton blok tutkalı | Kg | 3,62
**10.130.4001** | Üst ve alt kiremit (Alaturka) (150 çevrim dayanımlı) | m² | 383,00
**10.130.4002** | Üst ve alt kiremit (Alaturka) (90 çevrim dayanımlı) | m² | 344,00
**10.130.4003** | Üst ve alt kiremit (Engop kaplamalı - 150 çevrim) | m² | 483,00
**10.130.4004** | Üst ve alt kiremit (Engop kaplamalı - 90 çevrim) | m² | 423,00
**10.130.4005** | Yan ve üstten kenetli kiremit (150 çevrim) | m² | 205,00
**10.130.4006** | Yan ve üstten kenetli kiremit (90 çevrim) | m² | 178,00
**10.130.4007** | Yan ve üstten kenetli kiremit (Engop - 150 çevrim) | m² | 290,00
**10.130.4008** | Yan ve üstten kenetli kiremit (Engop - 90 çevrim) | m² | 258,00
**10.130.4009** | Mahya bağlantı parçası (150 çevrim) | m | 63,00
**10.130.4010** | Mahya bağlantı parçası (90 çevrim) | m | 43,00
**10.130.4011** | Mahya bağlantı parçası (Engop - 150 çevrim) | m | 86,00
**10.130.4012** | Mahya bağlantı parçası (Engop - 90 çevrim) | m | 66,00
**10.130.4101** | Beton kiremit (renksiz) | m² | 120,00
**10.130.4102** | Beton mahya kiremiti (renksiz) | m | 76,00
**10.130.4103** | Beton kiremit (demir oksit boyalı) | m² | 148,00
**10.130.4104** | Beton mahya kiremiti (demir oksit boyalı) | m | 99,00
**10.130.4105** | Beton kiremit (sırlı) | m² | 178,00
**10.130.4106** | Beton mahya kiremiti (sırlı) | m | 125,00
**10.130.4121** | Perlitli beton kiremit (renksiz) | m² | 95,00
**10.130.4122** | Perlitli beton mahya kiremiti (renksiz) | m | 67,00
**10.130.4123** | Perlitli beton kiremit (demir oksit boyalı) | m² | 120,00
**10.130.4124** | Perlitli beton mahya kiremiti (demir oksit boyalı) | m | 77,00
**10.130.4125** | Perlitli beton kiremit (sırlı) | m² | 148,00
**10.130.4126** | Perlitli beton mahya kiremiti (sırlı) | m | 112,00
**10.130.4201** | Aşık taşıma profili (Alüminyum) | Adet | 29,00
**10.130.4202** | Mahya havalandırma bandı | m | 129,00
**10.130.4203** | Mahya tespit aparatı | Adet | 9,50
**10.130.4204** | Duvar/baca dibi bandı (25/40 cm) | m | 255,00
**10.130.4205** | Duvar/baca dibi bandı (50/60 cm) | m | 524,00
**10.130.4206** | Alüminyum baskı çıtası (6 cm) | m | 48,00
**10.130.4207** | PVC oluk/vadidere su yalıtımı | m | 205,00
**10.130.4208** | Alüminyum oluk/vadidere su yalıtımı | m | 164,00
**10.130.4209** | Alaturka kiremit tespit aparatı | Adet | 1,78
**10.130.4210** | Saçak Havalandırma Tarağı | Adet | 26,50
**10.130.4501** | Çam kerestesi (I.sınıf) | m³ | 8.500,00
**10.130.4502** | Çam kerestesi (II.sınıf) | m³ | 7.500,00
**10.130.4503** | Yuvarlak yapı odunları (Çam) | m³ | 4.200,00
**10.130.4504** | Beyaz çam kerestesi (I.sınıf) | m³ | 8.500,00
**10.130.4505** | Beyaz çam kerestesi (II.sınıf) | m³ | 7.500,00
**10.130.4506** | Kavak kerestesi | m³ | 4.350,00
**10.130.4507** | Meşe kerestesi | m³ | 16.000,00
**10.130.4508** | Ceviz kerestesi | m³ | 18.000,00
**10.130.4509** | Kayın kerestesi | m³ | 10.000,00
**10.130.4601** | Plywood film kapsız 15 mm | m² | 300,00
**10.130.4602** | Plywood film kapsız 18 mm | m² | 345,00
**10.130.4603** | Plywood film kapsız 21 mm | m² | 400,00
**10.130.4604** | Plywood film kaplı 15 mm | m² | 370,00
**10.130.4605** | Plywood film kaplı 18 mm | m² | 420,00
**10.130.4606** | Plywood film kaplı 21 mm | m² | 465,00
**10.130.4607** | I kesitli ahşap kiriş | m | 230,00
**10.130.5901** | 5 cm sabit yükseklikte kör kalıp sistemi | m² | 240,00
**10.130.5902** | 10 cm sabit yükseklikte kör kalıp sistemi | m² | 250,00
**10.130.5903** | 15 cm sabit yükseklikte kör kalıp sistemi | m² | 260,00
**10.130.5911** | 52x52x10 cm boşluklu döşeme kalıbı | Adet | 70,00
**10.130.5912** | 52x52x13 cm boşluklu döşeme kalıbı | Adet | 80,00
**10.130.5913** | 52x52x16 cm boşluklu döşeme kalıbı | Adet | 90,00
**10.130.6001** | Kalsiyum kireci CL 70S (Torbalı) | Ton | 2.660,00
**10.130.6002** | Kalsiyum kireci CL 80S (Torbalı) | Ton | 2.870,00
**10.130.6003** | Kalsiyum kireci CL 90S (Torbalı) | Ton | 3.046,00
**10.130.6010** | Hidrolik kireç (HL 2) | Ton | 4.300,00
**10.130.6011** | Hidrolik kireç (HL 3,5) | Ton | 4.569,00
**10.130.6012** | Doğal hidrolik kireç (HL 3,5) | Ton | 17.740,00
**10.130.6021** | Söndürülmemiş parça kalker kireci | Kg | 2,69
**10.130.9991** | Su | m³ | 38,50
**10.160.1001** | Jel Dinamit | Kg | 63,00
**10.160.1002** | Emülsiyon türü patlayıcı | Kg | 21,75
**10.160.1003** | Amonyum nitrat, fuel-oil karışımı | Kg | 21,45
**10.160.1004** | Fitil (Katranlı, Emniyetli) | m | 6,30
**10.160.1005** | Kapsül (Adi) | Adet | 10,40
**10.160.1006** | Tavikli (Kapsül) | Adet | 22,50
**10.160.1021** | Kapsül (Elektrikli) (1.50 m tel) | Adet | 30,15
**10.160.1022** | Kapsül (Elektrikli) (2.50 m tel) | Adet | 34,20
**10.160.1023** | Kerozen (Gazyağı) | Kg | 35,34
**10.160.1024** | Likit petrol gazı (LPG) | Kg | 40,04
**10.160.1025** | Benzin | Kg | 48,89
**10.160.1026** | Mazot (Motorin) | Kg | 43,84
**10.160.1027** | Makine yağı | Kg | 47,25
**10.160.1028** | Yanmış yağ | Kg | 3,06
**10.160.1029** | Üstübü | Kg | 12,70
**10.160.1030** | Elektrik enerjisi | Kwh | 4,60
**10.160.1031** | Karpit | Kg | 11,85
**10.160.1032** | Oksijen tüpü 20 lt | Adet | 210,00
**10.160.1033** | Pressiometre tazyikli hava tüpü | Adet | 210,00
**10.160.1034** | Teknik Amonyum Nitrat | Kg | 27,56
**10.160.1035** | Elektrod (3,25-4 mm) | Adet | 1,60
**10.170.1001** | İşlenmiş meşe parke (I.sınıf, 15-16 mm) | m² | 819,00
**10.170.1011** | İşlenmiş meşe parke (II.sınıf, 15-16 mm) | m² | 750,00
**10.170.1021** | İşlenmiş meşe parke (III.sınıf, 15-16 mm) | m² | 665,00
**10.170.1031** | İşlenmiş kayın parke (I.sınıf, 15-16 mm) | m² | 621,00
**10.170.1041** | İşlenmiş kayın parke (II.sınıf, 15-16 mm) | m² | 552,00
**10.170.1051** | İşlenmiş kayın parke (III.sınıf, 15-16 mm) | m² | 483,00
**10.170.1201** | Laminat yer kaplaması (AC1 Sınıf 21) | m² | 225,00
**10.170.1202** | Laminat yer kaplaması (AC3 Sınıf 23-31) | m² | 258,00
**10.170.1203** | Laminat yer kaplaması (AC4 Sınıf 32) | m² | 303,00
**10.170.1601** | Ceviz kaplama (0.8 mm) | m² | 121,00
**10.170.1602** | Meşe kaplama (0.8 mm) | m² | 89,00
**10.170.1603** | Maun kaplama (0.6 mm) | m² | 74,00
**10.170.1604** | Kayın kaplama (0.8 mm) | m² | 39,00
**10.170.1701** | Isıl işlem çam cephe kaplaması (19 mm) | m² | 1.179,00
**10.170.1702** | Isıl işlem çam yer kaplaması (26 mm) | m² | 1.254,00
**10.170.1703** | Isıl işlem iroko cephe/yer kaplaması (19 mm) | m² | 1.980,00
**10.170.1704** | Isıl işlem dişbudak cephe/yer kaplaması (21 mm) | m² | 1.732,00
**10.170.1705** | Isıl işlem dişbudak cephe/yer kaplaması (25 mm) | m² | 2.085,00
**10.170.1721** | Isıl işlem çam kereste | m³ | 32.000,00
**10.170.1722** | Isıl işlem dişbudak kereste | m³ | 67.650,00
**10.170.1723** | Isıl işlem iroko kereste | m³ | 72.600,00
**10.170.1801** | Kontraplak | m³ | 19.687,00
**10.170.1901** | OSB/2 Tipi (6 mm) | m² | 94,50
**10.170.1902** | OSB/2 Tipi (9 mm) | m² | 112,50
**10.170.1903** | OSB/2 Tipi (11 mm) | m² | 117,00
**10.170.1904** | OSB/2 Tipi (15 mm) | m² | 180,00
**10.170.1905** | OSB/2 Tipi (18 mm) | m² | 216,00
**10.170.1906** | OSB/2 Tipi (22 mm) | m² | 265,00
**10.170.1921** | OSB/3 Tipi (6 mm) | m² | 112,50
**10.170.1922** | OSB/3 Tipi (9 mm) | m² | 121,50
**10.170.1923** | OSB/3 Tipi (11 mm) | m² | 139,50
**10.170.1924** | OSB/3 Tipi (15 mm) | m² | 193,50
**10.170.1925** | OSB/3 Tipi (18 mm) | m² | 232,50
**10.170.1926** | OSB/3 Tipi (22 mm) | m² | 282,00
**10.170.2001** | Odun lifli levha Düz (3.0 mm) | m² | 49,50
**10.170.2002** | Odun lifli levha Düz (4 mm) | m² | 57,00
**10.170.2003** | Odun lifli levha Düz (5 mm) | m² | 72,00
**10.170.2004** | Tavanlık, delikli (40X40 cm, 3.0 mm) | Adet | 17,10
**10.170.2005** | Tavanlık, delikli boyalı (40X40 cm, 3.0 mm) | Adet | 24,75
**10.170.2006** | Tavanlık, delikli (40X80 cm, 3.0 mm) | Adet | 23,25
**10.170.2007** | Tavanlık, delikli boyalı (40X80 cm, 3.0 mm) | Adet | 34,50
**10.170.2008** | Kordonlu (4 mm) | m² | 24,75
**10.170.2009** | Yumuşak odun lifi levha (12.7 mm) | m² | 34,50
**10.170.2101** | Yonga levha (4 mm) | m² | 56,25
**10.170.2102** | Yonga levha (6 mm) | m² | 76,50
**10.170.2103** | Yonga levha (8 mm) | m² | 85,50
**10.170.2104** | Yonga levha (10 mm) | m² | 99,00
**10.170.2105** | Yonga levha (13 mm) | m² | 112,50
**10.170.2106** | Yonga levha (16 mm) | m² | 123,75
**10.170.2107** | Yonga levha (19 mm) | m² | 139,50
**10.170.2108** | Yonga levha (22 mm) | m² | 150,00
**10.170.2109** | Yonga levha (25 mm) | m² | 162,00
**10.170.2110** | Yonga levha (30 mm) | m² | 195,00
**10.170.2111** | Delikli yonga levha (35 mm) | m² | 247,50
**10.170.2112** | Delikli yonga levha (38 mm) | m² | 270,00
**10.170.2201** | Sentetik reçine esaslı yonga levha (8 mm) | m² | 121,50
**10.170.2202** | Sentetik reçine esaslı yonga levha (18 mm) | m² | 203,00
**10.170.2203** | Sentetik reçine esaslı yonga levha (30 mm) | m² | 345,50
**10.170.2301** | Mineral katkılı PVC kompozit levha (4 mm) | m² | 592,00
**10.170.2302** | Mineral katkılı PVC kompozit levha (6 mm) | m² | 678,00
**10.170.2303** | Mineral katkılı PVC kompozit levha (8 mm) | m² | 708,00
**10.170.2304** | Mineral katkılı PVC kompozit levha (10 mm) | m² | 816,00
**10.170.2305** | Mineral katkılı PVC kompozit levha (12 mm) | m² | 846,00
**10.170.2307** | Mineral katkılı PVC kompozit levha (16 mm) | m² | 1.201,00
**10.170.2308** | Mineral katkılı PVC kompozit levha (18 mm) | m² | 1.408,00
**10.170.2401** | Kimyasal selülozik kaplamalı levha (İç) | m² | 926,00
**10.170.2402** | Kimyasal selülozik kaplamalı levha (Dış) | m² | 1.050,00
**10.200.1003** | Düz siyah sac (2.5 mm ve üzeri) | Kg | 21,19
**10.200.1101** | Soğuk sac DC01 (0,29mm altı, <1100mm) | Kg | 30,94
**10.200.1102** | Soğuk sac DC01 (0,30-0,34mm, <1100mm) | Kg | 28,68
**10.200.1103** | Soğuk sac DC01 (0,35-0,39mm, <1100mm) | Kg | 28,68
**10.200.1104** | Soğuk sac DC01 (0,40-0,44mm, <1100mm) | Kg | 27,97
**10.200.1105** | Soğuk sac DC01 (0,45-0,49mm, <1100mm) | Kg | 27,23
**10.200.1106** | Soğuk sac DC01 (0,50-0,59mm, <1100mm) | Kg | 26,84
**10.200.1107** | Soğuk sac DC01 (0,60-0,69mm, <1100mm) | Kg | 26,70
**10.200.1108** | Soğuk sac DC01 (0,70-0,79mm, <1100mm) | Kg | 26,63
**10.200.1109** | Soğuk sac DC01 (0,80-0,89mm, <1100mm) | Kg | 26,63
**10.200.1110** | Soğuk sac DC01 (0,90-0,99mm, <1100mm) | Kg | 26,28
**10.200.1111** | Soğuk sac DC01 (1,00-1,49mm, <1100mm) | Kg | 26,28
**10.200.1112** | Soğuk sac DC01 (1,50mm ve üzeri, <1100mm) | Kg | 26,10
**10.200.1151** | Soğuk sac DC01 (0,29mm altı, >1100mm) | Kg | 31,04
**10.200.1152** | Soğuk sac DC01 (0,30-0,34mm, >1100mm) | Kg | 28,46
**10.200.1153** | Soğuk sac DC01 (0,35-0,39mm, >1100mm) | Kg | 28,46
**10.200.1154** | Soğuk sac DC01 (0,40-0,44mm, >1100mm) | Kg | 27,65
**10.200.1155** | Soğuk sac DC01 (0,45-0,49mm, >1100mm) | Kg | 26,98
**10.200.1156** | Soğuk sac DC01 (0,50-0,59mm, >1100mm) | Kg | 26,84
**10.200.1157** | Soğuk sac DC01 (0,60-0,69mm, >1100mm) | Kg | 26,42
**10.200.1158** | Soğuk sac DC01 (0,70-0,79mm, >1100mm) | Kg | 26,28
**10.200.1159** | Soğuk sac DC01 (0,80-0,89mm, >1100mm) | Kg | 26,31
**10.200.1160** | Soğuk sac DC01 (0,90-0,99mm, >1100mm) | Kg | 25,96
**10.200.1161** | Soğuk sac DC01 (1,00-1,49mm, >1100mm) | Kg | 25,96
**10.200.1162** | Soğuk sac DC01 (1,50mm ve üzeri, >1100mm) | Kg | 25,78
**10.200.1201** | Sıcak levha (S235 JR) (5,00-7,99mm) | Kg | 26,49
**10.200.1202** | Sıcak levha (S235 JR) (8,00-11,99mm) | Kg | 25,60
**10.200.1203** | Sıcak levha (S235 JR) (12,00-15,99mm) | Kg | 25,60
**10.200.1204** | Sıcak levha (S235 JR) (16,00-17,99mm) | Kg | 24,54
**10.200.1205** | Sıcak levha (S235 JR) (18,00mm ve üzeri) | Kg | 24,19
**10.200.1251** | Sıcak rulo sac (S235 JR) (1,50-1,59mm) | Kg | 21,90
**10.200.1252** | Sıcak rulo sac (S235 JR) (1,60-1,79mm) | Kg | 21,19
**10.200.1253** | Sıcak rulo sac (S235 JR) (1,80-1,99mm) | Kg | 21,01
**10.200.1254** | Sıcak rulo sac (S235 JR) (2,00-2,19mm) | Kg | 20,84
**10.200.1255** | Sıcak rulo sac (S235 JR) (2,20-2,49mm) | Kg | 20,84
**10.200.1256** | Sıcak rulo sac (S235 JR) (2,50-2,99mm) | Kg | 20,84
**10.200.1257** | Sıcak rulo sac (S235 JR) (3,00-4,99mm) | Kg | 20,66
**10.200.1258** | Sıcak rulo sac (S235 JR) (5,00-7,99mm) | Kg | 20,66
**10.200.1259** | Sıcak rulo sac (S235 JR) (8,00-11,99mm) | Kg | 20,66
**10.200.1260** | Sıcak rulo sac (S235 JR) (12,00-15,00mm) | Kg | 20,84
**10.200.1304** | Galvanizli boyalı oluklu/trapez sac | Kg | 43,90
**10.200.1401** | Sıcak daldırma galvalume düz sac | Kg | 36,70
**10.200.1402** | Sıcak daldırma galvalume boyalı düz sac | Kg | 40,30
**10.200.1403** | Sıcak daldırma galvalume oluklu/trapez sac | Kg | 39,60
**10.200.1404** | Sıcak daldırma galvalume boyalı oluklu sac | Kg | 43,80
**10.200.1501** | Baklava desenli sac | Kg | 36,70
**10.200.1601** | Paslanmaz çubuk (AISI 304) | Kg | 93,50
**10.200.1602** | Paslanmaz çubuk (AISI 316) | Kg | 130,00
**10.200.1603** | Paslanmaz sac (AISI 304) | Kg | 91,00
**10.200.1604** | Paslanmaz sac (AISI 316) | Kg | 121,00
**10.200.1605** | Paslanmaz boru (AISI 304) | Kg | 108,00
**10.200.1606** | Paslanmaz boru (AISI 316) | Kg | 162,00
**10.200.1607** | Paslanmaz profil (AISI 304) | Kg | 104,00
**10.200.2012** | Mat eloksallı, ısı yalıtımlı alüminyum profil | Kg | 194,00
**10.200.2013** | Parlak eloksallı ısı yalıtımlı alüminyum profil | Kg | 197,00
**10.200.2014** | Renkli-mat eloksallı ısı yalıtımlı profil | Kg | 190,00
**10.200.2015** | Renkli-parlak eloksallı ısı yalıtımlı profil | Kg | 197,00
**10.200.2016** | Elektrostatik toz boyalı ısı yalıtımlı profil | Kg | 190,00
**10.200.2022** | Mat eloksallı PVC yalıtımlı alüminyum profil | Kg | 163,00
**10.200.2023** | Parlak eloksallı PVC yalıtımlı alüminyum profil | Kg | 168,00
**10.200.2024** | Renkli-mat PVC yalıtımlı alüminyum profil | Kg | 168,00
**10.200.2025** | Renkli-parlak PVC yalıtımlı alüminyum profil | Kg | 177,00
**10.200.2026** | Elektrostatik toz boyalı PVC yalıtımlı profil | Kg | 177,00
**10.200.2101** | Alüminyum Düz Levha (AW 1100, 0.30 mm) | Kg | 154,00
**10.200.2102** | Alüminyum Düz Levha (AW 1100, 0.50 mm) | Kg | 153,00
**10.200.2103** | Alüminyum Düz Levha (AW 1100, 0.70 mm) | Kg | 153,00
**10.200.2104** | Alüminyum Düz Levha (AW 1100, 3.00 mm) | Kg | 151,00
**10.200.2111** | Alüminyum Düz Levha (AW 1050A, 0.30 mm) | Kg | 154,00
**10.200.2112** | Alüminyum Düz Levha (AW 1050A, 0.50 mm) | Kg | 153,00
**10.200.2113** | Alüminyum Düz Levha (AW 1050A, 0.70 mm) | Kg | 153,00
**10.200.2114** | Alüminyum Düz Levha (AW 1050A, 3.00 mm) | Kg | 151,00
**10.200.2121** | Alüminyum Düz Levha (AW 3003, 0.30 mm) | Kg | 155,00
**10.200.2122** | Alüminyum Düz Levha (AW 3003, 0.50 mm) | Kg | 154,00
**10.200.2123** | Alüminyum Düz Levha (AW 3003, 0.70 mm) | Kg | 154,00
**10.200.2124** | Alüminyum Düz Levha (AW 3003, 3.00 mm) | Kg | 153,00
**10.200.2131** | Alüminyum Düz Levha (AW 3105, 0.30 mm) | Kg | 155,00
**10.200.2132** | Alüminyum Düz Levha (AW 3105, 0.50 mm) | Kg | 154,00
**10.200.2133** | Alüminyum Düz Levha (AW 3105, 0.70 mm) | Kg | 154,00
**10.200.2134** | Alüminyum Düz Levha (AW 3105, 3.00 mm) | Kg | 153,00
**10.200.2141** | Alüminyum Düz Levha (AW 5005, 0.30 mm) | Kg | 155,00
**10.200.2142** | Alüminyum Düz Levha (AW 5005, 0.50 mm) | Kg | 154,00
**10.200.2143** | Alüminyum Düz Levha (AW 5005, 0.70 mm) | Kg | 154,00
**10.200.2144** | Alüminyum Düz Levha (AW 5005, 3.00 mm) | Kg | 153,00
**10.200.2201** | Boyalı Alüminyum Levha (AW 1100, 0.30 mm) | Kg | 190,00
**10.200.2202** | Boyalı Alüminyum Levha (AW 1100, 0.50 mm) | Kg | 189,00
**10.200.2203** | Boyalı Alüminyum Levha (AW 1100, 0.70 mm) | Kg | 189,00
**10.200.2204** | Boyalı Alüminyum Levha (AW 1100, 3.00 mm) | Kg | 189,00
**10.200.2211** | Boyalı Alüminyum Levha (AW 1050A, 0.30 mm) | Kg | 190,00
**10.200.2212** | Boyalı Alüminyum Levha (AW 1050A, 0.50 mm) | Kg | 189,00
**10.200.2213** | Boyalı Alüminyum Levha (AW 1050A, 0.70 mm) | Kg | 189,00
**10.200.2214** | Boyalı Alüminyum Levha (AW 1050A, 3.00 mm) | Kg | 189,00
**10.200.2221** | Boyalı Alüminyum Levha (AW 3003, 0.30 mm) | Kg | 197,00
**10.200.2222** | Boyalı Alüminyum Levha (AW 3003, 0.50 mm) | Kg | 190,00
**10.200.2223** | Boyalı Alüminyum Levha (AW 3003, 0.70 mm) | Kg | 190,00
**10.200.2224** | Boyalı Alüminyum Levha (AW 3003, 3.00 mm) | Kg | 190,00
**10.200.2231** | Boyalı Alüminyum Levha (AW 3105, 0.30 mm) | Kg | 197,00
**10.200.2232** | Boyalı Alüminyum Levha (AW 3105, 0.50 mm) | Kg | 190,00
**10.200.2233** | Boyalı Alüminyum Levha (AW 3105, 0.70 mm) | Kg | 190,00
**10.200.2234** | Boyalı Alüminyum Levha (AW 3105, 3.00 mm) | Kg | 190,00
**10.200.2241** | Boyalı Alüminyum Levha (AW 5005, 0.30 mm) | Kg | 197,00
**10.200.2242** | Boyalı Alüminyum Levha (AW 5005, 0.50 mm) | Kg | 197,00
**10.200.2243** | Boyalı Alüminyum Levha (AW 5005, 0.70 mm) | Kg | 190,00
**10.200.2244** | Boyalı Alüminyum Levha (AW 5005, 3.00 mm) | Kg | 189,00
**10.200.2301** | Trapezoidal Alüminyum Levha (AW 3003) | Kg | 172,00
**10.200.2302** | Trapezoidal Alüminyum Levha (AW 3105) | Kg | 172,00
**10.200.2303** | Trapezoidal Alüminyum Levha (AW 5005) | Kg | 192,00
**10.200.2701** | 120 mm Kapak Profili (min 1.3 mm) | m | 116,00
**10.200.2702** | 150 mm Kapak Profili (min 1.5 mm) | m | 160,00
**10.200.2703** | 200 mm Kapak Profili (min 1.7 mm) | m | 242,00
**10.200.2704** | 250 mm Kapak Profili (min 1.7 mm) | m | 286,00
**10.200.2711** | 120 mm Kapak Profili (Zemin, min 2.2 mm) | m | 169,00
**10.200.2712** | 150 mm Kapak Profili (Zemin, min 2.4 mm) | m | 225,00
**10.200.2713** | 200 mm Kapak Profili (Zemin, min 2.6 mm) | m | 346,00
**10.200.2714** | 250 mm Kapak Profili (Zemin, min 2.6 mm) | m | 397,00
**10.200.2721** | Kaplama Altı Dilatasyon Profili (50 mm) | m | 247,00
**10.200.2722** | Kaplama Altı Dilatasyon Profili (80 mm) | m | 385,00
**10.200.2723** | Kaplama Altı Dilatasyon Profili (100 mm) | m | 465,00
**10.200.2731** | Güçlendirilmiş Dilatasyon Profili (50 mm) | m | 499,00
**10.200.2732** | Güçlendirilmiş Dilatasyon Profili (80 mm) | m | 669,00
**10.200.2733** | Güçlendirilmiş Dilatasyon Profili (100 mm) | m | 837,00
**10.200.2734** | Güçlendirilmiş Dilatasyon Profili (150 mm) | m | 1.269,00
**10.200.2741** | Duvar/Tavan Dilatasyon Profili (50 mm) | m | 132,00
**10.200.2742** | Duvar/Tavan Dilatasyon Profili (80 mm) | m | 156,00
**10.200.2743** | Duvar/Tavan Dilatasyon Profili (100 mm) | m | 185,00
**10.200.2751** | Kaplama Üstü Zemin Dilatasyon Profili (50 mm) | m | 225,00
**10.200.2752** | Kaplama Üstü Zemin Dilatasyon Profili (80 mm) | m | 314,00
**10.200.2753** | Kaplama Üstü Zemin Dilatasyon Profili (100 mm) | m | 383,00
**10.200.2761** | Güçlendirilmiş Üst Dilatasyon Profili (50 mm) | m | 282,00
**10.200.2762** | Güçlendirilmiş Üst Dilatasyon Profili (80 mm) | m | 397,00
**10.200.2763** | Güçlendirilmiş Üst Dilatasyon Profili (100 mm) | m | 502,00
**10.200.2764** | Güçlendirilmiş Üst Dilatasyon Profili (150 mm) | m | 760,00
**10.200.2791** | Butil bant (3x10 mm) | m | 14,00
**10.200.2792** | Dilatasyon yalıtım bandı (30 cm) | m | 137,00
**10.200.2793** | Dilatasyon yalıtım bandı (40 cm) | m | 180,00
**10.200.2801** | Çinko levha | Kg | 113,00
**10.200.2809** | Çinko (Külçe) | Kg | 96,60
**10.200.2811** | Kurşun levha (min. %99,98 saf) | Kg | 97,20
**10.200.2812** | Kurşun levha (%99,80 saflık) | Kg | 91,20
**10.200.2819** | Kurşun (Külçe) | Kg | 82,80
**10.200.2851** | Sfero döküm (GJS 400) | Kg | 40,80
**10.200.2852** | Sfero döküm (GJS 500) | Kg | 43,80
**10.200.2853** | Bakır profil ve levhalar | Kg | 370,00
**10.200.2854** | Blister bakır | Kg | 311,00
**10.200.2861** | Pirinç boru | Kg | 259,00
**10.200.2862** | Pirinç lama | Kg | 259,00
**10.200.2951** | Yüksek evsaflı çelik mesnet | Kg | 49,20
**10.200.2952** | İçi çelik takviyeli kauçuk köprü mesneti | cm³ | 0,25
**10.200.3001** | Tavan C 60 profili (0.50 mm) | m | 17,20
**10.200.3002** | Tavan C 60 profili (0.60 mm) | m | 23,40
**10.200.3003** | Tavan U 28 profili (0.50 mm) | m | 11,70
**10.200.3004** | Tavan U 28 profili (0.60 mm) | m | 13,20
**10.200.3005** | Duvar C 50 profili (0.50 mm) | m | 24,60
**10.200.3006** | Duvar C 50 profili (0.60 mm) | m | 30,00
**10.200.3007** | Duvar C 75 profili (0.50 mm) | m | 29,40
**10.200.3008** | Duvar C 75 profili (0.60 mm) | m | 34,20
**10.200.3009** | Duvar C 100 profili (0.50 mm) | m | 33,40
**10.200.3010** | Duvar C 100 profili (0.60 mm) | m | 39,80
**10.200.3011** | Duvar U 50 profili (0.50 mm) | m | 17,40
**10.200.3012** | Duvar U 50 profili (0.60 mm) | m | 24,60
**10.200.3013** | Duvar U 75 profili (0.50 mm) | m | 21,50
**10.200.3014** | Duvar U 75 profili (0.60 mm) | m | 29,60
**10.200.3015** | Duvar U 100 profili (0.50 mm) | m | 26,00
**10.200.3016** | Duvar U 100 profili (0.60 mm) | m | 34,80
**10.201.3001** | Tavan U 28 profili (0.55 mm) | m | 11,70
**10.201.3002** | Tavan C 60 profili (0.55 mm) | m | 20,30
**10.201.3003** | Duvar C 50 profili (0.55 mm) | m | 25,75
**10.201.3004** | Duvar C 50 profili (0.90 mm) | m | 39,00
**10.201.3005** | Duvar C 75 profili (0.55 mm) | m | 29,60
**10.201.3006** | Duvar C 75 profili (0.90 mm) | m | 46,00
**10.201.3007** | Duvar C 100 profili (0.55 mm) | m | 33,80
**10.201.3008** | Duvar C 100 profili (0.90 mm) | m | 60,20
**10.201.3009** | Duvar C 125 profili (0.50 mm) | m | 37,80
**10.201.3010** | Duvar C 125 profili (0.60 mm) | m | 41,40
**10.201.3011** | Duvar C 125 profili (0.90 mm) | m | 65,50
**10.201.3012** | Duvar C 150 profili (0.50 mm) | m | 39,00
**10.201.3013** | Duvar C 150 profili (0.60 mm) | m | 45,20
**10.201.3014** | Duvar C 150 profili (0.90 mm) | m | 70,80
**10.201.3015** | Duvar U 125 profili (0.50 mm) | m | 31,20
**10.201.3016** | Duvar U 125 profili (0.60 mm) | m | 36,00
**10.201.3017** | Duvar U 125 profili (0.90 mm) | m | 55,80
**10.201.3018** | Duvar U 150 profili (0.50 mm) | m | 34,80
**10.201.3019** | Duvar U 150 profili (0.60 mm) | m | 41,40
**10.201.3020** | Duvar U 150 profili (0.90 mm) | m | 63,60
**10.202.3001** | Duvar U 50 profili (2 mm kalınlıkta delikli) | m | 123,50
**10.202.3002** | Duvar U 75 profili (2 mm kalınlıkta delikli) | m | 144,00
**10.202.3003** | Duvar U 100 profili (2 mm kalınlıkta delikli) | m | 168,00
**10.200.3021** | Delikli köşe profili (0.35 mm) | m | 5,75
**10.200.3022** | Delikli köşe profili (0.40 mm) | m | 6,72
**10.200.3023** | Klips 7.5 cm (0.8 mm) | Adet | 1,25
**10.200.3024** | Askı maşası "T" tipi (11.5 cm) | Adet | 5,04
**10.200.3025** | Askı maşası "C" tipi (11.5 cm) | Adet | 6,72
**10.200.3026** | Ekleme parçası (9 cm) | Adet | 2,76
**10.200.3027** | Agraf 7,5 cm (1 mm) | Adet | 2,76
**10.200.3028** | Agraf 12 cm (1 mm) | Adet | 4,14
**10.200.3029** | Agraf 20 cm (1 mm) | Adet | 6,36
**10.200.3030** | Agraf vidası (500 adetlik kutu) | Kutu | 78,00
**10.200.3031** | Derz bandı (Cam elyafı, 5 cm) | m | 0,78
**10.200.3032** | Yalıtım bandı (3 mm PE, 5 cm) | m | 1,25
**10.200.3033** | Yalıtım bandı (3 mm PE, 7,5 cm) | m | 2,50
**10.200.3034** | Yalıtım bandı (3 mm PE, 10 cm) | m | 3,35
**10.201.3021** | U-L 50 bağlantı elemanı (2 mm) | Adet | 18,60
**10.201.3022** | U-L 75 bağlantı elemanı (2 mm) | Adet | 24,60
**10.201.3023** | U-L 100 bağlantı elemanı (2 mm) | Adet | 27,60
**10.201.3024** | Somun cıvata (U-L bağlantı için) | Adet | 2,11
**10.201.3025** | L 50 bağlantı elemanı (2 mm, Z275) | Adet | 12,60
**10.201.3026** | L 75 bağlantı elemanı (2 mm, Z275) | Adet | 13,20
**10.201.3027** | L 100 bağlantı elemanı (2 mm, Z275) | Adet | 16,10
**10.201.3028** | L 125 bağlantı elemanı (2 mm, Z275) | Adet | 18,00
**10.201.3029** | T profili (0.90 mm, Z275) | m | 41,40
**10.201.3030** | Alüminyum delikli köşe profili (0.35 mm) | m | 4,80
**10.201.3031** | Çiftli Klips (60x27 mm, 1 mm) | Adet | 1,65
**10.201.3032** | Açılı ekleme parçası (9 cm, 0.6 mm) | Adet | 2,27
**10.201.3033** | Derz bandı (Cam elyafı, 5 cm) | m | 0,40
**10.201.3034** | Derz bandı (Cam elyafı, yapışkanlı, 10 cm) | m | 0,78
**10.201.3035** | Derz bandı (Kağıttan, 5 cm) | m | 0,78
**10.200.3051** | Gizli taşıyıcı profil (Clip-in, 0.50 mm) | m | 12,90
**10.200.3052** | Gizli taşıyıcı profil (Clip-in, 0.60 mm) | m | 13,75
**10.200.3053** | Alüminyum kenar C profili (1.00 mm) | m | 21,85
**10.200.3054** | Sac kenar C profili (0.50 mm) | m | 16,70
**10.200.3055** | Taşıyıcı ek parçası (0.50 mm) | Adet | 2,10
**10.200.3056** | Birleşim klipsi (Yay çeliği) | Adet | 2,50
**10.200.3057** | Bastırma klipsi (Yay çeliği) | Adet | 2,35
**10.200.3058** | Lamel asma tavan taşıyıcı (1 cm derzli) | m | 17,95
**10.200.3059** | Lamel asma tavan taşıyıcı (1,5 cm derzli) | m | 21,85
**10.200.3060** | Lamel asma tavan taşıyıcı (2 cm derzli) | m | 21,85
**10.200.3061** | Lamel asma tavan taşıyıcı (Kendinden derzli) | m | 21,85
**10.200.3062** | Alüminyum derz çıtası (15 mm) | m | 11,00
**10.200.3063** | Alüminyum derz çıtası (20 mm) | m | 11,40
**10.200.3064** | Kenar L profili (fırın boyalı, 0.50 mm) | m | 11,40
**10.200.3065** | Kenar U profili (fırın boyalı, 0.50 mm) | m | 16,40
**10.200.3071** | 24 mm Ana Taşıyıcı T Profil (h=38 mm, 0.40 mm) | m | 13,15
**10.200.3072** | 24 mm Ana Taşıyıcı T Profil (h=38 mm, 0.30 mm) | m | 10,90
**10.200.3073** | 24 mm Ana Taşıyıcı T Profil (Korozyona day., 0.30 mm) | m | 20,80
**10.200.3074** | 24 mm Ana Taşıyıcı T Profil (Korozyona day., 0.40 mm) | m | 22,45
**10.200.3081** | 35 mm Ana Taşıyıcı T Profil (h=38 mm, 0.30 mm) | m | 32,45
**10.200.3091** | 24 mm Ara Taşıyıcı T Profil (h=30 mm, 0.40 mm) | m | 19,00
**10.200.3092** | 24 mm Ara Taşıyıcı T Profil (h=30-32 mm, 0.30 mm) | m | 14,85
**10.200.3093** | 24 mm Ara Taşıyıcı T Profil (h=25 mm, 0.30 mm) | m | 16,30
**10.200.3094** | 24 mm Ara Taşıyıcı T Profil (Korozyon day., 0.30 mm) | m | 14,85
**10.200.3095** | 24 mm Ara Taşıyıcı T Profil (Korozyon day., 0.40 mm) | m | 20,00
**10.200.3096** | 24 mm Ara Taşıyıcı T Profil (Korozyon day., 0.30 mm) | m | 16,85
**10.200.3097** | 24 mm Ara Taşıyıcı T Profil (Korozyon day., 0.40 mm) | m | 19,60
**10.200.3101** | 35 mm Ara Taşıyıcı T Profil (h=38 mm, 0.30 mm) | m | 30,00
**10.200.3111** | 15 mm Ana Taşıyıcı T Profil (h=38 mm, 0.40 mm) | m | 16,30
**10.200.3112** | 15 mm Ana Taşıyıcı T Profil (h=32 mm, 0.30 mm) | m | 14,85
**10.200.3113** | 15 mm Ana Taşıyıcı T Profil (h=32 mm, 0.40 mm) | m | 14,85
**10.200.3114** | 15 mm Ana Taşıyıcı T Profil (Kanallı, 0.30 mm) | m | 36,20
**10.200.3115** | 15 mm Ana Taşıyıcı T Profil (h=45 mm, 0.40 mm) | m | 36,20
**10.200.3121** | 15 mm Ara Taşıyıcı T Profil (h=30 mm, 0.40 mm) | m | 17,00
**10.200.3122** | 15 mm Ara Taşıyıcı T Profil (Klips başlı, 0.30 mm) | m | 17,05
**10.200.3123** | 15 mm Ara Taşıyıcı T Profil (Kanallı, 0.30 mm) | m | 38,95
**10.200.3124** | 15 mm Ara Taşıyıcı T Profil (Kanallı, 0.40 mm) | m | 41,80
**10.200.3125** | Kenar L profili (0,50 mm) | m | 9,45
**10.200.3126** | Kenar L profili (Korozyon dayanımlı, 0.50 mm) | m | 18,60
**10.200.3127** | Kenar Z profili (0.40-0.60 mm) | m | 13,50
**10.200.3128** | Kenar Z profili (0.50-0.70 mm) | m | 20,35
**10.200.3129** | Askı çubuğu (40 cm) | Adet | 1,00
**10.200.3130** | Askı çubuğu (50 cm) | Adet | 1,65
**10.200.3131** | Askı çubuğu (60 cm) | Adet | 1,71
**10.200.3132** | Askı çubuğu (80 cm) | Adet | 2,15
**10.200.3133** | Askı çubuğu (100 cm) | Adet | 2,42
**10.200.3134** | Askı çubuğu (120 cm) | Adet | 3,14
**10.200.3135** | Askı çubuğu (120 cm üstü) | Adet | 3,58
**10.200.3136** | Çiftli yay (0.60 mm) | Adet | 2,00
**10.200.3137** | Çelik dübel (6x45 vida dahil) | Adet | 1,93
**10.200.3141** | Alçı sıva köşe profili (min 0.40 mm) | m | 4,55
**10.200.3601** | Kare/Dikdörtgen çelik borular (Ortalama kg) | Kg | 30,48
**10.200.3602** | 10X10X1.0 mm çelik boru | m | 11,15
**10.200.3603** | 15X15X1.0 mm çelik boru | m | 12,95
**10.200.3604** | 20X20X1.0 mm çelik boru | m | 17,30
**10.200.3605** | 25X25X1.0 mm çelik boru | m | 22,05
**10.200.3606** | 25X25X1.2 mm çelik boru | m | 25,95
**10.200.3607** | 30X30X1.0 mm çelik boru | m | 26,30
**10.200.3608** | 30X30X1.2 mm çelik boru | m | 30,65
**10.200.3609** | 30X30X1.5 mm çelik boru | m | 35,00
**10.200.3610** | 40X40X1.5 mm çelik boru | m | 47,00
**10.200.3611** | 40X40X2.0 mm çelik boru | m | 55,50
**10.200.3612** | 50X50X2.0 mm çelik boru | m | 70,30
**10.200.3613** | 10X20X1.0 mm çelik boru | m | 13,15
**10.200.3614** | 10X30X1.0 mm çelik boru | m | 17,15
**10.200.3615** | 15X25X1.0 mm çelik boru | m | 17,15
**10.200.3616** | 20X30X1.0 mm çelik boru | m | 21,20
**10.200.3617** | 20X40X1.0 mm çelik boru | m | 26,50
**10.200.3618** | 20X40X1.5 mm çelik boru | m | 35,00
**10.200.3619** | 30X40X1.5 mm çelik boru | m | 41,35
**10.200.3620** | 30X50X1.5 mm çelik boru | m | 47,70
**10.200.3621** | 30X50X2.0 mm çelik boru | m | 55,65
**10.200.3622** | 40X60X2.0 mm çelik boru | m | 69,95
**10.200.3701** | Öngerme teli (Düz, Ø 4-12 mm) | Kg | 27,20
**10.200.3702** | Öngerme teli (Çentikli, Ø 4-12 mm) | Kg | 28,00
**10.200.3703** | Öngerme halatı (Ø 0,5 inç) | Kg | 30,75
**10.200.3704** | Öngerme halatı (Ø 0,6 inç ve üzeri) | Kg | 30,75
**10.200.3801** | Paslanmaz çelik U profil (35/35/3 mm) | m | 222,00
**10.200.3802** | Paslanmaz çelik U profil (40/30/3 mm) | m | 205,00
**10.200.3803** | Paslanmaz çelik U profil (40/40/3 mm) | m | 256,00
**10.200.3804** | Paslanmaz çelik U profil (50/50/3 mm) | m | 327,00
**10.200.3805** | Paslanmaz çelik U profil (40/40/4 mm) | m | 332,00
**10.200.3806** | Paslanmaz çelik U profil (50/50/4 mm) | m | 417,00
**10.200.3807** | Paslanmaz çelik U profil (50/50/5 mm) | m | 501,00
**10.200.3821** | Galvaniz çelik U profil (35/35/3 mm) | m | 65,50
**10.200.3822** | Galvaniz çelik U profil (40/30/3 mm) | m | 62,90
**10.200.3823** | Galvaniz çelik U profil (40/40/3 mm) | m | 73,70
**10.200.3824** | Galvaniz çelik U profil (50/50/3 mm) | m | 95,70
**10.200.3825** | Galvaniz çelik U profil (40/40/4 mm) | m | 95,70
**10.200.3826** | Galvaniz çelik U profil (50/50/4 mm) | m | 121,00
**10.200.3827** | Galvaniz çelik U profil (50/50/5 mm) | m | 151,50
**10.200.3841** | Paslanmaz çelik L profil (30/30/3 mm) | m | 126,50
**10.200.3842** | Paslanmaz çelik L profil (40/40/3 mm) | m | 168,50
**10.200.3843** | Paslanmaz çelik L profil (50/50/3 mm) | m | 247,50
**10.200.3844** | Paslanmaz çelik L profil (40/40/4 mm) | m | 230,00
**10.200.3845** | Paslanmaz çelik L profil (50/50/4 mm) | m | 290,00
**10.200.3846** | Paslanmaz çelik L profil (50/50/5 mm) | m | 360,00
**10.200.3861** | Galvaniz çelik L profil (30/30/3 mm) | m | 39,00
**10.200.3862** | Galvaniz çelik L profil (40/40/3 mm) | m | 52,50
**10.200.3863** | Galvaniz çelik L profil (50/50/3 mm) | m | 72,00
**10.200.3864** | Galvaniz çelik L profil (40/40/4 mm) | m | 66,00
**10.200.3865** | Galvaniz çelik L profil (50/50/4 mm) | m | 82,00
**10.200.3866** | Galvaniz çelik L profil (50/50/5 mm) | m | 99,00
**10.200.3881** | Paslanmaz L konsol (50/60x120x3 mm) | Adet | 33,50
**10.200.3882** | Paslanmaz L konsol (50/80x120x4 mm) | Adet | 52,00
**10.200.3883** | Paslanmaz L konsol (50/100x120x4 mm) | Adet | 60,50
**10.200.3884** | Paslanmaz L konsol (60/120x120x5 mm) | Adet | 88,00
**10.200.3885** | Paslanmaz L konsol (60/140x120x5 mm) | Adet | 96,50
**10.200.3901** | Galvaniz L konsol (50/60x120x3 mm) | Adet | 12,50
**10.200.3902** | Galvaniz L konsol (50/80x120x4 mm) | Adet | 19,50
**10.200.3903** | Galvaniz L konsol (50/100x120x4 mm) | Adet | 22,30
**10.200.3904** | Galvaniz L konsol (60/120x120x5 mm) | Adet | 32,00
**10.200.3905** | Galvaniz L konsol (60/140x120x5 mm) | Adet | 36,00
**10.200.3921** | Paslanmaz Z ankraj (30x3xY20 mm) | Adet | 8,25
**10.200.3922** | Paslanmaz Z ankraj (30x3xY40 mm) | Adet | 12,00
**10.200.3923** | Paslanmaz Z ankraj (30x3xY60 mm) | Adet | 14,30
**10.200.3924** | Paslanmaz Z ankraj (30x3xY80 mm) | Adet | 18,00
**10.200.3925** | Paslanmaz Z ankraj (30x3xY100 mm) | Adet | 20,00
**10.200.3926** | Paslanmaz Z ankraj (30x4xY20 mm) | Adet | 12,00
**10.200.3927** | Paslanmaz Z ankraj (30x4xY40 mm) | Adet | 16,50
**10.200.3928** | Paslanmaz Z ankraj (30x4xY60 mm) | Adet | 18,50
**10.200.3929** | Paslanmaz Z ankraj (30x4xY80 mm) | Adet | 22,00
**10.200.3930** | Paslanmaz Z ankraj (30x4xY100 mm) | Adet | 25,80
**10.200.3931** | Paslanmaz Z ankraj (30x5xY20 mm) | Adet | 15,20
**10.200.3932** | Paslanmaz Z ankraj (30x5xY40 mm) | Adet | 18,70
**10.200.3933** | Paslanmaz Z ankraj (30x5xY60 mm) | Adet | 24,20
**10.200.3934** | Paslanmaz Z ankraj (30x5xY80 mm) | Adet | 27,80
**10.200.3935** | Paslanmaz Z ankraj (30x5xY100 mm) | Adet | 32,00
**10.200.3936** | Paslanmaz Z ankraj (40x5xY20 mm) | Adet | 18,70
**10.200.3937** | Paslanmaz Z ankraj (40x5xY40 mm) | Adet | 26,00
**10.200.3938** | Paslanmaz Z ankraj (40x5xY60 mm) | Adet | 30,50
**10.200.3939** | Paslanmaz Z ankraj (40x5xY80 mm) | Adet | 35,00
**10.200.3940** | Paslanmaz Z ankraj (40x5xY100 mm) | Adet | 42,50
**10.200.3951** | Paslanmaz L ankraj (30x30/30x3 mm) | Adet | 6,60
**10.200.3952** | Paslanmaz L ankraj (30x30/40x3 mm) | Adet | 7,40
**10.200.3953** | Paslanmaz L ankraj (30x30/50x3 mm) | Adet | 7,80
**10.200.3954** | Paslanmaz L ankraj (30x40/40x3 mm) | Adet | 7,80
**10.200.3955** | Paslanmaz L ankraj (30x40/50x3 mm) | Adet | 8,40
**10.200.3956** | Paslanmaz L ankraj (30x30/30x4 mm) | Adet | 7,80
**10.200.3957** | Paslanmaz L ankraj (30x30/40x4 mm) | Adet | 8,90
**10.200.3958** | Paslanmaz L ankraj (30x30/50x4 mm) | Adet | 9,90
**10.200.3959** | Paslanmaz L ankraj (30x40/40x4 mm) | Adet | 9,90
**10.200.3971** | Paslanmaz harçlı ankraj Lama (18x130x2,5) | Adet | 6,60
**10.200.3972** | Paslanmaz harçlı ankraj Lama (20x100x2,5) | Adet | 5,50
**10.200.3973** | Paslanmaz harçlı ankraj Lama (20x130x2,5) | Adet | 7,20
**10.200.3974** | Paslanmaz harçlı ankraj Lama (20x150x2,5) | Adet | 7,70
**10.200.3975** | Paslanmaz harçlı ankraj Lama (20x150x3) | Adet | 9,00
**10.200.3976** | Paslanmaz harçlı ankraj Lama (20x180x3) | Adet | 10,50
**10.200.3977** | Paslanmaz harçlı ankraj Lama (20x200x3) | Adet | 11,80
**10.200.3991** | Paslanmaz harçlı ankraj Çubuk (Ø5x150) | Adet | 2,70
**10.200.3992** | Paslanmaz harçlı ankraj Çubuk (Ø6x150) | Adet | 3,85
**10.200.3993** | Paslanmaz harçlı ankraj Çubuk (Ø6x200) | Adet | 5,00
**10.200.3994** | Paslanmaz harçlı ankraj Çubuk (Ø8x150) | Adet | 6,60
**10.200.4001** | Paslanmaz gömlekli dübel (M6x80) | Adet | 5,20
**10.200.4002** | Paslanmaz gömlekli dübel (M6x100) | Adet | 5,95
**10.200.4003** | Paslanmaz gömlekli dübel (M8x80) | Adet | 7,70
**10.200.4004** | Paslanmaz gömlekli dübel (M8x100) | Adet | 8,40
**10.200.4005** | Paslanmaz gömlekli dübel (M10x80) | Adet | 11,50
**10.200.4006** | Paslanmaz gömlekli dübel (M10x100) | Adet | 12,65
**10.200.4007** | Paslanmaz gömlekli dübel (M10x120) | Adet | 14,00
**10.200.4021** | Galvaniz gömlekli dübel (M6x80) | Adet | 2,25
**10.200.4022** | Galvaniz gömlekli dübel (M6x100) | Adet | 2,65
**10.200.4023** | Galvaniz gömlekli dübel (M8x80) | Adet | 3,20
**10.200.4024** | Galvaniz gömlekli dübel (M8x100) | Adet | 3,60
**10.200.4025** | Galvaniz gömlekli dübel (M10x80) | Adet | 4,50
**10.200.4026** | Galvaniz gömlekli dübel (M10x100) | Adet | 4,95
**10.200.4027** | Galvaniz gömlekli dübel (M10x120) | Adet | 5,25
**10.200.4041** | Paslanmaz klipsli dübel (M6x65) | Adet | 5,60
**10.200.4042** | Paslanmaz klipsli dübel (M6x80) | Adet | 5,60
**10.200.4043** | Paslanmaz klipsli dübel (M6x100) | Adet | 6,60
**10.200.4044** | Paslanmaz klipsli dübel (M8x70) | Adet | 7,55
**10.200.4045** | Paslanmaz klipsli dübel (M8x80) | Adet | 7,90
**10.200.4046** | Paslanmaz klipsli dübel (M8x100) | Adet | 9,70
**10.200.4047** | Paslanmaz klipsli dübel (M10x90) | Adet | 14,50
**10.200.4048** | Paslanmaz klipsli dübel (M10x120) | Adet | 17,60
**10.200.4049** | Paslanmaz klipsli dübel (M12x110) | Adet | 23,10
**10.200.4050** | Paslanmaz klipsli dübel (M12x120) | Adet | 23,65
**10.200.4051** | Paslanmaz klipsli dübel (M16x145) | Adet | 51,50
"""

def append_to_json(text, filename='pozlar.json'):
    # Regex deseni (Bitişik verileri ayırmak için optimize edildi)
    # Updated to handle markdown bold markers **
    pattern = r"(?:\*\*)?(\d{2}\.\d{3}\.\d{4})(?:\*\*)?\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(\d+(?:\.\d{3})*,\d{2})"
    matches = re.findall(pattern, text)

    new_items = []
    for match in matches:
        new_items.append({
            "pozNo": match[0].strip(),
            "tanim": match[1].strip(),
            "birim": match[2].strip(),
            "birimFiyat": float(match[3].replace('.', '').replace(',', '.')),
            "kurum": "ÇŞB",
            "yil": 2025
        })

    # Eğer dosya zaten varsa mevcut veriyi oku
    existing_data = []
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            existing_data = json.load(f)

    # Yeni verileri eskilere ekle (Tekrar edenleri engellemek için set kullanılabilir ama şimdilik düz ekliyoruz)
    combined_data = existing_data + new_items

    # Güncel listeyi kaydeder
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, ensure_ascii=False, indent=2)

    print(f"İşlem Tamam! Toplam Poz Sayısı: {len(combined_data)}")

# Çalıştır
append_to_json(new_raw_text)