import React, { useState } from "react"
import { Spinner as DownloadSpinner } from "@components/LoadingIndicator/LoadingIndicatorOverlay.tsx"
import { makeFileNameSafe } from "@lib/makeSafe.ts"

export const DownloadLink: React.FC<DownloadLinkProps> = ({
                                                              href,
                                                              fileName,
                                                              pdfLoading,
                                                              hasError,
                                                          }) => {
    const [downloading, setDownloading] = useState(false)

    const handleDownload = () => {
        setDownloading(true)

        const link = document.createElement("a")
        link.href = href
        link.download = makeFileNameSafe(fileName, ["pdf"])

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setDownloading(false)
    }

    if (pdfLoading) {
        return (
            <div className="loading-state">
                <DownloadSpinner width={3} height={5} />
                <span>Preparing PDF...</span>
            </div>
        )
    }

    if (hasError) {
        return (
            <div className="error-state">
                <span className="text-red-500">Error generating PDF.</span>
            </div>
        )
    }

    return (
        <button
            className="button-style"
            onClick={handleDownload}
            disabled={downloading || pdfLoading || hasError}
        >
            {downloading ? <DownloadSpinner width={3} height={5} /> : "Print"}
        </button>
    )
}

interface DownloadLinkProps {
    pdfLoading: boolean;
    href: string;
    fileName: string;
    hasError?: boolean;
}