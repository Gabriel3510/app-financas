import React from 'react';

interface PageHeaderProps {
  subtitle: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ subtitle, action }) => (
  <div className="flex items-center justify-between gap-3">
    <p className="text-sm text-muted min-w-0">{subtitle}</p>
    {action}
  </div>
);

export default PageHeader;
