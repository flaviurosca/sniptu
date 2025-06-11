import axios from "axios";
import { useState } from "react";
import { serverUrl } from "../utils/constants";

type FormContainerProps = {
  fetchTableData: () => void;
};

const FormContainer = ({ fetchTableData }: FormContainerProps) => {
  const [fullUrl, setFullUrl] = useState<string>("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullUrl(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(`${serverUrl}/urls`, {
        fullUrl: fullUrl,
      });

      setFullUrl("");
      fetchTableData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-2">
      <div className="bg-[url(/bg.jpg)] my-8 rounded-xl bg-cover">
        <div className="w-full h-full rounded-xl p-20 backdrop-brightness-50">
          <h2 className="text-white text-4xl text-center pb-4">
            Sniptu - URL Shortener
          </h2>
          <p className="text-white text-center pb-2 text-xl font-extralight">
            paste your untidy link to shorten it
          </p>
          <p className="text-white text-center pb-4 text-sm font-thin">
            free tool to shorten a URL, Use our URL shortener to create a neat
            link, easy to use
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex">
              <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none text-slate-800">
                  urlshortner.link /
                </div>
                <input
                  type="text"
                  value={fullUrl}
                  onChange={handleOnChange}
                  placeholder="add your link"
                  required
                  className="block w-full p-4 ps-33 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-lg border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                >
                  Snip URL
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
