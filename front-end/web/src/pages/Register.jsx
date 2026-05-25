import { useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Register(){
   const navigate = useNavigate();
   const [form, setForm] = useState({
     name: '',
     email: '',
     password: '',
   });

   const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
   };

   const handleSubmit = async e => {
    e.preventDefault();
    try {
        const res = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(form)
        });
        if(!res.ok) throw new Error('Registration failed');

        alert('Registered successfully')
        navigate('/login');
    } catch(error){
        alert('Registration error');
        console.log(error);
    }
};
    return(
        <div>
            <h2>Register</h2>
            <form onSubmit ={handleSubmit}>
                <input name = "name" placeholder = "Name" onChange={handleChange}required/>
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
               <button type = "submit">Register</button>
            </form>
        </div>
    );

}

export default Register;