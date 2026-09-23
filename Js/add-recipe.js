// script.js

// 1. التنقل بين الصفحات
function showSection(sectionId) {
    document.getElementById('home').style.display = sectionId === 'home' ? 'block' : 'none';
    document.getElementById('add-recipe').style.display = sectionId === 'add-recipe' ? 'block' : 'none';
}

// 2. إدارة البيانات (تحميل الوصفات المخزنة)
let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];

// 3. وظيفة عرض الوصفات في الصفحة الرئيسية
function displayRecipes() {
    const grid = document.getElementById('recipes-grid');
    grid.innerHTML = ''; // مسح المحتوى الحالي

    recipes.forEach((recipe, index) => {
        const card = `
            <div class="recipe-card">
                <img src="${recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${recipe.title}">
                <div class="recipe-card-content">
                    <h3>${recipe.title}</h3>
                    <p><strong>المكونات:</strong> ${recipe.ingredients.substring(0, 50)}...</p>
                    <button onclick="deleteRecipe(${index})" style="background:none; border:none; color:red; cursor:pointer;">حذف 🗑️</button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// 4. معالجة إرسال النموذج (إضافة وصفة)
document.getElementById('recipe-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const newRecipe = {
        title: document.getElementById('title').value,
        image: document.getElementById('image').value,
        ingredients: document.getElementById('ingredients').value,
        instructions: document.getElementById('instructions').value
    };

    recipes.push(newRecipe);
    localStorage.setItem('myRecipes', JSON.stringify(recipes)); // حفظ في المتصفح
    
    this.reset(); // تفريغ الخانات
    alert('تمت إضافة الوصفة بنجاح!');
    showSection('home'); // العودة للرئيسية
    displayRecipes(); // تحديث العرض
});

// 5. حذف وصفة
function deleteRecipe(index) {
    if(confirm('هل أنت متأكد من حذف هذه الوصفة؟')) {
        recipes.splice(index, 1);
        localStorage.setItem('myRecipes', JSON.stringify(recipes));
        displayRecipes();
    }
}

// تشغيل العرض عند فتح الصفحة لأول مرة
displayRecipes();