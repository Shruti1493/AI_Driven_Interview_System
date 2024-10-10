import { LoginPage, Navbar, UploadResume } from "./ImportStatements";
import "./App.css";
import { Link } from "react-router-dom";

function App() {
    return (
        <>
            <div className="bg-cyan-700 w-full h-full min-h-screen">
                <Navbar />

                {/* Hero Section */}
                <section id="hero" className="bg-cyan-800 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h1 className="text-4xl font-bold mb-4">
                            Ace Your Next Interview with AI
                        </h1>
                        <p className="text-xl mb-8">
                            Practice mock interviews, get instant feedback, and
                            improve your skills with our AI-driven platform.
                        </p>
                        <Link
                            // to="/upload-resume"
                            to="/get-started"
                            className="bg-yellow-500 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                        >
                            Get Started
                        </Link>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            How It Works
                        </h2>
                        <div className="flex flex-col md:flex-row md:space-x-8">
                            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mb-6 md:mb-0">
                                <h3 className="text-xl font-semibold mb-2">
                                    Step 1: Sign Up
                                </h3>
                                <p>
                                    Create an account and provide some details
                                    about your career goals.
                                </p>
                            </div>
                            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mb-6 md:mb-0">
                                <h3 className="text-xl font-semibold mb-2">
                                    Step 2: Practice
                                </h3>
                                <p>
                                    Select practice interviews based on your
                                    desired role and industry.
                                </p>
                            </div>
                            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-semibold mb-2">
                                    Step 3: Receive Feedback
                                </h3>
                                <p>
                                    Get detailed feedback and tips for
                                    improvement based on your performance.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                                <h3 className="text-xl font-semibold mb-2">
                                    AI-Powered Mock Interviews
                                </h3>
                                <p>
                                    Simulate real interview scenarios with
                                    AI-generated questions tailored to your
                                    desired role.
                                </p>
                            </div>
                            <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                                <h3 className="text-xl font-semibold mb-2">
                                    Detailed Performance Analytics
                                </h3>
                                <p>
                                    Receive in-depth analysis and performance
                                    metrics to track your progress.
                                </p>
                            </div>
                            <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center">
                                <h3 className="text-xl font-semibold mb-2">
                                    Personalized Feedback
                                </h3>
                                <p>
                                    Get actionable feedback and tips from
                                    experts to enhance your interview skills.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            What Our Users Say
                        </h2>
                        <div className="flex flex-col md:flex-row md:space-x-8">
                            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mb-6 md:mb-0">
                                <p className="text-lg mb-4">
                                    "This platform helped me ace my tech
                                    interview! The feedback was spot on and
                                    really helped me improve my answers."
                                </p>
                                <p className="font-semibold">- Jane Doe</p>
                            </div>
                            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mb-6 md:mb-0">
                                <p className="text-lg mb-4">
                                    "I loved the AI-generated questions. They
                                    were challenging and prepared me well for my
                                    interviews."
                                </p>
                                <p className="font-semibold">- John Smith</p>
                            </div>
                            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                                <p className="text-lg mb-4">
                                    "The detailed analytics helped me understand
                                    my strengths and weaknesses. Highly
                                    recommend!"
                                </p>
                                <p className="font-semibold">- Emily Johnson</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="bg-cyan-800 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            Pricing Plans
                        </h2>
                        <div className="flex flex-col md:flex-row md:space-x-8">
                            <div className="flex-1 bg-gray-700 p-6 rounded-lg shadow-lg mb-6 md:mb-0">
                                <h3 className="text-2xl font-semibold mb-4">
                                    Basic Plan
                                </h3>
                                <p className="text-lg mb-4">$19/month</p>
                                <ul className="list-disc list-inside mb-4">
                                    <li>Access to basic mock interviews</li>
                                    <li>Standard feedback and tips</li>
                                    <li>Email support</li>
                                </ul>
                                <a
                                    href="#"
                                    className="bg-yellow-500 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                                >
                                    Choose Plan
                                </a>
                            </div>
                            <div className="flex-1 bg-gray-700 p-6 rounded-lg shadow-lg mb-6 md:mb-0">
                                <h3 className="text-2xl font-semibold mb-4">
                                    Professional Plan
                                </h3>
                                <p className="text-lg mb-4">$49/month</p>
                                <ul className="list-disc list-inside mb-4">
                                    <li>All features of Basic Plan</li>
                                    <li>Advanced mock interviews</li>
                                    <li>Personalized coaching sessions</li>
                                </ul>
                                <a
                                    href="#"
                                    className="bg-yellow-500 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                                >
                                    Choose Plan
                                </a>
                            </div>
                            <div className="flex-1 bg-gray-700 p-6 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-semibold mb-4">
                                    Enterprise Plan
                                </h3>
                                <p className="text-lg mb-4">Contact Us</p>
                                <ul className="list-disc list-inside mb-4">
                                    <li>All features of Professional Plan</li>
                                    <li>Customizable mock interviews</li>
                                    <li>Dedicated account manager</li>
                                    <li>Priority support</li>
                                </ul>
                                <a
                                    href="#"
                                    className="bg-yellow-500 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                                >
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Blog Section */}
                <section id="blog" className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">
                            Latest Insights
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-semibold mb-4">
                                    Top 5 Interview Tips
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Read about the top tips to impress your
                                    interviewer and make a lasting impression.
                                </p>
                                <a
                                    href="#"
                                    className="text-cyan-600 hover:underline"
                                >
                                    Read More
                                </a>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-semibold mb-4">
                                    Common Mistakes to Avoid
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Learn about common pitfalls in interviews
                                    and how to avoid them for a successful
                                    interview.
                                </p>
                                <a
                                    href="#"
                                    className="text-cyan-600 hover:underline"
                                >
                                    Read More
                                </a>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-semibold mb-4">
                                    How to Prepare for Technical Interviews
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Get insights on how to effectively prepare
                                    for technical interviews with our expert
                                    advice.
                                </p>
                                <a
                                    href="#"
                                    className="text-cyan-600 hover:underline"
                                >
                                    Read More
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section id="cta" className="bg-cyan-800 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl mb-8">
                            Sign up today and take the first step towards
                            mastering your interview skills with our AI-driven
                            platform.
                        </p>
                        <a
                            href="#how-it-works"
                            className="bg-yellow-500 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                        >
                            Get Started
                        </a>
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="bg-gray-800 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p>
                            &copy; 2024 AI Interview System. All rights
                            reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default App;
