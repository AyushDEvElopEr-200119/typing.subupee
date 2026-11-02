import { getLesson } from "./curriculum";
import type { Lesson } from "./curriculum/types";
import { getTestMode, type TestMode } from "./tests";
import type { CurriculumId } from "./curriculum/types";
import { REGIONAL_DRILLS, REGIONAL_SHORT, REGIONAL_STORIES } from "./curriculum/indic";

export type Passage = { title: string; text: string };
export type PassageLang = Exclude<CurriculumId, "classic">;

/** The passage language for a curriculum: the English tracks share one bank. */
export function passageLang(curriculum: CurriculumId): PassageLang {
  return curriculum === "classic" ? "en" : curriculum;
}

const STORIES: Record<PassageLang, Passage[]> = {
  en: [
    {
      title: "The late ferry",
      text: "The last ferry left the dock with its cabin lights already on. A rope slipped into the water and was pulled back up, dripping. On deck, people held the rail and watched the town shrink to a line of windows. Someone found an apple in a bag and offered half without looking away from the wake.",
    },
    {
      title: "Rain on the library",
      text: "Rain began as a soft tick on the high windows and then became a steady sound. Inside, the reading room kept its own weather. A student turned a page, paused, and copied one sentence into a notebook. The pencil was short. The sentence was not. When the rain eased, nobody hurried to leave.",
    },
    {
      title: "Saturday hardware",
      text: "The hardware store smelled like rope and orange soap. A clerk counted screws into a paper bag and folded the top twice. Outside, a boy waited with a red wagon. The bag went in, then a coil of twine, then a small bell that rang once when the wagon moved. They walked home counting the rings.",
    },
    {
      title: "The kitchen clock",
      text: "The kitchen clock was three minutes fast, which everyone in the house had agreed to ignore. Bread cooled on a rack. A note on the counter said the soup only needed salt and a little more time. Someone added the salt, tasted, and turned the flame down until the pot was quiet.",
    },
    {
      title: "Along the river",
      text: "The path along the river was still wet from the night. Reeds clicked when the wind crossed them. Two walkers stopped to watch a heron lift, fold its neck, and choose another bend. They did not speak until the bird was gone, as if the quiet had been borrowed and ought to be returned.",
    },
    {
      title: "The night press",
      text: "The print shop kept one light on over the press. Ink sat in a tin with a thin skin across the top. The printer stirred it, rolled a test line, and held the paper up to the bulb. One letter was too heavy. She wiped the plate, rolled the line again, and smiled when the stroke came out even.",
    },
    {
      title: "A museum hour",
      text: "In the museum a marble hand rested on a marble knee, and the bench across from it was taken by a tired man with a paper map. He folded the map the wrong way, then the right way, and stayed to look at the hand a little longer. The room hummed with a vent somewhere out of sight.",
    },
    {
      title: "First rehearsal",
      text: "The rehearsal room had a piano with one stuck key and a window that did not quite close. They started the song too fast, laughed, and started again at the pace of a walk. By the third try the stuck key had become part of the rhythm, a small gap they all remembered to leave.",
    },
    {
      title: "The office plant",
      text: "The office plant had grown toward the window so steadily that its pot now sat on a book to keep the leaves out of the blind. A new person asked if the plant had a name. Nobody could remember agreeing on one, so they tried a few, laughed, and went back to work with the question still open.",
    },
    {
      title: "Winter bus",
      text: "The bus doors opened onto a breath of warm air and wet wool. Passengers shifted bags onto laps to make one more seat. Outside, the stop sign ticked in the wind. A child drew a square on the fogged glass, then a smaller square inside it, and watched both of them fade as the bus turned.",
    },
    {
      title: "Before the street wakes",
      text: "Before the street was awake, the bakery had already decided the morning. Trays slid onto racks. A timer rang and was silenced with a knuckle. The first customer asked for the same loaf as yesterday, and the baker was glad to have one thing that did not need to be invented again.",
    },
    {
      title: "A letter home",
      text: "She wrote the letter in short lines so it would be easy to read later, then remembered it was going on paper and slowed down. The second paragraph named the weather. The third named a joke from the kitchen. The last line was only this: come when you can, the light is good in the evening.",
    },
  ],
  es: [
    {
      title: "La biblioteca",
      text: "La biblioteca huele a papel y a lluvia. En la mesa grande hay una lámpara baja y un cuaderno abierto. Alguien escribe despacio, como si cada palabra tuviera que merecer su lugar. Afuera pasa un autobús. Adentro, la página sigue en calma.",
    },
    {
      title: "El mercado",
      text: "El mercado abre temprano y ya huele a pan y a naranja. Una señora cuenta monedas con cuidado. Un niño elige dos manzanas y las pone en una bolsa de papel. Nadie corre. El día empieza cuando la primera caja se llena.",
    },
    {
      title: "El tren de la tarde",
      text: "El tren llega un minuto tarde y nadie se sorprende. Las maletas descansan junto a los zapatos. Cuando se abren las puertas, el aire del andén entra fresco. Una viajera guarda el libro sin marcar la página, porque ya sabe dónde se quedó.",
    },
    {
      title: "La carta",
      text: "Escribió la carta con frases cortas para que fuera fácil de leer. Habló del tiempo, de la sopa de la noche y de la luz de la cocina. Al final solo puso: ven cuando puedas. La mesa queda libre por la tarde.",
    },
    {
      title: "El taller",
      text: "En el taller huele a madera y a polvo tibio. Mides dos veces y cortas una. Las virutas caen en un cajón junto a la puerta. Alguien barre, y el suelo parece recién decidido. El trabajo de hoy cabe en una hora atenta.",
    },
    {
      title: "Lluvia en la calle",
      text: "La lluvia empieza suave y luego se queda. Las tiendas encienden luces más cálidas que el cielo. Dos amigos comparan una frase que los dos querían terminar, y se ríen al ver que escribieron el mismo verbo. Siguen caminando sin apuro.",
    },
  ],
  pt: [
    {
      title: "A biblioteca",
      text: "A biblioteca cheira a papel e a chuva. Na mesa grande há uma lâmpada baixa e um caderno aberto. Alguém escreve devagar, como se cada palavra precisasse merecer o seu lugar. Lá fora passa um autocarro. Cá dentro, a página continua calma.",
    },
    {
      title: "O mercado",
      text: "O mercado abre cedo e já cheira a pão e a laranja. Uma senhora conta as moedas com cuidado. Uma criança escolhe duas maçãs e põe-nas num saco de papel. Ninguém corre. O dia começa quando a primeira caixa fica cheia.",
    },
    {
      title: "O comboio da tarde",
      text: "O comboio chega um minuto atrasado e ninguém se espanta. As malas descansam junto aos sapatos. Quando as portas abrem, o ar da plataforma entra fresco. Uma viajante guarda o livro sem marcar a página, porque já sabe onde ficou.",
    },
    {
      title: "A carta",
      text: "Escreveu a carta em frases curtas para ser fácil de ler. Falou do tempo, da sopa da noite e da luz da cozinha. No fim só pôs: vem quando puderes. A mesa fica livre ao fim da tarde.",
    },
    {
      title: "A oficina",
      text: "Na oficina cheira a madeira e a pó morno. Mede-se duas vezes e corta-se uma. As aparas caem numa caixa junto à porta. Alguém varre, e o chão parece recém-decidido. O trabalho de hoje cabe numa hora atenta.",
    },
    {
      title: "Chuva na rua",
      text: "A chuva começa mansa e depois fica. As lojas acendem luzes mais quentes do que o céu. Dois amigos comparam uma frase que os dois queriam acabar, e riem ao ver que escreveram o mesmo verbo. Seguem sem pressa.",
    },
  ],
  hi: [
    { title: "आखिरी नाव", text: "आखिरी नाव शाम को घाट से निकली। उसकी बत्तियाँ पहले से जल रही थीं। लोग रेलिंग पकड़कर खड़े थे और शहर को धीरे-धीरे छोटा होते देख रहे थे। किसी ने थैले से एक सेब निकाला और आधा बाँट दिया।" },
    { title: "पुस्तकालय में बारिश", text: "बारिश ऊँची खिड़कियों पर हल्की टिक-टिक से शुरू हुई और फिर एक लगातार आवाज़ बन गई। अंदर पढ़ने का कमरा शांत रहा। एक छात्र ने पन्ना पलटा, रुका, और एक वाक्य अपनी कॉपी में उतार लिया।" },
    { title: "रसोई की घड़ी", text: "रसोई की घड़ी तीन मिनट आगे चलती थी, और घर में सबने इसे अनदेखा करना तय कर लिया था। रोटियाँ ठंडी हो रही थीं। मेज पर एक पर्ची थी कि दाल में बस नमक और थोड़ा समय चाहिए।" },
    { title: "नदी के किनारे", text: "नदी के किनारे का रास्ता रात की ओस से अब भी गीला था। हवा चलती तो सरकंडे खड़खड़ाते। दो राहगीर एक बगुले को उड़ते देखने के लिए रुके और तब तक चुप रहे जब तक वह दूसरे मोड़ पर नहीं उतर गया।" },
    { title: "शनिवार का बाज़ार", text: "शनिवार को बाज़ार में रस्सी और साबुन की महक थी। दुकानदार ने कीलें गिनकर एक कागज़ की थैली में डालीं और ऊपर से दो बार मोड़ दिया। बाहर एक लड़का अपनी लाल गाड़ी लिए इंतज़ार कर रहा था।" },
  ],
  ...REGIONAL_STORIES,
};

