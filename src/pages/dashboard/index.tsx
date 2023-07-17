import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api, RouterOutputs } from "@/utils/api";
import Header from "@/components/Header";
import SelectStatus from "@/components/elements/select";
import type { GetBookingResponseType } from "@/utils/types/app";


const MyApp: AppType = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = api.booking.getBookings.useQuery();
    console.log("bookings", JSON.stringify(data));

    return (
        <div className="box-border p-5">
            <Header />
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                First Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Last Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Phone
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Insurance Company
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Claim Number
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Card ID Image
                            </th>
                            <th scope="col" className="px-6 py-3">
                                IMMA Certificate
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Green Card
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                            data && data.map((booking: any, i: number) => {
                                return (
                                    <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            {booking.firstName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            {booking.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            {booking.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            {booking.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            {booking.insuranceCompany}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            {booking.claimNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            <a href={"/" + booking.cardIdImage.bucket + "/" + booking.cardIdImage.key} target="_blank" className="text-blue-500" > watch me </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            <a href={"/" + booking.immaCertificateImage.bucket + "/" + booking.immaCertificateImage.key} className="text-blue-500" target="_blank"> watch me </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            <a href={"/" + booking.greenCardImage.bucket + "/" + booking.greenCardImage.key
                                            } className="text-blue-500" target="_blank"> watch me </a>
                                        </td>
                                        <td className="py-4  whitespace-nowrap dark:text-white">
                                            <SelectStatus bookingStatus={booking.status} id={booking.id} />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>


    );
};

export default api.withTRPC(MyApp);
