import { FormRoute, FormStore, useFormStore } from "../../stores/formStore";

function ProgressBar({ pageName }: { pageName: string; }) {
  const routes = useFormStore((state: FormStore) => state.routes);
  const currentRouteIndex = routes.findIndex(
    (route: FormRoute) => route.name == pageName.replace("+", " ")
  );
  return (
    <div
      className=" bg-re-blue-500 h-3 absolute left-0 top-0"
      style={{
        width: `${((currentRouteIndex + 1) / routes.length) * 100}%`,
      }}
    ></div>
  );
}

export default ProgressBar;
