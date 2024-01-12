import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { auth, provider } from '../../Firebase/Firebaseconfig';
import './Login.scss';
import logo from '../../image/logo.png';

const Login = ({ setAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/layout');
        }
    }, [navigate]);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleFacebookLogin = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                localStorage.setItem('token', 'your_token_here');
                toast.success('Đăng nhập thành công');
                setAuthenticated(true);
                navigate('/layout');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleGoogleLogin = async () => {
        axios
            .get('http://localhost:3000/auth/google/login', {
                withCredentials: true,
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            toast.error('Vui lòng nhập đầy đủ email và password');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                email: email,
                hashPassword: password,
            });

            const { accessToken, refreshToken } = response.data;

            if (accessToken && refreshToken) {
                // Xoá accessToken và refreshToken cũ
                // localStorage.removeItem('token');
                // localStorage.removeItem('refreshToken');

                // Lưu accessToken và refreshToken mới
                localStorage.setItem('token', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                setAuthenticated(true);
                toast.success('Đăng nhập thành công');

                // setTimeout(refreshToken, 150000);

                navigate('/layout');
            } else {
                toast.error('Đăng nhập không thành công');
            }
        } catch (error) {
            toast.error('Đăng nhập không thành công');
        }
    };

    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                const response = await axios.post(
                    'http://localhost:3000/auth/refresh',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    },
                );

                const { accessToken } = response.data;

                if (accessToken) {
                    // Xoá accessToken cũ
                    // localStorage.removeItem('token');

                    // Lưu accessToken mới
                    localStorage.setItem('token', accessToken);
                }
            } else {
                console.log('Không có refreshToken');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const refreshTokenInterval = setInterval(refreshToken, 1800000);

        refreshToken();

        return () => clearInterval(refreshTokenInterval);
    }, []);

    return (
        <div className="bodyy">
            <main className="l-main">
                <div className="l-user">
                    <div className="c-panel group">
                        <img className="c-panel__img" src={logo} alt="Logo-TwoT" />

                        <div className="c-panel__form">
                            <input
                                type="text"
                                className="c-panel__input"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                placeholder="example@gmail.com"
                            />
                            <input
                                type="password"
                                className="c-panel__input"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                placeholder="Password"
                            />
                            <button className="c-btn" onClick={handleSubmit}>
                                Log In
                            </button>
                            <span className="c-panel__span">OR</span>
                        </div>
                        <button className="c-panel__facebook" onClick={handleFacebookLogin}>
                            Login with Facebook
                        </button>
                        <button className="c-panel__facebook" onClick={handleGoogleLogin}>
                            Login with Google
                        </button>
                    </div>
                    <div className="c-signup group">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="Register">
                                Register
                            </Link>
                        </p>
                    </div>
                    <div className="c-app">
                        <p></p>
                        <div className="c-app__download"></div>
                    </div>
                </div>
                <ToastContainer position="top-right" />
            </main>
        </div>
    );
};

export default Login;
