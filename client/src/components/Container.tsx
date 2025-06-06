import { useEffect, useState } from "react";
import FormContainer from "./FormContainer";
import axios from "axios";
import { serverUrl } from "../utils/constants";
import UrlTable from "./UrlTable";
import type { UrlData } from "../types";

const Container = () => {
  const [urlData, setUrlData] = useState<UrlData[]>([]);

  const fetchTableData = async () => {
    const { data } = await axios.get(`${serverUrl}/urls`);
    setUrlData(data.data);
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <>
      <FormContainer />
      <UrlTable urlData={urlData} />
    </>
  );
};

export default Container;
