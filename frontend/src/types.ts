 export interface User{
    id:string,
    name:string,
    country:string,
    email:string,
    password?:string
    projects:Task[]
}
 export interface Task {
  id: string;
  title: string;
  description: string;
  creationDate:string
  completionDate?: string ;
  status:"pending" | "completed"
}
 export interface Project {
  description: string;
  id: string;
  name: string;
  tasks: Task[];
  // creationDate: string;
}