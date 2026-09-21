import type { Metadata } from "next";
import { CrmView } from "./crm-view";

export const metadata: Metadata = {
  title: "CRM & prospection",
  description: "Pipeline commercial, opportunités et relations clients.",
};

export default function Page() {
  return <CrmView />;
}
