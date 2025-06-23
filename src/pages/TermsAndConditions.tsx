// src/pages/TermsAndConditions.tsx

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
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
          <h1 className="text-3xl font-bold text-green-800">Terms and Conditions</h1>
          {/* --- FIX: Static Last Updated Date --- */}
          <p className="text-muted-foreground mt-2">Last updated: June 23, 2024</p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the **Charge Nest** mobile application ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these, you are not authorized to use this Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed">
              **Charge Nest** provides a platform for mobile recharge and utility bill payment services. We act as an intermediary, facilitating transactions between users and third-party telecom operators and service providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">3. User Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>You must provide accurate, current, and complete information during the registration and transaction process.</li>
              <li>You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.</li>
              <li>You agree to use the Service only for lawful purposes and in accordance with these terms.</li>
              {/* --- NEW: Clause for user error --- */}
              <li>
                **You are solely responsible for verifying all transaction details (including phone number, operator, and amount) before confirming payment. Charge Nest is not liable for transactions processed based on incorrect information provided by you.**
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">4. Payment Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              All transactions are processed through secure payment gateways. Applicable service charges, if any, will be displayed to you before you confirm the transaction. Refunds for failed transactions are subject to the policies of the respective operators and banks, and may take 3-7 business days to process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">5. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              **Charge Nest** shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of our services, including but not limited to service interruptions or transaction failures that are beyond our reasonable control.
            </p>
            {/* --- NEW: Specific clause for company safety --- */}
            <p className="text-gray-700 leading-relaxed mt-2 font-semibold">
              Furthermore, Charge Nest holds no responsibility for any financial loss resulting from user error. This includes, but is not limited to, recharges made to an incorrect number, payments of an incorrect amount, or selecting the wrong service provider. Our platform provides clear guidance and confirmation steps, but the final responsibility for the accuracy of the information rests entirely with the user.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">6. Modifications to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms and conditions at any time. We will notify you of any significant changes by posting the new terms on the Service. Your continued use of the Service after such changes constitutes your acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">7. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in [Your City, Your State].
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-800">8. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For any questions or concerns regarding these terms, please contact our support team at **support@chargenest.com**.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
};

export default TermsAndConditions;