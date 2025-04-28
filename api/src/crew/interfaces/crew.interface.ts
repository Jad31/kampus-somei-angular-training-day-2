export interface CrewMember {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'inactive';
  specialization: string;
  missions: number[];
}
