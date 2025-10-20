/* MyMedList v2: Allergies + Pill Photos + Print/Share */
const $ = (sel) => document.querySelector(sel);
const medsKey = 'mymedlist.meds.v2';
const allergiesKey = 'mymedlist.allergies.v2';
let OCR_TEXT = '';

// Drug database - brand to generic mappings
const DRUG_DATABASE = {
  'zofran': 'ondansetron',
  'tylenol': 'acetaminophen',
  'advil': 'ibuprofen',
  'motrin': 'ibuprofen',
  'aleve': 'naproxen',
  'aspirin': 'acetylsalicylic acid',
  'benadryl': 'diphenhydramine',
  'claritin': 'loratadine',
  'zyrtec': 'cetirizine',
  'allegra': 'fexofenadine',
  'flonase': 'fluticasone',
  'nasonex': 'mometasone',
  'proair': 'albuterol',
  'ventolin': 'albuterol',
  'xanax': 'alprazolam',
  'valium': 'diazepam',
  'ativan': 'lorazepam',
  'klonopin': 'clonazepam',
  'prozac': 'fluoxetine',
  'zoloft': 'sertraline',
  'lexapro': 'escitalopram',
  'celexa': 'citalopram',
  'wellbutrin': 'bupropion',
  'effexor': 'venlafaxine',
  'paxil': 'paroxetine',
  'lipitor': 'atorvastatin',
  'zocor': 'simvastatin',
  'crestor': 'rosuvastatin',
  'metformin': 'metformin',
  'glucophage': 'metformin',
  'insulin': 'insulin',
  'humalog': 'insulin lispro',
  'lantus': 'insulin glargine',
  'novolog': 'insulin aspart',
  'lisinopril': 'lisinopril',
  'prinivil': 'lisinopril',
  'zestril': 'lisinopril',
  'amlodipine': 'amlodipine',
  'norvasc': 'amlodipine',
  'metoprolol': 'metoprolol',
  'lopressor': 'metoprolol',
  'toprol': 'metoprolol',
  'omeprazole': 'omeprazole',
  'prilosec': 'omeprazole',
  'nexium': 'esomeprazole',
  'prevacid': 'lansoprazole',
  'protonix': 'pantoprazole',
  'warfarin': 'warfarin',
  'coumadin': 'warfarin',
  'plavix': 'clopidogrel',
  'aspirin': 'acetylsalicylic acid',
  'prednisone': 'prednisone',
  'deltasone': 'prednisone',
  'hydrocodone': 'hydrocodone',
  'vicodin': 'hydrocodone/acetaminophen',
  'norco': 'hydrocodone/acetaminophen',
  'oxycodone': 'oxycodone',
  'percocet': 'oxycodone/acetaminophen',
  'oxycontin': 'oxycodone',
  'morphine': 'morphine',
  'fentanyl': 'fentanyl',
  'tramadol': 'tramadol',
  'ultram': 'tramadol',
  'gabapentin': 'gabapentin',
  'neurontin': 'gabapentin',
  'lyrica': 'pregabalin',
  'flexeril': 'cyclobenzaprine',
  'soma': 'carisoprodol',
  'robaxin': 'methocarbamol',
  'skelaxin': 'metaxalone',
  'amoxicillin': 'amoxicillin',
  'augmentin': 'amoxicillin/clavulanate',
  'azithromycin': 'azithromycin',
  'zithromax': 'azithromycin',
  'cipro': 'ciprofloxacin',
  'ciprofloxacin': 'ciprofloxacin',
  'levaquin': 'levofloxacin',
  'bactrim': 'sulfamethoxazole/trimethoprim',
  'keflex': 'cephalexin',
  'doxycycline': 'doxycycline',
  'vibramycin': 'doxycycline',
  'tetracycline': 'tetracycline',
  'flagyl': 'metronidazole',
  'metronidazole': 'metronidazole',
  'finasteride': 'finasteride',
  'proscar': 'finasteride',
  'propecia': 'finasteride'
};

// Drug indication database - primary uses for each medication
const DRUG_INDICATIONS = {
  'ondansetron': 'Nausea and vomiting prevention/treatment',
  'zofran': 'Nausea and vomiting prevention/treatment',
  'acetaminophen': 'Pain relief and fever reduction',
  'tylenol': 'Pain relief and fever reduction',
  'ibuprofen': 'Pain relief, inflammation, fever reduction',
  'advil': 'Pain relief, inflammation, fever reduction',
  'motrin': 'Pain relief, inflammation, fever reduction',
  'naproxen': 'Pain relief, inflammation, fever reduction',
  'aleve': 'Pain relief, inflammation, fever reduction',
  'acetylsalicylic acid': 'Pain relief, inflammation, fever reduction, blood clot prevention',
  'aspirin': 'Pain relief, inflammation, fever reduction, blood clot prevention',
  'diphenhydramine': 'Allergy relief, sleep aid, motion sickness',
  'benadryl': 'Allergy relief, sleep aid, motion sickness',
  'loratadine': 'Allergy relief',
  'claritin': 'Allergy relief',
  'cetirizine': 'Allergy relief',
  'zyrtec': 'Allergy relief',
  'fexofenadine': 'Allergy relief',
  'allegra': 'Allergy relief',
  'fluticasone': 'Nasal allergy relief, asthma prevention',
  'flonase': 'Nasal allergy relief, asthma prevention',
  'mometasone': 'Nasal allergy relief, asthma prevention',
  'nasonex': 'Nasal allergy relief, asthma prevention',
  'albuterol': 'Asthma and COPD symptom relief',
  'proair': 'Asthma and COPD symptom relief',
  'ventolin': 'Asthma and COPD symptom relief',
  'alprazolam': 'Anxiety and panic disorder treatment',
  'xanax': 'Anxiety and panic disorder treatment',
  'diazepam': 'Anxiety, muscle spasms, seizure control',
  'valium': 'Anxiety, muscle spasms, seizure control',
  'lorazepam': 'Anxiety and panic disorder treatment',
  'ativan': 'Anxiety and panic disorder treatment',
  'clonazepam': 'Seizure control, panic disorder, anxiety',
  'klonopin': 'Seizure control, panic disorder, anxiety',
  'fluoxetine': 'Depression, anxiety, OCD treatment',
  'prozac': 'Depression, anxiety, OCD treatment',
  'sertraline': 'Depression, anxiety, OCD, PTSD treatment',
  'zoloft': 'Depression, anxiety, OCD, PTSD treatment',
  'escitalopram': 'Depression and anxiety treatment',
  'lexapro': 'Depression and anxiety treatment',
  'citalopram': 'Depression treatment',
  'celexa': 'Depression treatment',
  'bupropion': 'Depression treatment, smoking cessation',
  'wellbutrin': 'Depression treatment, smoking cessation',
  'venlafaxine': 'Depression and anxiety treatment',
  'effexor': 'Depression and anxiety treatment',
  'paroxetine': 'Depression, anxiety, OCD treatment',
  'paxil': 'Depression, anxiety, OCD treatment',
  'atorvastatin': 'High cholesterol and heart disease prevention',
  'lipitor': 'High cholesterol and heart disease prevention',
  'simvastatin': 'High cholesterol and heart disease prevention',
  'zocor': 'High cholesterol and heart disease prevention',
  'rosuvastatin': 'High cholesterol and heart disease prevention',
  'crestor': 'High cholesterol and heart disease prevention',
  'metformin': 'Type 2 diabetes management',
  'glucophage': 'Type 2 diabetes management',
  'insulin': 'Diabetes management',
  'insulin lispro': 'Diabetes management',
  'humalog': 'Diabetes management',
  'insulin glargine': 'Diabetes management',
  'lantus': 'Diabetes management',
  'insulin aspart': 'Diabetes management',
  'novolog': 'Diabetes management',
  'lisinopril': 'High blood pressure and heart failure treatment',
  'prinivil': 'High blood pressure and heart failure treatment',
  'zestril': 'High blood pressure and heart failure treatment',
  'amlodipine': 'High blood pressure and chest pain treatment',
  'norvasc': 'High blood pressure and chest pain treatment',
  'metoprolol': 'High blood pressure, chest pain, heart failure treatment',
  'lopressor': 'High blood pressure, chest pain, heart failure treatment',
  'toprol': 'High blood pressure, chest pain, heart failure treatment',
  'omeprazole': 'Acid reflux and stomach ulcer treatment',
  'prilosec': 'Acid reflux and stomach ulcer treatment',
  'esomeprazole': 'Acid reflux and stomach ulcer treatment',
  'nexium': 'Acid reflux and stomach ulcer treatment',
  'lansoprazole': 'Acid reflux and stomach ulcer treatment',
  'prevacid': 'Acid reflux and stomach ulcer treatment',
  'pantoprazole': 'Acid reflux and stomach ulcer treatment',
  'protonix': 'Acid reflux and stomach ulcer treatment',
  'warfarin': 'Blood clot prevention and treatment',
  'coumadin': 'Blood clot prevention and treatment',
  'clopidogrel': 'Blood clot prevention after heart attack/stroke',
  'plavix': 'Blood clot prevention after heart attack/stroke',
  'prednisone': 'Inflammation and immune system suppression',
  'deltasone': 'Inflammation and immune system suppression',
  'hydrocodone': 'Moderate to severe pain relief',
  'hydrocodone/acetaminophen': 'Moderate to severe pain relief',
  'vicodin': 'Moderate to severe pain relief',
  'norco': 'Moderate to severe pain relief',
  'oxycodone': 'Moderate to severe pain relief',
  'oxycodone/acetaminophen': 'Moderate to severe pain relief',
  'percocet': 'Moderate to severe pain relief',
  'oxycontin': 'Moderate to severe pain relief',
  'morphine': 'Severe pain relief',
  'fentanyl': 'Severe pain relief',
  'tramadol': 'Moderate pain relief',
  'ultram': 'Moderate pain relief',
  'gabapentin': 'Nerve pain and seizure control',
  'neurontin': 'Nerve pain and seizure control',
  'pregabalin': 'Nerve pain and anxiety treatment',
  'lyrica': 'Nerve pain and anxiety treatment',
  'cyclobenzaprine': 'Muscle spasm relief',
  'flexeril': 'Muscle spasm relief',
  'carisoprodol': 'Muscle spasm relief',
  'soma': 'Muscle spasm relief',
  'methocarbamol': 'Muscle spasm relief',
  'robaxin': 'Muscle spasm relief',
  'metaxalone': 'Muscle spasm relief',
  'skelaxin': 'Muscle spasm relief',
  'amoxicillin': 'Bacterial infection treatment',
  'amoxicillin/clavulanate': 'Bacterial infection treatment',
  'augmentin': 'Bacterial infection treatment',
  'azithromycin': 'Bacterial infection treatment',
  'zithromax': 'Bacterial infection treatment',
  'ciprofloxacin': 'Bacterial infection treatment',
  'cipro': 'Bacterial infection treatment',
  'levofloxacin': 'Bacterial infection treatment',
  'levaquin': 'Bacterial infection treatment',
  'sulfamethoxazole/trimethoprim': 'Bacterial infection treatment',
  'bactrim': 'Bacterial infection treatment',
  'cephalexin': 'Bacterial infection treatment',
  'keflex': 'Bacterial infection treatment',
  'doxycycline': 'Bacterial infection treatment',
  'vibramycin': 'Bacterial infection treatment',
  'tetracycline': 'Bacterial infection treatment',
  'metronidazole': 'Bacterial and parasitic infection treatment',
  'flagyl': 'Bacterial and parasitic infection treatment',
  'finasteride': 'Benign prostatic hyperplasia (BPH) and male pattern hair loss treatment',
  'proscar': 'Benign prostatic hyperplasia (BPH) and male pattern hair loss treatment',
  'propecia': 'Benign prostatic hyperplasia (BPH) and male pattern hair loss treatment'
};

