import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface EmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle: string;
}

export default function EmailModal({ open, onOpenChange, reportTitle }: EmailModalProps) {
  const { toast } = useToast();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState(`Report: ${reportTitle}`);
  const [body, setBody] = useState('Please find the attached report for your review.');

  const handleSend = () => {
    console.log('Sending email:', { to, subject, body });
    toast({
      title: 'Email sent successfully',
      description: `Report sent to ${to}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl md:text-2xl">Email Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="email-to" className="text-sm font-medium">To</Label>
            <Input
              id="email-to"
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-subject" className="text-sm font-medium">Subject</Label>
            <Input
              id="email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-body" className="text-sm font-medium">Message</Label>
            <Textarea
              id="email-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-40 resize-vertical focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <DialogFooter className="pt-4 border-t flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto border-2"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!to}
            className="w-full sm:w-auto shadow-md"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}