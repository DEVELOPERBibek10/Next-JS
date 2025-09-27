"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-[12rem] md:text-[16rem] font-light leading-none text-foreground/10 select-none">
            404
          </h1>
        </div>

        <div className="space-y-6 -mt-20 md:-mt-32">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-light text-foreground text-balance">
              Page not found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto text-pretty leading-relaxed">
              The page you are looking for does not exist or has been moved to a
              different location.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="min-w-32">
              <Link href="/">Go home</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-w-32 bg-transparent"
              onClick={() => window.history.back()}
            >
              Go back
            </Button>
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="w-24 h-px bg-border">
            <AlertTriangle className="size-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
