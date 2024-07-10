/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const retrieveField = (data: any, title: string): string => {
//   return data.payload.fields.reduce((acc: string, field: Field) => {
//     if (field.title === title) return field.answer.value;
//     return acc;
//   }, "");
// };
