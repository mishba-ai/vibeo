import Header from "./components/common/Header"
import sgroup1 from "@/assets/sgroup1.png"
import { useState } from "react";
function App() {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(sgroup1);

  return (
    <>
      <Header />
      <div className="text-6xl font-sans flex flex-col items-center">
        <h1 className="text-6xl font-semibold">Find Your Tribe,</h1>
        <h1 className="text-6xl font-semibold">Build Your Network</h1>
      </div>
      <div
        className="w-full h-[410px] bg-cover bg-center absolute bottom-0 transition-transform scale-"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
      </div>      </>
  )
}

export default App
