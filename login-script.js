// Global variables and functions to ensure accessibility
window.showTab = showTab;
window.showLoginForm = showLoginForm;
window.hideAllLoginForms = hideAllLoginForms;
window.toggleRegistrationFields = toggleRegistrationFields;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Login script loaded");

    // Initialize localStorage database
    initializeDatabase();

    // Set up tab navigation
    setupTabNavigation();

    // Set up login form buttons
    setupLoginButtons();

    // Set up registration form
    setupRegistrationForm();

    // Set up login forms for each user type
    setupLoginForms();

    // Show login tab by default
    showTab('login');
});

// Set up tab navigation
function setupTabNavigation() {
    // Get tab buttons
    const loginTabButton = document.querySelector('.auth-tab[onclick="showTab(\'login\')"]');
    const registerTabButton = document.querySelector('.auth-tab[onclick="showTab(\'register\')"]');

    // Add click event listeners
    if (loginTabButton) {
        loginTabButton.addEventListener('click', function(e) {
            e.preventDefault();
            showTab('login');
        });
    }

    if (registerTabButton) {
        registerTabButton.addEventListener('click', function(e) {
            e.preventDefault();
            showTab('register');
        });
    }
}

// Set up login buttons
function setupLoginButtons() {
    // Get login buttons
    const studentButton = document.querySelector('button[onclick="showLoginForm(\'student\')"]');
    const employerButton = document.querySelector('button[onclick="showLoginForm(\'employer\')"]');
    const adminButton = document.querySelector('button[onclick="showLoginForm(\'admin\')"]');

    // Add click event listeners
    if (studentButton) {
        studentButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm('student');
        });
    }

    if (employerButton) {
        employerButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm('employer');
        });
    }

    if (adminButton) {
        adminButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm('admin');
        });
    }
}

