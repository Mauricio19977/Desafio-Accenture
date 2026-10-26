import { faker, fakerPT_BR } from '@faker-js/faker';

const MESES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MATERIAS = [
  'Maths', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'Commerce', 'Accounting', 'Economics', 'Arts', 'Social Studies', 'History', 'Civics', 'Hindi',
];

const HOBBIES = ['Sports', 'Reading', 'Music'];

const ESTADOS_CIDADES = {
  NCR: ['Delhi', 'Gurgaon', 'Noida'],
  'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
  Haryana: ['Karnal', 'Panipat'],
  Rajasthan: ['Jaipur', 'Jaiselmer'],
};

/** Remove acentos e caracteres não alfabéticos (ex.: "João D'Ávila" → "JoaoDAvila"). */
const somenteLetras = (texto) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z]/g, '');

const gerarEmail = (nome, sobrenome) =>
  `${somenteLetras(nome)}.${somenteLetras(sobrenome)}.${faker.string.alphanumeric(5)}@teste.com`.toLowerCase();

/**
 * Credenciais aceitas pela API: a senha precisa de 8+ caracteres com
 * maiúscula, minúscula, dígito e caractere especial.
 */
export const gerarCredenciais = () => ({
  userName: `qa_${faker.internet.username().replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`,
  password: `Qa@${faker.string.alphanumeric(6)}${faker.number.int({ min: 10, max: 99 })}a`,
});

/** Dados aleatórios para o Practice Form, já no formato exibido no popup de confirmação. */
export const gerarAluno = () => {
  const nome = somenteLetras(fakerPT_BR.person.firstName());
  const sobrenome = somenteLetras(fakerPT_BR.person.lastName());
  const nascimento = faker.date.birthdate({ mode: 'age', min: 18, max: 60 });
  const estado = faker.helpers.objectKey(ESTADOS_CIDADES);

  return {
    nome,
    sobrenome,
    email: gerarEmail(nome, sobrenome),
    genero: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
    celular: faker.string.numeric({ length: 10, allowLeadingZeros: false }),
    nascimento: {
      dia: nascimento.getDate(),
      mes: nascimento.getMonth(),
      ano: nascimento.getFullYear(),
    },
    materias: faker.helpers.arrayElements(MATERIAS, { min: 1, max: 3 }),
    // Mantém a ordem da tela, que é a ordem em que o popup lista os hobbies
    hobbies: faker.helpers
      .arrayElements(HOBBIES, { min: 1, max: 3 })
      .sort((a, b) => HOBBIES.indexOf(a) - HOBBIES.indexOf(b)),
    endereco: fakerPT_BR.location.streetAddress({ useFullAddress: true }),
    estado,
    cidade: faker.helpers.arrayElement(ESTADOS_CIDADES[estado]),
  };
};

const doisDigitos = (n) => String(n).padStart(2, '0');

/** Data no formato do campo Date of Birth, ex.: "05 Mar 1990". */
export const formatarDataCampo = ({ dia, mes, ano }) => `${doisDigitos(dia)} ${MESES[mes].slice(0, 3)} ${ano}`;

/** Data no formato do popup do Practice Form, ex.: "05 March,1990". */
export const formatarDataPopup = ({ dia, mes, ano }) => `${doisDigitos(dia)} ${MESES[mes]},${ano}`;

/** Registro aleatório para a Web Table. */
export const gerarRegistroTabela = () => {
  const nome = somenteLetras(fakerPT_BR.person.firstName());
  const sobrenome = somenteLetras(fakerPT_BR.person.lastName());

  return {
    nome,
    sobrenome,
    email: gerarEmail(nome, sobrenome),
    idade: String(faker.number.int({ min: 18, max: 70 })),
    salario: String(faker.number.int({ min: 1500, max: 30000 })),
    departamento: faker.helpers.arrayElement(['QA', 'Engineering', 'Finance', 'Legal', 'Marketing', 'Sales']),
  };
};
