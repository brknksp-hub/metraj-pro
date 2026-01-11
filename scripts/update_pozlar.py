import re
import json
import os

new_raw_text = """
**PozNo | Tanım | Birim | Fiyat**

**10.100.1510** | Tarak gemisi ikinci makinisti (Çarkçı) | Sa | 360,00
**10.100.1511** | Güverte lostromosu | Sa | 240,00
**10.100.1512** | Makina lostromosu | Sa | 240,00
**10.100.1513** | Usta gemici | Sa | 235,00
**10.100.1514** | Gemi yağcısı | Sa | 235,00
**10.100.1515** | Dalgıç klavuzu | Sa | 235,00
**10.100.1516** | Gemi aşçıbaşı | Sa | 235,00
**10.100.1517** | Gemi ateşcisi | Sa | 235,00
**10.100.1518** | Kamarot | Sa | 210,00
**10.100.1519** | Gemici (Tayfa) | Sa | 210,00
**10.100.1520** | Gemi silicisi | Sa | 210,00
**10.100.1521** | Gemi aşçı yardımcısı | Sa | 210,00
**10.100.1522** | Dalgıç | Sa | 575,00
**10.110.1001** | Üç at veya katır ile sürücüden ibaret taşıt katarı | Gündelik | 545,00
**10.110.1002** | Her cins hayvanla çekilen arabalar için taşıma katsayısı | - | 330,00
**10.110.1003** | Her cins ve tonajda motorlu araç taşıma katsayısı K | - | 1.750,00
**10.120.1001** | Ekskavatör ve dragline tipi makinalar 100-139 HP | Adet | 3.500.000,00
**10.120.1002** | Ekskavatör ve dragline tipi makinalar 140-169 HP | Adet | 4.750.000,00
**10.120.1003** | Ekskavatör ve dragline tipi makinalar 170-209 HP | Adet | 5.000.000,00
**10.120.1004** | Ekskavatör ve dragline tipi makinalar 210-259 HP | Adet | 6.500.000,00
**10.120.1005** | Ekskavatör (paletli) (210-259 HP) (maks. 2,5 m³) | Adet | 6.500.000,00
**10.120.1006** | Ekskavatör ve dragline tipi makinalar 260-299 HP | Adet | 7.400.000,00
**10.120.1007** | Ekskavatör (paletli) (260-299 HP) (maks. 2,5 m³) | Adet | 7.400.000,00
**10.120.1008** | Ekskavatör beko takriben 125 HP | Adet | 4.800.000,00
**10.120.1009** | Ekskavatör (paletli) (300-329 HP) (maks. 3,5 m³) | Adet | 9.000.000,00
**10.120.1010** | Traktör skreyper (111 HP+Vagon kova 8Yd3) | Adet | 2.600.000,00
**10.120.1011** | Traktör ripper (185HP+Ripper) | Adet | 5.900.000,00
**10.120.1012** | Motor greyder (80 HP'den yukarı güçte) | Adet | 2.700.000,00
**10.120.1013** | Greyder (190-209 HP) | Adet | 8.300.000,00
**10.120.1014** | Greyder (210-230 HP) | Adet | 9.500.000,00
**10.120.1015** | Lastik tekerlekli traktör-skreyper (250 HP 24 Yd3) | Adet | 11.000.000,00
**10.120.1016** | Traktör buldozer (70 HP motor+bıçak) | Adet | 1.850.000,00
**10.120.1017** | Traktör buldozer (100 HP motor+bıçak) | Adet | 2.250.000,00
**10.120.1018** | Traktör buldozer (160 HP motor+bıçak) | Adet | 3.000.000,00
**10.120.1019** | Traktör buldozer (185 HP+bıçak) | Adet | 4.900.000,00
**10.120.1020** | Traktör buldozer (285 HP motor+bıçak) | Adet | 9.800.000,00
**10.120.1021** | Traktör buldozer (345 HP motor+bıçak) | Adet | 10.800.000,00
**10.120.1022** | Komple buharlı veya kompresörlü şahmerdan | Adet | 6.800.000,00
**10.120.1023** | Kompresör (210 Cfm'lik+hortum ve tabancalar) | Adet | 700.000,00
**10.120.1024** | Vantilasyon makinası (210 Cfm'lik+borular) | Adet | 760.000,00
**10.120.1025** | Kompresör (250 HP) | Adet | 2.300.000,00
**10.120.1026** | Enjeksiyon makinası (210 Cfm'lik+borular) | Adet | 760.000,00
**10.120.1027** | Kompresör (250 Cfm'lik+delici grubu+pick-up) | Adet | 950.000,00
**10.120.1028** | Enjeksiyon makinası (75 HP, 250 cfm) | Adet | 165.000,00
**10.120.1029** | Kazıcı yükleyici (100 HP) (maksimum 2,5 m³) | Adet | 3.100.000,00
**10.120.1030** | Yükleyici (1 1/2 Yd3 veya 5500 libre) | Adet | 1.800.000,00
**10.120.1031** | Yükleyici (lastik tekerlekli) (100 HP) | Adet | 2.500.000,00
**10.120.1032** | Yükleyici (trakskavatör) (Paletli) | Adet | 3.600.000,00
**10.120.1033** | Betoniyer (takriben 250 litrelik) | Adet | 118.000,00
**10.120.1034** | Betoniyer (takriben 500 Litrelik) | Adet | 118.000,00
**10.120.1035** | Betoniyer (takriben 1000 Litrelik) | Adet | 350.000,00
**10.120.1036** | Betoniyer (1000 litrelik yarı otomatik) | Adet | 350.000,00
**10.120.1037** | Mozayik silme makinası (Benzinli) | Adet | 47.500,00
**10.120.1038** | Yol çizgisi boyası silme makinası (7,5 HP) | Adet | 487.000,00
**10.120.1039** | Kum püskürtme makinası komple | Adet | 85.000,00
**10.120.1040** | Beton vibratörü (4 HP) | Adet | 85.000,00
**10.120.1041** | Komple kompresörle çalışan vibratör | Adet | 270.000,00
**10.120.1042** | Konkasör (120-150 m³/sa - 215 HP) | Adet | 8.400.000,00
**10.120.1043** | Eleme makinası (70 HP, 100 M3/saat) | Adet | 680.000,00
**10.120.1044** | Eleme makinası 70HP 100m3/sa | Adet | 680.000,00
**10.120.1045** | Elevatör (15 HP, 10-18m uzunluk) | Adet | 150.000,00
**10.120.1046** | Elevatör (25 HP, 18-24m uzunluk) | Adet | 325.000,00
**10.130.1001** | Çakıl (elenmesi gerekmeyen iri agrega) | m³ | 108,00
**10.130.1002** | Çakıl (elenmiş ve yıkanmış) | m³ | 270,00
**10.130.1003** | Çakıl (yıkanmış ve iki tane sınıfı karıştırılmış) | m³ | 306,00
**10.130.1004** | Kum (elenmesi gerekmeyen ince agrega) | m³ | 110,00
**10.130.1005** | Kum (elenmiş ve yıkanmış) | m³ | 272,00
**10.130.1006** | Kum (yıkanmış ve iki tane sınıfı karıştırılmış) | m³ | 308,00
**10.130.1007** | İnce sıva veya derz kumu (elenmiş ve yıkanmış) | m³ | 345,00
**10.130.1008** | 32 mm'ye kadar kırmataş | m³ | 370,00
**10.130.1009** | 63 mm'ye kadar kırmataş (karıştırılmış) | m³ | 325,00
**10.130.1201** | Portland çimentosu (Torbalı) (CEM I 42,5 N) | Ton | 2.500,00
**10.130.1202** | Portland çimentosu (Dökme) (CEM I 42,5 N) | Ton | 2.450,00
**10.130.1203** | Portland çimentosu (Torbalı) (CEM I 42,5 R) | Ton | 2.500,00
**10.130.1204** | Portland çimentosu (Dökme) (CEM I 42,5 R) | Ton | 2.450,00
**10.130.1205** | Portland Curuflu Çimento (Torbalı) (CEM II/A-S 42,5 R) | Ton | 2.430,00
**10.130.1209** | Portland Kalkerli Çimento (Torbalı) (CEM II/A-L 42,5 R) | Ton | 2.250,00
**10.130.1233** | Beyaz Portland Çimento (Torbalı) (CEM-I 52,5 R) | Ton | 4.450,00
**10.130.1501** | C 8/10 beton harcı | m³ | 1.950,00
**10.130.1502** | C 12/15 beton harcı | m³ | 2.050,00
**10.130.1503** | C 16/20 beton harcı | m³ | 2.150,00
**10.130.1504** | C 20/25 beton harcı | m³ | 2.250,00
**10.130.1505** | C 25/30 beton harcı | m³ | 2.350,00
**10.130.1506** | C 30/37 beton harcı | m³ | 2.450,00
**10.130.1701** | Beton çelik çubuğu, düz Ø 6 mm (S220) | Kg | 19,80
**10.130.1702** | Beton çelik çubuğu düz Ø8 - Ø10 - Ø12 mm | Kg | 19,70
**10.130.1704** | Beton çelik çubuğu, nervürlü Ø 8-12 mm | Kg | 21,00
**10.130.1751** | Çelik hasır (Nervürlü) (3.01-10.00 kg/m2) | Kg | 22,50
**10.130.2001** | 190 x 85 x 190 mm yatay delikli tuğla | Adet | 4,40
**10.130.2211** | 190 x 90 x 50 mm dolu harman tuğlası | Adet | 5,15
**10.130.2221** | 200 x 200 x 400 mm asmolen döşeme dolgu tuğlası | Adet | 19,45
**10.130.2501** | Techizatsız gazbeton duvar blokları | m³ | 1.778,00
"""

