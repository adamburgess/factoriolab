import fs from 'fs';

import { ModData } from '~/models';
import * as D from './factorio.models';
import { getJsonData } from './helpers';

/**
 * This script is intended to prep a Factorio dump for a specific mod set by
 * updating the mod-list.json file with the list of mods the existing data set.
 */

const mod = process.argv[2];
if (!mod) {
  throw new Error(
    'Please specify a mod to process by the folder name, e.g. "1.1" for src/data/1.1'
  );
}

// Set up paths
const appDataPath = process.env['AppData'];
const factorioPath = `${appDataPath}/Factorio`;
const modsPath = `${factorioPath}/mods`;
const modListPath = `${modsPath}/mod-list.json`;
const modPath = `./src/data/${mod}`;
const modDataPath = `${modPath}/data.json`;

async function dumpPrep(): Promise<void> {
  // Read mod data
  const modList = getJsonData<D.ModList>(modListPath);
  const data = getJsonData<ModData>(modDataPath);

  Object.keys(data.version).forEach((key) => {
    const mod = modList.mods.find((m) => m.name === key);
    if (mod == null) {
      throw `Mod ${key} not found, may need to be installed`;
    }
  });

  modList.mods.forEach((m) => {
    m.enabled = data.version[m.name] != null;
  });

  fs.writeFileSync(modListPath, JSON.stringify(modList));

  console.log(
    `Enabled mods: ${modList.mods
      .filter((m) => m.enabled)
      .map((m) => m.name)
      .join(', ')}`
  );
}

dumpPrep();
