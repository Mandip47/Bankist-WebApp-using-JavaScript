'use strict';
// BANKIST APP 

// Data 
const account1 = {
  owner: 'Mandip Chhetri',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // % 
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2023-06-17T17:01:17.194Z',
    '2023-06-19T23:36:17.929Z',
    '2023-06-21T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'nep-NE', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements 
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

console.log("helloo");

/// display dates 🗓️ ///

const displayDates = function(dates, locale) {
  const movementdaysPassed = (day1, day2) => Math.round((day2 - day1) / (1000 * 3600 * 24));
  // console.log(daysPassed(dates,new Date()))
  const daysPassed = movementdaysPassed(dates, new Date());
  if (daysPassed === 0) return 'Today';
  else if (daysPassed === 1) return 'Yesterday';
  else if (daysPassed <= 7) return `${daysPassed} days ago`
  else {

    return new Intl.DateTimeFormat(locale).format(dates);

    //   const year = dates.getFullYear();
    // const month = `${dates.getMonth() + 1}`.padStart(2,0);
    // const day = `${dates.getDate()}`.padStart(2,0);

    // return `${day}/${month}/${year}`;
  }
}

/// display Formatted Number 🧮 ///

const formatNumber = function(number, currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(number);
}

/// LogOut Timer ⌛///
const startlogOutTimer = function() {

  const runningTime = function() {
    const min = `${Math.floor(totalTime / 60)}`.padStart(2, 0);
    const sec = `${totalTime % 60}`.padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`

    if (totalTime === 0) {
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    totalTime--;
  }
  let totalTime = 300;
  runningTime();
  const timer = setInterval(runningTime, 1000);

  return timer;
}

//////display Movements///////
const displayMovements = function(account, sort = false) {
  const movement = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;

  containerMovements.innerHTML = '';
  movement.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const dates = new Date(account.movementsDates[i]);
    const date = displayDates(dates, account.locale);

    const formatedMovement = formatNumber(mov, account.currency, account.locale);

    const addMov = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${date}</div>
    <div class="movements__value">${formatedMovement}</div>
      </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", addMov);
  });
}


////createUserName/////
const createUserName = function(accounts) {
  accounts.forEach(function(account) {
    account.userName = account.owner.toLowerCase().split(' ').map(eachName => eachName[0]).join('');
  })
}

createUserName(accounts);

/// calculate and display balance ///

const calcDisplayBalance = function(act) {
  act.balance = act.movements.reduce((initSum, mov) => initSum += mov);
  labelBalance.textContent = `${formatNumber(act.balance, act.currency, act.locale)}`
}

/// displaySummery ///

const displaySummery = function(account) {
  const totalDeposit = account.movements.filter(mov => mov >= 0).reduce((acc, depo) => acc + depo);

  labelSumIn.textContent = `${formatNumber(totalDeposit, account.currency, account.locale)}`;

  const totalWithdrawal = account.movements.filter(mov => mov < 0).reduce((acc, wd) => acc + Math.abs(wd), 0)

  labelSumOut.textContent = `${formatNumber(totalWithdrawal, account.currency, account.locale)}`;

  const totalInterest = account.movements.filter(mov => mov >= 0).map(dep => dep * account.interestRate / 100).filter(dep => dep >= 1).reduce((acc, dep) => acc + dep, 0);

  labelSumInterest.textContent = `${formatNumber(totalInterest, account.currency, account.locale)}`
}

// display all stuff 

function displayUi(account) {
  calcDisplayBalance(account);
  //display summary 
  displaySummery(account);
  //display movements
  displayMovements(account);

  /// date and time ⌛ ///
  const now = new Date();
  const option = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
  labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, option).format(now);

  // const year = now.getFullYear();
  // const month = `${now.getMonth() + 1}`.padStart(2,0);
  // const day = `${now.getDate()}`.padStart(2,0);
  // const hour = `${now.getHours()}`.padStart(2,0);
  // const min = `${now.getMinutes()}`.padStart(2,0);

  // labelDate.textContent =`${year}/${month}/${day},  ${hour}:${min}`

  inputTransferTo.value = inputTransferAmount.value = '';
  inputCloseUsername.value = inputClosePin.value = '';
  inputLoanAmount.value = '';
}

// login interface//
let currentAccount, runningTimer;

btnLogin.addEventListener('click', function(e) {
  e.preventDefault();

  currentAccount = accounts.find(account => account.userName === inputLoginUsername.value);
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    //welcome
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}!`;

    containerApp.style.opacity = 100;
    inputLoginPin.blur();
    inputLoginUsername.blur();
    inputLoginUsername.value = inputLoginPin.value = '';

    if (runningTimer) { clearInterval(runningTimer); }

    runningTimer = startlogOutTimer();
    //display ui
    displayUi(currentAccount);
  }
})

/// transfer money💰 ///

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();

  const transferAcc = accounts.find(account => account.userName === inputTransferTo.value);
  console.log(transferAcc);
  const transferAmount = +inputTransferAmount.value;
  console.log(transferAmount);
  if (transferAcc && transferAmount > 0 && transferAmount <= currentAccount.balance && currentAccount.userName !== transferAcc.userName) {
    transferAcc.movements.push(transferAmount);
    currentAccount.movements.push(-transferAmount);
    currentAccount.movementsDates.push(new Date().toISOString());
    transferAcc.movementsDates.push(new Date().toISOString());

    clearInterval(runningTimer);
    runningTimer = startlogOutTimer();
    displayUi(currentAccount);

  }
})
/// get loan🏦 ///
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  setTimeout(function() {
    if (loanAmount > 0 && currentAccount.movements.some(mov => mov >= loanAmount * 0.1)) {
      inputLoanAmount.value = '';
      currentAccount.movements.push(loanAmount);
      currentAccount.movementsDates.push(new Date().toISOString());

      clearInterval(runningTimer);
      runningTimer = startlogOutTimer();

      displayUi(currentAccount);
    }
  }, 1200);

})
/// close account 🔐///

btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.userName && currentAccount.pin === +inputClosePin.value) {
    const indexNum = accounts.findIndex(account => account.userName === inputCloseUsername.value);

    accounts.splice(indexNum, 1);
    labelWelcome.textContent = `Log in to get started`;
    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = 0;
  }
})
/// sort button 🔘  ///
let sortStatus = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount, !sortStatus);
  sortStatus = !sortStatus;
})