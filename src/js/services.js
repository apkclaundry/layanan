// Ambil elemen form dan tabel
const serviceForm = document.getElementById("service-form");
const serviceTableBody = document.querySelector("#service-table tbody");

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
      <td data-label="Name">${service.name}</td>
      <td data-label="Price">${service.price}</td>
      <td data-label="Description">${service.description}</td>
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
function loadServices() {
  const services = JSON.parse(localStorage.getItem("services")) || [];
  services.forEach((service) => addToTable(service));
}

// Panggil fungsi loadServices saat halaman pertama kali dibuka
window.onload = loadServices;

// Fungsi untuk menghapus layanan
function deleteService(id) {
    // Konfirmasi penghapusan menggunakan confirm()
    const isConfirmed = confirm("Yakin ingin menghapus layanan ini? Data tidak dapat dikembalikan setelah dihapus!");
  
    if (isConfirmed) {
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
  
      // Berikan notifikasi berhasil
      alert("Layanan telah dihapus.");
    }
  }
  
  

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
  