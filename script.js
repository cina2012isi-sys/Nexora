const SUPABASE_URL = "https://ftwfmoqnwhnrqbbcqjpl.supabase.co/rest/v1/_PROJECT_URL";
const SUPABASE_KEY = "sb_publishable_NLX3HgBrQjAvmUUI9Jjx6A_9glPH1vq_PUBLISHABLE_KEY";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// Загрузка сообщений
async function loadPosts() {

    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Ошибка загрузки:", error);
        return;
    }

    const posts = document.getElementById("posts");
    posts.innerHTML = "";

    data.forEach(post => {
        showPost(post);
    });
}


// Добавление сообщения
async function addPost() {

    const input = document.getElementById("messageInput");

    const text = input.value.trim();

    if (!text) {
        return;
    }

    const { error } = await supabase
        .from("messages")
        .insert({
            author: "Аноним",
            text: text
        });

    if (error) {
        console.error("Ошибка отправки:", error);
        alert("Не удалось отправить сообщение");
        return;
    }

    input.value = "";

    loadPosts();
}


// Отображение сообщения
function showPost(post) {

    const posts = document.getElementById("posts");

    const element = document.createElement("div");

    element.className = "post";

    element.innerHTML = `
        <div class="post-header">
            <b>${post.author}</b>
        </div>

        <div class="post-text">
            ${post.text}
        </div>
    `;

    posts.appendChild(element);
}


// Загружаем сообщения при открытии
loadPosts();