import AnalysisDashboard from "../components/AnalysisDashboard/AnalysisDashboard";
import WelcomeModal from "../components/WelcomeModal/WelcomeModal";

export default function Home() {
  return (
    <main class="home">
      <WelcomeModal />
      <div class="particles"></div>
      <div class="hero">
        <div class="logo-wrapper">
          <img src="/cetra-ai-sustainability-app-logo.png" alt="CETRA Logo" class="app-logo" />
          <h1 class="glow-text">CETRA</h1>
        </div>
        <p>AI that sees value before you throw it away.</p>
      </div>
      <AnalysisDashboard />
    </main>
  );
}
