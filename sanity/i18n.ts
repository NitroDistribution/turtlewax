export const supportedLanguages = [
  { id: "az", title: "Azərbaycan dili", isDefault: true },
  { id: "ru", title: "Русский" },
];

export const defaultLanguage = supportedLanguages.find((lang) => lang.isDefault)!.id;
