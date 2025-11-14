import React, { useState, useCallback } from 'react';
import { PPMFormInputs } from '../types';
import PPMForm from './PPMForm';
import PPMSummary from './PPMSummary';
import { generatePPM } from '../services/geminiService';

const PPMGenerator: React.FC = () => {
  const [ppmOutput, setPpmOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // useCallback is used to memoize the handleGeneratePPM function, preventing unnecessary re-renders
  // and avoiding potential infinite loops if it were a dependency in other effects.
  const handleGeneratePPM = useCallback(async (inputs: PPMFormInputs) => {
    setIsLoading(true);
    setError(null);
    setPpmOutput(''); // Clear previous output
    try {
      const result = await generatePPM(inputs);
      setPpmOutput(result);
    } catch (err) {
      setError((err as Error).message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array ensures this function is created only once on mount

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
      <div className="lg:order-1"> {/* Order 1 for form on larger screens */}
        <PPMForm onSubmit={handleGeneratePPM} isLoading={isLoading} />
      </div>
      <div className="lg:order-2"> {/* Order 2 for summary on larger screens */}
        <PPMSummary ppmContent={ppmOutput} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};

export default PPMGenerator;