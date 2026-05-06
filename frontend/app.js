const API_URL = 'http://localhost:8000/recipes/';

document.addEventListener('DOMContentLoaded', fetchRecipes);

window.currentRecipes = [];

// Función para alternar pestañas
function switchTab(tabName) {
    const addView = document.getElementById('view-add');
    const searchView = document.getElementById('view-search');
    const tabAdd = document.getElementById('tab-add');
    const tabSearch = document.getElementById('tab-search');

    if (tabName === 'add') {
        addView.classList.remove('hidden');
        searchView.classList.add('hidden');
        tabAdd.className = 'px-3 py-1.5 text-sm font-medium rounded-lg bg-brand-700 transition';
        tabSearch.className = 'px-3 py-1.5 text-sm font-medium rounded-lg bg-transparent hover:bg-brand-700 transition';
    } else {
        addView.classList.add('hidden');
        searchView.classList.remove('hidden');
        tabSearch.className = 'px-3 py-1.5 text-sm font-medium rounded-lg bg-brand-700 transition';
        tabAdd.className = 'px-3 py-1.5 text-sm font-medium rounded-lg bg-transparent hover:bg-brand-700 transition';
        renderSearchRecipes(window.currentRecipes);
    }
}

// Obtener recetas de la API
async function fetchRecipes() {
    try {
        const response = await fetch(API_URL);
        const recipes = await response.json();
        window.currentRecipes = recipes;
    } catch (error) {
        console.error('Error al obtener recetas:', error);
    }
}

// Formatear listas numeradas al pulsar Enter
function handleListInput(event, element) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const cursorPosition = element.selectionStart;
        const textBefore = element.value.substring(0, cursorPosition);
        const textAfter = element.value.substring(cursorPosition);

        // Contamos cuántas líneas hay hasta el cursor para saber el número
        const lines = textBefore.split('\n');
        const currentNumber = lines.length + 1;

        element.value = textBefore + '\n' + currentNumber + '. ' + textAfter;
        element.selectionStart = cursorPosition + 4;
        element.selectionEnd = cursorPosition + 4;
    }
}

// Guardar nueva receta
document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        title: document.getElementById('title').value,
        ingredientes: document.getElementById('ingredients').value,
        descripcion: document.getElementById('steps').value,
        tiempo_coccion: parseInt(document.getElementById('cookingTime').value) || null
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert('Receta guardada exitosamente.');
        document.getElementById('recipeForm').reset();
        fetchRecipes();
    } else {
        alert('Hubo un error al guardar la receta.');
    }
});

// Filtrar recetas
function filterRecipes() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = window.currentRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.ingredientes.toLowerCase().includes(query)
    );
    renderSearchRecipes(filtered);
}

// Mostrar resultados de búsqueda
function renderSearchRecipes(recipes) {
    const list = document.getElementById('searchList');
    if (recipes.length === 0) {
        list.innerHTML = '<p class="text-gray-400 text-sm text-center py-8">No se encontraron recetas.</p>';
        return;
    }
    list.innerHTML = recipes.map(recipe => `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h3 class="text-xl font-bold text-brand-600 mb-1">${recipe.title}</h3>
                <p class="text-sm text-gray-500 mb-2"><strong>Ingredientes:</strong></p>
                <p class="text-xs text-gray-600 whitespace-pre-line mb-3">${recipe.ingredientes}</p>
                <p class="text-sm text-gray-700 whitespace-pre-line mb-4">${recipe.descripcion || 'Sin descripción'}</p>
            </div>
            <div class="flex flex-col items-end gap-2 self-end md:self-center">
                <span class="text-xs bg-orange-50 px-3 py-1.5 rounded-full text-brand-700 font-medium">
                    ⏱️ ${recipe.tiempo_coccion ? recipe.tiempo_coccion + ' min' : 'Sin tiempo'}
                </span>
                <button onclick="deleteRecipe(${recipe.id})" class="text-red-500 hover:text-red-700 text-xs font-semibold px-2">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Eliminar receta desde la vista de búsqueda
async function deleteRecipe(id) {
    if (!confirm('¿Deseas eliminar esta receta?')) return;
    await fetch(`${API_URL}${id}`, { method: 'DELETE' });
    fetchRecipes();
    switchTab('search');
}