
import React from 'react';
import { FileTextIcon } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileTextIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-medium">PRD Generator</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Help
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            History
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
