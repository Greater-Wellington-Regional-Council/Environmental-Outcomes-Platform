import FarmManagementUnitProps from "@src/models/FarmManagementUnit.ts";
import "./FarmManagementUnit.scss";

const FarmManagementUnit = ( { id, fmuName1, ecoliBase, ecoliObj, byWhen }: FarmManagementUnitProps ) => {
  return <div className="farmManagementUnit space-y-0 p-6" id={`fmu_${id}`}>
    <h2 className={"space-x-0 space-y-0"}>{fmuName1}</h2>
    <h4>Overview</h4>
    <h4>Outcomes</h4>
    <h3>E. coli</h3>
    <ol className={'space-y-0'}>
      <li>{`- Base rating ${ecoliBase}`}</li>
      <li>{`- Goal ${ecoliObj}`}</li>
      <li>{`- By ${byWhen}`}</li>
    </ol>
    <h4>Tangata Whenua</h4>
    <h4>More context</h4>
    <h4>Contaminants</h4>
    <h4>Implementation ideas</h4>
    <a href={'#about'}>About this information</a>
  </div>;
}

export default FarmManagementUnit;