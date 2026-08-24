import breedsData from '@/data/breeds.json';
import guidesData from '@/data/guides.json';

export function getRecommendedGuides(petData: { breedId: string | null; species: 'dog' | 'cat' | null }, breeds = breedsData, guides = guidesData) {
  if (petData.breedId) {
    const breed = breeds.find(b => b.id === petData.breedId);
    if (breed) {
      const recommendations = guides.filter(g => 
        g.tags.some(tag => breed.health_tags.includes(tag)) && 
        g.species.includes(breed.species as any)
      );
      return { recommendations, isFallback: false };
    }
  }
  
  // Fallback
  return { 
    recommendations: guides.filter(g => g.tags.includes('general') && (petData.species ? g.species.includes(petData.species) : true)), 
    isFallback: true 
  };
}
