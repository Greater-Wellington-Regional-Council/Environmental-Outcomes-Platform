import { UsePDFInstance } from "@react-pdf/renderer"
import { useEffect, useState } from "react"
import { Spinner as DownloadSpinner } from "@components/LoadingIndicator/LoadingIndicatorOverlay.tsx"

export const DownloadLink: React.FC<DownloadLinkProps> = ({ instance, fileName }) => {
    const [downloading, setDownloading] = useState(false)
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)

    useEffect(() => {
        // Preload the blob when the instance URL is available
        const preloadBlob = async () => {
            if (instance && instance.url) {
                try {
                    const response = await fetch(instance.url)
                    const blob = await response.blob()
                    setPdfBlob(blob)
                } catch (error) {
                    console.error("Preload failed:", error)
                }
            }
        }

        preloadBlob()
    }, [instance])

    const handleDownload = () => {
        if (pdfBlob) {
            setDownloading(true)

            try {
                const link = document.createElement('a')
                link.href = URL.createObjectURL(pdfBlob)
                link.download = fileName

                document.body.appendChild(link)
                link.click()

                document.body.removeChild(link)
                URL.revokeObjectURL(link.href)
            } catch (error) {
                console.error("Download failed:", error)
            } finally {
                setDownloading(false)
            }
        }
    }

    return downloading ? (
        <DownloadSpinner width={3} height={5} />
    ) : (
        <button className="button-style" onClick={handleDownload} disabled={!pdfBlob || downloading}>
            Print
        </button>
    )
}

interface DownloadLinkProps {
    pdfLoading: boolean;
    instance: UsePDFInstance;
    fileName: string;
    hasError?: boolean;
}