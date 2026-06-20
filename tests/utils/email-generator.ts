function generateRandomEmail(): string {
  const now = Date.now();
  const lastSix = String(now).slice(-6);
  const email = `mail+${lastSix}@mail.ru`;
  return email;
}

export { generateRandomEmail };
