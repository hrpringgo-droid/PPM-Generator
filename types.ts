export interface PPMFormInputs {
  namaMadrasah: string;
  namaGuru: string;
  mapel: string;
  fase: string;
  kelas: string;
  semester: string;
  alokasiWaktu: string; // e.g., "120 menit"
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  materiPembelajaran: string;
}

export interface ChatMessage {
  sender: 'user' | 'gemini';
  text: string;
}

export type SectionType = 'ppm' | 'chat' | 'image';
