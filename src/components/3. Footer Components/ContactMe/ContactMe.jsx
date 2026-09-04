import React, { useRef, useState } from 'react';
import './ContactMe.css';
import axios from 'axios';
import { Button } from 'pixel-retroui';
import { LLM_API_BASE_URL } from '../../../config';

const ContactMe = () => {
  const form = useRef();
  const [isMessageSent, setMessageSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const formData = new FormData(form.current);

    try {
      await axios.post(`${LLM_API_BASE_URL}/send`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      setMessageSent(true);
      setIsLoading(false);
      e.target.reset();
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to send message. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <section id="ContactMe">
      <div className="form-container wow fadeInRight" data-wow-delay=".4s">
        <div className="contact-form-wrapper d-flex justify-content-center">
          <form ref={form} onSubmit={sendEmail} className="contact-form">
            <h5 className="title">Contact Me</h5>
            <p className="description">
              Feel free to contact me if you’d like to reach out or have any questions.
            </p>

            <input
              type="text"
              className="form-control rounded border-white mb-3 form-input"
              name="name"
              placeholder="Name"
              required
            />
            <input
              type="email"
              className="form-control rounded border-white mb-3 form-input"
              name="email"
              placeholder="Email"
              required
            />
            <textarea
              className="form-control rounded border-white mb-3 form-text-area"
              name="message"
              rows="5"
              cols="30"
              placeholder="Message"
              required
            ></textarea>

            <div className="submit-button-wrapper" data-wow-delay=".6s">
              {isLoading && <p>Sending...</p>}
              {!isMessageSent ? (
                <Button type="submit" className="submit-button" disabled={isLoading} bg="#ef5b4d" textColor="#171717" shadow="#171717" borderColor="#171717">
                  Send
                </Button>
              ) : (
                <div className="success-message">
                  <h4>Message Sent Successfully!</h4>
                  <p>Thank you for contacting me.</p>
                </div>
              )}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactMe;
