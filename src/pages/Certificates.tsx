import React, { useState, useRef } from 'react';
import { Download, Eye, Calendar, CheckCircle, ArrowLeft, Shield, X, Printer } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';

export function Certificates() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [viewingCertificate, setViewingCertificate] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<{status: 'success' | 'error' | null, message: string}>({
    status: null,
    message: ''
  });
  const certificateRef = useRef<HTMLDivElement>(null);

  // Mock certificate data
  const certificates = [
    {
      id: '1',
      courseName: 'English for Beginners',
      issuedDate: '2024-01-15',
      certificateUrl: '#',
      verificationCode: 'ENG-2024-001',
      status: 'issued',
      content: `
        <div style="font-family: 'Times New Roman', serif; text-align: center; padding: 40px; border: 10px double #ccc;">
          <h1 style="font-size: 28px; color: #333; margin-bottom: 20px;">Certificate of Completion</h1>
          <p style="font-size: 18px; margin-bottom: 30px;">This is to certify that</p>
          <h2 style="font-size: 24px; color: #000; margin-bottom: 30px;">${user?.name}</h2>
          <p style="font-size: 18px; margin-bottom: 30px;">has successfully completed the course</p>
          <h3 style="font-size: 22px; color: #333; margin-bottom: 30px;">English for Beginners</h3>
          <p style="font-size: 16px; margin-bottom: 10px;">with a grade of <strong>A</strong></p>
          <p style="font-size: 16px; margin-bottom: 40px;">Date: January 15, 2024</p>
          <div style="display: flex; justify-content: space-between; margin-top: 50px;">
            <div style="text-align: center; width: 40%;">
              <div style="border-top: 1px solid #000; padding-top: 10px;">Dr. Priya Sharma</div>
              <p>Course Instructor</p>
            </div>
            <div style="text-align: center; width: 40%;">
              <div style="border-top: 1px solid #000; padding-top: 10px;">LinguaLearn</div>
              <p>Certificate ID: ENG-2024-001</p>
            </div>
          </div>
        </div>
      `
    },
    {
      id: '2',
      courseName: 'Hindi Grammar Basics',
      issuedDate: '2024-02-20',
      certificateUrl: '#',
      verificationCode: 'HIN-2024-002',
      status: 'issued',
      content: `
        <div style="font-family: 'Times New Roman', serif; text-align: center; padding: 40px; border: 10px double #ccc;">
          <h1 style="font-size: 28px; color: #333; margin-bottom: 20px;">Certificate of Completion</h1>
          <p style="font-size: 18px; margin-bottom: 30px;">This is to certify that</p>
          <h2 style="font-size: 24px; color: #000; margin-bottom: 30px;">${user?.name}</h2>
          <p style="font-size: 18px; margin-bottom: 30px;">has successfully completed the course</p>
          <h3 style="font-size: 22px; color: #333; margin-bottom: 30px;">Hindi Grammar Basics</h3>
          <p style="font-size: 16px; margin-bottom: 10px;">with a grade of <strong>B+</strong></p>
          <p style="font-size: 16px; margin-bottom: 40px;">Date: February 20, 2024</p>
          <div style="display: flex; justify-content: space-between; margin-top: 50px;">
            <div style="text-align: center; width: 40%;">
              <div style="border-top: 1px solid #000; padding-top: 10px;">Dr. Priya Sharma</div>
              <p>Course Instructor</p>
            </div>
            <div style="text-align: center; width: 40%;">
              <div style="border-top: 1px solid #000; padding-top: 10px;">LinguaLearn</div>
              <p>Certificate ID: HIN-2024-002</p>
            </div>
          </div>
        </div>
      `
    },
  ];

  const handleGoBack = () => {
    if (viewingCertificate) {
      setViewingCertificate(null);
    } else {
      window.history.back();
    }
  };

  const handleDownloadCertificate = async (certificate: any) => {
    setIsLoading(true);
    
    try {
      if (viewingCertificate && certificateRef.current) {
        // Use html2canvas to capture the certificate as an image
        const canvas = await html2canvas(certificateRef.current, {
          scale: 2, // Higher scale for better quality
          backgroundColor: '#ffffff',
          logging: false
        });
        
        // Create PDF with proper dimensions
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgWidth = 297; // A4 landscape width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${certificate.courseName.replace(/\s+/g, '-').toLowerCase()}-certificate.pdf`);
        
        alert('Certificate downloaded successfully as PDF!');
      } else {
        // If not viewing, first set the viewing certificate, then download after a delay
        setViewingCertificate(certificate);
        setTimeout(async () => {
          if (certificateRef.current) {
            const canvas = await html2canvas(certificateRef.current, {
              scale: 2,
              backgroundColor: '#ffffff',
              logging: false
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: 'a4'
            });
            
            const imgWidth = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`${certificate.courseName.replace(/\s+/g, '-').toLowerCase()}-certificate.pdf`);
            
            alert('Certificate downloaded successfully as PDF!');
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCertificate = (certificate: any) => {
    setViewingCertificate(certificate);
  };

  const handlePrintCertificate = () => {
    if (certificateRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Certificate</title>
              <style>
                body { margin: 0; padding: 20px; }
                @media print {
                  body { margin: 0; padding: 0; }
                }
              </style>
            </head>
            <body>
              ${viewingCertificate.content}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    }
  };

  const handleVerifyCertificate = () => {
    if (!verificationCode) {
      setVerificationResult({
        status: 'error',
        message: 'Please enter a verification code'
      });
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const certificate = certificates.find(c => c.verificationCode === verificationCode);
      
      if (certificate) {
        setVerificationResult({
          status: 'success',
          message: `Certificate for "${certificate.courseName}" issued to ${user?.name} on ${new Date(certificate.issuedDate).toLocaleDateString()} is valid.`
        });
      } else {
        setVerificationResult({
          status: 'error',
          message: 'Invalid verification code. Certificate not found or has been revoked.'
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  // Certificate Viewer
  if (viewingCertificate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoBack}
              className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certificate Preview</h1>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handlePrintCertificate}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={() => handleDownloadCertificate(viewingCertificate)}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Downloading...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div ref={certificateRef} dangerouslySetInnerHTML={{ __html: viewingCertificate.content }} />
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Verified Certificate</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Verification Code: {viewingCertificate.verificationCode}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={handleGoBack}
          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors lg:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.role === 'student' ? 'My Certificates' : 'Certificate Management'}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {user?.role === 'student' 
              ? 'View and download your earned certificates'
              : 'Manage and issue certificates to students'
            }
          </p>
        </div>
      </div>

      {/* Certificate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Certificates</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{certificates.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Certificates List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Earned Certificates</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{certificate.courseName}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Issued: {new Date(certificate.issuedDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span>ID: {certificate.verificationCode}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewCertificate(certificate)}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg"
                    title="View Certificate"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDownloadCertificate(certificate)}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    <span>{isLoading ? 'Downloading...' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {certificates.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <CheckCircle className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No certificates yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Complete courses to earn your first certificate!</p>
        </div>
      )}

      {/* Certificate Verification */}
      <div className="bg-blue-50 dark:bg-blue-900 rounded-xl border border-blue-200 dark:border-blue-700 p-6">
        <div className="flex items-start space-x-3 mb-4">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Verify a Certificate</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
              Enter a certificate verification code to check its authenticity
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter certificate verification code"
            className="flex-1 p-3 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button 
            onClick={handleVerifyCertificate}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Verify'
            )}
          </button>
        </div>
        
        {verificationResult.status && (
          <div className={`mt-4 p-4 rounded-lg ${
            verificationResult.status === 'success' 
              ? 'bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800' 
              : 'bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start space-x-2">
              {verificationResult.status === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              ) : (
                <X className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              )}
              <div className={verificationResult.status === 'success' 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-red-700 dark:text-red-300'
              }>
                {verificationResult.message}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}