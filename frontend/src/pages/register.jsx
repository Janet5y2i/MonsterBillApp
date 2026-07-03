import React, { useState } from 'react';






function Register(){
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    
    const handelSubmit = async (e) =>{
        e.preventDefault();
        try{
            const response = await fetch('http://127.0.0.1:5000/register', {
                method : 'POST',
                headers: {
                            'Content-Type': 'application/json', // 告訴後端這是一包 JSON 郵件
                        },
                body: JSON.stringify({
                    email : email,
                    username : username,
                    password : password

                })
            })

            const data = await response.json();
            if (response.ok){
                setMessage(`${data.message}`);
                
            } else {
                
                setMessage(`Failed: ${data.message || 'Invalid format'}`)
            }

        } catch(err){
            console.error('Frontend Error:', err);
            setMessage(`Error: ${err}`)
        } 
        }
    return (
        <div>
            <h2 style={{ color: '#333' }}>Register</h2>
            <form onSubmit={handelSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email: </label>
                    <input type='email' value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Username: </label>
                    <input type='text' value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Password: </label>
                    <input type='password' value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer' }}
                        >
                        Submit
                </button>
            </form>
            {message && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{message}</p>}
                
        </div>
    )
        
    
}

export default Register;