"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>): React.ReactNode {
  useEffect(() => {
    console.error("Unhandled route error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold">Не удалось открыть экран</h1>
      <p className="text-[var(--muted)]">
        Попробуйте ещё раз. Ошибка зарегистрирована без личных данных.
      </p>
      <button
        className="w-fit rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-white"
        onClick={() => reset()}
        type="button"
      >
        Повторить
      </button>
    </main>
  );
}
