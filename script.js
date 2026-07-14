// ===============================
// Trading Journal v1
// ===============================

let trades = JSON.parse(localStorage.getItem("trades")) || [];

const table = document.getElementById("tradeTable");

const balanceText = document.getElementById("balance");
const profitText = document.getElementById("profit");
const winrateText = document.getElementById("winrate");
const tradeCountText = document.getElementById("tradeCount");

const START_BALANCE = 10000;

// ===============================
// Tambah Trade
// ===============================

function addTrade(){

const date=document.getElementById("date").value;
const pair=document.getElementById("pair").value;
const type=document.getElementById("type").value;
const lot=parseFloat(document.getElementById("lot").value);
const profit=parseFloat(document.getElementById("profitInput").value);

if(!date||!pair||isNaN(lot)||isNaN(profit)){
alert("Lengkapi data terlebih dahulu.");
return;
}

trades.push({
date,
pair,
type,
lot,
profit
});

saveTrades();
renderTable();
updateDashboard();
drawChart();

document.getElementById("date").value="";
document.getElementById("pair").value="";
document.getElementById("lot").value="";
document.getElementById("profitInput").value="";

}

// ===============================
// Simpan
// ===============================

function saveTrades(){

localStorage.setItem(
"trades",
JSON.stringify(trades)
);

}

// ===============================
// Render Table
// ===============================

function renderTable(){

table.innerHTML="";

trades.forEach((trade,index)=>{

table.innerHTML+=`

<tr>

<td>${trade.date}</td>

<td>${trade.pair}</td>

<td>${trade.type}</td>

<td>${trade.lot}</td>

<td style="color:${trade.profit>=0?'#22c55e':'#ef4444'}">

${trade.profit}

</td>

</tr>

`;

});

}

// ===============================
// Dashboard
// ===============================

function updateDashboard(){

let totalProfit=0;
let win=0;

trades.forEach(t=>{

totalProfit+=t.profit;

if(t.profit>0){
win++;
}

});

const balance=START_BALANCE+totalProfit;

const winrate=
trades.length==0
?0
:((win/trades.length)*100).toFixed(1);

balanceText.innerText="$"+balance.toFixed(2);
profitText.innerText="$"+totalProfit.toFixed(2);
winrateText.innerText=winrate+"%";
tradeCountText.innerText=trades.length;

}

// ===============================
// Grafik Equity
// ===============================

let chart;

function drawChart(){

const labels=[];
const equity=[];

let running=START_BALANCE;

trades.forEach((t,i)=>{

running+=t.profit;

labels.push(i+1);

equity.push(running);

});

const ctx=document
.getElementById("equityChart")
.getContext("2d");

if(chart){
chart.destroy();
}

chart=new Chart(ctx,{
type:"line",
data:{
labels:labels,
datasets:[{
label:"Equity",
data:equity,
borderWidth:3,
tension:.3
}]
},
options:{
responsive:true,
plugins:{
legend:{
display:true
}
}
}
});

}

// ===============================
// Dark Mode
// ===============================

document
.getElementById("darkMode")
.onclick=function(){

document.body.classList.toggle("light");

}

// ===============================
// Pertama Dibuka
// ===============================

renderTable();
updateDashboard();
drawChart();
