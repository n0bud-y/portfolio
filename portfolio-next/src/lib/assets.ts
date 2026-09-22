/**
 * Server-side helpers that look at /public so the UI never renders a broken
 * image or a dead resume button. Evaluated at build time (and per request in dev),
 * so rebuild after adding files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { projects, type Project } from '@/data/projects';
import { siteConfig } from '@/data/siteConfig';

const publicDir = path.join(process.cwd(), 'public');
const EXTS = ['webp', 'jpg', 'jpeg', 'png'];

function findImage(base: string): string | undefined {
  for (const ext of EXTS) {
    if (fs.existsSync(path.join(publicDir, 'projects', `${base}.${ext}`))) {
      return `/projects/${base}.${ext}`;
    }
  }
  return undefined;
}

export type ResolvedProject = Project & {
  image?: string;
  mobileImage?: string;
  gallery: string[];
};

function resolve(project: Project): ResolvedProject {
  const gallery: string[] = [];
  for (let i = 2; i <= 6; i++) {
    const found = findImage(`${project.slug}-${i}`);
    if (found) gallery.push(found);
  }
  return {
    ...project,
    image: findImage(project.slug),
    mobileImage: findImage(`${project.slug}-mobile`),
    gallery,
  };
}

export const getProjects = (): ResolvedProject[] => projects.map(resolve);

export const getProject = (slug: string): ResolvedProject | undefined => {
  const p = projects.find((x) => x.slug === slug);
  return p ? resolve(p) : undefined;
};

export function hasResume(): boolean {
  return fs.existsSync(path.join(publicDir, siteConfig.resume));
}
