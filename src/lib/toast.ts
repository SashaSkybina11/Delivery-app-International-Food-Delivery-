const baseOptions = {
  position: "topRight" as const,
  timeout: 3200,
  maxWidth: 420,
};

export function showErrorToast(message: string, title = "Validation error") {
  if (typeof window === "undefined") {
    return;
  }

  import("izitoast").then(({ default: iziToast }) => {
    iziToast.error({
      ...baseOptions,
      title,
      message,
      backgroundColor: "#111111",
      titleColor: "#ffd400",
      messageColor: "#ffffff",
      progressBarColor: "#ffd400",
    });
  });
}

export function showSuccessToast(message: string, title = "Success") {
  if (typeof window === "undefined") {
    return;
  }

  import("izitoast").then(({ default: iziToast }) => {
    iziToast.success({
      ...baseOptions,
      title,
      message,
      backgroundColor: "#ffffff",
      titleColor: "#111111",
      messageColor: "#111111",
      progressBarColor: "#ffd400",
    });
  });
}
