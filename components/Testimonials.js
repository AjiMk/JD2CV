'use client'

import { FiStar } from 'react-icons/fi'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Software Engineer at Google",
      image: "SM",
      rating: 5,
      text: "I applied to 30+ jobs with no luck. After creating an ATS-optimized resume here, I got 5 interviews in one week! Landed my dream job at Google!",
      color: "from-blue-400 to-blue-600"
    },
    {
      name: "David Chen",
      role: "Product Manager at Amazon",
      image: "DC",
      rating: 5,
      text: "The AI suggestions saved me hours. My resume went from generic to compelling in minutes. Got callbacks from Amazon, Microsoft, and Meta!",
      color: "from-purple-400 to-purple-600"
    },
    {
      name: "Emily Rodriguez",
      role: "Data Analyst at Meta",
      image: "ER",
      rating: 5,
      text: "As a career switcher, I had no idea how to structure my resume. This tool made it so easy! The templates are professional and modern.",
      color: "from-pink-400 to-pink-600"
    },
    {
      name: "Michael Thompson",
      role: "UX Designer at Apple",
      image: "MT",
      rating: 5,
      text: "My old resume was getting rejected by ATS. This builder fixed that instantly. Interview rate went from 0% to 40%!",
      color: "from-green-400 to-green-600"
    },
    {
      name: "Priya Sharma",
      role: "Marketing Manager at Tesla",
      image: "PS",
      rating: 5,
      text: "The JD optimization feature is brilliant. It automatically highlights relevant skills for each job. Makes customizing resumes super fast!",
      color: "from-yellow-400 to-yellow-600"
    },
    {
      name: "James Wilson",
      role: "Full Stack Developer at Netflix",
      image: "JW",
      rating: 5,
      text: "Best resume builder I've used. Simple, fast, and the results are impressive. Created my resume in under 10 minutes!",
      color: "from-red-400 to-red-600"
    }
  ]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Join 10,000+ Job Seekers Who Got Hired
          </h2>
          <p className="text-base text-gray-600">Real people, real results</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
