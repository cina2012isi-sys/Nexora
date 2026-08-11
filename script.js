const SUPABASE_URL = "ТВОЙ_PROJECT_URL";
const SUPABASE_KEY = "ТВОЙ_PUBLISHABLE_KEY";

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

