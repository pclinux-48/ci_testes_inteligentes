export type TestUser = {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
};

export function createUniqueUser(): TestUser {
  const id = Date.now().toString();

  return {
    name: `Aluno ${id}`,
    email: `aluno.${id}@example.com`,
    password: process.env.DEFAULT_PASSWORD ?? 'Teste@123',
    firstName: 'Paulo',
    lastName: 'Cesar',
    company: 'UFPI',
    address: 'Rua dos Testes, 100',
    country: 'Canada',
    state: 'Piaui',
    city: 'Teresina',
    zipcode: '64000000',
    mobileNumber: '86999999999',
  };
}
