/**
 * Skills are grouped and explained through usage — never with percentage bars.
 * `status` is an honest, editable label: 'Core' (used regularly), 'Growing' (actively
 * expanding), 'Exploring' (early). Adjust any label that doesn't match reality.
 * `aliases` lets a skill be matched to project technology names for "Used in" proof.
 */
export type SkillStatus = 'Core' | 'Growing' | 'Exploring';

export type Skill = {
  name: string;
  status: SkillStatus;
  usage: string;
  aliases?: string[];
};

export type SkillGroup = { id: string; label: string; skills: Skill[] };

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'HTML', status: 'Core', usage: 'Semantic, accessible markup for business websites and custom theme templates.' },
      { name: 'CSS', status: 'Core', usage: 'Responsive layouts and careful UI implementation across client websites.' },
      { name: 'JavaScript', status: 'Core', usage: 'Interactive behaviour, forms and frontend libraries alongside PHP-driven sites.', aliases: ['Frontend Development', 'Custom Frontend'] },
      { name: 'React', status: 'Growing', usage: 'Component-driven interfaces, modern frontend architecture, currently expanding toward advanced React and Next.js development.' },
      { name: 'Next.js', status: 'Growing', usage: 'App Router, TypeScript and server/client component structure — this portfolio is built with it, and it is the direction I am actively growing toward.' },
      { name: 'Tailwind CSS', status: 'Growing', usage: 'Utility-first styling with a custom design system; used to build this portfolio.' },
      { name: 'Bootstrap', status: 'Core', usage: 'Responsive grids and components for fast, consistent client builds.' },
      { name: 'GSAP', status: 'Growing', usage: 'Timelines and ScrollTrigger for purposeful motion — used throughout this portfolio.' },
      { name: 'jQuery', status: 'Core', usage: 'Interactions and plugins inside WordPress themes where it fits the project.' },
    ],
  },
  {
    id: 'cms',
    label: 'CMS / Website Development',
    skills: [
      { name: 'WordPress', status: 'Core', usage: 'Custom theme development, ACF-powered content systems, forms, WooCommerce, responsive business websites.' },
      { name: 'Custom WordPress Themes', status: 'Core', usage: 'Hand-built themes with PHP templates and reusable sections, built around each client.', aliases: ['Custom Theme'] },
      { name: 'ACF', status: 'Core', usage: 'Structured, editor-friendly content fields so clients can manage their own pages.' },
      { name: 'Custom Post Types', status: 'Core', usage: 'Modelling content beyond default posts and pages.' },
      { name: 'Elementor', status: 'Core', usage: 'Page-builder work where a project calls for it.' },
      { name: 'Contact Forms', status: 'Core', usage: 'Form setup and integrations for enquiries and lead capture.' },
      { name: 'WooCommerce', status: 'Core', usage: 'Product setup, shopping flows and storefront customisation across ecommerce projects.' },
      { name: 'Shopify', status: 'Growing', usage: 'Storefront work on the Shopify platform.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'PHP', status: 'Core', usage: 'Theme logic, template code and custom WordPress functionality.', aliases: ['Custom Theme'] },
      { name: 'Laravel', status: 'Exploring', usage: 'Exploring as the route from CMS work toward full-stack applications.' },
      { name: 'Node.js', status: 'Growing', usage: 'JavaScript on the server and tooling as I move toward full-stack work.' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    skills: [
      { name: 'MySQL', status: 'Core', usage: 'The relational data behind WordPress and WooCommerce sites.' },
      { name: 'SQL', status: 'Core', usage: 'Queries and data-modelling fundamentals.' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git', status: 'Core', usage: 'Version control for everyday development.' },
      { name: 'GitHub', status: 'Core', usage: 'Hosting repositories and collaborating on code.' },
      { name: 'Vite', status: 'Growing', usage: 'Fast frontend tooling and builds.' },
      { name: 'npm', status: 'Core', usage: 'Package management for frontend projects.' },
      { name: 'Composer', status: 'Core', usage: 'PHP dependency management.' },
      { name: 'Figma', status: 'Core', usage: 'Reading and implementing designs faithfully.' },
      { name: 'VS Code', status: 'Core', usage: 'Day-to-day editor.' },
    ],
  },
  {
    id: 'interests',
    label: 'Additional interests',
    skills: [
      { name: 'Linux', status: 'Exploring', usage: 'Comfortable-in-the-terminal curiosity, applied to servers and deployment.' },
      { name: 'Networking', status: 'Exploring', usage: 'Understanding how requests, DNS and servers fit together.' },
      { name: 'Servers', status: 'Exploring', usage: 'Setting up and understanding hosting environments.' },
      { name: 'Deployment', status: 'Exploring', usage: 'Getting projects reliably from local to live.' },
      { name: 'Automation', status: 'Exploring', usage: 'Removing repetitive work with scripts and tooling.' },
      { name: 'AI-assisted development', status: 'Exploring', usage: 'Using AI tools to speed up development while keeping engineering judgement in charge.' },
    ],
  },
];
