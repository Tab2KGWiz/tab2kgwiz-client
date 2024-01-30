import { lusitana } from "@/app/ui/fonts";
import UploadFile from "@/app/ui/file-input/upload-file";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-6 bg-white">
      <h1
        className={`${lusitana.className} mb-4 text-xl text-black md:text-2xl`}
      >
        Home
      </h1>
      <UploadFile />
    </main>
  );
}