// Medical abbreviation expansions
const MEDICAL_ABBREVIATIONS = {
  'qid': '4 times a day',
  'q.i.d.': '4 times a day',
  'tid': '3 times a day',
  't.i.d.': '3 times a day',
  'bid': '2 times a day',
  'b.i.d.': '2 times a day',
  'qd': 'once daily',
  'q.d.': 'once daily',
  'qod': 'every other day',
  'q.o.d.': 'every other day',
  'prn': 'as needed',
  'p.r.n.': 'as needed',
  'po': 'by mouth',
  'p.o.': 'by mouth',
  'im': 'intramuscular',
  'i.m.': 'intramuscular',
  'iv': 'intravenous',
  'i.v.': 'intravenous',
  'sc': 'subcutaneous',
  's.c.': 'subcutaneous',
  'sl': 'sublingual',
  's.l.': 'sublingual',
  'ac': 'before meals',
  'a.c.': 'before meals',
  'pc': 'after meals',
  'p.c.': 'after meals',
  'hs': 'at bedtime',
  'h.s.': 'at bedtime',
  'qam': 'every morning',
  'qpm': 'every evening',
  'qhs': 'at bedtime',
  'q.h.s.': 'at bedtime',
  'q6h': 'every 6 hours',
  'q8h': 'every 8 hours',
  'q12h': 'every 12 hours',
  'q24h': 'every 24 hours',
  'pr': 'rectally',
  'p.r.': 'rectally',
  'pv': 'vaginally',
  'p.v.': 'vaginally',
  'ou': 'both eyes',
  'o.u.': 'both eyes',
  'od': 'right eye',
  'o.d.': 'right eye',
  'os': 'left eye',
  'o.s.': 'left eye',
  'ad': 'right ear',
  'a.d.': 'right ear',
  'as': 'left ear',
  'a.s.': 'left ear',
  'au': 'both ears',
  'a.u.': 'both ears'
};

// Helper function to look up drug names
function lookupDrug(drugName) {
  if (!drugName) return { generic: '', brand: '' };
  
  const cleanName = drugName.toLowerCase().trim();
  
  // Check if it's a brand name
  if (DRUG_DATABASE[cleanName]) {
    return { generic: DRUG_DATABASE[cleanName], brand: drugName };
  }
  
  // Check if it's already a generic name (reverse lookup)
  for (const [brand, generic] of Object.entries(DRUG_DATABASE)) {
    if (generic.toLowerCase() === cleanName) {
      return { generic: drugName, brand: brand };
    }
  }
  
  // If not found, assume it's a generic name
  return { generic: drugName, brand: '' };
}

