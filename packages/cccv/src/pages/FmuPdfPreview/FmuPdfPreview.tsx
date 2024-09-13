import './FmuPdfPreview.scss'
import {FmuFullDetails} from "@models/FreshwaterManagementUnit.ts"
import {FreshwaterManagementUnitPDF} from "@components/FreshwaterManagementUnit/FreshwaterManagementUnit.pdf.tsx"
import {PDFViewer} from "@react-pdf/renderer"
import {useLoaderData} from "react-router-dom"

const FmuPdfPreview = () => {
  const details = useLoaderData()
  return ((details === undefined) ? (
    <p>No such freshwater management unit found</p>
  ) : (
    <div className="FmuPdfPreview flex items-center justify-center h-screen">
    <PDFViewer style={{height: "100vh", width:  "100vh"}}>
      <FreshwaterManagementUnitPDF {...(details as FmuFullDetails)} />
    </PDFViewer>
    </div>
  ))
}

export default FmuPdfPreview
