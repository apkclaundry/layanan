import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

// Tambahkan CSS SweetAlert2
addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Ambil elemen form dan tabel
const serviceForm = document.getElementById("service-form");
const serviceTableBody = document.querySelector("#service-table tbody");
const resetFormButton = document.getElementById("reset-form");

// Event listener saat form disubmit
serviceForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah refresh halaman
  
    // Ambil data dari form
    const serviceId = document.getElementById("service-id").value;
    const serviceName = document.getElementById("service-name").value;
    const servicePrice = document.getElementById("service-price").value;
    const serviceDescription = document.getElementById("service-description").value;
  
    // Validasi input
    if (!serviceId || !serviceName || !servicePrice || !serviceDescription) {
      alert("Harap isi semua data!");
      return;
    }
  
    // Buat objek data layanan
    const newService = {
      id: serviceId,
      name: serviceName,
      price: servicePrice,
      description: serviceDescription,
    };
  
    // Ambil data dari local storage
    let services = JSON.parse(localStorage.getItem("services")) || [];
  
    // Cek apakah ID sudah ada (untuk menghindari duplikasi)
    if (services.some((service) => service.id === serviceId)) {
      alert("ID layanan sudah ada. Gunakan ID lain.");
      return;
    }
  
    // Tambahkan data baru
    services.push(newService);
  
    // Urutkan data berdasarkan ID terkecil
    services.sort((a, b) => a.id - b.id);
  
    // Simpan kembali ke local storage
    localStorage.setItem("services", JSON.stringify(services));
  
    // Reset form
    serviceForm.reset();
  
    // Tampilkan data ke tabel
    addToTable(newService);
  });
  

// Fungsi untuk menambahkan data ke tabel
function addToTable(service) {
    const row = document.createElement("tr");
    row.setAttribute("data-id", service.id); // Set atribut untuk identifikasi baris
  
    row.innerHTML = `
      <td data-label="ID">${service.id}</td>
      <td data-label="Nama Layanan">${service.name}</td>
      <td data-label="Harga Layanan">${service.price}</td>
      <td data-label="Deskripsi">${service.description}</td>
      <td class="actions" data-label="Actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </td>
    `;
  
    // Event listener tombol edit
    row.querySelector(".edit").addEventListener("click", () => editService(service.id));
  
    // Event listener tombol delete
    row.querySelector(".delete").addEventListener("click", () => deleteService(service.id));
  
    serviceTableBody.appendChild(row);
  }
  
  // Fungsi untuk memuat data dari local storage saat halaman di-refresh
  // Fungsi untuk memuat data dari local storage saat halaman di-refresh
function loadServices() {
    const services = JSON.parse(localStorage.getItem("services")) || [];
  
    // Urutkan layanan berdasarkan ID terkecil
    services.sort((a, b) => a.id - b.id);
  
    // Tambahkan data ke tabel setelah diurutkan
    services.forEach((service) => addToTable(service));
  }
  
  
  // Fungsi untuk mengurutkan tabel berdasarkan kolom
  let sortOrder = {
    id: 'asc',
    name: 'asc',
    price: 'asc',
    description: 'asc'
  };
  
  function sortTable(column) {
    const services = JSON.parse(localStorage.getItem("services")) || [];
  
    // Tentukan urutan pengurutan
    const order = sortOrder[column];
    const sortedServices = services.sort((a, b) => {
      if (column === 'price') {
        // Sort untuk harga (angka)
        return order === 'asc' ? a[column] - b[column] : b[column] - a[column];
      } else {
        // Sort untuk string
        return order === 'asc' ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column]);
      }
    });
  
    // Simpan urutan pengurutan berikutnya
    sortOrder[column] = order === 'asc' ? 'desc' : 'asc';
  
    // Kosongkan tabel dan tambahkan data yang telah diurutkan
    serviceTableBody.innerHTML = "";
    sortedServices.forEach((service) => addToTable(service));
  }
  
  // Event listener untuk mengatur urutan kolom saat header diklik
  document.querySelectorAll('#service-table th').forEach(th => {
    th.addEventListener('click', () => {
      const column = th.getAttribute('data-column');
      sortTable(column);
    });
  });
  
  // Panggil fungsi loadServices saat halaman pertama kali dibuka
  window.onload = loadServices;
  

// Panggil fungsi loadServices saat halaman pertama kali dibuka
window.onload = loadServices;

// Fungsi untuk menghapus layanan
function deleteService(id) {
    // Konfirmasi penghapusan menggunakan Swal
    Swal.fire({
      title: "Yakin ingin menghapus layanan ini?",
      text: "Data tidak dapat dikembalikan setelah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // Ambil data dari local storage
        let services = JSON.parse(localStorage.getItem("services")) || [];
    
        // Filter data untuk menghapus layanan dengan ID yang dipilih
        services = services.filter((service) => service.id !== id);
    
        // Simpan kembali ke local storage
        localStorage.setItem("services", JSON.stringify(services));
    
        // Hapus baris dari tabel
        const rowToDelete = document.querySelector(`tr[data-id="${id}"]`);
        if (rowToDelete) {
          rowToDelete.remove();
        }
    
        // Berikan notifikasi berhasil dengan Swal
        Swal.fire("Dihapus!", "Layanan telah dihapus.", "success");
      }
    });
}

// Fungsi untuk mengedit layanan berdasarkan ID yang diisi
function editService(id) {
  const services = JSON.parse(localStorage.getItem("services")) || [];
  const serviceToEdit = services.find((service) => service.id === id);

  if (!serviceToEdit) {
    alert("Data layanan tidak ditemukan!");
    return;
  }

  // Isi form dengan data layanan
  document.getElementById("service-id").value = serviceToEdit.id;
  document.getElementById("service-name").value = serviceToEdit.name;
  document.getElementById("service-price").value = serviceToEdit.price;
  document.getElementById("service-description").value = serviceToEdit.description;

  // Buat ID readonly agar tidak bisa diubah
  document.getElementById("service-id").setAttribute("readonly", true);

  // Ubah fungsi submit untuk menyimpan perubahan
  serviceForm.onsubmit = function (e) {
    e.preventDefault();

    // Update data layanan
    serviceToEdit.name = document.getElementById("service-name").value;
    serviceToEdit.price = document.getElementById("service-price").value;
    serviceToEdit.description = document.getElementById("service-description").value;

    // Simpan data yang diperbarui ke local storage
    const updatedServices = services.map((service) =>
      service.id === id ? serviceToEdit : service
    );
    localStorage.setItem("services", JSON.stringify(updatedServices));

    // Reset form dan hapus readonly
    serviceForm.reset();
    document.getElementById("service-id").removeAttribute("readonly");

    // Reload tabel
    serviceTableBody.innerHTML = ""; // Kosongkan tabel
    loadServices(); // Muat ulang data

    alert("Layanan berhasil diperbarui.");

    // Kembalikan fungsi submit ke logika aslinya
    serviceForm.onsubmit = originalSubmitHandler;
  };
}

// Simpan logika asli submit form ke dalam variabel
const originalSubmitHandler = serviceForm.onsubmit;

// Tombol reset untuk mengosongkan form
resetFormButton.addEventListener("click", function() {
  serviceForm.reset();
  document.getElementById("service-id").removeAttribute("readonly");
});
