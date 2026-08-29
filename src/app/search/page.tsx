import { Suspense } from "react";
import { SearchContent } from "./SearchContent";

export const metadata = { title: "Search Results" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-main py-8 text-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
