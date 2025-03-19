// Check if user is logged in and redirect based on user type
document.addEventListener('DOMContentLoaded', function() {
    // Get current user from session storage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // Get current page
    const currentPage = window.location.pathname.split('/').pop();

    // If no user is logged in and not on login page, redirect to login
    if (!currentUser && currentPage !== 'login.html') {
        window.location.href = 'login.html';
        return;
    }

    // Redirect based on user type
    if (currentUser) {
        // If admin accessing any page other than admin-pending.html, redirect
        if (currentUser.type === 'admin' && currentPage !== 'admin-pending.html') {
            window.location.href = 'admin-pending.html';
            return;
        }

        // If student accessing home.html, redirect to student-home.html
        if (currentUser.type === 'student' && currentPage === 'home.html') {
            window.location.href = 'student-home.html';
            return;
        }

        // If employer accessing home.html, redirect to employer-home.html
        if (currentUser.type === 'employer' && currentPage === 'home.html') {
            window.location.href = 'employer-home.html';
            return;
        }

        // If student on employer-home.html, redirect to student-home.html
        if (currentUser.type === 'student' && currentPage === 'employer-home.html') {
            window.location.href = 'student-home.html';
            return;
        }

        // If employer on student-home.html, redirect to employer-home.html
        if (currentUser.type === 'employer' && currentPage === 'student-home.html') {
            window.location.href = 'employer-home.html';
            return;
        }

        // If anyone on login page, redirect to appropriate home
        if (currentPage === 'login.html') {
            if (currentUser.type === 'student') {
                window.location.href = 'student-home.html';
            } else if (currentUser.type === 'employer') {
                window.location.href = 'employer-home.html';
            } else if (currentUser.type === 'admin') {
                window.location.href = 'admin-pending.html';
            }
            return;
        }
    }
});