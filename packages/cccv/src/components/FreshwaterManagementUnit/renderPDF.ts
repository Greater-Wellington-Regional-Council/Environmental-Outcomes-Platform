import type {FreshwaterManagementUnitPDFProps} from './FreshwaterManagementUnit.pdf.tsx'

export const renderPDF = async (props: FreshwaterManagementUnitPDFProps) => {
    const { pdf } = await import('@react-pdf/renderer')
    const { FreshwaterManagementUnitPDF } = await import('./FreshwaterManagementUnit.pdf.tsx')
    return pdf(FreshwaterManagementUnitPDF(props)).toBlob()
}