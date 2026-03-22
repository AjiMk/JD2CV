export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">JD2CV</h3>
            <p className="text-sm text-gray-600">
              Create professional, ATS-friendly resumes tailored to your dream job.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#features" className="hover:text-primary-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Resume Guide</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Career Tips</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © {currentYear} JD2CV. All rights reserved. Built with ❤️ using Next.js
          </p>
        </div>
      </div>
    </footer>
  )
}
