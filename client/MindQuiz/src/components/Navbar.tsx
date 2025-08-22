import { GraduationCap } from "lucide-react";
function Navbar() {
    return (
        <div className="fixed top-0 left-0 w-full z-50">
            <nav className="flex justify-between items-center">
                <div className="w-screen px-16 py-2">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="text-4xl font-bold text-white flex justify-center items-center gap-2"><span><GraduationCap size={32} /></span>MindQuiz</div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex space-x-4 items-center justify-center h-full text-white text-2xl">
                                <a href="/home" className=" hover:bg-white px-3 py-2 rounded-md hover:text-blue-800 font-medium duration-300">Home</a>
                                <a href="/about" className=" hover:bg-white px-3 py-2 rounded-md hover:text-blue-800 font-medium duration-300">About</a>
                                <a href="/contact" className=" hover:bg-white px-3 py-2 rounded-md hover:text-blue-800 font-medium duration-300">Contact</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
