import { Download, FileSpreadsheet, AlertCircle, Upload } from 'lucide-react';

interface TemplateKelompokUMMIProps {
  onUpload: (data: any[]) => void;
}

export default function TemplateKelompokUMMI({ onUpload }: TemplateKelompokUMMIProps) {
  
  const downloadTemplate = () => {
    const headers = ['nama', 'jenjang_id', 'guru_pengampu_id', 'tingkat_sekolah', 'kelas_sumber', 'tahun_ajaran', 'kapasitas'];
    const example = [
      ['Jilid 2 - Ust. Ahmad', 'J2', 'G001', '2', '2A, 2B, 2C', '2026/2027', '30'],
      ['Jilid 3 - Ust. Budi', 'J3', 'G002', '3', '3A, 3B, 3C', '2026/2027', '25'],
      ['Juz 30 - Ust. Cahya', 'T1', 'G003', '5', '5A, 5B', '2026/2027', '15'],
      ['Jilid 6 + Tahfidz - Ust. Dewi', 'K1', 'G004', '6', '6A, 6B, 6C', '2026/2027', '20']
    ];
    
    const csvContent = [
      headers.join(','),
      ...example.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_kelompok_ummi.csv';
    link.click();
  };

  const downloadExcelTemplate = () => {
    const html = `
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; }
          th { background: #10b981; color: white; font-weight: bold; padding: 8px; border: 1px solid #059669; }
          td { padding: 8px; border: 1px solid #d1d5db; }
        </style>
      </head>
      <body>
        <h2>Template Import Kelompok UMMI</h2>
        <table>
          <tr>
            <th>nama</th>
            <th>jenjang_id</th>
            <th>guru_pengampu_id</th>
            <th>tingkat_sekolah</th>
            <th>kelas_sumber</th>
            <th>tahun_ajaran</th>
            <th>kapasitas</th>
          </tr>
          <tr><td>Jilid 2 - Ust. Ahmad</td><td>J2</td><td>G001</td><td>2</td><td>2A, 2B, 2C</td><td>2026/2027</td><td>30</td></tr>
          <tr><td>Jilid 3 - Ust. Budi</td><td>J3</td><td>G002</td><td>3</td><td>3A, 3B, 3C</td><td>2026/2027</td><td>25</td></tr>
        </table>
        <br>
        <h3>Daftar Jenjang ID:</h3>
        <table>
          <tr><th>ID</th><th>Nama</th><th>Tipe</th></tr>
          <tr><td>J1</td><td>Jilid 1</td><td>ummi</td></tr>
          <tr><td>J2</td><td>Jilid 2</td><td>ummi</td></tr>
          <tr><td>J3</td><td>Jilid 3</td><td>ummi</td></tr>
          <tr><td>J4</td><td>Jilid 4</td><td>ummi</td></tr>
          <tr><td>J5</td><td>Jilid 5</td><td>ummi</td></tr>
          <tr><td>J6</td><td>Jilid 6</td><td>ummi</td></tr>
          <tr><td>T1</td><td>Juz 30</td><td>tahfidz</td></tr>
          <tr><td>T2</td><td>Juz 29</td><td>tahfidz</td></tr>
          <tr><td>T3</td><td>Juz 1</td><td>tahfidz</td></tr>
          <tr><td>T4</td><td>Tajwid</td><td>tahfidz</td></tr>
          <tr><td>T5</td><td>Ghorib</td><td>tahfidz</td></tr>
          <tr><td>K1</td><td>Jilid 6 + Tahfidz</td><td>kombinasi</td></tr>
        </table>
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_kelompok_ummi.xls';
    link.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
      
      onUpload(data);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-blue-500 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="font-bold text-blue-800 mb-2">Template Import Data</h3>
          <p className="text-sm text-blue-600 mb-3">
            Download template untuk import data kelompok UMMI secara massal.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <button 
              onClick={downloadTemplate}
              className="bg-white border border-blue-300 text-blue-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-100"
            >
              <Download size={16} />
              Download CSV
            </button>
            
            <button 
              onClick={downloadExcelTemplate}
              className="bg-white border border-green-300 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-green-100"
            >
              <FileSpreadsheet size={16} />
              Download Excel
            </button>
          </div>
          
          <div className="border-t border-blue-200 pt-3">
            <label className="flex items-center gap-2 bg-white border border-blue-300 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 cursor-pointer w-fit">
              <Upload size={16} />
              Upload CSV
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}