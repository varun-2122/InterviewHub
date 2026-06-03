import VideoProvider from "@/components/providers/VideoProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <VideoProvider>{children}</VideoProvider>;
}
