import { useState } from 'react';
import EmailModal from '../EmailModal';
import { Button } from '@/components/ui/button';

export default function EmailModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Email Modal</Button>
      <EmailModal
        open={open}
        onOpenChange={setOpen}
        reportTitle="Top 10 Selling Products - November 2025"
      />
    </div>
  );
}