// Tab functionality
function showTab(tabName) {
    console.log(`Showing tab: ${tabName}`);

    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Find the tab button
    const activeTabButton = document.querySelector(`.auth-tab[onclick="showTab('${tabName}')"]`);
    if (activeTabButton) {
        activeTabButton.classList.add('active');
    }

    // Hide all sections first
    document.querySelectorAll('.auth-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const activeSection = document.getElementById(`${tabName}-section`);
    if (activeSection) {
        activeSection.style.display = 'block';
    } else {
        console.error(`Section not found: ${tabName}-section`);
    }

    // If switching to login tab, hide any open login forms
    if (tabName === 'login') {
        hideAllLoginForms();
    }
}

// Login form handling
function showLoginForm(userType) {
    console.log(`Showing login form for: ${userType}`);

    // Hide all login forms first
    hideAllLoginForms();

    // Show the selected login form
    const formToShow = document.getElementById(`${userType}LoginForm`);
    if (formToShow) {
        formToShow.style.display = 'block';
    } else {
        console.error(`Login form not found: ${userType}LoginForm`);
    }
}

function hideAllLoginForms() {
    const loginForms = ['studentLoginForm', 'employerLoginForm', 'adminLoginForm'];
    loginForms.forEach(form => {
        const element = document.getElementById(form);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Set up registration form
function setupRegistrationForm() {
    // Add listener for account type radio buttons
    const accountTypeRadios = document.querySelectorAll('input[name="accountType"]');
    if (accountTypeRadios.length > 0) {
        accountTypeRadios.forEach(radio => {
            radio.addEventListener('change', toggleRegistrationFields);
        });
    }

    // Registration form submission
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }
}

// Handle registration form submission
function handleRegistration(e) {
    e.preventDefault();
    console.log("Registration form submitted");

    // Get the selected account type
    const accountTypeRadio = document.querySelector('input[name="accountType"]:checked');
    if (!accountTypeRadio) {
        showMessage('registration-form', 'error', 'Please select an account type');
        return;
    }

    const accountType = accountTypeRadio.value;
    console.log("Account type:", accountType);

    // Verify passwords match
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regPasswordConfirm').value;

    if (password !== confirmPassword) {
        showMessage('registration-form', 'error', 'Passwords do not match');
        return;
    }

    // Prepare user data based on account type
    let userData = {
        type: accountType,
        password: password
    };

    if (accountType === 'student') {
        // For student accounts
        const studentIdInput = document.getElementById('regStudentId');
        const nameInput = document.getElementById('regStudentName');
        const emailInput = document.getElementById('regStudentEmail');
        const gradeInput = document.getElementById('regStudentGrade');

        if (!studentIdInput || !nameInput || !emailInput || !gradeInput) {
            showMessage('registration-form', 'error', 'Missing required student fields');
            return;
        }

        // Log the values for debugging
        console.log("Student ID:", studentIdInput.value);
        console.log("Student Name:", nameInput.value);
        console.log("Student Email:", emailInput.value);
        console.log("Student Grade:", gradeInput.value);

        // Add fields to userData
        userData.studentId = studentIdInput.value;
        userData.name = nameInput.value;
        userData.email = emailInput.value;
        userData.grade = gradeInput.value;

        // Validate required fields have values
        if (!userData.studentId || !userData.name || !userData.email || !userData.grade) {
            showMessage('registration-form', 'error', 'All student fields are required');
            return;
        }
    } else { // employer
        // For employer accounts
        const companyNameInput = document.getElementById('regCompanyName');
        const contactNameInput = document.getElementById('regContactName');
        const businessTypeInput = document.getElementById('regBusinessType');
        const emailInput = document.getElementById('regCompanyEmail');
        const phoneInput = document.getElementById('regCompanyPhone');

        if (!companyNameInput || !contactNameInput || !businessTypeInput || !emailInput || !phoneInput) {
            showMessage('registration-form', 'error', 'Missing required employer fields');
            return;
        }

        // Log the values for debugging
        console.log("Company Name:", companyNameInput.value);
        console.log("Contact Name:", contactNameInput.value);
        console.log("Business Type:", businessTypeInput.value);
        console.log("Company Email:", emailInput.value);
        console.log("Company Phone:", phoneInput.value);

        // Add fields to userData
        userData.companyName = companyNameInput.value;
        userData.contactName = contactNameInput.value;
        userData.businessType = businessTypeInput.value;
        userData.email = emailInput.value;
        userData.phone = phoneInput.value;

        // Validate required fields have values
        if (!userData.companyName || !userData.contactName || !userData.businessType || !userData.email || !userData.phone) {
            showMessage('registration-form', 'error', 'All employer fields are required');
            return;
        }
    }

    console.log("User data to save:", userData);

    // Create the account
    const result = createAccount(userData);

    if (result.success) {
        showMessage('registration-form', 'success', 'Account created successfully! You can now log in.');
        document.getElementById('registration-form').reset();

        // Switch to login tab after 2 seconds
        setTimeout(() => {
            showTab('login');
        }, 2000);
    } else {
        showMessage('registration-form', 'error', result.message || 'Error creating account');
    }
}

// Toggle between student and employer registration fields
function toggleRegistrationFields() {
    const studentFields = document.getElementById('student-fields');
    const employerFields = document.getElementById('employer-fields');
    const accountType = document.querySelector('input[name="accountType"]:checked');

    if (!studentFields || !employerFields || !accountType) return;

    if (accountType.value === 'student') {
        studentFields.style.display = 'block';
        employerFields.style.display = 'none';
    } else {
        studentFields.style.display = 'none';
        employerFields.style.display = 'block';
    }
}

// Set up login forms
function setupLoginForms() {
    // Student login form
    const studentLoginForm = document.getElementById('student-login-form');
    if (studentLoginForm) {
        studentLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleStudentLogin();
        });
    }

    // Employer login form
    const employerLoginForm = document.getElementById('employer-login-form');
    if (employerLoginForm) {
        employerLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmployerLogin();
        });
    }

    // Admin login form
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAdminLogin();
        });
    }
}

// Handle student login
// Handle student login
function handleStudentLogin() {
    const studentIdElement = document.getElementById('studentUsername');
    const passwordElement = document.getElementById('studentPassword');

    if (!studentIdElement || !passwordElement) {
        alert('Error finding form elements');
        return;
    }

    const studentId = studentIdElement.value;
    const password = passwordElement.value;

    const result = verifyLogin('student', studentId, password);

    if (result.success) {
        // Store logged-in user info in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify({
            type: 'student',
            ...result.userData
        }));

        alert('Student login successful!');
        window.location.href = 'student-home.html';
    } else {
        showMessage('student-login-form', 'error', result.message || 'Invalid student ID or password');
    }
}

