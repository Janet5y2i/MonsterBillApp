
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
        date = new Date().toISOString().split('T')[0];
    }

    //SAVE DATA TO DB
    const recordData = {
        amount: amount,
        name: name,
        date: date
    };

    try {
        // 3. 發送請求 (請確認 server.js 也是這個路徑)
        const response = await fetch('/add-ind-record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recordData)
        });

        // 4. 強力偵錯：如果不是 200，先看原始文字是什麼
        if (!response.ok) {
            const errorText = await response.text(); // 改用 text() 抓原始錯誤
            throw new Error(`伺服器回傳錯誤 (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        alert('🎉 儲存成功！');

    } catch (err) {
        console.error("詳細錯誤細節：", err);
        alert('儲存失敗：' + err.message);
    }
}


//add EventLinster
document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById("indSave");

    saveBtn.addEventListener('click', () => {
        saveIndRecord();
    });
});