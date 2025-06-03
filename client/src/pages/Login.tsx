import { ExportAssets } from '../assets/ExportAssets';
import { useNavigate, Link } from 'react-router-dom';
import { useRerenderStore } from '../stores/rerenderStore';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Login() {
  const navigate = useNavigate();
  const isSignup = useRerenderStore((state) => state.isSignup);
  const setIsSignup = useRerenderStore((state) => state.setIsSignup);
  const name = useRerenderStore((state) => state.name);
  const setName = useRerenderStore((state) => state.setName);
  const email = useRerenderStore((state) => state.email);
  const setEmail = useRerenderStore((state) => state.setEmail);
  const password = useRerenderStore((state) => state.password);
  const setPassword = useRerenderStore((state) => state.setPassword);
  const register = useRerenderStore((state) => state.register);
  const login = useRerenderStore((state) => state.login);

  //@ts-ignore
  const { getUser, setUser } = useContext(AppContext);

  const isSignUpMode = isSignup === "Sign Up";

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isSignUpMode) {
        const data = await register({ name, email, password });
        if (data.status === "success") {
          toast.success("Account created successfully!");
          setName("");
          setEmail("");
          setPassword("");
        }
      } else {
        const data = await login({ email, password });
        if (data.status === "success") {
          await getUser();
          toast.success("Login successful!");
          setEmail("");
          setPassword("");
          navigate("/");
        }
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || (isSignUpMode ? "Registration failed. Please try again." : "Login failed. Please try again.");
      toast.error(msg);
      console.error(isSignUpMode ? "Registration error:" : "Login error:", error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 px-6 sm:px-0 relative'>
      <img
        src={ExportAssets.logo}
        onClick={() => navigate("/")}
        alt="logo"
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />
      <form onSubmit={formSubmitHandler} className='bg-slate-800 rounded-md p-10 text-white'>
        <p className='text-3xl mb-2 font-semibold text-center'>
          {isSignUpMode ? "Create Account" : "Login In Here"}
        </p>
        <p className='text-gray-300 mb-4 text-center'>
          {isSignUpMode ? "Create Your Account" : "Login In"}
        </p>

        {isSignUpMode && (
          <div className='bg-slate-500 my-4 flex p-3 rounded-full gap-4'>
            <img src={ExportAssets.person_icon} alt="" className='w-4' />
            <input
              type="text"
              className='bg-transparent text-white outline-none w-full'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className='bg-slate-500 my-4 flex p-3 rounded-full gap-4'>
          <img src={ExportAssets.mail_icon} alt="" className='w-4' />
          <input
            type="email"
            className='bg-transparent text-white outline-none w-full'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='bg-slate-500 my-4 flex p-3 rounded-full gap-4'>
          <img src={ExportAssets.lock_icon} alt="" className='w-4' />
          <input
            type="password"
            className='bg-transparent text-white outline-none w-full'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {!isSignUpMode && (
          <Link to="" className='text-sm font-extralight text-blue-500 hover:underline cursor-pointer'>
            Forgot password?
          </Link>
        )}
        <button
          className='my-4 w-full bg-gradient-to-l py-2 rounded-full cursor-pointer hover:from-indigo-950 hover:to-indigo-500 transition-all font-semibold from-indigo-900 to-indigo-400'
        >
          {isSignup}
        </button>
        <p className='text-xs text-center'>
          {isSignUpMode ? "Already Have an account?" : "Don't have an account"}
          <Link
            to=""
            role='button'
            onClick={() => setIsSignup(isSignUpMode ? "Log In" : "Sign Up")}
            className='underline text-blue-500 cursor-pointer hover:text-indigo-600 ml-1'
          >
            {isSignUpMode ? "Login here" : "Register here"}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;