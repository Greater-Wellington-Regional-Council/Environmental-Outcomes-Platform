import React from "react";

interface Contaminant {
  title: string;
  base: string;
  objective: string;
  byWhen: string;
}

interface ContaminantsTableProps {
  contaminants: Contaminant[];
}

export const Contaminants: React.FC<ContaminantsTableProps> = ({contaminants}) => {

  const showTitle = (title: string) => title

  const showBase = (base: string) => base.replace(/^(Ecoli base )|(Base )/, "")

  const showObjective = (objective: string) => objective.replace(/^(Ecoli objective )|(Goal )/, "")

  const showByWhen = (byWhen: string) => byWhen.replace(/^By /, "")

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
        {contaminants.map((contaminant, index) => (
          <tr key={index}>
            <td className="px-4 py-1 pl-2 text-sm font-bold text-gray">{showTitle(contaminant.title)}</td>
            <td className="px-4 py-1 text-sm font-medium text-gray-600">{showBase(contaminant.base)}</td>
            <td className="px-4 py-1 text-sm font-medium text-gray-600">{showObjective(contaminant.objective)}</td>
            <td className="px-4 py-1 text-sm font-medium text-gray-600">{showByWhen(contaminant.byWhen)}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};