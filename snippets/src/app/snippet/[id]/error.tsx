"use client";
import ErrorPage from "../error";

const DynamicError = ({
  error,
  reset,
}: {
  error: Error & { digest: string };
  reset: () => void;
}) => {
  return <ErrorPage error={error} reset={reset} />;
};

export default DynamicError;
