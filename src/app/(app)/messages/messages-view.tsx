"use client";

import * as React from "react";
import {
  Bell,
  Hash,
  Megaphone,
  MessageSquare,
  Mic,
  Paperclip,
  Search,
  Send,
  Smile,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/data-display";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { activities, channels, currentUser, messages, notifications, projects } from "@/data";
import { cn, relativeTime } from "@/lib/utils";

const kindIcon = {
  project: Hash,
  team: Users,
  client: MessageSquare,
  direct: MessageSquare,
};

export function MessagesView() {
  const [activeChannel, setActiveChannel] = React.useState(channels[0].id);
  const [draft, setDraft] = React.useState("");
  const channel = channels.find((c) => c.id === activeChannel) ?? channels[0];
  const thread = messages.filter((m) => m.channelId === activeChannel);
  const project = projects.find((p) => p.id === channel.projectId);

  return (
    <>
      <PageHeader
        eyebrow="Communication"
        title="Centre de communication"
        description="Un canal par chantier, des messages directs et un fil client — tout est archivé et rattaché au projet, contrairement aux groupes WhatsApp."
        meta={
          <>
            <Badge variant="brand">{channels.length} canaux actifs</Badge>
            <Badge variant="risk" dot>
              {channels.reduce((s, c) => s + c.unread, 0) + notifications.filter((n) => n.unread).length} non lus
            </Badge>
          </>
        }
        actions={
          <Button>
            <Megaphone />
            Faire une annonce
          </Button>
        }
      />

      <Tabs defaultValue="messagerie">
        <TabsList variant="underline" className="mb-5 w-full">
          <TabsTrigger variant="underline" value="messagerie">
            <MessageSquare />
            Messagerie
          </TabsTrigger>
          <TabsTrigger variant="underline" value="notifications">
            <Bell />
            Notifications
          </TabsTrigger>
          <TabsTrigger variant="underline" value="activite">
            <Users />
            Journal d&apos;activité
          </TabsTrigger>
        </TabsList>

        {/* --------------------- Messagerie --------------------- */}
        <TabsContent value="messagerie">
          <div className="grid h-[calc(100dvh-20rem)] min-h-[520px] grid-cols-1 overflow-hidden rounded-lg border border-line bg-surface shadow-sm lg:grid-cols-[300px_1fr]">
            {/* Liste des canaux */}
            <div className="flex flex-col border-r border-line bg-surface-2">
              <div className="border-b border-line p-3">
                <Input placeholder="Rechercher un canal…" icon={<Search />} className="h-8 text-[13px]" />
              </div>
              <div className="scrollbar-slim flex-1 overflow-y-auto p-2">
                {channels.map((c) => {
                  const Icon = kindIcon[c.kind];
                  const active = c.id === activeChannel;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveChannel(c.id)}
                      className={cn(
                        "mb-0.5 flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                        active ? "bg-brand-50 ring-1 ring-brand-100" : "hover:bg-ink-100/70",
                      )}
                    >
                      <Icon className={cn("mt-0.5 size-4 shrink-0", active ? "text-brand-700" : "text-ink-400")} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className={cn("truncate text-[13px] font-medium", active ? "text-brand-900" : "text-ink-900")}>
                            {c.name}
                          </span>
                          {c.unread > 0 ? (
                            <span className="tnum ml-auto flex size-4.5 shrink-0 items-center justify-center rounded-full bg-risk-500 text-[10px] font-semibold text-white">
                              {c.unread}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-ink-400">{c.preview}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversation */}
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-ink-900">{channel.name}</p>
                  <p className="truncate text-[12px] text-ink-400">
                    {channel.members} membres
                    {project ? ` · ${project.code}` : ""}
                    {channel.kind === "client" ? " · canal visible par le client" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {channel.kind === "client" ? (
                    <Badge variant="signal" size="sm">
                      externe
                    </Badge>
                  ) : null}
                  <Button variant="ghost" size="icon-sm">
                    <Search />
                  </Button>
                </div>
              </div>

              <div className="scrollbar-slim flex-1 space-y-4 overflow-y-auto bg-canvas/60 px-5 py-4">
                {thread.length === 0 ? (
                  <p className="py-16 text-center text-[13px] text-ink-400">
                    Aucun message dans ce canal pour le moment.
                  </p>
                ) : (
                  thread.map((message) => (
                    <div key={message.id} className={cn("flex gap-3", message.own && "flex-row-reverse")}>
                      <Avatar initials={message.initials} tone={message.tone} size="md" />
                      <div className={cn("min-w-0 max-w-[74%]", message.own && "items-end text-right")}>
                        <div className={cn("flex items-baseline gap-2", message.own && "justify-end")}>
                          <span className="text-[13px] font-medium text-ink-900">{message.author}</span>
                          <span className="text-[11px] text-ink-400">{relativeTime(message.at)}</span>
                        </div>
                        <div
                          className={cn(
                            "mt-1 rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-xs",
                            message.own
                              ? "rounded-tr-sm bg-brand-800 text-white"
                              : "rounded-tl-sm border border-line bg-white text-ink-700",
                          )}
                        >
                          {message.body}
                          {message.attachments?.length ? (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {message.attachments.map((file) => (
                                <span
                                  key={file}
                                  className={cn(
                                    "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px]",
                                    message.own ? "bg-white/15" : "bg-ink-100 text-ink-600",
                                  )}
                                >
                                  <Paperclip className="size-3" />
                                  {file}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-line p-3">
                <div className="flex items-end gap-2 rounded-xl border border-line bg-white p-2 shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/15">
                  <Button variant="ghost" size="icon-sm">
                    <Paperclip />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <Mic />
                  </Button>
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={1}
                    placeholder={`Message dans ${channel.name}…`}
                    className="max-h-32 flex-1 resize-none bg-transparent px-1 py-1.5 text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
                  />
                  <Button variant="ghost" size="icon-sm">
                    <Smile />
                  </Button>
                  <Button size="icon-sm" disabled={!draft.trim()}>
                    <Send />
                  </Button>
                </div>
                <p className="mt-1.5 px-1 text-[11px] text-ink-400">
                  Connecté en tant que {currentUser.name} · les messages sont archivés dans le projet
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* -------------------- Notifications ------------------- */}
        <TabsContent value="notifications">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Card className="lg:col-span-8">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <Badge variant="risk" size="sm">
                  {notifications.filter((n) => n.unread).length} non lues
                </Badge>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <ul className="divide-y divide-line border-t border-line">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={cn("flex gap-3 px-5 py-3.5 transition-colors hover:bg-ink-50/60", n.unread && "bg-brand-50/30")}
                    >
                      <span
                        className={cn(
                          "mt-1.5 size-2 shrink-0 rounded-full",
                          n.kind === "critical" ? "bg-risk-500" : n.kind === "warning" ? "bg-warn-500" : "bg-brand-500",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-ink-900">{n.title}</p>
                        <p className="text-[12px] text-ink-500">{n.body}</p>
                      </div>
                      <span className="shrink-0 text-[11px] text-ink-400">{relativeTime(n.at)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Canaux de diffusion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Notification push mobile", detail: "Alertes chantier et validations", on: true },
                  { label: "E-mail", detail: "Rapports publiés, devis, factures", on: true },
                  { label: "SMS", detail: "Alertes critiques et codes OTP", on: true },
                  { label: "WhatsApp Business", detail: "Notifications client et liens portail", on: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-3 rounded-lg border border-line p-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink-900">{item.label}</p>
                      <p className="text-[12px] text-ink-500">{item.detail}</p>
                    </div>
                    <Badge variant={item.on ? "ok" : "neutral"} size="sm">
                      {item.on ? "Actif" : "V1"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---------------------- Activité ---------------------- */}
        <TabsContent value="activite">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Journal d&apos;activité</CardTitle>
                <p className="mt-0.5 text-[13px] text-ink-500">
                  Chaque action sensible est horodatée et non modifiable — piste d&apos;audit conservée 5 ans
                </p>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <ul className="divide-y divide-line border-t border-line">
                {activities.map((a) => (
                  <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                    <Avatar
                      initials={a.actor
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")}
                      size="sm"
                      tone="bg-ink-600"
                    />
                    <p className="min-w-0 flex-1 text-[13px] text-ink-700">
                      <span className="font-medium text-ink-900">{a.actor}</span> {a.action}{" "}
                      <span className="font-medium text-ink-900">{a.target}</span>
                    </p>
                    <Badge variant="outline" size="sm">
                      {a.kind}
                    </Badge>
                    <span className="w-28 shrink-0 text-right text-[11px] text-ink-400">{relativeTime(a.at)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
