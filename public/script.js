
const today = new Date();
const formatted = new Intl.DateTimeFormat('en-CA')
    .format(today)

function saveIndRecord() {
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

    alert(`
        Your purchase: ${name} at ${date}
        Amount: ${amount}
        Recorded!`);

}


//add EventLinster
document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById("indSave");

    saveBtn.addEventListener('click', () => {
        saveIndRecord();
    });
});