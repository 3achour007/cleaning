import Navbar from './../../compononts/Navbar';
import Footer from './../../compononts/Footer';
import ContactForm from './../../compononts/ContactForm';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <section id="contact" className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl font-bold text-center mb-8"
            style={{
              color: '#432db5',
              textShadow: '2px 2px 8px #FF0000',
            }}
          >
            Contact Us
          </h1>
          <ContactForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
