import { createClient } from "@/utils/supabase/server";
import { SUPABASE_SCHEMAS } from "./constants/supabase-schemas.const";
import { SUPABASE_TABLES } from "./constants/supabase-tables.const";

export async function userTelegramSincronized() {
    const client = createClient();
    const userRegistered = await (await client).auth.getUser();
    const { data, error } = await (await client).schema(SUPABASE_SCHEMAS.public).from(SUPABASE_TABLES.users).select("*").eq("id", userRegistered.data.user?.id);

    if (!data || error || data.length === 0) {
        return userRegistered.data.user?.id;
    }

    return null;
}