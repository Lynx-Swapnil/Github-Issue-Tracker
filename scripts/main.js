console.log('connected');

// Filter button functionality
const btnAll = document.getElementById('btnAll');
const btnOpen = document.getElementById('btnOpen');
const btnClosed = document.getElementById('btnClosed');

const filterButtons = [btnAll, btnOpen, btnClosed];

// Function to set active button
function setActiveButton(activeBtn) {
    filterButtons.forEach(btn => {
        if (btn === activeBtn) {
            // Active state
            btn.style.backgroundColor = '#7c3aed';
            btn.style.color = 'white';
            btn.style.border = 'none';
        } else {
            // Inactive state
            btn.style.backgroundColor = '';
            btn.style.color = '#4b5563';
            btn.style.border = '1px solid #d1d5db';
        }
    });
}

// Add click event listeners
btnAll.addEventListener('click', () => setActiveButton(btnAll));
btnOpen.addEventListener('click', () => setActiveButton(btnOpen));
btnClosed.addEventListener('click', () => setActiveButton(btnClosed));