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