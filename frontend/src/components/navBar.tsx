import { useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const loginNav = () => {
    if (token) navigate("/");
    else {
      navigate("/login");
    }
  };

  const registerNav = () => {
    if (token) navigate("/");
    else {
      navigate("/register");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const resetPasswordNav = () => {
    if (token) navigate("/reset-password");
    else {
      navigate("/login");
    }
  };

  const pStyles =
    "px-4 py-1 text-black font-bold hover:cursor-pointer hover:underline hover:scale-110 transition-all duration-300 ease-in-out";

  return (
    <div className="bg-[#f3f4f6] flex justify-center items-center p-4 fixed top-0 w-full z-10">
      <div className="flex space-x-4 border-b-2 border-b-blue-400 w-96 items-center justify-evenly text-lg">
        <p className={pStyles} onClick={() => navigate("/")}>
          Home
        </p>
        {token ? (
          <>
            <p className={pStyles} onClick={resetPasswordNav}>
              Reset Password
            </p>
            <p className={pStyles} onClick={logout}>
              Logout
            </p>
          </>
        ) : (
          <>
            <p className={pStyles} onClick={loginNav}>
              Login
            </p>
            <p className={pStyles} onClick={registerNav}>
              Register
            </p>
          </>
        )}
      </div>
    </div>
  );
}
