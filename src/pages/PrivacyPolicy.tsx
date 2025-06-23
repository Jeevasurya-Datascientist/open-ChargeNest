// src/pages/PrivacyPolicy.tsx

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-green-700 hover:bg-green-100"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-green-800">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: June 23, 2024</p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6">
          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy describes how **Charge Nest** ("we," "us," or "our") collects, uses, and shares your information when you use our mobile application (the "Service").
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">1. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Information You Provide to Us:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
                  <li><strong>Phone Number:</strong> We collect your phone number for account creation, authentication, and essential service-related communications.</li>
                  <li><strong>Transaction Data:</strong> We collect details of your recharges and bill payments, including operator and amount, to process your requests and maintain your transaction history.</li>
                   <li><strong>Optional Profile Information:</strong> You may choose to provide additional information, such as your name, to personalize your account.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Information We Collect Automatically:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
                  <li><strong>Device and Usage Information:</strong> We collect data about your device (e.g., model, OS version) and how you interact with our Service to diagnose problems and improve user experience.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed">We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
              <li>To provide, operate, and maintain our Service.</li>
              <li>To process your transactions and send you related information, including confirmations and receipts.</li>
              <li>To provide customer support and respond to your inquiries.</li>
              <li>To monitor and analyze trends to improve and personalize the Service.</li>
              <li>To enhance the security of our Service and prevent fraudulent activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">3. How We Share Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We do not sell or rent your personal information. We may share your information with third parties only in the following situations:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>With Service Providers:</strong> We share information with telecom operators and billers to complete your transactions.</li>
              <li><strong>With Payment Processors:</strong> We work with secure, third-party payment gateways to process your payments. We do not store your full card or bank details on our servers.</li>
              <li><strong>For Legal Reasons:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We are committed to protecting your data. We use a combination of technical, administrative, and physical controls to maintain the security of your information, including encryption and secure server infrastructure.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">5. Your Privacy Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              You have the right to access, update, or request deletion of your personal information. You can manage your profile information directly within the app or by contacting our support team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">6. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy within the Service. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">7. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at: **privacy@chargenest.com**.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;