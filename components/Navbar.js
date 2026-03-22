'use client'

import Link from 'next/link'
import { FiFileText } from 'react-icons/fi'

export default function Navbar({ children, transparent = false }) {
  return (
    <nav className={`${transparent ? 'bg-transparent' : 'bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800'} sticky top-0 z-40 transition-all duration-200`}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {children}
        </div>
      </div>
    </nav>
  )
}

export function NavbarBrand({ href = '/', title = 'JD2CV' }) {
  return (
    <Link href={href} className="flex items-center group">
      <FiFileText className="h-8 w-8 text-primary-600 group-hover:scale-110 transition-transform" />
      <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
        {title}
      </span>
    </Link>
  )
}

export function NavbarLinks({ children }) {
  return (
    <div className="flex items-center gap-4">
      {children}
    </div>
  )
}

export function NavbarLink({ href, children, variant = 'default' }) {
  const variants = {
    default: 'text-gray-700 dark:text-gray-300 hover:text-primary-600',
    primary: 'px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700',
    outline: 'px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800',
  }

  return (
    <Link
      href={href}
      className={`${variants[variant]} transition-colors font-medium`}
    >
      {children}
    </Link>
  )
}
