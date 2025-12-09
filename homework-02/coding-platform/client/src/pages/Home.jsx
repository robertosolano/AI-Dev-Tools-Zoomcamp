import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';

export default function Home() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [role, setRole] = useState('evaluator'); // 'evaluator' or 'candidate'
    const [joinRoomId, setJoinRoomId] = useState('');
    const [activeRooms, setActiveRooms] = useState([]);

    useEffect(() => {
        if (role === 'candidate') {
            fetch('http://localhost:3000/api/rooms')
                .then(res => res.json())
                .then(data => {
                    // data is object {id: {creator, ...}}
                    const rooms = Object.entries(data).map(([id, meta]) => ({ id, ...meta }));
                    setActiveRooms(rooms);
                })
                .catch(err => console.error('Failed to fetch rooms', err));
        }
    }, [role]);

    const handleStart = () => {
        if (!name) return alert('Please enter your name');

        // Store user info (mock auth)
        localStorage.setItem('user_name', name);
        localStorage.setItem('user_role', role);

        if (role === 'evaluator') {
            const roomId = uuidv4();
            navigate(`/room/${roomId}`);
        } else {
            if (!joinRoomId) return alert('Please enter a Room ID to join');
            navigate(`/room/${joinRoomId}`);
        }
    };

    const joinSession = (id) => {
        if (!name) return alert('Please enter your name first');
        localStorage.setItem('user_name', name);
        localStorage.setItem('user_role', 'candidate');
        navigate(`/room/${id}`);
    };

    return (
        <div className="home-container">
            <h1>Online Coding Interview</h1>
            <p>Real-time collaborative coding environment</p>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px', backgroundColor: '#252526', padding: '20px', borderRadius: '8px' }}>
                    <input
                        placeholder="Your Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#3c3c3c', color: 'white' }}
                    />

                    <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#3c3c3c', color: 'white' }}
                    >
                        <option value="evaluator">Evaluator (Create New)</option>
                        <option value="candidate">Candidate (Join Existing)</option>
                    </select>

                    {role === 'candidate' && (
                        <>
                            <input
                                placeholder="Room ID to Join (or select from list)"
                                value={joinRoomId}
                                onChange={e => setJoinRoomId(e.target.value)}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#3c3c3c', color: 'white' }}
                            />
                        </>
                    )}

                    <button onClick={handleStart} style={{ padding: '10px 20px', fontSize: '1.1rem', cursor: 'pointer', backgroundColor: '#0078d4', color: 'white', border: 'none', borderRadius: '4px' }}>
                        {role === 'evaluator' ? 'Create Session' : 'Join Session'}
                    </button>
                </div>

                {role === 'candidate' && activeRooms.length > 0 && (
                    <div style={{ width: '300px', backgroundColor: '#252526', padding: '20px', borderRadius: '8px', overflowY: 'auto', maxHeight: '400px' }}>
                        <h3>Active Sessions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {activeRooms.map(room => (
                                <div key={room.id} onClick={() => joinSession(room.id)} style={{ padding: '10px', backgroundColor: '#333', borderRadius: '4px', cursor: 'pointer', border: '1px solid #444', transition: 'background-color 0.2s' }}>
                                    <div style={{ fontWeight: 'bold', color: '#61dafb' }}>{room.creator}'s Room</div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '5px' }}>ID: {room.id.substring(0, 8)}...</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Participants: {room.participants}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
