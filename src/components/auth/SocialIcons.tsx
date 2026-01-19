import { FaFacebookF, FaTwitter, FaGoogle, FaGithub } from "react-icons/fa";

export default function SocialIcons() {
  const icons = [FaFacebookF, FaTwitter, FaGoogle, FaGithub];

  return (
    <div className="flex justify-center flex-wrap gap-3 sm:gap-2 gap-2.5 my-2">
      {icons.map((Icon, idx) => (
        <a
          key={idx}
          href="#"
          onClick={(e) => e.preventDefault()} // no action
          className="2xl:h-12 2xl:w-12 xl:h-11 xl:w-11 lg:h-10 lg:w-10 md:h-10 md:w-10 sm:h-10 sm:w-10 h-9 w-9 border border-gray-700 flex items-center justify-center rounded-full text-gray-700 2xl:text-lg xl:text-base lg:text-base md:text-base sm:text-sm text-sm transition-all duration-300 hover:text-[#4481eb] hover:border-[#4481eb] hover:bg-blue-50"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
