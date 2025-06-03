import { ExportAssets } from "../assets/ExportAssets";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Header() {
  const { user } = useContext(AppContext) || {};
  const navigate = useNavigate();

  // Get user name if available and logged in, else fallback
  const userName =
    user && (user as any)?.data?.name
      ? (user as any).data.name
      : "Developer";

  return (
    <header className="flex flex-col items-center justify-center text-center">
      <img
        src={ExportAssets.header_img}
        alt="header img"
        className="w-[24vh] rounded-full"
      />
      <h1 className="flex flex-row justify-center gap-4 text-2xl sm:text-4xl mb-4">
        Hey {userName}!
        <img
          src={ExportAssets.hand_wave}
          alt="hand-wave"
          className="w-8 aspect-square"
        />
      </h1>
      <h2 className="sm:text-5xl font-semibold mb-4 text-3xl">
        Welcome to Our App
      </h2>
      <p className="mb-8 max-w-md text-lg">
        Lets start with a quick product tour and we will have you up and running in no time
      </p>

      {userName === "Developer" && (
        <button
          onClick={() => navigate("/login")}
          className="border transition-all border-gray-500 rounded-full py-2.5 w-3xs sm:w-2xs cursor-pointer hover:bg-gray-500"
        >
          Get Started
        </button>
      )}
    </header>
  );
}

export default Header;