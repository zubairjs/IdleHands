const users = JSON.parse(localStorage.getItem('users')) || {
  current: null,
  registered: [{ username: 'admin', password: 'admin123' }],
};

const state = JSON.parse(localStorage.getItem('state')) || {
  isLoggedIn: false,
};

let isLogin = true;
const authHeader = document.querySelector('.auth header h1');
const authText = document.querySelector('.auth header p');
const authForm = document.querySelector('.auth form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordDiv = authForm.querySelector('div:has(#confirm-password)');
const confirmPasswordInput = document.getElementById('confirm-password');
const formMsg = document.getElementById('form-msg');
const formSubmitBtn = authForm.querySelector('button');
const toggleAuth = document.getElementById('toggle-auth');
const toggleAuthText = document.getElementById('toggle-auth-text');
const toggleAuthbtn = document.getElementById('toggle-auth-btn');

function switchAuth() {
  isLogin = !isLogin;
  resetForm();

  if (isLogin) {
    showLogin();
  } else {
    showSignup();
  }
}
toggleAuthbtn.addEventListener('click', switchAuth);

function showSignup() {
  authHeader.textContent = 'Sign Up';
  authText.textContent = 'Create an account to discover activities.';
  formSubmitBtn.textContent = 'Sign Up';
  toggleAuthText.innerText = 'Already have an account?';
  toggleAuthbtn.textContent = 'Login';
  confirmPasswordDiv.classList.remove('d-none');
}

function showLogin() {
  authHeader.textContent = 'Login';
  authText.textContent = 'Login to start being productive.';
  formSubmitBtn.textContent = 'Login';
  toggleAuthText.innerText = 'Not registered yet?';
  toggleAuthbtn.textContent = 'Sign Up';
  confirmPasswordDiv.classList.add('d-none');
}

function handleFormSubmit(e) {
  e.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (isLogin) {
    login();
  } else {
    signup();
  }
}
authForm.addEventListener('submit', handleFormSubmit);

function addFormValidation(e) {
  if (!e.target.checkValidity()) {
    e.preventDefault();
    e.stopPropagation();
  }
}
authForm.addEventListener('submit', addFormValidation);
