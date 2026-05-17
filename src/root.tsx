import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import "./styles/main.scss";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>CETRA - AI-Powered Sustainability App</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* SEO Meta Tags */}
        <Meta name="description" content="CETRA is an AI-native sustainability app that helps prevent food waste through intelligent receipt and fridge analysis using Gemini AI." />
        <Meta name="keywords" content="sustainability, food waste, AI app, eco-tech, receipt analysis, fridge analysis, Gemini AI, reuse" />
        <Meta name="author" content="CETRA Team" />

        {/* Open Graph / Facebook */}
        <Meta property="og:type" content="website" />
        <Meta property="og:url" content="https://cetra-778142562097.asia-southeast2.run.app/" />
        <Meta property="og:title" content="CETRA - AI-Powered Sustainability App" />
        <Meta property="og:description" content="Discover value before you throw it away. AI-powered dashboard for food waste prevention and creative reuse." />
        <Meta property="og:image" content="/cetra-ai-sustainability-featured-image.png" />

        {/* Twitter */}
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:title" content="CETRA - AI-Powered Sustainability App" />
        <Meta name="twitter:description" content="Discover value before you throw it away. AI-powered dashboard for food waste prevention and creative reuse." />
        <Meta name="twitter:image" content="/cetra-ai-sustainability-featured-image.png" />

        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <Link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Body>
        <Navbar />
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Footer />
        <Scripts />
      </Body>
    </Html>
  );
}
