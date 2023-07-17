import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import bookingSchema from "@/utils/zodSchemas/bookingSchema";
import { PrismaClient, BookingStatus } from "@prisma/client";
import { storage } from "@/service/storage";

const prisma = new PrismaClient();

export const bookingRouter = createTRPCRouter({
  createBooking: publicProcedure
    .input(bookingSchema)
    .mutation(async ({ input }) => {
      const filesData = [
        {
          fileId: input.cardIdImage.fileId,
          bucket: process.env.CARD_ID_IMAGE_BUCKET,
        },
        {
          fileId: input.greenCard.fileId,
          bucket: process.env.GREEN_CARD_IMAGE_BUCKET,
        },
        {
          fileId: input.immaCertificate.fileId,
          bucket: process.env.IMMA_CERTIFICATE_IMAGE_BUCKET,
        },
      ];
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      const createdFilesPromises = filesData.map(async (file) => {
        const tempFile = await prisma.tempFile.findUnique({
          where: {
            id: file.fileId,
          },
        });

        if (tempFile) {
          await storage.createFromTemp(
            tempFile.bucket,
            tempFile.key,
            file.bucket as string,
            tempFile.key
          );
          const createdFile = await prisma.file.create({
            data: {
              key: tempFile.key,
              bucket: file.bucket as string,
              mimeType: tempFile.mimeType,
              size: tempFile.size,
            },
          });
          return {
            fileId: createdFile.id,
          };
        }
        return null;
      });

      const createdFiles = await Promise.all(createdFilesPromises);

      const booking = prisma.booking.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          status: "PENDING",
          insuranceCompany: input.insuranceCompany,
          clainNumber: input.clainNumber,
          cardIdImage: {
            connect: {
              id: createdFiles[0]?.fileId,
            },
          },
          greenCardImage: {
            connect: {
              id: createdFiles[1]?.fileId,
            },
          },
          immaCertificateImage: {
            connect: {
              id: createdFiles[2]?.fileId,
            },
          },
        },
      });
      return booking;
    }),
  getBookings: publicProcedure.query(async () => {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        cardIdImage: {
          select: {
            key: true,
            bucket: true,
          },
        },
        greenCardImage: {
          select: {
            key: true,
            bucket: true,
          },
        },
        immaCertificateImage: {
          select: {
            key: true,
            bucket: true,
          },
        },
      },
    });
    return bookings;
  }),
  updateBookingStatus: publicProcedure
    .input(
      z.object({
        bookingId: z.string(),
        status: z.string().refine((status: any) => {
          return Object.values(BookingStatus).includes(status as BookingStatus);
        }),
      })
    )
    .mutation(async ({ input }) => {
      const booking = await prisma.booking.update({
        where: {
          id: input.bookingId,
        },
        data: {
          status: input.status as BookingStatus,
        },
      });
      return booking;
    }),
  deleteBooking: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ input }) => {
      const booking = await prisma.booking.delete({
        where: {
          id: input.bookingId,
        },
      });
      return booking;
    }),
});
