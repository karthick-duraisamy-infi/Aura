import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent } from "@/components/ui/card";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <Card className="shadow-md p-6">
      <CardContent className="prose max-w-none dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}