const SHORT: Record<Exclude<PassageLang, "en">, Passage[]> = {
  es: [
    { title: "El gato", text: "El gato mira la luna. La niña lee un libro corto. El pan está en la mesa." },
    { title: "La casa", text: "La casa es azul. El sol sale por la ventana. Mamá lava la taza con cuidado." },
    { title: "El parque", text: "El perro corre en el parque. Una pelota rueda por la hierba. El niño la alcanza y se ríe." },
    { title: "Día de lluvia", text: "Hoy llueve un poco. Llevamos un paraguas rojo. La calle brilla bajo la luz." },
    { title: "La clase", text: "La maestra escribe en la pizarra. Copiamos la frase. Luego leemos en voz baja." },
    { title: "La sopa", text: "En la cocina hay sopa. Huele a tomate y a pan. Comemos despacio y sin prisa." },
  ],
  pt: [
    { title: "O gato", text: "O gato olha a lua. A menina lê um livro curto. O pão está na mesa." },
    { title: "A casa", text: "A casa é azul. O sol entra pela janela. A mãe lava a xícara com cuidado." },
    { title: "O parque", text: "O cão corre no parque. Uma bola rola na relva. A criança apanha-a e ri." },
    { title: "Dia de chuva", text: "Hoje chove um pouco. Levamos um guarda-chuva vermelho. A rua brilha sob a luz." },
    { title: "A aula", text: "A professora escreve no quadro. Copiamos a frase. Depois lemos em voz baixa." },
    { title: "A sopa", text: "Na cozinha há sopa. Cheira a tomate e a pão. Comemos devagar e sem pressa." },
  ],
  hi: [
    { title: "बिल्ली", text: "बिल्ली चाँद को देखती है। लड़की एक छोटी किताब पढ़ती है। रोटी मेज पर है।" },
    { title: "घर", text: "घर का रंग नीला है। खिड़की से धूप आती है। माँ ध्यान से कप धोती है।" },
    { title: "बगीचा", text: "कुत्ता बगीचे में दौड़ता है। एक गेंद घास पर लुढ़कती है। बच्चा उसे पकड़कर हँसता है।" },
    { title: "बारिश का दिन", text: "आज थोड़ी बारिश हो रही है। हम लाल छाता ले जाते हैं। रोशनी में सड़क चमकती है।" },
    { title: "कक्षा", text: "शिक्षिका बोर्ड पर लिखती हैं। हम वाक्य उतारते हैं। फिर धीमी आवाज़ में पढ़ते हैं।" },
    { title: "खाना", text: "रसोई में दाल बनी है। उसमें टमाटर और रोटी की खुशबू है। हम आराम से खाते हैं।" },
  ],
  ...REGIONAL_SHORT,
};

