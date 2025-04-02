import { useEffect } from 'react'
import { useAsync } from 'react-use'

import { wrap } from 'comlink'
import type { WorkerType } from './pdf.worker'
import Worker from './pdf.worker?worker'

export const pdfWorker = wrap<WorkerType>(new Worker())

export const useRenderPDF = (props: Parameters<WorkerType['renderPDFInWorker']>[0]) => {
    const {
        value: url,
        loading,
        error,
    } = useAsync(async () => {
        return pdfWorker.renderPDFInWorker(props)
    }, Object.values(props))

    useEffect(() => (url ? () => URL.revokeObjectURL(url) : undefined), [url])
    return { url, loading, error }
}
