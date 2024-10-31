import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Tạo timer để đếm ngược
    const timer = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    // Khi đếm ngược về 0 thì chuyển hướng về trang đăng nhập
    if (countdown === 0) {
      navigate('/login');
    }

    // Xóa timer khi component unmount hoặc countdown về 0
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div>
      <h1>Truy cập trái phép</h1>
      <p>Bạn không có quyền xem trang này.</p>
      <p>Chuyển hướng về trang đăng nhập trong {countdown} giây...</p>
    </div>
  );
};

export default UnauthorizedPage;
