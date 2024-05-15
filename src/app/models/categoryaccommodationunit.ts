export interface Categoryaccommodationunit {
  id: number;
  category: {
    id: number;
    name: string;
  };
  accommodationUnit: {
    id: number;
    address: string;
    price: number;
    description: string;
    number: number;
    capacity: number;
    name: string;
    lessor: {
      id: number;
      name: string;
      surname: string;
      email: string;
      password: string;
      phone: number;
    };
    accommodation: {
      id: number;
      name: string;
      description: string;
      address: string;
    };
  };
}
