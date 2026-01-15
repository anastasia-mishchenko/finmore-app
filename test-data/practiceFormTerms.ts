import { ad } from "@faker-js/faker/dist/airline-DF6RqYmq";

export type SubjectsNames = 'Maths' | 'Accounting' | 'Arts' | 'Social Studies' | 'English' | 'Chemistry' | 'Physics' | 'Biology' | 'Computer Science' | 'Economics';

export const practiceFormTerms = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    
    invalidEmail: "invalid-email",
    mobileNumber: "1234567890",
    invalidMobileNumber: "12345",

    dateOfBirth: {
        day: "15",
        month: "May",
        year: "1990"
    },

    address: "123 Main St, Springfield, USA",
};  