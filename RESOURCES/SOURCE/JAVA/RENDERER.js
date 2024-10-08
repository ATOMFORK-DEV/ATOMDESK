console.log('This is a renderer process script');

// Window control buttons
document.getElementById('min-button').addEventListener('click', () => {
  window.electronAPI.minimizeWindow();
});

document.getElementById('close-button').addEventListener('click', () => {
  window.electronAPI.closeWindow();
});

// You can add more frontend JavaScript code here
