"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitSuggestion(formData: FormData) {
  const fighterId = formData.get("fighterId") as string;
  const fighterSlug = formData.get("fighterSlug") as string;
  const authorName = formData.get("authorName") as string;
  const section = formData.get("section") as string;
  const message = formData.get("message") as string;

  if (!fighterId || !authorName || !section || !message) {
    return { error: "Todos os campos são obrigatórios." };
  }

  if (message.length < 10) {
    return { error: "A mensagem deve ter pelo menos 10 caracteres." };
  }

  try {
    await db.fighterSuggestion.create({
      data: {
        fighterId,
        authorName: authorName.slice(0, 50),
        section,
        message: message.slice(0, 500),
        approved: false,
      },
    });

    revalidatePath(`/fighters/${fighterSlug}`);
    return { success: true };
  } catch (err) {
    console.error("Falha ao salvar sugestão", err);
    return { error: "Ocorreu um erro interno. Tente novamente." };
  }
}
