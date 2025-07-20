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

### File Upload Implementation

The application now includes a complete file upload system:

1. **API Route** (`app/routes/api.upload.jsx`)
```jsx
import { json } from '@remix-run/node';

export async function action({ request }) {
  const formData = await request.formData();
  const files = formData.getAll('files');
  
  // Process files and return mock data
  const mockData = generateMockDataFromFiles(files);
  
  return json({
    success: true,
    data: { json: jsonData, csv: csvData },
    message: `Successfully processed ${files.length} file(s)`
  });
}
```

2. **Client Implementation** (`routes/_index.jsx`)
```jsx
import { useFetcher } from '@remix-run/react';

const fetcher = useFetcher();
const isLoading = fetcher.state === "submitting";
const hasResults = fetcher.data && fetcher.data.success;
const processedData = fetcher.data?.data;

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
1. User uploads files → `FileUploadArea` (with validation)
2. Files stored in route state → `_index.jsx`
3. User clicks process → `useFetcher` submits to `/api/upload`
4. Server generates mock data → Returns JSON and CSV formats
5. Results displayed → `ResultsViewer` with download/copy functionality
6. Success message shown → Files cleared from state

### Key Features
- **File validation**: PDF type, size limits (10MB), empty file checks
- **Real-time feedback**: Loading states, error handling, success messages
- **Data formats**: Both JSON and CSV generated server-side
- **User experience**: Drag & drop, file removal, processing feedback

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
- Server-side processing with `useFetcher`
- Efficient state management with automatic cleanup
- File validation to prevent unnecessary processing

### Future Optimizations
- Implement file upload progress indicators
- Add chunked file uploads for large files
- Implement client-side caching of results
- Add real PDF processing with OCR capabilities
- Implement batch processing for multiple files

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
1. Update file validation in `FileUploadArea.jsx`
2. Add new tab in `TabNavigation.jsx`
3. Extend server-side processing in `api.upload.jsx`
4. Update formatter in `ResultsViewer.jsx`
5. Test upload and processing workflow

### Styling Updates
1. Modify Tailwind classes in components
2. Update color variables if needed
3. Test responsive design
4. Maintain accessibility standards

### API Integration
1. File upload API already implemented in `app/routes/api.upload.jsx`
2. Components use `useFetcher` for form submission
3. Loading, error, and success states handled
4. Mock data generation demonstrates real processing patterns
5. Ready for production PDF processing integration

## Troubleshooting

### Common Issues

**File upload not working**: Check FormData and endpoint
```jsx
// Ensure files are properly attached
const formData = new FormData();
files.forEach(file => formData.append('files', file.file)); // ✅ Good
formData.append('files', files); // ❌ Wrong - sends array
```

**Component not updating**: Check fetcher state management
```jsx
// Use fetcher data properly
const hasResults = fetcher.data && fetcher.data.success; // ✅ Good
const hasResults = fetcher.data.success; // ❌ May cause errors
```

**Styling not applied**: Verify Tailwind classes and build process
```bash
# Rebuild if styles aren't updating
npm run dev
```

**Route not found**: Check file naming in `app/routes/`
```
about.jsx → /about
api.upload.jsx → /api/upload (handles POST requests)
posts.$slug.jsx → /posts/[dynamic]
```

**File validation errors**: Check file type and size
```jsx
// Proper file validation
if (file.type !== "application/pdf") return false;
if (file.size > 10 * 1024 * 1024) return false; // 10MB limit
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