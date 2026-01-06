import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2
    }).format(amount);
};

export const downloadCSV = (data, filename, categories) => {
    let csvContent = "\uFEFF";
    csvContent += "Açıklama;Kategori;Alt Kategori;Miktar;Birim;Birim Fiyat;Toplam Tutar;Detay\n";
    data.forEach(item => {
        const catName = categories.find(c => c.id === item.category)?.name || item.category;
        const total = (parseFloat(item.quantity) * parseFloat(item.unitPrice)).toFixed(2);
        const details = item.dims ? `"${item.dims}"` : '-';
        const row = [`"${item.description}"`, `"${catName}"`, `"${item.subCategory || '-'}"`, item.quantity, item.unit, item.unitPrice, total, details].join(";");
        csvContent += row + "\n";
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
