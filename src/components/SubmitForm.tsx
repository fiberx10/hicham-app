import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import { useForm, SubmitHandler } from "react-hook-form"
import { useState, ChangeEvent } from "react";



type Inputs = {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  insuranceCompany: string,
  clainNumber: string,
}




const SubmitForm = () => {


  const [cardIdImage, setCardIdImage] = useState<string>();
  const [immaCertificateImage, setImmaCertificateImage] = useState<string>();
  const [greenCardImage, setGreenCardImage] = useState<string>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const bookingMutation = api.booking.createBooking.useMutation({
    onSuccess: () => {
      console.log("booking created")
      setIsSubmitted(true);
    }
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("data : " + JSON.stringify(data));
    // check the states 
    if (!cardIdImage && !immaCertificateImage && !greenCardImage) {
      alert("please upload the images")
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const booking = bookingMutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      insuranceCompany: data.insuranceCompany,
      clainNumber: data.clainNumber,
      cardIdImage: {
        fileId: cardIdImage as string,
      },
      immaCertificate: {
        fileId: immaCertificateImage as string,
      },
      greenCard: {
        fileId: greenCardImage as string,
      }
    })
    if (booking) {
      setIsSubmitted(true);
    }
  }

  const handleCardIdImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    const res = await fetch('/api/file/upload', {
      method: 'POST',
      body: formData
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await res.json()
    console.log("file uploaded id  : " + data)
    setCardIdImage(data.fileId)
  }

  const handleImmaCertificateImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    const res = await fetch('/api/file/upload', {
      method: 'POST',
      body: formData
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await res.json()
    console.log("file uploaded id : " + data)
    setImmaCertificateImage(data.fileId)
  }

  const handleGreenCardImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    const res = await fetch('/api/file/upload', {
      method: 'POST',
      body: formData
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await res.json()
    console.log("file uploaded id : " + data)
    setGreenCardImage(data.fileId);
  }



  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return (
    <>
      {
        isSubmitted ? (
          <div className="flex flex-col items-center justify-center" >
            <h1 className="text-3xl font-semibold text-gray-900">Thank you for submitting your
              information!</h1>
            <p className="mt-4 text-sm text-gray-600">We will review your information and
              contact you within 24 hours.</p>
          </div >
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 divide-y divide-gray-200">
            <div id="" className="space-y-12">

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Submit Your Info </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">First name</label>
                    <div className="mt-2">
                      <input type="text" {...register("firstName")} id="first-name" autoComplete="given-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">Last name</label>
                    <div className="mt-2">
                      <input type="text"  {...register("lastName")} id="last-name" autoComplete="family-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                    <div className="mt-2">
                      <input id="email" {...register("email")} name="email" type="email" autoComplete="email" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                  </div>


                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Phone Number</label>
                    <div className="mt-2">
                      <input id="phone"  {...register("phone")} name="phone" type="tel" autoComplete="phone" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                  </div>




                  <div className="col-span-full">
                    <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">Compagnie d assurance</label>
                    <div className="mt-2">
                      <input type="text"  {...register("insuranceCompany")} id="street-address" autoComplete="street-address" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                  </div>



                  <div className="col-span-full">
                    <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">Numéro de sénistre</label>
                    <div className="mt-2">
                      <input type="text"   {...register("clainNumber")} id="street-address" autoComplete="street-address" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">Carte Nationale</label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                        </svg>
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label htmlFor="card-id-file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                            <span>Upload a file</span>
                            <input id="card-id-file-upload" onChange={handleCardIdImage} type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>


                  <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">Certificat d immatriculation</label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                        </svg>
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label htmlFor="imma-cert-file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                            <span>Upload a file</span>
                            <input id="imma-cert-file-upload" onChange={handleImmaCertificateImage} type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>



                  <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">Carte Verte</label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" />
                        </svg>
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label htmlFor="green-card-file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                            <span>Upload a file</span>
                            <input id="green-card-file-upload" onChange={handleGreenCardImage} type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              {/* <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button> */}
              <input type="submit" value="Save" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" />
            </div>
          </form>)

      }
    </>
  );


}

export default SubmitForm;