/**
 * Footer Component
 * Site footer with copyright and links.
 * 
 * TODO: Add social links
 * TODO: Style footer
 */
export function Footer() {
  return (
    <footer className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-lg font-bold">HybridExchange</span>
          </div>

          <p className="text-sm">
            © {new Date().getFullYear()} HybridExchange. Portfolio Project.
          </p>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a
              href="https://github.com/HamedDawoudzai/hybrid_exchange"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
