// Fungsi Utilitas untuk LocalStorage
function getFromStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Navigasi Antar Halaman
function showSection(sectionId) {
  const sections = document.querySelectorAll('main section');
  sections.forEach(section => section.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
}

// ** Manajemen Kategori **
const kategoriForm = document.getElementById('kategoriForm');
const kategoriList = document.getElementById('kategoriList');

kategoriForm.addEventListener('submit', event => {
  event.preventDefault();
  const namaKategori = document.getElementById('namaKategori').value;
  const kategoris = getFromStorage('kategoris');

  kategoris.push(namaKategori);
  saveToStorage('kategoris', kategoris);

  document.getElementById('namaKategori').value = '';
  loadKategori();
});

function loadKategori() {
  const kategoris = getFromStorage('kategoris');
  kategoriList.innerHTML = '';
  kategoris.forEach(kategori => {
    const li = document.createElement('li');
    li.textContent = kategori;
    kategoriList.appendChild(li);
  });

  // Update dropdown kategori pada produk
  loadKategoriToProduk();
}

document.addEventListener('DOMContentLoaded', loadKategori);

// ** Manajemen Produk **
const produkForm = document.getElementById('produkForm');
const produkTable = document.getElementById('produkTable');

produkForm.addEventListener('submit', event => {
  event.preventDefault();
  const namaProduk = document.getElementById('namaProduk').value;
  const hargaProduk = parseInt(document.getElementById('hargaProduk').value);
  const kategoriProduk = document.getElementById('kategoriProduk').value;

  const produks = getFromStorage('produks');

  produks.push({
    nama: namaProduk,
    harga: hargaProduk,
    kategori: kategoriProduk,
  });

  saveToStorage('produks', produks);

  document.getElementById('namaProduk').value = '';
  document.getElementById('hargaProduk').value = '';
  loadProduk();
  refreshProdukDropdown();
});

function loadProduk() {
  const produks = getFromStorage('produks');
  produkTable.innerHTML = `
    <tr>
      <th>Nama</th>
      <th>Harga</th>
      <th>Kategori</th>
      <th>Aksi</th>
    </tr>
  `;
  produks.forEach((produk, index) => {
    const row = produkTable.insertRow();
    row.innerHTML = `
      <td>${produk.nama}</td>
      <td>Rp${produk.harga}</td>
      <td>${produk.kategori}</td>
      <td><button onclick="hapusProduk(${index})">Hapus</button></td>
    `;
  });
}

function hapusProduk(index) {
  const produks = getFromStorage('produks');
  produks.splice(index, 1);
  saveToStorage('produks', produks);
  loadProduk();
}

document.addEventListener('DOMContentLoaded', loadProduk);

// Sinkronisasi Dropdown Kategori dan Produk
function loadKategoriToProduk() {
  const kategoris = getFromStorage('kategoris');
  const kategoriDropdown = document.getElementById('kategoriProduk');
  kategoriDropdown.innerHTML = '';
  kategoris.forEach(kategori => {
    const option = document.createElement('option');
    option.value = kategori;
    option.textContent = kategori;
    kategoriDropdown.appendChild(option);
  });
}

function refreshProdukDropdown() {
  const produks = getFromStorage('produks');
  const produkTransaksi = document.getElementById('produkTransaksi');
  produkTransaksi.innerHTML = '';
  produks.forEach((produk, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${produk.nama} - Rp${produk.harga}`;
    produkTransaksi.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', refreshProdukDropdown);

// ** Manajemen Pelanggan **
const pelangganForm = document.getElementById('pelangganForm');
const pelangganList = document.getElementById('pelangganList');

pelangganForm.addEventListener('submit', event => {
  event.preventDefault();
  const namaPelanggan = document.getElementById('namaPelanggan').value;
  const kontakPelanggan = document.getElementById('kontakPelanggan').value;

  const pelanggan = getFromStorage('pelanggan');

  pelanggan.push({
    nama: namaPelanggan,
    kontak: kontakPelanggan,
  });

  saveToStorage('pelanggan', pelanggan);

  document.getElementById('namaPelanggan').value = '';
  document.getElementById('kontakPelanggan').value = '';
  loadPelanggan();
});

function loadPelanggan() {
  const pelanggan = getFromStorage('pelanggan');
  pelangganList.innerHTML = '';
  pelanggan.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.nama} (${p.kontak})`;
    pelangganList.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', loadPelanggan);

// ** Manajemen Suplayer **
const suplayerForm = document.getElementById('suplayerForm');
const suplayerList = document.getElementById('suplayerList');

suplayerForm.addEventListener('submit', event => {
  event.preventDefault();
  const namaSuplayer = document.getElementById('namaSuplayer').value;
  const kontakSuplayer = document.getElementById('kontakSuplayer').value;

  const suplayer = getFromStorage('suplayer');

  suplayer.push({
    nama: namaSuplayer,
    kontak: kontakSuplayer,
  });

  saveToStorage('suplayer', suplayer);

  document.getElementById('namaSuplayer').value = '';
  document.getElementById('kontakSuplayer').value = '';
  loadSuplayer();
});

function loadSuplayer() {
  const suplayer = getFromStorage('suplayer');
  suplayerList.innerHTML = '';
  suplayer.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.nama} (${s.kontak})`;
    suplayerList.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', loadSuplayer);

// ** Transaksi **
const transaksiForm = document.getElementById('transaksiForm');
const keranjangTable = document.getElementById('keranjangTable');
let keranjang = [];

transaksiForm.addEventListener('submit', event => {
  event.preventDefault();
  const produkIndex = document.getElementById('produkTransaksi').value;
  const jumlah = parseInt(document.getElementById('jumlahTransaksi').value);
  const produk = getFromStorage('produks')[produkIndex];

  keranjang.push({
    nama: produk.nama,
    harga: produk.harga,
    jumlah,
    total: produk.harga * jumlah,
  });

  tampilkanKeranjang();
});

function tampilkanKeranjang() {
  keranjangTable.innerHTML = `
    <tr>
      <th>Produk</th>
      <th>Harga</th>
      <th>Jumlah</th>
      <th>Total</th>
      <th>Aksi</th>
    </tr>
  `;
  let totalTransaksi = 0;
  keranjang.forEach((item, index) => {
    const row = keranjangTable.insertRow();
    row.innerHTML = `
      <td>${item.nama}</td>
      <td>Rp${item.harga}</td>
      <td>${item.jumlah}</td>
      <td>Rp${item.total}</td>
      <td><button onclick="hapusDariKeranjang(${index})">Hapus</button></td>
    `;
    totalTransaksi += item.total;
  });
  document.getElementById('totalTransaksi').textContent = totalTransaksi;
}

function hapusDariKeranjang(index) {
  keranjang.splice(index, 1);
  tampilkanKeranjang();
}

function selesaikanTransaksi() {
  if (keranjang.length === 0) {
    alert('Keranjang kosong!');
    return;
  }

  const metodePembayaran = document.getElementById('metodePembayaran').value;
  const laporan = getFromStorage('laporan');
  const totalTransaksi = keranjang.reduce((acc, item) => acc + item.total, 0);

  laporan.push({
    tanggal: new Date().toLocaleString(),
    items: keranjang,
    total: totalTransaksi,
    metode: metodePembayaran,
  });

  saveToStorage('laporan', laporan);

  keranjang = [];
  tampilkanKeranjang();

  alert(`Transaksi berhasil menggunakan metode: ${metodePembayaran}!`);
  loadLaporan();
}

function cetakStruk() {
  const laporan = getFromStorage('laporan');
  const lastTransaksi = laporan[laporan.length - 1];

  if (!lastTransaksi) {
    alert('Tidak ada transaksi untuk dicetak!');
    return;
  }

  const struk = `
    ===== STRUK PEMBELIAN =====
    Tanggal: ${lastTransaksi.tanggal}
    ---------------------------
    ${lastTransaksi.items.map(item => `${item.nama} x${item.jumlah} - Rp${item.total}`).join('\n')}
    ---------------------------
    Metode Pembayaran: ${lastTransaksi.metode}
    Total: Rp${lastTransaksi.total}
    ============================
  `;
  alert(struk);
}

// ** Laporan **
function loadLaporan() {
  const laporan = getFromStorage('laporan');
  const laporanTable = document.getElementById('laporanTable');
  laporanTable.innerHTML = `
    <tr>
      <th>Tanggal</th>
      <th>Item</th>
      <th>Total</th>
      <th>Metode Pembayaran</th>
    </tr>
  `;
  laporan.forEach(entry => {
    const row = laporanTable.insertRow();
    row.innerHTML = `
      <td>${entry.tanggal}</td>
      <td>${entry.items.map(item => `${item.nama} (${item.jumlah})`).join(', ')}</td>
      <td>Rp${entry.total}</td>
      <td>${entry.metode}</td>
    `;
  });
}

document.addEventListener('DOMContentLoaded', loadLaporan);

// ** Reset Data **
function resetData() {
  localStorage.clear();
  alert('Semua data telah dihapus!');
  location.reload();
}
