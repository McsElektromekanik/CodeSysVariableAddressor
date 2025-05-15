import { mdiMenu } from "@mdi/js";
import Icon from "@mdi/react";

function App() {
  return (
    <div className="bg-base-300 w-1/2 mx-auto my-4 p-4 grid grid-cols-10 rounded-2xl shadow-white shadow-sm gap-4">
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
            <Icon path={mdiMenu} size={1} />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-start-2 col-end-11 flex justify-center items-center">
        <h1 className="text-3xl">Değişken Adresleyici</h1>
      </div>
      <div className="col-span-full">
        <label className="flex gap-4 flex-col">
          <span className="font-bold">Başlangıç Adresi:</span>
          <input className="input input-primary input-sm" />
        </label>
      </div>
    </div>
  );
}

export default App;
