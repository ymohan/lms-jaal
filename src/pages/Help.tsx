import React, { useState } from 'react';
import { Search, Book, MessageCircle, Phone, Mail, ChevronDown, ChevronRight } from 'lucide-react';

export function Help() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'How do I enroll in a course?',
      answer: 'To enroll in a course, navigate to the Courses page, find the course you want to join, and click the "Start Learning" button. You will be automatically enrolled and can begin learning immediately.',
    },
    {
      id: '2',
      question: 'Can I download certificates?',
      answer: 'Yes! Once you complete a course with a passing grade, you can download your certificate from the Certificates page. All certificates are digitally signed and include a verification code.',
    },
    {
      id: '3',
      question: 'How does the TPR methodology work?',
      answer: 'Total Physical Response (TPR) is a language learning method that uses physical movement to reinforce vocabulary and grammar. In our platform, you will see interactive exercises that ask you to perform specific actions while learning new words.',
    },
    {
      id: '4',
      question: 'What languages are supported?',
      answer: 'Currently, we support English, Hindi, and Tamil. The platform interface can be switched between these languages, and we offer courses for learning each of these languages.',
    },
    {
      id: '5',
      question: 'How do I reset my password?',
      answer: 'Click on the "Forgot Password" link on the login page, enter your email address, and follow the instructions sent to your email to reset your password.',
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <p className="mt-1 text-sm text-gray-600">
          Find answers to common questions and get support
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>
      </div>

      {/* Quick Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Book className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Getting Started</h3>
          <p className="text-sm text-gray-600">Learn how to use the platform and start your language learning journey</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <MessageCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Help</h3>
          <p className="text-sm text-gray-600">Find answers about courses, lessons, and learning methodologies</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Phone className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Support</h3>
          <p className="text-sm text-gray-600">Get help with technical issues and account problems</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {expandedFaq === faq.id ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Still need help?</h2>
        <p className="text-blue-800 mb-6">
          Can't find what you're looking for? Our support team is here to help you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Start Live Chat</span>
          </button>
          <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Send Email</span>
          </button>
        </div>
      </div>

      {/* Learning Resources */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Video Tutorials</h3>
            <div className="space-y-2">
              <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                • How to navigate the platform
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                • Understanding TPR methodology
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                • Taking quizzes effectively
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">User Guides</h3>
            <div className="space-y-2">
              <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                • Student handbook (PDF)
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                • Teacher guide (PDF)
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                • Admin manual (PDF)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}