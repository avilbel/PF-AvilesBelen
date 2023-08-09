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
            paragraph.textContent = "User List record: ";
            container.appendChild(paragraph);

            let userListElement = document.createElement("ol");
            for (const user of userList) {
                let li = document.createElement("li");
                li.textContent = JSON.stringify(user);
                userListElement.appendChild(li);
            }

            container.appendChild(userListElement);
            break;

        case "4":
            container.innerHTML = `
                <label>How much do you want to charge?</label>
                <br>
                <input id="charge">
                <br>
                <label>How would you pay?</label>
                <br>
                <select name="option" id="option">
                    <option value="default">Choose one </option>
                    <option id="checkout" value="1">Checkout</option>
                    <option id="link" value="2">Payment Link</option>
                    <option id="qrCode" value="3">QR Code</option>
                </select>
                <br>
                <label>When do you want to receive the money?</label>
                <br>
                <select name="option" id="option">
                    <option value="default">Choose one</option>
                    <option id="day1" value="1">Immediately</option>
                    <option id="day15" value="2">15 days</option>
                    <option id="day30" value="3">30 days</option>
                </select>
                <br>
                <br>
                <button id="calculate">Calculate</button>
            `
            fetch('/data.json')
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
function percent(value2) {
    let total = (value2 / 100);
    return total;
}

function releaseDate(interestData) {
    let charge = parseFloat(document.querySelector("#charge").value);
    let selectedDay = parseInt(document.querySelector("#option").value);

    let interest = interest.interestPercentage;

    let discountAmount = discount(charge, interestPercentage);
    let discountedCharge = subtract(charge, discountAmount);

    let h3 = document.createElement("h3");
    h3.innerHTML = `You will receive $${discountedCharge}.
    <br>
    Discount Amount: ${discountAmount}
    Release Date: ${selectedDay} days + VAT`;
    container.append(h3);
}

