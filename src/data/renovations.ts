export type StoreId =
  | "home-depot"
  | "lowes"
  | "floor-decor"
  | "ferguson"
  | "sherwin"
  | "costco"
  | "lumber-liquidators"
  | "ikea";

export const STORES: Record<
  StoreId,
  { name: string; short: string; color: string; baseUrl: string }
> = {
  "home-depot": {
    name: "The Home Depot",
    short: "Home Depot",
    color: "#F96302",
    baseUrl: "https://www.homedepot.com/s/",
  },
  lowes: {
    name: "Lowe's",
    short: "Lowe's",
    color: "#004990",
    baseUrl: "https://www.lowes.com/search?searchTerm=",
  },
  "floor-decor": {
    name: "Floor & Decor",
    short: "Floor & Decor",
    color: "#1B4D3E",
    baseUrl: "https://www.flooranddecor.com/search?q=",
  },
  ferguson: {
    name: "Ferguson Home",
    short: "Ferguson",
    color: "#003366",
    baseUrl: "https://www.fergusonhome.com/search?text=",
  },
  sherwin: {
    name: "Sherwin-Williams",
    short: "Sherwin",
    color: "#006341",
    baseUrl: "https://www.sherwin-williams.com/search?q=",
  },
  costco: {
    name: "Costco",
    short: "Costco",
    color: "#E31837",
    baseUrl: "https://www.costco.com/CatalogSearch?dept=All&keyword=",
  },
  "lumber-liquidators": {
    name: "LL Flooring",
    short: "LL Flooring",
    color: "#8B4513",
    baseUrl: "https://www.llflooring.com/search?q=",
  },
  ikea: {
    name: "IKEA",
    short: "IKEA",
    color: "#0051BA",
    baseUrl: "https://www.ikea.com/us/en/search/?q=",
  },
};

export type MaterialLine = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  unitCost: number;
  store: StoreId;
  sku?: string;
  searchQuery: string;
  laborHours?: number;
  laborRate?: number;
  notes?: string;
};

export type RenovationOption = {
  id: string;
  name: string;
  category:
    | "kitchen"
    | "bath"
    | "flooring"
    | "paint"
    | "exterior"
    | "systems"
    | "landscape"
    | "adu"
    | "cosmetic";
  description: string;
  arvLift: number;
  days: number;
  difficulty: "DIY" | "Pro" | "Hybrid";
  materials: MaterialLine[];
  steps: string[];
};

function m(
  partial: Omit<MaterialLine, "id"> & { id?: string },
): MaterialLine {
  return {
    id: partial.id ?? partial.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    ...partial,
  };
}

