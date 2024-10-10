import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutReducer } from "../../ReduxToolkit/AuthSlice";
import { Link } from "react-router-dom";
import ToogleForm from "../FormComponents/ToggleForm";
import Button from "../FormComponents/Button";
import SignUpToogleForm from "../FormComponents/SignUpToogleForm";

const Navbar = () => {
    // State to manage dropdown visibility
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [branch, setBranch] = useState("CS");
    const [showForm, setShowForm] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [SingupState,setSingupState] = useState(false)
    const [userProfileImg, setUserProfileImg] = useState(
        "https://media.istockphoto.com/id/1132207455/photo/pretty-young-blonde-woman-smiles-confidently-arms-crossed.webp?a=1&b=1&s=612x612&w=0&k=20&c=gQZBeWx1KevtG7o128DVJ3mI5JQOdUl0PVoaVEn9PJc="
    );
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector((state) => state.auth);
    const { userData } = useSelector((state) => state.profile);

    useEffect(() => {
        if (userData) {
            const JsonData = JSON.parse(userData);
            console.log("yeh hai mera json data", JsonData);
            console.log(JsonData["Branch"]);
            console.log(JsonData["FirstName"]);
            if (JsonData["FirstName"]) {
                setFirstName(JsonData["FirstName"]);
            }
            if (JsonData["LastName"]) {
                setLastName(JsonData["LastName"]);
            }
            if (JsonData["email"]) {
                setUserEmail(JsonData["email"]);
            }
            if (JsonData["profile_photo"] != null) {
                setUserProfileImg(JsonData["profile_photo"]);
            }
        }
    }, [userData]);

    // Ref for the dropdown menu
    const dropdownRef = useRef(null);

    // Function to toggle dropdown
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    // Function to close dropdown when clicking outside of it
    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setDropdownOpen(false);
        }
    };

    function SignOutFunc() {
        dispatch(logoutReducer());
    }

    // Set up event listener for clicks outside
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function showFormFunc() {
        setShowForm(true); // Show the form
    }

    function hideForm() {
        setShowForm(false); // Hide the form
    }

    function showSignUpFormFunc()
    {
        setSingupState(true);
    }
    function hideSignUpFormFunc() {
        setSingupState(false);
    }


    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900 relative">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a
                        href="https://flowbite.com/"
                        className="flex items-center space-x-3 rtl:space-x-reverse"
                    >
                        <img
                            src="https://flowbite.com/docs/images/logo.svg"
                            className="h-8"
                            alt="Flowbite Logo"
                        />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                            Ace Interview
                        </span>
                    </a>
                    {isAuthenticated && (
                        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                            <button
                                type="button"
                                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                id="user-menu-button"
                                aria-expanded={
                                    isDropdownOpen ? "true" : "false"
                                }
                                onClick={toggleDropdown} // Toggle dropdown on click
                            >
                                <span className="sr-only">Open user menu</span>
                                <img
                                    className="w-8 h-8 rounded-full"
                                    src={"http://127.0.0.1:8000/"+userProfileImg}
                                    alt="user photo"
                                />
                            </button>
                            {/* Dropdown menu */}
                            <div
                                ref={dropdownRef} // Attach ref to the dropdown menu
                                className={`absolute right-[5%] md:right-[3%] lg:right-[7%] top-full z-50 my-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ${
                                    isDropdownOpen ? "block" : "hidden"
                                }`}
                                id="user-dropdown"
                            >
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-gray-900 dark:text-white">
                                        {firstName + " " + lastName}
                                    </span>
                                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                                        {userEmail}
                                    </span>
                                </div>
                                <ul
                                    className="py-2"
                                    aria-labelledby="user-menu-button"
                                >
                                    <li>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                        >
                                            Dashboard
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                        >
                                            Settings
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                        >
                                            Earnings
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            onClick={SignOutFunc}
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                        >
                                            Sign out
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <button
                                data-collapse-toggle="navbar-user"
                                type="button"
                                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                aria-controls="navbar-user"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 17 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M1 1h15M1 7h15M1 13h15"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                    {!isAuthenticated && !showForm && (
                        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <Button
                            ButtonName="Login"
                            className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
                            onClick={showFormFunc}
                        />
                         <Button
                                
                                ButtonName="Signup"
                                className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
                                onClick={showSignUpFormFunc}
                                
                            />
                            </div>
                    )}

                    <div
                        className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                        id="navbar-user"
                    >
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <a
                                    href="#"
                                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                                    aria-current="page"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                    Services
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {showForm && !isAuthenticated && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 flex items-center justify-center">
                    <ToogleForm />
                    <button
                        onClick={hideForm}
                        className="absolute top-4 right-4 text-white bg-red-600 p-2   
                                    border border-gray-300 focus:outline-none
                                    hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 
                                    font-medium rounded-lg text-sm px-5 py-2.5 me-2  
                                dark:hover:bg-gray-700
                                dark:hover:border-gray-600
                                dark:focus:ring-gray-700"
                        >
                        CloseForm
                    </button>
                </div>
            )}

            {SingupState && !isAuthenticated && (
                            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 flex items-center justify-center">
                                <SignUpToogleForm />
                                <button
                                    onClick={hideSignUpFormFunc}
                                    className="absolute top-4 right-4 text-white bg-red-600 p-2   
                                                border border-gray-300 focus:outline-none
                                                hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 
                                                font-medium rounded-lg text-sm px-5 py-2.5 me-2  
                                            dark:hover:bg-gray-700
                                            dark:hover:border-gray-600
                                            dark:focus:ring-gray-700"
                                    >
                                    CloseForm
                                </button>
                            </div>
                        )}


        </div>
    );
};

export default Navbar;
