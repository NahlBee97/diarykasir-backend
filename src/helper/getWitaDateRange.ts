export const getWitaDateRange = (dateString?: string) => {
  let targetDateStr;

  if (dateString) {
    // Jika ada input tanggal (misal: "2025-12-24")
    targetDateStr = dateString.split("T")[0]; // Ambil YYYY-MM-DD nya saja
  } else {
    // Jika tidak ada input (untuk getToday), ambil tanggal SEKARANG di WITA
    targetDateStr = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Makassar", // Kunci utamanya di sini
    });
  }

  // Paksa Start Date mulai jam 00:00 WITA (+08:00)
  const start = new Date(`${targetDateStr}T00:00:00+08:00`);

  // Paksa End Date sampai jam 23:59 WITA (+08:00)
  const end = new Date(`${targetDateStr}T23:59:59.999+08:00`);

  return { start, end };
};
