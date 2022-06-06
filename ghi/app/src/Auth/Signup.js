import { useState } from 'react';
import { Navigate } from 'react-router-dom';

function Signup(props) {
  const { token, signup } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const error = await signup(username, email, password);
    setError(error);
  };

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={handleSubmit}>
      { error ? <div dangerouslySetInnerHTML={{__html: error}} /> : null }
      <input required name="username" type="text" onChange={e => setUsername(e.target.value)} value={username} placeholder="username" />
      <input required name="email" type="email" onChange={e => setEmail(e.target.value)} value={email} placeholder="email" />
      <input required name="password" type="password" onChange={e => setPassword(e.target.value)} value={password} placeholder="password" />
      <button>Signup</button>
    </form>
  )
}

export default Signup;