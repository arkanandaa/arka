export interface Role {
  id?: string;
  title: string;
  description: string;
}

export interface Expertise {
  id?: string;
  title: string;
  description: string;
  longDescription?: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  link: string;
  tags: string[];
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
}
