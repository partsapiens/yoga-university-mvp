import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
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

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-green-800 text-sm">
                <strong>Effective Date:</strong> {new Date().toLocaleDateString()} | 
                <strong> Service:</strong> Yoga Flow University Platform
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-4">
                By accessing and using Yoga Flow University (&quot;the Service&quot;), you accept and agree to be 
                bound by the terms and provision of this agreement. If you do not agree to abide by the 
                above, please do not use this service.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-4">
                Yoga Flow University provides a ✨ powered platform for creating personalized yoga flows, 
                accessing pose libraries, guided meditation sessions, and educational resources for yoga 
                practitioners and teachers.
              </p>
              <p>
                The Service includes but is not limited to:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Yoga flow creation tools with 🤖 assistance</li>
                <li>Comprehensive pose library with instructions</li>
                <li>Meditation and breathing exercise sessions</li>
                <li>Educational resources and teacher training content</li>
                <li>Practice tracking and progress analytics</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <div className="mb-6 text-gray-600">
              <h3 className="font-medium text-gray-900 mb-2">Health and Safety</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>Consult healthcare providers before beginning any exercise program</li>
                <li>Practice yoga safely within your physical limitations</li>
                <li>Stop immediately if you experience pain or discomfort</li>
                <li>Use proper equipment and practice in a safe environment</li>
              </ul>

              <h3 className="font-medium text-gray-900 mb-2">Account Security</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Notify us immediately of any unauthorized account access</li>
                <li>Provide accurate and current information</li>
              </ul>

              <h3 className="font-medium text-gray-900 mb-2">Acceptable Use</h3>
              <ul className="list-disc pl-5">
                <li>Use the Service for personal, non-commercial purposes</li>
                <li>Respect intellectual property rights of content creators</li>
                <li>Do not share, distribute, or commercialize our content without permission</li>
                <li>Follow community guidelines and treat other users respectfully</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Health Disclaimer</h2>
            <div className="mb-6 text-gray-600 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="mb-4 font-medium text-red-800">
                IMPORTANT HEALTH NOTICE
              </p>
              <p className="mb-4 text-red-700">
                The yoga practices, meditation techniques, and fitness content provided through our Service 
                are for educational and informational purposes only. They are not intended as medical advice 
                or treatment.
              </p>
              <p className="mb-4 text-red-700">
                Before beginning any exercise program, including yoga and meditation practices:
              </p>
              <ul className="list-disc pl-5 text-red-700">
                <li>Consult with a qualified healthcare provider</li>
                <li>Inform your doctor of any health conditions or medications</li>
                <li>Get medical clearance if you have injuries or chronic conditions</li>
                <li>Stop immediately if you experience pain, dizziness, or discomfort</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-4">
                All content provided through the Service, including but not limited to text, graphics, 
                logos, images, audio clips, video clips, and software, is the property of Yoga Flow 
                University or its content suppliers and is protected by copyright and other intellectual 
                property laws.
              </p>
              <p>
                You may use our content for personal practice only. Commercial use, distribution, or 
                reproduction without written permission is prohibited.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Privacy and Data</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed 
                by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p>
                Key points:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Most data is stored locally on your device</li>
                <li>We use privacy-friendly analytics with no personal identification</li>
                <li>You control what data is shared or synced</li>
                <li>You can delete your data at any time</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Service Availability</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-4">
                We strive to provide reliable access to our Service, but we do not guarantee uninterrupted 
                availability. The Service may be temporarily unavailable due to maintenance, updates, or 
                technical issues.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the Service with or 
                without notice.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, YOGA FLOW UNIVERSITY SHALL NOT BE LIABLE FOR ANY 
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED 
                TO PERSONAL INJURY, ARISING FROM YOUR USE OF THE SERVICE.
              </p>
              <p>
                Your use of our yoga and meditation content is at your own risk. We are not responsible for 
                any injuries or health issues that may arise from your practice.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Termination</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-4">
                You may terminate your account at any time by contacting us or using account deletion 
                features. We may terminate or suspend your access to the Service for violation of these 
                Terms or for any other reason at our discretion.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of significant 
                changes via email or platform notifications. Continued use of the Service after changes 
                constitutes acceptance of the new Terms.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-2">
                For questions about these Terms of Service, contact us at:
              </p>
              <p className="mb-2"><strong>Email:</strong> legal@yogaflowuniversity.com</p>
              <p><strong>Response Time:</strong> We aim to respond within 5 business days</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
              <p className="mt-2">
                By using Yoga Flow University, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}