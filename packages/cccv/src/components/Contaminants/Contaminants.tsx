import React, {useState} from "react";
import {ContaminantList} from "@components/FreshwaterManagementUnit/utils.ts";
import {ChevronUpIcon, ChevronDownIcon} from '@heroicons/react/20/solid';
import {
  getObjectiveDescription,
  contaminantTitle,
  byWhen
} from "@components/Contaminants/ContaminantObjectiveDescription";


export const Contaminants: React.FC<{ contaminants: ContaminantList }> = ({contaminants}) => {
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});

  const handleRowClick = (title: string) => {
    setExpandedRows(prevState => ({...prevState, [title]: !prevState[title]}));
  };

  return (
    <div>
      {contaminants.map((contaminant, index) => (
        <table className="min-w-full mb-4" key={index}>
          <thead>
          <tr className="pb-0">
            <th colSpan={1} />
            <th colSpan={2} className="px-4 text-left text-sm font-semibold">{contaminantTitle(contaminant)}</th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
          <tr onClick={() => handleRowClick(contaminant.title)} className="cursor-pointer border-b border-gray-200">
            <th className="px-1 text-left text-sm font-medium text-gray-600">
              {expandedRows[contaminant.title] ? <ChevronUpIcon className="h-6 w-6 text-blue-500"/> :
                <ChevronDownIcon className="h-6 w-6 text-blue-500"/>}
            </th>
            <th className="px-4 text-left text-sm font-medium text-gray-600">
              Base Rating (2018) <span className="font-bold">{contaminant.base || "None"}</span></th>
            <th className="px-4 text-left text-sm font-medium text-gray-600">Objective
              {contaminant.byWhen ? ` (${byWhen(contaminant)})` : ''} <span className="font-bold">{contaminant.objective || 'None'}</span></th>
          </tr>
          {expandedRows[contaminant.title] && (
            <tr>
              <td className="px-0 pt-2 text-xs text-left align-text-top">
              </td>
              <td className="px-4 pt-2 text-xs text-left align-text-top">
                <div dangerouslySetInnerHTML={{__html: getObjectiveDescription(contaminant, contaminant.base) ?? ''}}/>
              </td>
              <td className="px-4 pt-2 text-xs text-left align-text-top">
                <div
                  dangerouslySetInnerHTML={{__html: getObjectiveDescription(contaminant, contaminant.objective) ?? ''}}/>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      ))}
    </div>
  );

};