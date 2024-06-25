import React, { useState } from "react";
import { ContaminantList } from "@components/FreshwaterManagementUnit/utils.ts";
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import {
  getObjectiveDescription,
  contaminantTitle,
  byWhen
} from "@components/Contaminants/ContaminantObjectiveDescription";

export const Contaminants: React.FC<{ contaminants: ContaminantList }> = ({ contaminants }) => {
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});

  const handleRowClick = (title: string) => {
    setExpandedRows(prevState => ({ ...prevState, [title]: !prevState[title] }));
  };

  return (
    <div>
      {contaminants.map((contaminant, index) => (
        <div className={`min-w-full border-b border-gray-300 pb-3`} key={index}>
          <div className="grid mb-1 mt-3 items-center" style={{ gridTemplateColumns: "20px 4fr" }}>
            <div className="pl-0 text-left text-md font-medium text-gray-600 cursor-pointer" onClick={() => handleRowClick(contaminant.title)}>
              {expandedRows[contaminant.title] ? <ChevronUpIcon className="h-6 w-6 text-blue-500" /> : <ChevronDownIcon className="h-6 w-6 text-blue-500" />}
            </div>
            <div className="pl-4 text-left text-md font-semibold">
              {index.toString()+" "+contaminants.length+" "+contaminantTitle(contaminant)}
            </div>
            <div></div>
          </div>
          <div className={`grid mb-2 items-top`} style={{ gridTemplateColumns: "20px 2fr 2fr" }}>
            <div className="pl-1"></div>
            <div className="pl-4 text-left text-sm font-medium text-gray-600">
              Base Rating (2018) <span className="font-bold">{contaminant.base || "None"}</span>
            </div>
            <div className="pl-4 text-left text-sm font-medium text-gray-600">
              Objective {contaminant.byWhen ? ` (${byWhen(contaminant)})` : ''} <span className="font-bold">{contaminant.objective || 'None'}</span>
            </div>
          </div>
          {expandedRows[contaminant.title] && (
            <div className="grid" style={{ gridTemplateColumns: "20px 2fr 2fr" }}>
              <div className="pl-1 text-xs text-left align-text-top"></div>
              <div className="pl-4 text-xs text-left align-text-top">
                <div dangerouslySetInnerHTML={{ __html: getObjectiveDescription(contaminant, contaminant.base) ?? '' }} />
              </div>
              <div className="pl-4 text-left text-xs align-text-top">
                <div dangerouslySetInnerHTML={{ __html: getObjectiveDescription(contaminant, contaminant.objective) ?? '' }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};