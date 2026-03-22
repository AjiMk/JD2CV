import Link from 'next/link'
import { FiFileText, FiZap, FiDownload, FiEdit3, FiCheckCircle, FiTrendingUp, FiUsers, FiAward, FiStar, FiTarget, FiClock } from 'react-icons/fi'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'
import Testimonials from '@/components/Testimonials'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center">
              <FiFileText className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-gray-100">JD2CV</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors font-medium"
              >
                Profile
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              <FiCheckCircle className="h-4 w-4 mr-2" />
              <span className="font-bold">FREE</span> · No credit card required
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
              Get Hired <span className="text-primary-600">2x Faster</span> with
              <br />
              AI-Powered ATS Resumes
            </h1>
            
            <p className="mt-4 text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands landing jobs at Google, Apple, Amazon & more.
              Create professional, ATS-optimized resumes in just 5 minutes.
            </p>
            
            {/* Stats Bar */}
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="flex -space-x-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                </div>
                <span className="font-semibold">10,247 resumes created today</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-600">
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <FiStar className="fill-current" />
                <span className="ml-1 text-gray-700 font-semibold">4.9/5 from 2,500+ reviews</span>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-primary-600 text-white rounded-lg text-base font-bold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FiFileText className="h-5 w-5 mr-2" />
                Create My Resume - It&apos;s Free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-gray-700 border-2 border-gray-300 rounded-lg text-base font-semibold hover:border-primary-600 hover:text-primary-600 transition-all shadow-md"
              >
                I Have an Account
              </Link>
            </div>
            
            {/* Value Props */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <FiTarget className="h-5 w-5 text-green-600" />
                <span><strong className="text-gray-900">95%</strong> ATS Pass Rate</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <FiTrendingUp className="h-5 w-5 text-blue-600" />
                <span><strong className="text-gray-900">2x</strong> More Interviews</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <FiClock className="h-5 w-5 text-purple-600" />
                <span><strong className="text-gray-900">5 min</strong> to Build</span>
              </div>
            </div>

            {/* Company Logos - Social Proof */}
            <div className="mt-10">
              <p className="text-sm text-gray-500 mb-4 font-medium">Trusted by employees at</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-2xl font-bold text-gray-700">Google</div>
                <div className="text-2xl font-bold text-gray-700">Amazon</div>
                <div className="text-2xl font-bold text-gray-700">Microsoft</div>
                <div className="text-2xl font-bold text-gray-700">Apple</div>
                <div className="text-2xl font-bold text-gray-700">Meta</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <FiFileText className="h-7 w-7 text-primary-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Smart Resume Builder
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Fill in your details once and generate multiple tailored resumes for different roles
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FiZap className="h-7 w-7 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                JD-Optimized
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Automatically match your resume to job descriptions for better ATS scores
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiDownload className="h-7 w-7 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                Easy Download
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Download your resume as high-quality PDF ready to submit instantly
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FiEdit3 className="h-7 w-7 text-orange-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                AI-Powered Editing
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Let AI help you improve and optimize your resume content professionally
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-12 mt-0">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
               Build Your Resume in 3 Simple Steps
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                No design skills needed. No complicated formatting. Just answer a few questions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Choose & Fill', desc: 'Select a template and fill in your details with AI-powered suggestions', icon: FiFileText },
                { step: '2', title: 'AI Optimize', desc: 'Paste job description. AI matches keywords and optimizes your resume', icon: FiZap },
                { step: '3', title: 'Download & Apply', desc: 'Export as PDF and start applying confidently', icon: FiDownload },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="relative mb-4">
                    <div className="w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto shadow-lg">
                      {item.step}
                    </div>
                    <item.icon className="h-8 w-8 text-primary-600 absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Stats Section */}
        <div className="py-12 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
                <div className="text-primary-100 text-lg">Resumes Created</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
                <div className="text-primary-100 text-lg">ATS Pass Rate</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">4.8/5</div>
                <div className="text-primary-100 text-lg">User Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQ />
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-12 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-base md:text-lg text-primary-100 mb-6 max-w-2xl mx-auto">
              Join 10,247 job seekers who created their resume today. Build yours in just 5 minutes.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3.5 bg-white text-primary-600 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl text-base"
            >
              <FiFileText className="h-5 w-5 mr-2" />
              Get Started - It&apos;s Free Forever
            </Link>
            <p className="mt-4 text-sm text-primary-200">No credit card required · Cancel anytime · Export as PDF</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
