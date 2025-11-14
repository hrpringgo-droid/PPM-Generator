import { GoogleGenAI, GenerateContentResponse, Part, Modality } from "@google/genai";
import {
  PPM_GENERATION_MODEL,
  CHAT_MODEL,
  IMAGE_ANALYSIS_MODEL,
  NILAI_CINTA,
  DIMENSI_PROFIL_LULUSAN
} from '../constants';

// Helper to escape backticks for template literals to prevent syntax errors within the prompt string
function escapeBackticks(str: string): string {
  return str.replace(/`/g, '\\`');
}

// A global variable to hold the Gemini client instance.
// It's re-initialized for each API call to ensure the latest API key is used, as per best practices for AISTudio environments.
let ai: GoogleGenAI | null = null;

/**
 * Initializes and returns a GoogleGenAI client instance.
 * Throws an error if the API_KEY environment variable is not set.
 */
const getGeminiClient = (): GoogleGenAI => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set in the environment variables.");
  }
  // Always create a new instance to ensure the latest API key is used.
  // This is particularly important for models like Veo, but good practice generally
  // to pick up any external updates to process.env.API_KEY.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Generates a Deep Learning Lesson Plan (PPM) based on provided inputs
 * and integrates deep learning principles and 'nilai cinta'.
 * The output is expected to be a Markdown string.
 * @param inputs The form data for the PPM.
 * @returns A Promise that resolves to the generated PPM content as a string.
 */
