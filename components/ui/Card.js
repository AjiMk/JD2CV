export default function Card({ 
  children, 
  title, 
  subtitle,
  className = '',
  padding = 'normal',
  hoverable = false 
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
  }

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md
        ${hoverable ? 'hover:shadow-xl transition-shadow duration-300' : ''}
        ${paddings[padding]}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
