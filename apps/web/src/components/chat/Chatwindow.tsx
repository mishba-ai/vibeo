import { MailIcon } from "lucide-react"

export default function Chatwindow() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-200">
      <div className=" flex flex-col justify-center items-center">
        <MailIcon size={48}/>
        <h1 className="text-2xl font-medium">Start Vibing</h1>
      </div>
    </div>
  )
}
