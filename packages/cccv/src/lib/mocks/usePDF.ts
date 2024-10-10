import { useState } from 'react'
import { ReactElement } from 'react'
import { DocumentProps } from '@react-pdf/renderer'

type UsePDFInstance = {
    document: ReactElement<DocumentProps> | null;
};

export function usePDF(options?: { document?: ReactElement<DocumentProps> }): [
    UsePDFInstance,
    (newDocument: ReactElement<DocumentProps>) => void
] {
    const [pdfInstance, setPdfInstance] = useState<UsePDFInstance>({
        document: options?.document || null,
    })

    const updatePDF = (newDocument: ReactElement<DocumentProps>) => {
        setPdfInstance({
            ...pdfInstance,
            document: newDocument,
        })
    } 

    return [pdfInstance, updatePDF]
}