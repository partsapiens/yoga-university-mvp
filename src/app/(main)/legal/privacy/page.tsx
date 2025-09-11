import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
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

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            {/* TODO: Customize privacy policy for actual data practices */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800 text-sm">
                <strong>Privacy-First Approach:</strong> We prioritize your privacy and use minimal, 
                privacy-friendly analytics to improve our service.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <div className="mb-6 text-gray-600">
              <h3 className="font-medium text-gray-900 mb-2">Local Storage</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>Meditation session statistics (streak, last session date)</li>
                <li>Saved yoga flows and practice preferences</li>
                <li>User interface preferences (dark mode, language)</li>
                <li>Practice timer settings and customizations</li>
              </ul>
              
              <h3 className="font-medium text-gray-900 mb-2">Analytics Data (Privacy-Friendly)</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>Page views and navigation patterns (anonymized)</li>
                <li>Click-through rates on call-to-action buttons</li>
                <li>Outbound link tracking for content improvement</li>
                <li>Basic device and browser information for optimization</li>
              </ul>

              <h3 className="font-medium text-gray-900 mb-2">Account Data (Optional)</h3>
              <ul className="list-disc pl-5">
                <li>Email address for account creation</li>
                <li>Profile information you choose to provide</li>
                <li>Practice history and progress (if synced)</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <div className="mb-6 text-gray-600">
              <ul className="list-disc pl-5">
                <li>Enhance your personal yoga and meditation experience</li>
                <li>Save your progress and preferences locally on your device</li>
                <li>Improve our platform based on usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Ensure technical functionality and performance</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Storage and Security</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-4">
                Most of your data is stored locally on your device using browser local storage. 
                This means your personal practice data never leaves your device unless you 
                explicitly choose to sync it with our servers.
              </p>
              <p className="mb-4">
                For analytics, we use privacy-focused tools that don&apos;t track individual users 
                and comply with GDPR requirements. No personal identifiers are stored in our 
                analytics systems.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <div className="mb-6 text-gray-600">
              <ul className="list-disc pl-5">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a portable format</li>
                <li><strong>Opt-out:</strong> Disable analytics tracking at any time</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-4">
                We use minimal cookies for essential functionality only:
              </p>
              <ul className="list-disc pl-5">
                <li>Session management for logged-in users</li>
                <li>User preferences (theme, language)</li>
                <li>Anonymous analytics (no personal identification)</li>
              </ul>
              <p className="mt-4">
                You can control cookie preferences in your browser settings. 
                Disabling cookies may affect some functionality.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-4">
                We integrate with privacy-focused third-party services:
              </p>
              <ul className="list-disc pl-5">
                <li>Analytics provider (privacy-compliant, no PII)</li>
                <li>CDN services for performance optimization</li>
                <li>Optional cloud sync for practice data (with explicit consent)</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Children&apos;s Privacy</h2>
            <div className="mb-6 text-gray-600">
              <p>
                Our service is not directed to children under 13. We do not knowingly collect 
                personal information from children under 13. If we become aware that we have 
                collected such information, we will take steps to delete it.
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-2">
                For privacy-related questions or to exercise your rights, contact us at:
              </p>
              <p className="mb-2"><strong>Email:</strong> privacy@yogaflowuniversity.com</p>
              <p><strong>Response Time:</strong> We aim to respond within 30 days</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p className="mt-2">
                We may update this privacy policy from time to time. We will notify you of any changes 
                by posting the new policy on this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}