const DRILL_LINES: Record<string, string[]> = {
  "hi-k-1": [
    "कर पर तप रट चट कप पेट रेत चोर तोप रोक टिक चुप रुक तुक",
    "पेट रेत कर पर चोर तोप तप रट रोक टिक चट कप चुप रुक तुक",
    "तुक रुक चुप टिक रोक तोप चोर रेत पेट कप चट रट तप पर कर",
    "चोर रोक तोप कर रेत पर टिक तप चुप रट पेट चट कप तुक रुक",
  ],
  "hi-1-1": [
    "दादा बाग जाग गाजर हीरा पापा राजा जादू बाजू चाचा",
    "राजा बाग जादू दादा हीरा जाग चाचा गाजर पापा बाजू",
    "बाजू पापा गाजर चाचा जाग हीरा दादा जादू बाग राजा",
    "हीरा राजा दादा बाजू जाग गाजर बाग चाचा पापा जादू",
  ],
  "en-k-1": [
    "fff jjj fjf jfj fj fj ff jj",
    "jjj fff jfj fjf jj ff jf fj",
    "fj fj ff jj jjj fff fjf jfj",
    "ff jj fjf jfj jf fj fff jjj",
  ],
  "en-k-2": [
    "fff jjj ddd kkk fj dk kd jf",
    "kkk ddd jjj fff kd dk fj jf",
    "fj dk kd jf dd kk jj ff",
    "dk fj jf kd kk dd fff jjj",
  ],
  "en-k-3": [
    "a sad lad; a dad; a flask; all fall",
    "all fall; a flask; a sad dad; a lad",
    "a dad asks; all lads fall; a flask",
    "all lads ask a sad dad; a flask falls",
  ],
  "en-1-1": [
    "ask a dad; a salad; a flask; all lads fall",
    "all lads fall; a flask; ask a dad; a salad",
    "a salad; all fall; a sad lad asks dad",
    "dad asks a lass; a flask falls; all lads ask",
  ],
  "en-1-2": [
    "a lass has a salad. dad asks a lad. all fall as a flask falls.",
    "dad has a flask. a lass asks a lad. all salads fall.",
    "all lads ask dad. a sad lass has a salad. a flask falls.",
    "a lad asks a lass. dad has all salads. a flask falls as all fall.",
  ],
  "en-1-3": [
    "flash a salad. a sad lad asks dad. all lads ask as a flask falls.",
    "dad asks all lads. a flask falls. flash a sad salad.",
    "a sad dad has a flask. all lads flash a salad as a flask falls.",
    "ask dad. flash all salads. a lad falls as a sad flask falls.",
  ],
  "en-2-1": [
    "see a kite. a kid is sad. dad sees a leaf. I see a field.",
    "I see a kite. dad is sad. a kid sees a leaf. see a field.",
    "a leaf is a kite. I see dad. a sad kid sees a field.",
    "dad sees a kid. I see a sad leaf. a field is a kite.",
  ],
  "en-2-2": [
    "the kid is kind. I like a salad. dad sees a lake. a leaf is still.",
    "I like the lake. a kind kid sees a leaf. dad is still. the salad is a salad.",
    "dad likes the kid. I see a still lake. a leaf is kind.",
    "the lake is still. I like a leaf. a kind dad sees the kid.",
  ],
  "en-2-3": [
    "I see a kid at the lake. dad likes the field. a leaf falls as I ask.",
    "dad sees a kid at the field. I like the lake. a leaf falls.",
    "a kid asks dad at the lake. I see a leaf fall. the field is still.",
    "I ask dad. the kid likes the lake. a leaf falls at the field.",
  ],
  "en-3-1": [
    "the red kite is in the air. a kid runs. I use a ruler.",
    "I see a red kite in the air. the kid runs. use a ruler.",
    "a kid uses the red ruler. the kite is in the air. I run.",
    "the ruler is red. I run in the air. a kid sees the kite.",
  ],
  "en-3-2": [
    "A red bird sits in a tree. It is still. I hear a rustle. The bird flies free.",
    "The bird is still in a tree. I hear a red rustle. It flies free.",
    "I sit still. A bird hears the tree. The red bird flies free.",
    "A tree is still. I hear the bird. It flies free in the red air.",
  ],
  "en-3-3": [
    "Run to the river. Use a firm stride. The current is quiet under the trees.",
    "The river is quiet. Run under the trees. Use a firm stride.",
    "The river is quiet under the trees. Run to it. Use a firm stride.",
    "Use a firm stride to the river. The current is quiet. Run under the trees.",
  ],
  "en-4-1": [
    "we write quite well. you type a quiet quote. we try to type true.",
    "you type quite true. we write a quiet quote. we try to type well.",
    "a quiet quote we type true. we try to write well. you type quite true.",
    "we type well. you write a true quote. we try a quiet type.",
  ],
  "en-4-2": [
    "We write our report in a quiet room. You type each word with care. We try to keep a steady pace.",
    "You type our report with care. We keep a quiet pace. We write each word in the room.",
    "We write each word in a quiet room. You keep a steady pace. We type with care.",
    "We keep each word quiet. You write the report. We try a steady pace with care.",
  ],
  "en-4-3": [
    "Why do you write? What do you want to say? Type the idea, then the sentence, then the period.",
    "What do you want to write? Type the idea, then the sentence. Why say it twice?",
    "Type the idea. Then type the sentence. What do you want the period to say?",
    "Type what you want to say. Write the idea, then the sentence, then the period.",
  ],
  "en-5-1": [
    "can you mix a calm verb? move the box. zoom in on the number.",
    "move the box. can you zoom in on a calm number? mix a verb.",
    "zoom in on the box. mix a calm verb. can you move the number?",
    "a calm verb can move the box. zoom in on the number. you mix it.",
  ],
  "en-5-2": [
    "Mix the colors in the box. Move the number beside the name. Zoom in only when the line is clear.",
    "Move the name beside the number. Mix the colors when the line is clear. Zoom in on the box.",
    "Zoom in on the name. Move the colors beside the box. Mix the line when it is clear.",
    "Zoom in only when the name is clear. Mix the number in the box. Move the line.",
  ],
  "en-5-3": [
    "The quick brown fox never lived here, but the sentence still trains every letter. Type it once, then type a line of your own pace.",
    "Type a line of your own pace. The quick brown fox never lived here, but every letter still trains the sentence.",
    "The sentence trains every letter. Type the quick brown fox once, then type a line at your own pace.",
    "Type the quick brown fox once. The sentence never lived here, but every letter still trains your pace.",
  ],
  "en-6-1": [
    "Maya Chen lives in Austin. Her class visits the River Museum on Friday.",
    "Friday Maya Chen visits the River Museum. Her class lives in Austin.",
    "Her class visits Maya Chen in Austin. River Museum is the Friday visit.",
    "Austin is her class home. Maya Chen visits the River Museum on Friday.",
  ],
  "en-6-2": [
    "On Monday, Jordan and Priya walk to North Hall. Mr. Alvarez meets them at the door.",
    "Mr. Alvarez meets Jordan and Priya at North Hall on Monday. Jordan and Priya walk to the door.",
    "Priya and Jordan walk to the door. Monday Mr. Alvarez meets them at North Hall.",
    "North Hall is the Monday walk. Jordan meets Priya and Mr. Alvarez at the door.",
  ],
  "en-6-3": [
    "Field Notes. The Lake Trail is open. Bring a pencil, a bottle of water, and a quiet pair of shoes.",
    "The Lake Trail is open. Bring a quiet pair of shoes, a pencil, and a bottle of water. Field Notes.",
    "Bring a bottle of water and a pencil. The Lake Trail is open. Field Notes list a quiet pair of shoes.",
    "Field Notes list the Lake Trail as open. Bring shoes, a pencil, and a bottle of water.",
  ],
  "es-k-1": [
    "asa faja dada sala lala fala",
    "fala sala dada faja lala asa",
    "dada lala asa fala faja sala",
    "sala fala lala asa dada faja",
  ],
  "pt-k-1": [
    "asa fada sala dada fala lala",
    "fala dada sala fada lala asa",
    "lala asa dada fala sala fada",
    "dada sala fala asa fada lala",
  ],
};

