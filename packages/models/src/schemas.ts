import * as z from "zod";

function opaque<T extends string, V>(schema: z.ZodType<V>) {
  return schema as z.ZodType<V & { __type: T }, any, V & { __type: T }>;
}

export const IdSchema = opaque<"Id", string>(z.string().uuid());
export const EmailSchema = opaque<"Email", string>(z.string().email());
export const PasswordSchema = opaque<"Password", string>(
  z.string().min(8).max(255)
);
export const NameSchema = z.string().max(255);

export const UserSchema = z.object({
  id: IdSchema,
  email: EmailSchema,
  name: NameSchema,
});

export const CampaignSchema = z.object({
  id: IdSchema,
  name: NameSchema,
  user_id: IdSchema,
  user: UserSchema.optional(),
});
