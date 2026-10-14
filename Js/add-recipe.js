
// 1. إدارة البيانات (تحميل الوصفات المخزنة)
const STORAGE_KEY = 'myRecipes'

let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];

function saveRecipes() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
        return true;
    }
    catch (err) {
        return false;
    }
}

// 2. دالة مساعدة
function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
};

// تحويل الصورة نص Base64 مضغوط (أقصى عرض 600px)
function readImage(file) {
    return new Promise((resolve, reject) => {
        if (!file) return resolve('');
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const img = new Image();
            img.onerror = reject;
            img.onload = () => {
                const scale = Math.min(1, 600 / img.width);
                const canvas = document.createElement('canvas');
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

// 3. التنقل بين الصفحات

// function goAddRecipe() {
//     location.href = '/اضافة وصفة.html'
// }

function showRecipe(index) {
    location.href = `recipe-details.html?id=${index}`;
}

const newRecipeBtn = document.querySelector('.new-recipe-btn');
if (newRecipeBtn) newRecipeBtn.addEventListener('click', goAddRecipe);


// 4. القائمة المنسدلة للتصنيف (صفحة الإضافة)
const dropdown = document.getElementById('options');
if (dropdown) {
    const trigger = dropdown.querySelector('.select-trigger');
    const valueBox = dropdown.querySelector('.custom-select-value');
    const categoryInput = document.getElementById('category');

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    dropdown.querySelectorAll('.options-list .select-option').forEach((option) => {
        option.addEventListener('click', () => {
            valueBox.innerHTML = option.innerHTML;
            categoryInput.value = option.dataset.value;
            dropdown.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdown.classList.remove('open');
        }
    });
}

// 5. معالجة إرسال النموذج (إضافة وصفة)
const form = document.getElementById('recipe-form');
if (form) {
    const imageInput = document.getElementById('image');
    const preview = document.getElementById('image-preview');

    imageInput.addEventListener('change', async () => {
        const data = await readImage(imageInput.files[0]);
        if (data && preview) {
            preview.src = data;
            preview.hidden = false;
        }
    })

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const image = await readImage(imageInput.files[0]);

        recipes.push({
            title: document.getElementById('title').value.trim(),
            image: image,
            time: document.getElementById('Prepare-time').value.trim(),
            category: document.getElementById('category').value,
            ingredients: document.getElementById('ingredients').value.trim(),
            instructions: document.getElementById('instructions').value.trim(),
            favorite: false
        });

        if (!saveRecipes()) {
            const newRecipe = recipes[recipes.length - 1];
            if (newRecipe.image && confirm('مساحة التخزين ممتلئة. هل تريد حفظ الوصفة بدون صورة؟')) {
                newRecipe.image = '';
                if (!saveRecipes()) {
                    recipes.pop();
                    alert('المساحة ممتلئة تماماً، احذف بعض الوصفات أولاً.');
                    return;
                }
            } else {
                recipes.pop();
                alert('مساحة التخزين ممتلئة، احذف بعض الوصفات أولاً.');
                return;
            }
        }

        form.reset();
        location.href = "/جميع الوصفات.html"
    })
}

//  6. بناء بطاقة الوصفة ( نفس تنسيق wrapper)
function createRecipeCard(recipe, index) {
    const imgSrc = recipe.image || './img/no-image.png';

    const wrapper = el('div', 'wrapper');
    const cards = el('div', 'cards');

    // ---------- الوجه الأمامي ----------
    const front = el('div', 'front-face');

    const header = el('div', 'card-header');
    const category = el('div', 'options_title', recipe.category || 'وصفة');

    const favBtn = el('button', 'rec-fav-img');
    favBtn.type = 'button';
    const favIcon = el('img', 'fav-icon');
    favIcon.src = './img/love.png';
    favIcon.alt = 'مفضلة';
    if (recipe.favorite) favBtn.classList.add('active');
    favBtn.appendChild(favIcon);
    favBtn.addEventListener('click', () => toggleFavorite(index));

    const flipBtn = el('button', 'flip-btn', '↪ انقر لقلب البطاقة');
    flipBtn.type = 'button';
    flipBtn.addEventListener('click', () => cards.classList.toggle('flipped'));

    header.append(category, favBtn, flipBtn);

    const frontImg = el('img', 'recp-img');
    frontImg.src = imgSrc;
    frontImg.alt = recipe.title;

    const bottom = el('div', 'card-bottom');
    bottom.appendChild(el('h3', 'recipe-title', recipe.title));

    front.append(header, frontImg, bottom);

    // ---------- الوجه الخلفي ----------
    const back = el('div', 'back-face');

    const backImg = el('img', 'recp-img');
    backImg.src = imgSrc;
    backImg.alt = recipe.title;

    const info = el('div', 'info');
    info.appendChild(el('h3', 'recipe-title', recipe.title));

    const time = el('div', 'recipe-time');
    const timeIcon = el('img');
    timeIcon.src = './img/cooking-time.png';
    timeIcon.alt = 'وقت التحضير';
    time.appendChild(timeIcon);
    if (recipe.time) time.appendChild(el('span', '', recipe.time));
    info.appendChild(time);

    const showBtn = el('button', 'recp-show-btn', 'اظهار الوصفة');
    showBtn.type = 'button';
    showBtn.addEventListener('click', () => showRecipe(index));

    const delBtn = el('button', 'recp-delete-btn', 'حذف 🗑️');
    delBtn.type = 'button';
    delBtn.addEventListener('click', () => deleteRecipe(index));

    back.append(backImg, info, showBtn, delBtn);

    cards.append(front, back);
    wrapper.appendChild(cards);
    return wrapper;
}

// 7. عرض الوصفات (صفحة الوصفات / الرئيسية)

function displayRecipes(list = recipes) {
    const grid = document.getElementById('recipes-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (list.length === 0) {
        grid.appendChild(el('p', 'empty-msg', 'لا توجد وصفات بعد، أضف وصفاتك الأولى'));
        return;
    }

    list.forEach((recipe) => {
        grid.appendChild(createRecipeCard(recipe, recipes.indexOf(recipe)));
    });
}

// 8. حذف وصفة
function deleteRecipe(index) {
    if (!confirm('هل أنت متأكد من حذف هذه الوصفة؟')) return;
    recipes.splice(index, 1);
    saveRecipes();
    applyFilters();
}

function toggleFavorite(index) {
    recipes[index].favorite = !recipes[index].favorite;
    saveRecipes();
    applyFilters();
}

// 9. البحث والمفضلة فقط
let favoritesOnly = false;

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const filtered = recipes.filter((r) => {
        if (favoritesOnly && !r.favorite) {
            return false;
        }
        if (!query) {
            return true;
        }
        return (r.title || '').toLowerCase().includes(query) || (r.ingredients || '').toLowerCase().includes(query);
    })

    displayRecipes(filtered);
}

const searchInput = document.getElementById('searchInput');
const searchBtn = document.querySelector('.search-btn');
const favoritesBtn = document.querySelector('.favorites-btn');


if (searchInput) searchInput.addEventListener('input', applyFilters);
if (searchBtn) searchBtn.addEventListener('click', applyFilters);

if (favoritesBtn) {
    favoritesBtn.addEventListener('click', () => {
        favoritesOnly = !favoritesOnly;
        favoritesBtn.classList.toggle('active', favoritesOnly);
        applyFilters();
    });
}

// 10. تشغيل العرض عند فتح الصفحة لأول مرة
applyFilters();