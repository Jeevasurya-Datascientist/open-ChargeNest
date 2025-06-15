
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-green-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-green-primary">Terms and Conditions</h1>
          <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using GreenCharge mobile application, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed">
              GreenCharge provides mobile recharge and bill payment services. We act as an intermediary platform connecting users with telecom operators and service providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the service only for lawful purposes</li>
              <li>Verify transaction details before confirming payments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Payment Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              All transactions are processed securely. Service charges may apply as displayed during the transaction process. Refunds are subject to operator policies and may take 3-5 business days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Limitations of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              GreenCharge shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of our services, including but not limited to service interruptions or transaction failures beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your personal and financial information. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Service Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              While we strive to maintain continuous service availability, we do not guarantee uninterrupted access. Scheduled maintenance and unforeseen circumstances may cause temporary service disruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes through the application or email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For any questions regarding these terms, please contact our support team through the application or email us at support@greencharge.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through binding arbitration.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
};

export default TermsAndConditions;