const KEY_LINES: Record<string, string[]> = {
  "keys-home": [
    "fff jjj ddd kkk sss lll aaa ;;; fjf jfj dk dk sl sl a; a; a sad lad asks; a flask falls; all lads fall as dad asks a lass",
    "a sad lad asks a lass; all lads fall; a flask falls; fjf jfj dk dk sl sl aaa sss ddd fff jjj kkk lll ;;;",
    "dad asks a lass; a flask falls as all lads fall; a sad lad asks; aaa ;;; sss lll ddd kkk fff jjj",
    "all fall as a sad flask falls; a lad asks dad; fj dk sl a; jfj kkk lll sss aaa ddd fff jjj ;;;",
  ],
  "keys-top": [
    "qqq www eee rrr ttt yyy uuu iii ooo ppp qw er ty ui op we write quite well; you type a quiet quote; we try to type true",
    "we try to type true; you write a quiet quote; we type quite well; qqq www eee rrr ttt yyy uuu iii ooo ppp",
    "a quiet quote we write quite well; you try to type true; ppp ooo iii uuu yyy ttt rrr eee www qqq",
    "you type quite true; we write a quiet quote; we try to type well; qw er ty ui op qqq ppp",
  ],
  "keys-bottom": [
    "zzz xxx ccc vvv bbb nnn mmm zx cv bn m, can you mix a calm verb; move the box; zoom in on the number",
    "zoom in on the number; move the box; can you mix a calm verb; zzz xxx ccc vvv bbb nnn mmm",
    "mix a calm verb; can you move the box; zoom in on the number; mmm nnn bbb vvv ccc xxx zzz",
    "the number can move; mix a calm verb; zoom in on the box; zx cv bn m, zzz mmm",
  ],
  "keys-common": [
    "the thin theme then there their other ether three fresh shirts shrink when the weather shifts; she sees these sheets",
    "she sees these sheets; when the weather shifts the fresh shirts shrink; there their other ether three",
    "three fresh shirts shrink when she sees the weather shift; the thin theme then there",
    "these sheets shrink when the weather shifts; she sees their other theme; the thin ether three",
  ],
};

