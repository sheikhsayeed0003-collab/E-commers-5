import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-main py-20 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-muted mb-6">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
      <Button href="/">Back to Homepage</Button>
    </div>
  );
}
