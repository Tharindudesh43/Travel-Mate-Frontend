import React from "react";
import { Train, Clock, Ticket, ArrowRight } from "lucide-react";

const TrainCard = ({ rawData }: { rawData: string }) => {
  const parseTrainData = (text: string) => {
    const trainNo = text.match(/Train (\d+)/)?.[1] || "N/A";
    const departs = text.match(/Departs: ([\d:]+)/)?.[1] || "--:--";
    const arrives = text.match(/Arrives: ([\d:]+)/)?.[1] || "--:--";
    const classes = text.match(/Classes: (.*)/)?.[1] || "Standard";
    return { trainNo, departs, arrives, classes };
  };
  const { trainNo, departs, arrives, classes } = parseTrainData(rawData);

  return (
    <div className="flex flex-col md:flex-row items-stretch w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden m-4">
      <div className="bg-blue-600 p-6 flex flex-col justify-center items-center text-white md:w-1/4">
        <Train size={32} className="mb-2" />
        <span className="text-xs uppercase font-bold opacity-80 tracking-widest">
          Train
        </span>
        <h2 className="text-2xl font-black">{trainNo}</h2>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Departure
            </p>
            <p className="text-xl font-black text-slate-800">{departs}</p>
            <p className="text-xs text-slate-500">Colombo Fort</p>
          </div>

          <div className="flex flex-col items-center px-4">
            <div className="h-px w-12 bg-slate-200 relative">
              <ArrowRight
                size={14}
                className="absolute -top-[7px] left-1/2 -translate-x-1/2 text-blue-500"
              />
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Arrival
            </p>
            <p className="text-xl font-black text-slate-800">{arrives}</p>
            <p className="text-xs text-slate-500">Badulla</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-dashed border-slate-200">
          <div className="flex items-center gap-1">
            <Ticket size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-slate-600">{classes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-slate-600">Daily</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-l border-slate-100 p-6 flex flex-col justify-center">
        <a
          href="https://eservices.railway.gov.lk"
          target="_blank"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors text-center whitespace-nowrap"
        >
          Book Now
        </a>
      </div>
    </div>
  );
};
export default TrainCard;