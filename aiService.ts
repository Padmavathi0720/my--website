import { MaterialCategory, AiVisionResult } from '../types';

export const analyzeMaterialPhoto = async (
  categoryHint?: MaterialCategory
): Promise<AiVisionResult> => {
  // Simulate AI Vision inference latency with realistic processing feedback
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (categoryHint === 'Metal') {
    return {
      detectedCategory: 'Metal',
      detectedName: 'Copper Wiring & Heavy Aluminium Offcuts',
      confidence: 91,
      alternativeOptions: ['Aluminium utensil scrap', 'Clean bare copper wiring', 'Mixed iron scrap'],
      subCategories: [
        'Insulated copper motor winding wire (70% copper recovery)',
        'Extruded aluminium architectural scrap',
        'Light sheet iron casing'
      ],
      suggestedPriceMin: 52,
      suggestedPriceMax: 68,
      safetyAlert: 'Warning: Sharp burrs and metal edges present. Use heavy leather gloves during handling.'
    };
  }

  if (categoryHint === 'Plastic') {
    return {
      detectedCategory: 'Plastic',
      detectedName: 'Rigid HDPE Milk & Oil Containers (Resin 2)',
      confidence: 94,
      alternativeOptions: ['PET mineral water bottles', 'PP polypropylene buckets', 'LDPE plastic film'],
      subCategories: [
        'High-density polyethylene containers (uncontaminated)',
        'HDPE colored bottle caps & lids',
        'Degreased detergent canisters'
      ],
      suggestedPriceMin: 22,
      suggestedPriceMax: 32,
      safetyAlert: 'Inspect for chemical pesticide or motor oil residues. Empty and isolate hazardous bottles.'
    };
  }

  if (categoryHint === 'Paper') {
    return {
      detectedCategory: 'Paper',
      detectedName: 'Corrugated Kraft Boxes & Newspaper Bundles',
      confidence: 92,
      alternativeOptions: ['Office white ledger paper', 'Mixed magazines', 'Greyboard cartons'],
      subCategories: [
        'Clean corrugated cardboard packaging (dry grade)',
        'Sorted newsprint raddi bundles',
        'Duplex packaging board'
      ],
      suggestedPriceMin: 14,
      suggestedPriceMax: 19,
      safetyAlert: 'Keep bundles dry. Moisture reduces sale price and causes mould hazards.'
    };
  }

  // Default Core Workflow: E-waste Scenario
  return {
    detectedCategory: 'E-waste',
    detectedName: 'Mixed Electronic Scrap',
    confidence: 87,
    alternativeOptions: [
      'Desktop computer motherboard parts',
      'Household small appliances',
      'Mixed telecom and charger wiring'
    ],
    subCategories: [
      'Grade B/C populated circuit boards (IC chips intact)',
      'SMPS internal power supply units and transformers',
      'Copper-rich power adapter leads and ribbon cables'
    ],
    suggestedPriceMin: 280,
    suggestedPriceMax: 340,
    safetyAlert: 'CRITICAL SAFETY: Do not crush or dismantle lithium batteries! Separate swollen or pierced battery cells immediately to avoid fire.'
  };
};

export const parseVoiceCommand = (
  text: string
): { material?: MaterialCategory; weight?: number; raw: string } => {
  const normalized = text.toLowerCase().trim();
  let material: MaterialCategory | undefined = undefined;
  let weight: number | undefined = undefined;

  // 1. Extract numeric weight (supports numbers, decimals, Devanagari and Tamil numerals)
  const numeralMap: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
    '௧': '1', '௨': '2', '௩': '3', '௪': '4', '௫': '5',
    '௬': '6', '௭': '7', '௮': '8', '௯': '9', '௰': '10'
  };
  let processedText = normalized;
  Object.keys(numeralMap).forEach((d) => {
    processedText = processedText.replaceAll(d, numeralMap[d]);
  });

  const numMatch = processedText.match(/(\d+(\.\d+)?)/);
  if (numMatch) {
    weight = parseFloat(numMatch[1]);
  }

  // 2. Identify material keywords across English, Tamil, Hindi, and Marathi
  if (
    processedText.includes('electronic') ||
    processedText.includes('e-waste') ||
    processedText.includes('ewaste') ||
    processedText.includes('மின்') ||
    processedText.includes('மின்னணு') ||
    processedText.includes('கம்ப்யூட்டர்') ||
    processedText.includes('போன்') ||
    processedText.includes('ஈ-வேஸ்ட்') ||
    processedText.includes('ई-कचरा') ||
    processedText.includes('ई कचरा') ||
    processedText.includes('इलेक्ट्रॉनिक') ||
    processedText.includes('इलेक्ट्रोनिक') ||
    processedText.includes('संगणक') ||
    processedText.includes('computer') ||
    processedText.includes('battery') ||
    processedText.includes('wire') ||
    processedText.includes('pcb')
  ) {
    material = 'E-waste';
  } else if (
    processedText.includes('plastic') ||
    processedText.includes('பிளாஸ்டிக்') ||
    processedText.includes('நெகிழி') ||
    processedText.includes('பாட்டில்') ||
    processedText.includes('டப்பா') ||
    processedText.includes('प्लास्टिक') ||
    processedText.includes('प्लॅस्टिक') ||
    processedText.includes('बाटली') ||
    processedText.includes('bottle') ||
    processedText.includes('dabba') ||
    processedText.includes('डब्बा')
  ) {
    material = 'Plastic';
  } else if (
    processedText.includes('metal') ||
    processedText.includes('இரும்பு') ||
    processedText.includes('செம்பு') ||
    processedText.includes('தாமிரம்') ||
    processedText.includes('அலுமினியம்') ||
    processedText.includes('பித்தளை') ||
    processedText.includes('உலோகம்') ||
    processedText.includes('लोहा') ||
    processedText.includes('लोखंड') ||
    processedText.includes('तांबा') ||
    processedText.includes('तांबे') ||
    processedText.includes('copper') ||
    processedText.includes('iron') ||
    processedText.includes('aluminium') ||
    processedText.includes('एल्युमिनियम')
  ) {
    material = 'Metal';
  } else if (
    processedText.includes('paper') ||
    processedText.includes('காகிதம்') ||
    processedText.includes('பேப்பர்') ||
    processedText.includes('அட்டை') ||
    processedText.includes('செய்தித்தாள்') ||
    processedText.includes('कागज') ||
    processedText.includes('कागद') ||
    processedText.includes('रद्दी') ||
    processedText.includes('cardboard') ||
    processedText.includes('पुठ्ठा')
  ) {
    material = 'Paper';
  }

  return { material, weight, raw: text };
};
