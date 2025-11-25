export const generateUniqueEmail = (): string => {
  const timestamp = Date.now();

  const randomString = Math.random().toString(36).substring(2, 8);

  return `testuser+${timestamp}${randomString}@gmail.com`;
};

export const generateUkrainianFullName = (): string => {
  const ukrainianNames: string[] = [
    "Олег",
    "Іван",
    "Петро",
    "Андрій",
    "Михайло",
    "Василь",
    "Сергій",
    "Юрій",

    "Тарас",
    "Богдан",
    "Роман",
    "Дмитро",
    "Максим",
    "Олексій",
    "Володимир",
  ];

  const ukrainianSurnames: string[] = [
    "Ляшко",
    "Шевченко",
    "Франко",
    "Коваленко",
    "Бондаренко",
    "Ткаченко",

    "Кравченко",
    "Олійник",
    "Шевчук",
    "Поліщук",
    "Савченко",
    "Петренко",

    "Кличко",
    "Порошенко",
    "Зеленський",
  ];

  const randomName =
    ukrainianNames[Math.floor(Math.random() * ukrainianNames.length)];

  const randomSurname =
    ukrainianSurnames[Math.floor(Math.random() * ukrainianSurnames.length)];

  return `${randomName} ${randomSurname}`;
};

// export const generateUkrainianPhone = (): string => {
//   const prefixes = [
//     "50",
//     "63",
//     "67",
//     "68",
//     "73",
//     "93",
//     "95",
//     "96",
//     "97",
//     "98",
//     "99",
//   ];

//   const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

//   const number = Math.floor(1000000 + Math.random() * 9000000);

//   return `+380${prefix}${number}`;
// };

export const generatePassword = (length: number = 12): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};
