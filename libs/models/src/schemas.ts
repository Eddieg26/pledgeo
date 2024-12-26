import * as z from "zod";

export const IdSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const PasswordSchema = z.string().min(8).max(255);
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
