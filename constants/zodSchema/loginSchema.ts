import { z } from 'zod';

export const loginSchema = (t: any) => {
    return z.object({
        email: z
            .string().min(1, { message: t('validation.nonEmpty') })
            .email(t("validation.invalidEmail")),
        password: z
            .string()
            .min(5, t("validation.passwordMinLength"))
    });
}


