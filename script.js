const SUPABASE_URL = "https://ftwfmoqnwhnrqbbcqjpl.supabase.co";
const SUPABASE_KEY = "sb_publishable_NLX3HgBrQjAvmUUI9Jjx6A_9glPH1vq";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let replyToId = null;

// Загрузка сообщений из Supabase
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
    postsContainer.innerHTML = "";

    data.forEach(post => {
        showPost(post);
    });
}

// Безопасный вывод текста
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
}

// Показ одного сообщения
function showPost(post) {
    const postsContainer = document.getElementById("posts");

    const postElement = document.createElement("div");
    postElement.className = "post";

    postElement.innerHTML = `
        <div class="post-header">
            <b>${escapeHtml(post.author)}</b>
            <span>${escapeHtml(post.date)}</span>
        </div>

        ${
            post.replyTo
                ? `
                    <div class="reply-to">
                        Answer to user: <b>${escapeHtml(post.replyTo)}</b>
                    </div>
                `
                : ""
        }

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
    const text = input.value.trim();

    if (text === "") {
        return;
    }

    const newPost = {
        author: "Anonim",
        text: text,
        date: new Date().toLocaleString(),
        replyTo: replyToId
            ? document.getElementById("replyTo").textContent
            : null
    };

    const { error } = await supabaseClient
        .from("messages")
        .insert([newPost]);

    if (error) {
        console.error("Ошибка отправки сообщения:", error);
        alert("Сообщение не отправилось. Открой F12 → Console.");
        return;
    }

    input.value = "";
    cancelReply();

    await loadPosts();
}

// Ответ на сообщение
function replyTo(id, author) {
    replyToId = id;

    document.getElementById("replyInfo").style.display = "block";
    document.getElementById("replyTo").textContent = author;
    document.getElementById("messageInput").focus();
}

// Отменить ответ
function cancelReply() {
    replyToId = null;

    document.getElementById("replyInfo").style.display = "none";
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
        console.log("Realtime status:", status);
    });

// При открытии страницы
document.addEventListener("DOMContentLoaded", () => {
    loadPosts();
});