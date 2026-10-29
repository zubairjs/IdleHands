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
    signup(username, password, confirmPassword);
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

function signup(username, password, confirmPassword) {
  const isSignupValid = validateSignup(username, password, confirmPassword);
  if (!isSignupValid) return;
  storeData(users, 'registered', { username, password }, 'users');
  switchAuth();
}

function validateSignup(username, password, confirmPassword) {
  if (username.trim() === '') {
    showInvalidInput([usernameInput], 'Please enter the username');
    return false;
  }
  const foundUsername = users.registered.find(
    (u) => u.username === username.trim(),
  );
  if (foundUsername) {
    showInvalidInput([usernameInput], 'Username already registered');
    return false;
  }
  if (password.trim() === '') {
    showValidInput([usernameInput]);
    showInvalidInput([passwordInput], 'Please enter the password');
    return false;
  }
  const pattern = /(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,}/;
  if (!pattern.test(password)) {
    showValidInput([passwordInput]);
    showInvalidInput(
      [passwordInput],
      'Password must be a minimum of at least 6 alphanumeric character',
    );
    return false;
  }
  if (password !== confirmPassword) {
    showValidInput([passwordInput]);
    showInvalidInput([confirmPasswordInput], 'Passwords do not match');
    return false;
  }
  showValidInput([usernameInput, passwordInput, confirmPasswordInput]);
  showErrorMsg('');
  return true;
}

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

function resetForm() {
  authForm.reset();
  resetValidity([usernameInput, passwordInput, confirmPasswordInput]);
}

function resetValidity(inputs) {
  inputs.forEach((input) => input.classList.remove('is-valid'));
  inputs.forEach((input) => input.classList.remove('is-invalid'));
  inputs[0].focus();
  showErrorMsg('');
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

function logout() {
  state.isLoggedIn = false;
  localStorage.setItem('state', JSON.stringify(state));
  storeData(users, 'current', null, 'users');
  storeData(activities, 'current', null, 'activities');
  showAuth();
  resetForm();
  resetActivityCard();
}
document.getElementById('logout').addEventListener('click', logout);

const activities = JSON.parse(localStorage.getItem('activities')) || {
  current: {},
  saved: [],
};

function resetActivityCard() {
  document
    .getElementById('empty-activity-placeholder')
    .classList.remove('d-none');
  document.querySelector('.card-title').textContent = '';
  document.getElementById('save-btn-container').classList.add('d-none');
  document.querySelector('.activity-data').innerHTML = '';
}

async function fetchData() {
  try {
    const response = await fetch(
      'https://random-activity-sigmo.vercel.app/api/random',
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

function getActivities() {
  console.log("Gettin' it...");
  fetchData()
    .then((activity) => {
      storeData(activities, 'current', activity, 'activities');
      renderActivity(activity);
    })
    .catch((err) => console.error(err));
}

function renderActivity(randomActivity) {
  if (!randomActivity.key) return;

  const { key, activity: name, price } = randomActivity;
  const { type, participants, accessibility, duration, kidFriendly } =
    randomActivity;

  const metadataItems = `
  <li class="list-group-item bg-transparent">
    <div class="row align-items-center gap-4 gap-md-2">
      <div class="col-1">
        <button class="btn bg-success-subtle rounded" type="button"><i class="bi bi-tags-fill text-info"></i></button>
      </div>
      <div class="col d-flex flex-column small">
        <span class="text-uppercase text-muted">Type</span>
        <span>${capitalize(type)}</span>
      </div>
    </div>
  </li>
  <li class="list-group-item bg-transparent">
    <div class="row align-items-center gap-4 gap-md-2">
      <div class="col-1">
        <button class="btn bg-success-subtle rounded" type="button"><i class="bi bi-person-plus-fill text-info"></i></button>
      </div>
      <div class="col d-flex flex-column small">
        <span class="text-uppercase text-muted">Participants</span>
        <span>${participants} ${participants > 1 ? 'people' : 'person'}</span>
      </div>
    </div>
  </li>
  <li class="list-group-item bg-transparent">
    <div class="row align-items-center gap-4 gap-md-2">
      <div class="col-1">
        <button class="btn bg-success-subtle rounded" type="button"><i class="bi bi-cash text-info"></i></button>
      </div>
      <div class="col d-flex flex-column small">
        <span class="text-uppercase text-muted">Price</span>
        <span>$${price.toFixed(2)}</span>
      </div>
    </div>
  </li>
  <li class="list-group-item bg-transparent">
    <div class="row align-items-center gap-4 gap-md-2">
      <div class="col-1">
        <button class="btn bg-success-subtle rounded" type="button"><i class="bi bi-universal-access text-info"></i></button>
      </div>
      <div class="col d-flex flex-column small">
        <span class="text-uppercase text-muted">Accessibility</span>
        <span>${accessibility}</span>
      </div>
    </div>
  </li>
  <li class="list-group-item bg-transparent">
    <div class="row align-items-center gap-4 gap-md-2">
      <div class="col-1">
        <button class="btn bg-success-subtle rounded" type="button"><i class="bi bi-clock-fill text-info"></i></button>
      </div>
      <div class="col d-flex flex-column small">
        <span class="text-uppercase text-muted">Duration</span>
        <span>${capitalize(duration)}</span>
      </div>
    </div>
  </li>
  <li class="list-group-item bg-transparent">
    <div class="row align-items-center gap-4 gap-md-2">
      <div class="col-1">
        <button class="btn bg-success-subtle rounded" type="button"><i class="bi bi-emoji-smile-fill text-info"></i></button>
      </div>
      <div class="col d-flex flex-column small">
        <span class="text-uppercase text-muted">Kid Friendly</span>
        <span><iclass="bi bi-${kidFriendly ? 'check-circle' : 'x-circle'}-fill text-success"></i>${kidFriendly ? 'Yes' : 'No'}</span>
      </div>
    </div>
  </li>
  `;

  const activityContainer = document.getElementById('activity-container');
  activityContainer.querySelector('.card').id = key;
  const costHeader = activityContainer.querySelector('.card-header');
  costHeader.textContent = price === 0 ? 'Free' : 'Cost money';
  costHeader.setAttribute('data-cost-free', price === 0);
  activityContainer.querySelector('.card-title').textContent = name;
  activityContainer.querySelector('.activity-data').innerHTML = metadataItems;
  document.getElementById('empty-activity-placeholder').classList.add('d-none');
  document.getElementById('save-btn-container').classList.remove('d-none');
}
const getActivitiesBtn = document.getElementById('get-activities');
getActivitiesBtn.addEventListener('click', getActivities);

function saveActivity() {
  const isDuplicateData = activities.saved.find(
    (a) => a.key === activities.current.key,
  );
  if (isDuplicateData) {
    alert('The activity you are trying to save have already been saved.');
  } else {
    storeData(activities, 'saved', activities.current, 'activities');
    // render save activities
  }
}
document.getElementById('save').addEventListener('click', saveActivity);

function storeData(obj, key, value, type) {
  if (key === 'current') {
    obj[key] = value;
  } else {
    obj[key].push(value);
  }
  localStorage.setItem(type, JSON.stringify(obj));
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

if (state.isLoggedIn) {
  showDashboard();
} else {
  showAuth();
}
