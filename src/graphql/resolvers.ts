import { db } from "../firebase/config";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { analyzeImage as performAIAnalysis } from "../ai/gemini";

export const resolvers = {
  Query: {
    uploads: async (_parent: any, { userId }: any) => {
      const q = query(collection(db, "uploads"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    analyses: async (_parent: any, { uploadId }: any) => {
      const q = query(collection(db, "analyses"), where("uploadId", "==", uploadId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    archive: async (_parent: any, { category, search }: any) => {
      let q = query(collection(db, "analyses"), orderBy("createdAt", "desc"));
      
      if (category) {
        q = query(q, where("category", "==", category));
      }
      
      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null
        } as any; // Cast to any to allow filtering on dynamic properties
      });

      if (search) {
        const searchLower = search.toLowerCase();
        results = (results as any[]).filter(item => 
          (item.materialType || "").toLowerCase().includes(searchLower) ||
          (item.itemImagePrompt || "").toLowerCase().includes(searchLower)
        );
      }

      return results;
    },
    tutorials: async (_parent: any, { analysisId }: any) => {
      return [];
    },
  },
  Mutation: {
    uploadImage: async (_parent: any, { userId, image }: any) => {
      const docRef = await addDoc(collection(db, "uploads"), {
        userId,
        imageUrl: image.imageUrl,
        createdAt: serverTimestamp(),
      });
      return {
        id: docRef.id,
        userId,
        imageUrl: image.imageUrl,
        createdAt: new Date().toISOString(),
      };
    },
    analyzeImage: async (_parent: any, { uploadId, imageBase64 }: any) => {
      // 1. Call AI module
      const result = await performAIAnalysis(imageBase64);
      
      // 2. Save to Firestore (Archive)
      const docRef = await addDoc(collection(db, "analyses"), {
        uploadId,
        ...result,
        createdAt: serverTimestamp(),
      });

      return {
        id: docRef.id,
        uploadId,
        ...result,
        createdAt: new Date().toISOString(),
      };
    },
    generateTutorial: async (_parent: any, { analysisId }: any) => {
      return {
        id: "1",
        analysisId,
        steps: ["Step 1", "Step 2"],
        difficulty: "easy",
        timeEstimate: "30 min",
        tools: ["scissors"],
      };
    },
  },
};
