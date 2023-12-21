// Ban Modal
const showBanModal = document.getElementsByClassName('showBanModal');
const closeBanModal = document.getElementById('closeBanModal');
const banModal = document.getElementById('banModal');

for (let modal of showBanModal) {
  modal.addEventListener('click', () => {
    banModal.showModal();
  });

  closeBanModal.addEventListener('click', () => {
    banModal.close();
  });
}