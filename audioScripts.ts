import { Language } from '../types';

export type LocalizedAudioText = Record<Language, string>;

export const audioScripts = {
  splash: {
    en: 'Welcome to Kabadiwala Connect. Connecting informal scrap collectors directly with authorized recyclers for fair mandi prices and traceable digital receipts. Tap Continue to begin.',
    ta: 'கபடிவாலா கனெக்ட்டிற்கு உங்களை வரவேற்கிறோம். நியாயமான சந்தை விலை மற்றும் வெளிப்படையான டிஜிட்டல் ரசீதுகளுக்காக, முறைசாரா கபாடிவாலாக்களை அங்கீகரிக்கப்பட்ட மறுசுழற்சியாளர்களுடன் நேரடியாக இணைக்கிறோம். தொடங்க தொடரவும் என்பதைத் தட்டவும்.',
    hi: 'कबाड़ीवाला कनेक्ट में आपका स्वागत है। उचित मंडी भाव और पारदर्शी डिजिटल रसीद के लिए कबाड़ बीनने वालों को सीधे अधिकृत रीसाइक्लर्स से जोड़ना। शुरू करने के लिए आगे बढ़ें पर टैप करें।',
    mr: 'कबाडीवाला कनेक्ट मध्ये आपले स्वागत आहे. योग्य बाजारभाव आणि पारदर्शक डिजिटल पावतीसाठी भंगार वेचकांना थेट अधिकृत रीसायकलर्सशी जोडणे. सुरू करण्यासाठी पुढे चला वर टॅप करा.',
  },

  languageSelect: {
    en: 'Choose your preferred language: English, Tamil, Hindi, or Marathi. You can change this anytime from settings.',
    ta: 'உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்: ஆங்கிலம், தமிழ், இந்தி அல்லது மராத்தி. அமைப்புகள் பகுதியிலிருந்து எப்போது வேண்டுமானாலும் மொழியை மாற்றலாம்.',
    hi: 'अपनी पसंदीदा भाषा चुनें: अंग्रेजी, तमिल, हिंदी, या मराठी। आप इसे सेटिंग्स से कभी भी बदल सकते हैं।',
    mr: 'आपली पसंतीची भाषा निवडा: इंग्रजी, तमिळ, हिंदी किंवा मराठी. तुम्ही हे सेटिंग्जमधून कधीही बदलू शकता.',
  },

  login: {
    en: 'Collector quick profile. Enter your mobile number, four digit code, your name, and locality. We collect minimal personal information to respect your privacy.',
    ta: 'சேகரிப்பாளர் விரைவு சுயவிவரம். உங்கள் கைப்பேசி எண், நான்கு இலக்க குறியீடு, பெயர் மற்றும் பகுதியை உள்ளிடவும். உங்கள் தனியுரிமையைப் பாதுகாக்க குறைந்தபட்ச தகவலை மட்டுமே பெறுகிறோம்.',
    hi: 'कलेक्टर त्वरित प्रोफ़ाइल। अपना मोबाइल नंबर, चार अंकों का कोड, अपना नाम और इलाका दर्ज करें। आपकी गोपनीयता के लिए हम केवल न्यूनतम जानकारी लेते हैं।',
    mr: 'संकलक जलद प्रोफाइल. आपला मोबाईल नंबर, चार अंकी कोड, आपले नाव आणि परिसर प्रविष्ट करा. आपल्या गोपनीयतेसाठी आम्ही केवळ आवश्यक माहिती घेतो.',
  },

  home: (collectorName: string, activeCount: number, minRate = 280, maxRate = 340): LocalizedAudioText => ({
    en: `Hello ${collectorName}. You have ${activeCount} active scrap lots. Today's mandi rate for verified e-waste is ₹${minRate} to ₹${maxRate} per kilogram. Tap Sell Material to add scrap.`,
    ta: `வணக்கம் ${collectorName}. உங்களிடம் ${activeCount} நடப்பு கழிவுத் தொகுப்புகள் உள்ளன. சரிபார்க்கப்பட்ட மின்னணுக் கழிவுகளுக்கான இன்றைய சந்தை விலை ஒரு கிலோவிற்கு ₹${minRate} முதல் ₹${maxRate} வரை. புதிய கழிவைச் சேர்க்க 'பொருட்களை விற்க' என்பதைத் தட்டவும்.`,
    hi: `नमस्ते ${collectorName}। आपके पास ${activeCount} सक्रिय कबाड़ लॉट हैं। सत्यापित ई-कचरे का आज का मंडी भाव ₹${minRate} से ₹${maxRate} प्रति किलो है। नया कबाड़ जोड़ने के लिए सामग्री बेचें पर टैप करें।`,
    mr: `नमस्कार ${collectorName}. आपल्याकडे ${activeCount} सक्रिय भंगार लॉट्स आहेत. पडताळणी केलेल्या ई-कचऱ्याचा आजचा बाजारभाव ₹${minRate} ते ₹${maxRate} प्रति किलो आहे. नवीन भंगार जोडण्यासाठी माल विका वर टॅप करा.`,
  }),

  addMaterialStep1: {
    en: 'Step 1: Take a clear photo of the scrap lot or select an example image for instant AI identification.',
    ta: 'படி 1: உடனடி ஏஐ பகுப்பாய்விற்கு கழிவுப் பொருட்களின் தெளிவான புகைப்படத்தை எடுக்கவும் அல்லது மாதிரிப் படத்தைத் தேர்ந்தெடுக்கவும்.',
    hi: 'चरण 1: त्वरित एआई पहचान के लिए कबाड़ की स्पष्ट फोटो लें या नमूना फोटो चुनें।',
    mr: 'पायरी 1: त्वरित एआय ओळखीसाठी भंगाराचा स्पष्ट फोटो काढा किंवा नमुना फोटो निवडा.',
  },

  addMaterialStep2: {
    en: 'Step 2: Choose the scrap category: E-waste, Plastic, Metal, or Paper. E-waste carries priority value.',
    ta: 'படி 2: கழிவு வகையைத் தேர்ந்தெடுக்கவும்: மின்னணுக் கழிவு, பிளாஸ்டிக், உலோகம் அல்லது காகிதம். மின்னணுக் கழிவுகளுக்கு முன்னுரிமை விலை உண்டு.',
    hi: 'चरण 2: कबाड़ की श्रेणी चुनें: ई-कचरा, प्लास्टिक, धातु, या कागज। ई-कचरे पर सर्वोत्तम भाव मिलता है।',
    mr: 'पायरी 2: भंगाराचा प्रकार निवडा: ई-कचरा, प्लास्टिक, धातू किंवा कागद. ई-कचऱ्यावर प्राधान्य दर मिळतो.',
  },

  addMaterialStep3: {
    en: 'Step 3: Enter the approximate weight in kilograms or connect to a digital bluetooth scale.',
    ta: 'படி 3: தோராயமான எடையை கிலோவில் உள்ளிடவும் அல்லது புளூடூத் எடையிடும் கருவியை இணைக்கவும்.',
    hi: 'चरण 3: अनुमानित वजन किलोग्राम में दर्ज करें या ब्लूटूथ डिजिटल कांटे से कनेक्ट करें।',
    mr: 'पायरी 3: अंदाजे वजन किलोग्राममध्ये टाका किंवा ब्लूटूथ डिजिटल काट्याशी जोडा.',
  },

  addMaterialStep4: (detectedName: string, confidence: number, minLotEst: number, maxLotEst: number): LocalizedAudioText => ({
    en: `AI identified ${detectedName} with ${confidence}% confidence. Estimated mandi payout is ₹${minLotEst.toLocaleString()} to ₹${maxLotEst.toLocaleString()}. Tap Confirm Material to proceed.`,
    ta: `ஏஐ ${confidence}% துல்லியத்துடன் ${detectedName} என அடையாளம் கண்டுள்ளது. மதிப்பிடப்பட்ட சந்தை தொகை ₹${minLotEst.toLocaleString()} முதல் ₹${maxLotEst.toLocaleString()} வரை. தொடர பொருளை உறுதிப்படுத்து என்பதைத் தட்டவும்.`,
    hi: `एआई ने ${confidence}% विश्वसनीयता के साथ ${detectedName} की पहचान की है। अनुमानित मंडी मूल्य ₹${minLotEst.toLocaleString()} से ₹${maxLotEst.toLocaleString()} है। पुष्टि के लिए सामग्री स्वीकार करें।`,
    mr: `एआयने ${confidence}% अचूकतेसह ${detectedName} ची ओळख पटवली आहे. अंदाजे रक्कम ₹${minLotEst.toLocaleString()} ते ₹${maxLotEst.toLocaleString()} आहे. पुढे जाण्यासाठी साहित्याची खात्री करा.`,
  }),

  priceEstimate: (weight: number, minEst: number, maxEst: number): LocalizedAudioText => ({
    en: `Estimated lot payout for ${weight} kilograms is between ₹${minEst.toLocaleString()} and ₹${maxEst.toLocaleString()}. Direct to verified recycler with zero middleman deduction.`,
    ta: `${weight} கிலோ கழிவுகளுக்கு மதிப்பிடப்பட்ட தொகை ₹${minEst.toLocaleString()} முதல் ₹${maxEst.toLocaleString()} வரை. இடைத்தரகர் கமிஷன் இன்றி நேரடியாக மறுசுழற்சியாளரிடமிருந்து முழுப் பணம் கிடைக்கும்.`,
    hi: `${weight} किलो कबाड़ के लिए अनुमानित भुगतान ₹${minEst.toLocaleString()} से ₹${maxEst.toLocaleString()} है। बिचौलियों के बिना सीधे रीसाइक्लर से पूरी राशि।`,
    mr: `${weight} किलो भंगारासाठी अंदाजे रक्कम ₹${minEst.toLocaleString()} ते ₹${maxEst.toLocaleString()} आहे. दलालांशिवाय थेट रीसायकलरकडून पूर्ण मोबदला.`,
  }),

  recyclerMatch: (count: number): LocalizedAudioText => ({
    en: `Found ${count} authorized recyclers. Compare offered rates, pickup options, and choose the best buyer.`,
    ta: `உங்களுக்கு அருகில் ${count} அங்கீகரிக்கப்பட்ட மறுசுழற்சி மையங்கள் கண்டறியப்பட்டுள்ளன. விலையையும் பிக்-அப் வசதியையும் ஒப்பிட்டு சிறந்த வாங்குபவரைத் தேர்ந்தெடுக்கவும்.`,
    hi: `आपके पास ${count} अधिकृत रीसाइक्लर मिले हैं। दी गई कीमतों और पिकअप सुविधा की तुलना करें और सर्वोत्तम खरीदार चुनें।`,
    mr: `आपल्याजवळ ${count} अधिकृत खरेदीदार सापडले आहेत. दिलेले भाव आणि पिकअप सुविधेची तुलना करून सर्वोत्तम पर्याय निवडा.`,
  }),

  lotDetail: (lotId: string, weight: number, material: string, status: string): LocalizedAudioText => ({
    en: `Lot ${lotId}: ${weight} kilograms of ${material}. Status is ${status}. Dual verified digital tracking trail is active.`,
    ta: `தொகுப்பு ${lotId}: ${weight} கிலோ ${material}. தற்போதைய நிலை: ${status}. இருதரப்பு சரிபார்க்கப்பட்ட டிஜிட்டல் கண்காணிப்பு பயன்பாட்டில் உள்ளது.`,
    hi: `लॉट ${lotId}: ${weight} किलो ${material}। वर्तमान स्थिति: ${status}। दोनों पक्षों द्वारा सत्यापित डिजिटल ट्रैकिंग रिकॉर्ड सक्रिय है।`,
    mr: `लॉट ${lotId}: ${weight} किलो ${material}. सद्यस्थिती: ${status}. दोन्ही बाजूंनी पडताळलेला डिजिटल ट्रॅकिंग रेकॉर्ड सक्रिय आहे.`,
  }),

  myLots: (count: number, activeCount: number): LocalizedAudioText => ({
    en: `You have ${count} scrap lots recorded, with ${activeCount} currently active. Tap any lot to view pickup status, QR code, or digital receipt.`,
    ta: `உங்களிடம் ${count} கழிவுத் தொகுப்புகள் பதிவாகியுள்ளன, இதில் ${activeCount} தற்போது செயல்பாட்டில் உள்ளன. பிக்-அப் நிலை, கியூஆர் குறியீடு அல்லது ரசீதைப் பார்க்க ஏதேனும் ஒரு தொகுப்பைத் தட்டவும்.`,
    hi: `आपके पास कुल ${count} कबाड़ लॉट पंजीकृत हैं, जिनमें ${activeCount} सक्रिय हैं। पिकअप स्थिति, क्यूआर कोड या डिजिटल रसीद देखने के लिए किसी भी लॉट पर टैप करें।`,
    mr: `आपल्याकडे एकूण ${count} भंगार लॉट्स नोंदवलेले आहेत, त्यापैकी ${activeCount} सक्रिय आहेत. पिकअप स्थिती, क्यूआर कोड किंवा पावती पाहण्यासाठी कोणत्याही लॉटवर टॅप करा.`,
  }),

  earnings: (total: number, kg: number, count: number): LocalizedAudioText => ({
    en: `Earnings summary: You have earned ₹${total.toLocaleString()} across ${count} completed lots, formalizing ${kg} kilograms of scrap with instant digital payment.`,
    ta: `வருமான விவரம்: ${count} தொகுப்புகளில் ${kg} கிலோ கழிவுகளை முறைப்படுத்தி, உடனடி டிஜிட்டல் பரிவர்த்தனை மூலம் மொத்தம் ₹${total.toLocaleString()} ஈட்டியுள்ளீர்கள்.`,
    hi: `कमाई का विवरण: आपने ${count} पूरे हुए लॉट में ${kg} किलो कबाड़ का निपटान कर सीधे डिजिटल भुगतान के माध्यम से ₹${total.toLocaleString()} कमाए हैं।`,
    mr: `कमाईचा तपशील: आपण ${count} पूर्ण झालेल्या लॉट्समध्ये ${kg} किलो भंगाराची अधिकृत विक्री करून त्वरित डिजिटल पेमेंटद्वारे ₹${total.toLocaleString()} मिळवले आहेत.`,
  }),

  recyclerDirectory: (count: number): LocalizedAudioText => ({
    en: `Directory of ${count} authorized recycling facilities. Filter by accepted scrap categories and doorstep pickup availability.`,
    ta: `${count} அங்கீகரிக்கப்பட்ட மறுசுழற்சி மையங்களின் வழிகாட்டி. ஏற்றுக்கொள்ளப்படும் கழிவு வகைகள் மற்றும் பிக்-அப் வசதியின்படி வடிகட்டவும்.`,
    hi: `${count} अधिकृत रीसाइक्लिंग केंद्रों की निर्देशिका। स्वीकार्य कबाड़ सामग्री और डोरस्टेप पिकअप के अनुसार फ़िल्टर करें।`,
    mr: `${count} अधिकृत रीसायकलिंग केंद्रांची यादी. स्वीकारल्या जाणाऱ्या साहित्यानुसार आणि पिकअप सुविधेनुसार शोधा.`,
  }),

  safetyAssistant: {
    en: 'Collector safety advisory. Always wear protective gloves and boots when handling e-waste. Never burn cables or open lithium batteries. Direct toxic scrap to authorized recyclers for safe processing.',
    ta: 'சேகரிப்பாளர் பாதுகாப்பு வழிகாட்டுதல். மின்னணுக் கழிவுகளைக் கையாளும் போது எப்போதும் தடிமனான கையுறைகள் மற்றும் காலணிகளை அணியுங்கள். கேபிள்களை ஒருபோதும் எரிக்காதீர்கள் அல்லது லித்தியம் பேட்டரிகளைத் திறக்காதீர்கள். பாதுகாப்பான மறுசுழற்சிக்கு அங்கீகரிக்கப்பட்ட மையங்களுக்கு அனுப்புங்கள்.',
    hi: 'कलेक्टर सुरक्षा सलाह। ई-कचरा संभालते समय हमेशा सुरक्षा दस्ताने और जूते पहनें। कभी भी तारों को न जलाएं और न ही लिथियम बैटरी को तोड़ें। सुरक्षित रीसाइक्लिंग के लिए अधिकृत केंद्रों को ही कबाड़ दें।',
    mr: 'संकलक सुरक्षा मार्गदर्शक. ई-कचरा हाताळताना नेहमी सुरक्षित हातमोजे आणि बूट वापरा. कधीही केबल्स जाळू नका किंवा लिथियम बॅटऱ्या फोडू नका. सुरक्षित प्रक्रियेसाठी अधिकृत खरेदीदारांनाच भंगार द्या.',
  },

  impactDashboard: (formalizedKg: number, co2SavedKg: number, incomeUplift: number): LocalizedAudioText => ({
    en: `Impact metrics: ${formalizedKg} kilograms of scrap formalized, preventing ${co2SavedKg} kilograms of carbon emissions, and delivering ₹${incomeUplift.toLocaleString()} in direct income uplift.`,
    ta: `சமூக மற்றும் சுற்றுச்சூழல் தாக்கம்: ${formalizedKg} கிலோ கழிவுகள் முறைப்படுத்தப்பட்டு, ${co2SavedKg} கிலோ கார்பன் உமிழ்வு தடுக்கப்பட்டுள்ளது, மேலும் சேகரிப்பாளர்களுக்கு ₹${incomeUplift.toLocaleString()} கூடுதல் நேரடி வருமானம் கிடைத்துள்ளது.`,
    hi: `सामाजिक एवं पर्यावरणीय प्रभाव: ${formalizedKg} किलो कबाड़ को औपचारिक रूप दिया गया, ${co2SavedKg} किलो कार्बन उत्सर्जन रोका गया, और कलेक्टर्स को ₹${incomeUplift.toLocaleString()} की अतिरिक्त प्रत्यक्ष आय हुई।`,
    mr: `सामाजिक व पर्यावरणीय प्रभाव: ${formalizedKg} किलो भंगाराची अधिकृत नोंद झाली, ${co2SavedKg} किलो कार्बन उत्सर्जन रोखले, आणि वेचकांना ₹${incomeUplift.toLocaleString()} ची अतिरिक्त थेट कमाई झाली.`,
  }),

  recyclerPortal: {
    en: 'Recycler facility management portal. Review incoming collector scrap lots, verify weighbridge readings, and trigger instant digital payouts.',
    ta: 'மறுசுழற்சி மைய நிர்வாக போர்ட்டல். சேகரிப்பாளர்களிடமிருந்து வரும் கழிவுத் தொகுப்புகளை மதிப்பாய்வு செய்யவும், எடை மேடை அளவீடுகளைச் சரிபார்க்கவும், உடனடி டிஜிட்டல் தொகையை வழங்கவும்.',
    hi: 'रीसाइक्लर केंद्र प्रबंधन पोर्टल। आने वाले कबाड़ लॉट की समीक्षा करें, धर्मकांटा वजन सत्यापित करें, और तत्काल डिजिटल भुगतान करें।',
    mr: 'रीसायकलर केंद्र व्यवस्थापन पोर्टल. संकलकांकडून येणाऱ्या भंगार लॉट्सची पाहणी करा, वजनकाटा नोंद तपासा आणि तत्काळ डिजिटल पेमेंट करा.',
  },
};
