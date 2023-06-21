'use strict';
// BANKIST APP 

// Data 
const account1 = {
  owner: 'Mandip Chhetri',
  movements: [2200, 450, -4400, 300000, -6350, -11130, 70, 1300],
  interestRate: 1.2, // % 
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

///////////////////////////////////////////////// 
/* 
const currencies = new Map([ 
  ['USD', 'United States dollar'], 
  ['EUR', 'Euro'], 
  ['GBP', 'Pound sterling'], 
]); 
 
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]; 
 */
/////////////////////////////////////////////////
console.log("hel0lo");

//////display Movements///////
const displayMovements = function(movements, sort = false) {
  const movement = sort ? movements.slice().sort((a,b) => a-b) : movements;
  
  containerMovements.innerHTML = '';
  movement.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const addMov = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
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
  labelBalance.textContent = `${act.balance}€`
}

/// displaySummery ///

const displaySummery = function(account) {
  const totalDeposit = account.movements.filter(mov => mov >= 0).reduce((acc, depo) => acc + depo);

  labelSumIn.textContent = `${totalDeposit}€`;

  const totalWithdrawal = account.movements.filter(mov => mov < 0).reduce((acc, wd) => acc + Math.abs(wd), 0)

  labelSumOut.textContent = `${totalWithdrawal}€`;

  const totalInterest = account.movements.filter(mov => mov >= 0).map(dep => dep * account.interestRate / 100).filter(dep => dep >= 1).reduce((acc, dep) => acc + dep, 0);

  labelSumInterest.textContent = `${totalInterest}€`
}
// display all stuff

function displayUi(account) {
  calcDisplayBalance(account);
  //display summary 
  displaySummery(account);
  //display movements
  displayMovements(account.movements);
inputTransferTo.value = inputTransferAmount.value = '';
inputCloseUsername.value = inputClosePin.value = '';
inputLoanAmount.value = '';
}

// login interface//
let currentAccount;
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

    //display ui
    displayUi(currentAccount);
  }
})

/// transfer money💰 ///

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();

  const transferAcc = accounts.find(account => account.userName === inputTransferTo.value);
  console.log(transferAcc);
  const transferAmount = Number(inputTransferAmount.value);
  console.log(transferAmount);
  if (transferAcc && transferAmount > 0 && transferAmount <= currentAccount.balance && currentAccount.userName !== transferAcc.userName) {
    transferAcc.movements.push(transferAmount);
    currentAccount.movements.push(-transferAmount);

    displayUi(currentAccount);

  }
})
/// get loan🏦 ///
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount > 0 && currentAccount.movements.some(mov => mov >= loanAmount * 0.1)) {
    inputLoanAmount.value = '';
    currentAccount.movements.push(loanAmount);
    displayUi(currentAccount);
  }
})
/// close account 🔐///

btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.userName && currentAccount.pin === Number(inputClosePin.value)) {
    const indexNum = accounts.findIndex(account => account.userName === inputCloseUsername.value);

    accounts.splice(indexNum, 1);
    labelWelcome.textContent = `Log in to get started`;
    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = 0;
  }
  })
/// sort button 🔘 ///
let sortStatus = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements,!sortStatus);
sortStatus = !sortStatus;
  
})
//challenge
/*
const account = accounts.find(acc => acc.owner === 'Jessica Davis');

console.log(account);

let acco = '';
for(const acc of accounts){
 if(acc.owner === 'Jessica Davis')
   acco = acc;
}
console.log(acco);
*/
