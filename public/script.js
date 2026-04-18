
const today = new Date();
const formatted = new Intl.DateTimeFormat('en-CA')
    .format(today)

async function saveIndRecord() {
    var amount = Number(document.getElementById("indMoney").value);
    var name = document.getElementById("indPurchaseName").value;
    var date = document.getElementById("indPurchaseDate").value;

    if (isNaN(amount) || amount == null || amount == ""){
        alert("Please enter the amount of money you spent");
        return;
    }

    if (date == "" || date == null){
        date = formatted;
    }

    //SAVE DATA TO DB
    const recordData = {
        amount: amount,
        name: name,
        date: date
    };

    try {
        const response = await fetch('/add-ind-record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recordData)
        });

        // Check if the response is successful
        const result = await response.json();

        if (response.ok) {
            alert(`Record saved successfully
                Purchase: ${name} 
                Date: ${date}
                Amount: ${amount}
                `);
        } else {
            alert('Error saving record: ' + result.message);
        }
    } catch (err) {
        alert('Error saving record: ' + err.message);
    }
    

    

}


//add EventLinster
document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById("indSave");

    saveBtn.addEventListener('click', () => {
        saveIndRecord();
    });
});