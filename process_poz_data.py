import re
import json

raw_data = """
10.100.1001 | Taşcı ustası | Sa | 250,00
10.100.1002 | Karo kaplama ustası | Sa | 250,00
10.100.1003 | Fayans kaplama ustası | Sa | 250,00
10.100.1004 | Seramik kaplama ustası | Sa | 250,00
10.100.1005 | Mermer kaplama ustası | Sa | 250,00
10.100.1006 | Mermer yonucu ustası | Sa | 250,00
10.100.1007 | Mozayikci ustası | Sa | 250,00
10.100.1008 | Doğramacı ustası | Sa | 250,00
10.100.1009 | Marangoz ustası | Sa | 250,00
10.100.1010 | Yalıtımcı ustası | Sa | 250,00
10.100.1011 | Lağımcı (Ateşleme ustası) | Sa | 250,00
10.100.1012 | Sıvacı ustası | Sa | 250,00
10.100.1013 | Duvarcı ustası | Sa | 250,00
10.100.1014 | Kaldırımcı ustası | Sa | 250,00
10.100.1015 | Betoncu ustası | Sa | 250,00
10.100.1016 | Kiremit tipi çatı kaplamacısı | Sa | 250,00
10.100.1017 | Dülger ustası | Sa | 250,00
10.100.1018 | Sıcak demirci ustası | Sa | 250,00
10.100.1019 | Soğuk demirci ustası | Sa | 250,00
10.100.1020 | Alçı işleri ustası | Sa | 250,00
10.100.1021 | Kaynakçı ustası | Sa | 250,00
10.100.1022 | Camcı ustası | Sa | 250,00
10.100.1023 | Boyacı ustası | Sa | 250,00
10.100.1024 | Badanacı ustası | Sa | 250,00
10.100.1025 | Döşemeci ustası | Sa | 250,00
10.100.1026 | Tenekeci ustası | Sa | 250,00
10.100.1027 | Tornacı ustası | Sa | 250,00
10.100.1028 | Muşambacı ustası | Sa | 250,00
10.100.1029 | Cilacı ustası | Sa | 250,00
10.100.1030 | Buvazör (İksa işleri yapar) | Sa | 250,00
10.100.1031 | Bakırcı ustası | Sa | 250,00
10.100.1032 | Alüminyum ustası | Sa | 250,00
10.100.1033 | Alçı levha ustası | Sa | 250,00
10.100.1034 | Alçı blok ustası | Sa | 250,00
10.100.1035 | İskele Kurulum Elemanı | Sa | 250,00
10.100.1036 | Panel Çatı Kaplamacısı | Sa | 250,00
10.100.1037 | Beton Pompa Operatörü | Sa | 300,00
10.100.1038 | Alçı levha usta yardımcısı | Sa | 185,00
10.100.1039 | Mozayikçi usta yardımcısı | Sa | 185,00
10.100.1040 | Alçı blok usta yardımcısı | Sa | 185,00
10.100.1041 | Marangoz usta yardımcısı | Sa | 185,00
10.100.1042 | Yalıtımcı usta yardımcısı | Sa | 185,00
10.100.1043 | Alçı işleri usta yardımcısı | Sa | 185,00
10.100.1044 | Sıvacı usta yardımcısı | Sa | 185,00
10.100.1045 | Duvarcı usta yardımcısı | Sa | 185,00
10.100.1046 | Sıcak demirci usta yardımcısı | Sa | 185,00
10.100.1047 | Soğuk demirci usta yardımcısı | Sa | 185,00
10.100.1048 | Cilacı usta yardımcısı | Sa | 185,00
10.100.1049 | Borucu usta yardımcısı | Sa | 185,00
10.100.1050 | Borucu ustası | Sa | 250,00
10.100.1051 | Şoför | Sa | 250,00
10.100.1052 | Ağır kamyon şöförü | Sa | 285,00
10.100.1053 | Tamirci baş makinist | Sa | 360,00
10.100.1054 | Makinist | Sa | 250,00
10.100.1055 | Operatör makinist | Sa | 285,00
10.100.1056 | Makinist yardımcısı | Sa | 210,00
10.100.1057 | Operatör yardımcısı | Sa | 240,00
10.100.1058 | Şöför yardımcısı | Sa | 200,00
10.100.1059 | Yağcı | Sa | 185,00
10.100.1060 | Formen | Sa | 360,00
10.100.1061 | Topoğraf | Sa | 275,00
10.100.1062 | Düz işçi (İnşaat işçisi) | Sa | 165,00
10.100.1063 | Erbab işçi | Sa | 200,00
10.100.1064 | Çırak | Sa | 165,00
10.100.1065 | Çavuş | Sa | 185,00
10.100.1066 | Tenekeci usta yardımcısı | Sa | 185,00
10.100.1067 | Tünelde buvazör | Sa | 240,00
10.100.1068 | Birinci sınıf usta | Sa | 250,00
10.100.1069 | Birinci sınıf usta yardımcısı | Sa | 185,00
10.100.1070 | İkinci sınıf usta | Sa | 240,00
10.100.1071 | İkinci sınıf usta yardımcısı | Sa | 185,00
10.100.1072 | Pulverizatör operatörü | Sa | 220,00
10.100.1073 | Torkret (marpuçla beton tatbik eder) | Sa | 220,00
10.100.1074 | Bahçıvan ve fidan ustası | Sa | 220,00
10.100.1075 | Pist beton kaplama ustası (Hava meydanları inş.için) | Sa | 250,00
10.100.1076 | Baş sondör | Sa | 320,00
10.100.1077 | Sondör | Sa | 305,00
10.100.1078 | Pompa teknisyeni | Sa | 285,00
10.100.1079 | Aşçı | Sa | 265,00
10.100.1080 | Aşçı yardımcısı | Sa | 240,00
10.100.1081 | Elektrik ustası | Sa | 250,00
10.100.1082 | Tesisat ustası | Sa | 250,00
10.100.1083 | Elektrik usta yardımcısı | Sa | 185,00
10.100.1084 | Tesisat usta yardımcısı | Sa | 185,00
10.100.1085 | Kule vinç operatörü | Sa | 390,00
10.100.1086 | Ahşap Kalıpçı (Betonarme) | Sa | 250,00
10.100.1087 | Tünel Kalıpçısı (Betonarme) | Sa | 250,00
10.100.1088 | Panel Kalıpçı (Betonarme) | Sa | 250,00
10.100.1089 | Metal Kalıp Ustası (Betonarme) | Sa | 250,00
10.100.1090 | Kalıp İşleri Usta Yardımcısı | Sa | 185,00
10.100.1091 | Test, Ayar ve Devreye Alma Uzmanı | Sa | 700,00
10.100.1501 | Tarak gemisi kaptanı (yakın yol kaptanı) | Sa | 435,00
10.100.1502 | Tarak gemisi baş makinisti (çarçı başı) | Sa | 370,00
10.100.1503 | Tarama uzmanı | Sa | 500,00
10.100.1504 | Romörkör kaptanı (Kıyı kaptanı) | Sa | 340,00
10.100.1505 | Romorkör makinisti (Çarkçı) | Sa | 340,00
10.100.1506 | Zatülhareke taş ve çamur dubası kaptanı (Liman kaptanı) | Sa | 340,00
10.100.1507 | Zatülhareke taş ve çamur dubası makinisti (Çarkcı) | Sa | 320,00
10.100.1508 | Maçula reisi | Sa | 320,00
10.100.1509 | Tarak gemisi ikinci kaptanı (Kıyı kaptanı) | Sa | 320,00
"""

def parse_poz_data(text):
    # Poz No (10.xxx.xxxx) ile başlayan desenleri yakala
    # Metin bitişik olduğu için "fiyat"tan sonra gelen yeni "poz no"yu ayırıyoruz
    pattern = r"(\d{2}\.\d{3}\.\d{4})\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(\d+,\d{2})"
    matches = re.findall(pattern, text)

    poz_list = []
    for match in matches:
        poz_list.append({
            "pozNo": match[0].strip(),
            "tanim": match[1].strip(),
            "birim": match[2].strip(),
            "birimFiyat": float(match[3].replace(',', '.')), # Virgülü noktaya çevirip sayı yapıyoruz
            "kurum": "ÇŞB",
            "yil": 2025
        })
    return poz_list

clean_data = parse_poz_data(raw_data)

# JSON olarak kaydet
with open('pozlar_2025.json', 'w', encoding='utf-8') as f:
    json.dump(clean_data, f, ensure_ascii=False, indent=2)

print(f"Başarıyla {len(clean_data)} adet poz temizlendi ve kaydedildi!")
