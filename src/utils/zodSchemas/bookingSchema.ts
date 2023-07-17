import zod from "zod";
import { BookingStatus } from "@prisma/client";

const bookingSchema = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  email: zod.string().email(),
  phone: zod.string(),
  insuranceCompany: zod.string(),
  clainNumber: zod.string(),
  cardIdImage: zod.object({
    fileId: zod.string(),
  }),
  greenCard: zod.object({
    fileId: zod.string(),
  }),
  immaCertificate: zod.object({
    fileId: zod.string(),
  }),
});
export default bookingSchema;
