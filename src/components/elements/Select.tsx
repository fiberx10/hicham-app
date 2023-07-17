import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import { useForm, SubmitHandler } from "react-hook-form"
import { useState, ChangeEvent, ChangeEventHandler } from "react";
import Select from 'react-select'




type BookingStatusType = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"

interface OptionsType {
    value: string;
    label: string;
}

const options: OptionsType[] = [{
    label: "Pending",
    value: "PENDING"
},
{
    label: "Confirmed",
    value: "CONFIRMED"
},
{
    label: "Cancelled",
    value: "CANCELLED"
},
{
    label: "Completed",
    value: "COMPLETED"
}];


const SelectStatus = ({
    bookingStatus,
    id
}: {
    bookingStatus: BookingStatusType,
    id: string,
}) => {
    const [selectedValue, setSelectedValue] = useState<BookingStatusType>(bookingStatus);

    const updateBookingMutation = api.booking.updateBookingStatus.useMutation({
        onSuccess: () => {
            alert("Booking status updated successfully")
        },
        onError: (error) => {
            alert(error.message)
        }
    });

    const onChange = (option: OptionsType | null, id: string) => {
        console.log("selected : " + JSON.stringify(option))
        // update booking states
        updateBookingMutation.mutate({
            bookingId: id,
            status: option?.value as string
        })
        setSelectedValue(option?.value as BookingStatusType)
    }


    return (
        <div className="w-80">
            <Select defaultValue={options.find(option => option.value === bookingStatus)}
                className="w-64"
                onChange={(e: OptionsType | null) => onChange(e, id)}
                options={options} />
        </div>

    );
}

export default SelectStatus;