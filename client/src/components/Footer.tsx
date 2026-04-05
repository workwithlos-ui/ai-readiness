export function Footer() {
  return (
    <footer className="border-t border-white/5 py-6 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-600">
          Powered by{" "}
          <a
            href="https://LosSilva.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-500 hover:text-teal-400 transition-colors font-medium"
          >
            ELIOS
          </a>
        </p>
        <p className="text-xs text-gray-700">
          Your data is secure and never shared with third parties.
        </p>
      </div>
    </footer>
  );
}
