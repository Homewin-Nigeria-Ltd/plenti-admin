import React from "react";

const ChannelOpenedRateChart = () => {
  return (
    <div className="border border-[#EAECF0] rounded-[9px] p-5">
      <h5 className="font-semibold text-[16px] text-[#071D32]">
        Channel Opened Rate
      </h5>
      <p className="text-[#98A2B3] text-[12px]">Based on user interaction</p>
      <div className="flex flex-wrap gap-5 items-center">
        <div></div>
        <div className="space-y-5 w-full">
          <div>
            <div className="flex justify-between items-center gap-5">
              <h5 className="text-[#1D2739] text-[12px] font-medium">Email</h5>
              <p className="text-[12px] font-semibold text-[#04802E]">
                99% Opened
              </p>
            </div>
            <div className="bg-[#D9D9D9] rounded-full h-2.5 my-1">
              <div className="bg-[#28A745] w-[80%] h-2.5 rounded-full" />
            </div>
            <p className="italic text-[12px] text-[#98A2B3]">
              Over 84,900 were sent
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center gap-5">
              <h5 className="text-[#1D2739] text-[12px] font-medium">
                In- App
              </h5>
              <p className="text-[12px] font-semibold text-[#04802E]">
                99% Opened
              </p>
            </div>
            <div className="bg-[#D9D9D9] rounded-full h-2.5 my-1">
              <div className="bg-[#FF7A00] w-[90%] h-2.5 rounded-full" />
            </div>
            <p className="italic text-[12px] text-[#98A2B3]">
              Over 84,900 were sent
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center gap-5">
              <h5 className="text-[#1D2739] text-[12px] font-medium">SMS</h5>
              <p className="text-[12px] font-semibold text-[#04802E]">
                99% Opened
              </p>
            </div>
            <div className="bg-[#D9D9D9] rounded-full h-2.5 my-1">
              <div className="bg-[#0B1E66] w-[80%] h-2.5 rounded-full" />
            </div>
            <p className="italic text-[12px] text-[#98A2B3]">
              Over 84,900 were sent
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelOpenedRateChart;
