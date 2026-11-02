import { pack } from "./pack";

export const portugueseLessons = pack("pt", [
  { grade: "k", title: "Primeiras letras", focus: "a s d f j k l", assist: true, text: "asa fada sala dada fala lala" },
  { grade: "3", title: "Palavras curtas", focus: "palavras", assist: true, text: "a casa é azul. o sol sai. a mãe lava a xícara." },
  { grade: "5", title: "Uma frase", focus: "frases", assist: true, text: "O gato olha a lua. A menina lê um livro curto. O pão está na mesa." },
  { grade: "7", title: "Pontuação", focus: "vírgula e ponto", text: "Espera, a porta está aberta? Sim. Traz o mapa, o lápis e o caderno." },
  { grade: "9", title: "Um parágrafo", focus: "parágrafo", text: "A biblioteca cheira a papel e a chuva. Na mesa grande há uma lâmpada baixa. Alguém escreve devagar, como se cada palavra precisasse merecer o seu lugar." },
  { grade: "adult", title: "Um recado", focus: "trabalho", text: "Li o rascunho hoje de manhã. O segundo parágrafo fica mais claro se começarmos pelo dado e não pela opinião. Envio a versão curta antes das três. Se uma frase continuar frouxa, marca-a e eu ajusto." },
]);
