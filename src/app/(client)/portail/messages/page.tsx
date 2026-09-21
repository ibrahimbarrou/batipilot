import type { Metadata } from "next";
import { Clock, Paperclip, Phone, Send, Smile } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/data-display";
import { clientById, messages, people, projectById } from "@/data";
import { cn, relativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Messages",
  description: "Échangez directement avec votre chef de projet.",
};

const QUICK_QUESTIONS = [
  "Quand la pose du carrelage est-elle prévue ?",
  "Puis-je visiter le chantier cette semaine ?",
  "Pouvez-vous m'envoyer le plan de la cuisine ?",
  "Où en est la commande des menuiseries ?",
];

export default function PortalMessagesPage() {
  const project = projectById("p-03")!;
  const client = clientById("c-03")!;
  const manager = people.find((p) => p.id === project.managerId);
  const thread = messages.filter((m) => m.channelId === "ch-03");

  return (
    <>
      <div className="mb-6">
        <p className="mb-1.5 text-[11px] font-semibold tracking-[0.12em] text-brand-600 uppercase">Messagerie</p>
        <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.03em] text-ink-900">
          Échangez avec votre équipe
        </h1>
        <p className="mt-1.5 max-w-2xl text-[14px] text-ink-500">
          Une seule conversation, archivée avec votre chantier. Plus de messages perdus dans les groupes WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Card className="flex h-[560px] flex-col lg:col-span-8">
          <CardHeader className="border-b border-line">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar initials={manager?.initials ?? "CF"} tone={manager?.avatarTone} size="lg" />
              <div className="min-w-0">
                <CardTitle className="truncate">{manager?.name}</CardTitle>
                <p className="truncate text-[12px] text-ink-400">
                  Chef de projet · {project.name}
                </p>
              </div>
            </div>
            <Badge variant="ok" dot>
              En ligne
            </Badge>
          </CardHeader>

          <div className="scrollbar-slim flex-1 space-y-4 overflow-y-auto bg-canvas/50 px-5 py-5">
            <p className="text-center text-[11px] text-ink-400">Conversation démarrée le 10 novembre 2025</p>
            {thread.map((message) => {
              const own = message.author === client.contact;
              return (
                <div key={message.id} className={cn("flex gap-3", own && "flex-row-reverse")}>
                  <Avatar initials={message.initials} tone={message.tone} size="md" />
                  <div className={cn("max-w-[76%] min-w-0", own && "text-right")}>
                    <div className={cn("flex items-baseline gap-2", own && "justify-end")}>
                      <span className="text-[13px] font-medium text-ink-900">{message.author}</span>
                      <span className="text-[11px] text-ink-400">{relativeTime(message.at)}</span>
                    </div>
                    <div
                      className={cn(
                        "mt-1 rounded-xl px-4 py-2.5 text-[13px] leading-relaxed shadow-xs",
                        own
                          ? "rounded-tr-sm bg-brand-800 text-white"
                          : "rounded-tl-sm border border-line bg-white text-ink-700",
                      )}
                    >
                      {message.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-line p-4">
            <div className="flex items-end gap-2 rounded-xl border border-line bg-white p-2 shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/15">
              <Button variant="ghost" size="icon-sm">
                <Paperclip />
              </Button>
              <textarea
                rows={1}
                placeholder="Écrivez votre message…"
                className="max-h-32 flex-1 resize-none bg-transparent px-1 py-1.5 text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
              />
              <Button variant="ghost" size="icon-sm">
                <Smile />
              </Button>
              <Button size="icon-sm">
                <Send />
              </Button>
            </div>
            <p className="mt-2 flex items-center gap-1.5 px-1 text-[11px] text-ink-400">
              <Clock className="size-3" />
              Réponse garantie sous 4 heures ouvrées
            </p>
          </div>
        </Card>

        <div className="space-y-5 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  className="w-full rounded-lg border border-line px-3 py-2.5 text-left text-[13px] leading-snug text-ink-700 transition-colors hover:border-brand-200 hover:bg-brand-50/50 hover:text-brand-900"
                >
                  {question}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contacts utiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {people.slice(0, 3).map((person) => (
                <div key={person.id} className="flex items-center gap-3">
                  <Avatar initials={person.initials} tone={person.avatarTone} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-ink-900">{person.name}</p>
                    <p className="truncate text-[11px] text-ink-400">{person.role}</p>
                  </div>
                  <Button variant="ghost" size="icon-xs" aria-label={`Appeler ${person.name}`}>
                    <Phone />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-brand-200 bg-brand-50/50">
            <CardContent className="pt-5">
              <p className="text-[13px] font-semibold text-brand-900">Tout est tracé</p>
              <p className="mt-1 text-[12px] leading-relaxed text-brand-800/80">
                Chaque échange, validation et pièce jointe est archivé avec votre chantier. En cas de question sur une
                décision passée, l&apos;historique fait foi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
