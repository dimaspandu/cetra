import { createResource, For, Show, createSignal } from "solid-js";
import { Motion } from "solid-motionone";
import styles from "./archive.module.scss";

interface ArchiveItem {
  id: string;
  materialType: string;
  category: string;
  itemImagePrompt: string;
  createdAt: string;
}

const fetchArchive = async ({ category, search }: { category: string, search: string }) => {
  const query = `
    query GetArchive($category: String, $search: String) {
      archive(category: $category, search: $search) {
        id
        materialType
        category
        itemImagePrompt
        createdAt
      }
    }
  `;

  // Absolute URL is required for server-side fetch in SolidStart
  let baseUrl = "";
  if (typeof window === "undefined") {
    // Priority: Env Var > Internal Port > Default Localhost
    baseUrl = import.meta.env.VITE_SITE_URL || `http://localhost:${process.env.PORT || 3000}`;
  }

  const response = await fetch(`${baseUrl}/api/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { category: category || null, search: search || null }
    }),
  });

  const { data, errors } = await response.json();
  if (errors) {
    console.error("GraphQL errors:", errors);
    return [];
  }
  return data.archive as ArchiveItem[];
};

export default function Archive() {
  const [category, setCategory] = createSignal("");
  const [search, setSearch] = createSignal("");
  
  const [archive] = createResource(
    () => ({ category: category(), search: search() }),
    fetchArchive
  );

  const categories = ["", "Kitchen", "Electronics", "Fashion", "Home", "Garden", "Other"];

  const getImageUrl = (prompt: string, id: string) => {
    const encoded = encodeURIComponent(prompt.replace(/[^\w\s,-]/g, "").trim());
    return `https://image.pollinations.ai/prompt/${encoded}?width=400&height=300&seed=${id}&nologo=true`;
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
            value={search()}
            onInput={(e) => setSearch(e.currentTarget.value)}
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
        when={!archive.loading} 
        fallback={<div class={styles.loadingWrapper}><div class={styles.spinner}></div></div>}
      >
        <div class={styles.resultsGrid}>
          <For each={archive()} fallback={
            <div class={styles.emptyState}>
              <p>No discoveries found. Be the first to scan one!</p>
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
                  <img src={getImageUrl(item.itemImagePrompt, item.id)} alt={item.materialType} loading="lazy" />
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
                  <button class={styles.viewBtn}>View Analysis</button>
                </div>
              </Motion.div>
            )}
          </For>
        </div>
      </Show>
    </main>
  );
}
