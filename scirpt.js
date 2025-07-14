
// Daftar harga layanan
const hargaLayanan = {
  "Feed Instagram": 250000,
  "Highlight & Reels": 200000,
  "Visual Storytelling": 300000,
  "Kalender Konten": 275000,
  "Brosur & Leaflet": 150000,
  "Poster & Banner": 180000,
  "Katalog Produk": 220000,
  "Desain Kemasan": 250000
};

// Update input harga berdasarkan layanan
function updateHarga() {
  const layanan = document.getElementById('layanan').value;
  const hargaInput = document.getElementById('harga');
  hargaInput.value = layanan && hargaLayanan[layanan] ? hargaLayanan[layanan] : '';
}

// Tampilkan notifikasi
function showNotif(type, message) {
  const notif = document.getElementById('notif');
  notif.className = 'notification ' + (type === 'success' ? 'success' : 'error');
  notif.innerText = message;
  notif.style.display = 'block';
}

// Validasi form input
function validateForm() {
  let valid = true;
  ['nama', 'email', 'layanan', 'harga'].forEach(id => {
    document.getElementById(id).classList.remove('input-error');
    document.getElementById('err-' + id).classList.remove('active');
  });

  const nama = document.getElementById('nama').value.trim();
  const email = document.getElementById('email').value.trim();
  const layanan = document.getElementById('layanan').value;
  const harga = document.getElementById('harga').value;

  if (!nama) {
    document.getElementById('nama').classList.add('input-error');
    document.getElementById('err-nama').classList.add('active');
    valid = false;
  }
  if (!email) {
    document.getElementById('email').classList.add('input-error');
    document.getElementById('err-email').classList.add('active');
    valid = false;
  }
  if (!layanan) {
    document.getElementById('layanan').classList.add('input-error');
    document.getElementById('err-layanan').classList.add('active');
    valid = false;
  }
  if (!harga) {
    document.getElementById('harga').classList.add('input-error');
    document.getElementById('err-harga').classList.add('active');
    valid = false;
  }

  if (!valid) showNotif('error', 'Mohon isi semua kolom yang wajib diisi.');
  return valid;
}

// Pilih metode pembayaran
document.querySelectorAll('.metode-option').forEach(function(opt) {
  opt.addEventListener('click', function () {
    document.querySelectorAll('.metode-option').forEach(o => o.classList.remove('selected'));
    this.classList.add('selected');
    this.querySelector('input[type=radio]').checked = true;
    document.getElementById('metode-form').dispatchEvent(new Event('change'));
  });
  opt.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.click();
    }
  });
});

// Notifikasi saat metode dipilih
document.getElementById('metode-form').addEventListener('change', function () {
  const metode = document.querySelector('input[name="metode"]:checked')?.value;
  if (metode) {
    const msgMap = {
      qris: 'QRIS DANA dipilih.',
      bri: 'Bank BRI dipilih.',
      bca: 'Bank BCA dipilih.',
      bsi: 'Bank BSI dipilih.'
    };
    showNotif('success', 'Metode pembayaran: ' + msgMap[metode] + ' Silakan klik Bayar.');
  }
});

// Fungsi untuk memproses pembayaran
function payNow() {
  if (!validateForm()) return;

  const metode = document.querySelector('input[name="metode"]:checked')?.value;
  if (!metode) {
    showNotif('error', 'Pilih metode pembayaran terlebih dahulu.');
    return;
  }

  const data = {
    nama: document.getElementById('nama').value.trim(),
    email: document.getElementById('email').value.trim(),
    layanan: document.getElementById('layanan').value,
    harga: document.getElementById('harga').value
  };

  if (metode === 'qris') {
    fetch('http://localhost:8080/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
      if (result.snapToken) {
        snap.pay(result.snapToken, {
          onSuccess: () => showNotif('success', 'Pembayaran berhasil!'),
          onPending: () => showNotif('success', 'Pembayaran sedang diproses.'),
          onError: () => showNotif('error', 'Pembayaran gagal.'),
          onClose: () => showNotif('error', 'Anda menutup pembayaran sebelum selesai.')
        });
      } else {
        showNotif('error', 'Terjadi kesalahan saat memproses transaksi.');
      }
    })
    .catch(() => showNotif('error', 'Koneksi ke server gagal.'));
  } else {
    const redirectMap = {
      bri: 'https://ib.bri.co.id/ib-bri/',
      bca: 'https://klikbca.com/',
      bsi: 'https://bsinet.bankbsi.co.id/'
    };
    if (redirectMap[metode]) {
      showNotif('success', 'Anda akan diarahkan ke aplikasi/web pembayaran.');
      setTimeout(() => window.open(redirectMap[metode], '_blank'), 1000);
    } else {
      showNotif('error', 'Metode pembayaran tidak valid.');
    }
  }
}



// Untuk login
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Validasi dummy
      if (username === "admin" && password === "1234") {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("username", username);
        window.location.href = "index.html";
      } else {
        alert("Login gagal");
      }
    });
  }

  // Untuk daftar akun (dummy saja)
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newUsername = document.getElementById('newUsername').value;
      const newPassword = document.getElementById('newPassword').value;

      // Simpan ke localStorage (simulasi database)
      localStorage.setItem("registeredUsername", newUsername);
      localStorage.setItem("registeredPassword", newPassword);
      alert("Pendaftaran berhasil. Silakan login.");
      window.location.href = "login.html";
    });
  }

  // Untuk mengubah tombol header jadi "Logout"
  const loginBtn = document.getElementById('loginBtn');
  const headerUsername = document.getElementById('headerUsername');
  if (localStorage.getItem("userLoggedIn") === "true") {
    if (loginBtn) {
      loginBtn.textContent = "Logout";
      loginBtn.href = "#";
      loginBtn.addEventListener('click', () => {
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("username");
        window.location.reload();
      });
    }
    if (headerUsername) {
      headerUsername.textContent = "Hi, " + localStorage.getItem("username");
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const headerUsername = document.getElementById("headerUsername");

  if (localStorage.getItem("userLoggedIn") === "true") {
    const username = localStorage.getItem("username");

    if (loginBtn) {
      loginBtn.textContent = "Logout";
      loginBtn.href = "#";
      loginBtn.classList.remove("btn-primary");
      loginBtn.classList.add("btn-danger");
      loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("username");
        window.location.reload();
      });
    }

    if (headerUsername) {
      headerUsername.textContent = `Hi, ${username}`;
    }
  }
});


