const userList = JSON.parse(sessionStorage.getItem("user")) || [];

class User {
    constructor(name) {
        this.name = name;
    }
}

const container = document.querySelector('#container');

const option = document.querySelector('#option');

//POP-UP
Swal.fire({
    allowOutsideClick: false,
    title: 'Start Session',
    html: `<input type="text" id="login" class="swal2-input" placeholder="User">
    <input type="password" id="password" class="swal2-input" placeholder="Password">`,
    confirmButtonText: 'Enter',
    focusConfirm: false,
    preConfirm: () => {
        const login = Swal.getPopup().querySelector('#login').value
        const password = Swal.getPopup().querySelector('#password').value
        if (!login || !password) {
            Swal.showValidationMessage(`Please Insert Username and Password`)
        } else {
            login.value = userList[0];
            if (login) {
                const person = new User(login);
                userList.push(person);
                sessionStorage.setItem('user', JSON.stringify(userList))
            }
        }
        return { login: login, password: password }
    }
}).then((result) => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Successful Login!!',
        showConfirmButton: false,
        timer: 1500
    })
})

option.addEventListener('change', () => {
    switch (option.value) {
        case "1":
            container.innerHTML = `
                    <label>Insert PRODUCT price</label>
                    <br>
                    <input id="price">
                    <br>
                    <label>Enter how much money has been invested in product</label>
                    <br>
                    <input id="investment">
                    <br>
                    <br>
                    <button id="calculate">Calculate</button>
            `
            let btn_calculate = document.querySelector('#calculate')
            btn_calculate.onclick = () => {
                let productValue = document.querySelector("#price").value;
                let investedMoney = document.querySelector("#investment").value;
                let profit = subtract(productValue, investedMoney);
                let h3 = document.createElement("h3");
                h3.innerHTML = `The value of the Product: ${productValue}, Invested Money: ${investedMoney}, Earned Profit: ${profit}`
                container.append(h3);
            }
            break;
        case "2":
            container.innerHTML = `
                    <label>The price of the product</label>
                    <br>
                    <input id="cost">
                    <br>
                    <label>Input the discount percentage thats being offered</label>
                    <br>
                    <input id="percentage">
                    <br>
                    <br>
                    <button id="calculate">Calculate</button>
            `
            let calculateBtn = document.querySelector('#calculate')
            calculateBtn.onclick = () => {
                let discountedValue = 0;
                let discountedProduct = 0;
                let productValue = document.querySelector("#cost").value;
                let percentage = (percent(document.querySelector("#percentage").value));
                discountedValue = (percentage * 100);
                discountedProduct = discount(productValue, discountedValue);
                let h3 = document.createElement("h3");
                h3.innerHTML = `${discountedValue}% discounted,  leaving the final price at: $ ${discountedProduct}`;
                container.append(h3)
            }
            break;


        case "3":
            container.innerHTML = "";
            let paragraph = document.createElement("p");
            paragraph.innerHTML = "User List record: ";
            container.appendChild(paragraph);

            let userListElement = document.createElement("ol");
            for (let i = 0; i < userList.length; i++) {
                let li = document.createElement("li");
                li.innerHTML = JSON.stringify(userList[i]);
                userListElement.appendChild(li);
            }

            container.appendChild(userListElement);
            break;

        case "4":
            container.innerHTML = `
                <label>Insert Loan Amount</label>
                <br>
                <input id="loan">
                <br>
                <label>Whats the interest rate?</label>
                <br>
                <input id="interest">
                <br>
                <label>When do you want to pay the loan?</label>
                <br>
                <select name="optionTerm" id="optionTerm">
                    <option value="default">Choose one</option>
                    <option id="1" value="1">3 Months</option>
                    <option id="2" value="2">6 Months</option>
                    <option id="3" value="3">1 Years</option>
                    <option id="4" value="4">1.5 Years</option>
                    <option id="5" value="5">2 Years</option>
                    <option id="6" value="6">2.5 Years</option>
                </select>
                <br>
                <br>
                <button id="calculate">Calculate</button>
            `
            fetch('https://raw.githubusercontent.com/avilbel/PF-AvilesBelen/main/data.json')
                .then((res) => res.json())
                .then((data) => {
                    let calculateBtn = document.querySelector('#calculate')
                    calculateBtn.onclick = () => {
                        releaseDate(data);
                    }
                })
            break;
    }
});

function subtract(value1, value2) {
    let total = value1 - value2;
    return total;
}
function discount(value1, value2) {
    let total = (value1 - (value1 * (percent(value2))));
    return total;
}
function percent(value) {
    let total = (value / 100);
    return total;
}
function cost(value1, value2, value3, value4) {
    let total = (((value1 * value2) / value3) + value4);
    return total;
}

function releaseDate(data) {
    let loan = parseFloat(document.querySelector("#loan").value);
    let userInterest = parseFloat(document.querySelector("#interest").value);
    let interest = percent(userInterest);
    console.log(interest);
    let termOption = document.querySelector("#optionTerm").value;

    const userData = data.find((d) => d.id === parseInt(termOption));

    let charge = userData.processingCharges;

    let months = userData.month;

    let monthlyCost = cost(loan, interest, months, charge);

    let h3 = document.createElement("h3");
    h3.innerHTML = `Your monthly interest cost will be:  $${monthlyCost}.
        <br>
        Processing Fee: ${userData.processingCharges}
        Total Months: ${userData.month}
        `;
    container.append(h3);
}
