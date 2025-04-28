export interface Place {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  location: string;
  details?: string[];
}

export const places: Place[] = [
  {
    id: 1,
    name: "Caerlaverock Castle",
    description: "A moated triangular castle from the 13th century. This unique castle is one of Scotland's most impressive medieval fortresses, featuring a distinctive triangular design and a moat.",
    image: "/images/caerlaverock.jpg",
    category: "Historic",
    location: "Dumfries DG1 4RU",
    details: [
      "13th-century castle",
      "Unique triangular design",
      "Surrounded by moat",
      "Nature trails nearby",
      "Visitor center and exhibitions",
      "Family-friendly activities"
    ]
  },
  {
    id: 2,
    name: "Sweetheart Abbey",
    description: "A beautiful red sandstone abbey founded in 1273, showcasing remarkable medieval architecture.",
    image: "/images/sweetheart-abbey.jpg",
    category: "Historic",
    location: "New Abbey, Dumfries DG2 8BU",
    details: [
      "Founded in 1273",
      "Red sandstone architecture",
      "Medieval ruins",
      "Historic graveyard",
      "Visitor information center",
      "Guided tours available"
    ]
  },
  {
    id: 3,
    name: "Threave Castle",
    description: "An impressive tower house on an island in the River Dee, accessible by boat.",
    image: "/images/threave-castle.jpg",
    category: "Historic",
    location: "Castle Douglas DG7 1TJ",
    details: [
      "Island fortress",
      "Boat access only",
      "Medieval architecture",
      "Wildlife spotting",
      "Guided tours",
      "Photography opportunities"
    ]
  },
  {
    id: 4,
    name: "Galloway Forest Park",
    description: "Britain's largest forest park, offering stunning landscapes and outdoor activities.",
    image: "/images/galloway-forest.jpg",
    category: "Nature",
    location: "Newton Stewart DG8 7BE",
    details: [
      "Dark Sky Park status",
      "Mountain biking trails",
      "Wildlife watching",
      "Walking routes",
      "Visitor centers",
      "Stargazing opportunities"
    ]
  },
  {
    id: 5,
    name: "Cream o' Galloway",
    description: "A working dairy farm offering ice cream making experiences and family activities.",
    image: "/images/cream-galloway.jpg",
    category: "Family",
    location: "Gatehouse of Fleet, Castle Douglas DG7 2DR",
    details: [
      "Ice cream making workshops",
      "Farm tours",
      "Adventure playground",
      "Nature trails",
      "Cafe and shop",
      "Family events"
    ]
  },
  {
    id: 6,
    name: "Logan Botanic Garden",
    description: "Scotland's most exotic garden featuring unique plants from around the world.",
    image: "/images/logan-garden.jpg",
    category: "Nature",
    location: "Port Logan, Stranraer DG9 9ND",
    details: [
      "Exotic plant collections",
      "Walled garden",
      "Palm house",
      "Discovery centre",
      "Guided tours",
      "Seasonal events"
    ]
  }
]; 