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
        <div className={`contaminant min-w-full border-b border-gray-300 pb-3`} key={index}>
          <div className="contaminant-title grid mb-1 mt-3 items-center" role="row" style={{ gridTemplateColumns: "20px 4fr" }}>
            <div className="contaminant-expander pl-0 text-left text-md font-medium text-gray-600 cursor-pointer" data-testid="contaminant-expander" onClick={() => handleRowClick(contaminant.title)}>
              {expandedRows[contaminant.title] ? <ChevronUpIcon className="h-6 w-6 text-blue-500" /> : <ChevronDownIcon className="h-6 w-6 text-blue-500" />}
            </div>
            <div className="pl-4 text-left text-md font-semibold" data-testid="contaminant-title">
              {contaminantTitle(contaminant)}
            </div>
            <div></div>
          </div>
          <div className={`contaminant-levels grid mb-2 items-top`} role="row" style={{ gridTemplateColumns: "20px 2fr 2fr" }}>
            <div className="pl-1"></div>
            <div className="pl-4 text-left text-sm font-medium text-gray-600" data-testid="contaminant-base" >
              Base Rating (2018) <span className="font-bold">{contaminant.base || "None"}</span>
            </div>
            <div className="pl-4 text-left text-sm font-medium text-gray-600" data-testid="contaminant-objective">
              Objective {contaminant.byWhen ? ` (${byWhen(contaminant)})` : ''} <span className="font-bold">{contaminant.objective || 'None'}</span>
            </div>
          </div>
          {expandedRows[contaminant.title] && (
            <div className="contaminant-descriptions grid" role="row" style={{ gridTemplateColumns: "20px 2fr 2fr" }}>
              <div className="pl-1 text-xs text-left align-text-top"></div>
              <div className="pl-4 text-xs text-left align-text-top" data-testid="contaminant-base-desc">
                <div dangerouslySetInnerHTML={{ __html: getObjectiveDescription(contaminant, contaminant.base) ?? '' }} />
              </div>
              <div className="pl-4 text-left text-xs align-text-top" data-testid="contaminant-objective-desc">
                <div dangerouslySetInnerHTML={{ __html: getObjectiveDescription(contaminant, contaminant.objective) ?? '' }} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};