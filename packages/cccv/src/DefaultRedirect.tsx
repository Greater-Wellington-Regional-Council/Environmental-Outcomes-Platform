import {useNavigate} from "react-router-dom"
import {useEffect} from "react"

export const DefaultRedirect = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/map/@-41,175.35,8z', { replace: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null
}