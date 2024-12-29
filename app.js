// script.js

// Helper untuk penyimpanan LocalStorage
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Fungsi untuk menampilkan/menyembunyikan bagian
function showSection(sectionId) {
  document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
}

// ** Manajemen Kategori **
const kategoriForm = document.getElementById('kategoriForm');
const kategoriList = document.getElementById('kategoriList');

// Load kategori awal
function loadKategori() {
  const kategoris = getFromStorage('kategoris');
  kategoriList.innerHTML = '';
  kategoris.forEach((kategori, index) => {
    const li = document.createElement('li');
    li.textContent = kategori;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Hapus';
    deleteBtn.onclick = () => deleteKategori(index);
    li.appendChild(deleteBtn);
    kategoriList.appendChild(li);
  });

  // Update dropdown kategori
  const kategoriDropdown = document.getElementById('kategoriProduk');
  kategoriDropdown.innerHTML = '';
  kategoris.forEach(kategori => {
    const option = document.createElement('option');
    option.value = kategori;
    option.textContent = kategori;
    kategoriDropdown.appendChild(option);
  });
}

function addKategori(event) {
  event.preventDefault();
  const namaKategori = document.getElementById('namaKategori').value;
  const kategoris = getFromStorage('kategoris');
  kategoris.push(namaKategori);
  saveToStorage('kategoris', kategoris);
  loadKategori();
  kategoriForm.reset();
}

function deleteKategori(index) {
  const kategoris = getFromStorage('kategoris');
  kategoris.splice(index, 1);
  saveToStorage('kategoris', kategoris);
  loadKategori();
}

kategoriForm.addEventListener('submit', addKategori);
document.addEventListener('DOMContentLoaded', loadKategori);

// ** Manajemen Produk **
const produkForm = document.getElementById('produkForm');
const produkTable = document.getElementById('produkTable');

function loadProduk() {
  const produks = getFromStorage('produks');
  produkTable.innerHTML = '<tr><th>Nama</th><th>Harga</th><th>Kategori</th><th>Aksi</th></tr>';
  produks.forEach((produk, index) => {
    const row = produkTable.insertRow();
    row.innerHTML = `
      <td>${produk.nama}</td>
      <td>${produk.harga}</td>
      <td>${produk.kategori}</td>
      <td>
        <button onclick="deleteProduk(${index})">Hapus</button>
      </td>
    `;
  });
}

function addProduk(event) {
  event.preventDefault();
  const nama = document.getElementById('namaProduk').value;
  const harga = document.getElementById('hargaProduk').value;
  const kategori = document.getElementById('kategoriProduk').value;

  const produks = getFromStorage('produks');
  produks.push({ nama, harga, kategori });
  saveToStorage('produks', produks);
  loadProduk();
  produkForm.reset();
}

function deleteProduk(index) {
  const produks = getFromStorage('produks');
  produks.splice(index, 1);
  saveToStorage('produks', produks);
  loadProduk();
}

produkForm.addEventListener('submit', addProduk);
document.addEventListener('DOMContentLoaded', loadProduk);


// ** Manajemen Transaksi **
const transaksiForm = document.getElementById('transaksiForm');
const keranjangTable = document.getElementById('keranjangTable');
const produkTransaksi = document.getElementById('produkTransaksi');
let keranjang = [];

function loadProdukTransaksi() {
  const produks = getFromStorage('produks');
  produkTransaksi.innerHTML = '';
  produks.forEach((produk, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${produk.nama} - Rp${produk.harga}`;
    produkTransaksi.appendChild(option);
  });
}

function tambahKeKeranjang(event) {
  event.preventDefault();
  const produkIndex = produkTransaksi.value;
  const jumlah = parseInt(document.getElementById('jumlahTransaksi').value);
  const produk = getFromStorage('produks')[produkIndex];

  // Tambahkan ke keranjang
  keranjang.push({
    nama: produk.nama,
    harga: produk.harga,
    jumlah,
    total: produk.harga * jumlah,
  });

  tampilkanKeranjang();
}

function tampilkanKeranjang() {
  keranjangTable.innerHTML = '<tr><th>Produk</th><th>Harga</th><th>Jumlah</th><th>Total</th><th>Aksi</th></tr>';
  let totalTransaksi = 0;
  keranjang.forEach((item, index) => {
    const row = keranjangTable.insertRow();
    row.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.harga}</td>
      <td>${item.jumlah}</td>
      <td>${item.total}</td>
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

  const laporan = getFromStorage('laporan');
  const totalTransaksi = keranjang.reduce((acc, item) => acc + item.total, 0);

  laporan.push({
    tanggal: new Date().toLocaleString(),
    items: keranjang,
    total: totalTransaksi,
  });

  saveToStorage('laporan', laporan);

  // Reset keranjang
  keranjang = [];
  tampilkanKeranjang();

  alert('Transaksi berhasil diselesaikan!');
  loadLaporan();
}

transaksiForm.addEventListener('submit', tambahKeKeranjang);
document.addEventListener('DOMContentLoaded', loadProdukTransaksi);

// ** Laporan Transaksi **
function loadLaporan() {
  const laporan = getFromStorage('laporan');
  const laporanTable = document.getElementById('laporanTable');
  laporanTable.innerHTML = '<tr><th>Tanggal</th><th>Item</th><th>Total</th></tr>';
  laporan.forEach(entry => {
    const row = laporanTable.insertRow();
    row.innerHTML = `
      <td>${entry.tanggal}</td>
      <td>${entry.items.map(item => `${item.nama} (${item.jumlah})`).join(', ')}</td>
      <td>${entry.total}</td>
    `;
  });
}

document.addEventListener('DOMContentLoaded', loadLaporan);


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
    Total: Rp${lastTransaksi.total}
    ============================
  `;
  alert(struk); // Alternatif: Cetak di printer
}

