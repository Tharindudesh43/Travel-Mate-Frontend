import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>
        <p className="text-lg font-sans mb-6">
          At TravelMate, we are committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, and safeguard your
          information when you use our services.
        </p>
        <h2 className="text-2xl font-display font-bold mb-4">
          Information We Collect
        </h2>
        <p className="text-lg font-sans mb-6">
          We may collect personal information such as your name, email address,
          and travel preferences when you create an account or interact with our
          services. We also collect non-personal information such as browser
          type and usage data to improve our platform.
        </p>
        <h2 className="text-2xl font-display font-bold mb-4">
          How We Use Your Information
        </h2>
        <p className="text-lg font-sans mb-6">
          We use your information to provide and improve our services,
          personalize your experience, and communicate with you about updates
          and promotions. We do not sell or share your personal information with
          third parties for their marketing purposes.
        </p>
        <h2 className="text-2xl font-display font-bold mb-4">Data Security</h2>
        <p className="text-lg font-sans mb-6">
          We implement appropriate security measures to protect your information
          from unauthorized access, alteration, disclosure, or destruction.
          However, no method of transmission over the internet is completely
          secure, and we cannot guarantee absolute security.
        </p>
        <h2 className="text-2xl font-display font-bold mb-4">Your Rights</h2>
        <p className="text-lg font-sans mb-6">
          You have the right to access, correct, or delete your personal
          information. You can also opt-out of receiving promotional
          communications from us. To exercise these rights, please contact us at 
          <a> </a>
          <a
            href="mailto:privacy@travelmate.com"
            className="text-brand-gold hover:underline"
          >
            tharindudeshanhimahansa43@gmail.com
          </a>
        </p>
      </div>
      <Footer />
    </div>
  );
}
