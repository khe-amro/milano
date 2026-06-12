/**
 * Server-side Unsplash API integration for auto-fetching food images
 * Never expose UNSPLASH_ACCESS_KEY to the client
 */

interface UnsplashSearchResponse {
  results: Array<{
    urls: {
      regular: string;
    };
  }>;
}

/**
 * Maps category names to better Unsplash search terms for improved image quality
 */
function getCategorySearchTerm(query: string, categoryName?: string): string {
  const category = categoryName?.toLowerCase() || '';
  
  const categoryMappings: Record<string, string> = {
    pizza: `${query} italian pizza`,
    sandwich: `${query} sandwich food`,
    tacos: `${query} tacos food`,
    plats: `${query} plate dish food`,
    plat: `${query} plate dish food`,
    boissons: `${query} drink beverage`,
    boisson: `${query} drink beverage`,
    burger: `${query} burger food`,
    salade: `${query} salad food`,
    dessert: `${query} dessert food`,
    pâtes: `${query} pasta food`,
    pasta: `${query} pasta food`,
  };

  // Check if category matches any mapping
  for (const [key, value] of Object.entries(categoryMappings)) {
    if (category.includes(key)) {
      return value;
    }
  }

  // Default fallback
  return `${query} food`;
}

/**
 * Fetches a food image from Unsplash API based on the dish name
 * @param dishName - The name of the dish (e.g., "Margherita Pizza")
 * @param categoryName - Optional category name for better search results
 * @returns The image URL or null if not found
 */
export async function getFoodImage(
  dishName: string,
  categoryName?: string
): Promise<string | null> {
  try {
    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
      console.warn("PEXELS_API_KEY not set");
      return null;
    }

    const searchQuery = getCategorySearchTerm(dishName, categoryName);

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: apiKey, // Pexels uses key directly, no "Client-ID"
        },
      }
    );

    if (!response.ok) {
      console.error(`Pexels API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Pexels uses "photos" not "results"
    if (!data.photos || data.photos.length === 0) {
      return null;
    }

    // Use "large" for good quality without being too heavy
    return data.photos[0].src.large;

  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}