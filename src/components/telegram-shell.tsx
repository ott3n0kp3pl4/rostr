"use client";

import {
  bindViewportCssVars,
  init,
  isTMA,
  miniAppReady,
  mountMiniAppSync,
  mountViewport,
  retrieveRawInitData,
} from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";

export type TelegramContext = {
  environment: "telegram" | "local";
  initData?: string;
};

type TelegramShellProps = {
  children: (context: TelegramContext) => React.ReactNode;
};

export function TelegramShell({ children }: TelegramShellProps): React.ReactNode {
  const [context, setContext] = useState<TelegramContext>({ environment: "local" });

  useEffect(() => {
    if (!isTMA()) {
      return;
    }

    const cleanupSdk = init();
    if (mountMiniAppSync.isAvailable()) {
      mountMiniAppSync();
    }
    if (miniAppReady.isAvailable()) {
      miniAppReady();
    }

    if (mountViewport.isAvailable()) {
      void mountViewport()
        .then(() => {
          if (bindViewportCssVars.isAvailable()) {
            bindViewportCssVars();
          }
        })
        .catch(() => undefined);
    }

    let initData: string | undefined;
    try {
      initData = retrieveRawInitData();
    } catch {
      initData = undefined;
    }

    const frameId = window.requestAnimationFrame(() =>
      setContext({ environment: "telegram", initData }),
    );
    return () => {
      window.cancelAnimationFrame(frameId);
      cleanupSdk();
    };
  }, []);

  return children(context);
}
