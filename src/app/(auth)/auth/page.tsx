'use client';

import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaFacebookF, FaTwitter, FaGoogle, FaGithub } from 'react-icons/fa';

interface AuthFormProps {
  onSignIn?: (data: { username: string; password: string }) => void;
  onSignUp?: (data: { username: string; email: string; password: string }) => void;
  loginImage?: string;
  registerImage?: string;
}

export default function AuthForm({ 
  onSignIn, 
  onSignUp,
  loginImage = '/img/log.svg',
  registerImage = '/img/register.svg'
}: AuthFormProps) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signInData, setSignInData] = useState({ username: '', password: '' });
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn?.(signInData);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp?.(signUpData);
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* Desktop/Tablet: Animated Background Circle */}
      <div
        className={`
          absolute bg-gradient-to-br from-[#4481eb] to-[#04befe] rounded-full z-10 
          transition-all duration-[1800ms] ease-in-out
          
          ${/* Hide on mobile, show on md and up */ ''}
          hidden md:block
          
          ${/* Extra Large Desktop (2xl) */ ''}
          2xl:w-[2200px] 2xl:h-[2200px]
          
          ${/* Large Desktop (xl) */ ''}
          xl:w-[2000px] xl:h-[2000px] xl:-top-[10%]
          ${isSignUpMode ? 'xl:right-[52%] xl:translate-x-full' : 'xl:right-[48%] xl:-translate-y-1/2'}
          
          ${/* Desktop (lg) */ ''}
          lg:w-[1800px] lg:h-[1800px] lg:-top-[8%]
          ${isSignUpMode ? 'lg:right-[52%] lg:translate-x-full' : 'lg:right-[48%] lg:-translate-y-1/2'}
          
          ${/* Tablet (md) */ ''}
          md:w-[1500px] md:h-[1500px] md:-top-[5%]
          ${isSignUpMode ? 'md:right-[52%] md:translate-x-full' : 'md:right-[48%] md:-translate-y-1/2'}
        `}
      />

      {/* Mobile: Curved Header Background (Sign In Mode) */}
      <div
        className={`
          md:hidden absolute top-0 left-0 w-full z-10
          bg-gradient-to-br from-[#4481eb] to-[#04befe]
          transition-all duration-[1200ms] ease-in-out
          ${isSignUpMode ? 'h-[30vh] -translate-y-full opacity-0' : 'h-[30vh] translate-y-0 opacity-100'}
        `}
        style={{
          clipPath: 'ellipse(150% 100% at 50% 0%)',
        }}
      />

      {/* Mobile: Curved Footer Background (Sign Up Mode) */}
      <div
        className={`
          md:hidden absolute bottom-0 left-0 w-full z-10
          bg-gradient-to-br from-[#4481eb] to-[#04befe]
          transition-all duration-[1200ms] ease-in-out
          ${isSignUpMode ? 'h-[30vh] translate-y-0 opacity-100' : 'h-[30vh] translate-y-full opacity-0'}
        `}
        style={{
          clipPath: 'ellipse(150% 100% at 50% 100%)',
        }}
      />

      {/* Forms Container */}
      <div className="absolute w-full h-full top-0 left-0">
        {/* Sign In / Sign Up Forms */}
        <div
          className={`
            absolute grid grid-cols-1 z-20 
            transition-all duration-1000 ease-in-out
            
            ${/* Extra Large Desktop */ ''}
            2xl:w-[45%]
            
            ${/* Large Desktop */ ''}
            xl:w-1/2 xl:top-1/2 xl:-translate-y-1/2 xl:-translate-x-1/2
            ${isSignUpMode ? 'xl:left-1/4' : 'xl:left-3/4'}
            
            ${/* Desktop */ ''}
            lg:w-[55%] lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2
            ${isSignUpMode ? 'lg:left-1/4' : 'lg:left-3/4'}
            
            ${/* Tablet */ ''}
            md:w-[65%] md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2
            ${isSignUpMode ? 'md:left-1/4' : 'md:left-3/4'}
            
            ${/* Mobile - centered vertically */ ''}
            w-full left-1/2 -translate-x-1/2 px-6
            top-1/2 -translate-y-1/2
            sm:px-8
          `}
        >
          {/* Sign In Form */}
          <form
            onSubmit={handleSignIn}
            className={`
              flex items-center justify-center flex-col 
              col-start-1 col-end-2 row-start-1 row-end-2 
              overflow-hidden
              transition-opacity duration-200 delay-700 ease-in-out
              
              ${/* Responsive padding */ ''}
              2xl:px-24 xl:px-20 lg:px-16 md:px-12 sm:px-6 px-3
              
              ${isSignUpMode ? 'z-0 opacity-0 pointer-events-none' : 'z-[2] opacity-100'}
            `}
          >
            <h2 className="2xl:text-5xl xl:text-4xl lg:text-3xl md:text-3xl sm:text-2xl text-[1.4rem] text-gray-700 mb-4 font-semibold">
              Sign in
            </h2>
            
            {/* Username Input */}
            <div className="w-full 2xl:max-w-[420px] xl:max-w-[380px] lg:max-w-[360px] md:max-w-[340px] sm:max-w-[320px] max-w-full bg-white 2xl:h-16 xl:h-14 lg:h-13 md:h-12 sm:h-12 h-12 my-2 rounded-full grid grid-cols-[15%_85%] sm:grid-cols-[15%_85%] grid-cols-[20%_80%] px-1.5 shadow-md border border-gray-100">
              <div className="flex items-center justify-center">
                <FaUser className="2xl:text-xl xl:text-lg lg:text-base md:text-base sm:text-base text-sm text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={signInData.username}
                onChange={(e) => setSignInData({ ...signInData, username: e.target.value })}
                className="border-none outline-none bg-transparent font-semibold 2xl:text-xl xl:text-lg lg:text-base md:text-base sm:text-base text-sm text-gray-800 placeholder:text-gray-400 placeholder:font-medium"
              />
            </div>

            {/* Password Input */}
            <div className="w-full 2xl:max-w-[420px] xl:max-w-[380px] lg:max-w-[360px] md:max-w-[340px] sm:max-w-[320px] max-w-full bg-white 2xl:h-16 xl:h-14 lg:h-13 md:h-12 sm:h-12 h-12 my-2 rounded-full grid grid-cols-[15%_85%] sm:grid-cols-[15%_85%] grid-cols-[20%_80%] px-1.5 shadow-md border border-gray-100">
              <div className="flex items-center justify-center">
                <FaLock className="2xl:text-xl xl:text-lg lg:text-base md:text-base sm:text-base text-sm text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                className="border-none outline-none bg-transparent font-semibold 2xl:text-xl xl:text-lg lg:text-base md:text-base sm:text-base text-sm text-gray-800 placeholder:text-gray-400 placeholder:font-medium"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="bg-[#5995fd] hover:bg-[#4d84e2] border-none outline-none rounded-full cursor-pointer text-white uppercase font-semibold transition-colors duration-300 2xl:h-14 2xl:w-40 2xl:text-base xl:h-12 xl:w-36 xl:text-base lg:h-11 lg:w-32 lg:text-sm md:h-11 md:w-32 md:text-sm sm:h-11 sm:w-32 sm:text-sm h-11 w-32 text-sm my-4"
            >
              Login
            </button>

            <p className="py-2 2xl:text-base xl:text-base lg:text-sm md:text-sm sm:text-sm text-xs text-center text-gray-600 font-mono">
              OR login with social channels
            </p>

            {/* Social Media Icons */}
            <div className="flex justify-center flex-wrap gap-3 sm:gap-2 gap-2.5 my-3">
              {[FaFacebookF, FaTwitter, FaGoogle, FaGithub].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="2xl:h-12 2xl:w-12 xl:h-11 xl:w-11 lg:h-10 lg:w-10 md:h-10 md:w-10 sm:h-10 sm:w-10 h-10 w-10 border border-gray-700 flex items-center justify-center rounded-full text-gray-700 2xl:text-lg xl:text-base lg:text-base md:text-base sm:text-sm text-sm transition-all duration-300 hover:text-[#4481eb] hover:border-[#4481eb] hover:bg-blue-50"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </form>

          {/* Sign Up Form */}
          <form
            onSubmit={handleSignUp}
            className={`
              flex items-center justify-center flex-col 
              col-start-1 col-end-2 row-start-1 row-end-2 
              overflow-hidden
              transition-opacity duration-200 delay-700 ease-in-out
              
              ${/* Responsive padding */ ''}
              2xl:px-24 xl:px-20 lg:px-16 md:px-12 sm:px-6 px-3
              
              ${isSignUpMode ? 'z-[2] opacity-100' : 'z-[1] opacity-0 pointer-events-none'}
            `}
          >
            <h2 className="2xl:text-5xl xl:text-4xl lg:text-3xl md:text-3xl sm:text-2xl text-[1.4rem] text-gray-700 mb-4 font-semibold">
              Sign up
            </h2>
            
            {/* Username Input */}
            <div className="w-full 2xl:max-w-[420px] xl:max-w-[380px] lg:max-w-[360px] md:max-w-[340px] sm:max-w-[320px] max-w-full bg-white 2xl:h-16 xl:h-14 lg:h-13 md:h-12 sm:h-12 h-12 my-2 rounded-full grid grid-cols-[15%_85%] sm:grid-cols-[15%_85%] grid-cols-[20%_80%] px-1.5 shadow-md border border-gray-100">
              <div className="flex items-center justify-center">
                <FaUser className="2xl:text-xl xl:text-lg lg:text-base md:text-base sm:text-base text-sm text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={signUpData.username}
                onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                className="border-none outline-none bg-transparent font-semibold 2xl:text-xl xl:text-lg lg:text-base md:text-base sm:text-base text-sm text-gray-800 placeholder:text-gray-400 placeholder:font-medium"
              />
            </div>

            {/* Email Input */}
            <div className="w-full 2xl:max-w-[420px] xl:max-w-[380px] lg:max-w-[360px] md:max-w-[340px] sm:max-w-[320px] max-w-full bg-white 2xl:h-16 xl:h-14 lg:h-13 md:h-12 sm:h-12 h-12 my-2 rounded-full grid grid-cols-[15%_85%] sm:grid-cols-[15%_85%] grid-cols-[20%_80%] px-1.5 shadow-md border border-gray-100">
              <div className="flex items-center justify-center">
                <FaEnvelope className="2xl:text-xl xl:text-lg lg:text-base md:text-base sm:text-base text-sm text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                className="border-none outline-none bg-transparent font-semibold 2xl:text-xl xl:text-lg lg:text-base md:text-base sm:text-base text-sm text-gray-800 placeholder:text-gray-400 placeholder:font-medium"
              />
            </div>

            {/* Password Input */}
            <div className="w-full 2xl:max-w-[420px] xl:max-w-[380px] lg:max-w-[360px] md:max-w-[340px] sm:max-w-[320px] max-w-full bg-white 2xl:h-16 xl:h-14 lg:h-13 md:h-12 sm:h-12 h-12 my-2 rounded-full grid grid-cols-[15%_85%] sm:grid-cols-[20%_80%] grid-cols-[20%_80%] px-1.5 shadow-md border border-gray-100">
              <div className="flex items-center justify-center">
                <FaLock className="2xl:text-xl xl:text-lg lg:text-base md:text-base sm:text-base text-sm text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                className="border-none outline-none bg-transparent font-semibold 2xl:text-xl xl:text-lg lg:text-base md:text-base sm:text-base text-sm text-gray-800 placeholder:text-gray-400 placeholder:font-medium"
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="bg-[#5995fd] hover:bg-[#4d84e2] border-none outline-none rounded-full cursor-pointer text-white uppercase font-semibold transition-colors duration-300 2xl:h-14 2xl:w-40 2xl:text-base xl:h-12 xl:w-36 xl:text-base lg:h-11 lg:w-32 lg:text-sm md:h-11 md:w-32 md:text-sm sm:h-11 sm:w-32 sm:text-sm h-11 w-32 text-sm my-4"
            >
              Signup
            </button>

            <p className="py-2 2xl:text-base xl:text-base lg:text-sm md:text-sm sm:text-sm text-xs text-center text-gray-600 font-mono">
              OR Signup with social channels
            </p>

            {/* Social Media Icons */}
            <div className="flex justify-center flex-wrap gap-3 sm:gap-2 gap-2.5 my-3">
              {[FaFacebookF, FaTwitter, FaGoogle, FaGithub].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="2xl:h-12 2xl:w-12 xl:h-11 xl:w-11 lg:h-10 lg:w-10 md:h-10 md:w-10 sm:h-10 sm:w-10 h-10 w-10 border border-gray-700 flex items-center justify-center rounded-full text-gray-700 2xl:text-lg xl:text-base lg:text-base md:text-base sm:text-sm text-sm transition-all duration-300 hover:text-[#4481eb] hover:border-[#4481eb] hover:bg-blue-50"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </form>
        </div>

        {/* Desktop/Tablet: Panels Container */}
        <div className="w-full h-full absolute top-0 left-0 md:grid md:grid-cols-2 hidden">
          {/* Left Panel - "New user?" / "Sign up" button panel */}
          <div
            className={`
              flex flex-col justify-around text-center z-[13] 
              transition-all duration-900 ease-in-out
              
              ${/* Desktop padding */ ''}
              2xl:px-[14%] xl:px-[12%] lg:px-[10%] md:px-[8%]
              2xl:py-16 xl:py-14 lg:py-12 md:py-10
              
              ${isSignUpMode ? 'pointer-events-none' : 'pointer-events-auto'}
            `}
          >
            <div
              className={`
                text-white transition-all duration-900 ease-in-out
                ${isSignUpMode ? '-translate-x-[800px]' : 'translate-x-0'}
              `}
            >
              <h3 className="font-semibold mb-3 2xl:text-3xl xl:text-2xl lg:text-xl md:text-xl">
                New user?
              </h3>
              <p className="py-2 leading-relaxed 2xl:text-base xl:text-[0.95rem] lg:text-sm md:text-sm mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam illum suscipit in tempora non.
              </p>
              <button
                type="button"
                onClick={() => setIsSignUpMode(true)}
                className="border-2 border-white bg-transparent hover:bg-white hover:text-[#4481eb] rounded-full cursor-pointer text-white uppercase transition-all duration-300 font-semibold 2xl:w-36 2xl:h-12 2xl:text-sm xl:w-32 xl:h-11 xl:text-sm lg:w-28 lg:h-10 lg:text-xs md:w-28 md:h-10 md:text-xs"
              >
                Sign up
              </button>
            </div>
            <img
              src={loginImage}
              alt="Login illustration"
              className={`
                w-full transition-all duration-900 ease-in-out
                2xl:max-w-md xl:max-w-sm lg:max-w-xs md:max-w-xs
                ${isSignUpMode ? '-translate-x-[800px]' : 'translate-x-0'}
              `}
            />
          </div>

          {/* Right Panel - "One of us?" / "Sign in" button panel */}
          <div
            className={`
              flex flex-col justify-around text-center z-[13] 
              transition-all duration-900 ease-in-out
              
              ${/* Desktop padding */ ''}
              2xl:px-[14%] xl:px-[12%] lg:px-[10%] md:px-[8%]
              2xl:py-16 xl:py-14 lg:py-12 md:py-10
              
              ${isSignUpMode ? 'pointer-events-auto' : 'pointer-events-none'}
            `}
          >
            <div
              className={`
                text-white transition-all duration-900 ease-in-out
                ${isSignUpMode ? 'translate-x-0' : 'translate-x-[800px]'}
              `}
            >
              <h3 className="font-semibold mb-3 2xl:text-3xl xl:text-2xl lg:text-xl md:text-xl">
                One of us?
              </h3>
              <p className="py-2 leading-relaxed 2xl:text-base xl:text-[0.95rem] lg:text-sm md:text-sm mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam illum suscipit in tempora non.
              </p>
              <button
                type="button"
                onClick={() => setIsSignUpMode(false)}
                className="border-2 border-white bg-transparent hover:bg-white hover:text-[#4481eb] rounded-full cursor-pointer text-white uppercase transition-all duration-300 font-semibold 2xl:w-36 2xl:h-12 2xl:text-sm xl:w-32 xl:h-11 xl:text-sm lg:w-28 lg:h-10 lg:text-xs md:w-28 md:h-10 md:text-xs"
              >
                Sign in
              </button>
            </div>
            <img
              src={registerImage}
              alt="Register illustration"
              className={`
                w-full transition-all duration-900 ease-in-out
                2xl:max-w-md xl:max-w-sm lg:max-w-xs md:max-w-xs
                ${isSignUpMode ? 'translate-x-0' : 'translate-x-[800px]'}
              `}
            />
          </div>
        </div>

        {/* Mobile: Panel Content Overlay */}
        <div className="md:hidden absolute w-full h-full top-0 left-0 pointer-events-none">
          {/* Sign In Mode - "New user?" panel at top */}
          <div
            className={`
              absolute top-0 left-0 w-full z-[13]
              flex flex-col items-center justify-start text-center
              px-8 pt-6 pb-4
              transition-all duration-[1200ms] ease-in-out pointer-events-auto
              ${isSignUpMode ? 'opacity-0 invisible -translate-y-20' : 'opacity-100 visible translate-y-0'}
            `}
          >
            <div className="flex items-end justify-center gap-4 mb-4 w-full max-w-sm">
              <div className="flex-1 text-left">
                <h3 className="font-semibold mb-2 text-base sm:text-lg text-white">
                  New user?
                </h3>
                <p className="text-[0.7rem] sm:text-xs leading-relaxed text-white/95 mb-3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam illum suscipit in tempora non. Neque quam inventore non molestias, quod, asperiores fuga quos maxime a dolor eaque corporis nulla ab.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSignUpMode(true)}
                  className="border-2 border-white bg-transparent hover:bg-white hover:text-[#4481eb] rounded-full cursor-pointer text-white uppercase transition-all duration-300 font-semibold px-6 h-9 text-xs"
                >
                  Sign up
                </button>
              </div>
              <img
                src={registerImage}
                alt="Register illustration"
                className="w-28 sm:w-32 flex-shrink-0"
              />
            </div>
          </div>

          {/* Sign Up Mode - "One of us?" panel at bottom */}
          <div
            className={`
              absolute bottom-0 left-0 w-full z-[13]
              flex flex-col items-center justify-end text-center
              px-8 pb-6 pt-4
              transition-all duration-[1200ms] ease-in-out pointer-events-auto
              ${isSignUpMode ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-20'}
            `}
          >
            <div className="flex items-end justify-center gap-4 mb-2 w-full max-w-sm">
              <div className="flex-1 text-left">
                <h3 className="font-semibold mb-2 text-base sm:text-lg text-white">
                  One of us?
                </h3>
                <p className="text-[0.7rem] sm:text-xs leading-relaxed text-white/95 mb-3">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam illum suscipit in tempora non. Neque quam inventore non molestias, quod, asperiores fuga quos maxime a dolor eaque corporis nulla ab.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSignUpMode(false)}
                  className="border-2 border-white bg-transparent hover:bg-white hover:text-[#4481eb] rounded-full cursor-pointer text-white uppercase transition-all duration-300 font-semibold px-6 h-9 text-xs"
                >
                  Sign in
                </button>
              </div>
              <img
                src={loginImage}
                alt="Login illustration"
                className="w-28 sm:w-32 flex-shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}