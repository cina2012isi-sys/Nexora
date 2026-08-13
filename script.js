const SUPABASE_URL = "https://ftwfmoqnwhnrqbbcqjpl.supabase.co";
const SUPABASE_KEY = "sb_publishable_NLX3HgBrQjAvmUUI9Jjx6A_9glPH1vq";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let replyToId = null;

// Загрузка сообщений
async function loadPosts() {
    const { data, error } = await supabaseClient
        .from("messages")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Ошибка загрузки сообщений:", error);
        return;
    }

    const postsContainer = document.getElementById("posts");

    if (!postsContainer) {
        console.error("Не найден элемент #posts");
        return;
    }

    postsContainer.innerHTML = "";

    data.forEach(post => {
        showPost(post);
    });
}

// Защита текста
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
}

// Показ сообщения
function showPost(post) {
    const postsContainer = document.getElementById("posts");

    if (!postsContainer) return;

    const postElement = document.createElement("div");
    postElement.className = "post";

    postElement.innerHTML = `
        <div class="post-header">
            <b>${escapeHtml(post.author)}</b>
            <span>${escapeHtml(post.created_at)}</span>
        </div>

        <div class="post-text">
            ${escapeHtml(post.text)}
        </div>

        <button
            class="reply-button"
            onclick="replyTo(${post.id}, '${escapeHtml(post.author)}')"
        >
            Answer
        </button>
    `;

    postsContainer.prepend(postElement);
}

// Добавление сообщения
async function addPost() {
    const input = document.getElementById("messageInput");

    if (!input) {
        console.error("Не найден #messageInput");
        return;
    }

    const text = input.value.trim();

    if (text === "") {
        return;
    }

    const newPost = {
        id: Date.now(),
        author: "Anonim",
        text: text
    };

    console.log("Отправляем:", newPost);

    const { error } = await supabaseClient
        .from("messages")
        .insert([newPost]);

    if (error) {
        console.error("Ошибка Supabase:", error);
        alert("Ошибка отправки сообщения: " + error.message);
        return;
    }

    input.value = "";
    cancelReply();

    await loadPosts();
}

// Ответ
function replyTo(id, author) {
    replyToId = id;

    const replyInfo = document.getElementById("replyInfo");
    const replyToElement = document.getElementById("replyTo");
    const input = document.getElementById("messageInput");

    if (replyInfo) {
        replyInfo.style.display = "block";
    }

    if (replyToElement) {
        replyToElement.textContent = author;
    }

    if (input) {
        input.focus();
    }
}

// Отмена ответа
function cancelReply() {
    replyToId = null;

    const replyInfo = document.getElementById("replyInfo");

    if (replyInfo) {
        replyInfo.style.display = "none";
    }
}

// Realtime
supabaseClient
    .channel("messages-channel")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "messages"
        },
        () => {
            loadPosts();
        }
    )
    .subscribe((status) => {
        console.log("Realtime:", status);
    });

// Загрузка после открытия страницы
document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
});