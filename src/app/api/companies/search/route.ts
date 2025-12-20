import { NextRequest, NextResponse } from "next/server";

interface CompanyResult {
    name: string;
    domain: string;
    logo: string;
}

interface ClearbitCompany {
    name: string;
    domain: string;
    logo?: string;
}

// Helper to generate logo URL using Google Favicon API
const getLogoUrl = (domain: string): string => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

// Local database for companies NOT in Clearbit (especially Indonesian government & local companies)
// This supplements Clearbit, not replaces it
const LOCAL_COMPANIES: CompanyResult[] = [
    // Indonesian Government Agencies (Lembaga Pemerintah)
    { name: "Badan Pemeriksa Keuangan Republik Indonesia", domain: "bpk.go.id", logo: getLogoUrl("bpk.go.id") },
    { name: "Badan Pemeriksa Keuangan RI", domain: "bpk.go.id", logo: getLogoUrl("bpk.go.id") },
    { name: "BPK RI", domain: "https://www.bpk.go.id/", logo: getLogoUrl("https://www.bpk.go.id/") },
    { name: "Kementerian Keuangan Republik Indonesia", domain: "kemenkeu.go.id", logo: getLogoUrl("kemenkeu.go.id") },
    { name: "Kementerian Keuangan RI", domain: "kemenkeu.go.id", logo: getLogoUrl("kemenkeu.go.id") },
    { name: "Kemenkeu", domain: "kemenkeu.go.id", logo: getLogoUrl("kemenkeu.go.id") },
    { name: "Kementerian Dalam Negeri", domain: "kemendagri.go.id", logo: getLogoUrl("kemendagri.go.id") },
    { name: "Kemendagri", domain: "kemendagri.go.id", logo: getLogoUrl("kemendagri.go.id") },
    { name: "Kementerian Pendidikan dan Kebudayaan", domain: "kemdikbud.go.id", logo: getLogoUrl("kemdikbud.go.id") },
    { name: "Kemendikbud", domain: "kemdikbud.go.id", logo: getLogoUrl("kemdikbud.go.id") },
    { name: "Kementerian Kesehatan", domain: "kemkes.go.id", logo: getLogoUrl("kemkes.go.id") },
    { name: "Kemenkes", domain: "kemkes.go.id", logo: getLogoUrl("kemkes.go.id") },
    { name: "Kementerian Pertahanan", domain: "kemhan.go.id", logo: getLogoUrl("kemhan.go.id") },
    { name: "Kementerian Luar Negeri", domain: "kemlu.go.id", logo: getLogoUrl("kemlu.go.id") },
    { name: "Kemlu", domain: "kemlu.go.id", logo: getLogoUrl("kemlu.go.id") },
    { name: "Kementerian Hukum dan HAM", domain: "kemenkumham.go.id", logo: getLogoUrl("kemenkumham.go.id") },
    { name: "Kemenkumham", domain: "kemenkumham.go.id", logo: getLogoUrl("kemenkumham.go.id") },
    { name: "Kementerian Komunikasi dan Informatika", domain: "kominfo.go.id", logo: getLogoUrl("kominfo.go.id") },
    { name: "Kominfo", domain: "kominfo.go.id", logo: getLogoUrl("kominfo.go.id") },
    { name: "Kementerian BUMN", domain: "bumn.go.id", logo: getLogoUrl("bumn.go.id") },
    { name: "Kementerian Perdagangan", domain: "kemendag.go.id", logo: getLogoUrl("kemendag.go.id") },
    { name: "Kemendag", domain: "kemendag.go.id", logo: getLogoUrl("kemendag.go.id") },
    { name: "Kementerian Perindustrian", domain: "kemenperin.go.id", logo: getLogoUrl("kemenperin.go.id") },
    { name: "Kemenperin", domain: "kemenperin.go.id", logo: getLogoUrl("kemenperin.go.id") },
    { name: "Kementerian Pariwisata dan Ekonomi Kreatif", domain: "kemenparekraf.go.id", logo: getLogoUrl("kemenparekraf.go.id") },
    { name: "Kemenparekraf", domain: "kemenparekraf.go.id", logo: getLogoUrl("kemenparekraf.go.id") },
    { name: "Kementerian Agraria dan Tata Ruang", domain: "atrbpn.go.id", logo: getLogoUrl("atrbpn.go.id") },
    { name: "ATR/BPN", domain: "atrbpn.go.id", logo: getLogoUrl("atrbpn.go.id") },
    { name: "Kementerian PUPR", domain: "pu.go.id", logo: getLogoUrl("pu.go.id") },
    { name: "Kementerian Pekerjaan Umum", domain: "pu.go.id", logo: getLogoUrl("pu.go.id") },
    { name: "Kementerian Ketenagakerjaan", domain: "kemnaker.go.id", logo: getLogoUrl("kemnaker.go.id") },
    { name: "Kemnaker", domain: "kemnaker.go.id", logo: getLogoUrl("kemnaker.go.id") },
    { name: "Kementerian Sosial", domain: "kemensos.go.id", logo: getLogoUrl("kemensos.go.id") },
    { name: "Kemensos", domain: "kemensos.go.id", logo: getLogoUrl("kemensos.go.id") },
    { name: "Kementerian Agama", domain: "kemenag.go.id", logo: getLogoUrl("kemenag.go.id") },
    { name: "Kemenag", domain: "kemenag.go.id", logo: getLogoUrl("kemenag.go.id") },
    { name: "Kementerian Perhubungan", domain: "dephub.go.id", logo: getLogoUrl("dephub.go.id") },
    { name: "Kemenhub", domain: "dephub.go.id", logo: getLogoUrl("dephub.go.id") },
    { name: "Kementerian ESDM", domain: "esdm.go.id", logo: getLogoUrl("esdm.go.id") },
    { name: "Kementerian Pertanian", domain: "pertanian.go.id", logo: getLogoUrl("pertanian.go.id") },
    { name: "Kementan", domain: "pertanian.go.id", logo: getLogoUrl("pertanian.go.id") },
    { name: "Kementerian Lingkungan Hidup dan Kehutanan", domain: "menlhk.go.id", logo: getLogoUrl("menlhk.go.id") },
    { name: "KLHK", domain: "menlhk.go.id", logo: getLogoUrl("menlhk.go.id") },
    { name: "Kementerian Kelautan dan Perikanan", domain: "kkp.go.id", logo: getLogoUrl("kkp.go.id") },
    { name: "KKP", domain: "kkp.go.id", logo: getLogoUrl("kkp.go.id") },
    { name: "Badan Pengawasan Keuangan dan Pembangunan", domain: "bpkp.go.id", logo: getLogoUrl("bpkp.go.id") },
    { name: "BPKP", domain: "bpkp.go.id", logo: getLogoUrl("bpkp.go.id") },
    { name: "Badan Pusat Statistik", domain: "bps.go.id", logo: getLogoUrl("bps.go.id") },
    { name: "BPS", domain: "bps.go.id", logo: getLogoUrl("bps.go.id") },
    { name: "Badan Perencanaan Pembangunan Nasional", domain: "bappenas.go.id", logo: getLogoUrl("bappenas.go.id") },
    { name: "Bappenas", domain: "bappenas.go.id", logo: getLogoUrl("bappenas.go.id") },
    { name: "Otoritas Jasa Keuangan", domain: "ojk.go.id", logo: getLogoUrl("ojk.go.id") },
    { name: "OJK", domain: "ojk.go.id", logo: getLogoUrl("ojk.go.id") },
    { name: "Bank Indonesia", domain: "bi.go.id", logo: getLogoUrl("bi.go.id") },
    { name: "BI", domain: "bi.go.id", logo: getLogoUrl("bi.go.id") },
    { name: "Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah", domain: "lkpp.go.id", logo: getLogoUrl("lkpp.go.id") },
    { name: "LKPP", domain: "lkpp.go.id", logo: getLogoUrl("lkpp.go.id") },
    { name: "Badan Kepegawaian Negara", domain: "bkn.go.id", logo: getLogoUrl("bkn.go.id") },
    { name: "BKN", domain: "bkn.go.id", logo: getLogoUrl("bkn.go.id") },
    { name: "Lembaga Administrasi Negara", domain: "lan.go.id", logo: getLogoUrl("lan.go.id") },
    { name: "LAN", domain: "lan.go.id", logo: getLogoUrl("lan.go.id") },
    { name: "Arsip Nasional Republik Indonesia", domain: "anri.go.id", logo: getLogoUrl("anri.go.id") },
    { name: "ANRI", domain: "anri.go.id", logo: getLogoUrl("anri.go.id") },
    { name: "Komisi Pemberantasan Korupsi", domain: "kpk.go.id", logo: getLogoUrl("kpk.go.id") },
    { name: "KPK", domain: "kpk.go.id", logo: getLogoUrl("kpk.go.id") },
    { name: "Mahkamah Agung", domain: "mahkamahagung.go.id", logo: getLogoUrl("mahkamahagung.go.id") },
    { name: "MA", domain: "mahkamahagung.go.id", logo: getLogoUrl("mahkamahagung.go.id") },
    { name: "Mahkamah Konstitusi", domain: "mkri.id", logo: getLogoUrl("mkri.id") },
    { name: "MK", domain: "mkri.id", logo: getLogoUrl("mkri.id") },
    { name: "Kejaksaan Agung", domain: "kejaksaan.go.id", logo: getLogoUrl("kejaksaan.go.id") },
    { name: "Kepolisian Republik Indonesia", domain: "polri.go.id", logo: getLogoUrl("polri.go.id") },
    { name: "Polri", domain: "polri.go.id", logo: getLogoUrl("polri.go.id") },
    { name: "TNI", domain: "tni.mil.id", logo: getLogoUrl("tni.mil.id") },
    { name: "Tentara Nasional Indonesia", domain: "tni.mil.id", logo: getLogoUrl("tni.mil.id") },
    { name: "Sekretariat Negara", domain: "setneg.go.id", logo: getLogoUrl("setneg.go.id") },
    { name: "Setneg", domain: "setneg.go.id", logo: getLogoUrl("setneg.go.id") },
    { name: "Sekretariat Kabinet", domain: "setkab.go.id", logo: getLogoUrl("setkab.go.id") },
    { name: "Setkab", domain: "setkab.go.id", logo: getLogoUrl("setkab.go.id") },
    { name: "Dewan Perwakilan Rakyat", domain: "dpr.go.id", logo: getLogoUrl("dpr.go.id") },
    { name: "DPR RI", domain: "dpr.go.id", logo: getLogoUrl("dpr.go.id") },
    { name: "Dewan Perwakilan Daerah", domain: "dpd.go.id", logo: getLogoUrl("dpd.go.id") },
    { name: "DPD RI", domain: "dpd.go.id", logo: getLogoUrl("dpd.go.id") },
    { name: "Badan Nasional Penanggulangan Bencana", domain: "bnpb.go.id", logo: getLogoUrl("bnpb.go.id") },
    { name: "BNPB", domain: "bnpb.go.id", logo: getLogoUrl("bnpb.go.id") },
    { name: "Badan Narkotika Nasional", domain: "bnn.go.id", logo: getLogoUrl("bnn.go.id") },
    { name: "BNN", domain: "bnn.go.id", logo: getLogoUrl("bnn.go.id") },
    { name: "Badan Intelijen Negara", domain: "bin.go.id", logo: getLogoUrl("bin.go.id") },
    { name: "BIN", domain: "bin.go.id", logo: getLogoUrl("bin.go.id") },

    // BUMN (State-Owned Enterprises)
    { name: "PT Pertamina (Persero)", domain: "pertamina.com", logo: getLogoUrl("pertamina.com") },
    { name: "Pertamina", domain: "pertamina.com", logo: getLogoUrl("pertamina.com") },
    { name: "PT PLN (Persero)", domain: "pln.co.id", logo: getLogoUrl("pln.co.id") },
    { name: "PLN", domain: "pln.co.id", logo: getLogoUrl("pln.co.id") },
    { name: "PT Telkom Indonesia (Persero)", domain: "telkom.co.id", logo: getLogoUrl("telkom.co.id") },
    { name: "Telkom Indonesia", domain: "telkom.co.id", logo: getLogoUrl("telkom.co.id") },
    { name: "PT Bank Rakyat Indonesia (Persero)", domain: "bri.co.id", logo: getLogoUrl("bri.co.id") },
    { name: "BRI", domain: "bri.co.id", logo: getLogoUrl("bri.co.id") },
    { name: "PT Bank Mandiri (Persero)", domain: "bankmandiri.co.id", logo: getLogoUrl("bankmandiri.co.id") },
    { name: "Bank Mandiri", domain: "bankmandiri.co.id", logo: getLogoUrl("bankmandiri.co.id") },
    { name: "PT Bank Negara Indonesia (Persero)", domain: "bni.co.id", logo: getLogoUrl("bni.co.id") },
    { name: "BNI", domain: "bni.co.id", logo: getLogoUrl("bni.co.id") },
    { name: "PT Bank Tabungan Negara (Persero)", domain: "btn.co.id", logo: getLogoUrl("btn.co.id") },
    { name: "BTN", domain: "btn.co.id", logo: getLogoUrl("btn.co.id") },
    { name: "PT Garuda Indonesia (Persero)", domain: "garuda-indonesia.com", logo: getLogoUrl("garuda-indonesia.com") },
    { name: "Garuda Indonesia", domain: "garuda-indonesia.com", logo: getLogoUrl("garuda-indonesia.com") },
    { name: "PT Kereta Api Indonesia (Persero)", domain: "kai.id", logo: getLogoUrl("kai.id") },
    { name: "KAI", domain: "kai.id", logo: getLogoUrl("kai.id") },
    { name: "PT Pos Indonesia (Persero)", domain: "posindonesia.co.id", logo: getLogoUrl("posindonesia.co.id") },
    { name: "Pos Indonesia", domain: "posindonesia.co.id", logo: getLogoUrl("posindonesia.co.id") },
    { name: "PT Pelabuhan Indonesia", domain: "pelindo.co.id", logo: getLogoUrl("pelindo.co.id") },
    { name: "Pelindo", domain: "pelindo.co.id", logo: getLogoUrl("pelindo.co.id") },
    { name: "PT Angkasa Pura I", domain: "ap1.co.id", logo: getLogoUrl("ap1.co.id") },
    { name: "PT Angkasa Pura II", domain: "angkasapura2.co.id", logo: getLogoUrl("angkasapura2.co.id") },
    { name: "PT Jasa Marga (Persero)", domain: "jasamarga.co.id", logo: getLogoUrl("jasamarga.co.id") },
    { name: "Jasa Marga", domain: "jasamarga.co.id", logo: getLogoUrl("jasamarga.co.id") },
    { name: "PT Asuransi Jiwasraya", domain: "jiwasraya.co.id", logo: getLogoUrl("jiwasraya.co.id") },
    { name: "PT Taspen (Persero)", domain: "taspen.co.id", logo: getLogoUrl("taspen.co.id") },
    { name: "Taspen", domain: "taspen.co.id", logo: getLogoUrl("taspen.co.id") },
    { name: "PT Asabri (Persero)", domain: "asabri.co.id", logo: getLogoUrl("asabri.co.id") },
    { name: "PT BPJS Kesehatan", domain: "bpjs-kesehatan.go.id", logo: getLogoUrl("bpjs-kesehatan.go.id") },
    { name: "BPJS Kesehatan", domain: "bpjs-kesehatan.go.id", logo: getLogoUrl("bpjs-kesehatan.go.id") },
    { name: "PT BPJS Ketenagakerjaan", domain: "bpjsketenagakerjaan.go.id", logo: getLogoUrl("bpjsketenagakerjaan.go.id") },
    { name: "BPJS Ketenagakerjaan", domain: "bpjsketenagakerjaan.go.id", logo: getLogoUrl("bpjsketenagakerjaan.go.id") },
    { name: "PT Pegadaian (Persero)", domain: "pegadaian.co.id", logo: getLogoUrl("pegadaian.co.id") },
    { name: "Pegadaian", domain: "pegadaian.co.id", logo: getLogoUrl("pegadaian.co.id") },
    { name: "PT Wijaya Karya (Persero)", domain: "wika.co.id", logo: getLogoUrl("wika.co.id") },
    { name: "WIKA", domain: "wika.co.id", logo: getLogoUrl("wika.co.id") },
    { name: "PT Pembangunan Perumahan (Persero)", domain: "pp.co.id", logo: getLogoUrl("pp.co.id") },
    { name: "PP", domain: "pp.co.id", logo: getLogoUrl("pp.co.id") },
    { name: "PT Adhi Karya (Persero)", domain: "adhi.co.id", logo: getLogoUrl("adhi.co.id") },
    { name: "Adhi Karya", domain: "adhi.co.id", logo: getLogoUrl("adhi.co.id") },
    { name: "PT Hutama Karya (Persero)", domain: "hutamakarya.com", logo: getLogoUrl("hutamakarya.com") },
    { name: "Hutama Karya", domain: "hutamakarya.com", logo: getLogoUrl("hutamakarya.com") },
    { name: "PT Semen Indonesia (Persero)", domain: "semenindonesia.com", logo: getLogoUrl("semenindonesia.com") },
    { name: "Semen Indonesia", domain: "semenindonesia.com", logo: getLogoUrl("semenindonesia.com") },
    { name: "PT Pupuk Indonesia (Persero)", domain: "pupuk-indonesia.com", logo: getLogoUrl("pupuk-indonesia.com") },
    { name: "Pupuk Indonesia", domain: "pupuk-indonesia.com", logo: getLogoUrl("pupuk-indonesia.com") },
    { name: "PT Bulog", domain: "bulog.co.id", logo: getLogoUrl("bulog.co.id") },
    { name: "Bulog", domain: "bulog.co.id", logo: getLogoUrl("bulog.co.id") },

    // Indonesian Universities
    { name: "Universitas Indonesia", domain: "ui.ac.id", logo: getLogoUrl("ui.ac.id") },
    { name: "UI", domain: "ui.ac.id", logo: getLogoUrl("ui.ac.id") },
    { name: "Institut Teknologi Bandung", domain: "itb.ac.id", logo: getLogoUrl("itb.ac.id") },
    { name: "ITB", domain: "itb.ac.id", logo: getLogoUrl("itb.ac.id") },
    { name: "Universitas Gadjah Mada", domain: "ugm.ac.id", logo: getLogoUrl("ugm.ac.id") },
    { name: "UGM", domain: "ugm.ac.id", logo: getLogoUrl("ugm.ac.id") },
    { name: "Institut Pertanian Bogor", domain: "ipb.ac.id", logo: getLogoUrl("ipb.ac.id") },
    { name: "IPB", domain: "ipb.ac.id", logo: getLogoUrl("ipb.ac.id") },
    { name: "Universitas Airlangga", domain: "unair.ac.id", logo: getLogoUrl("unair.ac.id") },
    { name: "Unair", domain: "unair.ac.id", logo: getLogoUrl("unair.ac.id") },
    { name: "Universitas Diponegoro", domain: "undip.ac.id", logo: getLogoUrl("undip.ac.id") },
    { name: "Undip", domain: "undip.ac.id", logo: getLogoUrl("undip.ac.id") },
    { name: "Universitas Brawijaya", domain: "ub.ac.id", logo: getLogoUrl("ub.ac.id") },
    { name: "UB", domain: "ub.ac.id", logo: getLogoUrl("ub.ac.id") },
    { name: "Universitas Padjadjaran", domain: "unpad.ac.id", logo: getLogoUrl("unpad.ac.id") },
    { name: "Unpad", domain: "unpad.ac.id", logo: getLogoUrl("unpad.ac.id") },
    { name: "Institut Teknologi Sepuluh Nopember", domain: "its.ac.id", logo: getLogoUrl("its.ac.id") },
    { name: "ITS", domain: "its.ac.id", logo: getLogoUrl("its.ac.id") },
    { name: "Universitas Hasanuddin", domain: "unhas.ac.id", logo: getLogoUrl("unhas.ac.id") },
    { name: "Unhas", domain: "unhas.ac.id", logo: getLogoUrl("unhas.ac.id") },
    { name: "Universitas Sebelas Maret", domain: "uns.ac.id", logo: getLogoUrl("uns.ac.id") },
    { name: "UNS", domain: "uns.ac.id", logo: getLogoUrl("uns.ac.id") },
    { name: "Universitas Sumatera Utara", domain: "usu.ac.id", logo: getLogoUrl("usu.ac.id") },
    { name: "USU", domain: "usu.ac.id", logo: getLogoUrl("usu.ac.id") },
    { name: "Universitas Pendidikan Indonesia", domain: "upi.edu", logo: getLogoUrl("upi.edu") },
    { name: "UPI", domain: "upi.edu", logo: getLogoUrl("upi.edu") },
    { name: "Universitas Negeri Jakarta", domain: "unj.ac.id", logo: getLogoUrl("unj.ac.id") },
    { name: "UNJ", domain: "unj.ac.id", logo: getLogoUrl("unj.ac.id") },
    { name: "Universitas Negeri Yogyakarta", domain: "uny.ac.id", logo: getLogoUrl("uny.ac.id") },
    { name: "UNY", domain: "uny.ac.id", logo: getLogoUrl("uny.ac.id") },
    { name: "Universitas Negeri Semarang", domain: "unnes.ac.id", logo: getLogoUrl("unnes.ac.id") },
    { name: "Unnes", domain: "unnes.ac.id", logo: getLogoUrl("unnes.ac.id") },
    { name: "Universitas Negeri Malang", domain: "um.ac.id", logo: getLogoUrl("um.ac.id") },
    { name: "UM", domain: "um.ac.id", logo: getLogoUrl("um.ac.id") },
    { name: "Universitas Islam Indonesia", domain: "uii.ac.id", logo: getLogoUrl("uii.ac.id") },
    { name: "UII", domain: "uii.ac.id", logo: getLogoUrl("uii.ac.id") },
    { name: "Universitas Muhammadiyah Yogyakarta", domain: "umy.ac.id", logo: getLogoUrl("umy.ac.id") },
    { name: "UMY", domain: "umy.ac.id", logo: getLogoUrl("umy.ac.id") },
    { name: "Bina Nusantara University", domain: "binus.ac.id", logo: getLogoUrl("binus.ac.id") },
    { name: "Binus", domain: "binus.ac.id", logo: getLogoUrl("binus.ac.id") },
    { name: "Universitas Bina Nusantara", domain: "binus.ac.id", logo: getLogoUrl("binus.ac.id") },
    { name: "Universitas Pelita Harapan", domain: "uph.edu", logo: getLogoUrl("uph.edu") },
    { name: "UPH", domain: "uph.edu", logo: getLogoUrl("uph.edu") },
    { name: "Universitas Trisakti", domain: "trisakti.ac.id", logo: getLogoUrl("trisakti.ac.id") },
    { name: "Trisakti", domain: "trisakti.ac.id", logo: getLogoUrl("trisakti.ac.id") },
    { name: "Universitas Atma Jaya", domain: "atmajaya.ac.id", logo: getLogoUrl("atmajaya.ac.id") },
    { name: "Atma Jaya", domain: "atmajaya.ac.id", logo: getLogoUrl("atmajaya.ac.id") },
    { name: "Universitas Katolik Indonesia Atma Jaya", domain: "atmajaya.ac.id", logo: getLogoUrl("atmajaya.ac.id") },
    { name: "Universitas Tarumanagara", domain: "untar.ac.id", logo: getLogoUrl("untar.ac.id") },
    { name: "Untar", domain: "untar.ac.id", logo: getLogoUrl("untar.ac.id") },
    { name: "Universitas Prasetiya Mulya", domain: "prasetiyamulya.ac.id", logo: getLogoUrl("prasetiyamulya.ac.id") },
    { name: "Prasetiya Mulya", domain: "prasetiyamulya.ac.id", logo: getLogoUrl("prasetiyamulya.ac.id") },

    // Private Indonesian Companies (Startups & Tech)
    { name: "GoTo Group", domain: "gotocompany.com", logo: getLogoUrl("gotocompany.com") },
    { name: "Gojek Indonesia", domain: "gojek.com", logo: getLogoUrl("gojek.com") },
    { name: "Tokopedia", domain: "tokopedia.com", logo: getLogoUrl("tokopedia.com") },
    { name: "Shopee Indonesia", domain: "shopee.co.id", logo: getLogoUrl("shopee.co.id") },
    { name: "Bukalapak", domain: "bukalapak.com", logo: getLogoUrl("bukalapak.com") },
    { name: "Traveloka", domain: "traveloka.com", logo: getLogoUrl("traveloka.com") },
    { name: "Ruangguru", domain: "ruangguru.com", logo: getLogoUrl("ruangguru.com") },
    { name: "Zenius", domain: "zenius.net", logo: getLogoUrl("zenius.net") },
    { name: "Tiket.com", domain: "tiket.com", logo: getLogoUrl("tiket.com") },
    { name: "Blibli", domain: "blibli.com", logo: getLogoUrl("blibli.com") },
    { name: "OVO", domain: "ovo.id", logo: getLogoUrl("ovo.id") },
    { name: "Dana Indonesia", domain: "dana.id", logo: getLogoUrl("dana.id") },
    { name: "LinkAja", domain: "linkaja.id", logo: getLogoUrl("linkaja.id") },
    { name: "Kredivo", domain: "kredivo.com", logo: getLogoUrl("kredivo.com") },
    { name: "Akulaku", domain: "akulaku.com", logo: getLogoUrl("akulaku.com") },
    { name: "JD.ID", domain: "jd.id", logo: getLogoUrl("jd.id") },
    { name: "Sociolla", domain: "sociolla.com", logo: getLogoUrl("sociolla.com") },
    { name: "Halodoc", domain: "halodoc.com", logo: getLogoUrl("halodoc.com") },
    { name: "Alodokter", domain: "alodokter.com", logo: getLogoUrl("alodokter.com") },
    { name: "Kitabisa", domain: "kitabisa.com", logo: getLogoUrl("kitabisa.com") },
    { name: "Kopi Kenangan", domain: "kopikenangan.com", logo: getLogoUrl("kopikenangan.com") },
    { name: "Fore Coffee", domain: "fore.coffee", logo: getLogoUrl("fore.coffee") },
    { name: "Bibit", domain: "bibit.id", logo: getLogoUrl("bibit.id") },
    { name: "Stockbit", domain: "stockbit.com", logo: getLogoUrl("stockbit.com") },
    { name: "Bareksa", domain: "bareksa.com", logo: getLogoUrl("bareksa.com") },
    { name: "Modalku", domain: "modalku.co.id", logo: getLogoUrl("modalku.co.id") },
    { name: "Mekari", domain: "mekari.com", logo: getLogoUrl("mekari.com") },
    { name: "Jurnal", domain: "jurnal.id", logo: getLogoUrl("jurnal.id") },
    { name: "Talenta", domain: "talenta.co", logo: getLogoUrl("talenta.co") },
    { name: "Kumparan", domain: "kumparan.com", logo: getLogoUrl("kumparan.com") },
    { name: "IDN Media", domain: "idntimes.com", logo: getLogoUrl("idntimes.com") },
    { name: "Detik", domain: "detik.com", logo: getLogoUrl("detik.com") },
    { name: "Kompas", domain: "kompas.com", logo: getLogoUrl("kompas.com") },
    { name: "Dicoding Indonesia", domain: "dicoding.com", logo: getLogoUrl("dicoding.com") },
    { name: "Dicoding", domain: "dicoding.com", logo: getLogoUrl("dicoding.com") },
    { name: "Glints Indonesia", domain: "glints.com", logo: getLogoUrl("glints.com") },
    { name: "Glints", domain: "glints.com", logo: getLogoUrl("glints.com") },
    { name: "Kalibrr", domain: "kalibrr.com", logo: getLogoUrl("kalibrr.com") },
    { name: "Asah Ied by Dicoding", domain: "https://www.dicoding.com/asah", logo: getLogoUrl("https://www.dicoding.com/asah") },
    { name: "SMA N 20 Batam", domain: "https://sman20batam.sch.id/", logo: getLogoUrl("https://sman20batam.sch.id/") },
];

