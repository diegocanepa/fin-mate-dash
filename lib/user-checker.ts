import { createClient } from "@/utils/supabase/server";
import { SUPABASE_SCHEMAS } from "./constants/supabase-schemas.const";
import { SUPABASE_TABLES } from "./constants/supabase-tables.const";

export async function userTelegramSincronized(isLocalEnv: boolean = false) {
    const client = createClient();
    const userRegistered = await (await client).auth.getUser();
    const table = isLocalEnv ? SUPABASE_TABLES.users_test : SUPABASE_TABLES.users;
    const { data, error } = await (await client).schema(SUPABASE_SCHEMAS.public).from(table).select("*").eq("id", userRegistered.data.user?.id);

    if (!data || error || data.length === 0) {
        return userRegistered.data.user?.id;
    }

    return null;
}