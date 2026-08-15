// ==========================================
// НАСТРОЙКИ СЕРВЕРА И ЭЛЕМЕНТОВ
// ==========================================
// Укажи адрес твоего сервера (IP или домен)
const API_URL = 'http://localhost:3000/api/messages';

// Находим твои существующие элементы на странице по их ID
const postButton = document.getElementById('postButton'); // Твоя кнопка "Пост"
const messageInput = document.getElementById('messageInput'); // Твоё поле ввода
const postsContainer = document.getElementById('postsContainer'); // Контейнер, где выводятся посты

// ==========================================
// 1. ПОЛУЧЕНИЕ И ОТОБРАЖЕНИЕ СООБЩЕНИЙ
// ==========================================
async function loadPosts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Ошибка сети');
    
    const posts = await response.json();
    
    // Очищаем контейнер перед обновлением
    postsContainer.innerHTML = '';
    
    // Рисуем каждое сообщение с сервера
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'post'; // Твой CSS-класс для сообщения
      postElement.textContent = post.text;
      
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error('Не удалось загрузить сообщения:', error);
  }
}

// ==========================================
// 2. ОТПРАВКА НОВОГО СООБЩЕНИЯ
// ==========================================
async function sendPost() {
  const text = messageInput.value.trim();
  
  // Если поле пустое — ничего не отправляем
  if (!text) return;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    });

    if (response.ok) {
      messageInput.value = ''; // Очищаем поле ввода
      loadPosts(); // Сразу обновляем список постов на экране
    }
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
  }
}

// ==========================================
// 3. СОБЫТИЯ И АВТООБНОВЛЕНИЕ
// ==========================================

// Вешаем отправку на клик по кнопке "Пост"
if (postButton) {
  postButton.addEventListener('click', sendPost);
}

// Загружаем посты при первом открытии страницы
loadPosts();

// Проверяем новые сообщения от других пользователей каждые 3 секунды
setInterval(loadPosts, 3000);