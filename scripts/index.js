console.log('connected');

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validate credentials
    if (username === 'admin' && password === 'admin123') {
        // Redirect to main page
        window.location.href = 'main.html';
    } else {
        // Show error message
        alert('Invalid credentials! Please use the demo credentials.');
    }
});