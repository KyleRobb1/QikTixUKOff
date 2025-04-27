import React, { useState } from 'react';
import { FaEnvelope, FaQuestionCircle, FaComments, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const SupportPage = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // FAQ state - tracks which questions are expanded
  const [expandedFaqs, setExpandedFaqs] = useState({});
  
  // FAQ data
  const faqs = [
    {
      question: 'How do I get a refund for my tickets?',
      answer: 'Refund policies are set by event organizers. To request a refund, go to your Tickets page, select the ticket you want to refund, and click the "Request Refund" button. The organizer will be notified and will process your request according to their refund policy.'
    },
    {
      question: 'How do I find my tickets after purchase?',
      answer: 'Your tickets are available in your account under the "My Tickets" section. You can access them by logging in and clicking on "My Tickets" in the navigation menu or profile dropdown. From there, you can view and download your tickets as PDF or access the QR code for event entry.'
    },
    {
      question: 'Can I transfer my ticket to someone else?',
      answer: 'Yes, most tickets on EventNest are transferable. Go to your Tickets page, select the ticket you want to transfer, and click "Transfer Ticket". Enter the recipient\'s email address, and they\'ll receive instructions on how to claim the ticket.'
    },
    {
      question: 'What happens if an event is canceled?',
      answer: 'If an event is canceled, you\'ll be notified via email. In most cases, you\'ll automatically receive a refund to your original payment method. The refund processing time depends on your payment provider and typically takes 5-10 business days.'
    },
    {
      question: 'How do I contact an event organizer?',
      answer: 'You can contact the event organizer directly from the event page. Scroll down to the "Organizer Information" section and click the "Contact Organizer" button. Fill out the form, and your message will be sent to the organizer.'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, EventNest uses industry-standard encryption and security protocols to protect your payment information. We never store your full credit card details on our servers. All payments are processed through secure payment gateways that comply with PCI DSS standards.'
    }
  ];
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send data to your backend API
      // which would then use AWS SES to send the email
      await axios.post('/api/support/contact', formData);
      
      // Show success message
      toast.success('Your message has been sent! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('There was an error sending your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Toggle FAQ expansion
  const toggleFaq = (index) => {
    setExpandedFaqs(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  return (
    <div className="bg-white">
      {/* SEO would normally use Helmet, but we'll use document.title for simplicity */}
      {document.title = 'Support & Help | EventNest'}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">How Can We Help?</h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto">
            Get support for your EventNest account, tickets, or event-related questions.
          </p>
        </div>
      </div>

      {/* Support Options Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Support Options</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the support option that works best for you.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaEnvelope className="h-10 w-10 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <p className="font-medium text-primary-600">support@eventnest.com</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaQuestionCircle className="h-10 w-10 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">FAQ</h3>
              <p className="text-gray-600 mb-4">
                Find quick answers to common questions in our FAQ section below.
              </p>
              <a href="#faq" className="font-medium text-primary-600 hover:text-primary-700">
                View FAQ
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaComments className="h-10 w-10 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">
                Chat with our support team in real-time during business hours.
              </p>
              <p className="font-medium text-primary-600">
                Available Monday-Friday, 9am-5pm EST
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Contact Us</h2>
            <p className="mt-4 text-lg text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="5"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600">
              Find answers to common questions about EventNest.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  {expandedFaqs[index] ? (
                    <FaChevronUp className="h-5 w-5 text-primary-500" />
                  ) : (
                    <FaChevronDown className="h-5 w-5 text-primary-500" />
                  )}
                </button>
                {expandedFaqs[index] && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help CTA */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold">Still Need Help?</h2>
          <p className="mt-4 text-xl max-w-3xl mx-auto">
            Our support team is always ready to assist you with any questions or issues.
          </p>
          <div className="mt-8">
            <a
              href="mailto:support@eventnest.com"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-100"
            >
              Email Our Support Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
