// ---------- DATOS Y CONTENIDO ----------
const recipes = [
  {id:1, title:"Ensalada Nutresa", desc:"Lechuga, tomate, atún Nutresa, aderezo ligero", steps:["Mezclar ingredientes","Agregar aderezo"], img:"ensalada.jpg"},
  {id:2, title:"Bowl de pollo", desc:"Pollo a la plancha, arroz integral, brócoli", steps:["Cocinar pollo","Servir con verduras"], img:"bowl.jpg"},
  // puedes añadir más recetas aquí y subir las imágenes a assets/images/
];

const tips = [
  "Toma al menos 8 vasos de agua al día.",
  "Incluye una porción de fruta en el desayuno.",
  "Prefiere verduras de colores variados en tu plato.",
  "Cambia una bebida azucarada por agua con limón.",
  "Camina 20-30 minutos diarios para complementar tu dieta."
];

// ---------- UTILIDADES: puntos y UI ----------
function getPoints(){
  return Number(localStorage.getItem('puntos') || 0);
}
function setPoints(v){
  localStorage.setItem('puntos', v);
  updatePointsDisplay();
}
function addPoint(source){
  const key = `point_counted_${source || 'generic'}`;
  if(localStorage.getItem(key) === 'true') return; // evitar doble conteo
  const p = getPoints() + 1;
  setPoints(p);
  localStorage.setItem(key,'true');
  if(p >= 5){
    setTimeout(()=> alert("¡Felicidades! Has alcanzado 5 puntos saludables 🎉"), 300);
  }
}
function updatePointsDisplay(){
  const el = document.getElementById('pointsDisplay');
  if(el) el.textContent = `Puntos: ${getPoints()}`;
}

// Mostrar consejo del día
function showDailyTip(){
  const el = document.getElementById('dailyTip');
  if(!el) return;
  const idx = Math.floor(Math.random() * tips.length);
  el.textContent = tips[idx];
}

// ---------- ENCUESTA -------------
const surveyForm = document.getElementById('surveyForm');
const surveyResult = document.getElementById('surveyResult');
if(surveyForm){
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
    // marcar encuesta completada y desbloquear eBook
    localStorage.setItem('surveyCompleted','true');
    document.getElementById('ebookLink').classList.remove('hidden');
    document.getElementById('ebookHint').textContent = "¡Listo! eBook desbloqueado.";
    // sumar punto por completar encuesta (una sola vez)
    addPoint('survey');
  });
}

// ---------- ARMA TU PLATO -------------
const plateResult = document.getElementById('plateResult');
const btnCheckPlate = document.getElementById('checkPlate');
if(btnCheckPlate){
  btnCheckPlate.addEventListener('click', function(){
    const p = document.getElementById('protein').value;
    const c = document.getElementById('carb').value;
    const v = document.getElementById('veg').value;
    if(p && c && v) {
      plateResult.innerHTML = '<strong>¡Buen trabajo! Plato balanceado.</strong><p>Consejo: cambia bebidas azucaradas por agua o jugos naturales.</p>';
    } else {
      plateResult.innerHTML = '<strong>Incluye proteína, carbohidrato y al menos un vegetal.</strong>';
    }
  });
}

// ---------- RETOS (guardado y puntos) -------------
const retos = ['r1','r2','r3'];
retos.forEach(id => {
  const el = document.getElementById(id);
  if(!el) return;
  // restablecer estado desde localStorage
  el.checked = localStorage.getItem(id) === 'true';
  el.addEventListener('change', function(){
    localStorage.setItem(id, el.checked);
    document.getElementById('challengesSaved').textContent = 'Estado guardado.';
    // si marca y no estaba contado, sumar punto
    if(el.checked){
      addPoint(id);
    }
    // r3 desbloquea ebook igualmente
    if(id === 'r3' && el.checked){
      localStorage.setItem('ebookUnlocked','true');
      document.getElementById('ebookLink').classList.remove('hidden');
      document.getElementById('ebookHint').textContent = "¡eBook desbloqueado por completar un reto!";
    }
  });
});

// desbloquear eBook si ya estaba
if(localStorage.getItem('surveyCompleted') === 'true' || localStorage.getItem('ebookUnlocked') === 'true'){
  document.getElementById('ebookLink').classList.remove('hidden');
  document.getElementById('ebookHint').textContent = "eBook disponible para descargar.";
}

// ---------- RECETAS (render dinámico con imágenes) -------------
const recipesContainer = document.getElementById('recipesContainer');
function renderRecipes(){
  if(!recipesContainer) return;
  recipesContainer.innerHTML = recipes.map(r => `
    <div class="rec-card">
      ${r.img ? `<img class="rec-img" src="assets/images/${r.img}" alt="${r.title}">` : ''}
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
  if(!r) return alert("Receta no encontrada.");
  alert(`${r.title}\n\nIngredientes: ${r.desc}\n\nPasos:\n- ${r.steps.join('\n- ')}`);
}
renderRecipes();

// ---------- ON LOAD ----------
updatePointsDisplay();
showDailyTip();
