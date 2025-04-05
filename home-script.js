// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
}

// Handle URL hash changes for page navigation
function handleHashChange() {
    // First check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // If user is admin, redirect to admin page
    if (currentUser.type === 'admin') {
        window.location.href = 'admin-pending.html';
        return;
    }

    const hash = window.location.hash.substring(1); // Remove the # character
    if (hash && document.getElementById(hash)) {
        showPage(hash);
    } else {
        showPage('home');
    }
}

// Check if user is logged in
function checkUserLogin() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // If not logged in, redirect to login page
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // If admin, redirect to admin page
    if (currentUser.type === 'admin') {
        window.location.href = 'admin-pending.html';
        return;
    }

    // Update the navigation to show logout if user is logged in
    updateNavigation(currentUser);

    // If there's a specific area the user should be directed to based on their role
    if (currentUser) {
        if (window.location.hash) {
            // If there's a hash in the URL, it takes precedence (user clicked a specific link)
            handleHashChange();
        } else {
            // Otherwise, show the default view for that user type
            if (currentUser.type === 'student') {
                showPage('jobs');
            } else if (currentUser.type === 'employer') {
                showPage('employer');
            }
        }

        // Update content based on user type
        updateContentForUserType(currentUser);
    }
}

// Update navigation based on login status
function updateNavigation(currentUser) {
    const navContainer = document.querySelector('nav ul');
    if (!navContainer) return;

    // Check if the logout link already exists
    const existingLogoutLink = document.getElementById('logout-link');

    // Check if job listings link exists
    const jobListingsLink = document.getElementById('job-listings-nav');
    // Check if post listings link exists
    const postListingsLink = document.getElementById('post-listings-nav');
    // Check if responses link exists
    const responsesLink = document.getElementById('responses-nav');

    if (currentUser) {
        // Show appropriate navigation links based on user type
        if (currentUser.type === 'student') {
            if (jobListingsLink) jobListingsLink.style.display = 'block';
            if (postListingsLink) postListingsLink.style.display = 'none';
            if (responsesLink) responsesLink.style.display = 'none';

            // Hide Post a Job button for students
            const postJobButton = document.getElementById('post-job-button');
            if (postJobButton) postJobButton.style.display = 'none';
        } else if (currentUser.type === 'employer') {
            if (jobListingsLink) jobListingsLink.style.display = 'none';
            if (postListingsLink) postListingsLink.style.display = 'block';
            if (responsesLink) responsesLink.style.display = 'block';
        }

        // User is logged in - show logout and personalized greeting
        if (!existingLogoutLink) {
            // Create the welcome text element
            const welcomeItem = document.createElement('li');
            welcomeItem.className = 'welcome-text';

            // Customize welcome message based on user type
            let welcomeText = '';
            if (currentUser.type === 'student') {
                welcomeText = `Welcome, ${currentUser.name || 'Student'}`;
            } else if (currentUser.type === 'employer') {
                welcomeText = `Welcome, ${currentUser.companyName || 'Employer'}`;
            }

            welcomeItem.textContent = welcomeText;

            // Create logout link
            const logoutItem = document.createElement('li');
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = 'Logout';
            logoutLink.id = 'logout-link';
            logoutLink.addEventListener('click', logout);
            logoutItem.appendChild(logoutLink);

            // Add to navigation
            navContainer.appendChild(welcomeItem);
            navContainer.appendChild(logoutItem);
        }
    } else {
        // User is not logged in - show standard navigation
        if (existingLogoutLink) {
            // Remove logout link and welcome message if they exist
            existingLogoutLink.parentElement.remove();
            const welcomeText = document.querySelector('.welcome-text');
            if (welcomeText) welcomeText.remove();
        }

        // Hide navigation links
        if (jobListingsLink) jobListingsLink.style.display = 'none';
        if (postListingsLink) postListingsLink.style.display = 'none';
        if (responsesLink) responsesLink.style.display = 'none';
    }
}

