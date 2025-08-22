import { MoveRight } from 'lucide-react';
import Navbar from '../components/Navbar';
function Welcome() {

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            <Navbar />
            {/* Centered Content */}
            <div className="text-center text-white px-8 max-w-4xl z-10">
                <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold mb-6'>
                    Welcome to <span className='text-[#17DFFF]'>MIND QUIZ</span>
                </h1>
                <p className='text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto'>
                    Create engaging quizzes with custom rooms and real-time analytics. Perfect for educators, trainers, and team leaders.
                </p>
                <a
                    href="/register"
                    className='inline-flex bg-[#17DFFF] hover:bg-[#1D24CA] duration-300 px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform'
                >
                    Get Started <span className='ml-2'><MoveRight /></span>
                </a>
            </div>
        </div>
    );
};

export default Welcome;