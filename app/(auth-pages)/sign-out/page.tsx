import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SignOut() {
    const client = await createClient();
    await client.auth.signOut();
    return redirect("/sign-in");
}