import { NextResponse } from "next/server";
import { getServiceSupabase } from "~/server/supabase/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    const adminSupabase = getServiceSupabase();
    const { data, error: listError } = await adminSupabase.auth.admin.listUsers();

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const targetUser = data.users.find(
      (u) => u.email?.toLowerCase() === String(email).toLowerCase(),
    );

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
      targetUser.id,
      { email_confirm: true },
    );

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 },
    );
  }
}
