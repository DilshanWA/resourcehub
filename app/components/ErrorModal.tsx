
"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";

type Props = {
  error?: string | null;
  onClose?: () => void;
};

type ErrorDetails = {
  title: string;
  message: string;
  action: string;
};

const errorDetails: Record<string, ErrorDetails> = {
  unauthorized: {
    title: "Admin access required",
    message: "You do not have permission to manage this resource. If you need access, please contact an administrator.",
    action: "Close this message and continue browsing resources.",
  },
  "invalid-resource": {
    title: "Resource link is invalid",
    message: "The resource information we received is not valid. Please return to the resource list and try again.",
    action: "Your existing search and filters will be kept.",
  },
  "not-found": {
    title: "Resource no longer available",
    message: "This resource may have already been deleted or made inactive. The resource list has the latest available information.",
    action: "Close this message to view the current resource list.",
  },
};

const fallbackDetails: ErrorDetails = {
  title: "Something went wrong",
  message: "We could not complete that action. Please try again, and contact support if the problem continues.",
  action: "Close this message to continue.",
};

export default function ErrorModal({ error, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const details = error ? errorDetails[error] ?? fallbackDetails : null;

  const dismiss = useCallback(() => {
    if (onClose) {
      onClose();
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("error");
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [onClose, pathname, router, searchParams]);

  useEffect(() => {
    if (!details) {
      return;
    }

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        dismiss();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [details, dismiss]);

  if (!details) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          dismiss();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <h2 id="error-modal-title" className="text-lg font-semibold text-slate-950">
                {details.title}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={dismiss}
                aria-label="Close error message"
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p id="error-modal-description" className="mt-2 text-sm leading-6 text-slate-600">
              {details.message}
            </p>
            <p className="mt-3 text-xs font-medium text-slate-500">{details.action}</p>
            <button
              type="button"
              onClick={dismiss}
              className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Continue
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
