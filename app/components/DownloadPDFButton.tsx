'use client';
import React, { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import ResultPDF from './ResultPDF';
import { FaDownload } from 'react-icons/fa';

interface DownloadPDFButtonProps {
  score: string;
  country: string;
  literacyLevel: {
    title: string;
    suggestions: string[];
  };
  questionAnswers: boolean[];
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({ score, country, literacyLevel, questionAnswers }) => {
  const [isClient, setIsClient] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = async () => {
    if (!isClient) return;
    
    setIsLoading(true);
    setIsError(false);
    
    try {
      // Create PDF document
      const instance = pdf((
        <ResultPDF
          score={score}
          country={country}
          literacyLevel={literacyLevel}
          questionAnswers={questionAnswers}
        />
      ));

      // Generate blob with error handling
      let blob: Blob;
      try {
        blob = await instance.toBlob();
        if (!blob) throw new Error('Failed to generate PDF blob');
      } catch (blobError) {
        console.error('PDF blob generation error:', blobError);
        throw new Error('Could not generate PDF. Please try again.');
      }

      // Create and trigger download
      try {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `financial-literacy-report-${country.toLowerCase()}.pdf`;
        
        // Append, click, and cleanup with proper error handling
        document.body.appendChild(link);
        link.click();
        
        // Use setTimeout to ensure the download starts before cleanup
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      } catch (downloadError) {
        console.error('Download error:', downloadError);
        throw new Error('Could not download the PDF. Please try again.');
      }
    } catch (error) {
      console.error('Error in PDF generation/download:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className={`w-full sm:w-auto min-w-[200px] px-8 py-4 text-white rounded-xl transform transition-all hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-3 text-base sm:text-lg font-medium ${
        isLoading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : isError 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
      disabled={isLoading || !isClient}
    >
      <FaDownload className="w-5 h-5" />
      {!isClient 
        ? 'Loading...' 
        : isError 
        ? 'Error - Click to retry' 
        : isLoading 
        ? 'Preparing PDF...' 
        : 'Download Report'}
    </button>
  );
};

export default DownloadPDFButton;
