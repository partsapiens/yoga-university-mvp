import React from 'react';
import Link from 'next/link';

export default function ImprintPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <Link 
              href="/legal" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Legal
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Imprint</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
            <div className="mb-6">
              <p className="mb-2"><strong>Company Name:</strong> Yoga Flow University GmbH</p>
              <p className="mb-2"><strong>Address:</strong> Musterstraße 123</p>
              <p className="mb-2"><strong>City:</strong> Berlin, 10115</p>
              <p className="mb-2"><strong>Country:</strong> Germany</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="mb-6">
              <p className="mb-2"><strong>Phone:</strong> +49 (0) 30 12345678</p>
              <p className="mb-2"><strong>Email:</strong> info@fltwht.com</p>
              <p className="mb-2"><strong>Website:</strong> https://fltwht.com</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Legal Representatives</h2>
            <div className="mb-6">
              <p className="mb-2"><strong>Managing Director:</strong> Dr. Sarah Müller</p>
              <p className="mb-2"><strong>Registration:</strong> HRB 123456 B (Amtsgericht Berlin)</p>
              <p className="mb-2"><strong>Tax ID:</strong> DE123456789</p>
              <p className="mb-2"><strong>VAT ID:</strong> DE123456789</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Disclaimer</h2>
            <div className="mb-6 text-sm text-gray-600">
              <p className="mb-4">
                The contents of our pages have been created with the utmost care. However, we cannot guarantee 
                the contents&apos; accuracy, completeness, or topicality. According to statutory provisions, we are 
                furthermore responsible for our own content on these web pages.
              </p>
              <p className="mb-4">
                In this matter, please note that we are not under obligation to supervise merely the transmitted 
                or saved information of third parties, or investigate circumstances pointing to illegal activity.
              </p>
              <p>
                Our obligations to remove or block the use of information under generally applicable laws remain 
                unaffected by this as per §§ 8 to 10 of the Telemedia Act (TMG).
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">EU Dispute Resolution</h2>
            <div className="mb-6 text-sm text-gray-600">
              <p>
                The European Commission provides a platform for online dispute resolution (ODR): 
                <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:text-blue-800 ml-1">
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}