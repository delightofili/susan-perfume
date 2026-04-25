import perfume1 from "../../public/images/perfume1.png";
import perfume2 from "../../public/images/perfume2.png";

const products = [
  {
    id: "susan-gold",
    name: "Susan Gold",
    price: 25000,
    category: "Unisex",
    image: perfume1,
    description:
      "A luxurious blend of warm amber, soft vanilla, and refined floral notes. Designed for elegance and confidence.",
    notes: ["Amber", "Vanilla", "White Florals"],
    size: "50ml",
    stock: 12,
    createdAt: "2024-12-01",
    bestSeller: true,
    discount: "15%",
  },
  {
    id: "susan-noir",
    name: "Susan Noir",
    price: 30000,
    category: "Men",
    image: perfume2,
    description:
      "Deep, mysterious, and bold. A signature scent with smoky woods and dark spices.",
    notes: ["Oud", "Black Pepper", "Leather"],
    size: "50ml",
    stock: 8,
    createdAt: "2024-11-20",
    bestSeller: false,
    discount: "20%",
  },
  {
    id: "susan-noir2",
    name: "Susan Noir",
    price: 34000,
    category: "Men",
    image: perfume1,
    description:
      "Deep, mysterious, and bold. A signature scent with smoky woods and dark spices.",
    notes: ["Oud", "Black Pepper", "Leather"],
    size: "50ml",
    stock: 8,
    createdAt: "2024-11-20",
    bestSeller: false,
    discount: "10%",
  },
];

export default products;
