const API_URL = 'http://localhost:8000/recipes/';

document.addEventListener('DOMContentLoaded', fetchRecipes);

// Función para obtener recetas
async function fetchRecipes() {
    try {
        const response = await fetch(API_URL);
        const recipes = await response.json();
        renderRecipes(recipes);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('recipeList').innerHTML = `<p class="text-red-500">Error al conectar con la API en el puerto 8080.</p>`;
    }
}

// Función para renderizar en el HTML
function renderRecipes(recipes) {
    const list = document.getElementById('recipeList');
    if (recipes.length === 0) {
        list.innerHTML = '<p class="text-gray-500">No hay recetas.</p>';
        return;
    }

    list.innerHTML = recipes.map(recipe => `
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <h3 class="text-lg font-bold text-indigo-700 mb-2">${recipe.title}</h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-2">${recipe.ingredients}</p>
            <div class="flex justify-between border-t pt-4">
                <button onclick="deleteRecipe(${recipe.id})" class="text-red-400 text-xs">Eliminar</button>
                <button class="bg-gray-100 px-2 py-1 rounded text-xs">Detalles</button>
            </div>
        </div>
    `).join('');
}

// Guardar nueva receta
document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('title').value,
        ingredients: document.getElementById('ingredients').value,
        steps: document.getElementById('steps').value
    };

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    document.getElementById('recipeForm').reset();
    fetchRecipes();
});

// Eliminar receta
async function deleteRecipe(id) {
    if (!confirm('¿Borrar receta?')) return;
    await fetch(`${API_URL}${id}`, { method: 'DELETE' });
    fetchRecipes();
}