import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="w-full mt-20 mb-6 px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-300">
          {/* Left side - creators */}
          <div className="flex space-x-4 mb-2 sm:mb-0">
            <span>Made by Anubhav Rai</span>
            <span>•</span>
            <span>Aryan Adoni</span>
            <span>•</span>
            <span>Nirandev CM</span>
          </div>

          {/* Right side - copyright */}
          <div>
            © {new Date().getFullYear()} PESU Sports — All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
