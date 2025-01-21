import { useEffect } from 'react'
import { useAsync } from 'react-use'

import { proxy, wrap } from 'comlink'
import type { WorkerType } from './pdf.worker'
import Worker from './pdf.worker?worker'

export const pdfWorker = wrap<WorkerType>(new Worker())

await pdfWorker.onProgress(proxy((info: unknown) => console.log(info)))

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
