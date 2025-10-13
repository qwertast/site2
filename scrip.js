let notes = [];
let currentTag = 'all';
let currentSearch = '';
let currentEditingNoteId = null;

const notesContainer = document.getElementById('notesContainer');
const newNoteBtn = document.getElementById('newNoteBtn');
const tagItems = document.querySelectorAll('.spisok__item');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Элементы модального окна
const noteModal = document.getElementById('noteModal');
const modalTitle = document.getElementById('modalTitle');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentInput = document.getElementById('noteContent');
const noteTagSelect = document.getElementById('noteTag');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalSave = document.getElementById('modalSave');

function loadNotes(){
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes){
        notes = JSON.parse(storedNotes);
    } else {
        notes= [
            { id: 1, title: "План на неделю", content: "Составить план задач на неделю", tag: "work", date: "30 июля 2025" },
            { id: 2, title: "Идея для проекта", content: "Разработать новое мобильное приложение", tag: "ideas", date: "28 июля 2025" },
            { id: 3, title: "Покупки", content: "Молоко, хлеб, яйца, фрукты", tag: "shopping", date: "25 июля 2025" },
            { id: 4, title: "Личные цели", content: "Начать заниматься спортом 3 раза в неделю", tag: "personal", date: "22 июля 2025" }
        ];
        saveNotes();
    }
}

function saveNotes(){
    localStorage.setItem('notes', JSON.stringify(notes))
}

document.addEventListener('DOMContentLoaded', function() {
    loadNotes()
    renderNotes(); 
    
    tagItems.forEach(item => {
        item.addEventListener('click', function() {
            tagItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            currentTag = this.getAttribute('data-tag');
            renderNotes();
        });
    });
    
    // Открытие модального окна для новой заметки
    newNoteBtn.addEventListener('click', () => openModal());
    
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    
    // Управление модальным окном
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modalSave.addEventListener('click', saveNote);
    
    // Закрытие модалки при клике вне ее
    noteModal.addEventListener('click', function(event) {
        if (event.target === noteModal) {
            closeModal();
        }
    });
    
    // Закрытие модалки по ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && noteModal.style.display === 'block') {
            closeModal();
        }
    });
});

function renderNotes() {
    notesContainer.innerHTML = '';
    
    const filteredNotes = notes.filter(note => {
        const matchesTag = currentTag === 'all' || note.tag === currentTag;
        
        const matchesSearch = currentSearch === '' || 
            note.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
            note.content.toLowerCase().includes(currentSearch.toLowerCase());
        
        return matchesTag && matchesSearch;
    });
    
    if (filteredNotes.length === 0) {
        notesContainer.innerHTML = '<div class="no-notes">Заметок не найдено</div>';
        return;
    }
    
    filteredNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'zadachi__item';
        noteElement.setAttribute('data-id', note.id);
        
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
                <div class="zadachi__item-actions">
                    <button class="edit-btn" data-id="${note.id}">Изменить</button>
                    <button class="delete-btn" data-id="${note.id}">Удалить</button>
                </div>
            </div>
        `;
        
        notesContainer.appendChild(noteElement);
    });
    
    // Обработчики для кнопок изменения
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const noteId = parseInt(this.getAttribute('data-id'));
            editNote(noteId);
        });
    });
    
    // Обработчики для кнопок удаления
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const noteId = parseInt(this.getAttribute('data-id'));
            deleteNote(noteId);
        });
    });
}

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

// Функции для работы с модальным окном
function openModal(noteId = null) {
    if (noteId) {
        // Редактирование существующей заметки
        const note = notes.find(note => note.id === noteId);
        if (note) {
            modalTitle.textContent = 'Редактировать заметку';
            noteTitleInput.value = note.title;
            noteContentInput.value = note.content;
            noteTagSelect.value = note.tag;
            currentEditingNoteId = noteId;
        }
    } else {
        // Создание новой заметки
        modalTitle.textContent = 'Новая заметка';
        noteTitleInput.value = '';
        noteContentInput.value = '';
        noteTagSelect.value = 'work';
        currentEditingNoteId = null;
    }
    
    noteModal.style.display = 'block';
    noteTitleInput.focus();
}

function closeModal() {
    noteModal.style.display = 'none';
    currentEditingNoteId = null;
}

function saveNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    const tag = noteTagSelect.value;
    
    // Проверяем что поля не пустые
    if (!title || !content) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    if (currentEditingNoteId) {
        // Обновляем существующую заметку
        const noteIndex = notes.findIndex(note => note.id === currentEditingNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title: title,
                content: content,
                tag: tag
            };
        }
    } else {
        // Создаем новую заметку
        const newNote = {
            id: Date.now(),
            title: title,
            content: content,
            tag: tag,
            date: new Date().toLocaleDateString('ru-RU', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            })
        };
        notes.unshift(newNote);
    }
    
    saveNotes();
    closeModal();
    renderNotes();
}

function editNote(noteId) {
    openModal(noteId);
}

function deleteNote(noteId) {
    if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
        notes = notes.filter(note => note.id !== noteId);
        saveNotes();
        renderNotes(); 
    }
}

function performSearch() {
    currentSearch = searchInput.value.trim();
    renderNotes();
}