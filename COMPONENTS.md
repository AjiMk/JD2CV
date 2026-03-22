# UI Components Documentation

## Overview
The JD2CV application includes a comprehensive set of reusable UI components built with React and TailwindCSS. All components are located in the `/components` directory.

## Component Library

### Core UI Components (`/components/ui`)

#### Button
A versatile button component with multiple variants and states.

**Usage:**
```jsx
import { Button } from '@/components/ui'

// Primary button
<Button variant="primary" size="md">Click Me</Button>

// With icon
<Button variant="primary" icon={FiSave} iconPosition="left">
  Save
</Button>

// Loading state
<Button loading={true}>Saving...</Button>

// Other variants
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Delete</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: React Icon component
- `iconPosition`: 'left' | 'right'
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean

---

#### Card
Container component for content sections.

**Usage:**
```jsx
import { Card } from '@/components/ui'

<Card 
  title="Card Title" 
  subtitle="Optional subtitle"
  padding="normal"
  hoverable={true}
>
  Card content goes here
</Card>
```

**Props:**
- `title`: string (optional)
- `subtitle`: string (optional)
- `padding`: 'none' | 'sm' | 'normal' | 'lg'
- `hoverable`: boolean
- `className`: string

---

#### Input
Enhanced input field with label, icon, and error states.

**Usage:**
```jsx
import { Input } from '@/components/ui'
import { FiMail } from 'react-icons/fi'

<Input
  label="Email Address"
  icon={FiMail}
  type="email"
  placeholder="you@example.com"
  error="This field is required"
  helperText="We'll never share your email"
  required
/>
```

**Props:**
- `label`: string
- `icon`: React Icon component
- `error`: string
- `helperText`: string
- `containerClassName`: string
- All standard HTML input attributes

---

#### Badge
Small status indicator or label.

**Usage:**
```jsx
import { Badge } from '@/components/ui'

<Badge variant="primary" size="md">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Error</Badge>
```

**Props:**
- `variant`: 'primary' | 'success' | 'warning' | 'danger' | 'gray' | 'purple'
- `size`: 'sm' | 'md' | 'lg'

---

#### Spinner
Loading spinner indicator.

**Usage:**
```jsx
import { Spinner } from '@/components/ui'

<Spinner size="md" />
<Spinner size="lg" className="mx-auto" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `className`: string

---

#### Toast
Notification component for user feedback.

**Usage:**
```jsx
import { Toast, ToastContainer } from '@/components/ui'

// Single toast
<Toast 
  message="Resume saved successfully!"
  type="success"
  duration={3000}
  onClose={() => console.log('Closed')}
/>

// Toast container for multiple toasts
<ToastContainer 
  toasts={[
    { id: 1, message: 'Success!', type: 'success' },
    { id: 2, message: 'Warning', type: 'warning' }
  ]}
  removeToast={(id) => handleRemove(id)}
/>
```

**Props:**
- `message`: string
- `type`: 'info' | 'success' | 'error' | 'warning'
- `duration`: number (milliseconds, 0 for persistent)
- `onClose`: function

---

#### Modal
Dialog/popup component.

**Usage:**
```jsx
import { Modal } from '@/components/ui'

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
  size="md"
>
  Modal content goes here
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton`: boolean

---

#### ProgressBar
Visual progress indicator.

**Usage:**
```jsx
import { ProgressBar } from '@/components/ui'

<ProgressBar 
  value={75} 
  max={100}
  variant="primary"
  showLabel={true}
/>
```

**Props:**
- `value`: number
- `max`: number
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'primary' | 'success' | 'warning' | 'danger'
- `showLabel`: boolean

---

### Layout Components

#### Navbar
Navigation bar component with brand and links.

**Usage:**
```jsx
import Navbar, { NavbarBrand, NavbarLinks, NavbarLink } from '@/components/Navbar'

<Navbar transparent={false}>
  <NavbarBrand href="/" title="JD2CV" />
  <NavbarLinks>
    <NavbarLink href="/features">Features</NavbarLink>
    <NavbarLink href="/pricing" variant="primary">Sign Up</NavbarLink>
  </NavbarLinks>
</Navbar>
```

---

#### Footer
Site footer with links and info.

**Usage:**
```jsx
import Footer from '@/components/Footer'

<Footer />
```

