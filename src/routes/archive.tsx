import { createResource, For, Show, createSignal, createEffect } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { Motion } from "solid-motionone";
import AnalysisModal from "../components/AnalysisModal/AnalysisModal";
import styles from "./archive.module.scss";

interface ArchiveItem {
  id: string;
  materialType: string;
  category: string;
  itemImagePrompt: string;
  createdAt: string;
}

import server$ from "solid-start/server";
import { db } from "../firebase/config";
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";

const fetchArchive = server$(async (params: { category: string, search: string }) => {
  const { category, search } = params;
  
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;

  if (!projectId) {
    throw new Error("Missing VITE_FIREBASE_PROJECT_ID environment variable.");
  }

  try {
    // Firestore REST API URL
    // We use a structured query to handle ordering and filtering
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`;
    
    const structuredQuery: any = {
      from: [{ collectionId: "analyses" }],
      orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }]
    };

    // Note: We fetch all and filter in memory for Category + Search to avoid 
    // requiring dozens of composite indexes for every possible filter combination.
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ structuredQuery }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData[0]?.error?.message || "Firestore REST API error");
    }

    const data = await response.json();
    
    // Parse Firestore REST format (it's slightly different from SDK)
    let results = data
      .filter((doc: any) => doc.document)
      .map((doc: any) => {
        const fields = doc.document.fields;
        const parseValue = (val: any): any => {
          if (val.stringValue) return val.stringValue;
          if (val.integerValue) return parseInt(val.integerValue);
          if (val.timestampValue) return val.timestampValue;
          if (val.arrayValue) return val.arrayValue.values?.map(parseValue) || [];
          if (val.mapValue) {
            const obj: any = {};
            for (const k in val.mapValue.fields) {
              obj[k] = parseValue(val.mapValue.fields[k]);
            }
            return obj;
          }
          return null;
        };

        const result: any = { id: doc.document.name.split("/").pop() };
        for (const key in fields) {
          result[key] = parseValue(fields[key]);
        }
        return result;
      });

    // Smart Multi-Filter (In-Memory on Server)
    if (category && category !== "") {
      const catLower = category.toLowerCase();
      results = results.filter((item: any) => 
        (item.category || "").toLowerCase().includes(catLower)
      );
    }

    if (search && search !== "") {
      const searchLower = search.toLowerCase();
      results = results.filter((item: any) => 
        (item.materialType || "").toLowerCase().includes(searchLower) ||
        (item.itemImagePrompt || "").toLowerCase().includes(searchLower) ||
        (item.category || "").toLowerCase().includes(searchLower)
      );
    }

    return results as ArchiveItem[];
  } catch (e: any) {
    console.error("FIRESTORE REST ERROR:", e);
    throw new Error(e.message || "Failed to fetch data from the sustainability lab.");
  }
});

export default function Archive() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state for the input field to prevent immediate URL sync
  const [tempSearch, setTempSearch] = createSignal(searchParams.search || "");
  const [category, setCategory] = createSignal(searchParams.category || "");
  const [search, setSearch] = createSignal(searchParams.search || "");
  
  // Debounce effect: sync search signal 500ms after user stops typing
  createEffect(() => {
    const handler = setTimeout(() => {
      setSearch(tempSearch());
    }, 500);
    return () => clearTimeout(handler);
  });

  // Sync URL when search/category signals change
  createEffect(() => {
    setSearchParams({ 
      category: category() || undefined, 
      search: search() || undefined 
    }, { replace: true });
  });

  const [archive, { mutate, refetch }] = createResource(
    () => ({ category: category(), search: search() }),
    fetchArchive
  );

  // Helper to check if we have any results
  const hasResults = () => {
    const data = archive();
    return Array.isArray(data) && data.length > 0;
  };
  const isInitialLoad = () => archive.loading && !archive();

  const [selectedItem, setSelectedItem] = createSignal<any | null>(null);

  const categories = ["", "Kitchen", "Food", "Electronics", "Fashion", "Home", "Garden", "Packaging", "Other"];

  const getImageUrl = (material: string, id: string) => {
    // Using Unsplash for high-quality, reliable photography of materials
    return `https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800&material=${encodeURIComponent(material)}`;
  };
  
  // Dynamic Material Photography (using LoremFlickr as it's more stable than Unsplash Source)
  const getUnsplashUrl = (material: string) => {
    return `https://loremflickr.com/800/600/${encodeURIComponent(material || "sustainability")},recycle/all`;
  };

  return (
    <main class={styles.archivePage}>
      <header class={styles.header}>
        <Motion.h1 
          class={styles.glowText}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          DISCOVERY LAB
        </Motion.h1>
        <p>Explore what others have found and how they gave items a second life.</p>
      </header>

      <section class={styles.searchSection}>
        <div class={styles.searchInputWrapper}>
          <input 
            type="text" 
            placeholder="Search by material or item name..." 
            value={tempSearch()}
            onInput={(e) => setTempSearch(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearch(tempSearch());
              }
            }}
          />
          <Show when={archive.loading}>
            <div class={styles.searchingIndicator}>
              <div class={styles.dotPulse}></div>
              <span>Searching...</span>
            </div>
          </Show>
        </div>
        
        <div class={styles.categoryFilters}>
          <For each={categories}>
            {(cat) => (
              <button 
                class={styles.filterBtn}
                classList={{ [styles.active]: category() === cat }}
                onClick={() => setCategory(cat)}
              >
                {cat || "All"}
              </button>
            )}
          </For>
        </div>
      </section>

      <Show 
        when={!isInitialLoad()} 
        fallback={<div class={styles.loadingWrapper}><div class={styles.spinner}></div><p>Searching the lab...</p></div>}
      >
        <div class={styles.resultsGrid}>
          <Show when={archive.error}>
            <div class={styles.errorState}>
              <p>Error: {archive.error.message}</p>
              <p class={styles.errorHint}>This usually means you need to create a composite index in Firebase Console. Check Cloud Run logs for the link.</p>
              <button onClick={() => refetch()} class={styles.retryBtn}>Retry Connection</button>
            </div>
          </Show>

          <For each={archive()} fallback={
            <div class={styles.emptyState}>
              <p>{search() || category() ? "No matches found for your filters." : "The lab is empty. Be the first to scan an item!"}</p>
            </div>
          }>
            {(item, index) => (
              <Motion.div 
                class={styles.discoveryCard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index() * 0.05 }}
              >
                <div class={styles.cardImageWrapper}>
                  <img 
                    src={getUnsplashUrl(item.materialType)} 
                    alt={item.materialType} 
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <span class={styles.categoryBadge}>{item.category}</span>
                </div>
                <div class={styles.cardContent}>
                  <h3 class={styles.materialTitle}>{item.materialType}</h3>
                  <p class={styles.itemPrompt}>{item.itemImagePrompt}</p>
                </div>
                <div class={styles.cardFooter}>
                  <span class={styles.date}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recently"}
                  </span>
                  <button 
                    class={styles.viewBtn}
                    onClick={() => setSelectedItem(item)}
                  >
                    View Analysis
                  </button>
                </div>
              </Motion.div>
            )}
          </For>
        </div>
      </Show>

      <AnalysisModal 
        item={selectedItem()} 
        onClose={() => setSelectedItem(null)} 
      />
    </main>
  );
}
