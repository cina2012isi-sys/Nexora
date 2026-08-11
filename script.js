const SUPABASE_URL = "https://ftwfmoqnwhnrqbbcqjpl.supabase.co/rest/v1/_PROJECT_URL";
const SUPABASE_KEY = "sb_publishable_NLX3HgBrQjAvmUUI9Jjx6A_9glPH1vq_PUBLISHABLE_KEY";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// Realtime
supabase
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
    .subscribe();

