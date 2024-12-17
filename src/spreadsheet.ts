import { simpleGit } from 'simple-git'

interface Cell {}

interface Sheet {
  name: Cell
  signals: Map<string, Cell>
  // add more ihere if needed
}

export const createSheetFromDir = async (path: string): Promise<Sheet> => {
  //implement me
}
