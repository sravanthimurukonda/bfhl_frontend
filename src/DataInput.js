import React, { useState } from 'react';
import axios from 'axios';

const DataInput = () => {
    const [inputData, setInputData] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({
        is_success: true,
        user_id: true,
        email: true,
        roll_number: true,
        numbers: true,
        alphabets: true,
        highest_lowercase_alphabet: true,
        file_valid: true,
        file_mime_type: true,
        file_size_kb: true,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const jsonData = JSON.parse(inputData);
            const response = await axios.post('https://bhfl-backend-cabm.onrender.com/bfhl', jsonData);
            setResponseData(response.data);
        } catch (err) {
            console.error('Submission error:', err);
            setError('An error occurred while submitting data.');
            setResponseData(null);
        }
    };

    const renderResponse = () => {
        if (!responseData) return null;

        const output = {};
        for (const key in selectedOptions) {
            if (selectedOptions[key]) {
                output[key] = responseData[key];
            }
        }

        return <pre>{JSON.stringify(output, null, 2)}</pre>;
    };

    const handleOptionChange = (e) => {
        const { name, checked } = e.target;
        setSelectedOptions((prev) => ({ ...prev, [name]: checked }));
    };

    return (
        <div>
            <h1>Data Input</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    rows="5"
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    placeholder='Enter JSON here (e.g., {"data": ["A", "C", "Z", "c", "i"], "file_b64": "BASE_64_STRING"})'
                    required
                />
                <button
                    type="submit"
                    style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '10px 15px', cursor: 'pointer' }}
                >
                    Submit
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Select Response Options</h2>
            {Object.keys(selectedOptions).map(option => (
                <label key={option}>
                    <input
                        type="checkbox"
                        name={option}
                        checked={selectedOptions[option]}
                        onChange={handleOptionChange}
                    />
                    {option.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, c => c.toUpperCase())}
                </label>
            ))}
            <h2>Response</h2>
            {renderResponse()}
        </div>
    );
};

export default DataInput;
