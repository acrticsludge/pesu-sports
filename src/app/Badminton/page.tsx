import NavBar from "../NavBar";

export default function Badminton() {
  return (
    <div className="flex flex-col items-center pt-[80px]">
      <div>
        <NavBar />
      </div>
      <header className="flex text-4xl sm:text-5xl font-poppins font-bold pt-10 items-center justify-center">
        Badmintion
      </header>
      <p className="text-lg mt-4 text-center max-w-2xl font-roboto">
        Select your desired court and timing and book now!
      </p>
      <div className="flex flex-row justify-center w-full pt-10">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-lg w-1/2 m-6">
          <h2 className="text-2xl font-bold text-[#0352a1]">
            Welcome to PESU Sports
          </h2>
        </div>
        <div className="w-1/2 text-center">img</div>
      </div>
    </div>
  );
}
