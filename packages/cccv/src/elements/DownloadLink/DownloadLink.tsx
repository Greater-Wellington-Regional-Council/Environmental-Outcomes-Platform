import { UsePDFInstance } from "@react-pdf/renderer"
import React, { useState } from "react"
import { Spinner as DownloadSpinner } from "@components/LoadingIndicator/LoadingIndicatorOverlay.tsx"
import {makeFileNameSafe} from "@lib/makeSafe.ts"

export const DownloadLink: React.FC<DownloadLinkProps> = ({ instance, fileName, loading, error }) => {
    // const [ready, setReady] = useState(false)
    //
    // useEffect(() => {
    //     const preloadBlob = async () => {
    //         if (instance && instance.url) {
    //             try {
    //                 const response = await fetch(instance.url)
    //                 const blob = await response.blob()
    //             } catch (error) {
    //                 console.error("Preload failed:", error)
    //             }
    //         }
    //     }
    //
    //     preloadBlob().then()
    // }, [instance])

    const [downloading, setDownloading] = useState(false)

    const handleDownload = () => {
        if (instance.blob && fileName) {
            setDownloading(true)
            const link = document.createElement('a')
            try {
                link.href = instance.url!
                link.download = makeFileNameSafe(fileName, ["pdf"])

                document.body.appendChild(link)
                link.click()

                document.body.removeChild(link)
                URL.revokeObjectURL(link.href)
            } catch (error) {
                console.error("Download failed:", error)
            } finally {
                URL.revokeObjectURL(link.href)
                document.body.removeChild(link)
                setDownloading(false)
            }
        }
    }

    return loading ? (
        <DownloadSpinner width={3} height={5} />
    ) : (
        <button className="button-style" onClick={handleDownload} disabled={loading || error || downloading || !instance.blob}>
            Print
        </button>
    )
}

interface DownloadLinkProps {
    instance: UsePDFInstance;
    fileName: string;
    loading?: boolean;
    error?: boolean;
}