function unique(lines: string[]) {
  return [...new Set(lines.map((line) => line.replace(/\s+/g, " ").trim()))];
}

function storyBank(lesson: Lesson): Passage[] {
  if (lesson.curriculum !== "en" && lesson.curriculum !== "classic") {
    const lang = lesson.curriculum;
    if (lesson.grade === "3" || lesson.grade === "5") return SHORT[lang];
    return STORIES[lang];
  }
  return STORIES.en;
}

export function choicesForLesson(lesson: Lesson): Passage[] {
  const drills = DRILL_LINES[lesson.id] ?? REGIONAL_DRILLS[lesson.id];
  if (drills) return unique(drills).map((text) => ({ title: "", text }));
  const own = { title: lesson.title, text: lesson.text };
  const rest = storyBank(lesson).filter((item) => item.text !== lesson.text);
  return [own, ...rest];
}

export function choicesForTest(mode: TestMode, lang: PassageLang): Passage[] {
  if (mode.group === "Keys") {
    return unique(KEY_LINES[mode.slug] ?? []).map((text) => ({ title: "", text }));
  }
  const stories = STORIES[lang];
  if (mode.pages) {
    return stories.map((_, offset) => ({
      title: stories[offset].title,
      text: Array.from({ length: mode.pages ?? 1 }, (_, index) => stories[(offset + index) % stories.length].text).join(" "),
    }));
  }
  return stories.map((_, offset) => {
    const ordered = [...stories.slice(offset), ...stories.slice(0, offset)];
    return {
      title: ordered[0]?.title ?? "",
      text: `${ordered.map((item) => item.text).join(" ")} ${ordered.map((item) => item.text).join(" ")}`,
    };
  });
}

