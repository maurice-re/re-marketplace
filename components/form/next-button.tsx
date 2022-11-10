import Link from "next/link";
import { useFormStore } from "../../stores/formStore";

function FormNextButton({
  onClick,
  pageName,
  disabled,
  option,
  green,
}: {
  onClick?: () => void;
  pageName: string;
  disabled: boolean;
  option?: boolean;
  green?: boolean;
}) {
  const { nextRoute, routes } = useFormStore((state) => ({
    nextRoute: state.nextRoute,
    routes: state.routes,
  }));
  const currentRouteIndex = routes.findIndex(
    (route) => route.name == pageName.replace("+", " ")
  );
  console.log(currentRouteIndex);
  console.log(routes);
  console.log(pageName);

  const nextPage = nextRoute(currentRouteIndex);
  if (green) {
    return (
      <div className={"flex place-content-center"}>
        <Link href={nextPage}>
          <button
            className={
              " bg-re-green-500 text-28 py-2 rounded-10 w-full text-black font-theinhardt mt-6 hover:bg-re-green-300 active:bg-re-green-400 disabled:bg-gray-300 max-w-lg"
            }
            type="button"
            disabled={disabled}
            onClick={onClick}
          >
            Next →
          </button>
        </Link>
      </div>
    );
  }
  return (
    <div className={"flex place-content-center"}>
      <Link href={nextPage}>
        <button
          className=" bg-white text-28 py-2 rounded-10 w-124 text-black font-theinhardt mt-6 hover:bg-gray-100 disabled:bg-gray-300 active:bg-gray-50"
          type="button"
          disabled={disabled}
          onClick={onClick}
        >
          Next →
        </button>
      </Link>
    </div>
  );
}

export default FormNextButton;