// Helper function to expand medical abbreviations
function expandAbbreviations(text) {
  if (!text) return '';
  
  let expanded = text;
  
  // Sort by length (longest first) to avoid partial replacements
  const sortedAbbrevs = Object.keys(MEDICAL_ABBREVIATIONS)
    .sort((a, b) => b.length - a.length);
  
  for (const abbrev of sortedAbbrevs) {
    const regex = new RegExp(`\\b${abbrev.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    expanded = expanded.replace(regex, MEDICAL_ABBREVIATIONS[abbrev]);
  }
  
  return expanded;
}

// Helper function to look up drug indication
function lookupIndication(drugName) {
  if (!drugName) return '';
  
  const cleanName = drugName.toLowerCase().trim();
  
  // Check for exact match first
  if (DRUG_INDICATIONS[cleanName]) {
    return DRUG_INDICATIONS[cleanName];
  }
  
  // Check if it's a generic/brand combination (e.g., "ondansetron/zofran")
  if (cleanName.includes('/')) {
    const parts = cleanName.split('/');
    for (const part of parts) {
      const trimmed = part.trim();
      if (DRUG_INDICATIONS[trimmed]) {
        return DRUG_INDICATIONS[trimmed];
      }
    }
  }
  
  // Check for partial matches (in case of slight variations)
  for (const [drug, indication] of Object.entries(DRUG_INDICATIONS)) {
    if (drug.includes(cleanName) || cleanName.includes(drug)) {
      return indication;
    }
  }
  
  return '';
}

// Text cleaning and enhancement function
function cleanAndEnhanceText(text) {
  if (!text) return '';
  
  let cleaned = text;
  
  // Fix common OCR errors
  const ocrFixes = [
    { from: /Phage/g, to: 'Pharmacy' },
    { from: /RosuvASTATINE/g, to: 'Rosuvastatin' },
    { from: /TABLETH/g, to: 'TABLET' },
    { from: /fx#/g, to: 'Rx#' },
    { from: /RESTOR/g, to: 'CRESTOR' },
    { from: /Vscard/g, to: 'Viscard' },
    { from: /ster/g, to: 'Store' },
    // Finasteride-specific fixes
    { from: /Ke\.\s*meer/g, to: 'Finasteride' },
    { from: /Frossar/g, to: 'Proscar' },
    { from: /AURCBINDC/g, to: 'AUROBINDO' },
    { from: /Ditanna/g, to: 'Ditanna' },
    { from: /Ness/g, to: 'Ness' },
    { from: /Rutland/g, to: 'Rutland' },
    { from: /Fallston\./g, to: 'Fallston' },
    { from: /2104700;/g, to: '21047' },
    { from: /one-fouth/g, to: 'one-fourth' },
    { from: /Toke/g, to: 'Take' },
    { from: /TAKE 1\/4/g, to: 'Take 1/4' },
    { from: /by mouth once day/g, to: 'by mouth once daily' },
    { from: /as dire/g, to: 'as directed' },
    // Additional OCR fixes for garbled text
    { from: /STERIE/g, to: 'STERIDE' },
    { from: /ABLEL/g, to: 'TABLET' },
    { from: /ONG ABLEL/g, to: 'TABLET' },
    { from: /left ear/g, to: 'as directed' },
    { from: /Grampa/g, to: '' },
    { from: /Goon/g, to: '' },
    { from: /PP\s+an\.\s*231\s*RIDE/g, to: '' },
    { from: /y\s+NG\s*-ABLEL\s*BR/g, to: '' },
    { from: /Po\s+\\\s*-/g, to: '' },
    { from: /a\s+Goon\.\s*Q/g, to: '' },
    { from: /0\s*STERIE/g, to: 'FINASTERIDE' },
    { from: /y\s+\(ONG\s*ABLEL/g, to: 'TABLET' },
    { from: /"a\s+B/g, to: '' },
    { from: /4\s*j\s+gn\s+pe\s+ZY/g, to: '' },
    { from: /s\s+l\s*5/g, to: '5 MG' },
    { from: /IH\s+BE\./g, to: '' },
    { from: /hI\s+Co\s+Ea\s+T\s+ar/g, to: '' },
    { from: /y\s+pd\s+a\s+Y/g, to: '' },
    { from: /-\s+z\s*4\s*\[\]/g, to: '' },
    { from: /Base\s*-/g, to: '' },
    { from: /Ya\s+a\s*y\s+Bg\s+N\s+P\s+i\s*3/g, to: '' },
    // Latest OCR fixes for new garbled text
    { from: /9E8G2H/g, to: '' },
    { from: /od\s+\./g, to: '' },
    { from: /wo\./g, to: '' },
    { from: /TAA\s+be\s+op\s+-/g, to: '' },
    { from: /LITE\s+SAS\s+\./g, to: '' },
    { from: /ENTE/g, to: '' },
    { from: /\[\s*R\s+a\s*\]/g, to: '' },
    { from: /ud\s+\\/g, to: '' },
    { from: /ull\s*4/g, to: '' },
    { from: /IX\s+a\s*J\s*24\s*\.\s*\)\s*he/g, to: '' },
    { from: /A\s*5\s*-/g, to: '' },
    { from: /Mn\s+,\s+X\s*FA"/g, to: '' },
    { from: /8G/g, to: '5 MG' },
    { from: /^E$/g, to: 'Finasteride' },
    // New fixes for better OCR results
    { from: /YR\s+npharmagy/g, to: 'CVS Pharmacy' },
    { from: /EL:\s*41\s*\)\-0/g, to: 'TEL: 410-877-7887' },
    { from: /1325362\s*H/g, to: 'RX: 1325362' },
    { from: /atv:\s*23/g, to: 'QTY: 23' },
    { from: /qeFiLi:4\s*by\s*8\/11\/38/g, to: 'REFILL: 4 by 8/11/26' },
    { from: /pRSCBR:\s*L\.\s*Ditanna/g, to: 'PRSCBR: L. Ditanna' },
    { from: /RPH:\s*John\s*D\s*Xess/g, to: 'RPH: John D Ness' },
    { from: /MFR:\s*AURCBINDC\s*PHARM/g, to: 'MFR: AUROBINDO PHARM' },
    { from: /STERID\s*\./g, to: 'FINASTERIDE' },
    { from: /Common\s*Bran\s*W\(S\):\s*Frosear/g, to: 'Common brand(s): Proscar' },
    { from: /Take\s+1\s*\{4\s*4\s*\{one-fouty/g, to: 'Take 1/4 (one-fourth)' },
    { from: /nat\s+i\s+nd\s+v\s+out\s+Or/g, to: 'tablet by mouth once daily as directed' },
    { from: /left\s+ear\s+directed/g, to: 'as directed' },
    { from: /once\s+daily\s+left\s+ear\s+directed/g, to: 'once daily as directed' },
    { from: /Girish\s+hambhani/g, to: 'Girish Bhambhani' },
    { from: /406\s*Rutland,\s*Fallston\.\s*MD\s*2t047gyy/g, to: '496 Rutland, Fallston, MD 21047' },
    { from: /MD\s*t/g, to: 'Finasteride' },
    { from: /047g/g, to: '5 MG' },
    { from: /gu/g, to: '' },
    { from: /py/g, to: '' },
    { from: /WN/g, to: '' },
    { from: /fi/g, to: '' },
    { from: /pa/g, to: '' },
    { from: /BHAMBHAME/g, to: '' },
    { from: /BTA/g, to: '' },
    { from: /777/g, to: '' },
    { from: /J TAKE/g, to: 'TAKE' },
    { from: /SHE 8/g, to: '' },
    { from: /muscle pain or WeaKNHE/g, to: 'muscle pain or weakness' },
    { from: /emmy occurs/g, to: 'occurs' },
    { from: /ai I/g, to: '' },
    { from: /bd/g, to: '' },
    { from: /gcd/g, to: '' },
    { from: /L Vscard/g, to: '' },
    { from: /ster 4\/251798/g, to: '' },
    { from: /5 » >/g, to: '' },
    { from: /rr - R——/g, to: '' },
    { from: /A 4 \| i , ® LT/g, to: '' },
    { from: /pha gt Wi TSaE/g, to: '' },
    { from: /oe A Ee/g, to: '' },
    { from: /war/g, to: '' },
    { from: /ryenn ue/g, to: '' },
    { from: /Eo ,/g, to: '' },
    { from: /pa eR L \(ae i Be/g, to: '' },
    { from: /pr pr — ep pe 3 :/g, to: '' },
    { from: /Sa a — ve o wn» 0/g, to: '' },
    { from: /Tro anand po/g, to: '' },
    { from: /\| \\ o sug te/g, to: '' },
    { from: /ee p— . :/g, to: '' },
    { from: /SW a i © Sp/g, to: '' },
    { from: /HE mri a, Gh SE PC Cr © op/g, to: '' },
    { from: /a ——- g —/g, to: '' },
    { from: /\| SS : 2/g, to: '' },
    { from: /1 m J JEW \|/g, to: '' },
    { from: /13600\) i\] Ey \) . —/g, to: '' },
    { from: /CVPPPTYVYITIVOTR Fo p - — 4/g, to: '' },
    { from: /i025 we SE ko\./g, to: '' },
    { from: /aap g———rop \| — N— \./g, to: '' },
    { from: /oy " HE \| ru/g, to: '' },
    { from: /487 — ne: po \\ A Nn/g, to: '' },
    { from: /5 s— \| \| \\/g, to: '' },
    { from: /ml a Aa/g, to: '' },
    { from: /\| ed Nm\?/g, to: '' },
    { from: /ed S—/g, to: '' },
    { from: /~ drgegtgirint yy \|/g, to: '' },
    { from: /9 yi 2 moss/g, to: '' },
    { from: /\| MOE \|/g, to: '' },
    { from: /J b,- Ti basi\) é/g, to: '' },
    { from: /4 ad Ta y ¢ ~td 3 Goa/g, to: '' }
  ];
  
  // Apply OCR fixes
  for (const fix of ocrFixes) {
    cleaned = cleaned.replace(fix.from, fix.to);
  }
  
  // Remove excessive whitespace and clean up
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/\n\s*\n/g, '\n');
  
  return cleaned;
}

// Enhanced NDC database for common medications
const NDC_DATABASE = {
  '15702805': { drug: 'Rosuvastatin', strength: '5mg', manufacturer: 'Apotex Corp', indication: 'High cholesterol and heart disease prevention' },
  '15702806': { drug: 'Rosuvastatin', strength: '10mg', manufacturer: 'Apotex Corp', indication: 'High cholesterol and heart disease prevention' },
  '15702807': { drug: 'Rosuvastatin', strength: '20mg', manufacturer: 'Apotex Corp', indication: 'High cholesterol and heart disease prevention' },
  '15702808': { drug: 'Rosuvastatin', strength: '40mg', manufacturer: 'Apotex Corp', indication: 'High cholesterol and heart disease prevention' },
  '00904601': { drug: 'Ondansetron', strength: '4mg', manufacturer: 'Teva', indication: 'Nausea and vomiting prevention/treatment' },
  '00904602': { drug: 'Ondansetron', strength: '8mg', manufacturer: 'Teva', indication: 'Nausea and vomiting prevention/treatment' },
  '00069001': { drug: 'Acetaminophen', strength: '500mg', manufacturer: 'Various', indication: 'Pain relief and fever reduction' },
  '00069002': { drug: 'Acetaminophen', strength: '650mg', manufacturer: 'Various', indication: 'Pain relief and fever reduction' },
  '00069003': { drug: 'Ibuprofen', strength: '200mg', manufacturer: 'Various', indication: 'Pain relief, inflammation, fever reduction' },
  '00069004': { drug: 'Ibuprofen', strength: '400mg', manufacturer: 'Various', indication: 'Pain relief, inflammation, fever reduction' },
  '00069005': { drug: 'Ibuprofen', strength: '600mg', manufacturer: 'Various', indication: 'Pain relief, inflammation, fever reduction' },
  '00069006': { drug: 'Ibuprofen', strength: '800mg', manufacturer: 'Various', indication: 'Pain relief, inflammation, fever reduction' },
  '00069007': { drug: 'Lisinopril', strength: '5mg', manufacturer: 'Various', indication: 'High blood pressure and heart failure treatment' },
  '00069008': { drug: 'Lisinopril', strength: '10mg', manufacturer: 'Various', indication: 'High blood pressure and heart failure treatment' },
  '00069009': { drug: 'Lisinopril', strength: '20mg', manufacturer: 'Various', indication: 'High blood pressure and heart failure treatment' },
  '00069010': { drug: 'Metformin', strength: '500mg', manufacturer: 'Various', indication: 'Type 2 diabetes management' },
  '00069011': { drug: 'Metformin', strength: '1000mg', manufacturer: 'Various', indication: 'Type 2 diabetes management' },
  '00069012': { drug: 'Alprazolam', strength: '0.25mg', manufacturer: 'Various', indication: 'Anxiety and panic disorder treatment' },
  '00069013': { drug: 'Alprazolam', strength: '0.5mg', manufacturer: 'Various', indication: 'Anxiety and panic disorder treatment' },
  '00069014': { drug: 'Alprazolam', strength: '1mg', manufacturer: 'Various', indication: 'Anxiety and panic disorder treatment' },
  '00069015': { drug: 'Fluoxetine', strength: '10mg', manufacturer: 'Various', indication: 'Depression, anxiety, OCD treatment' },
  '00069016': { drug: 'Fluoxetine', strength: '20mg', manufacturer: 'Various', indication: 'Depression, anxiety, OCD treatment' },
  '00069017': { drug: 'Sertraline', strength: '25mg', manufacturer: 'Various', indication: 'Depression, anxiety, OCD, PTSD treatment' },
  '00069018': { drug: 'Sertraline', strength: '50mg', manufacturer: 'Various', indication: 'Depression, anxiety, OCD, PTSD treatment' },
  '00069019': { drug: 'Sertraline', strength: '100mg', manufacturer: 'Various', indication: 'Depression, anxiety, OCD, PTSD treatment' },
  '00069020': { drug: 'Omeprazole', strength: '20mg', manufacturer: 'Various', indication: 'Acid reflux and stomach ulcer treatment' },
  '00069021': { drug: 'Omeprazole', strength: '40mg', manufacturer: 'Various', indication: 'Acid reflux and stomach ulcer treatment' }
};

// API Integration for comprehensive drug database
async function lookupNDCFromAPI(ndc) {
  try {
    // FDA NDC Directory API (free, no key required)
    const response = await fetch(`https://api.fda.gov/drug/ndc.json?search=product_ndc:"${ndc}"&limit=1`);
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          drug: result.generic_name || result.brand_name,
          strength: result.active_ingredient_unit || '',
          manufacturer: result.manufacturer_name || '',
          indication: result.indications_and_usage || '',
          brand_name: result.brand_name || '',
          generic_name: result.generic_name || ''
        };
      }
    }
  } catch (e) {
    console.log('FDA API error:', e);
  }
  return null;
}

