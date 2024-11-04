export declare const hashPassword: (password: string, saltRounds: number) => Promise<string>;
export declare const passwordChecking: (plainTextPassword: any, hashedPassword: any) => Promise<boolean>;
