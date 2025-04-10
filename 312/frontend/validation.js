// Form validation functions
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const errorMessage = document.getElementById('error-message');
    const formType = form.getAttribute('data-form-type');

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification success';
    document.body.appendChild(notification);

    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (formType === 'login') {
            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password-input').value;

            try {
                const loginResult = Auth.login(email, password);
                if (loginResult.success) {
                    showNotification('Successfully logged in!');
                    setTimeout(() => {
                        window.location.href = loginResult.user.role === 'admin' ? 'admin.html' : 'index.html';
                    }, 1000);
                } else {
                    errorMessage.textContent = loginResult.message;
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            }
        } else if (formType === 'signup') {
            const name = document.getElementById('name-input').value;
            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password-input').value;
            const confirmPassword = document.getElementById('confirm-password-input').value;

            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match';
                errorMessage.style.display = 'block';
                return;
            }

            try {
                // role is now determined by the auth system
                const signupResult = Auth.register(name, email, password);
                if (signupResult.success) {
                    showNotification('Account created successfully!');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1000);
                } else {
                    errorMessage.textContent = signupResult.message;
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            }
        }
    });
});
