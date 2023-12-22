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

// interested Modal
const showInterestedModal = document.getElementsByClassName('showInterestedModal');
const closeInterestedModal = document.getElementById('closeInterestedModal');
const interestedModal = document.getElementById('interestedModal');

for (let modal of showInterestedModal) {
  modal.addEventListener('click', () => {
    interestedModal.showModal();
  });

  closeInterestedModal.addEventListener('click', () => {
    interestedModal.close();
  });
}