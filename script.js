// 📦 ХРАНИЛИЩЕ ДЛЯ ЗАМЕТОК
let notes = [
    { id: 1, title: "План на неделю", content: "Составить план задач на неделю", tag: "work", date: "30 июля 2025" },
    { id: 2, title: "Идея для проекта", content: "Разработать новое мобильное приложение", tag: "ideas", date: "28 июля 2025" },
    { id: 3, title: "Покупки", content: "Молоко, хлеб, яйца, фрукты", tag: "shopping", date: "25 июля 2025" },
    { id: 4, title: "Личные цели", content: "Начать заниматься спортом 3 раза в неделю", tag: "personal", date: "22 июля 2025" }
];

// 🎯 ДИСПЕТЧЕРЫ - КТО ЗА ЧТО ОТВЕЧАЕТ
let currentTag = 'all';        // 📍 Какой тег выбран сейчас
let currentSearch = '';        // 🔍 Что ищем в поиске

// 🎛️ НАХОДИМ ВСЕ КНОПКИ И ПОЛЯ НА СТРАНИЦЕ
const notesContainer = document.getElementById('notesContainer');
const newNoteBtn = document.getElementById('newNoteBtn');
const tagItems = document.querySelectorAll('.spisok__item');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// 🚀 ЗАПУСК ДВИГАТЕЛЯ - КОГДА СТРАНИЦА ЗАГРУЗИЛАСЬ
document.addEventListener('DOMContentLoaded', function() {
    renderNotes(); // 📝 Сразу показываем все заметки
    
    // 🏷️ ДЕЛАЕМ ТЕГИ "ЖИВЫМИ" - реагируют на нажатия
    tagItems.forEach(item => {
        item.addEventListener('click', function() {
            // 🎨 Убираем подсветку у всех тегов
            tagItems.forEach(i => i.classList.remove('active'));
            // 🔵 Подсвечиваем выбранный тег
            this.classList.add('active');
            
            // 📍 Запоминаем какой тег выбрали
            currentTag = this.getAttribute('data-tag');
            // 🔄 Перерисовываем заметки
            renderNotes();
        });
    });
    
    // ➕ КНОПКА "НОВАЯ ЗАМЕТКА"
    newNoteBtn.addEventListener('click', createNewNote);
    
    // 🔍 КНОПКА ПОИСКА
    searchBtn.addEventListener('click', performSearch);
    
    // ⌨️ ПОИСК ПРИ НАЖАТИИ ENTER
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
});

// 🎨 ФУНКЦИЯ "ХУДОЖНИК" - ПОКАЗЫВАЕТ ЗАМЕТКИ НА ЭКРАНЕ
function renderNotes() {
    // 🧹 ОЧИЩАЕМ ЭКРАН - убираем старые заметки
    notesContainer.innerHTML = '';
    
    // 🔍 ФИЛЬТРУЕМ ЗАМЕТКИ - какие показывать?
    const filteredNotes = notes.filter(note => {
        // ✅ Проверяем тег: "все" или совпадает с выбранным
        const matchesTag = currentTag === 'all' || note.tag === currentTag;
        
        // 🔎 Проверяем поиск: пустой или есть совпадение
        const matchesSearch = currentSearch === '' || 
            note.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
            note.content.toLowerCase().includes(currentSearch.toLowerCase());
        
        // 🎯 Показываем заметку только если прошла оба фильтра
        return matchesTag && matchesSearch;
    });
    
    // 📭 ЕСЛИ ЗАМЕТОК НЕТ - показываем сообщение
    if (filteredNotes.length === 0) {
        notesContainer.innerHTML = '<div class="no-notes">Заметок не найдено</div>';
        return;
    }
    
    // 🎨 ДЛЯ КАЖДОЙ ЗАМЕТКИ СОЗДАЕМ "КАРТОЧКУ"
    filteredNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'zadachi__item';
        noteElement.setAttribute('data-id', note.id);
        
        // 📝 ЗАПОЛНЯЕМ КАРТОЧКУ ИНФОРМАЦИЕЙ
        noteElement.innerHTML = `
            <div class="zadachi__item-top">
                <h2>${note.title}</h2>
                <span class="tag-${note.tag}">${getTagName(note.tag)}</span>
            </div>
            <div class="zadachi__item-content">
                ${note.content}
            </div>
            <div class="zadachi__item-down">
                <span>${note.date}</span>
                <button class="delete-btn" data-id="${note.id}">Удалить</button>
            </div>
        `;
        
        // 📤 ДОБАВЛЯЕМ КАРТОЧКУ НА СТРАНИЦУ
        notesContainer.appendChild(noteElement);
    });
    
    // 🗑️ ДЕЛАЕМ КНОПКИ УДАЛЕНИЯ "ЖИВЫМИ"
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const noteId = parseInt(this.getAttribute('data-id'));
            deleteNote(noteId);
        });
    });
}

// 🌍 ФУНКЦИЯ "ПЕРЕВОДЧИК" - английские теги в русские
function getTagName(tag) {
    const tagNames = {
        'all': 'Все',
        'ideas': 'Идеи',
        'personal': 'Личное',
        'work': 'Работа',
        'shopping': 'Список покупок'
    };
    return tagNames[tag] || tag;
}

// ✨ ФУНКЦИЯ "ВОЛШЕБНАЯ КНОПКА" - СОЗДАЕТ НОВУЮ ЗАМЕТКУ
function createNewNote() {
    // 🗣️ СПРАШИВАЕМ У ПОЛЬЗОВАТЕЛЯ
    const title = prompt('Введите заголовок заметки:');
    if (!title) return; // ❌ Если отменили - выходим
    
    const content = prompt('Введите содержание заметки:');
    if (!content) return; // ❌ Если отменили - выходим
    
    const tag = prompt('Выберите тег (work, ideas, personal, shopping):', 'work');
    
    // ✅ ПРОВЕРЯЕМ - правильный ли тег ввели?
    const validTags = ['work', 'ideas', 'personal', 'shopping'];
    const finalTag = validTags.includes(tag) ? tag : 'work';
    
    // 🏗️ СОЗДАЕМ НОВУЮ ЗАМЕТКУ
    const newNote = {
        id: Date.now(), // 🆔 Уникальный номер (текущее время)
        title: title,   // 📌 Заголовок
        content: content, // 📝 Текст
        tag: finalTag,  // 🏷️ Тег
        date: new Date().toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        }) // 📅 Дата в русском формате
    };
    
    notes.unshift(newNote); // 📥 Добавляем в НАЧАЛО списка
    renderNotes();          // 🔄 Перерисовываем экран
}

// 🗑️ ФУНКЦИЯ "УБОРЩИК" - УДАЛЯЕТ ЗАМЕТКИ
function deleteNote(noteId) {
    // ❓ СПРАШИВАЕМ ПОДТВЕРЖДЕНИЕ
    if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
        // ✅ Если "Да" - убираем заметку из списка
        notes = notes.filter(note => note.id !== noteId);
        renderNotes(); // 🔄 Перерисовываем экран
    }
}

// 🔍 ФУНКЦИЯ "ДЕТЕКТИВ" - ИЩЕТ ЗАМЕТКИ
function performSearch() {
    currentSearch = searchInput.value.trim(); // 🕵️‍♂️ Что ищем?
    renderNotes(); // 🔄 Показываем результат поиска
}