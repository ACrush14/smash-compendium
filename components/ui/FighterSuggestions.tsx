"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import { submitSuggestion } from "@/app/fighters/[slug]/actions";

export interface SerializedSuggestion {
  id: string;
  authorName: string;
  message: string;
  section: string;
  createdAt: string;
}

interface Props {
  fighterId: string;
  fighterSlug: string;
  fighterName: string;
  suggestions: SerializedSuggestion[];
  validSections: string[];
}

export default function FighterSuggestions({ fighterId, fighterSlug, fighterName, suggestions, validSections }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMsg("");

    const result = await submitSuggestion(formData);
    
    if (result.error) {
      setErrorMsg(result.error);
      setStatus("error");
    } else {
      setStatus("success");
      // Reseta o formulário nativamente
      (document.getElementById("suggestion-form") as HTMLFormElement).reset();
    }
    
    setIsSubmitting(false);
  }

  return (
    <section className="py-12 md:py-24 border-t border-white/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <header className="mb-12 text-center">
          <MessageSquare className="w-12 h-12 text-emerald-400 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
            Curiosidades da Comunidade
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Sabe alguma dica competitiva, glitch histórico ou curiosidade sobre o <strong>{fighterName}</strong>? Compartilhe com a comunidade!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Formulário */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Enviar Curiosidade
            </h3>
            
            <form id="suggestion-form" action={handleSubmit} className="space-y-4">
              <input type="hidden" name="fighterId" value={fighterId} />
              <input type="hidden" name="fighterSlug" value={fighterSlug} />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-400 px-1">Seu Nome / Nickname</label>
                <input 
                  type="text" 
                  name="authorName" 
                  required 
                  placeholder="Ex: Hungrybox"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-400 px-1">Assunto / Versão do Jogo</label>
                <select 
                  name="section" 
                  required
                  defaultValue=""
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
                >
                  <option value="" disabled>Selecione o tema da sua curiosidade...</option>
                  <option value="General">Curiosidade Geral / Origem</option>
                  {validSections.map(v => (
                    <option key={v} value={v}>Super Smash Bros. {v}</option>
                  ))}
                  <option value="Other">Outro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-400 px-1">Sua Mensagem</label>
                <textarea 
                  name="message" 
                  required 
                  rows={4}
                  placeholder="Escreva algo interessante (mínimo 10 caracteres)..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                />
              </div>

              <AnimatePresence>
                {status === "error" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-xl text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errorMsg}
                  </motion.div>
                )}
                {status === "success" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-xl text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Curiosidade enviada para moderação! Obrigado por contribuir.
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-4 bg-white hover:bg-zinc-200 text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar para Curadoria
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Feed de Comentários Aprovados */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white px-2">
              Acervo Público <span className="text-zinc-500 font-normal text-sm ml-2">({suggestions.length})</span>
            </h3>

            {suggestions.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-3xl p-8 text-center bg-zinc-900/20">
                <p className="text-zinc-500 font-light">
                  Nenhuma curiosidade aprovada ainda. Seja o primeiro a contribuir para o museu do {fighterName}!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {suggestions.map((suggestion) => (
                  <motion.div 
                    key={suggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold uppercase text-xs">
                          {suggestion.authorName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm leading-tight">{suggestion.authorName}</p>
                          <p className="text-zinc-500 text-xs">
                            {new Date(suggestion.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-white/5 text-zinc-400 text-[10px] uppercase font-bold tracking-widest">
                        {suggestion.section}
                      </span>
                    </div>
                    <p className="text-zinc-300 text-sm font-light leading-relaxed whitespace-pre-wrap">
                      {suggestion.message}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
