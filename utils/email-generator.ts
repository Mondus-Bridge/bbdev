function generateRandomEmail(callback: (email: string) => void): void {
  const now = Date.now();
  const lastSix = String(now).slice(-6);
  const email = `mail+${lastSix}@mail.ru`;
  callback(email);
}

export { generateRandomEmail };