export function auditPassages() {
  const errors: string[] = [];
  for (const [id, lines] of Object.entries(DRILL_LINES)) {
    const lesson = getLesson(id);
    if (!lesson) {
      errors.push(`missing lesson ${id}`);
      continue;
    }
    const allowed = new Set(lesson.text);
    const clean = unique(lines);
    if (clean.length < 2) errors.push(`${id} needs more than one line`);
    for (const line of clean) {
      for (const char of line) {
        if (!allowed.has(char)) errors.push(`${id} illegal ${JSON.stringify(char)}`);
      }
    }
  }
  for (const [slug, lines] of Object.entries(KEY_LINES)) {
    const allowed = new Set(lines[0] ?? "");
    if (unique(lines).length < 2) errors.push(`${slug} needs more than one line`);
    for (const line of lines) {
      for (const char of line) {
        if (!allowed.has(char)) errors.push(`${slug} illegal ${JSON.stringify(char)}`);
      }
    }
  }
  for (const lang of Object.keys(STORIES) as PassageLang[]) {
    const titles = new Set<string>();
    for (const story of STORIES[lang]) {
      if (titles.has(story.title)) errors.push(`duplicate ${lang} title ${story.title}`);
      titles.add(story.title);
      if (story.text.length < 80) errors.push(`${lang} ${story.title} is short`);
    }
  }
  for (const lessonId of ["en-8-1", "classic-adult-1", "es-9-1", "pt-adult-1", "es-3-1", "pt-5-1"]) {
    const lesson = getLesson(lessonId);
    if (!lesson) errors.push(`missing ${lessonId}`);
    else if (choicesForLesson(lesson).length < 4) errors.push(`${lessonId} has too few passages`);
  }
  const timed = getTestMode("1-min");
  const page = getTestMode("page-3");
  if (!timed || choicesForTest(timed, "en").length < 4) errors.push("timed passages");
  if (!page || choicesForTest(page, "es").length < 4) errors.push("page passages");
  return errors;
}
