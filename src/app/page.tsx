// import type {Metadata} from 'next'
import Projects from './components/projects';
import ParticlesBackground from './ParticlesBackground';
import type { NextApiRequest, NextApiResponse } from "next/types";
const Page = () => {
    return (<div className="flex flex-col gap-8 mx-4 my-16 md:mx-0">
        <ParticlesBackground/>
        <div className="flex flex-col-reverse gap-8 md:flex-row">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold">
                    Hi <span className="text-primary">There!</span> <span className="px-2 py-1 text-xs rounded-md text-white bg-primary/70 ">
				<span>smanve</span>
				</span>
                </h1>
                <div>
                <span className="font-bold">I'm Manvendra</span>
                <br></br>
                <span className="font">software engineer located in Melbourne, AU</span> 
                <br></br>
                </div>
                <hr className="border-t border-gray-300 my-2"/>
                <p className="text-left">
                I'm a recent graduate with a strong foundation in web development (HTML, CSS, JavaScript) and frameworks
                like React & Angular. I <b> love building </b> user-friendly web applications and problem solving!
            <br></br>
            <br></br>
            Outside of programming my interests include, but are not limited to music <b>and</b> gaming!
          </p> 
            </div>
        </div>
        <hr className="border-t border-gray-300 my-2"/>
        <Projects/>
        <hr className="border-t border-gray-300 my-2"/>
        <div className="flex flex-col gap-4">
            <h2 className="font-sfmono text-2xl">Contact</h2>
            <ul className="list-inside">
        <li>
        <a href="mailto:manvendrasingh1999@gmail.com" 
        className="flex items-center gap-2 font-bold underline text-primary/70 hover:text-primary/100" style={{ zIndex: 99, position: 'relative' }}>
            email
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            </a>
        </li>
        <li>
            {/* <a href="https://t.me/martintmv" 
               className="flex items-center gap-2 font-bold underline text-primary/70 hover:text-primary/100"
               style={{ zIndex: 99, position: 'relative' }}>
                t.me/martintmv
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            </a> */}
             </li>
             </ul>
             </div>
            <hr className="border-t border-gray-300 my-2"/>
            <h2 className="font-sfmono text-l">{
                '@smanve ' + new Date().getFullYear()
            }</h2>
        </div>
    );
};

export default Page;