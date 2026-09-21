import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { quoteById, quotes } from "@/data";
import { QuoteDetail } from "./quote-detail";

export function generateStaticParams() {
  return quotes.map((q) => ({ id: q.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const quote = quoteById(id);
  return { title: quote ? `${quote.number} — ${quote.projectName}` : "Devis introuvable" };
}

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = quoteById(id);
  if (!quote) notFound();
  return <QuoteDetail quote={quote} />;
}
