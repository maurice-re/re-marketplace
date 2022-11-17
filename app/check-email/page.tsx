export default function Page() {
  return (
    <div className="flex flex-col h-screen w-full bg-re-dark-green-500 items-center justify-center font-theinhardt">
      <div className="flex flex-col bg-re-dark-green-400 border-[0.5px] border-re-gray-500 rounded min-w-56 w-1/3">
        <h1 className="mx-4 my-5 text-xl">Check your email</h1>
        <div className="h-0.5 w-full bg-re-gray-500"></div>
        <p className="my-5 mx-auto">
          A sign in link has been sent to your email address
        </p>
      </div>
    </div>
  );
}