// Handle employer login
function handleEmployerLogin() {
    const emailElement = document.getElementById('employerUsername');
    const passwordElement = document.getElementById('employerPassword');

    if (!emailElement || !passwordElement) {
        alert('Error finding form elements');
        return;
    }

    const email = emailElement.value;
    const password = passwordElement.value;

    const result = verifyLogin('employer', email, password);

    if (result.success) {
        // Store logged-in user info in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify({
            type: 'employer',
            ...result.userData
        }));

        alert('Employer login successful!');
        window.location.href = 'employer-home.html';
    } else {
        showMessage('employer-login-form', 'error', result.message || 'Invalid email or password');
    }
}

// Handle admin login
function handleAdminLogin() {
    const usernameElement = document.getElementById('adminUsername');
    const passwordElement = document.getElementById('adminPassword');

    if (!usernameElement || !passwordElement) {
        alert('Error finding form elements');
        return;
    }

    const username = usernameElement.value;
    const password = passwordElement.value;

    const result = verifyLogin('admin', username, password);

    if (result.success) {
        // Store admin info in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify({
            type: 'admin',
            username: username
        }));

        alert('Admin login successful!');
        window.location.href = 'home.html#admin';
    } else {
        showMessage('admin-login-form', 'error', 'Invalid username or password. For demo purposes, use username: admin, password: password');
    }
}

// Initialize database (localStorage)
function initializeDatabase() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify({
            students: [],
            employers: [],
            admins: [
                {
                    username: 'admin',
                    password: 'password' // In a real app, this would be hashed
                }
            ]
        }));
    }

    // Initialize empty collections if they don't exist
    if (!localStorage.getItem('jobs')) {
        localStorage.setItem('jobs', JSON.stringify([]));
    }

    if (!localStorage.getItem('applications')) {
        localStorage.setItem('applications', JSON.stringify([]));
    }
}

// Create a new user account
function createAccount(userData) {
    console.log("Creating account with data:", userData);

    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || {
        students: [],
        employers: [],
        admins: [
            {
                username: 'admin',
                password: 'password'
            }
        ]
    };

    if (userData.type === 'student') {
        // Check if student ID is already used
        if (users.students.some(student => student.studentId === userData.studentId)) {
            return { success: false, message: 'Student ID already registered' };
        }

        // Ensure applications and savedJobs arrays exist
        userData.applications = [];
        userData.savedJobs = [];

        // Add the new student to the array
        users.students.push(userData);
        console.log("Added new student:", userData);
        console.log("Updated users object:", users);
    } else if (userData.type === 'employer') {
        // Check if company email is already used
        if (users.employers.some(employer => employer.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Ensure jobListings and receivedApplications arrays exist
        userData.jobListings = [];
        userData.receivedApplications = [];

        // Add the new employer to the array
        users.employers.push(userData);
        console.log("Added new employer:", userData);
        console.log("Updated users object:", users);
    }

    // Update localStorage with new user data
    localStorage.setItem('users', JSON.stringify(users));
    console.log("Data saved to localStorage");

    return { success: true };
}

// Verify login credentials
function verifyLogin(userType, username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || {
        students: [],
        employers: [],
        admins: [
            {
                username: 'admin',
                password: 'password'
            }
        ]
    };

    if (userType === 'student') {
        const student = users.students.find(s => s.studentId === username);
        if (student && student.password === password) {
            return { success: true, userData: student };
        }
    } else if (userType === 'employer') {
        const employer = users.employers.find(e => e.email === username);
        if (employer && employer.password === password) {
            return { success: true, userData: employer };
        }
    } else if (userType === 'admin') {
        const admin = users.admins.find(a => a.username === username);
        if (admin && admin.password === password) {
            return { success: true, userData: admin };
        }
    }

    return { success: false, message: 'Invalid username or password' };
}

// Display error or success message
function showMessage(formId, type, message) {
    // Get the form element
    const form = document.getElementById(formId);
    if (!form) return;

    // Remove any existing message
    const existingMessage = form.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `${type}-message message`;
    messageElement.textContent = message;

    // Insert at the top of the form
    form.insertBefore(messageElement, form.firstChild);

    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}