export const RENOVATION_OPTIONS: RenovationOption[] = [
  {
    id: "kitchen-refresh",
    name: "Kitchen Refresh (Cabinets + Counters)",
    category: "kitchen",
    description:
      "Paint/refinish cabinets, new quartz counters, hardware, faucet, under-cabinet lighting. Highest $/day lift in North Bay mid-tier homes.",
    arvLift: 45000,
    days: 14,
    difficulty: "Hybrid",
    materials: [
      m({
        name: "Calacatta quartz slab (56 sq ft)",
        qty: 56,
        unit: "sq ft",
        unitCost: 68,
        store: "floor-decor",
        searchQuery: "calacatta quartz countertop",
        notes: "Include 15% waste; fabricate locally",
      }),
      m({
        name: "Cabinet paint kit (primer + enamel)",
        qty: 2,
        unit: "kit",
        unitCost: 89,
        store: "sherwin",
        searchQuery: "cabinet enamel kit",
      }),
      m({
        name: "Soft-close hinge set (25 pack)",
        qty: 2,
        unit: "pack",
        unitCost: 42,
        store: "home-depot",
        searchQuery: "soft close cabinet hinges",
      }),
      m({
        name: "Brushed nickel bar pulls (10 pack)",
        qty: 3,
        unit: "pack",
        unitCost: 34,
        store: "home-depot",
        searchQuery: "cabinet bar pulls brushed nickel",
      }),
      m({
        name: "Moen Align kitchen faucet",
        qty: 1,
        unit: "ea",
        unitCost: 289,
        store: "ferguson",
        searchQuery: "Moen Align kitchen faucet",
        sku: "7594SRS",
      }),
      m({
        name: "LED under-cabinet light strip 9ft",
        qty: 2,
        unit: "ea",
        unitCost: 48,
        store: "home-depot",
        searchQuery: "LED under cabinet lighting kit",
      }),
      m({
        name: "Subway tile backsplash (30 sq ft)",
        qty: 35,
        unit: "sq ft",
        unitCost: 4.2,
        store: "floor-decor",
        searchQuery: "white subway tile 3x6",
      }),
    ],
    steps: [
      "Empty cabinets; label doors/drawers",
      "Degrease, sand, prime, spray enamel (or hire spray finisher)",
      "Template and install quartz (pro fab)",
      "Install new faucet + shutoffs",
      "Tile backsplash; seal grout",
      "Hardware + under-cabinet lighting",
      "Stage with neutral bar stools and greenery",
    ],
  },
  {
    id: "kitchen-full",
    name: "Full Kitchen Gut (IKEA + Appliances)",
    category: "kitchen",
    description:
      "Full cabinet replacement (SEKTION), mid-tier appliances, LVP floor, layout open if load-bearing allows.",
    arvLift: 85000,
    days: 28,
    difficulty: "Pro",
    materials: [
      m({
        name: "IKEA SEKTION kitchen package (est.)",
        qty: 1,
        unit: "set",
        unitCost: 9200,
        store: "ikea",
        searchQuery: "SEKTION kitchen",
      }),
      m({
        name: "Bosch 800 series range",
        qty: 1,
        unit: "ea",
        unitCost: 2499,
        store: "home-depot",
        searchQuery: "Bosch 800 series gas range",
      }),
      m({
        name: "Bosch dishwasher 500",
        qty: 1,
        unit: "ea",
        unitCost: 899,
        store: "home-depot",
        searchQuery: "Bosch 500 dishwasher",
      }),
      m({
        name: "Quartz counters installed (est.)",
        qty: 60,
        unit: "sq ft",
        unitCost: 85,
        store: "floor-decor",
        searchQuery: "quartz countertop slab",
      }),
      m({
        name: "Waterproof LVP 7in planks",
        qty: 220,
        unit: "sq ft",
        unitCost: 3.49,
        store: "floor-decor",
        searchQuery: "waterproof luxury vinyl plank",
      }),
    ],
    steps: [
      "Pull permits if gas/electrical moves",
      "Demo to studs where needed; abate if pre-1978 paint/tile",
      "Rough plumbing + electrical",
      "Install cabinets level and plumb",
      "Counter template → install",
      "Appliances, trim, paint, final inspection",
    ],
  },
  {
    id: "bath-primary",
    name: "Primary Bath Remodel",
    category: "bath",
    description:
      "Walk-in shower conversion, new vanity, tile, LED mirror. Strong pull in Santa Rosa / Petaluma comps.",
    arvLift: 32000,
    days: 18,
    difficulty: "Pro",
    materials: [
      m({
        name: "Frameless glass shower enclosure",
        qty: 1,
        unit: "ea",
        unitCost: 1450,
        store: "home-depot",
        searchQuery: "frameless glass shower door",
      }),
      m({
        name: "Schluter shower waterproofing kit",
        qty: 1,
        unit: "kit",
        unitCost: 485,
        store: "home-depot",
        searchQuery: "Schluter Kerdi shower kit",
      }),
      m({
        name: "Large-format porcelain wall tile",
        qty: 120,
        unit: "sq ft",
        unitCost: 5.8,
        store: "floor-decor",
        searchQuery: "12x24 porcelain tile gray",
      }),
      m({
        name: "48in double vanity + quartz top",
        qty: 1,
        unit: "ea",
        unitCost: 1299,
        store: "home-depot",
        searchQuery: "48 inch double bathroom vanity",
      }),
      m({
        name: "Moen align shower trim + valve",
        qty: 1,
        unit: "set",
        unitCost: 318,
        store: "ferguson",
        searchQuery: "Moen Align shower faucet",
      }),
      m({
        name: "LED vanity mirror 48in",
        qty: 1,
        unit: "ea",
        unitCost: 289,
        store: "home-depot",
        searchQuery: "LED bathroom vanity mirror 48",
      }),
      m({
        name: "Exhaust fan with light + humidity",
        qty: 1,
        unit: "ea",
        unitCost: 168,
        store: "home-depot",
        searchQuery: "bathroom exhaust fan humidity sensor",
      }),
    ],
    steps: [
      "Demo tub/shower; inspect subfloor and drain",
      "Install Schluter or equivalent waterproofing",
      "Set tile; cure; install glass",
      "Vanity, fixtures, mirror, paint",
      "Caulk + silicone; water test 24h",
    ],
  },
  {
    id: "bath-secondary",
    name: "Hall Bath Cosmetic Update",
    category: "bath",
    description: "Paint, vanity swap, new toilet, tile floor, fixtures — fast flip ROI.",
    arvLift: 12000,
    days: 7,
    difficulty: "Hybrid",
    materials: [
      m({
        name: "30in single vanity",
        qty: 1,
        unit: "ea",
        unitCost: 449,
        store: "home-depot",
        searchQuery: "30 inch bathroom vanity",
      }),
      m({
        name: "Comfort-height elongated toilet",
        qty: 1,
        unit: "ea",
        unitCost: 249,
        store: "home-depot",
        searchQuery: "comfort height elongated toilet",
      }),
      m({
        name: "Ceramic floor tile 12x12",
        qty: 45,
        unit: "sq ft",
        unitCost: 2.4,
        store: "floor-decor",
        searchQuery: "ceramic floor tile 12x12",
      }),
      m({
        name: "Delta bathroom faucet",
        qty: 1,
        unit: "ea",
        unitCost: 129,
        store: "ferguson",
        searchQuery: "Delta bathroom faucet chrome",
      }),
      m({
        name: "Interior bath paint (gallon)",
        qty: 1,
        unit: "gal",
        unitCost: 52,
        store: "sherwin",
        searchQuery: "bathroom paint mildew resistant",
      }),
    ],
    steps: [
      "Demo vanity/toilet; protect tub surround if keeping",
      "Set tile floor",
      "Install vanity, toilet, fixtures",
      "Paint ceiling + walls; replace exhaust grille",
    ],
  },
  {
    id: "lvp-whole-house",
    name: "Whole-Home Waterproof LVP",
    category: "flooring",
    description:
      "Replace worn carpet/dated tile with continuous LVP. Huge first-impression lift for North Bay buyers.",
    arvLift: 28000,
    days: 8,
    difficulty: "Pro",
    materials: [
      m({
        name: "Waterproof LVP (with underlayment)",
        qty: 1400,
        unit: "sq ft",
        unitCost: 3.29,
        store: "floor-decor",
        searchQuery: "waterproof rigid core LVP",
      }),
      m({
        name: "Transitions + quarter round",
        qty: 1,
        unit: "kit",
        unitCost: 320,
        store: "home-depot",
        searchQuery: "vinyl plank transition strips",
      }),
      m({
        name: "Moisture barrier / leveler",
        qty: 4,
        unit: "bag",
        unitCost: 38,
        store: "home-depot",
        searchQuery: "self leveling underlayment",
      }),
    ],
    steps: [
      "Remove carpet/base; check moisture",
      "Level subfloor; install underlayment where required",
      "Float LVP; leave expansion gaps",
      "Trim, transitions, clean for photos",
    ],
  },
  {
    id: "interior-paint",
    name: "Full Interior Paint + Trim",
    category: "paint",
    description: "Neutral whole-house paint (walls, ceilings, doors, trim).",
    arvLift: 14000,
    days: 6,
    difficulty: "Hybrid",
    materials: [
      m({
        name: "Interior eggshell (5-gal)",
        qty: 4,
        unit: "pail",
        unitCost: 168,
        store: "sherwin",
        searchQuery: "Duration Home interior paint 5 gallon",
      }),
      m({
        name: "Ceiling flat (5-gal)",
        qty: 2,
        unit: "pail",
        unitCost: 129,
        store: "sherwin",
        searchQuery: "ceiling paint flat white 5 gallon",
      }),
      m({
        name: "Trim enamel (gallon)",
        qty: 3,
        unit: "gal",
        unitCost: 62,
        store: "sherwin",
        searchQuery: "trim enamel semi gloss",
      }),
      m({
        name: "Painter's supplies kit",
        qty: 1,
        unit: "kit",
        unitCost: 145,
        store: "home-depot",
        searchQuery: "painter tape drop cloth roller kit",
      }),
    ],
    steps: [
      "Choose one wall + one trim color (avoid busy schemes)",
      "Patch drywall; caulk gaps",
      "Cut in + roll; two coats high-traffic areas",
      "Doors last; stage after cure",
    ],
  },
  {
    id: "curb-appeal",
    name: "Curb Appeal Package",
    category: "exterior",
    description:
      "Front door, house numbers, landscaping, lighting, power-wash, mulch — photo-ready street view.",
    arvLift: 18000,
    days: 5,
    difficulty: "DIY",
    materials: [
      m({
        name: "Solid wood/fiberglass front door",
        qty: 1,
        unit: "ea",
        unitCost: 680,
        store: "home-depot",
        searchQuery: "fiberglass front door black",
      }),
      m({
        name: "Smart deadbolt + handleset",
        qty: 1,
        unit: "set",
        unitCost: 249,
        store: "home-depot",
        searchQuery: "Schlage Encode smart lock",
      }),
      m({
        name: "LED exterior wall sconces (pair)",
        qty: 1,
        unit: "pair",
        unitCost: 168,
        store: "home-depot",
        searchQuery: "exterior wall sconce black LED",
      }),
      m({
        name: "Drought-tolerant plant pack",
        qty: 1,
        unit: "lot",
        unitCost: 420,
        store: "home-depot",
        searchQuery: "drought tolerant landscaping plants",
      }),
      m({
        name: "Mulch + decorative rock",
        qty: 20,
        unit: "bag",
        unitCost: 5.5,
        store: "lowes",
        searchQuery: "landscape mulch bag",
      }),
      m({
        name: "House numbers modern set",
        qty: 1,
        unit: "set",
        unitCost: 48,
        store: "home-depot",
        searchQuery: "modern house numbers black",
      }),
    ],
    steps: [
      "Pressure wash siding, driveway, walks",
      "Install door + hardware",
      "Replace exterior lights; add path lighting",
      "Weed beds; mulch; plant structure shrubs",
      "Fresh house numbers + mailbox",
    ],
  },
  {
    id: "roof-asphalt",
    name: "Architectural Shingle Roof",
    category: "exterior",
    description:
      "30-year architectural shingles. Critical when inspection flags aging roof — unlocks financing and comps.",
    arvLift: 35000,
    days: 4,
    difficulty: "Pro",
    materials: [
      m({
        name: "Architectural shingles (bundle est.)",
        qty: 48,
        unit: "bundle",
        unitCost: 42,
        store: "home-depot",
        searchQuery: "architectural asphalt shingles",
      }),
      m({
        name: "Synthetic underlayment rolls",
        qty: 6,
        unit: "roll",
        unitCost: 118,
        store: "home-depot",
        searchQuery: "synthetic roof underlayment",
      }),
      m({
        name: "Ridge vent + flashing kit",
        qty: 1,
        unit: "kit",
        unitCost: 380,
        store: "home-depot",
        searchQuery: "ridge vent kit roofing",
      }),
    ],
    steps: [
      "Pull roof permit; HOA if needed",
      "Tear-off; inspect sheathing",
      "Install underlayment + ice/water valleys",
      "Shingles + ridge; haul-away dumpster",
      "Provide warranty docs for listing",
    ],
  },
  {
    id: "hvac-heat-pump",
    name: "Heat Pump HVAC Replacement",
    category: "systems",
    description:
      "High-efficiency heat pump — strong North Bay energy-code story and buyer comfort.",
    arvLift: 22000,
    days: 3,
    difficulty: "Pro",
    materials: [
      m({
        name: "3-ton heat pump system (equip)",
        qty: 1,
        unit: "system",
        unitCost: 6800,
        store: "home-depot",
        searchQuery: "heat pump HVAC system 3 ton",
      }),
      m({
        name: "Smart thermostat",
        qty: 1,
        unit: "ea",
        unitCost: 249,
        store: "costco",
        searchQuery: "ecobee smart thermostat",
      }),
      m({
        name: "Air filter MERV-13 (6-pack)",
        qty: 1,
        unit: "pack",
        unitCost: 48,
        store: "home-depot",
        searchQuery: "MERV 13 air filter 16x25",
      }),
    ],
    steps: [
      "Load calc; pull mechanical permit",
      "Set outdoor unit + line set",
      "Commission airflow; register balancing",
      "Register rebate (PG&E / TECH Clean CA if eligible)",
    ],
  },
  {
    id: "landscape-turf-pad",
    name: "Backyard Multi-Sport Pad Ready",
    category: "landscape",
    description:
      "Level pad, drainage, artificial turf option — appeal to North Bay families (soccer/futsal/basketball).",
    arvLift: 25000,
    days: 10,
    difficulty: "Pro",
    materials: [
      m({
        name: "Class II base rock",
        qty: 12,
        unit: "yard",
        unitCost: 68,
        store: "home-depot",
        searchQuery: "class 2 base rock",
      }),
      m({
        name: "Artificial turf (family grade)",
        qty: 800,
        unit: "sq ft",
        unitCost: 3.85,
        store: "home-depot",
        searchQuery: "artificial grass turf roll",
      }),
      m({
        name: "Infill + seaming tape kit",
        qty: 1,
        unit: "kit",
        unitCost: 420,
        store: "home-depot",
        searchQuery: "artificial turf installation kit",
      }),
      m({
        name: "French drain pipe + fabric",
        qty: 80,
        unit: "ft",
        unitCost: 4.2,
        store: "lowes",
        searchQuery: "perforated drain pipe 4 inch",
      }),
      m({
        name: "LED string + pathway lights",
        qty: 1,
        unit: "set",
        unitCost: 189,
        store: "costco",
        searchQuery: "outdoor string lights LED",
      }),
    ],
    steps: [
      "Grade for drainage away from foundation",
      "Install French drain if pooling",
      "Compact base; install turf or pour sports coating",
      "Edge restrainers; lighting; photo at golden hour",
    ],
  },
  {
    id: "adu-feasibility",
    name: "ADU / JADU Feasibility Package",
    category: "adu",
    description:
      "Plans, soils, basic utility stub-out assessment — unlocks huge equity story in Marin/Sonoma for rental income.",
    arvLift: 95000,
    days: 45,
    difficulty: "Pro",
    materials: [
      m({
        name: "Permit-ready ADU plan set (stock)",
        qty: 1,
        unit: "set",
        unitCost: 4500,
        store: "home-depot",
        searchQuery: "ADU building plans",
        notes: "Or local architect; stock plans accelerate",
      }),
      m({
        name: "Perc / soils report deposit",
        qty: 1,
        unit: "ea",
        unitCost: 2800,
        store: "home-depot",
        searchQuery: "geotechnical report",
        notes: "Coordinate with local engineer",
      }),
      m({
        name: "Utility panel upgrade allowance",
        qty: 1,
        unit: "allow",
        unitCost: 4500,
        store: "home-depot",
        searchQuery: "200 amp electrical panel",
      }),
    ],
    steps: [
      "Confirm lot coverage / setbacks with city planning",
      "Order soils + survey if needed",
      "Submit ADU plans; track comments",
      "Market listing with 'ADU-ready' package + rent comps",
    ],
  },
  {
    id: "staging-cosmetic",
    name: "Staging + Cosmetic Punch List",
    category: "cosmetic",
    description:
      "Deep clean, minor repairs, lighting bulbs, hardware, window treatments, professional photos.",
    arvLift: 9000,
    days: 4,
    difficulty: "DIY",
    materials: [
      m({
        name: "LED bulb multipack (warm white)",
        qty: 3,
        unit: "pack",
        unitCost: 28,
        store: "costco",
        searchQuery: "LED light bulbs soft white multipack",
      }),
      m({
        name: "Door hardware pack",
        qty: 1,
        unit: "set",
        unitCost: 120,
        store: "home-depot",
        searchQuery: "interior door lever set satin nickel",
      }),
      m({
        name: "Window covering temporary",
        qty: 8,
        unit: "ea",
        unitCost: 24,
        store: "ikea",
        searchQuery: "room darkening blinds",
      }),
      m({
        name: "Professional photo + drone allowance",
        qty: 1,
        unit: "session",
        unitCost: 450,
        store: "home-depot",
        searchQuery: "real estate photography",
        notes: "Local photographer preferred",
      }),
    ],
    steps: [
      "Walk property with punch list app",
      "Fix squeaks, outlets, caulk, smoke detectors",
      "Deep clean (hire if >2k sq ft)",
      "Stage key rooms; schedule twilight photos",
    ],
  },
];

export function materialCost(line: MaterialLine): number {
  return line.qty * line.unitCost;
}

export function renovationMaterialsCost(opt: RenovationOption): number {
  return opt.materials.reduce((sum, line) => sum + materialCost(line), 0);
}

export function renovationLaborCost(opt: RenovationOption): number {
  const mat = renovationMaterialsCost(opt);
  const mult =
    opt.difficulty === "DIY" ? 0.15 : opt.difficulty === "Hybrid" ? 0.55 : 0.85;
  return Math.round(mat * mult);
}

export function renovationTotalCost(opt: RenovationOption): number {
  return renovationMaterialsCost(opt) + renovationLaborCost(opt);
}

export function storeSearchUrl(store: StoreId, query: string): string {
  return `${STORES[store].baseUrl}${encodeURIComponent(query)}`;
}
