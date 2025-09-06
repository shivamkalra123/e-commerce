import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side image */}
      <div className="hidden lg:flex w-1/2">
        <img 
          src="/poster.png" 
          alt="log" 
          className="w-full h-screen object-cover"
        />
      </div>

      {/* Right side content */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
