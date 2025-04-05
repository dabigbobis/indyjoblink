// This script adds the logo to all types of user account headers
document.addEventListener('DOMContentLoaded', function() {
    // Get the header nav element
    const headerNav = document.querySelector('header nav');

    if (headerNav) {
        // Get the logo div that currently contains the text
        const logoDiv = headerNav.querySelector('.logo');

        if (logoDiv) {
            // Replace text logo with image logo
            const logoText = logoDiv.innerHTML;
            logoDiv.innerHTML = `<a href="#"><img src="New Logo.png" alt="Indy JobLink Logo"></a>`;

            // Add style to the logo
            const logoImg = logoDiv.querySelector('img');
            if (logoImg) {
                logoImg.style.height = '40px';
                logoImg.style.width = 'auto';
            }

            // Add appropriate href based on user type
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            const logoLink = logoDiv.querySelector('a');

            if (currentUser && logoLink) {
                switch (currentUser.type) {
                    case 'student':
                        logoLink.href = 'student-home.html';
                        break;
                    case 'employer':
                        logoLink.href = 'employer-home.html';
                        break;
                    case 'admin':
                        logoLink.href = 'admin-pending.html';
                        break;
                    default:
                        logoLink.href = 'home.html';
                }
            }
        }
    }
});