/**
 * Comprehensive list of video styles for Sora 2
 * Based on common cinematography, animation, and artistic styles
 */

export interface VideoStyle {
  name: string;
  category: string;
  description: string;
  keywords: string[];
}

export const VIDEO_STYLES: VideoStyle[] = [
  // Film & Cinema
  { name: 'Cinematic', category: 'Film', description: 'Professional film look with dramatic lighting', keywords: ['film', 'movie', 'dramatic'] },
  { name: '35mm Film', category: 'Film', description: 'Classic 35mm film stock aesthetic', keywords: ['film', 'grain', 'vintage'] },
  { name: '16mm Film', category: 'Film', description: 'Grainier 16mm documentary feel', keywords: ['film', 'documentary', 'grain'] },
  { name: 'Super 8', category: 'Film', description: 'Nostalgic home movie aesthetic', keywords: ['vintage', 'retro', 'home movie'] },
  { name: 'Film Noir', category: 'Film', description: 'High contrast black and white with dramatic shadows', keywords: ['noir', 'black and white', 'shadows'] },
  { name: 'Anamorphic', category: 'Film', description: 'Wide aspect ratio with lens flares', keywords: ['widescreen', 'flares', 'cinematic'] },
  
  // Era-Specific
  { name: '1920s Silent Film', category: 'Era', description: 'Black and white, high contrast, slight vignette', keywords: ['vintage', 'silent', 'old'] },
  { name: '1950s Technicolor', category: 'Era', description: 'Vibrant saturated colors', keywords: ['vintage', 'colorful', 'saturated'] },
  { name: '1970s Film', category: 'Era', description: 'Warm tones, soft focus, natural grain', keywords: ['vintage', 'warm', 'retro'] },
  { name: '1980s VHS', category: 'Era', description: 'VHS tape aesthetic with tracking lines', keywords: ['retro', 'vhs', '80s'] },
  { name: '1990s Camcorder', category: 'Era', description: 'Home video camcorder look', keywords: ['retro', 'home video', '90s'] },
  
  // Animation Styles
  { name: '2D Hand-Drawn', category: 'Animation', description: 'Traditional hand-drawn animation', keywords: ['animation', '2d', 'cartoon'] },
  { name: '3D CGI', category: 'Animation', description: 'Computer-generated 3D animation', keywords: ['animation', '3d', 'cgi'] },
  { name: 'Stop Motion', category: 'Animation', description: 'Claymation or puppet animation', keywords: ['animation', 'stop motion', 'claymation'] },
  { name: 'Rotoscope', category: 'Animation', description: 'Traced over live action', keywords: ['animation', 'rotoscope', 'traced'] },
  { name: 'Anime', category: 'Animation', description: 'Japanese animation style', keywords: ['animation', 'anime', 'japanese'] },
  { name: 'Pixel Art', category: 'Animation', description: '8-bit or 16-bit pixel aesthetic', keywords: ['animation', 'pixel', 'retro'] },
  { name: 'Watercolor', category: 'Animation', description: 'Soft watercolor painting style', keywords: ['animation', 'watercolor', 'painted'] },
  { name: 'Oil Painting', category: 'Animation', description: 'Thick brushstroke oil painting look', keywords: ['animation', 'painting', 'artistic'] },
  
  // Documentary & Reality
  { name: 'Documentary', category: 'Documentary', description: 'Observational documentary style', keywords: ['documentary', 'real', 'natural'] },
  { name: 'News Footage', category: 'Documentary', description: 'Broadcast news camera style', keywords: ['news', 'broadcast', 'journalism'] },
  { name: 'Found Footage', category: 'Documentary', description: 'Raw, unpolished found footage', keywords: ['raw', 'found', 'amateur'] },
  { name: 'Security Camera', category: 'Documentary', description: 'CCTV surveillance camera look', keywords: ['security', 'surveillance', 'cctv'] },
  { name: 'Dashcam', category: 'Documentary', description: 'Dashboard camera perspective', keywords: ['dashcam', 'car', 'pov'] },
  { name: 'Body Camera', category: 'Documentary', description: 'First-person body cam footage', keywords: ['bodycam', 'pov', 'first person'] },
  
  // Commercial & Advertising
  { name: 'Commercial', category: 'Commercial', description: 'Polished advertising aesthetic', keywords: ['commercial', 'advertising', 'product'] },
  { name: 'Product Photography', category: 'Commercial', description: 'Clean product showcase style', keywords: ['product', 'clean', 'minimal'] },
  { name: 'Fashion Editorial', category: 'Commercial', description: 'High-fashion magazine style', keywords: ['fashion', 'editorial', 'stylish'] },
  { name: 'Music Video', category: 'Commercial', description: 'Dynamic music video aesthetic', keywords: ['music', 'dynamic', 'artistic'] },
  
  // Artistic & Experimental
  { name: 'Impressionist', category: 'Artistic', description: 'Soft focus, painterly impressionist style', keywords: ['artistic', 'impressionist', 'painterly'] },
  { name: 'Surrealist', category: 'Artistic', description: 'Dreamlike surreal imagery', keywords: ['artistic', 'surreal', 'dream'] },
  { name: 'Abstract', category: 'Artistic', description: 'Non-representational abstract visuals', keywords: ['artistic', 'abstract', 'experimental'] },
  { name: 'Glitch Art', category: 'Artistic', description: 'Digital glitch and distortion effects', keywords: ['glitch', 'digital', 'distorted'] },
  { name: 'Vaporwave', category: 'Artistic', description: 'Retro-futuristic vaporwave aesthetic', keywords: ['vaporwave', 'retro', 'neon'] },
  { name: 'Cyberpunk', category: 'Artistic', description: 'Neon-lit dystopian future', keywords: ['cyberpunk', 'neon', 'futuristic'] },
  
  // Camera Techniques
  { name: 'Slow Motion', category: 'Technique', description: 'High frame rate slow motion', keywords: ['slow motion', 'slowmo', 'smooth'] },
  { name: 'Time Lapse', category: 'Technique', description: 'Sped up passage of time', keywords: ['time lapse', 'fast', 'timelapse'] },
  { name: 'Hyperlapse', category: 'Technique', description: 'Moving time lapse', keywords: ['hyperlapse', 'moving', 'fast'] },
  { name: 'Drone Shot', category: 'Technique', description: 'Aerial drone perspective', keywords: ['drone', 'aerial', 'overhead'] },
  { name: 'POV', category: 'Technique', description: 'First-person point of view', keywords: ['pov', 'first person', 'subjective'] },
  { name: 'Handheld', category: 'Technique', description: 'Shaky handheld camera movement', keywords: ['handheld', 'shaky', 'dynamic'] },
  { name: 'Steadicam', category: 'Technique', description: 'Smooth stabilized movement', keywords: ['steadicam', 'smooth', 'stabilized'] },
  { name: 'Dolly Zoom', category: 'Technique', description: 'Vertigo effect zoom', keywords: ['dolly zoom', 'vertigo', 'zoom'] },
  
  // Lighting Styles
  { name: 'Golden Hour', category: 'Lighting', description: 'Warm sunset/sunrise lighting', keywords: ['golden hour', 'warm', 'sunset'] },
  { name: 'Blue Hour', category: 'Lighting', description: 'Cool twilight lighting', keywords: ['blue hour', 'twilight', 'cool'] },
  { name: 'High Key', category: 'Lighting', description: 'Bright, low contrast lighting', keywords: ['bright', 'high key', 'soft'] },
  { name: 'Low Key', category: 'Lighting', description: 'Dark, high contrast lighting', keywords: ['dark', 'low key', 'dramatic'] },
  { name: 'Neon Lighting', category: 'Lighting', description: 'Colorful neon lights', keywords: ['neon', 'colorful', 'night'] },
  { name: 'Candlelight', category: 'Lighting', description: 'Warm flickering candlelight', keywords: ['candlelight', 'warm', 'intimate'] },
  { name: 'Moonlight', category: 'Lighting', description: 'Cool blue moonlight', keywords: ['moonlight', 'night', 'blue'] },
  
  // Genre-Specific
  { name: 'Horror', category: 'Genre', description: 'Dark, unsettling horror aesthetic', keywords: ['horror', 'dark', 'scary'] },
  { name: 'Sci-Fi', category: 'Genre', description: 'Futuristic science fiction look', keywords: ['sci-fi', 'futuristic', 'technology'] },
  { name: 'Fantasy', category: 'Genre', description: 'Magical fantasy world aesthetic', keywords: ['fantasy', 'magical', 'mystical'] },
  { name: 'Western', category: 'Genre', description: 'Classic western film style', keywords: ['western', 'desert', 'vintage'] },
  { name: 'Noir Detective', category: 'Genre', description: 'Moody detective noir style', keywords: ['noir', 'detective', 'moody'] },
  
  // Modern Digital
  { name: 'Instagram', category: 'Digital', description: 'Social media aesthetic', keywords: ['instagram', 'social media', 'modern'] },
  { name: 'TikTok', category: 'Digital', description: 'Vertical short-form video style', keywords: ['tiktok', 'vertical', 'social'] },
  { name: 'YouTube Vlog', category: 'Digital', description: 'Casual vlogging style', keywords: ['vlog', 'youtube', 'casual'] },
  { name: 'Twitch Stream', category: 'Digital', description: 'Live streaming aesthetic', keywords: ['twitch', 'stream', 'gaming'] },
  
  // Texture & Quality
  { name: 'Film Grain', category: 'Texture', description: 'Visible film grain texture', keywords: ['grain', 'texture', 'film'] },
  { name: 'Soft Focus', category: 'Texture', description: 'Dreamy soft focus effect', keywords: ['soft', 'dreamy', 'blur'] },
  { name: 'Sharp Focus', category: 'Texture', description: 'Crystal clear sharp focus', keywords: ['sharp', 'clear', 'crisp'] },
  { name: 'Bokeh', category: 'Texture', description: 'Blurred background with bokeh', keywords: ['bokeh', 'blur', 'depth'] },
  { name: 'Lens Flare', category: 'Texture', description: 'Visible lens flare effects', keywords: ['flare', 'lens', 'light'] },
  { name: 'Chromatic Aberration', category: 'Texture', description: 'Color fringing on edges', keywords: ['chromatic', 'aberration', 'color'] },
  
  // Color Grading
  { name: 'Warm Tones', category: 'Color', description: 'Orange and yellow warm palette', keywords: ['warm', 'orange', 'yellow'] },
  { name: 'Cool Tones', category: 'Color', description: 'Blue and teal cool palette', keywords: ['cool', 'blue', 'teal'] },
  { name: 'Desaturated', category: 'Color', description: 'Muted, low saturation colors', keywords: ['desaturated', 'muted', 'pale'] },
  { name: 'Oversaturated', category: 'Color', description: 'Vibrant, high saturation colors', keywords: ['saturated', 'vibrant', 'colorful'] },
  { name: 'Black and White', category: 'Color', description: 'Monochrome black and white', keywords: ['black and white', 'monochrome', 'bw'] },
  { name: 'Sepia Tone', category: 'Color', description: 'Vintage sepia brown tones', keywords: ['sepia', 'vintage', 'brown'] },
  { name: 'Teal and Orange', category: 'Color', description: 'Popular teal/orange color grade', keywords: ['teal', 'orange', 'blockbuster'] },
];

export const STYLE_CATEGORIES = [
  'All',
  'Film',
  'Era',
  'Animation',
  'Documentary',
  'Commercial',
  'Artistic',
  'Technique',
  'Lighting',
  'Genre',
  'Digital',
  'Texture',
  'Color'
];

export function searchStyles(query: string): VideoStyle[] {
  const lowerQuery = query.toLowerCase();
  return VIDEO_STYLES.filter(style => 
    style.name.toLowerCase().includes(lowerQuery) ||
    style.description.toLowerCase().includes(lowerQuery) ||
    style.keywords.some(keyword => keyword.includes(lowerQuery))
  );
}

export function getStylesByCategory(category: string): VideoStyle[] {
  if (category === 'All') return VIDEO_STYLES;
  return VIDEO_STYLES.filter(style => style.category === category);
}

