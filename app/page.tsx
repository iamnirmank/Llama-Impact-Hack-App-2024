"use client";
import ChatSection from "./components/ui/chat/chat-section";
import "./page.css";

// Common Section Wrapper Component
const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-8xl p-8 bg-foreground shadow-lg rounded-lg">
    {children}
  </div>
);

// Conditional content rendering
const Content = () => {
    return (
      <>
        <SectionWrapper>
          <ChatSection />
        </SectionWrapper>
      </>
    );
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-6 bg-primary">
      <Content />
    </main>
  );
}
