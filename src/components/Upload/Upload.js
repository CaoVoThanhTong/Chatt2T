import React, { useState,useEffect,useContext } from 'react';
import axios from 'axios';
import './Upload.scss';
import Image from '../../image/img.png';
import Map from '../../image/map.png';
import Friend from '../../image/friend.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { LightModeContext } from '~/context/lightModeContext';

// import tong from '../../image/thanhtong.jpg';
// import { useContext } from 'react';
// import { AuthContext } from '../../context/authContext';

const Upload = () => {

    const { lightMode } = useContext(LightModeContext);
    // const { currentUser } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    // const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [lastName, setLastName] = useState('');

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            setImageBase64(e.target.result);
        };

        reader.readAsDataURL(selectedImage);
    };

    const handlePostClick = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const postData = {
                content: content,
                image: imageBase64,
            };

            axios.post(
                'http://localhost:3000/article/',
                postData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then((response) => {
                console.log('Upload bài viết thành công!', response.data);
                toast.success('Upload bài viết thành công!', { autoClose: 5000 });
                setContent('');
                setImageBase64('');
            })
                .catch((error) => {
                toast.warning('Vui lòng nhập đầy đủ content để có thể đăng bài!', { autoClose: 5000 });
                console.error('Upload bài viết thất bại:', error);
            });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:3000/user/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                  //  console.log('Thông tin người dùng:', response.data);
                    const data = response.data;
                    // setUserName(data.userName);
                    setUserAvatar(data.avatar);
                    // Tách tên thành mảng và lấy phần tử cuối cùng
                    
                    const nameParts = data.userName.split(' ');
                    if (nameParts.length > 0) {
                        setLastName(nameParts[nameParts.length - 1]);
                    }
                })
                .catch((error) => {
                    console.error('Lỗi khi lấy thông tin người dùng:', error);
                });
        }
    }, []);


    return (
        <div className={`share ${lightMode ? 'light' : 'dark'}`}>
            <div className="container">
                <div className="top">
                    <img src={userAvatar} alt="loi hinh anh" />
            
                    <input
                        type="text"
                        placeholder={`What's on your mind, ${lastName}?`}
                        value={content}
                        onChange={handleContentChange}
                    />
                </div>
                <hr />
                <div className="bottom">
                <div className="left">
                        <input
                            type="file"
                            id="file"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                        <label htmlFor="file">
                            <div className="item">
                                <img src={Image} alt="" />
                                <span>Add Image</span>
                            </div>
                        </label>
                        <div className="item">
                            <img src={Map} alt="" />
                            <span>Add Place</span>
                        </div>
                        <div className="item">
                            <img src={Friend} alt="" />
                            <span>Tag Friends</span>
                        </div>
                    </div>
                    <div className="right">
                        <button onClick={handlePostClick}>Post</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Upload;
