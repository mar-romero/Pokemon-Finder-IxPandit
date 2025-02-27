declare global {
    let fetchAllPokemon: jest.Mock | (() => Promise<{ name: string; url: string }[]>);
  }
  
  export {};