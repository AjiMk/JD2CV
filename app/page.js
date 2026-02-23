import Link from 'next/link'
import { FiFileText, FiZap, FiDownload, FiEdit3, FiCheckCircle, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi'
import Footer from '@/components/Footer'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            <div className="flex items-center">
              <FiFileText className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">JD2CV</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold mb-6">
              <FiTrendingUp className="h-4 w-4 mr-2" />
              Trusted by 10,000+ job seekers
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
              Create <span className="text-primary-600">ATS-Friendly</span>
              <br />
              Resumes in Minutes
            </h1>
            
            <p className="mt-4 text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Generate professional FAANG-path format resumes tailored to your job descriptions.
              Beat the ATS and land your dream job with AI-powered optimization.
            </p>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FiFileText className="h-5 w-5 mr-2" />
                Start Building Your Resume
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all shadow-lg border-2 border-primary-600 hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="h-5 w-5 text-green-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="h-5 w-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="h-5 w-5 text-green-500" />
                <span>Export as PDF</span>
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
        <div className="bg-white py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create your perfect resume in just 4 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Sign Up', desc: 'Create your free account in seconds', icon: FiUsers },
                { step: '2', title: 'Fill Details', desc: 'Add your experience, skills, and education', icon: FiEdit3 },
                { step: '3', title: 'Optimize', desc: 'Paste job description for AI optimization', icon: FiZap },
                { step: '4', title: 'Download', desc: 'Export your ATS-friendly resume as PDF', icon: FiDownload },
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

        {/* Stats Section */}
        <div className="py-12 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Build Your Dream Resume?
            </h2>
            <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of job seekers who have successfully landed interviews with our ATS-optimized resumes.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiAward className="h-5 w-5 mr-2" />
              Get Started for Free
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
