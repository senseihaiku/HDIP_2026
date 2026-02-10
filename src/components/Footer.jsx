import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} HDIP &mdash; Health Data Innovation Platform
          </p>
          <nav className="flex items-center space-x-6">
            <Link to="/about" className="text-sm text-gray-500 hover:text-teal-700 transition-colors">
              About
            </Link>
            <Link to="/pricing" className="text-sm text-gray-500 hover:text-teal-700 transition-colors">
              Pricing
            </Link>
            <a href="mailto:contact@hdip.se" className="text-sm text-gray-500 hover:text-teal-700 transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
