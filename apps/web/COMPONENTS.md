# Docster Components Architecture

This document outlines the component structure and architecture for the Docster web application.

## Overview

The Docster application has been refactored from a monolithic React component into a modular, reusable component architecture using Remix routing patterns. This improves maintainability, testability, and scalability.

## Application Structure

```
app/
├── components/
│   ├── index.jsx              # Component exports
│   ├── Header.jsx             # App header with logo and GitHub button
│   ├── Layout.jsx             # Shared layout wrapper
│   ├── Sidebar.jsx            # Left sidebar container
│   ├── FileUploadArea.jsx     # Drag & drop file upload area
│   ├── FileList.jsx           # Container for file list items
│   ├── FileListItem.jsx       # Individual file display component
│   ├── TabNavigation.jsx      # JSON/CSV tab navigation
│   ├── ResultsPanel.jsx       # Main content area with loading states
│   ├── ResultsViewer.jsx      # Data display with download/copy functionality
│   └── LoadingSpinner.jsx     # Reusable loading spinner component
├── routes/
│   ├── _index.jsx             # Main application functionality (home page)
│   └── about.jsx              # About page example
└── root.jsx                   # Root layout with HTML structure
```

## Component Descriptions

### Header
- **Purpose**: Application header with branding and navigation
- **Props**: None (stateless)
- **Features**: Docster logo, navigation links (Home, About), GitHub button

### Layout
- **Purpose**: Shared layout wrapper for consistent page structure
- **Props**: `children`
- **Features**: Base styling, consistent font family, responsive design

### Sidebar
- **Purpose**: Left panel containing file upload and management
- **Props**: `files`, `onFileUpload`, `onRemoveFile`, `onProcessFiles`, `isProcessing`
- **Features**: File upload area, file list, process button with loading state

### FileUploadArea
- **Purpose**: Drag and drop file upload interface
- **Props**: `onFileUpload`
- **Features**: 
  - Drag and drop functionality
  - Click to browse files
  - PDF file filtering
  - Visual feedback for drag states
  - Multiple file support

### FileList & FileListItem
- **Purpose**: Display uploaded files with removal capability
- **Props**: 
  - `FileList`: `files`, `onRemoveFile`
  - `FileListItem`: `fileName`, `fileSize`, `onRemove`
- **Features**: File icons, file info display, remove buttons

### TabNavigation
- **Purpose**: Switch between JSON and CSV output formats
- **Props**: `activeTab`, `onTabChange`
- **Features**: Active tab highlighting, click handlers

### ResultsPanel
- **Purpose**: Main content area with conditional rendering
- **Props**: `hasResults`, `isLoading`, `data`, `activeTab`, `children`
- **Features**: Loading states, empty states, results display

### ResultsViewer
- **Purpose**: Display processed data in JSON or CSV format
- **Props**: `data`, `format`
- **Features**: 
  - Syntax highlighting
  - Copy to clipboard
  - Download functionality
  - Data formatting (JSON/CSV)
  - File size information

### LoadingSpinner
- **Purpose**: Reusable loading indicator
- **Props**: `size`, `message`
- **Features**: Multiple sizes, optional message, smooth animations

## Routing Architecture

The application follows Remix routing conventions:

### Root Layout (`root.jsx`)
- Provides HTML document structure
- Loads fonts and stylesheets
- Renders shared Layout component
- Contains Outlet for route-specific content

### Index Route (`routes/_index.jsx`)
- Main application functionality
- Manages file upload and processing state
- Contains the primary user interface

### Additional Routes (`routes/about.jsx`)
- Example of additional pages
- Demonstrates shared component usage
- Shows navigation patterns

## State Management

The main application state is managed in the index route (`routes/_index.jsx`):

```javascript
const [files, setFiles] = useState([])           // Uploaded files
const [activeTab, setActiveTab] = useState('json') // Active tab (JSON/CSV)
const [hasResults, setHasResults] = useState(false) // Results availability
const [isLoading, setIsLoading] = useState(false)  // Processing state
const [processedData, setProcessedData] = useState(null) // Processed results
```

## Key Features

### File Upload
- Drag and drop support
- Multiple file selection
- PDF file filtering
- File size display
- File removal

### Processing Simulation
- Loading states
- Disabled UI during processing
- Mock data generation
- Progress indication

### Results Display
- Format switching (JSON/CSV)
- Syntax highlighting
- Copy to clipboard
- Download functionality
- File size information

### Responsive Design
- Tailwind CSS styling
- Consistent design system
- Mobile-friendly layout
- Accessibility considerations

## Usage Example

### In Routes (`routes/_index.jsx`)
```jsx
// Import components
import { Header, Sidebar, TabNavigation, ResultsPanel } from "../components";

// Use in route component
export default function Index() {
  // State management here...
  
  return (
    <>
      <Header />
      <div className="gap-1 px-6 flex flex-1 justify-center py-5">
        <Sidebar
          files={files}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
          onProcessFiles={handleProcessFiles}
          isProcessing={isLoading}
        />
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <ResultsPanel
            hasResults={hasResults}
            isLoading={isLoading}
            data={processedData}
            activeTab={activeTab}
          />
        </div>
      </div>
    </>
  );
}
```

### In Root Layout (`root.jsx`)
```jsx
import { Layout } from "./components";

export default function App() {
  return (
    <html>
      {/* Head content */}
      <body>
        <Layout>
          <Outlet />
        </Layout>
      </body>
    </html>
  );
}
```

## Future Enhancements

- Add TypeScript type definitions
- Implement proper file upload to backend
- Add error handling and validation
- Include unit tests for components
- Add internationalization support
- Implement data persistence
- Add more export formats
- Include progress bars for large files
- Add route-based state management (loaders/actions)
- Implement protected routes
- Add SEO meta tags per route

## Development

To work with this architecture:

1. **Components**: Self-contained with clear prop interfaces
2. **Imports**: Clean imports from `components/index.jsx`
3. **Styling**: Consistent Tailwind CSS classes
4. **State**: Route-level state management
5. **Routing**: Follow Remix file-based routing conventions
6. **Layout**: Shared components through Layout wrapper
7. **Navigation**: Use standard anchor tags for client-side navigation

### Adding New Routes
1. Create new file in `app/routes/`
2. Import needed components from `../components`
3. Export default function component
4. Add navigation links in Header component

## Testing

When adding tests, focus on:
- Component rendering with different props
- User interactions (clicks, file uploads)
- State changes and prop updates
- Edge cases (empty states, error states)
- Accessibility compliance