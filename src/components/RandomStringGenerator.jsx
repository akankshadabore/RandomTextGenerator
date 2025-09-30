import { useState, useCallback, useEffect } from 'react';
import { RefreshCw, Copy, Settings, Check } from 'lucide-react';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Slider from '../components/Slider';
import useClipboard from '../hooks/useClipboard';

const RandomStringGenerator = () => {
  const [generatedString, setGeneratedString] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [history, setHistory] = useState([]);
  const [autoGenerate, setAutoGenerate] = useState(false);

  const { copied, copy } = useClipboard();

  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const generateString = useCallback(() => {
    let chars = '';
    if (includeUppercase) chars += charSets.uppercase;
    if (includeLowercase) chars += charSets.lowercase;
    if (includeNumbers) chars += charSets.numbers;
    if (includeSymbols) chars += charSets.symbols;

    if (!chars) {
      setGeneratedString('Please select at least one character type');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setGeneratedString(result);
    setHistory(prev => [result, ...prev.slice(0, 4)]);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    if (autoGenerate) {
      const interval = setInterval(generateString, 2000);
      return () => clearInterval(interval);
    }
  }, [autoGenerate, generateString]);

  useEffect(() => {
    generateString();
  }, [generateString]);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Random String Generator
            </h1>
            <p className="text-gray-600">
              Generate secure random strings with customizable options
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Generated String:</label>
              <Button
                onClick={() => copy(generatedString)}
                className="bg-blue-600 text-white hover:bg-blue-700 text-sm px-3 py-1.5"
                disabled={!generatedString || generatedString.includes('Please select')}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="font-mono text-base break-all text-gray-800">
                {generatedString || 'Click generate to create a string'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Length: {length}
              </label>
              <Slider value={length} min={4} max={50} onChange={(e) => setLength(parseInt(e.target.value))} />
            </div>

            <div className="flex items-center justify-center md:justify-start">
              <Checkbox
                label="Auto-generate every 2s"
                checked={autoGenerate}
                onChange={(e) => setAutoGenerate(e.target.checked)}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Settings size={16} /> Character Types
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Checkbox 
                label="Uppercase (A-Z)" 
                checked={includeUppercase} 
                onChange={(e) => setIncludeUppercase(e.target.checked)} 
              />
              <Checkbox 
                label="Lowercase (a-z)" 
                checked={includeLowercase} 
                onChange={(e) => setIncludeLowercase(e.target.checked)} 
              />
              <Checkbox 
                label="Numbers (0-9)" 
                checked={includeNumbers} 
                onChange={(e) => setIncludeNumbers(e.target.checked)} 
              />
              <Checkbox 
                label="Symbols (!@#$%...)" 
                checked={includeSymbols} 
                onChange={(e) => setIncludeSymbols(e.target.checked)} 
              />
            </div>
          </div>

          <Button
            onClick={generateString}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 justify-center"
          >
            <RefreshCw size={18} /> Generate New String
          </Button>
        </div>

        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Recent Strings</h3>
            <div className="space-y-3">
              {history.map((str, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <code className="text-sm font-mono flex-1 mr-3 break-all text-gray-800">{str}</code>
                  <Button 
                    onClick={() => copy(str)} 
                    className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1"
                  >
                    <Copy size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomStringGenerator;