def append_to_json(text, filename='src/pozlar_2025.json'):
    # Regex pattern: handle optional ** before/after PozNo, and separators
    # Also capture price with dots and commas
    pattern = r"(?:\*\*)?(\d{2}\.\d{3}\.\d{4})(?:\*\*)?\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([\d\.,]+)"
    matches = re.findall(pattern, text)

    new_items = []
    for match in matches:
        price_str = match[3]
        # Turkish currency format: 1.000,00 -> 1000.00
        # Remove dots, replace comma with dot
        normalized_price = price_str.replace('.', '').replace(',', '.')

        try:
            price_float = float(normalized_price)
        except ValueError:
            print(f"Error parsing price: {price_str}")
            price_float = 0.0

        new_items.append({
            "pozNo": match[0].strip(),
            "tanim": match[1].strip(),
            "birim": match[2].strip(),
            "birimFiyat": price_float,
            "kurum": "ÇŞB",
            "yil": 2025
        })

    # Read existing data if available
    existing_data = []
    if os.path.exists(filename):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
        except json.JSONDecodeError:
            print("Existing file is empty or invalid JSON. Overwriting.")
            existing_data = []

    # In this case, we might want to deduplicate or just append.
    # The prompt implies appending, but since I'm creating the file mostly from scratch...
    # I'll just append for now as requested.
    combined_data = existing_data + new_items

    # Save updated list
    # Ensure directory exists
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, ensure_ascii=False, indent=2)

    print(f"Operation Complete! Total Items: {len(combined_data)}")

# Execute
if __name__ == "__main__":
    append_to_json(new_raw_text)