// Search in local database
function searchLocalCompanies(query: string): CompanyResult[] {
    const lowerQuery = query.toLowerCase();
    return LOCAL_COMPANIES.filter(company =>
        company.name.toLowerCase().includes(lowerQuery) ||
        company.domain.toLowerCase().includes(lowerQuery)
    );
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
        return NextResponse.json({ companies: [] });
    }

    // First, search in local database (for Indonesian govt agencies, BUMN, universities)
    const localResults = searchLocalCompanies(query);

    // Then, search Clearbit for global companies
    let clearbitResults: CompanyResult[] = [];

    try {
        const clearbitResponse = await fetch(
            `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(query)}`,
            {
                headers: { 'Accept': 'application/json' },
                next: { revalidate: 3600 }
            }
        );

        if (clearbitResponse.ok) {
            const clearbitData: ClearbitCompany[] = await clearbitResponse.json();
            clearbitResults = clearbitData.map(company => ({
                name: company.name,
                domain: company.domain,
                logo: company.logo || getLogoUrl(company.domain)
            }));
        }
    } catch (error) {
        console.error("Error fetching from Clearbit:", error);
    }

    // Merge results: local first (prioritize Indonesian companies), then Clearbit
    // Remove duplicates based on domain
    const seenDomains = new Set<string>();
    const mergedResults: CompanyResult[] = [];

    // Add local results first
    for (const company of localResults) {
        if (!seenDomains.has(company.domain)) {
            seenDomains.add(company.domain);
            mergedResults.push(company);
        }
    }

    // Add Clearbit results (skip duplicates)
    for (const company of clearbitResults) {
        if (!seenDomains.has(company.domain)) {
            seenDomains.add(company.domain);
            mergedResults.push(company);
        }
    }

    // Return top 10 results
    return NextResponse.json({ companies: mergedResults.slice(0, 10) });
}