export const generatePPM = async (inputs: {
  namaMadrasah: string;
  namaGuru: string;
  mapel: string;
  fase: string;
  kelas: string;
  semester: string;
  alokasiWaktu: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  materiPembelajaran: string;
}): Promise<string> => {
  ai = getGeminiClient(); // Get a fresh client instance
  const {
    namaMadrasah,
    namaGuru,
    mapel,
    fase,
    kelas,
    semester,
    alokasiWaktu,
    capaianPembelajaran,
    tujuanPembelajaran,
    materiPembelajaran,
  } = inputs;

  // Construct a detailed prompt to guide Gemini in generating the structured PPM.
  // Backticks within the string literals are escaped to avoid conflicts with template literal delimiters.
  const prompt = `
  Anda adalah seorang ahli pendidikan yang bertugas menyusun Perencanaan Pembelajaran Mendalam (PPM) yang komprehensif.
  PPM ini harus mengintegrasikan pendekatan pembelajaran mendalam (mindful, meaningful, joyful) dan nilai-nilai cinta.
  Berikan output dalam format Markdown yang mudah dibaca.

  Berikut adalah data masukan untuk PPM:
  Nama Madrasah: ${escapeBackticks(namaMadrasah)}
  Nama Guru: ${escapeBackticks(namaGuru)}
  Mata Pelajaran: ${escapeBackticks(mapel)}
  Fase: ${escapeBackticks(fase)}
  Kelas: ${escapeBackticks(kelas)}
  Semester: ${escapeBackticks(semester)}
  Alokasi Waktu: ${escapeBackticks(alokasiWaktu)}
  Capaian Pembelajaran: ${escapeBackticks(capaianPembelajaran)}
  Tujuan Pembelajaran: ${escapeBackticks(tujuanPembelajaran)}
  Materi Pembelajaran: ${escapeBackticks(materiPembelajaran)}

  Hasilkan Perencanaan Pembelajaran Mendalam (PPM) dengan sistematika dan integrasi sebagai berikut:

  # Perencanaan Pembelajaran Mendalam

  ## I. IDENTITAS
  *   **Nama Madrasah**: ${escapeBackticks(namaMadrasah)}
  *   **Nama Guru**: ${escapeBackticks(namaGuru)}
  *   **Mata Pelajaran**: ${escapeBackticks(mapel)}
  *   **Fase**: ${escapeBackticks(fase)}
  *   **Kelas**: ${escapeBackticks(kelas)}
  *   **Semester**: ${escapeBackticks(semester)}
  *   **Alokasi Waktu**: ${escapeBackticks(alokasiWaktu)}

  ### 1. Materi Pelajaran
  Jelaskan materi pembelajaran "${escapeBackticks(materiPembelajaran)}" yang diintegrasikan dengan nilai-nilai cinta berikut: ${NILAI_CINTA.map(val => `"${escapeBackticks(val)}"`).join(', ')}.

  ### 2. Dimensi Profil Lulusan
  Pilih dan jelaskan dimensi profil lulusan yang paling sesuai dengan Tujuan Pembelajaran "${escapeBackticks(tujuanPembelajaran)}" dari daftar berikut, sertakan penjelasannya untuk setiap dimensi yang dipilih: ${DIMENSI_PROFIL_LULUSAN.map(val => `"${escapeBackticks(val)}"`).join(', ')}.

  ### 3. Pokok Materi
  ${escapeBackticks(materiPembelajaran)}

  ## II. DESAIN PEMBELAJARAN
  Pembelajaran mendalam (deep learning) adalah pendekatan holistik yang mengintegrasikan pembelajaran penuh kesadaran (mindful), pembelajaran bermakna (meaningful), dan pembelajaran menyenangkan (joyful). Ketiga komponen ini saling berkaitan dan memperkuat satu sama lain untuk menciptakan lingkungan belajar yang efektif dan menyenangkan. Pembelajaran yang bermakna akan meningkatkan motivasi, pembelajaran yang sadar akan membantu siswa fokus, dan pembelajaran yang menyenangkan akan membuat mereka lebih menikmati prosesnya. Pendekatan ini mengintegrasikan olah pikir, olah hati, olah rasa, dan olah raga secara terpadu untuk pembelajaran yang lebih holistik.

  ### 1. Capaian Pembelajaran
  Jelaskan capaian pembelajaran "${escapeBackticks(capaianPembelajaran)}" yang diintegrasikan dengan nilai-nilai cinta atau konsep KBC (Karakter, Berpikir Kritis, dan Kreativitas).

  ### 2. Lintas Disiplin Ilmu
  Secara otomatis, identifikasi dan jelaskan mata pelajaran lain yang sesuai untuk berkolaborasi atau memiliki keterkaitan dengan tujuan pembelajaran "${escapeBackticks(tujuanPembelajaran)}".

  ### 3. Tujuan Pembelajaran
  Jelaskan tujuan pembelajaran "${escapeBackticks(tujuanPembelajaran)}" yang diintegrasikan dengan nilai-nilai cinta atau konsep KBC (Karakter, Berpikir Kritis, dan Kreativitas).

  ### 4. Praktik Pedagogis
  Berdasarkan Tujuan Pembelajaran "${escapeBackticks(tujuanPembelajaran)}" dan prinsip pembelajaran mendalam, jelaskan secara otomatis:
  a. **Model**: Model pembelajaran yang sesuai dan disarankan oleh pembelajaran mendalam.
  b. **Strategi**: Strategi pembelajaran yang efektif.
  c. **Metode**: Metode pembelajaran yang mendukung.

  ### 5. Kemitraan Pembelajaran
  Secara otomatis, identifikasi dan jelaskan pihak-pihak yang sesuai untuk berkolaborasi dalam pembelajaran ini:
  a. **Internal Sekolah**: Contohnya Laboran sekolah, Guru lain (sebutkan mata pelajaran jika relevan), atau staf lain. Jelaskan peran dan kontribusinya.
  b. **Eksternal Sekolah**: Pihak dari luar sekolah (misalnya lembaga, komunitas, pakar). Jelaskan siapa, apa, dan bagaimana mereka dapat mendukung pembelajaran.

  ### 6. Lingkungan Pembelajaran
  a. **Fisik**: Jelaskan pengaturan lingkungan fisik kelas atau area belajar yang mendukung pembelajaran mendalam.
  b. **Virtual**: Identifikasi dan jelaskan platform atau sumber daya virtual yang mendukung pembelajaran.
  c. **Budaya Belajar**: Jelaskan bagaimana menciptakan budaya belajar yang positif, inklusif, dan mendorong eksplorasi.

  ### 7. Pemanfaatan Digital
  Identifikasi dan jelaskan pemanfaatan media digital yang relevan dengan materi pembelajaran "${escapeBackticks(materiPembelajaran)}" dan mendukung tujuan pembelajaran.

  ## III. PENGALAMAN BELAJAR
  Sajikan pengalaman belajar dalam tiga tahapan, dengan mengintegrasikan prinsip berkesadaran (mindful), bermakna (meaningful), dan menggembirakan (joyful) ke dalam setiap kegiatan. Sesuaikan alokasi waktu secara proporsional dari total "${escapeBackticks(alokasiWaktu)}".

  ### 1. Kegiatan Awal (Alokasi Waktu: sekitar X menit)
  Jelaskan kegiatan awal yang berkesadaran, bermakna, dan menggembirakan.

  ### 2. Kegiatan Inti (Alokasi Waktu: sekitar Y menit)
  Jelaskan kegiatan inti yang mendalam, melibatkan siswa dalam pemecahan masalah, diskusi, proyek, dll., dengan mengintegrasikan prinsip berkesadaran, bermakna, dan menggembirakan.

  ### 3. Kegiatan Penutup (Alokasi Waktu: sekitar Z menit)
  Jelaskan kegiatan penutup yang menguatkan pemahaman, refleksi, dan tindak lanjut, dengan mengintegrasikan prinsip berkesadaran, bermakna, dan menggembirakan.

  ## IV. ASESMEN PEMBELAJARAN
  Rancang asesmen yang relevan dan sesuai dengan materi dan tujuan pembelajaran.

  ### 1. Asesmen Awal Pembelajaran
  Jelaskan bentuk asesmen awal yang paling sesuai dengan materi "${escapeBackticks(materiPembelajaran)}" dan tujuan pembelajaran "${escapeBackticks(tujuanPembelajaran)}".

  ### 2. Asesmen Proses Pembelajaran (Formatif dan Sikap)
  Jelaskan bentuk asesmen formatif dan penilaian sikap yang dilakukan selama proses pembelajaran.

  ### 3. Asesmen Akhir Pembelajaran (Sumatif)
  Jelaskan bentuk asesmen sumatif yang paling sesuai untuk mengukur pencapaian tujuan pembelajaran.

  ## Lampiran

  ### 1. Lembar Kerja Peserta Didik (LKPD)
  Buatkan sebuah Lembar Kerja Peserta Didik (LKPD) yang menarik dan relevan dengan materi "${escapeBackticks(materiPembelajaran)}" dan tujuan pembelajaran "${escapeBackticks(tujuanPembelajaran)}".
  LKPD harus memiliki judul yang sesuai dan sebuah tabel lengkap dengan isi untuk bagian-bagian berikut:
  -   **Tujuan Kegiatan**: Jelaskan tujuan spesifik kegiatan LKPD ini.
  -   **Alat dan Bahan**: Daftar alat dan bahan yang diperlukan.
  -   **Langkah Kerja**: Panduan langkah demi langkah untuk siswa.
  -   **Ruang Jawaban/Diskusi**: Sediakan kolom atau bagian untuk siswa menuliskan jawaban, hasil observasi, atau poin diskusi.

  ### 2. Instrumen/Rubrik Penilaian
  Buat rubrik penilaian lengkap dengan kriteria, indikator, dan skala penilaian (misalnya: Sangat Baik, Baik, Cukup, Kurang) untuk:

  A. **Rubrik Penilaian Kognitif**:
     -   Sesuai dengan materi "${escapeBackticks(materiPembelajaran)}" dan tujuan pembelajaran "${escapeBackticks(tujuanPembelajaran)}".
     -   Sertakan setidaknya 3-5 kriteria yang mengukur pemahaman, penerapan, analisis, atau evaluasi.

  B. **Rubrik Penilaian Sikap**:
     -   Berdasarkan nilai-nilai cinta (${NILAI_CINTA.map(val => `"${escapeBackticks(val)}"`).join(', ')}) dan dimensi profil lulusan (${DIMENSI_PROFIL_LULUSAN.map(val => `"${escapeBackticks(val)}"`).join(', ')}).
     -   Sertakan kriteria seperti kerjasama, tanggung jawab, kejujuran, atau kepedulian.

  C. **Rubrik Penilaian Presentasi**:
     -   Rubrik umum yang relevan jika ada kegiatan presentasi.
     -   Sertakan kriteria seperti kelancaran berbicara, kejelasan materi, kreativitas, dan penguasaan audiens.

  Pastikan semua penjelasan terperinci dan formatnya dalam Markdown yang rapi.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: PPM_GENERATION_MODEL,
      contents: { parts: [{ text: prompt }] },
      config: {
        temperature: 0.9, // Higher temperature for more creative/diverse output
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8000, // Increased token limit for comprehensive output
        thinkingConfig: { thinkingBudget: 4000 }, // Allocate thinking budget for complex generation
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating PPM:", error);
    // Provide a more specific error message from the API if available
    throw new Error(`Failed to generate PPM: ${(error as Error).message}`);
  }
};

/**
 * Sends a chat message to the Gemini model and returns its text response.
 * @param message The user's chat message.
 * @returns A Promise that resolves to the Gemini's text response.
 */
export const sendChat = async (message: string): Promise<string> => {
  ai = getGeminiClient(); // Get a fresh client instance
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: CHAT_MODEL,
      contents: { parts: [{ text: message }] },
      config: {
        temperature: 0.8, // Balanced temperature for chat
        topP: 0.9,
        topK: 40,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw new Error(`Failed to send chat message: ${(error as Error).message}`);
  }
};

/**
 * Analyzes an uploaded image using the Gemini model and a text prompt.
 * @param base64Image The Base64 encoded string of the image.
 * @param mimeType The MIME type of the image (e.g., 'image/png', 'image/jpeg').
 * @param prompt The text prompt for analysis.
 * @returns A Promise that resolves to the analysis result as a string.
 */
export const analyzeImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
): Promise<string> => {
  ai = getGeminiClient(); // Get a fresh client instance
  const imagePart: Part = {
    inlineData: {
      mimeType: mimeType,
      data: base64Image,
    },
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: IMAGE_ANALYSIS_MODEL,
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        temperature: 0.4, // Lower temperature for more factual/less creative analysis
        topP: 0.8,
        topK: 32,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error(`Failed to analyze image: ${(error as Error).message}`);
  }
};