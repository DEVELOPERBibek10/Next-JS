"use client";
import ErrorPage from "../error";

export default function SnippetErrorPage({
  error,
  reset,
}: {
  error: Error & { digest: string };
  reset: () => void;
}) {
  return <ErrorPage error={error} reset={reset} />;
}
