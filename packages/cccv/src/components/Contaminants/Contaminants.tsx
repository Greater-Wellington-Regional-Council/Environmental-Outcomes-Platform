import React from "react";
import {Contaminant, ContaminantList} from "@components/FreshwaterManagementUnit/utils.ts";

export const Contaminants: React.FC<{  contaminants: ContaminantList }> = ( { contaminants }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
        <tr className="border-b border-gray-200">
          <th className="px-4 py-2 text-left text-sm font-semibold text-transparent">Title</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Base</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Objective</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">By</th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
        {contaminants.map((contaminant: Contaminant, index: number) => (
          <tr key={index}>
            <td className="px-4 py-1 pl-2 text-sm font-bold text-gray">{contaminant.title}</td>
            <td className="px-4 py-1 text-sm font-medium text-gray-600">{contaminant.base}</td>
            <td className="px-4 py-1 text-sm font-medium text-gray-600">{contaminant.objective}</td>
            <td className="px-4 py-1 text-sm font-medium text-gray-600">{contaminant.byWhen}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};