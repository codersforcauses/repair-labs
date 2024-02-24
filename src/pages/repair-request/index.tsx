// Page for submitting a repair request

import RepairRequestForm from "@/components/Forms/create-repair-request";
import NavBar from "@/components/NavBar";
import { NextPageWithLayout } from "@/pages/_app";

const RepairRequest: NextPageWithLayout = () => {
  return (
    <div className="flex items-center justify-center p-4 bg-slate-100">
      <div className="flex w-screen flex-col justify-center gap-4 md:w-3/6 lg:w-4/12">
        {/* Heading of the Page */}
        <h1 className="flex justify-center text-4xl font-bold pt-5 ">
          {" "}
          Submit a Repair Request
        </h1>
        <h4 className="flex justify-center text-lg font-bold text-primary-500 pb-2">
          Tell us about your item and what needs fixing
        </h4>
        <RepairRequestForm />
      </div>
    </div>
  );
};

RepairRequest.getLayout = function getLayout(page) {
  return (
    <>
      <NavBar />
      {page}
    </>
  );
};

export default RepairRequest;
