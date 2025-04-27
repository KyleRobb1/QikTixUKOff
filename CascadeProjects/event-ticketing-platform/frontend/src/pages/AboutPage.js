import React from 'react';
import { FaUsers, FaHandshake, FaLightbulb, FaHeart } from 'react-icons/fa';

const AboutPage = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
      bio: 'Former event manager with 10+ years of experience in the industry.'
    },
    {
      name: 'David Chen',
      role: 'CTO',
      image: 'https://randomuser.me/api/portraits/men/44.jpg',
      bio: 'Tech enthusiast with a passion for creating seamless digital experiences.'
    },
    {
      name: 'Olivia Martinez',
      role: 'Head of Customer Success',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      bio: 'Dedicated to ensuring every user has an amazing experience with EventNest.'
    },
    {
      name: 'James Wilson',
      role: 'Marketing Director',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      bio: 'Creative strategist helping connect event organizers with their perfect audience.'
    }
  ];

  // Core values data
  const coreValues = [
    {
      icon: <FaUsers className="h-6 w-6 text-primary-500" />,
      title: 'Community First',
      description: 'We believe in the power of events to bring people together and create meaningful connections.'
    },
    {
      icon: <FaHandshake className="h-6 w-6 text-primary-500" />,
      title: 'Trust & Transparency',
      description: 'We\'re committed to being honest, reliable, and accountable in everything we do.'
    },
    {
      icon: <FaLightbulb className="h-6 w-6 text-primary-500" />,
      title: 'Innovation',
      description: 'We\'re constantly improving our platform to make event discovery and ticketing better for everyone.'
    },
    {
      icon: <FaHeart className="h-6 w-6 text-primary-500" />,
      title: 'Passion',
      description: 'We\'re passionate about events and helping organizers share their experiences with the world.'
    }
  ];

  return (
    <div className="bg-white">
      {/* SEO would normally use Helmet, but we'll use document.title for simplicity */}
      {document.title = 'About Us | EventNest'}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">About EventNest</h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto">
            Making event discovery and ticketing seamless and accessible for everyone.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Our Story</h2>
              <div className="mt-6 text-gray-600 space-y-6">
                <p>
                  EventNest was born out of a simple frustration: why was it so complicated to discover and book tickets to great events? In 2020, our founder Sarah Johnson, a former event manager, decided there had to be a better way.
                </p>
                <p>
                  After experiencing the challenges of event ticketing from both sides—as an organizer trying to sell tickets and as an attendee trying to find and purchase them—Sarah assembled a team of tech enthusiasts and event lovers to create a solution.
                </p>
                <p>
                  We launched EventNest with a clear mission: to make event discovery and ticketing seamless, accessible, and enjoyable for everyone. Since then, we've helped thousands of event organizers connect with their audiences and enabled countless attendees to discover experiences they love.
                </p>
                <p>
                  Today, EventNest is more than just a ticketing platform—we're a community that brings people together through shared experiences and memorable events.
                </p>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <img
                className="rounded-lg shadow-lg object-cover"
                src="https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Team collaboration"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Values</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at EventNest.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Meet Our Team</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              The passionate people behind EventNest working to make your event experience amazing.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  className="w-full h-64 object-cover"
                  src={member.image}
                  alt={member.name}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-primary-600 font-medium">{member.role}</p>
                  <p className="mt-3 text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold">Join the EventNest Community</h2>
          <p className="mt-4 text-xl max-w-3xl mx-auto">
            Whether you're organizing events or attending them, we're here to make your experience exceptional.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <a
              href="/events"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-100"
            >
              Explore Events
            </a>
            <a
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md shadow-sm text-white hover:bg-primary-800"
            >
              Sign Up
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
