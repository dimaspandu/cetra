import UploadArea from "../components/UploadArea/UploadArea";

export default function Home() {
  return (
    <main class="home">
      <div class="particles"></div>
      <div class="hero">
        <div class="logo-wrapper">
          <h1 class="glow-text">CETRA</h1>
        </div>
        <p>AI that sees value before you throw it away.</p>
      </div>
      <UploadArea />
    </main>
  );
}
