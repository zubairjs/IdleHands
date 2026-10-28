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
    login(username, password);
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

function login(username, password) {
  const isAllValidated = validateInputs(username, password);
  if (!isAllValidated) return;
  state.isLoggedIn = true;
  localStorage.setItem('state', JSON.stringify(state));
  storeData(users, 'current', username, 'users');
  showDashboard();
}

function validateInputs(username, password) {
  if (username.trim() === '') {
    showInvalidInput([usernameInput], 'Please enter the username');
    return false;
  }
  const foundUsername = users.registered.find((u) => u.username === username);
  if (!foundUsername) {
    showInvalidInput([usernameInput], 'Username not found');
    return false;
  }
  if (password.trim() === '') {
    showValidInput([usernameInput]);
    showInvalidInput([passwordInput], 'Please enter the password');
    return false;
  }
  if (foundUsername && foundUsername.password !== password) {
    showValidInput([usernameInput]);
    showInvalidInput([passwordInput], 'You entered a wrong password');
    return false;
  }
  showValidInput([usernameInput, passwordInput]);
  showErrorMsg('');
  return true;
}

function showValidInput(inputs) {
  inputs.forEach((input) => input.classList.remove('is-invalid'));
  inputs.forEach((input) => input.classList.add('is-valid'));
}

function showInvalidInput(inputs, msg = '') {
  inputs.forEach((input) => input.classList.remove('is-valid'));
  inputs.forEach((input) => input.classList.add('is-invalid'));
  inputs[0].focus();
  showErrorMsg(msg);
}

function showErrorMsg(msg) {
  formMsg.textContent = msg;
}

function showDashboard() {
  document.getElementById('auth-panel').classList.add('d-none');
  document.getElementById('dashboard').classList.remove('d-none');
  document.getElementById('dashboard-username').textContent = users.current;
}

function showAuth() {
  document.getElementById('auth-panel').classList.remove('d-none');
  document.getElementById('dashboard').classList.add('d-none');
}

function storeData(obj, key, value, type) {
  if (key === 'current') {
    obj[key] = value;
  } else {
    obj[key].push(value);
  }
  localStorage.setItem(type, JSON.stringify(obj));
}

if (state.isLoggedIn) {
  showDashboard();
} else {
  showAuth();
}
