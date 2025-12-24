import { supabase } from "../lib/supabase";

// 3. Fungsi Upload Utama
export const uploadImageToSupabase = async (file: Express.Multer.File) => {
  try {
    // Buat nama file unik: timestamp-namafileasli
    // replace(/\s/g, '-') mengganti spasi dengan strip agar aman di URL
    const fileName = `img-${Date.now()}-${file.originalname.replace(
      /\s/g,
      "-"
    )}`;

    // Upload ke bucket 'products'
    const { data, error } = await supabase.storage
      .from("product_images") // Sesuaikan dengan nama bucket di Langkah 1
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      throw new Error("Gagal upload ke Storage");
    }

    // Ambil Public URL untuk disimpan di Database
    const { data: urlData } = supabase.storage
      .from("product_images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    throw error;
  }
};
