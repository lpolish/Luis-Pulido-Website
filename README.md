# My Website

This project is an interactive 3D environment built with Next.js and Three.js. It features a dynamic 3D scene with interactive elements, environment controls, and a contact form.

## Features

- Interactive 3D environment with changeable presets
- Floating interactive links within the 3D space
- Dynamic abstract 3D form as a centerpiece
- Environment controls (zoom, rotate, auto-rotate)
- Responsive design with mobile menu
- Contact form with animated submission feedback

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for building the application
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [Three.js](https://threejs.org/) - 3D library for creating and displaying animated 3D computer graphics
- [Framer Motion](https://www.framer.com/motion/) - Animation library for React
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Lucide React](https://lucide.dev/) - Icon library

## Getting Started

Follow these steps to get the project running on your local machine:

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lpolish/Luis-Pulido-Website.git
   cd Luis-Pulido-Website
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

### Running the Development Server

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Publishing to Production

To publish just do:

```bash
vercel --prod
```

Or plug this repository into any build system that supports Nextjs (Netlify, Firebase, Amplify, Surge, Fly).

## Project Structure

- `components/EnvironmentShowcase.tsx`: The main component containing the 3D environment and interactive elements.
- `pages/index.tsx`: The main page that renders the EnvironmentShowcase component.
- `pages/api/contact.ts`: API route for handling contact form submissions.

## Customization

To customize the content or styling:

1. Modify the `EnvironmentShowcase` component in `components/EnvironmentShowcase.tsx`.
2. Update the environment presets, floating links, or abstract form in the same file.
3. Adjust the Tailwind CSS classes or add custom styles as needed.

## Deployment

This project can be easily deployed on [Vercel](https://vercel.com/), the platform created by the founders of Next.js. Simply connect your GitHub repository to Vercel, and it will automatically deploy your application with each push to the main branch.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
