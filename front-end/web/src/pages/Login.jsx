import { useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Login(){
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/login',{
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if(!res.ok) throw new Error (data.error || 'Login failed');
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (error){
            alert('Access error');
            console.log(error);
        }
    };
    return (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
          </form>
        </div>
      );
}
export default Login;