
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold text-green-primary">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <div className="space-y-3">
              <h3 className="font-medium">Personal Information:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Name, email address, and phone number</li>
                <li>Payment information (processed securely through encrypted channels)</li>
                <li>Transaction history and preferences</li>
              </ul>
              <h3 className="font-medium">Technical Information:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Device information and operating system</li>
                <li>App usage analytics and performance data</li>
                <li>IP address and location data (when permitted)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Process mobile recharges and bill payments</li>
              <li>Maintain your account and provide customer support</li>
              <li>Send transaction confirmations and service updates</li>
              <li>Improve our services and user experience</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>With telecom operators and service providers to process transactions</li>
              <li>With payment processors for secure transaction handling</li>
              <li>When required by law or legal proceedings</li>
              <li>To protect our rights, privacy, safety, or property</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement robust security measures including encryption, secure servers, and regular security audits. Payment information is processed through PCI-DSS compliant systems and is never stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information only as long as necessary to provide services and comply with legal obligations. Transaction records are kept for accounting and regulatory purposes as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Access and review your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of promotional communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use essential cookies and similar technologies to provide functionality, analyze usage, and improve performance. You can manage cookie preferences through your device settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for children under 13. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the information immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. International Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              For any privacy-related questions or to exercise your rights, contact us at privacy@greencharge.com or through the app's support section.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
