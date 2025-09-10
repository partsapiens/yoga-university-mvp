import React from 'react';
import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Legal Information</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Access important legal information about Yoga Flow University, including our terms of service, 
              privacy policy, and company imprint.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Imprint */}
              <Link 
                href="/legal/imprint"
                className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow block"
              >
                <h2 className="text-xl font-semibold text-blue-900 mb-3">Imprint</h2>
                <p className="text-blue-700 text-sm">
                  Legal disclosure and company information as required by law.
                </p>
              </Link>

              {/* Privacy Policy */}
              <Link 
                href="/legal/privacy"
                className="bg-green-50 border border-green-200 rounded-lg p-6 hover:shadow-md transition-shadow block"
              >
                <h2 className="text-xl font-semibold text-green-900 mb-3">Privacy Policy</h2>
                <p className="text-green-700 text-sm">
                  How we collect, use, and protect your personal information.
                </p>
              </Link>

              {/* Terms of Service */}
              <Link 
                href="/legal/terms"
                className="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:shadow-md transition-shadow block"
              >
                <h2 className="text-xl font-semibold text-purple-900 mb-3">Terms of Service</h2>
                <p className="text-purple-700 text-sm">
                  Terms and conditions for using our platform and services.
                </p>
              </Link>
            </div>

            {/* Contact Information */}
            <div className="mt-12 bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about our legal policies or need to contact us regarding 
                legal matters, please reach out to us.
              </p>
              <div className="text-sm text-gray-500">
                <p>Email: legal@yogaflowuniversity.com</p>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}