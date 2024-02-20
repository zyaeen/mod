export let anchorMnemonicList : string[] = []
export let attributeMnemonicList : string[] = []
export let knotMnemonicList : string[] = []

export const createAnchorMnemonic = () => {
  let mnemonic = createMnemonic(2);
  while (anchorMnemonicList.indexOf(mnemonic) != -1){
    mnemonic = createMnemonic(2);
  }
  return mnemonic;
}

const createMnemonic = (length: number) => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const createAttributeMnemonic = () => {
  let mnemonic = createMnemonic(3);
  while (attributeMnemonicList.indexOf(mnemonic) != -1){
    mnemonic = createMnemonic(3);
  }
  return mnemonic;
}

export const createKnotMnemonic = () => {
  let mnemonic = createMnemonic(3);
  while (knotMnemonicList.indexOf(mnemonic) != -1){
    mnemonic = createMnemonic(3);
  }
  return mnemonic;
}