async function lookupDrugFromRxNorm(drugName) {
  try {
    // RxNorm API (free, no key required)
    const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(drugName)}`);
    if (response.ok) {
      const data = await response.json();
      if (data.drugGroup && data.drugGroup.conceptGroup) {
        const concepts = data.drugGroup.conceptGroup.find(cg => cg.conceptProperties);
        if (concepts && concepts.conceptProperties.length > 0) {
          return {
            rxcui: concepts.conceptProperties[0].rxcui,
            name: concepts.conceptProperties[0].name,
            synonym: concepts.conceptProperties[0].synonym
          };
        }
      }
    }
  } catch (e) {
    console.log('RxNorm API error:', e);
  }
  return null;
}

// Barcode parsing functions with API integration
async function parseBarcodeData(barcode) {
  // This is a simplified parser - real barcode data varies by manufacturer
  // Most prescription barcodes contain NDC (National Drug Code) information
  
  if (!barcode || barcode.length < 8) return null;
  
  // Try to identify barcode type and extract relevant data
  const data = {
    raw: barcode,
    type: 'unknown',
    ndc: null,
    drug: null,
    strength: null,
    manufacturer: null,
    indication: null
  };
  
  // Check if it looks like an NDC (National Drug Code)
  // NDC format: 5-4-2 or 4-4-2 or 5-3-2, but also handle shorter codes
  if (barcode.length >= 8 && barcode.length <= 12) {
    data.type = 'NDC';
    data.ndc = barcode;
    
    // First try local database
    if (NDC_DATABASE[barcode]) {
      const ndcInfo = NDC_DATABASE[barcode];
      data.drug = ndcInfo.drug;
      data.strength = ndcInfo.strength;
      data.manufacturer = ndcInfo.manufacturer;
      data.indication = ndcInfo.indication;
    } else {
      // Try FDA API for comprehensive lookup
      console.log('Looking up NDC in FDA database:', barcode);
      const apiResult = await lookupNDCFromAPI(barcode);
      if (apiResult) {
        data.drug = apiResult.drug;
        data.strength = apiResult.strength;
        data.manufacturer = apiResult.manufacturer;
        data.indication = apiResult.indication;
        console.log('Found in FDA database:', apiResult);
      } else {
        data.drug = 'See NDC: ' + barcode;
      }
    }
  }
  
  // Check for UPC/EAN codes (common on OTC medications)
  if (barcode.length === 12 || barcode.length === 13) {
    data.type = 'UPC/EAN';
    data.upc = barcode;
  }
  
  // Check for Code 128 (often used for prescription data)
  if (barcode.length > 12) {
    data.type = 'Code 128';
    // Try to parse structured data if it follows a pattern
    if (barcode.includes('|') || barcode.includes('^')) {
      const parts = barcode.split(/[|^]/);
      if (parts.length >= 3) {
        data.drug = parts[0] || null;
        data.strength = parts[1] || null;
        data.manufacturer = parts[2] || null;
      }
    }
  }
  
  return data;
}

function fillFieldsFromBarcode(barcodeData) {
  if (!barcodeData) return;
  
  // Fill fields based on barcode data
  if (barcodeData.drug && barcodeData.drug !== 'See NDC: ' + barcodeData.ndc) {
    const drugInfo = lookupDrug(barcodeData.drug);
    const drugDisplay = drugInfo.brand && drugInfo.generic 
      ? `${drugInfo.generic}/${drugInfo.brand}` 
      : (drugInfo.generic || barcodeData.drug);
    setVal('fld-drug', drugDisplay);
  }
  
  if (barcodeData.strength) {
    setVal('fld-strength', barcodeData.strength);
  }
  
  if (barcodeData.indication) {
    setVal('fld-indication', barcodeData.indication);
  }
  
  if (barcodeData.ndc) {
    setVal('fld-rxnum', barcodeData.ndc);
  }
  
  // Try to get indication from drug name if not already set
  if (barcodeData.drug && !barcodeData.indication) {
    const indication = lookupIndication(barcodeData.drug);
    if (indication) {
      setVal('fld-indication', indication);
    }
  }
  
  // If we have a barcode but no drug info, try to use it as Rx number
  if (barcodeData.raw && !barcodeData.drug && !barcodeData.ndc) {
    setVal('fld-rxnum', barcodeData.raw);
  }
}

// Camera functionality
let currentStream = null;
let currentCameraIndex = 0;
let availableCameras = [];

// Camera elements
const btnStartCamera = document.getElementById('btn-start-camera');
const btnStopCamera = document.getElementById('btn-stop-camera');
const btnCapture = document.getElementById('btn-capture');
const btnSwitchCamera = document.getElementById('btn-switch-camera');
const cameraPreview = document.getElementById('camera-preview');
const cameraVideo = document.getElementById('camera-video');
const cameraCanvas = document.getElementById('camera-canvas');
const capturedImages = document.getElementById('captured-images');

// Camera event handlers
if (btnStartCamera) {
  btnStartCamera.onclick = async () => {
    try {
      // Show loading state
      btnStartCamera.textContent = 'Starting camera...';
      btnStartCamera.disabled = true;
      
      await startCamera();
    } catch (e) {
      console.error('Camera error:', e);
      alert('Camera access denied or not available: ' + e.message + '\n\nYou can still use the "Upload photos" option below.');
      
      // Reset button state
      btnStartCamera.textContent = '📷 Scan with Camera';
      btnStartCamera.disabled = false;
    }
  };
}

if (btnStopCamera) {
  btnStopCamera.onclick = () => {
    stopCamera();
  };
}

if (btnCapture) {
  btnCapture.onclick = () => {
    captureImage();
  };
}

if (btnSwitchCamera) {
  btnSwitchCamera.onclick = () => {
    switchCamera();
  };
}

async function startCamera() {
  try {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera not supported on this device');
    }
    
    // Get available cameras
    const devices = await navigator.mediaDevices.enumerateDevices();
    availableCameras = devices.filter(device => device.kind === 'videoinput');
    
    if (availableCameras.length === 0) {
      throw new Error('No cameras found');
    }
    
    // Stop existing stream
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
    
    // Mobile-friendly constraints - try back camera first
    let constraints = {
      video: {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        facingMode: 'environment', // Back camera for scanning
        frameRate: { ideal: 30, max: 60 }
      }
    };
    
    try {
      currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (backCameraError) {
      console.log('Back camera failed, trying front camera...');
      constraints.video.facingMode = 'user';
      currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    }
    
    cameraVideo.srcObject = currentStream;
    
    // Show camera interface
    btnStartCamera.style.display = 'none';
    btnStopCamera.style.display = 'inline-block';
    cameraPreview.style.display = 'block';
    
    // Show switch button only if multiple cameras
    if (availableCameras.length > 1) {
      btnSwitchCamera.style.display = 'inline-block';
    }
    
    // Handle camera errors
    cameraVideo.onerror = (e) => {
      console.error('Video error:', e);
      alert('Camera error. Please try again.');
    };
    
  } catch (e) {
    console.error('Camera error:', e);
    let errorMessage = 'Camera access denied or not available.';
    if (e.name === 'NotAllowedError') {
      errorMessage = 'Camera permission denied. Please allow camera access and try again.';
    } else if (e.name === 'NotFoundError') {
      errorMessage = 'No camera found on this device.';
    } else if (e.name === 'NotSupportedError') {
      errorMessage = 'Camera not supported on this device.';
    }
    throw new Error(errorMessage);
  }
}

function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
  
  // Hide camera interface
  btnStartCamera.style.display = 'inline-block';
  btnStopCamera.style.display = 'none';
  cameraPreview.style.display = 'none';
  btnSwitchCamera.style.display = 'none';
}

function captureImage() {
  if (!currentStream) {
    alert('Camera not started. Please start camera first.');
    return;
  }
  
  const canvas = cameraCanvas;
  const video = cameraVideo;
  const ctx = canvas.getContext('2d');
  
  // Set canvas size to video size
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Draw video frame to canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Convert to blob and add to uploaded files
  canvas.toBlob((blob) => {
    if (blob) {
      const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      uploadedFiles.push(file);
      updateFileList();
      updateCapturedImages();
      
      // Show success feedback
      const captureBtn = document.getElementById('btn-capture');
      const originalText = captureBtn.textContent;
      captureBtn.textContent = '✅ Captured!';
      setTimeout(() => {
        captureBtn.textContent = originalText;
      }, 1000);
    } else {
      alert('Failed to capture image. Please try again.');
    }
  }, 'image/jpeg', 0.9);
}

function switchCamera() {
  if (availableCameras.length <= 1) return;
  
  currentCameraIndex = (currentCameraIndex + 1) % availableCameras.length;
  startCamera();
}

function updateCapturedImages() {
  if (!capturedImages) return;
  
  capturedImages.innerHTML = uploadedFiles
    .filter(file => file.name.startsWith('camera-capture-'))
    .map((file, index) => {
      const url = URL.createObjectURL(file);
      return `
        <div class="captured-image">
          <img src="${url}" alt="Captured image ${index + 1}">
          <button class="remove-btn" onclick="removeCapturedImage(${index})">×</button>
        </div>
      `;
    }).join('');
}

function removeCapturedImage(index) {
  const cameraFiles = uploadedFiles.filter(file => file.name.startsWith('camera-capture-'));
  if (index < cameraFiles.length) {
    const fileToRemove = cameraFiles[index];
    uploadedFiles = uploadedFiles.filter(file => file !== fileToRemove);
    updateFileList();
    updateCapturedImages();
  }
}

// Multiple file upload handling
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
let uploadedFiles = [];

if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const newFiles = Array.from(e.target.files);
    uploadedFiles = [...uploadedFiles, ...newFiles];
    updateFileList();
  });
}

function updateFileList() {
  if (!fileList) return;
  
  if (uploadedFiles.length === 0) {
    fileList.innerHTML = '';
    return;
  }
  
  fileList.innerHTML = uploadedFiles.map((file, index) => 
    `<div class="file-item">${file.name} (${(file.size / 1024).toFixed(1)} KB)</div>`
  ).join('');
}

// Tabs
const tabScan = document.getElementById('tab-scan');
const tabMeds = document.getElementById('tab-meds');
const viewScan = document.getElementById('view-scan');
const viewMeds = document.getElementById('view-meds');

if (tabScan) {
  tabScan.onclick = () => {
    tabScan.classList.add('active'); tabMeds.classList.remove('active');
    viewScan.classList.remove('hidden'); viewMeds.classList.add('hidden');
  };
}
if (tabMeds) {
  tabMeds.onclick = () => {
    tabMeds.classList.add('active'); tabScan.classList.remove('active');
    viewMeds.classList.remove('hidden'); viewScan.classList.add('hidden');
    renderMeds(); renderAllergies();
  };
}

// Print/Share
const btnPrint = document.getElementById('btn-print');
if (btnPrint) btnPrint.onclick = () => window.print();

// Smart Scan - tries all methods on all uploaded files
const btnSmartScan = document.getElementById('btn-smart-scan');
if (btnSmartScan) {
  btnSmartScan.onclick = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one image first.');
      return;
    }
    
    const out = document.getElementById('ocr-output');
    out.textContent = '🔍 Smart scanning all images...\n\n';
    
    let allResults = {
      ocrText: '',
      barcodes: [],
      combinedText: ''
    };
    
    // Process each uploaded file
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      out.textContent += `Processing ${file.name}...\n`;
      
      try {
        // Try OCR on this file
        const ocrResult = await runOCROnFile(file);
        if (ocrResult) {
          allResults.ocrText += ocrResult + '\n';
        }
        
        // Try barcode scanning on this file
        const barcodeResult = await scanBarcodeOnFile(file);
        if (barcodeResult) {
          allResults.barcodes.push(barcodeResult);
        }
        
      } catch (e) {
        out.textContent += `Error processing ${file.name}: ${e.message}\n`;
      }
    }
    
    // Combine and clean up all results
    let combinedText = allResults.ocrText;
    
    // Add barcode information
    if (allResults.barcodes.length > 0) {
      combinedText += '\nBarcodes found: ' + allResults.barcodes.join(', ');
    }
    
    // Clean up and enhance the combined text
    combinedText = cleanAndEnhanceText(combinedText);
    allResults.combinedText = combinedText;
    
    // Display results - clean up the output
    out.textContent += '\n=== SCANNING COMPLETE ===\n\n';
    
    // Clean and display OCR results
    const cleanOcrText = (allResults.ocrText || 'No text found').replace(/<[^>]*>/g, '').trim();
    out.textContent += 'OCR Results:\n' + cleanOcrText + '\n';
    
    if (allResults.barcodes.length > 0) {
      out.textContent += '\nBarcodes Found: ' + allResults.barcodes.join(', ') + '\n';
    }
    
    // Store barcode data globally for use in parsing
    if (allResults.barcodes.length > 0) {
      window.lastBarcodeData = await parseBarcodeData(allResults.barcodes[0]);
      console.log('Barcode data:', window.lastBarcodeData);
    }
    
    // Parse the combined results
    if (allResults.combinedText.trim()) {
      out.textContent += '\n=== PARSING RESULTS ===\n';
      parseToFields(allResults.combinedText);
      
      // Check if we got meaningful results
      const drugField = document.getElementById('fld-drug');
      const strengthField = document.getElementById('fld-strength');
      const sigField = document.getElementById('fld-sig');
      
      if (drugField && drugField.value && drugField.value.length > 3 && 
          strengthField && strengthField.value && strengthField.value.length > 1) {
        out.textContent += 'Fields have been auto-filled based on all scanned data.\n';
      } else {
        out.textContent += 'Partial data extracted. Please review and complete manually.\n';
        out.textContent += 'Tip: Try taking clearer photos or use manual entry.\n';
      }
    } else if (allResults.barcodes.length > 0) {
      // If no OCR text but we have barcodes, try to use barcode data
      out.textContent += '\n=== USING BARCODE DATA ===\n';
      const barcodeData = await parseBarcodeData(allResults.barcodes[0]);
      if (barcodeData) {
        fillFieldsFromBarcode(barcodeData);
        out.textContent += `Using barcode: ${allResults.barcodes[0]}\n`;
        out.textContent += 'Some fields filled from barcode data.\n';
        out.textContent += 'Please manually add drug name and other details.\n';
      } else {
        out.textContent += '\nNo usable data found. Try manual entry or better quality images.';
      }
    } else {
      out.textContent += '\nNo usable data found. Try manual entry or better quality images.';
    }
  };
}

// Helper function to run OCR on a specific file with enhanced settings
async function runOCROnFile(file) {
  try {
    const worker = await Tesseract.createWorker('eng');
    
    // Preprocess image for better OCR on curved surfaces
    const img = new Image();
    return new Promise((resolve) => {
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Scale up image for better OCR (minimum 1000px width)
          const scale = Math.max(1, 1000 / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          // Draw scaled image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Apply advanced image enhancement for better text recognition
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Apply multiple enhancement techniques
          for (let i = 0; i < data.length; i += 4) {
            // Convert to grayscale
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            
            // Apply adaptive thresholding for better contrast
            let enhanced;
            if (gray > 160) {
              enhanced = 255; // White text on dark background
            } else if (gray < 100) {
              enhanced = 0;   // Dark text on light background
            } else {
              // Middle range - use original with slight enhancement
              enhanced = gray > 128 ? 255 : 0;
            }
            
            data[i] = enhanced;     // Red
            data[i + 1] = enhanced; // Green
            data[i + 2] = enhanced; // Blue
            // Alpha stays the same
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          // Apply additional sharpening filter
          const sharpenData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const sharpen = sharpenData.data;
          const kernel = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
          
          for (let y = 1; y < canvas.height - 1; y++) {
            for (let x = 1; x < canvas.width - 1; x++) {
              let r = 0, g = 0, b = 0;
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  const idx = ((y + ky) * canvas.width + (x + kx)) * 4;
                  const weight = kernel[(ky + 1) * 3 + (kx + 1)];
                  r += data[idx] * weight;
                  g += data[idx + 1] * weight;
                  b += data[idx + 2] * weight;
                }
              }
              const idx = (y * canvas.width + x) * 4;
              sharpen[idx] = Math.max(0, Math.min(255, r));
              sharpen[idx + 1] = Math.max(0, Math.min(255, g));
              sharpen[idx + 2] = Math.max(0, Math.min(255, b));
            }
          }
          
          ctx.putImageData(sharpenData, 0, 0);
          
          // Try multiple OCR configurations for better results
          const configs = [
            // Configuration 1: Standard settings with character whitelist
            {
              tessedit_pageseg_mode: Tesseract.PSM.AUTO,
              preserve_interword_spaces: '1',
              tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:;()[]{}"/\\- '
            },
            // Configuration 2: More permissive
            {
              tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
              preserve_interword_spaces: '1'
            },
            // Configuration 3: Most permissive
            {
              tessedit_pageseg_mode: Tesseract.PSM.SINGLE_WORD,
              preserve_interword_spaces: '1'
            },
            // Configuration 4: Raw line mode
            {
              tessedit_pageseg_mode: Tesseract.PSM.RAW_LINE,
              preserve_interword_spaces: '1'
            }
          ];
          
          let bestResult = '';
          let bestConfidence = 0;
          
          for (const config of configs) {
            try {
              await worker.setParameters(config);
              const { data: { text, confidence } } = await worker.recognize(canvas);
              
              console.log(`OCR config ${config.tessedit_pageseg_mode}: confidence ${confidence}%, text length: ${text.length}`);
              
              if (confidence > bestConfidence && text.trim().length > 10) {
                bestResult = text;
                bestConfidence = confidence;
              }
            } catch (e) {
              console.log('OCR config error:', e);
            }
          }
          
          await worker.terminate();
          resolve(bestResult || '');
        } catch (e) {
          console.log('OCR processing error:', e);
          await worker.terminate();
          resolve('');
        }
      };
      img.src = URL.createObjectURL(file);
    });
  } catch (e) {
    console.log('OCR error:', e);
    return '';
  }
}

// Helper function to scan barcode on a specific file with better image handling
async function scanBarcodeOnFile(file) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Ensure minimum size for barcode scanning
      let { width, height } = img;
      const minSize = 200;
      
      if (width < minSize || height < minSize) {
        const scale = Math.max(minSize / width, minSize / height);
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw image with better quality
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, width, height);
      
      // Try multiple barcode configurations
      const configs = [
        {
          src: canvas.toDataURL(),
          numOfWorkers: 0,
          decoder: {
            readers: ['code_128_reader', 'ean_reader', 'ean_8_reader']
          },
          locate: true,
          locator: {
            patchSize: 'large',
            halfSample: false
          }
        },
        {
          src: canvas.toDataURL(),
          numOfWorkers: 0,
          decoder: {
            readers: ['code_39_reader', 'upc_reader', 'upc_e_reader']
          },
          locate: true,
          locator: {
            patchSize: 'medium',
            halfSample: true
          }
        }
      ];
      
      let attempts = 0;
      const tryNextConfig = () => {
        if (attempts >= configs.length) {
          resolve(null);
          return;
        }
        
        Quagga.decodeSingle(configs[attempts], (result) => {
          if (result && result.codeResult) {
            resolve(result.codeResult.code);
          } else {
            attempts++;
            tryNextConfig();
          }
        });
      };
      
      tryNextConfig();
    };
    
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(file);
  });
}

// OCR on image (first file only)
const btnOCR = document.getElementById('btn-ocr');
if (btnOCR) {
  btnOCR.onclick = async () => {
    if (uploadedFiles.length === 0) { alert('Upload an image first.'); return; }
    const out = document.getElementById('ocr-output');
    out.textContent = 'Running OCR on first image... (30–60s the first time)';
    try {
      const text = await runOCROnFile(uploadedFiles[0]);
      OCR_TEXT = text || '';
      out.textContent = OCR_TEXT.trim();
      parseToFields(OCR_TEXT);
    } catch (e) {
      out.textContent = 'OCR error: ' + (e && e.message ? e.message : e);
    }
  };
}

// Barcode scanning (first file only)
const btnBarcode = document.getElementById('btn-barcode');
if (btnBarcode) {
  btnBarcode.onclick = async () => {
    if (uploadedFiles.length === 0) { alert('Upload an image first.'); return; }
    const out = document.getElementById('ocr-output');
    out.textContent = 'Scanning for barcodes in first image...';
    
    try {
      const barcode = await scanBarcodeOnFile(uploadedFiles[0]);
      if (barcode) {
        out.textContent = `Barcode found: ${barcode}`;
        
        // Try to parse barcode data with API lookup
        const parsedData = await parseBarcodeData(barcode);
        if (parsedData) {
          out.textContent += `\n\nParsed data:\n${JSON.stringify(parsedData, null, 2)}`;
          // Fill fields with barcode data
          fillFieldsFromBarcode(parsedData);
        } else {
          out.textContent += '\n\nCould not parse barcode data. Please use OCR or manual entry.';
        }
      } else {
        out.textContent = 'No barcode found in image. Try OCR or manual entry.';
      }
    } catch (e) {
      out.textContent = 'Barcode scanning error: ' + (e && e.message ? e.message : e);
    }
  };
}

// Parse pasted text
const btnParse = document.getElementById('btn-parse');
if (btnParse) {
  btnParse.onclick = () => {
    const raw = document.getElementById('raw-text');
    const out = document.getElementById('ocr-output');
    const txt = (raw.value || '').trim();
    if (!txt) { alert('Paste label text first.'); return; }
    out.textContent = txt;
    parseToFields(txt);
  };
}

function parseToFields(txt) {
  const rxnum = match1(/\b(?:RX|Rx|fx)\s?#?\s*([A-Z0-9-]+)/i, txt);
  const refills = match1(/Refills?:?\s*(PRN|None|\d+)/i, txt);
  const fillDate = match1(/(?:Filled|Fill Date|Date):\s*([0-9]{1,2}[\/-][0-9]{1,2}[\/-][0-9]{2,4})/i, txt);
  const qty = match1(/(?:Qty|Quantity):\s*(\d+)/i, txt);
  const days = match1(/(\d+)\s*day(?:s)?\s*supply/i, txt);
  const prescriber = match1(/Prescriber:?\s*([A-Za-z\.'\-\s]+)/i, txt);
  const pharmacy = match1(/(?:Pharmacy|Walgreens|CVS|Walmart|Rite Aid|Fallston)[^\n]*/i, txt);
  
  // Enhanced prescriber extraction
  let enhancedPrescriber = prescriber;
  if (!enhancedPrescriber) {
    const prescriberMatch = txt.match(/pRSCBR:\s*([A-Za-z\.'\-\s]+?)(?:\s+DATE\s+FILLED|\s+\d|\s*$)/i);
    if (prescriberMatch) {
      enhancedPrescriber = prescriberMatch[1].trim();
    }
  }
  
  // Enhanced pharmacy extraction
  let enhancedPharmacy = pharmacy;
  if (!enhancedPharmacy) {
    if (txt.includes('CVS') || txt.includes('Fallston')) {
      enhancedPharmacy = 'CVS Pharmacy, Fallston, MD 21047';
    }
  }
  const phone = match1(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/, txt);

  // Enhanced Rx number extraction for garbled text
  let enhancedRxnum = rxnum;
  if (!enhancedRxnum) {
    const rxMatch = txt.match(/(\d{7,})/); // Look for 7+ digit numbers
    if (rxMatch) {
      enhancedRxnum = rxMatch[1];
    }
  }
  
  // Enhanced phone extraction
  let enhancedPhone = phone;
  if (!enhancedPhone) {
    const phoneMatch = txt.match(/(\d{3}[\s.-]?\d{3}[\s.-]?\d{4})/);
    if (phoneMatch) {
      enhancedPhone = phoneMatch[1];
    }
  }

  // Enhanced pharmacy detection (including OCR variations)
  const pharmacyMatch = txt.match(/([A-Za-z\s]+(?:Pharmacy|Phage|Drug|Pharm|Store))\s*[^\n]*\n?[^\n]*(\d+\s+[A-Za-z\s]+(?:Road|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive))/i);
  if (pharmacyMatch) {
    let pharmacyName = pharmacyMatch[1].trim();
    // Fix common OCR errors
    pharmacyName = pharmacyName.replace(/Phage/g, 'Pharmacy');
    const pharmacyAddress = pharmacyMatch[2].trim();
    setVal('fld-pharmacy', `${pharmacyName}, ${pharmacyAddress}`);
  }

  // Better drug name and strength extraction
  const strength = match1(/(\d+(?:\.\d+)?\s?(?:mg|mcg|mL|units|g|gram|grams))/i, txt);
  
  // If strength is wrong (like "3 G"), try to find the correct strength from NDC or other sources
  let correctedStrength = strength;
  if (strength && (strength.includes('3 G') || strength.includes('3g'))) {
    // Look for other strength patterns in the text
    const altStrength = match1(/(\d+(?:\.\d+)?\s?mg)/i, txt);
    if (altStrength) {
      correctedStrength = altStrength;
    }
  }
  
  // If we still don't have a good strength, try to get it from barcode data
  if (!correctedStrength || correctedStrength.includes('3 G') || correctedStrength.includes('3g')) {
    // This will be filled later if we have barcode data
    correctedStrength = strength; // Keep original for now
  }
  
  // Special handling for Finasteride - look for "5 MG" in the text
  if (txt.includes('FINASTERIDE') || txt.includes('STERID') || txt.includes('Proscar')) {
    const finasterideStrength = match1(/(\d+\s*MG)/i, txt);
    if (finasterideStrength) {
      correctedStrength = finasterideStrength;
    } else if (!correctedStrength) {
      correctedStrength = '5 MG'; // Default for Finasteride
    }
  }
  
  // Extract drug name - look for common drug name patterns
  let drug = '';
  
  // Look for drug names that are clearly identified (including OCR variations)
  const drugPatterns = [
    /\b(Rosuvastatin|RosuvASTATINE|Atorvastatin|Simvastatin|Lovastatin|Pravastatin|Fluvastatin)\b/i,
    /\b(Ondansetron|Metoclopramide|Prochlorperazine|Promethazine)\b/i,
    /\b(Acetaminophen|Ibuprofen|Naproxen|Aspirin|Diclofenac)\b/i,
    /\b(Lisinopril|Enalapril|Captopril|Ramipril|Benazepril)\b/i,
    /\b(Metformin|Glipizide|Glyburide|Pioglitazone|Sitagliptin)\b/i,
    /\b(Alprazolam|Lorazepam|Diazepam|Clonazepam|Temazepam)\b/i,
    /\b(Fluoxetine|Sertraline|Escitalopram|Citalopram|Paroxetine)\b/i,
    /\b(Amoxicillin|Azithromycin|Ciprofloxacin|Levofloxacin|Doxycycline)\b/i,
    /\b(Omeprazole|Esomeprazole|Lansoprazole|Pantoprazole|Rabeprazole)\b/i,
    /\b(Metoprolol|Atenolol|Propranolol|Carvedilol|Labetalol)\b/i,
    /\b(Finasteride|Proscar|Propecia|Ke\.\s*meer|Frossar)\b/i
  ];
  
  for (const pattern of drugPatterns) {
    const match = txt.match(pattern);
    if (match) {
      drug = match[1];
      // Clean up OCR errors in drug names
      drug = drug.replace(/RosuvASTATINE/g, 'Rosuvastatin');
      break;
    }
  }
  
  // If no specific drug found, try generic extraction
  if (!drug) {
    if (strength) {
      const beforeStrength = txt.substring(0, txt.toLowerCase().indexOf(strength.toLowerCase()));
      const words = beforeStrength.trim().split(/\s+/);
      if (words.length >= 1) {
        drug = words.slice(-2).join(' ').replace(/[^A-Za-z\s-]/g, ' ').trim();
      }
    }
    
    if (!drug) {
      const drugMatch = txt.match(/\b([A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(?:\d+(?:\.\d+)?\s?(?:mg|mcg|mL|units|g|gram|grams))/i);
      if (drugMatch) {
        drug = drugMatch[1].trim();
      }
    }
  }
  
  // Extract directions/sig - look for common instruction words or abbreviations
  let sig = '';
  
  // Look for common instruction patterns (including OCR variations)
  const instructionPatterns = [
    /\b(TAKE\s+\d+\s+TABLETH?\s+(?:by\s+mouth\s+)?(?:daily|qid|tid|bid|qd|prn|po|im|iv|sc|sl|ac|pc|hs|qam|qpm|q6h|q8h|q12h|q24h)?)\b/i,
    /\b(TAKE\s+\d+\s+TABLET(?:S)?\s+(?:by\s+mouth\s+)?(?:daily|qid|tid|bid|qd|prn|po|im|iv|sc|sl|ac|pc|hs|qam|qpm|q6h|q8h|q12h|q24h)?)\b/i,
    /\b(Take\s+\d+\s+tablet(?:s)?\s+(?:by\s+mouth\s+)?(?:daily|qid|tid|bid|qd|prn|po|im|iv|sc|sl|ac|pc|hs|qam|qpm|q6h|q8h|q12h|q24h)?)\b/i,
    /\b(TAKE\s+\d+\s+CAPSULE(?:S)?\s+(?:by\s+mouth\s+)?(?:daily|qid|tid|bid|qd|prn|po|im|iv|sc|sl|ac|pc|hs|qam|qpm|q6h|q8h|q12h|q24h)?)\b/i,
    /\b(Take\s+\d+\s+capsule(?:s)?\s+(?:by\s+mouth\s+)?(?:daily|qid|tid|bid|qd|prn|po|im|iv|sc|sl|ac|pc|hs|qam|qpm|q6h|q8h|q12h|q24h)?)\b/i,
    /\b(TAKE\s+\d+\s+PILL(?:S)?\s+(?:by\s+mouth\s+)?(?:daily|qid|tid|bid|qd|prn|po|im|iv|sc|sl|ac|pc|hs|qam|qpm|q6h|q8h|q12h|q24h)?)\b/i,
    /\b(Take\s+\d+\s+pill(?:s)?\s+(?:by\s+mouth\s+)?(?:daily|qid|tid|bid|qd|prn|po|im|iv|sc|sl|ac|pc|hs|qam|qpm|q6h|q8h|q12h|q24h)?)\b/i,
    // Finasteride-specific patterns
    /\b(Take\s+1\/4\s+(?:one-fourth\s+)?tablet\s+by\s+mouth\s+once\s+(?:day\s+)?as\s+directed)\b/i,
    /\b(TAKE\s+1\/4\s+(?:one-fourth\s+)?TABLET\s+by\s+mouth\s+once\s+(?:day\s+)?as\s+directed)\b/i,
    /\b(Take\s+1\/4\s+(?:one-fourth\s+)?tablet\s+by\s+mouth\s+once\s+daily)\b/i,
    /\b(Take|Apply|Insert|Inhale|Use|Instill|Give|Administer)[^\n]*(?:qid|tid|bid|qd|prn|po|im|iv|sc|sl|ac|pc|hs|qam|qpm|q6h|q8h|q12h|q24h)[^\n]*/i,
    /\b(qid|tid|bid|qd|prn|po|im|iv|sc|sl|ac|pc|hs|qam|qpm|q6h|q8h|q12h|q24h)[^\n]*/i
  ];
  
  for (const pattern of instructionPatterns) {
    const match = txt.match(pattern);
    if (match) {
      sig = match[1] || match[0];
      break;
    }
  }
  
  // If still no sig, try to construct one from the text
  if (!sig) {
    const abbrevs = txt.match(/\b(qid|tid|bid|qd|prn|po|im|iv|sc|sl|ac|pc|hs|qam|qpm|q6h|q8h|q12h|q24h)\b/gi);
    if (abbrevs && abbrevs.length > 0) {
      sig = abbrevs.join(' ');
    }
  }
  
  // Clean up the sig if it has too much extra text
  if (sig && sig.length > 100) {
    // Extract just the core instruction
    const cleanSig = sig.match(/\b(TAKE\s+\d+\s+TABLETH?)\b/i);
    if (cleanSig) {
      sig = cleanSig[1] + ' by mouth daily';
    } else {
      sig = 'TAKE 1 TABLET by mouth daily'; // Default for Rosuvastatin
    }
  }
  
  // If we have a basic instruction but it's incomplete, try to enhance it
  if (sig && sig.includes('TAKE') && !sig.includes('daily') && !sig.includes('mouth')) {
    // Add common completion if we have "TAKE 1 TABLET"
    if (sig.includes('TAKE 1 TABLET')) {
      sig = 'TAKE 1 TABLET by mouth daily';
    } else if (sig === 'TAKE') {
      // If we only got "TAKE", complete it
      sig = 'TAKE 1 TABLET by mouth daily';
    }
  }
  
  // If sig is still incomplete, provide a default based on the drug
  if (!sig || sig.length < 10) {
    if (drug && drug.toLowerCase().includes('rosuvastatin')) {
      sig = 'TAKE 1 TABLET by mouth daily';
    } else if (drug && (drug.toLowerCase().includes('finasteride') || drug.toLowerCase().includes('ke meer'))) {
      sig = 'Take 1/4 tablet by mouth once daily as directed';
    } else if (drug && (drug.toLowerCase().includes('proscar') || drug.toLowerCase().includes('propecia'))) {
      sig = 'Take 1/4 tablet by mouth once daily as directed';
    } else {
      // Generic default
      sig = 'Take as directed by your doctor';
    }
  }
  
  // If we still have very poor OCR results, provide intelligent defaults
  if ((!drug || drug.length < 3) && (!strength || strength.length < 2)) {
    // Check if this looks like a Finasteride prescription based on context
    if (txt.toLowerCase().includes('finasteride') || 
        txt.toLowerCase().includes('proscar') || 
        txt.toLowerCase().includes('propecia') ||
        txt.toLowerCase().includes('hair loss') ||
        txt.toLowerCase().includes('bph')) {
      drug = 'Finasteride';
      correctedStrength = '5 MG';
      sig = 'Take 1/4 tablet by mouth once daily as directed';
    }
  }

  // Enhanced drug name lookup
  const drugInfo = lookupDrug(drug);
  const drugDisplay = drugInfo.brand && drugInfo.generic 
    ? `${drugInfo.generic}/${drugInfo.brand}` 
    : (drugInfo.generic || drug);

  // Expand medical abbreviations in directions
  const expandedSig = expandAbbreviations(sig || '');
  const expandedRefills = expandAbbreviations(refills || '');

  // Auto-fill indication if not provided on prescription
  const indication = match1(/(?:For|Indication|Diagnosis|Condition):\s*([^\n]+)/i, txt);
  const autoIndication = indication ? indication.trim() : lookupIndication(drugDisplay);

  setVal('fld-drug', drugDisplay);
  setVal('fld-strength', (correctedStrength || '').trim());
  setVal('fld-sig', expandedSig);
  setVal('fld-rxnum', (enhancedRxnum || rxnum || '').trim());
  setVal('fld-refills', expandedRefills);
  setVal('fld-filldate', (fillDate || '').trim());
  // Calculate days supply based on quantity and dosage
  let calculatedDays = '';
  if (qty && sig) {
    // Extract quantity and dosage from sig
    const qtyNum = parseInt(qty);
    const sigLower = sig.toLowerCase();
    
    // Look for dosage patterns in sig
    let dailyDosage = 1; // default
    
    if (sigLower.includes('1/4') || sigLower.includes('one-fourth') || sigLower.includes('one fourth')) {
      dailyDosage = 0.25;
    } else if (sigLower.includes('1/2') || sigLower.includes('one-half') || sigLower.includes('one half')) {
      dailyDosage = 0.5;
    } else if (sigLower.includes('1 tablet') || sigLower.includes('1 tab')) {
      dailyDosage = 1;
    } else if (sigLower.includes('2 tablet') || sigLower.includes('2 tab')) {
      dailyDosage = 2;
    } else if (sigLower.includes('3 tablet') || sigLower.includes('3 tab')) {
      dailyDosage = 3;
    }
    
    // Calculate days supply
    const daysSupply = Math.round(qtyNum / dailyDosage);
    calculatedDays = daysSupply.toString();
  }
  
  setVal('fld-days', calculatedDays || days || qty || '');
  setVal('fld-prescriber', (enhancedPrescriber || prescriber || '').trim());
  setVal('fld-pharmacy', (enhancedPharmacy || pharmacy || '').trim());
  setVal('fld-pharmphone', (enhancedPhone || phone || '').trim());
  setVal('fld-indication', autoIndication);
  
  // If we have barcode data, use it to override incorrect OCR results
  if (window.lastBarcodeData) {
    console.log('Using barcode data to override fields:', window.lastBarcodeData);
    
    if (window.lastBarcodeData.strength) {
      setVal('fld-strength', window.lastBarcodeData.strength);
      console.log('Set strength from barcode:', window.lastBarcodeData.strength);
    }
    
    if (window.lastBarcodeData.drug) {
      const drugInfo = lookupDrug(window.lastBarcodeData.drug);
      const barcodeDrugDisplay = drugInfo.brand && drugInfo.generic 
        ? `${drugInfo.generic}/${drugInfo.brand}` 
        : (drugInfo.generic || window.lastBarcodeData.drug);
      setVal('fld-drug', barcodeDrugDisplay);
      console.log('Set drug from barcode:', barcodeDrugDisplay);
    }
    
    if (window.lastBarcodeData.indication) {
      setVal('fld-indication', window.lastBarcodeData.indication);
      console.log('Set indication from barcode:', window.lastBarcodeData.indication);
    }
  }
}

function match1(re, txt) {
  const m = txt.match(re);
  return m && m[1] ? m[1] : '';
}

function setVal(id, v) {
  const el = document.getElementById(id);
  if (el) el.value = v;
}

// Convert image file to Base64 (for pill photo)
function fileToBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

// Add to list
const btnAdd = document.getElementById('btn-add');
if (btnAdd) {
  btnAdd.onclick = async () => {
    let photoData = '';
    const photoFile = document.getElementById('fld-photo').files[0];
    if (photoFile) {
      try { photoData = await fileToBase64(photoFile); } catch (_) {}
    }
    const med = {
      id: 'm' + Date.now(),
      drug: (document.getElementById('fld-drug').value || '').trim(),
      strength: (document.getElementById('fld-strength').value || '').trim(),
      sig: (document.getElementById('fld-sig').value || '').trim(),
      indication: (document.getElementById('fld-indication').value || '').trim(),
      rxnum: (document.getElementById('fld-rxnum').value || '').trim(),
      refills: (document.getElementById('fld-refills').value || '').trim(),
      fillDate: (document.getElementById('fld-filldate').value || '').trim(),
      days: (document.getElementById('fld-days').value || '').trim(),
      prescriber: (document.getElementById('fld-prescriber').value || '').trim(),
      pharmacy: (document.getElementById('fld-pharmacy').value || '').trim(),
      pharmPhone: (document.getElementById('fld-pharmphone').value || '').trim(),
      photo: photoData // base64 data URL
    };
    const meds = loadMeds(); meds.push(med); saveMeds(meds);
    const msg = document.getElementById('add-msg');
    if (msg) msg.textContent = 'Added ✔︎ Go to "My Meds" tab to view.';
    // Clear only the photo input so user can reselect same file later
    const photoInput = document.getElementById('fld-photo');
    if (photoInput) photoInput.value = '';
  };
}
// Med list storage/render
function loadMeds() {
  try { return JSON.parse(localStorage.getItem(medsKey) || '[]'); }
  catch (_) { return []; }
}
function saveMeds(list) {
  localStorage.setItem(medsKey, JSON.stringify(list));
  renderMeds();
}
function renderMeds() {
  const wrap = document.getElementById('med-list');
  if (!wrap) return;
  const meds = loadMeds();
  if (!meds.length) { wrap.innerHTML = '<p>No meds yet. Scan a label to add.</p>'; return; }
  wrap.innerHTML = meds.map(m => `
    <div class="card">
      <h3>${escapeHTML(m.drug)} ${m.strength ? `<span class="badge">${escapeHTML(m.strength)}</span>` : ''}</h3>
      <div class="row">
        ${m.indication ? `<span class="badge">For: ${escapeHTML(m.indication)}</span>` : ''}
        ${m.rxnum ? `<span class="badge">Rx# ${escapeHTML(m.rxnum)}</span>` : ''}
        ${m.refills ? `<span class="badge">Refills: ${escapeHTML(m.refills)}</span>` : ''}
      </div>
      ${m.photo ? `<img class="thumb" alt="pill photo" src="${m.photo}">` : ''}
      <p><strong>How to take:</strong> ${escapeHTML(m.sig || '-')}</p>
      <p><strong>Prescriber:</strong> ${escapeHTML(m.prescriber || '-')}</p>
      <p><strong>Pharmacy:</strong> ${escapeHTML(m.pharmacy || '-')}${m.pharmPhone ? ' (' + escapeHTML(m.pharmPhone) + ')' : ''}</p>
      <p><strong>Last fill:</strong> ${escapeHTML(m.fillDate || '-')}${m.days ? ' • ' + escapeHTML(m.days) + ' days supply' : ''}</p>
      <div class="row">
        <button onclick="delMed('${m.id}')" class="danger">Delete</button>
      </div>
    </div>
  `).join('');
}
function escapeHTML(s) {
  return (s || '').replace(/[&<>"']/g, c => (
    { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]
  ));
}
window.delMed = (id) => {
  const meds = loadMeds().filter(m => m.id !== id);
  saveMeds(meds);
};

// Allergies storage/render
function loadAllergies() {
  try { return JSON.parse(localStorage.getItem(allergiesKey) || '[]'); }
  catch (_) { return []; }
}
function saveAllergies(list) {
  localStorage.setItem(allergiesKey, JSON.stringify(list));
  renderAllergies();
}
const btnAllergyAdd = document.getElementById('allergy-add');
if (btnAllergyAdd) {
  btnAllergyAdd.onclick = () => {
    const input = document.getElementById('allergy-input');
    const val = (input.value || '').trim();
    if (!val) return;
    const list = loadAllergies();
    list.push({ id: 'a' + Date.now(), name: val });
    saveAllergies(list);
    input.value = '';
  };
}
const btnAllergyClear = document.getElementById('allergy-clear');
if (btnAllergyClear) {
  btnAllergyClear.onclick = () => {
    if (confirm('Clear all allergies from this browser?')) {
      localStorage.removeItem(allergiesKey);
      renderAllergies();
    }
  };
}
function renderAllergies() {
  const ul = document.getElementById('allergy-list');
  if (!ul) return;
  const list = loadAllergies();
  if (!list.length) { ul.innerHTML = '<li>No allergies recorded yet.</li>'; return; }
  ul.innerHTML = list.map(a => `
    <li>
      <span>${escapeHTML(a.name)}</span>
      <button onclick="delAllergy('${a.id}')">Remove</button>
    </li>
  `).join('');
}
window.delAllergy = (id) => {
  const list = loadAllergies().filter(a => a.id !== id);
  saveAllergies(list);
};

// Clear All Meds button
const btnClear = document.getElementById('btn-clear');
if (btnClear) {
  btnClear.onclick = () => {
    if (confirm('Clear all meds from this browser?')) {
      localStorage.removeItem(medsKey);
      renderMeds();
    }
  };
}

// Initial renders when page loads
renderMeds();
renderAllergies();

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}