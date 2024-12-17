import { z } from 'zod';

export const registerSchema = (t: any) => {
    return z.object({
        username: z
            .string().min(3, { message: t('validation.username3AtLeast') }),
        email: z
            .string().min(1, { message: t('validation.nonEmpty') })
            .email(t("validation.invalidEmail")),
        password: z
            .string()
            .min(5, t("validation.passwordMinLength"))
    });
}