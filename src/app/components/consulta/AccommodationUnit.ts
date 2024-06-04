export interface AccommodationUnit {
    id: number,
    price: number,
    number: number,
    capacity: number,
    accommodation: {
        id: number,
        name: string,
        description: string,
        address: string,
        location: string
    },
    category: {
        id: number,
        name: string
    }
}