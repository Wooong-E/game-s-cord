import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = "http://localhost:8080";

const useLogout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                console.log("server discard token complete");
            } catch (error) {
                console.error("server discard token fail", error);
            }
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");

        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    return handleLogout;
};

export default useLogout;