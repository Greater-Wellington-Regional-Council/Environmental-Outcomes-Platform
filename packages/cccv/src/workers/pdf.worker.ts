import { expose } from 'comlink'
import type { FreshwaterManagementUnitPDFProps as PDFProps } from '@components/FreshwaterManagementUnit/FreshwaterManagementUnit.pdf'
import './workerShim'

let log = console.info

const renderPDFInWorker = async (props: PDFProps) => {
    try {
        const { renderPDF  } = await import('@components/FreshwaterManagementUnit/renderPDF.ts')
        return URL.createObjectURL(await renderPDF(props))
    } catch (error) {
        log(error)
        throw error
    }
}

const onProgress = (cb: typeof console.info) => (log = cb)

expose({ renderPDFInWorker: renderPDFInWorker, onProgress })

export type WorkerType = {
    renderPDFInWorker: typeof renderPDFInWorker;
    onProgress: typeof onProgress;
};
