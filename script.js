const SUPABASE_URL = "https://ftwfmoqnwhnrqbbcqjpl.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_NLX3HgBrQjAvmUUI9Jjx6A_9glPH1vq";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


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
    .subscribe();