'use client';

import { type ReactNode } from 'react';

export default function ExamLayout({ children }: { children: ReactNode }) {
  return (
    <div className="exam-mode min-h-screen">
      {children}
    </div>
  );
}
