# Docster Development Guide

This guide covers how to work with the refactored Docster application using the new component-based architecture and Remix routing patterns.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Basic understanding of React and Remix

### Installation
```bash
cd docster/apps/web
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
docster/apps/web/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── index.jsx        # Component exports
│   │   ├── Header.jsx       # Navigation header
│   │   ├── Layout.jsx       # Shared layout wrapper
│   │   ├── Sidebar.jsx      # File management sidebar
│   │   ├── FileUploadArea.jsx
│   │   ├── FileList.jsx
│   │   ├── FileListItem.jsx
│   │   ├── TabNavigation.jsx
│   │   ├── ResultsPanel.jsx
│   │   ├── ResultsViewer.jsx
│   │   └── LoadingSpinner.jsx
│   ├── routes/              # Remix routes
│   │   ├── _index.jsx       # Home page (main app)
│   │   └── about.jsx        # About page
│   └── root.jsx             # Root layout
├── public/                  # Static assets
├── package.json
└── vite.config.js
```

## Component Development

### Creating New Components

1. Create your component file in `app/components/`
```jsx
// app/components/NewComponent.jsx
import React from 'react';

export default function NewComponent({ prop1, prop2 }) {
  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
}
```

2. Export it from `app/components/index.jsx`
```jsx
export { default as NewComponent } from './NewComponent';
```

3. Import and use it
```jsx
import { NewComponent } from '../components';
```

### Component Guidelines

- **Single Responsibility**: Each component should have one clear purpose
- **Props Interface**: Define clear, typed prop interfaces
- **Styling**: Use Tailwind CSS classes consistently
- **State Management**: Keep state at the appropriate level (local vs route vs global)
- **Accessibility**: Include proper ARIA labels and semantic HTML

### Styling Conventions

- Use Tailwind CSS utility classes
- Follow the existing color scheme:
  - Primary: `#101518` (dark gray)
  - Secondary: `#5c748a` (medium gray)
  - Accent: `#dce8f3` (light blue)
  - Background: `#eaedf1` (light gray)
- Maintain consistent spacing and typography
- Use `hover:` and `focus:` states for interactive elements

## Route Development

### Creating New Routes

1. Create a new file in `app/routes/`
```jsx
// app/routes/new-page.jsx
import { Header } from '../components';

export default function NewPage() {
  return (
    <>
      <Header />
      <div className="flex-1 px-6 py-8">
        <h1>New Page</h1>
        {/* Page content */}
      </div>
    </>
  );
}
```

2. Add navigation link to Header component
```jsx
// In Header.jsx
<a href="/new-page" className="...">New Page</a>
```

### Route Patterns

- **Index Route** (`_index.jsx`): Main application functionality
- **Standard Routes** (`about.jsx`): Additional pages
- **Dynamic Routes** (`posts.$slug.jsx`): For dynamic content
- **Layout Routes** (`_layout.jsx`): Shared layouts for route groups

### State Management in Routes

- Use React hooks (`useState`, `useEffect`) for local state
- Lift state up when multiple components need access
- Consider Remix loaders/actions for server-side data
- Use context for deeply nested prop drilling

## File Upload Development

### Current Implementation

The file upload system uses:
- HTML5 File API for file handling
- Drag and drop event handlers
- PDF file filtering
- Mock processing simulation

### Extending File Upload

To add real file processing:

1. **Create API Route**
```jsx
// app/routes/api.upload.jsx
import { json } from '@remix-run/node';

export async function action({ request }) {
  const formData = await request.formData();
  const files = formData.getAll('files');
  
  // Process files here
  const results = await processFiles(files);
  
  return json({ success: true, data: results });
}
```

2. **Update Component**
```jsx
// In routes/_index.jsx
import { useFetcher } from '@remix-run/react';

const fetcher = useFetcher();

const handleProcessFiles = () => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file.file));
  
  fetcher.submit(formData, {
    method: 'POST',
    action: '/api/upload',
    encType: 'multipart/form-data'
  });
};
```

## Data Flow Architecture

### Current Flow
1. User uploads files → `FileUploadArea`
2. Files stored in route state → `_index.jsx`
3. User clicks process → Mock processing simulation
4. Results displayed → `ResultsViewer`

### Production Flow
1. User uploads files → `FileUploadArea`
2. Files stored locally → Route state
3. User clicks process → API call to backend
4. Backend processes PDFs → Returns structured data
5. Results displayed → `ResultsViewer`

## Testing Strategy

### Component Testing
```jsx
// Example test structure
import { render, screen } from '@testing-library/react';
import FileUploadArea from '../components/FileUploadArea';

test('renders upload area', () => {
  render(<FileUploadArea onFileUpload={jest.fn()} />);
  expect(screen.getByText('Drag and drop a PDF here')).toBeInTheDocument();
});
```

### Integration Testing
- Test file upload workflow
- Test processing simulation
- Test tab switching
- Test download functionality

### E2E Testing
- Full user journey from upload to download
- Cross-browser compatibility
- Mobile responsiveness

## Performance Considerations

### Current Optimizations
- Component code splitting via Remix
- Lazy loading of large components
- Efficient re-renders with proper state management

### Future Optimizations
- Implement virtual scrolling for large file lists
- Add file upload progress indicators
- Implement client-side caching
- Optimize bundle size with tree shaking

## Deployment

### Build Process
```bash
npm run build
```

Creates optimized production build in `build/` directory.

### Environment Variables
Create `.env` file for environment-specific configuration:
```env
NODE_ENV=production
API_BASE_URL=https://api.docster.com
```

### Deployment Targets
- **Vercel**: Automatic deployment with git integration
- **Netlify**: JAMstack deployment with edge functions
- **Self-hosted**: Node.js server with Docker

## Common Development Tasks

### Adding New File Format Support
1. Update file filtering in `FileUploadArea.jsx`
2. Add new tab in `TabNavigation.jsx`
3. Extend formatter in `ResultsViewer.jsx`
4. Update processing logic

### Styling Updates
1. Modify Tailwind classes in components
2. Update color variables if needed
3. Test responsive design
4. Maintain accessibility standards

### API Integration
1. Create route handlers in `app/routes/api/`
2. Update component to use `useFetcher` or `useLoaderData`
3. Handle loading and error states
4. Add proper TypeScript types

## Troubleshooting

### Common Issues

**Component not updating**: Check state management and prop passing
```jsx
// Ensure state updates trigger re-renders
setFiles(prev => [...prev, newFile]); // ✅ Good
setFiles([...files, newFile]); // ⚠️ May cause stale closure
```

**Styling not applied**: Verify Tailwind classes and build process
```bash
# Rebuild if styles aren't updating
npm run dev
```

**Route not found**: Check file naming in `app/routes/`
```
about.jsx → /about
api.upload.jsx → /api/upload
posts.$slug.jsx → /posts/[dynamic]
```

### Debug Tools
- React Developer Tools
- Remix Developer Tools
- Browser Network tab for API calls
- Console logging for state debugging

## Contributing

### Code Style
- Use ES6+ features
- Follow React best practices
- Write descriptive component and variable names
- Add JSDoc comments for complex functions

### Git Workflow
1. Create feature branch
2. Make focused commits
3. Write descriptive commit messages
4. Test before pushing
5. Create pull request with clear description

### Review Checklist
- [ ] Components are properly tested
- [ ] No console errors or warnings
- [ ] Responsive design works
- [ ] Accessibility guidelines followed
- [ ] Performance impact considered
- [ ] Documentation updated if needed