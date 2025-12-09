import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
    const navigate = useNavigate();

    const createSession = () => {
        const roomId = uuidv4();
        navigate(`/room/${roomId}`);
    };

    return (
        <div className="home-container">
            <h1>Online Coding Interview</h1>
            <p>Real-time collaborative coding environment</p>
            <button onClick={createSession} style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}>
                Create New Interview Session
            </button>
        </div>
    );
}
