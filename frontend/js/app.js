document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const logoutBtn = document.getElementById("logout-btn");
  const uploadImageForm = document.getElementById("upload-image-form");

  const registerSection = document.getElementById("register-section");
  const loginSection = document.getElementById("login-section");
  const logoutSection = document.getElementById("logout-section");
  const imageUploadSection = document.getElementById("image-upload-section");
  const imageListSection = document.getElementById("image-list-section");

  const goToRegisterLink = document.getElementById("go-to-register");
  const goToLoginLink = document.getElementById("go-to-login");

  const switchToSection = (section) => {
    console.log(`Switching to section: ${section}`);
    registerSection.style.display = section === "register" ? "block" : "none";
    loginSection.style.display = section === "login" ? "block" : "none";
    logoutSection.style.display = section === "logout" ? "block" : "none";
    imageUploadSection.style.display = section === "logout" ? "block" : "none";
    imageListSection.style.display = section === "logout" ? "block" : "none";
    
    if (section === "logout") {
      loadImages();
    }
  };

  const renderImages = (images) => {
    const imageListContainer = document.getElementById("image-list");
    imageListContainer.innerHTML = "";

    if (!images || images.length === 0) {
      imageListContainer.innerHTML = "<p>Nessuna immagine disponibile</p>";
      return;
    }

    images.forEach((image) => {
      const card = document.createElement("div");
      card.classList.add("image-card");
      card.innerHTML = `
        <h3>${image.title || 'Senza titolo'}</h3>
        <p>${image.created_at ? new Date(image.created_at).toLocaleDateString() : 'Data non disponibile'}</p>
        <img src="${image.url}" alt="${image.title || 'Immagine'}" class="image-card-img">
        <button class="image-info-btn">Info</button>
        <button class="image-delete-btn" data-id="${image.id}">Elimina</button>
      `;
      imageListContainer.appendChild(card);
    });

    addDeleteListeners();
  };

  const loadImages = async () => {
    const token = localStorage.getItem("token");
    console.log("Token in loadImages:", token);
    
    if (!token) {
      console.log("Nessun token trovato, impossibile caricare immagini");
      renderImages([]);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/images", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      console.log("Dati immagini ricevuti:", data);

      if (response.ok) {
        renderImages(data.images || []);
      } else {
        console.error("Errore nel caricamento delle immagini:", data.error);
        alert(`Errore nel caricamento: ${data.error || "Errore sconosciuto"}`);
        renderImages([]);
      }
    } catch (error) {
      console.error("Errore caricamento immagini:", error);
      alert("Errore durante il caricamento delle immagini. Controlla la console per dettagli.");
      renderImages([]);
    }
  };

  const addDeleteListeners = () => {
    document.querySelectorAll(".image-delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const imageId = btn.getAttribute("data-id");
        const token = localStorage.getItem("token");
        console.log(`Tentativo di eliminare immagine ${imageId}`);

        if (!token) {
          alert("Devi effettuare il login per eliminare immagini.");
          switchToSection("login");
          return;
        }

        const confirmed = confirm("Sei sicuro di voler eliminare questa immagine?");
        if (!confirmed) return;

        try {
          const response = await fetch(`http://localhost:3000/images/${imageId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await response.json();

          if (response.ok) {
            alert("Immagine eliminata con successo.");
            await loadImages();
          } else {
            alert(`Errore: ${data.error || "Errore sconosciuto"}`);
          }
        } catch (error) {
          console.error("Errore eliminazione:", error);
          alert("Errore durante l'eliminazione. Controlla la console per dettagli.");
        }
      });
    });
  };

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registrazione completata. Effettua il login.");
        switchToSection("login");
      } else {
        alert(`Registrazione fallita: ${data.error || "Errore sconosciuto"}`);
      }
    } catch (error) {
      console.error("Errore registrazione:", error);
      alert("Errore durante la registrazione. Controlla la console per dettagli.");
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login effettuato con successo!");
        switchToSection("logout");
      } else {
        alert(`Login fallito: ${data.error || "Errore sconosciuto"}`);
      }
    } catch (error) {
      console.error("Errore login:", error);
      alert("Errore durante il login. Controlla la console per dettagli.");
    }
  });

  logoutBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Non sei loggato.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("token");
        alert("Logout effettuato.");
        switchToSection("login");
      } else {
        alert(`Errore nel logout: ${data.error || "Errore sconosciuto"}`);
      }
    } catch (error) {
      console.error("Errore logout:", error);
      alert("Errore durante il logout. Controlla la console per dettagli.");
    }
  });

  uploadImageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const title = document.getElementById("image-title").value;
    const url = document.getElementById("image-url").value;

    if (!token) {
      alert("Devi effettuare il login per caricare immagini.");
      switchToSection("login");
      return;
    }

    if (!title || !url) {
      alert("Compila tutti i campi.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, url }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Immagine caricata con successo.");
        document.getElementById("image-title").value = "";
        document.getElementById("image-url").value = "";
        await loadImages();
      } else {
        alert(`Errore nel caricamento: ${data.error || "Errore sconosciuto"}`);
      }
    } catch (error) {
      console.error("Errore upload:", error);
      alert("Errore durante l'upload. Controlla la console per dettagli.");
    }
  });

  goToRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchToSection("register");
  });

  goToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchToSection("login");
  });

  // Verifica se l'utente è già loggato all'avvio
  const token = localStorage.getItem("token");
  if (token) {
    console.log("Token trovato all'avvio, switch to logout section");
    switchToSection("logout");
  } else {
    switchToSection("login");
  }
});