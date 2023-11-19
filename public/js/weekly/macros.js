const xValues = ["Carbohidrates", "Protein", "Fat"];
const yValues = [0, 0, 0];
const barColors = ["#ffff4c", "#00e6e2", "#f09a3e"];


// HTML Elements
const carbs = document.getElementById('carbs');
const protein = document.getElementById('protein');
const fat = document.getElementById('fat');
const carbsInput = document.getElementById('carbsInput');
const proteinInput = document.getElementById('proteinInput');
const fatInput = document.getElementById('fatInput');

new Chart("macrosChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
        options: {
          title: {
            display: true,
            text: "Your Menu's Macros"
          }
        }
      });

function updateChart(){
  new Chart("macrosChart", {
    type: "pie",
    data: {
      labels: xValues,
      datasets: [{
            backgroundColor: barColors,
            data: yValues
          }]
        },
          options: {
            title: {
              display: true,
              text: "Your Menu's Macros"
            }
          }
        });
}

function addMacros(id){
  const m = macros[id];
  let c = parseInt(carbs.innerHTML);
  let p = parseInt(protein.innerHTML);
  let f = parseInt(fat.innerHTML);
  carbs.innerHTML = c + m.carbs;
  carbsInput.value = c + m.carbs;
  yValues[0] = c + m.carbs;
  protein.innerHTML = p + m.protein;
  proteinInput.value = p + m.protein;
  yValues[1] = p + m.protein;
  fat.innerHTML = f + m.fat;
  fatInput.value = f + m.fat;
  yValues[2] = f + m.fat;
  updateChart();
}

function addKcalsToDay(id, day){
  const obj = document.getElementById(`${day}kcals`);
  const n_kcals = parseInt(obj.innerHTML);
  const value = n_kcals + macros[id].kcals;
  obj.innerHTML = value;
  const input = document.getElementById(`${day}kcalsInput`);
  input.value =  value;
}

function substractMacros(id){
  const m = macros[id];
  let c = parseInt(carbs.innerHTML);
  let p = parseInt(protein.innerHTML);
  let f = parseInt(fat.innerHTML);
  carbs.innerHTML = c - m.carbs;
  yValues[0] = c - m.carbs;
  protein.innerHTML = p - m.protein;
  yValues[1] = p - m.protein;
  fat.innerHTML = f - m.fat;
  yValues[2] = f - m.fat;
  updateChart();
}

function substractKcalsFromDay(id, day){
  const obj = document.getElementById(`${day}kcals`);
  const n_kcals = parseInt(obj.innerHTML);
  const value = n_kcals - macros[id].kcals;
  obj.innerHTML = value;
  const input = document.getElementById(`${day}kcalsInput`);
  input.value =  value;
}