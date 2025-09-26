import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const snippets = await prisma.snippet.findMany();

  return (
    <>
      <main className="flex flex-col gap-8">
        <h1 className="font-bold text-4xl">Home</h1>
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-xl">Snippets</h1>
          <Link href="/snippet/new">
            <Button className="cursor-pointer">New</Button>
          </Link>
        </div>

        <div className="flex flex-col justify-center gap-4">
          {snippets.map((snippet) => (
            <div
              key={snippet.id}
              className="flex justify-between items-center border border-slate-300 p-4 rounded-lg"
            >
              <h1 className="font-semibold text-2xl">{snippet.title}</h1>
              <Link href={`/snippet/${snippet.id}`}>
                <Button className="cursor-pointer">View</Button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
