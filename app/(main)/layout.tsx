import AdminShell from "../../components/admin-shell";
import { CatalogProvider } from "../../state context/catalog-context";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <CatalogProvider>
      <AdminShell>{children}</AdminShell>
    </CatalogProvider>
  );
}
