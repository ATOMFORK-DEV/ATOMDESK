console.log('This is a renderer process script');

// Window control buttons
document.getElementById('min-button').addEventListener('click', () => {
  window.electronAPI.minimizeWindow();
});

document.getElementById('close-button').addEventListener('click', () => {
  window.electronAPI.closeWindow();
});

// Content switching
let currentContent = 1;
document.getElementById('window-icon').addEventListener('click', () => {
  const content1 = document.getElementById('content1');
  const content2 = document.getElementById('content2');
  
  if (currentContent === 1) {
    content1.style.display = 'none';
    content2.style.display = 'block';
    currentContent = 2;
  } else {
    content1.style.display = 'block';
    content2.style.display = 'none';
    currentContent = 1;
  }
});

// You can add more frontend JavaScript code here
