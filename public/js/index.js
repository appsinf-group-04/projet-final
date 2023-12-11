// LOGIN MODAL
const showLoginModal = document.getElementsByClassName('showLoginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginModal = document.getElementById('loginModal');

for (let modal of showLoginModal) {
  modal.addEventListener('click', () => {
    loginModal.showModal();
  });

  closeLoginModal.addEventListener('click', () => {
    loginModal.close();
  });
}

// REGISTER MODAL
const showRegisterModal = document.getElementById('showRegisterModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const registerModal = document.getElementById('registerModal');

if (showRegisterModal) {
  showRegisterModal.addEventListener('click', () => {
    loginModal.close();
    registerModal.showModal();
  });

  closeRegisterModal.addEventListener('click', () => {
    registerModal.close();
  });
}

// Toggle the visibility of the filter section
document.addEventListener("DOMContentLoaded", function() {
  const filtresSection = document.getElementById("filtresSection");
  const toggleFiltresButton = document.getElementById("toggleFiltresButton");
  const announcesSection = document.getElementById("announcesSection");

  toggleFiltresButton.addEventListener("click", function() {
    filtresSection.classList.toggle("hidden");
    filtresSection.classList.toggle("w-3/5")
    announcesSection.classList.toggle("hidden")
  });
});