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
  
  try {
    let q = query(collection(db, "analyses"), orderBy("createdAt", "desc"));
    
    if (category && category !== "") {
      q = query(q, where("category", "==", category));
    }
    
    const querySnapshot = await getDocs(q);
    let results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null
      } as any;
    });

    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter((item: any) => 
        (item.materialType || "").toLowerCase().includes(searchLower) ||
        (item.itemImagePrompt || "").toLowerCase().includes(searchLower)
      );
    }

    return results as ArchiveItem[];
  } catch (e: any) {
    console.error("SERVER FUNCTION DIRECT DB ERROR:", e);
    // Throwing instead of returning [] so the UI can catch it in archive.error
    throw new Error(e.message || "Failed to connect to the Discovery Lab database.");
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

  const categories = ["", "Kitchen", "Electronics", "Fashion", "Home", "Garden", "Other"];

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
          />
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
