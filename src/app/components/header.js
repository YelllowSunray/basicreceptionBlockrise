"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import './header.css';

const Header = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const dutchDate = date.toLocaleDateString('nl-NL', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return dutchDate.charAt(0).toUpperCase() + dutchDate.slice(1);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo">
          <Image
            src="/images/logo.png"
            alt="Blockrise Logo"
            width={200}
            height={50}
            priority
            style={{ objectFit: 'contain' }}
            className="logo-image"
          />
        </Link>
        {mounted && (
          <div className="datetime">
            <div className="time">
              {currentDateTime.toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              })}
            </div>
            <div className="date">
              {formatDate(currentDateTime)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;