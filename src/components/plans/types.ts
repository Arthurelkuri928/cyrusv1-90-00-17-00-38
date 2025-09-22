
export interface Plan {
  name: string;
  price: number;
  period: string;
  validity: string;
  highlight: boolean;
  badge?: string;
}

export interface Feature {
  icon: React.ReactNode;
  name: string;
  value?: string;
  included?: boolean;
}
