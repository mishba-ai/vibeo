import Header from "./components/common/Header"
import sgroup1 from "@/assets/sgroup1.png"
import { useState } from "react";
import sm from './assets/sm.png'
import fc from './assets/fc.png'
import { ArrowUpRightIcon } from "lucide-react";


function App() {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(sgroup1);
  const socials = [
    { name: "Instagram" },
    { name: "Twitter" },
    { name: "Github" },
  ]
  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-[#fdf7e9] leading-none">

      <div className="relative w-full h-screen overflow-hidden">
        <Header />
        <div className="flex flex-col items-center pt-10">
          <h1 className="text-6xl font-Anton font-semibold">Find Your Tribe,</h1>
          <h1 className="text-6xl font-Anton font-semibold">Build Your Network</h1>
        </div>
        <div
          className="w-full h-[410px] bg-cover bg-center bottom-0 absolute"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
      </div>
      {/* section 2 */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* VIOLET LAYER (Background) */}
        <div className="absolute inset-0 bg-[#fae588] flex items-center justify-end px-10 md:px-20">
          <div className="w-76  text-start  font-Anton text-7xl md:text-9xl text-white ">
            <p>You</p>
            <div className="flex  items- gap-x-6 ">
              <p>ARE</p>
              <div className="font-SpaceGrotesk  text-black font-medium text-4xl md:text-4xl ">
                part of the big world
              </div>
            </div>
          </div>
        </div>

        {/* YELLOW LAYER (Top) */}
        <div
          className="absolute inset-0 z-10 bg-[#fdf7e9] flex items-center px-10 [clip-path:polygon(0%_0%,_40%_0%,_55%_100%,_0%_100%)]"
        >
          <img src={sm} alt="" className="max-w-[35%] h-auto object-contain" />
        </div>

      </section>

      {/*  */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* VIOLET LAYER (Background) */}
        <div className="absolute inset-0 bg-[#fdf7e9] flex items-center justify-end px-10 md:px-20">

          <img src={fc} alt="" className="min-w-[35%]  h-auto object-contain z-20 " />
        </div>

        {/* YELLOW LAYER (Top) */}
        <div
          className="absolute inset-0 z-10 bg-[#CCCCFF] flex  items-center px-10 [clip-path:polygon(50%_0%,_0%_0%,0%_100%,_40%_100%)]"
        >
          <div className="w-72 ">
            <p className="font-SpaceGrotesk text-4xl  font-medium text-white">A simple way to keep up with friends and share your daily <span className="font-Anton text-[#9667e0]">"vibe"</span>.</p>
          </div>
        </div>

      </section>
      <footer className="w-full h-screen font-SpaceGrotesk font-thin relative px-24 py-8 overflow-hidden flex flex-col justify- items-">
        <div className="flex justify-between w-full">
          <div className="text-xl  ">@Vibeo</div>
          <div className="flex justify-between w-64">
            <div className="text-sm">
              <div className="cursor-pointer">Home</div>
              <div className="cursor-pointer">Explore</div>
              <div className="cursor-pointer">Stories</div>
              <div className="cursor-pointer">Privacy</div>
            </div>
            <div>Let's Vibe!</div></div>
        </div>
        <div className="flex justify-between pt-24">
          <div className="">
            <p className="text-5xl font-thin">Blogs</p>
            <div className="flex w-96 justify-between mt-6">
              <input type="text" className="outline-none border-none w-full " placeholder="email address" />
              <ArrowUpRightIcon />
            </div>
            <hr className="border-b border-black " />
          </div>
          <div className="font-SpaceGrotesk flex justify-between w-96">
            <p className="w-34 text-2xl">21 Rue esr Bares 5435 fetse India</p>
            <ul className="flex flex-col text-2xl">
              {
                socials.map((social, Index) => (
                  <li key={Index} className="flex">
                    <li><p><ArrowUpRightIcon /></p> </li>

                    <p>{social.name}</p>

                  </li>

                ))
              }
            </ul>
          </div>
        </div>
        <p className="text-[9.5em] font-thin font-Lexend absolute bottom-0">Drop a vibe</p>
      </footer>
    </div>
  );
}
export default App
