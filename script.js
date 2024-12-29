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
