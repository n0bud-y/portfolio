import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once, in the browser only.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
