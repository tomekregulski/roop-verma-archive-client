// Test-harness-only EmailJS replacement; never imported by a production build.
export const supportMail: {
  resolve: (value: { status: number; text: string }) => void;
  reject: (error: Error) => void;
}[] = [];

/** Keeps client initialization inert during disposable browser checks. */
export function init() {}

/** Captures a deferred provider result without sending account details anywhere. */
export function sendForm() {
  return new Promise<{ status: number; text: string }>((resolve, reject) => {
    supportMail.push({ resolve, reject });
  });
}
