import { useState } from 'react';

const MIN_NAME_LENGTH = 3;
const MIN_MESSAGE_LENGTH = 10;

const formDefaults = {
  'form-name': 'contact',
  name: '',
  email: '',
  message: '',
};

const validatedDefault = {
  name: true,
  message: true,
};

export default function Home() {
  const [formContents, setFormContents] = useState(formDefaults);
  const [validated, setValidated] = useState(validatedDefault);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormContents((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage('');

    if (validated[e.target.name] === false) {
      validateFields();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateFields()) {
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formContents).toString(),
      })
        .then((res) => {
          if (res.status === 200) {
            alert('Message sent!');

            setFormContents(formDefaults);
            setErrorMessage('');
          } else throw new Error(`${res.status} - ${res.statusText}`);
        })
        .catch((error) => {
          setErrorMessage(
            `Oops, looks like there was an error while sending your message: ${error.message}`
          );
        });
    }
  };

  const validateFields = () => {
    let tempValidated = true;

    if (formContents.name.replace(/[^A-Z]/gi, '').length < MIN_NAME_LENGTH) {
      setValidated((prev) => ({ ...prev, name: false }));
      tempValidated = false;
    } else setValidated((prev) => ({ ...prev, name: true }));

    if (
      formContents.message.replace(/[^A-Z0-9]/gi, '').length <
      MIN_MESSAGE_LENGTH
    ) {
      setValidated((prev) => ({ ...prev, message: false }));
      tempValidated = false;
    } else setValidated((prev) => ({ ...prev, message: true }));

    return tempValidated;
  };

  return (
    <div className='container mx-auto max-w-lg'>
      <h1 className='text-3xl font-bold text-center'>Contact Form</h1>

      <form
        className='flex flex-col space-y-4'
        name='contact'
        method='POST'
        action='/'
        data-netlify='true'
        data-netlify-honeypot='bot-sniffer'
        onSubmit={handleSubmit}
      >
        <input type='hidden' name='form-name' value='contact' />
        <label className='hidden'>
          <input name='bot-sniffer' />
        </label>

        <label className='flex flex-col'>
          <span className='text-lg font-bold'>Name</span>
          <input
            className='border border-gray-300 rounded-md'
            type='text'
            name='name'
            placeholder='Name (required)'
            value={formContents.name}
            onChange={handleChange}
            required
          />
          {validated.name === false && (
            <div className='text-red-500 text-sm'>
              Please enter a name at least
              {' ' + MIN_NAME_LENGTH + ' '}
              characters long.
            </div>
          )}
        </label>

        <label className='flex flex-col'>
          <span className='text-lg font-bold'>Email</span>
          <input
            className='border border-gray-300 rounded-md'
            type='email'
            name='email'
            placeholder='Email address'
            value={formContents.email}
            onChange={handleChange}
          />
        </label>

        <label className='flex flex-col'>
          <span className='text-lg font-bold'>Message</span>
          <textarea
            className='border border-gray-300 rounded-md'
            name='message'
            placeholder='Message (required)'
            value={formContents.message}
            onChange={handleChange}
            required
          />
          {validated.message === false && (
            <div className='text-red-500 text-sm'>
              Please enter a message at least
              {' ' + MIN_MESSAGE_LENGTH + ' '}
              characters long.
            </div>
          )}
        </label>

        {errorMessage !== '' && (
          <div className='flex justify-center'>
            <div className='text-red-500 text-sm'>{errorMessage}</div>
          </div>
        )}

        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
          Submit
        </button>
      </form>
    </div>
  );
}
