import { pack } from "./pack";

export const spanishLessons = pack("es", [
  { grade: "k", title: "Primeras letras", focus: "a s d f j k l", assist: true, text: "asa faja dada sala lala fala" },
  { grade: "3", title: "Palabras cortas", focus: "palabras", assist: true, text: "la casa es azul. el sol sale. mama lava la taza." },
  { grade: "5", title: "Una frase", focus: "frases", assist: true, text: "El gato mira la luna. La niña lee un libro corto. El pan está en la mesa." },
  { grade: "7", title: "Puntuación", focus: "coma y punto", text: "Espera, ¿está abierta la puerta? Sí. Trae el mapa, el lápiz y el cuaderno." },
  { grade: "9", title: "Un párrafo", focus: "párrafo", text: "La biblioteca huele a papel y a lluvia. En la mesa grande hay una lámpara baja. Alguien escribe despacio, como si cada palabra tuviera que merecer su lugar." },
  { grade: "adult", title: "Una nota", focus: "trabajo", text: "Revisé el borrador esta mañana. El segundo párrafo está más claro si empezamos por el dato y no por la opinión. Te envío la versión corta antes de las tres. Si una frase sigue floja, márcala y la ajusto." },
]);
