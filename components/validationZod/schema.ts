import { z } from "zod";

export const createValidationSchema = (fields: any) => {
    const schemaObject: any = {};

    fields.forEach((field: any) => {
        if (field.type === "string") {
            schemaObject[field.name] = field.required
                ? z.string().min(1, `${field.name} is required`)
                : z.string().optional();
        } else if (field.type === "email") {
            schemaObject[field.name] = field.required
                ? z.string().email(`${field.name} must be a valid email`)
                : z.string().email().optional();
        } else if (field.type === "file") {
            schemaObject[field.name] =
                z.object({
                    uri: z.string()
                })

        } else if (field.type === "date") {
            schemaObject[field.name] =
                z.string()
        }
    });

    return z.object(schemaObject);
};
