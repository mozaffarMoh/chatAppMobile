import { z } from 'zod';

export const updateProfileSchema = (formData: any, t: any) => {
    // Base schema
    let schema = z.object({
        username: z
            .string()
            .min(3, { message: t('validation.username3AtLeast') }),
    });

    // Conditionally add oldPassword and newPassword fields
    if (formData?.oldPassword || formData?.newPassword) {
        schema = schema.extend({
            oldPassword: z
                .string()
                .min(5, { message: t("validation.passwordMinLength") }),
            newPassword: z
                .string()
                .min(5, { message: t("validation.passwordMinLength") }),
        });
    }

    return schema;
};
