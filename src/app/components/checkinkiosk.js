"use client"

import React, { useState, useEffect } from 'react';
import './checkinkiosk.css';
import { db } from './firebaseClient';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import Header from './header';

const CheckInKiosk = () => {
  const [step, setStep] = useState('welcome');
  const [formData, setFormData] = useState({
    voornaam: '',
    achternaam: '',
    bedrijf: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const fetchCheckins = async () => {
    try {
      const q = query(collection(db, 'checkins'), orderBy('timestamp', 'desc'));
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log('Check-in:', doc.id, ' => ', doc.data());
        });
      });
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    try {
      const docRef = await addDoc(collection(db, 'checkins'), {
        voornaam: formData.voornaam,
        achternaam: formData.achternaam,
        bedrijf: formData.bedrijf,
        timestamp: serverTimestamp()
      });

      console.log("Document written with ID: ", docRef.id);
      setSubmitted(true);
      fetchCheckins();
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setTimeout(() => {
      setStep('welcome');
      setFormData({
        voornaam: '',
        achternaam: '',
        bedrijf: '',
      });
      setSubmitted(false);
    }, 5000);
  };

  const handleButtonClick = (nextStep) => {
    console.log('Button clicked:', nextStep);
    setStep(nextStep);
  };

  // Completely simplified TouchButton component for iPad compatibility
  const TouchButton = ({ className, onPress, children }) => {
    return (
      <button 
        className={className}
        onClick={onPress}
        type="button"
      >
        {children}
      </button>
    );
  };

  const renderWelcomeScreen = () => (
    <div className="welcome-container">
      <h1 className="welcome-title">
        Hartelijk <span className="welcome-highlight">Welkom</span> bij onze Self-Service Kiosk.
      </h1>
      <div className="button-container">
        <TouchButton 
          className="check-in-button" 
          onPress={() => handleButtonClick('form')}
        >
          Tik om in te Checken
        </TouchButton>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="form-container">
      <TouchButton 
        className="back-button"
        onPress={() => handleButtonClick('welcome')}
      >
        <span className="mr-1">←</span> Terug
      </TouchButton>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label className="block text-gray-700 mb-1">Voornaam</label>
            <input
              type="text"
              name="voornaam"
              value={formData.voornaam}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Achternaam</label>
            <input
              type="text"
              name="achternaam"
              value={formData.achternaam}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Bedrijf</label>
          <input
            type="text"
            name="bedrijf"
            value={formData.bedrijf}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>

        <button type="submit" className="submit-button">
          Inchecken
        </button>
      </form>
    </div>
  );

  const renderSuccess = () => (
    <div className="success-container">
      <div className="success-icon">
        <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p className="greetingName">
        Welkom {formData.voornaam} {formData.achternaam}
      </p>
      <p className="greetingMessage">Neem alstublieft plaats. We zijn zo bij u.</p>
    </div>
  );

  useEffect(() => {
    fetchCheckins();

    // Make sure your CSS file doesn't have any touch-related styles that might interfere
    // Add this meta tag to your HTML head if possible:
    // <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    
    // No need to manually unsubscribe as Firebase handles this automatically
    // when the component unmounts
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onLogoClick={() => setStep('welcome')} />

      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
          {step === 'welcome' && !submitted && renderWelcomeScreen()}
          {step === 'form' && !submitted && renderForm()}
          {submitted && renderSuccess()}
        </div>
      </main>
    </div>
  );
};

export default CheckInKiosk;