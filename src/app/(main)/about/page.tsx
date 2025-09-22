import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Award, Heart, BookOpen, Star, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const team = [
    {
      name: "Dr. Sarah Müller",
      role: "Founder & Lead Instructor",
      experience: "15+ years",
      credentials: ["RYT-500", "PhD in Movement Science", "Certified Ayurveda Practitioner"],
      bio: "Sarah combines traditional yoga wisdom with modern movement science to create transformative learning experiences.",
      image: "https://imagine-public.x.ai/imagine-public/images/f21e3eeb-40b7-48a5-a4eb-80c2f9706eb6.png?cache=1"
    },
    {
      name: "Marcus Chen",
      role: "Senior Yoga Teacher",
      experience: "12+ years",
      credentials: ["E-RYT 500", "Yin Yoga Specialist", "Meditation Teacher"],
      bio: "Marcus brings a gentle yet powerful approach to yoga, specializing in restorative and yin practices.",
      image: "https://imagine-public.x.ai/imagine-public/images/b904932d-abd8-490d-a178-c4777b00962c.png?cache=1"
    },
    {
      name: "Luna Rodriguez",
      role: "Vinyasa Flow Specialist",
      experience: "8+ years",
      credentials: ["RYT-500", "Prenatal Yoga Certified", "Trauma-Informed Yoga"],
      bio: "Luna creates dynamic flows that honor both strength and flexibility, welcoming practitioners of all levels.",
      image: "https://imagine-public.x.ai/imagine-public/images/b5feb0e6-896f-492b-a45e-ff4d4721adf6.png?cache=1"
    }
  ];

  const achievements = [
    { number: "10,000+", label: "Students Trained" },
    { number: "500+", label: "Poses in Library" },
    { number: "50+", label: "Partner Studios" },
    { number: "15", label: "Countries Reached" }
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Inclusive Practice",
      description: "Yoga is for every body. We create welcoming spaces where all practitioners can grow and thrive."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Evidence-Based Teaching",
      description: "We blend traditional wisdom with modern research to provide safe, effective instruction."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Connection",
      description: "Building bridges between practitioners worldwide through shared learning and growth."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Excellence in Education",
      description: "Committed to the highest standards in yoga teacher training and continuing education."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About Yoga Flow University
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Empowering yogis worldwide with comprehensive training, innovative technology, 
              and a commitment to authentic, accessible yoga education.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              We believe yoga should be accessible to everyone, everywhere. Our mission is to break down 
              barriers to quality yoga education through innovative technology, expert instruction, and 
              a supportive global community.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Whether you&apos;re beginning your yoga journey or deepening your practice as a teacher, 
              we provide the tools, knowledge, and guidance you need to flourish.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800 dark:to-purple-800 rounded-2xl flex items-center justify-center">
              <div className="text-8xl">🧘‍♀️</div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These core principles guide everything we do, from curriculum design to community building.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our experienced instructors bring decades of combined expertise in yoga, movement science, and education.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800 dark:to-purple-800 flex items-center justify-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {member.experience} teaching experience
                </p>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {member.credentials.map((credential, credIndex) => (
                      <span 
                        key={credIndex}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {credential}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Students Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hear from practitioners and teachers who have transformed their practice with our platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Emma Thompson",
                role: "Yoga Teacher, London",
                text: "The 🤖 flow builder has revolutionized how I plan my classes. My students love the personalized sequences!",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Practitioner, San Francisco", 
                text: "Finally, a platform that grows with my practice. The detailed pose instructions are incredibly helpful.",
                rating: 5
              },
              {
                name: "Sofia Rodriguez",
                role: "Studio Owner, Barcelona",
                text: "We've integrated this into our teacher training program. The comprehensive platform is a game-changer.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credentials & Certifications */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Accreditations & Partnerships</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We&apos;re proud to be recognized by leading yoga organizations worldwide.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { name: "Yoga Alliance", logo: "🏆" },
              { name: "International Yoga Federation", logo: "🌟" },
              { name: "European Yoga Union", logo: "✨" },
              { name: "Certified B Corp", logo: "🌱" }
            ].map((cert, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{cert.logo}</div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{cert.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Active Users", icon: "👥" },
              { number: "500+", label: "Certified Teachers", icon: "🧘‍♀️" },
              { number: "50+", label: "Partner Studios", icon: "🏢" },
              { number: "15", label: "Countries", icon: "🌍" }
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their practice and teaching through our programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/poses"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
              >
                Explore Pose Library
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/flows/create"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
              >
                Create Flow
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}