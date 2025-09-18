// Datos básicos de recetas
const recipes = [
  {id:1, title:"Ensalada Nutresa", desc:"Lechuga, tomate, atún Nutresa, aderezo ligero", steps:["Mezclar ingredientes","Agregar aderezo"]},
  {id:2, title:"Bowl de pollo", desc:"Pollo a la plancha, arroz integral, brócoli", steps:["Cocinar pollo","Servir con verduras"]}
];

// ---------- ENCUESTA -------------
const surveyForm = document.getElementById('surveyForm');
const surveyResult = document.getElementById('surveyResult');
surveyForm.addEventListener('submit', function(e){
  e.preventDefault();
  const form = new FormData(surveyForm);
  const fruits = Number(form.get('fruits'));
  const veggies = Number(form.get('veggies'));
  const sugary = Number(form.get('sugary'));
  const exercise = Number(form.get('exercise'));
  const cook = Number(form.get('cook'));
  const score = fruits + veggies + exercise + cook - sugary;
  let profile = '', advice = [];
  if(score <= 2){
    profile = "Principiante saludable";
    advice = ["Empieza cambiando una bebida azucarada por agua 2 veces por semana.","Añade una porción de fruta al día."];
  } else if(score <= 5){
    profile = "En transición";
    advice = ["Aumenta vegetales a 2 porciones diarias.","Cocina 2 recetas nuevas de la semana."];
  } else {
    profile = "Avanzado";
    advice = ["Varía tus proteínas (incluir vegetales proteicos).","Reduce bocadillos altos en azúcar."];
  }
  surveyResult.innerHTML = `<h3>${profile}</h3><ul>${advice.map(a=>`<li>${a}</li>`).join('')}</ul>`;
  localStorage.setItem('surveyCompleted','true');
  document.getElementById('ebookLink').classList.remove('hidden');
  document.getElementById('ebookHint').textContent = "¡Listo! eBook desbloqueado.";
});

// ---------- ARMA TU PLATO -------------
document.getElementById('checkPlate').addEventListener('click', function(){
  const p = document.getElementById('protein').value;
  const c = document.getElementById('carb').value;
  const v = document.getElementById('veg').value;
  const b = document.getElementById('bev').value;
  const plateResult = document.getElementById('plateResult');
  if(p && c && v) {
    plateResult.innerHTML = '<strong>¡Buen trabajo! Plato balanceado.</strong><p>Consejo: cambia bebidas azucaradas por agua o jugos naturales.</p>';
  } else {
    plateResult.innerHTML = '<strong>Incluye proteína, carbohidrato y al menos un vegetal.</strong>';
  }
});

// ---------- RETOS -------------
const retos = ['r1','r2','r3'];
retos.forEach(id => {
  const el = document.getElementById(id);
  el.checked = localStorage.getItem(id) === 'true';
  el.addEventListener('change', function(){
    localStorage.setItem(id, el.checked);
    document.getElementById('challengesSaved').textContent = 'Estado guardado.';
    if(id === 'r3' && el.checked){
      localStorage.setItem('ebookUnlocked','true');
      document.getElementById('ebookLink').classList.remove('hidden');
      document.getElementById('ebookHint').textContent = "¡eBook desbloqueado por completar un reto!";
    }
  });
});
if(localStorage.getItem('surveyCompleted') === 'true' || localStorage.getItem('ebookUnlocked') === 'true'){
  document.getElementById('ebookLink').classList.remove('hidden');
  document.getElementById('ebookHint').textContent = "eBook disponible para descargar.";
}

// ---------- RECETAS -------------
const recipesContainer = document.getElementById('recipesContainer');
function renderRecipes(){
  recipesContainer.innerHTML = recipes.map(r => `
    <div class="rec-card">
      <div class="info">
        <h3>${r.title}</h3>
        <p>${r.desc}</p>
        <button onclick="showRecipe(${r.id})">Ver receta</button>
      </div>
    </div>
  `).join('');
}
window.showRecipe = function(id){
  const r = recipes.find(x => x.id === id);
  alert(`${r.title}\n\nIngredientes: ${r.desc}\n\nPasos:\n- ${r.steps.join('\n- ')}`);
}
renderRecipes();