// Update content based on user type
function updateContentForUserType(currentUser) {
    if (!currentUser) return;

    // Example: Add "My Applications" section for students
    if (currentUser.type === 'student') {
        const jobsSection = document.getElementById('jobs');
        if (jobsSection) {
            // Check if "My Applications" section already exists
            if (!document.getElementById('my-applications')) {
                const myApplicationsSection = document.createElement('div');
                myApplicationsSection.id = 'my-applications';
                myApplicationsSection.className = 'card';
                myApplicationsSection.innerHTML = `
                    <h3>My Applications</h3>
                    <p>You haven't submitted any job applications yet.</p>
                    <p>Browse the listings below to find opportunities that match your skills.</p>
                    <p><a href="job-listings.html" class="btn btn-primary">View All Job Listings</a></p>
                `;

                // Insert at the beginning of the jobs section
                const containerDiv = jobsSection.querySelector('.container');
                if (containerDiv) {
                    containerDiv.insertBefore(myApplicationsSection, containerDiv.firstChild);
                }
            }
        }
    }

    // Example: Add job management section for employers
    if (currentUser.type === 'employer') {
        const employerSection = document.getElementById('employer');
        if (employerSection) {
            // Check if management section already exists
            if (!document.getElementById('job-management')) {
                const jobManagementSection = document.createElement('div');
                jobManagementSection.id = 'job-management';
                jobManagementSection.className = 'card';
                jobManagementSection.innerHTML = `
                    <h3>Your Job Listings</h3>
                    <p>Manage your job listings and view application responses.</p>
                    <div class="job-management-buttons">
                        <a href="#post-listings" class="btn btn-primary" onclick="showPage('post-listings')">Post New Job</a>
                        <a href="#responses" class="btn" onclick="showPage('responses')">View Applications</a>
                    </div>
                `;

                // Insert at the beginning of the employer section
                const containerDiv = employerSection.querySelector('.container');
                if (containerDiv) {
                    containerDiv.insertBefore(jobManagementSection, containerDiv.firstChild);
                }
            }
        }
    }
}

// Logout function
function logout(e) {
    if (e) e.preventDefault();

    // Clear user session
    sessionStorage.removeItem('currentUser');

    // Redirect to login page
    window.location.href = 'index.html';
}

// Add event listener for hash changes
window.addEventListener('hashchange', handleHashChange);

// Initial page load setup
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in first
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // If admin, redirect to admin page
    if (currentUser.type === 'admin') {
        window.location.href = 'admin-pending.html';
        return;
    }

    // Check initial hash and show appropriate page
    handleHashChange();

    // Check user login status and update UI
    checkUserLogin();

    // Home link handling
    const homeLink = document.querySelector('nav ul li a[href="#"]');
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.hash = '';
            showPage('home');
        });
    }

    // Job submission form handling for employers
    const postListingForm = document.getElementById('post-listing-form');
    if (postListingForm) {
        postListingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Check if user is logged in as employer
            if (!currentUser || currentUser.type !== 'employer') {
                alert('Please log in as an employer to post job listings.');
                return;
            }

            // Get form data
            const jobData = {
                id: 'job_' + Date.now(),
                title: document.getElementById('jobTitle').value,
                type: document.getElementById('jobType').value,
                salary: document.getElementById('jobSalary').value,
                location: document.getElementById('jobLocation').value,
                description: document.getElementById('jobDescription').value,
                requirements: document.getElementById('jobRequirements').value,
                company: currentUser.companyName,
                employerId: currentUser.email,
                status: 'pending',
                dateSubmitted: new Date().toISOString()
            };

            // Store in localStorage
            const pendingJobs = JSON.parse(localStorage.getItem('pendingJobs')) || [];
            pendingJobs.push(jobData);
            localStorage.setItem('pendingJobs', JSON.stringify(pendingJobs));

            // Show confirmation message
            document.getElementById('referenceId').textContent = jobData.id;
            document.getElementById('post-listing-form').style.display = 'none';
            document.getElementById('submission-confirmation').style.display = 'block';
        });
    }

    // Load applications for employers
    if (currentUser.type === 'employer') {
        loadEmployerApplications(currentUser);
    }
});

// Function to load employer applications
function loadEmployerApplications(employer) {
    const applications = JSON.parse(localStorage.getItem('applications')) || [];
    const employerApplications = applications.filter(app => app.employerId === employer.email);

    if (employerApplications.length > 0) {
        const noResponsesElement = document.getElementById('no-responses');
        if (noResponsesElement) {
            noResponsesElement.style.display = 'none';
        }

        const applicationsContainer = document.getElementById('student-applications-list');
        if (applicationsContainer) {
            let applicationsHTML = '';

            employerApplications.forEach(app => {
                const applicationDate = new Date(app.dateApplied).toLocaleDateString();

                applicationsHTML += `
                    <div class="application-item card">
                        <h3>${app.jobTitle}</h3>
                        <div class="application-details">
                            <p><strong>Student Name:</strong> ${app.studentName}</p>
                            <p><strong>Student ID:</strong> ${app.studentId}</p>
                            <p><strong>Email:</strong> ${app.studentEmail}</p>
                            <p><strong>Grade:</strong> ${app.studentGrade}</p>
                            <p><strong>Applied:</strong> ${applicationDate}</p>
                        </div>
                    </div>
                `;
            });

            applicationsContainer.innerHTML = applicationsHTML;
        }
    }
}