---

#### FAQ
Accordion-style FAQ component.

**Usage:**
```jsx
import FAQ from '@/components/FAQ'

<FAQ />
```

---

### Form Components (`/components/forms`)

#### PersonalInfoForm
Form for collecting personal/contact information.

**Features:**
- Full name, email, phone
- Location, social links
- Professional summary

---

#### EducationForm
Form for managing education entries.

**Features:**
- Add/edit/delete multiple education entries
- Institution, degree, GPA
- Dates and achievements

---

#### WorkExperienceForm
Form for managing work experience.

**Features:**
- Add/edit/delete job entries
- Company, position, dates
- Achievement bullets
- Current employment toggle

---

#### SkillsForm
Form for technical and soft skills.

**Features:**
- Separate technical and soft skills
- Quick-add suggested skills
- Tag-based interface

---

#### ProjectsForm
Form for managing project portfolio.

**Features:**
- Project name and description
- Technologies used
- Links to demos/repos
- Key highlights

---

#### CertificationsForm
Form for professional certifications.

**Features:**
- Certification name and issuer
- Issue date
- Credential ID

---

#### JobDescriptionForm
Form for inputting job description.

**Features:**
- Large textarea for JD
- Tips and guidance
- Keyword extraction

---

### Special Components

#### ResumePreview
Professional resume display component.

**Features:**
- FAANG-style formatting
- ATS-friendly layout
- All sections included
- Print-optimized

---

#### ErrorBoundary
Error handling wrapper component.

**Usage:**
```jsx
import ErrorBoundary from '@/components/ErrorBoundary'

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

---

## Styling Guide

### Color Palette
All components use the Tailwind color system with primary colors defined in `tailwind.config.js`:

- Primary: Blue shades (50-900)
- Success: Green
- Warning: Yellow
- Danger: Red
- Gray: Neutral shades

### Responsive Design
All components are mobile-first and responsive:
- Mobile: Base styles
- Tablet: `md:` prefix
- Desktop: `lg:` prefix

### Animation
Components use Tailwind's transition utilities:
- `transition-colors`
- `transition-all`
- `transform`
- Hover effects with `hover:` prefix

---

## Best Practices

### Component Usage
1. **Import from index**: Use `@/components/ui` for UI components
2. **Consistent props**: Follow the established prop patterns
3. **Accessibility**: All components include ARIA labels where appropriate
4. **Error handling**: Use error states for forms

### Styling
1. **Use Tailwind**: Prefer Tailwind classes over custom CSS
2. **Consistent spacing**: Use standard spacing scale (4, 8, 16, 24, etc.)
3. **Color usage**: Stick to the defined color palette
4. **Typography**: Use the defined text sizes and weights

### Performance
1. **Client components**: Use `'use client'` only when needed
2. **Lazy loading**: Consider code splitting for heavy components
3. **Memoization**: Use React.memo for expensive renders

---

## Examples

### Complete Form Example
```jsx
'use client'

import { useState } from 'react'
import { Card, Input, Button } from '@/components/ui'
import { FiMail, FiLock } from 'react-icons/fi'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Handle login
  }

  return (
    <Card title="Login" subtitle="Welcome back!">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          icon={FiMail}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          icon={FiLock}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          loading={loading}
        >
          Sign In
        </Button>
      </form>
    </Card>
  )
}
```

### Toast Notification Example
```jsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { ToastContainer } from '@/components/ui/Toast'

export default function MyComponent() {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type) => {
    const newToast = {
      id: Date.now(),
      message,
      type,
      duration: 3000
    }
    setToasts([...toasts, newToast])
  }

  const removeToast = (id) => {
    setToasts(toasts.filter(t => t.id !== id))
  }

  return (
    <>
      <Button onClick={() => showToast('Success!', 'success')}>
        Show Success
      </Button>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}
```

---

## Component Checklist

When creating new components:
- [ ] Add proper TypeScript/JSDoc comments
- [ ] Include all necessary props
- [ ] Add proper ARIA labels
- [ ] Test on mobile, tablet, desktop
- [ ] Add hover/focus states
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Document usage in this file
- [ ] Add to component index if reusable

---

## Support

For issues or questions about components:
1. Check this documentation
2. Review component source code
3. Check Tailwind CSS documentation
4. Review React documentation
